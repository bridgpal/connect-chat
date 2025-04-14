import OpenAI from 'openai';
import { Handler } from '@netlify/functions';
import { products } from '../../src/data/products';

interface Message {
    role: "system" | "user" | "assistant" | "function",
    content: string,
    name?: string
}

const functions = [
  {
    name: "show_products",
    description: "Display products based on search criteria",
    parameters: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description: "Category of products to show (optional)",
        },
        maxPrice: {
          type: "number",
          description: "Maximum price filter (optional)",
        },
        searchTerm: {
          type: "string",
          description: "Search term to filter products by title or description (optional)",
        }
      }
    }
  }
];

const functionHandlers = {
  show_products: ({ searchTerm, maxPrice }: { searchTerm?: string; maxPrice?: number }) => {
    let filteredProducts = products[0].allContentstackproducts.nodes;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.title.toLowerCase().includes(term)
      );
    }
    
    if (maxPrice) {
      filteredProducts = filteredProducts.filter(p => p.price <= maxPrice);
    }

    return {
      type: "products",
      products: filteredProducts.map(p => ({
        id: p.id,
        name: p.title,
        price: p.price,
        image: p.product_image.url,
        description: ""
      }))
    };
  }
};

export const handler: Handler = async (event) => {
    try {
        if (event.httpMethod !== 'POST') {
            return { statusCode: 405, body: 'Method Not Allowed' };
        }

        const openai = new OpenAI();

        if (!event.body) {
            throw new Error('No body provided');
        }

        console.log('Received event body:', event.body);
        const body = JSON.parse(event.body);
        console.log('Parsed body:', body);

        const messages = body.messages || [];
        console.log('Extracted messages:', messages);

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages,
            functions,
            function_call: 'auto'
        });

        const responseMessage = response.choices[0].message;

        if (responseMessage.function_call) {
            const functionName = responseMessage.function_call.name;
            const functionArgs = JSON.parse(responseMessage.function_call.arguments);
            const functionResult = functionHandlers[functionName](functionArgs);
            
            const updatedMessages = [
                ...messages,
                responseMessage,
                {
                    role: "function",
                    name: functionName,
                    content: JSON.stringify(functionResult)
                }
            ];

            const secondResponse = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: updatedMessages
            });

            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    response: secondResponse.choices[0].message.content,
                    products: functionResult.products
                })
            };
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                response: responseMessage.content
            })
        };
    } catch (error) {
        console.error('Error details:', error instanceof Error ? error.message : error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
}