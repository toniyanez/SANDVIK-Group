import { type NextRequest, NextResponse } from "next/server"

interface NewsAPIArticle {
  title: string
  description: string
  source: {
    name: string
  }
  publishedAt: string
  url: string
  content?: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || "supply chain disruption"

    console.log(`🔍 NewsAPI: Fetching articles for query: "${query}"`)

    if (!process.env.NEWS_API_KEY) {
      console.error("❌ NewsAPI: API key not configured")
      return NextResponse.json({ error: "NewsAPI key not configured" }, { status: 500 })
    }

    // Build NewsAPI URL
    const newsAPIUrl = new URL("https://newsapi.org/v2/everything")
    newsAPIUrl.searchParams.set("q", query)
    newsAPIUrl.searchParams.set("language", "en")
    newsAPIUrl.searchParams.set("sortBy", "publishedAt")
    newsAPIUrl.searchParams.set("pageSize", "20")
    newsAPIUrl.searchParams.set("apiKey", process.env.NEWS_API_KEY)

    const response = await fetch(newsAPIUrl.toString())

    if (!response.ok) {
      console.error(`❌ NewsAPI: HTTP ${response.status} ${response.statusText}`)
      return NextResponse.json(
        {
          error: `NewsAPI error: ${response.status} ${response.statusText}`,
        },
        { status: response.status },
      )
    }

    const data = await response.json()

    if (data.status !== "ok") {
      console.error("❌ NewsAPI: API returned error:", data.message)
      return NextResponse.json(
        {
          error: `NewsAPI error: ${data.message}`,
        },
        { status: 400 },
      )
    }

    // Filter and process articles
    const articles = data.articles
      .filter(
        (article: NewsAPIArticle) =>
          article.title &&
          article.description &&
          article.source?.name &&
          !article.title.includes("[Removed]") &&
          !article.description.includes("[Removed]"),
      )
      .map((article: NewsAPIArticle) => ({
        title: article.title,
        description: article.description,
        source: article.source.name,
        publishedAt: article.publishedAt,
        url: article.url,
        relevanceScore: calculateRelevanceScore(article, query),
      }))
      .sort((a: any, b: any) => b.relevanceScore - a.relevanceScore)

    console.log(`✅ NewsAPI: Successfully fetched ${articles.length} articles`)

    return NextResponse.json({
      articles,
      totalResults: data.totalResults,
      query,
      source: "NewsAPI",
    })
  } catch (error) {
    console.error("❌ NewsAPI: Fetch error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch from NewsAPI",
      },
      { status: 500 },
    )
  }
}

function calculateRelevanceScore(article: NewsAPIArticle, query: string): number {
  let score = 0.5 // Base score

  const queryTerms = query.toLowerCase().split(" ")
  const titleLower = article.title.toLowerCase()
  const descLower = article.description.toLowerCase()

  // Check for query terms in title (higher weight)
  queryTerms.forEach((term) => {
    if (titleLower.includes(term)) score += 0.2
    if (descLower.includes(term)) score += 0.1
  })

  // Boost for supply chain related terms
  const supplyChainTerms = [
    "supply chain",
    "logistics",
    "shipping",
    "freight",
    "port",
    "container",
    "manufacturing",
    "industrial",
    "materials",
    "disruption",
    "shortage",
  ]

  supplyChainTerms.forEach((term) => {
    if (titleLower.includes(term)) score += 0.15
    if (descLower.includes(term)) score += 0.05
  })

  // Recency boost (newer articles get higher scores)
  const publishedDate = new Date(article.publishedAt)
  const daysSincePublished = (Date.now() - publishedDate.getTime()) / (1000 * 60 * 60 * 24)

  if (daysSincePublished <= 1) score += 0.2
  else if (daysSincePublished <= 3) score += 0.1
  else if (daysSincePublished <= 7) score += 0.05

  return Math.min(score, 1.0) // Cap at 1.0
}
