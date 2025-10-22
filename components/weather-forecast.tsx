"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, CloudRain, Sun, CloudSnow, Wind, Droplets } from "lucide-react"

interface WeatherDay {
  date: string
  dayName: string
  temperature: {
    high: number
    low: number
  }
  condition: string
  humidity: number
  windSpeed: number
  precipitation: number
}

interface WeatherData {
  location: string
  forecast: WeatherDay[]
}

interface WeatherForecastProps {
  destination: string
  days: number
}

const getWeatherIcon = (condition: string) => {
  switch (condition) {
    case "sunny":
      return <Sun className="w-6 h-6 text-sunshine-yellow" />
    case "partly-cloudy":
      return <Cloud className="w-6 h-6 text-gray-500" />
    case "cloudy":
      return <Cloud className="w-6 h-6 text-gray-600" />
    case "rainy":
      return <CloudRain className="w-6 h-6 text-blue-500" />
    case "snowy":
      return <CloudSnow className="w-6 h-6 text-blue-300" />
    default:
      return <Sun className="w-6 h-6 text-sunshine-yellow" />
  }
}

const getConditionText = (condition: string) => {
  switch (condition) {
    case "sunny":
      return "Sunny"
    case "partly-cloudy":
      return "Partly Cloudy"
    case "cloudy":
      return "Cloudy"
    case "rainy":
      return "Rainy"
    case "snowy":
      return "Snowy"
    default:
      return "Clear"
  }
}

const getWeatherAdvice = (condition: string, temp: number) => {
  if (condition === "rainy") return "Pack an umbrella and waterproof jacket"
  if (condition === "snowy") return "Bring warm clothes and waterproof boots"
  if (temp > 30) return "Stay hydrated and wear sunscreen"
  if (temp < 10) return "Pack warm layers and a good jacket"
  return "Perfect weather for outdoor activities"
}

export function WeatherForecast({ destination, days }: WeatherForecastProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/weather?destination=${encodeURIComponent(destination)}&days=${days}`)

        if (!response.ok) {
          throw new Error("Failed to fetch weather data")
        }

        const data = await response.json()
        setWeatherData(data.weather)
      } catch (err) {
        setError("Unable to load weather data")
        console.error("Weather fetch error:", err)
      } finally {
        setIsLoading(false)
      }
    }

    if (destination && days) {
      fetchWeather()
    }
  }, [destination, days])

  if (isLoading) {
    return (
      <Card className="glass-card border-forest-green/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-forest-green font-poppins">
            <Cloud className="w-5 h-5" />
            Weather Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest-green"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !weatherData) {
    return (
      <Card className="glass-card border-forest-green/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-forest-green font-poppins">
            <Cloud className="w-5 h-5" />
            Weather Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">{error || "Weather data unavailable"}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card border-forest-green/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-forest-green font-poppins">
          <Cloud className="w-5 h-5" />
          Weather Forecast for {weatherData.location}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Daily forecast grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {weatherData.forecast.map((day, index) => (
              <div key={day.date} className="text-center p-3 rounded-lg bg-white/50 border border-forest-green/10">
                <div className="text-xs font-medium text-navy-blue mb-1">{index === 0 ? "Today" : day.dayName}</div>
                <div className="flex justify-center mb-2">{getWeatherIcon(day.condition)}</div>
                <div className="text-sm font-semibold text-navy-blue">{day.temperature.high}°</div>
                <div className="text-xs text-gray-500">{day.temperature.low}°</div>
                <div className="text-xs text-gray-600 mt-1">{getConditionText(day.condition)}</div>
              </div>
            ))}
          </div>

          {/* Today's detailed weather */}
          {weatherData.forecast[0] && (
            <div className="p-4 rounded-lg bg-gradient-to-r from-forest-green/10 to-navy-blue/10 border border-forest-green/20">
              <h4 className="font-semibold text-navy-blue mb-3">Today's Details</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Wind: {weatherData.forecast[0].windSpeed} mph</span>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-600">Humidity: {weatherData.forecast[0].humidity}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <CloudRain className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-600">Rain: {weatherData.forecast[0].precipitation}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Weather advice */}
          {weatherData.forecast[0] && (
            <div className="p-3 rounded-lg bg-sunshine-yellow/10 border border-sunshine-yellow/30">
              <div className="flex items-start gap-2">
                <Sun className="w-4 h-4 text-sunshine-yellow mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-navy-blue">Travel Tip</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {getWeatherAdvice(weatherData.forecast[0].condition, weatherData.forecast[0].temperature.high)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
