'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './components/Sidebar';
import { ThemeToggle } from './components/ThemeToggle';
import { DashboardView } from './components/DashboardView';
import { ForecastView } from './components/ForecastView';
import { AnalyticsView } from './components/AnalyticsView';
import { MetricsView } from './components/MetricsView';
import { AlertsView } from './components/AlertsView';
import { MapView } from './components/MapView';
import { LoginView } from './components/LoginView';
import type { WeatherData, TabId } from './types/weather';

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [currentCity, setCurrentCity] = useState('Yogyakarta');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('iiot_auth_token');
    if (token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAuthenticated(true);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAuthChecked(true);
  }, []);

  const handleLoginSuccess = (token: string) => {
    localStorage.setItem('iiot_auth_token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('iiot_auth_token');
    setIsAuthenticated(false);
  };

  const fetchWeather = useCallback(async (cityName: string, lat: number, lon: number) => {
    setIsLoading(true);
    try {
      const url = `/api/weather?lat=${lat}&lon=${lon}&cityName=${encodeURIComponent(cityName)}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.error) {
        setWeather(null);
      } else {
        setWeather(data);
        setCurrentCity(cityName);
      }
    } catch (err) {
      console.error(err);
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchInitial = async () => {
      try {
        const url = `/api/weather?lat=-7.8075&lon=110.3694&cityName=Yogyakarta`;
        const response = await fetch(url);
        const data = await response.json();
        if (!mounted) return;
        if (data.error) {
          setWeather(null);
        } else {
          setWeather(data);
          setCurrentCity('Yogyakarta');
        }
      } catch (err) {
        console.error(err);
        if (mounted) setWeather(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchInitial();
    return () => { mounted = false; };
  }, []);

  const handleCityChange = (cityName: string, lat: number, lon: number) => {
    fetchWeather(cityName, lat, lon);
  };

  const renderContent = () => {
    const props = { weather, isLoading };
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView {...props} currentCity={currentCity} onCityChange={handleCityChange} />;
      case 'forecast':
        return <ForecastView {...props} />;
      case 'analytics':
        return <AnalyticsView {...props} />;
      case 'metrics':
        return <MetricsView {...props} />;
      case 'alerts':
        return <AlertsView {...props} />;
      case 'map':
        return <MapView {...props} />;
      default:
        return null;
    }
  };

  const renderWeatherEffects = () => {
    return (
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-brand-bg transition-colors duration-1000" />
        <div className="absolute -top-32 -left-32 w-[40rem] h-[40rem] bg-brand-surface rounded-full blur-[120px] opacity-70 animate-float" />
        <div className="absolute bottom-0 right-0 w-[50rem] h-[50rem] bg-brand-accent/20 rounded-full blur-[150px] opacity-60 animate-glow" />
      </div>
    );
  };

  if (!authChecked) {
    return <div className="min-h-screen bg-brand-bg" />;
  }

  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="min-h-screen w-full relative overflow-hidden font-sans text-brand-text"
    >
      {renderWeatherEffects()}

      <div className="flex min-h-screen relative z-10">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isMobileOpen={isMobileMenuOpen}
          onMobileClose={() => setIsMobileMenuOpen(false)}
          onLogout={handleLogout}
        />

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Top Bar */}
          <div className="flex items-center justify-between p-6">
            {/* Mobile Hamburger */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden w-10 h-10 glass rounded-xl flex items-center justify-center text-brand-text"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </motion.button>

            <div className="flex-1" />
            <ThemeToggle />
          </div>

          {/* Page Content */}
          <div className="px-6 pb-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(8px)' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </motion.div>
  );
}
