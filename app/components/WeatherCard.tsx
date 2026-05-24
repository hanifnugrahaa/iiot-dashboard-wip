'use client';

import React from 'react';

interface WeatherData {
  city: string;
  current: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    weatherCode: number;
    weatherDescription: string;
    icon: string;
  };
}

interface WeatherCardProps {
  weather: WeatherData | null;
  isLoading: boolean;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather, isLoading }) => {
  if (isLoading) {
    return (
      <div className="glass p-8 rounded-3xl min-h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full"></div>
          </div>
          <p className="text-gray-300 mt-4">Memuat data cuaca...</p>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="glass p-8 rounded-3xl min-h-64 flex items-center justify-center">
        <p className="text-gray-400">Gagal memuat data cuaca</p>
      </div>
    );
  }

  return (
    <div className="glass p-8 rounded-3xl">
      {/* Header dengan Ikon dan Kota */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-3xl font-semibold text-white mb-1">{weather.city}</h2>
          <p className="text-gray-400 text-sm">{weather.current.weatherDescription}</p>
        </div>
        <div className="text-6xl">{weather.current.icon}</div>
      </div>

      {/* Suhu */}
      <div className="mb-8">
        <p className="text-7xl font-bold text-white mb-2">
          {weather.current.temperature}°C
        </p>
        <p className="text-gray-400">Suhu Saat Ini</p>
      </div>

      {/* Grid Data Cuaca */}
      <div className="grid grid-cols-2 gap-4">
        {/* Kelembapan */}
        <div className="glass-sm p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Kelembapan</p>
              <p className="text-2xl font-semibold text-blue-300">{weather.current.humidity}%</p>
            </div>
            <div className="text-4xl">💧</div>
          </div>
        </div>

        {/* Kecepatan Angin */}
        <div className="glass-sm p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Kecepatan Angin</p>
              <p className="text-2xl font-semibold text-cyan-300">{weather.current.windSpeed} km/h</p>
            </div>
            <div className="text-4xl">💨</div>
          </div>
        </div>
      </div>
    </div>
  );
};
