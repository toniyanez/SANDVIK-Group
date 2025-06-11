import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

// Schema for the data expected from the client
const RequestBodySchema = z.object({
  materialName: z.string(),
  materialData: z.object({
    name: z.string(),
    status: z.string(),
    riskLevel: z.string(),
    source: z.string(),
    description: z.string(),
    advantages: z.array(z.string()),
    challenges: z.array(z.string()),
    mitigation: z.array(z.string()),
  }),
})

// Schema for the AI-generated insights
const CriticalMaterialInsightSchema = z.object({
  insights: z
    .array(
      z.object({
        title: z.string().describe("A concise, compelling title for the insight (max 10 words)."),
        insightText: z
          .string()
          .describe(
            "A detailed explanation of the insight, its relevance, and implications for the specific material (2-4 sentences).",
          ),
        category: z
          .enum([
            "Risk Mitigation",
            "Sourcing Opportunity",
            "Innovation Potential",
            "Cost Optimization",
            "Sustainability Focus",
            "Market Trend Impact",
            "Geopolitical Factor",
          ])
          .describe("The primary category of the insight related to the critical material."),
        confidence: z
          .number()
          .min(0)
          .max(100)
          .describe("A numerical confidence level (0-100) in the validity or accuracy of this insight."),
        actionableRecommendations: z
          .array(z.string())
          .min(1)
          .max(3)
          .describe("1-3 brief, concrete actionable recommendations related to the insight for the material."),
        potentialImpact: z
          .string()
          .optional()
          .describe(
            "A brief description of the potential positive or negative impact if the recommendations are followed or ignored (max 15 words).",
          ),
      }),
    )
    .min(1)
    .max(3)
    .describe("Generate 1 to 3 distinct insights for the specified critical material."),
})

export type AiCriticalMaterialInsights = z.infer<typeof CriticalMaterialInsightSchema>

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validationResult = RequestBodySchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: validationResult.error.format() },
        { status: 400 },
      )
    }

    const { materialName, materialData } = validationResult.data

    const prompt = `
      You are an expert supply chain analyst for Sandvik Group, a high-tech global engineering group.
      Sandvik's key critical materials include Tungsten (vertically integrated, low risk), Cobalt (external sourcing, high risk), and Specialty Steel (external sourcing, medium risk).

      You are analyzing: ${materialName}.
      Current data for ${materialName}:
      - Status: ${materialData.status}
      - Risk Level: ${materialData.riskLevel}
      - Source: ${materialData.source}
      - Description: ${materialData.description}
      - Known Advantages: ${materialData.advantages.join(", ")}
      - Known Challenges: ${materialData.challenges.join(", ")}
      - Current Mitigation Strategies: ${materialData.mitigation.join(", ")}

      Based on this information and current global market conditions, geopolitical factors, and technological advancements relevant to ${materialName}, provide 1-3 distinct, actionable insights.
      For each insight, include:
      - A concise title.
      - A detailed insight text explaining its relevance and implications.
      - A category for the insight.
      - A confidence level (0-100).
      - 1-3 concrete actionable recommendations.
      - A brief description of the potential impact.

      Focus on providing strategic value to Sandvik's supply chain management for ${materialName}.
      Consider risks, opportunities, sourcing strategies, cost optimization, sustainability, and innovation.
      Ensure recommendations are specific and actionable for Sandvik.
    `

    const { object: aiResponse } = await generateObject({
      model: openai("gpt-4o"),
      schema: CriticalMaterialInsightSchema,
      prompt: prompt,
    })

    return NextResponse.json(aiResponse)
  } catch (error) {
    console.error("AI Critical Materials Insight Generation Error:", error)
    let errorMessage = "Failed to generate AI insights."
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
