"use client";

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any | null; // Used if we are editing an existing announcement
}

export default function AnnouncementModal({ isOpen, onClose, onSave, initialData }: AnnouncementModalProps) {
  // State for form fields
  const [formData, setFormData] = useState({
    title: '',
    priority: 'Normal',
    audience: 'Admin,Manager,Employee',
    message: '',
  });

  // When the modal opens, check if we are editing (initialData exists) or adding new
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        priority: initialData.priority,
        audience: initialData.audience,
        message: initialData.message,
      });
    } else {
      setFormData({
        title: '',
        priority: 'Normal',
        audience: 'Admin,Manager,Employee',
        message: '',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-xl relative max-h-[90vh] overflow-y-auto">
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {initialData ? 'Edit Announcement' : 'New Announcement'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">Broadcast an update to the team</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800 transition-colors p-2 bg-gray-50 rounded-full">
            <X size={20} />
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Subject / Title</label>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Office Holiday Notice" 
              className="w-full px-4 py-3.5 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 text-gray-900 outline-none text-sm" 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Priority</label>
              <select 
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 text-gray-900 outline-none appearance-none cursor-pointer text-sm"
              >
                <option value="Normal">Normal</option>
                <option value="Important">Important</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Target Audience</label>
              <select 
                name="audience"
                value={formData.audience}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 text-gray-900 outline-none appearance-none cursor-pointer text-sm"
              >
                <option value="Admin,Manager,Employee">Everyone</option>
                <option value="Admin,Manager">Managers & Admins</option>
                <option value="Employee">Employees Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Message</label>
            <textarea 
              rows={5} 
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Type your announcement here..." 
              className="w-full px-4 py-3.5 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 text-gray-900 outline-none resize-none text-sm" 
              required
            ></textarea>
          </div>

          <div className="flex gap-3 mt-8">
            <button type="button" onClick={onClose} className="flex-1 py-3.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm">Cancel</button>
            <button type="submit" className="flex-1 py-3.5 bg-[#1a1a1a] text-white font-semibold rounded-xl hover:bg-black transition-colors text-sm">
              {initialData ? 'Save Changes' : 'Post Announcement'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}