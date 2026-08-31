"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavi from '../../../components/AdminNavi/AdminNavi';
import AdminTabs from '../../../components/AdminNavi/AdminTabs';
import StaffProfile from '../../../components/Profile/StaffProfile';
import { clearAuth, getStoredName } from '../../../lib/api';

export default function AdminProfilePage() {
  const router = useRouter();
  const [adminName, setAdminName] = useState('Admin');

  useEffect(() => { setAdminName(getStoredName() || 'Admin'); }, []);

  const handleLogout = () => { clearAuth(); router.push('/login'); };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-10">
      <AdminNavi adminName={adminName} role="admin" onLogout={handleLogout} />
      <AdminTabs activeTab="Profile" />
      <StaffProfile onLoaded={(user) => setAdminName(user.name || 'Admin')} />
    </div>
  );
}
