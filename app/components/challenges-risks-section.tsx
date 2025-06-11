"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import {
  AlertTriangle,
  ShieldAlert,
  Zap,
  TrendingDown,
  ShieldCheck,
  CheckCircle,
  FileText,
  Database,
  Brain,
  Archive,
  Globe,
} from "lucide-react"

type OriginType = "AI" | "Documents" | "Web"

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
  confidenceScore?: number
  source?: string
  sourcesChecked?: number
  originTypes?: OriginType[]
}

const OriginBadge: React.FC<{ type: OriginType }> = ({ type }) => {
  let icon = null
  let text = ""
  let className = "font-normal text-xs"

  switch (type) {
    case "AI":
      icon = <Brain className="h-3 w-3 mr-1.5" />
      text = "AI Insights"
      className += " border-purple-300 text-purple-700 bg-purple-50"
      break
    case "Documents":
      icon = <Archive className="h-3 w-3 mr-1.5" />
      text = "Internal Docs"
      className += " border-slate-300 text-slate-700 bg-slate-100"
      break
    case "Web":
      icon = <Globe className="h-3 w-3 mr-1.5" />
      text = "External Intel"
      className += " border-teal-300 text-teal-700 bg-teal-50"
      break
    default:
      return null
  }

  return (
    <Badge variant="outline" className={className}>
      {icon}
      {text}
    </Badge>
  )
}

const RiskItem: React.FC<RiskItemProps> = ({
  title,
  description,
  impact,
  likelihood,
  mitigationStatus,
  mitigationDetails,
  confidenceScore,
  source,
  sourcesChecked,
  originTypes,
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
    <Card className="shadow-sm hover:shadow-md transition-shadow bg-slate-50 dark:bg-slate-700/30">
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
      <CardFooter className="flex flex-wrap gap-x-2 gap-y-1 pt-3 pb-3 px-4 border-t dark:border-slate-600/50">
        {confidenceScore && (
          <Badge variant="outline" className="font-normal text-xs border-blue-300 text-blue-700 bg-blue-50">
            <CheckCircle className="h-3 w-3 mr-1.5" />
            Confidence: {confidenceScore}%
          </Badge>
        )}
        {source && (
          <Badge variant="outline" className="font-normal text-xs border-slate-300 text-slate-700 bg-slate-100">
            <FileText className="h-3 w-3 mr-1.5" />
            Source: {source}
          </Badge>
        )}
        {sourcesChecked && (
          <Badge variant="outline" className="font-normal text-xs border-slate-300 text-slate-700 bg-slate-100">
            <Database className="h-3 w-3 mr-1.5" />
            {sourcesChecked} Sources
          </Badge>
        )}
        {originTypes && originTypes.map((type) => <OriginBadge key={type} type={type} />)}
      </CardFooter>
    </Card>
  )
}

const challengesAndRisksData: RiskCategory[] = [
  {
    id: "geopolitical",
    title: "Geopolitical & Macroeconomic Headwinds",
    icon: AlertTriangle,
    description:
      "Risks stemming from the broader macroeconomic and geopolitical landscape, impacting global trade, economic activity, and supply chain stability.",
    risks: [
      {
        id: "gr1",
        title: "Impact of Tariffs and Trade Barriers",
        description:
          "Escalated global tariff announcements introduce complexity. The primary concern is the indirect 'overall impact on the global economy' rather than a direct margin impact at current tariff rates, which could lead to a global slowdown affecting demand.",
        impact: "High",
        likelihood: "Medium",
        mitigationStatus: "In Place",
        mitigationDetails:
          "Multi-faceted strategy including re-routing trade flows (e.g., to Canada/Mexico to bypass China-US tariffs), revisiting tariff clauses in commercial agreements, and re-balancing production capacity between regions like Europe and the US.",
        confidenceScore: 98,
        source: "Q1 2025 Analyst Report",
        sourcesChecked: 1,
        originTypes: ["Documents"],
      },
      {
        id: "gr2",
        title: "Tungsten Raw Material Supply Chain",
        description:
          "China's export restrictions on tungsten raw material have increased demand for non-Chinese supply. This presents both a risk of supply disruption for the industry and a strategic opportunity for Sandvik.",
        impact: "Medium",
        likelihood: "High",
        mitigationStatus: "In Place",
        mitigationDetails:
          "Leveraging position as a major global provider and one of only two companies capable of substantially recycling tungsten scrap into new powder. This vertical integration secures critical supply and offers a potential revenue upside.",
        confidenceScore: 95,
        source: "Q1 2025 Analyst Report",
        sourcesChecked: 1,
        originTypes: ["Documents"],
      },
    ],
  },
  {
    id: "market",
    title: "Market & Sector-Specific Challenges",
    icon: TrendingDown,
    description:
      "Risks related to subdued activity in key end-markets and specific customer segments, impacting order intake for certain business areas.",
    risks: [
      {
        id: "mr1",
        title: "Weakness in Automotive Sector",
        description:
          "The automotive sector was identified as the 'most negative segment in the quarter,' experiencing a low-double-digit decline overall. This directly challenges the Sandvik Manufacturing and Machining Solutions (SMM) segment.",
        impact: "Medium",
        likelihood: "High",
        mitigationStatus: "In Progress",
        mitigationDetails:
          "Focus on cost control and operational efficiency within SMM to maintain margin resilience despite lower volumes. Growth in the software business within SMM helps to partially offset declines in other areas.",
        confidenceScore: 98,
        source: "Q1 2025 Analyst Report",
        sourcesChecked: 1,
        originTypes: ["Documents"],
      },
      {
        id: "mr2",
        title: "Aerospace Customer Inventory De-stocking",
        description:
          "The aerospace sector in North America, while showing positive underlying sentiment, experienced flat to mid-single-digit declines in order intake due to major customers working through existing inventories, leading to a slow pickup in new orders.",
        impact: "Low",
        likelihood: "High",
        mitigationStatus: "Planned",
        mitigationDetails:
          "Monitoring customer inventory levels and preparing for an expected pickup in new orders as de-stocking concludes. Maintaining strong customer relations to capture demand when it returns.",
        confidenceScore: 95,
        source: "Q1 2025 Analyst Report",
        sourcesChecked: 1,
        originTypes: ["Documents"],
      },
    ],
  },
  {
    id: "operational",
    title: "Operational & Capacity Management",
    icon: Zap,
    description:
      "Risks related to managing production capacity, operational absorption, and the ramp-up of new facilities in a dynamic demand environment.",
    risks: [
      {
        id: "op1",
        title: "Under-absorption in SMM & New China Factory",
        description:
          "Recent volume declines in the SMM segment have led to some under-absorption. Additionally, the new Suzhou Ahno factory in China is ramping up volumes throughout 2025, which creates a temporary financial drag.",
        impact: "Low",
        likelihood: "High",
        mitigationStatus: "In Place",
        mitigationDetails:
          "The factory's impact is managed as part of the structural dilution. SMM's margin resilience is enhanced through significant cost control, a higher share of variable costs, and growth in the software business.",
        confidenceScore: 95,
        source: "Q1 2025 Analyst Report",
        sourcesChecked: 1,
        originTypes: ["Documents"],
      },
    ],
  },
  {
    id: "sustainability",
    title: "Sustainability & Innovation Adoption",
    icon: ShieldCheck,
    description:
      "Risks and opportunities associated with the strategic push into sustainability, electrification, and the adoption of new technologies.",
    risks: [
      {
        id: "sus1",
        title: "Execution Risk on Electrification Strategy",
        description:
          "While a strategic advantage, the launch of new electric products (e.g., rotary drill rigs, cone crushers) carries execution risk related to market adoption, supply chain for new components (batteries, etc.), and performance validation.",
        impact: "Medium",
        likelihood: "Medium",
        mitigationStatus: "In Progress",
        mitigationDetails:
          "Phased product launches with key customers. Leveraging digital solutions like AutoMine® and My Sandvik to enhance the value proposition of new electric equipment and ensure seamless integration into customer operations.",
        confidenceScore: 90,
        source: "Q1 2025 Analyst Report",
        sourcesChecked: 1,
        originTypes: ["Documents"],
      },
    ],
  },
]

export default function ChallengesAndRisksSection() {
  return (
    <div className="space-y-8 p-4 md:p-6 bg-slate-50 dark:bg-slate-900 rounded-lg">
      <Card className="bg-brand-dark text-white shadow-xl">
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
