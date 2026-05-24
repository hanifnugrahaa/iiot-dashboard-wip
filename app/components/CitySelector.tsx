'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CITIES, type City } from '../constants/cities';

interface CitySelectorProps {
  currentCity: string;
  onCityChange: (cityName: string, lat: number, lon: number) => void;
  isLoading: boolean;
}

export const CitySelector: React.FC<CitySelectorProps> = ({
  currentCity,
  onCityChange,
  isLoading,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter cities based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCities([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = CITIES.filter(
      (city) =>
        city.name.toLowerCase().includes(query) ||
        city.country.toLowerCase().includes(query)
    ).slice(0, 8); // Limit to 8 results

    setFilteredCities(filtered);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCity = (city: City) => {
    setSearchQuery('');
    setIsOpen(false);
    onCityChange(city.name, city.lat, city.lon);
  };

  return (
    <div className="relative max-w-md">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Cari kota di seluruh dunia..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(searchQuery !== '')}
          disabled={isLoading}
          className={`w-full glass-sm px-4 py-3 rounded-xl transition-all duration-300 font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 placeholder-gray-400 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-text'
          }`}
        />
        {/* Search Icon */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
          🔍
        </div>
      </div>

      {/* Dropdown Results */}
      {isOpen && filteredCities.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 shadow-2xl rounded-xl overflow-hidden z-[100] max-h-64 overflow-y-auto"
        >
          {filteredCities.map((city, index) => (
            <button
              key={`${city.name}-${city.country}-${index}`}
              onClick={() => handleSelectCity(city)}
              className="w-full px-4 py-3 text-left hover:bg-blue-500/20 transition-colors border-b border-gray-600/20 last:border-b-0 text-white"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{city.name}</div>
                  <div className="text-sm text-gray-400">{city.country}</div>
                </div>
                <div className="text-xs text-gray-500">
                  {city.lat.toFixed(2)}°, {city.lon.toFixed(2)}°
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {isOpen && searchQuery && filteredCities.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 shadow-2xl rounded-xl px-4 py-3 text-gray-400 text-center z-[100]">
          Kota tidak ditemukan
        </div>
      )}

      {/* Current City Display */}
      <div 
        className={`mt-2 text-sm text-gray-400 transition-opacity duration-200 ${
          currentCity && !searchQuery ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        Lokasi saat ini: <span className="text-cyan-300 font-medium">{currentCity || '\u00A0'}</span>
      </div>
    </div>
  );
};
