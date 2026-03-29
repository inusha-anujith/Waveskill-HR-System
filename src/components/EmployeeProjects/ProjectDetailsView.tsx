"use client";

import React, { useState, useEffect } from 'react';
import { X, Calendar, AlignLeft, CheckSquare, CheckCircle2, Circle } from 'lucide-react';

interface ProjectDetailsViewProps {
  project: any;
  onClose: () => void;
  onRefresh: () => void;
}

export default function ProjectDetailsView({ project, onClose, onRefresh }: ProjectDetailsViewProps) {
  const [localProgress, setLocalProgress] = useState(project.progress || 0);
  const [localStatus, setLocalStatus] = useState(project.status || 'Active');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setLocalProgress(project.progress || 0);
    setLocalStatus(project.status || 'Active');
  }, [project]);

  if (!project) return null;

  // Save Progress or Project Status
  const handleSaveProjectDetails = async () => {
    setIsUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5001/api/projects/${project._id}`, {
        method: 'PUT',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ progress: Number(localProgress), status: localStatus })
      });

      if (res.ok) {
        onRefresh(); 
      } else {
        alert("Failed to update project.");
      }
    } catch (error) {
      console.error("Error updating project:", error);
    }
    setIsUpdating(false);
  };

  // NEW LOGIC: Instantly change the task status based on the exact dropdown selection
  const handleTaskStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5001/api/projects/${project._id}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        onRefresh(); // Refresh the UI to immediately move the task and change its color!
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try { return new Date(dateString).toLocaleDateString(); } catch (e) { return dateString; }
  };

  // Grouping tasks from the backend for the UI
  const tasks = project.tasks || [];
  const todoTasks = tasks.filter((t: any) => t.status === 'To Do');
  const inProgressTasks = tasks.filter((t: any) => t.status === 'In Progress');
  const completedTasks = tasks.filter((t: any) => t.status === 'Done');

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h2>
          <div className="flex items-center gap-3">
            <span className="bg-black text-white text-xs font-medium px-3 py-1.5 rounded-md">
              {project.status}
            </span>
            <span className={`text-xs font-medium px-3 py-1.5 rounded-md ${
              project.priority === 'high priority' ? 'bg-red-200 text-red-600' : 'bg-gray-100 text-gray-600'
            }`}>
              {project.priority}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-gray-500 ml-2">
              <Calendar size={16} /> Due: {formatDate(project.dueDate)}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Description & Tasks */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <AlignLeft size={20} className="text-gray-500" />
              Project Overview
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
              {project.overview || "No description provided."}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <CheckSquare size={20} className="text-gray-500" />
              My Tasks
            </h3>
            
            <div className="space-y-3">
              
              {/* To Do Tasks */}
              {todoTasks.map((task: any) => (
                <div key={task._id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors">
                  <Circle size={20} className="text-gray-300" />
                  <span className="text-sm text-gray-700 flex-1">{task.title}</span>
                  {/* Selectable Dropdown instead of a static badge */}
                  <select 
                    value={task.status}
                    onChange={(e) => handleTaskStatusChange(task._id, e.target.value)}
                    className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md outline-none cursor-pointer border border-transparent hover:border-gray-300 font-medium"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              ))}

              {/* In Progress Tasks */}
              {inProgressTasks.map((task: any) => (
                <div key={task._id} className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                  <Circle size={20} className="text-blue-600 fill-blue-100" />
                  <span className="text-sm text-blue-900 font-medium flex-1">{task.title}</span>
                  {/* Selectable Dropdown */}
                  <select 
                    value={task.status}
                    onChange={(e) => handleTaskStatusChange(task._id, e.target.value)}
                    className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md outline-none cursor-pointer border border-transparent hover:border-blue-300 font-medium"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              ))}

              {/* Completed Tasks */}
              {completedTasks.map((task: any) => (
                <div key={task._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 opacity-80">
                  <CheckCircle2 size={20} className="text-green-500" />
                  <span className="text-sm text-gray-500 line-through flex-1">{task.title}</span>
                  {/* Selectable Dropdown */}
                  <select 
                    value={task.status}
                    onChange={(e) => handleTaskStatusChange(task._id, e.target.value)}
                    className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md outline-none cursor-pointer border border-transparent hover:border-green-300 font-medium"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              ))}

              {tasks.length === 0 && (
                 <p className="text-sm text-gray-500 italic">No tasks assigned yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Update Status & Progress */}
        <div className="space-y-6">
          
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Update Progress</h3>
            
            <div className="flex justify-between text-xs mb-2">
              <span className="text-gray-500 font-medium">Current Progress</span>
              <span className="text-gray-900 font-bold">{localProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div className="bg-black h-2 rounded-full transition-all duration-500" style={{ width: `${localProgress}%` }}></div>
            </div>

            <label className="block text-xs font-medium text-gray-500 mb-2">Set New Progress</label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={localProgress}
              onChange={(e) => setLocalProgress(Number(e.target.value))} 
              className="w-full mb-4 accent-black cursor-pointer"
            />

            <button 
              onClick={handleSaveProjectDetails}
              disabled={isUpdating}
              className="w-full bg-[#1a1a1a] hover:bg-black text-white text-sm font-medium py-2.5 rounded-lg transition-colors disabled:opacity-70"
            >
              {isUpdating ? "Saving..." : "Save Progress"}
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Project Status</h3>
            
            <select 
              value={localStatus}
              onChange={(e) => setLocalStatus(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#f3f4f6] border-transparent rounded-lg focus:ring-2 focus:ring-gray-200 text-sm text-gray-900 outline-none appearance-none cursor-pointer mb-4"
            >
              <option value="Active">Active</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
            </select>

            <button 
              onClick={handleSaveProjectDetails}
              disabled={isUpdating}
              className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium py-2.5 rounded-lg transition-colors disabled:opacity-70"
            >
              {isUpdating ? "Updating..." : "Update Status"}
            </button>
          </div>

          {/* Team Members */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">My Team</h3>
            <div className="flex flex-col gap-3">
              {project.team && project.team.length > 0 ? (
                project.team.map((member: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs font-semibold">
                      {member.user?.name ? member.user.name.charAt(0) : 'U'}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">{member.user?.name || 'Unknown User'}</span>
                      <span className="text-xs text-gray-500">{member.role || 'Member'}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">No team members assigned.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}