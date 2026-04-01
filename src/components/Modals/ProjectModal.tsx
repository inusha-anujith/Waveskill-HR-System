"use client";

import React from 'react';
import { X } from 'lucide-react';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ isOpen, onClose }: ProjectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-xl relative max-h-[90vh] overflow-y-auto">
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Create New Project</h2>
            <p className="text-sm text-gray-500 mt-1">Assign teams and set deadlines</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800 transition-colors p-2 bg-gray-50 rounded-full">
            <X size={20} />
          </button>
        </div>

        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
          
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Project Name</label>
            <input type="text" placeholder="e.g. Q1 Marketing Campaign" className="w-full px-4 py-3.5 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 text-gray-900 outline-none" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Priority</label>
              <select className="w-full px-4 py-3.5 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 text-gray-900 outline-none appearance-none cursor-pointer">
                <option value="normal">Normal</option>
                <option value="high">High Priority</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Status</label>
              <select className="w-full px-4 py-3.5 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 text-gray-900 outline-none appearance-none cursor-pointer">
                <option value="active">Active</option>
                <option value="planning">Planning</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Assign Employees</label>
            <select className="w-full px-4 py-3.5 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 text-gray-900 outline-none appearance-none cursor-pointer">
              <option value="disabled selected" >Select employee...</option>
              <option value="1">John Doe</option>
              <option value="2">Jane Smith</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
            <textarea rows={3} placeholder="Project goals and details..." className="w-full px-4 py-3.5 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 text-gray-900 outline-none resize-none"></textarea>
          </div>

          <div className="flex gap-3 mt-8">
            <button type="button" onClick={onClose} className="flex-1 py-3.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 py-3.5 bg-[#1a1a1a] text-white font-semibold rounded-xl hover:bg-black transition-colors">Create Project</button>
          </div>
        </form>

      </div>
    </div>
  );
}