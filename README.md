# Weather App

A modern, responsive weather application built with React, TypeScript, and Tailwind CSS.

## Features

- 🌤️ Real-time weather data from OpenWeatherMap API
- 🌍 Search by city or country name with validation
- 📱 Fully responsive design
- 🌙 Dark/Light theme toggle
- 📊 Search history with local storage
- ⚡ Custom weather icons for clear and cloudy conditions
- 🎨 Beautiful gradient backgrounds

## Tech Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Shadcn/UI** components
- **React Hook Form** with Zod validation
- **OpenWeatherMap API** for weather data
- **Lucide React** for icons

## Installation

1. Clone the repository:
```bash
git clone https://github.com/junkai1997/weather-app.git
cd weather-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file and add your OpenWeatherMap API key:
```
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

## Build for Production

```bash
npm run build
npm run preview
```

## License

MIT License