"use client";

import React, { useState, useEffect } from 'react';
import EmployeeNavi from '../../../components/EmployeeNavi/EmployeeNavi';
import EmployeeTabs from '../../../components/EmployeeNavi/EmployeeTabs';
import EditProfileModal from '../../../components/Modals/EditProfileModal';
import { useRouter } from 'next/navigation';
import { 
  Edit, User, Mail, Phone, Calendar, Briefcase, Building, Award, Users, 
  MapPin, HeartPulse, Droplet, Clock, FileText, CheckCircle2, ShieldAlert, Code2, Database, Layout
} from 'lucide-react';

export default function EmployeeProfilePage() {
  const router = useRouter();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');

  // Live Data States
  const [userData, setUserData] = useState<any>(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [leaveStats, setLeaveStats] = useState({ totalDays: 0, approvedDays: 0, pendingDays: 0, rejectedDays: 0 });

  // 1. Fetch User Profile
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/login'); return; }

      const res = await fetch("http://localhost:5001/api/users/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setUserData(data.data);
    } catch (error) { console.error("Error fetching profile:", error); }
  };

  // 2. Fetch Leave Stats
  const fetchLeaveStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch("http://localhost:5001/api/leave/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.stats) setLeaveStats(data.stats);
    } catch (error) { console.error("Error fetching leaves:", error); }
  };

  // 3. Fetch Attendance (For the Green Dot!)
  const fetchAttendanceStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch("http://localhost:5001/api/attendance/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success && data.history) {
        const todayStr = new Date().toISOString().split('T')[0];
        // Find if there's a record for today that has NO checkout time
        const activeCheckIn = data.history.find((record: any) => 
            record.dateString === todayStr && !record.checkOut
        );
        setIsCheckedIn(!!activeCheckIn); // True if active checkin found, False if checkout or none
      }
    } catch (error) { console.error("Error fetching attendance:", error); }
  };

  // Load everything when the page opens
  useEffect(() => {
    fetchUserProfile();
    fetchLeaveStats();
    fetchAttendanceStatus();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push('/login');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not Set";
    try { return new Date(dateString).toLocaleDateString(); } catch (e) { return dateString; }
  };

  // If data is loading, show a quick placeholder
  if (!userData) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-10">
      {/* Navigation & Tabs */}
      <EmployeeNavi employeeName={userData.name} onLogout={handleLogout} />
      <EmployeeTabs activeTab="Profile" />

      {/* Main Content */}
      <main className="p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">
        
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-blue-700 text-white flex items-center justify-center text-3xl font-bold uppercase">
                {userData.name.charAt(0)}
              </div>
              {/* 🚨 DYNAMIC GREEN/RED DOT BASED ON CHECK-IN STATUS! */}
              <div className={`absolute bottom-0 right-1 w-5 h-5 border-4 border-white rounded-full ${isCheckedIn ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>
            
            {/* Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{userData.name}</h2>
              <p className="text-gray-400 text-sm mb-3">{userData.position || 'Employee'}</p>
              
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-black text-white text-[11px] font-medium px-3 py-1 rounded-full">
                  Active Employee
                </span>
                <span className="bg-white border border-gray-200 text-gray-600 text-[11px] font-medium px-3 py-1 rounded-full">
                  {userData.department || 'Unassigned'}
                </span>
                {userData.employeeId && (
                  <span className="bg-white border border-gray-200 text-gray-600 text-[11px] font-medium px-3 py-1 rounded-full">
                    {userData.employeeId}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="bg-[#1a1a1a] hover:bg-black transition-colors text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium"
          >
            <Edit size={16} />
            Edit Profile
          </button>
        </div>

        {/* Top Leave Stats - LIVE DATA */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Total Leaves</p>
            <p className="text-4xl font-semibold text-gray-900">{leaveStats.totalDays}</p>
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

        {/* Functional Navigation Pills */}
        <div className="bg-gray-200/60 p-1.5 rounded-full flex overflow-x-auto text-sm font-medium mb-2">
          {['Overview', 'Activity', 'Skills', 'Emergency'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-[120px] py-2.5 rounded-full text-center transition-all duration-200 ${
                activeTab === tab 
                  ? 'bg-white text-gray-900 shadow-sm font-semibold' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ==================== TAB CONTENT: OVERVIEW ==================== */}
        {activeTab === 'Overview' && (
          <div className="animate-in fade-in duration-300">
            {/* Info Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              
              {/* Personal Information - LIVE DATA */}
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
                      <p className="text-sm font-semibold text-gray-900">{userData.phoneNumber || 'Not Set'}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                    <MapPin className="text-gray-400" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Home Address</p>
                      <p className="text-sm font-semibold text-gray-900">{userData.homeAddress || 'Not Set'}</p>
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

              {/* Professional Information - LIVE DATA */}
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
                    <Users className="text-gray-400" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">System Role</p>
                      <p className="text-sm font-semibold text-gray-900">{userData.role}</p>
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
                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                  <HeartPulse size={20} />
                </div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">Primary Emergency Contact</h4>
                <p className="text-lg font-bold text-gray-900 mb-1">{userData.emergencyContact?.name || 'Not Set'}</p>
                <p className="text-sm font-medium text-gray-600 flex items-center gap-2 mt-4 bg-white/60 p-2 rounded-lg inline-flex border border-red-100/50">
                  <Phone size={14} className="text-red-500" /> {userData.emergencyContact?.phone || 'Not Set'}
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                  <Droplet size={20} />
                </div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">Medical Details</h4>
                <p className="text-sm text-gray-600 mb-4">Important medical information securely stored.</p>
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

        {/* ... (Activity and Skills tabs omitted here for brevity as they are static for now, you can keep your existing ones) ... */}

      </main>

      {/* Profile Edit Modal - Passed live user data! */}
      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        currentData={{
            phone: userData.phoneNumber || '',
            address: userData.homeAddress || '',
            emergencyContact: userData.emergencyContact?.name || '',
            emergencyPhone: userData.emergencyContact?.phone || ''
        }}
        onSaveSuccess={fetchUserProfile} // This tells the modal to refresh the page after saving!
      />
    </div>
  );
}