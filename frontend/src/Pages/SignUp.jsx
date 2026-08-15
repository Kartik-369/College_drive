import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";

function SignUp(){
  const [Login, isLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  useEffect(()=>{
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  },[]);

  const manageAuth=async()=>{
      if (!email || !password) {
        alert("Please fill in the details");
        return;
      }
      const end = Login ? '/login' : '/register';
      const url = `${import.meta.env.VITE_API_URL}${end}`;
      try {
        let response;
        if (Login) {
          const formData = new URLSearchParams();
          formData.append('username', email);
          formData.append('password', password);
          response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString(),
          });
        } else {
          response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password }),
          });
        }
        const data = await response.json();
        if (response.ok) {
          if (Login) {
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('userEmail', email);
            alert('Login successful!');
            window.dispatchEvent(new Event('authChange'));
            navigate('/dashboard');
          } else {
            alert('Registered! Please Sign In.');
            isLogin(true);
          }
        } else {
          alert('Error: ' + (data.detail || data.message));
        }
      } catch (error) {
        alert("Network Error: " + error);
      }
    }
  // const loginWithGoogle = useGoogleLogin({
  //   onSuccess: async (tokenResponse) => {
  //     try {
  //       const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/google`, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ token: tokenResponse.access_token }), 
  //       });
  //       const data = await response.json();
        
  //       if(response.ok){
  //           localStorage.setItem('token', data.access_token);
  //           alert('Login successful!');
  //           window.dispatchEvent(new Event('authChange'));
  //           navigate('/dashboard');
  //       } else {
  //           alert('Auth Failed');
  //       }
  //     } catch (error) {
  //       console.error("rejected");
  //     }
  //   },
  //   onError: () => console.log('Google Login Failed'),
  // });


  return (<>
    
    <section className="bg-slate-50 font-sans min-h-screen flex items-center justify-center pt-20 pb-12 px-4 sm:px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
        
        <div className="bg-slate-50/50 border-b border-slate-100 px-8 py-5 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            {Login ? 'Welcome back' : 'Create an account'}
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

        <form className="p-8">
          <div className="mb-4 relative">
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
                onChange={(e) => { setEmail(e.target.value) }} 
                autoCapitalize="none" 
                autoFocus 
                className="block w-full py-2.5 pl-10 pr-4 text-sm text-slate-700 bg-white border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all" 
                placeholder="you@college.edu"
              />
            </div>
          </div>

          <div className="mb-6 relative">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-slate-700">Password</label>
              {Login && (
                <Link to='/forgot' className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                  Forgot password?
                </Link>
              )}
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-3 flex items-center justify-center">
                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => { setPassword(e.target.value) }} 
                className="block w-full py-2.5 pl-10 pr-4 text-sm text-slate-700 bg-white border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all" 
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button 
              onClick={manageAuth} 
              type="button" 
              className="w-full py-2.5 px-4 text-sm font-semibold text-white transition-all bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 hover:shadow active:scale-[0.98]"
            >
              {Login ? 'Sign In' : 'Create Account'}
            </button>
            
            {/* <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="shrink-0 mx-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Or continue with</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <button 
              type="button" 
              onClick={() => loginWithGoogle()} 
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium text-slate-700 transition-all bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 active:scale-[0.98]"
            >*/}
              {/* <svg className="w-5 h-5" viewBox="0 0 40 40">
                <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#FFC107" />
                <path d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z" fill="#FF3D00" />
                <path d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z" fill="#4CAF50" />
                <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#1976D2" />
              </svg>
              <span>Google</span>
            </button>*/}

            <div className="mt-4 text-center">
              <button type="button" className="text-sm text-slate-600 transition-colors" onClick={() => { isLogin(!Login)}}>
                {Login ? 'Don\'t have an account?' : 'Already have an account?'} <span className="text-blue-600 font-semibold hover:underline">{Login ? 'Sign up' : 'Sign in'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  
  
  </>);
}

export default SignUp;
