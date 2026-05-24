'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    ).slice(0, 6);

    setFilteredCities(filtered);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCity = (city: City) => {
    setSearchQuery('');
    setIsOpen(false);
    setIsFocused(false);
    onCityChange(city.name, city.lat, city.lon);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      filter: 'blur(0px)',
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 24,
        staggerChildren: 0.05
      } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: -5,
      filter: 'blur(10px)',
      transition: { duration: 0.2 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300 } }
  };

  return (
    <div className="relative max-w-md w-full z-50">
      <motion.div 
        className="relative group"
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          animate={{
            boxShadow: isFocused ? '0 0 0 4px rgba(134, 182, 246, 0.3)' : '0 2px 10px rgba(0,0,0,0.02)',
          }}
          transition={{ duration: 0.2 }}
          className="rounded-[20px]"
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Cari kota..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => {
              setIsOpen(searchQuery !== '');
              setIsFocused(true);
            }}
            onBlur={() => setIsFocused(false)}
            disabled={isLoading}
            className={`w-full glass-sm px-5 py-4 rounded-[20px] transition-all duration-300 font-medium text-brand-text outline-none placeholder-brand-text/40 shadow-sm ${
              isLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-text'
            }`}
          />
        </motion.div>
        <motion.div 
          className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-accent text-xl pointer-events-none"
          animate={{ 
            scale: isFocused ? 1.1 : 1,
            rotate: isFocused ? 5 : 0 
          }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          🔍
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isOpen && filteredCities.length > 0 && (
          <motion.div
            ref={dropdownRef}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-[calc(100%+8px)] left-0 right-0 glass shadow-2xl rounded-[24px] overflow-hidden z-[100] border border-white/60"
          >
            <div className="max-h-64 overflow-y-auto py-2">
              {filteredCities.map((city, index) => (
                <motion.button
                  key={`${city.name}-${city.country}-${index}`}
                  variants={itemVariants}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', scale: 1.01, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectCity(city)}
                  className="w-full px-5 py-3 text-left transition-colors border-b border-brand-text/5 last:border-b-0 text-brand-text"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-brand-text transition-colors">{city.name}</div>
                      <div className="text-xs text-brand-text/60 font-medium mt-0.5">{city.country}</div>
                    </div>
                    <div className="text-xs text-brand-text/40 font-medium bg-white/40 px-2 py-1 rounded-lg">
                      {city.lat.toFixed(2)}°, {city.lon.toFixed(2)}°
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && searchQuery && filteredCities.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring' } }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            className="absolute top-[calc(100%+8px)] left-0 right-0 glass shadow-2xl rounded-[24px] px-5 py-6 text-brand-text/60 text-center font-medium z-[100] border border-white/60"
          >
            Kota tidak ditemukan
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ 
          opacity: currentCity && !searchQuery ? 1 : 0, 
          y: currentCity && !searchQuery ? 0 : -10 
        }}
        transition={{ duration: 0.3 }}
        className="absolute -bottom-7 left-2 text-xs font-semibold tracking-wide text-brand-text/50 pointer-events-none"
      >
        LOKASI SAAT INI: <span className="text-brand-accent ml-1">{currentCity || '\u00A0'}</span>
      </motion.div>
    </div>
  );
};
