import { useCallback, useEffect, useState } from 'react';
import { ConfigState, MetadataInfo, ModelConfig } from '../types';

// Function to get stored config from localStorage
const getStoredConfig = (): ModelConfig => {
  try {
    const storedModel = localStorage.getItem('modelConfig_model');
    const storedProvider = localStorage.getItem('modelConfig_provider');
    const storedTemperature = localStorage.getItem('modelConfig_temperature');
    
    return {
      model: storedModel || '',
      provider: storedProvider || '',
      apiKey: '',
      temperature: storedTemperature ? parseFloat(storedTemperature) : 0.5
    };
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return {
      model: '',
      provider: '',
      apiKey: '',
      temperature: 0.5
    };
  }
};

const initialMetadata: MetadataInfo = {
  executionTime: '0s',
  tokenUsage: {
    input: 0,
    output: 0
  },
  cost: '$0'
};

const initialConfigState: ConfigState = {
  modelConfig: getStoredConfig(),
  metadata: initialMetadata
};

export const useConfig = () => {
  const [configState, setConfigState] = useState<ConfigState>(initialConfigState);
  
  // Save to localStorage whenever modelConfig changes
  useEffect(() => {
    try {
      localStorage.setItem('modelConfig_model', configState.modelConfig.model);
      localStorage.setItem('modelConfig_provider', configState.modelConfig.provider);
      localStorage.setItem('modelConfig_temperature', configState.modelConfig.temperature.toString());
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [configState.modelConfig]);

  const updateModel = useCallback((model: string) => {
    setConfigState(prev => ({
      ...prev,
      modelConfig: {
        ...prev.modelConfig,
        model
      }
    }));
  }, []);

  const updateProvider = useCallback((provider: string) => {
    setConfigState(prev => ({
      ...prev,
      modelConfig: {
        ...prev.modelConfig,
        provider
      }
    }));
  }, []);

  const updateApiKey = useCallback((apiKey: string) => {
    setConfigState(prev => ({
      ...prev,
      modelConfig: {
        ...prev.modelConfig,
        apiKey
      }
    }));
  }, []);

  const updateTemperature = useCallback((temperature: number) => {
    setConfigState(prev => ({
      ...prev,
      modelConfig: {
        ...prev.modelConfig,
        temperature
      }
    }));
  }, []);

  const updateMetadata = useCallback((metadata: Partial<MetadataInfo>) => {
    setConfigState(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        ...metadata
      }
    }));
  }, []);

  return {
    configState,
    updateModel,
    updateProvider,
    updateApiKey,
    updateTemperature,
    updateMetadata
  };
};
