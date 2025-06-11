"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, CheckCircle, XCircle, Zap, Brain, TrendingUp } from "lucide-react"

const criticalMaterials = {
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

const aiInsights = [
  {
    title: "Supply Chain Vulnerability Assessment",
    insight:
      "Cobalt sourcing presents the highest risk due to geographic concentration in DRC and ethical concerns. Recommend accelerating alternative binder research and expanding certified supplier network.",
    confidence: 92,
    category: "Risk Analysis",
  },
  {
    title: "Tungsten Competitive Advantage",
    insight:
      "Vertical integration in tungsten provides significant strategic advantage over competitors. WBH ownership reduces supply risk and cost volatility compared to external sourcing.",
    confidence: 95,
    category: "Strategic Advantage",
  },
  {
    title: "Steel Supply Optimization",
    insight:
      "Post-Alleima divestment requires enhanced supplier relationship management. Consider regional steel partnerships to reduce tariff exposure and transportation costs.",
    confidence: 88,
    category: "Optimization",
  },
  {
    title: "Circular Economy Opportunities",
    insight:
      "Expanding tungsten and cobalt recycling capabilities could reduce external dependency by 15-20%. Current recycling infrastructure provides foundation for scaling.",
    confidence: 85,
    category: "Sustainability",
  },
]

export default function CriticalMaterials() {
  const [selectedMaterial, setSelectedMaterial] = useState("tungsten")
  const [showAIInsights, setShowAIInsights] = useState(false)

  const generateAIRecommendations = () => {
    setShowAIInsights(true)
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

  return (
    <div className="space-y-6">
      {/* Material Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(criticalMaterials).map(([key, material]) => {
          const RiskIcon = getRiskIcon(material.riskLevel)
          return (
            <Card
              key={key}
              className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                selectedMaterial === key ? "ring-2 ring-brand-accent" : "ring-1 ring-transparent"
              }`}
              onClick={() => setSelectedMaterial(key)}
            >
              <CardHeader>
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
              </CardHeader>
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
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-brand-dark">
            <Zap className="h-5 w-5 text-brand-accent" />
            {criticalMaterials[selectedMaterial as keyof typeof criticalMaterials].name} - Detailed Analysis
          </CardTitle>
          <CardDescription>Comprehensive risk assessment and mitigation strategies</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="advantages" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="advantages">Advantages</TabsTrigger>
              <TabsTrigger value="challenges">Challenges</TabsTrigger>
              <TabsTrigger value="mitigation">Mitigation</TabsTrigger>
            </TabsList>

            <TabsContent value="advantages" className="space-y-2">
              {criticalMaterials[selectedMaterial as keyof typeof criticalMaterials].advantages.map(
                (advantage, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-green-800">{advantage}</span>
                  </div>
                ),
              )}
            </TabsContent>

            <TabsContent value="challenges" className="space-y-2">
              {criticalMaterials[selectedMaterial as keyof typeof criticalMaterials].challenges.map(
                (challenge, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-red-800">{challenge}</span>
                  </div>
                ),
              )}
            </TabsContent>

            <TabsContent value="mitigation" className="space-y-2">
              {criticalMaterials[selectedMaterial as keyof typeof criticalMaterials].mitigation.map(
                (strategy, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-blue-800">{strategy}</span>
                  </div>
                ),
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* AI-Powered Insights */}
      <Card className="transition-all duration-300 hover:shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-brand-dark">
            <Brain className="h-5 w-5 text-brand-accent" />
            AI-Powered Supply Chain Insights
          </CardTitle>
          <CardDescription>Advanced analytics and recommendations for critical materials sourcing</CardDescription>
        </CardHeader>
        <CardContent>
          {!showAIInsights ? (
            <div className="text-center py-8">
              <Button
                onClick={() => setShowAIInsights(true)}
                className="bg-brand-accent hover:bg-brand-accent-hover text-white flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
              >
                <Brain className="h-4 w-4" />
                Generate AI Insights & Recommendations
              </Button>
              <p className="text-sm text-slate-500 mt-2">
                Analyze supply chain data using OpenAI to identify risks and opportunities
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {aiInsights.map((insight, index) => (
                <Alert key={index} className="border-l-4 border-brand-accent bg-blue-50/50">
                  <TrendingUp className="h-4 w-4 text-brand-accent" />
                  <AlertTitle className="flex items-center justify-between font-semibold text-brand-dark">
                    {insight.title}
                    <Badge variant="outline">{insight.confidence}% confidence</Badge>
                  </AlertTitle>
                  <AlertDescription className="mt-2 text-slate-700">{insight.insight}</AlertDescription>
                  <div className="mt-2">
                    <Badge variant="secondary">{insight.category}</Badge>
                  </div>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
