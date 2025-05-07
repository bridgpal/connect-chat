import { Message, Category } from '../types';
import { ProductCard } from './ProductCard';
import { CategoryCard } from './CategoryCard';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: Message;
  onCategoryClick?: (category: Category) => void;
}

export function ChatMessage({ message, onCategoryClick }: ChatMessageProps) {
  // Helper function to get categories array from the message
  const getCategories = (): Category[] => {
    if (!message.categories) return [];
    if (Array.isArray(message.categories)) return message.categories;
    
    const categoriesObj = message.categories as { categories?: any };
    if (categoriesObj.categories) {
      if (Array.isArray(categoriesObj.categories)) return categoriesObj.categories;
      const nestedCategories = categoriesObj.categories as { categories?: Category[] };
      if (nestedCategories.categories && Array.isArray(nestedCategories.categories)) {
        return nestedCategories.categories;
      }
    }
    return [];
  };

  const categories = getCategories();

  return (
    <div className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`${message.products || categories.length > 0 ? 'w-[800px]' : 'max-w-[80%]'} ${message.isBot ? 'bg-gray-200' : 'bg-blue-500 text-white'} rounded-lg p-2`}>
        <div className="mb-4">
          <ReactMarkdown
            components={{
              a: ({ ...props }) => (
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
        {categories.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {categories.map((category) => (
              <CategoryCard 
                key={category.id} 
                category={category} 
                onClick={onCategoryClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}