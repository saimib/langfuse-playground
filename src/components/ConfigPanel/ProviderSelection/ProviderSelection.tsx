import React from "react";
import "./ProviderSelection.css";

interface ProviderSelectionProps {
  provider: string;
  onChange: (provider: string) => void;
}

const ProviderSelection: React.FC<ProviderSelectionProps> = ({
  provider,
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="provider-selection">
      <label className="config-label" htmlFor="provider-input">
        Provider
      </label>
      <input
        id="provider-input"
        className="provider-input"
        type="text"
        value={provider}
        onChange={handleChange}
        placeholder="Base URL"
      />
    </div>
  );
};

export default ProviderSelection;
