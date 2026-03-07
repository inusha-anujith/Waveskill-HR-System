"use client";

import React from 'react';
// Correctly routing up 3 levels: Announcement -> Employee -> app -> src -> components
import EmployeeNavi from '../../../components/EmployeeNavi/EmployeeNavi';
import EmployeeTabs from '../../../components/EmployeeNavi/EmployeeTabs';
import { AlertCircle } from 'lucide-react';

export default function EmployeeAnnouncementsPage() {
  const handleLogout = () => {
    // Implement your logout logic here
    alert("Logged out!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Navigation & Tabs */}
      <EmployeeNavi employeeName="Nithini Jayathilaka" onLogout={handleLogout} />
      <EmployeeTabs activeTab="Announcements" />

      {/* Main Content */}
      <main className="p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">
        
        {/* Announcements Main Container */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex-1">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Announcements</h2>
            <p className="text-sm text-gray-500">Important updates and notifications</p>
          </div>

          {/* Announcements List */}
          <div className="flex flex-col gap-5">
            
            {/* Urgent Announcement Card */}
            <div className="bg-red-50 border border-red-100 rounded-xl p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-gray-900 font-medium">
                <AlertCircle size={20} />
                <span>Holiday Notice - January 26</span>
              </div>
              
              <div>
                <span className="bg-red-600 text-white text-xs font-medium px-2.5 py-1 rounded-md">
                  Urgent
                </span>
              </div>
              
              <p className="text-gray-800 text-sm mt-1">
                Please note that January 26 is a public holiday. The office will be closed.
              </p>
              
              <hr className="border-red-100 my-2" />
              
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Posted by Admin User</span>
                <span>January 7, 2026</span>
              </div>
            </div>

            {/* Important Announcement Card */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-gray-900 font-medium">
                <AlertCircle size={20} />
              </div>
              
              <div>
                <span className="bg-black text-white text-xs font-medium px-2.5 py-1 rounded-md">
                  Important
                </span>
              </div>
              
              <p className="text-gray-800 text-sm mt-1">
                We are pleased to introduce our new HR management platform. Please explore all the features available to you.
              </p>
              
              <hr className="border-blue-100 my-2" />
              
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Posted by Admin User</span>
                <span>January 1, 2026</span>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Total Announcements</p>
            <p className="text-4xl font-semibold text-gray-900">3</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Urgent</p>
            <p className="text-4xl font-semibold text-red-600">1</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Important</p>
            <p className="text-4xl font-semibold text-blue-600">1</p>
          </div>
        </div>

      </main>
    </div>
  );
}