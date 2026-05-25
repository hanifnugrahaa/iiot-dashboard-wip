'use client';

import React, { useState, useEffect } from 'react';

interface RealtimeClockProps {
  timezone: string;
}

export function RealtimeClock({ timezone }: RealtimeClockProps) {
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    // Initial update
    updateTime();

    // Update every second
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);

    function updateTime() {
      const now = new Date();
      
      try {
        const time = new Intl.DateTimeFormat('id-ID', {
          timeZone: timezone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).format(now);
        
        const date = new Intl.DateTimeFormat('id-ID', {
          timeZone: timezone,
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }).format(now);
        
        setTimeStr(time.replace(/\./g, ':'));
        setDateStr(date);
      } catch {
        // Fallback if timezone is invalid
        setTimeStr(now.toLocaleTimeString('id-ID'));
        setDateStr(now.toLocaleDateString('id-ID'));
      }
    }
  }, [timezone]);

  // Prevent hydration mismatch by not rendering anything until mounted
  if (!timeStr) return <div className="h-[42px]"></div>;

  return (
    <div className="flex flex-col mt-3">
      <span className="text-2xl font-bold font-mono tracking-widest text-brand-text bg-brand-text/10 w-fit px-3 py-1 rounded-xl shadow-inner">
        {timeStr}
      </span>
      <span className="text-[11px] uppercase tracking-widest text-brand-text/60 font-semibold mt-1.5 ml-1">
        {dateStr}
      </span>
    </div>
  );
}
