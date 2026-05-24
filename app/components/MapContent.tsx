'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { WeatherData } from '../types/weather';

// Fix Leaflet default marker icon
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapContentProps {
  weather: WeatherData;
}

export function MapContent({ weather }: MapContentProps) {
  return (
    <MapContainer
      center={[weather.lat, weather.lon]}
      zoom={10}
      style={{ height: '100%', width: '100%', borderRadius: '28px' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[weather.lat, weather.lon]} icon={icon}>
        <Popup>
          <div style={{ fontFamily: 'Inter, sans-serif', minWidth: 160 }}>
            <strong style={{ fontSize: 14 }}>{weather.city}</strong>
            <br />
            <span style={{ fontSize: 24 }}>{weather.current.icon}</span>
            <span style={{ fontSize: 20, fontWeight: 700, marginLeft: 8 }}>{weather.current.temperature}°C</span>
            <br />
            <span style={{ fontSize: 12, color: '#666' }}>{weather.current.weatherDescription}</span>
            <br />
            <span style={{ fontSize: 11, color: '#999' }}>💧 {weather.current.humidity}% • 💨 {weather.current.windSpeed} km/h</span>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
