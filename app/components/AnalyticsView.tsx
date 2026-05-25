'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, AreaChart, Area,
} from 'recharts';
import type { WeatherData } from '../types/weather';
import { ExportButton, exportWeatherCSV, exportPDF } from './ExportButton';

interface AnalyticsViewProps {
  weather: WeatherData | null;
  isLoading: boolean;
  onLogExport?: (detail: string) => void;
}

function formatHour(timeStr: string): string {
  return new Date(timeStr).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

export function AnalyticsView({ weather, isLoading, onLogExport }: AnalyticsViewProps) {
  if (isLoading || !weather) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-brand-text mb-6">📈 Analytics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass p-8 rounded-[28px] h-80 animate-pulse">
              <div className="h-5 bg-brand-text/10 rounded-xl w-1/3 mb-6"></div>
              <div className="h-full bg-brand-text/5 rounded-2xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const chartData = weather.hourly.map((h) => ({
    time: formatHour(h.time),
    temperature: h.temperature,
    humidity: h.humidity,
    windSpeed: h.windSpeed,
    precipitation: h.precipitation,
  }));

  const brandAccent = '#86B6F6';
  const brandText = '#176B87';

  const handleCSV = () => {
    exportWeatherCSV(weather.hourly, weather.city);
    onLogExport?.(`Exported hourly CSV for ${weather.city}`);
  };

  const handlePDF = () => {
    exportPDF();
    onLogExport?.(`Printed analytics report for ${weather.city}`);
  };

  return (
    <div className="print-area">
      <div className="flex items-center justify-between mb-2">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-brand-text"
        >
          📈 Analytics
        </motion.h2>
        <div className="no-print">
          <ExportButton onExportCSV={handleCSV} onExportPDF={handlePDF} />
        </div>
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-brand-text/60 text-sm mb-8 font-medium"
      >
        Tren cuaca 24 jam terakhir untuk {weather.city}
      </motion.p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass p-6 rounded-[28px]"
        >
          <h3 className="text-sm font-semibold text-brand-text/60 mb-4 uppercase tracking-wider">
            🌡️ Suhu (°C)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={brandAccent} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={brandAccent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: brandText }} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: brandText }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.6)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                }}
              />
              <Area type="monotone" dataKey="temperature" stroke={brandAccent} fill="url(#tempGradient)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Humidity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass p-6 rounded-[28px]"
        >
          <h3 className="text-sm font-semibold text-brand-text/60 mb-4 uppercase tracking-wider">
            💧 Kelembapan (%)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: brandText }} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: brandText }} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.6)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                }}
              />
              <Line type="monotone" dataKey="humidity" stroke="#38bdf8" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Precipitation Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass p-6 rounded-[28px] lg:col-span-2"
        >
          <h3 className="text-sm font-semibold text-brand-text/60 mb-4 uppercase tracking-wider">
            🌧️ Curah Hujan (mm) & 💨 Kecepatan Angin (km/h)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: brandText }} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: brandText }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.6)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                }}
              />
              <Bar dataKey="precipitation" fill={brandAccent} radius={[8, 8, 0, 0]} opacity={0.8} />
              <Bar dataKey="windSpeed" fill={brandText} radius={[8, 8, 0, 0]} opacity={0.4} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
