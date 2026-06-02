"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import CustomerNavi from '../../../components/CustomerNavi/CustomerNavi';
import CustomerTabs from '../../../components/CustomerNavi/CustomerTabs';

import { User, Lock, Building2 } from 'lucide-react';

type ActiveSection = 'profile' | 'password' | 'company';

// Structure of Customer Data coming from the Database
interface CustomerProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  website: string;
  address: string;
  status?: string;
  location?: string;
}

export default function CustomerProfilePage() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('profile');
  
  // 💾 State Management
  const [profile, setProfile] = useState<CustomerProfile>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    website: '',
    address: '',
    status: 'Active Client',
    location: 'Colombo, Sri Lanka'
  });
  
  const [loading, setLoading] = useState<boolean>(true);
  
  // 🔐 State for Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 🔄 1. Fetch Customer Data from the Database on initial page load
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // ⚠️ Note: This URL and headers can be modified later once Auth is implemented
        const response = await axios.get('http://localhost:5001/api/customer/profile');
        if (response.data) {
          setProfile(response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // ✍️ Function to handle and update State when an Input Field changes
  const handleInputChange = (field: keyof CustomerProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  // 📤 2. Send updated Profile or Company Info to the Backend on save
  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put('http://localhost:5001/api/customer/profile/update', profile);
      if (response.data.success) {
        alert('Profile data updated successfully! ✅');
      }
    } catch (error) {
      console.error("Update failed:", error);
      alert('An error occurred while saving data.');
    }
  };

  // 🔒 3. Request to change the password
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("The new passwords do not match!");
      return;
    }

    try {
      const response = await axios.put('http://localhost:5001/api/customer/profile/change-password', {
        currentPassword,
        newPassword
      });
      if (response.data.success) {
        alert('Password changed successfully! 🔑');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      console.error("Password update error:", error);
      alert('Failed to update password. Please check if your current password is correct.');
    }
  };

  const handleLogout = () => {
    alert("Logged out!");
  };

  // Extract the first two initials for the Avatar (e.g., Kaushalya Client -> KC)
  const getInitials = () => {
    const first = profile.firstName ? profile.firstName.charAt(0) : 'K';
    const last = profile.lastName ? profile.lastName.charAt(0) : 'A';
    return (first + last).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500 font-medium">
        Loading customer core profile metrics...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-10">
      <CustomerNavi 
        customerName={`${profile.firstName} ${profile.lastName}`} 
        role="user" 
        onLogout={handleLogout} 
      />
      <CustomerTabs activeTab="Profile" />

      <main className="p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">
        
        {/* 💳 Top Profile Summary Card (Live Dynamic Data) */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-lg border border-gray-200 uppercase">
            {getInitials()}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{profile.firstName || 'Kaushalya'}</h1>
              <span className="bg-[#E6F4EA] text-[#137333] font-bold text-[10px] tracking-wider px-2.5 py-0.5 rounded-full uppercase">
                {profile.status || 'Active Client'}
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              {profile.email} <span className="mx-1.5">•</span> {profile.location || 'Colombo, Sri Lanka'}
            </p>
          </div>
        </div>

        {/* Settings Workspace Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Left Vertical Menu Tabs */}
          <div className="bg-white rounded-2xl border border-gray-200 p-2 shadow-sm md:col-span-3 flex flex-col gap-1 overflow-hidden">
            <button 
              onClick={() => setActiveSection('profile')}
              className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-bold rounded-xl transition-colors text-left ${
                activeSection === 'profile' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <User size={16} className={activeSection === 'profile' ? 'text-white' : 'text-gray-400'} />
              Edit Profile
            </button>
            <button 
              onClick={() => setActiveSection('password')}
              className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-bold rounded-xl transition-colors text-left ${
                activeSection === 'password' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Lock size={16} className={activeSection === 'password' ? 'text-white' : 'text-gray-400'} />
              Change Password
            </button>
            <button 
              onClick={() => setActiveSection('company')}
              className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-bold rounded-xl transition-colors text-left ${
                activeSection === 'company' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Building2 size={16} className={activeSection === 'company' ? 'text-white' : 'text-gray-400'} />
              Company Info
            </button>
          </div>

          {/* Right Parameters Formulation Section */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm md:col-span-9">
            
            {/* 📋 PANEL 1: EDIT PROFILE */}
            {activeSection === 'profile' && (
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Edit Profile Parameters</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Update your account identity and system contact records</p>
                </div>

                <form className="flex flex-col gap-5" onSubmit={handleSaveChanges}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">First Name</label>
                      <input 
                        type="text" 
                        value={profile.firstName} 
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-gray-400" 
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Last Name</label>
                      <input 
                        type="text" 
                        value={profile.lastName} 
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-gray-400" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Email Workspace</label>
                      <input 
                        type="email" 
                        value={profile.email} 
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-gray-400" 
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Contact Phone Number</label>
                      <input 
                        type="text" 
                        value={profile.phone} 
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-gray-400" 
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-2">
                    <button type="submit" className="bg-black text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-900 transition-colors shadow-sm">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 🔒 PANEL 2: CHANGE PASSWORD */}
            {activeSection === 'password' && (
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Security Credentials</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Update your current password configuration to maintain account ecosystem health</p>
                </div>

                <form className="flex flex-col gap-5" onSubmit={handlePasswordUpdate}>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Current Password</label>
                    <input 
                      type="password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••••••" 
                      className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-gray-400" 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">New Password</label>
                      <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Minimum 8 characters" 
                        className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-gray-400" 
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Confirm New Password</label>
                      <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password" 
                        className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-gray-400" 
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-2">
                    <button type="submit" className="bg-black text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-900 transition-colors shadow-sm">
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 🏢 PANEL 3: COMPANY INFO */}
            {activeSection === 'company' && (
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Organization Infrastructure</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Manage corporate baseline parameters associated with your client ecosystem workspace</p>
                </div>

                <form className="flex flex-col gap-5" onSubmit={handleSaveChanges}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Company Name</label>
                      <input 
                        type="text" 
                        value={profile.companyName} 
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-gray-400" 
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Corporate Website</label>
                      <input 
                        type="text" 
                        value={profile.website} 
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-gray-400" 
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Headquarters Address</label>
                    <input 
                      type="text" 
                      value={profile.address} 
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-gray-400" 
                    />
                  </div>

                  <div className="flex justify-end mt-2">
                    <button type="submit" className="bg-black text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-900 transition-colors shadow-sm">
                      Save Organization Data
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>

        </div>

      </main>
    </div>
  );
}