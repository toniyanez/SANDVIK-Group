import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

const SimulationResultSchema = z.object({
  scenarioName: z.string(),
  timeframe: z.string(),
  baselineMetrics: z.object({
    revenue: z.number(),
    operatingMargin: z.number(),
    supplyChainCosts: z.number(),
  }),
  simulatedMetrics: z.object({
    revenue: z.number(),
    operatingMargin: z.number(),
    supplyChainCosts: z.number(),
    revenueChange: z.number(),
    marginChange: z.number(),
    costChange: z.number(),
  }),
  impactAnalysis: z.object({
    businessAreaImpacts: z.array(
      z.object({
        area: z.string(),
        revenueImpact: z.number(),
        riskLevel: z.enum(["Low", "Medium", "High", "Critical"]),
        description: z.string(),
      }),
    ),
    regionalImpacts: z.array(
      z.object({
        region: z.string(),
        revenueImpact: z.number(),
        marketShare: z.number(),
        competitivePosition: z.string(),
      }),
    ),
    materialImpacts: z.array(
      z.object({
        material: z.string(),
        costImpact: z.number(),
        availabilityRisk: z.enum(["Low", "Medium", "High", "Critical"]),
        mitigation: z.string(),
      }),
    ),
  }),
  riskMitigation: z.object({
    immediateActions: z.array(z.string()),
    mediumTermStrategies: z.array(z.string()),
    longTermInvestments: z.array(z.string()),
    contingencyPlans: z.array(z.string()),
  }),
  recommendations: z.array(
    z.object({
      priority: z.enum(["Low", "Medium", "High", "Critical"]),
      action: z.string(),
      investment: z.string(),
      timeline: z.string(),
      expectedROI: z.string(),
      riskReduction: z.string(),
    }),
  ),
  confidence: z.number(),
  keyAssumptions: z.array(z.string()),
})

export async function POST(request: Request) {
  try {
    const { scenario, parameters } = await request.json()

    const result = await generateObject({
      model: openai("gpt-4o"),
      schema: SimulationResultSchema,
      prompt: `
        You are an expert supply chain simulation engine for Sandvik Group. Analyze the following scenario and provide detailed impact analysis.

        SANDVIK BASELINE DATA:
        - Total Revenue: SEK 122.9B
        - Operating Margin: 15.2%
        - Business Areas: SMRS (51.8%, SEK 63.6B), SMMS (39.5%, SEK 48.6B), SRPS (8.7%, SEK 10.7B)
        - Key Markets: USA (SEK 17.7B), Australia (SEK 14.3B), China (SEK 9.1B), Canada (SEK 7.7B), Germany (SEK 6.5B)
        - Manufacturing Sites: 25+ globally (Europe, North America, Asia, Australia)
        - Critical Materials: Tungsten (vertically integrated), Cobalt (external, high risk), Steel (external post-Alleima)

        SCENARIO TO SIMULATE: ${scenario}
        
        PARAMETERS:
        ${JSON.stringify(parameters, null, 2)}

        Provide a comprehensive simulation including:
        1. Quantified revenue and margin impacts
        2. Business area and regional breakdowns
        3. Material cost and availability impacts
        4. Risk mitigation strategies with specific actions
        5. Investment recommendations with ROI projections
        6. Confidence levels and key assumptions

        Be specific with numbers, realistic about timelines, and consider Sandvik's unique position (tungsten vertical integration, global manufacturing footprint, SMMS regionalization strategy).

        Consider cascading effects, interdependencies, and both direct and indirect impacts.
      `,
    })

    return Response.json(result.object)
  } catch (error) {
    console.error("Simulation Error:", error)
    return Response.json({ error: "Failed to run simulation" }, { status: 500 })
  }
}
