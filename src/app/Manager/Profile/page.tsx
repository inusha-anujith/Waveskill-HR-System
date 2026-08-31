"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ManagerNavi from '../../../components/ManagerNavi/ManagerNavi';
import ManagerTabs from '../../../components/ManagerNavi/ManagerTabs';
import StaffProfile from '../../../components/Profile/StaffProfile';
import { clearAuth, getStoredName } from '../../../lib/api';

export default function ManagerProfilePage() {
  const router = useRouter();
  const [managerName, setManagerName] = useState('Manager');

  useEffect(() => { setManagerName(getStoredName() || 'Manager'); }, []);

  const handleLogout = () => { clearAuth(); router.push('/login'); };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-10">
      <ManagerNavi managerName={managerName} role="manager" onLogout={handleLogout} />
      <ManagerTabs activeTab="Profile" />
      <StaffProfile onLoaded={(user) => setManagerName(user.name || 'Manager')} />
    </div>
  );
}
