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

  // Extract the folder we navigated from, default to DBMS if direct hit
  const subjectFolder = location.state?.folder || "DBMS";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    if (fileRejections.length > 0) {
      alert("Some files were rejected. Ensure they are under 15MB and not .exe/.sh files.");
    }

    // Filter out node_modules and .class files
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
    maxSize: 15 * 1024 * 1024, // 15MB limit
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

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      navigate("/");
      return;
    }

    setIsUploading(true);
    setUploadProgress("Zipping files locally...");

    try {
      // 1. Zip the files using JSZip
      const zip = new JSZip();
      selectedFiles.forEach(file => {
        const path = file.path || file.name;
        // removing leading slash if any
        const cleanPath = path.startsWith("/") ? path.substring(1) : path;
        zip.file(cleanPath, file);
      });

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const zipFileName = `${projectName.replace(/\s+/g, "_")}_Submission.zip`;

      setUploadProgress("Requesting secure upload link...");

      // 2. Request Pre-signed URL from FastAPI
      const presignResponse = await fetch(`${import.meta.env.VITE_API_URL}/files/presign`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          file_name: zipFileName,
          content_type: "application/zip",
          size: zipBlob.size
        })
      });

      if (!presignResponse.ok) {
        throw new Error("Failed to get secure upload link");
      }

      const { upload_url, file_path } = await presignResponse.json();

      setUploadProgress("Uploading to Cloud...");

      // 3. Upload directly to Cloud Storage using the Pre-signed URL
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

      // Generate the public B2 download URL manually
      const b2Endpoint = import.meta.env.VITE_B2_ENDPOINT_URL || "https://s3.us-west-004.backblazeb2.com";
      const bucketName = import.meta.env.VITE_B2_BUCKET_NAME || "your-bucket-name";
      const downloadUrl = `${b2Endpoint}/${bucketName}/${encodeURIComponent(file_path)}`;

      setUploadProgress("Saving metadata...");

      // 4. Save metadata to backend (ADDED subject_folder and object_key)
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
          object_key: file_path
        })
      });

      if (saveResponse.ok) {
        navigate('/predict'); // Redirect to dashboard
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
    <section className="bg-white">
      <div className="container flex items-center justify-center min-h-screen px-6 mx-auto pt-24">
        <form className="w-full shadow-lg shadow-gray-200 border border-stone-200 bg-amber-50/30 p-9 rounded-3xl max-w-xl">
          <div className="flex flex-row justify-between items-center mt-3 mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Upload to {subjectFolder}
            </h1>
            <button
              onClick={() => navigate(-1)}
              className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
              type="button"
            >
              Go Back
            </button>
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-700">Assignment Name</label>
            <input
              required
              type="text"
              placeholder="e.g. Assignment 1"
              className="block w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors duration-300 ${isDragActive ? "border-emerald-500 bg-emerald-50/50" : "border-gray-300 hover:border-emerald-400 bg-white"}`}
          >
            <input {...getInputProps()} />
            <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            <p className="text-gray-600 font-medium">Drag & drop raw files here, or click to select files</p>
            <p className="text-xs text-gray-400 mt-2">Max 15MB per file. .exe and .sh are strictly prohibited.</p>
          </div>

          {selectedFiles.length > 0 && (
            <div className="mt-6 max-h-48 overflow-y-auto bg-white border border-gray-100 rounded-xl p-4 shadow-inner">
              <p className="text-sm font-semibold text-gray-700 mb-3 border-b pb-2">Selected Files ({selectedFiles.length})</p>
              <ul className="space-y-2">
                {selectedFiles.map((f, i) => (
                  <li key={i} className="flex justify-between items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                    <span className="truncate max-w-[80%]">{f.path || f.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8">
            <button
              onClick={handleUpload}
              disabled={isUploading || selectedFiles.length === 0 || !projectName}
              className={`w-full px-6 py-4 text-sm font-bold tracking-wide text-white transition-all duration-300 rounded-xl shadow-lg focus:outline-none focus:ring focus:ring-emerald-300 focus:ring-opacity-50 ${isUploading ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-200'}`}
            >
              {isUploading ? uploadProgress : `Zip & Upload to ${subjectFolder}`}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Upload;
