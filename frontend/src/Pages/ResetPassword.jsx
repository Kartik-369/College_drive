import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const token = searchParams.get("token"); 

  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token, new_password: newPassword }), 
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage("Success! Navigating to login...");
        setTimeout(() => navigate('/signup'), 2000); 
      } else {
        setMessage(data.detail || "Error resetting password.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Server error. Please try again.");
    }
  };

  if (!token) {
    return (
      <section className="bg-slate-50 font-sans min-h-screen flex items-center justify-center pt-20 pb-12 px-4 sm:px-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden p-8 text-center">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h2 className="text-lg font-bold text-slate-800 mb-2">Invalid Reset Link</h2>
          <p className="text-sm text-slate-600 mb-6">The password reset link you clicked is invalid or has expired.</p>
          <button onClick={() => navigate('/forgot')} className="w-full py-2.5 px-4 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
            Request New Link
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-50 font-sans min-h-screen flex items-center justify-center pt-20 pb-12 px-4 sm:px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
        
        <div className="bg-slate-50/50 border-b border-slate-100 px-8 py-5 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Create New Password
          </h1>
        </div>

        <form onSubmit={handleReset} className="p-8">
          <p className="text-sm text-slate-600 mb-6">Please enter your new password below. Make sure it's strong and secure.</p>

          <div className="mb-6 relative">
            <label className="block mb-2 text-sm font-semibold text-slate-700">New Password</label>
            <div className="relative flex items-center">
              <span className="absolute left-3 flex items-center justify-center">
                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input 
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                autoFocus 
                required 
                className="block w-full py-2.5 pl-10 pr-4 text-sm text-slate-700 bg-white border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all" 
                placeholder="••••••••" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-2.5 px-4 text-sm font-semibold text-white transition-all bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 hover:shadow active:scale-[0.98] mb-4"
          >
            Update Password
          </button>

          {message && (
            <div className={`p-4 text-sm rounded-lg border ${message.includes('Success') ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}