"use client";

import React, { useState } from 'react';
// Correctly routing up 3 levels: Announcement -> Admin -> app -> src -> components
import AdminNavi from '../../../components/AdminNavi/AdminNavi';
import AdminTabs from '../../../components/AdminNavi/AdminTabs';
import { AlertCircle, Megaphone, Trash2 } from 'lucide-react';
import AnnouncementModal from '../../../components/Modals/AnnouncementModal';

export default function AdminAnnouncementsPage() {
  // State to manage the modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    alert("Logged out!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Shared Navigation */}
      <AdminNavi 
        adminName="Admin User" 
        role="admin" 
        onLogout={handleLogout} 
      />
      <AdminTabs activeTab="Announcements" />

      {/* Main Content */}
      <main className="p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">
        
        {/* Main Announcements Container */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 flex-1">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Announcements</h2>
              <p className="text-sm text-gray-500">Create and manage company announcements</p>
            </div>
            {/* The button triggers the modal */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#1a1a1a] hover:bg-black transition-colors text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium"
            >
              <Megaphone size={16} />
              New Announcement
            </button>
          </div>

          {/* Announcements List */}
          <div className="flex flex-col gap-4">
            
            {/* Announcement Card 1 - Urgent */}
            <div className="border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 text-gray-900">
                  <AlertCircle size={20} strokeWidth={1.5} />
                  <h3 className="text-base font-medium">Holiday Notice - January 26</h3>
                </div>
                {/* Note: This specific card in the Figma design does not show a trash icon */}
              </div>
              
              <div className="flex items-center gap-3">
                <span className="bg-red-600 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                  Urgent
                </span>
                <span className="border border-gray-200 text-gray-500 text-[11px] font-medium px-3 py-0.5 rounded-full">
                  Admin,Manager,Employee
                </span>
              </div>
              
              <p className="text-gray-800 text-sm">
                Please note that January 26 is a public holiday. The office will be closed.
              </p>
              
              <hr className="border-gray-100 mt-2 mb-1" />
              
              <div className="flex justify-between items-center text-sm text-gray-400">
                <span>By Admin User</span>
                <span>January 7, 2026</span>
              </div>
            </div>

            {/* Announcement Card 2 - Important */}
            <div className="border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 text-gray-900">
                  <AlertCircle size={20} strokeWidth={1.5} />
                  <h3 className="text-base font-medium">Welcome to HR Management System</h3>
                </div>
                <button className="text-red-500 hover:text-red-700 transition-colors p-1">
                  <Trash2 size={18} strokeWidth={1.5} />
                </button>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="bg-black text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                  Important
                </span>
                <span className="border border-gray-200 text-gray-500 text-[11px] font-medium px-3 py-0.5 rounded-full">
                  Admin,Manager,Employee
                </span>
              </div>
              
              <p className="text-gray-800 text-sm">
                We are pleased to introduce our new HR management platform. Please explore all the features available to you.
              </p>
              
              <hr className="border-gray-100 mt-2 mb-1" />
              
              <div className="flex justify-between items-center text-sm text-gray-400">
                <span>By Admin User</span>
                <span>January 1, 2026</span>
              </div>
            </div>

          </div>
        </div>

      </main>

      {/* Modal Component rendered conditionally via state */}
      <AnnouncementModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}