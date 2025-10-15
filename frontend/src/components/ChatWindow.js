export default function ChatWindow({ messages, isLoading }) {
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 bg-gray-900">
      {messages.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          <p>No messages yet. Start a conversation by asking a question!</p>
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
            className={`max-w-3/4 rounded-lg p-4 ${
              message.sender === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-white'
            }`}
          >
            {message.text}
          </div>
        </div>
      ))}
      
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-gray-700 rounded-lg p-4 text-white">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}