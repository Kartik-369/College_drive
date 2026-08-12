import { useRef } from "react";
import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import myHero from "../assets/Dash.png"; // Replace with an appropriate college/drive image if needed
import {Button} from '@mui/material';
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link, useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger)

function Home(){
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const heroImageRef = useRef(null)
  
  const handleStartUploading = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/upload');
    } else {
      navigate('/signup');
    }
  };
  
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      const isMobile = window.innerWidth < 640;
      gsap.to(heroImageRef.current, {
        y: -30,
        ease:'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 90%',
          end: isMobile ? 'bottom 60%' : 'bottom 90%',
          scrub: 1,
        }
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])
  

  const logos=[
    {name:'React',src:'https://img.icons8.com/?size=100&id=N3G7bBnphi53&format=png&color=000000'},
    {name:'FastAPI',src:'https://icon.icepanel.io/Technology/svg/FastAPI.svg'},
    {name:'MongoDB',src:'https://cdn.iconscout.com/icon/free/png-512/free-mongodb-icon-svg-download-png-1175138.png?f=webp&w=256'},
    {name:'Backblaze',src:'https://upload.wikimedia.org/wikipedia/commons/e/e0/Backblaze_Logo_2020.svg'}
  ]
  return (<>
    <div className="w-full overflow-x-hidden h-full pt-9">
    
      <div className="flex flex-col gap-12 max-[1100px]:gap-2.25 overflow-hidden justify-center items-center text-center px-4">
        <span className="text-5xl md:text-[72px] p-6 mt-12 md:mt-24 max-[1100px]:mt-16 font-roslindale font-extrabold">Never Lose an Assignment.</span>
        
        <p className=" text-gray-600 max-w-2xl font-semibold lg:text-2xl text-[16px] p-6"><span className="font-bold text-gray-900 underline decoration-emerald-500 underline-offset-4">
            College Drive
          </span>{" "}is your secure, blazing fast, zero-hassle cloud storage. Drag, drop, zip, and submit instantly.</p>
        <div className="flex max-[1100px]:flex-col max-[1100px]:space-y-3 p-3 px-auto justify-center items-center flex-row mt-auto gap-6 lg:text-xl lg:tracking-wider lg:font-light">
            <Link to='https://github.com/Kartik-369/CollegeDrive'><Button className=" !rounded-4xl !bg-stone-800 !text-white !px-9 !py-2 hover:!bg-black transition">View Github</Button></Link>
            <Button onClick={handleStartUploading} className=" !rounded-4xl !bg-white !text-black !border-[1.5px] !px-9 !py-2 hover:!bg-black hover:!text-white transition">Start Uploading</Button>
        </div>
      </div>
      
      <div className="py-12 h-auto flex items-center max-[1100px]:flex-col max-[1100px]:gap-3 px-4">
        <p className="text-center flex-1 text-gray-700 text-2xl max-[1130px]:text-lg font-semibold tracking-wider uppercase ">Built with Modern Standards</p>
      
        <div className="flex flex-1 flex-wrap justify-center items-center gap-3 opacity-60">
          {logos.map((logo,index)=>
            <img src={logo.src} key={index} className="h-9 md:h-18 w-auto"/>)}
        </div>
      </div>
      
      <div ref={containerRef} className="h-auto relative w-full py-12 lg:py-0 overflow-hidden">
        <div className="relative w-full flex flex-col justify-center items-center">
          
          <div className="absolute inset-0 min-[1130px]:relative z-0 flex justify-center items-center overflow-hidden">
            <img 
              ref={heroImageRef} 
              className="h-auto min-[1130px]:h-full md:max-w-4xl object-contain scale-110 min-[1130px]:scale-100 rounded-2xl shadow-2xl" 
              src={myHero} 
              alt="Dashboard Preview"
            />
          </div>
      
          <div className="relative min-[1130px]:absolute min-[1130px]:inset-0 z-30 flex flex-col justify-center items-center gap-6 min-[1130px]:block pointer-events-none w-full">
            
            <div className="pointer-events-auto flex items-center justify-center max-[1130px]:bg-black/25 gap-2 bg-black/40 text-white font-semibold backdrop-blur-md rounded-2xl border border-white/10 p-[13.2px] min-[1130px]:p-4.5 max-[768px]:w-[72%] min-[1130px]:absolute min-[1130px]:top-[15%] min-[1130px]:left-[12%]">
              <span className="text-sm md:text-3xl">React UI</span>
            </div>
      
            <div className="pointer-events-auto flex max-[1130px]:bg-black/25 items-center justify-center gap-2 bg-black/40 text-white font-semibold backdrop-blur-md rounded-2xl border border-white/10 p-[13.2px] min-[1130px]:p-4 max-[768px]:w-[72%] min-[1130px]:absolute min-[1130px]:bottom-[20%] min-[1130px]:left-[15%]">
              <span className="text-sm md:text-3xl">MongoDB Atlas</span>
            </div>
      
            <div className="pointer-events-auto flex max-[1130px]:bg-black/25 items-center justify-center gap-2 bg-black/40 text-white font-semibold backdrop-blur-md rounded-2xl border border-white/10 p-[13.2px] min-[1130px]:p-4 max-[768px]:w-[72%] min-[1130px]:absolute min-[1130px]:top-[25%] min-[1130px]:right-[12%]">
              <span className="text-sm md:text-3xl">FastAPI Engine</span>
            </div>
      
            <div className="pointer-events-auto flex max-[1130px]:bg-black/25 items-center justify-center gap-2 bg-black/40 text-white font-semibold backdrop-blur-md rounded-2xl border border-white/10 p-[13.2px] min-[1130px]:p-4 max-[768px]:w-[72%] min-[1130px]:absolute min-[1130px]:bottom-[25%] min-[1130px]:right-[15%]">
              <span className="text-sm md:text-3xl">Backblaze B2</span>
            </div>
      
          </div>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-6 py-16 mt-12">
        <div className="text-center mb-16">
          <h2 className="text-[54px] font-semibold md:font-normal md:text-7xl font-ogg mb-4 text-slate-900">
            Inside the Architecture
          </h2>
          <p className="text-slate-600 md:text-xl text-[18px]">
            A zero-server-load pipeline demonstrating robust and scalable storage.
          </p>
        </div>
      
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-gray-300 hover:scale-3d hover:shadow-2xl active:shadow-2xl active:scale-3d transition-all">
            <div className="text-3xl md:text-5xl font-bold bg-linear-to-br from-teal-600 to-emerald-900 text-transparent bg-clip-text mb-2">01</div>
            <div className="text-lg font-semibold text-slate-900">Client-Side Zipping</div>
            <p className="text-slate-500 text-sm mt-2">Filter out junk files like node_modules locally and compile the rest into a ZIP archive entirely within the browser, saving bandwidth.</p>
          </div>
      
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-gray-300 hover:scale-3d hover:shadow-2xl active:shadow-2xl active:scale-3d transition-all">
            <div className="text-3xl md:text-5xl font-bold bg-linear-to-br from-teal-600 to-emerald-900 text-transparent bg-clip-text mb-2">02</div>
            <div className="text-lg font-semibold text-slate-900">Pre-Signed Uploads</div>
            <p className="text-slate-500 text-sm mt-2">The FastAPI backend securely generates a temporary link, allowing the frontend to upload files directly to Backblaze B2 without routing heavy files through the server.</p>
          </div>
      
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-gray-300 hover:scale-3d hover:shadow-2xl active:shadow-2xl active:scale-3d transition-all">
            <div className="text-3xl md:text-5xl font-bold bg-linear-to-br from-teal-600 to-emerald-900  text-transparent bg-clip-text mb-2">03</div>
            <div className="text-lg font-semibold text-slate-900">Secure Database</div>
            <p className="text-slate-500 text-sm mt-2">MongoDB efficiently stores file metadata, linking your assignments securely to your authenticated user account for fast retrieval.</p>
          </div>
        </div>
      </div>
      
    </div>
  </>);
}

export default Home;
