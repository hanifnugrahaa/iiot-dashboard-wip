'use client';

import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import type { ActivityLogEntry, LogActionType } from '../types/weather';

interface ActivityLogViewProps {
  logs: ActivityLogEntry[];
  onClearLogs: () => void;
}

const cardV: Variants = {
  hidden: { opacity: 0, x: -15 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 200 } },
};

const ACTION_STYLES: Record<LogActionType, { label: string; color: string; bg: string }> = {
  auth:   { label: 'AUTH',   color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  data:   { label: 'DATA',   color: 'text-blue-600 dark:text-blue-400',     bg: 'bg-blue-500/10 border-blue-500/20' },
  export: { label: 'EXPORT', color: 'text-green-600 dark:text-green-400',   bg: 'bg-green-500/10 border-green-500/20' },
  config: { label: 'CONFIG', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  system: { label: 'SYSTEM', color: 'text-gray-600 dark:text-gray-400',     bg: 'bg-gray-500/10 border-gray-500/20' },
};

const ALL_TYPES: LogActionType[] = ['auth', 'data', 'export', 'config', 'system'];

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function ActivityLogView({ logs, onClearLogs }: ActivityLogViewProps) {
  const [filter, setFilter] = useState<LogActionType | 'all'>('all');

  const filtered = filter === 'all' ? logs : logs.filter((l) => l.action === filter);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <motion.h2 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl font-bold text-brand-text mb-1">
            📋 Activity Log
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-brand-text/60 text-sm font-medium">
            {logs.length} entries recorded
          </motion.p>
        </div>

        {logs.length > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClearLogs}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-red-500 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-colors self-start"
          >
            Clear All
          </motion.button>
        )}
      </div>

      {/* Filter chips */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-wrap gap-2 mb-6"
      >
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filter === 'all'
              ? 'bg-brand-accent text-white shadow-md shadow-brand-accent/30'
              : 'glass-sm text-brand-text/60 hover:text-brand-text'
          }`}
        >
          All
        </button>
        {ALL_TYPES.map((type) => {
          const style = ACTION_STYLES[type];
          return (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filter === type
                  ? 'bg-brand-accent text-white shadow-md shadow-brand-accent/30'
                  : `glass-sm ${style.color}`
              }`}
            >
              {style.label}
            </button>
          );
        })}
      </motion.div>

      {/* Log entries */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass p-12 rounded-[28px] flex flex-col items-center justify-center text-center"
        >
          <span className="text-4xl mb-4">📭</span>
          <p className="text-brand-text/60 font-medium">No activity recorded yet</p>
          <p className="text-brand-text/40 text-sm mt-1">Actions like login, data refresh, and exports will appear here</p>
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.03 } } }}
          className="space-y-2"
        >
          {filtered.map((entry) => {
            const style = ACTION_STYLES[entry.action];
            return (
              <motion.div
                key={entry.id}
                variants={cardV}
                className="glass-sm px-5 py-3.5 rounded-[20px] flex items-center gap-4"
              >
                {/* Badge */}
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${style.bg} ${style.color} shrink-0`}>
                  {style.label}
                </span>

                {/* Detail */}
                <p className="flex-1 text-sm text-brand-text/80 font-medium truncate">{entry.detail}</p>

                {/* Timestamp */}
                <span className="text-xs text-brand-text/40 font-medium shrink-0 hidden sm:block">
                  {formatTimestamp(entry.timestamp)}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
