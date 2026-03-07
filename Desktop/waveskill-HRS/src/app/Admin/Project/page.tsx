"use client";

import React, { useState, useRef } from 'react';
// Correctly routing up 3 levels
import AdminNavi from '../../../components/AdminNavi/AdminNavi';
import AdminTabs from '../../../components/AdminNavi/AdminTabs';
import { FilePlus, FileText, UserCog } from 'lucide-react';
// Import your existing modal and the new Admin details view
import ProjectModal from '../../../components/Modals/ProjectModal';
import AdminProjectDetailsView from '../../../components/Modals/AdminProjectDetailsView';

// Converted your hardcoded cards into a data array
const mockProjects = [
  {
    id: 1,
    title: "HR Management System",
    status: "Active",
    priority: "high priority",
    priorityColor: "bg-red-100 text-red-500", // Preserving your exact Figma colors
    description: "Development of internal HR management platform including employee portal, analytics, and leave management integrations.",
    progress: 45,
    startDate: "1/1/2026",
    assignee: "John Doe",
    tasks: {
      todo: ["Design Profile Page UI", "Connect API for Leave Requests"],
      inProgress: ["Implement Project Expansion View"],
      completed: ["Create Navigation Tabs", "Set up Next.js App Router"]
    }
  },
  {
    id: 2,
    title: "Marketing Campaign Q1",
    status: "Active",
    priority: "high priority",
    priorityColor: "bg-orange-100 text-orange-500", // Preserving your exact Figma colors
    description: "Q1 2026 marketing initiative targeting new B2B enterprise clients through social media and direct outreach.",
    progress: 45,
    startDate: "1/1/2026",
    assignee: "Jane Smith",
    tasks: {
      todo: ["Audit existing SEO", "Draft wireframes"],
      inProgress: ["Keyword Research"],
      completed: ["Initial kick-off meeting"]
    }
  }
];

export default function AdminProjectsPage() {
  // State for modals and selections
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  
  // Ref for smooth scrolling target
  const detailsSectionRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    alert("Logged out!");
  };

  // Function to handle clicking a card and scrolling down
  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
    
    // Slight delay ensures the details component renders before we scroll to it
    setTimeout(() => {
      detailsSectionRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-10">
      {/* Shared Navigation */}
      <AdminNavi 
        adminName="Admin User" 
        role="admin" 
        onLogout={handleLogout} 
      />
      <AdminTabs activeTab="Projects" />

      {/* Main Content */}
      <main className="p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">
        
        {/* Main Projects Container */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 flex-1">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Project Allocation</h2>
              <p className="text-sm text-gray-500">Create and manage projects, assign employees. Click a project to view and manage details.</p>
            </div>
            {/* The button triggering the New Project Modal */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#1a1a1a] hover:bg-black transition-colors text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium"
            >
              <FilePlus size={18} />
              New Project
            </button>
          </div>

          {/* Projects Grid mapped from mockData */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {mockProjects.map((project) => (
              <div 
                key={project.id}
                onClick={() => handleProjectClick(project)}
                className={`border rounded-2xl p-6 flex flex-col min-h-[260px] cursor-pointer transition-all duration-200 ${
                  selectedProject?.id === project.id 
                    ? 'border-gray-900 shadow-md ring-1 ring-gray-900' 
                    : 'border-gray-200 hover:border-gray-400 hover:shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{project.title}</h3>
                  {/* File icon button. pointer-events-none ensures clicking it doesn't mess with the card click */}
                  <button className="text-gray-500 hover:text-gray-800 border border-gray-200 hover:bg-gray-50 transition-colors p-2 rounded-lg pointer-events-none">
                    <FileText size={18} strokeWidth={1.5} />
                  </button>
                </div>
                
                <div className="flex items-center gap-3 mb-auto">
                  <span className="bg-black text-white text-[11px] font-medium px-3 py-1 rounded-full">
                    {project.status}
                  </span>
                  <span className={`${project.priorityColor} text-[11px] font-medium px-3 py-1 rounded-full`}>
                    {project.priority}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-6 mt-8">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-500 font-medium">Progress</span>
                    <span className="text-gray-500 font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-1.5">
                    <div className="bg-black h-1.5 rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }}></div>
                  </div>
                </div>
                
                {/* Assignee */}
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <UserCog size={20} className="text-gray-700" strokeWidth={1.5} />
                  <span className="text-sm">{project.assignee}</span>
                </div>
              </div>
            ))}

          </div>
        </div>

        {/* This div acts as the target for our smooth scroll */}
        <div ref={detailsSectionRef}>
          {/* Render the details view dynamically if a project is selected */}
          {selectedProject && (
            <AdminProjectDetailsView 
              project={selectedProject} 
              onClose={() => setSelectedProject(null)} 
            />
          )}
        </div>

      </main>

      {/* Existing Modal Component for creating new projects */}
      <ProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}