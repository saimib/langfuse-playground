export interface Message {
  id: string;
  role: 'system' | 'human' | 'ai' | 'tool';
  content: string;
  timestamp: Date;
  toolCallId?: string; // Optional property for tool messages
  toolCalls?: ToolCall[]; // Optional property for AI messages with tool calls
}

export interface SystemPrompt {
  content: string;
}

export interface HumanMessage extends Message {
  role: 'human';
}

export interface AIMessage extends Message {
  role: 'ai';
  toolCalls?: ToolCall[];
}

export interface ToolCall {
  id: string;
  function: {
    name: string;
    params: Record<string, any>;
  };
}

export interface ToolMessage extends Message {
  role: 'tool';
  toolCallId: string;
  content: string;
}

export interface ModelConfig {
  model: string;
  provider: string;
  apiKey: string;
  temperature: number;
}

export interface MetadataInfo {
  executionTime: string;
  tokenUsage: {
    input: number;
    output: number;
  };
  cost: string;
}

export interface PromptState {
  systemPrompt: SystemPrompt;
  messages: Message[];
  format: 'formatted' | 'json';
}

export interface ConfigState {
  modelConfig: ModelConfig;
  metadata: MetadataInfo;
}
