"use client";

import React, { useState, useEffect } from 'react';
import EmployeeNavi from '../../../components/EmployeeNavi/EmployeeNavi';
import EmployeeTabs from '../../../components/EmployeeNavi/EmployeeTabs';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EmployeeAttendancePage() {
  const router = useRouter();
  
  const [isMounted, setIsMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Adjusted State for exact backend matching
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [todayRecord, setTodayRecord] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({ totalDays: 0, present: 0, late: 0, absent: 0 });

  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
        // 🚨 MATCHING BACKEND EXACTLY: Getting 'history' and 'stats'
        const recordsArray = responseData.history || [];
        setAttendanceRecords(recordsArray);
        
        if (responseData.stats) {
            setStats(responseData.stats);
        }
        
        // Find today's record using the exact 'dateString' field from backend
        const todayStr = new Date().toISOString().split('T')[0];
        const recordForToday = recordsArray.find((record: any) => 
            record.dateString === todayStr
        );
        
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
    
    // Using exact backend field 'checkOut'
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
      
      const textResponse = await res.text();
      let data;
      try { data = textResponse ? JSON.parse(textResponse) : {}; } 
      catch (e) {
          alert(`Server Error: ${textResponse}`);
          setIsLoading(false);
          return;
      }

      if (data.success || data._id || data.attendance) {
        fetchMyAttendance(); // Refresh the UI to turn the button red/gray!
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
      return new Date(dateString).toLocaleTimeString([], { hour12: false });
    } catch (e) { return "--:--:--"; }
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) { return dateString; }
  };

  // Button logic matches backend 'checkOut' property
  const hasCheckedIn = !!todayRecord;
  const hasCheckedOut = todayRecord && !!todayRecord.checkOut;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-10">
      <EmployeeNavi employeeName="Nithini Jayathilaka" onLogout={handleLogout} />
      <EmployeeTabs activeTab="Attendance" />

      <main className="p-8 max-w-7xl mx-auto w-full flex-1 space-y-6">
        
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Mark Attendance</h2>
            <p className="text-sm text-gray-500">Check in and check out for today</p>
          </div>
          
          <div className="bg-[#f0f4f8] rounded-2xl p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
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
                  <div className="flex items-center gap-2 text-green-600 font-medium text-2xl">
                    {/* Using exact backend property: checkIn */}
                    <Clock size={24} /> {hasCheckedIn ? formatTime(todayRecord.checkIn) : "--:--:--"}
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-sm text-gray-500 mb-2">Check Out</p>
                  <div className="flex items-center gap-2 text-red-600 font-medium text-2xl">
                    {/* Using exact backend property: checkOut */}
                    <Clock size={24} /> {hasCheckedOut ? formatTime(todayRecord.checkOut) : "Not yet"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {hasCheckedIn && (
                   <span className={`text-[11px] px-3 py-1 rounded-md font-semibold ${todayRecord.status === 'Late' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                     {todayRecord.status}
                   </span>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-6 w-full lg:w-auto mt-4 lg:mt-0 border-t lg:border-t-0 border-gray-200 pt-6 lg:pt-0">
              <div className="text-5xl font-normal text-gray-800 tracking-tight">
                {isMounted ? currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
              </div>
              
              {!hasCheckedOut ? (
                  <button 
                    onClick={handleAttendanceAction}
                    disabled={isLoading}
                    className={`${hasCheckedIn ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 font-semibold transition-colors w-full sm:w-auto`}
                  >
                    <Clock size={20} strokeWidth={2.5} /> 
                    {isLoading ? "Processing..." : (hasCheckedIn ? "Check Out" : "Check In")}
                  </button>
              ) : (
                  <button disabled className="bg-gray-300 text-gray-500 cursor-not-allowed px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 font-semibold w-full sm:w-auto">
                     Completed for Today
                  </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Section exactly matching backend 'stats' object */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Total Days</p>
            <p className="text-4xl font-semibold text-gray-900">{stats.totalDays}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Present</p>
            <p className="text-4xl font-semibold text-green-500">{stats.present}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Late</p>
            <p className="text-4xl font-semibold text-orange-400">{stats.late}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Absent</p>
            <p className="text-4xl font-semibold text-red-600">{stats.absent}</p>
          </div>
        </div>

        {/* History Table mapped to exact backend properties */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 overflow-hidden">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Attendance History</h2>
            <p className="text-sm text-gray-500">Your recent attendance records</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-white">
                  <th className="py-4 px-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Date</th>
                  <th className="py-4 px-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Check In</th>
                  <th className="py-4 px-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Check Out</th>
                  <th className="py-4 px-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {attendanceRecords.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors bg-white">
                    <td className="py-4 px-4 text-sm text-gray-500 font-medium whitespace-nowrap">{formatDate(row.dateString)}</td>
                    <td className="py-4 px-4 text-sm text-gray-500 whitespace-nowrap">{formatTime(row.checkIn)}</td>
                    <td className="py-4 px-4 text-sm text-gray-500 whitespace-nowrap">{row.checkOut ? formatTime(row.checkOut) : "Active"}</td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className={`text-[11px] font-medium px-3 py-1 rounded-md ${
                        row.status === 'Present' 
                          ? 'bg-[#1a1a1a] text-white' 
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {attendanceRecords.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">No attendance records found.</td>
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