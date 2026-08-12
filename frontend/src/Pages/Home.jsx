import { useRef } from "react";
import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import myHero from "../assets/Hero_Img.png";
import {Button} from '@mui/material';
import HowItWorks from "../Components/HowItWorks";
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link, useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger)

function Home(){
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const heroImageRef = useRef(null)
  const handleStartPredicting = () => {
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
        rotation:360,
        ease:'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 90%',
          end: isMobile ? 'bottom 60%' : 'bottom 90%',
          scrub: 0.1,
        }
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])
  

  const logos=[
    {name:'Docker',src:'https://img.icons8.com/?size=100&id=Wln8Z3PcXanx&format=png&color=000000'},
    {name:'FastAPI',src:'https://icon.icepanel.io/Technology/svg/FastAPI.svg'},
    {name:'React',src:'https://img.icons8.com/?size=100&id=N3G7bBnphi53&format=png&color=000000'},
    {name:'MongoDB',src:'https://cdn.iconscout.com/icon/free/png-512/free-mongodb-icon-svg-download-png-1175138.png?f=webp&w=256'},
    {name:'numpy',src:'https://img.icons8.com/?size=100&id=aR9CXyMagKIS&format=png&color=000000'},
    {name:'matplotlib',src:'https://img.icons8.com/?size=100&id=TkX1totjFmAD&format=png&color=000000'},
    {name:'sklearn',src:'https://icon.icepanel.io/Technology/svg/scikit-learn.svg'},
    {name:'pandas',src:'https://icon.icepanel.io/Technology/png-shadow-512/Pandas.png'}
    
  ]
  return (<>
    <div className="w-full overflow-x-hidden h-full pt-9">
    
      <div className="flex flex-col gap-12 max-[1100px]:gap-2.25 overflow-hidden justify-center items-center text-center px-4">
        <span className="text-5xl md:text-[72px] p-6 mt-12 md:mt-24 max-[1100px]:mt-16 font-roslindale font-extrabold">Predict Churn. Retain Customers.</span>
        
        <p className=" text-gray-600 max-w-2xl font-semibold lg:text-2xl text-[16px]  p-6"><span className="font-bold text-gray-900 underline decoration-emerald-500 underline-offset-4">
            NeuroBusiness
          </span>{" "}identifies at-risk customers, explains the "why" behind, and generates actionable AI strategies to keep them.</p>
        <div className="flex max-[1100px]:flex-col max-[1100px]:space-y-3 p-3 px-auto justify-center items-center flex-row mt-auto gap-6 lg:text-xl lg:tracking-wider lg:font-light">
            <Link to='https://github.com/Kartik-369/Neuro_Business'><Button className=" !rounded-4xl !bg-stone-800 !text-white !px-9 !py-2 hover:!bg-black transition">View Github</Button></Link>
            <Button onClick={handleStartPredicting} className=" !rounded-4xl !bg-white !text-black !border-[1.5px] !px-9 !py-2 hover:!bg-black hover:!text-white transition">Start Predicting</Button>
        </div>
      </div>
      
      <div className="py-12 h-auto flex items-center max-[1100px]:flex-col max-[1100px]:gap-3 px-4">
        <p className="text-center flex-1 text-gray-700 text-2xl max-[1130px]:text-lg font-semibold tracking-wider uppercase ">Tech Stack Powered by Industry Standards</p>
      
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
              className="h-auto min-[1130px]:h-full md:max-w-3xl object-contain scale-125 min-[1130px]:scale-100" 
              src={myHero} 
              alt="Hero"
            />
          </div>
      
          <div className="relative min-[1130px]:absolute min-[1130px]:inset-0 z-30 flex flex-col justify-center items-center gap-6 min-[1130px]:block pointer-events-none w-full">
            
            <div className="pointer-events-auto flex items-center justify-center max-[1130px]:bg-black/25 gap-2 bg-black/40 text-white font-semibold backdrop-blur-md rounded-2xl border border-white/10 p-[13.2px] min-[1130px]:p-4.5 max-[768px]:w-[72%] min-[1130px]:absolute min-[1130px]:top-[15%] min-[1130px]:left-[18%]">
              <span className="text-sm md:text-3xl">React UI</span>
            </div>
      
            <div className="pointer-events-auto flex max-[1130px]:bg-black/25 items-center justify-center gap-2 bg-black/40 text-white font-semibold backdrop-blur-md rounded-2xl border border-white/10 p-[13.2px] min-[1130px]:p-4 max-[768px]:w-[72%] min-[1130px]:absolute min-[1130px]:top-[50%] min-[1130px]:left-[15%] min-[1130px]:-translate-y-1/2">
              <span className="text-sm md:text-3xl">XGBoost</span>
            </div>
      
            <div className="pointer-events-auto flex max-[1130px]:bg-black/25 items-center justify-center gap-2 bg-black/40 text-white font-semibold backdrop-blur-md rounded-2xl border border-white/10 p-[13.2px] min-[1130px]:p-4 max-[768px]:w-[72%] min-[1130px]:absolute min-[1130px]:bottom-[15%] min-[1130px]:left-[18%]">
              <span className="text-sm md:text-3xl">MongoDB Vault</span>
            </div>
      
            <div className="pointer-events-auto flex max-[1130px]:bg-black/25 items-center justify-center gap-2 bg-black/40 text-white font-semibold backdrop-blur-md rounded-2xl border border-white/10 p-[13.2px] min-[1130px]:p-4 max-[768px]:w-[72%] min-[1130px]:absolute min-[1130px]:top-[15%] min-[1130px]:right-[18%]">
              <span className="text-sm md:text-3xl">FastAPI Engine</span>
            </div>
      
            <div className="pointer-events-auto flex max-[1130px]:bg-black/25 items-center justify-center gap-2 bg-black/40 text-white font-semibold backdrop-blur-md rounded-2xl border border-white/10 p-[13.2px] min-[1130px]:p-4 max-[768px]:w-[72%] min-[1130px]:absolute min-[1130px]:top-[50%] min-[1130px]:right-[15%] min-[1130px]:-translate-y-1/2">
              <span className="text-sm md:text-3xl">SHAP Analysis</span>
            </div>
      
            <div className="pointer-events-auto flex max-[1130px]:bg-black/25 items-center justify-center gap-2 bg-black/40 text-white font-semibold backdrop-blur-md rounded-2xl border border-white/10 p-[13.2px] min-[1130px]:p-4 max-[768px]:w-[72%] min-[1130px]:absolute min-[1130px]:bottom-[15%] min-[1130px]:right-[18%]">
              <span className="text-sm md:text-3xl">LLM Insights</span>
            </div>
      
          </div>
        </div>
      </div>
      
      <div id="how-it-works" className="overflow-hidden w-full">
        <HowItWorks/>
      </div>
      
      <div className="max-w-6xl mx-auto px-6 py-9">
        <div className="text-center mb-16">
          <h2 className="text-[54px] font-semibold md:font-normal md:text-7xl font-ogg mb-4 text-slate-900">
            Inside the Architecture
          </h2>
          <p className="text-slate-600 md:text-xl text-[18px]">
            A production-ready pipeline demonstrating end-to-end Machine Learning deployment.
          </p>
        </div>
      
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-gray-300 hover:scale-3d hover:shadow-2xl active:shadow-2xl active:scale-3d transition-all">
            <div className="text-3xl md:text-5xl font-bold bg-linear-to-br from-teal-600 to-emerald-900 text-transparent bg-clip-text mb-2">01</div>
            <div className="text-lg font-semibold text-slate-900">Data Engineering</div>
            <p className="text-slate-500 text-sm mt-2">Robust data ingestion pipeline built with Pandas and FastAPI, handling automated parsing, validation, and encoding of raw CSV transaction data before inference.</p>
          </div>
      
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-gray-300 hover:scale-3d hover:shadow-2xl active:shadow-2xl active:scale-3d transition-all">
            <div className="text-3xl md:text-5xl font-bold bg-linear-to-br from-teal-600 to-emerald-900 text-transparent bg-clip-text mb-2">02</div>
            <div className="text-lg font-semibold text-slate-900">Explainable AI (XAI)</div>
            <p className="text-slate-500 text-sm mt-2">Moving beyond black-box ML models. Leveraging SHAP (SHapley Additive exPlanations) to dynamically calculate and visualize the exact features driving churn risk for every prediction.</p>
          </div>
      
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-gray-300 hover:scale-3d hover:shadow-2xl active:shadow-2xl active:scale-3d transition-all">
            <div className="text-3xl md:text-5xl font-bold bg-linear-to-br from-teal-600 to-emerald-900  text-transparent bg-clip-text mb-2">03</div>
            <div className="text-lg font-semibold text-slate-900">LLM Integration</div>
            <p className="text-slate-500 text-sm mt-2">Contextual prompt injection into the Gemini Foundation Model, translating raw mathematical risk scores into actionable, human-readable retention strategies.</p>
          </div>
        </div>
      </div>
      
    </div>
  </>);
}

export default Home;
