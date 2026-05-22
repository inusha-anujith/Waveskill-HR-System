"use client";

import { useState, useRef } from 'react';
import { 
  User, 
  Lock, 
  Building, 
  Camera, 
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function ProfilePage() {
  // Navigation active tab switcher (Simplified to 3 explicit views)
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'company'>('profile');
  
  // Success alerts notification display toggles
  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  
  // Simple state for local image file preview handling
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarImage(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* --- TOP PROFILE HEADER HERO BLOCK --- */}
      <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          
          {/* Avatar Picture frame with hidden form input action triggers */}
          <div 
            onClick={() => fileInputRef.current?.click()} 
            className="relative group cursor-pointer shrink-0"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 overflow-hidden font-bold text-xl">
              {avatarImage ? (
                <img src={avatarImage} alt="Profile preview" className="w-full h-full object-cover" />
              ) : (
                "KA"
              )}
            </div>
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={16} />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleAvatarChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h2 className="text-2xl font-bold text-black">Kaushalya</h2>
              <span className="bg-green-50 text-green-700 border border-green-200 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                Active Client
              </span>
            </div>
            <p className="text-sm text-gray-500">kaushalya@example.com • Colombo, Sri Lanka</p>
          </div>
        </div>
        
        {/* Quick Summary Metadata Indicator Block */}
        
      </div>

      {/* --- SIDEBAR LAYOUT GRID FRAMEWORK --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        
        {/* Navigation Tab Bar Options Menu */}
        <div className="bg-white border border-gray-200 p-2 rounded-xl shadow-sm space-y-1">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <User size={16} /> Edit Profile
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'security' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Lock size={16} /> Change Password
          </button>
          <button 
            onClick={() => setActiveTab('company')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'company' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Building size={16} /> Company Info
          </button>
        </div>

        {/* Dynamic Display Window Content Frame Panel */}
        <div className="md:col-span-3 bg-white border border-gray-200 rounded-xl shadow-sm min-h-[380px]">
          
          {/* ================= OPTION 1: EDIT PROFILE & CONTACT DETAILS ================= */}
          {activeTab === 'profile' && (
            <div className="p-6 space-y-6 animate-in fade-in duration-150">
              <div>
                <h3 className="text-lg font-bold text-black">Edit Profile Parameters</h3>
                <p className="text-sm text-gray-500">Update your account identity and system contact records</p>
              </div>

              {profileSaved && (
                <div className="bg-green-50 border border-green-200 p-3.5 rounded-lg flex items-center gap-2.5 text-green-800 text-sm font-semibold animate-in zoom-in duration-150">
                  <CheckCircle2 size={16} className="text-green-600" />
                  <span>Profile contact configurations updated successfully!</span>
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">First Name</label>
                    <input required type="text" defaultValue="Kaushalya" className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm text-black focus:outline-none focus:border-black transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Last Name</label>
                    <input required type="text" defaultValue="Client" className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm text-black focus:outline-none focus:border-black transition-colors" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Email Workspace</label>
                    <input required type="email" defaultValue="kaushalya@example.com" className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm text-black focus:outline-none focus:border-black transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Contact Phone Number</label>
                    <input required type="text" defaultValue="+94 77 123 4567" className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm text-black focus:outline-none focus:border-black transition-colors" />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button type="submit" className="bg-black text-white text-sm font-semibold px-5 py-2 rounded-lg border border-black hover:bg-gray-800 transition-colors">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ================= OPTION 2: CHANGE PASSWORD SECURITY BLOCK ================= */}
          {activeTab === 'security' && (
            <div className="p-6 space-y-6 animate-in fade-in duration-150">
              <div>
                <h3 className="text-lg font-bold text-black">Change Password</h3>
                <p className="text-sm text-gray-500">Update your access credential codes regularly to maintain database lockdown safety</p>
              </div>

              {passwordSaved && (
                <div className="bg-green-50 border border-green-200 p-3.5 rounded-lg flex items-center gap-2.5 text-green-800 text-sm font-semibold animate-in zoom-in duration-150">
                  <CheckCircle2 size={16} className="text-green-600" />
                  <span>Security access key updated successfully!</span>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Current Secret Password</label>
                  <input required type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm text-black focus:outline-none focus:border-black transition-colors" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">New Selection Password</label>
                    <input required type="password" placeholder="Minimum 8 characters" className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm text-black focus:outline-none focus:border-black transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Confirm New Selection Password</label>
                    <input required type="password" placeholder="Match new field exactly" className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm text-black focus:outline-none focus:border-black transition-colors" />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button type="submit" className="bg-black text-white text-sm font-semibold px-5 py-2 rounded-lg border border-black hover:bg-gray-800 transition-colors">
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ================= OPTION 3: READ-ONLY COMPANY INFO OVERVIEW ================= */}
          {activeTab === 'company' && (
            <div className="p-6 space-y-5 animate-in fade-in duration-150">
              <div>
                <h3 className="text-lg font-bold text-black">Company Profiles Reference</h3>
                <p className="text-sm text-gray-500">Corporate verification parameters associated with your client profile workspace</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-4 border border-gray-100 bg-gray-50/50 rounded-xl space-y-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Corporate Title Entity</span>
                  <p className="text-sm font-bold text-black">Apex Studio Designs Ltd.</p>
                </div>

                <div className="p-4 border border-gray-100 bg-gray-50/50 rounded-xl space-y-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Business Registration ID</span>
                  <p className="text-sm font-bold text-black">PV-00246810-LK</p>
                </div>

                <div className="p-4 border border-gray-100 bg-gray-50/50 rounded-xl space-y-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Headquarters Workplace Address</span>
                  <p className="text-sm font-bold text-black">Galle Road, Colombo 03, Sri Lanka</p>
                </div>

                <div className="p-4 border border-gray-100 bg-gray-50/50 rounded-xl space-y-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contract Start Parameter</span>
                  <p className="text-sm font-bold text-black">March 24, 2025</p>
                </div>
              </div>

              <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-[11px] text-gray-500 leading-relaxed">
                ℹ️ <strong>Note:</strong> Company information variables are verified via legal project documents. To modify corporate mapping variables, please generate a direct operational request through our <strong>Support Center</strong> channels.
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}