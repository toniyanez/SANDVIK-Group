"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { Badge } from "@/components/ui/badge"
import { MapPin, DollarSign, TrendingUp, Users } from "lucide-react"
import WorldMap from "./world-map"

const businessAreas = [
  {
    name: "Mining and Rock Solutions (SMRS)",
    revenue: 63607,
    percentage: 51.8,
    color: "#0088FE",
    description: "Equipment, tools, parts, services for mining and infrastructure",
  },
  {
    name: "Manufacturing and Machining Solutions (SMMS)",
    revenue: 48567,
    percentage: 39.5,
    color: "#00C49F",
    description: "Tools and tooling systems for industrial metal cutting",
  },
  {
    name: "Rock Processing Solutions (SRPS)",
    revenue: 10704,
    percentage: 8.7,
    color: "#FFBB28",
    description: "Equipment and solutions for rock and mineral processing",
  },
]

const topMarkets = [
  { country: "USA", revenue: 17739, flag: "🇺🇸" },
  { country: "Australia", revenue: 14285, flag: "🇦🇺" },
  { country: "China", revenue: 9123, flag: "🇨🇳" },
  { country: "Canada", revenue: 7699, flag: "🇨🇦" },
  { country: "Germany", revenue: 6542, flag: "🇩🇪" },
  { country: "Mexico", revenue: 5145, flag: "🇲🇽" },
  { country: "South Africa", revenue: 4823, flag: "🇿🇦" },
  { country: "Italy", revenue: 3603, flag: "🇮🇹" },
]

const regionalDistribution = [
  { region: "Europe", percentage: 26, revenue: 31950 },
  { region: "North America", percentage: 25, revenue: 30720 },
  { region: "Asia", percentage: 18, revenue: 22120 },
  { region: "Australia", percentage: 12, revenue: 14750 },
  { region: "Africa/Middle East", percentage: 12, revenue: 14750 },
  { region: "South America", percentage: 7, revenue: 8600 },
]

export default function SandvikOverview() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue 2024</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">SEK 122.9B</div>
            <p className="text-xs text-muted-foreground">Global operations across 150+ countries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Business Areas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">SMRS, SMMS, SRPS divisions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manufacturing Sites</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25+</div>
            <p className="text-xs text-muted-foreground">Global production facilities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Market</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">🇺🇸 USA</div>
            <p className="text-xs text-muted-foreground">SEK 17.7B revenue (14.4%)</p>
          </CardContent>
        </Card>
      </div>

      {/* World Map */}
      <WorldMap />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Areas Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Business Areas Revenue Distribution</CardTitle>
            <CardDescription>2024 Revenue by Business Area (SEK Million)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={businessAreas}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="revenue"
                  >
                    {businessAreas.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`SEK ${value}M`, "Revenue"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {businessAreas.map((area, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: area.color }} />
                    <span className="text-sm font-medium">{area.name}</span>
                  </div>
                  <Badge variant="secondary">SEK {area.revenue}M</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Markets */}
        <Card>
          <CardHeader>
            <CardTitle>Top Markets by Revenue</CardTitle>
            <CardDescription>2024 Revenue by Country (SEK Million)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topMarkets}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="country" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`SEK ${value}M`, "Revenue"]} />
                  <Bar dataKey="revenue" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regional Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Global Regional Distribution</CardTitle>
          <CardDescription>Revenue distribution across major regions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {regionalDistribution.map((region, index) => (
              <div key={index} className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{region.percentage}%</div>
                <div className="text-sm font-medium text-gray-700">{region.region}</div>
                <div className="text-xs text-gray-500">SEK {region.revenue}M</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Business Area Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {businessAreas.map((area, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{area.name}</CardTitle>
              <CardDescription>{area.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Revenue:</span>
                  <span className="font-semibold">SEK {area.revenue}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Share:</span>
                  <span className="font-semibold">{area.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${area.percentage}%`,
                      backgroundColor: area.color,
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
