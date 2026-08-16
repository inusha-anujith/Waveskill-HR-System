"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import CustomerNavi from '../../../components/CustomerNavi/CustomerNavi';
import CustomerTabs from '../../../components/CustomerNavi/CustomerTabs';

import { 
  User, 
  Building2, 
  ExternalLink, 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  HelpCircle, 
  Send,
  CheckCircle2,
  Clock,
  Lock
} from 'lucide-react';

interface CustomerProfile {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  corporateWebsite: string;
  headquartersAddress: string;
  country?: string;
  status?: string;
}

interface ProjectStats {
  total: number;
  ongoing: number;
  completed: number;
}

export default function CustomerProfilePage() {
  const [profile, setProfile] = useState<CustomerProfile>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    corporateWebsite: '',
    headquartersAddress: '',
    country: '',
    status: ''
  });

  const [stats, setStats] = useState<ProjectStats>({ total: 0, ongoing: 0, completed: 0 });
  const [loading, setLoading] = useState<boolean>(true);

  // Modal State
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestNote, setRequestNote] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  
  useEffect(() => {
    const fetchProfileAndStats = async () => {
      try {
        const token = localStorage.getItem('token'); 

        
        if (!token) {
          window.location.href = '/login';
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const profileRes = await axios.get('http://localhost:5001/api/customers/profile', config);
        
        if (profileRes.data) {
          const data = profileRes.data.customer || profileRes.data;
          setProfile({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            phone: data.phone || '',
            companyName: data.companyName || '',
            corporateWebsite: data.corporateWebsite || '',
            headquartersAddress: data.headquartersAddress || '',
            country: data.country || 'Sri Lanka',
            status: data.status || 'ACTIVE CLIENT'
          });
        }

       
        const projectsRes = await axios.get('http://localhost:5001/api/customers/projects', config);
        
        if (projectsRes.data) {
          const statsData = projectsRes.data.stats;
          const projectList = projectsRes.data.projects || [];

          setStats({
            total: statsData?.all ?? projectList.length,
            ongoing: statsData?.ongoing ?? projectList.filter((p: any) => ['ongoing', 'active'].includes(p.status?.toLowerCase())).length,
            completed: statsData?.completed ?? projectList.filter((p: any) => ['completed', 'delivered'].includes(p.status?.toLowerCase())).length
          });
        }
      } catch (error: any) {
        console.error("Error loading customer profile:", error);
   
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  
  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5001/api/customers/update-request',
        { note: requestNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRequestSent(true);
      setTimeout(() => {
        setIsRequestModalOpen(false);
        setRequestSent(false);
        setRequestNote('');
      }, 2000);
    } catch (error) {
      console.error("Error sending update request:", error);
      alert("Request failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = () => {
    const first = profile.firstName ? profile.firstName.charAt(0) : 'U';
    const last = profile.lastName ? profile.lastName.charAt(0) : '';
    return (first + last).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500 font-medium">
        Loading client profile workspace...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-12">
      <CustomerNavi 
        customerName={`${profile.firstName} ${profile.lastName}`} 
        role="user" 
        onLogout={handleLogout} 
      />
      <CustomerTabs activeTab="Profile" />

      <main className="p-6 md:p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">
        
        {/* Banner Header */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-xl uppercase tracking-wider shadow-md">
              {getInitials()}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile.firstName} {profile.lastName}
                </h1>
                {profile.status && (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px] tracking-wider px-3 py-1 rounded-full uppercase flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    {profile.status}
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-sm mt-1 flex items-center gap-2 flex-wrap">
                <span>{profile.email}</span>
                {profile.companyName && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span>{profile.companyName}</span>
                  </>
                )}
                {profile.headquartersAddress && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="flex items-center gap-1 text-gray-400">
                      <MapPin size={13} /> {profile.headquartersAddress}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="w-full md:w-auto bg-black text-white text-xs font-bold px-5 py-3 rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <HelpCircle size={15} />
            Request Information Update
          </button>
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Projects</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700">
              <Briefcase size={20} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Engagements</p>
              <h3 className="text-2xl font-bold text-blue-600 mt-1">{stats.ongoing}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Clock size={20} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Delivered Projects</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">{stats.completed}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 size={20} />
            </div>
          </div>
        </div>

        {/* Detailed Profile Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Personal Details */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                <div className="flex items-center gap-2.5">
                  <User className="text-gray-700" size={18} />
                  <h2 className="text-base font-bold text-gray-900">Personal & Identity Details</h2>
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-100 px-2.5 py-1 rounded-md flex items-center gap-1">
                  <Lock size={10} /> Read Only
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-[#F8FAFC] p-4 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">First Name</p>
                  <p className="text-sm font-semibold text-gray-800 mt-1">{profile.firstName || '-'}</p>
                </div>
                <div className="bg-[#F8FAFC] p-4 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Last Name</p>
                  <p className="text-sm font-semibold text-gray-800 mt-1">{profile.lastName || '-'}</p>
                </div>
                <div className="bg-[#F8FAFC] p-4 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</p>
                  <p className="text-sm font-semibold text-gray-800 mt-1 flex items-center gap-2">
                    <Mail size={14} className="text-gray-400" />
                    {profile.email || '-'}
                  </p>
                </div>
                <div className="bg-[#F8FAFC] p-4 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Contact Phone</p>
                  <p className="text-sm font-semibold text-gray-800 mt-1 flex items-center gap-2">
                    <Phone size={14} className="text-gray-400" />
                    {profile.phone || '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* Business Profile */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                <div className="flex items-center gap-2.5">
                  <Building2 className="text-gray-700" size={18} />
                  <h2 className="text-base font-bold text-gray-900">Corporate & Business Profile</h2>
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-100 px-2.5 py-1 rounded-md flex items-center gap-1">
                  <Lock size={10} /> Managed by Admin
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-[#F8FAFC] p-4 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Registered Company Name</p>
                  <p className="text-sm font-semibold text-gray-800 mt-1">{profile.companyName || '-'}</p>
                </div>
                <div className="bg-[#F8FAFC] p-4 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Corporate Website</p>
                  {profile.corporateWebsite ? (
                    <a 
                      href={profile.corporateWebsite.startsWith('http') ? profile.corporateWebsite : `https://${profile.corporateWebsite}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-blue-600 hover:underline mt-1 flex items-center gap-1.5"
                    >
                      {profile.corporateWebsite}
                      <ExternalLink size={13} />
                    </a>
                  ) : (
                    <p className="text-sm font-semibold text-gray-800 mt-1">-</p>
                  )}
                </div>
                <div className="bg-[#F8FAFC] p-4 rounded-xl border border-gray-100 md:col-span-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Headquarters & Operational Address</p>
                  <p className="text-sm font-semibold text-gray-800 mt-1 flex items-center gap-2">
                    <MapPin size={14} className="text-gray-400" />
                    {profile.headquartersAddress || '-'}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100 mb-4">
                Assigned Project Manager
              </h2>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm shadow">
                  PM
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Waveskill Project Lead</h3>
                  <p className="text-xs text-gray-500">Dedicated Client Success Manager</p>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 text-xs text-gray-600 border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-gray-400" />
                  <span>support@waveskill.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-gray-400" />
                  <span>+94 (11) 234-5678</span>
                </div>
              </div>

              <button 
                onClick={() => setIsRequestModalOpen(true)}
                className="w-full mt-5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 text-xs font-bold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Send size={13} /> Contact Manager
              </button>
            </div>

            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-400 mb-2">
                <ShieldCheck size={18} />
                <span className="text-xs font-bold uppercase tracking-wider">Enterprise Security</span>
              </div>
              <h3 className="font-bold text-sm text-slate-100">Managed Client Portal</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Your account parameters are directly managed by Waveskill Enterprise Administration to ensure data integrity across active development pipelines.
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            {requestSent ? (
              <div className="py-8 flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Request Submitted!</h3>
                <p className="text-xs text-gray-500">
                  Your project manager will review your requested changes and update your account details shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendRequest} className="flex flex-col gap-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Request Profile Update</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Describe the changes you would like to make to your profile or corporate information.
                  </p>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase block mb-1">
                    Requested Changes / Note
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={requestNote}
                    onChange={(e) => setRequestNote(e.target.value)}
                    placeholder="e.g. Please update our headquarters address to Kandy, Sri Lanka..."
                    className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl p-3 text-xs font-medium text-gray-800 focus:outline-none focus:border-gray-400"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsRequestModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-black text-white px-5 py-2 text-xs font-bold rounded-xl hover:bg-gray-800 flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Send size={12} /> {submitting ? 'Sending...' : 'Send Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}