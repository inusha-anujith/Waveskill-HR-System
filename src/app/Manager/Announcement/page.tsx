"use client";

import React, { useState } from 'react';
import ManagerNavi from '../../../components/ManagerNavi/ManagerNavi';
import ManagerTabs from '../../../components/ManagerNavi/ManagerTabs';
// Imported Pencil for the edit functionality
import { AlertCircle, Megaphone, Trash2, Pencil } from 'lucide-react';
import AnnouncementModal from '../../../components/Modals/ManagerAnnouncementModal';

export default function ManagerAnnouncementsPage() {
  const handleLogout = () => {
    alert("Logged out!");
  };

  // 1. State to hold the announcements dynamically
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "Holiday Notice - January 26",
      priority: "Urgent",
      audience: "Admin,Manager,Employee",
      message: "Please note that January 26 is a public holiday. The office will be closed.",
      author: "Admin User",
      date: "January 7, 2026"
    },
    {
      id: 2,
      title: "Welcome to HR Management System",
      priority: "Important",
      audience: "Admin,Manager,Employee",
      message: "We are pleased to introduce our new HR management platform. Please explore all the features available to you.",
      author: "Admin User",
      date: "January 1, 2026"
    }
  ]);

  // 2. State for Modal controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any | null>(null);

  // 3. Handlers for actions
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      setAnnouncements(announcements.filter(ann => ann.id !== id));
    }
  };

  const handleOpenNew = () => {
    setEditingAnnouncement(null); // Clear editing state for a new entry
    setIsModalOpen(true);
  };

  const handleOpenEdit = (announcement: any) => {
    setEditingAnnouncement(announcement); // Pass current data into the modal
    setIsModalOpen(true);
  };

  const handleSaveAnnouncement = (data: any) => {
    if (editingAnnouncement) {
      // Edit existing
      setAnnouncements(announcements.map(ann => 
        ann.id === editingAnnouncement.id ? { ...ann, ...data } : ann
      ));
    } else {
      // Add new
      const newAnn = {
        ...data,
        id: Date.now(),
        author: "Sarah Manager", // Since we are logged in as Manager
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      };
      setAnnouncements([newAnn, ...announcements]); // Add to the top of the list
    }
  };

  // Helper for dynamic badge styling based on priority
  const getPriorityBadge = (priority: string) => {
    if (priority === 'Urgent') return "bg-red-600 text-white";
    if (priority === 'Important') return "bg-black text-white";
    return "bg-blue-600 text-white"; // Normal
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-10">
      <ManagerNavi managerName="Sarah Manager" role="manager" onLogout={handleLogout} />
      <ManagerTabs activeTab="Announcements" />

      <main className="p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">
        
        <div className="bg-white rounded-2xl border border-gray-200 p-8 flex-1">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Announcements</h2>
              <p className="text-sm text-gray-500">Create, edit, and manage company announcements</p>
            </div>
            <button 
              onClick={handleOpenNew}
              className="bg-[#1a1a1a] hover:bg-black transition-colors text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium"
            >
              <Megaphone size={16} />
              New Announcement
            </button>
          </div>

          <div className="flex flex-col gap-4">
            
            {announcements.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">No announcements found.</p>
            ) : (
              announcements.map((ann) => (
                <div key={ann.id} className="border border-gray-200 rounded-xl p-6 flex flex-col gap-4 transition-all hover:shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 text-gray-900">
                      <AlertCircle size={20} strokeWidth={1.5} />
                      <h3 className="text-base font-medium">{ann.title}</h3>
                    </div>
                    {/* Edit & Delete Action Buttons */}
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleOpenEdit(ann)}
                        className="text-gray-400 hover:text-blue-600 transition-colors p-1.5 rounded-lg hover:bg-blue-50"
                        title="Edit Announcement"
                      >
                        <Pencil size={18} strokeWidth={1.5} />
                      </button>
                      <button 
                        onClick={() => handleDelete(ann.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                        title="Delete Announcement"
                      >
                        <Trash2 size={18} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`${getPriorityBadge(ann.priority)} text-[11px] font-semibold px-2.5 py-0.5 rounded-full`}>
                      {ann.priority}
                    </span>
                    <span className="border border-gray-200 text-gray-500 text-[11px] font-medium px-3 py-0.5 rounded-full">
                      {ann.audience}
                    </span>
                  </div>
                  
                  <p className="text-gray-800 text-sm">
                    {ann.message}
                  </p>
                  
                  <hr className="border-gray-100 mt-2 mb-1" />
                  
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <span>By {ann.author}</span>
                    <span>{ann.date}</span>
                  </div>
                </div>
              ))
            )}

          </div>
        </div>

      </main>

      {/* Render the Modal */}
      <AnnouncementModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveAnnouncement}
        initialData={editingAnnouncement} // Passes data if editing, null if creating
      />
    </div>
  );
}