import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { ChatMessage } from './components/ChatMessage';
import { generateBotResponse } from './utils/chatbot';
import { Message } from './types';

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your product assistant. How can I help you today?",
      isBot: true,
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isBot: false,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Generate bot response
    const response = generateBotResponse(input);
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: response.text,
      isBot: true,
      products: response.products,
    };

    setTimeout(() => {
      setMessages(prev => [...prev, botMessage]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="h-[600px] flex flex-col">
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
          
          {/* Input area */}
          <div className="border-t p-4 bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
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