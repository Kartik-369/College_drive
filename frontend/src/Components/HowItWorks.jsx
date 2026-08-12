import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function HowItWorks() {
  const containerRef = useRef(null)
  const lineFillRef = useRef(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-height: 650px)", () => {
      
      gsap.set('.step-card', { gridArea: "1 / 1" });

      gsap.set('.step-2, .step-3, .step-4', { yPercent: 150 });
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: 1,
        },
      })

      tl.to(lineFillRef.current, { height: '100%', ease: 'none', duration: 3 }, 0)
      
      tl.to('.step-2', { yPercent: 0, ease: 'power2.inOut', duration: 1 }, 0)
      tl.to('.step-3', { yPercent: 0, ease: 'power2.inOut', duration: 1 }, 1)
      tl.to('.step-4', { yPercent: 0, ease: 'power2.inOut', duration: 1 }, 2) 
    });

    return () => mm.revert();
  }, [])

  return (
    <section ref={containerRef} id='howitworks' className="min-h-screen pb-24 md:pb-32 w-full bg-white relative justify-center items-center flex flex-col">
      
      <div className="shrink-0 pt-15 md:pt-24 pb-6 md:pb-8 px-4 text-center z-50 bg-white">
        <span className="text-5xl sm:text-6xl lg:text-7xl subpixel-antialiased font-canela block mb-4">How it Works</span>
        <p className="text-gray-700 max-w-4xl mx-auto font-semibold text-base md:text-lg leading-relaxed">
          The pipeline logic behind NeuroBusiness.
        </p>
      </div>

      <div className="relative w-full max-w-6xl mx-auto mt-8 md:mt-12 px-4 md:px-0 grid grid-cols-1">
         
         <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-gray-200 z-50">
            <div ref={lineFillRef} className="w-full bg-black h-0 absolute top-0" />
        </div>

        <div className="step-1 step-card w-full bg-white flex items-center justify-center p-4 z-10">
          <div className="flex flex-col md:flex-row items-center justify-between w-full py-8 md:py-12">
            <div className="w-full md:w-[45%] text-center md:text-right pr-0 md:pr-10 mb-8 md:mb-0">
              <h3 className="text-4xl font-bold mb-4">1. Data Preparation</h3>
              <p className="text-xl text-gray-500">FastAPI endpoint handles CSV uploads, cleaning TotalCharges and tenure, then applying one-hot encoding for categorical features.</p>
            </div>
            <div className="w-full md:w-[45%] aspect-video md:aspect-auto md:h-[400px] bg-stone-100 rounded-2xl border border-stone-200 shadow-xl overflow-hidden">
               <img src="https://media.istockphoto.com/id/2227028925/photo/business-professional-managing-digital-employee-record-using-stylus-and-laptop-digital-file.jpg?s=612x612&w=0&k=20&c=bea4EsVK_7mNjm0viy8B8Rqg5JalSBVM9FNz0TkC5wA=" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        <div className="step-2 step-card w-full bg-white flex items-center justify-center p-4 z-20">
           <div className="flex flex-col md:flex-row-reverse items-center justify-between w-full py-8 md:py-12">
            <div className="w-full md:w-[45%] text-center md:text-left pl-0 md:pl-10 mb-8 md:mb-0">
              <h3 className="text-4xl font-bold mb-4">2. XGBoost Inference</h3>
              <p className="text-xl text-gray-500">Model uses 6000 estimators with learning rate 0.2 to generate high-precision churn probability scores.</p>
            </div>
            <div className="w-full md:w-[45%] aspect-video md:aspect-auto md:h-[400px] bg-emerald-50 rounded-2xl border border-emerald-100 shadow-xl overflow-hidden">
               <img src="https://media.istockphoto.com/id/2170619377/photo/checklist-concept-businessman-surveying-online-checklist-on-virtual-screen-fill-out-the.jpg?s=2048x2048&w=is&k=20&c=nSSM8Z_FcziDLZZsc6cMgqumpYy7GMQ1dGdVR8U9swg=" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        <div className="step-3 step-card w-full bg-white flex items-center justify-center p-4 z-30">
           <div className="flex flex-col md:flex-row items-center justify-between w-full py-8 md:py-12">
            <div className="w-full md:w-[45%] text-center md:text-right pr-0 md:pr-10 mb-8 md:mb-0">
              <h3 className="text-4xl font-bold mb-4">3. SHAP Interpretation</h3>
              <p className="text-xl text-gray-500">TreeExplainer isolates top 3 feature drivers for every individual customer row, revealing specific risk causality.</p>
            </div>
            <div className="w-full md:w-[45%] aspect-video md:aspect-auto md:h-[400px] bg-stone-900 rounded-2xl border border-black shadow-xl overflow-hidden">
               <img src="https://media.istockphoto.com/id/1711724189/photo/business-analytics-finance-neural-network-ai-big-data-technology-data-scientists-query.jpg?s=612x612&w=0&k=20&c=2JrEdyYZKBFJKMI7EITpuvTPNilmBIi3vYtU-xTGzOs=" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
        
        <div className="step-4 step-card w-full bg-white flex items-center justify-center p-4 z-40">
           <div className="flex flex-col md:flex-row-reverse items-center justify-between w-full py-8 md:py-12">
            <div className="w-full md:w-[45%] text-center md:text-left pl-0 md:pl-10 mb-8 md:mb-0">
              <h3 className="text-4xl font-bold mb-4">4. Strategy Generation</h3>
              <p className="text-xl text-gray-500">Contextual prompt injection into a foundation model produces specific retention tactics for flagged records.</p>
            </div>
            <div className="w-full md:w-[45%] aspect-video md:aspect-auto md:h-[400px] bg-stone-900 rounded-2xl border border-black shadow-xl overflow-hidden">
               <img src="https://media.istockphoto.com/id/2182242357/photo/hr-attrition-employee-retention-human-resources-analytics-and-engagement-crm-customer.jpg?s=612x612&w=0&k=20&c=QGIlzLvvv2t5tXmPR4SQg_xvjiEbv2XzWD4ewNOicyc=" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}