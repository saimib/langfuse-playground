import React from 'react';
import { AIMessage } from '../../../types';
import './AIResponse.css';

interface AIResponseProps {
  message?: AIMessage;
}

const AIResponse: React.FC<AIResponseProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="ai-response">
      <h3 className="section-title">AI Response</h3>
      <div className="response-container">
        <div className="ai-avatar">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor" />
            <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" fill="currentColor" />
          </svg>
        </div>
        <div className="response-content">
          <p className="response-text">Based on the template, here's your professional email:</p>
          <div className="email-response">
            <div className="email-header">
              <p><strong>Subject:</strong> Meeting Request - [Your Company] and [Client Company]</p>
            </div>
            <div className="email-body">
              <p>Dear [Client Name],</p>
              <p>I hope this email finds you well. I'm writing to request a meeting to discuss potential collaboration opportunities between our organizations.</p>
              <p>Would you be available for a 30-minute video call next week? I'm flexible and can work around your schedule.</p>
              <p>Looking forward to your response.</p>
              <p>Best regards,<br />[Your Name]</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIResponse;
