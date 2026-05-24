'use client';

import { useState, useEffect } from 'react';
import { WeatherCard } from './components/WeatherCard';
import { CitySelector } from './components/CitySelector';

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
    try {
      setIsLoading(true);
      const url = `/api/weather?lat=${lat}&lon=${lon}&cityName=${encodeURIComponent(cityName)}`;
      
      const response = await fetch(url);
      const data = await response.json();
      if (data.error) {
        console.error('API Error:', data.error);
        setWeather(null);
      } else {
        setWeather(data);
        setCurrentCity(cityName);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch Yogyakarta weather on initial load
    fetchWeather('Yogyakarta', -7.8075, 110.3694);
  }, []);

  const handleCityChange = (cityName: string, lat: number, lon: number) => {
    fetchWeather(cityName, lat, lon);
  };

  const renderWeatherEffects = () => {
    if (!weather) return (
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl opacity-20"></div>
      </div>
    );

    const code = weather.current.weatherCode;

    // Cerah (0)
    if (code === 0) {
      return (
        <div className="fixed inset-0 pointer-events-none -z-10 transition-all duration-1000">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/50 via-sky-800/40 to-orange-900/30"></div>
          <div className="absolute -top-32 -right-32 w-[40rem] h-[40rem] bg-yellow-400/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-400/10 rounded-full blur-[80px]"></div>
        </div>
      );
    }
    
    // Hujan (51-67, 80-82)
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
      return (
        <div className="fixed inset-0 pointer-events-none -z-10 transition-all duration-1000">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900/80 via-blue-950/80 to-gray-900/80"></div>
          <div className="absolute top-0 left-1/4 w-1 h-32 bg-blue-400/40 blur-[1px] animate-[bounce_1s_infinite]"></div>
          <div className="absolute top-0 left-2/4 w-1 h-24 bg-blue-400/30 blur-[1px] animate-[bounce_1.5s_infinite_0.5s]"></div>
          <div className="absolute top-0 left-3/4 w-1 h-40 bg-blue-400/50 blur-[1px] animate-[bounce_1.2s_infinite_0.2s]"></div>
        </div>
      );
    }

    // Salju (71-77, 85-86)
    if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
      return (
        <div className="fixed inset-0 pointer-events-none -z-10 transition-all duration-1000">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-800/60 via-blue-900/40 to-slate-800/60"></div>
          <div className="absolute top-10 left-1/4 w-3 h-3 bg-white/60 rounded-full blur-[2px] animate-[bounce_3s_infinite]"></div>
          <div className="absolute top-20 left-1/2 w-4 h-4 bg-white/40 rounded-full blur-[2px] animate-[pulse_4s_infinite]"></div>
          <div className="absolute top-32 left-3/4 w-2 h-2 bg-white/80 rounded-full blur-[1px] animate-[bounce_2s_infinite]"></div>
        </div>
      );
    }

    // Badai Petir (95-99)
    if (code >= 95) {
      return (
        <div className="fixed inset-0 pointer-events-none -z-10 transition-all duration-1000">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-950/90 via-purple-950/80 to-gray-950/90"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-white/5 animate-[pulse_1s_infinite]"></div>
          <div className="absolute top-10 right-1/4 w-[40rem] h-[40rem] bg-yellow-500/10 blur-[100px] animate-[ping_4s_infinite]"></div>
        </div>
      );
    }

    // Berawan / Default (1-3, 45-48)
    return (
      <div className="fixed inset-0 pointer-events-none -z-10 transition-all duration-1000">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900/60 via-slate-800/60 to-slate-900/60"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-gray-500/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-slate-500/20 rounded-full blur-3xl opacity-30"></div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Header Section */}
      <div className="relative z-10">
        {/* Top Bar */}
        <div className="glass-sm m-4 p-4 rounded-2xl flex items-center justify-between backdrop-blur-md">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 glass rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                IIOT
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent flex-1 text-center">
            Dashboard Hiliriset IIOT 2026
          </h1>

          {/* Spacer */}
          <div className="w-12"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 py-8 max-w-6xl mx-auto">
        {/* City Selector */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wide">
            Pilih Kota
          </h2>
          <CitySelector
            currentCity={currentCity}
            onCityChange={handleCityChange}
            isLoading={isLoading}
          />
        </div>

        {/* Weather Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Weather Card */}
          <WeatherCard weather={weather} isLoading={isLoading} />

          {/* Info Cards */}
          <div className="space-y-4">
            {/* Status Card */}
            <div className="glass p-6 rounded-3xl">
              <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wide">
                Status Sistem
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Koneksi API</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm font-medium">Aktif</span>
                  </div>
                </div>
                <div className="border-t border-gray-600/30 pt-3 flex items-center justify-between">
                  <span className="text-gray-400">Lokasi</span>
                  <span className="text-cyan-300 font-medium capitalize">
                    {weather?.city || 'Memuat...'}
                  </span>
                </div>
                <div className="border-t border-gray-600/30 pt-3 flex items-center justify-between">
                  <span className="text-gray-400">Timezone</span>
                  <span className="text-blue-300 text-sm font-medium">
                    {weather?.timezone || 'Asia/Jakarta'}
                  </span>
                </div>
              </div>
            </div>

            {/* Informasi Tambahan */}
            <div className="glass p-6 rounded-3xl">
              <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wide">
                Tentang Dashboard
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Dashboard Industrial IoT yang menampilkan data cuaca real-time dari berbagai kota di seluruh dunia. Data diperbarui secara berkala menggunakan API publik yang andal.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Background Gradient Overlay */}
      {renderWeatherEffects()}
    </div>
  );
}
