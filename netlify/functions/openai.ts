import OpenAI from 'openai';
import { Handler } from '@netlify/functions';
import { products } from '../../src/data/products';

// Define the expected response structure
type ChatResponse = {
  message: string;
  products: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
  }>;
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

    const body = JSON.parse(event.body);

    // Get all available products
    const allProducts = [
      ...products[0].allContentstackproducts.nodes.map(p => ({
        id: p.id,
        name: p.title || '',
        price: typeof p.price === 'number' ? p.price : 0,
        image: p.product_image?.url || '',
        description: ''
      })),
      ...products[0].allLegacyProduct.edges.map(e => ({
        id: e.node.id,
        name: e.node.title || '',
        price: typeof e.node.price === 'number' ? e.node.price : 0,
        image: e.node.image || '',
        description: e.node.description || e.node.title || ''
      }))
    ];

    const systemMessage = {
      role: "system",
      content: `You are a helpful shopping assistant. When users ask about products, search through this catalog and return relevant items. You can also answer follow-up questions about previously shown products.

${JSON.stringify(allProducts, null, 2)}

Return your response in this JSON format:
{
  "message": "A friendly detailed message addressing the user's query. For follow-ups, reference specific products by name.",
  "products": [
    {
      "id": "product_id",
      "name": "product name",
      "price": number,
      "image": "image url",
      "description": "product description"
    }
  ]
}

Always return valid JSON. If no products match, return an empty products array.
Sort products by relevance to the user's query.
For follow-up questions about specific products, refer to the previous messages to maintain context.
`
    };

    // Extract previously shown products from chat history
    const previousProducts = body.messages
      .filter(msg => msg.role === 'assistant')
      .flatMap(msg => {
        try {
          // First try to parse the content as JSON
          const content = JSON.parse(msg.content);
          return content.products || [];
        } catch {
          // If parsing fails, it means this was a regular message
          return [];
        }
      });

    // Filter out system messages from the history to avoid duplication
    const userAssistantMessages = body.messages.filter(msg => 
      msg.role === 'user' || msg.role === 'assistant'
    );

    const messages = [
      systemMessage,
      // Add context about previously shown products if any exist
      ...(previousProducts.length > 0 ? [{
        role: "system",
        content: `Previously shown products: ${JSON.stringify(previousProducts)}`
      }] : []),
      ...userAssistantMessages
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      temperature: 0.7,
      max_tokens: 1500
    });

    const responseMessage = completion.choices[0].message;
    const response = JSON.parse(responseMessage.content) as ChatResponse;

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: response.message,
        products: response.products
      })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};