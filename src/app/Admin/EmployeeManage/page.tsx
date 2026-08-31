"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavi from '../../../components/AdminNavi/AdminNavi';
import AdminTabs from '../../../components/AdminNavi/AdminTabs';
import { Search, Pencil, UserX, UserPlus, Users, UserCheck, Clock, FileText, RotateCcw, UserMinus } from 'lucide-react';
import EmployeeModal, { EmployeeRecord } from '../../../components/Modals/EmployeeModal';
import AdminEmployeeDetailsModal from '../../../components/Modals/AdminEmployeeDetailsModal';
import ConfirmModal from '../../../components/Modals/ConfirmModal';
import FilterSelect, { FilterOption } from '../../../components/FilterSelect/FilterSelect';
import { useToast } from '../../../components/Toast/ToastProvider';
import { API_BASE, authHeaders, clearAuth, getStoredName, formatDate } from '../../../lib/api';

interface BackendUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  position?: string;
  employeeId?: string;
  phoneNumber?: string;
  homeAddress?: string;
  joinDate?: string;
  totalAnnualLeave?: number;
  maritalStatus?: string;
  cvUpdateStatus?: string;
  cvFile?: string;
  // Records created before the status field existed have no value; treat those
  // as Active everywhere in this page.
  status?: 'Active' | 'Inactive';
  deactivatedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

const isActive = (u: { status?: string }) => u.status !== 'Inactive';

const ROLE_OPTIONS: FilterOption[] = [
  { value: '', label: 'All Roles' },
  { value: 'Employee', label: 'Employee' },
  { value: 'Manager', label: 'Manager' },
  { value: 'Admin', label: 'Admin' },
];

const DEPT_OPTIONS: FilterOption[] = [
  { value: '', label: 'All Departments' },
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Human Resources', label: 'Human Resources' },
  { value: 'Sales', label: 'Sales' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Operations', label: 'Operations' },
  { value: 'Unassigned', label: 'Unassigned' },
];

// Defaults to Active so the tab opens on current staff only.
const STATUS_OPTIONS: FilterOption[] = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
  { value: '', label: 'All Statuses' },
];

const CV_BADGE: Record<string, string> = {
  'Up to Date': 'bg-green-100 text-green-700',
  'Needs Update': 'bg-red-100 text-red-700',
  'Pending Review': 'bg-yellow-100 text-yellow-700',
};

export default function AdminEmployeeManagePage() {
  const router = useRouter();
  const toast = useToast();
  const [users, setUsers] = useState<BackendUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('Active');
  const [adminName, setAdminName] = useState('Admin');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<EmployeeRecord | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
  // Holds the user awaiting confirmation, plus which way we are toggling them.
  const [pendingToggle, setPendingToggle] = useState<{ user: BackendUser; action: 'deactivate' | 'reactivate' } | null>(null);
  const [toggling, setToggling] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/users`, { headers: authHeaders() });
      if (res.status === 401 || res.status === 403) { router.push('/login'); return; }
      const data = await res.json();
      if (data.success) setUsers(data.data as BackendUser[]);
      else setError(data.message || 'Failed to load users');
    } catch (e: any) {
      setError(e.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setAdminName(getStoredName() || 'Admin');
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    let list = users;
    if (statusFilter === 'Active') list = list.filter(isActive);
    else if (statusFilter === 'Inactive') list = list.filter(u => !isActive(u));
    if (roleFilter) list = list.filter(u => u.role === roleFilter);
    if (deptFilter) list = list.filter(u => (u.department || 'Unassigned') === deptFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(u =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.department?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [users, search, roleFilter, deptFilter, statusFilter]);

  // Stat cards always describe *active* staff, so the numbers stay meaningful
  // even while the table is filtered to the inactive list.
  const activeUsers = useMemo(() => users.filter(isActive), [users]);
  const totalEmployees = activeUsers.filter(u => u.role === 'Employee').length;
  const totalManagers = activeUsers.filter(u => u.role === 'Manager').length;
  const inactiveCount = users.length - activeUsers.length;
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const recentJoins = activeUsers.filter(u => u.role !== 'Admin' && u.joinDate && new Date(u.joinDate).getTime() >= thirtyDaysAgo).length;
  const cvUpToDate = activeUsers.filter(u => u.cvUpdateStatus === 'Up to Date').length;

  const confirmToggle = async () => {
    if (!pendingToggle) return;
    const { user: target, action } = pendingToggle;
    setToggling(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${target._id}/${action}`, {
        method: 'PATCH',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!data.success) { toast.error(data.message || `Failed to ${action}`); return; }
      toast.success(
        action === 'deactivate'
          ? `"${target.name}" has been deactivated`
          : `"${target.name}" has been reactivated`
      );
      setPendingToggle(null);
      fetchUsers();
    } catch (e: any) {
      toast.error(`Network error: ${e.message}`);
    } finally {
      setToggling(false);
    }
  };

  const handleLogout = () => { clearAuth(); router.push('/login'); };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Admin': return <span className="bg-[#1a1a1a] text-white text-[11px] font-medium px-3 py-1 rounded-full">Admin</span>;
      case 'Manager': return <span className="bg-gray-200 text-gray-800 text-[11px] font-medium px-3 py-1 rounded-full">Manager</span>;
      default: return <span className="bg-white border border-gray-200 text-gray-700 text-[11px] font-medium px-3 py-1 rounded-full">Employee</span>;
    }
  };

  const toDetailsView = (u: BackendUser) => ({
    id: u._id,
    name: u.name,
    email: u.email,
    role: u.role,
    department: u.department || '—',
    position: u.position || '—',
    status: isActive(u) ? 'Active' : 'Inactive',
    deactivatedAt: u.deactivatedAt ? formatDate(u.deactivatedAt) : null,
    phone: u.phoneNumber || '—',
    location: u.homeAddress || '—',
    empId: u.employeeId || u._id.slice(-6).toUpperCase(),
    joinDate: u.joinDate ? formatDate(u.joinDate) : '—',
    leaveBalance: u.totalAnnualLeave ?? 0,
    attendance: 0,
    projects: 0,
    salary: '—',
    systemAccess: u.role === 'Admin' ? 'Full Superadmin' : u.role === 'Manager' ? 'Manager Level' : 'Standard Employee',
    lastLogin: u.updatedAt ? formatDate(u.updatedAt) : '—',
    maritalStatus: u.maritalStatus || '—',
    cvUpdateStatus: u.cvUpdateStatus || 'Needs Update',
    cvFile: u.cvFile || '',
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-10">
      <AdminNavi adminName={adminName} role="admin" onLogout={handleLogout} />
      <AdminTabs activeTab="Employees" />

      <main className="p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl p-4">{error}</div>
        )}

        {/* Employee Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-gray-500 font-medium">Total Employees</p>
              <Users size={18} className="text-gray-400" />
            </div>
            <p className="text-3xl font-semibold text-green-500">{loading ? '...' : totalEmployees}</p>
            <p className="text-[11px] text-gray-400 mt-1">Active employee accounts</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-gray-500 font-medium">Total Managers</p>
              <UserCheck size={18} className="text-gray-400" />
            </div>
            <p className="text-3xl font-semibold text-blue-600">{loading ? '...' : totalManagers}</p>
            <p className="text-[11px] text-gray-400 mt-1">Manager accounts</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-gray-500 font-medium">Recent Joins</p>
              <Clock size={18} className="text-gray-400" />
            </div>
            <p className="text-3xl font-semibold text-orange-400">{loading ? '...' : recentJoins}</p>
            <p className="text-[11px] text-gray-400 mt-1">Joined last 30 days</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-gray-500 font-medium">CVs Up to Date</p>
              <FileText size={18} className="text-gray-400" />
            </div>
            <p className="text-3xl font-semibold text-purple-500">{loading ? '...' : cvUpToDate}</p>
            <p className="text-[11px] text-gray-400 mt-1">Of {activeUsers.filter(u => u.role !== 'Admin').length} active staff</p>
          </div>

          <button
            type="button"
            onClick={() => setStatusFilter(statusFilter === 'Inactive' ? 'Active' : 'Inactive')}
            className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm text-left hover:border-gray-300 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-gray-500 font-medium">Inactive Accounts</p>
              <UserMinus size={18} className="text-gray-400" />
            </div>
            <p className="text-3xl font-semibold text-gray-500">{loading ? '...' : inactiveCount}</p>
            <p className="text-[11px] text-gray-400 mt-1">
              {statusFilter === 'Inactive' ? 'Showing — click to hide' : 'Click to view'}
            </p>
          </button>
        </div>

        {/* Employee Table */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 flex-1">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Employee Management</h2>
              <p className="text-sm text-gray-500">Create, update, and manage employees. Click a row to view full details.</p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#1a1a1a] hover:bg-black transition-colors text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium"
            >
              <UserPlus size={18} />
              Add Employee
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, email, or department..."
                className="w-full pl-11 pr-4 py-3 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 focus:bg-white text-sm text-gray-900 transition-colors outline-none"
              />
            </div>
            <FilterSelect options={STATUS_OPTIONS} value={statusFilter} onChange={setStatusFilter} placeholder="Active" className="w-full md:w-40" />
            <FilterSelect options={ROLE_OPTIONS} value={roleFilter} onChange={setRoleFilter} placeholder="All Roles" className="w-full md:w-44" />
            <FilterSelect options={DEPT_OPTIONS} value={deptFilter} onChange={setDeptFilter} placeholder="All Departments" className="w-full md:w-52" />
          </div>

          <div className="border border-gray-200 rounded-2xl overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-white">
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Name</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Email</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Role</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Department</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Marital Status</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">CV Status</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Account</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Joined</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((emp) => (
                  <tr
                    key={emp._id}
                    onClick={() => setSelectedEmployee(toDetailsView(emp))}
                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                      isActive(emp) ? 'bg-white' : 'bg-gray-50/60'
                    }`}
                  >
                    <td className={`py-4 px-6 text-sm font-medium whitespace-nowrap ${isActive(emp) ? 'text-gray-800' : 'text-gray-400'}`}>
                      {emp.name}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">{emp.email}</td>
                    <td className="py-4 px-6 whitespace-nowrap">{getRoleBadge(emp.role)}</td>
                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">{emp.department || '—'}</td>
                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">{emp.maritalStatus || '—'}</td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      {emp.cvUpdateStatus ? (
                        <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${CV_BADGE[emp.cvUpdateStatus] ?? 'bg-gray-100 text-gray-600'}`}>
                          {emp.cvUpdateStatus}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
                        isActive(emp) ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {isActive(emp) ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">{emp.joinDate ? formatDate(emp.joinDate) : '—'}</td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => setEditingUser({ _id: emp._id, name: emp.name, email: emp.email, role: emp.role, department: emp.department, position: emp.position, joinDate: emp.joinDate })}
                          className="border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil size={16} strokeWidth={2} />
                        </button>
                        {isActive(emp) ? (
                          <button
                            onClick={() => setPendingToggle({ user: emp, action: 'deactivate' })}
                            className="border border-red-200 text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                            title="Deactivate account"
                          >
                            <UserX size={16} strokeWidth={2} />
                          </button>
                        ) : (
                          <button
                            onClick={() => setPendingToggle({ user: emp, action: 'reactivate' })}
                            className="border border-green-200 text-green-700 hover:bg-green-50 p-1.5 rounded-lg transition-colors"
                            title="Reactivate account"
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
                    <td colSpan={9} className="py-8 text-center text-sm text-gray-500">
                      {statusFilter === 'Inactive'
                        ? 'No inactive accounts. Deactivated employees will appear here and can be reactivated.'
                        : 'No users found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <EmployeeModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSaved={fetchUsers} />
      <EmployeeModal isOpen={!!editingUser} onClose={() => setEditingUser(null)} existing={editingUser} onSaved={fetchUsers} />
      <AdminEmployeeDetailsModal
        isOpen={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        employee={selectedEmployee}
        onToggleStatus={(id, action) => {
          const target = users.find(u => u._id === id);
          if (target) {
            setSelectedEmployee(null);
            setPendingToggle({ user: target, action });
          }
        }}
      />
      <ConfirmModal
        isOpen={!!pendingToggle}
        title={pendingToggle?.action === 'reactivate' ? 'Reactivate this account?' : 'Deactivate this account?'}
        message={
          pendingToggle?.action === 'reactivate' ? (
            <>
              <span className="font-semibold text-gray-900">{pendingToggle?.user.name}</span> ({pendingToggle?.user.email}) will
              regain access to the system and reappear in the active employee list.
            </>
          ) : (
            <>
              <span className="font-semibold text-gray-900">{pendingToggle?.user.name}</span> ({pendingToggle?.user.email}) will
              lose access to the system and be hidden from the active list. Their attendance, leave and OT history is kept,
              and you can reactivate them at any time.
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
