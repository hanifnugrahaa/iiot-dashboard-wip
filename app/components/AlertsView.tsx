'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import type { WeatherData } from '../types/weather';

interface AlertsViewProps {
  weather: WeatherData | null;
  isLoading: boolean;
}

interface Alert {
  id: string;
  level: 'info' | 'warning' | 'danger';
  title: string;
  message: string;
  icon: string;
}

const cardV: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 200 } },
};

const levelStyles = {
  info: 'border-blue-400/30 bg-blue-500/5',
  warning: 'border-yellow-400/30 bg-yellow-500/5',
  danger: 'border-red-400/30 bg-red-500/5',
};

const levelBadge = {
  info: 'bg-blue-500/15 text-blue-600',
  warning: 'bg-yellow-500/15 text-yellow-700',
  danger: 'bg-red-500/15 text-red-600',
};

function generateAlerts(weather: WeatherData): Alert[] {
  const alerts: Alert[] = [];
  const c = weather.current;

  if (c.temperature > 35) {
    alerts.push({ id: 'heat', level: 'danger', title: 'Peringatan Panas Ekstrem', message: `Suhu saat ini ${c.temperature}°C. Hindari aktivitas luar ruangan yang berat.`, icon: '🔥' });
  } else if (c.temperature > 32) {
    alerts.push({ id: 'warm', level: 'warning', title: 'Suhu Tinggi', message: `Suhu ${c.temperature}°C. Pastikan hidrasi yang cukup.`, icon: '🌡️' });
  }

  if (c.temperature < 5) {
    alerts.push({ id: 'cold', level: 'danger', title: 'Peringatan Dingin Ekstrem', message: `Suhu ${c.temperature}°C. Kenakan pakaian hangat.`, icon: '🥶' });
  }

  if (c.windSpeed > 50) {
    alerts.push({ id: 'wind', level: 'danger', title: 'Angin Kencang Berbahaya', message: `Kecepatan angin ${c.windSpeed} km/h. Waspadai objek terbang.`, icon: '🌪️' });
  } else if (c.windSpeed > 30) {
    alerts.push({ id: 'windw', level: 'warning', title: 'Angin Cukup Kencang', message: `Kecepatan angin ${c.windSpeed} km/h.`, icon: '💨' });
  }

  if (c.humidity > 90) {
    alerts.push({ id: 'humid', level: 'warning', title: 'Kelembapan Sangat Tinggi', message: `Kelembapan ${c.humidity}%. Risiko korosi pada peralatan meningkat.`, icon: '💧' });
  }

  if (c.uvIndex > 8) {
    alerts.push({ id: 'uv', level: 'danger', title: 'UV Index Berbahaya', message: `UV Index ${c.uvIndex}. Gunakan pelindung matahari.`, icon: '☀️' });
  } else if (c.uvIndex > 5) {
    alerts.push({ id: 'uvw', level: 'warning', title: 'UV Index Tinggi', message: `UV Index ${c.uvIndex}. Batasi paparan sinar matahari.`, icon: '🌤️' });
  }

  if (c.visibility < 2) {
    alerts.push({ id: 'vis', level: 'danger', title: 'Jarak Pandang Rendah', message: `Visibility ${c.visibility} km. Berkendara dengan hati-hati.`, icon: '🌫️' });
  }

  if (alerts.length === 0) {
    alerts.push({ id: 'safe', level: 'info', title: 'Kondisi Normal', message: 'Semua parameter cuaca dalam batas aman. Tidak ada peringatan aktif.', icon: '✅' });
  }

  return alerts;
}

export function AlertsView({ weather, isLoading }: AlertsViewProps) {
  if (isLoading || !weather) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-brand-text mb-6">🚨 Weather Alerts</h2>
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="glass p-6 rounded-[24px] h-24 animate-pulse">
              <div className="h-4 bg-brand-text/10 rounded-xl w-1/3 mb-3" />
              <div className="h-3 bg-brand-text/10 rounded-lg w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const alerts = generateAlerts(weather);

  return (
    <div>
      <motion.h2 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl font-bold text-brand-text mb-2">
        🚨 Weather Alerts
      </motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-brand-text/60 text-sm mb-8 font-medium">
        Peringatan cuaca aktif untuk {weather.city}
      </motion.p>

      <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="space-y-4">
        {alerts.map(alert => (
          <motion.div key={alert.id} variants={cardV} whileHover={{ x: 4 }} className={`glass p-6 rounded-[24px] border-l-4 ${levelStyles[alert.level]}`}>
            <div className="flex items-start gap-4">
              <span className="text-3xl">{alert.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-brand-text">{alert.title}</h3>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${levelBadge[alert.level]}`}>
                    {alert.level}
                  </span>
                </div>
                <p className="text-sm text-brand-text/60 font-medium">{alert.message}</p>
              </div>
              {alert.level === 'danger' && (
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_12px_rgba(239,68,68,0.6)]" />
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
