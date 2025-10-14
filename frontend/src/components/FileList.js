
"use client";

import { useState, useEffect } from 'react';

export default function FileList({ refreshTrigger }) {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFiles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/documents');
      if (!response.ok) {
        throw new Error('Failed to fetch file list.');
      }
      const data = await response.json();
      setFiles(data.files);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [refreshTrigger]); // Re-fetch when refreshTrigger changes

  if (isLoading) return <p className="text-gray-400">Loading files...</p>;
  if (error) return <p className="text-red-400">Error: {error}</p>;
  if (files.length === 0) return <p className="text-gray-400">No files uploaded yet.</p>;

  return (
    <div className="mt-4 p-3 bg-gray-700 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Uploaded Files:</h3>
      <ul className="list-disc list-inside text-gray-300">
        {files.map((file, index) => (
          <li key={index}>{file}</li>
        ))}
      </ul>
    </div>
  );
}
