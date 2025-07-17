import { useState, useEffect } from 'react'
import { ThemeToggle } from './components/ThemeToggle'
import { Button } from './components/ui/button'
import { weatherService } from './services/weatherService'
import type { WeatherData } from './services/weatherService'
import { useSearchHistory } from './hooks/useSearchHistory'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useTheme } from './contexts/ThemeContext'
import bgLight from './assets/bg-light.png'
import bgDark from './assets/bg-dark.png'
import { Loader, Search } from 'lucide-react'

function App() {
  const [city, setCity] = useState('')
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { searchHistory, addToHistory, clearHistory } = useSearchHistory()
  const { theme } = useTheme()

  const backgroundImage = theme === 'light' ? bgLight : bgDark

  // Preload background images for better performance
  useEffect(() => {
    const preloadImages = () => {
      const lightImg = new Image()
      const darkImg = new Image()
      lightImg.src = bgLight
      darkImg.src = bgDark
    }
    preloadImages()
  }, [])

  const handleSearch = async (searchCity: string = city) => {
    if (!searchCity.trim()) return
    
    setLoading(true)
    setError(null)
    
    try {
      const data = await weatherService.getWeatherByCity(searchCity)
      setWeatherData(data)
      addToHistory(searchCity)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setWeatherData(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch()
  }

  return (
    <div 
      className="min-h-screen bg-background text-foreground bg-responsive"
      style={{
        backgroundImage: `url(${backgroundImage})`
      }}
    >
      {/* Content wrapper */}
      <div className="container mx-auto px-4 py-8 max-w-[700px]">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Today's Weather</h1>
          <ThemeToggle />
        </header>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-2 w-full">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name..."
              className="flex-1 px-3 py-2 border border-input rounded-md bg-background"
            />
            <Button type="submit" disabled={loading}>
              {loading ? <Loader className="animate-spin" /> : <Search />}
            </Button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Weather Display */}
        {weatherData && (
          <div className="mb-8 p-6 bg-card border rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">
              {weatherData.name}, {weatherData.country}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-4xl font-bold">{weatherData.temperature}°C</p>
                <p className="text-lg capitalize">{weatherData.description}</p>
                <p className="text-sm text-muted-foreground">
                  Feels like {weatherData.feelsLike}°C
                </p>
              </div>
              <div className="space-y-2">
                <p>Humidity: {weatherData.humidity}%</p>
                <p>Wind Speed: {weatherData.windSpeed} m/s</p>
                <p>Pressure: {weatherData.pressure} hPa</p>
              </div>
            </div>
          </div>
        )}

        {/* Search History */}
        {searchHistory.length > 0 && (
          <div className="bg-card border rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Search History</h3>
              <Button variant="outline" size="sm" onClick={clearHistory}>
                Clear History
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSearch(item.city)}
                  className="h-8"
                >
                  {item.city}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
