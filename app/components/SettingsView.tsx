'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { UserSettings, TemperatureUnit, SpeedUnit, DistanceUnit, RefreshInterval, AlertThresholds } from '../types/weather';
import { DEFAULT_SETTINGS } from '../types/weather';

interface SettingsViewProps {
  settings: UserSettings;
  onSettingsChange: (settings: UserSettings) => void;
}

const STORAGE_KEY = 'iiot_user_settings';

export function loadSettings(): UserSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // silently fail
  }
}

function ToggleGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-brand-text/50 uppercase tracking-wider mb-2">{label}</p>
      <div className="flex gap-2">
        {options.map((opt) => (
          <motion.button
            key={opt.value}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(opt.value)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              value === opt.value
                ? 'bg-brand-accent text-white shadow-md shadow-brand-accent/30'
                : 'glass-sm text-brand-text/60 hover:text-brand-text'
            }`}
          >
            {opt.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function ThresholdInput({
  label,
  value,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-brand-text/70 font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-20 bg-brand-text/5 border border-brand-text/10 rounded-xl px-3 py-1.5 text-sm text-brand-text text-center focus:outline-none focus:ring-2 focus:ring-brand-accent/50 transition-all"
        />
        <span className="text-xs text-brand-text/40 font-medium w-12">{unit}</span>
      </div>
    </div>
  );
}

export function SettingsView({ settings, onSettingsChange }: SettingsViewProps) {
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);
  const [saved, setSaved] = useState(false);

  const update = (patch: Partial<UserSettings>) => {
    setLocalSettings((prev) => ({ ...prev, ...patch }));
    setSaved(false);
  };

  const updateThreshold = (patch: Partial<AlertThresholds>) => {
    setLocalSettings((prev) => ({
      ...prev,
      alertThresholds: { ...prev.alertThresholds, ...patch },
    }));
    setSaved(false);
  };

  const handleSave = () => {
    saveSettings(localSettings);
    onSettingsChange(localSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setLocalSettings(DEFAULT_SETTINGS);
    saveSettings(DEFAULT_SETTINGS);
    onSettingsChange(DEFAULT_SETTINGS);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <motion.h2 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl font-bold text-brand-text mb-2">
        ⚙️ Settings
      </motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-brand-text/60 text-sm mb-8 font-medium">
        Configure display units, alert thresholds, and auto-refresh
      </motion.p>

      <div className="space-y-6 max-w-2xl">
        {/* Unit Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass p-6 rounded-[28px] space-y-5"
        >
          <h3 className="text-sm font-semibold text-brand-text/60 uppercase tracking-wider">Display Units</h3>
          <ToggleGroup<TemperatureUnit>
            label="Temperature"
            value={localSettings.temperatureUnit}
            options={[
              { value: 'celsius', label: '°C' },
              { value: 'fahrenheit', label: '°F' },
            ]}
            onChange={(v) => update({ temperatureUnit: v })}
          />
          <ToggleGroup<SpeedUnit>
            label="Wind Speed"
            value={localSettings.speedUnit}
            options={[
              { value: 'kmh', label: 'km/h' },
              { value: 'mph', label: 'mph' },
            ]}
            onChange={(v) => update({ speedUnit: v })}
          />
          <ToggleGroup<DistanceUnit>
            label="Visibility"
            value={localSettings.distanceUnit}
            options={[
              { value: 'km', label: 'km' },
              { value: 'miles', label: 'miles' },
            ]}
            onChange={(v) => update({ distanceUnit: v })}
          />
        </motion.div>

        {/* Auto-Refresh */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass p-6 rounded-[28px] space-y-5"
        >
          <h3 className="text-sm font-semibold text-brand-text/60 uppercase tracking-wider">Data Refresh</h3>
          <ToggleGroup<string>
            label="Auto-refresh Interval"
            value={String(localSettings.refreshInterval)}
            options={[
              { value: '0', label: 'Manual' },
              { value: '30', label: '30s' },
              { value: '60', label: '1 min' },
              { value: '300', label: '5 min' },
            ]}
            onChange={(v) => update({ refreshInterval: Number(v) as RefreshInterval })}
          />
        </motion.div>

        {/* Alert Thresholds */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass p-6 rounded-[28px] space-y-4"
        >
          <h3 className="text-sm font-semibold text-brand-text/60 uppercase tracking-wider">Alert Thresholds</h3>
          <ThresholdInput label="🔥 High Temperature" value={localSettings.alertThresholds.highTemp} unit="°C" onChange={(v) => updateThreshold({ highTemp: v })} />
          <ThresholdInput label="🥶 Low Temperature" value={localSettings.alertThresholds.lowTemp} unit="°C" onChange={(v) => updateThreshold({ lowTemp: v })} />
          <ThresholdInput label="🌪️ High Wind Speed" value={localSettings.alertThresholds.highWind} unit="km/h" onChange={(v) => updateThreshold({ highWind: v })} />
          <ThresholdInput label="💧 High Humidity" value={localSettings.alertThresholds.highHumidity} unit="%" onChange={(v) => updateThreshold({ highHumidity: v })} />
          <ThresholdInput label="☀️ High UV Index" value={localSettings.alertThresholds.highUV} unit="" onChange={(v) => updateThreshold({ highUV: v })} />
          <ThresholdInput label="🌫️ Low Visibility" value={localSettings.alertThresholds.lowVisibility} unit="km" onChange={(v) => updateThreshold({ lowVisibility: v })} />
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="flex items-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="flex-1 bg-brand-accent text-white font-bold py-3 rounded-2xl shadow-lg shadow-brand-accent/30 flex items-center justify-center gap-2"
          >
            {saved ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                Saved!
              </>
            ) : (
              'Save Changes'
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleReset}
            className="px-6 py-3 rounded-2xl text-sm font-semibold text-red-500 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-colors"
          >
            Reset Default
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
