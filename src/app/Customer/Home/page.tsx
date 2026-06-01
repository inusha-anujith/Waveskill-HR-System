"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import CustomerNavi from '../../../components/CustomerNavi/CustomerNavi';
import CustomerTabs from '../../../components/CustomerNavi/CustomerTabs';
import { Briefcase, ArrowRight } from 'lucide-react';

// Project එකක TypeScript interface එක (Type-safety සඳහා)
interface Project {
  _id: string;
  name: string;
  status: string;
  progress: number; // උදා: 70
}

export default function CustomerHomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [customerName, setCustomerName] = useState<string>("Kaushalya");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // LocalStorage එකෙන් Login වෙද්දී සේව් වුණු Token එක ගන්නවා
        const token = localStorage.getItem('token'); 
        
        // ⚠️ Inusha හදපු Route URL එක මෙතනට දාන්න (දැනට මම '/api/customer/projects' කියලා දැම්මා)
        const response = await axios.get('http://localhost:5001/api/customer/projects', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Back-end එකෙන් දත්ත ආවට පස්සේ ඒවා State වලට දානවා
        if (response.data) {
          // සාමාන්‍යයෙන් response එකේ user නම සහ projects ලිස්ට් එක එනවා
          if (response.data.projects) setProjects(response.data.projects);
          if (response.data.user?.firstName) setCustomerName(response.data.user.firstName);
        }
        setLoading(false);
      } catch (error) {
        console.error("Back-end එකෙන් Data ගන්න බැරි වුණා:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Token එක clear කරනවා
    alert("Logged out!");
    window.location.href = "/login"; // Login පිටුවට පිටත් කරනවා
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-10">
      {/* Imported Shared Navigation */}
      <CustomerNavi 
        customerName={customerName} 
        role="user" 
        onLogout={handleLogout} 
      />
      <CustomerTabs activeTab="Home" />

      {/* Main Dashboard Content */}
      <main className="p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">
        
        {/* Welcome Banner Card */}
        <div className="bg-black text-white rounded-2xl p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              Welcome back, {customerName} <span className="animate-pulse">👋</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Here is a centralized snapshot overview monitoring your ongoing development pipeline.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#121824] border border-gray-800 px-3 py-1.5 rounded-full self-start md:self-center">
            <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
            <span className="text-xs text-gray-300 font-medium">Staging Servers Operational</span>
          </div>
        </div>

        {/* Active Projects Progression Container */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col gap-5">
          {/* Header section */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Active Projects Progression</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Real-time compilation meters from ongoing tracking timelines
              </p>
            </div>
            <button className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors">
              View All <ArrowRight size={14} />
            </button>
          </div>

          {/* Project List */}
          <div className="flex flex-col gap-4">
            
            {/* Loading එකක් පෙන්නනවා Data එනකල් */}
            {loading ? (
              <div className="text-center py-6 text-sm text-gray-500 animate-pulse">
                Loading ongoing projects...
              </div>
            ) : projects.length === 0 ? (
              // Projects මුකුත්ම නැත්නම් පෙන්වන UI එක
              <div className="text-center py-8 text-sm text-gray-400 border border-dashed border-gray-200 rounded-xl">
                No active projects found at the moment.
              </div>
            ) : (
              // 🔄 Back-end එකෙන් එන Projects ටික map කරලා ලස්සනට පෙන්වනවා
              projects.map((project) => (
                <div key={project._id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50/50 transition-colors">
                  <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-600">
                    <Briefcase size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 truncate">{project.name}</h3>
                    <span className="text-[10px] font-bold text-gray-400 tracking-wider block mt-0.5">
                      {project.status ? project.status.toUpperCase() : 'ONGOING'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 w-full max-w-[300px] md:max-w-[400px]">
                    {/* Custom Progress Bar */}
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${project.progress < 50 ? 'bg-[#EA580C]' : 'bg-[#1D4ED8]'}`} 
                        style={{ width: `${project.progress || 0}%` }}
                      ></div>
                    </div>
                    <div className="border border-gray-300 px-2 py-0.5 rounded text-xs font-bold text-gray-900 bg-white">
                      {project.progress || 0}%
                    </div>
                  </div>
                </div>
              ))
            )}

          </div>
        </div>

      </main>
    </div>
  );
}