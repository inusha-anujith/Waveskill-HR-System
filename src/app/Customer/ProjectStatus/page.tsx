"use client";

import React, { useState } from 'react';
import { 
  LogOut, 
  LayoutGrid, 
  Bell, 
  MessageCircle,
  ClipboardList,
  Search,
  Calendar,
  ChevronDown,
  Download,
  CheckCircle2,
  Timer,
  AlertCircle 
} from 'lucide-react';

export default function ProjectStatus() {
  const [activeTab, setActiveTab] = useState('Project Status');

  const handleLogout = () => {
    alert("Logged out!");
  };

  const navItems = [
    { name: 'Project Status', icon: <ClipboardList size={18} /> },
    { name: 'Projects', icon: <LayoutGrid size={18} /> },
    { name: 'Announcements', icon: <Bell size={18} /> },
    { name: 'Chat Box', icon: <MessageCircle size={18} /> },
  ];

  // Mock data for the table
  const projectRecords = [
    { id: 1, name: 'E-commerce Platform', manager: 'Sarah Jenkins', deadline: '05/12/2026', progress: 75, status: 'On Track' },
    { id: 2, name: 'Mobile App UI/UX', manager: 'Jane Smith', deadline: '03/15/2026', progress: 40, status: 'In Progress' },
    { id: 3, name: 'API Integration', manager: 'John Doe', deadline: '02/20/2026', progress: 95, status: 'Delayed' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-slate-900">
      {/* 1. TOP HEADER SECTION */}
      <header className="px-8 py-6 flex items-center justify-between border-b border-slate-100 bg-white">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">WaveSkill</h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome, <span className="font-medium text-slate-600">Customer Name</span>
          </p>
        </div>

        <button 
          onClick={handleLogout}
          className="flex cursor-pointer items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
        >
          <LogOut size={18} className="text-slate-600" />
          <span>Logout</span>
        </button>
      </header>

      {/* 2. NAVIGATION TABS SECTION */}
      <nav className="px-8 py-4 flex flex-wrap items-center gap-2 border-b border-slate-100 bg-white shadow-sm">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveTab(item.name)}
            className={`
              flex cursor-pointer items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all
              ${activeTab === item.name 
                ? 'bg-[#f1f5f9] text-[#0f172a]' 
                : 'bg-transparent text-slate-500 hover:text-slate-800'
              }
            `}
          >
            <span className={activeTab === item.name ? 'text-[#0f172a]' : 'text-slate-400'}>
              {item.icon}
            </span>
            {item.name}
          </button>
        ))}
      </nav>

      {/* 3. MAIN PROJECT STATUS CONTENT */}
      <main className="p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">
        
        {/* Project Status Container (Matches Attendance Page Style) */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 flex-1 flex flex-col shadow-sm">
          
          {/* Internal Header */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Project Status</h2>
            <p className="text-sm text-gray-500">Monitor your current project milestones and health</p>
          </div>

          {/* Filters Section */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by project name..."
                className="w-full pl-11 pr-4 py-3 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 focus:bg-white text-sm text-gray-900 transition-colors outline-none font-medium"
              />
            </div>

            <div className="relative w-full md:w-48">
              <select className="w-full pl-4 pr-10 py-3 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 focus:bg-white text-sm text-gray-700 transition-colors outline-none appearance-none cursor-pointer font-medium">
                <option>All Status</option>
                <option>On Track</option>
                <option>In Progress</option>
                <option>Delayed</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <ChevronDown size={18} className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* Table Controls */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500 font-medium">Showing {projectRecords.length} projects</p>
            <button className="bg-[#1a1a1a] hover:bg-black transition-colors text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium">
              <Download size={16} />
              Export Report
            </button>
          </div>

          {/* Table */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-white">
                    <th className="py-4 px-6 text-sm font-semibold text-gray-900">Project Name</th>
                    <th className="py-4 px-6 text-sm font-semibold text-gray-900">Manager</th>
                    <th className="py-4 px-6 text-sm font-semibold text-gray-900">Deadline</th>
                    <th className="py-4 px-6 text-sm font-semibold text-gray-900">Progress</th>
                    <th className="py-4 px-6 text-sm font-semibold text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {projectRecords.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 text-sm text-gray-900">{project.name}</td>
                      <td className="py-4 px-6 text-sm text-gray-500">{project.manager}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar size={16} className="text-gray-400" />
                          {project.deadline}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 min-w-[100px] bg-gray-100 rounded-full h-1.5">
                            <div className="bg-[#1a1a1a] h-full" style={{ width: `${project.progress}%` }} />
                          </div>
                          <span className="text-xs text-gray-600">{project.progress}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 w-fit ${
                          project.status === 'On Track' 
                            ? 'bg-[#1a1a1a] text-white' 
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          {project.status === 'On Track' && <CheckCircle2 size={12} />}
                          {project.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-auto">
            <StatCard label="Ongoing" value="2" />
            <StatCard label="Avg. Progress" value="70%" color="text-blue-500" />
            <StatCard label="Risks" value="1" color="text-red-500" />
            <StatCard label="Completed" value="12" color="text-green-500" />
          </div>
        </div>
      </main>
    </div>
  );
}

// Stats Helper Component
function StatCard({ label, value, color = "text-gray-900" }: { label: string, value: string, color?: string }) {
  return (
    <div className="border border-gray-200 rounded-xl p-5">
      <p className="text-sm text-gray-500 mb-2 font-medium">{label}</p>
      <p className={`text-3xl font-semibold ${color}`}>{value}</p>
    </div>
  );
}