import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

const DigitalTwinSchema = z.object({
  projections: z.array(
    z.object({
      month: z.string(),
      baseline: z.number(),
      tariffImpact: z.number(),
      logisticsCost: z.number(),
      materialPrice: z.number(),
      geopolitical: z.number(),
      combinedRisk: z.number(),
    }),
  ),
  insights: z.array(
    z.object({
      title: z.string(),
      insight: z.string(),
      confidence: z.number(),
      category: z.enum(["Risk Analysis", "Optimization", "Strategic Advantage", "Sustainability"]),
    }),
  ),
  alerts: z.array(
    z.object({
      severity: z.enum(["Low", "Medium", "High", "Critical"]),
      message: z.string(),
      timeframe: z.string(),
      impact: z.string(),
    }),
  ),
})

export async function POST(request: Request) {
  try {
    const { timeframe, factors } = await request.json()

    const result = await generateObject({
      model: openai("gpt-4o"),
      schema: DigitalTwinSchema,
      prompt: `
        You are an AI digital twin system modeling Sandvik Group's supply chain interdependencies.
        
        Current baseline metrics (index 100):
        - Revenue: SEK 122.9B
        - Operating margin: 15.2%
        - Key risk factors: Tariffs, logistics costs, material prices, geopolitical stability
        
        Key interdependencies to model:
        1. Tariff Impact: US 10% reciprocal tariffs affecting SEK 17.7B revenue
        2. Logistics Costs: Red Sea disruptions, fuel price volatility
        3. Material Prices: Cobalt volatility (DRC dependency), tungsten stability (internal)
        4. Geopolitical: US-China tensions, EU-Russia sanctions, trade policy uncertainty
        
        Generate a ${timeframe || "6-month"} projection showing how these factors interact and compound.
        
        Consider:
        - Seasonal patterns in mining/manufacturing
        - Escalation scenarios for trade tensions
        - Supply chain disruption cascading effects
        - Sandvik's mitigation strategies (regionalization, vertical integration)
        
        Provide specific insights about critical inflection points and early warning indicators.
        Include actionable alerts for supply chain managers.
      `,
    })

    return Response.json(result.object)
  } catch (error) {
    console.error("Digital Twin Error:", error)
    return Response.json({ error: "Failed to generate digital twin analysis" }, { status: 500 })
  }
}
