
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, ChatRole } from '../types';
import { Chat } from '@google/genai'; // Assuming Chat type is exported or available

interface ChatbotProps {
  chatSession: Chat | null;
  initialMessages?: ChatMessage[];
  onSendMessage: (chat: Chat, messageText: string) => AsyncIterable<string>; // Streams response
  userName?: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ chatSession, initialMessages = [], onSendMessage, userName = "Student" }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !chatSession || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: ChatRole.User,
      text: inputText,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    let currentBotMessageId = `model-${Date.now()}`;
    let accumulatedBotResponse = "";
    setMessages(prev => [...prev, { id: currentBotMessageId, role: ChatRole.Model, text: "...", timestamp: Date.now() }]);

    try {
      for await (const chunk of onSendMessage(chatSession, userMessage.text)) {
        accumulatedBotResponse += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === currentBotMessageId ? { ...msg, text: accumulatedBotResponse + "..." } : msg
        ));
      }
      setMessages(prev => prev.map(msg => 
        msg.id === currentBotMessageId ? { ...msg, text: accumulatedBotResponse } : msg
      ));
    } catch (error) {
      console.error("Chatbot stream error:", error);
      setMessages(prev => prev.map(msg => 
        msg.id === currentBotMessageId ? { ...msg, role: ChatRole.Error, text: "Sorry, I encountered an error. Please try again." } : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };
  
  const getBubbleBgColor = (role: ChatRole) => {
    switch (role) {
      case ChatRole.User: return "bg-primary text-white";
      case ChatRole.Model: return "bg-gray-200 text-neutral-dark";
      case ChatRole.Error: return "bg-red-100 text-red-700";
      default: return "bg-gray-100";
    }
  };

  return (
    <div className="flex flex-col h-[400px] sm:h-[500px] max-h-[70vh] bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
      <header className="bg-primary text-white p-3 sm:p-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-3.862 8.25-8.625 8.25S3.75 16.556 3.75 12C3.75 7.444 7.375 3.75 12.375 3.75S21 7.444 21 12z" />
        </svg>
        <h3 className="text-lg font-semibold">AI Mentor Chat</h3>
      </header>
      <div className="flex-grow p-3 sm:p-4 space-y-3 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === ChatRole.User ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] p-2.5 sm:p-3 rounded-xl shadow ${getBubbleBgColor(msg.role)}`}>
              <p className="text-sm sm:text-base whitespace-pre-wrap">{msg.text}</p>
              <p className={`text-xs mt-1 ${msg.role === ChatRole.User ? 'text-blue-200' : 'text-gray-500'} text-right`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="border-t border-gray-300 p-3 sm:p-4 bg-gray-50">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isLoading ? "Mentor is typing..." : "Ask a question..."}
            className="flex-grow px-3 py-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm sm:text-base"
            disabled={isLoading || !chatSession}
            aria-label="Your message to the AI Mentor"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim() || !chatSession}
            className="px-4 py-2.5 bg-primary text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
            aria-label="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
        {!chatSession && (
            <p className="text-xs text-red-500 text-center mt-2">Chat session not available. Please try reloading results.</p>
        )}
      </form>
    </div>
  );
};

export default Chatbot;
