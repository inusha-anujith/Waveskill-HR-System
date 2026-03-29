"use client";

import React from 'react';
import { X, Mail, Phone, Briefcase, Calendar, Building, Hash, MapPin } from 'lucide-react';

interface EmployeeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: any | null;
}

export default function EmployeeDetailsModal({ isOpen, onClose, employee }: EmployeeDetailsModalProps) {
  if (!isOpen || !employee) return null;

  // Helper function to render the correct role badge styling
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Admin': return <span className="bg-[#1a1a1a] text-white text-xs font-medium px-3 py-1 rounded-full">Admin</span>;
      case 'Manager': return <span className="bg-gray-200 text-gray-800 text-xs font-medium px-3 py-1 rounded-full">Manager</span>;
      case 'Employee': return <span className="bg-white border border-gray-200 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">Employee</span>;
      default: return <span>{role}</span>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-xl relative max-h-[90vh] overflow-y-auto overflow-x-hidden">
        
        {/* Banner section */}
        <div className="h-32 bg-[#f0f4f8] rounded-t-3xl relative">
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 text-gray-500 hover:text-gray-900 bg-white/80 hover:bg-white p-2 rounded-full transition-colors shadow-sm"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-8 pb-8">
          
          {/* Avatar and Name Header (Fixed Flex Layout) */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-12 mb-8 relative z-10">
            {/* Avatar overlapping the banner */}
            <div className="w-24 h-24 rounded-full bg-blue-700 text-white flex items-center justify-center text-4xl font-bold border-4 border-white shadow-sm shrink-0">
              {employee.name.charAt(0)}
            </div>
            
            {/* Name and Badges */}
            <div className="flex-1 pb-1 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{employee.name}</h2>
                <p className="text-gray-500 font-medium mt-0.5">{employee.position || 'Staff Member'}</p>
              </div>
              <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2">
                {getRoleBadge(employee.role)}
                <span className="text-[11px] font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-md border border-green-100">
                  ● {employee.status}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Contact Details</h3>
              
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-8 h-8 shrink-0 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                  <Mail size={16} />
                </div>
                <span className="truncate">{employee.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-8 h-8 shrink-0 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                  <Phone size={16} />
                </div>
                {employee.phone}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-8 h-8 shrink-0 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                  <MapPin size={16} />
                </div>
                <span className="truncate">{employee.location}</span>
              </div>
            </div>

            {/* Employment Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Employment Info</h3>
              
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-8 h-8 shrink-0 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                  <Building size={16} />
                </div>
                Department: <span className="font-medium text-gray-900">{employee.department}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-8 h-8 shrink-0 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                  <Hash size={16} />
                </div>
                Employee ID: <span className="font-medium text-gray-900">{employee.empId}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-8 h-8 shrink-0 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                  <Calendar size={16} />
                </div>
                Joined: <span className="font-medium text-gray-900">{employee.joinDate}</span>
              </div>
            </div>
          </div>

          {/* Quick HR Stats */}
          <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Leave Balance</p>
              <p className="text-xl font-bold text-gray-900">{employee.leaveBalance} Days</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Attendance Rate</p>
              <p className="text-xl font-bold text-green-600">{employee.attendance}%</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Active Projects</p>
              <p className="text-xl font-bold text-blue-600">{employee.projects}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}