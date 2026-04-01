"use client";

import React from 'react';
import { X, Calendar, Clock, FileText, CheckCircle, XCircle } from 'lucide-react';

interface LeaveActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: any | null;
  onUpdateStatus: (id: number, newStatus: string) => void;
}

export default function LeaveActionModal({ isOpen, onClose, request, onUpdateStatus }: LeaveActionModalProps) {
  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Review Leave Request</h2>
            <p className="text-sm text-gray-500 mt-1">Review details and take action</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800 transition-colors p-2 bg-gray-50 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Request Details */}
        <div className="space-y-5 bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8">
          
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <div>
              <p className="text-xs text-gray-500 mb-1">Employee</p>
              <p className="text-base font-semibold text-gray-900">{request.employee}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">Leave Type</p>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                request.type === 'Sick' ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'
              }`}>
                {request.type}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Calendar size={14}/> Duration</p>
              <p className="text-sm font-medium text-gray-900">{request.duration}</p>
              <p className="text-xs text-gray-500 mt-0.5">({request.days})</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Clock size={14}/> Applied On</p>
              <p className="text-sm font-medium text-gray-900">{request.appliedDate}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2 flex items-center gap-1"><FileText size={14}/> Reason</p>
            <p className="text-sm text-gray-700 bg-white p-3 rounded-xl border border-gray-200">
              {request.reason || "No specific reason provided by the employee."}
            </p>
          </div>
          
        </div>

        {/* Action Buttons (Only show if pending) */}
        {request.status === 'Pending' ? (
          <div className="flex gap-3 mt-4">
            <button 
              onClick={() => { onUpdateStatus(request.id, 'Rejected'); onClose(); }}
              className="flex-1 py-3.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <XCircle size={18} /> Reject
            </button>
            <button 
              onClick={() => { onUpdateStatus(request.id, 'Approved'); onClose(); }}
              className="flex-1 py-3.5 bg-[#1a1a1a] text-white hover:bg-black font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle size={18} /> Approve
            </button>
          </div>
        ) : (
          <div className="text-center p-4 bg-gray-100 rounded-xl text-sm font-medium text-gray-600">
            This request has already been {request.status.toLowerCase()}.
          </div>
        )}

      </div>
    </div>
  );
}