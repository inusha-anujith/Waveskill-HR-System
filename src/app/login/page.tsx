"use client";

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import API from '@/utils/api'; 
import { API_BASE } from '../../lib/api';

export default function LoginPage() {
  const router = useRouter();

  // STATE MANAGEMENT
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // ==========================================
    // STEP 1: Attempt Customer Authentication 
    // ==========================================
    try {
      const response = await API.post('/customers/login', { email, password });
      const data = response.data;

      if (response.status === 200) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("customer", JSON.stringify(data.customer));
        alert("Login Successful! Welcome to Customer Dashboard.");
        router.push('/Customer/Home');
        return; // Exit function upon successful customer login
      }
    } catch (err: any) {
      // If customer login fails, proceed to attempt system user authentication below
    }

    // ==========================================
    // STEP 2: Attempt System User Authentication
    // ==========================================
    try {
      const response = await fetch(`${API_BASE}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Save the JWT token and user info
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role || "Employee");
        localStorage.setItem("name", data.name || "");

        // DYNAMIC ROLE-BASED ROUTING
        if (data.role === "Admin") {
          router.push("/Admin/Analytics");
        } else if (data.role === "Manager") {
          router.push("/Manager/Analytics");
        } else {
          router.push("/Employee/Attendance");
        }
      } else {
        setError(data.message || "Invalid credentials or login failed");
      }
    } catch (err: any) {
      setError("Server is not responding. Is the backend running?");
    }
  };

  // ==========================================
  // THE UI (RENDER)
  // ==========================================
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eef4fa] p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-gray-100 p-10">
        
        {/* Form Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center mb-5">
            {/* Inline SVG for Building Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
              <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
              <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
              <path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Software Management
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Sign in to access your portal
          </p>
        </div>

        {/* Form Section */}
        <form className="space-y-5" onSubmit={handleLogin}>
          
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm text-center font-medium border border-red-100">
              {error}
            </div>
          )}

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@company.com"
                className="w-full pl-12 pr-4 py-3.5 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white text-gray-900 transition-colors outline-none"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-12 pr-4 py-3.5 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white text-gray-900 transition-colors outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3.5 rounded-xl transition-colors mt-8"
          >
            Sign In
          </button>
        </form>

      </div>
    </div>
  );
}