'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ExportButtonProps {
  onExportCSV: () => void;
  onExportPDF?: () => void;
}

export function ExportButton({ onExportCSV, onExportPDF }: ExportButtonProps) {
  return (
    <div className="flex items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onExportCSV}
        className="flex items-center gap-1.5 px-3 py-1.5 glass-sm rounded-xl text-xs font-semibold text-brand-text/70 hover:text-brand-text transition-colors"
        title="Download CSV"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        CSV
      </motion.button>
      {onExportPDF && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onExportPDF}
          className="flex items-center gap-1.5 px-3 py-1.5 glass-sm rounded-xl text-xs font-semibold text-brand-text/70 hover:text-brand-text transition-colors"
          title="Print / Save PDF"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          PDF
        </motion.button>
      )}
    </div>
  );
}

// ── Utility functions ──────────────────────────────────────────

export function exportWeatherCSV(
  data: { time: string; temperature: number; humidity: number; windSpeed: number; precipitation: number }[],
  cityName: string
) {
  const header = 'Time,Temperature (°C),Humidity (%),Wind Speed (km/h),Precipitation (mm)\n';
  const rows = data.map((d) =>
    `${d.time},${d.temperature},${d.humidity},${d.windSpeed},${d.precipitation}`
  ).join('\n');

  const csv = header + rows;
  downloadFile(csv, `weather_${cityName}_${formatDateForFile()}.csv`, 'text/csv');
}

export function exportMetricsCSV(
  metrics: { label: string; value: string }[],
  cityName: string
) {
  const header = 'Metric,Value\n';
  const rows = metrics.map((m) => `${m.label},${m.value}`).join('\n');
  const csv = header + rows;
  downloadFile(csv, `metrics_${cityName}_${formatDateForFile()}.csv`, 'text/csv');
}

export function exportPDF() {
  window.print();
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function formatDateForFile(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}
