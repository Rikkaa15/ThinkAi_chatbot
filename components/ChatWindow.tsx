import React, { useEffect, useRef } from 'react';
import type { Message } from '../types';
import { Sender } from '../types';
import MessageBubble from './Message';

// --- (No changes to TypingIndicator or RetryIcon components) ---
interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onPromptClick: (promptText: string) => void; // <-- NEW PROP
}
// --- (The rest of the unchanged components remain here...) ---
const TypingIndicator: React.FC = () => ( <div className="flex items-center space-x-2 typing-indicator"><div className="w-2 h-2 rounded-full dot" style={{ background: '#22c55e' }}></div><div className="w-2 h-2 rounded-full dot" style={{ background: '#22c55e' }}></div><div className="w-2 h-2 rounded-full dot" style={{ background: '#22c55e' }}></div></div>);
const RetryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0M6.828 6.828A8.25 8.25 0 0118.49 18.49m-4.992-4.992v4.992m0 0h-4.992m4.992 0l-3.182-3.182a8.25 8.25 0 00-11.664 0" /></svg>);

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, error, onRetry, onPromptClick }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Define prompts in an array for cleaner rendering
  const examplePrompts = [
    "Coding & Debugging Help",
    "Career & Learning Guidance",
    "Academic & Concept Explanations",
    "Summarize key points"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto chat-window">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {messages.length === 0 && (
          <div className="welcome-container">
            <h2 className="welcome-heading">Good evening, User</h2>
            <h3 className="welcome-subheading">What can i help you with?</h3>
            <p className="prompt-info">Below are the example of prompt, you can write your own to start chatting with ThinkAI</p>
            
            <div className="prompt-grid">
              {/* Loop over the array to create buttons */}
              {examplePrompts.map((prompt) => (
                <button 
                  key={prompt}
                  className="prompt-button"
                  // When clicked, call the function passed from App.tsx
                  onClick={() => onPromptClick(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* --- (The rest of your component remains unchanged) --- */}
        {messages.map((msg, index) => (
          <MessageBubble key={msg.id} message={msg} onRetry={onRetry} />
        ))}
        {error && ( <div className="flex justify-center mb-4"><div className="bg-danger/20 border border-danger/50 rounded-xl p-4 max-w-md shadow-lg"><div className="flex items-start gap-3"><svg className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><div className="flex-1"><p className="text-danger text-sm font-medium mb-2">{error}</p><button onClick={onRetry} className="text-xs text-accent hover:text-accent-hover font-medium flex items-center gap-1"><RetryIcon className="w-4 h-4" />Retry</button></div></div></div></div>)}
        {isLoading && messages[messages.length - 1]?.sender === Sender.User && ( <div className="flex items-start gap-3 mb-4"><div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#e5e7eb' }}><svg className="w-5 h-5" style={{ color: '#22c55e' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg></div><div className="rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm" style={{ background: '#e5e7eb' }}><TypingIndicator /></div></div>)}
      </div>
    </div>
  );
};

export default ChatWindow;