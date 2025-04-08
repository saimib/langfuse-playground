import React from 'react';
import './SystemPrompts.css';

interface SystemPromptsProps {
  content: string;
  onChange: (content: string) => void;
}

const SystemPrompts: React.FC<SystemPromptsProps> = ({ content, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="system-prompts">
      <h3 className="section-title">System Prompts</h3>
      <textarea
        className="system-textarea"
        value={content}
        onChange={handleChange}
        placeholder="Enter system instructions here..."
      />
    </div>
  );
};

export default SystemPrompts;
