import { useState, useRef } from 'react';

export default function FileUpload({ onUploadSuccess }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFilesSelected = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const allowedExtensions = ['.pdf', '.txt', '.doc', '.docx'];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      return allowedExtensions.includes(fileExtension);
    });
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const handleFileInputChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      handleFilesSelected(files);
    }
    // Reset input to allow selecting same files again
    event.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFilesSelected(files);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    
    // Append all selected files
    selectedFiles.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('http://127.0.0.1:8000/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setSelectedFiles([]); // Clear selected files after successful upload
        onUploadSuccess();
        const successCount = result.uploaded_files?.length || 0;
        alert(`Successfully uploaded ${successCount} file(s)!`);
      } else {
        throw new Error(result.detail?.message || result.detail || 'Upload failed');
      }
    } catch (error) {
      alert(`Error uploading files: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const totalFilesSize = selectedFiles.reduce((total, file) => total + file.size, 0);
  const totalSizeMB = (totalFilesSize / (1024 * 1024)).toFixed(2);

  return (
    <div className="space-y-4">
      {/* Drag & Drop Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
          isDragOver 
            ? 'border-orange-500 bg-orange-50' 
            : 'border-gray-300 hover:border-orange-400 hover:bg-orange-25'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
        tabIndex={0}
      >
        <div className="space-y-2">
          <div className="text-orange-400">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-700">Drag & drop files here</p>
          <p className="text-xs text-gray-500">or click to browse</p>
          <p className="text-xs text-orange-500 font-medium">Select multiple files, then click Upload</p>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.txt,.doc,.docx"
        onChange={handleFileInputChange}
        multiple
        className="hidden"
      />

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
          <h4 className="text-sm font-semibold mb-3 text-gray-800">Selected Files ({selectedFiles.length}) - Ready to Upload</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm truncate flex-1 text-gray-700">{file.name}</span>
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(index);
                  }}
                  className="text-red-400 hover:text-red-500 transition-colors p-1 ml-2"
                  title="Remove file"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Total: {selectedFiles.length} file(s) • {totalSizeMB} MB
            </p>
          </div>
        </div>
      )}

      {/* Upload Button - Only shown when files are selected */}
      {selectedFiles.length > 0 && (
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className="w-full py-2 px-4 bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:bg-orange-300 transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm"
        >
          {isUploading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Uploading {selectedFiles.length} file(s)...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span>Upload {selectedFiles.length} File(s)</span>
            </>
          )}
        </button>
      )}

      <div className="text-center">
        <p className="text-xs text-gray-500">Supported formats: PDF, TXT, DOC, DOCX</p>
        <p className="text-xs text-gray-500 mt-1">Max file size: 10MB per file</p>
      </div>
    </div>
  );
}