import React, { useState } from 'react';
import Header from './components/Header';
import SettingsPanel from './components/SettingsPanel';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import useChat from './hooks/useChat';
import type { ChatSettings } from './types';

const App: React.FC = () => {
  const {
    messages,
    isLoading,
    error,
    settings,
    sendMessage,
    clearChat,
    summarizeChat,
    updateSettings,
    retryLastMessage,
  } = useChat();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [currentInput, setCurrentInput] = useState('');

  const handlePromptClick = (promptText: string) => {
    setCurrentInput(promptText);
  };
  
  const handleSend = (message: string) => {
    sendMessage(message);
    setCurrentInput('');
  };

  const handleUpdateSettings = (newSettings: Partial<ChatSettings>) => {
    updateSettings(newSettings);
  };

  return (
    <div 
      className="flex h-screen w-full flex-col font-sans text-text-primary bg-primary overflow-hidden"
    >
      <Header onToggleSettings={() => setIsSettingsOpen(!isSettingsOpen)} />
      <div 
        className="flex flex-1 overflow-hidden min-h-0"
      >
        <SettingsPanel
          isOpen={isSettingsOpen}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onClearChat={clearChat}
          onSummarizeChat={summarizeChat}
          // FIX: Corrected the typo from setIsSettings-Open to setIsSettingsOpen
          onClose={() => setIsSettingsOpen(false)}
          messages={messages}
        />
        <main 
          className={`flex-1 flex flex-col transition-all duration-300 ease-in-out min-h-0 ${isSettingsOpen ? 'md:ml-80' : 'ml-0'}`}
        >
          <ChatWindow 
            messages={messages} 
            isLoading={isLoading} 
            error={error} 
            onRetry={retryLastMessage}
            onPromptClick={handlePromptClick} 
          />
          <ChatInput 
            value={currentInput}
            onChange={setCurrentInput}
            onSend={handleSend} 
            isLoading={isLoading} 
          />
        </main>
      </div>
    </div>
  );
};

export default App;