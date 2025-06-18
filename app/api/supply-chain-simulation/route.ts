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
    const baselineSupplyChainCostsSEKM = 35000 // Estimated realistic baseline supply chain costs

    const result = await generateObject({
      model: openai("gpt-4o"),
      schema: SimulationResultSchema,
      prompt: `
        You are an expert supply chain simulation engine for Sandvik Group. Analyze the following scenario and provide detailed impact analysis.
        
        CRITICAL: ENSURE MATHEMATICAL CONSISTENCY AND REALISTIC BUSINESS LOGIC.
        
        ALL MONETARY VALUES IN THE RESPONSE MUST BE IN SEK MILLIONS.
        ALL PERCENTAGE CHANGES (e.g. revenueChangePercent, costChangePercent, revenueImpactPercent) MUST BE PERCENTAGE POINTS (e.g., -2.7 for -2.7%, 5.0 for +5.0%).
        MARGINS (baseline and simulated operatingMargin) should be percentages (e.g., 15.2 for 15.2%).
        CONFIDENCE score must be a decimal between 0 and 1 (e.g., 0.85 for 85%).

        SANDVIK BASELINE DATA (all monetary values in SEK Millions):
        - Total Revenue: ${baselineRevenueSEKM} (SMRS: ${baselineSMRSSEKM}, SMMS: ${baselineSMMSEKM}, SRPS: ${baselineSRPSEKM})
        - Operating Margin: ${baselineOperatingMarginPercent}%
        - Supply Chain Costs: ${baselineSupplyChainCostsSEKM}
        - Business Areas (Revenue in SEK Millions): SMRS (${baselineSMRSSEKM}), SMMS (${baselineSMMSEKM}), SRPS (${baselineSRPSEKM})

        SCENARIO TO SIMULATE: ${scenarioContext} 
        Scenario Name (for output): ${scenarioName || "User Defined Scenario"}
        
        PARAMETERS: ${JSON.stringify(parameters, null, 2)}

        BUSINESS LOGIC REQUIREMENTS:
        1. Supply chain costs CANNOT be zero - they must be realistic positive values
        2. Operating margin CANNOT be zero unless the company is making no profit
        3. Cost changes should reflect the scenario (green transition = higher R&D/compliance costs)
        4. Margin changes should reflect the balance between revenue growth and cost increases
        5. All values must be mathematically consistent and business-realistic

        SCENARIO-SPECIFIC COST AND MARGIN LOGIC:
        - "Green Transition": Higher R&D costs (+8-15%), compliance costs (+5-10%), but premium pricing helps margins
        - "Crisis/Disruption": Higher logistics costs (+15-30%), material costs (+10-25%), margin compression
        - "Recession": Cost reduction efforts (-5-10%), but margin pressure from lower volumes
        - "Trade War": Higher tariff costs (+10-20%), supply chain diversification costs (+5-15%)

        CALCULATION STEPS YOU MUST FOLLOW:
        1. Calculate realistic business area revenue impacts
        2. Sum to get total simulated revenue
        3. Calculate scenario-appropriate cost changes (NEVER zero or negative unless explicitly justified)
        4. Calculate new operating margin based on: (New Revenue - New Costs) / New Revenue * 100
        5. Ensure margin change reflects both revenue and cost impacts
        6. Validate all values are realistic for a large industrial company

        VALIDATION RULES:
        - Supply chain costs must be between 20,000 and 60,000 SEK Millions (realistic range)
        - Operating margin must be between -5% and 25% (realistic business range)
        - Cost changes should align with scenario type (green = higher costs, efficiency = lower costs)
        - Margin changes should reflect the net effect of revenue and cost changes

        EXAMPLES OF REALISTIC OUTPUTS:
        Green Transition Scenario:
        - Revenue: +10-15% (premium products, higher demand)
        - Costs: +8-12% (R&D, compliance, sustainable materials)
        - Margin: +1-3 p.p. (premium pricing offsets higher costs)

        Supply Crisis Scenario:
        - Revenue: -5-15% (supply constraints, lost sales)
        - Costs: +15-25% (alternative suppliers, expedited shipping)
        - Margin: -3-8 p.p. (cost increases exceed revenue impact)

        Provide a comprehensive simulation with REALISTIC and CONSISTENT financial metrics.
      `,
    })

    // Enhanced validation and correction logic
    const simulatedResult = result.object

    // Calculate expected total revenue from business area impacts
    let expectedTotalRevenue = baselineRevenueSEKM
    if (simulatedResult.impactAnalysis?.businessAreaImpacts) {
      const smrsImpact = simulatedResult.impactAnalysis.businessAreaImpacts.find((ba) => ba.area === "SMRS")
      const smmsImpact = simulatedResult.impactAnalysis.businessAreaImpacts.find((ba) => ba.area === "SMMS")
      const srpsImpact = simulatedResult.impactAnalysis.businessAreaImpacts.find((ba) => ba.area === "SRPS")

      const smrsNewRevenue = baselineSMRSSEKM * (1 + (smrsImpact?.revenueImpactPercent || 0) / 100)
      const smmsNewRevenue = baselineSMMSEKM * (1 + (smmsImpact?.revenueImpactPercent || 0) / 100)
      const srpsNewRevenue = baselineSRPSEKM * (1 + (srpsImpact?.revenueImpactPercent || 0) / 100)

      expectedTotalRevenue = smrsNewRevenue + smmsNewRevenue + srpsNewRevenue
    }

    // Correct revenue if inconsistent
    if (Math.abs(simulatedResult.simulatedMetrics.revenue - expectedTotalRevenue) > 1000) {
      simulatedResult.simulatedMetrics.revenue = expectedTotalRevenue
      simulatedResult.simulatedMetrics.absoluteRevenueChangeSEKM = expectedTotalRevenue - baselineRevenueSEKM
      simulatedResult.simulatedMetrics.revenueChangePercent =
        (simulatedResult.simulatedMetrics.absoluteRevenueChangeSEKM / baselineRevenueSEKM) * 100
    }

    // Fix unrealistic cost and margin values
    if (
      simulatedResult.simulatedMetrics.supplyChainCosts <= 0 ||
      simulatedResult.simulatedMetrics.supplyChainCosts < 20000
    ) {
      console.log("Correcting unrealistic supply chain costs")

      // Determine realistic cost change based on scenario type
      let costChangePercent = 0
      const scenarioLower = scenarioContext.toLowerCase()

      if (
        scenarioLower.includes("green") ||
        scenarioLower.includes("transition") ||
        scenarioLower.includes("sustainable")
      ) {
        costChangePercent = 8 + Math.random() * 7 // 8-15% increase for green transition
      } else if (scenarioLower.includes("crisis") || scenarioLower.includes("disruption")) {
        costChangePercent = 15 + Math.random() * 15 // 15-30% increase for crisis
      } else if (scenarioLower.includes("recession")) {
        costChangePercent = -5 + Math.random() * 10 // -5% to +5% for recession
      } else {
        costChangePercent = -2 + Math.random() * 12 // -2% to +10% for general scenarios
      }

      simulatedResult.simulatedMetrics.costChangePercent = costChangePercent
      simulatedResult.simulatedMetrics.supplyChainCosts = baselineSupplyChainCostsSEKM * (1 + costChangePercent / 100)
    }

    // Fix unrealistic margin values
    if (
      simulatedResult.simulatedMetrics.operatingMargin <= 0 &&
      simulatedResult.simulatedMetrics.revenueChangePercent > -20
    ) {
      console.log("Correcting unrealistic operating margin")

      // Calculate realistic margin based on revenue and cost changes
      const revenueGrowth = simulatedResult.simulatedMetrics.revenueChangePercent / 100
      const costGrowth = simulatedResult.simulatedMetrics.costChangePercent / 100

      // Simplified margin calculation: if revenue grows faster than costs, margin improves
      const marginImpact = (revenueGrowth - costGrowth) * 5 // Scaling factor for margin sensitivity
      const newMargin = Math.max(5, Math.min(25, baselineOperatingMarginPercent + marginImpact))

      simulatedResult.simulatedMetrics.operatingMargin = newMargin
      simulatedResult.simulatedMetrics.marginChangePercentPoints = newMargin - baselineOperatingMarginPercent
    }

    // Ensure cost change percentage is calculated correctly
    if (simulatedResult.simulatedMetrics.supplyChainCosts > 0) {
      simulatedResult.simulatedMetrics.costChangePercent =
        ((simulatedResult.simulatedMetrics.supplyChainCosts - baselineSupplyChainCostsSEKM) /
          baselineSupplyChainCostsSEKM) *
        100
    }

    console.log("Final Simulation Results:", {
      scenario: simulatedResult.scenarioName,
      revenueChange: `${simulatedResult.simulatedMetrics.revenueChangePercent.toFixed(1)}%`,
      newRevenue: `SEK ${simulatedResult.simulatedMetrics.revenue.toFixed(0)}M`,
      costChange: `${simulatedResult.simulatedMetrics.costChangePercent.toFixed(1)}%`,
      newCosts: `SEK ${simulatedResult.simulatedMetrics.supplyChainCosts.toFixed(0)}M`,
      marginChange: `${simulatedResult.simulatedMetrics.marginChangePercentPoints.toFixed(1)} p.p.`,
      newMargin: `${simulatedResult.simulatedMetrics.operatingMargin.toFixed(1)}%`,
    })

    return Response.json(simulatedResult)
  } catch (error) {
    console.error("Simulation Error:", error)
    if (error instanceof z.ZodError) {
      console.error("Zod Validation Error:", error.errors)
      return Response.json({ error: "Invalid data format from AI", details: error.errors }, { status: 500 })
    }
    return Response.json({ error: "Failed to run simulation" }, { status: 500 })
  }
}
