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
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question about your documents..."
        className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={!question.trim() || isLoading}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}