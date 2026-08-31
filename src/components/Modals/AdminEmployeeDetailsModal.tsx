"use client";

import React, { useState } from 'react';
import { X, Mail, Phone, Briefcase, Calendar, Building, Hash, MapPin, Shield, DollarSign, Clock, Key, FileText, Heart } from 'lucide-react';
import { API_BASE, authHeaders } from '../../lib/api';
import { useToast } from '../Toast/ToastProvider';

interface AdminEmployeeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: any | null;
  onToggleStatus?: (id: string, action: 'deactivate' | 'reactivate') => void;
}

const CV_BADGE: Record<string, string> = {
  'Up to Date': 'text-green-600 bg-green-50 border-green-100',
  'Needs Update': 'text-red-600 bg-red-50 border-red-100',
  'Pending Review': 'text-yellow-700 bg-yellow-50 border-yellow-100',
};

export default function AdminEmployeeDetailsModal({ isOpen, onClose, employee, onToggleStatus }: AdminEmployeeDetailsModalProps) {
  const toast = useToast();
  const [cvLoading, setCvLoading] = useState(false);

  // The CV endpoint is token-protected, so a plain <a href> would 401.
  // Fetch it as a blob and open that instead.
  const viewCV = async () => {
    if (!employee) return;
    setCvLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${employee.id}/cv`, { headers: authHeaders() });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.message || 'Could not open this CV');
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener');
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch {
      toast.error('Network error while opening CV');
    } finally {
      setCvLoading(false);
    }
  };

  if (!isOpen || !employee) return null;

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
      {/* Flex column: the banner stays fixed and only the detail body scrolls,
          so the scrollbar never runs over the modal's rounded corners. */}
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-xl relative max-h-[90vh] flex flex-col overflow-hidden">

        {/* Fixed identity header: banner, avatar, name and badges. Keeping the
            avatar out of the scroll body avoids two problems — a negatively
            offset child gets clipped by overflow, and pinning it to the banner
            alone would let the body scroll underneath it. */}
        <div className="shrink-0">
          <div className="h-32 bg-slate-800 rounded-t-3xl relative">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 bg-white/10 hover:bg-white p-2 rounded-full transition-all shadow-sm"
            >
              <X size={20} />
            </button>

            <div className="absolute -bottom-12 left-8 w-24 h-24 rounded-full bg-blue-700 text-white flex items-center justify-center text-4xl font-bold border-4 border-white shadow-sm">
              {employee.name.charAt(0)}
            </div>
          </div>

          <div className="px-8 pt-16 pb-6 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{employee.name}</h2>
              <p className="text-gray-500 font-medium mt-1">{employee.position || 'Staff Member'}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              {getRoleBadge(employee.role)}
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border ${
                employee.status === 'Active'
                  ? 'text-green-600 bg-green-50 border-green-100'
                  : 'text-red-600 bg-red-50 border-red-100'
              }`}>
                ● {employee.status}
              </span>
            </div>
          </div>
        </div>

        <div className="scroll-area flex-1 overflow-y-auto overflow-x-hidden px-8 pb-8">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Personal & Employment (Takes up 2/3) */}
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2 border-b border-gray-100 pb-2">Contact Details</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-gray-50 flex items-center justify-center text-gray-400"><Mail size={16} /></div>
                    <span className="truncate">{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-gray-50 flex items-center justify-center text-gray-400"><Phone size={16} /></div>
                    {employee.phone}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-gray-50 flex items-center justify-center text-gray-400"><MapPin size={16} /></div>
                    <span className="truncate">{employee.location}</span>
                  </div>
                </div>

                {/* Employment Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2 border-b border-gray-100 pb-2">Employment Info</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-gray-50 flex items-center justify-center text-gray-400"><Building size={16} /></div>
                    Department: <span className="font-medium text-gray-900">{employee.department}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-gray-50 flex items-center justify-center text-gray-400"><Hash size={16} /></div>
                    Employee ID: <span className="font-medium text-gray-900">{employee.empId}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-gray-50 flex items-center justify-center text-gray-400"><Calendar size={16} /></div>
                    Joined: <span className="font-medium text-gray-900">{employee.joinDate}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-gray-50 flex items-center justify-center text-gray-400"><Heart size={16} /></div>
                    Marital Status: <span className="font-medium text-gray-900">{employee.maritalStatus || '—'}</span>
                  </div>
                </div>
              </div>

              {/* Quick HR Stats */}
              <div className="grid grid-cols-3 gap-4">
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

            {/* Right Column: Administrative Data (Admin Only) */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-6">
                <Shield size={18} className="text-slate-700" /> Administrative Data
              </h3>
              
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1.5"><DollarSign size={14}/> Compensation</p>
                  <p className="text-sm font-semibold text-slate-900">{employee.salary}</p>
                </div>
                
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1.5"><Key size={14}/> System Access</p>
                  <p className="text-sm font-semibold text-slate-900">{employee.systemAccess}</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1.5"><Clock size={14}/> Last Login</p>
                  <p className="text-sm font-semibold text-slate-900">{employee.lastLogin}</p>
                </div>

                <hr className="border-slate-200" />

                {/* CV / Resume */}
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-2 flex items-center gap-1.5"><FileText size={14} /> CV / Resume</p>
                  <span className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-md border mb-3 ${
                    CV_BADGE[employee.cvUpdateStatus] ?? 'text-slate-600 bg-slate-100 border-slate-200'
                  }`}>
                    {employee.cvUpdateStatus || 'Needs Update'}
                  </span>
                  {employee.cvFile ? (
                    <button
                      onClick={viewCV}
                      disabled={cvLoading}
                      className="w-full bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      <FileText size={14} />
                      {cvLoading ? 'Opening...' : 'View CV'}
                    </button>
                  ) : (
                    <button
                      disabled
                      title="This employee has not uploaded a CV yet"
                      className="w-full bg-white border border-slate-200 text-slate-400 text-xs font-semibold py-2.5 rounded-lg cursor-not-allowed"
                    >
                      No CV Uploaded
                    </button>
                  )}
                </div>

                <hr className="border-slate-200" />

                {/* Admin Quick Actions */}
                <div className="space-y-3 pt-2">
                  {employee.status === 'Inactive' ? (
                    <button
                      onClick={() => onToggleStatus?.(employee.id, 'reactivate')}
                      className="w-full bg-white border border-green-200 hover:bg-green-50 text-green-700 text-xs font-semibold py-2.5 rounded-lg transition-colors"
                    >
                      Reactivate Account
                    </button>
                  ) : (
                    <button
                      onClick={() => onToggleStatus?.(employee.id, 'deactivate')}
                      className="w-full bg-white border border-red-200 hover:bg-red-50 text-red-600 text-xs font-semibold py-2.5 rounded-lg transition-colors"
                    >
                      Deactivate Account
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}