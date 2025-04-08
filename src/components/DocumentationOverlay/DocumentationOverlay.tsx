import React from 'react';
import './DocumentationOverlay.css';

interface DocumentationOverlayProps {
  showDocumentation: boolean;
  onClose: () => void;
}

const DocumentationOverlay: React.FC<DocumentationOverlayProps> = ({
  showDocumentation,
  onClose
}) => {
  if (!showDocumentation) return null;
  
  return (
    <div className="documentation-overlay">
      <div className="documentation-panel">
        <h2>Documentation</h2>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
        <div className="documentation-content">
          <h3>Getting Started</h3>
          <p>
            Welcome to the Prompt Playground! This tool allows you to experiment with different prompts
            and configurations for AI models.
          </p>
          <h3>Features</h3>
          <ul>
            <li>System prompts to set the AI's behavior</li>
            <li>Human and AI message history</li>
            <li>Tool calls and responses</li>
            <li>Model and provider selection</li>
            <li>Temperature adjustment</li>
            <li>Token usage and cost tracking</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DocumentationOverlay;
