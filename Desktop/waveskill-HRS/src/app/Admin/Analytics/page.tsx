"use client";

import React, { useState } from 'react';
// Going up 3 levels: Analytics -> Admin -> app -> src -> components
import AdminNavi from '../../../components/AdminNavi/AdminNavi';
import AdminTabs from '../../../components/AdminNavi/AdminTabs';
import { Users, Activity, FileText, LayoutGrid } from 'lucide-react';
// 1. Import the Chart Modal we built earlier!
import ChartModal from '../../../components/Modals/ChartModal';

export default function AdminAnalyticsPage() {
  // 2. Add state to track which chart is currently clicked/open
  const [activeChart, setActiveChart] = useState<'attendance' | 'leave' | 'department' | 'project' | null>(null);

  const handleLogout = () => {
    alert("Logged out!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-10">
      {/* Imported Shared Navigation */}
      <AdminNavi 
        adminName="Admin User" 
        role="admin" 
        onLogout={handleLogout} 
      />
      <AdminTabs activeTab="Analytics" />

      {/* Main Dashboard Content */}
      <main className="p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">
        
        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Stat 1 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-gray-500 font-medium">Active Employees</p>
              <Users size={18} className="text-gray-400" />
            </div>
            <p className="text-4xl font-semibold text-green-500 mb-2">3</p>
            <p className="text-[11px] text-gray-400">Total registered users</p>
          </div>
          
          {/* Stat 2 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-gray-500 font-medium">Attendance Rate</p>
              <Activity size={18} className="text-gray-400" />
            </div>
            <p className="text-4xl font-semibold text-blue-600 mb-2">100%</p>
            <p className="text-[11px] text-gray-400">This Month</p>
          </div>

          {/* Stat 3 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-gray-500 font-medium">Pending Leaves</p>
              <FileText size={18} className="text-gray-400" />
            </div>
            <p className="text-4xl font-semibold text-gray-900 mb-2">100%</p>
            <p className="text-[11px] text-gray-400">Awaiting approval</p>
          </div>

          {/* Stat 4 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-gray-500 font-medium">Active Projects</p>
              <LayoutGrid size={18} className="text-gray-400" />
            </div>
            <p className="text-4xl font-semibold text-orange-400 mb-2">2</p>
            <p className="text-[11px] text-gray-400">Total registered users</p>
          </div>
        </div>

        {/* Charts Grid - Now Interactive! */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Chart 1: Attendance Overview */}
          <div 
            onClick={() => setActiveChart('attendance')}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col min-h-[300px] cursor-pointer hover:shadow-md hover:border-gray-300 transition-all group"
          >
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Attendance Overview</h3>
            <p className="text-[11px] text-gray-500 mb-8">Monthly attendance distribution</p>
            <div className="flex-1 flex items-center justify-center relative">
              <div 
                className="w-40 h-40 rounded-full group-hover:scale-105 transition-transform duration-300"
                style={{ background: 'conic-gradient(#22c55e 0% 67%, #eab308 67% 100%)' }}
              ></div>
              <span className="absolute left-10 top-8 text-xs font-medium text-green-500">Present: 67%</span>
              <span className="absolute right-12 bottom-4 text-xs font-medium text-yellow-500">Late: 33%</span>
              <span className="absolute right-4 top-20 text-xs font-medium text-purple-400 opacity-50">Absent: 0%</span>
            </div>
          </div>

          {/* Chart 2: Leave Requests */}
          <div 
            onClick={() => setActiveChart('leave')}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col min-h-[300px] cursor-pointer hover:shadow-md hover:border-gray-300 transition-all group"
          >
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Leave Requests</h3>
            <p className="text-[11px] text-gray-500 mb-6">Status distribution</p>
            <div className="flex-1 relative border-l border-b border-gray-200 ml-6 mt-4 flex items-end justify-around pb-0">
              <div className="absolute -left-6 top-0 text-[10px] text-gray-400">1</div>
              <div className="absolute -left-8 top-1/4 text-[10px] text-gray-400">0.75</div>
              <div className="absolute -left-6 top-1/2 text-[10px] text-gray-400">0.5</div>
              <div className="absolute -left-8 top-3/4 text-[10px] text-gray-400">0.25</div>
              <div className="absolute -left-4 bottom-0 text-[10px] text-gray-400">0</div>
              
              <div className="absolute w-full border-t border-dashed border-gray-100 top-1/4"></div>
              <div className="absolute w-full border-t border-dashed border-gray-100 top-1/2"></div>
              <div className="absolute w-full border-t border-dashed border-gray-100 top-3/4"></div>

              <div className="w-16 h-full bg-blue-500 relative z-10 group-hover:bg-blue-600 transition-colors"></div>
              <div className="w-16 h-full bg-blue-500 relative z-10 group-hover:bg-blue-600 transition-colors"></div>
              <div className="w-16 h-0 bg-transparent relative z-10"></div>
            </div>
            <div className="flex justify-around ml-6 mt-2 text-[11px] text-gray-500">
              <span className="w-16 text-center">Pending</span>
              <span className="w-16 text-center">Approved</span>
              <span className="w-16 text-center">Rejected</span>
            </div>
          </div>

          {/* Chart 3: Department Distribution */}
          <div 
            onClick={() => setActiveChart('department')}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col min-h-[300px] cursor-pointer hover:shadow-md hover:border-gray-300 transition-all group"
          >
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Department Distribution</h3>
            <p className="text-[11px] text-gray-500 mb-6">Employees by department</p>
            <div className="flex-1 relative border-l border-b border-gray-200 ml-4 mt-4 flex items-end justify-around pb-0">
               <div className="absolute -left-4 top-0 text-[10px] text-gray-400">2</div>
               <div className="absolute -left-6 top-1/4 text-[10px] text-gray-400">1.5</div>
               <div className="absolute -left-4 top-1/2 text-[10px] text-gray-400">1</div>
               <div className="absolute -left-6 top-3/4 text-[10px] text-gray-400">0.5</div>
               <div className="absolute -left-4 bottom-0 text-[10px] text-gray-400">0</div>

               <div className="absolute w-full border-t border-dashed border-gray-100 top-1/4"></div>
               <div className="absolute w-full border-t border-dashed border-gray-100 top-1/2"></div>
               <div className="absolute w-full border-t border-dashed border-gray-100 top-3/4"></div>

               <div className="w-24 h-full bg-[#10b981] relative z-10 group-hover:bg-[#059669] transition-colors"></div>
               <div className="w-24 h-1/2 bg-[#10b981] relative z-10 group-hover:bg-[#059669] transition-colors"></div>
            </div>
            <div className="flex justify-around ml-4 mt-2 text-[11px] text-gray-500">
              <span className="w-24 text-center">Engineering</span>
              <span className="w-24 text-center">Marketing</span>
            </div>
          </div>

          {/* Chart 4: Project Status */}
          <div 
            onClick={() => setActiveChart('project')}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col min-h-[300px] cursor-pointer hover:shadow-md hover:border-gray-300 transition-all group"
          >
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Project Status</h3>
            <p className="text-[11px] text-gray-500 mb-8">Project distribution by status</p>
            <div className="flex-1 flex items-center justify-center relative">
              <div className="w-32 h-32 rounded-full bg-blue-500 group-hover:scale-105 transition-transform duration-300"></div>
              <div className="absolute w-16 border-t border-blue-300 right-1/2 top-1/2 transform translate-x-1/2"></div>
              <span className="absolute left-1/4 top-1/2 text-[11px] font-medium text-blue-500 -translate-y-1/2 bg-white px-1">Active: 2</span>
            </div>
          </div>
        </div>

        {/* Employee Availability List */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mt-2">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Employee Availability</h3>
            <p className="text-[11px] text-gray-500">Current status overview</p>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Sarah Manager', role: 'Engineering Manager', status: 'Not Checked In' },
              { name: 'John Doe', role: 'Software Engineer', status: 'Not Checked In' },
              { name: 'Jane Smith', role: 'Marketing Specialist', status: 'Not Checked In' },
            ].map((emp, i) => (
              <div key={i} className="bg-[#f9fafb] border border-gray-100 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">{emp.name}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{emp.role}</p>
                </div>
                <span className="text-xs text-gray-500 font-medium">{emp.status}</span>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* 3. Render the Modal conditionally at the bottom */}
      <ChartModal 
        isOpen={!!activeChart} 
        onClose={() => setActiveChart(null)} 
        chartId={activeChart} 
      />
    </div>
  );
}