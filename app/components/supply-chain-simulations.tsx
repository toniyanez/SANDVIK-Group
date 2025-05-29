"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts"
import {
  Play,
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Loader2,
  BarChart3,
  Target,
  Zap,
  Shield,
} from "lucide-react"

const predefinedScenarios = [
  {
    id: "trade-war-escalation",
    name: "Trade War Escalation",
    description: "US-China trade tensions escalate with 25% tariffs on all industrial goods",
    category: "Trade Policy",
    severity: "High",
    parameters: {
      usTariffs: 25,
      chinaTariffs: 20,
      euTariffs: 15,
      shippingCosts: 130,
      materialCosts: 115,
    },
  },
  {
    id: "supply-chain-disruption",
    name: "Major Supply Chain Disruption",
    description: "Red Sea crisis extends 12 months, affecting 40% of global shipping routes",
    category: "Logistics",
    severity: "Critical",
    parameters: {
      shippingCosts: 180,
      deliveryDelays: 200,
      alternativeRoutes: 150,
      inventoryCosts: 125,
    },
  },
  {
    id: "cobalt-crisis",
    name: "Cobalt Supply Crisis",
    description: "DRC political instability reduces global cobalt supply by 60%",
    category: "Materials",
    severity: "Critical",
    parameters: {
      cobaltPrice: 300,
      availability: 40,
      alternativeSources: 120,
      recyclingCapacity: 150,
    },
  },
  {
    id: "regionalization-success",
    name: "Successful Regionalization",
    description: "SMMS regionalization reduces cross-border dependencies by 70%",
    category: "Strategy",
    severity: "Low",
    parameters: {
      crossBorderReduction: 70,
      localProduction: 180,
      tariffExposure: 30,
      operationalEfficiency: 115,
    },
  },
  {
    id: "green-transition",
    name: "Accelerated Green Transition",
    description: "Global push for sustainable mining increases demand for efficient equipment",
    category: "Market",
    severity: "Low",
    parameters: {
      demandIncrease: 125,
      sustainabilityPremium: 110,
      regulatoryCompliance: 120,
      innovationInvestment: 140,
    },
  },
  {
    id: "economic-recession",
    name: "Global Economic Recession",
    description: "Global GDP contracts 3%, reducing mining and manufacturing demand",
    category: "Economic",
    severity: "High",
    parameters: {
      demandReduction: 75,
      priceCompression: 85,
      creditTightening: 120,
      delayedInvestments: 60,
    },
  },
]

export default function SupplyChainSimulations() {
  const [selectedScenario, setSelectedScenario] = useState<string>("")
  const [customParameters, setCustomParameters] = useState<any>({})
  const [simulationResult, setSimulationResult] = useState<any>(null)
  const [comparisonResults, setComparisonResults] = useState<any>(null)
  const [isRunningSimulation, setIsRunningSimulation] = useState(false)
  const [isRunningComparison, setIsRunningComparison] = useState(false)
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([])

  const runSimulation = async () => {
    if (!selectedScenario) return

    setIsRunningSimulation(true)
    try {
      const scenario = predefinedScenarios.find((s) => s.id === selectedScenario)
      const response = await fetch("/api/supply-chain-simulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario: scenario?.description,
          parameters: { ...scenario?.parameters, ...customParameters },
        }),
      })
      const data = await response.json()
      setSimulationResult(data)
    } catch (error) {
      console.error("Simulation failed:", error)
    } finally {
      setIsRunningSimulation(false)
    }
  }

  const runComparison = async () => {
    if (selectedScenarios.length < 2) return

    setIsRunningComparison(true)
    try {
      const scenarios = selectedScenarios.map((id) => predefinedScenarios.find((s) => s.id === id))
      const response = await fetch("/api/scenario-comparison", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarios }),
      })
      const data = await response.json()
      setComparisonResults(data)
    } catch (error) {
      console.error("Comparison failed:", error)
    } finally {
      setIsRunningComparison(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Low":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "High":
        return "bg-orange-100 text-orange-800"
      case "Critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-green-800">Supply Chain Simulations</h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto">
          AI-powered scenario modeling to evaluate revenue impacts, support strategic decision-making, and enhance risk
          mitigation strategies
        </p>
      </div>

      <Tabs defaultValue="single-scenario" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="single-scenario" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Single Scenario
          </TabsTrigger>
          <TabsTrigger value="scenario-comparison" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Scenario Comparison
          </TabsTrigger>
          <TabsTrigger value="portfolio-optimization" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Portfolio Optimization
          </TabsTrigger>
        </TabsList>

        {/* Single Scenario Simulation */}
        <TabsContent value="single-scenario">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Scenario Selection */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-green-600" />
                  Scenario Configuration
                </CardTitle>
                <CardDescription>Select and customize simulation parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="scenario-select">Select Scenario</Label>
                  <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a scenario..." />
                    </SelectTrigger>
                    <SelectContent>
                      {predefinedScenarios.map((scenario) => (
                        <SelectItem key={scenario.id} value={scenario.id}>
                          <div className="flex items-center gap-2">
                            <span>{scenario.name}</span>
                            <Badge className={getSeverityColor(scenario.severity)}>{scenario.severity}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedScenario && (
                  <div className="space-y-4">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800">
                        {predefinedScenarios.find((s) => s.id === selectedScenario)?.name}
                      </h4>
                      <p className="text-sm text-green-700">
                        {predefinedScenarios.find((s) => s.id === selectedScenario)?.description}
                      </p>
                    </div>

                    <Button
                      onClick={runSimulation}
                      disabled={isRunningSimulation}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {isRunningSimulation ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Running AI Simulation...
                        </>
                      ) : (
                        <>
                          <Brain className="h-4 w-4 mr-2" />
                          Run AI Simulation
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Simulation Results */}
            <div className="lg:col-span-2">
              {simulationResult ? (
                <div className="space-y-6">
                  {/* Impact Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        Impact Summary: {simulationResult.scenarioName}
                      </CardTitle>
                      <CardDescription>
                        Timeframe: {simulationResult.timeframe} | Confidence: {simulationResult.confidence}%
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {simulationResult.simulatedMetrics.revenueChange > 0 ? "+" : ""}
                            {simulationResult.simulatedMetrics.revenueChange.toFixed(1)}%
                          </div>
                          <div className="text-sm text-gray-600">Revenue Impact</div>
                          <div className="text-xs text-gray-500">
                            SEK {simulationResult.simulatedMetrics.revenue.toLocaleString()}M
                          </div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {simulationResult.simulatedMetrics.marginChange > 0 ? "+" : ""}
                            {simulationResult.simulatedMetrics.marginChange.toFixed(1)}%
                          </div>
                          <div className="text-sm text-gray-600">Margin Impact</div>
                          <div className="text-xs text-gray-500">
                            {simulationResult.simulatedMetrics.operatingMargin.toFixed(1)}% margin
                          </div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">
                            {simulationResult.simulatedMetrics.costChange > 0 ? "+" : ""}
                            {simulationResult.simulatedMetrics.costChange.toFixed(1)}%
                          </div>
                          <div className="text-sm text-gray-600">Cost Impact</div>
                          <div className="text-xs text-gray-500">
                            SEK {simulationResult.simulatedMetrics.supplyChainCosts.toLocaleString()}M
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Business Area Impacts */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Business Area Impact Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {simulationResult.impactAnalysis.businessAreaImpacts.map((impact: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <h4 className="font-semibold">{impact.area}</h4>
                              <p className="text-sm text-gray-600">{impact.description}</p>
                            </div>
                            <div className="text-right">
                              <div
                                className={`text-lg font-bold ${impact.revenueImpact >= 0 ? "text-green-600" : "text-red-600"}`}
                              >
                                {impact.revenueImpact > 0 ? "+" : ""}
                                {impact.revenueImpact.toFixed(1)}%
                              </div>
                              <Badge className={getSeverityColor(impact.riskLevel)}>{impact.riskLevel}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Strategic Recommendations */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-green-600" />
                        AI-Generated Strategic Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {simulationResult.recommendations.map((rec: any, index: number) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold">{rec.action}</h4>
                              <Badge
                                className={
                                  rec.priority === "Critical"
                                    ? "bg-red-100 text-red-800"
                                    : rec.priority === "High"
                                      ? "bg-orange-100 text-orange-800"
                                      : "bg-blue-100 text-blue-800"
                                }
                              >
                                {rec.priority}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm">
                              <div>
                                <span className="text-gray-600">Investment:</span> {rec.investment}
                              </div>
                              <div>
                                <span className="text-gray-600">Timeline:</span> {rec.timeline}
                              </div>
                              <div>
                                <span className="text-gray-600">Expected ROI:</span> {rec.expectedROI}
                              </div>
                              <div>
                                <span className="text-gray-600">Risk Reduction:</span> {rec.riskReduction}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Risk Mitigation */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Risk Mitigation Strategy</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="immediate" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="immediate">Immediate</TabsTrigger>
                          <TabsTrigger value="medium">Medium-term</TabsTrigger>
                          <TabsTrigger value="long">Long-term</TabsTrigger>
                          <TabsTrigger value="contingency">Contingency</TabsTrigger>
                        </TabsList>
                        <TabsContent value="immediate" className="space-y-2">
                          {simulationResult.riskMitigation.immediateActions.map((action: string, index: number) => (
                            <div key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{action}</span>
                            </div>
                          ))}
                        </TabsContent>
                        <TabsContent value="medium" className="space-y-2">
                          {simulationResult.riskMitigation.mediumTermStrategies.map(
                            (strategy: string, index: number) => (
                              <div key={index} className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{strategy}</span>
                              </div>
                            ),
                          )}
                        </TabsContent>
                        <TabsContent value="long" className="space-y-2">
                          {simulationResult.riskMitigation.longTermInvestments.map(
                            (investment: string, index: number) => (
                              <div key={index} className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{investment}</span>
                              </div>
                            ),
                          )}
                        </TabsContent>
                        <TabsContent value="contingency" className="space-y-2">
                          {simulationResult.riskMitigation.contingencyPlans.map((plan: string, index: number) => (
                            <div key={index} className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{plan}</span>
                            </div>
                          ))}
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <Play className="h-12 w-12 text-green-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700">Ready to Simulate</h3>
                      <p className="text-gray-500">Select a scenario and run AI-powered simulation</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Scenario Comparison */}
        <TabsContent value="scenario-comparison">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  Multi-Scenario Comparison
                </CardTitle>
                <CardDescription>Compare multiple scenarios to support strategic decision-making</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Select Scenarios to Compare (minimum 2)</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                      {predefinedScenarios.map((scenario) => (
                        <div
                          key={scenario.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-all ${
                            selectedScenarios.includes(scenario.id)
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => {
                            if (selectedScenarios.includes(scenario.id)) {
                              setSelectedScenarios(selectedScenarios.filter((id) => id !== scenario.id))
                            } else {
                              setSelectedScenarios([...selectedScenarios, scenario.id])
                            }
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">{scenario.name}</h4>
                            <Badge className={getSeverityColor(scenario.severity)}>{scenario.severity}</Badge>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{scenario.category}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={runComparison}
                    disabled={selectedScenarios.length < 2 || isRunningComparison}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isRunningComparison ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Comparing Scenarios...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Compare Selected Scenarios
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {comparisonResults && (
              <div className="space-y-6">
                {/* Comparison Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Scenario Impact Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart data={comparisonResults.scenarios}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="riskScore" name="Risk Score" />
                          <YAxis dataKey="revenueImpact" name="Revenue Impact %" />
                          <Tooltip
                            formatter={(value, name) => [`${value}${name === "Revenue Impact %" ? "%" : ""}`, name]}
                            labelFormatter={(value) => `Risk Score: ${value}`}
                          />
                          <Scatter dataKey="revenueImpact" fill="#10b981" />
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Strategic Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle>Strategic Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="p-3 bg-green-50 rounded-lg">
                          <h4 className="font-semibold text-green-800">Best Case Strategy</h4>
                          <p className="text-sm text-green-700">{comparisonResults.recommendations.bestCase}</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <h4 className="font-semibold text-blue-800">Most Likely Scenario</h4>
                          <p className="text-sm text-blue-700">{comparisonResults.recommendations.mostLikely}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="p-3 bg-red-50 rounded-lg">
                          <h4 className="font-semibold text-red-800">Worst Case Preparation</h4>
                          <p className="text-sm text-red-700">{comparisonResults.recommendations.worstCase}</p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <h4 className="font-semibold text-purple-800">Hedging Strategy</h4>
                          <p className="text-sm text-purple-700">{comparisonResults.recommendations.hedgingStrategy}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Key Insights */}
                <Card>
                  <CardHeader>
                    <CardTitle>Key Strategic Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {comparisonResults.insights.map((insight: string, index: number) => (
                        <Alert key={index}>
                          <Brain className="h-4 w-4" />
                          <AlertDescription>{insight}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Portfolio Optimization */}
        <TabsContent value="portfolio-optimization">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Portfolio Optimization
              </CardTitle>
              <CardDescription>
                Optimize resource allocation across scenarios to minimize risk and maximize returns
              </CardDescription>
            </CardHeader>
            <CardContent>
              {comparisonResults?.portfolioOptimization ? (
                <div className="space-y-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={comparisonResults.portfolioOptimization}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="strategy" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="allocation" fill="#10b981" name="Allocation %" />
                        <Bar dataKey="expectedReturn" fill="#3b82f6" name="Expected Return %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {comparisonResults.portfolioOptimization.map((item: any, index: number) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <h4 className="font-semibold">{item.strategy}</h4>
                        <div className="mt-2 space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Allocation:</span>
                            <span className="font-semibold">{item.allocation}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Risk Reduction:</span>
                            <span className="font-semibold text-green-600">{item.riskReduction}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Expected Return:</span>
                            <span className="font-semibold text-blue-600">{item.expectedReturn}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700">Portfolio Optimization Available</h3>
                  <p className="text-gray-500">Run scenario comparison first to enable portfolio optimization</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
