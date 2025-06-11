"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
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
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Settings,
  Truck,
  BarChart3,
  Brain,
  ArrowRight,
  Zap,
  Factory,
  Users,
  ShieldQuestion,
  ClipboardCheck,
  Play,
  Rocket,
  Leaf,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

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
  detailedSources?: Array<{ name: string; contribution: string }>
  sourcesCheckedCount?: number
  category?: string
  type?: "ai" | "manual" | "news"
  sentiment?: "positive" | "negative" | "neutral"
  verification?: string
  fullReportUrl?: string
}

interface ContextualInsightsPanelProps {
  activeTab: string
  className?: string
}

const iconMap: { [key: string]: LucideIcon } = {
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Settings,
  Truck,
  BarChart3,
  Brain,
  FileText,
  ArrowRight,
  ListChecks,
  Zap,
  Factory,
  Info,
  Clock,
  ShieldCheck,
  BookOpen,
  ExternalLink,
  CheckCircle2,
  ServerCrash,
  Bot,
  Newspaper,
  Users,
  ShieldQuestion,
  ClipboardCheck,
  Play,
  Rocket,
  Leaf,
  KeyIcon: Settings,
  Building2: Factory,
  Globe: TrendingUp,
}
const DefaultIcon = Info

const InsightTypeIcon = ({ type, iconName }: { type?: ApiInsight["type"]; iconName?: string }) => {
  if (type === "news") return <Newspaper className="w-5 h-5 text-orange-500" />
  if (type === "ai") return <Bot className="w-5 h-5 text-purple-500" />
  if (type === "manual") return <CheckCircle2 className="w-5 h-5 text-blue-500" />

  const IconComponent = iconName ? iconMap[iconName] : DefaultIcon
  return IconComponent ? (
    <IconComponent className="w-5 h-5 text-slate-500" />
  ) : (
    <DefaultIcon className="w-5 h-5 text-slate-500" />
  )
}

const ContextualInsightsPanel: React.FC<ContextualInsightsPanelProps> = ({ activeTab, className }) => {
  const [insights, setInsights] = useState<ApiInsight[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeInsightType, setActiveInsightType] = useState<"all" | "ai" | "manual" | "news">("all")

  const formatTabNameForDisplay = (tabId: string): string => {
    if (!tabId) return "Insights"
    return tabId
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  useEffect(() => {
    const fetchInsightsForTab = async () => {
      if (!activeTab) {
        setInsights([])
        setIsLoading(false)
        setError("No active tab specified for insights.")
        return
      }

      setIsLoading(true)
      setError(null)
      setInsights([])

      try {
        const response = await fetch(`/api/contextual-insights?tab=${activeTab}`)

        if (!response.ok) {
          let errorMessage = `Failed to fetch insights (Status: ${response.status})`
          try {
            const errorBody = await response.json()
            errorMessage = `Error: ${errorBody.error || errorBody.message || response.statusText} (Status: ${response.status})`
          } catch (jsonError) {
            // Use existing errorMessage
          }
          throw new Error(errorMessage)
        }

        const data = await response.json()
        const fetchedInsights: ApiInsight[] = (data.insights || []).map((insight: ApiInsight, index: number) => {
          let determinedType = insight.type
          if (!determinedType) {
            determinedType = insight.isAI ? "ai" : insight.source.toLowerCase().includes("news") ? "news" : "manual"
          }
          return {
            ...insight,
            id: insight.id || `${activeTab}-insight-${index}`,
            type: determinedType,
            category: insight.badgeText,
            verification: insight.sourcesCheckedCount ? `${insight.sourcesCheckedCount} sources checked` : undefined,
            fullReportUrl: insight.actionLink?.href,
            sentiment:
              insight.badgeVariant === "destructive"
                ? "negative"
                : insight.badgeVariant === "success" ||
                    (insight.badgeClassName && insight.badgeClassName.includes("green"))
                  ? "positive"
                  : "neutral",
          }
        })
        setInsights(fetchedInsights)
      } catch (err: any) {
        console.error(`Error fetching insights for tab "${activeTab}" in ContextualInsightsPanel:`, err)
        setError(err.message || "An unknown error occurred while fetching insights.")
        setInsights([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchInsightsForTab()
  }, [activeTab])

  const filteredInsights = useMemo(() => {
    const baseFiltered =
      activeInsightType === "all" ? insights : insights.filter((insight) => insight.type === activeInsightType)

    if (activeInsightType === "news" || activeInsightType === "all") {
      return [...baseFiltered].sort((a, b) => {
        if (a.timestamp && b.timestamp) {
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        }
        if (a.timestamp) return -1
        if (b.timestamp) return 1
        return 0
      })
    }
    return baseFiltered
  }, [insights, activeInsightType])

  const getSentimentClasses = (sentiment?: ApiInsight["sentiment"]) => {
    switch (sentiment) {
      case "positive":
        return "border-l-4 border-green-500"
      case "negative":
        return "border-l-4 border-red-500"
      case "neutral":
      default:
        return "border-l-4 border-slate-300 dark:border-slate-600"
    }
  }

  const getBadgeStyling = (
    badgeVariant?: ApiInsight["badgeVariant"],
    badgeClassName?: string,
    isAI?: boolean,
    type?: ApiInsight["type"],
  ): { variant: "default" | "secondary" | "destructive" | "outline"; className: string } => {
    if (type === "ai" && badgeClassName?.includes("purple")) {
      return { variant: "default", className: badgeClassName }
    }
    if (badgeClassName) return { variant: "default", className: badgeClassName }

    switch (badgeVariant) {
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

  const panelTitle = `Insights for ${formatTabNameForDisplay(activeTab)}`

  if (isLoading) {
    return (
      <Card className={cn("shadow-lg h-full flex items-center justify-center", className)}>
        <div className="flex flex-col items-center text-slate-500 dark:text-slate-400">
          <Loader2 className="w-12 h-12 animate-spin text-brand-accent mb-4" />
          <p className="text-lg font-semibold">Loading Insights...</p>
          <p className="text-sm">Fetching latest data for {formatTabNameForDisplay(activeTab)}.</p>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card
        className={cn("shadow-lg h-full flex items-center justify-center p-6 bg-red-50 dark:bg-red-900/30", className)}
      >
        <div className="flex flex-col items-center text-red-700 dark:text-red-300 text-center">
          <ServerCrash className="w-12 h-12 mb-4" />
          <p className="text-lg font-semibold mb-1">Error Loading Insights</p>
          <p className="text-sm mb-3">Could not fetch insights for {formatTabNameForDisplay(activeTab)}.</p>
          <p className="text-xs text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-800/50 p-2 rounded-md">
            Details: {error}
          </p>
        </div>
      </Card>
    )
  }

  if (insights.length === 0 && !isLoading) {
    return (
      <Card className={cn("shadow-lg h-full flex items-center justify-center", className)}>
        <div className="flex flex-col items-center text-slate-500 dark:text-slate-400 p-6 text-center">
          <Info className="w-12 h-12 text-brand-accent mb-4" />
          <p className="text-lg font-semibold">No Insights Available</p>
          <p className="text-sm">
            There are no contextual insights for "{formatTabNameForDisplay(activeTab)}" at this time.
          </p>
        </div>
      </Card>
    )
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
      <CardContent className="p-0 flex-grow overflow-y-auto">
        <Tabs
          defaultValue="all"
          onValueChange={(value) => setActiveInsightType(value as "all" | "ai" | "manual" | "news")}
          className="h-full flex flex-col"
        >
          <TabsList className="mx-3 mt-3 mb-1 sticky top-0 bg-slate-100 dark:bg-slate-800 z-10">
            <TabsTrigger value="all">All ({insights.length})</TabsTrigger>
            <TabsTrigger value="ai">AI ({insights.filter((i) => i.type === "ai").length})</TabsTrigger>
            <TabsTrigger value="manual">Curated ({insights.filter((i) => i.type === "manual").length})</TabsTrigger>
            <TabsTrigger value="news">News ({insights.filter((i) => i.type === "news").length})</TabsTrigger>
          </TabsList>

          <div className="p-3 space-y-3 flex-grow overflow-y-auto">
            {filteredInsights.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400 p-6 text-center">
                <Info className="w-10 h-10 text-brand-accent mb-3" />
                <p className="text-md font-semibold">No {activeInsightType} insights</p>
                <p className="text-sm">
                  There are no insights of this type for "{formatTabNameForDisplay(activeTab)}".
                </p>
              </div>
            )}
            {filteredInsights.map((insight) => {
              const badgeStyle = getBadgeStyling(
                insight.badgeVariant,
                insight.badgeClassName,
                insight.isAI,
                insight.type,
              )
              const ActionIcon = insight.actionLink
                ? iconMap[insight.actionLink.iconName] || ExternalLink
                : ExternalLink

              return (
                <Card
                  key={insight.id || insight.title}
                  className={cn(
                    "bg-white dark:bg-slate-800/70 shadow-sm hover:shadow-md transition-shadow",
                    getSentimentClasses(insight.sentiment),
                  )}
                >
                  <CardHeader className="py-3 px-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2">
                        <InsightTypeIcon type={insight.type} iconName={insight.iconName} />
                        <h3 className="text-md font-semibold text-slate-800 dark:text-slate-100">{insight.title}</h3>
                      </div>
                      <Badge variant={badgeStyle.variant} className={cn("text-xs px-2 py-0.5", badgeStyle.className)}>
                        {insight.badgeText}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="py-2 px-4 text-sm text-slate-600 dark:text-slate-300">
                    <p className="leading-relaxed">{insight.description}</p>

                    <div className="mt-3 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center">
                        <BookOpen className="w-3.5 h-3.5 mr-1.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                        <span className="font-medium mr-1">Source:</span>
                        <span className="truncate" title={insight.source}>
                          {insight.source}
                        </span>
                        {insight.timestamp && (
                          <>
                            <span className="mx-1.5">·</span>
                            <Clock className="w-3.5 h-3.5 mr-1 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                            <span>{formatDistanceToNow(new Date(insight.timestamp), { addSuffix: true })}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center">
                        <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                        <span className="font-medium mr-1">Confidence:</span>
                        <span>
                          {typeof insight.confidence === "number" ? `${insight.confidence}%` : insight.confidence}
                        </span>
                        {insight.verification && (
                          <>
                            <span className="mx-1.5">·</span>
                            <ListChecks className="w-3.5 h-3.5 mr-1 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                            <span>{insight.verification}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  {(insight.fullReportUrl || insight.actionLink) && (
                    <CardFooter className="py-2 px-4 border-t dark:border-slate-700/50">
                      <Link
                        href={insight.fullReportUrl || insight.actionLink?.href || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-xs text-brand-accent hover:underline font-medium"
                      >
                        <ActionIcon className="w-3.5 h-3.5 mr-1.5" />
                        {insight.actionLink?.text || "View Details"}
                        <ExternalLink className="w-3 h-3 ml-1 opacity-70" />
                      </Link>
                    </CardFooter>
                  )}
                </Card>
              )
            })}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default ContextualInsightsPanel
