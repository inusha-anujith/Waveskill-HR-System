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
    <div className="space-y-6">
      
      {/* --- TOP METRIC CARDS GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-gray-200 p-5 shadow-sm rounded-xl flex flex-col justify-between">
           <div className="flex justify-between items-start text-gray-400">
             <h3 className="text-gray-500 text-xs uppercase tracking-wider font-semibold">All Projects</h3>
             <Folder size={16} />
           </div>
           <p className="text-3xl font-bold mt-2 text-black">{totalCount}</p>
        </div>
        <div className="bg-white border border-gray-200 p-5 shadow-sm rounded-xl flex flex-col justify-between">
           <div className="flex justify-between items-start text-green-500">
             <h3 className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Completed</h3>
             <CheckCircle2 size={16} />
           </div>
           <p className="text-3xl font-bold mt-2 text-green-600">{completedCount}</p>
        </div>
        <div className="bg-white border border-gray-200 p-5 shadow-sm rounded-xl flex flex-col justify-between">
           <div className="flex justify-between items-start text-blue-500">
             <h3 className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Ongoing</h3>
             <Layers size={16} />
           </div>
           <p className="text-3xl font-bold mt-2 text-blue-600">{ongoingCount}</p>
        </div>
        <div className="bg-white border border-gray-200 p-5 shadow-sm rounded-xl flex flex-col justify-between">
           <div className="flex justify-between items-start text-red-500">
             <h3 className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Rejected</h3>
             <XCircle size={16} />
           </div>
           <p className="text-3xl font-bold mt-2 text-red-600">{rejectedCount}</p>
        </div>
        
        {/* Call-to-action Card: Start New Project */}
        <div className="bg-black text-white p-5 shadow-sm rounded-xl flex flex-col justify-between cursor-pointer hover:bg-gray-900 transition-colors border border-black group">
           <div className="flex justify-between items-start text-gray-400">
             <h3 className="text-gray-300 text-xs uppercase tracking-wider font-semibold">Initialization</h3>
             <Plus size={16} className="text-white group-hover:rotate-90 transition-transform duration-200" />
           </div>
           <p className="text-lg font-bold mt-2">Start New Project</p>
        </div>
      </div>

      {/* --- CONDITIONAL VIEW ROUTING --- */}
      {!activeProjectId ? (
        
        /* ==================== 1. PROJECT LIST VIEW ==================== */
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-xl font-bold text-black">Your Projects</h2>
            <p className="text-sm text-gray-500">Track and review statuses across development</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {projectsData.map((project) => (
              <div 
                key={project.id}
                onClick={() => setActiveProjectId(project.id)}
                className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm hover:border-black transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl text-gray-700 border border-gray-100 group-hover:bg-black group-hover:text-white transition-colors">
                    <Briefcase size={22} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <h3 className="font-bold text-lg text-black group-hover:text-blue-600 transition-colors">{project.name}</h3>
                      
                      {/* Highlighted Status Badge */}
                      <span className={`text-xs font-bold px-3 py-0.5 rounded-full border tracking-wide ${project.statusColor}`}>
                        {project.status}
                      </span>
                      
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${project.priorityColor}`}>
                        {project.priority} Prio
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 space-x-4">
                      <span><strong>Lead:</strong> {project.manager}</span>
                      <span>•</span>
                      <span><strong>Deadline:</strong> {project.deadline}</span>
                    </p>
                  </div>
                </div>

                {/* Progress bar state visualization based on system status */}
                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <div className="w-full md:w-44 space-y-1">
                    <div className="flex justify-between text-xs font-bold text-gray-700">
                      <span>Progress</span>
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
                  <ChevronRight size={20} className="text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all hidden md:block" />
                </div>
              </div>
            ))}
          </div>
        </div>

      ) : (

        /* ==================== 2. DETAILED PROJECT PORTAL VIEW ==================== */
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden animate-in fade-in duration-200">
          
          {/* Header Block */}
          <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
            <div>
              <button 
                onClick={() => setActiveProjectId(null)}
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-black mb-3 transition-colors"
              >
                <ArrowLeft size={14} /> Back to Project List
              </button>
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border tracking-wide ${currentProject?.statusColor}`}>
                  {currentProject?.status}
                </span>
                <h2 className="text-2xl font-bold text-black">{currentProject?.name}</h2>
              </div>
              <p className="text-sm text-gray-500 flex items-center gap-4">
                <span><strong>Manager:</strong> {currentProject?.manager}</span>
                <span><strong>Deadline:</strong> {currentProject?.deadline}</span>
              </p>
            </div>
            <div className="flex gap-3">
               <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                 <MessageSquare size={16} /> Contact Team
               </button>
               <button className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-semibold border border-black rounded-lg hover:bg-gray-800 transition-colors">
                 <Upload size={16} /> Upload Assets
               </button>
            </div>
          </div>

          {/* Progress Section */}
          <div className="p-6 border-b border-gray-200">
             <div className="flex justify-between items-end mb-2">
               <h3 className="font-bold text-black">Overall Progress</h3>
               <span className="text-2xl font-bold text-blue-600">{currentProject?.progress}%</span>
             </div>
             <div className="w-full bg-gray-100 h-3 border border-gray-200 rounded-full overflow-hidden">
               <div 
                 className={`h-full rounded-full ${currentProject?.status === "Rejected" ? "bg-red-500" : currentProject?.status === "Completed" ? "bg-green-600" : "bg-blue-600"}`} 
                 style={{ width: `${currentProject?.progress}%` }}
               ></div>
             </div>
             
             <div className="grid grid-cols-5 gap-2 mt-4 text-xs font-semibold text-center text-gray-500">
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
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
            <div className="lg:col-span-2 p-6 space-y-8">
              
              {currentProject?.status === "Rejected" ? (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                   <h4 className="text-sm font-bold text-red-900 mb-1 flex items-center gap-2">
                     <XCircle size={16} /> Project Terminated / Rejected
                   </h4>
                   <p className="text-sm text-red-800">
                     Development pipeline on this initiative has been discontinued. Please contact your account representative to review strategy amendments.
                   </p>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                   <h4 className="text-sm font-bold text-blue-900 mb-1 flex items-center gap-2">
                     <AlertCircle size={16} /> Current Focus
                   </h4>
                   <p className="text-sm text-blue-800">
                     Frontend development is ongoing. Login system completed. <strong>Next: Payment integration.</strong>
                   </p>
                </div>
              )}

              <div>
                <h3 className="font-bold text-lg mb-4 text-black">Project Milestones</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border border-gray-200 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="text-green-600" size={20} />
                      <div>
                        <h4 className="font-bold text-sm text-black">Milestone 1: UI/UX Design</h4>
                        <p className="text-xs text-gray-500">Completed on May 15</p>
                      </div>
                    </div>
                    <button className="text-sm font-semibold border border-gray-300 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors">View Files</button>
                  </div>

                  {currentProject?.status !== "Rejected" && (
                    <div className="flex items-center justify-between p-4 border border-blue-200 bg-blue-50/30 shadow-sm relative overflow-hidden rounded-lg">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-lg"></div>
                      <div className="flex items-center gap-3 pl-2">
                        <Clock className="text-blue-600" size={20} />
                        <div>
                          <h4 className="font-bold text-sm text-black">Milestone 2: Frontend Auth Module</h4>
                          <p className="text-xs text-blue-600 font-medium">Client Approval Required</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-sm font-semibold border border-red-200 text-red-600 px-3 py-1 bg-white rounded-md hover:bg-red-50 transition-colors">Reject</button>
                        <button className="text-sm font-semibold border border-black bg-black text-white px-3 py-1 rounded-md hover:bg-gray-800 transition-colors">Approve Work</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                <button className="text-sm font-semibold px-4 py-2 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition-colors">Request Change</button>
                <button className="text-sm font-semibold px-4 py-2 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition-colors">Request Update</button>
                <button className="text-sm font-semibold px-4 py-2 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <FileText size={16} /> Download Deliverables
                </button>
              </div>

            </div>

            {/* Right Column: Log */}
            <div className="p-6 bg-gray-50/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-black">Activity Log</h3>
                <MoreVertical size={16} className="text-gray-400 cursor-pointer" />
              </div>
              
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-gray-200 before:to-transparent">
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-5 h-5 border border-white bg-blue-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 rounded-full"></div>
                  <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-white p-3 border border-gray-200 shadow-sm rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Today, 10:42 AM</p>
                    <p className="text-sm font-medium text-black">Status updated to {currentProject?.status}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}