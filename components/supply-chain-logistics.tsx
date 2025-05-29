"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Truck, Ship, Plane, Train, TrendingUp, AlertCircle } from "lucide-react"

const transportModes = [
  {
    mode: "Sea Freight",
    icon: Ship,
    usage: "Heavy equipment, bulk materials",
    costRange: "$10-60/ton",
    timeRange: "15-45 days",
    advantages: ["Low cost for bulk", "High capacity"],
    challenges: ["Long transit times", "Port congestion"],
  },
  {
    mode: "Air Freight",
    icon: Plane,
    usage: "Cutting tools, urgent deliveries",
    costRange: "$4-12/kg",
    timeRange: "1-3 days",
    advantages: ["Fast delivery", "High value items"],
    challenges: ["High cost", "Weight limitations"],
  },
  {
    mode: "Road Freight",
    icon: Truck,
    usage: "Regional distribution, final mile",
    costRange: "€1.40-2.00/km",
    timeRange: "1-5 days",
    advantages: ["Door-to-door", "Flexible routing"],
    challenges: ["Distance limitations", "Fuel costs"],
  },
  {
    mode: "Rail Freight",
    icon: Train,
    usage: "Inland transport, bulk materials",
    costRange: "$0.05-0.15/ton-km",
    timeRange: "3-10 days",
    advantages: ["Cost effective", "Environmental"],
    challenges: ["Limited routes", "Intermodal needs"],
  },
]

const logisticsCosts = [
  { route: "Sweden → USA", heavy: 15000, tools: 8, mode: "Sea/Air" },
  { route: "China → Europe", heavy: 12000, tools: 6, mode: "Sea/Air" },
  { route: "Australia → USA", heavy: 18000, tools: 10, mode: "Sea/Air" },
  { route: "Germany → China", heavy: 14000, tools: 7, mode: "Sea/Air" },
  { route: "India → USA", heavy: 16000, tools: 9, mode: "Sea/Air" },
]

const tariffImpact = [
  { product: "Rock Drills", origin: "Sweden", destination: "USA", baseTariff: 0, reciprocalTariff: 10, total: 10 },
  { product: "Crushers", origin: "Sweden", destination: "USA", baseTariff: 0, reciprocalTariff: 10, total: 10 },
  { product: "Cutting Tools", origin: "Germany", destination: "USA", baseTariff: 0, reciprocalTariff: 10, total: 10 },
  { product: "Cutting Tools", origin: "Sweden", destination: "China", baseTariff: 8, reciprocalTariff: 0, total: 8 },
  {
    product: "Mining Equipment",
    origin: "Australia",
    destination: "USA",
    baseTariff: 0,
    reciprocalTariff: 10,
    total: 10,
  },
]

const modeDistribution = [
  { name: "Sea Freight", value: 65, color: "#0088FE" },
  { name: "Road Freight", value: 20, color: "#00C49F" },
  { name: "Air Freight", value: 10, color: "#FFBB28" },
  { name: "Rail Freight", value: 5, color: "#FF8042" },
]

const costFactors = [
  { factor: "Fuel Prices", impact: "High", description: "Volatile oil prices affect all transport modes" },
  { factor: "Distance", impact: "High", description: "Primary cost driver for all logistics" },
  { factor: "Cargo Type", impact: "Medium", description: "Heavy equipment vs. tools require different handling" },
  { factor: "Port Congestion", impact: "Medium", description: "Delays increase costs and lead times" },
  { factor: "Seasonal Demand", impact: "Medium", description: "Peak seasons drive up freight rates" },
  { factor: "Currency Fluctuation", impact: "Low", description: "Exchange rates affect international shipping" },
]

export default function SupplyChainLogistics() {
  return (
    <div className="space-y-6">
      {/* Transport Modes Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {transportModes.map((mode, index) => {
          const IconComponent = mode.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <IconComponent className="h-5 w-5" />
                  {mode.mode}
                </CardTitle>
                <CardDescription>{mode.usage}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm font-semibold text-gray-700">Cost Range:</div>
                  <div className="text-sm text-blue-600">{mode.costRange}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-700">Transit Time:</div>
                  <div className="text-sm text-green-600">{mode.timeRange}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-700">Advantages:</div>
                  <div className="flex flex-wrap gap-1">
                    {mode.advantages.map((adv, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {adv}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Logistics Costs by Route */}
        <Card>
          <CardHeader>
            <CardTitle>Logistics Costs by Major Routes</CardTitle>
            <CardDescription>Cost comparison for heavy equipment vs. cutting tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={logisticsCosts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="route" angle={-45} textAnchor="end" height={80} />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="heavy" fill="#0088FE" name="Heavy Equipment ($)" />
                  <Bar yAxisId="right" dataKey="tools" fill="#00C49F" name="Tools ($/kg)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Transport Mode Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Transport Mode Distribution</CardTitle>
            <CardDescription>Usage by volume across Sandvik's logistics network</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={modeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {modeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tariff Impact Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Tariff Impact on Key Products
          </CardTitle>
          <CardDescription>Current tariff rates affecting Sandvik's exports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Product</th>
                  <th className="text-left p-2">Origin</th>
                  <th className="text-left p-2">Destination</th>
                  <th className="text-left p-2">Base Tariff (%)</th>
                  <th className="text-left p-2">Reciprocal Tariff (%)</th>
                  <th className="text-left p-2">Total Impact (%)</th>
                </tr>
              </thead>
              <tbody>
                {tariffImpact.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2">{item.product}</td>
                    <td className="p-2">{item.origin}</td>
                    <td className="p-2">{item.destination}</td>
                    <td className="p-2">{item.baseTariff}%</td>
                    <td className="p-2">
                      <Badge variant={item.reciprocalTariff > 0 ? "destructive" : "secondary"}>
                        {item.reciprocalTariff}%
                      </Badge>
                    </td>
                    <td className="p-2">
                      <Badge variant={item.total > 5 ? "destructive" : "secondary"}>{item.total}%</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Cost Factors Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Logistics Cost Factors
          </CardTitle>
          <CardDescription>Key factors influencing transportation costs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {costFactors.map((factor, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{factor.factor}</h4>
                  <Badge
                    variant={
                      factor.impact === "High" ? "destructive" : factor.impact === "Medium" ? "default" : "secondary"
                    }
                  >
                    {factor.impact}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{factor.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Logistics Optimization Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Challenges</CardTitle>
            <CardDescription>Key logistics challenges facing Sandvik</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-red-50 rounded-lg">
              <h4 className="font-semibold text-red-800">US Reciprocal Tariffs</h4>
              <p className="text-sm text-red-700">
                10% additional tariffs on EU exports to USA affecting major revenue streams
              </p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-orange-800">Shipping Route Disruptions</h4>
              <p className="text-sm text-orange-700">Red Sea disruptions increasing freight costs and transit times</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold text-yellow-800">Fuel Price Volatility</h4>
              <p className="text-sm text-yellow-700">Fluctuating energy costs impacting all transport modes</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Optimization Strategies</CardTitle>
            <CardDescription>Recommended approaches for logistics improvement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800">Regionalization</h4>
              <p className="text-sm text-green-700">Reduce cross-border shipments through regional manufacturing</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800">Route Optimization</h4>
              <p className="text-sm text-blue-700">Dynamic routing to avoid congested ports and high-cost corridors</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-800">Modal Shift</h4>
              <p className="text-sm text-purple-700">Optimize transport mode selection based on cost-time trade-offs</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
