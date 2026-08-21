import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import JSZip from "jszip";

function Upload() {
  const navigate = useNavigate();
  const location = useLocation();
  const [projectName, setProjectName] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  
  const subjectFolder = location.state?.folder || "DBMS";

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    if (fileRejections.length > 0) {
      alert("Some files were rejected. Ensure they are under 15MB and not .exe/.sh files.");
    }
    
    const validFiles = acceptedFiles.filter(file => {
      const path = file.path || file.name;
      if (path.includes("node_modules") || path.endsWith(".class")) {
        return false;
      }
      return true;
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 15 * 1024 * 1024,
    validator: (file) => {
      if (file.name.endsWith(".exe") || file.name.endsWith(".sh")) {
        return {
          code: "forbidden-extension",
          message: ".exe and .sh files are not allowed",
        };
      }
      return null;
    }
  });

  const handleUpload = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      alert("Please select files to upload!");
      return;
    }
    if (!projectName.trim()) {
      alert("Please enter an assignment name!");
      return;
    }

    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      navigate("/");
      return;
    }

    setIsUploading(true);
    setUploadProgress("Zipping files locally...");

    try {
      const zip = new JSZip();

      // Read every dropped file's raw binary data fully into memory
      for (const file of selectedFiles) {
        const relativePath = file.path || file.name;
        // Strip leading "./" and "/" — Windows Explorer rejects ZIP
        const cleanPath = relativePath.replace(/^(\.\/|\/)+/, "");
        if (!cleanPath) continue;
        const buffer = await file.arrayBuffer();
        zip.file(cleanPath, buffer);
      }

      // DEFLATE compression
      const zipBlob = await zip.generateAsync({
        type: "blob",
        mimeType: "application/zip",
        compression: "DEFLATE",
        compressionOptions: { level: 6 }
      });

      let zipFileName = projectName.replace(/\s+/g, "_");
      if (!zipFileName.endsWith(".zip")) {
        zipFileName += "_Submission.zip";
      }

      setUploadProgress("Requesting secure upload link...");
      
      const presignResponse = await fetch(`${import.meta.env.VITE_API_URL}/files/presign`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          file_name: zipFileName,
          content_type: "application/zip",
          size: zipBlob.size,
          folder_name: subjectFolder
        })
      });

      if (!presignResponse.ok) {
        throw new Error("Failed to get secure upload link");
      }

      const { upload_url, file_key } = await presignResponse.json();

      setUploadProgress("Uploading to Cloud...");

      // Explicitly send the zipBlob with matching headers
      const uploadResponse = await fetch(upload_url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/zip"
        },
        body: zipBlob
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file to Cloud Storage");
      }

      const b2Endpoint = import.meta.env.VITE_B2_ENDPOINT_URL || "https://s3.us-west-004.backblazeb2.com";
      const bucketName = import.meta.env.VITE_B2_BUCKET_NAME || "your-bucket-name";
      const downloadUrl = `${b2Endpoint}/${bucketName}/${encodeURIComponent(file_key)}`;

      setUploadProgress("Saving metadata...");

      const saveResponse = await fetch(`${import.meta.env.VITE_API_URL}/files`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          file_name: zipFileName,
          size: zipBlob.size,
          cloud_storage_url: downloadUrl,
          subject_folder: subjectFolder,
          object_key: file_key 
        })
      });

      if (saveResponse.ok) {
        navigate('/dashboard');
      } else {
        throw new Error("Failed to save file metadata");
      }

    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsUploading(false);
      setUploadProgress("");
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <section className="bg-slate-50 min-h-screen flex items-center justify-center font-sans px-4 sm:px-6 pt-20 pb-12">
      <div className="w-full max-w-2xl bg-white rounded-lg border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="border-b border-slate-200 px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">
              Upload to {subjectFolder}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">Add files to your secure drive</p>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            type="button"
            title="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <form className="p-8">
          <div className="mb-6">
            <label className="block mb-2 text-sm font-semibold text-slate-700">Assignment Name</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Database Systems Project"
              className="block w-full border border-slate-300 px-4 py-2.5 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>

          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 ${isDragActive ? "border-blue-500 bg-blue-50" : "border-slate-300 hover:border-blue-400 bg-slate-50 hover:bg-slate-100/50"}`}
          >
            <input {...getInputProps()} />
            <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <svg className={`w-8 h-8 ${isDragActive ? 'text-blue-500' : 'text-blue-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
            </div>
            <p className="text-slate-700 font-medium text-lg">Click or drag files here</p>
            <p className="text-sm text-slate-500 mt-1">Supports multiple files and folders</p>
            <p className="text-xs text-slate-400 mt-4">Max 15MB per file • Excludes .exe and .sh</p>
          </div>

          {selectedFiles.length > 0 && (
            <div className="mt-6 border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-600">Selected Files</span>
                <span className="text-xs font-medium bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{selectedFiles.length}</span>
              </div>
              <ul className="max-h-48 overflow-y-auto divide-y divide-slate-100 bg-white">
                {selectedFiles.map((f, i) => (
                  <li key={i} className="flex justify-between items-center px-4 py-3 group hover:bg-slate-50">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <svg className="w-5 h-5 text-slate-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path></svg>
                      <span className="truncate text-sm text-slate-700">{f.path || f.name}</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeFile(i)}
                      className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-all shrink-0"
                      title="Remove file"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={isUploading || selectedFiles.length === 0 || !projectName}
              className={`flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white rounded-md transition-colors ${isUploading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'}`}
            >
              {isUploading && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isUploading ? uploadProgress : `Upload to Drive`}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Upload;