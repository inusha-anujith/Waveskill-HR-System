"use client";

import React from 'react';
// Correctly routing up 3 levels to reach components
import EmployeeNavi from '../../../components/EmployeeNavi/EmployeeNavi';
import EmployeeTabs from '../../../components/EmployeeNavi/EmployeeTabs';
import { Calendar, Clock, MapPin } from 'lucide-react';

export default function EmployeeAttendancePage() {
  const handleLogout = () => {
    alert("Logged out!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-10">
      {/* Navigation & Tabs */}
      <EmployeeNavi employeeName="Nithini Jayathilaka" onLogout={handleLogout} />
      <EmployeeTabs activeTab="Attendance" />

      {/* Main Content */}
      <main className="p-8 max-w-7xl mx-auto w-full flex-1 space-y-6">
        
        {/* Mark Attendance Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Mark Attendance</h2>
            <p className="text-sm text-gray-500">Check in and check out for today</p>
          </div>
          
          {/* Blue Container */}
          <div className="bg-[#f0f4f8] rounded-2xl p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            
            {/* Left Side: Date & Time Cards */}
            <div className="flex-1 w-full">
              <p className="text-sm text-gray-500 mb-2">Today's Date</p>
              <div className="flex items-center gap-3 text-gray-900 mb-6">
                <Calendar size={22} strokeWidth={1.5} />
                <span className="text-2xl font-semibold">Sunday, January 11, 2026</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* Check In Box */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-sm text-gray-500 mb-2">Check In</p>
                  <div className="flex items-center gap-2 text-green-600 font-medium text-2xl">
                    <Clock size={24} /> 15:19:59
                  </div>
                </div>
                {/* Check Out Box */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-sm text-gray-500 mb-2">Check Out</p>
                  <div className="flex items-center gap-2 text-red-600 font-medium text-2xl">
                    <Clock size={24} /> Not yet
                  </div>
                </div>
              </div>

              {/* Status & IP */}
              <div className="flex items-center gap-4">
                <span className="bg-gray-200 text-gray-600 text-[11px] px-3 py-1 rounded-md font-semibold">
                  Late
                </span>
                <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                  <MapPin size={16} /> IP: 192.168.1.79
                </div>
              </div>
            </div>

            {/* Right Side: Current Time & Action Button */}
            <div className="flex flex-col items-end gap-6 w-full lg:w-auto mt-4 lg:mt-0 border-t lg:border-t-0 border-gray-200 pt-6 lg:pt-0">
              <div className="text-5xl font-normal text-gray-800 tracking-tight">
                4.55 AM
              </div>
              <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 font-semibold transition-colors w-full sm:w-auto">
                <Clock size={20} strokeWidth={2.5} /> 
                Check Out
              </button>
            </div>

          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Total Days</p>
            <p className="text-4xl font-semibold text-gray-900">3</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Present</p>
            <p className="text-4xl font-semibold text-green-500">2</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Late</p>
            <p className="text-4xl font-semibold text-orange-400">1</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Absent</p>
            <p className="text-4xl font-semibold text-red-600">0</p>
          </div>
        </div>

        {/* Attendance History Table */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 overflow-hidden">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Attendance History</h2>
            <p className="text-sm text-gray-500">Your recent attendance records</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-white">
                  <th className="py-4 px-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Date</th>
                  <th className="py-4 px-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Check In</th>
                  <th className="py-4 px-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Check Out</th>
                  <th className="py-4 px-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Work Hours</th>
                  <th className="py-4 px-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { date: '1/8/2026', in: '09:00:00', out: '18:00:00', hours: '9h 0m', status: 'Present' },
                  { date: '2/8/2026', in: '08:55:00', out: '17:55:00', hours: '9h 0m', status: 'Present' },
                  { date: '3/8/2026', in: '09:35:00', out: '17:55:00', hours: '8h 25m', status: 'Late' },
                  { date: '4/8/2026', in: '09:00:00', out: '18:00:00', hours: '9h 0m', status: 'Present' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors bg-white">
                    <td className="py-4 px-4 text-sm text-gray-500 font-medium whitespace-nowrap">{row.date}</td>
                    <td className="py-4 px-4 text-sm text-gray-500 whitespace-nowrap">{row.in}</td>
                    <td className="py-4 px-4 text-sm text-gray-500 whitespace-nowrap">{row.out}</td>
                    <td className="py-4 px-4 text-sm text-gray-500 whitespace-nowrap">{row.hours}</td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className={`text-[11px] font-medium px-3 py-1 rounded-md ${
                        row.status === 'Present' 
                          ? 'bg-[#1a1a1a] text-white' 
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}