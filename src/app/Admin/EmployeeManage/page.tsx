"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavi from '../../../components/AdminNavi/AdminNavi';
import AdminTabs from '../../../components/AdminNavi/AdminTabs';
import { Search, Pencil, UserX, UserPlus } from 'lucide-react';
import EmployeeModal, { EmployeeRecord } from '../../../components/Modals/EmployeeModal';
import AdminEmployeeDetailsModal from '../../../components/Modals/AdminEmployeeDetailsModal';
import ConfirmModal from '../../../components/Modals/ConfirmModal';
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
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminEmployeeManagePage() {
  const router = useRouter();
  const toast = useToast();
  const [users, setUsers] = useState<BackendUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [adminName, setAdminName] = useState('Admin');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<EmployeeRecord | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
  const [pendingDelete, setPendingDelete] = useState<BackendUser | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/users`, { headers: authHeaders() });
      if (res.status === 401 || res.status === 403) {
        router.push('/login');
        return;
      }
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
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(u =>
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.department?.toLowerCase().includes(q)
    );
  }, [users, search]);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const target = pendingDelete;
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${target._id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message || 'Failed to delete');
        return;
      }
      toast.success(`Employee "${target.name}" removed`);
      setPendingDelete(null);
      fetchUsers();
    } catch (e: any) {
      toast.error(`Network error: ${e.message}`);
    } finally {
      setDeleting(false);
    }
  };

  const handleResetPassword = async (id: string) => {
    const pwd = window.prompt('Enter new password (min 6 chars):');
    if (!pwd) return;
    if (pwd.length < 6) { alert('Password must be at least 6 characters'); return; }
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ password: pwd }),
      });
      const data = await res.json();
      if (!data.success) { alert(data.message || 'Failed to reset password'); return; }
      alert('Password reset successfully');
    } catch (e: any) {
      alert(`Network error: ${e.message}`);
    }
  };

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Admin': return <span className="bg-[#1a1a1a] text-white text-[11px] font-medium px-3 py-1 rounded-full">Admin</span>;
      case 'Manager': return <span className="bg-gray-200 text-gray-800 text-[11px] font-medium px-3 py-1 rounded-full">Manager</span>;
      case 'Employee': return <span className="bg-white border border-gray-200 text-gray-700 text-[11px] font-medium px-3 py-1 rounded-full">Employee</span>;
      default: return <span>{role}</span>;
    }
  };

  const toDetailsView = (u: BackendUser) => ({
    id: u._id,
    name: u.name,
    email: u.email,
    role: u.role,
    department: u.department || '—',
    position: u.position || '—',
    status: 'Active',
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
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-10">
      <AdminNavi adminName={adminName} role="admin" onLogout={handleLogout} />
      <AdminTabs activeTab="Employees" />

      <main className="p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl p-4">
            {error}
          </div>
        )}

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

          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or department..."
              className="w-full pl-11 pr-4 py-3 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 focus:bg-white text-sm text-gray-900 transition-colors outline-none"
            />
          </div>

          <div className="border border-gray-200 rounded-2xl overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-white">
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Name</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Email</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Role</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Department</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Position</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Joined</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((emp) => (
                  <tr
                    key={emp._id}
                    onClick={() => setSelectedEmployee(toDetailsView(emp))}
                    className="hover:bg-gray-50 transition-colors bg-white cursor-pointer"
                  >
                    <td className="py-4 px-6 text-sm text-gray-800 font-medium whitespace-nowrap">{emp.name}</td>
                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">{emp.email}</td>
                    <td className="py-4 px-6 whitespace-nowrap">{getRoleBadge(emp.role)}</td>
                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">{emp.department || '—'}</td>
                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">{emp.position || '—'}</td>
                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">{emp.joinDate ? formatDate(emp.joinDate) : '—'}</td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setEditingUser({
                            _id: emp._id,
                            name: emp.name,
                            email: emp.email,
                            role: emp.role,
                            department: emp.department,
                            position: emp.position,
                            joinDate: emp.joinDate,
                          })}
                          className="border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil size={16} strokeWidth={2} />
                        </button>
                        <button
                          onClick={() => setPendingDelete(emp)}
                          className="bg-red-600 text-white hover:bg-red-700 p-1.5 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <UserX size={16} strokeWidth={2} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-sm text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </main>

      <EmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSaved={fetchUsers}
      />

      <EmployeeModal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        existing={editingUser}
        onSaved={fetchUsers}
      />

      <AdminEmployeeDetailsModal
        isOpen={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        employee={selectedEmployee}
        onResetPassword={(id: string) => handleResetPassword(id)}
      />

      <ConfirmModal
        isOpen={!!pendingDelete}
        title="Delete employee?"
        message={
          <>
            This will permanently remove{' '}
            <span className="font-semibold text-gray-900">{pendingDelete?.name}</span>{' '}
            ({pendingDelete?.email}) from the system. This action cannot be undone.
          </>
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        busy={deleting}
        onClose={() => { if (!deleting) setPendingDelete(null); }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
