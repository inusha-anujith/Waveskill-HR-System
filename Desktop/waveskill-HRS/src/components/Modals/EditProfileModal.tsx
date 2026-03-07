"use client";

import React, { useState } from 'react';
import { X, Camera, MapPin, Phone, HeartPulse } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: {
    phone: string;
    address: string;
    emergencyContact: string;
    emergencyPhone: string;
  };
  onSave: (data: any) => void;
}

export default function EditProfileModal({ isOpen, onClose, currentData, onSave }: EditProfileModalProps) {
  const [formData, setFormData] = useState(currentData);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-xl p-8 shadow-xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
            <p className="text-sm text-gray-500 mt-1">Update your personal information</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800 transition-colors p-2 bg-gray-50 rounded-full">
            <X size={20} />
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          
          {/* Profile Picture Update */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="w-16 h-16 rounded-full bg-blue-700 text-white flex items-center justify-center text-2xl font-bold relative group cursor-pointer overflow-hidden">
              J
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={20} className="text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Profile Picture</p>
              <p className="text-xs text-gray-500 mb-2">JPG, GIF or PNG. Max size of 2MB.</p>
              <button type="button" className="text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-md transition-colors">
                Upload New Photo
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone size={18} className="text-gray-400" />
                </div>
                <input 
                  type="text" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 text-gray-900 outline-none text-sm" 
                  required 
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Home Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MapPin size={18} className="text-gray-400" />
                </div>
                <input 
                  type="text" 
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 text-gray-900 outline-none text-sm" 
                  required 
                />
              </div>
            </div>

            {/* Emergency Contact Name */}
            <div className="md:col-span-2 pt-4 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <HeartPulse size={18} className="text-red-500" />
                Emergency Information
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Contact Name</label>
              <input 
                type="text" 
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 text-gray-900 outline-none text-sm" 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Contact Phone</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone size={18} className="text-gray-400" />
                </div>
                <input 
                  type="text" 
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 text-gray-900 outline-none text-sm" 
                  required 
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-6 py-3.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm">
              Cancel
            </button>
            <button type="submit" className="px-6 py-3.5 bg-[#1a1a1a] text-white font-semibold rounded-xl hover:bg-black transition-colors text-sm">
              Save Changes
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}