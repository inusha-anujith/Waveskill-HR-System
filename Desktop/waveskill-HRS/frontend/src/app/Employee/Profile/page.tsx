"use client";

import React, { useState } from 'react';
import EmployeeNavi from '../../../components/EmployeeNavi/EmployeeNavi';
import EmployeeTabs from '../../../components/EmployeeNavi/EmployeeTabs';
import EditProfileModal from '../../../components/Modals/EditProfileModal';
import { 
  Edit, User, Mail, Phone, Calendar, Briefcase, Building, Award, Users, 
  MapPin, HeartPulse, Droplet, Clock, FileText, CheckCircle2, ShieldAlert, Code2, Database, Layout
} from 'lucide-react';

export default function EmployeeProfilePage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');

  // State to hold editable profile data
  const [profileData, setProfileData] = useState({
    phone: '+1234567892',
    address: '123 Tech Lane, Colombo 03',
    emergencyContact: 'Jane Doe (Wife)',
    emergencyPhone: '+9876543210'
  });

  const handleLogout = () => {
    alert("Logged out!");
  };

  const handleSaveProfile = (newData: any) => {
    setProfileData(newData);
    // In a real app, you would make an API call to your backend here to save this!
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-10">
      {/* Navigation & Tabs */}
      <EmployeeNavi employeeName="Nithini Jayathilaka" onLogout={handleLogout} />
      <EmployeeTabs activeTab="Profile" />

      {/* Main Content */}
      <main className="p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">
        
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-blue-700 text-white flex items-center justify-center text-3xl font-bold">
                J
              </div>
              <div className="absolute bottom-0 right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
            </div>
            
            {/* Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">John Doe</h2>
              <p className="text-gray-400 text-sm mb-3">Software Engineer</p>
              
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-black text-white text-[11px] font-medium px-3 py-1 rounded-full">
                  Active Employee
                </span>
                <span className="bg-white border border-gray-200 text-gray-600 text-[11px] font-medium px-3 py-1 rounded-full">
                  Engineering
                </span>
                <span className="bg-white border border-gray-200 text-gray-600 text-[11px] font-medium px-3 py-1 rounded-full">
                  EMP-000003
                </span>
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

        {/* Top Leave Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Total Leaves</p>
            <p className="text-4xl font-semibold text-gray-900">3 days</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Approved</p>
            <p className="text-4xl font-semibold text-green-500">0 days</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Pending</p>
            <p className="text-4xl font-semibold text-orange-400">3 days</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Rejected</p>
            <p className="text-4xl font-semibold text-red-600">0</p>
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
              
              {/* Personal Information */}
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
                      <p className="text-sm font-semibold text-gray-900">john@company.com</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                    <Phone className="text-gray-400" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Phone Number</p>
                      <p className="text-sm font-semibold text-gray-900">{profileData.phone}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                    <MapPin className="text-gray-400" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Home Address</p>
                      <p className="text-sm font-semibold text-gray-900">{profileData.address}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                    <Calendar className="text-gray-400" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Join Date</p>
                      <p className="text-sm font-semibold text-gray-900">March 1, 2024</p>
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
                      <p className="text-sm font-semibold text-gray-900">Engineering</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                    <Award className="text-gray-400" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Position</p>
                      <p className="text-sm font-semibold text-gray-900">Software Engineer</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                    <Users className="text-gray-400" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Role</p>
                      <p className="text-sm font-semibold text-gray-900">Employee</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Leave Balance Overview */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Calendar size={20} className="text-gray-700" />
                <h3 className="text-lg font-semibold text-gray-900">Leave Balance Overview</h3>
              </div>
              <p className="text-sm text-gray-500 mb-8">Your annual leave allocation and usage</p>

              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Annual Leave</p>
                  <p className="text-3xl font-semibold text-gray-900">20 days</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Total Annual Leave</p>
                  <p className="text-3xl font-semibold text-green-500">20 days</p>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-xs text-gray-500 mb-2">Leave utilization</p>
                <div className="w-full bg-gray-300 rounded-full h-1.5"></div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <p className="text-sm text-gray-500 mb-2">Approved</p>
                  <p className="text-4xl font-semibold text-blue-600">0</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <p className="text-sm text-gray-500 mb-2">Pending</p>
                  <p className="text-4xl font-semibold text-orange-400">0</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <p className="text-sm text-gray-500 mb-2">Available</p>
                  <p className="text-4xl font-semibold text-green-500">20</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <p className="text-sm text-gray-500 mb-2">Used Days</p>
                  <p className="text-4xl font-semibold text-red-500">0</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB CONTENT: ACTIVITY ==================== */}
        {activeTab === 'Activity' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 animate-in fade-in duration-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Clock size={20} className="text-gray-500" /> Recent Activity
            </h3>
            
            <div className="relative border-l border-gray-200 ml-3 space-y-8 pb-4">
              <div className="relative pl-8">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-4 border-green-500"></div>
                <p className="text-sm font-semibold text-gray-900">Checked In Successfully</p>
                <p className="text-xs text-gray-500 mt-1">Today, 09:00 AM</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-4 border-orange-400"></div>
                <p className="text-sm font-semibold text-gray-900">Submitted Sick Leave Request</p>
                <p className="text-xs text-gray-500 mt-1">Yesterday, 14:30 PM</p>
                <div className="mt-3 bg-gray-50 border border-gray-100 p-3 rounded-lg flex items-center gap-2 text-sm text-gray-600">
                  <FileText size={16} className="text-gray-400" /> Requested 2 days off (1/10/2026 - 1/12/2026)
                </div>
              </div>
              <div className="relative pl-8">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-4 border-blue-500"></div>
                <p className="text-sm font-semibold text-gray-900">Assigned to New Project</p>
                <p className="text-xs text-gray-500 mt-1">Jan 5, 2026</p>
                <p className="text-sm text-gray-600 mt-1">You were assigned to "HR Management System" by Sarah Manager.</p>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB CONTENT: SKILLS ==================== */}
        {activeTab === 'Skills' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 animate-in fade-in duration-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Award size={20} className="text-gray-500" /> Professional Skills
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold flex items-center gap-2"><Layout size={16} className="text-blue-500" /> Frontend Development</span>
                    <span className="text-gray-500">Expert</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full w-[90%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold flex items-center gap-2"><Code2 size={16} className="text-green-500" /> React / Next.js</span>
                    <span className="text-gray-500">Advanced</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full w-[80%]"></div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold flex items-center gap-2"><Database size={16} className="text-orange-500" /> Node.js / Express</span>
                    <span className="text-gray-500">Intermediate</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full w-[60%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold flex items-center gap-2"><Layout size={16} className="text-purple-500" /> UI/UX Design</span>
                    <span className="text-gray-500">Intermediate</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full w-[50%]"></div>
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
                <p className="text-lg font-bold text-gray-900 mb-1">{profileData.emergencyContact}</p>
                <p className="text-sm font-medium text-gray-600 flex items-center gap-2 mt-4 bg-white/60 p-2 rounded-lg inline-flex border border-red-100/50">
                  <Phone size={14} className="text-red-500" /> {profileData.emergencyPhone}
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
                    <p className="font-bold text-gray-900">O+</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded-lg border border-blue-100/50 flex-1 text-center">
                    <p className="text-xs text-gray-500 mb-1">Allergies</p>
                    <p className="font-bold text-gray-900">None</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Profile Edit Modal */}
      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        currentData={profileData}
        onSave={handleSaveProfile}
      />
    </div>
  );
}