import { type NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const currencyMap: Record<string, { symbol: string; rate: number }> = {
  "United States": { symbol: "$", rate: 1 },
  "United Kingdom": { symbol: "£", rate: 0.79 },
  Europe: { symbol: "€", rate: 0.85 },
  Japan: { symbol: "¥", rate: 110 },
  Canada: { symbol: "C$", rate: 1.25 },
  Australia: { symbol: "A$", rate: 1.35 },
  India: { symbol: "₹", rate: 75 },
  China: { symbol: "¥", rate: 6.5 },
  Brazil: { symbol: "R$", rate: 5.2 },
  Mexico: { symbol: "$", rate: 20 },
}

const activityTemplates = [
  {
    morning: [
      { name: "Historic District Walking Tour", type: "history", image: "/historic-district-walking-tour.jpg" },
      { name: "Local Market Exploration", type: "culture", image: "/bustling-local-market-with-vendors.jpg" },
      { name: "Museum Visit", type: "culture", image: "/art-museum-gallery-interior.jpg" },
      { name: "Sunrise Photography Tour", type: "adventure", image: "/sunrise-landscape-photography.jpg" },
      { name: "Traditional Breakfast Experience", type: "food", image: "/traditional-breakfast-spread.jpg" },
      { name: "Architecture Tour", type: "history", image: "/historic-architecture-buildings.jpg" },
      { name: "Park and Gardens Visit", type: "nature", image: "/beautiful-botanical-gardens.jpg" },
      { name: "Cultural Heritage Site", type: "history", image: "/cultural-heritage-monument.jpg" },
    ],
    afternoon: [
      { name: "Local Cuisine Experience", type: "food", image: "/local-cuisine-restaurant-dining.jpg" },
      { name: "Shopping District Tour", type: "shopping", image: "/busy-shopping-street-with-stores.jpg" },
      { name: "Art Gallery Visit", type: "culture", image: "/modern-art-gallery-with-paintings.jpg" },
      { name: "Boat/River Cruise", type: "adventure", image: "/scenic-boat-cruise-on-river.jpg" },
      { name: "Cooking Class", type: "food", image: "/hands-on-cooking-class-kitchen.jpg" },
      { name: "Neighborhood Exploration", type: "culture", image: "/charming-neighborhood-streets.jpg" },
      { name: "Local Craft Workshop", type: "culture", image: "/traditional-craft-workshop-artisan.jpg" },
      { name: "Traditional Performance", type: "entertainment", image: "/traditional-cultural-performance-stage.jpg" },
    ],
    evening: [
      { name: "Sunset Viewpoint", type: "nature", image: "/stunning-sunset-viewpoint-cityscape.jpg" },
      { name: "Night Market Visit", type: "culture", image: "/bustling-local-market-with-vendors.jpg" },
      { name: "Cultural Show", type: "entertainment", image: "/traditional-cultural-performance-stage.jpg" },
      { name: "Rooftop Dining", type: "food", image: "/local-cuisine-restaurant-dining.jpg" },
      { name: "Evening City Walk", type: "culture", image: "/charming-neighborhood-streets.jpg" },
      { name: "Local Bar/Cafe Experience", type: "nightlife", image: "/local-cuisine-restaurant-dining.jpg" },
      {
        name: "Traditional Music Performance",
        type: "entertainment",
        image: "/traditional-cultural-performance-stage.jpg",
      },
      { name: "Night Photography Tour", type: "adventure", image: "/stunning-sunset-viewpoint-cityscape.jpg" },
    ],
  },
]

function getCurrencyInfo(destination: string) {
  // Simple destination to currency mapping
  const destLower = destination.toLowerCase()
  if (destLower.includes("london") || destLower.includes("uk") || destLower.includes("britain")) {
    return currencyMap["United Kingdom"]
  }
  if (
    destLower.includes("paris") ||
    destLower.includes("rome") ||
    destLower.includes("berlin") ||
    destLower.includes("madrid")
  ) {
    return currencyMap["Europe"]
  }
  if (destLower.includes("tokyo") || destLower.includes("osaka") || destLower.includes("japan")) {
    return currencyMap["Japan"]
  }
  if (destLower.includes("toronto") || destLower.includes("vancouver") || destLower.includes("canada")) {
    return currencyMap["Canada"]
  }
  if (destLower.includes("sydney") || destLower.includes("melbourne") || destLower.includes("australia")) {
    return currencyMap["Australia"]
  }
  if (destLower.includes("mumbai") || destLower.includes("delhi") || destLower.includes("india")) {
    return currencyMap["India"]
  }
  if (destLower.includes("beijing") || destLower.includes("shanghai") || destLower.includes("china")) {
    return currencyMap["China"]
  }
  if (destLower.includes("rio") || destLower.includes("sao paulo") || destLower.includes("brazil")) {
    return currencyMap["Brazil"]
  }
  if (destLower.includes("mexico city") || destLower.includes("cancun") || destLower.includes("mexico")) {
    return currencyMap["Mexico"]
  }
  // Default to USD
  return currencyMap["United States"]
}

function getRandomActivity(timeSlot: "morning" | "afternoon" | "evening", usedActivities: Set<string>) {
  const activities = activityTemplates[0][timeSlot]
  const availableActivities = activities.filter((activity) => !usedActivities.has(activity.name))

  if (availableActivities.length === 0) {
    // Reset if all activities used
    usedActivities.clear()
    return activities[Math.floor(Math.random() * activities.length)]
  }

  const selected = availableActivities[Math.floor(Math.random() * availableActivities.length)]
  usedActivities.add(selected.name)
  return selected
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { destination, budget, duration, interests, additionalInfo } = body

    const durationDays = Number.parseInt(duration, 10)
    const currency = getCurrencyInfo(destination)
    const convertedBudget = budget

    console.log("[v0] Generating itinerary for:", { destination, durationDays, budget, convertedBudget })

    const usedMorningActivities = new Set<string>()
    const usedAfternoonActivities = new Set<string>()
    const usedEveningActivities = new Set<string>()

    const mockItinerary = {
      title: `${durationDays}-Day Adventure in ${destination}`,
      totalBudget: convertedBudget,
      currency: currency.symbol,
      days: Array.from({ length: durationDays }, (_, index) => {
        const morningActivity = getRandomActivity("morning", usedMorningActivities)
        const afternoonActivity = getRandomActivity("afternoon", usedAfternoonActivities)
        const eveningActivity = getRandomActivity("evening", usedEveningActivities)

        const morningCost = Math.round(convertedBudget * 0.08)
        const afternoonCost = Math.round(convertedBudget * 0.12)
        const eveningCost = Math.round(convertedBudget * 0.1)

        return {
          day: index + 1,
          date: new Date(Date.now() + index * 24 * 60 * 60 * 1000).toLocaleDateString(),
          activities: [
            {
              time: "9:00 AM",
              activity: `${morningActivity.name} in ${destination}`,
              type: morningActivity.type,
              image: morningActivity.image,
              cost: morningCost,
              description: `Start your day exploring ${destination} with this engaging morning activity`,
            },
            {
              time: "1:00 PM",
              activity: afternoonActivity.name,
              type: afternoonActivity.type,
              image: afternoonActivity.image,
              cost: afternoonCost,
              description: "Immerse yourself in the local culture and flavors",
            },
            {
              time: "6:00 PM",
              activity: interests.includes("Adventure & Outdoor")
                ? `Adventure ${eveningActivity.name}`
                : interests.includes("History & Culture")
                  ? `Cultural ${eveningActivity.name}`
                  : eveningActivity.name,
              type: eveningActivity.type,
              image: eveningActivity.image,
              cost: eveningCost,
              description: interests.includes("Adventure & Outdoor")
                ? "Exciting outdoor adventure based on your interests"
                : interests.includes("History & Culture")
                  ? "Discover the rich history and culture of the area"
                  : "End your day with a memorable experience",
            },
          ],
        }
      }),
      recommendations: {
        accommodation: `Budget-friendly hotels in ${destination} (${currency.symbol}${Math.round(convertedBudget * 0.25)}/night)`,
        transportation: `Local transport and travel options in ${destination}`,
        tips: [
          "Book accommodations in advance for better rates",
          "Try local street food and markets",
          "Learn basic local phrases",
          "Keep copies of important documents",
          "Check local customs and etiquette",
        ],
      },
    }

    console.log("[v0] Generated itinerary with", durationDays, "days")
    return NextResponse.json({ itinerary: mockItinerary })
  } catch (error) {
    console.error("Error generating itinerary:", error)
    return NextResponse.json({ error: "Failed to generate itinerary" }, { status: 500 })
  }
}
