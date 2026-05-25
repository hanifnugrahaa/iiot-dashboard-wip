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

export type TabId = 'dashboard' | 'forecast' | 'analytics' | 'metrics' | 'alerts' | 'map' | 'settings' | 'logs';

export interface TabItem {
  id: TabId;
  label: string;
}

export const TABS: TabItem[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'forecast', label: 'Forecast' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'metrics', label: 'Metrics' },
  { id: 'alerts', label: 'Alerts' },
  { id: 'map', label: 'Map' },
  { id: 'logs', label: 'Activity Log' },
  { id: 'settings', label: 'Settings' },
];

// ── User Settings ──────────────────────────────────────────────
export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type SpeedUnit = 'kmh' | 'mph';
export type DistanceUnit = 'km' | 'miles';
export type RefreshInterval = 0 | 30 | 60 | 300; // seconds, 0 = manual

export interface AlertThresholds {
  highTemp: number;
  lowTemp: number;
  highWind: number;
  highHumidity: number;
  highUV: number;
  lowVisibility: number;
}

export interface UserSettings {
  temperatureUnit: TemperatureUnit;
  speedUnit: SpeedUnit;
  distanceUnit: DistanceUnit;
  refreshInterval: RefreshInterval;
  alertThresholds: AlertThresholds;
}

export const DEFAULT_SETTINGS: UserSettings = {
  temperatureUnit: 'celsius',
  speedUnit: 'kmh',
  distanceUnit: 'km',
  refreshInterval: 0,
  alertThresholds: {
    highTemp: 35,
    lowTemp: 5,
    highWind: 50,
    highHumidity: 90,
    highUV: 8,
    lowVisibility: 2,
  },
};

// ── Activity Log ───────────────────────────────────────────────
export type LogActionType = 'auth' | 'data' | 'export' | 'config' | 'system';

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  action: LogActionType;
  detail: string;
}
