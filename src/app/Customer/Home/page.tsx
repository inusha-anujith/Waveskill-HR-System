"use client";

import CustomerNavi from '../../../components/CustomerNavi/CustomerNavi';
import CustomerTabs from '../../../components/CustomerNavi/CustomerTabs';

import { Briefcase, ArrowRight } from 'lucide-react';

export default function CustomerHomePage() {

  const handleLogout = () => {
    alert("Logged out!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-10">
      {/* Imported Shared Navigation */}
      <CustomerNavi 
        customerName="Customer User" 
        role="user" 
        onLogout={handleLogout} 
      />
      <CustomerTabs activeTab="Home" />

      {/* Main Dashboard Content */}
      <main className="p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">
        
        {/* Welcome Banner Card */}
        <div className="bg-black text-white rounded-2xl p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              Welcome back, Kaushalya <span className="animate-pulse">👋</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Here is a centralized snapshot overview monitoring your ongoing development pipeline.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#121824] border border-gray-800 px-3 py-1.5 rounded-full self-start md:self-center">
            <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
            <span className="text-xs text-gray-300 font-medium">Staging Servers Operational</span>
          </div>
        </div>

        {/* Active Projects Progression Container */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col gap-5">
          {/* Header section */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Active Projects Progression</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Real-time compilation meters from ongoing tracking timelines
              </p>
            </div>
            <button className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors">
              View All <ArrowRight size={14} />
            </button>
          </div>

          {/* Project List */}
          <div className="flex flex-col gap-4">
            
            {/* Project 1: Hotel Website Redesign */}
            <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50/50 transition-colors">
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-600">
                <Briefcase size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-gray-900 truncate">Hotel Website Redesign</h3>
                <span className="text-[10px] font-bold text-gray-400 tracking-wider block mt-0.5">ONGOING</span>
              </div>
              <div className="flex items-center gap-4 w-full max-w-[300px] md:max-w-[400px]">
                {/* Custom Progress Bar */}
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#1D4ED8] h-full rounded-full" style={{ width: '70%' }}></div>
                </div>
                <div className="border border-gray-300 px-2 py-0.5 rounded text-xs font-bold text-gray-900 bg-white">
                  70%
                </div>
              </div>
            </div>

            {/* Project 2: HR Dashboard UI Concept */}
            <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50/50 transition-colors">
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-600">
                <Briefcase size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-gray-900 truncate">HR Dashboard UI Concept</h3>
                <span className="text-[10px] font-bold text-gray-400 tracking-wider block mt-0.5">ONGOING</span>
              </div>
              <div className="flex items-center gap-4 w-full max-w-[300px] md:max-w-[400px]">
                {/* Custom Progress Bar */}
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#EA580C] h-full rounded-full" style={{ width: '40%' }}></div>
                </div>
                <div className="border border-gray-300 px-2 py-0.5 rounded text-xs font-bold text-gray-900 bg-white">
                  40%
                </div>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}