import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

const ComparisonSchema = z.object({
  scenarios: z.array(
    z.object({
      name: z.string(),
      revenueImpact: z.number(),
      marginImpact: z.number(),
      riskScore: z.number(),
      probability: z.number(),
      timeToImpact: z.string(),
    }),
  ),
  recommendations: z.object({
    bestCase: z.string(),
    worstCase: z.string(),
    mostLikely: z.string(),
    hedgingStrategy: z.string(),
  }),
  portfolioOptimization: z.array(
    z.object({
      strategy: z.string(),
      allocation: z.number(),
      riskReduction: z.number(),
      expectedReturn: z.number(),
    }),
  ),
  insights: z.array(z.string()),
})

export async function POST(request: Request) {
  try {
    const { scenarios } = await request.json()

    const result = await generateObject({
      model: openai("gpt-4o"),
      schema: ComparisonSchema,
      prompt: `
        You are analyzing multiple supply chain scenarios for Sandvik Group to support strategic decision-making.

        SCENARIOS TO COMPARE:
        ${scenarios.map((s: any, i: number) => `${i + 1}. ${s.name}: ${s.description}`).join("\n")}

        Provide a comprehensive comparison including:
        1. Quantified impact analysis for each scenario
        2. Risk scoring and probability assessments
        3. Strategic recommendations for each outcome
        4. Portfolio optimization strategies
        5. Key insights for executive decision-making

        Consider Sandvik's current position, market dynamics, and strategic priorities.
        Focus on actionable insights that support risk mitigation and strategic planning.
      `,
    })

    return Response.json(result.object)
  } catch (error) {
    console.error("Comparison Error:", error)
    return Response.json({ error: "Failed to compare scenarios" }, { status: 500 })
  }
}
