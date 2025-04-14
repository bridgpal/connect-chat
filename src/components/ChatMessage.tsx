import { Message } from '../types';
import { ProductCard } from './ProductCard';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} mb-4`}>
<div className={`${message.products ? 'w-[800px]' : 'max-w-[80%]'} ${message.isBot ? 'bg-gray-200' : 'bg-blue-500 text-white'} rounded-lg p-2`}>        <p className="mb-4">{message.text}</p> 
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