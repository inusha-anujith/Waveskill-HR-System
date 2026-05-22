"use client";

import { useState } from 'react';
import { Briefcase, ArrowRight } from 'lucide-react';

export default function DashboardHomePage() {
  // Mock State for Customer Welcome Identification Data
  const customerName = "Kaushalya";

  // Mock Data arrays combining states from different modules for quick access rendering
  const activeProjects = [
    { name: "Hotel Website Redesign", progress: 70, status: "Ongoing", color: "bg-blue-600" },
    { name: "HR Dashboard UI Concept", progress: 40, status: "Ongoing", color: "bg-amber-500" }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* --- WELCOME HERO BANNER BAR --- */}
      <div className="bg-black text-white p-6 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-black">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, {customerName} 👋</h1>
          <p className="text-gray-400 text-sm">Here is a centralized snapshot overview monitoring your ongoing development pipeline.</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 shrink-0 self-start sm:self-center">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-semibold text-gray-300">Staging Servers Operational</span>
        </div>
      </div>

      {/* --- ACTIVE PROJECTS PROGRESSION CONTAINER --- */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 space-y-4">
        <div className="flex justify-between items-center px-0.5">
          <div className="space-y-0.5">
            <h3 className="font-bold text-black text-base tracking-tight">Active Projects Progression</h3>
            <p className="text-xs text-gray-500">Real-time compilation meters from ongoing tracking timelines</p>
          </div>
          <button className="text-xs font-bold text-gray-400 hover:text-black flex items-center gap-1 group transition-colors shrink-0">
            View All <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Loop rendering the active progress trackers bars */}
        <div className="grid grid-cols-1 gap-3 pt-1">
          {activeProjects.map((project, idx) => (
            <div key={idx} className="p-4 border border-gray-100 rounded-xl bg-gray-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="p-2.5 bg-white border border-gray-200 text-gray-600 rounded-lg shrink-0">
                  <Briefcase size={16} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-black truncate">{project.name}</h4>
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mt-0.5">{project.status}</p>
                </div>
              </div>
              
              {/* Progress Bar & Percentage Layout Wrapper */}
              <div className="w-full sm:w-64 flex items-center gap-4 shrink-0">
                <div className="w-full bg-gray-100 h-2 border border-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${project.color} transition-all duration-500`}
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <span className="text-xs font-bold text-gray-900 w-9 text-right bg-white border border-gray-150 px-2 py-0.5 rounded shadow-sm">{project.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}