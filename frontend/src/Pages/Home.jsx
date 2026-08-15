import { Link, useNavigate } from "react-router-dom";

function Home(){
  const navigate = useNavigate();
  
  const handleStartUploading = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/predict'); // Dashboard is mapped to /predict in App.jsx
    } else {
      navigate('/signup');
    }
  };

  const logos=[
    {name:'React',src:'https://img.icons8.com/?size=100&id=N3G7bBnphi53&format=png&color=000000'},
    {name:'FastAPI',src:'https://icon.icepanel.io/Technology/svg/FastAPI.svg'},
    {name:'MongoDB',src:'https://cdn.iconscout.com/icon/free/png-512/free-mongodb-icon-svg-download-png-1175138.png?f=webp&w=256'},
    { name: 'Backblaze', src: 'https://companieslogo.com/img/orig/BLZE-8ebde572.svg' },
    { name: 'Docker', src: 'https://img.icons8.com/?size=100&id=Wln8Z3PcXanx&format=png&color=000000' },
    { name: 'Kubernetes', src: 'https://img.icons8.com/?size=100&id=cvzmaEA4kC0o&format=png&color=000000' }
  ]

  return (
    <div className="w-full bg-slate-50 min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Centered Hero Section */}
      <div className="pt-24 lg:pt-40 pb-20 px-6 lg:px-8 max-w-4xl mx-auto flex flex-col items-center text-center gap-8 z-10">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 font-medium text-sm border border-blue-200">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          Secure Cloud Storage for Students
        </div>
        
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Your assignments, <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">safely stored.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed">
          College Drive provides secure, blazing-fast cloud storage for your academic work. Upload directly to the cloud with zero server bottlenecks.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6 w-full sm:w-auto">
          <button 
            onClick={handleStartUploading} 
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm hover:shadow transition-all duration-200 active:scale-95 text-lg"
          >
            Go to Drive
          </button>
          <Link to="https://github.com/Kartik-369/CollegeDrive" className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold rounded-xl shadow-sm transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 text-lg">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
            View GitHub
          </Link>
        </div>
      </div>

      {/* Tech Stack Bar */}
      <div className="border-y border-slate-200 bg-white py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-md font-bold text-gray-600 uppercase tracking-widest text-center md:text-left">
            Built on Modern Architecture
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {logos.map((logo,index)=>
              <img src={logo.src} key={index} alt={logo.name} className="h-8 md:h-10 w-auto object-contain"/>
            )}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Everything you need in a cloud drive
          </h2>
          <p className="text-lg text-slate-600">
            We stripped away the complexity to give you a blazing fast, secure, and intuitive tool for managing your college coursework.
          </p>
        </div>
      
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Direct Cloud Uploads</h3>
            <p className="text-slate-600 leading-relaxed">
              Files bypass the server entirely and upload directly to Backblaze B2 using secure pre-signed URLs, saving massive bandwidth.
            </p>
          </div>
      
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Client-Side Zipping</h3>
            <p className="text-slate-600 leading-relaxed">
              Drop entire folders. We filter out junk files (like node_modules) and zip everything inside your browser before uploading.
            </p>
          </div>
      
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Secure & Private</h3>
            <p className="text-slate-600 leading-relaxed">
              Metadata is safely stored in MongoDB. File downloads are fully authenticated and stream directly from the cloud to you.
            </p>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default Home;
