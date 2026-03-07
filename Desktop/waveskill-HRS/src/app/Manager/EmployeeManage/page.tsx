"use client";

import React, { useState } from 'react';
import ManagerNavi from '../../../components/ManagerNavi/ManagerNavi';
import ManagerTabs from '../../../components/ManagerNavi/ManagerTabs';
import { Search, Pencil, UserX } from 'lucide-react';
// Import the new modal
import EmployeeDetailsModal from '../../../components/Modals/EmployeeDetailsModal';

export default function EmployeeManagePage() {
  // State for controlling the details modal
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);

  const handleLogout = () => {
    alert("Logged out!");
  };

  // Expanded mock data with additional professional HR details
  const employees = [
    { id: 1, name: 'Admin User', email: 'admin@company.com', role: 'Admin', department: 'Administration', position: 'System Administrator', status: 'Active', phone: '+1234567890', location: 'Colombo, Sri Lanka', empId: 'EMP-000001', joinDate: 'Jan 15, 2023', leaveBalance: 14, attendance: 98, projects: 0 },
    { id: 2, name: 'Sarah Manager', email: 'manager@company.com', role: 'Manager', department: 'Engineering', position: 'Engineering Manager', status: 'Active', phone: '+1234567891', location: 'Colombo, Sri Lanka', empId: 'EMP-000002', joinDate: 'Mar 10, 2023', leaveBalance: 10, attendance: 95, projects: 3 },
    { id: 3, name: 'John Doe', email: 'john@company.com', role: 'Employee', department: 'Engineering', position: 'Software Engineer', status: 'Active', phone: '+1234567892', location: 'Colombo, Sri Lanka', empId: 'EMP-000003', joinDate: 'Jun 01, 2024', leaveBalance: 20, attendance: 100, projects: 2 },
    { id: 4, name: 'Jane Smith', email: 'jane@company.com', role: 'Employee', department: 'Marketing', position: 'Marketing Specialist', status: 'Active', phone: '+1234567893', location: 'Kandy, Sri Lanka', empId: 'EMP-000004', joinDate: 'Sep 20, 2024', leaveBalance: 18, attendance: 92, projects: 4 },
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Admin':
        return <span className="bg-[#1a1a1a] text-white text-[11px] font-medium px-3 py-1 rounded-full">Admin</span>;
      case 'Manager':
        return <span className="bg-gray-200 text-gray-800 text-[11px] font-medium px-3 py-1 rounded-full">Manager</span>;
      case 'Employee':
        return <span className="bg-white border border-gray-200 text-gray-700 text-[11px] font-medium px-3 py-1 rounded-full">Employee</span>;
      default:
        return <span>{role}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <ManagerNavi 
        managerName="Sarah Manager" 
        role="manager" 
        onLogout={handleLogout} 
      />
      <ManagerTabs activeTab="Employees" />

      <main className="p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">
        
        <div className="bg-white rounded-2xl border border-gray-200 p-8 flex-1">
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Employee Management</h2>
            <p className="text-sm text-gray-500">Create, update, and manage employees. Click a row to view details.</p>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search employee name..."
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
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Status</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap text-center">Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {employees.map((emp) => (
                  <tr 
                    key={emp.id} 
                    onClick={() => setSelectedEmployee(emp)}
                    className="hover:bg-gray-50 transition-colors bg-white cursor-pointer"
                  >
                    <td className="py-4 px-6 text-sm text-gray-800 font-medium whitespace-nowrap">{emp.name}</td>
                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">{emp.email}</td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      {getRoleBadge(emp.role)}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">{emp.department}</td>
                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">{emp.position}</td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="bg-[#1a1a1a] text-white text-[11px] font-medium px-3 py-1 rounded-full">
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      {/* onClick with stopPropagation prevents the modal from opening when clicking edit/delete */}
                      <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button className="border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-100 p-1.5 rounded-lg transition-colors">
                          <Pencil size={16} strokeWidth={2} />
                        </button>
                        <button className="bg-red-600 text-white hover:bg-red-700 p-1.5 rounded-lg transition-colors">
                          <UserX size={16} strokeWidth={2} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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