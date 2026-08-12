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
  const handleCheckUpload=()=>{
    const Uploaded=localStorage.getItem('hasUploaded')
    if (Uploaded=="true") {
      navigate('/predict')
    }
    else navigate('/upload')
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-stone/30 backdrop-blur-sm justify-between p-3 items-center font-roslindale flex shadow-2xs max-w-full">
        
        <Link to='/'>
          <span className="text-2xl min-[1100px]:text-4xl tracking-tight font-bold shrink-0 z-10">
            NeuroBusiness
            <p className="text-[14px] font-sans font-semibold tracking-tighter hidden min-[1100px]:flex">Predictive Customer Intelligence</p>
          </span>
        </Link>

        <div className="hidden absolute font-bold left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center min-[1100px]:flex space-x-2 lg:space-x-6 text-xl font-serif tracking-wider">
          <div className="group relative">
            <Button href="#howitworks" color="inherit" className="text-black px-3 py-2 border-b-2 border-transparent group-hover:border-black group-hover:-translate-y-1 !transition-all duration-200 ease-in-out normal-case">How it Works</Button>
          </div>
        </div>

        <div className="flex items-center gap-3 z-20">
          <div className="hidden min-[1100px]:flex items-center gap-3 text-lg font-bold tracking-wider">
            {token ? (
              <>
                <span className="text-sm font-sans font-semibold mr-2">{userEmail}</span>
                  <Button onClick={handleCheckUpload} variant="outlined" color="inherit" sx={{ px: 3, py: 1, borderRadius: 8, textTransform: 'none', border: '1px solid #e5e7eb', '&:hover': { bgcolor: 'black', color: 'white', borderColor: 'black' } }}>
                    Workspace
                  </Button>
                <Button onClick={handleLogout} color="inherit" sx={{ px: 3, py: 1, borderRadius: 8, textTransform: 'none', border: '1px solid #e5e7eb', color: 'black', '&:hover': { bgcolor: 'black', color: 'white' } }}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to='/signup'>
                  <Button variant="outlined" color="inherit" sx={{ px: 3, py: 1, borderRadius: 8, textTransform: 'none', border: '1px solid #e5e7eb', bgcolor: 'darkslategray', color: 'white', '&:hover': { bgcolor: 'black', color: 'white', borderColor: 'black' } }}>
                    Signup
                  </Button>
                </Link>
                <Link to="https://www.linkedin.com/in/kartike-padia"><Button color="inherit" sx={{ px: 3, py: 1, borderRadius: 8, textTransform: 'none', border: '1px solid #e5e7eb', color: 'black', '&:hover': { bgcolor: 'black', color: 'white' } }}>
                  Linkedin
                </Button></Link>
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

        <div className={`min-[1100px]:hidden z-1 border border-gray-300 absolute top-full right-0 bg-white h-[calc(100dvh-100%)] overflow-y-auto min-w-80 transform transition-transform ease-in-out duration-400 ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
          <div className="flex justify-end pr-6 pt-6">
            <Button color="inherit" className="min-[1100px]:!hidden !text-inherit !min-w-0 !p-0" onClick={() => setOpen(!isOpen)}>
              <svg xmlns="http://www.w3.org/2000/svg" className='w-5 h-5' fill='currentColor' viewBox="0 0 384 512"><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" /></svg>
            </Button>
          </div>
          
          <ul className="flex flex-col space-y-3 p-6 text-[16.2px] font-canela tracking-wide">
              <li className="border-b border-stone-300">
                <Button href="#howitworks" onClick={() => setOpen(false)} fullWidth color="inherit" className="!justify-start !px-3 !py-2 !text-inherit !text-[16.2px] !font-canela !normal-case">How it Works</Button>
              </li>
          </ul>

          <div className="mt-auto p-6 flex flex-col gap-4 text-lg tracking-wider font-bold">
            {token ? (
              <>
                <div className="block w-full text-center font-sans text-sm font-semibold">{userEmail}</div>
                <div className="block w-full">
                  <Button fullWidth onClick={() => { setOpen(false);handleCheckUpload() }} sx={{ borderRadius: 8, textTransform: 'none', bgcolor: '#111827', color: 'white', '&:hover': { bgcolor: 'black' } }} className="p-2">Workspace</Button>
                </div>
                <div className="block w-full">
                  <Button fullWidth onClick={() => { setOpen(false); handleLogout(); }} sx={{ borderRadius: 8, textTransform: 'none', border: '1px solid #e5e7eb', color: 'black', '&:hover': { bgcolor: 'black', color: 'white' } }} className="p-2">Logout</Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/signup" className="block w-full">
                  <Button fullWidth onClick={() => setOpen(false)} sx={{ borderRadius: 8, textTransform: 'none', bgcolor: '#111827', color: 'white', '&:hover': { bgcolor: 'black' } }} className="p-2">Signup</Button>
                </Link>
                <Link to="https://www.linkedin.com/in/kartike-padia" className="block w-full">
                  <Button fullWidth sx={{ borderRadius: 8, textTransform: 'none', border: '1px solid #e5e7eb', color: 'black', '&:hover': { bgcolor: 'black', color: 'white' } }} className="p-2">Linkedin</Button>
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