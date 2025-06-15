"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartJsTitle,
  Tooltip as ChartJsTooltip,
  Legend as ChartJsLegend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js"
import { Bar, Doughnut, Line as ChartJsLine } from "react-chartjs-2"
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
  Calendar,
  ExternalLink,
} from "lucide-react"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartJsTitle,
  ChartJsTooltip,
  ChartJsLegend,
  ArcElement,
  PointElement,
  LineElement,
)

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

const logisticsCostsData = {
  labels: ["Sweden → USA", "China → Europe", "Australia → USA", "Germany → China", "India → USA"],
  datasets: [
    {
      label: "Heavy Equipment ($)",
      data: [15000, 12000, 18000, 14000, 16000],
      backgroundColor: "rgba(54, 162, 235, 0.6)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1,
      yAxisID: "y",
    },
    {
      label: "Tools ($/kg)",
      data: [8, 6, 10, 7, 9],
      backgroundColor: "rgba(75, 192, 192, 0.6)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1,
      yAxisID: "y1",
    },
  ],
}

const modeDistributionData = {
  labels: ["Sea Freight", "Road Freight", "Air Freight", "Rail Freight"],
  datasets: [
    {
      label: "Transport Mode Distribution (%)",
      data: [65, 20, 10, 5],
      backgroundColor: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"],
      borderColor: ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"],
      borderWidth: 2,
    },
  ],
}

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      ticks: {
        font: {
          size: 10,
        },
      },
    },
    y: {
      type: "linear" as const,
      display: true,
      position: "left" as const,
      title: {
        display: true,
        text: "Heavy Equipment ($)",
      },
    },
    y1: {
      type: "linear" as const,
      display: true,
      position: "right" as const,
      title: {
        display: true,
        text: "Tools ($/kg)",
      },
      grid: {
        drawOnChartArea: false,
      },
    },
  },
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
}

const doughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          let label = context.label || ""
          if (label) {
            label += ": "
          }
          if (context.parsed !== null) {
            label += context.parsed + "%"
          }
          return label
        },
      },
    },
  },
}

// Base options for the Digital Twin Line Chart
const baseLineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
    },
    tooltip: {
      mode: "index" as const,
      intersect: false,
    },
  },
  interaction: {
    mode: "index" as const,
    intersect: false,
  },
}

// Helper to transform projection data for Chart.js Line chart
const transformProjectionData = (projections: any[]) => {
  if (!projections || projections.length === 0) {
    return { labels: [], datasets: [] }
  }

  const labels = []
  const today = new Date()
  for (let i = 0; i < 6; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() + i, 1)
    labels.push(date.toLocaleString("default", { month: "short", year: "numeric" }))
  }

  return {
    labels,
    datasets: [
      {
        label: "Tariff Impact",
        data: projections.map((p) => p.tariffImpact),
        borderColor: "#ff7300", // Orange
        backgroundColor: "rgba(255, 115, 0, 0.5)",
        tension: 0.1,
        yAxisID: "yRiskFactors",
      },
      {
        label: "Logistics Cost",
        data: projections.map((p) => p.logisticsCost),
        borderColor: "#00C49F", // Green (matching pie chart)
        backgroundColor: "rgba(0, 196, 159, 0.5)",
        tension: 0.1,
        yAxisID: "yRiskFactors",
      },
      {
        label: "Material Prices",
        data: projections.map((p) => p.materialPrice),
        borderColor: "#FFBB28", // Yellow (matching pie chart)
        backgroundColor: "rgba(255, 187, 40, 0.5)",
        tension: 0.1,
        yAxisID: "yRiskFactors",
      },
      {
        label: "Geopolitical Risk",
        data: projections.map((p) => p.geopolitical),
        borderColor: "#FF8042", // Red/Orange (matching pie chart)
        backgroundColor: "rgba(255, 128, 66, 0.5)",
        tension: 0.1,
        yAxisID: "yRiskFactors",
      },
      {
        label: "Baseline",
        data: projections.map((p) => p.baseline),
        borderColor: "#8884d8", // Purple
        backgroundColor: "rgba(136, 132, 216, 0.5)",
        tension: 0.1,
        yAxisID: "yBaselineCombined",
      },
      {
        label: "Combined Risk",
        data: projections.map((p) => p.combinedRisk),
        borderColor: "#333333", // Dark Grey/Black
        backgroundColor: "rgba(51, 51, 51, 0.5)",
        tension: 0.1,
        borderDash: [5, 5],
        borderWidth: 2,
        yAxisID: "yBaselineCombined",
      },
    ],
  }
}

// Helper function to format confidence values properly
const formatConfidence = (confidence: number): string => {
  if (typeof confidence !== "number") return "0"

  // If confidence is a decimal (0.85), convert to percentage (85)
  if (confidence < 1) {
    return Math.round(confidence * 100).toString()
  }

  // If confidence is already a whole number (85), just round it
  return Math.round(confidence).toString()
}

export default function SupplyChainLogistics() {
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [digitalTwinData, setDigitalTwinData] = useState<any>(null)
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false)
  const [isLoadingTwin, setIsLoadingTwin] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const generateAIAnalysis = async () => {
    setIsLoadingAnalysis(true)
    setError(null)
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setAiAnalysis(data)
    } catch (error) {
      console.error("Failed to generate AI analysis:", error)
      setError(error instanceof Error ? error.message : "Failed to generate AI analysis")
    } finally {
      setIsLoadingAnalysis(false)
    }
  }

  const generateDigitalTwin = async () => {
    setIsLoadingTwin(true)
    setError(null)
    try {
      const response = await fetch("/api/digital-twin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timeframe: "6-month",
          factors: ["tariffs", "logistics", "materials", "geopolitical"],
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setDigitalTwinData(data)
    } catch (error) {
      console.error("Failed to generate digital twin:", error)
      setError(error instanceof Error ? error.message : "Failed to generate digital twin analysis")
    } finally {
      setIsLoadingTwin(false)
    }
  }

  const lineChartData = useMemo(() => {
    if (!digitalTwinData?.projections) return { labels: [], datasets: [] }
    return transformProjectionData(digitalTwinData.projections)
  }, [digitalTwinData])

  const dynamicLineChartOptions = useMemo(() => {
    if (!digitalTwinData?.projections || lineChartData.datasets.length === 0) return baseLineChartOptions

    const riskFactorDatasets = lineChartData.datasets.filter((ds) => ds.yAxisID === "yRiskFactors")
    const baselineCombinedDatasets = lineChartData.datasets.filter((ds) => ds.yAxisID === "yBaselineCombined")

    const allRiskFactorData = riskFactorDatasets.flatMap((dataset) => dataset.data as number[])
    const minRiskFactorVal = Math.min(...allRiskFactorData)
    const maxRiskFactorVal = Math.max(...allRiskFactorData)
    const riskFactorPadding = (maxRiskFactorVal - minRiskFactorVal) * 0.1 || 2 // Min padding of 2

    const allBaselineCombinedData = baselineCombinedDatasets.flatMap((dataset) => dataset.data as number[])
    const minBaselineCombinedVal = Math.min(...allBaselineCombinedData)
    const maxBaselineCombinedVal = Math.max(...allBaselineCombinedData)
    const baselineCombinedPadding = (maxBaselineCombinedVal - minBaselineCombinedVal) * 0.1 || 5 // Min padding of 5

    return {
      ...baseLineChartOptions,
      scales: {
        x: {
          title: {
            display: true,
            text: "Month",
          },
        },
        yRiskFactors: {
          type: "linear" as const,
          display: true,
          position: "left" as const,
          min: Math.floor(minRiskFactorVal - riskFactorPadding),
          max: Math.ceil(maxRiskFactorVal + riskFactorPadding),
          title: {
            display: true,
            text: "Individual Risk Factor Impact",
          },
          grid: {
            drawOnChartArea: true, // Main grid lines
          },
        },
        yBaselineCombined: {
          type: "linear" as const,
          display: true,
          position: "right" as const,
          min: Math.floor(minBaselineCombinedVal - baselineCombinedPadding),
          max: Math.ceil(maxBaselineCombinedVal + baselineCombinedPadding),
          title: {
            display: true,
            text: "Baseline / Combined Risk Index",
          },
          grid: {
            drawOnChartArea: false, // No grid lines for secondary axis
          },
        },
      },
    }
  }, [digitalTwinData, lineChartData])

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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
              <Button
                onClick={generateAIAnalysis}
                disabled={isLoadingAnalysis}
                className="flex items-center gap-2"
                size="lg"
              >
                {isLoadingAnalysis ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing with OpenAI...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4" />
                    Generate AI-Powered Analysis
                  </>
                )}
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                Using OpenAI GPT-4 to analyze current trade policies and generate strategic recommendations
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Reset button */}
              <div className="flex justify-end mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAiAnalysis(null)}
                  className="flex items-center gap-2"
                >
                  <Brain className="h-3 w-3" />
                  Generate New Analysis
                </Button>
              </div>

              {/* Rest of the existing AI analysis content remains the same */}
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
                              scenario.impact === "Critical"
                                ? "destructive"
                                : scenario.impact === "High"
                                  ? "destructive"
                                  : scenario.impact === "Medium"
                                    ? "default"
                                    : "secondary"
                            }
                          >
                            {scenario.impact} impact
                          </Badge>
                          <Badge variant="outline">{scenario.probability} probability</Badge>
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
                          <Badge variant="outline">{formatConfidence(response.confidence)}% confidence</Badge>
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
              {/* News Metadata */}
              {digitalTwinData.newsMetadata && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-blue-800">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Analysis based on {digitalTwinData.newsMetadata.totalArticles} recent news articles (
                      {digitalTwinData.newsMetadata.dateRange})
                    </span>
                  </div>
                </div>
              )}

              {/* Reset button for Digital Twin */}
              <div className="flex justify-end mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDigitalTwinData(null)
                    setError(null)
                  }}
                  className="flex items-center gap-2"
                >
                  <TrendingUp className="h-3 w-3" />
                  Generate New Digital Twin Analysis
                </Button>
              </div>

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
                        <div className="space-y-3">
                          <div>{alert.message}</div>
                          <div className="text-sm">
                            <strong>Impact:</strong> {alert.impact}
                          </div>

                          {/* News Sources Tags */}
                          {alert.newsSources && alert.newsSources.length > 0 && (
                            <div className="space-y-2">
                              <div className="text-xs font-medium text-gray-600">Sources:</div>
                              <div className="flex flex-wrap gap-2">
                                {alert.newsSources.map((newsSource: any, sourceIndex: number) => {
                                  // Create a targeted search query for the specific article
                                  const searchQuery = `"${newsSource.source}" "${alert.message.split(" ").slice(0, 5).join(" ")}" ${newsSource.date}`
                                  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&tbm=nws`

                                  return (
                                    <a
                                      key={sourceIndex}
                                      href={searchUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-blue-100 rounded-md text-xs transition-colors cursor-pointer group"
                                      title={`Search for: ${alert.message} from ${newsSource.source}`}
                                    >
                                      <ExternalLink className="h-3 w-3 group-hover:text-blue-600" />
                                      <span className="font-medium group-hover:text-blue-600">{newsSource.source}</span>
                                      <span className="text-gray-500">•</span>
                                      <span className="text-gray-600 group-hover:text-blue-600">{newsSource.date}</span>
                                    </a>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}

              {/* Digital Twin Projections */}
              {digitalTwinData.projections && digitalTwinData.projections.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-4">6-Month Risk Projection Model</h4>
                  <div className="h-80">
                    {isClient ? (
                      <ChartJsLine options={dynamicLineChartOptions} data={lineChartData} />
                    ) : (
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mt-10" />
                    )}
                  </div>
                </div>
              )}

              {/* AI Insights */}
              {digitalTwinData.insights && digitalTwinData.insights.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold">AI-Generated Strategic Insights</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Strategic responses and opportunities based on the early warning alerts above
                  </p>
                  {digitalTwinData.insights.map((insight: any, index: number) => {
                    const isBusinessOpportunity = [
                      "Business Opportunity",
                      "Market Expansion",
                      "Innovation Opportunity",
                      "Partnership Opportunity",
                      "Investment Opportunity",
                    ].includes(insight.category)

                    return (
                      <Alert key={index} className={isBusinessOpportunity ? "border-green-200 bg-green-50" : ""}>
                        <Brain className="h-4 w-4" />
                        <AlertTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {insight.title}
                            {isBusinessOpportunity && (
                              <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                                💡 Business Opportunity
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Badge
                              variant={isBusinessOpportunity ? "default" : "secondary"}
                              className={isBusinessOpportunity ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                            >
                              {insight.category}
                            </Badge>
                            <Badge variant="outline">{formatConfidence(insight.confidence)}% confidence</Badge>
                          </div>
                        </AlertTitle>
                        <AlertDescription>
                          <div className="space-y-3">
                            <p>{insight.insight}</p>

                            {/* Business Opportunity Details */}
                            {isBusinessOpportunity && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-green-100 rounded-lg">
                                {insight.potentialRevenue && (
                                  <div className="text-sm">
                                    <span className="font-medium text-green-800">Potential Revenue:</span>
                                    <div className="text-green-700">{insight.potentialRevenue}</div>
                                  </div>
                                )}
                                {insight.implementationTimeframe && (
                                  <div className="text-sm">
                                    <span className="font-medium text-green-800">Timeline:</span>
                                    <div className="text-green-700">{insight.implementationTimeframe}</div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* News Context */}
                            {insight.newsContext && insight.newsContext.length > 0 && (
                              <div className="space-y-2">
                                <div className="text-xs font-medium text-gray-600">Supporting News Context:</div>
                                <div className="space-y-1">
                                  {insight.newsContext.map((context: string, contextIndex: number) => {
                                    // Create a more specific search for the news context
                                    const searchQuery = `"${context}" supply chain logistics`
                                    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&tbm=nws`

                                    return (
                                      <a
                                        key={contextIndex}
                                        href={searchUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 p-2 rounded flex items-start gap-2 transition-colors cursor-pointer group"
                                        title={`Search news for: ${context}`}
                                      >
                                        <ExternalLink className="h-3 w-3 mt-0.5 flex-shrink-0 group-hover:text-blue-800" />
                                        <span className="group-hover:text-blue-800">{context}</span>
                                      </a>
                                    )
                                  })}
                                </div>
                              </div>
                            )}

                            {insight.relatedAlert && (
                              <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                                <strong>Related Alert:</strong> {insight.relatedAlert}
                              </div>
                            )}

                            {insight.actionable && (
                              <div className="flex items-center gap-1 text-xs text-green-600">
                                <CheckCircle className="h-3 w-3" />
                                Actionable insight - immediate implementation possible
                              </div>
                            )}
                          </div>
                        </AlertDescription>
                      </Alert>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Charts using Chart.js */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex flex-col space-y-1.5 p-6">
            <CardTitle>Logistics Costs by Major Routes</CardTitle>
            <CardDescription>Cost comparison for heavy equipment vs. cutting tools</CardDescription>
          </div>
          <CardContent>
            <div className="h-80">
              {isClient ? (
                <Bar options={barChartOptions} data={logisticsCostsData} />
              ) : (
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mt-10" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <div className="flex flex-col space-y-1.5 p-6">
            <CardTitle>Transport Mode Distribution</CardTitle>
            <CardDescription>Usage by volume across Sandvik's logistics network</CardDescription>
          </div>
          <CardContent>
            <div className="h-80 w-full flex justify-center items-center">
              {isClient ? (
                <Doughnut data={modeDistributionData} options={doughnutChartOptions} />
              ) : (
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mt-10" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
