"use client";

import React, { useState, useEffect } from 'react';
import EmployeeNavi from '../../../components/EmployeeNavi/EmployeeNavi';
import EmployeeTabs from '../../../components/EmployeeNavi/EmployeeTabs';
import { Calendar, Clock, CheckCircle2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EmployeeAttendancePage() {
  const router = useRouter();
  
  const [isMounted, setIsMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [todayRecord, setTodayRecord] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({ totalDays: 0, present: 0, late: 0, absent: 0 });
  const [successMessage, setSuccessMessage] = useState("");
  const [liveOT, setLiveOT] = useState("");
  
  const [viewingMonth, setViewingMonth] = useState(new Date());

  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => {
        const now = new Date();
        setCurrentTime(now);

        // Smart UI Sync: If it is exactly 22:00:01, fetch from database to catch the Cron Job!
        if (now.getHours() === 22 && now.getMinutes() === 0 && now.getSeconds() === 1) {
            fetchMyAttendance();
        }

        // Live OT Calculator
        if (todayRecord && !todayRecord.checkOut) {
            const otThreshold = new Date();
            otThreshold.setHours(17, 30, 0, 0);
            
            if (now > otThreshold) {
                const checkInTime = new Date(todayRecord.checkIn);
                const otStart = checkInTime > otThreshold ? checkInTime : otThreshold;
                
                const diffMs = now.getTime() - otStart.getTime();
                const h = Math.floor(diffMs / (1000 * 60 * 60));
                const m = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((diffMs % (1000 * 60)) / 1000);
                
                setLiveOT(`${h}h ${m}m ${s}s`);
            } else {
                setLiveOT("");
            }
        } else {
            setLiveOT("");
        }
    }, 1000);
    return () => clearInterval(timer);
  }, [todayRecord]); // <-- Note: added todayRecord as dependency so interval has latest state

  const fetchMyAttendance = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

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
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  useEffect(() => {
    fetchMyAttendance();
  }, []);

  const handleAttendanceAction = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    
    const isCheckingOut = todayRecord && !todayRecord.checkOut;
    const endpoint = isCheckingOut ? '/api/attendance/checkout' : '/api/attendance/checkin';
    const method = isCheckingOut ? 'PUT' : 'POST';

    try {
      const res = await fetch(`http://localhost:5001${endpoint}`, {
        method: method,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({})
      });
      
      const data = await res.json();

      if (data.success || data._id || data.attendance) {
        setSuccessMessage(`Successfully ${isCheckingOut ? 'Checked Out' : 'Checked In'}!`);
        setTimeout(() => setSuccessMessage(""), 4000);
        fetchMyAttendance(); 
      } else {
        alert("Action Failed: " + (data.message || "Could not save attendance.")); 
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

  const formatTime = (dateString: string) => {
    if (!dateString) return "--:--:--";
    try {
      return new Date(dateString).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch (e) { return "--:--:--"; }
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString('en-GB');
    } catch (e) { return dateString; }
  };

  const getStatusStyle = (status: string) => {
      switch(status) {
          case 'Present': return 'bg-green-100 text-green-700';
          case 'Late': return 'bg-red-100 text-red-700';
          case 'Absent': return 'bg-gray-100 text-gray-700';
          default: return 'bg-gray-100 text-gray-700';
      }
  };

  const handlePrevMonth = () => {
      setViewingMonth(new Date(viewingMonth.getFullYear(), viewingMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
      setViewingMonth(new Date(viewingMonth.getFullYear(), viewingMonth.getMonth() + 1, 1));
  };

  const filteredRecords = attendanceRecords.filter((record) => {
      const recordDate = new Date(record.dateString);
      return recordDate.getMonth() === viewingMonth.getMonth() && recordDate.getFullYear() === viewingMonth.getFullYear();
  });

  const hasCheckedIn = !!todayRecord;
  const hasCheckedOut = todayRecord && !!todayRecord.checkOut;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-10 relative">
      
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
                <Calendar size={22} strokeWidth={1.5} />
                <span className="text-2xl font-semibold">
                  {isMounted ? currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "Loading date..."}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-sm text-gray-500 mb-2">Check In</p>
                  {/* ADDED tabular-nums HERE */}
                  <div className="flex items-center gap-2 text-green-600 font-medium text-2xl tracking-tight tabular-nums">
                    <Clock size={24} /> {hasCheckedIn ? formatTime(todayRecord.checkIn) : "--:--:--"}
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-sm text-gray-500 mb-2">Check Out</p>
                  {/* ADDED tabular-nums HERE */}
                  <div className="flex items-center gap-2 text-red-600 font-medium text-2xl tracking-tight tabular-nums">
                    <Clock size={24} /> {hasCheckedOut ? formatTime(todayRecord.checkOut) : "Not yet"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {hasCheckedIn && (
                   <span className={`text-[11px] px-3 py-1 rounded-md font-semibold ${getStatusStyle(todayRecord.status)}`}>
                     {todayRecord.status}
                   </span>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-3 w-full lg:w-auto mt-4 lg:mt-0 border-t lg:border-t-0 border-gray-200 pt-6 lg:pt-0">
              {/* ADDED tabular-nums HERE */}
              <div className="text-5xl font-normal text-gray-800 tracking-tight mb-2 tabular-nums">
                {isMounted ? currentTime.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "--:--:--"}
              </div>
              
              {!hasCheckedOut ? (
                  <div className="flex flex-col items-end w-full">
                      <button 
                        onClick={handleAttendanceAction}
                        disabled={isLoading}
                        className={`${hasCheckedIn ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 font-semibold transition-colors w-full sm:w-auto`}
                      >
                        <Clock size={20} strokeWidth={2.5} /> 
                        {isLoading ? "Processing..." : (hasCheckedIn ? "Check Out" : "Check In")}
                      </button>
                      
                      {/* ADDED tabular-nums HERE */}
                      {liveOT && (
                          <div className="mt-3 text-sm font-semibold text-orange-600 animate-pulse bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100 tabular-nums">
                              Active OT: {liveOT}
                          </div>
                      )}
                  </div>
              ) : (
                  <button disabled className="bg-gray-300 text-gray-500 cursor-not-allowed px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 font-semibold w-full sm:w-auto">
                     Completed for Today
                  </button>
              )}
            </div>
          </div>
        </div>

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

        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Attendance History</h2>
              <p className="text-sm text-gray-500">Your monthly attendance records</p>
            </div>
            
            <div className="flex items-center gap-4 mt-4 sm:mt-0 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2">
                <button onClick={handlePrevMonth} className="text-gray-500 hover:text-gray-900 transition-colors p-1 rounded-md hover:bg-gray-200">
                    <ChevronLeft size={20} />
                </button>
                <span className="font-semibold text-gray-800 text-sm min-w-[120px] text-center tabular-nums">
                    {viewingMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
                <button onClick={handleNextMonth} className="text-gray-500 hover:text-gray-900 transition-colors p-1 rounded-md hover:bg-gray-200">
                    <ChevronRight size={20} />
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
                  <th className="py-4 px-4 text-sm font-semibold text-gray-900 whitespace-nowrap">OT Hours</th>
                  <th className="py-4 px-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredRecords.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4 text-sm text-gray-600 font-medium whitespace-nowrap tabular-nums">{formatDate(row.dateString)}</td>
                    <td className="py-4 px-4 text-sm text-gray-500 whitespace-nowrap tabular-nums">{row.status === 'Absent' ? '--' : formatTime(row.checkIn)}</td>
                    <td className="py-4 px-4 text-sm text-gray-500 whitespace-nowrap tabular-nums">
                        {row.status === 'Absent' ? '--' : (row.checkOut ? formatTime(row.checkOut) : "Active")}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700 font-medium whitespace-nowrap tabular-nums">
                        {row.otHours && row.otHours !== '0h 0m' ? (
                            <span className="text-orange-600 bg-orange-50 px-2 py-1 rounded-md border border-orange-100">{row.otHours}</span>
                        ) : '--'}
                    </td>
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