"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardTitle, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Play, Brain, TrendingUp, AlertTriangle, CheckCircle, Loader2, Zap, Shield, Lightbulb } from "lucide-react"

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
      availability: 40, // Representing 60% reduction from 100%
      alternativeSources: 120, // Cost index for alternatives
      recyclingCapacity: 150, // Cost index or capacity constraint
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
  const [isRunningSimulation, setIsRunningSimulation] = useState(false)
  const [dynamicScenarios, setDynamicScenarios] = useState<any[]>([])
  const [scenarioPrompt, setScenarioPrompt] = useState<string>("")
  const [generatedScenario, setGeneratedScenario] = useState<any>(null)
  const [isGeneratingScenario, setIsGeneratingScenario] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Add error boundary effect
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Component error:", event.error)
      setError(event.error?.message || "Unknown error occurred")
    }

    window.addEventListener("error", handleError)
    return () => window.removeEventListener("error", handleError)
  }, [])

  useEffect(() => {
    // Simulate component initialization
    const timer = setTimeout(() => setIsLoading(false), 100)
    return () => clearTimeout(timer)
  }, [])

  // Function to generate scenario-specific AI decision factors
  const generateScenarioSpecificFactors = (scenarioName: string, scenarioDescription: string) => {
    const scenario = (scenarioName + " " + scenarioDescription).toLowerCase()

    const contextAnalysis = []
    const businessLogic = []

    // Spain-specific factors
    if (scenario.includes("spain")) {
      contextAnalysis.push("Spanish market exposure assessment (€4.2B revenue)")
      contextAnalysis.push("Madrid & Barcelona manufacturing facility impacts")
      contextAnalysis.push("European supply chain disruption mapping")
      contextAnalysis.push("Spanish customer dependency analysis")

      businessLogic.push("Regional manufacturing capacity constraints")
      businessLogic.push("European distribution network rerouting costs")
      businessLogic.push("Spanish workforce and operational continuity")
      businessLogic.push("EU regulatory compliance during disruption")
    }
    // China-specific factors
    else if (scenario.includes("china")) {
      contextAnalysis.push("Chinese market exposure assessment (SEK 9.1B revenue)")
      contextAnalysis.push("Supply chain dependency on Chinese suppliers")
      contextAnalysis.push("Manufacturing facility impacts in China")
      contextAnalysis.push("Trade route disruption through China")

      businessLogic.push("Alternative supplier activation costs")
      businessLogic.push("Inventory buffer requirements for China disruption")
      businessLogic.push("Currency exchange rate volatility impacts")
      businessLogic.push("Regulatory compliance in alternative markets")
    }
    // Cobalt-specific factors
    else if (scenario.includes("cobalt")) {
      contextAnalysis.push("Cobalt dependency mapping across business areas")
      contextAnalysis.push("DRC supply chain vulnerability assessment")
      contextAnalysis.push("Alternative cobalt source availability")
      contextAnalysis.push("Recycling capacity and feasibility analysis")

      businessLogic.push("Material substitution cost-benefit analysis")
      businessLogic.push("SMRS cutting tool production impact multipliers")
      businessLogic.push("Long-term contract renegotiation effects")
      businessLogic.push("Strategic inventory optimization models")
    }
    // Green transition factors
    else if (scenario.includes("green") || scenario.includes("sustainable")) {
      contextAnalysis.push("Sustainability demand trend acceleration")
      contextAnalysis.push("Regulatory compliance requirement mapping")
      contextAnalysis.push("Customer willingness-to-pay premium assessment")
      contextAnalysis.push("Competitive positioning in green technology")

      businessLogic.push("R&D investment return timeline modeling")
      businessLogic.push("Premium pricing strategy validation")
      businessLogic.push("Market share capture in sustainable segments")
      businessLogic.push("Operational efficiency improvement factors")
    }
    // Trade war factors
    else if (scenario.includes("trade") || scenario.includes("tariff")) {
      contextAnalysis.push("Tariff exposure by product category and region")
      contextAnalysis.push("Cross-border trade flow vulnerability")
      contextAnalysis.push("Competitive disadvantage assessment")
      contextAnalysis.push("Customer price sensitivity analysis")

      businessLogic.push("Regional production rebalancing costs")
      businessLogic.push("Supply chain regionalization benefits")
      businessLogic.push("Market share defense strategies")
      businessLogic.push("Price elasticity impact modeling")
    }
    // Generic/other scenarios
    else {
      contextAnalysis.push("Scenario severity and duration assessment")
      contextAnalysis.push("Geographic and operational exposure mapping")
      contextAnalysis.push("Supply chain vulnerability identification")
      contextAnalysis.push("Market demand impact evaluation")

      businessLogic.push("Industry-specific impact multipliers")
      businessLogic.push("Cross-business area correlation effects")
      businessLogic.push("Risk mitigation capability assessment")
      businessLogic.push("Recovery timeline and cost modeling")
    }

    return { contextAnalysis, businessLogic }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2 text-gray-600">Loading simulations...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Component Error</h2>
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => setError(null)} className="bg-blue-600 hover:bg-blue-700">
          Retry
        </Button>
      </div>
    )
  }

  const runSimulation = async () => {
    if (!selectedScenario) return

    setIsRunningSimulation(true)
    setError(null)
    try {
      const allScenarios = [...predefinedScenarios, ...dynamicScenarios]
      const scenario = allScenarios.find((s) => s.id === selectedScenario)

      console.log("Running simulation for:", scenario?.name)

      const response = await fetch("/api/supply-chain-simulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioName: scenario?.name,
          scenarioDescription: scenario?.description,
          parameters: { ...scenario?.parameters, ...customParameters },
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Simulation response:", data)

      if (data.error) {
        console.error("Simulation API Error:", data.error, data.details)
        setSimulationResult({ error: data.error, details: data.details, scenarioName: scenario?.name || "Error" })
      } else {
        setSimulationResult(data)
      }
    } catch (error) {
      console.error("Simulation failed:", error)
      const allScenarios = [...predefinedScenarios, ...dynamicScenarios]
      const scenario = allScenarios.find((s) => s.id === selectedScenario)
      setError(`Simulation failed: ${error instanceof Error ? error.message : "Unknown error"}`)
      setSimulationResult({ error: "Failed to run simulation.", scenarioName: scenario?.name || "Error" })
    } finally {
      setIsRunningSimulation(false)
    }
  }

  const handleGenerateScenario = async () => {
    if (!scenarioPrompt.trim()) return
    setIsGeneratingScenario(true)
    setGeneratedScenario(null)
    setError(null)

    try {
      console.log("Generating scenario for prompt:", scenarioPrompt)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setGeneratedScenario({
        name: "AI Generated: " + scenarioPrompt.substring(0, 30) + "...",
        description:
          "This is an AI generated scenario based on your prompt. It includes potential impacts on supply chain, material costs, and market demand.",
        category: "AI Generated",
        severity: "Medium",
        parameters: {
          shippingCosts: Math.floor(Math.random() * 50) + 100,
          materialCosts: Math.floor(Math.random() * 60) + 100,
          demandFluctuation: Math.floor(Math.random() * 40) - 20,
        },
      })
    } catch (error) {
      console.error("Scenario generation failed:", error)
      setError(`Scenario generation failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsGeneratingScenario(false)
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
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-green-800">Supply Chain Simulations</h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto">
          AI-powered scenario modeling to evaluate revenue impacts, support strategic decision-making, and enhance risk
          mitigation strategies
        </p>
      </div>

      <Tabs defaultValue="single-scenario" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="single-scenario" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Single Scenario
          </TabsTrigger>
          <TabsTrigger value="scenario-generation" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Scenario Generation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="single-scenario">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                      {[...predefinedScenarios, ...dynamicScenarios].map((scenario) => (
                        <SelectItem key={scenario.id} value={scenario.id}>
                          <div className="flex items-center gap-2">
                            <span>{scenario.name}</span>
                            <Badge className={getSeverityColor(scenario.severity)}>{scenario.severity}</Badge>
                            {scenario.category === "AI Generated" && (
                              <Badge className="bg-purple-100 text-purple-800 text-xs">AI</Badge>
                            )}
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
                        {[...predefinedScenarios, ...dynamicScenarios].find((s) => s.id === selectedScenario)?.name}
                        {[...predefinedScenarios, ...dynamicScenarios].find((s) => s.id === selectedScenario)
                          ?.category === "AI Generated" && (
                          <Badge className="ml-2 bg-purple-100 text-purple-800 text-xs">AI Generated</Badge>
                        )}
                      </h4>
                      <p className="text-sm text-green-700">
                        {
                          [...predefinedScenarios, ...dynamicScenarios].find((s) => s.id === selectedScenario)
                            ?.description
                        }
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

            <div className="lg:col-span-2">
              {simulationResult ? (
                simulationResult.error ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-red-700">Simulation Error</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center h-auto py-6">
                      <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                      <p className="text-red-600">{simulationResult.error}</p>
                      {simulationResult.details && (
                        <p className="text-xs text-gray-400 mt-1">
                          Details: {JSON.stringify(simulationResult.details)}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">Scenario: {simulationResult.scenarioName}</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                          Impact Summary: {simulationResult.scenarioName}
                        </CardTitle>
                        <CardDescription>
                          Timeframe: {simulationResult.timeframe} | Confidence:{" "}
                          {(simulationResult.confidence * 100).toFixed(0)}%
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Revenue Impact Block */}
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-sm text-gray-600 mb-1">Revenue Impact</div>
                            <div
                              className={`text-2xl font-bold mb-1 ${simulationResult.simulatedMetrics.revenueChangePercent >= 0 ? "text-blue-600" : "text-red-600"}`}
                            >
                              {simulationResult.simulatedMetrics.revenueChangePercent >= 0 ? "+" : ""}
                              {simulationResult.simulatedMetrics.revenueChangePercent?.toFixed(1)}%
                            </div>
                            <div
                              className={`text-md font-semibold mb-1 ${simulationResult.simulatedMetrics.absoluteRevenueChangeSEKM >= 0 ? "text-blue-700" : "text-red-700"}`}
                            >
                              {simulationResult.simulatedMetrics.absoluteRevenueChangeSEKM >= 0 ? "+" : ""}
                              SEK{" "}
                              {simulationResult.simulatedMetrics.absoluteRevenueChangeSEKM?.toLocaleString(undefined, {
                                maximumFractionDigits: 0,
                              })}
                              M
                            </div>
                            <div className="text-xs text-gray-500">
                              New Total: SEK{" "}
                              {simulationResult.simulatedMetrics.revenue?.toLocaleString(undefined, {
                                maximumFractionDigits: 0,
                              })}
                              M
                            </div>
                          </div>
                          {/* Margin Impact Block */}
                          <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-sm text-gray-600 mb-1">Margin Impact</div>
                            <div
                              className={`text-2xl font-bold mb-1 ${simulationResult.simulatedMetrics.marginChangePercentPoints >= 0 ? "text-purple-600" : "text-red-600"}`}
                            >
                              {simulationResult.simulatedMetrics.marginChangePercentPoints >= 0 ? "+" : ""}
                              {simulationResult.simulatedMetrics.marginChangePercentPoints?.toFixed(1)} p.p.
                            </div>
                            <div className="text-xs text-gray-500 mt-3">
                              {" "}
                              {/* Adjusted margin for New Margin text */}
                              New Margin: {simulationResult.simulatedMetrics.operatingMargin?.toFixed(1)}%
                            </div>
                          </div>
                          {/* Cost Impact Block */}
                          <div className="text-center p-4 bg-orange-50 rounded-lg">
                            <div className="text-sm text-gray-600 mb-1">Cost Impact</div>
                            <div
                              className={`text-2xl font-bold mb-1 ${simulationResult.simulatedMetrics.costChangePercent >= 0 ? "text-orange-600" : "text-red-600"}`}
                            >
                              {simulationResult.simulatedMetrics.costChangePercent >= 0 ? "+" : ""}
                              {simulationResult.simulatedMetrics.costChangePercent?.toFixed(1)}%
                            </div>
                            <div className="text-xs text-gray-500 mt-3">
                              {" "}
                              {/* Adjusted margin for New Costs text */}
                              New Costs: SEK{" "}
                              {simulationResult.simulatedMetrics.supplyChainCosts?.toLocaleString(undefined, {
                                maximumFractionDigits: 0,
                              })}
                              M
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Brain className="h-5 w-5 text-purple-600" />
                          AI Reasoning & Methodology
                        </CardTitle>
                        <CardDescription>
                          Detailed explanation of how the AI calculated these simulation values
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Revenue Calculation Logic */}
                            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                              <h4 className="font-semibold text-blue-800 mb-2">Revenue Impact Logic</h4>
                              <div className="text-sm text-blue-700 space-y-1">
                                <p>
                                  <strong>Calculation Method:</strong>
                                </p>
                                <p>• Individual BA impacts weighted by baseline revenue</p>
                                <p>
                                  • SMRS:{" "}
                                  {simulationResult.impactAnalysis.businessAreaImpacts
                                    .find((ba) => ba.area === "SMRS")
                                    ?.revenueImpactPercent?.toFixed(1)}
                                  % × SEK 63,600M
                                </p>
                                <p>
                                  • SMMS:{" "}
                                  {simulationResult.impactAnalysis.businessAreaImpacts
                                    .find((ba) => ba.area === "SMMS")
                                    ?.revenueImpactPercent?.toFixed(1)}
                                  % × SEK 48,600M
                                </p>
                                <p>
                                  • SRPS:{" "}
                                  {simulationResult.impactAnalysis.businessAreaImpacts
                                    .find((ba) => ba.area === "SRPS")
                                    ?.revenueImpactPercent?.toFixed(1)}
                                  % × SEK 10,700M
                                </p>
                                <p>
                                  <strong>Result:</strong> Aggregated to{" "}
                                  {simulationResult.simulatedMetrics.revenueChangePercent?.toFixed(1)}% total impact
                                </p>
                              </div>
                            </div>

                            {/* Cost Calculation Logic */}
                            <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                              <h4 className="font-semibold text-orange-800 mb-2">Cost Impact Logic</h4>
                              <div className="text-sm text-orange-700 space-y-1">
                                <p>
                                  <strong>Scenario Factors:</strong>
                                </p>
                                <p>• Material cost inflation from disruption</p>
                                <p>• Alternative supplier premiums</p>
                                <p>• Expedited logistics costs</p>
                                <p>• Risk mitigation investments</p>
                                <p>
                                  <strong>Baseline:</strong> SEK{" "}
                                  {simulationResult.baselineMetrics.supplyChainCosts?.toLocaleString()}M
                                </p>
                                <p>
                                  <strong>New Total:</strong> SEK{" "}
                                  {simulationResult.simulatedMetrics.supplyChainCosts?.toLocaleString()}M
                                </p>
                              </div>
                            </div>

                            {/* Margin Calculation Logic */}
                            <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                              <h4 className="font-semibold text-purple-800 mb-2">Margin Impact Logic</h4>
                              <div className="text-sm text-purple-700 space-y-1">
                                <p>
                                  <strong>Formula Applied:</strong>
                                </p>
                                <p>New Margin = (New Revenue - New Costs) / New Revenue</p>
                                <p>
                                  <strong>Components:</strong>
                                </p>
                                <p>
                                  • Revenue decline:{" "}
                                  {simulationResult.simulatedMetrics.revenueChangePercent?.toFixed(1)}%
                                </p>
                                <p>
                                  • Cost increase: +{simulationResult.simulatedMetrics.costChangePercent?.toFixed(1)}%
                                </p>
                                <p>
                                  <strong>Net Effect:</strong>{" "}
                                  {simulationResult.simulatedMetrics.marginChangePercentPoints?.toFixed(1)} p.p. change
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* AI Decision Factors - Now Dynamic */}
                          <div className="border-t pt-4">
                            <h4 className="font-semibold text-gray-800 mb-3">Key AI Decision Factors</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="font-medium text-gray-700 mb-2">Scenario Context Analysis</h5>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {generateScenarioSpecificFactors(
                                    simulationResult.scenarioName,
                                    simulationResult.scenarioName,
                                  ).contextAnalysis.map((factor, index) => (
                                    <li key={index}>• {factor}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-700 mb-2">Business Logic Applied</h5>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {generateScenarioSpecificFactors(
                                    simulationResult.scenarioName,
                                    simulationResult.scenarioName,
                                  ).businessLogic.map((factor, index) => (
                                    <li key={index}>• {factor}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>

                          {/* Confidence Indicators */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-800 mb-2">Confidence Assessment</h4>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs">
                                  <div
                                    className="bg-green-600 h-2 rounded-full"
                                    style={{ width: `${simulationResult.confidence * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium">
                                  {(simulationResult.confidence * 100).toFixed(0)}%
                                </span>
                              </div>
                              <div className="text-sm text-gray-600">
                                Based on data quality, scenario precedents, and model validation
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

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
                                  className={`text-lg font-bold ${impact.revenueImpactPercent >= 0 ? "text-green-600" : "text-red-600"}`}
                                >
                                  {impact.revenueImpactPercent >= 0 ? "+" : ""}
                                  {impact.revenueImpactPercent?.toFixed(1)}%
                                </div>
                                <Badge className={getSeverityColor(impact.riskLevel)}>{impact.riskLevel}</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

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

                    {simulationResult.keyAssumptions && simulationResult.keyAssumptions.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Key Assumptions by AI</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                            {simulationResult.keyAssumptions.map((assumption: string, index: number) => (
                              <li key={index}>{assumption}</li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

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
                          <TabsContent value="immediate" className="space-y-2 pt-2">
                            {simulationResult.riskMitigation.immediateActions.map((action: string, index: number) => (
                              <div key={index} className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{action}</span>
                              </div>
                            ))}
                          </TabsContent>
                          <TabsContent value="medium" className="space-y-2 pt-2">
                            {simulationResult.riskMitigation.mediumTermStrategies.map(
                              (strategy: string, index: number) => (
                                <div key={index} className="flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm">{strategy}</span>
                                </div>
                              ),
                            )}
                          </TabsContent>
                          <TabsContent value="long" className="space-y-2 pt-2">
                            {simulationResult.riskMitigation.longTermInvestments.map(
                              (investment: string, index: number) => (
                                <div key={index} className="flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm">{investment}</span>
                                </div>
                              ),
                            )}
                          </TabsContent>
                          <TabsContent value="contingency" className="space-y-2 pt-2">
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
                )
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

        <TabsContent value="scenario-generation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-green-600" />
                AI-Powered Scenario Generation
              </CardTitle>
              <CardDescription>
                Describe a potential event or trend, and let AI help you draft a new simulation scenario.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="scenario-prompt">Describe your scenario idea:</Label>
                <Textarea
                  id="scenario-prompt"
                  placeholder="e.g., 'A new geopolitical conflict in Eastern Europe disrupts logistics and energy prices by 30% for 6 months.'"
                  value={scenarioPrompt}
                  onChange={(e) => setScenarioPrompt(e.target.value)}
                  rows={4}
                />
              </div>
              <Button
                onClick={handleGenerateScenario}
                disabled={isGeneratingScenario || !scenarioPrompt.trim()}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isGeneratingScenario ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Generating Scenario...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Generate Scenario with AI
                  </>
                )}
              </Button>

              {generatedScenario && (
                <div className="mt-6 p-4 border rounded-lg bg-slate-50">
                  {generatedScenario.error ? (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{generatedScenario.error}</AlertDescription>
                    </Alert>
                  ) : (
                    <>
                      <h3 className="text-lg font-semibold mb-2">{generatedScenario.name}</h3>
                      <p className="text-sm text-gray-700 mb-1">
                        <strong>Description:</strong> {generatedScenario.description}
                      </p>
                      <p className="text-sm text-gray-700 mb-1">
                        <strong>Category:</strong> {generatedScenario.category}
                      </p>
                      <div className="mb-2">
                        <Badge className={getSeverityColor(generatedScenario.severity)}>
                          {generatedScenario.severity}
                        </Badge>
                      </div>
                      <h4 className="font-medium text-md mt-3 mb-1">Potential Parameters:</h4>
                      <ul className="list-disc pl-5 text-sm text-gray-600">
                        {Object.entries(generatedScenario.parameters).map(([key, value]) => (
                          <li key={key}>
                            {key}: {String(value)}
                          </li>
                        ))}
                      </ul>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => {
                          if (generatedScenario) {
                            // Generate unique ID for the scenario
                            const scenarioId = `ai-generated-${Date.now()}`
                            const newScenario = {
                              ...generatedScenario,
                              id: scenarioId,
                            }

                            // Add to dynamic scenarios list
                            setDynamicScenarios((prev) => [...prev, newScenario])

                            // Switch to Single Scenario tab and select the new scenario
                            setSelectedScenario(scenarioId)

                            // Show success message
                            alert(
                              `Scenario "${newScenario.name}" has been added to the scenario list and is now available for simulation in the Single Scenario tab!`,
                            )
                          }
                        }}
                      >
                        Use This Scenario
                      </Button>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
