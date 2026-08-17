import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
export default function Forgot() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSent, setHasSent] = useState(false);
  const navigate = useNavigate();
  const handleForgot = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setMessage("Sending link...");
    setIsError(false);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/forgot-password?email=${email}`, { method: "POST" });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || "Reset link sent successfully!");
        setIsError(false);
        setHasSent(true);
      } else {
        setMessage(data.detail || "Failed to send reset link.");
        setIsError(true);
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <section className="bg-slate-50 font-sans min-h-screen flex items-center justify-center pt-20 pb-12 px-4 sm:px-6">
      <div className="w-full max-w-md bg-white rounded-lg border border-slate-200 overflow-hidden">
        
        <div className="border-b border-slate-200 px-8 py-5 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Reset Password
          </h1>
          <button 
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            type="button"
            title="Go Back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <form onSubmit={handleForgot} className="p-8">
          <p className="text-sm text-slate-600 mb-6">Enter your email address and we'll send you a secure link to reset your password.</p>
          
          {message && (
            <div className={`p-4 mb-6 text-sm rounded-lg border ${isError ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
              {message}
            </div>
          )}

          <div className="mb-6 relative">
            <label className="block mb-2 text-sm font-semibold text-slate-700">Email Address</label>
            <div className="relative flex items-center">
              <span className="absolute left-3 flex items-center justify-center">
                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                autoFocus 
                required 
                className="block w-full py-2.5 pl-10 pr-4 text-sm text-slate-700 bg-white border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all" 
                placeholder="you@college.edu" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className={`w-full py-2.5 px-4 text-sm font-semibold text-white bg-blue-600 rounded-md transition-colors ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"}`}
          >
            {isSubmitting ? 'Sending...' : hasSent ? 'Resend Reset Link' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </section>
  );
}