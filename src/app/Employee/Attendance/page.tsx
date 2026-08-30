"use client";

import React, { useState, useEffect } from 'react';
import EmployeeNavi from '../../../components/EmployeeNavi/EmployeeNavi';
import EmployeeTabs from '../../../components/EmployeeNavi/EmployeeTabs';
import { useRouter } from 'next/navigation';

export default function EmployeeAttendancePage() {
  const router = useRouter();
  
  const [userData, setUserData] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [todayRecord, setTodayRecord] = useState<any>(null);
  const [todayOT, setTodayOT] = useState<any>(null); // [NEW]: Track today's OT independently
  
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({ totalDays: 0, present: 0, late: 0, absent: 0 });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [viewingMonth, setViewingMonth] = useState(new Date());

  const [isOTModalOpen, setIsOTModalOpen] = useState(false);
  const [otHours, setOtHours] = useState("");
  const [otReason, setOtReason] = useState("");

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch("http://localhost:5001/api/users/me", { headers: { Authorization: `Bearer ${token}` }});
      const data = await res.json();
      if (data.success) setUserData(data.data);
    } catch (error) { console.error("Error fetching profile:", error); }
  };

  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => {
        const now = new Date();
        setCurrentTime(now);
        // Refresh at exactly 22:00 to catch auto-checkouts
        if (now.getHours() === 22 && now.getMinutes() === 0 && now.getSeconds() === 1) {
            fetchMyAttendance();
        }
    }, 1000);
    return () => clearInterval(timer);
  }, []); 

  const fetchMyAttendance = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/login'); return; }

      const res = await fetch("http://localhost:5001/api/attendance/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const responseData = await res.json();
      
      if (responseData.success) {
        const recordsArray = responseData.history || [];
        setAttendanceRecords(recordsArray);
        if (responseData.stats) setStats(responseData.stats);
        
        const todayStr = new Date().toISOString().split('T')[0];
        const recordForToday = recordsArray.find((record: any) => record.dateString === todayStr);
        setTodayRecord(recordForToday || null);
        
        // [NEW]: Set the independent OT state so the UI knows if an OT request exists before check-in
        setTodayOT(responseData.todayOT || null);
      }
    } catch (error) { console.error("Error fetching attendance:", error); }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchMyAttendance();
  }, []);

  const handleAttendanceAction = async () => {
    setIsLoading(true);
    setErrorMessage("");
    const token = localStorage.getItem('token');
    const isCheckingOut = todayRecord && !todayRecord.checkOut;
    const endpoint = isCheckingOut ? '/api/attendance/checkout' : '/api/attendance/checkin';
    const method = isCheckingOut ? 'PUT' : 'POST';

    try {
      const res = await fetch(`http://localhost:5001${endpoint}`, {
        method: method,
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await res.json();

      if (data.success || data._id || data.attendance) {
        setSuccessMessage(`Successfully ${isCheckingOut ? 'Checked Out' : 'Checked In'}!`);
        setTimeout(() => setSuccessMessage(""), 4000);
        fetchMyAttendance(); 
      } else { 
        // Display the specific backend error (e.g., the weekend warning)
        setErrorMessage(data.message || "Could not save attendance.");
        setTimeout(() => setErrorMessage(""), 7000);
      }
    } catch (error: any) { setErrorMessage("Network Error: " + error.message); }
    setIsLoading(false);
  };

  const handleSubmitOT = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem('token');
        const todayStr = new Date().toISOString().split('T')[0];
        
        const res = await fetch("http://localhost:5001/api/attendance/ot-request", {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                dateString: todayStr, // [FIX]: Always use today's date directly
                otHours: otHours,
                reason: otReason
            })
        });
        const data = await res.json();

        if (data.success) {
            setSuccessMessage("OT Request submitted successfully!");
            setTimeout(() => setSuccessMessage(""), 4000);
            setIsOTModalOpen(false);
            setOtHours("");
            setOtReason("");
            fetchMyAttendance(); 
        } else { alert("Failed: " + data.message); }
    } catch (error: any) { alert("Network Error: " + error.message); }
  };

  const handleCancelOT = async (requestId: string) => {
    if (!window.confirm("Are you sure you want to cancel this Overtime request?")) return;
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5001/api/attendance/ot-request/${requestId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
            setSuccessMessage("OT Request cancelled successfully.");
            setTimeout(() => setSuccessMessage(""), 4000);
            fetchMyAttendance(); 
        } else { alert("Failed to cancel: " + data.message); }
    } catch (error: any) { alert("Network Error: " + error.message); }
  };

  const handleLogout = () => { localStorage.removeItem("token"); router.push('/login'); };

  const formatTime = (dateString: string) => {
    if (!dateString) return "--:--:--";
    try { return new Date(dateString).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }); } catch (e) { return "--:--:--"; }
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try { return new Date(dateString).toLocaleDateString('en-GB'); } catch (e) { return dateString; }
  };

  const getStatusStyle = (status: string) => {
      switch(status) {
          case 'Present': return 'bg-green-100 text-green-700';
          case 'Late': return 'bg-red-100 text-red-700';
          case 'Absent': return 'bg-gray-100 text-gray-700';
          case 'Holiday': return 'bg-yellow-100 text-yellow-800 border border-yellow-200'; 
          default: return 'bg-gray-100 text-gray-700';
      }
  };

  const getOTBadgeStyle = (status: string) => {
      switch(status) {
          case 'Approved': return 'bg-green-100 text-green-700 border border-green-200';
          case 'Rejected': return 'bg-red-100 text-red-700 border border-red-200';
          case 'Pending': return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
          default: return 'bg-gray-100 text-gray-500';
      }
  };

  const handlePrevMonth = () => setViewingMonth(new Date(viewingMonth.getFullYear(), viewingMonth.getMonth() - 1, 1));
  const handleNextMonth = () => setViewingMonth(new Date(viewingMonth.getFullYear(), viewingMonth.getMonth() + 1, 1));

  const filteredRecords = attendanceRecords.filter((record) => {
      const recordDate = new Date(record.dateString);
      return recordDate.getMonth() === viewingMonth.getMonth() && recordDate.getFullYear() === viewingMonth.getFullYear();
  });

  const hasCheckedIn = !!todayRecord;
  const hasCheckedOut = todayRecord && !!todayRecord.checkOut;
  
  // Determine if it is the weekend right now
  const isWeekend = isMounted && (currentTime.getDay() === 0 || currentTime.getDay() === 6);

  if (!userData) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-10 relative">
      
      {/* Toast Notifications */}
      {successMessage && (
        <div className="fixed top-8 right-8 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-in fade-in slide-in-from-top-5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
            <div>
                <h4 className="font-bold text-sm">Success</h4>
                <p className="text-xs opacity-90">{successMessage}</p>
            </div>
            <button onClick={() => setSuccessMessage("")} className="ml-4 hover:bg-green-700 p-1 rounded-full transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
        </div>
      )}
      
      {errorMessage && (
        <div className="fixed top-8 right-8 bg-red-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-in fade-in slide-in-from-top-5 max-w-md">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            <div>
                <h4 className="font-bold text-sm">Action Blocked</h4>
                <p className="text-xs opacity-90">{errorMessage}</p>
            </div>
            <button onClick={() => setErrorMessage("")} className="ml-4 hover:bg-red-700 p-1 rounded-full transition-colors shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
        </div>
      )}

      {/* Request Overtime Modal */}
      {isOTModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Request Overtime</h3>
                    <button onClick={() => setIsOTModalOpen(false)} className="text-gray-400 hover:text-gray-900 p-1">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                </div>
                <form onSubmit={handleSubmitOT} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">OT Hours Requested</label>
                        <input type="number" step="0.5" min="0.5" max="12" required value={otHours} onChange={(e) => setOtHours(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none text-gray-900 font-medium" placeholder="e.g. 2.5" />
                        <p className="text-xs text-gray-500 mt-1">Must be between 0.5 and 12 hours.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Reason / Task Completed</label>
                        <textarea required rows={3} value={otReason} onChange={(e) => setOtReason(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none resize-none text-gray-900 font-medium" placeholder="Describe the extra work completed..."></textarea>
                    </div>
                    <button type="submit" className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3.5 rounded-xl transition-colors mt-4">
                        Submit Request to Manager
                    </button>
                </form>
            </div>
        </div>
      )}

      <EmployeeNavi employeeName={userData.name} onLogout={handleLogout} />
      <EmployeeTabs activeTab="Attendance" />

      <main className="p-8 max-w-7xl mx-auto w-full flex-1 space-y-6">
        
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Mark Attendance</h2>
            <p className="text-sm text-gray-500">Check in and check out for today</p>
          </div>
          
          <div className="bg-[#f0f4f8] rounded-2xl p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative">
            <div className="flex-1 w-full">
              <p className="text-sm text-gray-500 mb-2">Today's Date</p>
              <div className="flex items-center gap-3 text-gray-900 mb-6">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                <span className="text-2xl font-semibold">
                  {isMounted ? currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "Loading date..."}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-sm text-gray-500 mb-2">Check In</p>
                  <div className="flex items-center gap-2 text-green-600 font-medium text-2xl tracking-tight tabular-nums">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> 
                    {hasCheckedIn ? formatTime(todayRecord.checkIn) : "--:--:--"}
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-sm text-gray-500 mb-2">Check Out</p>
                  <div className="flex items-center gap-2 text-red-600 font-medium text-2xl tracking-tight tabular-nums">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> 
                    {hasCheckedOut ? formatTime(todayRecord.checkOut) : "Not yet"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 h-8">
                {hasCheckedIn && (
                   <span className={`text-[11px] px-3 py-1 rounded-md font-semibold ${getStatusStyle(todayRecord.status)}`}>
                     {todayRecord.status}
                   </span>
                )}
                
                {/* [NEW]: Display today's OT Status clearly on the main dashboard */}
                {todayOT && (
                    <span className={`text-[11px] px-3 py-1 rounded-md font-semibold ${getOTBadgeStyle(todayOT.status)}`}>
                        {todayOT.status === 'Approved' ? `${todayOT.otHours}h OT Approved` : `OT Request ${todayOT.status}`}
                    </span>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-3 w-full lg:w-auto mt-4 lg:mt-0 border-t lg:border-t-0 border-gray-200 pt-6 lg:pt-0">
              <div className="text-5xl font-normal text-gray-800 tracking-tight mb-2 tabular-nums">
                {isMounted ? currentTime.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "--:--:--"}
              </div>
              
              <div className="flex flex-col items-end w-full gap-3">
                  {!hasCheckedOut ? (
                      <button 
                        onClick={handleAttendanceAction}
                        disabled={isLoading}
                        className={`${hasCheckedIn ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 font-semibold transition-colors w-full sm:w-auto`}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {isLoading ? "Processing..." : (hasCheckedIn ? "Check Out" : "Check In")}
                      </button>
                  ) : (
                      <button disabled className="bg-gray-300 text-gray-500 cursor-not-allowed px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 font-semibold w-full sm:w-auto">
                         Completed for Today
                      </button>
                  )}
                  
                  {/* [NEW]: "Request Overtime" button is ALWAYS available if there is no pending/approved request for today. */}
                  {!todayOT && (
                      <button 
                        onClick={() => setIsOTModalOpen(true)}
                        className="text-sm font-semibold text-orange-600 bg-orange-100 hover:bg-orange-200 px-6 py-2.5 rounded-lg border border-orange-200 transition-colors w-full sm:w-auto flex items-center justify-center gap-2 shadow-sm"
                      >
                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                         Request Overtime
                      </button>
                  )}
              </div>
            </div>
          </div>
        </div>

        {/* ... Stats Grid ... */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-2">Total Days</p>
            <p className="text-4xl font-bold text-gray-900">{stats.totalDays}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-2">Present</p>
            <p className="text-4xl font-bold text-green-600">{stats.present}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-2">Late</p>
            <p className="text-4xl font-bold text-red-600">{stats.late}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-2">Absent</p>
            <p className="text-4xl font-bold text-gray-700">{stats.absent}</p>
          </div>
        </div>

        {/* ... Attendance History Table ... */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Attendance History</h2>
              <p className="text-sm text-gray-500">Your monthly attendance records</p>
            </div>
            <div className="flex items-center gap-4 mt-4 sm:mt-0 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2">
                <button onClick={handlePrevMonth} className="text-gray-500 hover:text-gray-900 transition-colors p-1 rounded-md hover:bg-gray-200">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <span className="font-semibold text-gray-800 text-sm min-w-[120px] text-center tabular-nums">{viewingMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                <button onClick={handleNextMonth} className="text-gray-500 hover:text-gray-900 transition-colors p-1 rounded-md hover:bg-gray-200">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-4 px-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Date</th>
                  <th className="py-4 px-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Check In</th>
                  <th className="py-4 px-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Check Out</th>
                  <th className="py-4 px-4 text-sm font-semibold text-gray-900 whitespace-nowrap">OT Request</th>
                  <th className="py-4 px-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredRecords.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4 text-sm text-gray-600 font-medium whitespace-nowrap tabular-nums">{formatDate(row.dateString)}</td>
                    
                    {row.status === 'Holiday' ? (
                        <td colSpan={3} className="py-4 px-4">
                            <div className="flex items-center gap-2 justify-center bg-yellow-50 text-yellow-700 border border-yellow-200/60 rounded-lg py-1.5 px-4 text-sm font-semibold">
                                ✨ {row.notes || 'Holiday / Weekend'}
                            </div>
                        </td>
                    ) : (
                        <>
                            <td className="py-4 px-4 text-sm text-gray-500 whitespace-nowrap tabular-nums">{row.status === 'Absent' ? '--' : formatTime(row.checkIn)}</td>
                            <td className="py-4 px-4 text-sm text-gray-500 whitespace-nowrap tabular-nums">
                                {row.status === 'Absent' ? '--' : (row.checkOut ? formatTime(row.checkOut) : "Active")}
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap">
                                {row.otRequest ? (
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[11px] font-bold px-3 py-1.5 rounded-md ${getOTBadgeStyle(row.otRequest.status)}`}>
                                            {row.otRequest.status === 'Approved' ? `${row.otRequest.otHours}h Approved` : row.otRequest.status}
                                        </span>
                                        {row.otRequest.status === 'Pending' && (
                                            <button onClick={() => handleCancelOT(row.otRequest._id)} className="text-xs text-red-500 hover:text-red-700 font-semibold underline transition-colors">
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                ) : '--'}
                            </td>
                        </>
                    )}

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className={`text-[11px] font-bold px-3 py-1.5 rounded-md ${getStatusStyle(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredRecords.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-400">No attendance records found for this month.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}