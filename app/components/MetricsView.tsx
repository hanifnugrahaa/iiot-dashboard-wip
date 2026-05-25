'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import type { WeatherData } from '../types/weather';
import { ExportButton, exportMetricsCSV } from './ExportButton';

interface MetricsViewProps {
  weather: WeatherData | null;
  isLoading: boolean;
  onLogExport?: (detail: string) => void;
}

const cardV: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 200 } },
};

function getUVLevel(uv: number) {
  if (uv <= 2) return { label: 'Rendah', color: 'text-green-500' };
  if (uv <= 5) return { label: 'Sedang', color: 'text-yellow-500' };
  if (uv <= 7) return { label: 'Tinggi', color: 'text-orange-500' };
  if (uv <= 10) return { label: 'Sangat Tinggi', color: 'text-red-500' };
  return { label: 'Ekstrem', color: 'text-purple-600' };
}

function getWindDir(deg: number) {
  const d = ['U', 'TL', 'T', 'Tg', 'S', 'BD', 'B', 'BL'];
  return d[Math.round(deg / 45) % 8];
}

export function MetricsView({ weather, isLoading, onLogExport }: MetricsViewProps) {
  if (isLoading || !weather) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-brand-text mb-6">🌡️ Detail Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="glass p-6 rounded-[24px] h-40 animate-pulse">
              <div className="h-4 bg-brand-text/10 rounded-xl w-1/2 mb-4" />
              <div className="h-10 bg-brand-text/10 rounded-2xl w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const uv = getUVLevel(weather.current.uvIndex);
  const wd = getWindDir(weather.current.windDirection);
  const td = weather.daily[0];

  const items = [
    { label: 'Suhu Terasa', val: `${weather.current.apparentTemperature}°C`, icon: '🌡️', sub: weather.current.apparentTemperature > weather.current.temperature ? 'Terasa lebih panas' : 'Terasa lebih dingin' },
    { label: 'Titik Embun', val: `${weather.current.dewPoint}°C`, icon: '💧', sub: weather.current.dewPoint > 20 ? 'Lembap' : 'Nyaman' },
    { label: 'Tekanan Udara', val: `${weather.current.pressure} hPa`, icon: '🔵', sub: weather.current.pressure > 1013 ? 'Tinggi (stabil)' : 'Rendah' },
    { label: 'Jarak Pandang', val: `${weather.current.visibility} km`, icon: '👁️', sub: weather.current.visibility > 10 ? 'Sangat baik' : 'Sedang' },
    { label: 'Arah Angin', val: `${wd} (${weather.current.windDirection}°)`, icon: '🧭', sub: `${weather.current.windSpeed} km/h` },
    { label: 'UV Index', val: `${weather.current.uvIndex}`, icon: '☀️', sub: uv.label, cls: uv.color },
    { label: 'Matahari Terbit', val: td ? new Date(td.sunrise).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-', icon: '🌅', sub: 'Sunrise' },
    { label: 'Matahari Terbenam', val: td ? new Date(td.sunset).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-', icon: '🌇', sub: 'Sunset' },
    { label: 'Curah Hujan', val: td ? `${td.precipitationSum} mm` : '-', icon: '🌧️', sub: 'Hari ini' },
  ];

  const handleCSV = () => {
    exportMetricsCSV(
      items.map((m) => ({ label: m.label, value: m.val })),
      weather.city
    );
    onLogExport?.(`Exported metrics CSV for ${weather.city}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <motion.h2 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl font-bold text-brand-text">
          🌡️ Detail Metrics
        </motion.h2>
        <ExportButton onExportCSV={handleCSV} />
      </div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-brand-text/60 text-sm mb-8 font-medium">
        Parameter lingkungan lengkap untuk {weather.city}
      </motion.p>

      <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.06 } } }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(m => (
          <motion.div key={m.label} variants={cardV} whileHover={{ scale: 1.03, y: -4 }} whileTap={{ scale: 0.97 }} className="glass p-6 rounded-[24px] cursor-default">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-semibold text-brand-text/50 uppercase tracking-wider">{m.label}</p>
              <span className="text-2xl">{m.icon}</span>
            </div>
            <p className={`text-3xl font-bold mb-2 ${m.cls || 'text-brand-text'}`}>{m.val}</p>
            <p className="text-xs text-brand-text/50 font-medium">{m.sub}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
