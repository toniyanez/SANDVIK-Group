import { type NextRequest, NextResponse } from "next/server"

interface NewsArticle {
  title: string
  description: string
  source: string
  publishedAt: string
  url: string
  relevanceScore: number
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

// Helper function to fetch news from TheNewsAPI
async function fetchTheNewsAPIForInsights(simulationContext?: SimulationContext): Promise<NewsArticle[]> {
  if (!process.env.THENEWSAPI_KEY) {
    return getCurrentSupplyChainNews(simulationContext)
  }

  try {
    // Build search queries based on simulation context
    let searchQueries = []

    if (simulationContext?.scenarioName) {
      const scenarioLower = simulationContext.scenarioName.toLowerCase()

      // Scenario-specific queries
      if (scenarioLower.includes("ormuz") || scenarioLower.includes("hormuz")) {
        searchQueries.push('("Strait of Hormuz" OR "Persian Gulf" OR "Hormuz") AND (shipping OR oil OR logistics)')
        searchQueries.push('("Iran" OR "Middle East") AND (sanctions OR blockade OR shipping)')
      } else if (scenarioLower.includes("cobalt")) {
        searchQueries.push('("cobalt supply" OR "DRC mining" OR "cobalt shortage") AND (manufacturing OR supply chain)')
        searchQueries.push('("Democratic Republic Congo" OR "cobalt prices") AND (mining OR materials)')
      } else if (scenarioLower.includes("trade war") || scenarioLower.includes("tariff")) {
        searchQueries.push('("trade war" OR "tariffs" OR "trade tensions") AND (manufacturing OR supply chain)')
        searchQueries.push('("US China trade" OR "industrial goods tariffs") AND logistics')
      } else if (scenarioLower.includes("red sea")) {
        searchQueries.push('("Red Sea" OR "Suez Canal" OR "Houthi") AND (shipping OR logistics)')
        searchQueries.push('("container shipping" OR "freight rates") AND "Red Sea"')
      }
    }

    // Add general supply chain queries if no specific context
    if (searchQueries.length === 0) {
      searchQueries = [
        '("supply chain disruption" OR "logistics crisis" OR "shipping delays")',
        '("port congestion" OR "freight rates" OR "material shortage")',
      ]
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/thenewsapi-supply-chain?context=${encodeURIComponent(JSON.stringify({ queries: searchQueries }))}`,
    )

    if (response.ok) {
      const theNewsData = await response.json()
      if (theNewsData.articles && theNewsData.articles.length > 0) {
        console.log(
          `Contextual Insights using ${theNewsData.articles.length} scenario-specific articles from TheNewsAPI`,
        )

        return theNewsData.articles.slice(0, 8).map((article: any) => ({
          title: article.title,
          description: article.description,
          source: article.source,
          publishedAt: new Date(article.publishedAt).toISOString().split("T")[0],
          url: article.url,
          relevanceScore: article.relevanceScore,
        }))
      }
    }
  } catch (error) {
    console.error("Failed to fetch from TheNewsAPI for Contextual Insights, using fallback:", error)
  }

  return getCurrentSupplyChainNews(simulationContext)
}

// Generate scenario-specific fallback news
function getCurrentSupplyChainNews(simulationContext?: SimulationContext): NewsArticle[] {
  const today = new Date()
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  const twoDaysAgo = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)

  const todayStr = today.toISOString().split("T")[0]
  const yesterdayStr = yesterday.toISOString().split("T")[0]
  const twoDaysAgoStr = twoDaysAgo.toISOString().split("T")[0]

  // Generate scenario-specific news if context is provided
  if (simulationContext?.scenarioName) {
    const scenarioLower = simulationContext.scenarioName.toLowerCase()

    if (scenarioLower.includes("ormuz") || scenarioLower.includes("hormuz")) {
      return [
        {
          title: "Strait of Hormuz Tensions Escalate, Oil Tanker Traffic Disrupted",
          description:
            "Geopolitical tensions in the Strait of Hormuz are causing major disruptions to oil tanker traffic, affecting 20% of global oil shipments and creating supply chain bottlenecks.",
          source: "Energy Intelligence",
          publishedAt: yesterdayStr,
          url: `https://www.google.com/search?q="Strait+of+Hormuz+tensions+oil+tanker+traffic+disrupted"+${yesterdayStr}&tbm=nws`,
          relevanceScore: 0.98,
        },
        {
          title: "Persian Gulf Shipping Routes Face Security Concerns",
          description:
            "Major shipping companies reroute vessels around Persian Gulf due to security concerns, adding 7-10 days to delivery times for industrial components.",
          source: "Maritime Executive",
          publishedAt: todayStr,
          url: `https://www.google.com/search?q="Persian+Gulf+shipping+routes+security+concerns+reroute"+${todayStr}&tbm=nws`,
          relevanceScore: 0.95,
        },
        {
          title: "Middle East Crisis Impacts Global Manufacturing Supply Chains",
          description:
            "Manufacturing companies report significant delays in raw material deliveries due to Middle East shipping disruptions, forcing production schedule adjustments.",
          source: "Manufacturing Today",
          publishedAt: twoDaysAgoStr,
          url: `https://www.google.com/search?q="Middle+East+crisis+manufacturing+supply+chains+delays"+${twoDaysAgoStr}&tbm=nws`,
          relevanceScore: 0.92,
        },
      ]
    } else if (scenarioLower.includes("cobalt")) {
      return [
        {
          title: "DRC Cobalt Mining Operations Face Political Instability",
          description:
            "Political unrest in Democratic Republic of Congo threatens cobalt mining operations, potentially reducing global supply by 40% and affecting battery manufacturing.",
          source: "Mining Weekly",
          publishedAt: yesterdayStr,
          url: `https://www.google.com/search?q="DRC+cobalt+mining+political+instability+supply+reduction"+${yesterdayStr}&tbm=nws`,
          relevanceScore: 0.96,
        },
        {
          title: "Cobalt Prices Surge as Supply Chain Concerns Mount",
          description:
            "Cobalt prices reach 18-month highs as manufacturers scramble to secure alternative sources amid DRC supply disruptions, impacting industrial equipment production.",
          source: "Metal Bulletin",
          publishedAt: todayStr,
          url: `https://www.google.com/search?q="cobalt+prices+surge+supply+chain+concerns+DRC+disruptions"+${todayStr}&tbm=nws`,
          relevanceScore: 0.94,
        },
      ]
    }
  }

  // Default fallback news
  return [
    {
      title: "Global Supply Chain Disruptions Continue to Impact Manufacturing",
      description:
        "Multiple supply chain challenges including shipping delays, material shortages, and geopolitical tensions are creating complex operational challenges for manufacturers.",
      source: "Supply Chain Digest",
      publishedAt: yesterdayStr,
      url: `https://www.google.com/search?q="global+supply+chain+disruptions+manufacturing+impact"+${yesterdayStr}&tbm=nws`,
      relevanceScore: 0.85,
    },
    {
      title: "Industrial Companies Adapt to Supply Chain Volatility",
      description:
        "Leading industrial companies are implementing new strategies to manage supply chain volatility, including diversified sourcing and increased inventory buffers.",
      source: "Industrial Management",
      publishedAt: todayStr,
      url: `https://www.google.com/search?q="industrial+companies+supply+chain+volatility+strategies"+${todayStr}&tbm=nws`,
      relevanceScore: 0.82,
    },
  ]
}

// Generate scenario-specific insights
function generateScenarioSpecificInsights(simulationContext?: SimulationContext) {
  if (!simulationContext?.scenarioName) {
    return {
      insights: [],
      aiInsights: [],
      curatedInsights: [],
    }
  }

  const scenarioLower = simulationContext.scenarioName.toLowerCase()
  const revenueImpact = simulationContext.impactSummary?.revenueChangePercent || 0
  const marginImpact = simulationContext.impactSummary?.marginChangePercentPoints || 0
  const costImpact = simulationContext.impactSummary?.costChangePercent || 0

  let insights = []
  let aiInsights = []
  let curatedInsights = []

  // Strait of Hormuz scenario
  if (scenarioLower.includes("ormuz") || scenarioLower.includes("hormuz")) {
    insights = [
      {
        id: "hormuz-1",
        title: "Alternative Shipping Route Implementation",
        description: `Strait of Hormuz closure scenario shows ${Math.abs(revenueImpact).toFixed(1)}% revenue impact. Implement immediate alternative routing through Cape of Good Hope and Red Sea corridors.`,
        type: "Risk Mitigation",
        priority: Math.abs(revenueImpact) > 5 ? "Critical" : "High",
        confidence: 92,
        source: "Geopolitical Risk Analytics",
        timestamp: new Date().toISOString(),
      },
      {
        id: "hormuz-2",
        title: "Energy Cost Hedging Strategy",
        description: `${costImpact.toFixed(1)}% cost increase projected. Implement energy cost hedging and secure alternative fuel suppliers to mitigate oil price volatility.`,
        type: "Cost Management",
        priority: "High",
        confidence: 88,
        source: "Energy Risk Management",
        timestamp: new Date().toISOString(),
      },
    ]

    aiInsights = [
      {
        id: "ai-hormuz-1",
        title: "Predictive Geopolitical Risk Modeling",
        description: `AI models suggest ${Math.abs(marginImpact).toFixed(1)} p.p. margin impact can be reduced by 40% through proactive supplier diversification in non-Persian Gulf regions.`,
        type: "AI Recommendation",
        priority: "Critical",
        confidence: 89,
        source: "AI Geopolitical Analytics",
        timestamp: new Date().toISOString(),
      },
    ]

    curatedInsights = [
      {
        id: "curated-hormuz-1",
        title: "Industry Response: Persian Gulf Contingency Planning",
        description:
          "Leading industrial companies maintain 90-day inventory buffers and pre-negotiated alternative shipping contracts for Persian Gulf disruption scenarios.",
        type: "Best Practice",
        priority: "High",
        confidence: 95,
        source: "Geopolitical Risk Research",
        timestamp: new Date().toISOString(),
      },
    ]
  }
  // Cobalt scenario
  else if (scenarioLower.includes("cobalt")) {
    insights = [
      {
        id: "cobalt-1",
        title: "Critical Material Diversification",
        description: `Cobalt supply crisis shows ${Math.abs(revenueImpact).toFixed(1)}% revenue impact on SMRS. Accelerate Australian and Canadian cobalt sourcing agreements.`,
        type: "Supply Risk",
        priority: "Critical",
        confidence: 94,
        source: "Material Risk Intelligence",
        timestamp: new Date().toISOString(),
      },
      {
        id: "cobalt-2",
        title: "Recycling Capacity Expansion",
        description: `${costImpact.toFixed(1)}% cost increase requires immediate action. Expand cobalt recycling capabilities to reduce dependency on primary sources.`,
        type: "Operational Resilience",
        priority: "High",
        confidence: 87,
        source: "Sustainability Analytics",
        timestamp: new Date().toISOString(),
      },
    ]

    aiInsights = [
      {
        id: "ai-cobalt-1",
        title: "Alternative Material Substitution",
        description: `AI analysis identifies potential cobalt substitutes that could reduce ${Math.abs(marginImpact).toFixed(1)} p.p. margin impact by 60% within 12 months.`,
        type: "AI Recommendation",
        priority: "Critical",
        confidence: 91,
        source: "AI Materials Science",
        timestamp: new Date().toISOString(),
      },
    ]
  }
  // Trade war scenario
  else if (scenarioLower.includes("trade war") || scenarioLower.includes("tariff")) {
    insights = [
      {
        id: "trade-1",
        title: "Tariff Impact Mitigation",
        description: `Trade war scenario projects ${Math.abs(revenueImpact).toFixed(1)}% revenue decline. Implement regional production strategies to avoid tariff exposure.`,
        type: "Strategic",
        priority: "High",
        confidence: 90,
        source: "Trade Policy Analytics",
        timestamp: new Date().toISOString(),
      },
    ]
  }

  return { insights, aiInsights, curatedInsights }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeTab = searchParams.get("activeTab") || "overview"
    const simulationContextParam = searchParams.get("simulationContext")

    let simulationContext: SimulationContext | undefined
    if (simulationContextParam) {
      try {
        simulationContext = JSON.parse(decodeURIComponent(simulationContextParam))
      } catch (e) {
        console.error("Failed to parse simulation context:", e)
      }
    }

    console.log(
      `Fetching contextual insights for tab: ${activeTab}, scenario: ${simulationContext?.scenarioName || "none"}`,
    )

    // Get scenario-specific news
    const newsArticles = await fetchTheNewsAPIForInsights(simulationContext)

    // Generate scenario-specific insights
    const scenarioInsights = generateScenarioSpecificInsights(simulationContext)

    // Generate general contextual insights based on active tab (as fallback)
    let generalInsights = []
    const generalAiInsights = []
    const generalCuratedInsights = []

    switch (activeTab) {
      case "logistics":
        generalInsights = [
          {
            id: "logistics-general-1",
            title: "Multi-Modal Transport Optimization",
            description:
              "Current global logistics environment requires flexible transport strategies across sea, air, and land corridors.",
            type: "Operational",
            priority: "Medium",
            confidence: 85,
            source: "Logistics Intelligence",
            timestamp: new Date().toISOString(),
          },
        ]
        break

      case "manufacturing":
        generalInsights = [
          {
            id: "manufacturing-general-1",
            title: "Supply Chain Resilience Building",
            description:
              "Manufacturing operations require enhanced supply chain resilience strategies for critical material dependencies.",
            type: "Strategic",
            priority: "Medium",
            confidence: 88,
            source: "Manufacturing Intelligence",
            timestamp: new Date().toISOString(),
          },
        ]
        break
    }

    // Combine scenario-specific insights with general ones
    const insights = [...scenarioInsights.insights, ...generalInsights]
    const aiInsights = [...scenarioInsights.aiInsights, ...generalAiInsights]
    const curatedInsights = [...scenarioInsights.curatedInsights, ...generalCuratedInsights]

    const response = {
      insights,
      aiInsights,
      curatedInsights,
      newsArticles,
      metadata: {
        activeTab,
        scenarioName: simulationContext?.scenarioName,
        totalInsights: insights.length,
        totalNews: newsArticles.length,
        lastUpdated: new Date().toISOString(),
      },
    }

    console.log(
      `Returning ${insights.length} insights (${scenarioInsights.insights.length} scenario-specific), ${aiInsights.length} AI insights, ${curatedInsights.length} curated insights, ${newsArticles.length} news articles`,
    )

    return NextResponse.json(response)
  } catch (error) {
    console.error("Contextual insights API error:", error)
    return NextResponse.json({ error: "Failed to fetch contextual insights" }, { status: 500 })
  }
}
