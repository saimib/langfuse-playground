import React from 'react';
import './Header.css';

interface HeaderProps {
  onDocumentationClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onDocumentationClick }) => {
  return (
    <header className="header">
      <div className="header-title">
        <svg className="lightning-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h1>Prompt Playground</h1>
      </div>
      <button className="documentation-button" onClick={onDocumentationClick}>
        <svg className="doc-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Documentation
      </button>
    </header>
  );
};

export default Header;
