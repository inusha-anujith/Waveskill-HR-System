"use client";

import React from 'react';
import { X, TrendingUp, Users, Calendar, AlertCircle } from 'lucide-react';

interface ChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  chartId: 'attendance' | 'leave' | 'department' | 'project' | null;
}

export default function ChartModal({ isOpen, onClose, chartId }: ChartModalProps) {
  if (!isOpen || !chartId) return null;

  const chartDetails = {
    attendance: { title: 'Attendance Overview', subtitle: 'Detailed monthly attendance analysis' },
    leave: { title: 'Leave Requests', subtitle: 'Comprehensive status and type distribution' },
    department: { title: 'Department Distribution', subtitle: 'Headcount and role breakdowns' },
    project: { title: 'Project Status', subtitle: 'In-depth project health and priority tracking' },
  };

  const { title, subtitle } = chartDetails[chartId];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans animate-in fade-in duration-200">
      <style>{`
        @keyframes pop-spin {
          0% { transform: scale(0.3) rotate(-180deg); opacity: 0; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes grow-up {
          0% { transform: scaleY(0); opacity: 0; }
          100% { transform: scaleY(1); opacity: 1; }
        }
        @keyframes slide-left {
          0% { transform: translateX(20px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        .animate-pop-spin {
          animation: pop-spin 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-grow-up {
          animation: grow-up 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          transform-origin: bottom;
        }
        .animate-slide-left {
          animation: slide-left 0.6s ease-out forwards;
        }
      `}</style>

      {/* Made the modal wider to accommodate the new details panel */}
      <div className="bg-white rounded-3xl w-full max-w-4xl p-10 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content Container: Split into Chart (Left) and Details (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* LEFT SIDE: Animated Chart */}
          <div className="flex items-center justify-center min-h-[300px] bg-gray-50/50 rounded-2xl border border-gray-100 p-8">
            
            {/* 1. ATTENDANCE CHART */}
            {chartId === 'attendance' && (
              <div className="relative flex items-center justify-center w-full h-full">
                <div 
                  className="w-56 h-56 rounded-full animate-pop-spin shadow-lg border-8 border-white"
                  style={{ background: 'conic-gradient(#22c55e 0% 67%, #eab308 67% 85%, #ef4444 85% 100%)' }}
                ></div>
                {/* Center hole for Donut Chart effect */}
                <div className="absolute w-32 h-32 bg-gray-50 rounded-full flex flex-col items-center justify-center animate-in fade-in zoom-in delay-500 fill-mode-both">
                  <span className="text-2xl font-bold text-gray-900">92%</span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">Avg Rate</span>
                </div>
              </div>
            )}

            {/* 2. LEAVE REQUESTS CHART */}
            {chartId === 'leave' && (
              <div className="w-full h-56 relative border-l-2 border-b-2 border-gray-200 ml-4 flex items-end justify-around pb-0">
                <div className="w-16 h-full bg-blue-500 relative z-10 animate-grow-up shadow-sm rounded-t-md" style={{ animationDelay: '0.1s' }}>
                  <span className="absolute -top-6 w-full text-center text-sm font-bold text-blue-600 animate-in fade-in delay-500 fill-mode-both">12</span>
                </div>
                <div className="w-16 h-[40%] bg-green-500 relative z-10 animate-grow-up shadow-sm rounded-t-md" style={{ animationDelay: '0.2s' }}>
                  <span className="absolute -top-6 w-full text-center text-sm font-bold text-green-600 animate-in fade-in delay-500 fill-mode-both">5</span>
                </div>
                <div className="w-16 h-[15%] bg-red-500 relative z-10 animate-grow-up shadow-sm rounded-t-md" style={{ animationDelay: '0.3s' }}>
                  <span className="absolute -top-6 w-full text-center text-sm font-bold text-red-600 animate-in fade-in delay-500 fill-mode-both">2</span>
                </div>
              </div>
            )}

            {/* 3. DEPARTMENT CHART */}
            {chartId === 'department' && (
              <div className="w-full h-56 relative border-l-2 border-b-2 border-gray-200 ml-4 flex items-end justify-around pb-0">
                <div className="w-20 h-full bg-[#10b981] relative z-10 animate-grow-up shadow-sm rounded-t-md" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-20 h-[60%] bg-[#059669] relative z-10 animate-grow-up shadow-sm rounded-t-md" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-20 h-[30%] bg-[#34d399] relative z-10 animate-grow-up shadow-sm rounded-t-md" style={{ animationDelay: '0.3s' }}></div>
              </div>
            )}

            {/* 4. PROJECT STATUS CHART */}
            {chartId === 'project' && (
              <div className="relative flex items-center justify-center w-full h-full">
                <div 
                  className="w-56 h-56 rounded-full animate-pop-spin shadow-lg border-8 border-white"
                  style={{ background: 'conic-gradient(#3b82f6 0% 50%, #10b981 50% 80%, #f59e0b 80% 100%)' }}
                ></div>
                <div className="absolute w-32 h-32 bg-gray-50 rounded-full flex flex-col items-center justify-center animate-in fade-in zoom-in delay-500 fill-mode-both">
                  <span className="text-2xl font-bold text-gray-900">10</span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">Projects</span>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDE: Detailed Insights Panel */}
          <div className="flex flex-col justify-center animate-slide-left" style={{ animationDelay: '0.4s', opacity: 0 }}>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-600" />
              Detailed Insights
            </h3>

            {/* Details for Attendance */}
            {chartId === 'attendance' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
                  <span className="flex items-center gap-2 text-sm font-medium text-green-700"><div className="w-3 h-3 rounded-full bg-green-500"></div> Present</span>
                  <span className="font-bold text-green-700">67% (140 Days)</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                  <span className="flex items-center gap-2 text-sm font-medium text-yellow-700"><div className="w-3 h-3 rounded-full bg-yellow-500"></div> Late Arrivals</span>
                  <span className="font-bold text-yellow-700">18% (38 Days)</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                  <span className="flex items-center gap-2 text-sm font-medium text-red-700"><div className="w-3 h-3 rounded-full bg-red-500"></div> Absent</span>
                  <span className="font-bold text-red-700">15% (32 Days)</span>
                </div>
                <p className="text-sm text-gray-500 mt-4 leading-relaxed bg-gray-50 p-4 rounded-xl">
                  Attendance is tracking <strong>4% higher</strong> than last month. Late arrivals peak on Monday mornings.
                </p>
              </div>
            )}

            {/* Details for Leave */}
            {chartId === 'leave' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <span className="flex items-center gap-2 text-sm font-medium text-blue-700"><Calendar size={16} /> Pending</span>
                  <span className="font-bold text-blue-700">12 Requests</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
                  <span className="flex items-center gap-2 text-sm font-medium text-green-700"><Calendar size={16} /> Approved</span>
                  <span className="font-bold text-green-700">5 Requests</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                  <span className="flex items-center gap-2 text-sm font-medium text-red-700"><Calendar size={16} /> Rejected</span>
                  <span className="font-bold text-red-700">2 Requests</span>
                </div>
                <div className="mt-4 flex gap-4 text-xs text-gray-500">
                  <div className="flex-1 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="block font-semibold text-gray-900 mb-1">Top Reason</span>
                    Sick Leave (65%)
                  </div>
                  <div className="flex-1 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="block font-semibold text-gray-900 mb-1">Avg Process Time</span>
                    1.2 Days
                  </div>
                </div>
              </div>
            )}

            {/* Details for Department */}
            {chartId === 'department' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <span className="flex items-center gap-2 text-sm font-medium text-gray-800"><div className="w-3 h-3 rounded-full bg-[#10b981]"></div> Engineering</span>
                  <div className="text-right">
                    <span className="block font-bold text-gray-900">12 Employees</span>
                    <span className="text-xs text-gray-500">8 Devs, 4 QA</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <span className="flex items-center gap-2 text-sm font-medium text-gray-800"><div className="w-3 h-3 rounded-full bg-[#059669]"></div> Marketing</span>
                  <div className="text-right">
                    <span className="block font-bold text-gray-900">8 Employees</span>
                    <span className="text-xs text-gray-500">5 Content, 3 SEO</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <span className="flex items-center gap-2 text-sm font-medium text-gray-800"><div className="w-3 h-3 rounded-full bg-[#34d399]"></div> Human Resources</span>
                  <span className="font-bold text-gray-900">4 Employees</span>
                </div>
              </div>
            )}

            {/* Details for Projects */}
            {chartId === 'project' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <span className="flex items-center gap-2 text-sm font-medium text-blue-700"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Active Projects</span>
                  <div className="text-right">
                    <span className="block font-bold text-blue-700">5 Total</span>
                    <span className="text-xs text-blue-500">3 High Priority</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
                  <span className="flex items-center gap-2 text-sm font-medium text-green-700"><div className="w-3 h-3 rounded-full bg-green-500"></div> Completed</span>
                  <span className="font-bold text-green-700">3 Total</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                  <span className="flex items-center gap-2 text-sm font-medium text-yellow-700"><div className="w-3 h-3 rounded-full bg-yellow-500"></div> On Hold</span>
                  <span className="font-bold text-yellow-700">2 Total</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl mt-4">
                  <AlertCircle size={16} className="text-orange-500 shrink-0 mt-0.5" />
                  <p><strong>HR Management System</strong> is currently behind schedule. Consider reallocating resources.</p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}