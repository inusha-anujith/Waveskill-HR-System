"use client";

import React, { useEffect, useState } from 'react';
import { X, Calendar, AlignLeft, CheckSquare, CheckCircle2, Circle, Users, Settings, Trash2, UserPlus, Pencil, Check } from 'lucide-react';
import Avatar from '../Avatar/Avatar';
import { API_BASE, authHeaders } from '../../lib/api';

interface ManagerProjectDetailsViewProps {
  project: any;
  onClose: () => void;
  onProgressSave?: (progress: number) => void;
  onAddTask?: (title: string) => Promise<boolean> | void;
  onDeleteTask?: (taskId: string) => Promise<boolean> | void;
  onTaskStatus?: (taskId: string, status: string) => Promise<boolean> | void;
  onEditTask?: (taskId: string, title: string) => Promise<boolean> | void;
  onAddMembers?: (userIds: string[]) => Promise<boolean> | void;
  onRemoveMember?: (userId: string) => Promise<boolean> | void;
}

const TASK_STATUSES = ['To Do', 'In Progress', 'Done'] as const;

export default function ManagerProjectDetailsView({
  project,
  onClose,
  onProgressSave,
  onAddTask,
  onDeleteTask,
  onTaskStatus,
  onEditTask,
  onAddMembers,
  onRemoveMember,
}: ManagerProjectDetailsViewProps) {
  const [sliderProgress, setSliderProgress] = useState<number>(project.progress ?? 0);
  const [saving, setSaving] = useState(false);

  const [newTask, setNewTask] = useState('');
  const [addingTask, setAddingTask] = useState(false);
  const [showTaskInput, setShowTaskInput] = useState(false);
  const [busyTaskId, setBusyTaskId] = useState<string | null>(null);

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const [editingTeam, setEditingTeam] = useState(false);
  const [employees, setEmployees] = useState<{ _id: string; name: string; profilePhoto?: string }[]>([]);
  const [memberBusy, setMemberBusy] = useState<string | null>(null);
  // Ids ticked in the assign list, applied together on "Assign".
  const [pendingMemberIds, setPendingMemberIds] = useState<string[]>([]);
  const [assigning, setAssigning] = useState(false);

  // The progress slider is local state, so it must follow the project when a
  // mutation replaces the object (e.g. after adding a task).
  useEffect(() => { setSliderProgress(project?.progress ?? 0); }, [project?.id, project?.progress]);

  // Assignable employees, loaded only when the manager opens the team editor.
  useEffect(() => {
    if (!editingTeam || employees.length) return;
    fetch(`${API_BASE}/api/admin/users?status=Active`, { headers: authHeaders() })
      .then(r => r.json())
      .then(d => { if (d.success) setEmployees(d.data.filter((u: any) => u.role !== 'Admin')); })
      .catch(() => {});
  }, [editingTeam, employees.length]);

  if (!project) return null;

  const team = project.team ?? [];
  const taskItems = project.taskItems ?? [];
  const assignedIds = new Set(team.map((m: any) => m.userId));
  const assignable = employees.filter(u => !assignedIds.has(u._id));

  const handleSaveProgress = async () => {
    if (!onProgressSave) return;
    setSaving(true);
    await onProgressSave(sliderProgress);
    setSaving(false);
  };

  const submitTask = async () => {
    const title = newTask.trim();
    if (!title || !onAddTask) return;
    setAddingTask(true);
    const ok = await onAddTask(title);
    setAddingTask(false);
    if (ok !== false) { setNewTask(''); setShowTaskInput(false); }
  };

  // Clicking a task advances it through To Do -> In Progress -> Done -> To Do.
  const cycleStatus = async (task: any) => {
    if (!onTaskStatus) return;
    const next = TASK_STATUSES[(TASK_STATUSES.indexOf(task.status) + 1) % TASK_STATUSES.length];
    setBusyTaskId(task.id);
    await onTaskStatus(task.id, next);
    setBusyTaskId(null);
  };

  const removeTask = async (taskId: string) => {
    if (!onDeleteTask) return;
    setBusyTaskId(taskId);
    await onDeleteTask(taskId);
    setBusyTaskId(null);
  };

  const startEditTask = (task: any) => {
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
  };

  const saveTaskTitle = async () => {
    const title = editingTitle.trim();
    if (!editingTaskId || !onEditTask) return;
    // An unchanged or emptied title is treated as a cancel, not a save.
    const original = taskItems.find((t: any) => t.id === editingTaskId)?.title;
    if (!title || title === original) { setEditingTaskId(null); return; }

    setBusyTaskId(editingTaskId);
    const ok = await onEditTask(editingTaskId, title);
    setBusyTaskId(null);
    if (ok !== false) setEditingTaskId(null);
  };

  const toggleMember = (id: string) =>
    setPendingMemberIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const assignSelected = async () => {
    if (!pendingMemberIds.length || !onAddMembers) return;
    setAssigning(true);
    const ok = await onAddMembers(pendingMemberIds);
    setAssigning(false);
    if (ok !== false) setPendingMemberIds([]);
  };

  const unassignMember = async (userId: string) => {
    if (!onRemoveMember) return;
    setMemberBusy(userId);
    await onRemoveMember(userId);
    setMemberBusy(null);
  };

  const TASK_STYLES: Record<string, { row: string; badge: string; text: string }> = {
    'To Do': { row: 'border-gray-100 hover:bg-gray-50', badge: 'bg-gray-100 text-gray-500', text: 'text-gray-700' },
    'In Progress': { row: 'bg-blue-50/50 border-blue-100', badge: 'bg-blue-100 text-blue-700', text: 'text-blue-900 font-medium' },
    'Done': { row: 'bg-gray-50 border-gray-100', badge: 'bg-green-100 text-green-700', text: 'text-gray-500 line-through' },
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-sm">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-gray-900">{project.title}</h2>
            <button className="text-gray-400 hover:text-gray-800 transition-colors p-1" title="Project Settings">
              <Settings size={18} />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-black text-white text-xs font-medium px-3 py-1.5 rounded-full">
              {project.status}
            </span>
            <span className={`${project.priorityColor} text-xs font-medium px-3 py-1.5 rounded-full`}>
              {project.priority}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-gray-500 ml-2 border-l border-gray-200 pl-4">
              <Calendar size={16} /> Start: {project.startDate}
            </span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Description & Tasks (Takes up 2/3 space) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <AlignLeft size={20} className="text-gray-500" />
              Project Overview
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
              {project.description}
            </p>
          </div>

          {/* Task Board (Manager View) */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <CheckSquare size={20} className="text-gray-500" />
                Project Tasks
              </h3>
              <button
                onClick={() => setShowTaskInput(v => !v)}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                {showTaskInput ? 'Cancel' : '+ Add Task'}
              </button>
            </div>

            {showTaskInput && (
              <div className="flex gap-2 mb-4">
                <input
                  autoFocus
                  type="text"
                  value={newTask}
                  onChange={e => setNewTask(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); submitTask(); } }}
                  placeholder="Task title..."
                  className="flex-1 px-4 py-2.5 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 text-sm text-gray-900 outline-none"
                />
                <button
                  onClick={submitTask}
                  disabled={addingTask || !newTask.trim()}
                  className="px-5 py-2.5 bg-[#1a1a1a] hover:bg-black text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
                >
                  {addingTask ? 'Adding...' : 'Add'}
                </button>
              </div>
            )}

            {/* Tasks render from taskItems so each row carries its real id and
                can be advanced or deleted. */}
            <div className="space-y-3">
              {taskItems.map((task: any) => {
                const style = TASK_STYLES[task.status] ?? TASK_STYLES['To Do'];
                return (
                  <div
                    key={task.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-colors group ${style.row} ${busyTaskId === task.id ? 'opacity-50' : ''}`}
                  >
                    <button
                      onClick={() => cycleStatus(task)}
                      disabled={busyTaskId === task.id}
                      title="Click to advance status"
                      className="shrink-0"
                    >
                      {task.status === 'Done'
                        ? <CheckCircle2 size={20} className="text-green-500" />
                        : <Circle size={20} className={task.status === 'In Progress' ? 'text-blue-600 fill-blue-100' : 'text-gray-300 group-hover:text-blue-600 transition-colors'} />}
                    </button>

                    {editingTaskId === task.id ? (
                      <input
                        autoFocus
                        value={editingTitle}
                        onChange={e => setEditingTitle(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') { e.preventDefault(); saveTaskTitle(); }
                          if (e.key === 'Escape') setEditingTaskId(null);
                        }}
                        onBlur={saveTaskTitle}
                        className="flex-1 px-2 py-1 bg-white border border-gray-300 rounded-md text-sm text-gray-900 outline-none focus:ring-2 focus:ring-gray-200"
                      />
                    ) : (
                      <span className={`text-sm ${style.text}`}>{task.title}</span>
                    )}

                    <span className={`ml-auto text-xs px-2 py-1 rounded-md ${style.badge}`}>
                      {task.status}
                    </span>

                    {editingTaskId === task.id ? (
                      <button
                        onMouseDown={e => e.preventDefault()}   // keep onBlur from firing first
                        onClick={saveTaskTitle}
                        disabled={busyTaskId === task.id}
                        title="Save title"
                        className="text-gray-400 hover:text-green-600 transition-colors p-1"
                      >
                        <Check size={15} />
                      </button>
                    ) : (
                      <button
                        onClick={() => startEditTask(task)}
                        disabled={busyTaskId === task.id}
                        title="Rename task"
                        className="text-gray-300 hover:text-blue-600 transition-colors p-1"
                      >
                        <Pencil size={14} />
                      </button>
                    )}

                    <button
                      onClick={() => removeTask(task.id)}
                      disabled={busyTaskId === task.id}
                      title="Delete task"
                      className="text-gray-300 hover:text-red-600 transition-colors p-1"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                );
              })}

              {taskItems.length === 0 && !showTaskInput && (
                <p className="text-sm text-gray-400 text-center py-6 border border-dashed border-gray-200 rounded-xl">
                  No tasks yet. Use &ldquo;+ Add Task&rdquo; to create one.
                </p>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Update Status, Progress & Team */}
        <div className="space-y-6">
          
          {/* Update Progress Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Track Progress</h3>
            
            <div className="flex justify-between text-xs mb-2">
              <span className="text-gray-500 font-medium">Current Progress</span>
              <span className="text-gray-900 font-bold">{sliderProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div className="bg-black h-2 rounded-full transition-all duration-500" style={{ width: `${sliderProgress}%` }}></div>
            </div>

            <label className="block text-xs font-medium text-gray-500 mb-2">Adjust Project Progress</label>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderProgress}
              onChange={e => setSliderProgress(Number(e.target.value))}
              className="w-full mb-4 accent-black"
            />

            <button
              onClick={handleSaveProgress}
              disabled={saving}
              className="w-full bg-[#1a1a1a] hover:bg-black text-white text-sm font-medium py-2.5 rounded-lg transition-colors disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Progress'}
            </button>
          </div>

          {/* Team Allocation */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Users size={16} className="text-gray-500" /> Team Allocation
              </h3>
              <button
                onClick={() => setEditingTeam(v => !v)}
                className="text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                {editingTeam ? 'Done' : 'Edit'}
              </button>
            </div>

            {/* Renders the whole team. Previously only team[0] was shown, so
                other members were invisible and could not be unassigned. */}
            <div className="flex flex-col gap-1">
              {team.map((member: any, idx: number) => (
                <div
                  key={member.userId}
                  className={`flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors ${memberBusy === member.userId ? 'opacity-50' : ''}`}
                >
                  <Avatar name={member.name} photo={member.photo} size={32} />
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-gray-900 truncate">{member.name}</span>
                    <span className="text-xs text-gray-500">{idx === 0 ? 'Lead Assignee' : (member.role || 'Team Member')}</span>
                  </div>
                  {editingTeam && (
                    <button
                      onClick={() => unassignMember(member.userId)}
                      disabled={memberBusy === member.userId}
                      title={`Unassign ${member.name}`}
                      className="ml-auto text-gray-300 hover:text-red-600 transition-colors p-1 shrink-0"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}

              {team.length === 0 && (
                <p className="text-sm text-gray-400 py-3">No one assigned yet.</p>
              )}
            </div>

            {editingTeam && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <label className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1.5">
                  <UserPlus size={14} /> Assign employees
                  {pendingMemberIds.length > 0 && (
                    <span className="text-gray-400">· {pendingMemberIds.length} selected</span>
                  )}
                </label>

                {assignable.length === 0 ? (
                  <p className="text-sm text-gray-400 py-2">Everyone is already assigned.</p>
                ) : (
                  <>
                    {/* Checkbox list so a batch can be assigned in one request
                        instead of one member per round trip. */}
                    <div className="scroll-area max-h-40 overflow-y-auto bg-[#f3f4f6] rounded-lg p-1 mb-3">
                      {assignable.map(u => (
                        <label
                          key={u._id}
                          className="flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-white cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={pendingMemberIds.includes(u._id)}
                            onChange={() => toggleMember(u._id)}
                            className="w-4 h-4 accent-black cursor-pointer"
                          />
                          <Avatar name={u.name} photo={u.profilePhoto} size={24} />
                          <span className="text-sm text-gray-900 truncate">{u.name}</span>
                        </label>
                      ))}
                    </div>

                    <button
                      onClick={assignSelected}
                      disabled={assigning || pendingMemberIds.length === 0}
                      className="w-full bg-[#1a1a1a] hover:bg-black text-white text-sm font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {assigning
                        ? 'Assigning...'
                        : pendingMemberIds.length
                          ? `Assign ${pendingMemberIds.length} ${pendingMemberIds.length === 1 ? 'member' : 'members'}`
                          : 'Select employees to assign'}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}