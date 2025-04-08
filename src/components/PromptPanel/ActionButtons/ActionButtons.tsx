import React from 'react';
import './ActionButtons.css';

interface ActionButtonsProps {
  onReset: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onReset }) => {
  return (
    <div className="action-buttons">
      <button className="reset-button" onClick={onReset}>
        <svg className="reset-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 3v5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Reset Prompt
      </button>
    </div>
  );
};

export default ActionButtons;
