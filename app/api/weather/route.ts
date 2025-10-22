import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const destination = searchParams.get("destination")
    const days = Number.parseInt(searchParams.get("days") || "7")

    if (!destination) {
      return NextResponse.json({ error: "Destination is required" }, { status: 400 })
    }

    const mockWeatherData = {
      location: destination,
      forecast: Array.from({ length: days }, (_, index) => {
        const date = new Date()
        date.setDate(date.getDate() + index)

        const conditions = ["sunny", "partly-cloudy", "cloudy", "rainy"]
        const condition = conditions[Math.floor(Math.random() * conditions.length)]

        return {
          date: date.toISOString().split("T")[0],
          dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
          temperature: {
            high: Math.round(Math.random() * 15 + 20), // 20-35°C
            low: Math.round(Math.random() * 10 + 10), // 10-20°C
          },
          condition,
          humidity: Math.round(Math.random() * 40 + 40), // 40-80%
          windSpeed: Math.round(Math.random() * 10 + 5), // 5-15 mph
          precipitation: condition === "rainy" ? Math.round(Math.random() * 50 + 20) : Math.round(Math.random() * 20),
        }
      }),
    }

    return NextResponse.json({ weather: mockWeatherData })
  } catch (error) {
    console.error("Error fetching weather:", error)
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 })
  }
}
