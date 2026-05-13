"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavi from '../../../components/AdminNavi/AdminNavi';
import AdminTabs from '../../../components/AdminNavi/AdminTabs';
import FilterSelect, { FilterOption } from '../../../components/FilterSelect/FilterSelect';
import { Search, Calendar, Download } from 'lucide-react';
import { API_BASE, authHeaders, clearAuth, formatTime, getStoredName } from '../../../lib/api';
import { useToast } from '../../../components/Toast/ToastProvider';

interface AttendanceRow {
  _id: string;
  user: { _id: string; name: string; email: string; department?: string; position?: string } | null;
  dateString: string;
  checkIn?: string;
  checkOut?: string;
  status: 'Present' | 'Late' | 'Absent';
  workHours: string;
}

const STATUS_OPTIONS: FilterOption[] = [
  { value: '', label: 'All Status' },
  { value: 'Present', label: 'Present' },
  { value: 'Late', label: 'Late' },
  { value: 'Absent', label: 'Absent' },
];

type Period = 'today' | 'week' | 'month' | 'custom';

const getDateRange = (period: Period, customFrom: string, customTo: string) => {
  const today = new Date();
  const fmt = (d: Date) => d.toISOString().split('T')[0];
  if (period === 'today') return { from: fmt(today), to: fmt(today) };
  if (period === 'week') {
    const day = today.getDay();
    const mon = new Date(today); mon.setDate(today.getDate() - (day === 0 ? 6 : day - 1));
    return { from: fmt(mon), to: fmt(today) };
  }
  if (period === 'month') {
    const first = new Date(today.getFullYear(), today.getMonth(), 1);
    return { from: fmt(first), to: fmt(today) };
  }
  return { from: customFrom, to: customTo };
};

const resolveDisplayStatus = (record: AttendanceRow): { label: string; cls: string } => {
  if (!record.checkIn) return { label: 'Absent', cls: 'bg-red-100 text-red-700' };
  if (!record.checkOut) {
    return record.status === 'Late'
      ? { label: 'Late – No Checkout', cls: 'bg-orange-100 text-orange-700' }
      : { label: 'Present – No Checkout', cls: 'bg-amber-100 text-amber-700' };
  }
  return record.status === 'Late'
    ? { label: 'Late', cls: 'bg-orange-100 text-orange-700' }
    : { label: 'Present', cls: 'bg-green-100 text-green-700' };
};

export default function AdminAttendancePage() {
  const router = useRouter();
  const toast = useToast();
  const [records, setRecords] = useState<AttendanceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [period, setPeriod] = useState<Period>('today');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [adminName, setAdminName] = useState('Admin');

  const fetchAttendance = async () => {
    setLoading(true);
    setError(null);
    try {
      const { from, to } = getDateRange(period, customFrom, customTo);
      const params = new URLSearchParams({ limit: '200' });
      if (from) params.set('from', from);
      if (to) params.set('to', to);
      if (statusFilter) params.set('status', statusFilter);

      const res = await fetch(`${API_BASE}/api/admin/attendance?${params.toString()}`, { headers: authHeaders() });
      if (res.status === 401 || res.status === 403) { router.push('/login'); return; }
      const data = await res.json();
      if (data.success) setRecords(data.data as AttendanceRow[]);
      else setError(data.message || 'Failed to load attendance');
    } catch (e: any) {
      setError(e.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setAdminName(getStoredName() || 'Admin');
  }, []);

  useEffect(() => {
    fetchAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, statusFilter, customFrom, customTo]);

  const filtered = useMemo(() => {
    if (!search.trim()) return records;
    const q = search.toLowerCase();
    return records.filter(r => (r.user?.name || '').toLowerCase().includes(q) || (r.user?.email || '').toLowerCase().includes(q));
  }, [records, search]);

  const presentCount = filtered.filter(r => r.status === 'Present').length;
  const lateCount = filtered.filter(r => r.status === 'Late').length;
  const absentCount = filtered.filter(r => r.status === 'Absent').length;

  const handleLogout = () => { clearAuth(); router.push('/login'); };

  const exportCsv = () => {
    const header = ['Date', 'Employee', 'Department', 'Check In', 'Check Out', 'Work Hours', 'Status'];
    const rows = filtered.map(r => {
      const { label } = resolveDisplayStatus(r);
      return [
        r.dateString,
        r.user?.name || '',
        r.user?.department || '',
        r.checkIn ? formatTime(r.checkIn) : '—',
        r.checkOut ? formatTime(r.checkOut) : '—',
        r.checkOut ? r.workHours : '—',
        label,
      ];
    });
    const csv = [header, ...rows].map(line => line.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `attendance-${new Date().toISOString().split('T')[0]}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const PERIOD_LABELS: Record<Period, string> = { today: 'Today', week: 'This Week', month: 'This Month', custom: 'Custom' };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-10">
      <AdminNavi adminName={adminName} role="admin" onLogout={handleLogout} />
      <AdminTabs activeTab="Employees" />

      <main className="p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl p-4">{error}</div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 p-8 flex-1 flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Attendance Reports</h2>
            <p className="text-sm text-gray-500">View and monitor employee attendance records</p>
          </div>

          {/* Period filter */}
          <div className="flex items-center gap-2 flex-wrap">
            {(['today', 'week', 'month', 'custom'] as Period[]).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  period === p ? 'bg-[#1a1a1a] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {PERIOD_LABELS[p]}
              </button>
            ))}
            {period === 'custom' && (
              <div className="flex items-center gap-2 ml-2">
                <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)}
                  className="px-3 py-2 bg-[#f3f4f6] rounded-xl text-sm text-gray-700 outline-none focus:ring-2 focus:ring-gray-200" />
                <span className="text-gray-400 text-sm">to</span>
                <input type="date" value={customTo} min={customFrom} onChange={e => setCustomTo(e.target.value)}
                  className="px-3 py-2 bg-[#f3f4f6] rounded-xl text-sm text-gray-700 outline-none focus:ring-2 focus:ring-gray-200" />
              </div>
            )}
          </div>

          {/* Search + status */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by employee name..."
                className="w-full pl-11 pr-4 py-3 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 focus:bg-white text-sm text-gray-900 outline-none"
              />
            </div>
            <FilterSelect options={STATUS_OPTIONS} value={statusFilter} onChange={setStatusFilter} placeholder="All Status" className="w-full md:w-48" />
          </div>

          {/* Table controls */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500 font-medium">Showing {filtered.length} record{filtered.length !== 1 ? 's' : ''}</p>
            <button onClick={exportCsv} disabled={filtered.length === 0}
              className="bg-[#1a1a1a] hover:bg-black disabled:opacity-40 transition-colors text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium">
              <Download size={16} /> Export Report
            </button>
          </div>

          {/* Table */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-white">
                    <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Date</th>
                    <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Employee</th>
                    <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Check In</th>
                    <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Check Out</th>
                    <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Work Hours</th>
                    <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((record) => {
                    const { label, cls } = resolveDisplayStatus(record);
                    return (
                      <tr key={record._id} className="hover:bg-gray-50/50 transition-colors bg-white">
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar size={16} className="text-gray-400" />
                            {record.dateString}
                          </div>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <p className="text-sm font-medium text-gray-800">{record.user?.name || '—'}</p>
                          <p className="text-xs text-gray-400">{record.user?.department || ''}</p>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">{record.checkIn ? formatTime(record.checkIn) : '—'}</td>
                        <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">{record.checkOut ? formatTime(record.checkOut) : '—'}</td>
                        <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">{record.checkOut ? record.workHours : '—'}</td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className={`text-[11px] font-medium px-3 py-1 rounded-full ${cls}`}>{label}</span>
                        </td>
                      </tr>
                    );
                  })}
                  {!loading && filtered.length === 0 && (
                    <tr><td colSpan={6} className="py-8 text-center text-sm text-gray-500">No records found for selected filters.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            <div className="border border-gray-200 rounded-xl p-5">
              <p className="text-sm text-gray-500 mb-2">Total Records</p>
              <p className="text-3xl font-semibold text-gray-900">{filtered.length}</p>
            </div>
            <div className="border border-gray-200 rounded-xl p-5">
              <p className="text-sm text-gray-500 mb-2">Present</p>
              <p className="text-3xl font-semibold text-green-500">{presentCount}</p>
            </div>
            <div className="border border-gray-200 rounded-xl p-5">
              <p className="text-sm text-gray-500 mb-2">Late</p>
              <p className="text-3xl font-semibold text-orange-400">{lateCount}</p>
            </div>
            <div className="border border-gray-200 rounded-xl p-5">
              <p className="text-sm text-gray-500 mb-2">Absences</p>
              <p className="text-3xl font-semibold text-red-500">{absentCount}</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
