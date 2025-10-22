"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, DollarSign, Download } from "lucide-react"
import { WeatherForecast } from "./weather-forecast"
import { ShareModal } from "./share-modal"
import { useState } from "react"

interface Activity {
  time: string
  activity: string
  type?: string
  image?: string
  cost: number
  description: string
}

interface Day {
  day: number
  date: string
  activities: Activity[]
}

interface Itinerary {
  title: string
  totalBudget: number
  currency?: string
  days: Day[]
  recommendations: {
    accommodation: string
    transportation: string
    tips: string[]
  }
}

interface ItineraryDisplayProps {
  itinerary: Itinerary
  destination: string
  onShare: () => void
  onExport: () => void
}

export function ItineraryDisplay({ itinerary, destination, onShare, onExport }: ItineraryDisplayProps) {
  const [isExporting, setIsExporting] = useState(false)

  const totalCost = itinerary.days.reduce(
    (total, day) => total + day.activities.reduce((dayTotal, activity) => dayTotal + activity.cost, 0),
    0,
  )

  const currencySymbol = itinerary.currency || "$"

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const response = await fetch("/api/export-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itinerary,
          destination,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate PDF")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${destination}-itinerary.txt`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Export error:", error)
      alert("Failed to export itinerary. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-forest-green font-poppins">{itinerary.title}</h2>
        <div className="flex justify-center gap-4 text-sm text-navy-blue">
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            <span>
              Budget: {currencySymbol}
              {itinerary.totalBudget.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            <span>
              Estimated Cost: {currencySymbol}
              {totalCost.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="text-xs text-gray-600">
          Remaining Budget: {currencySymbol}
          {(itinerary.totalBudget - totalCost).toLocaleString()}
        </div>
        <div className="flex justify-center gap-2">
          <ShareModal itinerary={itinerary} destination={destination} />
          <Button
            onClick={handleExport}
            className="flex items-center gap-2 bg-forest-green hover:bg-forest-green/90"
            disabled={isExporting}
          >
            <Download className="w-4 h-4" />
            {isExporting ? "Exporting..." : "Export PDF"}
          </Button>
        </div>
      </div>

      {/* Weather Forecast */}
      <WeatherForecast destination={destination} days={itinerary.days.length} />

      {/* Daily Itinerary */}
      <div className="space-y-4">
        {itinerary.days.map((day) => (
          <Card key={day.day} className="glass-card border-forest-green/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-forest-green font-poppins">
                <MapPin className="w-5 h-5" />
                Day {day.day} - {day.date}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {day.activities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-white/50">
                    {activity.image && (
                      <div className="flex-shrink-0">
                        <img
                          src={activity.image || "/placeholder.svg"}
                          alt={activity.activity}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-sm text-navy-blue min-w-[70px]">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-navy-blue">{activity.activity}</h4>
                      {activity.type && (
                        <Badge variant="outline" className="text-xs mt-1 mr-2">
                          {activity.type}
                        </Badge>
                      )}
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                    </div>
                    <Badge variant="secondary" className="bg-sunshine-yellow/20 text-navy-blue">
                      {currencySymbol}
                      {activity.cost.toLocaleString()}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recommendations */}
      <Card className="glass-card border-forest-green/20">
        <CardHeader>
          <CardTitle className="text-forest-green font-poppins">Travel Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-navy-blue mb-2">Accommodation</h4>
            <p className="text-sm text-gray-600">{itinerary.recommendations.accommodation}</p>
          </div>
          <div>
            <h4 className="font-semibold text-navy-blue mb-2">Transportation</h4>
            <p className="text-sm text-gray-600">{itinerary.recommendations.transportation}</p>
          </div>
          <div>
            <h4 className="font-semibold text-navy-blue mb-2">Pro Tips</h4>
            <ul className="space-y-1">
              {itinerary.recommendations.tips.map((tip, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-sunshine-yellow mt-1">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
