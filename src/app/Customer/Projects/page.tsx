"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import CustomerNavi from '../../../components/CustomerNavi/CustomerNavi';
import CustomerTabs from '../../../components/CustomerNavi/CustomerTabs';

import { 
  Folder, 
  CheckCircle2, 
  Layers, 
  XCircle, 
  Briefcase, 
  ChevronRight, 
  ArrowLeft, 
  Info 
} from 'lucide-react';

// Structure of data coming from the MongoDB database (Interface)
interface Project {
  _id: string; // MongoDB ID
  name: string;
  status: 'ONGOING' | 'COMPLETED' | 'REJECTED';
  lead: string;
  deadline: string;
  progress: number;
  currentFocus?: string;
}

// Interface for the top Stats Cards displayed on the dashboard
interface Stats {
  all: number;
  completed: number;
  ongoing: number;
  rejected: number;
}

export default function CustomerProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<Stats>({ all: 0, completed: 0, ongoing: 0, rejected: 0 });
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 🔄 1. Fetch project data from the Database
  useEffect(() => {
    const fetchProjectsData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/customer/projects');
        if (response.data) {
          setProjects(response.data.projects || []);
          setStats(response.data.stats || { all: 0, completed: 0, ongoing: 0, rejected: 0 });
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to retrieve projects data:", error);
        setLoading(false);
      }
    };

    fetchProjectsData();
  }, []);

  const handleLogout = () => {
    alert("Logged out!");
  };

  // 🔍 Find the clicked project object from the projects list
  const currentProject = projects.find(p => p._id === selectedProjectId);

  // 📅 Function to format date strings into a readable format (e.g., June 10, 2026)
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // 🎯 Function to determine the current operational milestone phase based on progress percentage
  const getMilestone = (progress: number) => {
    if (progress <= 20) return 'Planning';
    if (progress <= 40) return 'UI Design';
    if (progress <= 70) return 'Development';
    if (progress <= 90) return 'Testing';
    return 'Deployment';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-10">
      <CustomerNavi 
        customerName="Kaushalya" 
        role="user" 
        onLogout={handleLogout} 
      />
      <CustomerTabs activeTab="Projects" />

      <main className="p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-8">
        
        {/* 📊 Top Status Counters Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: All Projects */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 flex justify-between items-center shadow-sm">
            <div>
              <p className="text-[11px] uppercase tracking-wider font-bold text-gray-400">All Projects</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.all}</p>
            </div>
            <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 text-gray-500">
              <Folder size={20} />
            </div>
          </div>

          {/* Card 2: Completed */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 flex justify-between items-center shadow-sm">
            <div>
              <p className="text-[11px] uppercase tracking-wider font-bold text-gray-400">Completed</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{stats.completed}</p>
            </div>
            <div className="p-2.5 bg-green-50 rounded-xl border border-green-100 text-green-500">
              <CheckCircle2 size={20} />
            </div>
          </div>

          {/* Card 3: Ongoing */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 flex justify-between items-center shadow-sm">
            <div>
              <p className="text-[11px] uppercase tracking-wider font-bold text-gray-400">Ongoing</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{stats.ongoing}</p>
            </div>
            <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-100 text-blue-500">
              <Layers size={20} />
            </div>
          </div>

          {/* Card 4: Rejected */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 flex justify-between items-center shadow-sm">
            <div>
              <p className="text-[11px] uppercase tracking-wider font-bold text-gray-400">Rejected</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{stats.rejected}</p>
            </div>
            <div className="p-2.5 bg-red-50 rounded-xl border border-red-100 text-red-500">
              <XCircle size={20} />
            </div>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="text-center py-12 text-gray-500 animate-pulse">Loading project intelligence pipeline...</div>
        ) : !currentProject ? (
          
          /* 📋 VIEW A: YOUR PROJECTS LIST */
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Your Projects</h2>
              <p className="text-xs text-gray-400 mt-0.5">Track and review engineering timeline milestones and deployment phases</p>
            </div>

            <div className="flex flex-col gap-4">
              {projects.length === 0 ? (
                <div className="text-center py-12 bg-white border border-dashed rounded-2xl text-gray-400 text-sm">
                  No projects found in the system. Use Postman to insert some!
                </div>
              ) : (
                projects.map((project) => (
                  <div 
                    key={project._id}
                    onClick={() => setSelectedProjectId(project._id)}
                    className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-4 hover:border-gray-300 shadow-sm cursor-pointer transition-all hover:translate-x-0.5"
                  >
                    <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-500">
                      <Briefcase size={20} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-gray-900 truncate">{project.name}</h3>
                        <span className={`text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full uppercase ${
                          project.status === 'ONGOING' ? 'bg-blue-50 text-blue-600' :
                          project.status === 'COMPLETED' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Lead: <span className="text-gray-700 font-medium">{project.lead}</span>
                        <span className="mx-2 text-gray-300">•</span>
                        Deadline: <span className="text-gray-700 font-medium">{formatDate(project.deadline)}</span>
                      </p>
                    </div>

                    <div className="hidden md:flex items-center gap-4 w-full max-w-[280px]">
                      <div className="flex-1">
                        <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 mb-1">
                          <span>Overall Progress</span>
                          <span className="text-gray-900">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              project.status === 'ONGOING' ? 'bg-blue-600' :
                              project.status === 'COMPLETED' ? 'bg-green-600' : 'bg-red-500'
                            }`} 
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        ) : (

          /* 🔍 VIEW B: MILESTONE TRACK DETAILS EXPANDED */
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex flex-col gap-3">
              <button 
                onClick={() => setSelectedProjectId(null)}
                className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-wider self-start"
              >
                <ArrowLeft size={14} /> Back to project list
              </button>

              <div className="mt-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-gray-900">{currentProject.name}</h2>
                  <span className={`text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full uppercase ${
                    currentProject.status === 'ONGOING' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                    currentProject.status === 'COMPLETED' ? 'bg-green-50 text-green-600 border border-green-200' : 
                    'bg-red-50 text-red-600 border border-red-200'
                  }`}>
                    {currentProject.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1.5">
                  Project Manager: <span className="text-gray-800 font-bold">{currentProject.lead}</span>
                  <span className="mx-2 text-gray-200">•</span>
                  Target Deadline: <span className="text-gray-800 font-bold">{formatDate(currentProject.deadline)}</span>
                </p>
              </div>
            </div>

            <div className="p-6 md:p-8 flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold tracking-wider text-gray-900 uppercase">Milestone Progress Track</h3>
                <span className="text-2xl font-extrabold text-blue-600">{currentProject.progress}%</span>
              </div>

              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    currentProject.status === 'ONGOING' ? 'bg-blue-600' :
                    currentProject.status === 'COMPLETED' ? 'bg-green-600' : 'bg-red-500'
                  }`}
                  style={{ width: `${currentProject.progress}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-5 text-center mt-1 border-t border-gray-50 pt-4">
                {(['Planning', 'UI Design', 'Development', 'Testing', 'Deployment'] as const).map((phase, idx) => {
                  const calculatedMilestone = getMilestone(currentProject.progress);
                  const phases = ['Planning', 'UI Design', 'Development', 'Testing', 'Deployment'];
                  const currentIdx = phases.indexOf(calculatedMilestone);
                  const isCompleted = idx < currentIdx;
                  const isActive = phase === calculatedMilestone;

                  return (
                    <div key={phase} className="flex flex-col items-center relative">
                      <div className={`absolute top-[-17px] left-0 right-0 h-[3px] ${
                        isActive ? 'bg-blue-600' : isCompleted ? 'bg-gray-900' : 'bg-gray-200'
                      }`} />
                      
                      <span className={`text-[11px] font-bold block ${
                        isActive ? 'text-blue-600 font-extrabold' : isCompleted ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {phase}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Panel Notice: Current Focus Info Callout */}
            {currentProject.currentFocus && (
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-4 flex items-start gap-3">
                  <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-[#1E40AF] leading-relaxed w-full">
                    <span className="font-bold uppercase tracking-wider block mb-1">Current Focus Status</span>
                    <p>
                      {currentProject.currentFocus.split('Next Sprint:')[0]}
                      {currentProject.currentFocus.includes('Next Sprint:') && (
                        <>
                          <span className="font-bold text-[#1E3A8A]">Next Sprint:</span>
                          {currentProject.currentFocus.split('Next Sprint:')[1]}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
}