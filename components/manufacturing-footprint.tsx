"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
      coordinates: [60.6175, 16.7611],
    },
    {
      location: "Gimo, Sweden",
      businessAreas: ["SMMS"],
      products: "World's largest carbide insert plant",
      capacity: "~400 machines, 24/7 operations",
      specialization: "Industry 4.0 Lighthouse, High automation",
      coordinates: [60.1667, 17.1667],
    },
    {
      location: "Svedala, Sweden",
      businessAreas: ["SRPS"],
      products: "Crusher components, Stationary crushers",
      capacity: "6,000 sqm plant expansion (2012)",
      specialization: "Eco-friendly foundry, >92% recycled steel",
      coordinates: [55.5167, 13.2333],
    },
    {
      location: "Rovereto, Italy",
      businessAreas: ["SMMS"],
      products: "Round tools R&D and manufacturing",
      capacity: "10,000 sqm photovoltaic array",
      specialization: "Renewable energy (836,000 kWh/yr)",
      coordinates: [45.8906, 11.0396],
    },
    {
      location: "Renningen, Germany",
      businessAreas: ["SMMS"],
      products: "Tool design and manufacturing",
      capacity: "ISO 50001 certified",
      specialization: "R&D, Training, Energy efficiency",
      coordinates: [48.7667, 8.9333],
    },
  ],
  northAmerica: [
    {
      location: "Mebane, NC, USA",
      businessAreas: ["SMMS"],
      products: "US HQ & primary production",
      capacity: "167,000 sq-ft facility, >100 employees",
      specialization: "Green Factory, Automation",
      coordinates: [36.0959, -79.267],
    },
    {
      location: "Alachua, FL, USA",
      businessAreas: ["SMRS"],
      products: "Rotary drill machines",
      capacity: "Division HQ for Rotary Drilling",
      specialization: "Global surface mining equipment",
      coordinates: [29.7805, -82.4251],
    },
    {
      location: "Westminster, SC, USA",
      businessAreas: ["SMMS"],
      products: "Inserts, round tools, powder",
      capacity: "Diversified tooling components",
      specialization: "Multi-product manufacturing",
      coordinates: [34.6618, -83.1018],
    },
    {
      location: "Burlington, ON, Canada",
      businessAreas: ["SMRS"],
      products: "Mining equipment",
      capacity: "Key North American SMRS site",
      specialization: "Regional manufacturing hub",
      coordinates: [43.3255, -79.799],
    },
  ],
  asia: [
    {
      location: "Pune, India",
      businessAreas: ["SMMS", "SMRS", "SRPS"],
      products: "Global production, inserts, tools, recycling",
      capacity: "1,600 sqm facility",
      specialization: "Multi-faceted hub, R&D center",
      coordinates: [18.5204, 73.8567],
    },
    {
      location: "Langfang, China",
      businessAreas: ["SMMS"],
      products: "Tools, inserts, round tools",
      capacity: "Generates 1,645 kWh solar daily",
      specialization: "Advanced engineering solutions",
      coordinates: [39.5196, 116.703],
    },
    {
      location: "Changzhou, China",
      businessAreas: ["SMRS"],
      products: "Load & Haul, Underground Drilling",
      capacity: "10t load capacity floor, 2,000 sqm testing",
      specialization: "Strategic relocation for optimization",
      coordinates: [31.7976, 119.9742],
    },
    {
      location: "Semine, Japan",
      businessAreas: ["SMMS"],
      products: "Inserts, tools, round tools",
      capacity: "Key SMMS site for Japanese market",
      specialization: "Regional market focus",
      coordinates: [35.6762, 139.6503],
    },
  ],
  other: [
    {
      location: "Jandakot, WA, Australia",
      businessAreas: ["SRPS"],
      products: "Screening solutions, feeders, exciters",
      capacity: "~400 employees, ~1,000 tons metal reused/yr",
      specialization: "Circular economy focus, saves ~1,900 tons CO2",
      coordinates: [-32.0975, 115.8613],
    },
    {
      location: "Kempton Park, South Africa",
      businessAreas: ["SRPS", "SMRS"],
      products: "Screening solutions, workshop facilities",
      capacity: "Key SRPS location for Africa",
      specialization: "Regional hub for African market",
      coordinates: [-26.1186, 28.23],
    },
    {
      location: "Taubaté, Brazil",
      businessAreas: ["SRPS"],
      products: "Injection-molding screens",
      capacity: "Approx. 15,000 panels/year",
      specialization: "Specialized screen production",
      coordinates: [-23.0265, -45.5553],
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
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.metric}</CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
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
                  <CardHeader>
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
                  </CardHeader>
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

      {/* Key Manufacturing Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Manufacturing Excellence Highlights</CardTitle>
            <CardDescription>Key achievements and capabilities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800">Industry 4.0 Leadership</h4>
              <p className="text-sm text-green-700">
                Gimo facility designated as Industry 4.0 "Lighthouse" with 400 machines operating 24/7
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800">Sustainability Focus</h4>
              <p className="text-sm text-blue-700">
                Svedala uses &gt;92% recycled steel, Rovereto generates 836,000 kWh/yr renewable energy
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-800">Global Reach</h4>
              <p className="text-sm text-purple-700">
                Manufacturing presence across 6 continents with regional specialization
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Strategic Manufacturing Initiatives</CardTitle>
            <CardDescription>Current and planned developments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-orange-800">Regionalization Strategy</h4>
              <p className="text-sm text-orange-700">
                SMMS restructuring to improve geographical footprint and reduce cross-border complexities
              </p>
            </div>
            <div className="p-4 bg-teal-50 rounded-lg">
              <h4 className="font-semibold text-teal-800">Facility Optimization</h4>
              <p className="text-sm text-teal-700">
                Changzhou facility replacing Jiading for supply chain optimization in China
              </p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <h4 className="font-semibold text-red-800">Circular Economy</h4>
              <p className="text-sm text-red-700">Jandakot reuses ~1,000 tons metal annually, saving ~1,900 tons CO2</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
