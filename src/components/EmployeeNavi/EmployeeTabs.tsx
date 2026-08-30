"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, FileText, LayoutGrid, Bell, User } from 'lucide-react';

interface EmployeeTabsProps {
  activeTab: 'Attendance' | 'Leave' | 'Projects' | 'Announcements' | 'Profile';
}

const EmployeeTabs: React.FC<EmployeeTabsProps> = ({ activeTab }) => {
  // State to hold the number of unread announcements
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread count on mount and every 30 seconds to keep the notification dot accurate
useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const res = await fetch("http://localhost:5001/api/announcements/unread-count", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const textResponse = await res.text();
        let data;
        try { data = JSON.parse(textResponse); } catch(e) { return; }

        if (data && data.success) {
          setUnreadCount(data.count);
        }
      } catch (error) {
        console.error("Failed to fetch unread count", error);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); 
    
    // [NEW] Listen for the custom event from the Announcements page to update the red dot instantly
    window.addEventListener('updateUnreadCount', fetchUnreadCount);
    
    return () => {
        clearInterval(interval);
        window.removeEventListener('updateUnreadCount', fetchUnreadCount);
    };
  }, []);

  const tabs = [
    { name: 'Attendance', path: '/Employee/Attendance', icon: <Clock size={18} strokeWidth={2} /> },
    { name: 'Leave', path: '/Employee/Leave', icon: <FileText size={18} strokeWidth={2} /> },
    { name: 'Projects', path: '/Employee/Project', icon: <LayoutGrid size={18} strokeWidth={2} /> },
    { name: 'Announcements', path: '/Employee/Announcement', icon: <Bell size={18} strokeWidth={2} /> },
    { name: 'Profile', path: '/Employee/Profile', icon: <User size={18} strokeWidth={2} /> },
  ];

  return (
    <nav className="flex items-center gap-2 px-8 py-4 bg-white border-b border-gray-200 font-sans overflow-x-auto">
      {tabs.map((tab) => (
        <Link
          key={tab.name}
          href={tab.path}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === tab.name 
              ? 'bg-gray-100 font-semibold text-gray-900' 
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium'
          }`}
        >
          {/* Notification Dot wrapper logic */}
          <div className="relative flex items-center justify-center">
            {tab.icon}
            
            {/* If the tab is Announcements and there is at least 1 unread message, show the red dot */}
            {tab.name === 'Announcements' && unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
            )}
          </div>
          <span className="text-sm">{tab.name}</span>
        </Link>
      ))}
    </nav>
  );
};

export default EmployeeTabs;