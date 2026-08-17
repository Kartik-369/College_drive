function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-14 pb-10 font-sans mt-auto">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 bg-blue-600 text-white rounded-md flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
              </div>
              <span className="text-lg font-bold text-slate-800 tracking-tight">
                LabZip
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Cloud storage for students at Darshan University.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-3 text-sm">Project</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="https://github.com/Kartik-369/LabZip" className="hover:text-slate-800 transition-colors">Source Code</a></li>
              <li><a href="/#howitworks" className="hover:text-slate-800 transition-colors">How it Works</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-3 text-sm">Contact</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="mailto:kartikbpadia0707@gmail.com" className="hover:text-slate-800 transition-colors">kartikbpadia0707@gmail.com</a></li>
              <li><a href="https://www.linkedin.com/in/kartike-padia" className="hover:text-slate-800 transition-colors">LinkedIn</a></li>
              <li><a href="https://github.com/Kartik-369" className="hover:text-slate-800 transition-colors">GitHub</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-slate-400 text-xs">
            &copy; {new Date().getFullYear()} LabZip
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
