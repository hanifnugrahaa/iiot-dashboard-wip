# Dashboard Hiliriset IIOT 2026

Welcome to the **Industrial IoT (IIOT) Dashboard**! 

This application is built for the **SINERGI Program (Integrated Technology Transfer-Based Research Downstreaming)**, an initiative by the Directorate General of Research & Development to foster sustainable partnerships and utilize university research outcomes.

🌍 **Live Demo:** [https://iiot-dashboard-2026.vercel.app](https://iiot-dashboard-2026.vercel.app)

## 🌟 Features

- **Single Page Application (SPA) Architecture**: Seamless tab navigation without full page reloads.
- **Liquid Glass UI**: Premium, Apple-inspired glassmorphism design with Framer Motion micro-animations.
- **Dark & Light Mode**: Automated or manual theme switching using `next-themes` and custom CSS variables.
- **Comprehensive Dashboards**:
  - 🏠 **Dashboard**: Real-time weather and system status.
  - 📅 **Forecast**: 7-day weather predictions.
  - 📈 **Analytics**: Interactive charts for temperature, humidity, precipitation, and wind using `recharts`.
  - 🌡️ **Metrics**: Detailed environmental parameters (UV Index, Pressure, Dew Point, etc.).
  - 🚨 **Alerts**: Automated weather alerts based on safety thresholds.
  - 🗺️ **Map**: Interactive map with real-time location markers using `react-leaflet`.
- **Secure Authentication**: Simple, environment-variable-based login system utilizing SHA-256 hashing.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Charts & Maps**: Recharts, React-Leaflet, Leaflet
- **API**: Open-Meteo API (Server-side fetched with Next.js App Router)


