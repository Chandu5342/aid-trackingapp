"use client"

import { useState } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Users, Shield, TrendingUp } from "lucide-react"

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(true)
  const [showRegister, setShowRegister] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-primary/10 p-4 rounded-full">
              <Heart className="h-12 w-12 text-primary animate-pulse-success" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-4">
            Aid<span className="text-primary">Track</span>
          </h1>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Transparent humanitarian aid tracking platform connecting volunteers, NGOs, donors, and service providers
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-slide-in-right">
          <Card className="text-center border-primary/20 hover:border-primary/40 transition-colors">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">1,000+</div>
              <div className="text-sm text-muted-foreground">Active Volunteers</div>
            </CardContent>
          </Card>
          <Card className="text-center border-primary/20 hover:border-primary/40 transition-colors">
            <CardContent className="pt-6">
              <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Verified Cases</div>
            </CardContent>
          </Card>
          <Card className="text-center border-primary/20 hover:border-primary/40 transition-colors">
            <CardContent className="pt-6">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">$50K+</div>
              <div className="text-sm text-muted-foreground">Funds Distributed</div>
            </CardContent>
          </Card>
        </div>

        {/* Auth Section */}
        <div className="max-w-md mx-auto">
          <div className="flex gap-2 mb-6">
            <Button
              variant={showLogin ? "default" : "outline"}
              onClick={() => {
                setShowLogin(true)
                setShowRegister(false)
              }}
              className="flex-1"
            >
              Sign In
            </Button>
            <Button
              variant={showRegister ? "default" : "outline"}
              onClick={() => {
                setShowLogin(false)
                setShowRegister(true)
              }}
              className="flex-1"
            >
              Register
            </Button>
          </div>

          {showLogin && <LoginForm />}
          {showRegister && <RegisterForm />}
        </div>
      </div>
    </div>
  )
}
