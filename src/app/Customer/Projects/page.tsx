"use client";

import { useState } from 'react';
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

// Define structures for mock data matching images 1.2 (1).png and 1.3 (1).png
interface Project {
  id: string;
  name: string;
  status: 'ONGOING' | 'COMPLETED' | 'REJECTED';
  lead: string;
  deadline: string;
  progress: number;
  currentMilestone: 'Planning' | 'UI Design' | 'Development' | 'Testing' | 'Deployment';
  focusStatusText: string;
}

export default function CustomerProjectsPage() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const handleLogout = () => {
    alert("Logged out!");
  };

  // Mock projects population matching the image criteria perfectly
  const projectsData: Project[] = [
    {
      id: "global-ecommerce",
      name: "Global E-Commerce Platform",
      status: "ONGOING",
      lead: "Sarah Jenkins",
      deadline: "June 10, 2026",
      progress: 65,
      currentMilestone: "Development",
      focusStatusText: "Frontend architecture builds are currently active. Authentication login systems completed. Next Sprint: Payment gateway loop integration pipelines."
    },
    {
      id: "corporate-redesign",
      name: "Corporate Website Redesign",
      status: "COMPLETED",
      lead: "Alex Rivera",
      deadline: "May 18, 2026",
      progress: 100,
      currentMilestone: "Deployment",
      focusStatusText: "The project has successfully cleared deployment criteria. All assets and metrics have been handed over to the core DevOps ecosystem."
    },
    {
      id: "mobile-banking",
      name: "Mobile Banking App UI",
      status: "REJECTED",
      lead: "Marcus Chen",
      deadline: "April 05, 2026",
      progress: 15,
      currentMilestone: "UI Design",
      focusStatusText: "Timeline architectural constraints conflict with structural baseline demands. Scope evaluation is currently suspended pending revisions."
    }
  ];

  // Find the currently selected project for detailed tracking view
  const currentProject = projectsData.find(p => p.id === selectedProjectId);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-10">
      {/* Imported Shared Navigation */}
      <CustomerNavi 
        customerName="Customer User" 
        role="user" 
        onLogout={handleLogout} 
      />
      <CustomerTabs activeTab="Projects" />

      {/* Main Dashboard Content */}
      <main className="p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-8">
        
        {/* Top Status Counters Cards Grid (Persists on both views) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: All Projects */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 flex justify-between items-center shadow-sm">
            <div>
              <p className="text-[11px] uppercase tracking-wider font-bold text-gray-400">All Projects</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">3</p>
            </div>
            <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 text-gray-500">
              <Folder size={20} />
            </div>
          </div>

          {/* Card 2: Completed */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 flex justify-between items-center shadow-sm">
            <div>
              <p className="text-[11px] uppercase tracking-wider font-bold text-gray-400">Completed</p>
              <p className="text-3xl font-bold text-green-600 mt-1">1</p>
            </div>
            <div className="p-2.5 bg-green-50 rounded-xl border border-green-100 text-green-500">
              <CheckCircle2 size={20} />
            </div>
          </div>

          {/* Card 3: Ongoing */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 flex justify-between items-center shadow-sm">
            <div>
              <p className="text-[11px] uppercase tracking-wider font-bold text-gray-400">Ongoing</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">1</p>
            </div>
            <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-100 text-blue-500">
              <Layers size={20} />
            </div>
          </div>

          {/* Card 4: Rejected */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 flex justify-between items-center shadow-sm">
            <div>
              <p className="text-[11px] uppercase tracking-wider font-bold text-gray-400">Rejected</p>
              <p className="text-3xl font-bold text-red-600 mt-1">1</p>
            </div>
            <div className="p-2.5 bg-red-50 rounded-xl border border-red-100 text-red-500">
              <XCircle size={20} />
            </div>
          </div>
        </div>


        {/* CONDITIONAL VIEW RENDERING CONTROL */}
        {!currentProject ? (
          
          /* VIEW A: YOUR PROJECTS LIST (Ref: 1.2 (1).png) */
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Your Projects</h2>
              <p className="text-xs text-gray-400 mt-0.5">Track and review engineering timeline milestones and deployment phases</p>
            </div>

            <div className="flex flex-col gap-4">
              {projectsData.map((project) => (
                <div 
                  key={project.id}
                  onClick={() => setSelectedProjectId(project.id)}
                  className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-4 hover:border-gray-300 shadow-sm cursor-pointer transition-all hover:translate-x-0.5"
                >
                  {/* Briefcase Asset Container */}
                  <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-500">
                    <Briefcase size={20} />
                  </div>

                  {/* Core metadata cluster */}
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
                      Deadline: <span className="text-gray-700 font-medium">{project.deadline}</span>
                    </p>
                  </div>

                  {/* Operational progress bar section mapping */}
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
              ))}
            </div>
          </div>

        ) : (

          /* VIEW B: MILESTONE TRACK DETAILS EXPANDED (Ref: 1.3 (1).png) */
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            
            {/* Header / Meta Description Cluster */}
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
                  Target Deadline: <span className="text-gray-800 font-bold">{currentProject.deadline}</span>
                </p>
              </div>
            </div>

            {/* Central Milestone Metrics Tracker Blueprint */}
            <div className="p-6 md:p-8 flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold tracking-wider text-gray-900 uppercase">Milestone Progress Track</h3>
                <span className="text-2xl font-extrabold text-blue-600">{currentProject.progress}%</span>
              </div>

              {/* Progress Tracker Slider Meter */}
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    currentProject.status === 'ONGOING' ? 'bg-blue-600' :
                    currentProject.status === 'COMPLETED' ? 'bg-green-600' : 'bg-red-500'
                  }`}
                  style={{ width: `${currentProject.progress}%` }}
                ></div>
              </div>

              {/* Segmented Timeline Milestone States */}
              <div className="grid grid-cols-5 text-center mt-1 border-t border-gray-50 pt-4">
                {(['Planning', 'UI Design', 'Development', 'Testing', 'Deployment'] as const).map((phase, idx, arr) => {
                  const phases = ['Planning', 'UI Design', 'Development', 'Testing', 'Deployment'];
                  const currentIdx = phases.indexOf(currentProject.currentMilestone);
                  const isCompleted = idx < currentIdx;
                  const isActive = phase === currentProject.currentMilestone;

                  return (
                    <div key={phase} className="flex flex-col items-center relative">
                      {/* Top indicator track border accent emulation */}
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
            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-4 flex items-start gap-3">
                <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-[#1E40AF] leading-relaxed">
                  <span className="font-bold uppercase tracking-wider block mb-1">Current Focus Status</span>
                  <p>
                    {currentProject.focusStatusText.split('Next Sprint:')[0]}
                    {currentProject.focusStatusText.includes('Next Sprint:') && (
                      <>
                        <span className="font-bold text-[#1E3A8A]">Next Sprint:</span>
                        {currentProject.focusStatusText.split('Next Sprint:')[1]}
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}