import React from 'react';
import Link from 'next/link';
import { LineChart, Users, Bell } from 'lucide-react';

interface AdminTabsProps {
  activeTab: 'Analytics' | 'Employees' | 'Announcements';
}

const AdminTabs: React.FC<AdminTabsProps> = ({ activeTab }) => {
  const tabs = [
    { name: 'Analytics',      path: '/Admin/Analytics',     icon: <LineChart size={18} strokeWidth={2} /> },
    { name: 'Employees',      path: '/Admin/EmployeeManage', icon: <Users size={18} strokeWidth={2} /> },
    { name: 'Announcements',  path: '/Admin/Announcement',  icon: <Bell size={18} strokeWidth={2} /> },
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
          {tab.icon}
          <span className="text-sm">{tab.name}</span>
        </Link>
      ))}
    </nav>
  );
};

export default AdminTabs;
