"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, MapPin, DollarSign, Heart, Loader2 } from "lucide-react"
import { ItineraryDisplay } from "./itinerary-display"

const interests = [
  "Adventure & Outdoor",
  "History & Culture",
  "Food & Dining",
  "Shopping",
  "Nature & Wildlife",
  "Art & Museums",
  "Nightlife",
  "Relaxation & Spa",
  "Photography",
  "Local Experiences",
]

interface Itinerary {
  title: string
  totalBudget: number
  days: Array<{
    day: number
    date: string
    activities: Array<{
      time: string
      activity: string
      cost: number
      description: string
    }>
  }>
  recommendations: {
    accommodation: string
    transportation: string
    tips: string[]
  }
}

export function TravelPlannerForm() {
  const [budget, setBudget] = useState([2000])
  const [manualBudget, setManualBudget] = useState("")
  const [useManualBudget, setUseManualBudget] = useState(false)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [destination, setDestination] = useState("")
  const [duration, setDuration] = useState("")
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedItinerary, setGeneratedItinerary] = useState<Itinerary | null>(null)

  const handleInterestChange = (interest: string, checked: boolean) => {
    if (checked) {
      setSelectedInterests([...selectedInterests, interest])
    } else {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)

    const finalBudget = useManualBudget ? Number.parseInt(manualBudget) || 2000 : budget[0]

    try {
      const response = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination,
          budget: finalBudget,
          duration,
          interests: selectedInterests,
          additionalInfo,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate itinerary")
      }

      const data = await response.json()
      setGeneratedItinerary(data.itinerary)
    } catch (error) {
      console.error("Error generating itinerary:", error)
      // You could add error handling UI here
    } finally {
      setIsGenerating(false)
    }
  }

  const handleShare = () => {
    if (navigator.share && generatedItinerary) {
      navigator.share({
        title: generatedItinerary.title,
        text: `Check out my travel itinerary for ${destination}!`,
        url: window.location.href,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  const handleExport = () => {
    // This would integrate with a PDF generation library
    alert("PDF export functionality coming soon!")
  }

  const handleCreateNew = () => {
    setGeneratedItinerary(null)
    setDestination("")
    setDuration("")
    setSelectedInterests([])
    setAdditionalInfo("")
    setBudget([2000])
    setManualBudget("")
    setUseManualBudget(false)
  }

  if (generatedItinerary) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Button onClick={handleCreateNew} variant="outline" className="mb-6 bg-transparent">
            Create New Itinerary
          </Button>
        </div>
        <ItineraryDisplay
          itinerary={generatedItinerary}
          destination={destination}
          onShare={handleShare}
          onExport={handleExport}
        />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2">Tell us about your dream trip</h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Share your preferences and let our AI create the perfect itinerary for you
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        {/* Destination */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              Destination
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="destination" className="text-xs sm:text-sm font-medium">
              Where would you like to go?
            </Label>
            <Input
              id="destination"
              placeholder="e.g., Paris, Tokyo, New York"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="mt-2 text-sm"
            />
          </CardContent>
        </Card>

        {/* Duration */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="duration" className="text-xs sm:text-sm font-medium">
              How many days?
            </Label>
            <Input
              id="duration"
              type="number"
              placeholder="e.g., 7"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="mt-2 text-sm"
              min="1"
              max="30"
            />
          </CardContent>
        </Card>
      </div>

      {/* Budget */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            Budget
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3 mb-4 p-2 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
            <Checkbox
              id="manual-budget"
              checked={useManualBudget}
              onCheckedChange={(checked) => setUseManualBudget(checked as boolean)}
              className="w-5 h-5"
            />
            <Label htmlFor="manual-budget" className="text-sm sm:text-base font-medium cursor-pointer flex-1">
              Enter custom budget amount
            </Label>
          </div>

          {useManualBudget ? (
            <div>
              <Label htmlFor="manual-budget-input" className="text-xs sm:text-sm font-medium">
                Enter your budget ($)
              </Label>
              <Input
                id="manual-budget-input"
                type="number"
                placeholder="e.g., 5000"
                value={manualBudget}
                onChange={(e) => setManualBudget(e.target.value)}
                className="mt-2 text-sm"
                min="100"
              />
            </div>
          ) : (
            <div>
              <Label className="text-xs sm:text-sm font-medium">Total budget: ${budget[0].toLocaleString()}</Label>
              <div className="mt-4">
                <Slider value={budget} onValueChange={setBudget} max={10000} min={500} step={100} className="w-full" />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>$500</span>
                  <span>$10,000+</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interests */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            Travel Interests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Label className="text-xs sm:text-sm font-medium mb-4 block">
            What are you most interested in? (Select all that apply)
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {interests.map((interest) => (
              <div
                key={interest}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors border border-transparent hover:border-primary/20"
              >
                <Checkbox
                  id={interest}
                  checked={selectedInterests.includes(interest)}
                  onCheckedChange={(checked) => handleInterestChange(interest, checked as boolean)}
                  className="w-5 h-5"
                />
                <Label htmlFor={interest} className="text-sm sm:text-base font-normal cursor-pointer flex-1">
                  {interest}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="additional-info" className="text-xs sm:text-sm font-medium">
            Any special requirements or preferences?
          </Label>
          <Textarea
            id="additional-info"
            placeholder="e.g., dietary restrictions, accessibility needs, must-see attractions..."
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            className="mt-2 text-sm"
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="text-center">
        <Button
          type="submit"
          size="lg"
          className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-lg font-semibold"
          disabled={!destination || !duration || isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Your Itinerary...
            </>
          ) : (
            "Create My Itinerary"
          )}
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          This will take a few moments to generate your personalized travel plan
        </p>
      </div>
    </form>
  )
}
