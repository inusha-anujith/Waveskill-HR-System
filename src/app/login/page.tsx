"use client";

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Building2, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  // Initialize the router so we can change pages!
  const router = useRouter();

  // 1. Setting up "Memory" for what the user types
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 2. The function that talks to your backend!
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      // Sending the data across the bridge!
      const response = await fetch("http://localhost:5001/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success! Save the token
        localStorage.setItem("token", data.token);
        alert("Login Successful! Welcome to Waveskill HR.");
        
        // redirect the user directly to the Employee Attendance dashboard!
        router.push('/Employee/Attendance'); 
        
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Server is not responding. Is the backend running?");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eef4fa] p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-gray-100 p-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center mb-5">
            <Building2 size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">
            HR Management System
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Sign in to access your account
          </p>
        </div>

        {/* Form Section - Now connected to handleLogin! */}
        <form className="space-y-5" onSubmit={handleLogin}>
          
          {/* Error Message Box */}
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm text-center font-medium border border-red-100">
              {error}
            </div>
          )}

          {/* Email Input - Now connected to State */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={20} className="text-gray-500" />
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

          {/* Password Input - Now connected to State */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={20} className="text-gray-500" />
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

          {/* Submit Button */}
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