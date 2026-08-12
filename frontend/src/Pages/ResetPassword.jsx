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
    return <div className="text-center mt-20 text-red-500 font-bold">Invalid or missing token!</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center mt-20 p-10">
      <div className="bg-white p-8 rounded shadow-md w-96 border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-center">Enter New Password</h2>
        
        <form onSubmit={handleReset} className="flex flex-col gap-4">
          <input 
            type="password" 
            placeholder="New Password" 
            required
            className="border p-2 rounded"
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Confirm Reset
          </button>
        </form>

        {message && <p className="mt-4 text-center font-bold">{message}</p>}
      </div>
    </div>
  );
}