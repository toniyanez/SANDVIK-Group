"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, DollarSign, MapPin, TrendingUp } from "lucide-react"

export default function SandvikOverview() {
  // Component content remains the same...
  const businessAreas = [
    {
      name: "Sandvik Mining and Rock Solutions (SMRS)",
      revenue: "SEK 63.6 billion",
      percentage: "51%",
      description:
        "Global leader providing equipment, tools, parts, services, and technical solutions for mining and infrastructure industries.",
      color: "bg-blue-500",
    },
    {
      name: "Sandvik Manufacturing and Machining Solutions (SMMS)",
      revenue: "SEK 48.6 billion",
      percentage: "40%",
      description:
        "Global market-leading manufacturer of tools and tooling systems for advanced industrial metal cutting.",
      color: "bg-green-500",
    },
    {
      name: "Sandvik Rock Processing Solutions (SRPS)",
      revenue: "SEK 10.7 billion",
      percentage: "9%",
      description: "Prominent supplier of equipment, tools, parts, services for processing rock and minerals.",
      color: "bg-orange-500",
    },
  ]

  const keyMarkets = [
    { country: "United States", revenue: "17,739", flag: "🇺🇸" },
    { country: "Australia", revenue: "14,285", flag: "🇦🇺" },
    { country: "China", revenue: "9,123", flag: "🇨🇳" },
    { country: "Canada", revenue: "7,699", flag: "🇨🇦" },
    { country: "Germany", revenue: "6,542", flag: "🇩🇪" },
  ]

  const regionalDistribution = [
    { region: "Europe", percentage: 26, revenue: "31.95" },
    { region: "North America", percentage: 25, revenue: "30.72" },
    { region: "Asia", percentage: 18, revenue: "22.12" },
    { region: "Australia", percentage: 12, revenue: "14.75" },
    { region: "Africa/Middle East", percentage: 12, revenue: "14.75" },
    { region: "South America", percentage: 7, revenue: "8.60" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Sandvik Group Overview</h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto">
          High-tech global engineering group with three core business areas serving mining, infrastructure, and
          manufacturing industries worldwide
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue 2024</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">SEK 122.9B</div>
            <p className="text-xs text-muted-foreground">Global operations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Global Presence</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">150+</div>
            <p className="text-xs text-muted-foreground">Countries served</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Business Areas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Core divisions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Leadership</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Global</div>
            <p className="text-xs text-muted-foreground">Industry leader</p>
          </CardContent>
        </Card>
      </div>

      {/* Business Areas */}
      <Card>
        <CardHeader>
          <CardTitle>Three Main Business Areas</CardTitle>
          <CardDescription>Revenue distribution and core focus areas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {businessAreas.map((area, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{area.name}</h3>
                    <p className="text-gray-600 mt-1">{area.description}</p>
                  </div>
                  <div className="text-right ml-4">
                    <Badge variant="secondary" className="mb-2">
                      {area.percentage} of total revenue
                    </Badge>
                    <div className="font-bold text-lg">{area.revenue}</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full ${area.color}`} style={{ width: area.percentage }}></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Markets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Markets by Revenue (2024)</CardTitle>
            <CardDescription>Key country markets in MSEK</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {keyMarkets.map((market, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{market.flag}</span>
                    <span className="font-medium">{market.country}</span>
                  </div>
                  <span className="font-bold">SEK {market.revenue}M</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Regional Revenue Distribution</CardTitle>
            <CardDescription>Geographic spread of operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {regionalDistribution.map((region, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{region.region}</span>
                    <span className="text-sm text-gray-600">
                      {region.percentage}% (SEK {region.revenue}B)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${region.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dependencies and Strategic Assets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Key Strategic Assets</CardTitle>
            <CardDescription>Competitive advantages and dependencies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-green-700">Vertical Integration</h4>
                <p className="text-sm text-gray-600">
                  Tungsten supply through WBH (Austria) - mine and refinery operations
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-blue-700">Global Manufacturing</h4>
                <p className="text-sm text-gray-600">
                  Strategic production facilities across Europe, Americas, Asia, and Australia
                </p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-orange-700">Technology Leadership</h4>
                <p className="text-sm text-gray-600">
                  Industry 4.0 facilities like Gimo (world's largest carbide insert plant)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supply Chain Dependencies</CardTitle>
            <CardDescription>Critical material sourcing and risks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="font-semibold text-red-700">Cobalt Sourcing</h4>
                <p className="text-sm text-gray-600">External sourcing, 50%+ from DRC, ethical mining concerns</p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4">
                <h4 className="font-semibold text-yellow-700">Specialty Steels</h4>
                <p className="text-sm text-gray-600">Post-Alleima divestment, increased external market reliance</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-purple-700">Trade Tariffs</h4>
                <p className="text-sm text-gray-600">Exposure to US reciprocal tariffs, especially EU to US exports</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
