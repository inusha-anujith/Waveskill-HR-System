"use client";

import { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  FileText, 
  Upload, 
  AlertCircle,
  MoreVertical,
  ArrowLeft,
  ChevronRight,
  Briefcase,
  XCircle,
  Folder,
  Layers,
  Plus
} from 'lucide-react';

// Mock Data for the Customer's Projects with distinct status classifications
const projectsData = [
  {
    id: "proj-01",
    name: "Global E-Commerce Platform",
    status: "Ongoing",
    statusColor: "bg-blue-50 text-blue-700 border-blue-200",
    progress: 65,
    manager: "Sarah Jenkins",
    deadline: "June 10, 2026",
    priority: "High",
    priorityColor: "bg-red-50 text-red-700 border-red-100"
  },
  {
    id: "proj-02",
    name: "Corporate Website Redesign",
    status: "Completed",
    statusColor: "bg-green-50 text-green-700 border-green-200",
    progress: 100,
    manager: "Alex Rivera",
    deadline: "May 18, 2026",
    priority: "Medium",
    priorityColor: "bg-amber-50 text-amber-700 border-amber-100"
  },
  {
    id: "proj-03",
    name: "Mobile Banking App UI",
    status: "Rejected",
    statusColor: "bg-red-50 text-red-700 border-red-200",
    progress: 15,
    manager: "Sarah Jenkins",
    deadline: "Cancelled",
    priority: "High",
    priorityColor: "bg-red-50 text-red-700 border-red-100"
  }
];

export default function ProjectsPage() {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  // Calculate project state counts based on real-time data array
  const totalCount = projectsData.length;
  const completedCount = projectsData.filter(p => p.status === "Completed").length;
  const ongoingCount = projectsData.filter(p => p.status === "Ongoing").length;
  const rejectedCount = projectsData.filter(p => p.status === "Rejected").length;

  const currentProject = projectsData.find(p => p.id === activeProjectId);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* --- TOP METRIC CARDS GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm flex items-center justify-between">
           <div className="space-y-1.5">
             <h3 className="text-gray-400 text-xs uppercase tracking-wider font-bold">All Projects</h3>
             <p className="text-3xl font-bold text-black">{totalCount}</p>
           </div>
           <div className="p-3 bg-gray-50 border border-gray-100 text-gray-500 rounded-xl">
             <Folder size={18} />
           </div>
        </div>

        <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm flex items-center justify-between">
           <div className="space-y-1.5">
             <h3 className="text-gray-400 text-xs uppercase tracking-wider font-bold">Completed</h3>
             <p className="text-3xl font-bold text-green-600">{completedCount}</p>
           </div>
           <div className="p-3 bg-green-50 border border-green-100 text-green-600 rounded-xl">
             <CheckCircle2 size={18} />
           </div>
        </div>

        <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm flex items-center justify-between">
           <div className="space-y-1.5">
             <h3 className="text-gray-400 text-xs uppercase tracking-wider font-bold">Ongoing</h3>
             <p className="text-3xl font-bold text-blue-600">{ongoingCount}</p>
           </div>
           <div className="p-3 bg-blue-50 border border-blue-100 text-blue-600 rounded-xl">
             <Layers size={18} />
           </div>
        </div>

        <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm flex items-center justify-between">
           <div className="space-y-1.5">
             <h3 className="text-gray-400 text-xs uppercase tracking-wider font-bold">Rejected</h3>
             <p className="text-3xl font-bold text-red-600">{rejectedCount}</p>
           </div>
           <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl">
             <XCircle size={18} />
           </div>
        </div>
      </div>

      {/* --- CONDITIONAL VIEW ROUTING --- */}
      {!activeProjectId ? (
        
        /* ==================== 1. PROJECT LIST VIEW ==================== */
        <div className="space-y-4">
          <div className="px-1">
            <h2 className="text-xl font-bold text-black">Your Projects</h2>
            <p className="text-xs text-gray-500 mt-0.5">Track and review engineering timeline milestones and deployment phases</p>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {projectsData.map((project) => (
              <div 
                key={project.id}
                onClick={() => setActiveProjectId(project.id)}
                className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm hover:border-black transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl text-gray-600 border border-gray-100 group-hover:bg-black group-hover:text-white group-hover:border-black transition-colors shrink-0">
                    <Briefcase size={20} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-base text-black group-hover:text-blue-600 transition-colors">{project.name}</h3>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${project.statusColor}`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
                      <p>Lead: <span className="text-gray-700 font-semibold">{project.manager}</span></p>
                      <span className="hidden sm:inline text-gray-200">•</span>
                      <p>Deadline: <span className="text-gray-700 font-semibold">{project.deadline}</span></p>
                    </div>
                  </div>
                </div>

                {/* Progress bar state visualization */}
                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-gray-50">
                  <div className="w-full md:w-44 space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-gray-700">
                      <span className="text-gray-400 font-medium">Overall Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 border border-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          project.status === "Rejected" ? "bg-red-500" : project.status === "Completed" ? "bg-green-600" : "bg-blue-600"
                        }`} 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-400 group-hover:text-black group-hover:translate-x-0.5 transition-all hidden md:block" />
                </div>
              </div>
            ))}
          </div>
        </div>

      ) : (

        /* ==================== 2. DETAILED PROJECT PORTAL VIEW ==================== */
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden animate-in fade-in duration-200">
          
          {/* Header Block */}
          <div className="p-6 border-b border-gray-200 bg-gray-50/50 space-y-4">
            <button 
              onClick={() => setActiveProjectId(null)}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-black transition-colors"
            >
              <ArrowLeft size={14} /> Back to Project List
            </button>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-2xl font-bold text-black tracking-tight">{currentProject?.name}</h2>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${currentProject?.statusColor}`}>
                    {currentProject?.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                  <p>Project Manager: <span className="text-black font-semibold">{currentProject?.manager}</span></p>
                  <span className="text-gray-200 hidden sm:inline">•</span>
                  <p>Target Deadline: <span className="text-black font-semibold">{currentProject?.deadline}</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="p-6 border-b border-gray-200 space-y-4">
             <div className="flex justify-between items-end">
               <h3 className="font-bold text-sm text-black uppercase tracking-wider">Milestone Progress Track</h3>
               <span className="text-2xl font-bold text-blue-600">{currentProject?.progress}%</span>
             </div>
             <div className="w-full bg-gray-100 h-2.5 border border-gray-200 rounded-full overflow-hidden">
               <div 
                 className={`h-full rounded-full transition-all duration-500 ${currentProject?.status === "Rejected" ? "bg-red-500" : currentProject?.status === "Completed" ? "bg-green-600" : "bg-blue-600"}`} 
                 style={{ width: `${currentProject?.progress}%` }}
               ></div>
             </div>
             
             {/* Dynamic workflow pipeline steps indicators */}
             <div className="grid grid-cols-5 gap-2 pt-2 text-[11px] font-bold text-center text-gray-400">
                <div className="text-black border-t-2 border-black pt-2">Planning</div>
                <div className="text-black border-t-2 border-black pt-2">UI Design</div>
                <div className={`${currentProject?.status === "Rejected" ? "text-red-600 border-red-500" : "text-blue-600 border-blue-600"} border-t-2 pt-2`}>
                  {currentProject?.status === "Rejected" ? "Halted" : "Development"}
                </div>
                <div className="border-t-2 border-gray-200 pt-2">Testing</div>
                <div className="border-t-2 border-gray-200 pt-2">Deployment</div>
             </div>
          </div>

          {/* Sub-Layout columns */}
          <div className="p-6 bg-white">
            {currentProject?.status === "Rejected" ? (
              <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3">
                 <XCircle size={16} className="text-red-600 mt-0.5 shrink-0" />
                 <div className="space-y-1">
                   <h4 className="text-xs font-bold text-red-900 uppercase tracking-wider">Project Terminated / Rejected</h4>
                   <p className="text-xs text-red-800 leading-relaxed">
                     Development pipeline on this initiative has been discontinued. Please contact your account representative to review strategy amendments.
                   </p>
                 </div>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
                 <AlertCircle size={16} className="text-blue-600 mt-0.5 shrink-0" />
                 <div className="space-y-1">
                   <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider">Current Focus Status</h4>
                   <p className="text-xs text-blue-800 leading-relaxed">
                     Frontend architecture builds are currently active. Authentication login systems completed. <strong className="text-blue-900">Next Sprint: Payment gateway loop integration pipelines.</strong>
                   </p>
                 </div>
              </div>  
            )}
          </div>
        </div>
      )}
    </div>
  );
}