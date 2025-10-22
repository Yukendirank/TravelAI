"use client"

import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export function TravelPlannerHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <span className="font-bold text-lg sm:text-xl">TravelAI</span>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
            How it Works
          </a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
            Examples
          </a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
            Pricing
          </a>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
          <Button size="sm">Get Started</Button>
        </div>

        <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur">
          <nav className="container mx-auto px-4 py-4 space-y-3">
            <a href="#" className="block text-sm font-medium hover:text-primary transition-colors py-2">
              How it Works
            </a>
            <a href="#" className="block text-sm font-medium hover:text-primary transition-colors py-2">
              Examples
            </a>
            <a href="#" className="block text-sm font-medium hover:text-primary transition-colors py-2">
              Pricing
            </a>
            <div className="flex flex-col gap-2 pt-2 border-t">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                Sign In
              </Button>
              <Button size="sm" className="w-full">
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
