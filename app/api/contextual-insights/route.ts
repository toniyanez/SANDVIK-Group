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

// Zod schema for AI-generated news items
const AiGeneratedNewsItemSchema = z.object({
  title: z.string().describe("A concise, factual news headline (max 15 words)."),
  summary: z.string().describe("A brief, neutral summary of the news event (2-3 sentences)."),
  sourceName: z
    .string()
    .describe(
      "The perceived origin or type of news source (e.g., 'Industry Journal', 'Financial News Wire', 'Global News Outlet').",
    ),
  publishedDate: z
    .string()
    .datetime({ message: "Published date must be a valid ISO 8601 datetime string." })
    .describe(
      "An estimated publication date for this news item in ISO 8601 format, within the last 3 months from the current date.",
    ),
  relevanceScore: z
    .number()
    .min(0)
    .max(100)
    .describe("A score (0-100) indicating relevance to the specified context/tab."),
  keywords: z
    .array(z.string())
    .optional()
    .describe("Keywords related to the news item and its relevance to the tab's context."),
})

const AiGeneratedNewsFeedSchema = z.object({
  newsItems: z.array(AiGeneratedNewsItemSchema).min(2).max(4).describe("A list of 2 to 4 relevant news items."),
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
): Promise<ApiInsight[]> {
  const insights: ApiInsight[] = []
  const basePromptDetails = `For the 'detailedSources' field, list distinct categories of data sources. For each, provide 'name' (e.g., 'Global Economic Indicators') and 'contribution' (e.g., 'Offers macroeconomic context'). Aim for 2-3 source categories.`

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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tabParam = searchParams.get("tab")
  const tab = tabParam ? tabParam.trim() : null

  const currentTimestamp = new Date().toISOString()

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

  const dynamicInsights: ApiInsight[] = [...insightsDatabase[tab]]

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
        "You are a competitive intelligence analyst for Sandvik. Analyze a comprehensive and recently updated dataset of Sandvik's key competitors across its main business areas (SMR, SRP, SMM). This data includes competitor names, global revenues, country of origin, company size, detailed strengths, weaknesses, differentiators, risks, and opportunities. Based on this rich dataset, provide a key strategic insight regarding emerging competitive threats, opportunities for Sandvik to differentiate, or notable shifts in market dynamics (e.g., based on revenue trends or SWOT analysis). Focus on insights that would be valuable for strategic decision-making.",
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
  }

  if (strategicInsightPrompts[tab]) {
    const config = strategicInsightPrompts[tab]
    const generatedStrategicInsights = await generateStrategicInsights(
      tab,
      config.prompt,
      2,
      config.icon,
      config.badgeClass,
      config.sourceUnit,
    )
    dynamicInsights.push(...generatedStrategicInsights)
  }

  try {
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
    const baseDateRange = `(published between ${threeMonthsAgo.toISOString().split("T")[0]} and ${new Date().toISOString().split("T")[0]})`

    // Dynamically create the news prompt based on the tab
    let newsPrompt: string
    if (tab === "competitive-landscape") {
      newsPrompt = `You are an AI news summarizer. Provide 2-4 recent news items ${baseDateRange} highly relevant to the competitive landscape for Sandvik. Include news about Sandvik itself, but also specifically search for recent news about its key competitors: Epiroc, Komatsu, Caterpillar, FLSmidth, Metso, and Weir Group. Focus on announcements, financial results, new products, or strategic shifts. For each news item, provide a title, a brief summary, a plausible source name, an estimated published date in ISO 8601 format, a relevance score (0-100), and 2-3 keywords.`
    } else {
      newsPrompt = `You are an AI news summarizer. Provide 2-4 recent news items ${baseDateRange} highly relevant to Sandvik's operations or market context concerning '${tab}'. Focus on factual summaries. For each news item, provide a title, a brief summary, a plausible source name, an estimated published date in ISO 8601 format, a relevance score (0-100), and 2-3 keywords. Ensure dates are distinct and recent.`
    }

    const { object: aiNewsFeed } = await generateObject({
      model: openai("gpt-4o"),
      schema: AiGeneratedNewsFeedSchema,
      prompt: newsPrompt,
    })

    aiNewsFeed.newsItems.forEach((newsItem) => {
      dynamicInsights.push({
        iconName: "Newspaper",
        title: newsItem.title,
        description: newsItem.summary,
        badgeText: "Recent News",
        badgeVariant: "outline",
        source: newsItem.sourceName,
        confidence: `Relevance: ${newsItem.relevanceScore}%`,
        isAI: true,
        type: "news",
        timestamp: newsItem.publishedDate,
        detailedSources: [{ name: newsItem.sourceName, contribution: "Provides recent news updates." }],
        sourcesCheckedCount: 1,
      })
    })
  } catch (error) {
    console.error(`AI news generation failed for tab '${tab}':`, error)
    dynamicInsights.push({
      iconName: "AlertTriangle",
      title: "AI News Generation Failed",
      description: `Could not generate AI-powered news updates for ${tab} at this time. Error: ${error instanceof Error ? error.message : String(error)}`,
      badgeText: "Error",
      badgeVariant: "destructive",
      source: "System AI News Module",
      confidence: "N/A",
      isAI: true,
      type: "news",
      timestamp: currentTimestamp,
    })
  }

  dynamicInsights.sort((a, b) => {
    if (a.timestamp && b.timestamp) {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    }
    if (a.timestamp) return -1
    if (b.timestamp) return 1
    return 0
  })

  return NextResponse.json({ insights: dynamicInsights })
}
