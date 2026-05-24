'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { WeatherCard } from './WeatherCard';
import { CitySelector } from './CitySelector';
import type { WeatherData } from '../types/weather';

interface DashboardViewProps {
  weather: WeatherData | null;
  currentCity: string;
  isLoading: boolean;
  onCityChange: (cityName: string, lat: number, lon: number) => void;
}

export function DashboardView({ weather, currentCity, isLoading, onCityChange }: DashboardViewProps) {
  return (
    <div>
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', delay: 0.1 }}
        className="mb-10 max-w-md"
      >
        <h2 className="text-sm font-semibold text-brand-text/60 mb-3 uppercase tracking-wider ml-1">
          Pilih Kota
        </h2>
        <CitySelector
          currentCity={currentCity}
          onCityChange={onCityChange}
          isLoading={isLoading}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <WeatherCard weather={weather} isLoading={isLoading} />
        </div>

        <div className="lg:col-span-4 space-y-6">
          {/* Status Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', delay: 0.3 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="glass p-7 rounded-[28px] cursor-default"
          >
            <h3 className="text-sm font-semibold text-brand-text/60 mb-5 uppercase tracking-wider">
              System Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-brand-text/80 font-medium">API Connection</span>
                <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                  <span className="text-green-600 dark:text-green-400 text-xs font-semibold tracking-wide">Active</span>
                </div>
              </div>
              <div className="border-t border-brand-text/10 pt-4 flex items-center justify-between">
                <span className="text-brand-text/80 font-medium">Location</span>
                <span className="text-brand-accent font-semibold capitalize">
                  {weather?.city || 'Loading...'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', delay: 0.4 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="glass p-7 rounded-[28px] cursor-default"
          >
            <h3 className="text-sm font-semibold text-brand-text/60 mb-3 uppercase tracking-wider">
              About
            </h3>
            <p className="text-brand-text/70 text-sm leading-relaxed font-medium">
              Built for the SINERGI Program (Integrated Technology Transfer-Based Research Downstreaming), an initiative by the Directorate General of Research & Development to foster sustainable partnerships and utilize university research outcomes.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
