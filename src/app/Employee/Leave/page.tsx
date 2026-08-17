"use client";

import React, { useState, useEffect } from 'react';
import EmployeeNavi from '../../../components/EmployeeNavi/EmployeeNavi';
import EmployeeTabs from '../../../components/EmployeeNavi/EmployeeTabs';
import { Plus, X, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EmployeeLeavePage() {
  const router = useRouter();

  // Page State
  const [leaveRecords, setLeaveRecords] = useState<any[]>([]);
  const [filterMonth, setFilterMonth] = useState(""); 
  
  // State Initialization
  const [stats, setStats] = useState({ 
      totalLeaves: 0, 
      approvedDays: 0, 
      pendingDays: 0, 
      rejectedDays: 0,
      leaveBalance: 35
  });
  
  // Modal & Popup State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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
        const recordsArray = responseData.history || [];
        const sortedRecords = recordsArray.sort((a: any, b: any) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        setLeaveRecords(sortedRecords);

        if (responseData.stats) {
            setStats(prev => ({
                ...prev,
                ...responseData.stats,
                totalLeaves: responseData.stats.totalLeaves ?? responseData.stats.totalDays ?? prev.totalLeaves,
                leaveBalance: responseData.stats.leaveBalance ?? prev.leaveBalance
            }));
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
        body: JSON.stringify({ leaveType, startDate, endDate, reason })
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
        
        setSuccessMessage("Your leave request has been submitted successfully!");
        setTimeout(() => setSuccessMessage(""), 4000);

        fetchMyLeaves(); 
      } else {
        alert("Failed to submit: " + (data.message || "Unknown error."));
      }
    } catch (error: any) {
      alert("Network Error: " + error.message);
    }
    setIsLoading(false);
  };

  // 3. Cancel Pending Leave Request
  const handleCancelLeave = async (leaveId: string) => {
    // Show confirmation before deleting
    const confirmCancel = window.confirm("Are you sure you want to cancel this leave request? This action cannot be undone.");
    if (!confirmCancel) return;

    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5001/api/leave/${leaveId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();

        if (data.success) {
            setSuccessMessage("Leave request has been canceled successfully.");
            setTimeout(() => setSuccessMessage(""), 4000);
            fetchMyLeaves(); // Instantly fetch fresh data to recalculate the cards!
        } else {
            alert("Failed to cancel: " + data.message);
        }
    } catch (error: any) {
        alert("Network Error: " + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push('/login');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try { return new Date(dateString).toLocaleDateString('en-GB'); } catch (e) { return dateString; }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
        case 'Approved': return 'bg-green-100 text-green-700';
        case 'Rejected': return 'bg-red-100 text-red-700';
        default: return 'bg-orange-100 text-orange-700'; 
    }
  };

  const getTomorrowString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };
  const minDateLimit = getTomorrowString();

  const filteredRecords = leaveRecords.filter(row => {
      if (!filterMonth) return true; 
      const rowMonth = new Date(row.startDate).getMonth() + 1; 
      return rowMonth.toString() === filterMonth;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-10 relative">
      
      {/* UI Success Popup */}
      {successMessage && (
        <div className="fixed top-8 right-8 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-in fade-in slide-in-from-top-5">
            <CheckCircle2 size={24} className="text-white" />
            <div>
                <h4 className="font-bold text-sm">Success</h4>
                <p className="text-xs opacity-90">{successMessage}</p>
            </div>
            <button onClick={() => setSuccessMessage("")} className="ml-4 hover:bg-green-700 p-1 rounded-full transition-colors">
                <X size={16}/>
            </button>
        </div>
      )}

      <EmployeeNavi employeeName="Nithini Jayathilaka" onLogout={handleLogout} />
      <EmployeeTabs activeTab="Leave" />

      <main className="p-8 max-w-7xl mx-auto w-full flex-1 space-y-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Leave Management</h2>
                <p className="text-sm text-gray-500">View and request time off</p>
            </div>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold transition-colors shadow-sm"
            >
                <Plus size={20} strokeWidth={2.5} /> 
                Apply Leave
            </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-2">Leave Balance</p>
            <p className="text-4xl font-bold text-blue-600">{stats.leaveBalance}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-2">Total Leaves</p>
            <p className="text-4xl font-bold text-gray-900">{stats.totalLeaves}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-2">Approved Days</p>
            <p className="text-4xl font-bold text-green-600">{stats.approvedDays}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-2">Pending Days</p>
            <p className="text-4xl font-bold text-orange-500">{stats.pendingDays}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-2">Rejected Days</p>
            <p className="text-4xl font-bold text-red-600">{stats.rejectedDays}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm overflow-hidden mt-8">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Leave History</h2>
              <p className="text-sm text-gray-500">Your recent leave records and their status</p>
            </div>
            
            <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="mt-4 sm:mt-0 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm font-semibold text-gray-700 cursor-pointer"
            >
                <option value="">All Months</option>
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-4 px-4 text-sm font-semibold text-gray-900">Type</th>
                  <th className="py-4 px-4 text-sm font-semibold text-gray-900">Duration</th>
                  <th className="py-4 px-4 text-sm font-semibold text-gray-900">Days</th>
                  <th className="py-4 px-4 text-sm font-semibold text-gray-900">Reason</th>
                  <th className="py-4 px-4 text-sm font-semibold text-gray-900">Status</th>
                  <th className="py-4 px-4 text-sm font-semibold text-gray-900 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredRecords.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">{row.leaveType}</td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                        {formatDate(row.startDate)} {row.endDate && row.endDate !== row.startDate ? ` - ${formatDate(row.endDate)}` : ''}
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-700">
                        {row.days || 1} {row.days > 1 ? 'Days' : 'Day'}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500 max-w-xs truncate">{row.reason}</td>
                    <td className="py-4 px-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-md ${getStatusBadge(row.status || 'Pending')}`}>
                        {row.status || 'Pending'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      {/* Only render Cancel button if status is Pending! */}
                      {row.status === 'Pending' && (
                          <button 
                              onClick={() => handleCancelLeave(row._id)}
                              className="text-xs font-semibold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors"
                          >
                              Cancel
                          </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredRecords.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-400">
                        {filterMonth ? "No leaves found for this month." : "No leave history found."}
                    </td>
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
                                min={minDateLimit}
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
                                min={startDate || minDateLimit} 
                                onChange={(e) => setEndDate(e.target.value)}
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