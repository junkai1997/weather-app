import { useState, useEffect } from 'react'
import { ThemeToggle } from './components/ThemeToggle'
import { Button } from './components/ui/button'
import { weatherService } from './services/weatherService'
import type { WeatherData } from './services/weatherService'
import { useSearchHistory } from './hooks/useSearchHistory'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useTheme } from './contexts/ThemeContext'
import bgLight from './assets/bg-light.png'
import bgDark from './assets/bg-dark.png'
import cloudIcon from './assets/cloud.png'
import sunIcon from './assets/sun.png'
import { Loader, Search, Trash2 } from 'lucide-react'
import { formatDateTime } from './utils'
import { validateLocation } from './utils/locationValidation'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

const formSchema = z.object({
  city: z.string()
    .min(2, "City name must be at least 2 characters")
    .max(100, "City name must be less than 100 characters")
    .refine((value) => validateLocation(value), {
      message: "Please enter a valid city or country name",
    }),
})

function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTimestamp, setSearchTimestamp] = useState<Date | null>(null)
  const { searchHistory, addToHistory, clearHistory, removeFromHistory } = useSearchHistory()
  const { theme } = useTheme()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: "",
    },
  })

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

  const handleSearch = async (searchCity: string) => {
    if (!searchCity.trim()) return
    
    setLoading(true)
    setError(null)
    
    try {
      const data = await weatherService.getWeatherByCity(searchCity)
      setWeatherData(data)
      addToHistory(searchCity)
      setSearchTimestamp(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    handleSearch(values.city)
  }

  return (
    <div 
      className="h-screen overflow-hidden bg-background text-foreground bg-responsive"
      style={{
        backgroundImage: `url(${backgroundImage})`
      }}
    >
      {/* Content wrapper */}
      <div className="container mx-auto px-4 pt-8 max-w-[700px] h-full flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 shrink-0">
          <h1 className="text-3xl font-bold text-card-title">Today's Weather</h1>
          <ThemeToggle />
        </header>

        {/* Search Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mb-20 lg:mb-[110px]">
            <div className="flex gap-5 w-full">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        placeholder="Enter city or country name..."
                        className="dark:border-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="h-[40px] lg:h-[60px] has-[>svg]:px-[22px]">
                {loading ? <Loader className="animate-spin" /> : <Search />}
              </Button>
            </div>
          </form>
        </Form>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="mb-20 lg:mb-[110px] shrink-0 -mt-18 lg:-mt-22">
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Weather Display */}
        {weatherData && (
          <div className="px-5 lg:px-10 pt-6 bg-card/30 border dark:border-none rounded-t-[40px] relative flex-1 flex flex-col min-h-0">
            <h2 className="text-md lg:text-2xl font-semibold mb-4 shrink-0">
              {weatherData.name}, {weatherData.country}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0">
              <div className="lg:col-span-4">
                <p className="text-5xl lg:text-7xl font-bold text-card-title">{weatherData.temperature}°C</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs lg:text-sm text-muted-foreground">H: {weatherData.highestTemp}°C</p>
                  <p className="text-xs lg:text-sm text-muted-foreground">L: {weatherData.lowestTemp}°C</p>
                </div>
              </div>
              <div className="lg:col-span-4 flex flex-col-reverse items-end lg:items-center justify-between lg:flex-row">
                <p className="text-xs lg:text-sm text-card-foreground/80 font-bold hidden lg:block">
                  Feels like {weatherData.feelsLike}°C
                </p>
                <p className="text-xs lg:text-sm text-card-foreground/80">{searchTimestamp ? formatDateTime(searchTimestamp) : 'Loading...'}</p>
                <p className="text-xs lg:text-sm text-card-foreground/80">Humidity: {weatherData.humidity}%</p>
                <p className="text-xs lg:text-sm text-card-foreground/80 capitalize">{weatherData.description}</p>
              </div>
            </div>
            <div className="absolute -top-20 right-2 lg:-top-28">
              {weatherData.weatherId === 800 ? (
                <img src={sunIcon} alt="Clear sky" className="w-[157px] h-[157px] lg:w-[300px] lg:h-[300px]" />
              ) : (weatherData.weatherId && [801, 802, 803, 804].includes(weatherData.weatherId)) ? (
                <img src={cloudIcon} alt="Cloudy" className="w-[157px] h-[157px] lg:w-[300px] lg:h-[300px]" />
              ) : weatherData.weatherIconUrl ? (
                <img src={weatherData.weatherIconUrl} alt={weatherData.description} className="w-[157px] h-[157px] lg:w-[300px] lg:h-[300px]" />
              ) : null}
            </div>
            {/* Search History */}
            {searchHistory.length > 0 && (
              <div className="bg-card/60 border rounded-t-3xl p-6 flex-1 flex flex-col min-h-0 mt-4">
                <div className="flex justify-between items-center mb-4 shrink-0">
                  <h3 className="text-lg font-semibold">Search History</h3>
                  <Button variant="outline" size="sm" onClick={clearHistory} className="px-1 lg:px-3">
                    Clear All History
                  </Button>
                </div>
                <div className="flex flex-col overflow-y-auto gap-4 flex-1 min-h-0">
                  {searchHistory.map((item) => (
                    <div  className="bg-card rounded-2xl p-4 flex justify-between lg:justify-start items-center gap-2 h-[60px]" key={item.id}>
                      <div className="flex flex-col lg:flex-row lg:items-center w-full lg:justify-between">
                        <p className="text-sm font-semibold">{item.city}</p>
                        <p className="text-xs text-muted-foreground">{formatDateTime(new Date(item.timestamp))}</p>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={theme === 'light' ? 'secondary' : 'outline'}
                            size="icon"
                            onClick={() => (
                              handleSearch(item.city),
                              form.setValue('city', item.city)
                            )}
                            className="h-8"
                          >
                            {loading ? <Loader className="animate-spin" /> : <Search />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Search weather</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={theme === 'light' ? 'secondary' : 'outline'}
                            size="icon"
                            onClick={() => removeFromHistory(item.id)}
                            className="h-8"
                          >
                            {loading ? <Loader className="animate-spin" /> : <Trash2 />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Remove from history</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
