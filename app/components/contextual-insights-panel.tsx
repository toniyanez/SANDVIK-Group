"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle,
  TrendingUp,
  Clock,
  ExternalLink,
  Lightbulb,
  Brain,
  BookOpen,
  Newspaper,
  Calendar,
  Loader2,
  Target,
  Sparkles,
  RefreshCw,
  BarChart3,
} from "lucide-react"

interface Insight {
  id: string
  title: string
  description: string
  type: string
  priority: "Low" | "Medium" | "High" | "Critical"
  confidence: number
  source: string
  timestamp: string
}

interface NewsArticle {
  title: string
  description: string
  source: string
  publishedAt: string
  url: string
  relevanceScore: number
}

interface ContextualInsightsData {
  insights: Insight[]
  aiInsights: Insight[]
  curatedInsights: Insight[]
  newsArticles: NewsArticle[]
  metadata: {
    activeTab: string
    scenarioName?: string
    totalInsights: number
    totalNews: number
    lastUpdated: string
  }
}

interface SimulationContext {
  scenarioName?: string
  scenarioDescription?: string
  impactSummary?: {
    revenueChangePercent?: number
    marginChangePercentPoints?: number
    costChangePercent?: number
  }
  businessAreaImpacts?: Array<{
    area: string
    revenueImpactPercent: number
    riskLevel: string
    description: string
  }>
  materialImpacts?: Array<{
    material: string
    costImpactPercent: number
    availabilityRisk: string
  }>
  recommendations?: Array<{
    action: string
    priority: string
  }>
}

interface ContextualInsightsPanelProps {
  activeTab: string
  panelTitle?: string
  simulationContext?: SimulationContext
}

const priorityColors = {
  Critical: "destructive",
  High: "destructive",
  Medium: "default",
  Low: "secondary",
} as const

const typeIcons = {
  "Risk Mitigation": AlertTriangle,
  "Cost Management": TrendingUp,
  Operational: Clock,
  "Operational Resilience": AlertTriangle,
  "Route Optimization": TrendingUp,
  "AI Recommendation": Brain,
  "Best Practice": BookOpen,
  Strategic: Lightbulb,
  "Supply Risk": AlertTriangle,
  "Cost Optimization": TrendingUp,
  "Production Risk": AlertTriangle,
  "Financial Performance": BarChart3,
  "Profitability Analysis": TrendingUp,
  "Strategic Planning": Lightbulb,
  "Innovation Strategy": Lightbulb,
  "Strategic Overview": BarChart3,
  "Market Analysis": BarChart3,
}

export default function ContextualInsightsPanel({
  activeTab,
  panelTitle,
  simulationContext,
}: ContextualInsightsPanelProps) {
  const [data, setData] = useState<ContextualInsightsData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  // Remove automatic loading on mount/context change
  // useEffect(() => {
  //   fetchInsights()
  // }, [activeTab, simulationContext])

  const fetchInsights = async () => {
    setIsLoading(true)
    try {
      let url = `/api/contextual-insights?activeTab=${activeTab}`

      // Add simulation context if available
      if (simulationContext) {
        url += `&simulationContext=${encodeURIComponent(JSON.stringify(simulationContext))}`
      }

      console.log("🔄 Fetching contextual insights...", { activeTab, scenario: simulationContext?.scenarioName })

      const response = await fetch(url)
      if (response.ok) {
        const insightsData = await response.json()
        setData(insightsData)
        setLastRefresh(new Date())
        setHasLoaded(true)
        console.log("✅ Contextual insights loaded:", {
          insights: insightsData.insights?.length || 0,
          aiInsights: insightsData.aiInsights?.length || 0,
          curatedInsights: insightsData.curatedInsights?.length || 0,
          news: insightsData.newsArticles?.length || 0,
          source: insightsData.newsArticles?.[0]?.source || "fallback",
        })
      } else {
        console.error("❌ Failed to fetch insights:", response.status, response.statusText)
      }
    } catch (error) {
      console.error("❌ Failed to fetch contextual insights:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Manual load function
  const handleLoadInsights = () => {
    fetchInsights()
  }

  // Refresh function for already loaded insights
  const handleRefresh = () => {
    fetchInsights()
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`

    return date.toLocaleDateString()
  }

  const renderInsight = (insight: Insight) => {
    const IconComponent = typeIcons[insight.type as keyof typeof typeIcons] || Lightbulb

    return (
      <Card key={insight.id} className="mb-4">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <IconComponent className="h-4 w-4 text-gray-500" />
                <Badge variant={priorityColors[insight.priority]} className="text-xs">
                  {insight.priority}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {insight.type}
                </Badge>
                {data?.metadata.scenarioName && (
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                    <Target className="h-3 w-3 mr-1" />
                    Scenario-Specific
                  </Badge>
                )}
              </div>
              <div className="text-xs text-gray-500">{insight.confidence}% confidence</div>
            </div>

            <div>
              <h4 className="font-semibold text-sm text-gray-900 mb-1">{insight.title}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{insight.description}</p>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Source: {insight.source}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatTimeAgo(insight.timestamp)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderNewsArticle = (article: NewsArticle, index: number) => {
    return (
      <Card key={index} className="mb-4">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                  Recent News
                </Badge>
                {data?.metadata.scenarioName && (
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    <Target className="h-3 w-3 mr-1" />
                    Scenario-Related
                  </Badge>
                )}
              </div>
              <div className="text-xs text-gray-500">{Math.round(article.relevanceScore * 100)}% relevance</div>
            </div>

            <div>
              <h4 className="font-semibold text-sm text-gray-900 mb-2 leading-tight">{article.title}</h4>
              <p className="text-xs text-gray-600 leading-relaxed mb-3">{article.description}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Newspaper className="h-3 w-3" />
                  <span>Source: {article.source}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatTimeAgo(article.publishedAt)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">From {article.source}</div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-800 h-6 px-2 text-xs"
                  onClick={() => window.open(article.url, "_blank")}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Read Full Article
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show empty state with load button if no data loaded yet
  if (!hasLoaded && !isLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">{panelTitle || `Insights for ${activeTab}`}</h2>
            {simulationContext?.scenarioName && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Target className="h-3 w-3 mr-1" />
                {simulationContext.scenarioName}
              </Badge>
            )}
          </div>
          <p className="text-xs text-gray-600">
            {simulationContext?.scenarioName
              ? `Ready to analyze contextual insights for your simulation scenario`
              : `Ready to analyze real-time insights based on current market conditions`}
          </p>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-sm">
            <div className="w-16 h-16 mx-auto bg-blue-50 rounded-full flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Generate Contextual Insights</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get AI-powered insights, real-time news analysis, and strategic recommendations tailored to your current
                view and scenario.
              </p>
              <Button onClick={handleLoadInsights} className="w-full" size="lg">
                <Sparkles className="h-4 w-4 mr-2" />
                Load Insights & News
              </Button>
            </div>
            <div className="text-xs text-gray-500">
              <p>• Real-time news from multiple sources</p>
              <p>• AI-powered strategic recommendations</p>
              <p>• Scenario-specific risk analysis</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <p className="ml-2 text-sm text-gray-600">Loading insights...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (!data) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500 space-y-4">
          <AlertTriangle className="h-8 w-8 mx-auto text-gray-400" />
          <div>
            <p className="text-sm font-medium">Failed to load insights</p>
            <p className="text-xs text-gray-400 mt-1">Please try again</p>
          </div>
          <Button onClick={handleLoadInsights} variant="outline" size="sm">
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  // Calculate correct totals
  const totalRegularInsights = data.insights.length
  const totalAiInsights = data.aiInsights.length
  const totalCuratedInsights = data.curatedInsights.length
  const totalAllInsights = totalRegularInsights + totalAiInsights + totalCuratedInsights
  const totalNews = data.newsArticles.length
  const totalAll = totalAllInsights + totalNews

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">{panelTitle || `Insights for ${activeTab}`}</h2>
            {data?.metadata.scenarioName && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Target className="h-3 w-3 mr-1" />
                {data.metadata.scenarioName}
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isLoading} className="text-xs">
            {isLoading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <RefreshCw className="h-3 w-3 mr-1" />}
            Refresh
          </Button>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-600">
            {data?.metadata.scenarioName
              ? `Contextual analysis for your simulation scenario`
              : `Real-time analysis and recommendations based on current market conditions`}
          </p>
          {lastRefresh && (
            <p className="text-xs text-gray-500">
              Last updated: {lastRefresh.toLocaleTimeString()}
              {data?.newsArticles?.length > 0 && (
                <span className="ml-2 text-green-600">• Live news: {data.newsArticles.length} articles</span>
              )}
            </p>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all" className="text-xs">
                All ({totalAll})
              </TabsTrigger>
              <TabsTrigger value="insights" className="text-xs">
                Insights ({totalAllInsights})
              </TabsTrigger>
              <TabsTrigger value="news" className="text-xs">
                News ({totalNews})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {/* Regular insights */}
              {data.insights.map(renderInsight)}
              {/* AI insights */}
              {data.aiInsights.map(renderInsight)}
              {/* Curated insights */}
              {data.curatedInsights.map(renderInsight)}
              {/* News articles */}
              {data.newsArticles.map(renderNewsArticle)}

              {totalAll === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <Lightbulb className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No insights available for this section</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              {totalAllInsights > 0 ? (
                <>
                  {/* Regular insights */}
                  {data.insights.map(renderInsight)}
                  {/* AI insights */}
                  {data.aiInsights.map(renderInsight)}
                  {/* Curated insights */}
                  {data.curatedInsights.map(renderInsight)}
                </>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Lightbulb className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No insights available</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="news" className="space-y-4">
              {data.newsArticles.length > 0 ? (
                data.newsArticles.map(renderNewsArticle)
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Newspaper className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No recent supply chain news available</p>
                  <p className="text-xs text-gray-400 mt-1">
                    News API may be unavailable or no relevant articles found
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500 text-center">
          Last updated: {new Date(data.metadata.lastUpdated).toLocaleTimeString()}
          {data.metadata.scenarioName && (
            <span className="block mt-1">Contextual to: {data.metadata.scenarioName}</span>
          )}
        </div>
      </div>
    </div>
  )
}
