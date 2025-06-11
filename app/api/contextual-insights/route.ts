import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

// Zod schema for AI-generated insights
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
})

// Type for API insights
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
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    },
    {
      iconName: "AlertTriangle",
      title: "Red Sea Shipping Delays",
      description:
        "Ongoing Red Sea disruptions are impacting shipping lead times by an average of 10-14 days for EU-Asia routes. Contingency routing via Cape of Good Hope is active for critical shipments, incurring higher costs.",
      badgeText: "High Impact Risk",
      badgeVariant: "destructive",
      source: "Global Logistics Monitoring Platform",
      confidence: 95,
      actionLink: { href: "#", text: "View Mitigation Plan", iconName: "FileText" },
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
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
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    },
    {
      iconName: "Settings",
      title: "Mebane Facility Upgrade - Phase 1",
      description:
        "Phase 1 of the Mebane, NC facility upgrade, focusing on robotics integration for tool handling, is scheduled for Q4. A potential short-term output dip of ~3% is anticipated during the transition period.",
      badgeText: "Operational Note",
      source: "Project Management Office Updates",
      confidence: "Confirmed",
      timestamp: new Date().toISOString(), // Today
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
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
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
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    },
    {
      iconName: "TrendingUp",
      title: "Air Freight Capacity Increase",
      description:
        "Trans-Atlantic air freight capacity has increased by 8% month-over-month, leading to a slight reduction in spot rates. This presents an opportunity for urgent SMMS tool shipments.",
      badgeText: "Capacity Update",
      source: "IATA, Freightos Air Index",
      confidence: 80,
      timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
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
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    },
    {
      iconName: "Lightbulb",
      title: "New Scenario: Water Scarcity Impact",
      description:
        "A 'Global Water Scarcity' scenario, modeling potential impacts on mining operations and water-intensive manufacturing processes, is now available in the simulation library.",
      badgeText: "Scenario Added",
      source: "Analytics & Foresight Team",
      confidence: "Ready",
      actionLink: { href: "#", text: "Configure Scenario", iconName: "Play" },
      timestamp: new Date().toISOString(), // Today
    },
  ],
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tab = searchParams.get("tab")

  if (!tab || !insightsDatabase[tab]) {
    return NextResponse.json({ insights: [] }, { status: 400 })
  }

  const dynamicInsights: ApiInsight[] = [...insightsDatabase[tab]]
  const currentTimestamp = new Date().toISOString()

  // AI-generated insight for 'overview' tab
  if (tab === "overview") {
    try {
      const { object: aiData } = await generateObject({
        model: openai("gpt-4o"),
        schema: AiGeneratedInsightSchema,
        prompt: `You are a strategic analyst for Sandvik. Based on current global economic trends (e.g., inflation, interest rates, energy costs), recent Sandvik performance (SMRS growth in APAC, SMMS headwinds in Europe), and geopolitical factors (e.g., Red Sea disruptions, regional conflicts), provide one highly relevant and actionable strategic insight for Sandvik's executive team for the next quarter. The insight should be concise and impactful. Additionally, please state the number of distinct categories of information or types of data sources (e.g., financial reports, industry news, internal metrics, geopolitical analysis) that would typically be synthesized to produce an insight like this. Assign this to 'sourcesCheckedCount'.`,
      })

      dynamicInsights.push({
        iconName: "Brain",
        title: `AI: ${aiData.title}`,
        description:
          aiData.description +
          (aiData.actionableSuggestion ? ` Actionable Suggestion: ${aiData.actionableSuggestion}` : ""),
        badgeText: aiData.badgeText,
        badgeVariant: "default",
        badgeClassName: "bg-sky-500 text-white",
        source: "AI Strategic Analysis Unit",
        confidence: `AI Generated (${aiData.confidence}%)`,
        isAI: true,
        actionLink: aiData.actionableSuggestion
          ? { href: "#", text: "Explore Suggestion", iconName: "ArrowRight" }
          : undefined,
        timestamp: currentTimestamp,
        sourcesCheckedCount: aiData.sourcesCheckedCount,
      })
    } catch (error) {
      console.error("AI insight generation failed for 'overview' tab:", error)
      dynamicInsights.push({
        iconName: "AlertTriangle",
        title: "AI Insight Generation Failed",
        description: "Could not generate an AI-powered strategic insight at this time. Please try again later.",
        badgeText: "Error",
        badgeVariant: "destructive",
        source: "System AI Module",
        confidence: "N/A",
        isAI: true,
        timestamp: currentTimestamp,
      })
    }
  }

  // AI-generated insight for 'materials' tab
  if (tab === "materials") {
    try {
      const { object: aiMaterialData } = await generateObject({
        model: openai("gpt-4o"),
        schema: AiGeneratedInsightSchema,
        prompt: `You are a supply chain risk analyst for Sandvik. Considering Sandvik's critical materials: Tungsten (vertically integrated, WBH Austria), Cobalt (external sourcing, high risk from DRC), and Specialty Steel (external sourcing post-Alleima). Analyze recent commodity market trends (e.g., Cobalt price volatility, steel tariffs) and provide one specific, actionable insight for optimizing Sandvik's critical material sourcing strategy or mitigating risk in the next 6 months. Additionally, please state the number of distinct categories of information or types of data sources (e.g., commodity indices, supplier reports, geopolitical risk assessments) that would typically be synthesized to produce an insight like this. Assign this to 'sourcesCheckedCount'.`,
      })

      dynamicInsights.push({
        iconName: "Lightbulb",
        title: `AI: ${aiMaterialData.title}`,
        description:
          aiMaterialData.description +
          (aiMaterialData.actionableSuggestion ? ` Actionable Suggestion: ${aiMaterialData.actionableSuggestion}` : ""),
        badgeText: aiMaterialData.badgeText,
        badgeVariant: "default",
        badgeClassName: "bg-purple-500 text-white",
        source: "AI Materials Intelligence Platform",
        confidence: `AI Generated (${aiMaterialData.confidence}%)`,
        isAI: true,
        actionLink: aiMaterialData.actionableSuggestion
          ? { href: "#", text: "Review Sourcing Options", iconName: "ListChecks" }
          : undefined,
        timestamp: currentTimestamp,
        sourcesCheckedCount: aiMaterialData.sourcesCheckedCount,
      })
    } catch (error) {
      console.error("AI insight generation failed for 'materials' tab:", error)
      dynamicInsights.push({
        iconName: "AlertTriangle",
        title: "AI Material Insight Failed",
        description: "Could not generate an AI-powered material insight. Please check system logs.",
        badgeText: "Error",
        badgeVariant: "destructive",
        source: "System AI Module",
        confidence: "N/A",
        isAI: true,
        timestamp: currentTimestamp,
      })
    }
  }

  // AI-generated insight for 'manufacturing' tab
  if (tab === "manufacturing") {
    try {
      const { object: aiData } = await generateObject({
        model: openai("gpt-4o"),
        schema: AiGeneratedInsightSchema,
        prompt: `You are a manufacturing operations analyst for Sandvik. Analyze Sandvik's global manufacturing footprint, which includes key sites like Gimo, Sweden (an Industry 4.0 Lighthouse) and Mebane, NC (a green factory). Consider the ongoing SMMS regionalization strategy. Provide one specific, actionable insight related to manufacturing efficiency, potential bottlenecks, or a new technological opportunity (e.g., additive manufacturing, predictive maintenance) for the next quarter. Additionally, please state the number of distinct categories of information or types of data sources (e.g., production data, maintenance logs, industry best practices, new technology reports) that would typically be synthesized to produce an insight like this. Assign this to 'sourcesCheckedCount'.`,
      })

      dynamicInsights.push({
        iconName: "Factory",
        title: `AI: ${aiData.title}`,
        description:
          aiData.description +
          (aiData.actionableSuggestion ? ` Actionable Suggestion: ${aiData.actionableSuggestion}` : ""),
        badgeText: aiData.badgeText,
        badgeVariant: "default",
        badgeClassName: "bg-green-500 text-white",
        source: "AI Manufacturing Intelligence",
        confidence: `AI Generated (${aiData.confidence}%)`,
        isAI: true,
        actionLink: aiData.actionableSuggestion
          ? { href: "#", text: "Review Operations Data", iconName: "BarChart3" }
          : undefined,
        timestamp: currentTimestamp,
        sourcesCheckedCount: aiData.sourcesCheckedCount,
      })
    } catch (error) {
      console.error("AI insight generation failed for 'manufacturing' tab:", error)
      dynamicInsights.push({
        iconName: "AlertTriangle",
        title: "AI Manufacturing Insight Failed",
        description: "Could not generate an AI-powered manufacturing insight. Please check system logs.",
        badgeText: "Error",
        badgeVariant: "destructive",
        source: "System AI Module",
        confidence: "N/A",
        isAI: true,
        timestamp: currentTimestamp,
      })
    }
  }

  // AI-generated insight for 'logistics' tab
  if (tab === "logistics") {
    try {
      const { object: aiData } = await generateObject({
        model: openai("gpt-4o"),
        schema: AiGeneratedInsightSchema,
        prompt: `You are a logistics and trade compliance expert for Sandvik. Given the current logistics challenges, including Red Sea shipping disruptions, US reciprocal tariffs on EU exports, and volatile fuel prices, provide one specific, actionable insight to optimize Sandvik's logistics network. This could involve route optimization, a strategic modal shift, or a warehousing strategy to mitigate risks and reduce costs in the next 6 months. Additionally, please state the number of distinct categories of information or types of data sources (e.g., shipping rates, customs data, fuel price trends, port congestion reports) that would typically be synthesized to produce an insight like this. Assign this to 'sourcesCheckedCount'.`,
      })

      dynamicInsights.push({
        iconName: "Truck",
        title: `AI: ${aiData.title}`,
        description:
          aiData.description +
          (aiData.actionableSuggestion ? ` Actionable Suggestion: ${aiData.actionableSuggestion}` : ""),
        badgeText: aiData.badgeText,
        badgeVariant: "default",
        badgeClassName: "bg-blue-500 text-white",
        source: "AI Logistics Analytics",
        confidence: `AI Generated (${aiData.confidence}%)`,
        isAI: true,
        actionLink: aiData.actionableSuggestion
          ? { href: "#", text: "Analyze Logistics Data", iconName: "TrendingUp" }
          : undefined,
        timestamp: currentTimestamp,
        sourcesCheckedCount: aiData.sourcesCheckedCount,
      })
    } catch (error) {
      console.error("AI insight generation failed for 'logistics' tab:", error)
      dynamicInsights.push({
        iconName: "AlertTriangle",
        title: "AI Logistics Insight Failed",
        description: "Could not generate an AI-powered logistics insight. Please check system logs.",
        badgeText: "Error",
        badgeVariant: "destructive",
        source: "System AI Module",
        confidence: "N/A",
        isAI: true,
        timestamp: currentTimestamp,
      })
    }
  }

  return NextResponse.json({ insights: dynamicInsights })
}
