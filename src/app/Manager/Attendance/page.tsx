"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import ManagerNavi from '../../../components/ManagerNavi/ManagerNavi';
import ManagerTabs from '../../../components/ManagerNavi/ManagerTabs';
import FilterSelect, { FilterOption } from '../../../components/FilterSelect/FilterSelect';
import { Search, Calendar, Download, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { API_BASE, authHeaders, clearAuth, getStoredName, formatTime } from '../../../lib/api';
import { useToast } from '../../../components/Toast/ToastProvider';

interface AttendanceRecord {
  _id: string;
  dateString: string;
  checkIn?: string;
  checkOut?: string;
  workHours?: string;
  status: 'Present' | 'Late' | 'Absent';
  user?: { _id: string; name: string; email: string; department?: string; position?: string };
}

interface OTRequest {
  _id: string;
  date: string;
  otHours: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  user?: { _id: string; name: string; email: string; department?: string };
  reviewedBy?: { name: string };
  reviewNote?: string;
  createdAt: string;
}

const STATUS_OPTIONS: FilterOption[] = [
  { value: '', label: 'All Status' },
  { value: 'Present', label: 'Present' },
  { value: 'Late', label: 'Late' },
  { value: 'Absent', label: 'Absent' },
];

const OT_STATUS_OPTIONS: FilterOption[] = [
  { value: '', label: 'All Status' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Rejected', label: 'Rejected' },
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

const resolveDisplayStatus = (rec: AttendanceRecord): { label: string; cls: string } => {
  if (!rec.checkIn) return { label: 'Absent', cls: 'bg-red-100 text-red-700' };
  if (!rec.checkOut) {
    return rec.status === 'Late'
      ? { label: 'Late – No Checkout', cls: 'bg-orange-100 text-orange-700' }
      : { label: 'Present – No Checkout', cls: 'bg-amber-100 text-amber-700' };
  }
  return rec.status === 'Late'
    ? { label: 'Late', cls: 'bg-orange-100 text-orange-700' }
    : { label: 'Present', cls: 'bg-green-100 text-green-700' };
};

type ActiveView = 'attendance' | 'ot';

export default function ManagerAttendancePage() {
  const router = useRouter();
  const toast = useToast();
  const [managerName, setManagerName] = useState('Manager');
  const [activeView, setActiveView] = useState<ActiveView>('attendance');

  // Attendance state
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [attLoading, setAttLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [period, setPeriod] = useState<Period>('today');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  // OT state
  const [otRequests, setOtRequests] = useState<OTRequest[]>([]);
  const [otLoading, setOtLoading] = useState(false);
  const [otStatusFilter, setOtStatusFilter] = useState('');
  const [otSearch, setOtSearch] = useState('');
  const [processingOT, setProcessingOT] = useState<string | null>(null);

  const fetchAttendance = async () => {
    setAttLoading(true);
    try {
      const { from, to } = getDateRange(period, customFrom, customTo);
      const params = new URLSearchParams({ limit: '200' });
      if (from) params.set('from', from);
      if (to) params.set('to', to);
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`${API_BASE}/api/admin/attendance?${params}`, { headers: authHeaders() });
      if (res.status === 401 || res.status === 403) { router.push('/login'); return; }
      const data = await res.json();
      if (data.success) setRecords(data.data as AttendanceRecord[]);
      else toast.error(data.message || 'Failed to load attendance');
    } catch { toast.error('Network error'); }
    finally { setAttLoading(false); }
  };

  const fetchOTRequests = async () => {
    setOtLoading(true);
    try {
      const params = new URLSearchParams();
      if (otStatusFilter) params.set('status', otStatusFilter);
      const res = await fetch(`${API_BASE}/api/admin/ot?${params}`, { headers: authHeaders() });
      if (res.status === 401 || res.status === 403) { router.push('/login'); return; }
      const data = await res.json();
      if (data.success) setOtRequests(data.data as OTRequest[]);
      else toast.error(data.message || 'Failed to load OT requests');
    } catch { toast.error('Network error'); }
    finally { setOtLoading(false); }
  };

  useEffect(() => { setManagerName(getStoredName() || 'Manager'); }, []);
  useEffect(() => { fetchAttendance(); }, [period, statusFilter, customFrom, customTo]); // eslint-disable-line
  useEffect(() => { if (activeView === 'ot') fetchOTRequests(); }, [activeView, otStatusFilter]); // eslint-disable-line

  const filtered = useMemo(() => {
    if (!search.trim()) return records;
    const q = search.toLowerCase();
    return records.filter(r => r.user?.name?.toLowerCase().includes(q) || r.user?.email?.toLowerCase().includes(q));
  }, [records, search]);

  const filteredOT = useMemo(() => {
    if (!otSearch.trim()) return otRequests;
    const q = otSearch.toLowerCase();
    return otRequests.filter(r => r.user?.name?.toLowerCase().includes(q));
  }, [otRequests, otSearch]);

  const handleOTAction = async (id: string, action: 'approve' | 'reject') => {
    setProcessingOT(id);
    try {
      const res = await fetch(`${API_BASE}/api/admin/ot/${id}/${action}`, {
        method: 'PATCH',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!data.success) { toast.error(data.message || `Failed to ${action}`); return; }
      toast.success(`OT request ${action}d successfully`);
      fetchOTRequests();
    } catch { toast.error('Network error'); }
    finally { setProcessingOT(null); }
  };

  const handleExport = () => {
    const rows = [['Date', 'Employee', 'Department', 'Check In', 'Check Out', 'Work Hours', 'Status']];
    filtered.forEach(r => {
      rows.push([
        r.dateString, r.user?.name ?? '', r.user?.department ?? '',
        r.checkIn ? formatTime(r.checkIn) : '—',
        r.checkOut ? formatTime(r.checkOut) : '—',
        r.checkOut ? (r.workHours ?? '—') : '—',
        resolveDisplayStatus(r).label,
      ]);
    });
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'attendance_report.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const PERIOD_LABELS: Record<Period, string> = { today: 'Today', week: 'This Week', month: 'This Month', custom: 'Custom' };
  const handleLogout = () => { clearAuth(); router.push('/login'); };

  const otStatusBadge = (status: string) => {
    if (status === 'Approved') return 'bg-green-100 text-green-700';
    if (status === 'Rejected') return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-10">
      <ManagerNavi managerName={managerName} role="manager" onLogout={handleLogout} />
      <ManagerTabs activeTab="Attendance" />

      <main className="p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 flex-1 flex flex-col">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Attendance & Overtime</h2>
              <p className="text-sm text-gray-500">View attendance records and manage overtime requests</p>
            </div>
            {/* View toggle */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setActiveView('attendance')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeView === 'attendance' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Calendar size={15} /> Attendance
              </button>
              <button
                onClick={() => setActiveView('ot')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeView === 'ot' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Clock size={15} /> OT Requests
              </button>
            </div>
          </div>

          {/* ─── ATTENDANCE VIEW ─── */}
          {activeView === 'attendance' && (
            <>
              {/* Period filter */}
              <div className="flex items-center gap-2 mb-5 flex-wrap">
                {(['today', 'week', 'month', 'custom'] as Period[]).map(p => (
                  <button key={p} onClick={() => setPeriod(p)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${period === p ? 'bg-[#1a1a1a] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
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

              {/* Search + Status */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </div>
                  <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search by employee name or email..."
                    className="w-full pl-11 pr-4 py-3 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 focus:bg-white text-sm text-gray-900 outline-none" />
                </div>
                <FilterSelect options={STATUS_OPTIONS} value={statusFilter} onChange={setStatusFilter} placeholder="All Status" className="w-full md:w-48" />
              </div>

              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-500 font-medium">{attLoading ? 'Loading...' : `Showing ${filtered.length} record${filtered.length !== 1 ? 's' : ''}`}</p>
                <button onClick={handleExport} className="bg-[#1a1a1a] hover:bg-black transition-colors text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium">
                  <Download size={16} /> Export Report
                </button>
              </div>

              <div className="border border-gray-200 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 bg-white">
                        <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Date</th>
                        <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Employee</th>
                        <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Department</th>
                        <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Check In</th>
                        <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Check Out</th>
                        <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Work Hours</th>
                        <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filtered.map(rec => {
                        const { label, cls } = resolveDisplayStatus(rec);
                        return (
                          <tr key={rec._id} className="hover:bg-gray-50/50 transition-colors bg-white">
                            <td className="py-4 px-6 whitespace-nowrap">
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Calendar size={16} className="text-gray-400" />
                                {rec.dateString}
                              </div>
                            </td>
                            <td className="py-4 px-6 whitespace-nowrap">
                              <p className="text-sm font-medium text-gray-800">{rec.user?.name ?? '—'}</p>
                              <p className="text-xs text-gray-400">{rec.user?.position ?? ''}</p>
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">{rec.user?.department ?? '—'}</td>
                            <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">{rec.checkIn ? formatTime(rec.checkIn) : '—'}</td>
                            <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">{rec.checkOut ? formatTime(rec.checkOut) : '—'}</td>
                            <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">{rec.checkOut ? (rec.workHours ?? '—') : '—'}</td>
                            <td className="py-4 px-6 whitespace-nowrap">
                              <span className={`text-[11px] font-medium px-3 py-1 rounded-full ${cls}`}>{label}</span>
                            </td>
                          </tr>
                        );
                      })}
                      {!attLoading && filtered.length === 0 && (
                        <tr><td colSpan={7} className="py-8 text-center text-sm text-gray-400">No attendance records found for the selected period.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ─── OT REQUESTS VIEW ─── */}
          {activeView === 'ot' && (
            <>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </div>
                  <input type="text" value={otSearch} onChange={e => setOtSearch(e.target.value)}
                    placeholder="Search by employee name..."
                    className="w-full pl-11 pr-4 py-3 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 focus:bg-white text-sm text-gray-900 outline-none" />
                </div>
                <FilterSelect options={OT_STATUS_OPTIONS} value={otStatusFilter} onChange={setOtStatusFilter} placeholder="All Status" className="w-full md:w-48" />
              </div>

              <p className="text-sm text-gray-500 font-medium mb-4">{otLoading ? 'Loading...' : `${filteredOT.length} OT request${filteredOT.length !== 1 ? 's' : ''}`}</p>

              <div className="border border-gray-200 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 bg-white">
                        <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Employee</th>
                        <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Date</th>
                        <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">OT Hours</th>
                        <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Reason</th>
                        <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Status</th>
                        <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredOT.map(ot => (
                        <tr key={ot._id} className="hover:bg-gray-50/50 transition-colors bg-white">
                          <td className="py-4 px-6 whitespace-nowrap">
                            <p className="text-sm font-medium text-gray-800">{ot.user?.name ?? '—'}</p>
                            <p className="text-xs text-gray-400">{ot.user?.department ?? ''}</p>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">
                            {new Date(ot.date).toLocaleDateString('en-CA')}
                          </td>
                          <td className="py-4 px-6 whitespace-nowrap">
                            <span className="text-sm font-semibold text-gray-800">{ot.otHours}h</span>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-500 max-w-xs truncate" title={ot.reason}>{ot.reason}</td>
                          <td className="py-4 px-6 whitespace-nowrap">
                            <span className={`text-[11px] font-medium px-3 py-1 rounded-full ${otStatusBadge(ot.status)}`}>{ot.status}</span>
                          </td>
                          <td className="py-4 px-6 whitespace-nowrap text-center">
                            {ot.status === 'Pending' ? (
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleOTAction(ot._id, 'approve')}
                                  disabled={processingOT === ot._id}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                                >
                                  <CheckCircle2 size={13} /> Approve
                                </button>
                                <button
                                  onClick={() => handleOTAction(ot._id, 'reject')}
                                  disabled={processingOT === ot._id}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                                >
                                  <XCircle size={13} /> Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400">
                                {ot.reviewedBy ? `By ${ot.reviewedBy.name}` : 'Reviewed'}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {!otLoading && filteredOT.length === 0 && (
                        <tr><td colSpan={6} className="py-8 text-center text-sm text-gray-400">No OT requests found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
}
