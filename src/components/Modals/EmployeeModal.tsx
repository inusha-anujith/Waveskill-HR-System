"use client";

import React, { useEffect, useState } from 'react';
import { X, Mail, User } from 'lucide-react';
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
  maritalStatus?: string;
  cvUpdateStatus?: string;
}

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  existing?: EmployeeRecord | null;
  onSaved?: () => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  position?: string;
}

const DEPARTMENTS = ['Engineering', 'Marketing', 'Human Resources', 'Sales', 'Finance', 'Operations'];
const MARITAL_STATUSES = ['Single', 'Married', 'Divorced', 'Widowed'];
const CV_STATUSES = ['Needs Update', 'Pending Review', 'Up to Date'];

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
  const [maritalStatus, setMaritalStatus] = useState('');
  const [cvUpdateStatus, setCvUpdateStatus] = useState('Needs Update');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setErrors({});
    setApiError(null);
    setSubmitting(false);
    if (existing) {
      setName(existing.name || '');
      setEmail(existing.email || '');
      setPassword('');
      setRole(existing.role || 'Employee');
      setDepartment(existing.department || 'Engineering');
      setPosition(existing.position || '');
      setJoinDate(existing.joinDate ? existing.joinDate.substring(0, 10) : '');
      setMaritalStatus(existing.maritalStatus || '');
      setCvUpdateStatus(existing.cvUpdateStatus || 'Needs Update');
    } else {
      setName(''); setEmail(''); setPassword(''); setRole('Employee');
      setDepartment('Engineering'); setPosition(''); setJoinDate('');
      setMaritalStatus(''); setCvUpdateStatus('Needs Update');
    }
  }, [isOpen, existing]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!email.trim()) errs.email = 'Email address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email address';
    if (!isEdit && !password) errs.password = 'Password is required';
    else if (!isEdit && password.length < 6) errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const clearErr = (field: keyof FormErrors) => setErrors(e => ({ ...e, [field]: undefined }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setApiError(null);

    try {
      const payload: Record<string, any> = { name, email, role, department, position, maritalStatus, cvUpdateStatus };
      if (joinDate) payload.joinDate = joinDate;
      if (!isEdit || password) payload.password = password;

      const url = isEdit ? `${API_BASE}/api/admin/users/${existing!._id}` : `${API_BASE}/api/admin/users`;
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(payload) });
      const data = await res.json();
      if (!data.success) {
        const msg = data.message || 'Failed to save employee';
        setApiError(msg);
        toast.error(msg);
        setSubmitting(false);
        return;
      }
      toast.success(isEdit ? `Employee "${name}" updated` : `Employee "${name}" added`);
      onSaved?.();
      onClose();
    } catch (err: any) {
      const msg = err.message || 'Network error';
      setApiError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass = (err?: string) =>
    `w-full px-4 py-3.5 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 text-gray-900 outline-none transition-colors ${err ? 'ring-2 ring-red-300 bg-red-50' : 'focus:ring-gray-200'}`;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans">
      {/* Flex column so only the field area scrolls — the header and the action
          buttons stay put instead of the whole rounded panel scrolling. */}
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-xl relative max-h-[90vh] flex flex-col overflow-hidden">

        <div className="flex justify-between items-center px-8 pt-8 pb-5 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{isEdit ? 'Edit Employee' : 'Add New Employee'}</h2>
            <p className="text-sm text-gray-500 mt-1">{isEdit ? 'Update team member details' : 'Register a new team member'}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800 transition-colors p-2 bg-gray-50 rounded-full">
            <X size={20} />
          </button>
        </div>

        <form className="flex-1 flex flex-col min-h-0" onSubmit={handleSubmit} noValidate>
          <div className="scroll-area flex-1 overflow-y-auto px-8 pb-2">

            {apiError && (
              <div className="mb-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl p-3">{apiError}</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="text" value={name}
                  onChange={e => { setName(e.target.value); clearErr('name'); }}
                  placeholder="John Doe"
                  className={`${fieldClass(errors.name)} pl-11`}
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email" value={email}
                  onChange={e => { setEmail(e.target.value); clearErr('email'); }}
                  placeholder="john@company.com"
                  className={`${fieldClass(errors.email)} pl-11`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                {isEdit ? 'New Password (leave blank to keep)' : <>Password <span className="text-red-500">*</span></>}
              </label>
              <input
                type="password" value={password}
                onChange={e => { setPassword(e.target.value); clearErr('password'); }}
                placeholder={isEdit ? '••••••••' : 'Set initial password'}
                className={fieldClass(errors.password)}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">System Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                disabled={isEdit && existing?.role === 'Admin'}
                className="w-full px-4 py-3.5 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 text-gray-900 outline-none appearance-none cursor-pointer disabled:opacity-60"
              >
                <option value="Employee">Employee</option>
                <option value="Manager">Manager</option>
              </select>
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Department</label>
              <select value={department} onChange={e => setDepartment(e.target.value)}
                className="w-full px-4 py-3.5 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 text-gray-900 outline-none appearance-none cursor-pointer">
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Job Position</label>
              <input type="text" value={position} onChange={e => setPosition(e.target.value)}
                placeholder="e.g. Software Engineer"
                className={fieldClass()} />
            </div>

            {/* Marital Status */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Marital Status</label>
              <select value={maritalStatus} onChange={e => setMaritalStatus(e.target.value)}
                className="w-full px-4 py-3.5 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 text-gray-900 outline-none appearance-none cursor-pointer">
                <option value="">— Select —</option>
                {MARITAL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* CV Update Status */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">CV Update Status</label>
              <select value={cvUpdateStatus} onChange={e => setCvUpdateStatus(e.target.value)}
                className="w-full px-4 py-3.5 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 text-gray-900 outline-none appearance-none cursor-pointer">
                {CV_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Join Date */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-2">Join Date</label>
                <input type="date" value={joinDate} onChange={e => setJoinDate(e.target.value)}
                  className={fieldClass()} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100 bg-white shrink-0">
            <button type="button" onClick={onClose}
              className="px-6 py-3.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="px-6 py-3.5 bg-[#1a1a1a] text-white font-semibold rounded-xl hover:bg-black transition-colors disabled:opacity-60">
              {submitting ? 'Saving...' : isEdit ? 'Update Employee' : 'Save Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
