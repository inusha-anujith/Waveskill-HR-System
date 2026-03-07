"use client";

import React, { useState, useRef } from 'react';
// Correctly routing up 3 levels
import EmployeeNavi from '../../../components/EmployeeNavi/EmployeeNavi';
import EmployeeTabs from '../../../components/EmployeeNavi/EmployeeTabs';
import ProjectDetailsView from '../../../components/EmployeeProjects/ProjectDetailsView';
import { Calendar } from 'lucide-react';

// Mock Data for the projects
const mockProjects = [
  {
    id: 1,
    title: "HR Management System",
    status: "Active",
    priority: "high priority",
    progress: 45,
    dueDate: "Jan 30, 2026",
    assigneeInitials: "J",
    assigneeName: "John Doe",
    description: "Development of the internal HR management platform, focusing on the Employee Portal UI, project tracking, and leave management systems.",
    tasks: {
      todo: ["Design Profile Page UI", "Connect API for Leave Requests"],
      inProgress: ["Implement Project Expansion View"],
      completed: ["Create Navigation Tabs", "Set up Next.js App Router"]
    }
  },
  {
    id: 2,
    title: "Marketing Website Revamp",
    status: "Active",
    priority: "normal priority",
    progress: 15,
    dueDate: "Feb 15, 2026",
    assigneeInitials: "J",
    assigneeName: "John Doe",
    description: "Complete redesign of the public-facing marketing website to improve SEO and conversion rates.",
    tasks: {
      todo: ["Audit existing SEO", "Draft wireframes"],
      inProgress: [],
      completed: ["Initial kick-off meeting"]
    }
  }
];

export default function EmployeeProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const detailsSectionRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    alert("Logged out!");
  };

  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
    
    // Slight delay ensures the component renders before we scroll to it
    setTimeout(() => {
      detailsSectionRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-10">
      {/* Navigation & Tabs */}
      <EmployeeNavi employeeName="Nithini Jayathilaka" onLogout={handleLogout} />
      <EmployeeTabs activeTab="Projects" />

      {/* Main Content */}
      <main className="p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">
        
        {/* Top Section: Projects Grid */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">My Projects</h2>
            <p className="text-sm text-gray-500">Projects you are assigned to. Click a project to view details and update tasks.</p>
          </div>

          {/* Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {mockProjects.map((project) => (
              <div 
                key={project.id}
                onClick={() => handleProjectClick(project)}
                className={`border rounded-2xl p-6 flex flex-col cursor-pointer transition-all duration-200 
                  ${selectedProject?.id === project.id 
                    ? 'border-gray-900 shadow-md ring-1 ring-gray-900' 
                    : 'border-gray-200 hover:border-gray-400 hover:shadow-sm'
                  }`}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2">{project.title}</h3>
                
                {/* Badges */}
                <div className="flex items-center gap-3 mb-8">
                  <span className="bg-black text-white text-[11px] font-medium px-3 py-1.5 rounded-md">
                    {project.status}
                  </span>
                  <span className={`text-[11px] font-medium px-3 py-1.5 rounded-md ${
                    project.priority === 'high priority' ? 'bg-red-200 text-red-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {project.priority}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-700 font-medium">Progress</span>
                    <span className="text-gray-700 font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-black h-1.5 rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }}></div>
                  </div>
                </div>

                {/* Calendar Icon */}
                <div className="mb-6 text-gray-700">
                  <Calendar size={20} strokeWidth={1.5} />
                </div>

                <hr className="border-gray-100 mb-4" />

                {/* Assignee */}
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center text-sm font-semibold">
                    {project.assigneeInitials}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{project.assigneeName}</span>
                </div>
              </div>
            ))}
            
          </div>
        </div>

        {/* Bottom Stats Grid (Moves up above the details section) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Total Projects</p>
            <p className="text-4xl font-semibold text-gray-900">{mockProjects.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Active Projects</p>
            <p className="text-4xl font-semibold text-orange-400">
              {mockProjects.filter(p => p.status === 'Active').length}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Completed Projects</p>
            <p className="text-4xl font-semibold text-green-500">0</p>
          </div>
        </div>

        {/* This div acts as the target for our smooth scroll */}
        <div ref={detailsSectionRef}>
          {/* Render the details view dynamically if a project is selected */}
          {selectedProject && (
            <ProjectDetailsView 
              project={selectedProject} 
              onClose={() => setSelectedProject(null)} 
            />
          )}
        </div>

      </main>
    </div>
  );
}