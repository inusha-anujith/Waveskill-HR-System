"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ManagerNavi from '../../../components/ManagerNavi/ManagerNavi';
import ManagerTabs from '../../../components/ManagerNavi/ManagerTabs';
import { Search } from 'lucide-react';
import EmployeeDetailsModal from '../../../components/Modals/EmployeeDetailsModal';
import Avatar from '../../../components/Avatar/Avatar';
import SearchHint from '../../../components/FilterSelect/SearchHint';
import FilterSelect, { FilterOption } from '../../../components/FilterSelect/FilterSelect';
import { useDebouncedSearch, useLatestRequest, isAbortError } from '../../../hooks/useDebouncedSearch';
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
  joinDate?: string;
  totalAnnualLeave?: number;
  profilePhoto?: string;
  status?: 'Active' | 'Inactive';
}

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

const isActive = (u: { status?: string }) => u.status !== 'Inactive';

export default function EmployeeManagePage() {
  const router = useRouter();

  // This page previously rendered a hardcoded array with a search box that had
  // no state behind it. It now reads the same API the Admin tab uses, with the
  // search and department filters applied server-side.
  const [employees, setEmployees] = useState<BackendUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [managerName, setManagerName] = useState('Manager');
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
  const [deptFilter, setDeptFilter] = useState('');

  const search = useDebouncedSearch();
  const nextSignal = useLatestRequest();

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ status: 'Active' });
      if (search.term) params.set('search', search.term);
      if (deptFilter) params.set('department', deptFilter);

      const res = await fetch(`${API_BASE}/api/admin/users?${params}`, {
        headers: authHeaders(),
        signal: nextSignal(),
      });
      if (res.status === 401 || res.status === 403) { router.push('/login'); return; }
      const data = await res.json();
      if (data.success) {
        setEmployees(data.data as BackendUser[]);
        setError(null);
      } else {
        setError(data.message || 'Failed to load employees');
      }
    } catch (e: any) {
      if (isAbortError(e)) return;
      setError(e.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { setManagerName(getStoredName() || 'Manager'); }, []);

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.term, deptFilter]);

  const handleLogout = () => { clearAuth(); router.push('/login'); };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Admin':
        return <span className="bg-[#1a1a1a] text-white text-[11px] font-medium px-3 py-1 rounded-full">Admin</span>;
      case 'Manager':
        return <span className="bg-gray-200 text-gray-800 text-[11px] font-medium px-3 py-1 rounded-full">Manager</span>;
      default:
        return <span className="bg-white border border-gray-200 text-gray-700 text-[11px] font-medium px-3 py-1 rounded-full">Employee</span>;
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
    phone: u.phoneNumber || '—',
    location: '—',
    empId: u.employeeId || u._id.slice(-6).toUpperCase(),
    joinDate: u.joinDate ? formatDate(u.joinDate) : '—',
    leaveBalance: u.totalAnnualLeave ?? 0,
    attendance: 0,
    projects: 0,
    profilePhoto: u.profilePhoto || '',
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <ManagerNavi managerName={managerName} role="manager" onLogout={handleLogout} />
      <ManagerTabs activeTab="Employees" />

      <main className="p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl p-4">{error}</div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 p-8 flex-1">

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Employee Directory</h2>
            <p className="text-sm text-gray-500">View team members and their details. Click a row to view full details.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={search.value}
                onChange={e => search.setValue(e.target.value)}
                placeholder="Search by name, email, or employee ID..."
                className="w-full pl-11 pr-4 py-3 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 focus:bg-white text-sm text-gray-900 transition-colors outline-none"
              />
              <SearchHint belowMinimum={search.belowMinimum} pending={search.pending} />
            </div>
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
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Position</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {employees.map((emp) => (
                  <tr
                    key={emp._id}
                    onClick={() => setSelectedEmployee(toDetailsView(emp))}
                    className="hover:bg-gray-50 transition-colors bg-white cursor-pointer"
                  >
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Avatar name={emp.name} photo={emp.profilePhoto} size={36} />
                        <span className="text-sm text-gray-800 font-medium">{emp.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">{emp.email}</td>
                    <td className="py-4 px-6 whitespace-nowrap">{getRoleBadge(emp.role)}</td>
                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">{emp.department || '—'}</td>
                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">{emp.position || '—'}</td>
                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">{emp.joinDate ? formatDate(emp.joinDate) : '—'}</td>
                  </tr>
                ))}
                {!loading && employees.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-sm text-gray-500">No employees found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </main>

      {/* Details Modal Component */}
      <EmployeeDetailsModal
        isOpen={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        employee={selectedEmployee}
      />
    </div>
  );
}
