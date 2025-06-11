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
      "Competitive Edge",
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

// Type for API insights (manual, AI, or real news)
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
  isAI?: boolean // True for AI-generated strategic insights, false for real news
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

// Predefined insights database (manual insights)
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
      isAI: false,
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
      isAI: false,
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
      isAI: false,
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
      isAI: false,
    },
  ],
  manufacturing: [
    {
      iconName: "Factory", // Changed from Zap to Factory for consistency
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
      isAI: false,
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
      isAI: false,
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
      isAI: false,
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
      isAI: false,
    },
  ],
  "competitive-landscape": [
    {
      iconName: "Users",
      title: "Diverse Competitive Pressures",
      description:
        "Sandvik faces a multifaceted competitive landscape, with specialized and diversified players across its SMR, SRP, and SMM segments. Key differentiators include its global footprint, innovation in electrification and digital solutions, and integrated raw material sourcing.",
      badgeText: "Market Analysis",
      badgeVariant: "secondary",
      source: "Q1 2025 Analyst Report (Competitive Landscape Section)",
      confidence: 95,
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      type: "manual",
      isAI: false,
      detailedSources: [
        {
          name: "Q1 2025 Analyst Report",
          contribution: "Provides detailed competitor analysis and market positioning.",
        },
        { name: "Industry Benchmarking", contribution: "Comparative analysis against key players." },
      ],
      sourcesCheckedCount: 2,
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
): Promise<ApiInsight[]> {
  const insights: ApiInsight[] = []
  const basePromptDetails = `For the 'detailedSources' field, list distinct categories of data sources. For each, provide 'name' (e.g., 'Global Economic Indicators') and 'contribution' (e.g., 'Offers macroeconomic context'). Aim for 2-3 source categories. Ensure the 'category' field is one of the allowed enum values from AiGeneratedInsightSchema.`

  for (let i = 0; i < count; i++) {
    try {
      const { object: aiData } = await generateObject({
        model: openai("gpt-4o"),
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
        description: `Could not generate an AI-powered strategic insight at this time. Error: ${error instanceof Error ? error.message : String(error)}`,
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
async function fetchRealNews(query: string, apiKey: string, pageSize = 3): Promise<any[]> {
  const oneMonthAgo = new Date()
  oneMonthAgo.setDate(oneMonthAgo.getDate() - 30)
  const fromDate = oneMonthAgo.toISOString().split("T")[0]

  const apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
    query,
  )}&from=${fromDate}&sortBy=relevancy&apiKey=${apiKey}&language=en&pageSize=${pageSize}`

  try {
    console.log(`Fetching real news from: ${apiUrl.replace(apiKey, "[REDACTED_API_KEY]")}`) // Log URL without API key
    const response = await fetch(apiUrl)
    if (!response.ok) {
      const errorBody = await response.text()
      console.error("NewsAPI request failed:", response.status, errorBody)
      // Potentially parse errorBody if it's JSON from NewsAPI for more specific error messages
      // e.g. if (response.headers.get('content-type')?.includes('application/json')) { const errJson = JSON.parse(errorBody); console.error(errJson.message) }
      return []
    }
    const data = await response.json()
    console.log(`NewsAPI response: ${data.totalResults} articles found for query "${query}"`)
    return data.articles || []
  } catch (error) {
    console.error("Error fetching real news:", error)
    return []
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tab = searchParams.get("tab")

  if (!tab || !insightsDatabase[tab]) {
    console.error(`Invalid or missing tab parameter: ${tab}`)
    return NextResponse.json({ insights: [], error: `Invalid tab: ${tab}` }, { status: 400 })
  }

  const dynamicInsights: ApiInsight[] = [...insightsDatabase[tab]]

  const strategicInsightPrompts: Record<
    string,
    { prompt: string; icon: string; badgeClass: string; sourceUnit: string }
  > = {
    overview: {
      prompt:
        "You are a strategic analyst for Sandvik. Based on current global economic trends, recent Sandvik performance, and geopolitical factors, provide a highly relevant strategic insight for Sandvik's executive team. Ensure the 'category' field is one of the allowed enum values from AiGeneratedInsightSchema.",
      icon: "Brain",
      badgeClass: "bg-sky-500 text-white",
      sourceUnit: "AI Strategic Analysis Unit",
    },
    financials: {
      prompt:
        "You are a financial analyst for Sandvik. Based on Sandvik's latest financial reports (e.g., Q3 performance with Net Sales SEK 95.2B, EBITA SEK 18.5B) and current market conditions, provide a key financial insight or trend. Ensure the 'category' field is one of the allowed enum values from AiGeneratedInsightSchema.",
      icon: "Brain",
      badgeClass: "bg-emerald-500 text-white",
      sourceUnit: "AI Financial Analysis Engine",
    },
    "strategic-direction": {
      prompt:
        "You are a chief strategy officer for Sandvik. Analyze Sandvik's strategic direction, focusing on sustainable growth, innovation, and market leadership. Provide a key insight regarding a potential strategic pivot, a new growth vector, or an emerging competitive threat. Ensure the 'category' field is one of the allowed enum values from AiGeneratedInsightSchema.",
      icon: "Rocket",
      badgeClass: "bg-indigo-500 text-white",
      sourceUnit: "AI Strategic Foresight Unit",
    },
    "challenges-risks": {
      prompt:
        "You are a risk and resilience analyst for Sandvik. Considering Sandvik's exposure to macroeconomic headwinds, geopolitical instability, and supply chain vulnerabilities, provide a key insight. Focus on proactive mitigation, resilience building, or identifying strategic opportunities arising from these challenges. Ensure the 'category' field is one of the allowed enum values from AiGeneratedInsightSchema.",
      icon: "ShieldQuestion",
      badgeClass: "bg-amber-500 text-white",
      sourceUnit: "AI Risk & Resilience Advisor",
    },
    materials: {
      prompt:
        "You are a supply chain risk analyst for Sandvik, focusing on critical materials like Tungsten, Cobalt, and Specialty Steel. Analyze commodity market trends and geopolitical risks to provide an actionable insight for optimizing sourcing or mitigating risk. Ensure the 'category' field is one of the allowed enum values from AiGeneratedInsightSchema.",
      icon: "Lightbulb",
      badgeClass: "bg-purple-500 text-white",
      sourceUnit: "AI Materials Intelligence Platform",
    },
    manufacturing: {
      prompt:
        "You are a manufacturing operations analyst for Sandvik. Analyze Sandvik's global manufacturing footprint (e.g., Gimo, Mebane) and regionalization strategy. Provide an insight on efficiency, bottlenecks, or new technology. Ensure the 'category' field is one of the allowed enum values from AiGeneratedInsightSchema.",
      icon: "Factory",
      badgeClass: "bg-green-500 text-white",
      sourceUnit: "AI Manufacturing Intelligence",
    },
    logistics: {
      prompt:
        "You are a logistics and trade compliance expert for Sandvik. Given challenges like Red Sea disruptions and tariffs, provide an insight to optimize logistics (e.g., route, modal shift, warehousing). Ensure the 'category' field is one of the allowed enum values from AiGeneratedInsightSchema.",
      icon: "Truck",
      badgeClass: "bg-blue-500 text-white",
      sourceUnit: "AI Logistics Analytics",
    },
    "competitive-landscape": {
      prompt:
        "You are a market intelligence analyst for Sandvik. Based on Sandvik's known competitors (e.g., Epiroc, Metso, Komatsu, Kennametal, IMC Group, Hexagon) and current market dynamics, provide a key strategic insight. Focus on a potential competitive advantage Sandvik can leverage, a vulnerability to address, or an emerging market opportunity relative to its competitors. Ensure the 'category' field is 'Competitive Edge' or another relevant allowed enum value from AiGeneratedInsightSchema.",
      icon: "Swords",
      badgeClass: "bg-teal-500 text-white",
      sourceUnit: "AI Competitive Intelligence Unit",
    },
  }

  // Generate AI Strategic Insights (if applicable for the tab)
  if (strategicInsightPrompts[tab]) {
    const config = strategicInsightPrompts[tab]
    const generatedStrategicInsights = await generateStrategicInsights(
      tab,
      config.prompt,
      1, // Number of AI strategic insights to generate
      config.icon,
      config.badgeClass,
      config.sourceUnit,
    )
    dynamicInsights.push(...generatedStrategicInsights)
  }

  // Fetch Real News using NewsAPI
  if (process.env.NEWS_API_KEY) {
    let newsQuery = `Sandvik` // Default query
    // Customize query based on tab for more relevance
    switch (tab) {
      case "overview":
        newsQuery = `(Sandvik OR "industrial manufacturing" OR "heavy industry") AND (news OR trends OR developments)`
        break
      case "financials":
        newsQuery = `(Sandvik OR "industrial sector") AND (financial OR earnings OR market)`
        break
      case "strategic-direction":
        newsQuery = `(Sandvik OR "industrial innovation" OR "manufacturing technology") AND (strategy OR future OR outlook)`
        break
      case "challenges-risks":
        newsQuery = `("industrial supply chain" OR "manufacturing risk" OR "geopolitical economy") AND (challenges OR risks OR vulnerabilities)`
        break
      case "manufacturing":
        newsQuery = `(Sandvik OR "advanced manufacturing" OR "factory automation") AND (production OR technology OR efficiency)`
        break
      case "materials":
        newsQuery = `("critical materials" OR "commodity prices" OR "industrial metals" OR "Sandvik materials") AND (supply OR demand OR market)`
        break
      case "logistics":
        newsQuery = `("global logistics" OR "supply chain disruptions" OR "freight news") AND (trends OR issues OR updates)`
        break
      case "competitive-landscape":
        newsQuery = `(Sandvik OR Epiroc OR Komatsu OR Caterpillar OR Liebherr OR "Hitachi Construction Machinery" OR FLSmidth OR "Thyssenkrupp Mining" OR Metso OR Terex OR Keestrack OR Kleemann OR "Rubble Master" OR Furukawa OR Kennametal OR "IMC Group" OR "Mitsubishi Materials" OR "Sumitomo Electric" OR Kyocera OR Ceratizit OR "Walter AG" OR Guhring OR "Hexagon AB") AND (competition OR strategy OR market OR product OR launch OR innovation OR financial OR earnings)`
        break
      default:
        newsQuery = `Sandvik OR "${tab} industry news"`
    }

    const realNewsArticles = await fetchRealNews(newsQuery, process.env.NEWS_API_KEY, 3) // Fetch 3 articles

    realNewsArticles.forEach((article: any) => {
      if (article.title && article.description) {
        // Ensure basic content exists
        dynamicInsights.push({
          iconName: "Newspaper",
          title: article.title,
          description: article.description,
          badgeText: "Live News",
          badgeVariant: "outline",
          badgeClassName: "border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-300",
          source: article.source?.name || "News Source",
          confidence: "Factual",
          isAI: false,
          type: "news",
          timestamp: article.publishedAt,
          actionLink: {
            href: article.url,
            text: "Read Full Article",
            iconName: "ExternalLink",
          },
          detailedSources: [
            { name: article.source?.name || "NewsAPI", contribution: "Provides real-time news article." },
          ],
          sourcesCheckedCount: 1,
        })
      }
    })
  } else {
    console.warn(
      "NEWS_API_KEY is not configured. Skipping real news fetching. You may want to add a fallback AI news item here or an error insight.",
    )
    // Optionally, add a placeholder or error insight if NEWS_API_KEY is missing
    dynamicInsights.push({
      iconName: "AlertTriangle",
      title: "Live News Unavailable",
      description: "The connection to the live news service is not configured. Please check API key.",
      badgeText: "Configuration Error",
      badgeVariant: "destructive",
      source: "System Configuration",
      confidence: "N/A",
      isAI: false,
      type: "news",
      timestamp: new Date().toISOString(),
    })
  }

  // Sort all insights by timestamp
  dynamicInsights.sort((a, b) => {
    if (a.timestamp && b.timestamp) {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    }
    if (a.timestamp) return -1 // Items with timestamps first
    if (b.timestamp) return 1
    return 0
  })

  return NextResponse.json({ insights: dynamicInsights.slice(0, 10) }) // Limit total insights to 10 to prevent clutter
}
