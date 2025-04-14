import { Message } from '../types';
import { ProductCard } from './ProductCard';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`max-w-[70%] ${message.isBot ? 'bg-gray-200' : 'bg-blue-500 text-white'} rounded-lg p-3`}>
        <p>{message.text}</p>
        {message.products && (
          <div className="grid grid-cols-1 gap-4 mt-4">
            {message.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}