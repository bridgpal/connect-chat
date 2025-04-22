import { useState, useRef, useEffect } from 'react';
import { MastraClient } from '@mastra/client-js';
import { Message, Product, ProductResponse } from './types';
import { MessageList } from './components/MessageList';
import { ChatInput } from './components/ChatInput';

// Initialize the Mastra client
const mastraClient = new MastraClient({
  baseUrl: 'http://localhost:4111',
});

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
  const [error, setError] = useState<string | null>(null);

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
    setError(null);

    try {
      const agent = mastraClient.getAgent('shoppingAgent');
      
      // Convert chat history to Mastra message format
      const chatHistory = messages.map(msg => ({
        role: msg.isBot ? 'assistant' : 'user',
        content: msg.text
      }));
      
      // Add the current user message
      const mastraMessages = [
        ...chatHistory,
        { role: 'user', content: input }
      ];
      
      // Send the full conversation history to maintain context
      const response = await agent.generate({
        messages: mastraMessages
      });

      let foundProducts: Product[] = [];

      // Extract products from tool results first
      if (response.steps?.length) {
        for (const step of response.steps) {
          if (step.toolResults?.length) {
            for (const result of step.toolResults) {
              if (result.toolName === 'searchProductsTool' && result.result) {
                const productData = result.result as ProductResponse;
                foundProducts = productData.products || [];
                break;
              }
            }
          }
        }
      }

      // Add bot message with both text and products
      const botMessage: Message = {
        id: Date.now().toString(),
        text: response.text || String(response),
        isBot: true,
        products: foundProducts
      };
      
      setMessages(prev => [...prev, botMessage]);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: "I'm sorry, I encountered an error. Please try again.",
        isBot: true,
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
      <div className="flex-1 flex items-stretch p-4 overflow-hidden">
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg overflow-hidden max-w-5xl w-full mx-auto">
          <MessageList
            messages={messages}
            error={error}
            isLoading={isLoading}
            messagesEndRef={messagesEndRef}
          />
          <ChatInput
            input={input}
            isLoading={isLoading}
            onInputChange={setInput}
            onSend={handleSend}
          />
        </div>
      </div>
    </div>
  );
}

export default App;