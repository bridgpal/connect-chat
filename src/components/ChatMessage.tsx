import { Message } from '../types';
import { ProductCard } from './ProductCard';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`${message.products ? 'w-[800px]' : 'max-w-[80%]'} ${message.isBot ? 'bg-gray-200' : 'bg-blue-500 text-white'} rounded-lg p-2`}>
        <div className="mb-4">
          <ReactMarkdown
            components={{
              a: ({ node, ...props }) => (
                <a
                  {...props}
                  className="underline text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              )
            }}
          >
            {message.text}
          </ReactMarkdown>
        </div>
        {message.products && (
          <div className="grid grid-cols-3 border-slate-950">
            {message.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}