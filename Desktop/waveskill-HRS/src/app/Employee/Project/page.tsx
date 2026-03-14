"use client";

import React, { useState, useRef, useEffect } from 'react';
import EmployeeNavi from '../../../components/EmployeeNavi/EmployeeNavi';
import EmployeeTabs from '../../../components/EmployeeNavi/EmployeeTabs';
import ProjectDetailsView from '../../../components/EmployeeProjects/ProjectDetailsView';
import { Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EmployeeProjectsPage() {
  const router = useRouter();
  
  const [projects, setProjects] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0 });
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const detailsSectionRef = useRef<HTMLDivElement>(null);

  // 1. Fetch real projects from the backend
  const fetchMyProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch("http://localhost:5001/api/projects/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = await res.json();
      
      if (data.success) {
        setProjects(data.projects || []);
        setStats(data.stats || { total: 0, active: 0, completed: 0 });
        
        // If a project is currently open, refresh its data too
        if (selectedProject) {
          const updatedProject = data.projects.find((p: any) => p._id === selectedProject._id);
          if (updatedProject) setSelectedProject(updatedProject);
        }
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchMyProjects();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push('/login');
  };

  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
    setTimeout(() => {
      detailsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "No Date";
    try { return new Date(dateString).toLocaleDateString(); } catch (e) { return dateString; }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-10">
      <EmployeeNavi employeeName="Nithini Jayathilaka" onLogout={handleLogout} />
      <EmployeeTabs activeTab="Projects" />

      <main className="p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">
        
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">My Projects</h2>
            <p className="text-sm text-gray-500">Projects you are assigned to. Click a project to view details and update tasks.</p>
          </div>

          {/* Real Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div 
                key={project._id}
                onClick={() => handleProjectClick(project)}
                className={`border rounded-2xl p-6 flex flex-col cursor-pointer transition-all duration-200 
                  ${selectedProject?._id === project._id 
                    ? 'border-gray-900 shadow-md ring-1 ring-gray-900' 
                    : 'border-gray-200 hover:border-gray-400 hover:shadow-sm'
                  }`}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2">{project.title}</h3>
                
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

                <div className="mb-6">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-700 font-medium">Progress</span>
                    <span className="text-gray-700 font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-black h-1.5 rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }}></div>
                  </div>
                </div>

                <div className="mb-6 text-gray-700 flex items-center gap-2 text-sm font-medium">
                  <Calendar size={20} strokeWidth={1.5} /> {formatDate(project.dueDate)}
                </div>

                <hr className="border-gray-100 mb-4" />

                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center text-sm font-semibold">
                    {/* Just grabbing the first letter of the first team member, or 'U' for User */}
                    {project.team && project.team.length > 0 && project.team[0].user?.name ? project.team[0].user.name.charAt(0) : 'U'}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {project.team && project.team.length > 0 && project.team[0].user?.name ? project.team[0].user.name : 'Team Member'}
                  </span>
                </div>
              </div>
            ))}

            {projects.length === 0 && (
              <div className="col-span-full py-10 text-center text-gray-500">
                No projects assigned to you yet.
              </div>
            )}
          </div>
        </div>

        {/* Real Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Total Projects</p>
            <p className="text-4xl font-semibold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Active Projects</p>
            <p className="text-4xl font-semibold text-orange-400">{stats.active}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Completed Projects</p>
            <p className="text-4xl font-semibold text-green-500">{stats.completed}</p>
          </div>
        </div>

        <div ref={detailsSectionRef}>
          {selectedProject && (
            <ProjectDetailsView 
              project={selectedProject} 
              onClose={() => setSelectedProject(null)} 
              onRefresh={fetchMyProjects} // Pass the refresh function to the child!
            />
          )}
        </div>

      </main>
    </div>
  );
}