"use client";

import React from 'react';
import { X, Calendar } from 'lucide-react';

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplyLeaveModal({ isOpen, onClose }: ApplyLeaveModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Apply for Leave</h2>
            <p className="text-sm text-gray-500 mt-1">Submit a new time-off request</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800 transition-colors p-2 bg-gray-50 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onClose(); alert('Leave Applied!'); }}>
          
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Leave Type</label>
            <select className="w-full px-4 py-3.5 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 text-gray-900 outline-none appearance-none cursor-pointer">
              <option value="disabled selected">Select leave type</option>
              <option value="sick">Sick Leave</option>
              <option value="vacation">Vacation / Annual Leave</option>
              <option value="unpaid">Unpaid Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Start Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Calendar size={18} className="text-gray-400" />
                </div>
                <input type="date" className="w-full pl-11 pr-4 py-3.5 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 text-gray-900 outline-none" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">End Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Calendar size={18} className="text-gray-400" />
                </div>
                <input type="date" className="w-full pl-11 pr-4 py-3.5 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 text-gray-900 outline-none" required />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Reason for Leave</label>
            <textarea 
              rows={4} 
              placeholder="Please provide a brief reason..."
              className="w-full px-4 py-3.5 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 text-gray-900 outline-none resize-none"
              required
            ></textarea>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8">
            <button type="button" onClick={onClose} className="flex-1 py-3.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-3.5 bg-[#1a1a1a] text-white font-semibold rounded-xl hover:bg-black transition-colors">
              Submit Request
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}