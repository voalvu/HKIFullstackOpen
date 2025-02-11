import React, { useState } from 'react';
import { Visibility, Weather } from '../../../flight-diary/src/types';

interface WeatherInputProps {
    newDiary: {
      date: string;
      weather: Weather;
      visibility: Visibility;
      comment: string;
    };
    setNewDiary: React.Dispatch<React.SetStateAction<{
      date: string;
      weather: Weather;
      visibility: Visibility;
      comment: string;
    }>>;
    onSubmit: (weather: string) => void;
  }

const WeatherInput: React.FC<WeatherInputProps> = ({ onSubmit }) => {
    const [weather, setWeather] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onSubmit(weather);
        setWeather('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Weather:
                <input
                    type="text"
                    value={weather}
                    onChange={(e) => setWeather(e.target.value)}
                />
            </label>
            <button type="submit">Submit</button>
        </form>
    );
};

export default WeatherInput;