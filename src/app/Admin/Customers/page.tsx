"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavi from '../../../components/AdminNavi/AdminNavi';
import AdminTabs from '../../../components/AdminNavi/AdminTabs';
import CustomerModal, { CustomerRecord } from '../../../components/Modals/CustomerModal';
import ConfirmModal from '../../../components/Modals/ConfirmModal';
import FilterSelect, { FilterOption } from '../../../components/FilterSelect/FilterSelect';
import { useToast } from '../../../components/Toast/ToastProvider';
import SearchHint from '../../../components/FilterSelect/SearchHint';
import { useDebouncedSearch, useLatestRequest, isAbortError } from '../../../hooks/useDebouncedSearch';
import { API_BASE, authHeaders, clearAuth, getStoredName, formatDate } from '../../../lib/api';
import {
  Search, Pencil, Plus, Building2, UserCheck, Briefcase, Globe, Mail, Phone, MapPin, X, UserX, RotateCcw
} from 'lucide-react';

// INACTIVE and ARCHIVED both mean "no longer a working client".
const isCustomerActive = (c: { status?: string }) => !['INACTIVE', 'ARCHIVED'].includes(c.status || '');

interface BackendCustomer extends CustomerRecord {
  projectCount?: number;
  createdAt?: string;
}

const STATUS_OPTIONS: FilterOption[] = [
  { value: '', label: 'All Statuses' },
  { value: 'ACTIVE CLIENT', label: 'Active Client' },
  { value: 'PROSPECT', label: 'Prospect' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'ARCHIVED', label: 'Archived' },
];

const STATUS_BADGE: Record<string, string> = {
  'ACTIVE CLIENT': 'bg-green-100 text-green-700',
  'PROSPECT': 'bg-blue-100 text-blue-700',
  'INACTIVE': 'bg-gray-100 text-gray-600',
  'ARCHIVED': 'bg-red-100 text-red-700',
};

export default function AdminCustomersPage() {
  const router = useRouter();
  const toast = useToast();

  const [customers, setCustomers] = useState<BackendCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const search = useDebouncedSearch();
  const nextSignal = useLatestRequest();
  const [stats, setStats] = useState<{ total: number; active: number; prospects: number; totalProjects: number } | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [adminName, setAdminName] = useState('Admin');

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editing, setEditing] = useState<CustomerRecord | null>(null);
  const [selected, setSelected] = useState<BackendCustomer | null>(null);
  const [pendingToggle, setPendingToggle] = useState<{ customer: BackendCustomer; action: 'deactivate' | 'reactivate' } | null>(null);
  const [toggling, setToggling] = useState(false);

  // Search and status are applied by the API; the abort signal keeps a slow
  // earlier response from overwriting a newer one while typing.
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.term) params.set('search', search.term);
      if (statusFilter) params.set('status', statusFilter);

      const res = await fetch(`${API_BASE}/api/admin/customers?${params}`, {
        headers: authHeaders(),
        signal: nextSignal(),
      });
      if (res.status === 401 || res.status === 403) { router.push('/login'); return; }
      const data = await res.json();
      if (data.success) {
        setCustomers(data.data as BackendCustomer[]);
        setStats(data.stats ?? null);
        setError(null);
      } else {
        setError(data.message || 'Failed to load customers');
      }
    } catch (e: any) {
      if (isAbortError(e)) return;
      setError(e.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { setAdminName(getStoredName() || 'Admin'); }, []);

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.term, statusFilter]);

  // Already filtered server-side.
  const filtered = customers;

  const totalCount = stats?.total ?? 0;
  const activeCount = stats?.active ?? 0;
  const prospectCount = stats?.prospects ?? 0;
  const totalProjects = stats?.totalProjects ?? 0;

  const confirmToggle = async () => {
    if (!pendingToggle) return;
    const { customer: target, action } = pendingToggle;
    setToggling(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/customers/${target._id}/${action}`, {
        method: 'PATCH', headers: authHeaders()
      });
      const data = await res.json();
      if (!data.success) { toast.error(data.message || `Failed to ${action}`); return; }
      const label = target.companyName || target.firstName;
      toast.success(action === 'deactivate' ? `"${label}" has been deactivated` : `"${label}" has been reactivated`);
      setPendingToggle(null);
      fetchCustomers();
    } catch (e: any) {
      toast.error(`Network error: ${e.message}`);
    } finally {
      setToggling(false);
    }
  };

  const handleLogout = () => { clearAuth(); router.push('/login'); };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-10">
      <AdminNavi adminName={adminName} role="admin" onLogout={handleLogout} />
      <AdminTabs activeTab="Customers" />

      <main className="p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl p-4">{error}</div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-gray-500 font-medium">Total Customers</p>
              <Building2 size={18} className="text-gray-400" />
            </div>
            <p className="text-3xl font-semibold text-gray-900">{loading ? '...' : totalCount}</p>
            <p className="text-[11px] text-gray-400 mt-1">All client accounts</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-gray-500 font-medium">Active Clients</p>
              <UserCheck size={18} className="text-gray-400" />
            </div>
            <p className="text-3xl font-semibold text-green-500">{loading ? '...' : activeCount}</p>
            <p className="text-[11px] text-gray-400 mt-1">Currently engaged</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-gray-500 font-medium">Prospects</p>
              <Search size={18} className="text-gray-400" />
            </div>
            <p className="text-3xl font-semibold text-blue-600">{loading ? '...' : prospectCount}</p>
            <p className="text-[11px] text-gray-400 mt-1">In the pipeline</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-gray-500 font-medium">Linked Projects</p>
              <Briefcase size={18} className="text-gray-400" />
            </div>
            <p className="text-3xl font-semibold text-purple-500">{loading ? '...' : totalProjects}</p>
            <p className="text-[11px] text-gray-400 mt-1">Across all customers</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 flex-1">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Customer Management</h2>
              <p className="text-sm text-gray-500">Create, update, and manage client accounts. Click a row to view full details.</p>
            </div>
            <button
              onClick={() => setIsAddOpen(true)}
              className="bg-[#1a1a1a] hover:bg-black transition-colors text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium"
            >
              <Plus size={18} />
              Add Customer
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text" value={search.value} onChange={e => search.setValue(e.target.value)}
                placeholder="Search by name, company, email, or industry..."
                className="w-full pl-11 pr-4 py-3 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 focus:bg-white text-sm text-gray-900 transition-colors outline-none"
              />
              <SearchHint belowMinimum={search.belowMinimum} pending={search.pending} />
            </div>
            <FilterSelect options={STATUS_OPTIONS} value={statusFilter} onChange={setStatusFilter}
              placeholder="All Statuses" className="w-full md:w-52" />
          </div>

          <div className="border border-gray-200 rounded-2xl overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-white">
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Company</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Contact</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Email</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Phone</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap text-center">Projects</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Status</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((c) => (
                  <tr key={c._id} onClick={() => setSelected(c)}
                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                      isCustomerActive(c) ? 'bg-white' : 'bg-gray-50/60'
                    }`}>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <p className={`text-sm font-medium ${isCustomerActive(c) ? 'text-gray-800' : 'text-gray-400'}`}>
                        {c.companyName || '—'}
                      </p>
                      <p className="text-xs text-gray-400">{c.industry || ''}</p>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">{c.firstName} {c.lastName}</td>
                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">{c.email}</td>
                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">{c.phone || '—'}</td>
                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap text-center">{c.projectCount ?? 0}</td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${STATUS_BADGE[c.status || ''] ?? 'bg-gray-100 text-gray-600'}`}>
                        {c.status || '—'}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => setEditing(c)}
                          className="border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil size={16} strokeWidth={2} />
                        </button>
                        {isCustomerActive(c) ? (
                          <button
                            onClick={() => setPendingToggle({ customer: c, action: 'deactivate' })}
                            className="border border-red-200 text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                            title="Deactivate customer"
                          >
                            <UserX size={16} strokeWidth={2} />
                          </button>
                        ) : (
                          <button
                            onClick={() => setPendingToggle({ customer: c, action: 'reactivate' })}
                            className="border border-green-200 text-green-700 hover:bg-green-50 p-1.5 rounded-lg transition-colors"
                            title="Reactivate customer"
                          >
                            <RotateCcw size={16} strokeWidth={2} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-sm text-gray-500">
                      {customers.length === 0 ? 'No customers yet. Click "Add Customer" to create one.' : 'No customers match your filters.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Details panel */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans"
          onClick={() => setSelected(null)}>
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-xl relative max-h-[90vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}>
            {/* Fixed identity header — see AdminEmployeeDetailsModal for why the
                avatar and title sit outside the scroll body. */}
            <div className="shrink-0">
              <div className="h-28 bg-slate-800 rounded-t-3xl relative">
                <button onClick={() => setSelected(null)}
                  className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 bg-white/10 hover:bg-white p-2 rounded-full transition-all">
                  <X size={20} />
                </button>
                <div className="absolute -bottom-10 left-8 w-20 h-20 rounded-2xl bg-blue-700 text-white flex items-center justify-center text-3xl font-bold border-4 border-white shadow-sm">
                  {(selected.companyName || selected.firstName || '?').charAt(0)}
                </div>
              </div>
              <div className="px-8 pt-14 pb-5 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selected.companyName || `${selected.firstName} ${selected.lastName}`}</h2>
                  <p className="text-gray-500 font-medium mt-1">{selected.industry || 'Client'}</p>
                </div>
                <span className={`text-[11px] font-medium px-3 py-1 rounded-full ${STATUS_BADGE[selected.status || ''] ?? 'bg-gray-100 text-gray-600'}`}>
                  {selected.status}
                </span>
              </div>
            </div>

            <div className="scroll-area flex-1 overflow-y-auto px-8 pb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {[
                  { icon: <Mail size={16} />, label: 'Email', value: selected.email },
                  { icon: <Phone size={16} />, label: 'Phone', value: selected.phone || '—' },
                  { icon: <Globe size={16} />, label: 'Website', value: selected.corporateWebsite || '—' },
                  { icon: <MapPin size={16} />, label: 'Country', value: selected.country || '—' },
                ].map(f => (
                  <div key={f.label} className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                    <span className="text-gray-400 shrink-0">{f.icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 mb-0.5">{f.label}</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{f.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">Contact Person</p>
                  <p className="text-sm font-semibold text-slate-900">{selected.contactPerson || `${selected.firstName} ${selected.lastName}`}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">Headquarters</p>
                  <p className="text-sm font-semibold text-slate-900">{selected.headquartersAddress || '—'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">Linked Projects</p>
                  <p className="text-sm font-semibold text-slate-900">{selected.projectCount ?? 0}</p>
                </div>
                {selected.createdAt && (
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-1">Client Since</p>
                    <p className="text-sm font-semibold text-slate-900">{formatDate(selected.createdAt)}</p>
                  </div>
                )}
                {selected.notes && (
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-1">Internal Notes</p>
                    <p className="text-sm text-slate-700">{selected.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <CustomerModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSaved={fetchCustomers} />
      <CustomerModal isOpen={!!editing} onClose={() => setEditing(null)} existing={editing} onSaved={fetchCustomers} />
      <ConfirmModal
        isOpen={!!pendingToggle}
        title={pendingToggle?.action === 'reactivate' ? 'Reactivate this customer?' : 'Deactivate this customer?'}
        message={
          pendingToggle?.action === 'reactivate' ? (
            <>
              <span className="font-semibold text-gray-900">{pendingToggle?.customer.companyName || pendingToggle?.customer.firstName}</span>{' '}
              ({pendingToggle?.customer.email}) will be marked as an active client and regain portal access.
            </>
          ) : (
            <>
              <span className="font-semibold text-gray-900">{pendingToggle?.customer.companyName || pendingToggle?.customer.firstName}</span>{' '}
              ({pendingToggle?.customer.email}) will lose portal access and be marked inactive. Their projects and history are
              kept, and you can reactivate them at any time.
            </>
          )
        }
        confirmLabel={pendingToggle?.action === 'reactivate' ? 'Reactivate' : 'Deactivate'}
        cancelLabel="Cancel"
        variant={pendingToggle?.action === 'reactivate' ? 'primary' : 'danger'}
        busy={toggling}
        onClose={() => { if (!toggling) setPendingToggle(null); }}
        onConfirm={confirmToggle}
      />
    </div>
  );
}
