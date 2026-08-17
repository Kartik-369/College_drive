import { Link, useNavigate } from "react-router-dom";

function Home(){
  const navigate = useNavigate();
  
  const handleStartUploading = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard'); 
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
      
      {/* Hero */}
      <div className="pt-28 lg:pt-44 pb-24 px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1]">
            Stop emailing assignments to yourself.
          </h1>
          
          <p className="text-base md:text-lg text-slate-600 mt-6 leading-relaxed max-w-xl">
            LabZip zips your project files in the browser, uploads them straight to cloud storage, and organizes everything by subject folder. No middleman server, no size limits from email.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 mt-8">
            <button 
              onClick={handleStartUploading} 
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm"
            >
              Open your drive
            </button>
            <Link to="https://github.com/Kartik-369/LabZip" className="px-6 py-3 text-slate-600 hover:text-slate-900 font-medium text-sm flex items-center gap-2 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
              Source code
            </Link>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div id="howitworks" className="border-t border-slate-200 bg-white scroll-mt-20">
        <div className="max-w-5xl mx-auto px-6 py-20 lg:py-28">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">How it works</p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-14 max-w-lg">
            Four steps from your local files to the cloud.
          </h2>

          <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
            <div className="flex gap-5">
              <span className="text-3xl font-bold text-slate-200 leading-none shrink-0 mt-0.5">1</span>
              <div>
                <h3 className="text-base font-semibold text-slate-900 mb-1.5">Drop your files</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Drag an entire project folder into the upload area. Node modules, .class files, and other junk gets filtered out automatically.
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <span className="text-3xl font-bold text-slate-200 leading-none shrink-0 mt-0.5">2</span>
              <div>
                <h3 className="text-base font-semibold text-slate-900 mb-1.5">Zipped in your browser</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  JSZip compresses everything client-side into a single .zip. Nothing touches the server, so there are no upload size bottlenecks.
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <span className="text-3xl font-bold text-slate-200 leading-none shrink-0 mt-0.5">3</span>
              <div>
                <h3 className="text-base font-semibold text-slate-900 mb-1.5">Stored on Backblaze B2</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  The zip uploads directly to cloud storage via a pre-signed URL. Your backend only stores metadata in MongoDB, not the file itself.
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <span className="text-3xl font-bold text-slate-200 leading-none shrink-0 mt-0.5">4</span>
              <div>
                <h3 className="text-base font-semibold text-slate-900 mb-1.5">Download anywhere</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Every file streams directly from the cloud to your machine through an authenticated endpoint. Works on any device, any browser.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tech stack */}
      <div className="border-t border-slate-200 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6 py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap">
            Built with
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-10 opacity-50">
            {logos.map((logo,index)=>
              <img src={logo.src} key={index} alt={logo.name} className="h-7 md:h-8 w-auto object-contain"/>
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default Home;
