import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
// import { useGoogleLogin } from "@react-oauth/google";

function SignUp() {
  const [Login, isLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, []);

  // Real-time email validation function
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (!value) {
      setEmailError("Email address is required.");
      return;
    }

    const parts = value.split("@");
    if (
      parts.length !== 2 ||
      !parts[0] ||
      !["gmail.com", "darshan.ac.in"].includes(parts[1])
    ) {
      setEmailError(
        "Please use a valid @gmail.com or @darshan.ac.in email address.",
      );
    } else {
      setEmailError("");
    }
  };

  const manageAuth = async () => {
    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }

    // Block submission if there is an active email error
    if (emailError) {
      alert('Please fix the email error before proceeding.');
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
          sessionStorage.setItem('token', data.access_token);
          sessionStorage.setItem('userEmail', email);
          window.dispatchEvent(new Event('authChange'));
          navigate('/dashboard');
          alert('Login successful! Welcome back.'); // Alert for successful login
        } else {
          isLogin(true);
          alert(data.message || 'Registration successful! Please log in with your new account.'); // Alert for successful registration
        }
      } else {
        const errorMessage = data.message || data.detail || 'An error occurred. Please try again.';
        if (!Login && errorMessage.toLowerCase().includes('already exists')) { // Check specifically for registration and "email already exists"
          alert('Email already exists. Please log in instead.');
        } else {
          alert(errorMessage);
        }
      }
    } catch (error) {
      alert('Network error. Please check your connection and try again.');
    }
  }

  return (
    <>
      <section className="bg-slate-50 font-sans min-h-screen flex items-center justify-center pt-20 pb-12 px-4 sm:px-6">
        <div className="w-full max-w-md bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-200 px-8 py-5 flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              {Login ? "Welcome back" : "Create an account"}
            </h1>
            <button
              onClick={() => navigate(-1)}
              className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              type="button"
              title="Go Back"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <form className="p-8">
            <div className="mb-4 relative">
              <label className="block mb-2 text-sm font-semibold text-slate-700">
                Email Address
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  autoCapitalize="none"
                  autoFocus
                  className={`block w-full py-2.5 pl-10 pr-4 text-sm text-slate-700 bg-white border rounded-lg focus:outline-none transition-all ${
                    emailError
                      ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  }`}
                />
              </div>
              {emailError && (
                <p className="mt-1.5 text-xs text-red-500 font-medium">
                  {emailError}
                </p>
              )}
            </div>

            <div className="mb-6 relative">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-3 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  className="block w-full py-2.5 pl-10 pr-10 text-sm text-slate-700 bg-white border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 flex items-center justify-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={manageAuth}
                type="button"
                disabled={!!emailError || !email}
                className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {Login ? "Sign In" : "Create Account"}
              </button>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  className="text-sm text-slate-600 transition-colors"
                  onClick={() => {
                    isLogin(!Login);
                  }}
                >
                  {Login
                    ? "Don't have an account?"
                    : "Already have an account?"}{" "}
                  <span className="text-blue-600 font-semibold hover:underline">
                    {Login ? "Sign up" : "Sign in"}
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

export default SignUp;
