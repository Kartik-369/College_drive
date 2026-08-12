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
            navigate('/predict');
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
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: tokenResponse.access_token }), 
        });
        const data = await response.json();
        
        if(response.ok){
            localStorage.setItem('token', data.access_token);
            alert('Login successful!');
            window.dispatchEvent(new Event('authChange'));
            navigate('/predict');
        } else {
            alert('Auth Failed');
        }
      } catch (error) {
        console.error("rejected");
      }
    },
    onError: () => console.log('Google Login Failed'),
  });


  return (<>
    
    <section className="bg-white ">
      <div className="container flex items-center justify-center min-h-[100dvh] px-4 sm:px-6 py-8 mx-auto w-full">
        
          <form className="w-full shadow-xl shadow-stone-200/50 border border-stone-200 bg-amber-50/30 p-5 sm:p-7 md:p-9 rounded-2xl sm:rounded-4xl max-w-md">  
            <div className="flex flex-wrap justify-between items-center gap-4 mt-3">
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 capitalize">{Login?'Sign In':'Sign Up'}</h1>
                <div className="flex justify-center items-center">
                  <button onClick={()=>navigate(-1)} className="bg-white text-center w-24 rounded-2xl h-14 relative text-black text-[15px] font-semibold group" type="button">Go Back
                  <div className="bg-amber-100 rounded-xl h-[39px] w-1/3 flex items-center justify-center absolute -left-6 top-[9px] group-hover:w-[120px] group-active:w-[120px] z-10 duration-300">
                    <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 1024 1024"
                          height="25px"
                          width="25px"
                        >
                    <path
                            d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                            fill="#000000"
                          ></path>
                          <path
                            d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                            fill="#000000"
                          ></path>
                        </svg>
                      </div>
                      <p className="translate-x-0"></p>
                  </button>
                </div>
            </div>
  
              <div className="relative flex items-center mt-6 sm:mt-8">
                  <span className="absolute left-3 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                  </span>
  
            <input type="email" value={email} onChange={(e) => { setEmail(e.target.value) }} autoCapitalize="true" autoFocus='true' className="block w-full py-3 sm:py-3.5 pl-10 sm:pl-11 pr-4 text-sm sm:text-base text-gray-700 bg-white border border-stone-200 rounded-xl focus:border-amber-400 focus:ring-amber-200 focus:outline-none focus:ring focus:ring-opacity-40 transition-all" placeholder="Email address"></input>
              </div>
  
              <div className="relative flex items-center mt-4">
                  <span className="absolute left-3 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                  </span>
  
            <input type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} className="block w-full py-3 sm:py-3.5 pl-10 sm:pl-11 pr-4 text-sm sm:text-base text-gray-700 bg-white border border-stone-200 rounded-xl focus:border-amber-400 focus:ring-amber-200 focus:outline-none focus:ring focus:ring-opacity-40 transition-all" placeholder="Password"/>
              </div>
  
              <div className="mt-6 flex flex-col gap-3 sm:gap-4">
                  <button onClick={manageAuth} type="button" className="w-full py-3 sm:py-3.5 text-sm sm:text-base font-medium tracking-wide text-white capitalize transition-all duration-300 transform bg-gray-600 rounded-xl hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-300 focus:ring-opacity-50 active:scale-[0.98]">
                      {Login?'Sign In':'Sign Up'}
                  </button>
                  {Login && <Link to='/forgot' className="w-fit mx-auto"><button className="w-fit" type="button"><p className="text-sm underline text-gray-600 hover:text-gray-900 transition-colors">forgot password?</p></button></Link>}
                  <p className="text-center text-sm text-gray-500">{Login?'or':'Or continue'}</p>
  
                  <button type="button" onClick={() => loginWithGoogle()} className="w-full flex items-center justify-center gap-2 py-3 sm:py-3.5 text-sm sm:text-base font-medium text-gray-700 transition-all duration-300 transform bg-white border border-stone-300 rounded-xl hover:bg-amber-50 active:scale-[0.98]">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 40 40">
                      <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#FFC107" />
                      <path d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z" fill="#FF3D00" />
                      <path d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z" fill="#4CAF50" />
                      <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#1976D2" />
                    </svg>
                    <span className="block">{Login ? 'Sign In' : 'Sign Up'} with Google</span>
                  </button>
  
                  <div className="mt-2 text-center ">
              <a className="text-sm text-gray-600 hover:underline cursor-pointer" onClick={() => { isLogin(!Login)}}>
                        {Login?'Create an account:':'Already have an account?'}<span className="text-gray-900 font-semibold">{Login?' Sign Up':' Sign In'}</span>
                      </a>
                  </div>
              </div>
              
          </form>
      </div>
      
  </section>
  
  
  </>);
}

export default SignUp;
