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
    const baselineSupplyChainCostsSEKM = 35000 // Realistic baseline supply chain costs

    const result = await generateObject({
      model: openai("gpt-4o"),
      schema: SimulationResultSchema,
      prompt: `
        You are an expert supply chain simulation engine for Sandvik Group. Analyze the following scenario and provide detailed impact analysis.
        
        CRITICAL REQUIREMENTS:
        1. ALL MONETARY VALUES MUST BE IN SEK MILLIONS AND REALISTIC
        2. SUPPLY CHAIN COSTS CANNOT BE ZERO - MUST BE BETWEEN 25,000-60,000 SEK MILLIONS
        3. BASELINE SUPPLY CHAIN COSTS ARE ${baselineSupplyChainCostsSEKM} SEK MILLIONS
        4. MARGIN IMPACTS MUST BE MATHEMATICALLY CONSISTENT WITH COST AND REVENUE CHANGES
        
        ALL MONETARY VALUES IN THE RESPONSE MUST BE IN SEK MILLIONS.
        ALL PERCENTAGE CHANGES (e.g. revenueChangePercent, costChangePercent, revenueImpactPercent) MUST BE PERCENTAGE POINTS (e.g., -2.7 for -2.7%, 5.0 for +5.0%).
        MARGINS (baseline and simulated operatingMargin) should be percentages (e.g., 15.2 for 15.2%).
        CONFIDENCE score must be a decimal between 0 and 1 (e.g., 0.85 for 85%).

        SANDVIK BASELINE DATA (all monetary values in SEK Millions):
        - Total Revenue: ${baselineRevenueSEKM} (SMRS: ${baselineSMRSSEKM}, SMMS: ${baselineSMMSEKM}, SRPS: ${baselineSRPSEKM})
        - Operating Margin: ${baselineOperatingMarginPercent}%
        - Supply Chain Costs: ${baselineSupplyChainCostsSEKM} (MANDATORY BASELINE - NEVER ZERO)
        - Business Areas (Revenue in SEK Millions): SMRS (${baselineSMRSSEKM}), SMMS (${baselineSMMSEKM}), SRPS (${baselineSRPSEKM})

        SCENARIO TO SIMULATE: ${scenarioContext} 
        Scenario Name (for output): ${scenarioName || "User Defined Scenario"}
        
        PARAMETERS: ${JSON.stringify(parameters, null, 2)}

        MANDATORY COST AND MARGIN LOGIC:
        
        COST IMPACT RULES:
        - Supply chain costs represent ~28% of total revenue (${baselineSupplyChainCostsSEKM}M of ${baselineRevenueSEKM}M)
        - Cost increases directly impact operating margins
        - Large cost increases (>20%) should cause significant margin compression (>3 p.p.)
        
        MARGIN CALCULATION RULES:
        - Operating Margin = (Revenue - Total Costs) / Revenue * 100
        - If supply chain costs increase by X%, and they represent 28% of revenue, margin impact ≈ X% * 0.28
        - Example: +30% supply chain cost increase should reduce margin by ~8.4 p.p. (30% * 0.28)
        
        BASELINE METRICS REQUIREMENTS:
        - baselineMetrics.revenue = ${baselineRevenueSEKM}
        - baselineMetrics.operatingMargin = ${baselineOperatingMarginPercent}
        - baselineMetrics.supplyChainCosts = ${baselineSupplyChainCostsSEKM} (NEVER ZERO)

        MATHEMATICAL CONSISTENCY VALIDATION:
        1. Calculate business area revenue impacts first
        2. Sum to get total simulated revenue
        3. Apply realistic cost changes based on scenario severity
        4. Calculate margin impact using: (Cost Change % * Cost Share of Revenue)
        5. Ensure margin change reflects both revenue and cost and revenue impacts realistically

        Provide a comprehensive simulation with MATHEMATICALLY CONSISTENT financial metrics.
        REMEMBER: Large cost increases must result in proportional margin compression.
      `,
    })

    // Enhanced validation and correction logic
    const simulatedResult = result.object

    // CRITICAL FIX: Ensure baseline costs are never zero
    if (!simulatedResult.baselineMetrics.supplyChainCosts || simulatedResult.baselineMetrics.supplyChainCosts <= 0) {
      console.log("FIXING: Baseline supply chain costs were zero or invalid")
      simulatedResult.baselineMetrics.supplyChainCosts = baselineSupplyChainCostsSEKM
    }

    // CRITICAL FIX: Ensure simulated costs are realistic
    if (!simulatedResult.simulatedMetrics.supplyChainCosts || simulatedResult.simulatedMetrics.supplyChainCosts <= 0) {
      console.log("FIXING: Simulated supply chain costs were zero or invalid")

      // SCENARIO-SPECIFIC COST AND MARGIN LOGIC
      let costMultiplier = 1.0

      const scenarioLower = scenarioContext.toLowerCase()

      if (
        scenarioLower.includes("green") ||
        scenarioLower.includes("sustainable") ||
        scenarioLower.includes("transition")
      ) {
        // Green transition is a POSITIVE opportunity for Sandvik
        costMultiplier = 1.05 // Only 5% cost increase (R&D investments, certification)
        console.log("GREEN TRANSITION: Applying positive opportunity logic")
      } else if (scenarioLower.includes("spain") && scenarioLower.includes("close")) {
        costMultiplier = 1.15 // 15% increase for Spain closure (moderate impact)
      } else if (scenarioLower.includes("cobalt") || scenarioLower.includes("material")) {
        costMultiplier = 1.25 // 25% increase for material crisis
      } else if (scenarioLower.includes("crisis") || scenarioLower.includes("disruption")) {
        costMultiplier = 1.3 // 30% increase for general crisis
      } else if (scenarioLower.includes("recession")) {
        costMultiplier = 0.95 // 5% decrease for recession
      } else {
        costMultiplier = 1.1 // 10% increase for general scenarios
      }

      simulatedResult.simulatedMetrics.supplyChainCosts = baselineSupplyChainCostsSEKM * costMultiplier
      simulatedResult.simulatedMetrics.costChangePercent = (costMultiplier - 1) * 100
    }

    // SCENARIO-SPECIFIC MARGIN ADJUSTMENTS (moved outside the conditional block)
    let marginImpactAdjustment = 0 // Additional margin benefit from premium pricing

    const scenarioLower = scenarioContext.toLowerCase()

    if (
      scenarioLower.includes("green") ||
      scenarioLower.includes("sustainable") ||
      scenarioLower.includes("transition")
    ) {
      marginImpactAdjustment = 2.0 // +2 p.p. margin benefit from premium pricing
    } else if (scenarioLower.includes("regionalization") && scenarioLower.includes("success")) {
      marginImpactAdjustment = 1.5 // +1.5 p.p. from operational efficiency
    } else if (scenarioLower.includes("recession")) {
      marginImpactAdjustment = -0.5 // -0.5 p.p. from price pressure
    }

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

    // CRITICAL FIX: Recalculate operating margin with proper mathematical relationship
    const newRevenue = simulatedResult.simulatedMetrics.revenue
    const newSupplyChainCosts = simulatedResult.simulatedMetrics.supplyChainCosts
    const costChangePercent = simulatedResult.simulatedMetrics.costChangePercent

    // Supply chain costs represent ~28% of total revenue
    const supplyChainCostShare = baselineSupplyChainCostsSEKM / baselineRevenueSEKM // ~0.28

    // Calculate margin impact: cost increase % * cost share of revenue
    const marginImpactFromCosts = (costChangePercent / 100) * supplyChainCostShare * 100 // Convert to percentage points

    // Calculate margin impact from revenue change (smaller effect)
    const revenueChangePercent = simulatedResult.simulatedMetrics.revenueChangePercent
    const marginImpactFromRevenue = revenueChangePercent * 0.1 // Revenue changes have smaller margin impact

    // Total margin impact
    const totalMarginImpact = -marginImpactFromCosts + marginImpactFromRevenue

    // Calculate new operating margin with scenario-specific adjustments
    const newOperatingMargin = Math.max(
      2,
      Math.min(25, baselineOperatingMarginPercent + totalMarginImpact + marginImpactAdjustment),
    )

    simulatedResult.simulatedMetrics.operatingMargin = newOperatingMargin
    simulatedResult.simulatedMetrics.marginChangePercentPoints = newOperatingMargin - baselineOperatingMarginPercent

    // Ensure cost change percentage is calculated correctly
    simulatedResult.simulatedMetrics.costChangePercent =
      ((simulatedResult.simulatedMetrics.supplyChainCosts - baselineSupplyChainCostsSEKM) /
        baselineSupplyChainCostsSEKM) *
      100

    console.log("Final Corrected Simulation Results:", {
      scenario: simulatedResult.scenarioName,
      baselineCosts: `SEK ${simulatedResult.baselineMetrics.supplyChainCosts.toFixed(0)}M`,
      newCosts: `SEK ${simulatedResult.simulatedMetrics.supplyChainCosts.toFixed(0)}M`,
      costChange: `${simulatedResult.simulatedMetrics.costChangePercent.toFixed(1)}%`,
      revenueChange: `${simulatedResult.simulatedMetrics.revenueChangePercent.toFixed(1)}%`,
      marginChange: `${simulatedResult.simulatedMetrics.marginChangePercentPoints.toFixed(1)} p.p.`,
      marginImpactFromCosts: `${marginImpactFromCosts.toFixed(1)} p.p.`,
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
