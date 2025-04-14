# Product Assistant Chat

An interactive chatbot that helps users find and explore products using OpenAI's function calling capabilities.

## Features

- Real-time chat interface with loading indicators
- Product search and filtering capabilities:
  - Search by title/description
  - Filter by maximum price
  - Filter by category
- Beautiful product card display
- Responsive design
- Seamless integration with OpenAI's API

## Tech Stack

- React
- TypeScript
- Netlify Functions (for serverless backend)
- OpenAI API
- Tailwind CSS
- Lucide React (for icons)

## Project Structure

- `/src`
  - `/components` - React components including ChatMessage and ProductCard
  - `/data` - Product data source
  - `/utils` - Utility functions including chatbot logic
  - `/types` - TypeScript type definitions
- `/netlify/functions` - Serverless function handling OpenAI API integration

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file with:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

- `OPENAI_API_KEY` - Your OpenAI API key

## Development

The chatbot uses OpenAI's function calling to process user queries and return relevant products. The main components are:

- App.tsx - Main chat interface
- openai.ts - OpenAI function calling implementation
- ProductCard.tsx - Product display component
- chatbot.ts - Chat logic and API integration

## License

MIT
