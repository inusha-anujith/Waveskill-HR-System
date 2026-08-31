"use client";
import React, { useState, useEffect } from 'react';
import UserMenu from '../UserMenu/UserMenu';

interface EmployeeNaviProps {
  employeeName: string;
  onLogout: () => void;
}

const EmployeeNavi: React.FC<EmployeeNaviProps> = ({ employeeName, onLogout }) => {
  // [NEW]: State to hold the fetched profile photo
  const [profilePhoto, setProfilePhoto] = useState<string>('');

  // [NEW]: Automatically fetch the employee's photo when the navigation bar loads
  useEffect(() => {
    const fetchProfilePhoto = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch('http://localhost:5001/api/profile/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const data = await res.json();
        if (data.success && data.user && data.user.profilePhoto) {
          setProfilePhoto(data.user.profilePhoto);
        }
      } catch (error) {
        console.error("Failed to load profile photo for navigation menu");
      }
    };

    fetchProfilePhoto();
  }, []);

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200 font-sans">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Employee Portal</h1>
        <p className="text-sm text-gray-500 mt-0.5">Welcome, {employeeName}</p>
      </div>
      
      {/* [NEW]: Pass the fetched profilePhoto string down to the updated UserMenu */}
      <UserMenu 
        name={employeeName} 
        role="Employee" 
        profilePhoto={profilePhoto} 
        profileHref="/Employee/Profile" 
        onLogout={onLogout} 
      />
    </header>
  );
};

export default EmployeeNavi;