"use client";

import React, { useState, useEffect } from 'react';
import EmployeeNavi from '../../../components/EmployeeNavi/EmployeeNavi';
import EmployeeTabs from '../../../components/EmployeeNavi/EmployeeTabs';
import EditProfileModal from '../../../components/Modals/EditProfileModal';
import Avatar from '../../../components/Avatar/Avatar';
import { useRouter } from 'next/navigation';
import { 
  Edit, User, Mail, Phone, Calendar, Briefcase, Building, Award, Users, 
  MapPin, HeartPulse, Droplet, FileText, CheckCircle2, ShieldAlert, Code2, X
} from 'lucide-react';

export default function EmployeeProfilePage() {
  const router = useRouter();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [successMessage, setSuccessMessage] = useState("");

  const [userData, setUserData] = useState<any>(null);
  const [cvLoading, setCvLoading] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [leaveStats, setLeaveStats] = useState({ totalLeaves: 0, approvedDays: 0, pendingDays: 0, rejectedDays: 0 });

  // ==========================================
  // DATA FETCHING FUNCTIONS
  // ==========================================
  const fetchUserProfile = async () => {
    // WHY TRY/CATCH? Network requests can fail if the server is down or internet drops.
    // Catching it prevents the UI from completely crashing and showing a blank white screen.
    try {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/login'); return; }
      const res = await fetch("http://localhost:5001/api/users/me", { headers: { Authorization: `Bearer ${token}` }});
      const data = await res.json();
      if (data.success) setUserData(data.data);
    } catch (error) { console.error("Error fetching profile:", error); }
  };

  const fetchLeaveStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch("http://localhost:5001/api/leave/me", { headers: { Authorization: `Bearer ${token}` }});
      const data = await res.json();
      if (data.success && data.stats) setLeaveStats(data.stats);
    } catch (error) { console.error("Error fetching leaves:", error); }
  };

  const fetchAttendanceStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch("http://localhost:5001/api/attendance/me", { headers: { Authorization: `Bearer ${token}` }});
      const data = await res.json();
      if (data.success && data.history) {
        const todayStr = new Date().toISOString().split('T')[0];
        const activeCheckIn = data.history.find((record: any) => record.dateString === todayStr && !record.checkOut);
        setIsCheckedIn(!!activeCheckIn); 
      }
    } catch (error) { console.error("Error fetching attendance:", error); }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchLeaveStats();
    fetchAttendanceStatus();
  }, []);

  // The CV route needs a Bearer token, so it cannot be a plain <a href>.
  // Fetch it as a blob and hand the browser an object URL instead.
  const viewMyCV = async () => {
    setCvLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch("http://localhost:5001/api/profile/cv", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.message || 'Could not open your CV');
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener');
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch {
      alert('Network error while opening your CV');
    } finally {
      setCvLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push('/login');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not Set";
    try { return new Date(dateString).toLocaleDateString(); } catch (e) { return dateString; }
  };

  // Safely format phone numbers to prevent the "Double Prefix" bug on legacy dirty data
  const formatPhoneDisplay = (code: string, number: string) => {
      if (!number) return 'Not Set';
      // Strip out the starting +94, 94, or 0, leaving just the 9-digit core.
      const cleanNumber = number.replace(/^(\+94|94|0)/, '');
      return `${code || '+94'} ${cleanNumber}`;
  };

  if (!userData) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-10 relative">
      
      {successMessage && (
        <div className="fixed top-8 right-8 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-in fade-in slide-in-from-top-5">
            <CheckCircle2 size={24} className="text-white" />
            <div>
                <h4 className="font-bold text-sm">Success</h4>
                <p className="text-xs opacity-90">{successMessage}</p>
            </div>
            <button onClick={() => setSuccessMessage("")} className="ml-4 hover:bg-green-700 p-1 rounded-full transition-colors"><X size={16}/></button>
        </div>
      )}

      <EmployeeNavi employeeName={userData.name} onLogout={handleLogout} />
      <EmployeeTabs activeTab="Profile" />

      <main className="p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">
        
        {/* Profile Header */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar name={userData.name} photo={userData.profilePhoto} size={80} className="border-2 border-white shadow-sm" />
              <div className={`absolute bottom-0 right-1 w-5 h-5 border-4 border-white rounded-full ${isCheckedIn ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{userData.name}</h2>
              <p className="text-gray-400 text-sm mb-3">{userData.position || 'Employee'}</p>
              
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-black text-white text-[11px] font-medium px-3 py-1 rounded-full">Active Employee</span>
                <span className="bg-white border border-gray-200 text-gray-600 text-[11px] font-medium px-3 py-1 rounded-full">{userData.department || 'Unassigned'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
              {userData.cvFile && (
                  <button
                    onClick={viewMyCV}
                    disabled={cvLoading}
                    className="bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-60 transition-colors text-gray-700 px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium"
                  >
                    <FileText size={16} /> {cvLoading ? 'Opening...' : 'View My CV'}
                  </button>
              )}
              <button onClick={() => setIsEditModalOpen(true)} className="bg-[#1a1a1a] hover:bg-black transition-colors text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium">
                <Edit size={16} /> Edit Profile
              </button>
          </div>
        </div>

        {/* Top Leave Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Total Leaves</p>
            <p className="text-4xl font-semibold text-gray-900">{leaveStats.totalLeaves || 0}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Approved</p>
            <p className="text-4xl font-semibold text-green-500">{leaveStats.approvedDays}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Pending</p>
            <p className="text-4xl font-semibold text-orange-400">{leaveStats.pendingDays}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Rejected</p>
            <p className="text-4xl font-semibold text-red-600">{leaveStats.rejectedDays}</p>
          </div>
        </div>

        {/* Navigation Pills (Removed 'Activity') */}
        <div className="bg-gray-200/60 p-1.5 rounded-full flex overflow-x-auto text-sm font-medium mb-2">
          {['Overview', 'Skills', 'Emergency'].map((tab) => (
            <button 
              key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-[120px] py-2.5 rounded-full text-center transition-all duration-200 ${
                activeTab === tab ? 'bg-white text-gray-900 shadow-sm font-semibold' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ==================== TAB CONTENT: OVERVIEW ==================== */}
        {activeTab === 'Overview' && (
          <div className="animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <User size={20} className="text-gray-700" />
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                    <Mail className="text-gray-400" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Email Address</p>
                      <p className="text-sm font-semibold text-gray-900">{userData.email}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                    <Phone className="text-gray-400" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Phone Number</p>
                      <p className="text-sm font-semibold text-gray-900">
                          {formatPhoneDisplay(userData.countryCode, userData.phoneNumber)}
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                    <MapPin className="text-gray-400" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Home Address</p>
                      <div className="text-sm font-semibold text-gray-900">
                          {userData.addressLine1 || 'Not Set'}
                          {userData.addressLine2 && <span className="block text-gray-600 font-normal">{userData.addressLine2}</span>}
                          {userData.addressLine3 && <span className="block text-gray-600 font-normal">{userData.addressLine3}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Briefcase size={20} className="text-gray-700" />
                  <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                    <Building className="text-gray-400" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Department</p>
                      <p className="text-sm font-semibold text-gray-900">{userData.department || 'Unassigned'}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                    <Award className="text-gray-400" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Position</p>
                      <p className="text-sm font-semibold text-gray-900">{userData.position || 'Employee'}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                    <Calendar className="text-gray-400" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Join Date</p>
                      <p className="text-sm font-semibold text-gray-900">{formatDate(userData.joinDate)}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==================== TAB CONTENT: EMERGENCY ==================== */}
        {activeTab === 'Emergency' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 animate-in fade-in duration-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <ShieldAlert size={20} className="text-gray-500" /> Emergency Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4"><HeartPulse size={20} /></div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">Primary Contact</h4>
                <p className="text-lg font-bold text-gray-900 mb-1">{userData.emergencyContact?.name || 'Not Set'}</p>
                <p className="text-xs text-red-600 font-medium mb-2">{userData.emergencyContact?.relation || 'Relationship Not Specified'}</p>
                <p className="text-sm font-medium text-gray-600 flex items-center gap-2 bg-white/60 p-2 rounded-lg inline-flex border border-red-100/50">
                  <Phone size={14} className="text-red-500" /> 
                  {formatPhoneDisplay(userData.emergencyContact?.countryCode, userData.emergencyContact?.phone)}
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4"><Droplet size={20} /></div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Medical Details</h4>
                <div className="flex gap-4">
                  <div className="bg-white/60 p-3 rounded-lg border border-blue-100/50 flex-1 text-center">
                    <p className="text-xs text-gray-500 mb-1">Blood Group</p>
                    <p className="font-bold text-gray-900">{userData.medicalDetails?.bloodGroup || 'Not Set'}</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded-lg border border-blue-100/50 flex-1 text-center">
                    <p className="text-xs text-gray-500 mb-1">Allergies</p>
                    <p className="font-bold text-gray-900">{userData.medicalDetails?.allergies || 'None'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB CONTENT: SKILLS ==================== */}
        {activeTab === 'Skills' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 animate-in fade-in duration-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Code2 size={20} className="text-gray-500" /> Professional Skills
            </h3>
            <div className="flex flex-wrap gap-3">
                {userData.skills && userData.skills.length > 0 ? (
                    userData.skills.map((skill: any, idx: number) => (
                        <div key={idx} className="bg-blue-50 border border-blue-100 text-blue-700 px-4 py-2 rounded-lg flex flex-col">
                            <span className="font-bold">{skill.name}</span>
                            <span className="text-xs opacity-80">{skill.level}</span>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 w-full text-center py-8">No skills added yet. Update profile to add skills.</p>
                )}
            </div>
          </div>
        )}

      </main>

      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        currentData={userData} 
        onSaveSuccess={() => {
            fetchUserProfile(); 
            setSuccessMessage("Your profile has been updated successfully!"); 
            setTimeout(() => setSuccessMessage(""), 4000); 
        }}
      />
    </div>
  );
}