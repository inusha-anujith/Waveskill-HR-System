"use client";
import React from 'react';
import UserMenu from '../UserMenu/UserMenu';

interface AdminNaviProps {
  adminName: string;
  role: string;
  onLogout: () => void;
}

const AdminNavi: React.FC<AdminNaviProps> = ({ adminName, role, onLogout }) => {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200 font-sans">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">HR Management System</h1>
        <p className="text-sm text-gray-500 mt-0.5">Welcome, {adminName} ({role})</p>
      </div>
      <UserMenu name={adminName} role={role} profileHref="/Admin/Profile" onLogout={onLogout} />
    </header>
  );
};

export default AdminNavi;
