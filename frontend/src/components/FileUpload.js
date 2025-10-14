"use client";

import { useState } from 'react';

export default function FileUpload({ onUploadSuccess }) {
  const [files, setFiles] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFiles(e.target.files);
    setMessage('');
  };

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      setMessage('Please select files to upload.');
      return;
    }

    setIsUploading(true);
    setMessage('Uploading...');

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      setMessage(result.message || 'Upload successful!');
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      setMessage(error.message || 'An error occurred during upload.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full p-4 bg-gray-700 rounded-lg flex items-center justify-between">
        <input 
            type="file" 
            multiple 
            onChange={handleFileChange} 
            className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <button 
            onClick={handleUpload} 
            disabled={isUploading} 
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-500"
        >
            {isUploading ? 'Uploading...' : 'Upload'}
        </button>
        {message && <p className="text-sm ml-4">{message}</p>}
    </div>
  );
}