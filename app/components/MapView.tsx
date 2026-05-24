'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { WeatherData } from '../types/weather';

interface MapViewProps {
  weather: WeatherData | null;
  isLoading: boolean;
}

export function MapView({ weather, isLoading }: MapViewProps) {
  const [MapComponent, setMapComponent] = useState<React.ComponentType<{ weather: WeatherData }> | null>(null);

  useEffect(() => {
    // Dynamic import to avoid SSR issues with Leaflet
    import('./MapContent').then((mod) => {
      setMapComponent(() => mod.MapContent);
    });
  }, []);

  if (isLoading || !weather) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-brand-text mb-6">🗺️ Weather Map</h2>
        <div className="glass rounded-[28px] h-[500px] animate-pulse flex items-center justify-center">
          <p className="text-brand-text/40 font-medium">Memuat peta...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <motion.h2 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl font-bold text-brand-text mb-2">
        🗺️ Weather Map
      </motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-brand-text/60 text-sm mb-8 font-medium">
        Lokasi pemantauan cuaca — {weather.city}
      </motion.p>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-[28px] overflow-hidden h-[500px]">
        {MapComponent ? (
          <MapComponent weather={weather} />
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-brand-text/40 font-medium">Memuat peta...</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
