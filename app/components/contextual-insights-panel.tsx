"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button" // Import Button
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Lightbulb,
  CheckCircle2,
  Info,
  ExternalLink,
  BookOpen,
  Clock,
  ShieldCheck,
  ListChecks,
  FileText,
  Loader2,
  ServerCrash,
  Bot,
  Newspaper,
  type LucideIcon,
  AlertTriangle,
  DollarSign,
  Settings,
  Truck,
  Rocket,
  Factory,
  ShieldQuestion,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface DetailedSource {
  name: string
  contribution: string
}

interface ApiInsight {
  id?: string
  iconName: string
  title: string
  description: string
  badgeText: string
  badgeVariant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"
  badgeClassName?: string
  source: string
  confidence: number | string
  isAI?: boolean
  actionLink?: {
    href: string
    text: string
    iconName: string
  }
  timestamp?: string
  detailedSources?: DetailedSource[]
  sourcesCheckedCount?: number
  category?: string
  type?: "ai" | "manual" | "news"
  sentiment?: "positive" | "negative" | "neutral"
  verification?: string
  fullReportUrl?: string
}

interface ContextualInsightsPanelProps {
  activeTab: string
  panelTitle: string
  className?: string
}

const iconMap: { [key: string]: LucideIcon } = {
  Lightbulb,
  TrendingUp: Lightbulb,
  AlertTriangle,
  DollarSign,
  Settings,
  Truck,
  BarChart3: ListChecks,
  Brain: Bot,
  FileText,
  ArrowRight: ExternalLink,
  ListChecks,
  Zap: Lightbulb,
  Factory,
  Info,
  Clock,
  ShieldCheck,
  BookOpen,
  ExternalLink,
  MessageSquareWarning: AlertTriangle,
  CheckCircle2,
  XCircle: ServerCrash,
  Bot,
  Newspaper,
  Rocket,
  ShieldQuestion,
  Sparkles,
}
const DefaultIcon = Info

const InsightTypeIcon = ({ type, iconName }: { type?: ApiInsight["type"]; iconName?: string }) => {
  const ResolvedIcon = iconName ? iconMap[iconName] : DefaultIcon

  if (type === "ai") return <Bot className="w-5 h-5 text-purple-500" />
  if (type === "manual") return <CheckCircle2 className="w-5 h-5 text-blue-500" />
  if (type === "news") return <Newspaper className="w-5 h-5 text-orange-500" />

  return ResolvedIcon ? (
    <ResolvedIcon className="w-5 h-5 text-slate-500" />
  ) : (
    <DefaultIcon className="w-5 h-5 text-slate-500" />
  )
}

const ContextualInsightsPanel: React.FC<ContextualInsightsPanelProps> = ({ activeTab, panelTitle, className }) => {
  const [insights, setInsights] = useState<ApiInsight[]>([])
  const [isLoading, setIsLoading] = useState(false) // Start as false
  const [error, setError] = useState<string | null>(null)
  const [activeInsightType, setActiveInsightType] = useState<"all" | "ai" | "manual" | "news">("all")
  const [insightsRequested, setInsightsRequested] = useState(false) // New state

  useEffect(() => {
    // Only fetch if insights have been requested and activeTab is valid
    if (!insightsRequested || !activeTab) {
      // If not requested, or tab changes and becomes invalid, reset insights
      setInsights([])
      setIsLoading(false)
      setError(null)
      return
    }

    const fetchInsightsForTab = async () => {
      setIsLoading(true)
      setError(null)
      setInsights([]) // Clear previous insights before new fetch

      try {
        const response = await fetch(`/api/contextual-insights?tab=${activeTab}`)
        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({}))
          throw new Error(
            errorBody.error || errorBody.message || `Failed to fetch insights (Status: ${response.status})`,
          )
        }
        const data = await response.json()
        const fetchedInsights: ApiInsight[] = (data.insights || []).map((insight: any, index: number) => ({
          ...insight,
          id: insight.id || `${activeTab}-insight-${index}-${Date.now()}`,
          type:
            insight.type || (insight.isAI ? (insight.source.toLowerCase().includes("news") ? "news" : "ai") : "manual"),
          category: insight.badgeText,
          verification: insight.sourcesCheckedCount ? `${insight.sourcesCheckedCount} sources checked` : undefined,
          fullReportUrl: insight.actionLink?.href,
          sentiment:
            insight.badgeVariant === "destructive"
              ? "negative"
              : insight.badgeVariant === "success"
                ? "positive"
                : "neutral",
        }))
        setInsights(fetchedInsights)
      } catch (err: any) {
        console.error("Error fetching insights:", err)
        setError(err.message || "An unknown error occurred.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchInsightsForTab()
  }, [activeTab, insightsRequested]) // Add insightsRequested to dependency array

  // Reset insightsRequested when activeTab changes, so user has to click again for new tab
  useEffect(() => {
    setInsightsRequested(false)
  }, [activeTab])

  const handleLoadInsights = () => {
    setInsightsRequested(true)
  }

  const filteredInsights = useMemo(() => {
    if (activeInsightType === "all") return insights
    return insights.filter((insight) => insight.type === activeInsightType)
  }, [insights, activeInsightType])

  const getSentimentClasses = (sentiment?: ApiInsight["sentiment"]) => {
    switch (sentiment) {
      case "positive":
        return "border-l-4 border-green-500"
      case "negative":
        return "border-l-4 border-red-500"
      default:
        return "border-l-4 border-slate-300 dark:border-slate-600"
    }
  }

  const getBadgeStyling = (
    insight: ApiInsight,
  ): { variant: "default" | "secondary" | "destructive" | "outline"; className: string } => {
    if (insight.type === "news") return { variant: "outline", className: "border-orange-500 text-orange-600" }
    if (insight.isAI) return { variant: "default", className: "bg-sky-500 hover:bg-sky-600 text-white border-sky-600" }
    switch (insight.badgeVariant) {
      case "success":
        return { variant: "default", className: "bg-green-500 hover:bg-green-600 text-white border-green-600" }
      case "warning":
        return { variant: "default", className: "bg-amber-500 hover:bg-amber-600 text-white border-amber-600" }
      case "info":
        return { variant: "default", className: "bg-blue-500 hover:bg-blue-600 text-white border-blue-600" }
      case "destructive":
        return { variant: "destructive", className: "" }
      default:
        return { variant: "secondary", className: "" }
    }
  }

  return (
    <Card className={cn("shadow-lg h-full flex flex-col", className)}>
      <CardHeader className="pb-3 pt-4 px-4 border-b dark:border-slate-700">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-brand-dark dark:text-slate-100 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-brand-accent" />
            {panelTitle}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-grow overflow-y-auto flex flex-col">
        {!insightsRequested ? (
          <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
            <Info className="w-12 h-12 text-brand-accent mb-4" />
            <p className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-2">Contextual Insights Ready</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Click the button below to load insights relevant to the current view.
            </p>
            <Button onClick={handleLoadInsights} className="bg-brand-accent hover:bg-brand-accent/90">
              <Sparkles className="w-4 h-4 mr-2" />
              Load Insights for {activeTab}
            </Button>
          </div>
        ) : isLoading ? (
          <div className="flex-grow flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
            <Loader2 className="w-12 h-12 animate-spin text-brand-accent mb-4" />
            <p className="text-lg font-semibold">Loading Insights...</p>
            <p className="text-sm">Please wait while we fetch the latest data.</p>
          </div>
        ) : error ? (
          <div className="flex-grow flex flex-col items-center justify-center p-6 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-center">
            <ServerCrash className="w-12 h-12 mb-4" />
            <p className="text-lg font-semibold mb-1">Error Loading Insights</p>
            <p className="text-sm mb-3">We couldn't fetch the contextual insights.</p>
            <p className="text-xs text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-800/50 p-2 rounded-md mb-4">
              Details: {error}
            </p>
            <Button onClick={handleLoadInsights} variant="outline">
              <Sparkles className="w-4 h-4 mr-2" />
              Retry Loading Insights
            </Button>
          </div>
        ) : (
          // Insights loaded (or no insights found after loading)
          <Tabs
            defaultValue="all"
            onValueChange={(value) => setActiveInsightType(value as any)}
            className="h-full flex flex-col"
          >
            <TabsList className="mx-3 mt-3 mb-1 sticky top-0 bg-slate-100 dark:bg-slate-800 z-10">
              <TabsTrigger value="all">All ({insights.length})</TabsTrigger>
              <TabsTrigger value="ai">AI ({insights.filter((i) => i.type === "ai").length})</TabsTrigger>
              <TabsTrigger value="manual">Curated ({insights.filter((i) => i.type === "manual").length})</TabsTrigger>
              <TabsTrigger value="news">News ({insights.filter((i) => i.type === "news").length})</TabsTrigger>
            </TabsList>
            <div className="p-3 space-y-3 flex-grow overflow-y-auto">
              {filteredInsights.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400 p-6 text-center">
                  <Info className="w-10 h-10 text-brand-accent mb-3" />
                  <p className="text-md font-semibold">No {activeInsightType} insights</p>
                  <p className="text-sm">There are no insights of this type for "{activeTab}".</p>
                </div>
              ) : (
                filteredInsights.map((insight) => {
                  const badgeStyle = getBadgeStyling(insight)
                  return (
                    <Card
                      key={insight.id}
                      className={cn(
                        "bg-white dark:bg-slate-800/70 shadow-sm hover:shadow-md transition-shadow",
                        getSentimentClasses(insight.sentiment),
                      )}
                    >
                      <CardHeader className="py-3 px-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-2">
                            <InsightTypeIcon type={insight.type} iconName={insight.iconName} />
                            <h3 className="text-md font-semibold text-slate-800 dark:text-slate-100">
                              {insight.title}
                            </h3>
                          </div>
                          <Badge
                            variant={badgeStyle.variant}
                            className={cn("text-xs px-2 py-0.5", badgeStyle.className)}
                          >
                            {insight.badgeText}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="py-2 px-4 text-sm text-slate-600 dark:text-slate-300">
                        <p className="leading-relaxed">{insight.description}</p>
                        <div className="mt-3 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                          <div className="flex items-center">
                            <BookOpen className="w-3.5 h-3.5 mr-1.5 text-slate-400 dark:text-slate-500 shrink-0" />
                            <span className="font-medium mr-1">Source:</span>
                            <span className="truncate" title={insight.source}>
                              {insight.source}
                            </span>
                            {insight.timestamp && (
                              <>
                                <span className="mx-1.5">·</span>
                                <Clock className="w-3.5 h-3.5 mr-1 text-slate-400 dark:text-slate-500 shrink-0" />
                                <span>{formatDistanceToNow(new Date(insight.timestamp), { addSuffix: true })}</span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center">
                            <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-slate-400 dark:text-slate-500 shrink-0" />
                            <span className="font-medium mr-1">Confidence:</span>
                            <span>
                              {typeof insight.confidence === "number" ? `${insight.confidence}%` : insight.confidence}
                            </span>
                            {insight.verification && (
                              <>
                                <span className="mx-1.5">·</span>
                                <ListChecks className="w-3.5 h-3.5 mr-1 text-slate-400 dark:text-slate-500 shrink-0" />
                                <span>{insight.verification}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                      {insight.fullReportUrl && (
                        <CardFooter className="py-2 px-4 border-t dark:border-slate-700/50">
                          <Link
                            href={insight.fullReportUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-xs text-brand-accent hover:underline font-medium"
                          >
                            <FileText className="w-3.5 h-3.5 mr-1.5" />
                            {insight.actionLink?.text || "View Full Report"}
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </Link>
                        </CardFooter>
                      )}
                    </Card>
                  )
                })
              )}
            </div>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}

export default ContextualInsightsPanel
