"use client";

// We import useRouter from 'next/navigation' (Next.js App Router) to programmatically change pages
import { useRouter } from 'next/navigation';
// useState allows us to store the data the user types into the form before we send it
import React, { useState } from 'react';

export default function LoginPage() {
  // Initialize the router object so we can use it to redirect the user after a successful login
  const router = useRouter();

  // ==========================================
  // 1. STATE MANAGEMENT
  // ==========================================
  // These variables hold the live values of the input fields. 
  // Every time the user types a letter, these update instantly.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // This state holds error messages from the backend (e.g., "Invalid password") to display to the user
  const [error, setError] = useState("");

  // ==========================================
  // 2. THE SUBMIT FUNCTION
  // ==========================================
  // This function triggers when the user clicks "Sign In". It is 'async' because 
  // it has to pause and wait for the backend server to respond over the network.
  const handleLogin = async (e: React.FormEvent) => {
    // e.preventDefault() stops the browser's default behavior of reloading the entire page when a form is submitted
    e.preventDefault();
    
    // Clear any previous red error messages from the screen before trying again
    setError(""); 

    try {
      // Fetch is the bridge between our Next.js frontend and Node.js backend.
      // We send a POST request with the email and password packaged as a JSON string.
      const response = await fetch("http://localhost:5001/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Parse the JSON response coming back from the backend
      const data = await response.json();

      // response.ok checks if the status code is in the 200s (Success!)
      if (response.ok) {
        // SUCCESS: The backend verified the password.
        // We save the JWT token to localStorage so the browser "remembers" the user is logged in
        localStorage.setItem("token", data.token);
        alert("Login Successful! Welcome to Waveskill HR.");
        
        // ==========================================
        // 3. DYNAMIC ROLE-BASED ROUTING
        // ==========================================
        // We look at the data returned by the backend to find the user's role.
        // Depending on how your backend sends it, it might be data.role or data.user.role.
        const userRole = data.role || (data.user && data.user.role); 

        // The router acts like a traffic cop, directing the user to the correct dashboard
        if (userRole === 'Manager') {
            router.push('/Manager/Analytics'); 
        } else if (userRole === 'Admin') {
            router.push('/Admin');
        } else {
            // If they are an Employee (or if the role is missing), default to Employee Attendance
            router.push('/Employee/Attendance'); 
        }
        
      } else {
        // FAILURE: The backend sent an error (like a 400 or 401 status code).
        // We take the specific error message ("User not found", etc.) and put it in our error state to show the user.
        setError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      // NETWORK ERROR: This triggers if the frontend literally cannot reach the backend (e.g., server is turned off)
      setError("Server is not responding. Is the backend running?");
    }
  };

  // ==========================================
  // 4. THE UI (RENDER)
  // ==========================================
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eef4fa] p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-gray-100 p-10">
        
        {/* Header Section */}
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
            HR Management System
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Sign in to access your account
          </p>
        </div>

        {/* Form Section - Tied to the handleLogin function */}
        <form className="space-y-5" onSubmit={handleLogin}>
          
          {/* Conditional Rendering: This red box ONLY appears if the 'error' state has text in it */}
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
                {/* Inline SVG for Mail Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </div>
              <input
                type="email"
                value={email} // Binds the input to our React state
                onChange={(e) => setEmail(e.target.value)} // Updates the state instantly as the user types
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
                {/* Inline SVG for Lock Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <input
                type="password"
                value={password} // Binds the input to our React state
                onChange={(e) => setPassword(e.target.value)} // Updates the state instantly as the user types
                placeholder="Enter your password"
                className="w-full pl-12 pr-4 py-3.5 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white text-gray-900 transition-colors outline-none"
                required
              />
            </div>
          </div>

          {/* Submit Button - Pressing this triggers the form's onSubmit event (handleLogin) */}
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