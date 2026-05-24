import { NextRequest, NextResponse } from 'next/server';

interface GeoLocation {
  lat: number;
  lon: number;
}

const CITIES: Record<string, GeoLocation> = {
  yogyakarta: { lat: -7.8075, lon: 110.3694 },
  jakarta: { lat: -6.2088, lon: 106.8456 },
  bandung: { lat: -6.9271, lon: 107.6411 },
  surabaya: { lat: -7.2575, lon: 112.7521 },
  medan: { lat: 3.5952, lon: 98.6722 },
  makassar: { lat: -5.3520, lon: 119.4432 },
  bali: { lat: -8.6705, lon: 115.2126 },
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get('city');
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const cityName = searchParams.get('cityName') || city;

    let location: GeoLocation;

    if (lat && lon) {
      location = {
        lat: parseFloat(lat),
        lon: parseFloat(lon),
      };
    } else if (city) {
      const normalizedCity = (city || 'yogyakarta').toLowerCase();
      location = CITIES[normalizedCity];

      if (!location) {
        return NextResponse.json(
          { error: 'City not found' },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Please provide either city name or lat/lon coordinates' },
        { status: 400 }
      );
    }

    // Enhanced Open-Meteo API call with hourly + daily + extra current data
    const apiUrl = new URL('https://api.open-meteo.com/v1/forecast');
    apiUrl.searchParams.set('latitude', String(location.lat));
    apiUrl.searchParams.set('longitude', String(location.lon));
    apiUrl.searchParams.set('current', [
      'temperature_2m',
      'relative_humidity_2m',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m',
      'apparent_temperature',
      'pressure_msl',
      'visibility',
      'dew_point_2m',
      'uv_index',
    ].join(','));
    apiUrl.searchParams.set('hourly', [
      'temperature_2m',
      'relative_humidity_2m',
      'wind_speed_10m',
      'precipitation',
    ].join(','));
    apiUrl.searchParams.set('daily', [
      'temperature_2m_max',
      'temperature_2m_min',
      'weather_code',
      'precipitation_sum',
      'wind_speed_10m_max',
      'sunrise',
      'sunset',
      'uv_index_max',
    ].join(','));
    apiUrl.searchParams.set('timezone', 'auto');
    apiUrl.searchParams.set('forecast_days', '7');

    const response = await fetch(apiUrl.toString());

    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();

    // Build hourly array (next 24 hours)
    const now = new Date();
    const hourlyData = [];
    for (let i = 0; i < Math.min(24, data.hourly.time.length); i++) {
      const time = new Date(data.hourly.time[i]);
      if (time >= new Date(now.getTime() - 60 * 60 * 1000)) {
        hourlyData.push({
          time: data.hourly.time[i],
          temperature: data.hourly.temperature_2m[i],
          humidity: data.hourly.relative_humidity_2m[i],
          windSpeed: data.hourly.wind_speed_10m[i],
          precipitation: data.hourly.precipitation[i],
        });
        if (hourlyData.length >= 24) break;
      }
    }

    // Build daily array
    const dailyData = data.daily.time.map((time: string, i: number) => ({
      date: time,
      tempMax: Math.round(data.daily.temperature_2m_max[i]),
      tempMin: Math.round(data.daily.temperature_2m_min[i]),
      weatherCode: data.daily.weather_code[i],
      weatherDescription: getWeatherDescription(data.daily.weather_code[i]),
      icon: getWeatherIcon(data.daily.weather_code[i]),
      precipitationSum: data.daily.precipitation_sum[i],
      windSpeedMax: data.daily.wind_speed_10m_max[i],
      sunrise: data.daily.sunrise[i],
      sunset: data.daily.sunset[i],
      uvIndexMax: data.daily.uv_index_max[i],
    }));

    return NextResponse.json({
      city: cityName,
      lat: location.lat,
      lon: location.lon,
      current: {
        temperature: Math.round(data.current.temperature_2m),
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m * 10) / 10,
        windDirection: data.current.wind_direction_10m,
        weatherCode: data.current.weather_code,
        weatherDescription: getWeatherDescription(data.current.weather_code),
        icon: getWeatherIcon(data.current.weather_code),
        apparentTemperature: Math.round(data.current.apparent_temperature),
        pressure: Math.round(data.current.pressure_msl),
        visibility: Math.round(data.current.visibility / 1000 * 10) / 10, // km
        dewPoint: Math.round(data.current.dew_point_2m),
        uvIndex: data.current.uv_index,
      },
      hourly: hourlyData,
      daily: dailyData,
      timezone: data.timezone,
    });
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}

function getWeatherDescription(code: number): string {
  const weatherCodes: Record<number, string> = {
    0: 'Cerah',
    1: 'Sebagian Berawan',
    2: 'Berawan',
    3: 'Mendung',
    45: 'Berkabut',
    48: 'Embun Beku',
    51: 'Drizzle Ringan',
    53: 'Drizzle Sedang',
    55: 'Drizzle Deras',
    61: 'Hujan Ringan',
    63: 'Hujan Sedang',
    65: 'Hujan Deras',
    71: 'Salju Ringan',
    73: 'Salju Sedang',
    75: 'Salju Deras',
    77: 'Butir Salju',
    80: 'Rintik Ringan',
    81: 'Rintik Sedang',
    82: 'Rintik Deras',
    85: 'Salju Ringan',
    86: 'Salju Deras',
    95: 'Badai Petir',
    96: 'Badai Petir dengan Salju',
    99: 'Badai Petir dengan Hujan Es',
  };

  return weatherCodes[code] || 'Tidak Diketahui';
}

function getWeatherIcon(code: number): string {
  if (code === 0) return '☀️';
  if (code === 1 || code === 2) return '⛅';
  if (code === 3) return '☁️';
  if (code === 45 || code === 48) return '🌫️';
  if (code >= 51 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 86) return '❄️';
  if (code >= 80 && code <= 82) return '🌧️';
  if (code >= 95) return '⛈️';
  return '🌤️';
}
