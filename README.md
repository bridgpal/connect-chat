# Connect Chat

A modern shopping assistant chatbot built with React and Mastra.ai that helps users find and explore products through natural conversation.

## Overview

Connect Chat is a powerful shopping assistant that leverages Mastra.ai's capabilities to provide context-aware conversations with memory persistence. It integrates with the [mastra-shopping](https://github.com/bridgpal/mastra-shopping) backend to deliver a seamless shopping experience.

## Features

- **Intelligent Shopping Assistant**: Natural language understanding for product queries
- **Context-Aware Conversations**: Maintains conversation history for more relevant responses
- **Memory Persistence**: Remembers user preferences and previous interactions
- **Client-Side Tools**: Handles product search functionality directly in the browser
- **Responsive Design**: Works on desktop and mobile devices
- **Modular Architecture**: Easy to extend and customize

## Tech Stack

- React + Vite
- TypeScript
- Mastra.ai SDK
- Tailwind CSS

## Project Structure

- `/src`
  - `/components` - React components including ChatMessage and ProductCard
  - `/data` - Product data source
  - `/utils` - Utility functions including chatbot logic
  - `/types` - TypeScript type definitions

## Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/bridgpal/connect-chat.git
   cd connect-chat
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
3. Update the Mastra.ai baseUrl:
   Open `src/App.tsx` and update the `baseUrl` to your Mastra.ai instance URL.

4. Run the development server:
   ```bash
   npm run dev
   ```

## Integration with Mastra.ai

Connect Chat uses Mastra.ai's client-side SDK to power the shopping assistant. Key integration points include:

- **Agent Generation**: Uses `agent.generate()` to process user messages
- **Memory Management**: Tracks conversation history for context-aware responses
- **Client-Side Tools**: Implements custom tools like `searchProductsTool` for in-browser functionality

## Customization

You can customize the chatbot by:

1. Modifying the product data in the `/data` directory
2. Adjusting the UI components in the `/components` directory
3. Extending the client-side tools in the agent configuration

## Backend Integration

This project works with the [mastra-shopping](https://github.com/bridgpal/mastra-shopping) backend, which provides additional product data and shopping functionality.

## License

MIT
