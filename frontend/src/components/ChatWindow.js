
"use client";

import { useEffect, useRef } from 'react';

const ChatMessage = ({ sender, text }) => {
  const isUser = sender === 'user';
  return (
    <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-2xl p-3 rounded-lg ${isUser ? 'bg-blue-600' : 'bg-gray-700'}`}>
        <p className="text-white">{text}</p>
      </div>
    </div>
  );
};

export default function ChatWindow({ messages, isLoading }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-grow w-full bg-gray-900 rounded-lg p-4 overflow-y-auto space-y-4">
      {messages.map((msg, index) => (
        <ChatMessage key={index} sender={msg.sender} text={msg.text} />
      ))}
      {isLoading && (
        <div className="w-full flex justify-start">
          <div className="max-w-2xl p-3 rounded-lg bg-gray-700">
            <p className="text-white animate-pulse">Thinking...</p>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
