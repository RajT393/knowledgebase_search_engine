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
    <main className="flex min-h-screen flex-col items-center bg-gray-800 text-white">
      <div className="w-full max-w-4xl flex-grow flex flex-col p-4">
        <div className="w-full my-4">
            <h1 className="text-3xl font-bold text-center mb-4">Knowledge Base Chat</h1>
            <FileUpload onUploadSuccess={handleUploadSuccess} />
            <FileList refreshTrigger={fileRefreshTrigger} />
        </div>
        
        <ChatWindow messages={messages} isLoading={isLoading} />

        <div className="w-full p-4 mt-auto">
          <QuestionInput onSend={handleSend} isLoading={isLoading} />
        </div>
      </div>
    </main>
  );
}