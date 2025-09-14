"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, MapPin, Calendar, Users } from "lucide-react"

const impactStories = [
  {
    id: "story-1",
    title: "Medical Treatment Saved Maria's Life",
    beneficiary: "Maria Rodriguez",
    location: "Guatemala City, Guatemala",
    date: "2024-01-15",
    category: "Medical",
    donationAmount: 500,
    story:
      "Thanks to your generous donation, Maria was able to receive the life-saving surgery she desperately needed. The 45-year-old mother of three had been suffering from a heart condition that required immediate intervention. Your contribution covered the surgical costs and post-operative care. Maria is now recovering well and has returned to caring for her family.",
    image: "/happy-woman-with-family.jpg",
    impact: "1 life saved, 3 children can keep their mother",
  },
  {
    id: "story-2",
    title: "Education Fund Helps 20 Children",
    beneficiary: "Village School Project",
    location: "Rural Kenya",
    date: "2024-02-20",
    category: "Education",
    donationAmount: 250,
    story:
      "Your donation was part of a larger fund that provided school supplies, uniforms, and meals for 20 children in a rural Kenyan village. These children, who previously couldn't afford to attend school, are now receiving quality education. The project has a 95% attendance rate and the children are excelling in their studies.",
    image: "/children-in-school-uniforms-studying.jpg",
    impact: "20 children now have access to education",
  },
  {
    id: "story-3",
    title: "Emergency Shelter After Natural Disaster",
    beneficiary: "The Johnson Family",
    location: "Philippines",
    date: "2024-03-10",
    category: "Emergency",
    donationAmount: 300,
    story:
      "When Typhoon Maring destroyed the Johnson family's home, they were left with nothing. Your emergency donation helped provide temporary shelter, clean water, and basic necessities for the family of five. They've since been able to rebuild their home and are back on their feet, grateful for the support during their darkest hour.",
    image: "/family-rebuilding-home-after-disaster.jpg",
    impact: "1 family housed, 5 people given hope",
  },
]

export function ImpactStories() {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Medical":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "Education":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "Emergency":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100"
      case "Food":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">Your Impact in Action</h3>
        <p className="text-muted-foreground">See how your donations have changed lives around the world</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {impactStories.map((story) => (
          <Card key={story.id} className="hover:shadow-lg transition-all duration-300 animate-fade-in-up">
            <div className="aspect-video w-full overflow-hidden rounded-t-lg">
              <img src={story.image || "/placeholder.svg"} alt={story.title} className="w-full h-full object-cover" />
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge className={getCategoryColor(story.category)}>{story.category}</Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(story.date).toLocaleDateString()}
                </div>
              </div>
              <CardTitle className="text-xl">{story.title}</CardTitle>
              <CardDescription>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {story.beneficiary}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {story.location}
                  </span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">{story.story}</p>

              <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Your Contribution</span>
                  <span className="text-lg font-bold text-primary">${story.donationAmount}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <strong>Impact:</strong> {story.impact}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Heart className="h-4 w-4 text-red-500 fill-current" />
                <span className="text-sm text-muted-foreground">Thank you for making this possible</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {impactStories.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-muted/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No impact stories yet</h3>
          <p className="text-muted-foreground">
            Once your donations help complete cases, you'll see the amazing impact stories here.
          </p>
        </div>
      )}
    </div>
  )
}
