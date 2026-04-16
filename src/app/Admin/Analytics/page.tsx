"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavi from '../../../components/AdminNavi/AdminNavi';
import AdminTabs from '../../../components/AdminNavi/AdminTabs';
import { Users, Activity, FileText, LayoutGrid } from 'lucide-react';
import ChartModal from '../../../components/Modals/ChartModal';
import { API_BASE, authHeaders, clearAuth, formatTime, getStoredName } from '../../../lib/api';

interface Summary {
  activeEmployees: number;
  todayAttendance: { present: number; late: number; absent: number; checkedIn: number; rate: number };
  pendingLeaves: number;
}

interface BackendLeave { _id: string; status: 'Pending' | 'Approved' | 'Rejected' }
interface BackendUser { _id: string; name: string; role: string; position?: string; department?: string }
interface BackendAttendance { _id: string; user: { _id: string } | null; checkIn?: string; status: 'Present' | 'Late' | 'Absent' }

interface AvailabilityRow { id: string; name: string; role: string; status: string }

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const [activeChart, setActiveChart] = useState<'attendance' | 'leave' | 'department' | 'project' | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [leaveStats, setLeaveStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [availability, setAvailability] = useState<AvailabilityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminName, setAdminName] = useState('Admin');

  useEffect(() => {
    setAdminName(getStoredName() || 'Admin');

    const load = async () => {
      try {
        const todayStr = new Date().toISOString().split('T')[0];
        const [sumRes, leavesRes, usersRes, attRes] = await Promise.all([
          fetch(`${API_BASE}/api/admin/analytics/summary`, { headers: authHeaders() }),
          fetch(`${API_BASE}/api/admin/leaves`, { headers: authHeaders() }),
          fetch(`${API_BASE}/api/admin/users`, { headers: authHeaders() }),
          fetch(`${API_BASE}/api/admin/attendance?date=${todayStr}`, { headers: authHeaders() }),
        ]);

        if ([sumRes, leavesRes, usersRes, attRes].some(r => r.status === 401)) {
          router.push('/login');
          return;
        }

        const [sumData, leavesData, usersData, attData] = await Promise.all([
          sumRes.json(), leavesRes.json(), usersRes.json(), attRes.json(),
        ]);

        if (sumData.success) setSummary(sumData.data);

        if (leavesData.success) {
          const arr = leavesData.data as BackendLeave[];
          setLeaveStats({
            pending: arr.filter(l => l.status === 'Pending').length,
            approved: arr.filter(l => l.status === 'Approved').length,
            rejected: arr.filter(l => l.status === 'Rejected').length,
          });
        }

        if (usersData.success && attData.success) {
          const users = (usersData.data as BackendUser[]).filter(u => u.role !== 'Admin');
          const attMap: Record<string, BackendAttendance> = {};
          (attData.data as BackendAttendance[]).forEach(a => {
            if (a.user) attMap[a.user._id] = a;
          });
          setAvailability(users.map(u => {
            const rec = attMap[u._id];
            let status = 'Not Checked In';
            if (rec) {
              status = rec.status === 'Late'
                ? `Late · ${formatTime(rec.checkIn)}`
                : `Present · ${formatTime(rec.checkIn)}`;
            }
            return {
              id: u._id,
              name: u.name,
              role: u.position || u.role,
              status,
            };
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

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  const present = summary?.todayAttendance.present ?? 0;
  const late = summary?.todayAttendance.late ?? 0;
  const checkedIn = summary?.todayAttendance.checkedIn ?? 0;
  const absent = summary?.todayAttendance.absent ?? 0;
  const rate = summary?.todayAttendance.rate ?? 0;
  const presentPct = checkedIn > 0 ? Math.round((present / checkedIn) * 100) : 0;
  const latePct = checkedIn > 0 ? 100 - presentPct : 0;

  const leaveBarMax = Math.max(1, leaveStats.pending, leaveStats.approved, leaveStats.rejected);
  const barHeight = (n: number) => `${Math.round((n / leaveBarMax) * 100)}%`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-10">
      <AdminNavi adminName={adminName} role="admin" onLogout={handleLogout} />
      <AdminTabs activeTab="Analytics" />

      <main className="p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl p-4">
            {error}
          </div>
        )}

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* IN SCOPE: Active Employees */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-gray-500 font-medium">Active Employees</p>
              <Users size={18} className="text-gray-400" />
            </div>
            <p className="text-4xl font-semibold text-green-500 mb-2">
              {loading ? '...' : summary?.activeEmployees ?? 0}
            </p>
            <p className="text-[11px] text-gray-400">Total registered users</p>
          </div>

          {/* IN SCOPE: Attendance Rate */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-gray-500 font-medium">Attendance Rate</p>
              <Activity size={18} className="text-gray-400" />
            </div>
            <p className="text-4xl font-semibold text-blue-600 mb-2">
              {loading ? '...' : `${rate}%`}
            </p>
            <p className="text-[11px] text-gray-400">{checkedIn} checked in / {absent} absent today</p>
          </div>

          {/* IN SCOPE: Pending Leaves */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-gray-500 font-medium">Pending Leaves</p>
              <FileText size={18} className="text-gray-400" />
            </div>
            <p className="text-4xl font-semibold text-gray-900 mb-2">
              {loading ? '...' : summary?.pendingLeaves ?? 0}
            </p>
            <p className="text-[11px] text-gray-400">Awaiting approval</p>
          </div>

          {/* OUT OF SCOPE: Active Projects (placeholder for projects teammate) */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-gray-500 font-medium">Active Projects</p>
              <LayoutGrid size={18} className="text-gray-400" />
            </div>
            <p className="text-4xl font-semibold text-orange-400 mb-2">2</p>
            <p className="text-[11px] text-gray-400">Total registered users</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* IN SCOPE: Attendance Overview */}
          <div
            onClick={() => setActiveChart('attendance')}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col min-h-[300px] cursor-pointer hover:shadow-md hover:border-gray-300 transition-all group"
          >
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Attendance Overview</h3>
            <p className="text-[11px] text-gray-500 mb-8">Today's attendance distribution</p>
            <div className="flex-1 flex items-center justify-center relative">
              <div
                className="w-40 h-40 rounded-full group-hover:scale-105 transition-transform duration-300"
                style={{ background: `conic-gradient(#22c55e 0% ${presentPct}%, #eab308 ${presentPct}% 100%)` }}
              ></div>
              <span className="absolute left-10 top-8 text-xs font-medium text-green-500">Present: {presentPct}%</span>
              <span className="absolute right-12 bottom-4 text-xs font-medium text-yellow-500">Late: {latePct}%</span>
              <span className="absolute right-4 top-20 text-xs font-medium text-purple-400 opacity-50">Absent: {absent}</span>
            </div>
          </div>

          {/* IN SCOPE: Leave Requests */}
          <div
            onClick={() => setActiveChart('leave')}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col min-h-[300px] cursor-pointer hover:shadow-md hover:border-gray-300 transition-all group"
          >
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Leave Requests</h3>
            <p className="text-[11px] text-gray-500 mb-6">Status distribution</p>
            <div className="flex-1 relative border-l border-b border-gray-200 ml-6 mt-4 flex items-end justify-around pb-0">
              <div className="absolute -left-6 top-0 text-[10px] text-gray-400">{leaveBarMax}</div>
              <div className="absolute -left-4 bottom-0 text-[10px] text-gray-400">0</div>

              <div className="absolute w-full border-t border-dashed border-gray-100 top-1/4"></div>
              <div className="absolute w-full border-t border-dashed border-gray-100 top-1/2"></div>
              <div className="absolute w-full border-t border-dashed border-gray-100 top-3/4"></div>

              <div className="w-16 bg-gray-400 relative z-10 group-hover:bg-gray-500 transition-colors flex items-end justify-center pb-1" style={{ height: barHeight(leaveStats.pending) }}>
                <span className="text-[10px] font-semibold text-white">{leaveStats.pending}</span>
              </div>
              <div className="w-16 bg-green-500 relative z-10 group-hover:bg-green-600 transition-colors flex items-end justify-center pb-1" style={{ height: barHeight(leaveStats.approved) }}>
                <span className="text-[10px] font-semibold text-white">{leaveStats.approved}</span>
              </div>
              <div className="w-16 bg-red-500 relative z-10 group-hover:bg-red-600 transition-colors flex items-end justify-center pb-1" style={{ height: barHeight(leaveStats.rejected) }}>
                <span className="text-[10px] font-semibold text-white">{leaveStats.rejected}</span>
              </div>
            </div>
            <div className="flex justify-around ml-6 mt-2 text-[11px] text-gray-500">
              <span className="w-16 text-center">Pending</span>
              <span className="w-16 text-center">Approved</span>
              <span className="w-16 text-center">Rejected</span>
            </div>
          </div>

          {/* OUT OF SCOPE: Department Distribution (placeholder) */}
          <div
            onClick={() => setActiveChart('department')}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col min-h-[300px] cursor-pointer hover:shadow-md hover:border-gray-300 transition-all group"
          >
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Department Distribution</h3>
            <p className="text-[11px] text-gray-500 mb-6">Employees by department</p>
            <div className="flex-1 relative border-l border-b border-gray-200 ml-4 mt-4 flex items-end justify-around pb-0">
               <div className="absolute -left-4 top-0 text-[10px] text-gray-400">2</div>
               <div className="absolute -left-6 top-1/4 text-[10px] text-gray-400">1.5</div>
               <div className="absolute -left-4 top-1/2 text-[10px] text-gray-400">1</div>
               <div className="absolute -left-6 top-3/4 text-[10px] text-gray-400">0.5</div>
               <div className="absolute -left-4 bottom-0 text-[10px] text-gray-400">0</div>

               <div className="absolute w-full border-t border-dashed border-gray-100 top-1/4"></div>
               <div className="absolute w-full border-t border-dashed border-gray-100 top-1/2"></div>
               <div className="absolute w-full border-t border-dashed border-gray-100 top-3/4"></div>

               <div className="w-24 h-full bg-[#10b981] relative z-10 group-hover:bg-[#059669] transition-colors"></div>
               <div className="w-24 h-1/2 bg-[#10b981] relative z-10 group-hover:bg-[#059669] transition-colors"></div>
            </div>
            <div className="flex justify-around ml-4 mt-2 text-[11px] text-gray-500">
              <span className="w-24 text-center">Engineering</span>
              <span className="w-24 text-center">Marketing</span>
            </div>
          </div>

          {/* OUT OF SCOPE: Project Status (placeholder) */}
          <div
            onClick={() => setActiveChart('project')}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col min-h-[300px] cursor-pointer hover:shadow-md hover:border-gray-300 transition-all group"
          >
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Project Status</h3>
            <p className="text-[11px] text-gray-500 mb-8">Project distribution by status</p>
            <div className="flex-1 flex items-center justify-center relative">
              <div className="w-32 h-32 rounded-full bg-blue-500 group-hover:scale-105 transition-transform duration-300"></div>
              <div className="absolute w-16 border-t border-blue-300 right-1/2 top-1/2 transform translate-x-1/2"></div>
              <span className="absolute left-1/4 top-1/2 text-[11px] font-medium text-blue-500 -translate-y-1/2 bg-white px-1">Active: 2</span>
            </div>
          </div>
        </div>

        {/* IN SCOPE: Employee Availability List */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mt-2">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Employee Availability</h3>
            <p className="text-[11px] text-gray-500">Current status overview</p>
          </div>

          <div className="space-y-3">
            {availability.map((emp) => (
              <div key={emp.id} className="bg-[#f9fafb] border border-gray-100 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">{emp.name}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{emp.role}</p>
                </div>
                <span className={`text-xs font-medium ${
                  emp.status.startsWith('Present') ? 'text-green-600'
                  : emp.status.startsWith('Late') ? 'text-orange-500'
                  : 'text-gray-500'
                }`}>{emp.status}</span>
              </div>
            ))}
            {!loading && availability.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No employees yet.</p>
            )}
          </div>
        </div>

      </main>

      <ChartModal
        isOpen={!!activeChart}
        onClose={() => setActiveChart(null)}
        chartId={activeChart}
      />
    </div>
  );
}
