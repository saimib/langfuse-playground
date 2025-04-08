import React from 'react';
import './TemperatureSlider.css';

interface TemperatureSliderProps {
  temperature: number;
  onChange: (temperature: number) => void;
}

const TemperatureSlider: React.FC<TemperatureSliderProps> = ({ temperature, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };

  return (
    <div className="temperature-slider">
      <div className="temperature-header">
        <label className="config-label" htmlFor="temperature-slider">Temperature</label>
        <span className="temperature-value">{temperature.toFixed(2)}</span>
      </div>
      <div className="slider-container">
        <input
          id="temperature-slider"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={temperature}
          onChange={handleChange}
          className="slider"
        />
        <div className="slider-values">
          <span>0</span>
          <span>1</span>
        </div>
      </div>
    </div>
  );
};

export default TemperatureSlider;
