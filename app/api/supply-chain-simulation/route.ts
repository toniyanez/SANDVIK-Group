import { type NextRequest, NextResponse } from "next/server"

interface SimulationRequest {
  scenarioName: string
  scenarioDescription: string
  parameters: Record<string, any>
}

// Helper function to generate scenario-specific business area impacts
function generateBusinessAreaImpacts(scenarioName: string, scenarioDescription: string) {
  const scenarioLower = scenarioName.toLowerCase()

  if (scenarioLower.includes("ormuz") || scenarioLower.includes("hormuz")) {
    return [
      {
        area: "SMRS",
        description: "Significant dependency on Cobalt, facing severe supply reduction.",
        revenueImpactPercent: -12.0,
        riskLevel: "Critical",
      },
      {
        area: "SMMS",
        description: "Moderate impact due to increased material costs and demand fluctuation.",
        revenueImpactPercent: -7.5,
        riskLevel: "High",
      },
      {
        area: "SRPS",
        description: "Minimal impact, less dependency on critical materials.",
        revenueImpactPercent: -2.8,
        riskLevel: "Medium",
      },
    ]
  } else if (scenarioLower.includes("cobalt")) {
    return [
      {
        area: "SMRS",
        description: "Significant dependency on Cobalt, facing severe supply reduction.",
        revenueImpactPercent: -10.0,
        riskLevel: "High",
      },
      {
        area: "SMMS",
        description: "Moderate impact due to increased material costs and demand fluctuation.",
        revenueImpactPercent: -5.0,
        riskLevel: "Medium",
      },
      {
        area: "SRPS",
        description: "Minimal impact, less dependency on critical materials.",
        revenueImpactPercent: -3.0,
        riskLevel: "Low",
      },
    ]
  } else if (scenarioLower.includes("trade war") || scenarioLower.includes("tariff")) {
    return [
      {
        area: "SMRS",
        description: "High exposure to US-China trade routes, significant tariff impact on exports.",
        revenueImpactPercent: -8.5,
        riskLevel: "High",
      },
      {
        area: "SMMS",
        description: "Moderate tariff exposure, some production can be regionalized.",
        revenueImpactPercent: -6.2,
        riskLevel: "Medium",
      },
      {
        area: "SRPS",
        description: "Lower trade exposure, minimal direct tariff impact.",
        revenueImpactPercent: -2.1,
        riskLevel: "Low",
      },
    ]
  } else if (scenarioLower.includes("red sea")) {
    return [
      {
        area: "SMRS",
        description: "Heavy reliance on Red Sea shipping routes for component imports.",
        revenueImpactPercent: -9.2,
        riskLevel: "High",
      },
      {
        area: "SMMS",
        description: "Moderate shipping route dependency, alternative routes available.",
        revenueImpactPercent: -5.8,
        riskLevel: "Medium",
      },
      {
        area: "SRPS",
        description: "Limited Red Sea route dependency, minimal shipping impact.",
        revenueImpactPercent: -1.9,
        riskLevel: "Low",
      },
    ]
  } else if (scenarioLower.includes("port") || scenarioLower.includes("marseille")) {
    return [
      {
        area: "SMRS",
        description: "Significant dependency on Mediterranean shipping routes for European operations.",
        revenueImpactPercent: -11.5,
        riskLevel: "Critical",
      },
      {
        area: "SMMS",
        description: "Moderate impact from European logistics disruptions.",
        revenueImpactPercent: -6.8,
        riskLevel: "High",
      },
      {
        area: "SRPS",
        description: "Limited European exposure, alternative routes available.",
        revenueImpactPercent: -2.3,
        riskLevel: "Medium",
      },
    ]
  }

  // Default generic impacts
  return [
    {
      area: "SMRS",
      description: "Moderate supply chain disruption affecting production schedules.",
      revenueImpactPercent: -7.0,
      riskLevel: "Medium",
    },
    {
      area: "SMMS",
      description: "Supply chain resilience measures partially mitigate impact.",
      revenueImpactPercent: -4.5,
      riskLevel: "Medium",
    },
    {
      area: "SRPS",
      description: "Limited exposure to primary disruption factors.",
      revenueImpactPercent: -2.0,
      riskLevel: "Low",
    },
  ]
}

// Helper function to generate scenario-specific recommendations
function generateScenarioRecommendations(scenarioName: string, scenarioDescription: string) {
  const scenarioLower = scenarioName.toLowerCase()

  if (scenarioLower.includes("ormuz") || scenarioLower.includes("hormuz")) {
    return [
      {
        action: "Secure alternative shipping routes via Cape of Good Hope",
        investment: "SEK 150 million",
        timeline: "Immediate",
        expectedROI: "High",
        riskReduction: "Significant",
        priority: "Critical",
      },
      {
        action: "Establish strategic fuel reserves for operations",
        investment: "SEK 80 million",
        timeline: "3 months",
        expectedROI: "Medium",
        riskReduction: "Moderate",
        priority: "High",
      },
      {
        action: "Diversify energy suppliers outside Persian Gulf region",
        investment: "SEK 200 million",
        timeline: "6 months",
        expectedROI: "Long-term",
        riskReduction: "Moderate",
        priority: "Medium",
      },
    ]
  } else if (scenarioLower.includes("cobalt")) {
    return [
      {
        action: "Secure alternative Cobalt sources",
        investment: "SEK 500 million",
        timeline: "Immediate",
        expectedROI: "High",
        riskReduction: "Significant",
        priority: "Critical",
      },
      {
        action: "Increase inventory levels of critical materials",
        investment: "SEK 300 million",
        timeline: "3 months",
        expectedROI: "Medium",
        riskReduction: "Moderate",
        priority: "High",
      },
      {
        action: "Invest in recycling technology",
        investment: "SEK 200 million",
        timeline: "6 months",
        expectedROI: "Long-term",
        riskReduction: "Moderate",
        priority: "Medium",
      },
    ]
  } else if (scenarioLower.includes("port") || scenarioLower.includes("marseille")) {
    return [
      {
        action: "Activate alternative European port networks",
        investment: "SEK 120 million",
        timeline: "Immediate",
        expectedROI: "High",
        riskReduction: "Significant",
        priority: "Critical",
      },
      {
        action: "Implement rail freight alternatives through Northern Europe",
        investment: "SEK 180 million",
        timeline: "2 months",
        expectedROI: "Medium",
        riskReduction: "Moderate",
        priority: "High",
      },
      {
        action: "Establish temporary logistics hubs in Hamburg and Rotterdam",
        investment: "SEK 95 million",
        timeline: "4 weeks",
        expectedROI: "Medium",
        riskReduction: "Moderate",
        priority: "High",
      },
    ]
  }

  // Default generic recommendations
  return [
    {
      action: "Diversify supplier base across multiple regions",
      investment: "SEK 250 million",
      timeline: "Immediate",
      expectedROI: "High",
      riskReduction: "Significant",
      priority: "High",
    },
    {
      action: "Increase strategic inventory buffers",
      investment: "SEK 180 million",
      timeline: "3 months",
      expectedROI: "Medium",
      riskReduction: "Moderate",
      priority: "Medium",
    },
    {
      action: "Implement supply chain visibility tools",
      investment: "SEK 75 million",
      timeline: "6 months",
      expectedROI: "Long-term",
      riskReduction: "Moderate",
      priority: "Medium",
    },
  ]
}

// Helper function to generate scenario-specific assumptions
function generateScenarioAssumptions(scenarioName: string, scenarioDescription: string) {
  const scenarioLower = scenarioName.toLowerCase()

  if (scenarioLower.includes("ormuz") || scenarioLower.includes("hormuz")) {
    return [
      "Strait of Hormuz closure affects 20% of global oil shipments",
      "Alternative shipping routes add 10-14 days to delivery times",
      "Energy costs increase by 25-40% during disruption period",
      "Regional suppliers can partially compensate for supply gaps",
      "Geopolitical tensions resolve within 6-12 months",
    ]
  } else if (scenarioLower.includes("cobalt")) {
    return [
      "Cobalt supply reduction is severe and impacts production significantly",
      "Alternative sources for Cobalt are not immediately available",
      "Demand fluctuation affects all regions similarly",
      "Material cost increases are partially mitigated by existing contracts",
    ]
  } else if (scenarioLower.includes("port") || scenarioLower.includes("marseille")) {
    return [
      "Port closure affects 30% of Mediterranean shipping traffic",
      "Alternative European ports can absorb 60% of diverted cargo",
      "Rail freight capacity can be increased by 25% within 8 weeks",
      "Northern European ports have available capacity for emergency routing",
      "Port operations resume to 80% capacity within 3-4 months",
    ]
  }

  // Default assumptions
  return [
    "Supply chain disruption affects multiple regions simultaneously",
    "Alternative suppliers and routes are available but at higher costs",
    "Market demand remains relatively stable during disruption period",
    "Recovery to normal operations takes 6-12 months",
  ]
}

// Helper function to generate scenario-specific risk mitigation strategies
function generateRiskMitigation(scenarioName: string, scenarioDescription: string) {
  const scenarioLower = scenarioName.toLowerCase()

  if (scenarioLower.includes("ormuz") || scenarioLower.includes("hormuz")) {
    return {
      immediateActions: [
        "Activate pre-negotiated alternative shipping contracts via Cape of Good Hope",
        "Implement emergency fuel procurement from non-Persian Gulf suppliers",
        "Establish crisis communication protocols with key customers",
        "Deploy supply chain risk monitoring for Persian Gulf region",
      ],
      mediumTermStrategies: [
        "Diversify supplier base to reduce Persian Gulf dependency",
        "Establish strategic partnerships with alternative logistics providers",
        "Implement dynamic pricing models to offset increased transportation costs",
        "Develop contingency production schedules for extended disruptions",
      ],
      longTermInvestments: [
        "Build strategic inventory facilities outside geopolitically sensitive regions",
        "Invest in supply chain digitalization for real-time risk monitoring",
        "Develop alternative material sourcing strategies",
        "Establish regional production capabilities to reduce shipping dependencies",
      ],
      contingencyPlans: [
        "Emergency supplier activation protocols for critical materials",
        "Customer communication and expectation management procedures",
        "Financial hedging strategies for energy cost volatility",
        "Alternative production scheduling for extended disruptions",
      ],
    }
  } else if (scenarioLower.includes("cobalt")) {
    return {
      immediateActions: [
        "Establish emergency supply agreements with Australian and Canadian suppliers",
        "Diversify supplier base across regions",
        "Increase strategic inventory levels by 40%",
        "Activate alternative material sourcing protocols",
      ],
      mediumTermStrategies: [
        "Develop long-term partnerships with non-DRC cobalt suppliers",
        "Implement cobalt recycling and recovery programs",
        "Invest in material substitution research and development",
        "Establish regional material processing capabilities",
      ],
      longTermInvestments: [
        "Build strategic cobalt reserves and processing facilities",
        "Invest in advanced recycling technologies",
        "Develop alternative battery chemistries with reduced cobalt dependency",
        "Establish vertical integration in critical material supply chains",
      ],
      contingencyPlans: [
        "Emergency material allocation protocols across business units",
        "Customer priority management during material shortages",
        "Alternative product design strategies with reduced cobalt content",
        "Financial instruments to hedge against material price volatility",
      ],
    }
  } else if (scenarioLower.includes("port") || scenarioLower.includes("marseille")) {
    return {
      immediateActions: [
        "Redirect shipments to Hamburg, Rotterdam, and Antwerp ports",
        "Activate rail freight networks through Northern Europe",
        "Establish temporary logistics coordination centers",
        "Implement expedited customs clearance procedures",
      ],
      mediumTermStrategies: [
        "Develop multi-port distribution strategies for European operations",
        "Establish partnerships with alternative logistics providers",
        "Implement inventory pre-positioning in key European markets",
        "Develop rail and road freight alternatives to sea transport",
      ],
      longTermInvestments: [
        "Build distributed logistics network across multiple European hubs",
        "Invest in intermodal transportation capabilities",
        "Establish regional warehousing and distribution centers",
        "Develop digital logistics platforms for route optimization",
      ],
      contingencyPlans: [
        "Emergency logistics rerouting protocols for Mediterranean disruptions",
        "Customer delivery expectation management procedures",
        "Alternative transportation mode activation procedures",
        "Regional inventory rebalancing strategies",
      ],
    }
  }

  // Default risk mitigation
  return {
    immediateActions: [
      "Activate alternative supplier agreements",
      "Implement emergency inventory management protocols",
      "Establish crisis communication with key stakeholders",
      "Deploy enhanced supply chain monitoring",
    ],
    mediumTermStrategies: [
      "Diversify supplier base across multiple regions",
      "Develop alternative logistics and transportation routes",
      "Implement flexible production scheduling",
      "Establish strategic partnerships for supply chain resilience",
    ],
    longTermInvestments: [
      "Build distributed supply chain network",
      "Invest in supply chain digitalization and AI-powered risk prediction",
      "Develop regional production and sourcing capabilities",
      "Establish strategic inventory and buffer stock facilities",
    ],
    contingencyPlans: [
      "Emergency supplier activation and material allocation protocols",
      "Customer communication and expectation management procedures",
      "Alternative production and delivery scheduling",
      "Financial risk management and hedging strategies",
    ],
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: SimulationRequest = await request.json()
    const { scenarioName, scenarioDescription, parameters } = body

    console.log(`Running simulation for scenario: ${scenarioName}`)

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Calculate scenario-specific impacts based on parameters and scenario type
    const scenarioLower = scenarioName.toLowerCase()
    let baseRevenueImpact = -5.0
    let baseMarginImpact = -2.5
    let baseCostImpact = 15.0

    // Adjust impacts based on scenario type
    if (scenarioLower.includes("ormuz") || scenarioLower.includes("hormuz")) {
      baseRevenueImpact = -8.5
      baseMarginImpact = -4.2
      baseCostImpact = 22.0
    } else if (scenarioLower.includes("cobalt")) {
      baseRevenueImpact = -6.0
      baseMarginImpact = -4.7
      baseCostImpact = 20.0
    } else if (scenarioLower.includes("trade war") || scenarioLower.includes("tariff")) {
      baseRevenueImpact = -7.2
      baseMarginImpact = -3.8
      baseCostImpact = 18.5
    } else if (scenarioLower.includes("port") || scenarioLower.includes("marseille")) {
      baseRevenueImpact = -9.1
      baseMarginImpact = -5.2
      baseCostImpact = 25.0
    }

    // Apply parameter adjustments
    if (parameters.shippingCosts) {
      const shippingMultiplier = parameters.shippingCosts / 100
      baseCostImpact *= shippingMultiplier
      baseRevenueImpact *= Math.min(shippingMultiplier, 1.5)
    }

    if (parameters.materialCosts) {
      const materialMultiplier = parameters.materialCosts / 100
      baseCostImpact *= materialMultiplier
      baseMarginImpact *= Math.min(materialMultiplier, 1.3)
    }

    // Base financial metrics (SEK millions)
    const baseRevenue = 127000
    const baseOperatingMargin = 19.5
    const baseSupplyChainCosts = 45000

    // Calculate simulated metrics
    const revenueChangePercent = baseRevenueImpact
    const absoluteRevenueChangeSEKM = (baseRevenue * revenueChangePercent) / 100
    const newRevenue = baseRevenue + absoluteRevenueChangeSEKM

    const marginChangePercentPoints = baseMarginImpact
    const newOperatingMargin = baseOperatingMargin + marginChangePercentPoints

    const costChangePercent = baseCostImpact
    const newSupplyChainCosts = baseSupplyChainCosts * (1 + costChangePercent / 100)

    const simulationResult = {
      scenarioName,
      timeframe: "6 months",
      confidence: 0.85,
      simulatedMetrics: {
        revenue: Math.round(newRevenue),
        revenueChangePercent: Math.round(revenueChangePercent * 10) / 10,
        absoluteRevenueChangeSEKM: Math.round(absoluteRevenueChangeSEKM),
        operatingMargin: Math.round(newOperatingMargin * 10) / 10,
        marginChangePercentPoints: Math.round(marginChangePercentPoints * 10) / 10,
        supplyChainCosts: Math.round(newSupplyChainCosts),
        costChangePercent: Math.round(costChangePercent * 10) / 10,
      },
      impactAnalysis: {
        businessAreaImpacts: generateBusinessAreaImpacts(scenarioName, scenarioDescription),
        materialImpacts: [
          {
            material: "Cobalt",
            costImpactPercent: scenarioLower.includes("cobalt") ? 45.0 : 15.0,
            availabilityRisk: scenarioLower.includes("cobalt") ? "Critical" : "Medium",
          },
          {
            material: "Tungsten",
            costImpactPercent: 12.0,
            availabilityRisk: "Medium",
          },
        ],
      },
      recommendations: generateScenarioRecommendations(scenarioName, scenarioDescription),
      keyAssumptions: generateScenarioAssumptions(scenarioName, scenarioDescription),
      riskMitigation: generateRiskMitigation(scenarioName, scenarioDescription),
    }

    return NextResponse.json(simulationResult)
  } catch (error) {
    console.error("Simulation API error:", error)
    return NextResponse.json(
      {
        error: "Failed to run simulation",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
