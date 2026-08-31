"use client";

import React, { useEffect, useState } from 'react';
import { X, Mail, User, Building2, Globe } from 'lucide-react';
import { API_BASE, authHeaders } from '../../lib/api';
import { useToast } from '../Toast/ToastProvider';

export interface CustomerRecord {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName?: string;
  corporateWebsite?: string;
  headquartersAddress?: string;
  phone?: string;
  country?: string;
  status?: string;
  industry?: string;
  contactPerson?: string;
  notes?: string;
}

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  existing?: CustomerRecord | null;
  onSaved?: () => void;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  corporateWebsite?: string;
}

const STATUSES = ['ACTIVE CLIENT', 'PROSPECT', 'INACTIVE', 'ARCHIVED'];

export default function CustomerModal({ isOpen, onClose, existing, onSaved }: CustomerModalProps) {
  const isEdit = !!existing;
  const toast = useToast();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [corporateWebsite, setCorporateWebsite] = useState('');
  const [headquartersAddress, setHeadquartersAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [industry, setIndustry] = useState('');
  const [status, setStatus] = useState('ACTIVE CLIENT');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setErrors({});
    setApiError(null);
    setSubmitting(false);
    setPassword('');

    setFirstName(existing?.firstName || '');
    setLastName(existing?.lastName || '');
    setEmail(existing?.email || '');
    setCompanyName(existing?.companyName || '');
    setCorporateWebsite(existing?.corporateWebsite || '');
    setHeadquartersAddress(existing?.headquartersAddress || '');
    setPhone(existing?.phone || '');
    setCountry(existing?.country || '');
    setIndustry(existing?.industry || '');
    setStatus(existing?.status || 'ACTIVE CLIENT');
    setNotes(existing?.notes || '');
  }, [isOpen, existing]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!firstName.trim()) errs.firstName = 'First name is required';
    if (!lastName.trim()) errs.lastName = 'Last name is required';
    if (!email.trim()) errs.email = 'Email address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email address';

    // Password is mandatory on create, optional on edit (blank = keep current).
    if (!isEdit && !password) errs.password = 'Password is required';
    else if (password && password.length < 6) errs.password = 'Password must be at least 6 characters';

    if (corporateWebsite.trim() && !/^https?:\/\/.+\..+/.test(corporateWebsite.trim())) {
      errs.corporateWebsite = 'Enter a full URL, e.g. https://example.com';
    }

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
      const payload: Record<string, any> = {
        firstName, lastName, email, companyName, corporateWebsite,
        headquartersAddress, phone, country, industry, status, notes
      };
      // Only send a password when one was actually typed.
      if (!isEdit || password) payload.password = password;

      const url = isEdit ? `${API_BASE}/api/admin/customers/${existing!._id}` : `${API_BASE}/api/admin/customers`;
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(payload) });
      const data = await res.json();

      if (!data.success) {
        const msg = data.message || 'Failed to save customer';
        setApiError(msg);
        toast.error(msg);
        return;
      }

      toast.success(isEdit ? `Customer "${companyName || firstName}" updated` : `Customer "${companyName || firstName}" added`);
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

  const selectClass =
    'w-full px-4 py-3.5 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 text-gray-900 outline-none appearance-none cursor-pointer';

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans">
      {/* Flex column so only the field area scrolls — the header and the action
          buttons stay put instead of the whole rounded panel scrolling. */}
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-xl relative max-h-[90vh] flex flex-col overflow-hidden">

        <div className="flex justify-between items-center px-8 pt-8 pb-5 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{isEdit ? 'Edit Customer' : 'Add New Customer'}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {isEdit ? 'Update this client account' : 'Register a new client account'}
            </p>
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

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input type="text" value={firstName}
                  onChange={e => { setFirstName(e.target.value); clearErr('firstName'); }}
                  placeholder="Kaushalya" className={`${fieldClass(errors.firstName)} pl-11`} />
              </div>
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input type="text" value={lastName}
                onChange={e => { setLastName(e.target.value); clearErr('lastName'); }}
                placeholder="Perera" className={fieldClass(errors.lastName)} />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input type="email" value={email}
                  onChange={e => { setEmail(e.target.value); clearErr('email'); }}
                  placeholder="client@company.com" className={`${fieldClass(errors.email)} pl-11`} />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                {isEdit ? 'New Password (leave blank to keep)' : <>Password <span className="text-red-500">*</span></>}
              </label>
              <input type="password" value={password}
                onChange={e => { setPassword(e.target.value); clearErr('password'); }}
                placeholder={isEdit ? '••••••••' : 'Set initial password'}
                className={fieldClass(errors.password)} />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Company Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Building2 size={18} className="text-gray-400" />
                </div>
                <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)}
                  placeholder="Waveskill Solutions Ltd" className={`${fieldClass()} pl-11`} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Industry</label>
              <input type="text" value={industry} onChange={e => setIndustry(e.target.value)}
                placeholder="e.g. Software Services" className={fieldClass()} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Corporate Website</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Globe size={18} className="text-gray-400" />
                </div>
                <input type="text" value={corporateWebsite}
                  onChange={e => { setCorporateWebsite(e.target.value); clearErr('corporateWebsite'); }}
                  placeholder="https://example.com" className={`${fieldClass(errors.corporateWebsite)} pl-11`} />
              </div>
              {errors.corporateWebsite && <p className="text-red-500 text-xs mt-1">{errors.corporateWebsite}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Phone</label>
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="+94 77 123 4567" className={fieldClass()} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Country / City</label>
              <input type="text" value={country} onChange={e => setCountry(e.target.value)}
                placeholder="Colombo, Sri Lanka" className={fieldClass()} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className={selectClass}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-900 mb-2">Headquarters Address</label>
              <input type="text" value={headquartersAddress} onChange={e => setHeadquartersAddress(e.target.value)}
                placeholder="No. 45, Galle Road, Colombo 03" className={fieldClass()} />
            </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-2">Internal Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                  placeholder="Visible to Admins only"
                  className={`${fieldClass()} resize-none`} />
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
              {submitting ? 'Saving...' : isEdit ? 'Update Customer' : 'Save Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
