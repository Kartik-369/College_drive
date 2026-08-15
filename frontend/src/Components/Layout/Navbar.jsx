import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from '@mui/material';
import { useEffect } from "react";

function Navbar() {
  const [isOpen, setOpen] = useState(false);
  const navigate = useNavigate();
  const [token,setToken] = useState(localStorage.getItem('token'));
  const [userEmail,setUserEmail] = useState(localStorage.getItem('userEmail'));

  useEffect(() => {
    const handleAuthChange=()=>{
      setToken(localStorage.getItem('token'));
      setUserEmail(localStorage.getItem('userEmail'));
    };
    window.addEventListener('authChange', handleAuthChange);
    return()=>window.removeEventListener('authChange', handleAuthChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userEmail')
    setToken(null)
    setUserEmail(null)
    
    window.dispatchEvent(new Event('authChange'));
    
    navigate('/');
  }
  const handleCheckUpload = () => {
    navigate('/dashboard');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 justify-between px-6 py-3 items-center flex shadow-sm max-w-full font-sans transition-all">
        
        <Link to='/' className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight shrink-0 z-10 hidden sm:block">
            College Drive
          </span>
        </Link>

        <div className="hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center min-[1100px]:flex space-x-2 lg:space-x-6 text-sm font-semibold text-slate-700 tracking-wider">
          <div className="group relative">
            <a href="/#howitworks" className="text-slate-600 px-3 py-2 border-b-2 border-transparent hover:text-blue-600 transition-colors">How it Works</a>
          </div>
        </div>

        <div className="flex items-center gap-3 z-20">
          <div className="hidden min-[1100px]:flex items-center gap-3 text-sm font-semibold">
            {token ? (
              <>
                <span className="text-slate-600 mr-2">{userEmail}</span>
                  <Button onClick={handleCheckUpload} variant="outlined" color="inherit" sx={{ px: 3, py: 1, borderRadius: 2, textTransform: 'none', border: '1px solid #e2e8f0', color: '#0f172a', '&:hover': { bgcolor: '#f8fafc' } }}>
                    My Drive
                  </Button>
                <Button onClick={handleLogout} color="inherit" sx={{ px: 3, py: 1, borderRadius: 2, textTransform: 'none', border: '1px solid #fee2e2', color: '#dc2626', bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fecaca' } }}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to='/signup'>
                  <Button variant="outlined" color="inherit" sx={{ px: 3, py: 1, borderRadius: 2, textTransform: 'none', border: 'none', bgcolor: '#2563eb', color: 'white', '&:hover': { bgcolor: '#1d4ed8' }, boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }}>
                    Signup
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <Button color="inherit" className="min-[1100px]:!hidden !text-inherit !min-w-0 !p-0" onClick={() => setOpen(!isOpen)}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-6 h-6' fill='currentColor'> 
            <g> <path fill="none" d="M0 0h24v24H0z" /> <path d="M18 18v2H6v-2h12zm3-7v2H3v-2h18zm-3-7v2H6V4h12z" /> </g> 
          </svg>
        </Button>

        <div className={`min-[1100px]:hidden fixed inset-0 bg-black/15 transition-opacity duration-500 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setOpen(false)}></div>

        <div className={`min-[1100px]:hidden z-1 border border-slate-200 absolute top-full right-0 bg-white h-[calc(100dvh-100%)] overflow-y-auto min-w-80 transform transition-transform ease-in-out duration-400 ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col font-sans shadow-xl`}>
          <div className="flex justify-end pr-6 pt-6">
            <Button color="inherit" className="min-[1100px]:!hidden !text-slate-500 !min-w-0 !p-2" onClick={() => setOpen(!isOpen)}>
              <svg xmlns="http://www.w3.org/2000/svg" className='w-5 h-5' fill='currentColor' viewBox="0 0 384 512"><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" /></svg>
            </Button>
          </div>
          
          <ul className="flex flex-col space-y-3 p-6 text-sm font-semibold text-slate-700">
              <li className="border-b border-slate-100 pb-3">
                <a href="/#howitworks" onClick={() => setOpen(false)} className="block w-full text-left px-3 py-2 text-slate-600 hover:text-blue-600">How it Works</a>
              </li>
          </ul>

          <div className="mt-auto p-6 flex flex-col gap-3 font-sans">
            {token ? (
              <>
                <div className="block w-full text-center text-sm font-semibold text-slate-600 mb-2">{userEmail}</div>
                <div className="block w-full">
                  <Button fullWidth onClick={() => { setOpen(false);handleCheckUpload() }} sx={{ borderRadius: 2, textTransform: 'none', bgcolor: '#2563eb', color: 'white', '&:hover': { bgcolor: '#1d4ed8' } }} className="py-2.5">My Drive</Button>
                </div>
                <div className="block w-full">
                  <Button fullWidth onClick={() => { setOpen(false); handleLogout(); }} sx={{ borderRadius: 2, textTransform: 'none', border: '1px solid #fee2e2', color: '#dc2626', bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fecaca' } }} className="py-2.5">Logout</Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/signup" className="block w-full">
                  <Button fullWidth onClick={() => setOpen(false)} sx={{ borderRadius: 2, textTransform: 'none', bgcolor: '#2563eb', color: 'white', '&:hover': { bgcolor: '#1d4ed8' } }} className="py-2.5">Signup</Button>
                </Link>
              </>
            )}
          </div>
        </div>

      </nav>
    </>
  );
}

export default Navbar;