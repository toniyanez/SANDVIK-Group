import { type NextRequest, NextResponse } from "next/server"

interface TheNewsAPIArticle {
  uuid: string
  title: string
  description: string
  keywords: string
  snippet: string
  url: string
  image_url: string
  language: string
  published_at: string
  source: string
  categories: string[]
  relevance_score?: number
  locale: string
}

interface TheNewsAPIResponse {
  meta: {
    found: number
    returned: number
    limit: number
    page: number
  }
  data: TheNewsAPIArticle[]
}

interface ProcessedNewsArticle {
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

// Date filtering constants
const MAX_ARTICLE_AGE_DAYS = 15

// Helper function to check if article is recent (less than 15 days)
function isArticleRecent(publishedAt: string): boolean {
  try {
    const articleDate = new Date(publishedAt)
    const now = new Date()
    const daysDifference = (now.getTime() - articleDate.getTime()) / (1000 * 60 * 60 * 1000 * 24)

    return daysDifference <= MAX_ARTICLE_AGE_DAYS
  } catch (error) {
    console.error("Error parsing article date:", publishedAt, error)
    return false
  }
}

// Helper function to categorize news articles
function categorizeArticle(
  title: string,
  description: string,
  keywords: string,
  categories: string[],
): {
  category: string
  impactLevel: "Low" | "Medium" | "High" | "Critical"
  relevanceScore: number
} {
  const content = `${title} ${description} ${keywords}`.toLowerCase()
  const categoryList = categories.map((cat) => cat.toLowerCase())

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
    content.includes("israel") ||
    categoryList.includes("politics") ||
    categoryList.includes("world")
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
    content.includes("hub") ||
    content.includes("supply chain") ||
    categoryList.includes("business")
  ) {
    category = "Logistics"
  } else if (
    content.includes("manufacturing") ||
    content.includes("factory") ||
    content.includes("production") ||
    content.includes("industrial") ||
    categoryList.includes("business") ||
    categoryList.includes("technology")
  ) {
    category = "Manufacturing"
  } else if (
    content.includes("tariff") ||
    content.includes("trade") ||
    content.includes("import") ||
    content.includes("export") ||
    content.includes("customs") ||
    categoryList.includes("business") ||
    categoryList.includes("finance")
  ) {
    category = "Trade"
  } else if (
    content.includes("material") ||
    content.includes("commodity") ||
    content.includes("price") ||
    content.includes("cobalt") ||
    content.includes("tungsten") ||
    content.includes("steel") ||
    content.includes("rare earth") ||
    content.includes("mining") ||
    categoryList.includes("business")
  ) {
    category = "Materials"
  } else if (
    content.includes("infrastructure") ||
    content.includes("congestion") ||
    content.includes("strike") ||
    content.includes("closure") ||
    categoryList.includes("general")
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
    content.includes("closure") ||
    content.includes("suspended") ||
    content.includes("shutdown")
  ) {
    impactLevel = "Critical"
  } else if (
    content.includes("disruption") ||
    content.includes("shortage") ||
    content.includes("delay") ||
    content.includes("increase") ||
    content.includes("volatility") ||
    content.includes("congestion") ||
    content.includes("strike") ||
    content.includes("surge")
  ) {
    impactLevel = "High"
  } else if (
    content.includes("concern") ||
    content.includes("risk") ||
    content.includes("challenge") ||
    content.includes("impact") ||
    content.includes("warning")
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
    "sandvik",
    "mining",
    "industrial",
  ]
  supplyChainKeywords.forEach((keyword) => {
    if (content.includes(keyword)) relevanceScore += 0.1
  })

  // Global impact keywords boost
  const globalKeywords = ["global", "international", "worldwide", "major", "significant"]
  globalKeywords.forEach((keyword) => {
    if (content.includes(keyword)) relevanceScore += 0.05
  })

  // Hub congestion specific boost
  const hubKeywords = ["port congestion", "airport delays", "rail strike", "hub disruption", "infrastructure failure"]
  hubKeywords.forEach((keyword) => {
    if (content.includes(keyword)) relevanceScore += 0.15
  })

  // Category relevance boost
  if (categoryList.includes("business") || categoryList.includes("technology")) {
    relevanceScore += 0.1
  }

  return {
    category,
    impactLevel,
    relevanceScore: Math.min(relevanceScore, 1.0), // Cap at 1.0
  }
}

// Helper function to fetch supply chain news from TheNewsAPI with date filtering
async function fetchTheNewsAPISupplyChain(apiKey: string | undefined, context?: any) {
  if (!apiKey) {
    return {
      articles: [],
      metadata: {
        totalArticles: 0,
        lastUpdated: new Date().toISOString(),
        dateRange: "N/A - TheNewsAPI key not configured",
        source: "TheNewsAPI (not configured)",
        maxAgeDays: MAX_ARTICLE_AGE_DAYS,
      },
    }
  }

  // Set date range to last 15 days
  const fifteenDaysAgo = new Date()
  fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - MAX_ARTICLE_AGE_DAYS)
  const fromDate = context?.fromDate || fifteenDaysAgo.toISOString().split("T")[0]

  console.log(`📅 TheNewsAPI: Fetching articles from ${fromDate} (max ${MAX_ARTICLE_AGE_DAYS} days old)`)

  // Enhanced comprehensive search queries for supply chain news
  const searchQueries = context?.queries || [
    // Major geopolitical events affecting supply chains
    "Middle East shipping logistics supply chain Red Sea",
    "Ukraine Russia supply chain logistics grain energy",
    "China Taiwan supply chain manufacturing trade tariffs",

    // Major Hub Congestion - Ports
    "port congestion strike closure delays logistics shipping",
    "Los Angeles Long Beach port congestion delays",
    "Rotterdam Shanghai Singapore port disruption",

    // Major Hub Congestion - Airports and Rail
    "airport congestion air cargo delays freight",
    "rail strike railway disruption freight logistics",
    "truck drivers strike highway logistics",

    // Infrastructure and Energy
    "infrastructure failure power outage logistics supply chain",
    "energy crisis fuel shortage transportation logistics",

    // Critical materials and commodities
    "material shortage commodity prices rare earth semiconductor",
    "cobalt tungsten steel supply chain manufacturing",

    // Trade and tariffs
    "trade war tariffs export restrictions supply chain",
    "supply chain crisis logistics disruption global shortage",

    // Sandvik specific
    "Sandvik mining equipment supply chain logistics",
    "industrial technology supply chain materials",
  ]

  const allArticles: TheNewsAPIArticle[] = []

  try {
    // Fetch from multiple queries
    for (const query of searchQueries) {
      const theNewsApiUrl = `https://api.thenewsapi.com/v1/news/all?api_token=${apiKey}&search=${encodeURIComponent(query)}&language=en&limit=5&published_after=${fromDate}&sort=published_at&categories=business,general,technology`

      try {
        const response = await fetch(theNewsApiUrl)
        if (response.ok) {
          const data: TheNewsAPIResponse = await response.json()
          if (data.data && data.data.length > 0) {
            // Filter articles to ensure they're within 15 days
            const recentArticles = data.data.filter((article) => isArticleRecent(article.published_at))
            allArticles.push(...recentArticles)
            console.log(`📰 Query "${query}": ${data.data.length} total, ${recentArticles.length} recent`)
          }
        } else {
          console.error(`TheNewsAPI error for query: ${query}`, response.status, response.statusText)
        }
      } catch (queryError) {
        console.error(`Failed to fetch news for query: ${query}`, queryError)
      }

      // Add small delay between requests to be respectful to API
      await new Promise((resolve) => setTimeout(resolve, 200))
    }

    // Remove duplicates and process articles
    const uniqueArticles = allArticles
      .filter((article, index, self) => index === self.findIndex((a) => a.uuid === article.uuid))
      .filter(
        (article) => article.title && article.description && article.source && isArticleRecent(article.published_at),
      )
      .slice(0, 25) // Limit to 25 most recent

    // Process and categorize articles
    const processedArticles: ProcessedNewsArticle[] = uniqueArticles.map((article) => {
      const { category, impactLevel, relevanceScore } = categorizeArticle(
        article.title,
        article.description || "",
        article.keywords || "",
        article.categories || [],
      )

      return {
        id: article.uuid,
        title: article.title,
        description: article.description || "No description available",
        source: article.source,
        publishedAt: article.published_at,
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

    const articleAges = sortedArticles.map((article) => {
      const days = Math.round((Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60 * 24))
      return days
    })

    console.log(
      `✅ TheNewsAPI: Processed ${sortedArticles.length} recent articles, ages: ${articleAges.join(", ")} days`,
    )

    return {
      articles: sortedArticles,
      metadata: {
        totalArticles: sortedArticles.length,
        lastUpdated: new Date().toISOString(),
        dateRange: `${fromDate} to ${new Date().toISOString().split("T")[0]}`,
        source: "TheNewsAPI",
        maxAgeDays: MAX_ARTICLE_AGE_DAYS,
        averageAgeDays:
          articleAges.length > 0 ? Math.round(articleAges.reduce((a, b) => a + b, 0) / articleAges.length) : 0,
        allRecent: articleAges.every((age) => age <= MAX_ARTICLE_AGE_DAYS),
      },
    }
  } catch (error) {
    console.error("Failed to fetch supply chain news from TheNewsAPI:", error)
    return {
      articles: [],
      metadata: {
        totalArticles: 0,
        lastUpdated: new Date().toISOString(),
        dateRange: "Error fetching news",
        source: "TheNewsAPI (error)",
        maxAgeDays: MAX_ARTICLE_AGE_DAYS,
      },
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contextParam = searchParams.get("context")

    let context
    if (contextParam) {
      try {
        context = JSON.parse(decodeURIComponent(contextParam))
      } catch (e) {
        console.error("Failed to parse context:", e)
      }
    }

    console.log(`🔍 TheNewsAPI: Fetching recent supply chain news (≤${MAX_ARTICLE_AGE_DAYS} days)`)

    const newsData = await fetchTheNewsAPISupplyChain(process.env.THENEWSAPI_KEY, context)
    return NextResponse.json(newsData)
  } catch (error) {
    console.error("TheNewsAPI supply chain news API error:", error)
    return NextResponse.json({ error: "Failed to fetch supply chain news from TheNewsAPI" }, { status: 500 })
  }
}
