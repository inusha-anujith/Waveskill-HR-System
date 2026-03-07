import React from 'react';
import { LogOut } from 'lucide-react';

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
      <button 
        onClick={onLogout}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <LogOut size={18} className="text-gray-700" />
        <span className="font-medium text-gray-900">Logout</span>
      </button>
    </header>
  );
};

export default AdminNavi;