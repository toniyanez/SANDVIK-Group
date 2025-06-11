"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, CheckCircle, XCircle, Zap, Brain, TrendingUp, Loader2, ListChecks, Info } from "lucide-react"
import type { AiCriticalMaterialInsights } from "@/app/api/critical-materials-insights/route" // Import the type

const criticalMaterialsData = {
  tungsten: {
    name: "Tungsten",
    status: "Vertically Integrated",
    riskLevel: "Low",
    source: "WBH Austria (Internal)",
    description: "Essential for cemented carbide tools",
    advantages: [
      "Vertical integration through WBH subsidiary",
      "Mittersill mine - one of world's largest tungsten deposits",
      "St. Martin refinery for processing",
      "Strong recycling capabilities",
    ],
    challenges: ["China dominates global reserves (50%) and supply (85%)", "Market price volatility"],
    mitigation: [
      "Internal supply reduces external market exposure",
      "Recycling centers in Austria and India",
      "Strategic stockpiling capabilities",
    ],
  },
  cobalt: {
    name: "Cobalt",
    status: "External Sourcing",
    riskLevel: "High",
    source: "Global SORs (121 direct suppliers)",
    description: "Crucial binder in cemented carbides",
    advantages: [
      "Diversified supplier base across multiple countries",
      "49 unique Smelters or Refiners (SORs)",
      "RMAP compliance and due diligence",
    ],
    challenges: [
      ">50% global production from DRC",
      "Ethical mining concerns",
      "Geopolitical instability",
      "Incomplete SOR identification by some suppliers",
      "Not all SORs are RMAP conformant",
    ],
    mitigation: [
      "OECD guidelines compliance",
      "Responsible Minerals Initiative (RMI) validation",
      "Supplier code of conduct enforcement",
      "Geographic diversification of SORs",
    ],
  },
  steel: {
    name: "Specialty Steel",
    status: "External Sourcing",
    riskLevel: "Medium",
    source: "Alleima partnership + Global mills",
    description: "Various grades for tools and machinery",
    advantages: ["Strategic partnership with Alleima", "Access to global steel markets", "Diverse supplier base"],
    challenges: [
      "Increased reliance on external suppliers post-divestment",
      "Price volatility in global steel markets",
      "Tariff exposure on steel imports",
      "Quality consistency across suppliers",
    ],
    mitigation: [
      "Long-term strategic partnerships",
      "Geographic supplier diversification",
      "Quality assurance programs",
      "Alternative sourcing strategies",
    ],
  },
}

type MaterialKey = keyof typeof criticalMaterialsData

interface DynamicAiInsight {
  title: string
  insightText: string
  category: string
  confidence: number
  actionableRecommendations: string[]
  potentialImpact?: string
}

export default function CriticalMaterials() {
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialKey>("tungsten")
  const [showAIInsights, setShowAIInsights] = useState(false)
  const [dynamicAiInsights, setDynamicAiInsights] = useState<DynamicAiInsight[]>([])
  const [isLoadingAiInsights, setIsLoadingAiInsights] = useState(false)
  const [aiInsightsError, setAiInsightsError] = useState<string | null>(null)

  const generateAIRecommendations = async () => {
    setIsLoadingAiInsights(true)
    setAiInsightsError(null)
    setDynamicAiInsights([]) // Clear previous insights
    setShowAIInsights(true) // Show the section immediately

    try {
      const materialToAnalyze = criticalMaterialsData[selectedMaterial]
      const response = await fetch("/api/critical-materials-insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          materialName: materialToAnalyze.name,
          materialData: materialToAnalyze,
        }),
      })

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Failed to fetch AI insights. Server returned an error." }))
        throw new Error(errorData.error || `API request failed with status ${response.status}`)
      }

      const data: AiCriticalMaterialInsights = await response.json()
      setDynamicAiInsights(data.insights)
    } catch (error) {
      console.error("Failed to generate AI insights:", error)
      setAiInsightsError(error instanceof Error ? error.message : "An unknown error occurred.")
      setDynamicAiInsights([]) // Ensure insights are cleared on error
    } finally {
      setIsLoadingAiInsights(false)
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Low":
        return "text-green-600 bg-green-100"
      case "Medium":
        return "text-yellow-600 bg-yellow-100"
      case "High":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "Low":
        return CheckCircle
      case "Medium":
        return AlertTriangle
      case "High":
        return XCircle
      default:
        return AlertTriangle
    }
  }

  const currentMaterialData = criticalMaterialsData[selectedMaterial]

  return (
    <div className="space-y-6">
      {/* Material Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(criticalMaterialsData).map(([key, material]) => {
          const RiskIcon = getRiskIcon(material.riskLevel)
          return (
            <Card
              key={key}
              className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                selectedMaterial === key ? "ring-2 ring-brand-accent" : "ring-1 ring-transparent"
              }`}
              onClick={() => {
                setSelectedMaterial(key as MaterialKey)
                setShowAIInsights(false) // Hide AI insights when material changes
                setDynamicAiInsights([])
                setAiInsightsError(null)
              }}
            >
              <div className="flex flex-col space-y-1.5 p-6">
                <CardTitle className="flex items-center justify-between text-brand-dark">
                  {material.name}
                  <RiskIcon
                    className={`h-5 w-5 ${
                      material.riskLevel === "Low"
                        ? "text-green-500"
                        : material.riskLevel === "Medium"
                          ? "text-amber-500"
                          : "text-red-500"
                    }`}
                  />
                </CardTitle>
                <CardDescription>{material.description}</CardDescription>
              </div>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Status:</span>
                    <Badge variant="secondary">{material.status}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Risk Level:</span>
                    <Badge className={getRiskColor(material.riskLevel)}>{material.riskLevel}</Badge>
                  </div>
                  <div className="text-sm text-slate-600">
                    <strong>Source:</strong> {material.source}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Detailed Material Analysis */}
      <Card className="transition-all duration-300 hover:shadow-xl">
        <div className="flex flex-col space-y-1.5 p-6">
          <CardTitle className="flex items-center gap-2 text-brand-dark">
            <Zap className="h-5 w-5 text-brand-accent" />
            {currentMaterialData.name} - Detailed Analysis
          </CardTitle>
          <CardDescription>Comprehensive risk assessment and mitigation strategies</CardDescription>
        </div>
        <CardContent>
          <Tabs defaultValue="advantages" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="advantages">Advantages</TabsTrigger>
              <TabsTrigger value="challenges">Challenges</TabsTrigger>
              <TabsTrigger value="mitigation">Mitigation</TabsTrigger>
            </TabsList>

            <TabsContent value="advantages" className="space-y-2 pt-4">
              {currentMaterialData.advantages.map((advantage, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-green-800">{advantage}</span>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="challenges" className="space-y-2 pt-4">
              {currentMaterialData.challenges.map((challenge, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-red-800">{challenge}</span>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="mitigation" className="space-y-2 pt-4">
              {currentMaterialData.mitigation.map((strategy, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-blue-800">{strategy}</span>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* AI-Powered Insights */}
      <Card className="transition-all duration-300 hover:shadow-xl">
        <div className="flex flex-col space-y-1.5 p-6">
          <CardTitle className="flex items-center gap-2 text-brand-dark">
            <Brain className="h-5 w-5 text-brand-accent" />
            AI-Powered Supply Chain Insights for {currentMaterialData.name}
          </CardTitle>
          <CardDescription>Advanced analytics and recommendations for critical materials sourcing</CardDescription>
        </div>
        <CardContent>
          {!showAIInsights ? (
            <div className="text-center py-8">
              <Button
                onClick={generateAIRecommendations}
                disabled={isLoadingAiInsights}
                className="bg-brand-accent hover:bg-brand-accent-hover text-white flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
              >
                {isLoadingAiInsights ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
                {isLoadingAiInsights
                  ? `Generating for ${currentMaterialData.name}...`
                  : `Generate AI Insights for ${currentMaterialData.name}`}
              </Button>
              <p className="text-sm text-slate-500 mt-2">
                Click to get real-time AI-powered insights and recommendations for {currentMaterialData.name}.
              </p>
            </div>
          ) : isLoadingAiInsights ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-brand-accent mx-auto mb-2" />
              <p className="text-slate-600">Generating AI insights for {currentMaterialData.name}...</p>
            </div>
          ) : aiInsightsError ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error Generating Insights</AlertTitle>
              <AlertDescription>{aiInsightsError}</AlertDescription>
              <Button variant="outline" size="sm" onClick={generateAIRecommendations} className="mt-2">
                Try Again
              </Button>
            </Alert>
          ) : dynamicAiInsights.length > 0 ? (
            <div className="space-y-4">
              {dynamicAiInsights.map((insight, index) => (
                <Alert key={index} className="border-l-4 border-brand-accent bg-blue-50/50">
                  <TrendingUp className="h-4 w-4 text-brand-accent" />
                  <AlertTitle className="flex items-center justify-between font-semibold text-brand-dark">
                    {insight.title}
                    <Badge variant="outline">{insight.confidence}% confidence</Badge>
                  </AlertTitle>
                  <AlertDescription className="mt-2 text-slate-700">
                    <p className="mb-2">{insight.insightText}</p>
                    {insight.potentialImpact && (
                      <p className="text-xs italic text-slate-500 mb-2">Potential Impact: {insight.potentialImpact}</p>
                    )}
                    <div className="mt-2">
                      <h5 className="text-xs font-semibold text-slate-600 mb-1 flex items-center">
                        <ListChecks className="h-3 w-3 mr-1" />
                        Actionable Recommendations:
                      </h5>
                      <ul className="list-disc list-inside pl-1 text-xs text-slate-600 space-y-0.5">
                        {insight.actionableRecommendations.map((rec, recIndex) => (
                          <li key={recIndex}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </AlertDescription>
                  <div className="mt-3">
                    <Badge variant="secondary">{insight.category}</Badge>
                  </div>
                </Alert>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <Info className="h-8 w-8 mx-auto mb-2 text-slate-400" />
              No AI insights were generated for {currentMaterialData.name} at this time.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
