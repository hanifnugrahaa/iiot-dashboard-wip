'use client';

import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import type { WeatherData } from '../types/weather';
import { RealtimeClock } from './RealtimeClock';

interface WeatherCardProps {
  weather: WeatherData | null;
  isLoading: boolean;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather, isLoading }) => {
  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, filter: 'blur(10px)', y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      filter: 'blur(0px)', 
      y: 0,
      transition: { 
        type: 'spring', 
        stiffness: 100, 
        damping: 15,
        staggerChildren: 0.1 
      }
    }
  };

  const childVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200 } }
  };

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="glass p-10 rounded-[32px] min-h-[400px] shadow-glass relative overflow-hidden flex flex-col"
        >
          {/* Shimmer Skeleton Effect */}
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" style={{ transform: 'skewX(-20deg)' }}></div>
          
          <div className="flex justify-between items-start mb-12 relative z-0">
            <div className="space-y-4 w-1/2">
              <div className="h-10 bg-brand-text/10 rounded-2xl w-3/4"></div>
              <div className="h-6 bg-brand-text/10 rounded-xl w-1/2"></div>
            </div>
            <div className="w-20 h-20 bg-brand-text/10 rounded-full"></div>
          </div>
          
          <div className="mb-12 space-y-4 relative z-0">
            <div className="h-24 bg-brand-text/10 rounded-3xl w-1/3"></div>
            <div className="h-4 bg-brand-text/10 rounded-xl w-1/4"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mt-auto relative z-0">
            <div className="h-28 bg-brand-text/10 rounded-[24px]"></div>
            <div className="h-28 bg-brand-text/10 rounded-[24px]"></div>
          </div>
        </motion.div>
      ) : !weather ? (
        <motion.div
          key="error"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass p-10 rounded-[32px] min-h-[400px] flex items-center justify-center shadow-glass"
        >
          <p className="text-brand-text/60 font-medium">Gagal memuat data cuaca</p>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -5, scale: 1.01, boxShadow: '0 25px 50px -12px rgba(23,107,135,0.15)' }}
          whileTap={{ scale: 0.99 }}
          className="glass p-10 rounded-[32px] shadow-glass relative overflow-hidden group cursor-default"
        >
          {/* Header */}
          <motion.div variants={childVariants} className="flex items-start justify-between mb-12 relative z-10">
            <div>
              <h2 className="text-4xl font-bold text-brand-text mb-1 tracking-tight">{weather.city}</h2>
              <p className="text-brand-text/70 text-lg font-medium">{weather.current.weatherDescription}</p>
              <RealtimeClock timezone={weather.timezone} />
            </div>
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="text-7xl drop-shadow-xl"
            >
              {weather.current.icon}
            </motion.div>
          </motion.div>

          {/* Suhu */}
          <motion.div variants={childVariants} className="mb-12 relative z-10">
            <motion.p 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="text-[6rem] leading-none font-bold text-brand-text mb-2 tracking-tighter drop-shadow-sm"
            >
              {weather.current.temperature}°<span className="text-5xl text-brand-text/40">C</span>
            </motion.p>
            <p className="text-brand-text/60 font-medium ml-2 uppercase tracking-widest text-sm">Suhu Saat Ini</p>
          </motion.div>

          {/* Grid Data */}
          <motion.div variants={childVariants} className="grid grid-cols-2 gap-6 relative z-10">
            {/* Kelembapan */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-sm p-6 rounded-[24px] transition-colors hover:bg-white/50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-brand-text/60 text-sm mb-2 font-medium uppercase tracking-wider">Kelembapan</p>
                  <p className="text-3xl font-bold text-brand-accent">{weather.current.humidity}%</p>
                </div>
                <div className="text-4xl opacity-80">💧</div>
              </div>
            </motion.div>

            {/* Kecepatan Angin */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-sm p-6 rounded-[24px] transition-colors hover:bg-white/50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-brand-text/60 text-sm mb-2 font-medium uppercase tracking-wider">Angin</p>
                  <p className="text-3xl font-bold text-brand-text/80">{weather.current.windSpeed} <span className="text-lg">km/h</span></p>
                </div>
                <div className="text-4xl opacity-80">💨</div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
