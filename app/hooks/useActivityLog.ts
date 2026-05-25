'use client';

import { useState, useCallback, useEffect } from 'react';
import type { ActivityLogEntry, LogActionType } from '../types/weather';

const STORAGE_KEY = 'iiot_activity_log';
const MAX_ENTRIES = 100;

function loadLogs(): ActivityLogEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLogs(logs: ActivityLogEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  } catch {
    // localStorage full — silently drop
  }
}

export function useActivityLog() {
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);

  // Load on mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLogs(loadLogs());
  }, []);

  const addLog = useCallback((action: LogActionType, detail: string) => {
    const entry: ActivityLogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date().toISOString(),
      action,
      detail,
    };

    setLogs((prev) => {
      const next = [entry, ...prev].slice(0, MAX_ENTRIES);
      saveLogs(next);
      return next;
    });
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
    saveLogs([]);
  }, []);

  return { logs, addLog, clearLogs };
}
