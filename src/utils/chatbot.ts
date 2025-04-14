import { Product } from '../types';

export async function generateBotResponse(userInput: string): Promise<{ text: string; products?: Product[] }> {
  try {
    const response = await fetch('/.netlify/functions/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "You are a helpful shopping assistant. Use the show_products function when users ask about products, and keep responses concise and friendly."
          },
          {
            role: "user",
            content: userInput
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
      products: data.products
    };

  } catch (error) {
    console.error('Error generating response:', error);
    return {
      text: "I'm sorry, I encountered an error. Please try again later."
    };
  }
}