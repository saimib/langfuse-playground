import React from 'react';
import './ModelSelection.css';

interface ModelSelectionProps {
  model: string;
  onChange: (model: string) => void;
}

const ModelSelection: React.FC<ModelSelectionProps> = ({ model, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="model-selection">
      <label className="config-label" htmlFor="model-input">Model</label>
      <input
        id="model-input"
        className="model-input"
        type="text"
        value={model}
        onChange={handleChange}
        placeholder="Enter model name"
      />
    </div>
  );
};

export default ModelSelection;
