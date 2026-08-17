"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/utils/api';
import CustomerNavi from '../../../components/CustomerNavi/CustomerNavi';
import CustomerTabs from '../../../components/CustomerNavi/CustomerTabs';
import { Folder, CheckCircle, Layers, XCircle, Briefcase, Calendar, ChevronRight, X } from 'lucide-react';

interface Project {
  _id: string;
  title: string;
  description?: string;
  status: 'ONGOING' | 'COMPLETED' | 'REJECTED';
  progress: number;
  createdAt?: string;
}

export default function CustomerProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [customerName, setCustomerName] = useState<string>('Customer');
  const [stats, setStats] = useState({ all: 0, completed: 0, ongoing: 0, rejected: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await API.get('/customers/profile');
        if (profileRes.data?.firstName) {
          setCustomerName(`${profileRes.data.firstName} ${profileRes.data.lastName || ''}`);
        }

        const projectsRes = await API.get('/customers/projects');
        if (projectsRes.data) {
          setProjects(projectsRes.data.projects || []);
          setStats(projectsRes.data.stats || { all: 0, completed: 0, ongoing: 0, rejected: 0 });
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('customer');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-12">
      <CustomerNavi customerName={customerName} role="user" onLogout={handleLogout} />
      <CustomerTabs activeTab="Projects" />

      <main className="p-6 md:p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">All Projects</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.all}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-600 border border-gray-100">
              <Folder size={22} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Completed</p>
              <h3 className="text-3xl font-bold text-emerald-600 mt-1">{stats.completed}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
              <CheckCircle size={22} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Ongoing</p>
              <h3 className="text-3xl font-bold text-blue-600 mt-1">{stats.ongoing}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
              <Layers size={22} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Rejected</p>
              <h3 className="text-3xl font-bold text-rose-600 mt-1">{stats.rejected}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-100">
              <XCircle size={22} />
            </div>
          </div>
        </div>

        {/* Header Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Projects</h1>
          <p className="text-xs text-gray-400 mt-1">Track and review engineering timeline milestones and deployment phases</p>
        </div>

        {/* Projects Cards View */}
        {loading ? (
          <div className="text-center py-12 text-sm text-gray-400 animate-pulse">Loading project details...</div>
        ) : projects.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-200 rounded-2xl py-12 text-center text-sm text-gray-400">
            No projects registered for your profile yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((item) => (
              <div
                key={item._id}
                onClick={() => setSelectedProject(item)}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                      item.status === 'ONGOING' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                      item.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                      'bg-rose-50 text-rose-600 border border-rose-100'
                    }`}>
                      {item.status}
                    </span>
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-600 transition-colors" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mb-2">{item.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{item.description || 'No extended description provided.'}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-400 uppercase text-[10px]">Progress</span>
                    <span className="font-bold text-gray-900">{item.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.progress < 50 ? 'bg-orange-500' : 'bg-blue-600'}`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 flex flex-col gap-5 relative">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <div>
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3 ${
                selectedProject.status === 'ONGOING' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                selectedProject.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                'bg-rose-50 text-rose-600 border border-rose-100'
              }`}>
                {selectedProject.status}
              </span>
              <h2 className="text-xl font-bold text-gray-900">{selectedProject.title}</h2>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Description</p>
              <p className="text-sm text-gray-700 leading-relaxed">{selectedProject.description || 'No additional project description available.'}</p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-400 uppercase tracking-wider">Completion Status</span>
                <span className="text-gray-900">{selectedProject.progress}%</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${selectedProject.progress < 50 ? 'bg-orange-500' : 'bg-blue-600'}`}
                  style={{ width: `${selectedProject.progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400 pt-2 border-t border-gray-100">
              <Calendar size={14} />
              <span>Created: {selectedProject.createdAt ? new Date(selectedProject.createdAt).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}