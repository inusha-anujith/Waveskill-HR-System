"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ManagerNavi from '../../../components/ManagerNavi/ManagerNavi';
import ManagerTabs from '../../../components/ManagerNavi/ManagerTabs';
import { FilePlus, FileText, UserCog, Trash2 } from 'lucide-react';
import ProjectModal from '../../../components/Modals/ProjectModal';
import ManagerProjectDetailsView from '../../../components/Modals/ManagerProjectDetailsView';
import ConfirmModal from '../../../components/Modals/ConfirmModal';
import { API_BASE, authHeaders, clearAuth, getStoredName } from '../../../lib/api';

export interface UiTeamMember {
  userId: string;
  name: string;
  photo?: string;
  role?: string;
}

export interface UiTask {
  id: string;
  title: string;
  status: 'To Do' | 'In Progress' | 'Done';
}

interface UiProject {
  id: string;
  title: string;
  status: string;
  priority: string;
  priorityColor: string;
  description: string;
  progress: number;
  startDate: string;
  assignee: string;
  assigneePhoto?: string;
  // The full team and the tasks with their ids. Without these the details view
  // could only ever show team[0] and had no id to act on a task.
  team: UiTeamMember[];
  taskItems: UiTask[];
  tasks: { todo: string[]; inProgress: string[]; completed: string[] };
}

const PRIORITY_COLORS: Record<string, string> = {
  'high priority': 'bg-red-100 text-red-500',
  'normal priority': 'bg-orange-100 text-orange-500',
  'low priority': 'bg-gray-100 text-gray-500',
};

const toUiProject = (p: any): UiProject => ({
  id: p._id,
  title: p.title,
  status: p.status,
  priority: p.priority || 'normal priority',
  priorityColor: PRIORITY_COLORS[p.priority] || 'bg-gray-100 text-gray-500',
  description: p.overview || '',
  progress: p.progress || 0,
  startDate: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '',
  assignee: p.team?.[0]?.user?.name || 'Unassigned',
  assigneePhoto: p.team?.[0]?.user?.profilePhoto || '',
  team: (p.team || [])
    // A member whose user was deleted populates as null — skip those rather
    // than rendering a blank row.
    .filter((m: any) => m?.user)
    .map((m: any) => ({
      userId: m.user._id,
      name: m.user.name,
      photo: m.user.profilePhoto || '',
      role: m.role || 'Team Member',
    })),
  taskItems: (p.tasks || []).map((t: any) => ({
    id: t._id,
    title: t.title,
    status: t.status || 'To Do',
  })),
  tasks: {
    todo: (p.tasks || []).filter((t: any) => t.status === 'To Do').map((t: any) => t.title),
    inProgress: (p.tasks || []).filter((t: any) => t.status === 'In Progress').map((t: any) => t.title),
    completed: (p.tasks || []).filter((t: any) => t.status === 'Done').map((t: any) => t.title),
  },
});

export default function ManagerProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<UiProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<UiProject | null>(null);
  const [editProject, setEditProject] = useState<UiProject | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [managerName, setManagerName] = useState('Manager');
  const detailsSectionRef = useRef<HTMLDivElement>(null);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/projects`, { headers: authHeaders() });
      if (res.status === 401 || res.status === 403) { router.push('/login'); return; }
      const data = await res.json();
      if (data.success) setProjects(data.data.map(toUiProject));
      else setError(data.message || 'Failed to load projects');
    } catch (e: any) {
      setError(e.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setManagerName(getStoredName() || 'Manager');
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    setDeletingId(pendingDeleteId);
    try {
      const res = await fetch(`${API_BASE}/api/projects/${pendingDeleteId}`, { method: 'DELETE', headers: authHeaders() });
      const data = await res.json();
      if (data.success) {
        setProjects(prev => prev.filter(p => p.id !== pendingDeleteId));
        if (selectedProject?.id === pendingDeleteId) setSelectedProject(null);
        setPendingDeleteId(null);
      } else {
        setError(data.message || 'Failed to delete project');
      }
    } catch (e: any) {
      setError(e.message || 'Network error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleProgressSave = async (id: string, progress: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/projects/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ progress }),
      });
      const data = await res.json();
      if (data.success) {
        setProjects(prev => prev.map(p => p.id === id ? { ...p, progress } : p));
        setSelectedProject(prev => prev?.id === id ? { ...prev, progress } : prev);
      }
    } catch (e: any) {
      setError(e.message || 'Network error');
    }
  };

  // Task and team mutations all return the updated project, so we re-map that
  // response straight into state — no optimistic guessing, and the open
  // details panel stays in sync with the list.
  const applyUpdated = (raw: any) => {
    const ui = toUiProject(raw);
    setProjects(prev => prev.map(p => (p.id === ui.id ? ui : p)));
    setSelectedProject(prev => (prev?.id === ui.id ? ui : prev));
  };

  const mutateProject = async (path: string, method: 'POST' | 'DELETE' | 'PATCH', body?: any) => {
    try {
      const res = await fetch(`${API_BASE}/api/projects/${path}`, {
        method,
        headers: authHeaders(),
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      const data = await res.json();
      if (!data.success) { setError(data.message || 'Action failed'); return false; }
      applyUpdated(data.data);
      setError(null);
      return true;
    } catch (e: any) {
      setError(e.message || 'Network error');
      return false;
    }
  };

  const handleAddTask = (projectId: string, title: string) =>
    mutateProject(`${projectId}/tasks`, 'POST', { title });

  const handleDeleteTask = (projectId: string, taskId: string) =>
    mutateProject(`${projectId}/tasks/${taskId}`, 'DELETE');

  const handleEditTask = (projectId: string, taskId: string, title: string) =>
    mutateProject(`${projectId}/tasks/${taskId}`, 'PATCH', { title });

  // Sends the whole selection in one request; the API skips anyone already
  // assigned rather than rejecting the batch.
  const handleAddMembers = (projectId: string, userIds: string[]) =>
    mutateProject(`${projectId}/team`, 'POST', { userIds });

  const handleRemoveMember = (projectId: string, userId: string) =>
    mutateProject(`${projectId}/team/${userId}`, 'DELETE');

  // Task status uses the pre-existing PUT route, which now populates too.
  const handleTaskStatus = async (projectId: string, taskId: string, status: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/projects/${projectId}/tasks/${taskId}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!data.success) { setError(data.message || 'Failed to update task'); return false; }
      applyUpdated(data.data);
      return true;
    } catch (e: any) {
      setError(e.message || 'Network error');
      return false;
    }
  };

  const handleProjectClick = (project: UiProject) => {
    setSelectedProject(project);
    setTimeout(() => {
      detailsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleLogout = () => { clearAuth(); router.push('/login'); };

  const modalOpen = isCreateModalOpen || !!editProject;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-10">
      <ManagerNavi managerName={managerName} role="manager" onLogout={handleLogout} />
      <ManagerTabs activeTab="Projects" />

      <main className="p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl p-4">{error}</div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 p-8 flex-1">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Project Allocation</h2>
              <p className="text-sm text-gray-500">Create and manage projects, assign employees. Click a project to view details.</p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-[#1a1a1a] hover:bg-black transition-colors text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium"
            >
              <FilePlus size={18} />
              New Project
            </button>
          </div>

          {loading ? (
            <p className="text-sm text-gray-400 text-center py-16">Loading projects...</p>
          ) : projects.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-16">No projects yet. Create your first one.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => handleProjectClick(project)}
                  className={`border rounded-2xl p-6 flex flex-col cursor-pointer transition-all duration-200 ${
                    selectedProject?.id === project.id
                      ? 'border-gray-900 shadow-md ring-1 ring-gray-900'
                      : 'border-gray-200 hover:border-gray-400 hover:shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">{project.title}</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditProject(project); }}
                        className="text-gray-500 hover:text-gray-800 border border-gray-200 hover:bg-gray-50 transition-colors p-2 rounded-lg"
                        title="Edit Project"
                      >
                        <FileText size={18} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setPendingDeleteId(project.id); }}
                        disabled={deletingId === project.id}
                        className="text-red-400 hover:text-red-600 border border-red-100 hover:bg-red-50 transition-colors p-2 rounded-lg disabled:opacity-50"
                        title="Delete Project"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-6">
                    <span className="bg-black text-white text-xs font-medium px-3 py-1 rounded-full">{project.status}</span>
                    <span className={`${project.priorityColor} text-xs font-medium px-3 py-1 rounded-full`}>{project.priority}</span>
                  </div>

                  <p className="text-sm text-gray-500 mb-8 line-clamp-2">{project.description}</p>

                  <div className="mb-6">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-gray-500">Progress</span>
                      <span className="text-gray-500">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-1.5">
                      <div className="bg-black h-1.5 rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }} />
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mb-6">Start Date: {project.startDate}</p>

                  <div className="flex items-center gap-3 text-sm text-gray-700 mt-auto">
                    <UserCog size={18} className="text-gray-500" strokeWidth={1.5} />
                    <span>{project.assignee}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div ref={detailsSectionRef}>
          {selectedProject && (
            <ManagerProjectDetailsView
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
              onProgressSave={(progress) => handleProgressSave(selectedProject.id, progress)}
              onAddTask={(title) => handleAddTask(selectedProject.id, title)}
              onDeleteTask={(taskId) => handleDeleteTask(selectedProject.id, taskId)}
              onTaskStatus={(taskId, status) => handleTaskStatus(selectedProject.id, taskId, status)}
              onEditTask={(taskId, title) => handleEditTask(selectedProject.id, taskId, title)}
              onAddMembers={(userIds) => handleAddMembers(selectedProject.id, userIds)}
              onRemoveMember={(userId) => handleRemoveMember(selectedProject.id, userId)}
            />
          )}
        </div>

      </main>

      <ProjectModal
        isOpen={modalOpen}
        project={editProject}
        onClose={() => { setIsCreateModalOpen(false); setEditProject(null); }}
        onSuccess={() => { setIsCreateModalOpen(false); setEditProject(null); fetchProjects(); }}
      />

      <ConfirmModal
        isOpen={!!pendingDeleteId}
        title="Delete project?"
        message={<>Delete <span className="font-semibold text-gray-900">{projects.find(p => p.id === pendingDeleteId)?.title}</span>? This action cannot be undone.</>}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        busy={!!deletingId}
        onClose={() => { if (!deletingId) setPendingDeleteId(null); }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
