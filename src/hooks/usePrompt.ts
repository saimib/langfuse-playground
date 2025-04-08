import { useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, PromptState, SystemPrompt } from '../types';

const initialSystemPrompt: SystemPrompt = {
  content: 'You are a helpful AI assistant. You help users with their questions and tasks in a friendly and professional manner. You always format your responses in a clear and organized way.'
};

const initialPromptState: PromptState = {
  systemPrompt: initialSystemPrompt,
  messages: [],
  format: 'formatted'
};

export const usePrompt = () => {
  const [promptState, setPromptState] = useState<PromptState>(initialPromptState);

  const resetPrompt = useCallback(() => {
    setPromptState(initialPromptState);
  }, []);

  const updateSystemPrompt = useCallback((content: string) => {
    setPromptState(prev => ({
      ...prev,
      systemPrompt: { content }
    }));
  }, []);

  const toggleFormat = useCallback(() => {
    setPromptState(prev => ({
      ...prev,
      format: prev.format === 'formatted' ? 'json' : 'formatted'
    }));
  }, []);

  const addMessage = useCallback((role: Message['role'], content: string, toolCalls?: any) => {
    const newMessage: Message = {
      id: uuidv4(),
      role,
      content,
      timestamp: new Date(),
      ...(toolCalls && { toolCalls })
    };

    setPromptState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }));

    return newMessage;
  }, []);

  const addHumanMessage = useCallback((content: string) => {
    return addMessage('human', content);
  }, [addMessage]);

  const addAIMessage = useCallback((content: string, toolCalls?: any) => {
    return addMessage('ai', content, toolCalls);
  }, [addMessage]);

  const addToolMessage = useCallback((content: string, toolCallId: string) => {
    const newMessage: Message = {
      id: uuidv4(),
      role: 'tool',
      content,
      timestamp: new Date(),
      toolCallId
    };

    setPromptState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }));

    return newMessage;
  }, []);

  // Function to import JSON data and update promptState
  const importFromJson = useCallback((jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      
      if (!Array.isArray(data)) {
        console.error('Invalid JSON format: expected an array');
        return;
      }
      
      // Extract system prompt
      const systemPromptMessage = data.find(msg => msg.role === 'system');
      const systemPrompt = systemPromptMessage ? { content: systemPromptMessage.content } : initialSystemPrompt;
      
      // Extract messages
      const messages: Message[] = data
        .filter(msg => msg.role !== 'system')
        .map(msg => {
          // Convert role names from OpenAI format to our format
          const role = msg.role === 'user' ? 'human' : 
                      msg.role === 'assistant' ? 'ai' : 
                      msg.role;
          
          return {
            id: uuidv4(),
            role: role as Message['role'],
            content: msg.content || '',
            timestamp: new Date(),
            ...(msg.toolCallId && { toolCallId: msg.toolCallId })
          };
        });
      
      setPromptState({
        systemPrompt,
        messages,
        format: 'formatted' // Switch to formatted view after import
      });
      
      return true;
    } catch (error) {
      console.error('Error importing JSON:', error);
      return false;
    }
  }, []);

  return {
    promptState,
    resetPrompt,
    updateSystemPrompt,
    toggleFormat,
    addHumanMessage,
    addAIMessage,
    addToolMessage,
    importFromJson
  };
};
