import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

const TariffAnalysisSchema = z.object({
  scenarios: z.array(
    z.object({
      scenario: z.string(),
      usEuTariff: z.number(),
      chinaUsTariff: z.number(),
      euChinaTariff: z.number(),
      // Changed from "Risk" levels to "Impact" levels
      impact: z.enum(["Low", "Medium", "High", "Critical"]),
      revenue: z.number(),
      margin: z.number(),
      // Changed from number to qualitative probability
      probability: z.enum(["Low", "Medium", "High"]),
      reasoning: z.string(),
    }),
  ),
  strategicResponses: z.array(
    z.object({
      title: z.string(),
      priority: z.enum(["Low", "Medium", "High", "Critical"]),
      timeline: z.string(),
      investment: z.string(),
      expectedROI: z.string(),
      description: z.string(),
      keyActions: z.array(z.string()),
      riskMitigation: z.string(),
      confidence: z.number(),
    }),
  ),
  riskAssessment: z.object({
    overallRisk: z.enum(["Low", "Medium", "High", "Critical"]),
    keyThreats: z.array(z.string()),
    opportunities: z.array(z.string()),
    recommendations: z.array(z.string()),
  }),
})

export async function POST(request: Request) {
  try {
    const { currentData } = await request.json()

    const result = await generateObject({
      model: openai("gpt-4o"),
      schema: TariffAnalysisSchema,
      prompt: `
        You are an expert supply chain analyst for Sandvik Group, a Swedish industrial company with three main business areas:
        - SMRS (Mining and Rock Solutions): SEK 63.6B revenue, 51.8%
        - SMMS (Manufacturing and Machining Solutions): SEK 48.6B revenue, 39.5% 
        - SRPS (Rock Processing Solutions): SEK 10.7B revenue, 8.7%
        
        Current situation:
        - Total revenue: SEK 122.9B
        - Key markets: USA (SEK 17.7B), Australia (SEK 14.3B), China (SEK 9.1B)
        - Manufacturing sites: 25+ globally across Europe, North America, Asia
        - Critical materials: Tungsten (vertically integrated via WBH Austria), Cobalt (external sourcing, high risk), Steel (post-Alleima divestment)
        
        Current trade challenges:
        - US reciprocal tariffs: 10% on EU exports
        - China base tariffs: 8% on cutting tools
        - Red Sea shipping disruptions
        - Geopolitical tensions affecting supply chains
        
        Sandvik is implementing SMMS regionalization to reduce cross-border complexities and tariff exposure.
        
        Analyze the current global trade environment and provide:
        1. 3-4 realistic tariff scenarios. For each scenario, include:
           - A descriptive name for the scenario.
           - Specific tariff percentages for US-EU, China-US, and EU-China trade.
           - The **impact level** on Sandvik (choose from: "Low", "Medium", "High", "Critical").
           - The estimated impact on Sandvik's total revenue (in SEK Millions).
           - The estimated impact on Sandvik's overall margin (as a percentage).
           - The **probability** of this scenario occurring (choose from: "Low", "Medium", "High").
           - A brief reasoning for the scenario and its impacts.
        2. AI-generated strategic responses with investment requirements and ROI projections.
        3. Overall risk assessment with actionable recommendations.
        
        Base your analysis on current geopolitical trends, trade policy patterns, and Sandvik's specific business model.
        Be specific with numbers and realistic about timelines and investments. Ensure all requested fields are populated.
      `,
    })

    return Response.json(result.object)
  } catch (error) {
    console.error("AI Analysis Error:", error)
    // Ensure a Zod-compliant error response or a generic one if Zod isn't the issue
    if (error instanceof z.ZodError) {
      return Response.json({ error: "AI response validation error", details: error.issues }, { status: 500 })
    }
    return Response.json({ error: "Failed to generate AI analysis" }, { status: 500 })
  }
}
