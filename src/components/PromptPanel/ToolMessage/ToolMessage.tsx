import React from 'react';
import { ToolMessage as ToolMessageType } from '../../../types';
import './ToolMessage.css';

interface ToolMessageProps {
  messages: ToolMessageType[];
}

const ToolMessage: React.FC<ToolMessageProps> = ({ messages }) => {
  if (messages.length === 0) return null;

  return (
    <div className="tool-messages">
      <h3 className="section-title">Tool Message</h3>
      <div className="messages-container">
        {messages.map((message) => (
          <div key={message.id} className="tool-message">
            <div className="tool-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="tool-content">
              <pre>{formatToolResponse(message.content)}</pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const formatToolResponse = (content: string): string => {
  try {
    // Try to parse and format JSON content
    const parsed = JSON.parse(content);
    return JSON.stringify(parsed, null, 2);
  } catch (e) {
    // If not valid JSON, return as is
    return content;
  }
};

export default ToolMessage;
