
import { useState, useCallback } from 'react';
import type { Message, ChatSettings } from '../types';
import { Sender } from '../types';
import { DEFAULT_SETTINGS } from '../constants';
import { streamChatResponse } from '../services/chatService';

const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<ChatSettings>(DEFAULT_SETTINGS);

  const sendMessage = useCallback(async (text: string) => {
    setError(null);
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text,
      sender: Sender.User,
      timestamp: new Date().toLocaleTimeString(),
    };
    
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setIsLoading(true);

    const botMessageId = `bot-${Date.now()}`;
    const botMessagePlaceholder: Message = {
      id: botMessageId,
      text: '',
      sender: Sender.Bot,
      timestamp: new Date().toLocaleTimeString(),
    };
    
    setMessages(prev => [...prev, botMessagePlaceholder]);

    await streamChatResponse(
      currentMessages,
      settings,
      (chunk) => {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === botMessageId ? { ...msg, text: msg.text + chunk } : msg
          )
        );
      },
      () => {
        setIsLoading(false);
      },
      (err) => {
        setError(err.message);
        setMessages(prev =>
          prev.map(msg =>
            msg.id === botMessageId ? { ...msg, error: true, text: `Error: ${err.message}` } : msg
          )
        );
        setIsLoading(false);
      }
    );
  }, [messages, settings]);

  const retryLastMessage = useCallback(() => {
     const lastUserMessage = [...messages].reverse().find(m => m.sender === Sender.User);
     if(lastUserMessage) {
        setMessages(prev => prev.filter(m => !(m.sender === Sender.Bot && m.error)));
        sendMessage(lastUserMessage.text);
     }
  }, [messages, sendMessage]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const summarizeChat = useCallback(() => {
    const summaryMessage: Message = {
        id: `system-${Date.now()}`,
        text: 'Conversation has been summarized by the user.',
        sender: Sender.System,
        timestamp: new Date().toLocaleTimeString(),
    };
    setMessages(prev => [...prev, summaryMessage]);
    // In a real app, you would call a backend endpoint to summarize `messages`
  }, []);

  const updateSettings = useCallback((newSettings: Partial<ChatSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return {
    messages,
    isLoading,
    error,
    settings,
    sendMessage,
    clearChat,
    summarizeChat,
    updateSettings,
    retryLastMessage,
  };
};

export default useChat;
