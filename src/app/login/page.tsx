"use client";

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Building2, Mail, Lock } from 'lucide-react';
import API from '@/utils/api'; 

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // send request to Customer login endpoint
      const response = await API.post('/customers/login', { email, password });
      
      const data = response.data;

      if (response.status === 200) {
        
        localStorage.setItem("token", data.token);
        localStorage.setItem("customer", JSON.stringify(data.customer));
        
        alert("Login Successful! Welcome to Customer Dashboard.");
        
        
        router.push('/Customer/Home'); 
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Server is not responding. Is the backend running?");
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
            Software Management
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Sign in to access your customer portal
          </p>
        </div>

        {/* Form Section */}
        <form className="space-y-5" onSubmit={handleLogin}>
          
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm text-center font-medium border border-red-100">
              {error}
            </div>
          )}

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
                placeholder="kaushalya@test.com"
                className="w-full pl-12 pr-4 py-3.5 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white text-gray-900 transition-colors outline-none"
                required
              />
            </div>
          </div>

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