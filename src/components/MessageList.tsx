import { Message, Category } from '../types';
import { ChatMessage } from './ChatMessage';
import { LoadingIndicator } from './LoadingIndicator';
import { ErrorMessage } from './ErrorMessage';

interface MessageListProps {
  messages: Message[];
  error: string | null;
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onCategoryClick?: (category: Category) => void;
}

export function MessageList({ messages, error, isLoading, messagesEndRef, onCategoryClick }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
      {messages.map((message) => (
        <ChatMessage 
          key={message.id} 
          message={message} 
          onCategoryClick={onCategoryClick}
        />
      ))}
      {error && <ErrorMessage message={error} />}
      {isLoading && <LoadingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
}
