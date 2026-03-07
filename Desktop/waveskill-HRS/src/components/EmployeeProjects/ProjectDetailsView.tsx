"use client";

import React from 'react';
import { X, Calendar, AlignLeft, CheckSquare, Clock, CheckCircle2, Circle } from 'lucide-react';

interface ProjectDetailsViewProps {
  project: any;
  onClose: () => void;
}

export default function ProjectDetailsView({ project, onClose }: ProjectDetailsViewProps) {
  if (!project) return null;

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
            <span className="bg-red-200 text-red-600 text-xs font-medium px-3 py-1.5 rounded-md">
              {project.priority}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-gray-500 ml-2">
              <Calendar size={16} /> Due: {project.dueDate}
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

          {/* Task Board */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <CheckSquare size={20} className="text-gray-500" />
              My Tasks
            </h3>
            
            <div className="space-y-3">
              {/* To Do Tasks */}
              {project.tasks.todo.map((task: string, idx: number) => (
                <div key={`todo-${idx}`} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors group cursor-pointer">
                  <Circle size={20} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
                  <span className="text-sm text-gray-700">{task}</span>
                  <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-md flex items-center gap-1">
                    <Clock size={12} /> To Do
                  </span>
                </div>
              ))}

              {/* In Progress Tasks */}
              {project.tasks.inProgress.map((task: string, idx: number) => (
                <div key={`ip-${idx}`} className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100 cursor-pointer">
                  <Circle size={20} className="text-blue-600 fill-blue-100" />
                  <span className="text-sm text-blue-900 font-medium">{task}</span>
                  <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md">
                    In Progress
                  </span>
                </div>
              ))}

              {/* Completed Tasks */}
              {project.tasks.completed.map((task: string, idx: number) => (
                <div key={`done-${idx}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 opacity-60">
                  <CheckCircle2 size={20} className="text-green-500" />
                  <span className="text-sm text-gray-500 line-through">{task}</span>
                  <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md">
                    Done
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Update Status & Progress */}
        <div className="space-y-6">
          
          {/* Update Progress Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Update Progress</h3>
            
            <div className="flex justify-between text-xs mb-2">
              <span className="text-gray-500 font-medium">Current Progress</span>
              <span className="text-gray-900 font-bold">{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div className="bg-black h-2 rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }}></div>
            </div>

            <label className="block text-xs font-medium text-gray-500 mb-2">Set New Progress</label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              defaultValue={project.progress} 
              className="w-full mb-4 accent-black"
            />

            <button className="w-full bg-[#1a1a1a] hover:bg-black text-white text-sm font-medium py-2.5 rounded-lg transition-colors">
              Save Progress
            </button>
          </div>

          {/* Update Status Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Project Status</h3>
            
            <select className="w-full px-4 py-2.5 bg-[#f3f4f6] border-transparent rounded-lg focus:ring-2 focus:ring-gray-200 text-sm text-gray-900 outline-none appearance-none cursor-pointer mb-4">
              <option value="active" selected>Active</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>

            <button className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium py-2.5 rounded-lg transition-colors">
              Update Status
            </button>
          </div>

          {/* Team Members */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">My Team</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs font-semibold">J</div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">John Doe (You)</span>
                  <span className="text-xs text-gray-500">Frontend Developer</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-semibold">S</div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">Sarah Manager</span>
                  <span className="text-xs text-gray-500">Project Manager</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}