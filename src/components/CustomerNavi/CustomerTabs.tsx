"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Briefcase, User, LifeBuoy } from 'lucide-react';

export default function CustomerTabs() {
  const pathname = usePathname();

  const tabs = [
    { name: 'Home', path: '/Customer/Home', icon: <LayoutGrid size={16} /> },
    { name: 'Projects', path: '/Customer/Projects', icon: <Briefcase size={16} /> },
    { name: 'Profile', path: '/Customer/Profile', icon: <User size={16} /> },
    { name: 'Support', path: '/Customer/Support', icon: <LifeBuoy size={16} /> },
  ];

  return (
    <nav className="flex items-center gap-1 px-8 py-3 bg-white border-b border-gray-200 overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = pathname.includes(tab.path);
        
        return (
          <Link
            key={tab.name}
            href={tab.path}
            className={`flex rounded-[.5rem] items-center gap-2 px-4 py-2 transition-all whitespace-nowrap ${
              isActive 
                ? 'bg-gray-100 font-bold text-black' 
                : 'text-gray-500 hover:text-black hover:bg-gray-50 font-semibold'
            }`}
          >
            {tab.icon}
            <span className="text-xs uppercase tracking-wider">{tab.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}