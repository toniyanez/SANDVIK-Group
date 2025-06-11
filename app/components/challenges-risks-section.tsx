"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { AlertTriangle, ShieldAlert, Zap, TrendingDown, ShieldCheck } from "lucide-react"

interface RiskCategory {
  id: string
  title: string
  icon: React.ElementType
  description: string
  risks: RiskItemProps[]
}

interface RiskItemProps {
  id: string
  title: string
  description: string
  impact: "High" | "Medium" | "Low"
  likelihood: "High" | "Medium" | "Low"
  mitigationStatus: "In Place" | "In Progress" | "Planned"
  mitigationDetails?: string
}

const RiskItem: React.FC<RiskItemProps> = ({
  title,
  description,
  impact,
  likelihood,
  mitigationStatus,
  mitigationDetails,
}) => {
  const impactColor = {
    High: "bg-red-100 text-red-700 border-red-300",
    Medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
    Low: "bg-green-100 text-green-700 border-green-300",
  }
  const likelihoodColor = {
    High: "text-red-600",
    Medium: "text-yellow-600",
    Low: "text-green-600",
  }
  const mitigationColor = {
    "In Place": "bg-green-500 text-white",
    "In Progress": "bg-blue-500 text-white",
    Planned: "bg-slate-500 text-white",
  }

  return (
    <Card className="mb-4 shadow-sm hover:shadow-md transition-shadow bg-slate-50 dark:bg-slate-700/30">
      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-md font-semibold text-brand-dark dark:text-slate-200">{title}</CardTitle>
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${impactColor[impact]}`}>
            {impact} Impact
          </span>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-3">
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{description}</p>
        <div className="grid grid-cols-2 gap-x-4 text-xs mb-3">
          <div>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Likelihood: </span>
            <span className={likelihoodColor[likelihood]}>{likelihood}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Mitigation: </span>
            <span className={`px-2 py-0.5 text-xs rounded-full ${mitigationColor[mitigationStatus]}`}>
              {mitigationStatus}
            </span>
          </div>
        </div>
        {mitigationDetails && (
          <p className="text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-600/30 p-2 rounded-md">
            <span className="font-semibold">Details:</span> {mitigationDetails}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

const challengesAndRisksData: RiskCategory[] = [
  {
    id: "geopolitical",
    title: "Geopolitical & Macroeconomic Instability",
    icon: AlertTriangle,
    description: "Risks stemming from global political shifts, trade tensions, and economic volatility.",
    risks: [
      {
        id: "gr1",
        title: "Supply Chain Disruptions (Conflict Zones)",
        description: "Impact on raw material sourcing and logistics from regions experiencing conflict or instability.",
        impact: "High",
        likelihood: "Medium",
        mitigationStatus: "In Progress",
        mitigationDetails:
          "Actively diversifying supplier base for critical materials away from high-risk zones. Exploring alternative logistics corridors.",
      },
      {
        id: "gr2",
        title: "Trade Policy Changes & Tariffs",
        description:
          "Uncertainty in international trade policies leading to potential tariff impositions or trade barriers affecting cost and market access.",
        impact: "Medium",
        likelihood: "Medium",
        mitigationStatus: "Planned",
        mitigationDetails:
          "Scenario planning for various tariff impacts. Lobbying efforts through industry associations. Reviewing regional manufacturing footprint.",
      },
    ],
  },
  {
    id: "operational",
    title: "Operational & Technological Risks",
    icon: Zap,
    description: "Challenges related to manufacturing processes, technological adoption, and cybersecurity.",
    risks: [
      {
        id: "or1",
        title: "Cybersecurity Threats on OT/IT Systems",
        description:
          "Increased risk of cyberattacks targeting operational technology (OT) in manufacturing plants and integrated IT systems.",
        impact: "High",
        likelihood: "Medium",
        mitigationStatus: "In Place",
        mitigationDetails:
          "Multi-layered security architecture, regular penetration testing, and employee awareness programs. Incident response plan updated quarterly.",
      },
      {
        id: "or2",
        title: "Skilled Labor Shortages for Advanced Manufacturing",
        description:
          "Difficulty in recruiting and retaining talent with skills in automation, robotics, and data analytics for modern manufacturing.",
        impact: "Medium",
        likelihood: "High",
        mitigationStatus: "In Progress",
        mitigationDetails:
          "Partnerships with vocational schools and universities. Internal upskilling and reskilling programs. Competitive compensation and benefits.",
      },
    ],
  },
  {
    id: "market",
    title: "Market & Competitive Risks",
    icon: TrendingDown,
    description:
      "Risks arising from shifts in market demand, competitive pressures, and changing customer preferences.",
    risks: [
      {
        id: "mr1",
        title: "Rapid Technological Obsolescence",
        description:
          "Competitors introducing disruptive technologies that could render existing Sandvik products or solutions less competitive.",
        impact: "Medium",
        likelihood: "Medium",
        mitigationStatus: "In Progress",
        mitigationDetails:
          "Increased R&D investment in emerging technologies. Active monitoring of competitor landscape and patent filings. Agile product development cycles.",
      },
    ],
  },
  {
    id: "sustainability",
    title: "Sustainability & Regulatory Risks",
    icon: ShieldCheck,
    description: "Risks related to environmental regulations, social responsibility, and governance compliance.",
    risks: [
      {
        id: "sr1",
        title: "Stricter Carbon Emission Standards",
        description:
          "New or more stringent regulations on carbon emissions impacting manufacturing processes and potentially increasing operational costs.",
        impact: "Medium",
        likelihood: "High",
        mitigationStatus: "In Place",
        mitigationDetails:
          "Investment in energy-efficient technologies, renewable energy sourcing, and ongoing process optimization to reduce carbon footprint. Carbon offsetting for unavoidable emissions.",
      },
    ],
  },
]

export default function ChallengesAndRisksSection() {
  return (
    <div className="space-y-8 p-4 md:p-6 bg-slate-50 dark:bg-slate-900 rounded-lg">
      {/* Header Card - Ensure class name matches tailwind.config.ts */}
      <Card className="bg-brand-dark text-white shadow-xl">
        {" "}
        {/* Changed bg-brand-dark-blue to bg-brand-dark */}
        <CardHeader className="flex flex-row items-center space-x-4 p-6">
          <ShieldAlert className="h-10 w-10 text-brand-accent" />
          <div>
            <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight">
              Challenges & Risks Assessment
            </CardTitle>
            <CardDescription className="text-slate-300 text-sm">
              Identifying, analyzing, and mitigating key challenges and risks impacting Sandvik's strategic objectives
              and operational stability.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      <Accordion
        type="multiple"
        defaultValue={challengesAndRisksData.map((cat) => cat.id)}
        className="w-full space-y-6"
      >
        {challengesAndRisksData.map((category) => (
          <AccordionItem value={category.id} key={category.id} className="border-none">
            <Card className="shadow-lg bg-white dark:bg-slate-800/60">
              <AccordionTrigger className="bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 px-6 py-4 rounded-t-lg w-full">
                <div className="flex items-center text-lg font-semibold text-brand-dark dark:text-slate-100">
                  <category.icon className="h-6 w-6 mr-3 text-brand-accent" />
                  {category.title}
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-6 bg-white dark:bg-slate-800/30 rounded-b-lg">
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">{category.description}</p>
                <div className="space-y-4">
                  {category.risks.map((risk) => (
                    <RiskItem key={risk.id} {...risk} />
                  ))}
                </div>
              </AccordionContent>
            </Card>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
