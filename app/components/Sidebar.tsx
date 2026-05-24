'use client';

import { motion } from 'framer-motion';
import { TABS, type TabId } from '../types/weather';

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
        <div className="flex items-center gap-3 px-3 mb-10">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-11 h-11 glass rounded-2xl flex items-center justify-center cursor-pointer"
          >
            <span className="text-sm font-bold bg-gradient-to-r from-brand-accent to-brand-text bg-clip-text text-transparent">
              IIOT
            </span>
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
                <span className="text-lg">{tab.icon}</span>
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
