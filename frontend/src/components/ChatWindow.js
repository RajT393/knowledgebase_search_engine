export default function ChatWindow({ messages, isLoading }) {
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 bg-gray-50">
      {messages.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 max-w-md mx-auto">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-gray-700 mb-2">Welcome to Knowledge Base</p>
            <p className="text-gray-600">Start a conversation by asking a question about your uploaded documents!</p>
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
            {message.text}
          </div>
        </div>
      ))}
      
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-white rounded-2xl p-4 text-gray-800 border border-gray-200 shadow-sm">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}