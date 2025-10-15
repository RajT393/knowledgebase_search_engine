"use client";

import { useState } from 'react';
import ChatWindow from '@/components/ChatWindow';
import QuestionInput from '@/components/QuestionInput';
import FileUpload from '@/components/FileUpload';
import FileList from '@/components/FileList';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fileRefreshTrigger, setFileRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    setFileRefreshTrigger(prev => prev + 1);
  };

  const handleSend = async (question) => {
    if (!question.trim()) return;

    const userMessage = { sender: 'user', text: question };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: question }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "An error occurred.");
      }

      const result = await response.json();
      const aiMessage = { sender: 'ai', text: result.answer };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      const errorMessage = { sender: 'ai', text: `Error: ${error.message}` };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-gradient-to-br from-orange-50 to-gray-100 text-gray-900">
      {/* Left Sidebar - File Management */}
      <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col shadow-lg">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-orange-600">
          <h1 className="text-2xl font-bold mb-2 text-white">Knowledge Base Search Engine</h1>
          <p className="text-orange-100 text-sm">By:Koteswara Raju</p>
        </div>
        
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">Document Management</h2>
            <FileUpload onUploadSuccess={handleUploadSuccess} />
          </div>
          
          <div>
            <h3 className="text-md font-semibold mb-3 text-gray-800">Uploaded Files</h3>
            <FileList refreshTrigger={fileRefreshTrigger} />
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">Knowledge Base Chat</h2>
          <p className="text-gray-600 text-sm">Ask questions about your uploaded documents</p>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-hidden bg-gray-50">
          <ChatWindow messages={messages} isLoading={isLoading} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4 bg-white shadow-lg">
          <QuestionInput onSend={handleSend} isLoading={isLoading} />
        </div>
      </div>
    </main>
  );
}