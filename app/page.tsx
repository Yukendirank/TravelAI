import { TravelPlannerHeader } from "@/components/travel-planner-header"
import { TravelPlannerForm } from "@/components/travel-planner-form"
import { Card } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10" />

      <TravelPlannerHeader />

      <main className="container mx-auto px-4 py-6 sm:py-8 relative z-10">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-balance bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              Plan Your Perfect Journey
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Let AI create personalized travel itineraries based on your budget, interests, and dreams. Discover
              amazing destinations with smart recommendations.
            </p>
          </div>

          {/* Main Planning Form */}
          <Card className="glass p-4 sm:p-6 md:p-8 shadow-2xl">
            <TravelPlannerForm />
          </Card>

          {/* Features Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
            <Card className="p-4 sm:p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-base sm:text-lg mb-2">AI-Powered Planning</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Smart algorithms create personalized itineraries based on your preferences and budget.
              </p>
            </Card>

            <Card className="p-4 sm:p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-base sm:text-lg mb-2">Interactive Maps</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Visualize your journey with detailed maps showing routes, attractions, and recommendations.
              </p>
            </Card>

            <Card className="p-4 sm:p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-base sm:text-lg mb-2">Real-time Updates</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Get live weather forecasts and activity recommendations for each day of your trip.
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
