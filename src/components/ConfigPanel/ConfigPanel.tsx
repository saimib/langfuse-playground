import React from 'react';
import { ConfigState } from '../../types';
import ModelSelection from './ModelSelection';
import ProviderSelection from './ProviderSelection';
import APIKeyInput from './APIKeyInput';
import TemperatureSlider from './TemperatureSlider';
import Metadata from './Metadata';
import './ConfigPanel.css';

interface ConfigPanelProps {
  configState: ConfigState;
  updateModel: (model: string) => void;
  updateProvider: (provider: string) => void;
  updateApiKey: (apiKey: string) => void;
  updateTemperature: (temperature: number) => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({
  configState,
  updateModel,
  updateProvider,
  updateApiKey,
  updateTemperature
}) => {
  return (
    <div className="config-panel">
      <ModelSelection
        model={configState.modelConfig.model}
        onChange={updateModel}
      />
      <ProviderSelection
        provider={configState.modelConfig.provider}
        onChange={updateProvider}
      />
      <APIKeyInput
        apiKey={configState.modelConfig.apiKey}
        onChange={updateApiKey}
      />
      <TemperatureSlider
        temperature={configState.modelConfig.temperature}
        onChange={updateTemperature}
      />
      <Metadata metadata={configState.metadata} />
    </div>
  );
};

export default ConfigPanel;
