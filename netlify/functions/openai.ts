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
        searchTerm: {
          type: "string",
          description: "Search term to filter products by title or description"
        },
        maxPrice: {
          type: "number",
          description: "Maximum price filter (optional)"
        }
      }
    }
  }
];

const functionHandlers = {
  show_products: ({ searchTerm, maxPrice }: { searchTerm?: string; maxPrice?: number }) => {
    // Get all products
    const allProducts = [
      ...products[0].allContentstackproducts.nodes.map(p => ({
        id: p.id,
        title: p.title || '',
        price: typeof p.price === 'number' ? p.price : 0,
        image: p.product_image?.url || '',
        description: ''
      })),
      ...products[0].allLegacyProduct.edges.map(e => ({
        id: e.node.id,
        title: e.node.title || '',
        price: typeof e.node.price === 'number' ? e.node.price : 0,
        image: e.node.image || '',
        description: e.node.description || ''
      }))
    ];

    let filteredProducts = allProducts;

    // Filter by search term
    if (searchTerm) {
      const terms = searchTerm.toLowerCase().split(/\s+/);
      filteredProducts = filteredProducts.filter(p => {
        const searchText = `${p.title} ${p.description}`.toLowerCase();
        // Match if ANY search term is found (more flexible)
        return terms.some(term => searchText.includes(term));
      });
    }

    // Filter by price
    if (maxPrice) {
      filteredProducts = filteredProducts.filter(p => p.price <= maxPrice);
    }

    // Map and sort by relevance
    const mappedProducts = filteredProducts.map(p => ({
      id: p.id,
      name: p.title,
      price: p.price,
      image: p.image,
      description: p.description || p.title
    }));

    if (searchTerm) {
      const terms = searchTerm.toLowerCase().split(/\s+/);
      mappedProducts.sort((a, b) => {
        const aScore = terms.reduce((score, term) => {
          const nameMatches = (a.name.toLowerCase().match(new RegExp(term, 'g')) || []).length;
          const descMatches = (a.description.toLowerCase().match(new RegExp(term, 'g')) || []).length;
          return score + (nameMatches * 2) + descMatches;
        }, 0);
        const bScore = terms.reduce((score, term) => {
          const nameMatches = (b.name.toLowerCase().match(new RegExp(term, 'g')) || []).length;
          const descMatches = (b.description.toLowerCase().match(new RegExp(term, 'g')) || []).length;
          return score + (nameMatches * 2) + descMatches;
        }, 0);
        return bScore - aScore;
      });
    }

    return {
      type: "products",
      products: mappedProducts
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

        const messages = [
            {
                role: "system",
                content: "You are a helpful shopping assistant. Use the show_products function when users ask about products, using the searchTerm parameter to find relevant products. Keep responses concise and friendly. DO NOT include markdown images or links in your responses as products will be displayed separately. Just describe the products in text. When searching, be creative with the search terms to find the most relevant products."
            },
            ...(body.messages || [])
        ];
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