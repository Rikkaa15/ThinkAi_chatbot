
export enum Sender {
  User = 'user',
  Bot = 'bot',
  System = 'system',
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: string;
  error?: boolean;
}

export enum ChatProvider {
  OpenAI = 'OpenAI',
  Dialogflow = 'Dialogflow',
  Gemini = 'Gemini',
}

export interface ChatSettings {
  provider: ChatProvider;
  model: string;
  temperature: number;
  systemPrompt: string;
}
