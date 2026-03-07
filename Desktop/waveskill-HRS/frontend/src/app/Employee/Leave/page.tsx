"use client";

// 1. Import useState
import React, { useState } from 'react';
import EmployeeNavi from '../../../components/EmployeeNavi/EmployeeNavi';
import EmployeeTabs from '../../../components/EmployeeNavi/EmployeeTabs';
import { FileText, Calendar, Clock } from 'lucide-react';
// 2. Import the modal
import ApplyLeaveModal from '../../../components/Modals/ApplyLeaveModal';

export default function EmployeeLeavePage() {
  // 3. Add state variable
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    alert("Logged out!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <EmployeeNavi employeeName="Nithini Jayathilaka" onLogout={handleLogout} />
      <EmployeeTabs activeTab="Leave" />

      <main className="p-8 max-w-7xl mx-auto w-full flex-1 space-y-6">
        
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Leave Management</h2>
            <p className="text-sm text-gray-500">Check in and check out for today</p>
          </div>
          {/* 4. Update the onClick handler */}
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-blue-700 hover:bg-blue-800 transition-colors text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium"
          >
            <FileText size={18} />
            Apply for Leave
          </button>
        </div>

        {/* ... (Keep your existing Stats Grid here) ... */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Total Leaves</p>
            <p className="text-4xl font-semibold text-gray-900">3 days</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Approved</p>
            <p className="text-4xl font-semibold text-green-500">0 days</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Pending</p>
            <p className="text-4xl font-semibold text-orange-400">3 days</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Rejected</p>
            <p className="text-4xl font-semibold text-red-600">0</p>
          </div>
        </div>

        {/* ... (Keep your existing Leave History Table here) ... */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 overflow-hidden">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Leave History</h2>
            <p className="text-sm text-gray-500">Your leave requests and their status</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-3 px-4 text-sm font-semibold text-gray-800">Type</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-800">Duration</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-800">Days</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-800">Applied</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-800">Status</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-800">Reason</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-4">
                    <span className="bg-red-100 text-red-400 text-xs font-medium px-3 py-1 rounded-md">Sick</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} /> 1/10/2026 - 1/12/2026
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">3 days</td>
                  <td className="py-4 px-4 text-gray-400"><Clock size={16} /></td>
                  <td className="py-4 px-4">
                    <span className="bg-gray-200 text-gray-600 text-xs font-medium px-3 py-1 rounded-md">Pending</span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500">Medical appointment and recovery</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* 5. Add Modal Component at the bottom */}
      <ApplyLeaveModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}