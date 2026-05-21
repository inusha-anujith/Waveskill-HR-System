"use client";

import { useState } from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  CreditCard, 
  History, 
  Camera, 
  Laptop, 
  Smartphone, 
  Key,
  LogOut,
  AlertTriangle,
  Download,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function ProfilePage() {
  // Navigation active tab controller
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'billing' | 'activity'>('profile');
  
  // Toggle switches mock states
  const [emailNotif, setEmailNotif] = useState(true);
  const [projectUpdates, setProjectUpdates] = useState(true);
  const [marketingEmail, setMarketingEmail] = useState(false);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* --- TOP PROFILE HEADER BLOCK --- */}
      <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          {/* Avatar Picture with rounded badge overlay */}
          <div className="relative group cursor-pointer">
            <div className="w-20 h-20 bg-gray-100 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 overflow-hidden font-bold text-2xl text-black">
              CU
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={16} />
            </div>
          </div>
          <div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h2 className="text-2xl font-bold text-black">Client User</h2>
              <span className="bg-green-50 text-green-700 border border-green-200 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                Active Client
              </span>
            </div>
            <p className="text-sm text-gray-500">client@example.com • Global Innovations Ltd.</p>
          </div>
        </div>
        
        {/* Quick Read-Only Business Summary Box */}
        <div className="flex gap-4 border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-100 w-full sm:w-auto justify-around sm:justify-end text-center">
          <div className="px-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Projects</p>
            <p className="text-xl font-bold text-black mt-0.5">3</p>
          </div>
          <div className="h-8 w-px bg-gray-200 my-auto"></div>
          <div className="px-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Since</p>
            <p className="text-xl font-bold text-black mt-0.5">Mar 2025</p>
          </div>
        </div>
      </div>

      {/* --- RE-ARRANGED SECTION LAYOUT: TABS SIDEBAR + CONTENT INNER CORE --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        
        {/* Navigation Sidebar Options */}
        <div className="bg-white border border-gray-200 p-2 rounded-xl shadow-sm space-y-1">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <User size={18} /> Personal Info
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'security' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Shield size={18} /> Security & 2FA
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'notifications' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Bell size={18} /> Notification Toggles
          </button>
          <button 
            onClick={() => setActiveTab('billing')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'billing' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <CreditCard size={18} /> Billing & Invoices
          </button>
          <button 
            onClick={() => setActiveTab('activity')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'activity' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <History size={18} /> Account Log
          </button>
        </div>

        {/* Dynamic Panel Window Wrapper */}
        <div className="md:col-span-3 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden min-h-[460px]">
          
          {/* ================= TAB 1: PERSONAL & COMPANY DETAILS ================= */}
          {activeTab === 'profile' && (
            <div className="p-6 space-y-6 animate-in fade-in duration-150">
              <div>
                <h3 className="text-lg font-bold text-black">Personal & Company Information</h3>
                <p className="text-sm text-gray-500">Manage your baseline contact accounts identity parameters</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Full Identification Name</label>
                  <input type="text" defaultValue="Client User" className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm text-black focus:outline-none focus:border-black transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email Address Address</label>
                  <input type="email" defaultValue="client@example.com" className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm text-black focus:outline-none focus:border-black transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Contact Phone Line</label>
                  <input type="text" defaultValue="+94 77 123 4567" className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm text-black focus:outline-none focus:border-black transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Registered Corporate Company</label>
                  <input type="text" defaultValue="Global Innovations Ltd." className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm text-black focus:outline-none focus:border-black transition-colors" />
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button className="bg-black text-white text-sm font-semibold px-5 py-2 rounded-lg border border-black hover:bg-gray-800 transition-colors">
                  Save Amendments
                </button>
              </div>
            </div>
          )}

          {/* ================= TAB 2: SYSTEM SECURITY & 2FA ================= */}
          {activeTab === 'security' && (
            <div className="p-6 space-y-6 animate-in fade-in duration-150">
              <div>
                <h3 className="text-lg font-bold text-black">Security Settings</h3>
                <p className="text-sm text-gray-500">Monitor active authorization links and encryption details</p>
              </div>

              {/* Password update segment form */}
              <div className="space-y-4 border-b border-gray-100 pb-6">
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2"><Key size={16} /> Update Password</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input type="password" placeholder="Current Secret Key" className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm text-black focus:outline-none" />
                  <input type="password" placeholder="New Password" className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm text-black focus:outline-none" />
                  <input type="password" placeholder="Confirm New Password" className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm text-black focus:outline-none" />
                </div>
                <button className="text-xs font-bold px-3 py-1.5 border border-black rounded-lg hover:bg-gray-50 transition-colors">Update Key</button>
              </div>

              {/* Session security tracing list */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2"><Lock size={16} /> Active Logged Hardware Devices</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50/50">
                    <div className="flex items-center gap-3">
                      <Laptop className="text-gray-500" size={18} />
                      <div>
                        <p className="text-sm font-bold text-black">Chrome Browser (Windows 11)</p>
                        <p className="text-xs text-gray-400">Colombo, Sri Lanka • Active Session Now</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">Current</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50/50">
                    <div className="flex items-center gap-3">
                      <Smartphone className="text-gray-500" size={18} />
                      <div>
                        <p className="text-sm font-semibold text-black">Safari App (iPhone 15 Pro)</p>
                        <p className="text-xs text-gray-400">Colombo, Sri Lanka • Last Activity 2 hrs ago</p>
                      </div>
                    </div>
                    <button className="text-xs font-bold text-red-600 hover:underline">Revoke</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: NOTIFICATION TOGGLES ================= */}
          {activeTab === 'notifications' && (
            <div className="p-6 space-y-6 animate-in fade-in duration-150">
              <div>
                <h3 className="text-lg font-bold text-black">Communication Toggles</h3>
                <p className="text-sm text-gray-500">Define precise real-time message trigger pathways</p>
              </div>
              
              <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between py-4">
                  <div>
                    <h4 className="text-sm font-bold text-black">Core Email Dispatches</h4>
                    <p className="text-xs text-gray-400">Receive reports, transaction papers, and main announcements via inbox</p>
                  </div>
                  <button 
                    onClick={() => setEmailNotif(!emailNotif)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${emailNotif ? 'bg-black' : 'bg-gray-200'}`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${emailNotif ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between py-4">
                  <div>
                    <h4 className="text-sm font-bold text-black">Development Phase Modifications</h4>
                    <p className="text-xs text-gray-400">Triggers alerting when milestones complete or need review decisions</p>
                  </div>
                  <button 
                    onClick={() => setProjectUpdates(!projectUpdates)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${projectUpdates ? 'bg-black' : 'bg-gray-200'}`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${projectUpdates ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between py-4">
                  <div>
                    <h4 className="text-sm font-bold text-black">System Feature Suggestions</h4>
                    <p className="text-xs text-gray-400">Promotional materials, analytical reports, or framework optimization ideas</p>
                  </div>
                  <button 
                    onClick={() => setMarketingEmail(!marketingEmail)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${marketingEmail ? 'bg-black' : 'bg-gray-200'}`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${marketingEmail ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 4: BILLING & SUBSCRIPTIONS ================= */}
          {activeTab === 'billing' && (
            <div className="p-6 space-y-6 animate-in fade-in duration-150">
              <div>
                <h3 className="text-lg font-bold text-black">Billing & Invoices</h3>
                <p className="text-sm text-gray-500">Track structural plans, payment options, and legal billing histories</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/30">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current SaaS Setup Tier</span>
                  <h4 className="text-xl font-bold text-black mt-1">Enterprise Platform Plan</h4>
                  <p className="text-xs text-gray-500 mt-2">Next payment cycle triggered: June 01, 2026</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/30 flex flex-col justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Linked Settlement Card</span>
                    <p className="text-sm font-semibold text-black mt-1">•••• •••• •••• 4242</p>
                  </div>
                  <button className="text-xs font-bold border border-gray-300 px-2 py-1 rounded-md bg-white hover:bg-gray-50 mt-2">Modify Method</button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-black mb-3">Download Invoices</h4>
                <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100">
                  <div className="flex items-center justify-between p-3 text-sm bg-gray-50/40">
                    <span className="font-semibold text-black">INV-2026-042</span>
                    <span className="text-gray-500">May 01, 2026</span>
                    <button className="text-blue-600 flex items-center gap-1 hover:underline text-xs font-bold"><Download size={14} /> Fetch PDF</button>
                  </div>
                  <div className="flex items-center justify-between p-3 text-sm bg-gray-50/40">
                    <span className="font-semibold text-black">INV-2026-021</span>
                    <span className="text-gray-500">Apr 01, 2026</span>
                    <button className="text-blue-600 flex items-center gap-1 hover:underline text-xs font-bold"><Download size={14} /> Fetch PDF</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 5: ACCOUNT HISTORY ACTIVITY LOG ================= */}
          {activeTab === 'activity' && (
            <div className="p-6 space-y-6 animate-in fade-in duration-150">
              <div>
                <h3 className="text-lg font-bold text-black">Account History Log</h3>
                <p className="text-sm text-gray-500">Audit trail trace logs mapping identity interaction states</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 text-sm">
                  <CheckCircle2 size={16} className="text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-black">Successful Identity Access Token Renewal</p>
                    <p className="text-xs text-gray-400">Today at 10:30 AM via Desktop Chrome Browser</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <CheckCircle2 size={16} className="text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-black">Development Modification Execution Query Sent</p>
                    <p className="text-xs text-gray-400">Yesterday at 4:12 PM on Project [Global E-Commerce Platform]</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <CheckCircle2 size={16} className="text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-black">Legal Invoice Document Downloaded</p>
                    <p className="text-xs text-gray-400">May 15, 2026 • Billing Archive Window</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* --- DANGER TERMINATION AREA ZONE (Strictly separated at footer base) --- */}
      <div className="bg-red-50/40 border border-red-200 p-6 rounded-xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-red-900 font-bold flex items-center gap-2 text-md">
            <AlertTriangle size={18} /> Account Termination Zone
          </h3>
          <p className="text-sm text-red-800">
            Deactivating your profile will lock you out of current progress monitoring environments. Action configuration data stays unrecoverable.
          </p>
        </div>
        <button className="bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-lg border border-red-700 hover:bg-red-700 whitespace-nowrap transition-colors shadow-sm">
          Deactivate Profile
        </button>
      </div>

    </div>
  );
}