"use client";

import React, { useState, useEffect } from 'react';
import EmployeeNavi from '../../../components/EmployeeNavi/EmployeeNavi';
import EmployeeTabs from '../../../components/EmployeeNavi/EmployeeTabs';
import { Plus, X, Calendar as CalendarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EmployeeLeavePage() {
  const router = useRouter();

  // Page State
  const [leaveRecords, setLeaveRecords] = useState<any[]>([]);
  
  // Updated to match the backend 'stats' object structure perfectly
  const [stats, setStats] = useState({ 
      totalDays: 0, 
      approvedDays: 0, 
      pendingDays: 0, 
      rejectedDays: 0 
  });
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  // 1. Fetch Leave History
  const fetchMyLeaves = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch("http://localhost:5001/api/leave/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const responseData = await res.json();
      
      if (responseData.success) {
        // 🚨 Exact Match: Looking for 'history' and 'stats'
        const recordsArray = responseData.history || [];
        
        // Sort newest first based on createdAt
        const sortedRecords = recordsArray.sort((a: any, b: any) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        setLeaveRecords(sortedRecords);

        if (responseData.stats) {
            setStats(responseData.stats);
        }
      }
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  useEffect(() => {
    fetchMyLeaves();
  }, []);

  // 2. Submit New Leave Request
  const handleSubmitLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch("http://localhost:5001/api/leave/apply", {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          leaveType,
          startDate,
          endDate,
          reason
        })
      });

      const textResponse = await res.text();
      let data;
      try { data = textResponse ? JSON.parse(textResponse) : {}; } 
      catch (e) {
          alert(`Server Error: \n\n${textResponse}`);
          setIsLoading(false);
          return;
      }

      if (data.success || data._id || data.leave) {
        setIsModalOpen(false);
        setLeaveType("");
        setStartDate("");
        setEndDate("");
        setReason("");
        fetchMyLeaves(); // Refresh the list and stats!
      } else {
        alert("Failed to submit: " + (data.message || "Unknown error."));
      }
    } catch (error: any) {
      alert("Network Error: " + error.message);
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push('/login');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try { return new Date(dateString).toLocaleDateString(); } catch (e) { return dateString; }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
        case 'Approved': return 'bg-green-100 text-green-700';
        case 'Rejected': return 'bg-red-100 text-red-700';
        default: return 'bg-orange-100 text-orange-700'; // Pending
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-10">
      <EmployeeNavi employeeName="Nithini Jayathilaka" onLogout={handleLogout} />
      <EmployeeTabs activeTab="Leave" />

      <main className="p-8 max-w-7xl mx-auto w-full flex-1 space-y-6 relative">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Leave Management</h2>
                <p className="text-sm text-gray-500">View and request time off</p>
            </div>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold transition-colors"
            >
                <Plus size={20} strokeWidth={2.5} /> 
                Apply Leave
            </button>
        </div>

        {/* Stats Grid - Now using the correct variable names */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-2">Total Leaves</p>
            <p className="text-4xl font-bold text-gray-900">{stats.totalDays}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-2">Approved</p>
            <p className="text-4xl font-bold text-green-600">{stats.approvedDays}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-2">Pending</p>
            <p className="text-4xl font-bold text-orange-500">{stats.pendingDays}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-2">Rejected</p>
            <p className="text-4xl font-bold text-red-600">{stats.rejectedDays}</p>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm overflow-hidden">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Leave History</h2>
            <p className="text-sm text-gray-500">Your recent leave records and their status</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-4 px-4 text-sm font-semibold text-gray-900">Type</th>
                  <th className="py-4 px-4 text-sm font-semibold text-gray-900">Duration</th>
                  <th className="py-4 px-4 text-sm font-semibold text-gray-900">Reason</th>
                  <th className="py-4 px-4 text-sm font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {leaveRecords.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">{row.leaveType}</td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                        {formatDate(row.startDate)} {row.endDate && row.endDate !== row.startDate ? ` - ${formatDate(row.endDate)}` : ''}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500 max-w-xs truncate">{row.reason}</td>
                    <td className="py-4 px-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-md ${getStatusBadge(row.status || 'Pending')}`}>
                        {row.status || 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
                {leaveRecords.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-gray-400">No leave history found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Apply for Leave</h3>
                    <p className="text-sm text-gray-500 mt-1">Submit a new time-off request</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors">
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmitLeave} className="p-6 space-y-5">
                
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Leave Type</label>
                    <select 
                        required
                        value={leaveType}
                        onChange={(e) => setLeaveType(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white text-gray-900 outline-none transition-all"
                    >
                        <option value="" disabled>Select leave type</option>
                        <option value="Casual Leave">Casual Leave</option>
                        <option value="Sick Leave">Sick Leave</option>
                        <option value="Annual Leave">Annual Leave</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Start Date</label>
                        <div className="relative">
                            <input 
                                type="date" 
                                required
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white text-gray-900 outline-none transition-all"
                            />
                            <CalendarIcon size={18} className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">End Date</label>
                        <div className="relative">
                            <input 
                                type="date" 
                                required
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                min={startDate}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white text-gray-900 outline-none transition-all"
                            />
                            <CalendarIcon size={18} className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Reason for Leave</label>
                    <textarea 
                        required
                        rows={3}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Please provide a brief reason..."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white text-gray-900 outline-none transition-all resize-none"
                    ></textarea>
                </div>

                <div className="flex gap-3 pt-2">
                    <button 
                        type="button" 
                        onClick={() => setIsModalOpen(false)}
                        className="flex-1 px-4 py-3.5 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="flex-1 px-4 py-3.5 bg-gray-900 hover:bg-black text-white font-semibold rounded-xl transition-colors disabled:opacity-70"
                    >
                        {isLoading ? "Submitting..." : "Submit Request"}
                    </button>
                </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}