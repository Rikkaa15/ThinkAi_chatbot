import React, { useRef, useEffect } from 'react';

// The props have been updated to make this a controlled component
interface ChatInputProps {
  value: string; // The current text to display
  onChange: (newText: string) => void; // How to change the text
  onSend: (text: string) => void; // How to send the message
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSend, isLoading }) => {
  // We no longer need the local `text` state here.
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isLoading) {
      onSend(value);
      // We no longer call setText('') here, App.tsx handles it.
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  // This effect adjusts the textarea height and now depends on the `value` prop
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${scrollHeight}px`;
    }
  }, [value]);

  return (
    <div className="chat-input-area">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <textarea
              ref={textareaRef}
              value={value} // Use the value from props
              onChange={(e) => onChange(e.target.value)} // Use the onChange handler from props
              onKeyDown={handleKeyDown}
              placeholder="How can ThinkAI help you today?"
              className="flex-1 resize-none bg-transparent focus:ring-0" 
              rows={1}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !value.trim()}
              className="send-button"
              aria-label="Send message"
            >
              →
            </button>
          </div>
        </form>
        <div className="input-tags-container">
          <button className="input-tag">ThinkAI</button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;