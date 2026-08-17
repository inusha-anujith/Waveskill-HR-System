"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ManagerNavi from '../../../components/ManagerNavi/ManagerNavi';
import ManagerTabs from '../../../components/ManagerNavi/ManagerTabs';
import { Activity, FileText, LayoutGrid, Bell } from 'lucide-react';
import { API_BASE, authHeaders, clearAuth, formatTime, getStoredName } from '../../../lib/api';

interface ManagerSummaryData {
  todayAttendance: { present: number; late: number; absent: number; checkedIn: number; rate: number };
  pendingLeaves: number;
  activeProjects: number;
  projectAnnouncementCount: number;
  leaveStats: { pending: number; approved: number; rejected: number };
}

interface BackendUser { _id: string; name: string; role: string; position?: string }
interface BackendAttendance { _id: string; user: { _id: string } | null; checkIn?: string; status: 'Present' | 'Late' | 'Absent' }
interface AvailabilityRow { id: string; name: string; role: string; status: string }

export default function ManagerAnalyticsPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<ManagerSummaryData | null>(null);
  const [availability, setAvailability] = useState<AvailabilityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [managerName, setManagerName] = useState('Manager');

  useEffect(() => {
    setManagerName(getStoredName() || 'Manager');

    const load = async () => {
      try {
        const todayStr = new Date().toISOString().split('T')[0];
        const [sumRes, usersRes, attRes] = await Promise.all([
          fetch(`${API_BASE}/api/admin/analytics/summary`, { headers: authHeaders() }),
          fetch(`${API_BASE}/api/admin/users`, { headers: authHeaders() }),
          fetch(`${API_BASE}/api/admin/attendance?date=${todayStr}`, { headers: authHeaders() }),
        ]);

        if ([sumRes, usersRes, attRes].some(r => r.status === 401)) {
          router.push('/login');
          return;
        }

        const [sumData, usersData, attData] = await Promise.all([
          sumRes.json(), usersRes.json(), attRes.json(),
        ]);

        if (sumData.success && sumData.role === 'Manager') {
          setSummary(sumData.data as ManagerSummaryData);
        }

        if (usersData.success && attData.success) {
          const users = (usersData.data as BackendUser[]).filter(u => u.role !== 'Admin');
          const attMap: Record<string, BackendAttendance> = {};
          (attData.data as BackendAttendance[]).forEach(a => { if (a.user) attMap[a.user._id] = a; });
          setAvailability(users.map(u => {
            const rec = attMap[u._id];
            let status = 'Not Checked In';
            if (rec) {
              status = rec.status === 'Late'
                ? `Late · ${formatTime(rec.checkIn)}`
                : formatTime(rec.checkIn);
            }
            return { id: u._id, name: u.name, role: u.position || u.role, status };
          }));
        }
      } catch (e: any) {
        setError(e.message || 'Network error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router]);

  const handleLogout = () => { clearAuth(); router.push('/login'); };

  const present = summary?.todayAttendance.present ?? 0;
  const late = summary?.todayAttendance.late ?? 0;
  const checkedIn = summary?.todayAttendance.checkedIn ?? 0;
  const absent = summary?.todayAttendance.absent ?? 0;
  const rate = summary?.todayAttendance.rate ?? 0;
  const presentPct = checkedIn > 0 ? Math.round((present / checkedIn) * 100) : 0;
  const latePct = checkedIn > 0 ? 100 - presentPct : 0;

  const ls = summary?.leaveStats ?? { pending: 0, approved: 0, rejected: 0 };
  const leaveBarMax = Math.max(1, ls.pending, ls.approved, ls.rejected);
  const barHeight = (n: number) => `${Math.round((n / leaveBarMax) * 100)}%`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-10">
      <ManagerNavi managerName={managerName} role="manager" onLogout={handleLogout} />
      <ManagerTabs activeTab="Analytics" />

      <main className="p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl p-4">{error}</div>
        )}

        {/* Stats row – manager-scoped: attendance, leaves, projects, project announcements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-gray-500 font-medium">Attendance Rate</p>
              <Activity size={18} className="text-gray-400" />
            </div>
            <p className="text-4xl font-semibold text-blue-600 mb-2">{loading ? '...' : `${rate}%`}</p>
            <p className="text-[11px] text-gray-400">{checkedIn} checked in · {absent} absent today</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-gray-500 font-medium">Pending Leaves</p>
              <FileText size={18} className="text-gray-400" />
            </div>
            <p className="text-4xl font-semibold text-gray-900 mb-2">{loading ? '...' : summary?.pendingLeaves ?? 0}</p>
            <p className="text-[11px] text-gray-400">Awaiting your approval</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-gray-500 font-medium">Active Projects</p>
              <LayoutGrid size={18} className="text-gray-400" />
            </div>
            <p className="text-4xl font-semibold text-orange-400 mb-2">{loading ? '...' : summary?.activeProjects ?? 0}</p>
            <p className="text-[11px] text-gray-400">Currently in progress</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-gray-500 font-medium">Project Announcements</p>
              <Bell size={18} className="text-gray-400" />
            </div>
            <p className="text-4xl font-semibold text-purple-500 mb-2">{loading ? '...' : summary?.projectAnnouncementCount ?? 0}</p>
            <p className="text-[11px] text-gray-400">Total project updates posted</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Overview */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col min-h-[300px]">
            <h3 className="text-sm font-semibold text-gray-900">Attendance Overview</h3>
            <p className="text-[11px] text-gray-500 mb-8">Today's attendance distribution</p>
            <div className="flex-1 flex items-center justify-center relative">
              <div
                className="w-40 h-40 rounded-full"
                style={{ background: checkedIn > 0 ? `conic-gradient(#22c55e 0% ${presentPct}%, #eab308 ${presentPct}% ${presentPct + latePct}%, #e5e7eb ${presentPct + latePct}% 100%)` : '#e5e7eb' }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-xs">
                {checkedIn > 0 ? (
                  <>
                    <span className="text-green-600 font-medium">Present {presentPct}%</span>
                    <span className="text-yellow-600 font-medium">Late {latePct}%</span>
                    <span className="text-gray-400">Absent {absent}</span>
                  </>
                ) : (
                  <span className="text-gray-400">No data today</span>
                )}
              </div>
            </div>
            <div className="flex justify-around mt-4 text-[11px] text-gray-500">
              <span>Present: {present}</span>
              <span>Late: {late}</span>
              <span>Absent: {absent}</span>
            </div>
          </div>

          {/* Leave Requests */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col min-h-[300px]">
            <h3 className="text-sm font-semibold text-gray-900">Leave Requests</h3>
            <p className="text-[11px] text-gray-500 mb-6">Status distribution</p>
            <div className="flex-1 relative border-l border-b border-gray-200 ml-6 mt-4 flex items-end justify-around pb-0">
              <div className="absolute -left-6 top-0 text-[10px] text-gray-400">{leaveBarMax}</div>
              <div className="absolute -left-4 bottom-0 text-[10px] text-gray-400">0</div>
              {['top-1/4','top-1/2','top-3/4'].map(p => (
                <div key={p} className={`absolute w-full border-t border-dashed border-gray-100 ${p}`} />
              ))}
              <div className="w-16 bg-gray-400 relative z-10 flex items-end justify-center pb-1" style={{ height: barHeight(ls.pending) }}>
                <span className="text-[10px] font-semibold text-white">{ls.pending}</span>
              </div>
              <div className="w-16 bg-green-500 relative z-10 flex items-end justify-center pb-1" style={{ height: barHeight(ls.approved) }}>
                <span className="text-[10px] font-semibold text-white">{ls.approved}</span>
              </div>
              <div className="w-16 bg-red-500 relative z-10 flex items-end justify-center pb-1" style={{ height: barHeight(ls.rejected) }}>
                <span className="text-[10px] font-semibold text-white">{ls.rejected}</span>
              </div>
            </div>
            <div className="flex justify-around ml-6 mt-2 text-[11px] text-gray-500">
              <span className="w-16 text-center">Pending</span>
              <span className="w-16 text-center">Approved</span>
              <span className="w-16 text-center">Rejected</span>
            </div>
          </div>
        </div>

        {/* Employee Availability */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Team Availability Today</h3>
            <p className="text-[11px] text-gray-500">Current check-in status</p>
          </div>
          <div className="space-y-3">
            {availability.map(emp => (
              <div key={emp.id} className="bg-[#f9fafb] border border-gray-100 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">{emp.name}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{emp.role}</p>
                </div>
                <span className={`text-xs font-medium ${
                  emp.status === 'Not Checked In' ? 'text-gray-400'
                  : emp.status.startsWith('Late') ? 'text-orange-500'
                  : 'text-green-600'
                }`}>{emp.status}</span>
              </div>
            ))}
            {!loading && availability.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No team members found.</p>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
