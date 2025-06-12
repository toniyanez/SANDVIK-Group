import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

const DetailedSourceSchema = z.object({
  name: z
    .string()
    .describe(
      "The name or category of the data source (e.g., 'Economic News Aggregators', 'Internal Sales Platform', 'Commodity Price Index').",
    ),
  contribution: z
    .string()
    .describe(
      "A brief description of what kind of information or perspective this type of source contributes to the insight.",
    ),
})

// Zod schema for AI-generated strategic insights
const AiGeneratedInsightSchema = z.object({
  title: z.string().describe("A concise, compelling title for the insight (max 10 words)."),
  description: z
    .string()
    .describe("A detailed description of the insight, explaining its relevance and implications (2-4 sentences)."),
  badgeText: z
    .string()
    .describe(
      "A short, descriptive badge text (e.g., 'High Impact', 'Optimization Opportunity', 'Emerging Risk'). Max 3 words.",
    ),
  category: z
    .enum([
      "Risk Analysis",
      "Optimization",
      "Strategic Advantage",
      "Efficiency Gain",
      "New Opportunity",
      "Market Trend",
      "Resilience Building",
    ])
    .describe("The primary category of the insight."),
  confidence: z
    .number()
    .min(0)
    .max(100)
    .describe("A numerical confidence level (0-100) in the validity or accuracy of this insight."),
  actionableSuggestion: z
    .string()
    .optional()
    .describe("A brief, concrete actionable suggestion related to the insight, if applicable (max 15 words)."),
  sourcesCheckedCount: z
    .number()
    .optional()
    .describe(
      "Estimate the number of distinct categories of data sources (e.g., market reports, internal data, news articles) typically synthesized to generate this insight.",
    ),
  detailedSources: z
    .array(DetailedSourceSchema)
    .optional()
    .describe(
      "A list of the distinct categories of data sources synthesized to generate this insight, along with their contributions.",
    ),
})

// Type for API insights
type DetailedSource = z.infer<typeof DetailedSourceSchema>

type ApiInsight = {
  iconName: string
  title: string
  description: string
  badgeText: string
  badgeVariant?: "default" | "secondary" | "destructive" | "outline"
  badgeClassName?: string
  source: string
  confidence: number | string
  isAI?: boolean
  actionLink?: {
    href: string
    text: string
    iconName: string
  }
  timestamp?: string // ISO 8601 string
  sourcesCheckedCount?: number
  detailedSources?: DetailedSource[]
  type?: "ai" | "manual" | "news"
}

// Predefined insights database
const insightsDatabase: Record<string, ApiInsight[]> = {
  overview: [
    {
      iconName: "TrendingUp",
      title: "SMRS Growth in APAC",
      description:
        "Sandvik Mining and Rock Solutions (SMRS) shows robust 7% YoY growth in APAC, driven by new infrastructure projects and increased demand for sustainable mining solutions.",
      badgeText: "Q3 Performance",
      badgeVariant: "secondary",
      source: "Internal Sales Data, MarketWatch Q3 Report",
      confidence: 90,
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      type: "manual",
      detailedSources: [
        { name: "Internal Sales Data", contribution: "Provides YoY growth figures and regional performance for SMRS." },
        {
          name: "MarketWatch Q3 Report",
          contribution: "Corroborates growth trends and identifies drivers like infrastructure projects.",
        },
      ],
      sourcesCheckedCount: 2,
    },
  ],
  financials: [
    {
      iconName: "DollarSign",
      title: "Q3 Earnings Highlights",
      description:
        "Sandvik reported a 4.1% increase in Net Sales YTD, reaching SEK 95.2B. Operating Profit (EBITA) grew by 6.8% to SEK 18.5B, with an adjusted operating margin of 19.4%.",
      badgeText: "Financial Update",
      badgeVariant: "default",
      badgeClassName: "bg-green-500 text-white",
      source: "Sandvik Q3 Interim Report",
      confidence: "Confirmed",
      actionLink: { href: "#", text: "View Full Report", iconName: "FileText" },
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      type: "manual",
    },
  ],
  "strategic-direction": [
    {
      iconName: "Rocket",
      title: "Progress on 'Shift to Digital'",
      description:
        "The 'Shift to Digital' initiative is on track, with a 15% increase in software and digital service revenue in the last quarter. Focus remains on integrating AI into core offerings.",
      badgeText: "Strategic Goal",
      badgeVariant: "default",
      badgeClassName: "bg-blue-500 text-white",
      source: "Strategic Program Office",
      confidence: 90,
      actionLink: { href: "#", text: "View Digital Roadmap", iconName: "FileText" },
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      type: "manual",
    },
  ],
  "challenges-risks": [
    {
      iconName: "ShieldCheck",
      title: "Proactive Risk Mitigation Review",
      description:
        "Current geopolitical tensions necessitate a review of supply chain diversification strategies. Focus on identifying alternative sourcing for key components currently exposed to high-risk regions.",
      badgeText: "Strategic Priority",
      badgeVariant: "default",
      badgeClassName: "bg-orange-500 text-white",
      source: "Risk Management Committee Q3 Brief",
      confidence: 85,
      actionLink: { href: "#", text: "Review Risk Register", iconName: "ListChecks" },
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      type: "manual",
    },
  ],
  "competitive-landscape": [
    {
      iconName: "Swords",
      title: "Market Share Dynamics",
      description:
        "Analysis of recent competitor revenue data suggests potential shifts in market share within the SMR segment. Further investigation into specific product lines and regional performance is recommended.",
      badgeText: "Market Analysis",
      badgeVariant: "secondary",
      source: "Competitive Intelligence Platform",
      confidence: 78,
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      type: "manual",
      detailedSources: [
        {
          name: "Aggregated Competitor Financials",
          contribution: "Provides revenue data for market share estimation.",
        },
        { name: "Industry Analyst Reports", contribution: "Offers qualitative insights on market positioning." },
      ],
      sourcesCheckedCount: 2,
    },
  ],
  manufacturing: [
    {
      iconName: "Zap",
      title: "Gimo Plant Output Increase",
      description:
        "Advanced automation and Industry 4.0 initiatives at the Gimo facility have resulted in a 9% output increase for carbide inserts in Q3, exceeding targets by 2%.",
      badgeText: "Efficiency Gain",
      badgeVariant: "default",
      badgeClassName: "bg-green-500 text-white",
      source: "Gimo Plant SCADA System & MES",
      confidence: 98,
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      type: "manual",
    },
  ],
  materials: [
    {
      iconName: "AlertTriangle",
      title: "Cobalt Price Volatility",
      description:
        "Cobalt spot prices have increased by 6.5% in the last 30 days due to renewed supply concerns in the DRC. Current hedging strategy covers approximately 70% of Q4 requirements.",
      badgeText: "Price Alert",
      badgeVariant: "destructive",
      source: "LME, S&P Global Commodity Insights",
      confidence: 88,
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      type: "manual",
    },
  ],
  logistics: [
    {
      iconName: "Truck",
      title: "Rotterdam Port Congestion Easing",
      description:
        "Average container dwell time at Rotterdam port has decreased to 3.8 days from a peak of 5.2 days last month. However, intermittent labor action risks remain.",
      badgeText: "Logistics Update",
      badgeVariant: "default",
      badgeClassName: "bg-sky-500 text-white",
      source: "Port Authority Data, Freight Forwarder Intel",
      confidence: 85,
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      type: "manual",
    },
  ],
  simulations: [
    {
      iconName: "BarChart3",
      title: "Simulation: EU Carbon Border Tax",
      description:
        "A simulation of a €50/ton EU Carbon Border Adjustment Mechanism (CBAM) on specific imports indicates a potential 2.1% increase in landed costs for certain Asian-sourced components. Sandvik's regionalization strategy is projected to mitigate approximately 60% of this impact.",
      badgeText: "Simulation Complete",
      source: "Supply Chain Modeler Pro v2.1",
      confidence: "Modelled (92% fit)",
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      type: "manual",
    },
  ],
}

// Helper function to generate AI strategic insights
async function generateStrategicInsights(
  tabName: string,
  promptTemplate: string,
  count: number,
  icon: string,
  badgeClass: string,
  sourceUnit: string,
  apiKey: string | undefined,
): Promise<ApiInsight[]> {
  if (!apiKey) {
    console.error(`AI strategic insight generation skipped for '${tabName}' tab: OpenAI API key is missing.`)
    return [
      {
        iconName: "AlertTriangle",
        title: `AI Insight Generation Skipped`,
        description:
          "Could not generate an AI-powered strategic insight because the OpenAI API key is not configured on the server.",
        badgeText: "Configuration Error",
        badgeVariant: "destructive",
        source: "System AI Module",
        confidence: "N/A",
        isAI: true,
        type: "ai",
        timestamp: new Date().toISOString(),
      },
    ]
  }

  const insights: ApiInsight[] = []
  const basePromptDetails = `For the 'detailedSources' field, list distinct categories of data sources. For each, provide 'name' (e.g., 'Global Economic Indicators') and 'contribution' (e.g., 'Offers macroeconomic context'). Aim for 2-3 source categories.`

  for (let i = 0; i < count; i++) {
    try {
      const { object: aiData } = await generateObject({
        model: openai("gpt-4o", { apiKey }),
        schema: AiGeneratedInsightSchema,
        prompt: `Insight ${i + 1}/${count}: ${promptTemplate} ${basePromptDetails}`,
      })
      insights.push({
        iconName: icon,
        title: `AI: ${aiData.title}`,
        description:
          aiData.description +
          (aiData.actionableSuggestion ? ` Actionable Suggestion: ${aiData.actionableSuggestion}` : ""),
        badgeText: aiData.badgeText,
        badgeVariant: "default",
        badgeClassName: badgeClass,
        source: sourceUnit,
        confidence: `AI Generated (${aiData.confidence}%)`,
        isAI: true,
        type: "ai",
        actionLink: aiData.actionableSuggestion
          ? { href: "#", text: "Explore Suggestion", iconName: "ArrowRight" }
          : undefined,
        timestamp: new Date(Date.now() - i * 1000 * 60 * 5).toISOString(),
        detailedSources: aiData.detailedSources,
        sourcesCheckedCount: aiData.detailedSources?.length || aiData.sourcesCheckedCount,
      })
    } catch (error) {
      console.error(`AI strategic insight ${i + 1} generation failed for '${tabName}' tab:`, error)
      insights.push({
        iconName: "AlertTriangle",
        title: `AI Insight ${i + 1} Generation Failed for ${tabName}`,
        description: "Could not generate an AI-powered strategic insight at this time.",
        badgeText: "Error",
        badgeVariant: "destructive",
        source: "System AI Module",
        confidence: "N/A",
        isAI: true,
        type: "ai",
        timestamp: new Date(Date.now() - i * 1000 * 60 * 5).toISOString(),
      })
    }
  }
  return insights
}

// Helper function to fetch real news from NewsAPI
async function fetchRealNews(tab: string, apiKey: string | undefined): Promise<ApiInsight[]> {
  if (!apiKey) {
    console.warn("NewsAPI key is missing. Skipping real news fetching.")
    return [
      {
        iconName: "AlertTriangle",
        title: "News Feed Unavailable",
        description: "NewsAPI key not configured. Real-time news cannot be fetched.",
        badgeText: "Configuration Error",
        badgeVariant: "destructive",
        source: "System News Module",
        confidence: "N/A",
        isAI: false,
        type: "news",
        timestamp: new Date().toISOString(),
      },
    ]
  }

  let query = ""
  const sandvikKeyword = '"Sandvik"' // Use quotes for exact phrase matching
  const competitors = [
    '"Epiroc"',
    '"Komatsu"',
    '"Caterpillar Mining"', // More specific for Caterpillar
    '"FLSmidth"',
    '"Metso Outotec"', // Updated name
    '"Weir Group"',
  ]
  // Industry specific keywords to help focus the search
  const industryKeywords = [
    "mining equipment",
    "rock processing",
    "machining solutions",
    "industrial technology",
    "heavy machinery",
    "automation",
    "digitalization",
    "sustainability in mining",
    "quarterly results",
    "annual report",
    "strategic partnership",
    "acquisition",
    "new product",
    "market share",
    "supply chain",
  ]

  switch (tab) {
    case "simulations":
      query = `${sandvikKeyword} AND (simulation OR "scenario modeling" OR "digital twin" OR "supply chain optimization" OR "risk modeling")`
      break
    case "competitive-landscape":
      const allCompanies = [sandvikKeyword, ...competitors].join(" OR ")
      const industryContext = industryKeywords.join(" OR ")
      // Prioritize news mentioning at least one of the companies AND related to their industry
      query = `(${allCompanies}) AND (${industryContext})`
      break
    case "overview":
      query = `${sandvikKeyword} AND (("corporate strategy") OR ("market performance") OR ("major developments") OR "annual report" OR "investor relations")`
      break
    case "financials":
      query = `${sandvikKeyword} AND (("financial results") OR earnings OR "stock performance" OR "analyst ratings" OR "quarterly report")`
      break
    case "materials":
      query = `${sandvikKeyword} AND (("critical materials") OR "raw materials" OR "commodity prices" OR tungsten OR cobalt OR "supply chain" OR sourcing OR "geopolitical risk")`
      break
    case "manufacturing":
      query = `${sandvikKeyword} AND (manufacturing OR production OR factory OR automation OR "industry 4.0" OR "operational excellence")`
      break
    case "logistics":
      query = `${sandvikKeyword} AND (logistics OR "supply chain" OR shipping OR freight OR "port congestion" OR "trade compliance")`
      break
    case "strategic-direction":
      query = `${sandvikKeyword} AND ("strategic direction" OR innovation OR "research and development" OR "long-term goals" OR "market expansion")`
      break
    case "challenges-risks":
      query = `${sandvikKeyword} AND (risk OR challenge OR "geopolitical tension" OR "economic headwinds" OR "mitigation strategy")`
      break
    default:
      // Fallback for any other tab, try to make it relevant
      query = `${sandvikKeyword} AND ("${tab.replace(/-/g, " ")}" OR ${industryKeywords.slice(0, 5).join(" OR ")})`
  }

  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
  const fromDate = oneMonthAgo.toISOString().split("T")[0]

  // NewsAPI recommends using 'domains' or 'sources' for higher quality results if possible,
  // but for broad competitor analysis, keyword search is more practical.
  // We use 'relevancy' for sortBy, but 'publishedAt' could also be an option.
  const newsApiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${apiKey}&language=en&sortBy=relevancy&pageSize=3&from=${fromDate}`
  console.log(`NewsAPI Query for tab '${tab}': ${query}`) // Log the query

  try {
    const response = await fetch(newsApiUrl)
    if (!response.ok) {
      const errorData = await response.json()
      console.error("NewsAPI error:", response.status, errorData)
      throw new Error(`NewsAPI request failed with status ${response.status}: ${errorData.message || "Unknown error"}`)
    }
    const data = await response.json()

    if (!data.articles || data.articles.length === 0) {
      return [
        {
          iconName: "Info",
          title: "No Recent News Found",
          description: `No recent news articles found for your query on "${tab}" via NewsAPI. Try broadening search terms if this persists.`,
          badgeText: "No Results",
          badgeVariant: "secondary",
          source: "NewsAPI",
          confidence: "N/A",
          isAI: false,
          type: "news",
          timestamp: new Date().toISOString(),
        },
      ]
    }

    return data.articles.map(
      (article: any): ApiInsight => ({
        iconName: "Newspaper",
        title: article.title || "Untitled Article",
        description:
          article.description ||
          article.content?.substring(0, 200) + (article.content?.length > 200 ? "..." : "") ||
          "No description available.",
        badgeText: "Recent News",
        badgeVariant: "outline",
        source: article.source?.name || "Unknown Source",
        confidence: `From ${article.source?.name || "NewsAPI"}`, // Or some other metric if available
        isAI: false,
        type: "news",
        timestamp: article.publishedAt || new Date().toISOString(),
        actionLink: article.url
          ? { href: article.url, text: "Read Full Article", iconName: "ExternalLink" }
          : undefined,
        detailedSources: [
          { name: article.source?.name || "NewsAPI", contribution: "Provides real-time news updates." },
        ],
        sourcesCheckedCount: 1,
      }),
    )
  } catch (error) {
    console.error(`Failed to fetch real news for tab '${tab}':`, error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return [
      {
        iconName: "AlertTriangle",
        title: "News Feed Error",
        description: `Could not fetch real-time news for ${tab}. ${errorMessage}`,
        badgeText: "Error",
        badgeVariant: "destructive",
        source: "System News Module",
        confidence: "N/A",
        isAI: false,
        type: "news",
        timestamp: new Date().toISOString(),
      },
    ]
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tabParam = searchParams.get("tab")
  const tab = tabParam ? tabParam.trim() : null

  // const currentTimestamp = new Date().toISOString() // Not used directly here anymore

  if (!tab || !insightsDatabase[tab]) {
    const validTabs = Object.keys(insightsDatabase).join(", ")
    console.error(
      `Contextual Insights API: Invalid or missing tab. Received original: '${tabParam}', processed: '${tab}'. Valid tabs are: [${validTabs}]`,
    )
    return NextResponse.json(
      {
        insights: [],
        error: `Invalid or unknown tab specified: '${tabParam}'. Valid options are: ${validTabs}.`,
        receivedTab: tabParam,
        processedTab: tab,
      },
      { status: 400 },
    )
  }

  const dynamicInsights: ApiInsight[] = [...insightsDatabase[tab]] // Start with manual insights

  const strategicInsightPrompts: Record<
    string,
    { prompt: string; icon: string; badgeClass: string; sourceUnit: string }
  > = {
    overview: {
      prompt:
        "You are a strategic analyst for Sandvik. Based on current global economic trends, recent Sandvik performance, and geopolitical factors, provide a highly relevant strategic insight for Sandvik's executive team.",
      icon: "Brain",
      badgeClass: "bg-sky-500 text-white",
      sourceUnit: "AI Strategic Analysis Unit",
    },
    financials: {
      prompt:
        "You are a financial analyst for Sandvik. Based on Sandvik's latest financial reports (e.g., Q3 performance with Net Sales SEK 95.2B, EBITA SEK 18.5B) and current market conditions, provide a key financial insight or trend.",
      icon: "Brain",
      badgeClass: "bg-emerald-500 text-white",
      sourceUnit: "AI Financial Analysis Engine",
    },
    "strategic-direction": {
      prompt:
        "You are a chief strategy officer for Sandvik. Analyze Sandvik's strategic direction, focusing on sustainable growth, innovation, and market leadership. Provide a key insight regarding a potential strategic pivot, a new growth vector, or an emerging competitive threat.",
      icon: "Rocket",
      badgeClass: "bg-indigo-500 text-white",
      sourceUnit: "AI Strategic Foresight Unit",
    },
    "challenges-risks": {
      prompt:
        "You are a risk and resilience analyst for Sandvik. Considering Sandvik's exposure to macroeconomic headwinds, geopolitical instability, and supply chain vulnerabilities, provide a key insight. Focus on proactive mitigation, resilience building, or identifying strategic opportunities arising from these challenges.",
      icon: "ShieldQuestion",
      badgeClass: "bg-amber-500 text-white",
      sourceUnit: "AI Risk & Resilience Advisor",
    },
    "competitive-landscape": {
      prompt:
        "You are a competitive intelligence analyst for Sandvik. Analyze a comprehensive and recently updated dataset of Sandvik's key competitors (Epiroc, Komatsu, Caterpillar Mining, FLSmidth, Metso Outotec, Weir Group) across its main business areas (SMR, SRP, SMM). This data includes competitor names, global revenues, country of origin, company size, detailed strengths, weaknesses, differentiators, risks, and opportunities. Based on this rich dataset, provide a key strategic insight regarding emerging competitive threats, opportunities for Sandvik to differentiate, or notable shifts in market dynamics (e.g., based on revenue trends or SWOT analysis). Focus on insights that would be valuable for strategic decision-making.",
      icon: "Swords",
      badgeClass: "bg-teal-500 text-white",
      sourceUnit: "AI Competitive Intelligence Unit",
    },
    materials: {
      prompt:
        "You are a supply chain risk analyst for Sandvik, focusing on critical materials like Tungsten, Cobalt, and Specialty Steel. Analyze commodity market trends and geopolitical risks to provide an actionable insight for optimizing sourcing or mitigating risk.",
      icon: "Lightbulb",
      badgeClass: "bg-purple-500 text-white",
      sourceUnit: "AI Materials Intelligence Platform",
    },
    manufacturing: {
      prompt:
        "You are a manufacturing operations analyst for Sandvik. Analyze Sandvik's global manufacturing footprint (e.g., Gimo, Mebane) and regionalization strategy. Provide an insight on efficiency, bottlenecks, or new technology.",
      icon: "Factory",
      badgeClass: "bg-green-500 text-white",
      sourceUnit: "AI Manufacturing Intelligence",
    },
    logistics: {
      prompt:
        "You are a logistics and trade compliance expert for Sandvik. Given challenges like Red Sea disruptions and tariffs, provide an insight to optimize logistics (e.g., route, modal shift, warehousing).",
      icon: "Truck",
      badgeClass: "bg-blue-500 text-white",
      sourceUnit: "AI Logistics Analytics",
    },
    simulations: {
      prompt:
        "You are a supply chain simulation expert for Sandvik. Based on potential global events (e.g., trade wars, pandemics, port congestions, material shortages) and their impact on revenue, margin, and costs, provide a key strategic insight or recommendation derived from simulation modeling.",
      icon: "Cpu",
      badgeClass: "bg-cyan-500 text-white",
      sourceUnit: "AI Simulation & Modeling Unit",
    },
  }

  if (strategicInsightPrompts[tab]) {
    const config = strategicInsightPrompts[tab]
    // Generate fewer AI strategic insights if we have real news
    const aiInsightCount = 1
    const generatedStrategicInsights = await generateStrategicInsights(
      tab,
      config.prompt,
      aiInsightCount,
      config.icon,
      config.badgeClass,
      config.sourceUnit,
      process.env.OPENAI_API_KEY,
    )
    dynamicInsights.push(...generatedStrategicInsights)
  }

  // Fetch real news using NewsAPI
  const realNewsInsights = await fetchRealNews(tab, process.env.NEWS_API_KEY)
  dynamicInsights.push(...realNewsInsights)

  dynamicInsights.sort((a, b) => {
    // Prioritize news slightly if timestamps are very close, otherwise sort by timestamp
    if (a.timestamp && b.timestamp) {
      const dateA = new Date(a.timestamp).getTime()
      const dateB = new Date(b.timestamp).getTime()
      if (dateB !== dateA) return dateB - dateA
      if (a.type === "news" && b.type !== "news") return -1
      if (b.type === "news" && a.type !== "news") return 1
    }
    if (a.timestamp) return -1
    if (b.timestamp) return 1
    return 0
  })

  return NextResponse.json({ insights: dynamicInsights })
}
