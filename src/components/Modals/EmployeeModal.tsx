"use client";

import React, { useEffect, useState } from 'react';
import { X, Mail, User, Lock } from 'lucide-react';
import { API_BASE, authHeaders } from '../../lib/api';
import { useToast } from '../Toast/ToastProvider';

export interface EmployeeRecord {
  _id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  position?: string;
  joinDate?: string;
  phoneNumber?: string;
  totalAnnualLeave?: number;
}

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  existing?: EmployeeRecord | null;
  onSaved?: () => void;
}

const DEPARTMENTS = ['Engineering', 'Marketing', 'Human Resources', 'Sales', 'Finance', 'Operations'];

export default function EmployeeModal({ isOpen, onClose, existing, onSaved }: EmployeeModalProps) {
  const isEdit = !!existing;
  const toast = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Employee');
  const [department, setDepartment] = useState('Engineering');
  const [position, setPosition] = useState('');
  const [joinDate, setJoinDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setSubmitting(false);
    if (existing) {
      setName(existing.name || '');
      setEmail(existing.email || '');
      setPassword('');
      setRole(existing.role || 'Employee');
      setDepartment(existing.department || 'Engineering');
      setPosition(existing.position || '');
      setJoinDate(existing.joinDate ? existing.joinDate.substring(0, 10) : '');
    } else {
      setName('');
      setEmail('');
      setPassword('');
      setRole('Employee');
      setDepartment('Engineering');
      setPosition('');
      setJoinDate('');
    }
  }, [isOpen, existing]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload: Record<string, any> = {
        name,
        email,
        role,
        department,
        position,
      };
      if (joinDate) payload.joinDate = joinDate;
      if (!isEdit || password) payload.password = password;

      const url = isEdit
        ? `${API_BASE}/api/admin/users/${existing!._id}`
        : `${API_BASE}/api/admin/users`;
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) {
        const msg = data.message || 'Failed to save employee';
        setError(msg);
        toast.error(msg);
        setSubmitting(false);
        return;
      }
      toast.success(isEdit ? `Employee "${name}" updated` : `Employee "${name}" added`);
      onSaved?.();
      onClose();
    } catch (err: any) {
      const msg = err.message || 'Network error';
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-white rounded-3xl w-full max-w-2xl p-8 shadow-xl relative max-h-[90vh] overflow-y-auto">

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{isEdit ? 'Edit Employee' : 'Add New Employee'}</h2>
            <p className="text-sm text-gray-500 mt-1">{isEdit ? 'Update team member details' : 'Register a new team member'}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800 transition-colors p-2 bg-gray-50 rounded-full">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl p-3">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3.5 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 text-gray-900 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@company.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 text-gray-900 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                {isEdit ? 'New Password (leave blank to keep)' : 'Password'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isEdit ? '••••••••' : 'Set initial password'}
                  className="w-full pl-11 pr-4 py-3.5 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 text-gray-900 outline-none"
                  required={!isEdit}
                  minLength={isEdit ? undefined : 6}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">System Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={isEdit && existing?.role === 'Admin'}
                className="w-full px-4 py-3.5 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 text-gray-900 outline-none appearance-none cursor-pointer disabled:opacity-60"
              >
                <option value="Employee">Employee</option>
                <option value="Manager">Manager</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-3.5 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 text-gray-900 outline-none appearance-none cursor-pointer"
              >
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Job Position</label>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="e.g. Software Engineer"
                className="w-full px-4 py-3.5 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 text-gray-900 outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-900 mb-2">Join Date</label>
              <input
                type="date"
                value={joinDate}
                onChange={(e) => setJoinDate(e.target.value)}
                className="w-full px-4 py-3.5 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 text-gray-900 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3.5 bg-[#1a1a1a] text-white font-semibold rounded-xl hover:bg-black transition-colors disabled:opacity-60"
            >
              {submitting ? 'Saving...' : isEdit ? 'Update Employee' : 'Save Employee'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
