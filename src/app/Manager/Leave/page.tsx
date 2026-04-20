"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ManagerNavi from '../../../components/ManagerNavi/ManagerNavi';
import ManagerTabs from '../../../components/ManagerNavi/ManagerTabs';
import { Calendar, Clock, Pencil, UserX } from 'lucide-react';
import LeaveActionModal from '../../../components/Modals/LeaveActionModal';
import ConfirmModal from '../../../components/Modals/ConfirmModal';
import { useToast } from '../../../components/Toast/ToastProvider';
import { API_BASE, authHeaders, clearAuth, formatDate, getStoredName } from '../../../lib/api';

interface BackendLeave {
  _id: string;
  user: { _id: string; name: string; email: string } | null;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}

interface UiLeave {
  id: string;
  employee: string;
  type: string;
  duration: string;
  days: string;
  appliedDate: string;
  status: string;
  reason: string;
}

const toUi = (l: BackendLeave): UiLeave => ({
  id: l._id,
  employee: l.user?.name || 'Unknown',
  type: l.leaveType,
  duration: `${formatDate(l.startDate)} - ${formatDate(l.endDate)}`,
  days: `${l.days} day${l.days === 1 ? '' : 's'}`,
  appliedDate: formatDate(l.createdAt),
  status: l.status,
  reason: l.reason,
});

export default function ManagerLeavePage() {
  const router = useRouter();
  const toast = useToast();
  const [leaves, setLeaves] = useState<UiLeave[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');
  const [selectedRequest, setSelectedRequest] = useState<UiLeave | null>(null);
  const [pendingReject, setPendingReject] = useState<UiLeave | null>(null);
  const [rejecting, setRejecting] = useState(false);
  const [managerName, setManagerName] = useState('Manager');

  const fetchLeaves = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/leaves`, { headers: authHeaders() });
      if (res.status === 401 || res.status === 403) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      if (data.success) setLeaves((data.data as BackendLeave[]).map(toUi));
      else setError(data.message || 'Failed to load leaves');
    } catch (e: any) {
      setError(e.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setManagerName(getStoredName() || 'Manager');
    fetchLeaves();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyStatus = async (id: string, newStatus: string) => {
    const action = newStatus === 'Approved' ? 'approve' : 'reject';
    const target = leaves.find(l => l.id === id);
    try {
      const res = await fetch(`${API_BASE}/api/admin/leaves/${id}/${action}`, {
        method: 'PATCH',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message || `Failed to ${action} leave`);
        return false;
      }
      const who = target ? ` for ${target.employee}` : '';
      toast.success(newStatus === 'Approved' ? `Leave approved${who}` : `Leave rejected${who}`);
      fetchLeaves();
      return true;
    } catch (e: any) {
      toast.error(`Network error: ${e.message}`);
      return false;
    }
  };

  const handleStatusRequest = (id: string, newStatus: string) => {
    if (newStatus === 'Rejected') {
      const lv = leaves.find(l => l.id === id);
      if (lv) setPendingReject(lv);
      return;
    }
    applyStatus(id, newStatus);
  };

  const confirmReject = async () => {
    if (!pendingReject) return;
    setRejecting(true);
    const ok = await applyStatus(pendingReject.id, 'Rejected');
    setRejecting(false);
    if (ok) setPendingReject(null);
  };

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  const filteredRequests = leaves.filter(req => filter === 'All' ? true : req.status === filter);
  const pendingCount = leaves.filter(req => req.status === 'Pending').length;
  const approvedCount = leaves.filter(req => req.status === 'Approved').length;
  const rejectedCount = leaves.filter(req => req.status === 'Rejected').length;

  const getTypeBadge = (type: string) => {
    const lower = type.toLowerCase();
    if (lower.includes('sick')) {
      return <span className="bg-red-100 text-red-500 text-[11px] font-semibold px-3 py-1 rounded-full">{type}</span>;
    }
    if (lower.includes('annual') || lower.includes('vacation')) {
      return <span className="bg-green-100 text-green-500 text-[11px] font-semibold px-3 py-1 rounded-full">{type}</span>;
    }
    return <span className="bg-blue-100 text-blue-600 text-[11px] font-semibold px-3 py-1 rounded-full">{type}</span>;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Pending') return <span className="bg-gray-200 text-gray-700 text-[11px] font-semibold px-3 py-1 rounded-full">{status}</span>;
    if (status === 'Approved') return <span className="bg-[#1a1a1a] text-white text-[11px] font-semibold px-3 py-1 rounded-full">{status}</span>;
    if (status === 'Rejected') return <span className="bg-red-500 text-white text-[11px] font-semibold px-3 py-1 rounded-full">{status}</span>;
    return <span>{status}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <ManagerNavi managerName={managerName} role="manager" onLogout={handleLogout} />
      <ManagerTabs activeTab="Leaves" />

      <main className="p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl p-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col gap-6">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Leave Approvals</h2>
              <p className="text-sm text-gray-500">Review and approve/reject leave requests</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`text-sm font-medium px-5 py-2 rounded-xl transition-colors ${
                    filter === status
                      ? 'bg-[#1a1a1a] text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="border border-gray-200 rounded-2xl overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-white">
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Employee</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Type</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Duration</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Days</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Applied Date</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Status</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50/50 transition-colors bg-white">
                    <td className="py-4 px-6 text-sm text-gray-500 font-medium whitespace-nowrap">{request.employee}</td>
                    <td className="py-4 px-6 whitespace-nowrap">{getTypeBadge(request.type)}</td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar size={16} className="text-gray-400" />
                        {request.duration}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">{request.days}</td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock size={16} className="text-gray-400" />
                        {request.appliedDate}
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">{getStatusBadge(request.status)}</td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
                          title="Review Request"
                        >
                          <Pencil size={16} strokeWidth={2} />
                        </button>
                        {request.status === 'Pending' && (
                          <button
                            onClick={() => setPendingReject(request)}
                            className="bg-red-600 text-white hover:bg-red-700 p-1.5 rounded-lg transition-colors"
                            title="Quick Reject"
                          >
                            <UserX size={16} strokeWidth={2} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && filteredRequests.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-sm text-gray-500">
                      No leave requests found for this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-gray-500 mb-2">Pending Requests</p>
            <p className="text-4xl font-semibold text-gray-900">{pendingCount}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-gray-500 mb-2">Approved</p>
            <p className="text-4xl font-semibold text-green-500">{approvedCount}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-gray-500 mb-2">Rejected</p>
            <p className="text-4xl font-semibold text-red-500">{rejectedCount}</p>
          </div>
        </div>

      </main>

      <LeaveActionModal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        request={selectedRequest}
        onUpdateStatus={(id, newStatus) => {
          handleStatusRequest(String(id), newStatus);
        }}
      />

      <ConfirmModal
        isOpen={!!pendingReject}
        title="Reject leave request?"
        message={
          <>
            Reject <span className="font-semibold text-gray-900">{pendingReject?.employee}</span>'s{' '}
            <span className="font-semibold text-gray-900">{pendingReject?.type}</span> request
            ({pendingReject?.duration})? This action cannot be undone.
          </>
        }
        confirmLabel="Reject"
        cancelLabel="Cancel"
        variant="danger"
        busy={rejecting}
        onClose={() => { if (!rejecting) setPendingReject(null); }}
        onConfirm={confirmReject}
      />
    </div>
  );
}
