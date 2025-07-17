import axios from 'axios'

// Using OpenWeatherMap API - get a free API key
const API_KEY = 'cf594c7b3298725b4ae0ce50febcd5dc' 
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

export interface WeatherData {
  id: number
  name: string
  country: string
  temperature: number
  description: string
  icon: string
  humidity: number
  windSpeed: number
  feelsLike: number
  pressure: number
  highestTemp?: number
  lowestTemp?: number
}

export interface WeatherApiResponse {
  coord: {
    lon: number
    lat: number
  }
  weather: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
  base: string
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
  }
  visibility: number
  wind: {
    speed: number
    deg: number
  }
  clouds: {
    all: number
  }
  dt: number
  sys: {
    type: number
    id: number
    country: string
    sunrise: number
    sunset: number
  }
  timezone: number
  id: number
  name: string
  cod: number
}

export const weatherService = {
  async getWeatherByCity(city: string): Promise<WeatherData> {
    try {
      const response = await axios.get<WeatherApiResponse>(
        `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
      )
      
      const data = response.data
      
      return {
        id: data.id,
        name: data.name,
        country: data.sys.country,
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        feelsLike: Math.round(data.main.feels_like),
        pressure: data.main.pressure,
        highestTemp: data.main.temp_max ? Math.round(data.main.temp_max) : undefined,
        lowestTemp: data.main.temp_min ? Math.round(data.main.temp_min) : undefined
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error('City not found')
        }
        throw new Error('Failed to fetch weather data')
      }
      throw error
    }
  }
}
