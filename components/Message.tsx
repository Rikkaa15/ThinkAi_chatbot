
import React from 'react';
import type { Message } from '../types';
import { Sender } from '../types';

interface MessageBubbleProps {
  message: Message;
  onRetry: () => void;
}

const RetryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0M6.828 6.828A8.25 8.25 0 0118.49 18.49m-4.992-4.992v4.992m0 0h-4.992m4.992 0l-3.182-3.182a8.25 8.25 0 00-11.664 0" />
    </svg>
);


const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onRetry }) => {
  const isUser = message.sender === Sender.User;
  const isBot = message.sender === Sender.Bot;
  const isSystem = message.sender === Sender.System;

  if (isSystem) {
    return (
      <div className="flex justify-center my-6">
        <div className="text-center text-xs text-text-secondary italic px-4 py-2 bg-secondary/50 rounded-full max-w-md">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-3 mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#e5e7eb' }}>
          <svg className="w-5 h-5" style={{ color: '#22c55e' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
      )}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[80%] md:max-w-[70%] lg:max-w-[60%]`}>
        <div
          className={`rounded-2xl px-5 py-4 message-bubble ${
            isUser
              ? 'text-white rounded-br-sm'
              : `rounded-bl-sm ${message.error ? 'border border-danger/50' : ''}`
          }`}
          style={{
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            background: isUser 
              ? 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)'
              : '#e5e7eb',
            color: isUser ? '#ffffff' : '#1f2937',
            boxShadow: isUser 
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              : '0 1px 2px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div className="message-content break-words">
            {message.text.split('```').map((part, index) => {
              if (index % 2 === 1) {
                return (
                  <pre
                    key={index}
                    className={`my-2 p-3 rounded-lg overflow-x-auto text-sm`}
                    style={{
                      background: isUser ? 'rgba(255, 255, 255, 0.2)' : '#f9fafb',
                      color: isUser ? '#ffffff' : '#1f2937',
                    }}
                  >
                    <code>{part.trim()}</code>
                  </pre>
                );
              }
              return (
                <div
                  key={index}
                  className="message-text"
                  dangerouslySetInnerHTML={{
                    __html: part
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\n/g, '<br>'),
                  }}
                />
              );
            })}
          </div>
          {message.error && (
            <div className="mt-3 pt-3 border-t border-danger/30 flex items-center justify-end">
              <button
                onClick={onRetry}
                className="text-xs flex items-center gap-1.5 px-2 py-1 rounded transition-colors"
                style={{
                  color: '#22c55e',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(34, 197, 94, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <RetryIcon className="w-4 h-4" />
                Retry
              </button>
            </div>
          )}
        </div>
        {message.timestamp && (
          <span className={`text-xs text-text-secondary mt-1 px-2 ${isUser ? 'text-right' : 'text-left'}`}>
            {message.timestamp}
          </span>
        )}
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#e5e7eb', color: '#1f2937', fontWeight: 600, fontSize: '14px' }}>
          M
        </div>
      )}
    </div>
  );
};

export default MessageBubble;