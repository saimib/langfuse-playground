import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ToolCall } from '../types';

// Mock function to simulate API call to AI service
const mockAIResponse = async (message: string): Promise<{
  content: string;
  toolCalls?: ToolCall[];
}> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, if the message contains specific keywords, return a tool call
  if (message.toLowerCase().includes('email') || message.toLowerCase().includes('meeting')) {
    return {
      content: "I'll help you draft a professional email. Let me check some email templates first.",
      toolCalls: [
        {
          id: uuidv4(),
          function: {
            name: 'get_email_template',
            params: {
              type: 'meeting_request',
              formality: 'professional'
            }
          }
        }
      ]
    };
  }
  
  // Default response
  return {
    content: "I'm here to help! What can I assist you with today?"
  };
};

// Mock function to simulate tool execution
const mockToolExecution = async (toolCall: ToolCall): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (toolCall.function.name === 'get_email_template') {
    return JSON.stringify({
      template_found: {
        subject: "Meeting Request - [Your Company] and [Client Company]",
        greeting: "Dear [Client Name],",
        body: "Professional meeting request template with customizable fields",
        closing: "Best regards,"
      }
    }, null, 2);
  }
  
  return "Tool execution completed successfully.";
};

export const useMessages = (
  addHumanMessage: (content: string) => any,
  addAIMessage: (content: string, toolCalls?: any) => any,
  addToolMessage: (content: string, toolCallId: string) => any
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentInput, setCurrentInput] = useState('');

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentInput(e.target.value);
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!currentInput.trim()) return;
    
    // Add human message
    addHumanMessage(currentInput);
    setCurrentInput('');
    setIsLoading(true);
    
    try {
      // Get AI response
      const aiResponse = await mockAIResponse(currentInput);
      const aiMessage = addAIMessage(aiResponse.content, aiResponse.toolCalls);
      
      // If there are tool calls, execute them
      if (aiResponse.toolCalls && aiResponse.toolCalls.length > 0) {
        for (const toolCall of aiResponse.toolCalls) {
          const toolResult = await mockToolExecution(toolCall);
          addToolMessage(toolResult, toolCall.id);
        }
        
        // Add final AI response after tool execution
        addAIMessage("Based on the template, here's your professional email:", undefined);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentInput, addHumanMessage, addAIMessage, addToolMessage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  return {
    currentInput,
    isLoading,
    handleInputChange,
    handleSendMessage,
    handleKeyDown
  };
};
