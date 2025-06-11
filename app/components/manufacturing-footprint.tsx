"use client"

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Factory, Zap, Recycle, Globe } from "lucide-react"

const manufacturingSites = {
  europe: [
    {
      location: "Sandviken, Sweden",
      businessAreas: ["SMMS", "SMRS"],
      products: "Cutting tools, Rock tools",
      capacity: "Major R&D center, Historical steel production",
      specialization: "Advanced materials, R&D",
    },
    {
      location: "Gimo, Sweden",
      businessAreas: ["SMMS"],
      products: "World's largest carbide insert plant",
      capacity: "~400 machines, 24/7 operations",
      specialization: "Industry 4.0 Lighthouse, High automation",
    },
    {
      location: "Svedala, Sweden",
      businessAreas: ["SRPS"],
      products: "Crusher components, Stationary crushers",
      capacity: "6,000 sqm plant expansion (2012)",
      specialization: "Eco-friendly foundry, >92% recycled steel",
    },
    {
      location: "Rovereto, Italy",
      businessAreas: ["SMMS"],
      products: "Round tools R&D and manufacturing",
      capacity: "10,000 sqm photovoltaic array",
      specialization: "Renewable energy (836,000 kWh/yr)",
    },
  ],
  northAmerica: [
    {
      location: "Mebane, NC, USA",
      businessAreas: ["SMMS"],
      products: "US HQ & primary production",
      capacity: "167,000 sq-ft facility, >100 employees",
      specialization: "Green Factory, Automation",
    },
    {
      location: "Alachua, FL, USA",
      businessAreas: ["SMRS"],
      products: "Rotary drill machines",
      capacity: "Division HQ for Rotary Drilling",
      specialization: "Global surface mining equipment",
    },
    {
      location: "Westminster, SC, USA",
      businessAreas: ["SMMS"],
      products: "Inserts, round tools, powder",
      capacity: "Diversified tooling components",
      specialization: "Multi-product manufacturing",
    },
    {
      location: "Burlington, ON, Canada",
      businessAreas: ["SMRS"],
      products: "Mining equipment",
      capacity: "Key North American SMRS site",
      specialization: "Regional manufacturing hub",
    },
  ],
  asia: [
    {
      location: "Pune, India",
      businessAreas: ["SMMS", "SMRS", "SRPS"],
      products: "Global production, inserts, tools, recycling",
      capacity: "1,600 sqm facility",
      specialization: "Multi-faceted hub, R&D center",
    },
    {
      location: "Langfang, China",
      businessAreas: ["SMMS"],
      products: "Tools, inserts, round tools",
      capacity: "Generates 1,645 kWh solar daily",
      specialization: "Advanced engineering solutions",
    },
    {
      location: "Changzhou, China",
      businessAreas: ["SMRS"],
      products: "Load & Haul, Underground Drilling",
      capacity: "10t load capacity floor, 2,000 sqm testing",
      specialization: "Strategic relocation for optimization",
    },
    {
      location: "Semine, Japan",
      businessAreas: ["SMMS"],
      products: "Inserts, tools, round tools",
      capacity: "Key SMMS site for Japanese market",
      specialization: "Regional market focus",
    },
  ],
  other: [
    {
      location: "Jandakot, WA, Australia",
      businessAreas: ["SRPS"],
      products: "Screening solutions, feeders, exciters",
      capacity: "~400 employees, ~1,000 tons metal reused/yr",
      specialization: "Circular economy focus, saves ~1,900 tons CO2",
    },
    {
      location: "Kempton Park, South Africa",
      businessAreas: ["SRPS", "SMRS"],
      products: "Screening solutions, workshop facilities",
      capacity: "Key SRPS location for Africa",
      specialization: "Regional hub for African market",
    },
    {
      location: "Taubaté, Brazil",
      businessAreas: ["SRPS"],
      products: "Injection-molding screens",
      capacity: "Approx. 15,000 panels/year",
      specialization: "Specialized screen production",
    },
  ],
}

const capacityMetrics = [
  { metric: "Total Manufacturing Sites", value: "25+", icon: Factory },
  { metric: "Countries with Production", value: "15+", icon: Globe },
  { metric: "Largest Facility", value: "Gimo (400 machines)", icon: Zap },
  { metric: "Sustainability Focus", value: "92% Recycled Steel", icon: Recycle },
]

export default function ManufacturingFootprint() {
  return (
    <div className="space-y-6">
      {/* Capacity Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {capacityMetrics.map((metric, index) => {
          const IconComponent = metric.icon
          return (
            <Card key={index}>
              <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
                <CardTitle className="text-sm font-medium">{metric.metric}</CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Regional Manufacturing */}
      <Tabs defaultValue="europe" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="europe">Europe</TabsTrigger>
          <TabsTrigger value="northAmerica">North America</TabsTrigger>
          <TabsTrigger value="asia">Asia</TabsTrigger>
          <TabsTrigger value="other">Other Regions</TabsTrigger>
        </TabsList>

        {Object.entries(manufacturingSites).map(([region, sites]) => (
          <TabsContent key={region} value={region}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sites.map((site, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <div className="flex flex-col space-y-1.5 p-6">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MapPin className="h-4 w-4" />
                      {site.location}
                    </CardTitle>
                    <CardDescription>
                      <div className="flex gap-1 flex-wrap">
                        {site.businessAreas.map((ba, idx) => (
                          <Badge key={idx} variant="secondary">
                            {ba}
                          </Badge>
                        ))}
                      </div>
                    </CardDescription>
                  </div>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700">Products:</h4>
                      <p className="text-sm">{site.products}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700">Capacity:</h4>
                      <p className="text-sm">{site.capacity}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700">Specialization:</h4>
                      <p className="text-sm text-blue-600">{site.specialization}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
