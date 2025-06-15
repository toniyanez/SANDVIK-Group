"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Calendar,
  ExternalLink,
  RefreshCw,
  Loader2,
  AlertTriangle,
  TrendingUp,
  Globe,
  Truck,
  Factory,
  DollarSign,
  Clock,
} from "lucide-react"

interface NewsArticle {
  id: string
  title: string
  description: string
  source: string
  publishedAt: string
  url: string
  category: string
  impactLevel: "Low" | "Medium" | "High" | "Critical"
  relevanceScore: number
}

interface NewsResponse {
  articles: NewsArticle[]
  metadata: {
    totalArticles: number
    lastUpdated: string
    dateRange: string
  }
}

const categoryIcons = {
  Geopolitical: Globe,
  Logistics: Truck,
  Manufacturing: Factory,
  Trade: DollarSign,
  Materials: TrendingUp,
  General: AlertTriangle,
}

const impactColors = {
  Critical: "destructive",
  High: "destructive",
  Medium: "default",
  Low: "secondary",
} as const

export default function SupplyChainNewsFeed() {
  const [news, setNews] = useState<NewsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  const fetchSupplyChainNews = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/supply-chain-news", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })

      if (response.ok) {
        const data = await response.json()
        setNews(data)
        setLastRefresh(new Date())
      } else {
        console.error("Failed to fetch supply chain news")
      }
    } catch (error) {
      console.error("Error fetching supply chain news:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSupplyChainNews()
  }, [])

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

  const getCategoryIcon = (category: string) => {
    const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || AlertTriangle
    return IconComponent
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Supply Chain News Feed</h2>
          <p className="text-gray-600">Latest news affecting global supply chain and logistics operations</p>
        </div>
        <Button
          onClick={fetchSupplyChainNews}
          disabled={isLoading}
          variant="outline"
          className="flex items-center gap-2"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Refresh News
        </Button>
      </div>

      {/* News Metadata */}
      {news?.metadata && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-blue-800">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{news.metadata.totalArticles} articles found</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Range: {news.metadata.dateRange}</span>
              </div>
            </div>
            {lastRefresh && (
              <div className="text-xs text-blue-600">Last updated: {lastRefresh.toLocaleTimeString()}</div>
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !news && (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Fetching latest supply chain news...</p>
        </div>
      )}

      {/* News Articles */}
      {news?.articles && (
        <div className="space-y-4">
          {news.articles.map((article) => {
            const IconComponent = getCategoryIcon(article.category)
            return (
              <Card key={article.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Article Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <IconComponent className="h-4 w-4 text-gray-500" />
                          <Badge variant="outline" className="text-xs">
                            {article.category}
                          </Badge>
                          <Badge variant={impactColors[article.impactLevel]} className="text-xs">
                            {article.impactLevel} Impact
                          </Badge>
                          <div className="text-xs text-gray-500">
                            Relevance: {Math.round(article.relevanceScore * 100)}%
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{article.description}</p>
                      </div>
                    </div>

                    {/* Article Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" />
                          <span className="font-medium">{article.source}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatTimeAgo(article.publishedAt)}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => window.open(article.url, "_blank")}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Read Full Article
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Empty State */}
      {news?.articles && news.articles.length === 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>No recent supply chain news found. Try refreshing or check back later.</AlertDescription>
        </Alert>
      )}

      {/* Error State */}
      {!isLoading && !news && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>Failed to load supply chain news. Please try refreshing the page.</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
