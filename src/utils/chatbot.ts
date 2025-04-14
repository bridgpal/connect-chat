import { products } from '../data/products';
import { Product } from '../types';

export function findProducts(query: string): Product[] {
  const searchTerms = query.toLowerCase().split(' ');
  
  return products.filter(product => {
    const productText = `${product.name} ${product.description}`.toLowerCase();
    return searchTerms.some(term => productText.includes(term));
  });
}

export function generateBotResponse(userInput: string): { text: string; products?: Product[] } {
  const input = userInput.toLowerCase();
  
  if (input.includes('hello') || input.includes('hi')) {
    return {
      text: "Hello! I can help you find products. What are you looking for?",
    };
  }

  const matchedProducts = findProducts(input);
  
  if (matchedProducts.length > 0) {
    return {
      text: "Here are some products that might interest you:",
      products: matchedProducts,
    };
  }

  return {
    text: "I couldn't find any matching products. Could you try describing what you're looking for differently?",
  };
}