'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import type { WeatherData } from '../types/weather';

interface ForecastViewProps {
  weather: WeatherData | null;
  isLoading: boolean;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 200 } },
};

function getDayName(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return 'Hari Ini';
  if (date.toDateString() === tomorrow.toDateString()) return 'Besok';

  return date.toLocaleDateString('id-ID', { weekday: 'long' });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  });
}

export function ForecastView({ weather, isLoading }: ForecastViewProps) {
  if (isLoading || !weather) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-brand-text mb-6">📅 Prakiraan 7 Hari</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="glass p-6 rounded-[24px] animate-pulse">
              <div className="h-5 bg-brand-text/10 rounded-xl w-1/2 mb-4"></div>
              <div className="h-12 bg-brand-text/10 rounded-2xl w-1/3 mb-3"></div>
              <div className="h-4 bg-brand-text/10 rounded-lg w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl font-bold text-brand-text mb-2"
      >
        📅 Prakiraan 7 Hari
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-brand-text/60 text-sm mb-8 font-medium"
      >
        Prakiraan cuaca untuk {weather.city}
      </motion.p>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        {weather.daily.map((day, index) => (
          <motion.div
            key={day.date}
            variants={cardVariants}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="glass p-6 rounded-[24px] cursor-default group"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-bold text-brand-text text-sm">{getDayName(day.date)}</p>
                <p className="text-xs text-brand-text/50 mt-0.5">{formatDate(day.date)}</p>
              </div>
              <motion.span
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 3, delay: index * 0.2 }}
                className="text-3xl"
              >
                {day.icon}
              </motion.span>
            </div>

            <div className="mb-3">
              <span className="text-3xl font-bold text-brand-text">{day.tempMax}°</span>
              <span className="text-lg text-brand-text/40 ml-1">/ {day.tempMin}°</span>
            </div>

            <p className="text-xs text-brand-text/60 font-medium mb-4">{day.weatherDescription}</p>

            <div className="grid grid-cols-2 gap-2 text-xs text-brand-text/50">
              <div className="flex items-center gap-1">
                <span>💧</span>
                <span>{day.precipitationSum} mm</span>
              </div>
              <div className="flex items-center gap-1">
                <span>💨</span>
                <span>{day.windSpeedMax} km/h</span>
              </div>
              <div className="flex items-center gap-1">
                <span>☀️</span>
                <span>UV {day.uvIndexMax}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>🌅</span>
                <span>{new Date(day.sunrise).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
