import { products } from '../data/products';
import { Product } from '../types';

export function findProducts(query: string): Product[] {
  const searchTerms = query.toLowerCase().split(' ');
  
  return products.filter(product => {
    const productText = `${product.name} ${product.description}`.toLowerCase();
    return searchTerms.some(term => productText.includes(term));
  });
}

export async function generateBotResponse(userInput: string): Promise<{ text: string; products?: Product[] }> {
  try {
    const matchedProducts = findProducts(userInput);
    
    const response = await fetch('/.netlify/functions/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "You are a helpful shopping assistant. Keep responses concise and friendly."
          },
          {
            role: "user",
            content: `User message: ${userInput}\n${matchedProducts.length > 0 ? 
              `Found these products: ${JSON.stringify(matchedProducts)}` : 
              'No specific products found.'}`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      text: data.message || "I'm sorry, I couldn't process that request.",
      ...(matchedProducts.length > 0 && { products: matchedProducts })
    };

  } catch (error) {
    console.error('Error generating response:', error);
    return {
      text: "I'm sorry, I encountered an error. Please try again later."
    };
  }
}