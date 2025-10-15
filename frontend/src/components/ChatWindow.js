import { useState, useEffect, useRef } from 'react';

export default function ChatWindow({ messages, isLoading }) {
  const [showInfo, setShowInfo] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatAnswer = (text) => {
    if (!text) return text;
    
    // Convert markdown-style formatting to HTML
    return text
      .split('\n')
      .map((line, index) => {
        // Handle bullet points
        if (line.trim().startsWith('•')) {
          return `<div class="flex items-start space-x-2"><span class="text-orange-500 mt-1">•</span><span>${line.substring(1).trim()}</span></div>`;
        }
        // Handle numbered lists
        else if (line.match(/^\d+\./)) {
          return `<div class="flex items-start space-x-2"><span class="text-orange-500 font-semibold mt-1">${line.split('.')[0]}.</span><span>${line.substring(line.indexOf('.') + 1).trim()}</span></div>`;
        }
        // Handle bold text
        else if (line.includes('**')) {
          let formattedLine = line;
          formattedLine = formattedLine.replace(/\*\*(.*?)\*\*/g, '<strong class="text-orange-600">$1</strong>');
          return `<div>${formattedLine}</div>`;
        }
        // Handle source line
        else if (line.includes('Source:')) {
          return `<div class="mt-4 pt-3 border-t border-gray-200"><span class="text-sm text-gray-600 font-medium">${line}</span></div>`;
        }
        // Handle error messages
        else if (line.includes('❌')) {
          return `<div class="text-red-600 font-medium">${line}</div>`;
        }
        // Regular paragraphs
        else if (line.trim()) {
          return `<div class="mb-2">${line}</div>`;
        }
        return '<br/>';
      })
      .join('');
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 bg-gray-50 relative">
      {/* Info Button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full shadow-lg transition-all duration-200"
          title="About this AI"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>

      {/* Info Modal */}
      {showInfo && (
        <div className="absolute top-12 right-4 z-20 bg-white rounded-xl shadow-2xl border border-gray-200 p-6 max-w-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-gray-800">About Knowledge Base AI</h3>
            <button
              onClick={() => setShowInfo(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-3 text-sm text-gray-600">
            <div>
              <h4 className="font-semibold text-orange-600 mb-1">🤖 AI Technology</h4>
              <p>Powered by advanced RAG (Retrieval-Augmented Generation) with semantic search using sentence transformers.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-orange-600 mb-1">🔍 Smart Search</h4>
              <p>Uses semantic similarity to find the most relevant information across all your documents.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-orange-600 mb-1">📚 Document Support</h4>
              <p>Processes PDF, TXT, DOC, and DOCX files with intelligent text extraction.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-orange-600 mb-1">💡 Answer Quality</h4>
              <p>Provides synthesized, well-structured answers with proper source attribution.</p>
            </div>
            
            <div className="pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Built with FastAPI, Next.js, and state-of-the-art NLP models.
              </p>
            </div>
          </div>
        </div>
      )}

      {messages.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 max-w-md mx-auto">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-gray-700 mb-2">Welcome to Knowledge Base</p>
            <p className="text-gray-600">Upload documents and ask questions to get intelligent, synthesized answers!</p>
          </div>
        </div>
      )}
      
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.sender === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-3/4 rounded-2xl p-4 shadow-sm ${
              message.sender === 'user'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-800 border border-gray-200'
            }`}
          >
            {message.sender === 'user' ? (
              <div className="whitespace-pre-wrap">{message.text}</div>
            ) : (
              <div 
                className="whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: formatAnswer(message.text) }}
              />
            )}
          </div>
        </div>
      ))}
      
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-white rounded-2xl p-4 text-gray-800 border border-gray-200 shadow-sm">
            <div className="flex space-x-2 items-center">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              <span className="text-sm text-gray-600 ml-2">Analyzing documents...</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Invisible element for auto-scrolling */}
      <div ref={messagesEndRef} />
    </div>
  );
}