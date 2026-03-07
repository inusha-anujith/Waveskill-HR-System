"use client";

import React from 'react';
import ManagerNavi from '../../../components/ManagerNavi/ManagerNavi';
import ManagerTabs from '../../../components/ManagerNavi/ManagerTabs';
import { Search, Calendar, ChevronDown, Download } from 'lucide-react';

export default function ManagerAttendancePage() {
  const handleLogout = () => {
    alert("Logged out!");
  };

  // Mock data matching the specific rows in your Figma design
  const attendanceRecords = [
    { id: 1, date: '1/08/2026', employee: 'John Doe', checkIn: '09:00:00', checkOut: '18:00:00', workHours: '', status: 'Present' },
    { id: 2, date: '1/08/2026', employee: 'Jane Smith', checkIn: '', checkOut: '18:10:00', workHours: '', status: 'Late' },
    { id: 3, date: '1/07/2026', employee: 'John Doe', checkIn: '', checkOut: '17:55:00', workHours: '9h 0m', status: 'Present' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Shared Navigation */}
      <ManagerNavi 
        managerName="Sarah Manager" 
        role="manager" 
        onLogout={handleLogout} 
      />
      <ManagerTabs activeTab="Attendance" />

      {/* Main Content */}
      <main className="p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">
        
        {/* Main Attendance Container */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 flex-1 flex flex-col">
          
          {/* Header Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Attendance Reports</h2>
            <p className="text-sm text-gray-500">View and monitor employee attendance records</p>
          </div>

          {/* Filters Section */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by employee name..."
                className="w-full pl-11 pr-4 py-3 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 focus:bg-white text-sm text-gray-900 transition-colors outline-none"
              />
            </div>

            {/* Date Picker (Visual Mockup) */}
            <div className="relative w-full md:w-48">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Calendar size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="mm/dd/yyyy"
                className="w-full pl-11 pr-4 py-3 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 focus:bg-white text-sm text-gray-900 transition-colors outline-none"
              />
            </div>

            {/* Status Dropdown (Visual Mockup) */}
            <div className="relative w-full md:w-48">
              <select className="w-full pl-4 pr-10 py-3 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 focus:bg-white text-sm text-gray-700 transition-colors outline-none appearance-none cursor-pointer">
                <option>All Status</option>
                <option>Present</option>
                <option>Late</option>
                <option>Absent</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <ChevronDown size={18} className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* Table Controls (Export & Count) */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500 font-medium">Showing {attendanceRecords.length} records</p>
            <button className="bg-[#1a1a1a] hover:bg-black transition-colors text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium">
              <Download size={16} />
              Export Report
            </button>
          </div>

          {/* Attendance Table */}
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
                    <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {attendanceRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50/50 transition-colors bg-white">
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar size={16} className="text-gray-400" />
                          {record.date}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">{record.employee}</td>
                      <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">{record.checkIn}</td>
                      <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">{record.checkOut}</td>
                      <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">{record.workHours}</td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className={`text-[11px] font-medium px-3 py-1 rounded-full ${
                          record.status === 'Present' 
                            ? 'bg-[#1a1a1a] text-white' 
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-auto">
            <div className="border border-gray-200 rounded-xl p-5">
              <p className="text-sm text-gray-500 mb-2">Total Present</p>
              <p className="text-3xl font-semibold text-green-500">3</p>
            </div>
            <div className="border border-gray-200 rounded-xl p-5">
              <p className="text-sm text-gray-500 mb-2">Late</p>
              <p className="text-3xl font-semibold text-orange-400">1</p>
            </div>
            <div className="border border-gray-200 rounded-xl p-5">
              <p className="text-sm text-gray-500 mb-2">Absences</p>
              <p className="text-3xl font-semibold text-red-500">0</p>
            </div>
            <div className="border border-gray-200 rounded-xl p-5">
              <p className="text-sm text-gray-500 mb-2">Half Days</p>
              <p className="text-3xl font-semibold text-gray-900">0</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}