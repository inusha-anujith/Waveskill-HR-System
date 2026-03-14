"use client";

import React, { useState, useEffect } from 'react';
import EmployeeNavi from '../../../components/EmployeeNavi/EmployeeNavi';
import EmployeeTabs from '../../../components/EmployeeNavi/EmployeeTabs';
import { AlertCircle, Info, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EmployeeAnnouncementsPage() {
  const router = useRouter();
  
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, urgent: 0, important: 0 });

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch("http://localhost:5001/api/announcements", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const textResponse = await res.text();
      let data;
      try { data = JSON.parse(textResponse); } catch(e) { return; }

      if (data.success || Array.isArray(data)) {
        const records = data.data || data.announcements || (Array.isArray(data) ? data : []);
        
        // Sort newest first
        const sorted = records.sort((a: any, b: any) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        setAnnouncements(sorted);

        // Calculate dynamic stats (checking BOTH type and priority fields)
        setStats({
          total: sorted.length,
          urgent: sorted.filter((a: any) => a.type === 'Urgent' || a.priority === 'Urgent').length,
          important: sorted.filter((a: any) => a.type === 'Important' || a.priority === 'Important').length,
        });
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push('/login');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try { 
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric'
        }); 
    } catch (e) { return dateString; }
  };

  // UI styling helpers based on the announcement type
  const getCardStyle = (type: string) => {
    switch(type) {
        case 'Urgent': return 'bg-[#fff5f5] border-red-100'; 
        case 'Important': return 'bg-[#f4f8fa] border-blue-100'; 
        default: return 'bg-white border-gray-200';
    }
  };

  const getBadgeStyle = (type: string) => {
    switch(type) {
        case 'Urgent': return 'bg-red-600 text-white';
        case 'Important': return 'bg-black text-white';
        default: return 'bg-gray-200 text-gray-800';
    }
  };

  const getIcon = (type: string) => {
    switch(type) {
        case 'Urgent': return <AlertCircle size={20} className="text-gray-900" />;
        case 'Important': return <Info size={20} className="text-gray-900" />;
        default: return <Bell size={20} className="text-gray-900" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-10">
      <EmployeeNavi employeeName="Nithini Jayathilaka" onLogout={handleLogout} />
      <EmployeeTabs activeTab="Announcements" />

      <main className="p-8 max-w-7xl mx-auto w-full flex-1 space-y-6">
        
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Announcements</h2>
            <p className="text-sm text-gray-500">Important updates and notifications</p>
          </div>

          <div className="space-y-4">
            {announcements.map((announcement) => {
              // 🚨 SMART FIX: Grab the value whether the backend calls it 'type' OR 'priority'
              const displayType = announcement.type || announcement.priority;
              // 🚨 SMART FIX: Grab the value whether the backend calls it 'message' OR 'content'
              const displayMessage = announcement.message || announcement.content;

              return (
                <div 
                  key={announcement._id} 
                  className={`p-6 rounded-2xl border ${getCardStyle(displayType)}`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    {getIcon(displayType)}
                    <h3 className="text-lg font-bold text-gray-900">{announcement.title}</h3>
                  </div>
                  
                  {displayType && (
                    <div className="mb-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-md ${getBadgeStyle(displayType)}`}>
                        {displayType}
                      </span>
                    </div>
                  )}
                  
                  {displayMessage && (
                    <p className="text-sm text-gray-700 leading-relaxed mb-6">
                      {displayMessage}
                    </p>
                  )}

                  <hr className="border-gray-200 mb-4 opacity-50" />

                  <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
                    <span>Posted by {announcement.author?.name || 'Admin User'}</span>
                    <span>{formatDate(announcement.createdAt)}</span>
                  </div>
                </div>
              );
            })}

            {announcements.length === 0 && (
              <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl border border-gray-100">
                No new announcements at this time.
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
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