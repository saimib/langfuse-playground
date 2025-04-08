import React from 'react';
import { HumanMessage } from '../../../types';
import './HumanMessages.css';

interface HumanMessagesProps {
  messages: HumanMessage[];
}

const HumanMessages: React.FC<HumanMessagesProps> = ({ messages }) => {
  if (messages.length === 0) return null;

  return (
    <div className="human-messages">
      <h3 className="section-title">Human Messages</h3>
      <div className="messages-container">
        {messages.map((message) => (
          <div key={message.id} className="human-message">
            <p>{message.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HumanMessages;
