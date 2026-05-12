"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavi from '../../../components/AdminNavi/AdminNavi';
import AdminTabs from '../../../components/AdminNavi/AdminTabs';
import { Users, Bell, UserCheck, Clock } from 'lucide-react';
import { API_BASE, authHeaders, clearAuth, formatTime, getStoredName } from '../../../lib/api';

interface DeptBreakdown { department: string; count: number }
interface CvBreakdown { status: string; count: number }
interface AdminSummaryData {
  totalEmployees: number;
  totalManagers: number;
  totalStaff: number;
  recentJoins: number;
  systemAnnouncementCount: number;
  departmentBreakdown: DeptBreakdown[];
  cvStatusBreakdown: CvBreakdown[];
}

interface BackendUser { _id: string; name: string; role: string; position?: string }
interface BackendAttendance { _id: string; user: { _id: string } | null; checkIn?: string; status: 'Present' | 'Late' | 'Absent' }
interface AvailabilityRow { id: string; name: string; role: string; status: string }

const CV_COLORS: Record<string, string> = {
  'Up to Date': '#22c55e',
  'Needs Update': '#ef4444',
  'Pending Review': '#eab308',
};

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<AdminSummaryData | null>(null);
  const [availability, setAvailability] = useState<AvailabilityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminName, setAdminName] = useState('Admin');

  useEffect(() => {
    setAdminName(getStoredName() || 'Admin');

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

        if (sumData.success && sumData.role === 'Admin') {
          setSummary(sumData.data as AdminSummaryData);
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

  const deptMax = Math.max(1, ...(summary?.departmentBreakdown.map(d => d.count) ?? [1]));
  const cvTotal = (summary?.cvStatusBreakdown ?? []).reduce((s, c) => s + c.count, 0) || 1;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-10">
      <AdminNavi adminName={adminName} role="admin" onLogout={handleLogout} />
      <AdminTabs activeTab="Analytics" />

      <main className="p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl p-4">{error}</div>
        )}

        {/* Stats row – admin-scoped: employees + announcements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-gray-500 font-medium">Total Employees</p>
              <Users size={18} className="text-gray-400" />
            </div>
            <p className="text-4xl font-semibold text-green-500 mb-2">{loading ? '...' : summary?.totalEmployees ?? 0}</p>
            <p className="text-[11px] text-gray-400">{summary?.totalManagers ?? 0} manager{summary?.totalManagers !== 1 ? 's' : ''} · {summary?.totalEmployees ?? 0} employee{summary?.totalEmployees !== 1 ? 's' : ''}</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-gray-500 font-medium">Total Staff</p>
              <UserCheck size={18} className="text-gray-400" />
            </div>
            <p className="text-4xl font-semibold text-blue-600 mb-2">{loading ? '...' : summary?.totalStaff ?? 0}</p>
            <p className="text-[11px] text-gray-400">Employees + Managers</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-gray-500 font-medium">Recent Joins</p>
              <Clock size={18} className="text-gray-400" />
            </div>
            <p className="text-4xl font-semibold text-orange-400 mb-2">{loading ? '...' : summary?.recentJoins ?? 0}</p>
            <p className="text-[11px] text-gray-400">Joined in last 30 days</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-gray-500 font-medium">System Announcements</p>
              <Bell size={18} className="text-gray-400" />
            </div>
            <p className="text-4xl font-semibold text-purple-500 mb-2">{loading ? '...' : summary?.systemAnnouncementCount ?? 0}</p>
            <p className="text-[11px] text-gray-400">Total posted</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Distribution */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col min-h-[300px]">
            <h3 className="text-sm font-semibold text-gray-900">Department Distribution</h3>
            <p className="text-[11px] text-gray-500 mb-6">Employees and managers by department</p>
            {summary?.departmentBreakdown && summary.departmentBreakdown.length > 0 ? (
              <div className="flex-1 relative border-l border-b border-gray-200 ml-6 mt-4 flex items-end justify-around gap-2 pb-0">
                <div className="absolute -left-4 top-0 text-[10px] text-gray-400">{deptMax}</div>
                <div className="absolute -left-4 bottom-0 text-[10px] text-gray-400">0</div>
                {['top-1/4','top-1/2','top-3/4'].map(p => (
                  <div key={p} className={`absolute w-full border-t border-dashed border-gray-100 ${p}`} />
                ))}
                {summary.departmentBreakdown.slice(0, 6).map((d, i) => {
                  const colors = ['#10b981','#3b82f6','#f59e0b','#ef4444','#8b5cf6','#06b6d4'];
                  const h = `${Math.round((d.count / deptMax) * 100)}%`;
                  return (
                    <div key={d.department} className="flex flex-col items-center flex-1 min-w-0">
                      <div className="w-full max-w-[40px] relative z-10 flex items-end justify-center pb-1 rounded-t-sm" style={{ height: h, backgroundColor: colors[i % colors.length] }}>
                        <span className="text-[10px] font-semibold text-white">{d.count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-sm text-gray-400">No data</div>
            )}
            {summary?.departmentBreakdown && (
              <div className="flex justify-around ml-6 mt-2 gap-2 flex-wrap">
                {summary.departmentBreakdown.slice(0, 6).map(d => (
                  <span key={d.department} className="text-[10px] text-gray-500 text-center truncate max-w-[60px]" title={d.department}>
                    {d.department.length > 8 ? d.department.slice(0, 8) + '…' : d.department}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* CV Status Distribution */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col min-h-[300px]">
            <h3 className="text-sm font-semibold text-gray-900">CV Update Status</h3>
            <p className="text-[11px] text-gray-500 mb-6">Profile CV update status across all staff</p>
            {summary?.cvStatusBreakdown && summary.cvStatusBreakdown.length > 0 ? (
              <>
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-36 h-36 rounded-full" style={{
                    background: (() => {
                      const segments = summary.cvStatusBreakdown;
                      let gradient = '';
                      let cumPct = 0;
                      segments.forEach(s => {
                        const pct = (s.count / cvTotal) * 100;
                        gradient += `${CV_COLORS[s.status] ?? '#9ca3af'} ${cumPct}% ${cumPct + pct}%, `;
                        cumPct += pct;
                      });
                      return `conic-gradient(${gradient.replace(/, $/, '')})`;
                    })()
                  }} />
                </div>
                <div className="flex flex-wrap justify-center gap-3 mt-4">
                  {summary.cvStatusBreakdown.map(s => (
                    <div key={s.status} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: CV_COLORS[s.status] ?? '#9ca3af' }} />
                      <span className="text-[11px] text-gray-600">{s.status}: {s.count}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-sm text-gray-400">No data</div>
            )}
          </div>
        </div>

        {/* Employee Availability */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Employee Availability</h3>
            <p className="text-[11px] text-gray-500">Today's check-in status</p>
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
              <p className="text-sm text-gray-400 text-center py-4">No employees yet.</p>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
