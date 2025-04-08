import React, { useState } from 'react';
import './APIKeyInput.css';

interface APIKeyInputProps {
  apiKey: string;
  onChange: (apiKey: string) => void;
}

const APIKeyInput: React.FC<APIKeyInputProps> = ({ apiKey, onChange }) => {
  const [showKey, setShowKey] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const toggleShowKey = () => {
    setShowKey(!showKey);
  };

  return (
    <div className="api-key-input">
      <label className="config-label" htmlFor="api-key">API Key</label>
      <div className="key-input-container">
        <input
          id="api-key"
          className="key-input"
          type={showKey ? 'text' : 'password'}
          value={apiKey}
          onChange={handleChange}
          placeholder="Enter your API key"
        />
        <button
          type="button"
          className="toggle-visibility"
          onClick={toggleShowKey}
          aria-label={showKey ? 'Hide API key' : 'Show API key'}
        >
          {showKey ? (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default APIKeyInput;
