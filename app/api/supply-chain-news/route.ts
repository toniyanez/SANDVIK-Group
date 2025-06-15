import { type NextRequest, NextResponse } from "next/server"

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

// Helper function to categorize news articles
function categorizeArticle(
  title: string,
  description: string,
): {
  category: string
  impactLevel: "Low" | "Medium" | "High" | "Critical"
  relevanceScore: number
} {
  const content = `${title} ${description}`.toLowerCase()

  // Category determination
  let category = "General"
  if (
    content.includes("geopolitical") ||
    content.includes("war") ||
    content.includes("sanctions") ||
    content.includes("middle east") ||
    content.includes("china") ||
    content.includes("russia") ||
    content.includes("iran") ||
    content.includes("israel")
  ) {
    category = "Geopolitical"
  } else if (
    content.includes("shipping") ||
    content.includes("logistics") ||
    content.includes("freight") ||
    content.includes("transport") ||
    content.includes("port") ||
    content.includes("red sea") ||
    content.includes("suez") ||
    content.includes("airport") ||
    content.includes("rail") ||
    content.includes("hub")
  ) {
    category = "Logistics"
  } else if (
    content.includes("manufacturing") ||
    content.includes("factory") ||
    content.includes("production") ||
    content.includes("industrial")
  ) {
    category = "Manufacturing"
  } else if (
    content.includes("tariff") ||
    content.includes("trade") ||
    content.includes("import") ||
    content.includes("export") ||
    content.includes("customs")
  ) {
    category = "Trade"
  } else if (
    content.includes("material") ||
    content.includes("commodity") ||
    content.includes("price") ||
    content.includes("cobalt") ||
    content.includes("tungsten") ||
    content.includes("steel") ||
    content.includes("rare earth")
  ) {
    category = "Materials"
  } else if (
    content.includes("infrastructure") ||
    content.includes("congestion") ||
    content.includes("strike") ||
    content.includes("closure")
  ) {
    category = "Infrastructure"
  }

  // Impact level determination
  let impactLevel: "Low" | "Medium" | "High" | "Critical" = "Low"
  if (
    content.includes("crisis") ||
    content.includes("critical") ||
    content.includes("severe") ||
    content.includes("major disruption") ||
    content.includes("emergency") ||
    content.includes("closure")
  ) {
    impactLevel = "Critical"
  } else if (
    content.includes("disruption") ||
    content.includes("shortage") ||
    content.includes("delay") ||
    content.includes("increase") ||
    content.includes("volatility") ||
    content.includes("congestion") ||
    content.includes("strike")
  ) {
    impactLevel = "High"
  } else if (
    content.includes("concern") ||
    content.includes("risk") ||
    content.includes("challenge") ||
    content.includes("impact")
  ) {
    impactLevel = "Medium"
  }

  // Relevance score calculation
  let relevanceScore = 0.3 // Base score

  // Supply chain keywords boost
  const supplyChainKeywords = [
    "supply chain",
    "logistics",
    "shipping",
    "freight",
    "transport",
    "manufacturing",
    "production",
    "materials",
    "commodity",
    "trade",
    "tariff",
    "port",
    "warehouse",
    "airport",
    "rail",
    "hub",
    "congestion",
    "infrastructure",
  ]
  supplyChainKeywords.forEach((keyword) => {
    if (content.includes(keyword)) relevanceScore += 0.1
  })

  // Global impact keywords boost
  const globalKeywords = ["global", "international", "worldwide", "major", "significant"]
  globalKeywords.forEach((keyword) => {
    if (content.includes(keyword)) relevanceScore += 0.05
  })

  // Company/industry specific boost
  const industryKeywords = ["mining", "industrial", "technology", "automotive", "aerospace"]
  industryKeywords.forEach((keyword) => {
    if (content.includes(keyword)) relevanceScore += 0.05
  })

  // Hub congestion specific boost
  const hubKeywords = ["port congestion", "airport delays", "rail strike", "hub disruption", "infrastructure failure"]
  hubKeywords.forEach((keyword) => {
    if (content.includes(keyword)) relevanceScore += 0.15
  })

  return {
    category,
    impactLevel,
    relevanceScore: Math.min(relevanceScore, 1.0), // Cap at 1.0
  }
}

// Helper function to fetch supply chain news using TheNewsAPI as primary source
async function fetchSupplyChainNews(apiKey: string | undefined) {
  // First try TheNewsAPI
  if (process.env.THENEWSAPI_KEY) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/thenewsapi-supply-chain`,
      )
      if (response.ok) {
        const theNewsData = await response.json()
        if (theNewsData.articles && theNewsData.articles.length > 0) {
          console.log(`Successfully fetched ${theNewsData.articles.length} articles from TheNewsAPI`)
          return theNewsData
        }
      }
    } catch (error) {
      console.error("Failed to fetch from TheNewsAPI, falling back to NewsAPI:", error)
    }
  }

  // Fallback to original NewsAPI logic
  if (!apiKey) {
    return {
      articles: [],
      metadata: {
        totalArticles: 0,
        lastUpdated: new Date().toISOString(),
        dateRange: "N/A - No news API keys configured",
      },
    }
  }

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const fromDate = sevenDaysAgo.toISOString().split("T")[0]

  // Enhanced comprehensive search queries for supply chain news including major hub congestion
  const searchQueries = [
    // Major geopolitical events affecting supply chains
    '("Middle East" OR "Red Sea" OR "Suez Canal" OR "Gaza" OR "Israel" OR "Iran" OR "Yemen") AND (shipping OR logistics OR "supply chain" OR trade OR freight)',

    // Ukraine-Russia conflict impact
    '("Ukraine" OR "Russia" OR "Black Sea") AND ("supply chain" OR logistics OR grain OR energy OR shipping)',

    // China-related supply chain news
    '("China" OR "Taiwan" OR "South China Sea") AND ("supply chain" OR manufacturing OR trade OR tariffs OR logistics)',

    // Major Hub Congestion - Ports
    '("port congestion" OR "port strike" OR "port closure" OR "port delays" OR "dock workers strike" OR "longshoremen strike") AND (logistics OR shipping OR "supply chain")',

    // Major Hub Congestion - Airports
    '("airport congestion" OR "air cargo delays" OR "airport strike" OR "flight delays" OR "air freight delays" OR "cargo handling") AND (logistics OR "supply chain" OR cargo)',

    // Major Hub Congestion - Rail and Road Infrastructure
    '("rail strike" OR "railway disruption" OR "truck drivers strike" OR "highway closure" OR "bridge collapse" OR "tunnel closure") AND (logistics OR "supply chain" OR freight)',

    // General supply chain crisis terms
    '("supply chain crisis" OR "logistics nightmare" OR "global shortage" OR "supply disruption" OR "freight bottleneck")',
  ]

  const allArticles: any[] = []

  try {
    // Fetch from multiple queries
    for (const query of searchQueries) {
      const newsApiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${apiKey}&language=en&sortBy=publishedAt&pageSize=8&from=${fromDate}`

      try {
        const response = await fetch(newsApiUrl)
        if (response.ok) {
          const data = await response.json()
          if (data.articles && data.articles.length > 0) {
            allArticles.push(...data.articles)
          }
        }
      } catch (queryError) {
        console.error(`Failed to fetch news for query: ${query}`, queryError)
      }
    }

    // Remove duplicates and process articles
    const uniqueArticles = allArticles
      .filter((article, index, self) => index === self.findIndex((a) => a.title === article.title))
      .filter(
        (article) => article.title && article.description && article.source?.name && article.title !== "[Removed]",
      )
      .slice(0, 20) // Limit to 20 most recent

    // Process and categorize articles
    const processedArticles: NewsArticle[] = uniqueArticles.map((article, index) => {
      const { category, impactLevel, relevanceScore } = categorizeArticle(article.title, article.description || "")

      return {
        id: `article-${index}`,
        title: article.title,
        description: article.description || "No description available",
        source: article.source.name,
        publishedAt: article.publishedAt,
        url: article.url,
        category,
        impactLevel,
        relevanceScore,
      }
    })

    // Sort by relevance score and recency
    const sortedArticles = processedArticles.sort((a, b) => {
      // First sort by relevance score
      const relevanceDiff = b.relevanceScore - a.relevanceScore
      if (Math.abs(relevanceDiff) > 0.1) return relevanceDiff

      // Then by recency
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    })

    return {
      articles: sortedArticles,
      metadata: {
        totalArticles: sortedArticles.length,
        lastUpdated: new Date().toISOString(),
        dateRange: `${fromDate} to ${new Date().toISOString().split("T")[0]}`,
        source: "NewsAPI (fallback)",
      },
    }
  } catch (error) {
    console.error("Failed to fetch supply chain news:", error)
    return {
      articles: [],
      metadata: {
        totalArticles: 0,
        lastUpdated: new Date().toISOString(),
        dateRange: "Error fetching news",
        source: "Error",
      },
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const newsData = await fetchSupplyChainNews(process.env.NEWS_API_KEY)
    return NextResponse.json(newsData)
  } catch (error) {
    console.error("Supply chain news API error:", error)
    return NextResponse.json({ error: "Failed to fetch supply chain news" }, { status: 500 })
  }
}
