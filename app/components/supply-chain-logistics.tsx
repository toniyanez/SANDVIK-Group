"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import {
  Truck,
  Ship,
  Plane,
  Train,
  AlertCircle,
  Brain,
  TrendingUp,
  CheckCircle,
  Loader2,
  Zap,
  AlertTriangle,
} from "lucide-react"

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

const modeDistribution = [
  { name: "Sea Freight", value: 65, color: "#0088FE" },
  { name: "Road Freight", value: 20, color: "#00C49F" },
  { name: "Air Freight", value: 10, color: "#FFBB28" },
  { name: "Rail Freight", value: 5, color: "#FF8042" },
]

export default function SupplyChainLogistics() {
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [digitalTwinData, setDigitalTwinData] = useState<any>(null)
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false)
  const [isLoadingTwin, setIsLoadingTwin] = useState(false)

  const generateAIAnalysis = async () => {
    setIsLoadingAnalysis(true)
    try {
      const response = await fetch("/api/ai-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentData: {
            revenue: 122900,
            margin: 15.2,
            keyMarkets: ["USA", "Australia", "China"],
            currentTariffs: { usEu: 10, chinaUs: 8 },
          },
        }),
      })
      const data = await response.json()
      setAiAnalysis(data)
    } catch (error) {
      console.error("Failed to generate AI analysis:", error)
    } finally {
      setIsLoadingAnalysis(false)
    }
  }

  const generateDigitalTwin = async () => {
    setIsLoadingTwin(true)
    try {
      const response = await fetch("/api/digital-twin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timeframe: "6-month",
          factors: ["tariffs", "logistics", "materials", "geopolitical"],
        }),
      })
      const data = await response.json()
      setDigitalTwinData(data)
    } catch (error) {
      console.error("Failed to generate digital twin:", error)
    } finally {
      setIsLoadingTwin(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Transport Modes Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {transportModes.map((mode, index) => {
          const IconComponent = mode.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <div className="flex flex-col space-y-1.5 p-6">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <IconComponent className="h-5 w-5" />
                  {mode.mode}
                </CardTitle>
                <CardDescription>{mode.usage}</CardDescription>
              </div>
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

      {/* Real AI-Powered Tariff & Trade Risk Analysis */}
      <Card>
        <div className="flex flex-col space-y-1.5 p-6">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Real-Time AI Tariff & Trade Risk Analysis
          </CardTitle>
          <CardDescription>
            Live OpenAI-powered analysis of global trade policies and their impact on Sandvik's operations
          </CardDescription>
        </div>
        <CardContent>
          {!aiAnalysis ? (
            <div className="text-center py-8">
              <Button onClick={generateAIAnalysis} disabled={isLoadingAnalysis} className="flex items-center gap-2">
                {isLoadingAnalysis ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
                {isLoadingAnalysis ? "Analyzing with OpenAI..." : "Generate AI-Powered Analysis"}
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                Using OpenAI GPT-4 to analyze current trade policies and generate strategic recommendations
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* AI-Generated Scenarios */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  AI-Generated Tariff Scenarios
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiAnalysis.scenarios?.map((scenario: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-medium">{scenario.scenario}</h5>
                        <div className="flex gap-2">
                          <Badge
                            variant={
                              scenario.impact === "Critical Risk"
                                ? "destructive"
                                : scenario.impact === "High Risk"
                                  ? "destructive"
                                  : scenario.impact === "Medium Risk"
                                    ? "default"
                                    : "secondary"
                            }
                          >
                            {scenario.impact}
                          </Badge>
                          <Badge variant="outline">{scenario.probability}% probability</Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                        <div>
                          <span className="text-gray-600">US-EU:</span> {scenario.usEuTariff}%
                        </div>
                        <div>
                          <span className="text-gray-600">China-US:</span> {scenario.chinaUsTariff}%
                        </div>
                        <div>
                          <span className="text-gray-600">EU-China:</span> {scenario.euChinaTariff}%
                        </div>
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Revenue Impact:</span>
                          <span className={scenario.revenue > 122900 ? "text-green-600" : "text-red-600"}>
                            SEK {scenario.revenue}M
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Margin Impact:</span>
                          <span className={scenario.margin > 15.2 ? "text-green-600" : "text-red-600"}>
                            {scenario.margin}%
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">{scenario.reasoning}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Risk Assessment */}
              {aiAnalysis.riskAssessment && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>AI Risk Assessment: {aiAnalysis.riskAssessment.overallRisk} Risk Level</AlertTitle>
                  <AlertDescription>
                    <div className="mt-2 space-y-2">
                      <div>
                        <strong>Key Threats:</strong>
                        <ul className="list-disc list-inside text-sm">
                          {aiAnalysis.riskAssessment.keyThreats?.map((threat: string, index: number) => (
                            <li key={index}>{threat}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <strong>Opportunities:</strong>
                        <ul className="list-disc list-inside text-sm">
                          {aiAnalysis.riskAssessment.opportunities?.map((opportunity: string, index: number) => (
                            <li key={index}>{opportunity}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* AI Strategic Responses */}
              <div>
                <h4 className="font-semibold mb-4">AI-Generated Strategic Responses</h4>
                <div className="space-y-4">
                  {aiAnalysis.strategicResponses?.map((response: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h5 className="font-medium">{response.title}</h5>
                          <p className="text-sm text-gray-600">{response.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge
                            variant={
                              response.priority === "Critical"
                                ? "destructive"
                                : response.priority === "High"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {response.priority}
                          </Badge>
                          <Badge variant="outline">{response.confidence}% confidence</Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                        <div className="text-center p-2 bg-blue-50 rounded">
                          <div className="text-xs text-gray-600">Timeline</div>
                          <div className="font-semibold text-sm">{response.timeline}</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded">
                          <div className="text-xs text-gray-600">Investment</div>
                          <div className="font-semibold text-sm">{response.investment}</div>
                        </div>
                        <div className="text-center p-2 bg-purple-50 rounded">
                          <div className="text-xs text-gray-600">Expected ROI</div>
                          <div className="font-semibold text-sm">{response.expectedROI}</div>
                        </div>
                        <div className="text-center p-2 bg-orange-50 rounded">
                          <div className="text-xs text-gray-600">Risk Mitigation</div>
                          <div className="font-semibold text-xs">{response.riskMitigation}</div>
                        </div>
                      </div>

                      <div>
                        <h6 className="font-medium text-sm mb-1">Key Actions:</h6>
                        <ul className="space-y-1">
                          {response.keyActions?.map((action: string, actionIndex: number) => (
                            <li key={actionIndex} className="flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-xs">{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Real AI Digital Twin */}
      <Card>
        <div className="flex flex-col space-y-1.5 p-6">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            AI Digital Twin: Supply Chain Interdependency Modeling
          </CardTitle>
          <CardDescription>
            Real-time AI modeling of complex interdependencies among tariffs, logistics, materials, and geopolitics
          </CardDescription>
        </div>
        <CardContent>
          {!digitalTwinData ? (
            <div className="text-center py-8">
              <Button onClick={generateDigitalTwin} disabled={isLoadingTwin} className="flex items-center gap-2">
                {isLoadingTwin ? <Loader2 className="h-4 w-4 animate-spin" /> : <TrendingUp className="h-4 w-4" />}
                {isLoadingTwin ? "Modeling Interdependencies..." : "Generate Digital Twin Analysis"}
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                AI-powered modeling of supply chain risk interdependencies and cascading effects
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* AI Alerts */}
              {digitalTwinData.alerts && digitalTwinData.alerts.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">AI Early Warning System</h4>
                  {digitalTwinData.alerts.map((alert: any, index: number) => (
                    <Alert
                      key={index}
                      variant={alert.severity === "Critical" || alert.severity === "High" ? "destructive" : "default"}
                    >
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle className="flex items-center justify-between">
                        {alert.severity} Alert
                        <Badge variant="outline">{alert.timeframe}</Badge>
                      </AlertTitle>
                      <AlertDescription>
                        <div>{alert.message}</div>
                        <div className="text-sm mt-1">
                          <strong>Impact:</strong> {alert.impact}
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}

              {/* Digital Twin Projections */}
              {digitalTwinData.projections && (
                <div>
                  <h4 className="font-semibold mb-4">6-Month Risk Projection Model</h4>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={digitalTwinData.projections}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[80, 120]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="baseline" stroke="#8884d8" name="Baseline" strokeWidth={2} />
                        <Line
                          type="monotone"
                          dataKey="tariffImpact"
                          stroke="#ff7300"
                          name="Tariff Impact"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="logisticsCost"
                          stroke="#00ff00"
                          name="Logistics Cost"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="materialPrice"
                          stroke="#ff00ff"
                          name="Material Prices"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="geopolitical"
                          stroke="#ff0000"
                          name="Geopolitical Risk"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="combinedRisk"
                          stroke="#000000"
                          name="Combined Risk"
                          strokeWidth={3}
                          strokeDasharray="5 5"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* AI Insights */}
              {digitalTwinData.insights && (
                <div className="space-y-3">
                  <h4 className="font-semibold">AI-Generated Insights</h4>
                  {digitalTwinData.insights.map((insight: any, index: number) => (
                    <Alert key={index}>
                      <Brain className="h-4 w-4" />
                      <AlertTitle className="flex items-center justify-between">
                        {insight.title}
                        <div className="flex gap-2">
                          <Badge variant="secondary">{insight.category}</Badge>
                          <Badge variant="outline">{insight.confidence}% confidence</Badge>
                        </div>
                      </AlertTitle>
                      <AlertDescription>{insight.insight}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Keep existing charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex flex-col space-y-1.5 p-6">
            <CardTitle>Logistics Costs by Major Routes</CardTitle>
            <CardDescription>Cost comparison for heavy equipment vs. cutting tools</CardDescription>
          </div>
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

        <Card>
          <div className="flex flex-col space-y-1.5 p-6">
            <CardTitle>Transport Mode Distribution</CardTitle>
            <CardDescription>Usage by volume across Sandvik's logistics network</CardDescription>
          </div>
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
    </div>
  )
}
