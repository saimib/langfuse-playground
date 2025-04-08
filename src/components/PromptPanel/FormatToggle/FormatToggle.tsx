import React from 'react';
import './FormatToggle.css';

interface FormatToggleProps {
  format: 'formatted' | 'json';
  onToggle: () => void;
}

const FormatToggle: React.FC<FormatToggleProps> = ({ format, onToggle }) => {
  return (
    <div className="format-toggle">
      <button 
        className={`toggle-button ${format === 'formatted' ? 'active' : ''}`}
        onClick={format === 'json' ? onToggle : undefined}
      >
        Formatted
      </button>
      <button 
        className={`toggle-button ${format === 'json' ? 'active' : ''}`}
        onClick={format === 'formatted' ? onToggle : undefined}
      >
        JSON
      </button>
    </div>
  );
};

export default FormatToggle;
