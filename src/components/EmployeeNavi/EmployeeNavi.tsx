"use client";
import React from 'react';
import { LogOut } from 'lucide-react';

interface EmployeeNaviProps {
  employeeName: string;
  onLogout: () => void;
}

const EmployeeNavi: React.FC<EmployeeNaviProps> = ({ employeeName, onLogout }) => {
  return (
    // Added font-sans to match AdminNavi wrapper
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200 font-sans">
      <div>
        {/* Switched from font-bold to font-semibold and updated text to match Admin layout */}
        <h1 className="text-2xl font-semibold text-gray-900">Employee Portal</h1>
        {/* Added mt-0.5 to exactly match Admin spacing */}
        <p className="text-sm text-gray-500 mt-0.5">Welcome, {employeeName}</p>
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

export default EmployeeNavi;