import React from 'react';
import Link from 'next/link';
import { Clock, FileText, LayoutGrid, Bell, User } from 'lucide-react';

interface EmployeeTabsProps {
  activeTab: 'Attendance' | 'Leave' | 'Projects' | 'Announcements' | 'Profile';
}

const EmployeeTabs: React.FC<EmployeeTabsProps> = ({ activeTab }) => {
  const tabs = [
    { name: 'Attendance', path: '/Employee/Attendance', icon: <Clock size={18} strokeWidth={2} /> },
    { name: 'Leave', path: '/Employee/Leave', icon: <FileText size={18} strokeWidth={2} /> },
    { name: 'Projects', path: '/Employee/Project', icon: <LayoutGrid size={18} strokeWidth={2} /> },
    { name: 'Announcements', path: '/Employee/Announcement', icon: <Bell size={18} strokeWidth={2} /> },
    { name: 'Profile', path: '/Employee/Profile', icon: <User size={18} strokeWidth={2} /> },
  ];

  return (
    // Removed justify-center and changed gap-4 to gap-2 to match AdminTabs perfectly
    <nav className="flex items-center gap-2 px-8 py-4 bg-white border-b border-gray-200 font-sans overflow-x-auto">
      {tabs.map((tab) => (
        <Link
          key={tab.name}
          href={tab.path}
          // Changed padding to px-4 py-2 to exactly match AdminTabs
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === tab.name 
              ? 'bg-gray-100 font-semibold text-gray-900' 
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium'
          }`}
        >
          {tab.icon}
          <span className="text-sm">{tab.name}</span>
        </Link>
      ))}
    </nav>
  );
};

export default EmployeeTabs;