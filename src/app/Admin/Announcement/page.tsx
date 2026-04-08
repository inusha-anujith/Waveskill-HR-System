"use client";

import React, { useState } from "react";
import AdminNavi from "../../../components/AdminNavi/AdminNavi";
import AdminTabs from "../../../components/AdminNavi/AdminTabs";
import { AlertCircle, Megaphone, Trash2 } from "lucide-react";
import AnnouncementModal from "../../../components/Modals/AnnouncementModal";

// AnnouncementCard component to reduce repeated JSX
function AnnouncementCard({ announcement, onDelete }) {
  const { id, title, content, tag, roles, author, date } = announcement;

  // Helper function for tag background color
  const tagBg = () => {
    if (tag === "Urgent") return "bg-red-700";
    if (tag === "Important") return "bg-black";
    return "bg-gray-700";
  };

  return (
    <div className="border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
      {/* Card Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2 text-gray-900">
          <AlertCircle size={20} strokeWidth={1.5} />
          <h3 className="text-base font-medium">{title}</h3>
        </div>
        <button 
          onClick={() => onDelete(id)}
          className="text-red-500 hover:text-red-700 transition-colors p-1"
        >
          <Trash2 size={18} strokeWidth={1.5} />
        </button>
      </div>

      {/* Tags */}
      <div className="flex items-center gap-3">
        <span className={`${tagBg()} text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full`}>
          {tag}
        </span>
        <span className="border border-gray-200 text-gray-500 text-[11px] font-medium px-3 py-0.5 rounded-full">
          {roles.join(",")}
        </span>
      </div>

      {/* Content */}
      <p className="text-gray-800 text-sm">{content}</p>

      <hr className="border-gray-100 mt-2 mb-1" />

      {/* Footer */}
      <div className="flex justify-between items-center text-sm text-gray-400">
        <span>By {author}</span>
        <span>{date}</span>
      </div>
    </div>
  );
}

export default function AdminAnnouncementsPage() {
  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for announcements
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "Holiday Notice - January 26",
      content: "Please note that January 26 is a public holiday. The office will be closed.",
      tag: "Urgent",
      roles: ["Admin", "Manager", "Employee"],
      author: "Admin User",
      date: "January 7, 2026",
    },
    {
      id: 2,
      title: "Welcome to HR Management System",
      content: "We are pleased to introduce our new HR management platform. Please explore all the features available to you.",
      tag: "Important",
      roles: ["Admin", "Manager", "Employee"],
      author: "Admin User",
      date: "January 1, 2026",
    }
  ]);

  // Logout handler
  const handleLogout = () => {
    alert("Logged out!");
  };

  // Delete announcement handler
  const handleDelete = (id) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Navigation */}
      <AdminNavi adminName="Admin User" role="admin" onLogout={handleLogout} />
      <AdminTabs activeTab="Announcements" />

      {/* Main content */}
      <main className="p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 flex-1">

          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Announcements</h2>
              <p className="text-sm text-gray-500">Create and manage company announcements</p>
            </div>
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
            {announcements.map(a => (
              <AnnouncementCard key={a.id} announcement={a} onDelete={handleDelete} />
            ))}
          </div>

        </div>
      </main>

      {/* Modal */}
      <AnnouncementModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}