'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface LoginViewProps {
  onLoginSuccess: (token: string) => void;
}

export function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onLoginSuccess(data.token);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans text-brand-text">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-brand-bg transition-colors duration-1000" />
        <div className="absolute -top-32 -left-32 w-[40rem] h-[40rem] bg-brand-surface rounded-full blur-[120px] opacity-70 animate-float" />
        <div className="absolute bottom-0 right-0 w-[50rem] h-[50rem] bg-brand-accent/20 rounded-full blur-[150px] opacity-60 animate-glow" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="glass p-10 rounded-[32px] w-full max-w-md mx-4 shadow-glass z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 rounded-3xl flex items-center justify-center overflow-hidden mb-4 shadow-sm"
          >
            <Image src="/logo.png" alt="IIOT Logo" width={80} height={80} className="object-contain" priority />
          </motion.div>
          <h1 className="text-2xl font-bold tracking-tight">Hiliriset IIOT</h1>
          <p className="text-sm font-medium text-brand-text/50 uppercase tracking-widest mt-1">Dashboard 2026</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-brand-text/60 uppercase tracking-wider mb-2 ml-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-brand-text/5 border border-brand-text/10 rounded-2xl px-4 py-3 text-brand-text placeholder-brand-text/30 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 transition-all"
              placeholder="Enter username"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-brand-text/60 uppercase tracking-wider mb-2 ml-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-brand-text/5 border border-brand-text/10 rounded-2xl px-4 py-3 text-brand-text placeholder-brand-text/30 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 transition-all"
              placeholder="Enter password"
              required
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm font-medium text-center bg-red-500/10 py-2 rounded-xl border border-red-500/20"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            type="submit"
            className="w-full bg-brand-accent text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-brand-accent/30 flex justify-center items-center gap-2 mt-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Login securely'
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
