import React from 'react';
import { AIMessage, ToolCall } from '../../../types';
import './AIMessages.css';

interface AIMessagesProps {
  messages: AIMessage[];
}

const AIMessages: React.FC<AIMessagesProps> = ({ messages }) => {
  if (messages.length === 0) return null;

  return (
    <div className="ai-messages">
      <h3 className="section-title">AI Messages with Tool Call</h3>
      <div className="messages-container">
        {messages.map((message) => (
          <div key={message.id} className="ai-message">
            <div className="ai-avatar">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor" />
                <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" fill="currentColor" />
              </svg>
            </div>
            <div className="ai-content">
              <p>{message.content}</p>
              
              {message.toolCalls && message.toolCalls.length > 0 && (
                <div className="tool-call">
                  <div className="tool-call-header">Tool Call:</div>
                  <div className="tool-call-content">
                    <pre>
                      {formatToolCall(message.toolCalls[0])}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const formatToolCall = (toolCall: ToolCall): string => {
  return `Function: ${toolCall.function.name}
Params: {
  ${Object.entries(toolCall.function.params)
    .map(([key, value]) => `"${key}": "${value}"`)
    .join(',\n  ')}
}`;
};

export default AIMessages;
