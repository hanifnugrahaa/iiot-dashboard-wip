'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WeatherCard } from './components/WeatherCard';
import { CitySelector } from './components/CitySelector';
import { ThemeToggle } from './components/ThemeToggle';

// Typing Animation Component
const TypewriterText = ({ text, className }: { text: string, className?: string }) => {
  return (
    <motion.span
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.05,
          },
        },
      }}
      className={className}
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          variants={{
            hidden: { opacity: 0, y: 10, filter: 'blur(5px)' },
            visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
};

interface WeatherData {
  city: string;
  current: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    weatherCode: number;
    weatherDescription: string;
    icon: string;
  };
  timezone: string;
}

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [currentCity, setCurrentCity] = useState('Yogyakarta');
  const [isLoading, setIsLoading] = useState(true);

  const fetchWeather = async (cityName: string, lat: number, lon: number) => {
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
  };

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

  const renderWeatherEffects = () => {
    const baseEffects = (
      <>
        <div className="absolute top-0 left-0 w-full h-full bg-brand-bg transition-colors duration-1000"></div>
        <div className="absolute -top-32 -left-32 w-[40rem] h-[40rem] bg-brand-surface rounded-full blur-[120px] opacity-70 animate-float"></div>
        <div className="absolute bottom-0 right-0 w-[50rem] h-[50rem] bg-brand-accent/20 rounded-full blur-[150px] opacity-60 animate-glow"></div>
      </>
    );

    if (!weather) return <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">{baseEffects}</div>;

    const code = weather.current.weatherCode;
    let weatherSpecificLayer = null;

    if (code === 0) {
      weatherSpecificLayer = (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
          <div className="absolute -top-20 -right-20 w-[40rem] h-[40rem] bg-yellow-400/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-orange-300/10 rounded-full blur-[80px]"></div>
        </motion.div>
      );
    } else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
      weatherSpecificLayer = (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
          <div className="absolute top-0 left-0 w-full h-full bg-blue-900/10"></div>
          <div className="absolute top-0 left-1/4 w-1 h-32 bg-blue-400/30 blur-[1px] animate-[bounce_1s_infinite]"></div>
          <div className="absolute top-0 left-2/4 w-1 h-24 bg-blue-400/20 blur-[1px] animate-[bounce_1.5s_infinite_0.5s]"></div>
          <div className="absolute top-0 left-3/4 w-1 h-40 bg-blue-400/40 blur-[1px] animate-[bounce_1.2s_infinite_0.2s]"></div>
        </motion.div>
      );
    } else if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
      weatherSpecificLayer = (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
          <div className="absolute top-0 left-0 w-full h-full bg-slate-200/30"></div>
          <div className="absolute top-10 left-1/4 w-3 h-3 bg-white/80 rounded-full blur-[1px] animate-[bounce_3s_infinite]"></div>
        </motion.div>
      );
    } else if (code >= 95) {
      weatherSpecificLayer = (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
          <div className="absolute top-0 left-0 w-full h-full bg-slate-800/20"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-white/30 animate-[pulse_1s_infinite]"></div>
        </motion.div>
      );
    }

    return (
      <div className="fixed inset-0 pointer-events-none -z-10 transition-all duration-1000 overflow-hidden">
        {baseEffects}
        {weatherSpecificLayer}
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen w-full relative overflow-hidden font-sans text-brand-text"
    >
      {/* Header */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, delay: 0.1 }}
        className="relative z-10 p-6 max-w-7xl mx-auto flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 glass rounded-2xl flex items-center justify-center shadow-glass cursor-pointer"
          >
            <span className="text-xl font-bold bg-gradient-to-r from-brand-accent to-brand-text bg-clip-text text-transparent">
              IIOT
            </span>
          </motion.div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-brand-text to-brand-accent bg-clip-text text-transparent">
            <TypewriterText text="Dashboard Hiliriset" />
          </h1>
        </div>
        <ThemeToggle />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 px-6 pb-12 max-w-7xl mx-auto">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="mb-10 max-w-md"
        >
          <h2 className="text-sm font-semibold text-brand-text/60 mb-3 uppercase tracking-wider ml-1">
            Pilih Kota
          </h2>
          <CitySelector
            currentCity={currentCity}
            onCityChange={handleCityChange}
            isLoading={isLoading}
          />
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <WeatherCard weather={weather} isLoading={isLoading} />
          </div>

          <div className="lg:col-span-4 space-y-6">
            {/* Status Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', delay: 0.4 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="glass p-7 rounded-[28px] cursor-default"
            >
              <h3 className="text-sm font-semibold text-brand-text/60 mb-5 uppercase tracking-wider">
                System Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-brand-text/80 font-medium">API Connection</span>
                  <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-200/50">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                    <span className="text-green-700 text-xs font-semibold tracking-wide">Active</span>
                  </div>
                </div>
                <div className="border-t border-white/40 pt-4 flex items-center justify-between">
                  <span className="text-brand-text/80 font-medium">Location</span>
                  <span className="text-brand-accent font-semibold capitalize">
                    {weather?.city || 'Loading...'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Info Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', delay: 0.5 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="glass p-7 rounded-[28px] cursor-default"
            >
              <h3 className="text-sm font-semibold text-brand-text/60 mb-3 uppercase tracking-wider">
                About
              </h3>
              <p className="text-brand-text/70 text-sm leading-relaxed font-medium">
                Modern Industrial IoT dashboard featuring real-time environmental data with an immersive Apple-inspired Liquid Glass UI.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {renderWeatherEffects()}
    </motion.div>
  );
}
