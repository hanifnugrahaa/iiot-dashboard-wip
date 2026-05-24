'use client';

import { useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

// SSR-safe mounted check without useEffect + setState
const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function ThemeToggle() {
  const mounted = useMounted();
  const { setTheme, resolvedTheme } = useTheme();

  if (!mounted) {
    return <div className="w-10 h-10 glass rounded-xl" />;
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="w-10 h-10 glass rounded-xl flex items-center justify-center text-xl shadow-glass transition-colors"
      aria-label="Toggle Theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 360 : 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        {isDark ? '🌙' : '☀️'}
      </motion.div>
    </motion.button>
  );
}
