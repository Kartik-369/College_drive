import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FOLDERS = ["DBMS", "JAVA", "Web technology"];

export default function Dashboard() {
  const [files, setFiles] = useState([]);
  const [activeFolder, setActiveFolder] = useState(FOLDERS[0]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    try {
      setApiError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/files`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        sessionStorage.removeItem('token');
        navigate('/');
        return;
      }

      const data = await response.json();

      if (response.ok && Array.isArray(data)) {
        setFiles(data);
      } else {
        setApiError(data.detail || data.message || "Failed to load files.");
        setFiles([]);
      }
      setLoading(false);
    } catch (error) {
      setApiError("Please try again. " + (error.message || ""));
      setFiles([]);
      setLoading(false);
    }
  };

  const handleDelete = async (e, fileId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Delete this file permanently from cloud storage?")) return;

    const token = sessionStorage.getItem('token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setFiles(files.filter(f => f._id !== fileId));
      } else {
        alert("Failed to delete");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/');
  };

  const handleGoHome = () => {
    navigate('/');
  };
  
  const handleNewUpload = () => {
    navigate('/upload', { state: { folder: activeFolder } });
  }

  const handleDownload = async (e, file) => {
    e.preventDefault();
    e.stopPropagation();

    const fileId = file?._id || file?.id;
    if (!fileId) {
      alert("File ID missing, please refresh.");
      return;
    }

    const token = sessionStorage.getItem("token");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/files/${fileId}/download`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Server returned ${response.status}: ${errText}`);
      }

      const blob = await response.blob();
      const zipBlob = new Blob([blob], { type: "application/zip" });
      const downloadUrl = window.URL.createObjectURL(zipBlob);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = file.file_name || "assignment.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();

      setTimeout(() => window.URL.revokeObjectURL(downloadUrl), 2000);
    } catch (err) {
      console.error("Download failure:", err);
      alert("Failed to download: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex items-center gap-3 text-blue-600 font-medium">
          <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading your drive...
        </div>
      </div>
    );
  }

  const displayedFiles = files.filter(f => f.subject_folder === activeFolder);

  return (
    <section className="bg-slate-50 min-h-screen flex flex-col w-full font-sans pt-20">
      
      <div className="flex-1 flex w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        
        {/* Sidebar / Folders */}
        <aside className="hidden md:flex flex-col w-64 shrink-0">
          <button onClick={handleNewUpload} className="mb-8 flex items-center justify-center gap-2 w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 px-4 py-3 rounded-md font-medium text-sm transition-colors">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            New Upload
          </button>

          <nav className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">Folders</p>
            {FOLDERS.map((folderName) => (
              <button 
                key={folderName}
                onClick={() => setActiveFolder(folderName)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${activeFolder === folderName ? 'bg-blue-100/50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                <svg className={`w-5 h-5 ${activeFolder === folderName ? 'text-blue-500' : 'text-slate-400'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path></svg>
                {folderName}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          
          {/* Mobile Actions & Folder Tabs */}
          <div className="md:hidden flex flex-col gap-4 mb-6">
            <button onClick={handleNewUpload} className="flex items-center justify-center gap-2 w-full bg-white border border-slate-200 text-slate-800 px-4 py-3 rounded-md font-medium text-sm">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              New Upload
            </button>
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              {FOLDERS.map((folderName) => (
                <button 
                  key={folderName}
                  onClick={() => setActiveFolder(folderName)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap border transition-all ${activeFolder === folderName ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600'}`}
                >
                  <svg className={`w-4 h-4 ${activeFolder === folderName ? 'text-blue-500' : 'text-slate-400'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path></svg>
                  {folderName}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              {activeFolder}
            </h1>
            <span className="text-sm font-medium text-slate-500">{displayedFiles.length} file{displayedFiles.length !== 1 && 's'}</span>
          </div>

          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm flex items-start gap-3">
              <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              <div>
                <p className="font-semibold">Error Loading Drive</p>
                <p className="mt-1 opacity-90">{apiError}</p>
              </div>
            </div>
          )}

          {displayedFiles.length === 0 ? (
            <div className="w-full bg-white border border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                 <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
              </div>
              <h2 className="text-lg font-semibold text-slate-800 mb-2">Folder is empty</h2>
              <p className="text-slate-500 text-sm mb-6 max-w-sm">You haven't uploaded any assignments for {activeFolder} yet.</p>
              <button onClick={handleNewUpload} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                Upload File
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedFiles.map((file) => (
                <div key={file._id} className="bg-white p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors group flex flex-col">
                  
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2.5L17.5 9H13V4.5zM6 20V4h5v7h7v9H6z"/></svg>
                    </div>
                    
                    <button onClick={(e) => handleDelete(e, file._id)} title="Delete File" className="text-slate-400 p-1 rounded opacity-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>

                  <h2 className="text-base font-semibold text-slate-800 line-clamp-2 mb-1" title={file.file_name}>{file.file_name}</h2>
                  
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 mt-auto pt-4">
                    <span>{file.uploaded_at ? new Date(file.uploaded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown Date'}</span>
                    <span>•</span>
                    <span>{file.size ? (file.size / 1024 / 1024).toFixed(2) : 0} MB</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleDownload(e, file)}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-slate-50 hover:bg-slate-100 text-sm text-slate-700 font-medium rounded-lg border border-slate-200 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    Download ZIP
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </section>
  );
}