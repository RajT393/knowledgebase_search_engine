import { useState, useEffect } from 'react';

export default function FileList({ refreshTrigger }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, [refreshTrigger]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://127.0.0.1:8000/api/files');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setFiles(data.files || []);
      
    } catch (error) {
      console.error('Error fetching files:', error);
      setError(`Failed to load files: ${error.message}`);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (filename) => {
    if (confirm(`Are you sure you want to delete "${filename}"?`)) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/files/${encodeURIComponent(filename)}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Remove the file from the local state immediately
          setFiles(prev => prev.filter(file => file !== filename));
          alert('File deleted successfully!');
          // Refresh the list to ensure consistency
          fetchFiles();
        } else {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Delete failed');
        }
      } catch (error) {
        alert('Error deleting file: ' + error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
        <span className="ml-2 text-sm text-gray-600">Loading files...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500 text-sm">{error}</p>
        <button 
          onClick={fetchFiles}
          className="mt-2 text-xs text-orange-500 hover:text-orange-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2 h-full overflow-y-auto">
      {files.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">No files uploaded yet</p>
        </div>
      ) : (
        files.map((file, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm truncate flex-1 text-gray-700" title={file}>{file}</span>
            </div>
            <button
              onClick={() => handleDeleteFile(file)}
              className="text-red-400 hover:text-red-500 transition-colors p-1 ml-2 flex-shrink-0"
              title="Delete file"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))
      )}
    </div>
  );
}