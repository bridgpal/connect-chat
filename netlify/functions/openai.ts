import OpenAI from 'openai';
import { Handler } from '@netlify/functions';

interface Message {
    role: 'assistant' | 'user' | 'system'
    content: string
}

export const handler: Handler = async (event) => {
    try {
        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
                body: 'Method Not Allowed'
            };
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        console.log('Received event body:', event.body);
        const body = JSON.parse(event.body || '{}');
        console.log('Parsed body:', body);
        const messages: Message[] = body.messages || [];
        console.log('Extracted messages:', messages);

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages
        });

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: completion.choices[0].message.content
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