"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, User, MessageSquare, Info } from 'lucide-react';

export default function CustomerNavigation() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Projects', href: '/Customer/Projects', icon: LayoutGrid },
    { name: 'Profile', href: '/Customer/Profile', icon: User },
    { name: 'Chat', href: '/Customer/Chat', icon: MessageSquare },
    { name: 'Support', href: '/Customer/Support', icon: Info },
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="flex px-6 space-x-8">
        {navItems.map((item) => {
          const isActive = pathname.includes(item.href);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                isActive 
                  ? 'border-black text-black font-bold' 
                  : 'border-transparent text-gray-500 hover:text-black hover:border-gray-300'
              }`}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}