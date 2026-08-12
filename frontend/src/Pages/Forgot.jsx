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
    <section className="bg-white">
      <div className="flex items-center justify-center min-h-[100dvh] px-4 py-8 mx-auto w-full">
        <form onSubmit={handleForgot} className="w-full max-w-md flex flex-col gap-5 sm:gap-6 shadow-xl shadow-stone-200/50 border border-stone-200 bg-amber-50/30 p-5 sm:p-7 md:p-9 rounded-2xl sm:rounded-3xl">
          <div className="flex flex-row justify-between items-center mt-2 md:mt-3 mb-6">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800 sm:text-3xl">Reset Password</h1>
            <button onClick={() => navigate(-1)} className="bg-white text-center w-24 rounded-2xl h-14 relative text-black text-[15px] font-semibold group" type="button">Go Back
              <div className="bg-amber-100 rounded-xl h-[39px] w-1/3 flex items-center justify-center absolute -left-6 top-[9px] group-hover:w-[120px] group-active:w-[120px] z-10 duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" height="25px" width="25px">
                  <path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z" fill="#000000"></path>
                  <path d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z" fill="#000000"></path>
                </svg>
              </div>
            </button>
          </div>
          <p className="text-sm sm:text-base text-gray-600">Enter your email address and we'll send you a secure link to reset your password.</p>
          {message && (
            <div className={`p-3 sm:p-4 text-sm rounded-lg transition-all ${isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
              {message}
            </div>
          )}
          <div className="relative flex items-center">
            <span className="absolute left-3 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus required className="block w-full py-3.5 pl-11 pr-4 text-sm sm:text-base text-gray-700 bg-white border border-stone-200 rounded-xl focus:border-amber-400 focus:ring-amber-200 focus:outline-none focus:ring focus:ring-opacity-40 transition-all" placeholder="Email address" />
          </div>
          <button type="submit" disabled={isSubmitting} className={`w-full py-3.5 sm:py-4 mt-2 text-sm sm:text-base font-medium tracking-wide text-white rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50 active:scale-[0.98] ${isSubmitting ? "bg-stone-400 cursor-not-allowed" : "bg-stone-800 hover:bg-emerald-600 focus:ring-emerald-300 shadow-md hover:shadow-lg"}`}>
            {isSubmitting ? 'Sending...' : hasSent ? 'Resend Reset Link' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </section>
  );
}