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
      impact: z.enum(["Low Risk", "Medium Risk", "High Risk", "Critical Risk"]),
      revenue: z.number(),
      margin: z.number(),
      probability: z.number(),
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
        1. 3-4 realistic tariff scenarios with specific impacts on Sandvik's revenue and margins
        2. AI-generated strategic responses with investment requirements and ROI projections
        3. Overall risk assessment with actionable recommendations
        
        Base your analysis on current geopolitical trends, trade policy patterns, and Sandvik's specific business model.
        Be specific with numbers and realistic about timelines and investments.
      `,
    })

    return Response.json(result.object)
  } catch (error) {
    console.error("AI Analysis Error:", error)
    return Response.json({ error: "Failed to generate AI analysis" }, { status: 500 })
  }
}
