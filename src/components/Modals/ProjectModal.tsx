"use client";

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { API_BASE, authHeaders } from '../../lib/api';

interface UiProject {
  id: string;
  title: string;
  priority: string;
  status: string;
  description: string;
}

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: UiProject | null;
  onSuccess: () => void;
}

interface UserOption { _id: string; name: string; }

export default function ProjectModal({ isOpen, onClose, project, onSuccess }: ProjectModalProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('normal priority');
  const [status, setStatus] = useState('Active');
  const [overview, setOverview] = useState('');
  // Several employees can be selected up front, so this is a set of ids
  // rather than the single assignee it used to be.
  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!project;

  useEffect(() => {
    if (!isOpen) return;
    if (project) {
      setTitle(project.title);
      setPriority(project.priority);
      setStatus(project.status);
      setOverview(project.description);
    } else {
      setTitle('');
      setPriority('normal priority');
      setStatus('Active');
      setOverview('');
      setAssigneeIds([]);
    }
    setError(null);

    fetch(`${API_BASE}/api/admin/users?status=Active`, { headers: authHeaders() })
      .then(r => r.json())
      .then(data => { if (data.success) setUsers(data.data.filter((u: any) => u.role !== 'Admin')); })
      .catch(() => {});
  }, [isOpen, project]);

  const toggleAssignee = (id: string) =>
    setAssigneeIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const body: any = { title, priority, status, overview };
    // Only seed the team when creating. On edit, updateProject replaces the
    // whole array, so sending one assignee here would silently unassign every
    // other member — team membership is managed in the project details panel.
    if (!isEdit && assigneeIds.length) {
      body.team = assigneeIds.map(id => ({ user: id, role: 'Team Member' }));
    }

    try {
      const url = isEdit ? `${API_BASE}/api/projects/${project!.id}` : `${API_BASE}/api/projects`;
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: authHeaders(),
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data.success) { setError(data.message || 'Failed to save project'); return; }
      onSuccess();
    } catch (e: any) {
      setError(e.message || 'Network error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-xl relative max-h-[90vh] overflow-y-auto">

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{isEdit ? 'Edit Project' : 'Create New Project'}</h2>
            <p className="text-sm text-gray-500 mt-1">{isEdit ? 'Update project details' : 'Assign teams and set deadlines'}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800 transition-colors p-2 bg-gray-50 rounded-full">
            <X size={20} />
          </button>
        </div>

        {error && <p className="text-sm text-red-500 mb-4 bg-red-50 p-3 rounded-xl">{error}</p>}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Project Name</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Q1 Marketing Campaign"
              className="w-full px-4 py-3.5 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 text-gray-900 outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
                className="w-full px-4 py-3.5 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 text-gray-900 outline-none appearance-none cursor-pointer"
              >
                <option value="normal priority">Normal</option>
                <option value="high priority">High Priority</option>
                <option value="low priority">Low Priority</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full px-4 py-3.5 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 text-gray-900 outline-none appearance-none cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Creation only. Once a project exists, members are added and
              removed from the Team Allocation panel in project details. */}
          {!isEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Assign Employees
                {assigneeIds.length > 0 && (
                  <span className="ml-2 text-xs font-normal text-gray-500">{assigneeIds.length} selected</span>
                )}
              </label>

              {/* Checkbox list rather than a select, so several people can be
                  assigned in one go when the project is created. */}
              <div className="scroll-area max-h-44 overflow-y-auto bg-[#f3f4f6] rounded-xl p-1">
                {users.length === 0 && (
                  <p className="text-sm text-gray-400 px-3 py-3">Loading employees...</p>
                )}
                {users.map(u => (
                  <label
                    key={u._id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={assigneeIds.includes(u._id)}
                      onChange={() => toggleAssignee(u._id)}
                      className="w-4 h-4 accent-black cursor-pointer"
                    />
                    <span className="text-sm text-gray-900">{u.name}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1.5">Members can also be added or removed after the project is created.</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
            <textarea
              rows={3}
              value={overview}
              onChange={e => setOverview(e.target.value)}
              placeholder="Project goals and details..."
              className="w-full px-4 py-3.5 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 text-gray-900 outline-none resize-none"
            />
          </div>

          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3.5 bg-[#1a1a1a] text-white font-semibold rounded-xl hover:bg-black transition-colors disabled:opacity-60"
            >
              {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
