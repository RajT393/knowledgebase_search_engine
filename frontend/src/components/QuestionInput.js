import { useState } from 'react';

export default function QuestionInput({ onSend, isLoading }) {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim() && !isLoading) {
      onSend(question);
      setQuestion('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-4">
      <div className="flex-1 relative">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about your documents..."
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-gray-900 placeholder-gray-500 transition-all duration-200"
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        disabled={!question.trim() || isLoading}
        className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 shadow-sm"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Thinking...</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
            <span>Send</span>
          </>
        )}
      </button>
    </form>
  );
}