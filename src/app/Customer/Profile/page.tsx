"use client";

import { useState } from 'react';
import CustomerNavi from '../../../components/CustomerNavi/CustomerNavi';
import CustomerTabs from '../../../components/CustomerNavi/CustomerTabs';

import { User, Lock, Building2 } from 'lucide-react';

type ActiveSection = 'profile' | 'password' | 'company';

export default function CustomerProfilePage() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('profile');

  const handleLogout = () => {
    alert("Logged out!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-10">
      {/* Imported Shared Navigation */}
      <CustomerNavi 
        customerName="Customer User" 
        role="user" 
        onLogout={handleLogout} 
      />
      <CustomerTabs activeTab="Profile" />

      {/* Main Dashboard Content */}
      <main className="p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">
        
        {/* Top Profile Summary Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-lg border border-gray-200">
            KA
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">Kaushalya</h1>
              <span className="bg-[#E6F4EA] text-[#137333] font-bold text-[10px] tracking-wider px-2.5 py-0.5 rounded-full uppercase">
                Active Client
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              kaushalya@example.com <span className="mx-1.5">•</span> Colombo, Sri Lanka
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
            
            {/* CONDITIONAL CONTENT PANEL 1: EDIT PROFILE */}
            {activeSection === 'profile' && (
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Edit Profile Parameters</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Update your account identity and system contact records
                  </p>
                </div>

                <form className="flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); alert('Profile parameters updated successfully!'); }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">First Name</label>
                      <input type="text" defaultValue="Kaushalya" className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-gray-400" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Last Name</label>
                      <input type="text" defaultValue="Client" className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-gray-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Email Workspace</label>
                      <input type="email" defaultValue="kaushalya@example.com" className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-gray-400" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Contact Phone Number</label>
                      <input type="text" defaultValue="+94 77 123 4567" className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-gray-400" />
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

            {/* CONDITIONAL CONTENT PANEL 2: CHANGE PASSWORD */}
            {activeSection === 'password' && (
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Security Credentials</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Update your current password configuration to maintain account ecosystem health
                  </p>
                </div>

                <form className="flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); alert('Password successfully updated.'); }}>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Current Password</label>
                    <input type="password" placeholder="••••••••••••" className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-gray-400" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">New Password</label>
                      <input type="password" placeholder="Minimum 8 characters" className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-gray-400" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Confirm New Password</label>
                      <input type="password" placeholder="Re-enter new password" className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-gray-400" />
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

            {/* CONDITIONAL CONTENT PANEL 3: COMPANY INFO */}
            {activeSection === 'company' && (
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Organization Infrastructure</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Manage corporate baseline parameters associated with your client ecosystem workspace
                  </p>
                </div>

                <form className="flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); alert('Company metrics saved.'); }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Company Name</label>
                      <input type="text" defaultValue="Apex Digital Studios" className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-gray-400" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Corporate Website</label>
                      <input type="text" defaultValue="https://apexstudios.com" className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-gray-400" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Headquarters Address</label>
                    <input type="text" defaultValue="128 Galle Road, Colombo 03, Sri Lanka" className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-gray-400" />
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