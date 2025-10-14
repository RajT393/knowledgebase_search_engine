
"use client";

import { useState } from 'react';

export default function QuestionInput({ onSend, isLoading }) {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;
    onSend(question);
    setQuestion('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex items-center space-x-2">
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question about your documents..."
        className="flex-grow p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}
