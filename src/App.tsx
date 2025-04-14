import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { ChatMessage } from './components/ChatMessage';
import { generateBotResponse } from './utils/chatbot';
import { Message } from './types';

function App() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your product assistant. How can I help you today?",
      isBot: true,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isBot: false,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Generate bot response
    try {
      // Pass full message history for context
      const chatHistory = messages.map(msg => ({
        role: msg.isBot ? 'assistant' : 'user',
        content: msg.isBot && msg.products ? 
          JSON.stringify({ message: msg.text, products: msg.products }) : 
          msg.text
      }));
      
      const response = await generateBotResponse(input, chatHistory);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        isBot: true,
        products: response.products,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting bot response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I encountered an error. Please try again.",
        isBot: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
      <div className="flex-1 flex items-stretch p-4 overflow-hidden">
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg overflow-hidden max-w-5xl w-full mx-auto">
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-200 rounded-lg p-4 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input area */}
          <div className="border-t p-4 bg-white shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;