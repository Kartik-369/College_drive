function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-20 pb-12 font-sans mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-15">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
              </div>
              <span className="text-2xl font-bold text-slate-800 tracking-tight">
                LabZip
              </span>
            </div>
            <p className="text-slate-500 text-sm max-w-sm mt-4 leading-relaxed">Secure, blazing-fast cloud storage for your academic work.</p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 mb-4 tracking-wide uppercase text-xs">Developer Contact</h3>
            <p className="text-slate-500 text-sm mb-4">Please do send feedback or review the repository.</p>
            <a href="mailto:kartikbpadia0707@gmail.com" className="text-slate-700 text-sm font-medium block mb-2 hover:text-blue-600 transition-colors">
              kartikbpadia0707@gmail.com
            </a>
            <div className="flex gap-6 text-slate-500 mt-6">
              <a href="https://www.linkedin.com/in/kartike-padia" className="hover:text-slate-900 text-sm transition-colors font-medium">LinkedIn</a>
              <a href="https://github.com/Kartik-369" className="hover:text-slate-900 text-sm transition-colors font-medium">GitHub</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-200 pt-8 flex justify-center items-center">
          <p className="text-slate-400 text-xs font-medium">
            This soon will be limited to students of Darshan University.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;