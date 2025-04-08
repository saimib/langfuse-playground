import React from 'react';
import { MetadataInfo } from '../../../types';
import './Metadata.css';

interface MetadataProps {
  metadata: MetadataInfo;
}

const Metadata: React.FC<MetadataProps> = ({ metadata }) => {
  return (
    <div className="metadata">
      <h3 className="metadata-title">Metadata</h3>
      <div className="metadata-item">
        <span className="metadata-label">Execution Time</span>
        <span className="metadata-value">{metadata.executionTime}</span>
      </div>
      <div className="metadata-item">
        <span className="metadata-label">Token Usage</span>
        <span className="metadata-value">
          Input: {metadata.tokenUsage.input} / Output: {metadata.tokenUsage.output}
        </span>
      </div>
      <div className="metadata-item">
        <span className="metadata-label">Cost</span>
        <span className="metadata-value">{metadata.cost}</span>
      </div>
    </div>
  );
};

export default Metadata;
