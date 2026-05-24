export interface WeatherData {
  city: string;
  lat: number;
  lon: number;
  current: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    weatherCode: number;
    weatherDescription: string;
    icon: string;
    apparentTemperature: number;
    pressure: number;
    visibility: number;
    dewPoint: number;
    uvIndex: number;
  };
  hourly: HourlyData[];
  daily: DailyData[];
  timezone: string;
}

export interface HourlyData {
  time: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
}

export interface DailyData {
  date: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  weatherDescription: string;
  icon: string;
  precipitationSum: number;
  windSpeedMax: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
}

export type TabId = 'dashboard' | 'forecast' | 'analytics' | 'metrics' | 'alerts' | 'map';

export interface TabItem {
  id: TabId;
  label: string;
  icon: string;
}

export const TABS: TabItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'forecast', label: 'Forecast', icon: '📅' },
  { id: 'analytics', label: 'Analytics', icon: '📈' },
  { id: 'metrics', label: 'Metrics', icon: '🌡️' },
  { id: 'alerts', label: 'Alerts', icon: '🚨' },
  { id: 'map', label: 'Map', icon: '🗺️' },
];
