"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavi from '../../../components/AdminNavi/AdminNavi';
import AdminTabs from '../../../components/AdminNavi/AdminTabs';
import { Search, Calendar, ChevronDown, Download } from 'lucide-react';
import { API_BASE, authHeaders, clearAuth, formatDate, formatTime, getStoredName } from '../../../lib/api';

interface AttendanceRow {
  _id: string;
  user: { _id: string; name: string; email: string; department?: string } | null;
  dateString: string;
  checkIn?: string;
  checkOut?: string;
  status: 'Present' | 'Late' | 'Absent';
  workHours: string;
}

export default function AdminAttendancePage() {
  const router = useRouter();
  const [records, setRecords] = useState<AttendanceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [adminName, setAdminName] = useState('Admin');

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (date) params.set('date', date);
      if (statusFilter !== 'All') params.set('status', statusFilter);
      params.set('limit', '200');

      const res = await fetch(`${API_BASE}/api/admin/attendance?${params.toString()}`, {
        headers: authHeaders(),
      });
      if (res.status === 401 || res.status === 403) {
        router.push('/login');
        return;
      }
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
    fetchAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, statusFilter]);

  const filtered = useMemo(() => {
    if (!search.trim()) return records;
    const q = search.toLowerCase();
    return records.filter(r => (r.user?.name || '').toLowerCase().includes(q));
  }, [records, search]);

  const presentCount = filtered.filter(r => r.status === 'Present').length;
  const lateCount = filtered.filter(r => r.status === 'Late').length;
  const absentCount = filtered.filter(r => r.status === 'Absent').length;
  const totalCount = filtered.length;

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  const exportCsv = () => {
    const header = ['Date', 'Employee', 'Check In', 'Check Out', 'Work Hours', 'Status'];
    const rows = filtered.map(r => [
      r.dateString,
      r.user?.name || '',
      r.checkIn ? formatTime(r.checkIn) : '',
      r.checkOut ? formatTime(r.checkOut) : '',
      r.workHours,
      r.status,
    ]);
    const csv = [header, ...rows].map(line => line.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <AdminNavi adminName={adminName} role="admin" onLogout={handleLogout} />
      <AdminTabs activeTab="Attendance" />

      <main className="p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl p-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 p-8 flex-1 flex flex-col">

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Attendance Reports</h2>
            <p className="text-sm text-gray-500">View and monitor employee attendance records</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by employee name..."
                className="w-full pl-11 pr-4 py-3 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 focus:bg-white text-sm text-gray-900 transition-colors outline-none"
              />
            </div>

            <div className="relative w-full md:w-48">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Calendar size={18} className="text-gray-400" />
              </div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 focus:bg-white text-sm text-gray-900 transition-colors outline-none"
              />
            </div>

            <div className="relative w-full md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-4 pr-10 py-3 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 focus:bg-white text-sm text-gray-700 transition-colors outline-none appearance-none cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Present">Present</option>
                <option value="Late">Late</option>
                <option value="Absent">Absent</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <ChevronDown size={18} className="text-gray-400" />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500 font-medium">Showing {filtered.length} record{filtered.length === 1 ? '' : 's'}</p>
            <button
              onClick={exportCsv}
              disabled={filtered.length === 0}
              className="bg-[#1a1a1a] hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium"
            >
              <Download size={16} />
              Export Report
            </button>
          </div>

          <div className="border border-gray-200 rounded-2xl overflow-hidden mb-8">
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
                  {filtered.map((record) => (
                    <tr key={record._id} className="hover:bg-gray-50/50 transition-colors bg-white">
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar size={16} className="text-gray-400" />
                          {formatDate(record.dateString)}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">{record.user?.name || '—'}</td>
                      <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">{record.checkIn ? formatTime(record.checkIn) : '—'}</td>
                      <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">{record.checkOut ? formatTime(record.checkOut) : '—'}</td>
                      <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">{record.workHours}</td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className={`text-[11px] font-medium px-3 py-1 rounded-full ${
                          record.status === 'Present'
                            ? 'bg-[#1a1a1a] text-white'
                            : record.status === 'Late'
                            ? 'bg-orange-100 text-orange-600'
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {!loading && filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-sm text-gray-500">
                        No attendance records found for the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-auto">
            <div className="border border-gray-200 rounded-xl p-5">
              <p className="text-sm text-gray-500 mb-2">Total Records</p>
              <p className="text-3xl font-semibold text-gray-900">{totalCount}</p>
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
