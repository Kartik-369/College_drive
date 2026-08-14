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
    const token = localStorage.getItem('token');
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
        localStorage.removeItem('token');
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

    const token = localStorage.getItem('token');
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

  const handleGoBack = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    } else {
      navigate(-1);
    }
  };

  const handleNewUpload = () => {
    // Pass the currently active folder so the upload page knows where to put it
    navigate('/upload', { state: { folder: activeFolder } });
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60dvh]">
        <p className="text-lg sm:text-xl font-semibold text-gray-600 animate-pulse">Loading workspace...</p>
      </div>
    );
  }

  // Filter files by the active folder
  const displayedFiles = files.filter(f => f.subject_folder === activeFolder);

  return (
    <section className="bg-white min-h-[100dvh] pt-24 sm:pt-32 pb-12 sm:pb-24 flex flex-col w-full">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 sm:mb-10 border-b border-stone-200 pb-6 sm:pb-8">
          <div className="max-w-xl">
            <h1 className="text-3xl sm:text-[40px] md:text-5xl lg:text-6xl font-roslindale font-extrabold text-slate-900 mb-2 sm:mb-3 leading-tight">My Drive</h1>
            <p className="text-sm sm:text-base md:text-xl text-slate-600">Access and manage your assignments.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <button onClick={handleGoBack} className="flex-1 sm:flex-none bg-amber-50 border border-stone-200 text-black px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-sm sm:text-base font-semibold hover:bg-amber-100 active:scale-95 transition-all duration-300">Go Back</button>
            <button onClick={handleNewUpload} className="flex-1 sm:flex-none bg-stone-800 text-white px-4 sm:px-8 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-sm sm:text-base font-semibold hover:bg-black hover:shadow-lg active:scale-95 transition-all duration-300">+ New Upload</button>
          </div>
        </div>

        {/* FOLDER SELECTION TABS */}
        <div className="flex space-x-2 sm:space-x-4 mb-8 overflow-x-auto pb-2">
            {FOLDERS.map((folderName) => (
                <button
                    key={folderName}
                    onClick={() => setActiveFolder(folderName)}
                    className={`px-5 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all duration-300 ${activeFolder === folderName ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                    📁 {folderName}
                </button>
            ))}
        </div>

        {apiError && (
          <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg sm:rounded-xl w-full max-w-2xl mx-auto text-center text-sm sm:text-base">
            <p className="font-semibold">Backend Error:</p>
            <p className="mt-1">{apiError}</p>
          </div>
        )}

        {displayedFiles.length === 0 ? (
          <div className="w-full shadow-lg shadow-stone-200/50 border border-stone-200 bg-amber-50/30 p-8 sm:p-12 rounded-3xl sm:rounded-4xl max-w-2xl mx-auto text-center mt-8 sm:mt-12">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">No data found in {activeFolder}</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">You haven't uploaded any assignments for this subject yet.</p>
            <button onClick={handleNewUpload} className="w-full sm:w-auto px-6 py-3 sm:py-3.5 text-sm sm:text-base font-medium tracking-wide text-white transition-all duration-300 bg-emerald-600 rounded-lg hover:bg-emerald-700 active:scale-95">Upload to {activeFolder}</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 pb-8">
            {displayedFiles.map((file) => (
              <div key={file._id} className="bg-white p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 hover:border-stone-300 hover:-translate-y-1 hover:shadow-xl active:shadow-md transition-all duration-300 cursor-pointer relative group flex flex-col h-full min-h-[200px] sm:min-h-[240px]">
                <button onClick={(e) => handleDelete(e, file._id)} title="Delete File" className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-red-50 text-red-600 p-2 sm:p-2.5 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-red-100 active:scale-90 transition-all duration-300 z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-1 pr-10 sm:pr-12 line-clamp-2 leading-tight">{file.file_name}</h2>
                <p className="text-slate-400 text-xs sm:text-sm mb-4 sm:mb-6 font-medium">{file.uploaded_at ? new Date(file.uploaded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</p>
                <div className="mt-auto">
                  <div className="text-4xl sm:text-5xl font-bold bg-linear-to-br from-teal-600 to-emerald-900 text-transparent bg-clip-text mb-1 sm:mb-2">{file.size ? (file.size / 1024 / 1024).toFixed(2) : 0}</div>
                  <div className="text-sm sm:text-lg font-semibold text-slate-900 leading-tight">MB Size</div>
                </div>
                <div className="mt-4 sm:mt-6 flex items-center text-sm sm:text-base text-emerald-600 font-semibold sm:group-hover:translate-x-2 transition-transform duration-300">
                  <a href={file.secure_download_url || file.cloud_storage_url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>Secure Download</a>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-1.5 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
