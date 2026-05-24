'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { TABS, type TabId } from '../types/weather';

// SVG icons that use currentColor — auto-adapt to theme
const TAB_ICONS: Record<TabId, React.ReactNode> = {
  dashboard: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  forecast: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  analytics: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  metrics: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
    </svg>
  ),
  alerts: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  map: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  ),
};

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ activeTab, onTabChange, isMobileOpen, onMobileClose }: SidebarProps) {
  const handleTabClick = (tabId: TabId) => {
    onTabChange(tabId);
    onMobileClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onMobileClose}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isMobileOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -280 : 0),
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed top-0 left-0 h-full w-[260px] z-50 glass rounded-none border-r border-l-0 border-t-0 border-b-0 flex flex-col py-8 px-4 lg:sticky lg:top-0 lg:z-10 lg:h-screen`}
      >
        {/* Logo */}
        <div 
          className="flex items-center gap-3 px-3 mb-10 cursor-pointer group"
          onClick={() => handleTabClick('dashboard')}
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-11 h-11 rounded-2xl flex items-center justify-center overflow-hidden"
          >
            <Image
              src="/logo.png"
              alt="IIOT Dashboard Logo"
              width={44}
              height={44}
              className="object-contain"
              priority
            />
          </motion.div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-brand-text">Dashboard</h1>
            <p className="text-[10px] font-semibold text-brand-text/50 uppercase tracking-widest">Hiliriset 2026</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.97 }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all duration-200 relative ${
                  isActive
                    ? 'glass-sm text-brand-text font-semibold shadow-sm'
                    : 'text-brand-text/60 hover:text-brand-text hover:bg-white/20'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-accent rounded-r-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
                <span className={`transition-colors duration-200 ${isActive ? 'text-brand-accent' : ''}`}>
                  {TAB_ICONS[tab.id]}
                </span>
                <span className="text-sm">{tab.label}</span>
              </motion.button>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="px-3 pt-4 border-t border-brand-text/10">
          <p className="text-[10px] text-brand-text/40 font-medium">
            Powered by Open-Meteo API
          </p>
          <p className="text-[10px] text-brand-text/30 mt-1">
            v1.0.0 • Liquid Glass UI
          </p>
        </div>
      </motion.aside>
    </>
  );
}
