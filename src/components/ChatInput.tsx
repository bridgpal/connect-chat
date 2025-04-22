import { Send } from 'lucide-react';

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
}

export function ChatInput({ input, isLoading, onInputChange, onSend }: ChatInputProps) {
  return (
    <div className="border-t p-4 bg-white shrink-0">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && onSend()}
          placeholder="Type your message..."
          className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          onClick={onSend}
          disabled={isLoading}
          className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
