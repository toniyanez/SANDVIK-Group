import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

// All monetary values should be in SEK Millions.
// All percentage changes should be actual percentage points (e.g., -2.7 for -2.7%).
// Confidence should be a number between 0 and 1 (e.g., 0.85 for 85%).

const SimulationResultSchema = z.object({
  scenarioName: z.string(),
  timeframe: z.string(), // e.g., "12 months"
  baselineMetrics: z.object({
    revenue: z.number(), // SEK Millions
    operatingMargin: z.number(), // Percentage, e.g., 15.2
    supplyChainCosts: z.number(), // SEK Millions
  }),
  simulatedMetrics: z.object({
    revenue: z.number(), // SEK Millions (new total revenue after impact)
    operatingMargin: z.number(), // Percentage (new operating margin)
    supplyChainCosts: z.number(), // SEK Millions (new total supply chain costs)
    // Percentage point changes compared to baseline
    revenueChangePercent: z.number(), // e.g., -2.7 for a -2.7% change in revenue
    absoluteRevenueChangeSEKM: z.number(), // Absolute change in SEK Millions, e.g., -3318.3
    marginChangePercentPoints: z.number(), // e.g., -1.5 for a 1.5 percentage point drop in margin
    costChangePercent: z.number(), // e.g., 5.0 for a 5.0% increase in costs
  }),
  impactAnalysis: z.object({
    businessAreaImpacts: z.array(
      z.object({
        area: z.string(), // e.g., "SMRS", "SMMS", "SRPS"
        revenueImpactPercent: z.number(), // Percentage change in revenue for this BA, e.g., -5.0
        riskLevel: z.enum(["Low", "Medium", "High", "Critical"]),
        description: z.string(),
      }),
    ),
    regionalImpacts: z.array(
      z.object({
        region: z.string(),
        revenueImpactPercent: z.number(), // Percentage change in revenue for this region
        marketShare: z.number(), // New market share percentage
        competitivePosition: z.string(),
      }),
    ),
    materialImpacts: z.array(
      z.object({
        material: z.string(),
        costImpactPercent: z.number(), // Percentage change in cost for this material
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
      investment: z.string(), // e.g., "SEK 50M - 100M"
      timeline: z.string(),
      expectedROI: z.string(), // e.g., "15-20% over 3 years"
      riskReduction: z.string(), // e.g., "Reduces exposure by 10%"
    }),
  ),
  confidence: z.number(), // A value between 0 and 1 (e.g., 0.85 for 85% confidence)
  keyAssumptions: z.array(z.string()),
})

export async function POST(request: Request) {
  try {
    const { scenarioName, scenarioDescription, parameters } = await request.json()
    const scenarioContext = scenarioDescription || scenarioName || "General Scenario Analysis"

    const baselineRevenueSEKM = 122900
    const baselineSMRSSEKM = 63600
    const baselineSMMSEKM = 48600
    const baselineSRPSEKM = 10700
    const baselineOperatingMarginPercent = 15.2

    const result = await generateObject({
      model: openai("gpt-4o"),
      schema: SimulationResultSchema,
      prompt: `
        You are an expert supply chain simulation engine for Sandvik Group. Analyze the following scenario and provide detailed impact analysis.
        ALL MONETARY VALUES IN THE RESPONSE MUST BE IN SEK MILLIONS.
        ALL PERCENTAGE CHANGES (e.g. revenueChangePercent, costChangePercent, revenueImpactPercent) MUST BE PERCENTAGE POINTS (e.g., -2.7 for -2.7%, 5.0 for +5.0%).
        MARGINS (baseline and simulated operatingMargin) should be percentages (e.g., 15.2 for 15.2%).
        CONFIDENCE score must be a decimal between 0 and 1 (e.g., 0.85 for 85%).

        SANDVIK BASELINE DATA (all monetary values in SEK Millions):
        - Total Revenue: ${baselineRevenueSEKM} (SMRS: ${baselineSMRSSEKM}, SMMS: ${baselineSMMSEKM}, SRPS: ${baselineSRPSEKM})
        - Operating Margin: ${baselineOperatingMarginPercent}%
        - Business Areas (Revenue in SEK Millions): SMRS (${baselineSMRSSEKM}), SMMS (${baselineSMMSEKM}), SRPS (${baselineSRPSEKM})
        - Key Markets (Revenue in SEK Millions): USA (17700), Australia (14300), China (9100), Canada (7700), Germany (6500), Spain (4200), France (3800)
        - Manufacturing Sites: 25+ globally including facilities in Spain (Madrid, Barcelona)
        - Critical Materials: Tungsten (vertically integrated), Cobalt (external, high risk), Steel (external post-Alleima)

        SCENARIO TO SIMULATE: ${scenarioContext} 
        Scenario Name (for output): ${scenarioName || "User Defined Scenario"}
        
        PARAMETERS (interpret these as percentage changes or absolute values as appropriate for the context):
        ${JSON.stringify(parameters, null, 2)}

        CRITICAL INSTRUCTIONS FOR USER-GENERATED SCENARIOS:
        1. ANALYZE THE SCENARIO NAME AND DESCRIPTION CAREFULLY to understand the specific geographic, economic, or operational context.
        2. For geographic scenarios (e.g., "Spain lockdown", "China trade restrictions"), focus impacts on:
           - Sandvik's operations in that specific region
           - Supply chains that flow through that region
           - Customer demand in affected markets
           - Regional manufacturing facilities
        3. For material-specific scenarios (e.g., "Cobalt shortage"), focus on business areas with high dependency on that material.
        4. For logistics scenarios (e.g., "Port closures", "Shipping disruptions"), focus on transportation routes and supply chain flows.
        5. Generate SPECIFIC business area descriptions that directly relate to the scenario context, not generic statements.

        EXAMPLE SCENARIO-SPECIFIC ANALYSIS:
        If scenario involves "Spain lockdown":
        - SMRS: Should reference Spanish mining operations, European supply chains, impact on Spanish customers
        - SMMS: Should mention Spanish manufacturing facilities, European distribution networks
        - SRPS: Should consider Spanish construction/infrastructure market impacts
        
        If scenario involves "Cobalt crisis":
        - SMRS: High impact due to cobalt dependency in cutting tools and drilling equipment
        - SMMS: Moderate impact from cobalt in specialized alloys and components
        - SRPS: Lower impact as less cobalt-dependent

        CALCULATING OVERALL SIMULATED METRICS:
        After determining impacts on individual business areas, materials, and other factors:
        1. **Simulated Total Revenue (simulatedMetrics.revenue):** Calculate the new total revenue in SEK Millions. This should be the sum of the new revenues from each business area (SMRS, SMMS, SRPS) after applying their respective 'revenueImpactPercent' to their baseline revenues.
        2. **Overall Revenue Change Percent (simulatedMetrics.revenueChangePercent):** Calculate this as ((New Total Revenue / ${baselineRevenueSEKM}) - 1) * 100.
        3. **Absolute Revenue Change SEK Millions (simulatedMetrics.absoluteRevenueChangeSEKM):** Calculate this as New Total Revenue - ${baselineRevenueSEKM}.
        4. **Simulated Total Supply Chain Costs (simulatedMetrics.supplyChainCosts):** Estimate based on scenario parameters and material cost impacts.
        5. **Overall Cost Change Percent (simulatedMetrics.costChangePercent):** Calculate based on supply chain cost changes.
        6. **Simulated Operating Margin (simulatedMetrics.operatingMargin):** Calculate new margin based on revenue and cost changes.
        7. **Overall Margin Change Percent Points (simulatedMetrics.marginChangePercentPoints):** Calculate as (New Operating Margin - ${baselineOperatingMarginPercent}).

        Provide a comprehensive simulation including:
        1. Baseline metrics in SEK Millions
        2. Simulated metrics with scenario-specific impacts
        3. Business area impacts with SCENARIO-SPECIFIC descriptions
        4. Regional impacts focusing on affected geographies
        5. Material impacts relevant to the scenario
        6. Risk mitigation strategies tailored to the scenario
        7. Recommendations specific to the scenario challenges
        8. Key assumptions relevant to the scenario context

        The 'scenarioName' in the output object should be: "${scenarioName || "User Defined Scenario"}".

        Be specific, realistic, and ensure all impacts directly relate to the scenario context provided.
        Ensure all monetary outputs are in SEK Millions and percentages are as specified.
      `,
    })

    // Ensure absoluteRevenueChangeSEKM is correctly calculated
    if (
      result.object.simulatedMetrics.absoluteRevenueChangeSEKM === undefined ||
      Math.abs(
        result.object.simulatedMetrics.revenue -
          baselineRevenueSEKM -
          result.object.simulatedMetrics.absoluteRevenueChangeSEKM,
      ) > 0.1
    ) {
      result.object.simulatedMetrics.absoluteRevenueChangeSEKM =
        result.object.simulatedMetrics.revenue - baselineRevenueSEKM
    }

    // Recalculate revenueChangePercent for consistency
    if (baselineRevenueSEKM !== 0) {
      result.object.simulatedMetrics.revenueChangePercent =
        (result.object.simulatedMetrics.absoluteRevenueChangeSEKM / baselineRevenueSEKM) * 100
    } else {
      result.object.simulatedMetrics.revenueChangePercent = 0
    }

    console.log("AI Generated Scenario Analysis:", JSON.stringify(result.object.scenarioName, null, 2))
    console.log("Business Area Impacts:", JSON.stringify(result.object.impactAnalysis.businessAreaImpacts, null, 2))

    return Response.json(result.object)
  } catch (error) {
    console.error("Simulation Error:", error)
    if (error instanceof z.ZodError) {
      console.error("Zod Validation Error:", error.errors)
      return Response.json({ error: "Invalid data format from AI", details: error.errors }, { status: 500 })
    }
    return Response.json({ error: "Failed to run simulation" }, { status: 500 })
  }
}
