"use client";
import React, { useState } from 'react';

export default function ChangePasswordModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear any previous error messages when they start typing again
        if (status.type === 'error') setStatus({ type: '', message: '' });
    };

    // Real-time password validation checks
    const isLongEnough = formData.newPassword.length >= 8;
    const hasUppercase = /[A-Z]/.test(formData.newPassword);
    const hasNumber = /[0-9]/.test(formData.newPassword);
    const passwordsMatch = formData.newPassword === formData.confirmPassword && formData.newPassword !== '';
    
    // The form is only valid if ALL conditions are met
    const isFormValid = isLongEnough && hasUppercase && hasNumber && passwordsMatch && formData.currentPassword !== '';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        setIsLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const token = localStorage.getItem('token'); 
            const response = await fetch('http://localhost:5001/api/profile/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Show the success message
                setStatus({ type: 'success', message: 'Password updated successfully!' });
                setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                
                // Real-world UX: Wait 1.5 seconds so they can read the success message, then close the modal automatically
                setTimeout(() => {
                    setStatus({ type: '', message: '' });
                    onClose();
                }, 1500);
            } else {
                setStatus({ type: 'error', message: data.message });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Failed to connect to the server.' });
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle = "w-full px-4 h-[48px] bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-900 font-medium placeholder-gray-400 focus:border-blue-500 focus:bg-white transition-all";

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-8 transform transition-all">
                
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">Change Password</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} required className={inputStyle} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} required className={inputStyle} />
                        
                        {/* Live Password Strength Tracker */}
                        <div className="mt-2 text-xs space-y-1">
                            <p className={isLongEnough ? "text-green-600 font-medium flex items-center" : "text-gray-500 flex items-center"}>
                                <span className="mr-1.5 text-base">{isLongEnough ? '✓' : '•'}</span> At least 8 characters
                            </p>
                            <p className={hasUppercase ? "text-green-600 font-medium flex items-center" : "text-gray-500 flex items-center"}>
                                <span className="mr-1.5 text-base">{hasUppercase ? '✓' : '•'}</span> One uppercase letter
                            </p>
                            <p className={hasNumber ? "text-green-600 font-medium flex items-center" : "text-gray-500 flex items-center"}>
                                <span className="mr-1.5 text-base">{hasNumber ? '✓' : '•'}</span> One number
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className={inputStyle} />
                        {formData.confirmPassword.length > 0 && !passwordsMatch && (
                            <p className="text-red-500 text-xs mt-1.5 font-medium">Passwords do not match</p>
                        )}
                    </div>

                    {status.message && (
                        <div className={`p-3 text-sm rounded-xl font-medium ${status.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                            {status.message}
                        </div>
                    )}

                    <div className="flex gap-4 pt-2 border-t mt-6">
                        <button type="button" onClick={onClose} className="flex-1 py-3.5 text-gray-700 font-bold rounded-xl border border-gray-200 hover:bg-gray-50">Cancel</button>
                        
                        <button 
                            type="submit" 
                            disabled={isLoading || !isFormValid} 
                            className={`flex-1 py-3.5 text-white font-bold rounded-xl transition-colors ${
                                isFormValid && !isLoading ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'
                            }`}
                        >
                            {isLoading ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}