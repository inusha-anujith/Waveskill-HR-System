"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User, Mail, Phone, MapPin, Building, Award, Calendar, Heart,
  ShieldAlert, Droplet, FileText, Download, BadgeCheck
} from 'lucide-react';
import { API_BASE, authHeaders, getToken, formatDate } from '../../lib/api';
import { useToast } from '../Toast/ToastProvider';
import Avatar from '../Avatar/Avatar';

interface StaffProfileProps {
  /** Called once the profile loads, so the host page can show the real name in its header */
  onLoaded?: (user: any) => void;
}

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) => (
  <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
    <span className="text-gray-400 shrink-0">{icon}</span>
    <div className="min-w-0">
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <div className="text-sm font-semibold text-gray-900 break-words">{value || 'Not Set'}</div>
    </div>
  </div>
);

// Shared profile body for the Admin and Manager portals. Both roles are backed
// by the same User model and the same /api/profile/me endpoint, so the layout
// lives here rather than being copied into two page files.
export default function StaffProfile({ onLoaded }: StaffProfileProps) {
  const router = useRouter();
  const toast = useToast();
  const [user, setUser] = useState<any>(null);
  const [leaveBalance, setLeaveBalance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cvLoading, setCvLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!getToken()) { router.push('/login'); return; }
      try {
        const res = await fetch(`${API_BASE}/api/profile/me`, { headers: authHeaders() });
        if (res.status === 401 || res.status === 403) { router.push('/login'); return; }
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          setLeaveBalance(data.leaveBalance);
          onLoaded?.(data.user);
        } else {
          toast.error(data.message || 'Failed to load profile');
        }
      } catch {
        toast.error('Network error while loading profile');
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The CV route requires a Bearer token, so it cannot simply be an <a href>.
  // Fetch it as a blob and hand the browser an object URL instead.
  const viewCV = async () => {
    setCvLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/profile/cv`, { headers: authHeaders() });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.message || 'Could not open CV');
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener');
      // Give the new tab time to claim the URL before revoking it.
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch {
      toast.error('Network error while opening CV');
    } finally {
      setCvLoading(false);
    }
  };

  const formatPhone = (code?: string, number?: string) => {
    if (!number) return 'Not Set';
    return `${code || '+94'} ${number.replace(/^(\+94|94|0)/, '')}`;
  };

  if (loading) {
    return <div className="flex-1 flex items-center justify-center text-gray-500 py-24">Loading profile...</div>;
  }
  if (!user) {
    return <div className="flex-1 flex items-center justify-center text-gray-500 py-24">Profile unavailable.</div>;
  }

  const address = [user.addressLine1, user.addressLine2, user.addressLine3].filter(Boolean);

  // userModel defaults `position` to 'Employee', so an Admin or Manager who
  // never set a job title would otherwise be labelled "Employee".
  const jobTitle =
    !user.position || (user.position === 'Employee' && user.role !== 'Employee')
      ? user.role
      : user.position;

  return (
    <main className="p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-6">
          <Avatar name={user.name} photo={user.profilePhoto} size={80} className="border-2 border-white shadow-sm" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-400 text-sm mb-3">{jobTitle}</p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-black text-white text-[11px] font-medium px-3 py-1 rounded-full">{user.role}</span>
              <span className="bg-white border border-gray-200 text-gray-600 text-[11px] font-medium px-3 py-1 rounded-full">
                {user.department || 'Unassigned'}
              </span>
              {user.employeeId && (
                <span className="bg-white border border-gray-200 text-gray-600 text-[11px] font-medium px-3 py-1 rounded-full">
                  {user.employeeId}
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={viewCV}
          disabled={!user.cvFile || cvLoading}
          title={user.cvFile ? 'Open your CV' : 'No CV uploaded yet'}
          className="bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium"
        >
          <FileText size={16} />
          {cvLoading ? 'Opening...' : user.cvFile ? 'View My CV' : 'No CV Uploaded'}
        </button>
      </div>

      {/* Leave balance */}
      {leaveBalance && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500 mb-1">Annual Allocation</p>
            <p className="text-3xl font-semibold text-gray-900">{leaveBalance.totalAnnualLeave ?? 0}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500 mb-1">Available</p>
            <p className="text-3xl font-semibold text-green-500">{leaveBalance.availableDays ?? 0}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500 mb-1">Used</p>
            <p className="text-3xl font-semibold text-blue-600">{leaveBalance.usedDays ?? 0}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500 mb-1">Pending</p>
            <p className="text-3xl font-semibold text-orange-400">{leaveBalance.pendingDays ?? 0}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Personal */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <User size={20} className="text-gray-700" />
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
          </div>
          <div className="space-y-4">
            <InfoRow icon={<Mail size={20} />} label="Email Address" value={user.email} />
            <InfoRow icon={<Phone size={20} />} label="Phone Number" value={formatPhone(user.countryCode, user.phoneNumber)} />
            <InfoRow
              icon={<MapPin size={20} />}
              label="Home Address"
              value={address.length ? address.map((l: string, i: number) => <span key={i} className="block">{l}</span>) : 'Not Set'}
            />
            <InfoRow icon={<Heart size={20} />} label="Marital Status" value={user.maritalStatus} />
          </div>
        </div>

        {/* Professional */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Building size={20} className="text-gray-700" />
            <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>
          </div>
          <div className="space-y-4">
            <InfoRow icon={<Building size={20} />} label="Department" value={user.department || 'Unassigned'} />
            <InfoRow icon={<Award size={20} />} label="Position" value={jobTitle} />
            <InfoRow icon={<Calendar size={20} />} label="Join Date" value={user.joinDate ? formatDate(user.joinDate) : 'Not Set'} />
            <InfoRow icon={<BadgeCheck size={20} />} label="CV Status" value={user.cvUpdateStatus || 'Needs Update'} />
          </div>
        </div>
      </div>

      {/* Emergency + medical */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <ShieldAlert size={20} className="text-gray-500" /> Emergency Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
              <Heart size={20} />
            </div>
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Primary Contact</h4>
            <p className="text-lg font-bold text-gray-900 mb-1">{user.emergencyContact?.name || 'Not Set'}</p>
            <p className="text-xs text-red-600 font-medium mb-2">
              {user.emergencyContact?.relation || 'Relationship Not Specified'}
            </p>
            <p className="text-sm font-medium text-gray-600 inline-flex items-center gap-2 bg-white/60 p-2 rounded-lg border border-red-100/50">
              <Phone size={14} className="text-red-500" />
              {formatPhone(user.emergencyContact?.countryCode, user.emergencyContact?.phone)}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <Droplet size={20} />
            </div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Medical Details</h4>
            <div className="flex gap-4">
              <div className="bg-white/60 p-3 rounded-lg border border-blue-100/50 flex-1 text-center">
                <p className="text-xs text-gray-500 mb-1">Blood Group</p>
                <p className="font-bold text-gray-900">{user.medicalDetails?.bloodGroup || 'Not Set'}</p>
              </div>
              <div className="bg-white/60 p-3 rounded-lg border border-blue-100/50 flex-1 text-center">
                <p className="text-xs text-gray-500 mb-1">Allergies</p>
                <p className="font-bold text-gray-900">{user.medicalDetails?.allergies || 'None'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
