"use client";

import React, { useState, useEffect } from 'react';
import EmployeeNavi from '../../../components/EmployeeNavi/EmployeeNavi';
import EmployeeTabs from '../../../components/EmployeeNavi/EmployeeTabs';
import { useRouter } from 'next/navigation';

export default function EmployeeAnnouncementsPage() {
  const router = useRouter();
  
  const [userData, setUserData] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, urgent: 0, important: 0 });
  
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("All");

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch("http://localhost:5001/api/users/me", { headers: { Authorization: `Bearer ${token}` }});
      const data = await res.json();
      if (data.success) setUserData(data.data);
    } catch (error) { console.error("Error fetching profile:", error); }
  };

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/login'); return; }

      const res = await fetch("http://localhost:5001/api/announcements", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const textResponse = await res.text();
      let data;
      try { data = JSON.parse(textResponse); } catch(e) { return; }

      if (data.success || Array.isArray(data)) {
        const records = data.data || data.announcements || (Array.isArray(data) ? data : []);
        const sorted = records.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setAnnouncements(sorted);

        const months = ["All"];
        sorted.forEach((ann: any) => {
            const m = new Date(ann.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' });
            if (!months.includes(m)) months.push(m);
        });
        setAvailableMonths(months);

        // [FIX]: Smarter stats calculation that mirrors the display logic exactly!
        // We evaluate what the badge will actually show (priority overrides type), and count THAT.
        setStats({
          total: sorted.length,
          urgent: sorted.filter((a: any) => (a.priority || a.type) === 'Urgent').length,
          important: sorted.filter((a: any) => (a.priority || a.type) === 'Important').length,
        });
      }
    } catch (error) { console.error("Error fetching announcements:", error); }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchAnnouncements();
  }, []);

  const handleToggleRead = async (id: string, currentlyRead: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5001/api/announcements/${id}/read`, {
        method: 'PUT',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ isRead: !currentlyRead }) 
      });
      
      const data = await res.json();
      
      if (data.success) {
        setAnnouncements(prev => prev.map(ann => 
            ann._id === id ? data.data : ann
        ));
        window.dispatchEvent(new Event('updateUnreadCount'));
      } else {
        alert("Could not update: " + data.message);
      }
    } catch (error: any) { 
        alert("Network Error: " + error.message);
        console.error("Error updating read status:", error); 
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push('/login');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try { return new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); } 
    catch (e) { return dateString; }
  };

  // Ensure "Normal" has the optional blue styling we discussed, otherwise it defaults to gray
  const getBadgeStyle = (type: string) => {
    switch(type) {
        case 'Urgent': return 'bg-red-600 text-white';
        case 'Important': return 'bg-black text-white';
        case 'Normal': return 'bg-blue-50 text-blue-600 border border-blue-100'; 
        default: return 'bg-gray-200 text-gray-800';
    }
  };

  // [FIX]: Standardized inline SVGs to replace external dependencies
  const getIcon = (type: string) => {
    switch(type) {
        case 'Urgent': 
            return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
        case 'Important': 
            return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
        default: 
            return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
    }
  };

  if (!userData) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;

  const filteredAnnouncements = announcements.filter(ann => {
      if (selectedMonth === "All") return true;
      const annMonth = new Date(ann.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' });
      return annMonth === selectedMonth;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-10">
      <EmployeeNavi employeeName={userData.name} onLogout={handleLogout} />
      <EmployeeTabs activeTab="Announcements" />

      <main className="p-8 max-w-7xl mx-auto w-full flex-1 space-y-6">
        
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Announcements</h2>
                <p className="text-sm text-gray-500">Important updates and notifications</p>
            </div>
            
            <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-500">Filter by Month:</label>
                <select 
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block p-2.5 outline-none cursor-pointer"
                >
                    {availableMonths.map(month => (
                        <option key={month} value={month}>{month}</option>
                    ))}
                </select>
            </div>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredAnnouncements.map((announcement) => {
              // Exact mirror of the UI rendering logic so stats and display match perfectly
              const displayType = announcement.priority || announcement.type;
              const displayMessage = announcement.content || announcement.message;
              
              const isRead = announcement.readBy?.includes(userData._id || userData.id);

              return (
                <div 
                  key={announcement._id} 
                  className={`p-6 rounded-2xl border transition-all ${
                    isRead ? 'bg-white border-gray-200' : 'bg-[#f4f8fa] border-blue-200 border-l-4 border-l-blue-600 shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                        {getIcon(displayType)}
                        <h3 className="text-lg font-bold text-gray-900">{announcement.title}</h3>
                        {!isRead && (
                            <span className="ml-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                                New
                            </span>
                        )}
                    </div>
                    
                    <button 
                        onClick={() => handleToggleRead(announcement._id, isRead)}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                            isRead 
                            ? 'text-gray-500 hover:bg-gray-100 hover:text-gray-900' 
                            : 'text-blue-600 bg-blue-100/50 hover:bg-blue-100'
                        }`}
                    >
                        {isRead ? (
                            <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
                                Mark Unread
                            </>
                        ) : (
                            <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                Mark as Read
                            </>
                        )}
                    </button>
                  </div>
                  
                  {displayType && (
                    <div className="mb-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-md ${getBadgeStyle(displayType)}`}>
                        {displayType}
                      </span>
                    </div>
                  )}
                  
                  {displayMessage && (
                    <p className={`text-sm leading-relaxed mb-6 ${isRead ? 'text-gray-600' : 'text-gray-800 font-medium'}`}>
                      {displayMessage}
                    </p>
                  )}

                  <hr className="border-gray-200 mb-4 opacity-50" />

                  <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
                    <span>Posted by {announcement.postedBy?.name || 'Admin User'}</span>
                    <span>{formatDate(announcement.createdAt)}</span>
                  </div>
                </div>
              );
            })}

            {filteredAnnouncements.length === 0 && (
              <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl border border-gray-100">
                No announcements found for {selectedMonth}.
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Total Announcements</p>
            <p className="text-4xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Urgent</p>
            <p className="text-4xl font-bold text-red-600">{stats.urgent}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Important</p>
            <p className="text-4xl font-bold text-blue-600">{stats.important}</p>
          </div>
        </div>

      </main>
    </div>
  );
}