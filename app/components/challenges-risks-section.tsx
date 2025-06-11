"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  AlertTriangle,
  ShieldCheck,
  CloudRain,
  Car,
  Plane,
  Landmark,
  Shuffle,
  FileText,
  Megaphone,
  Factory,
  Wrench,
  DollarSign,
  Zap,
  Globe,
  Recycle,
  Lightbulb,
  ShieldAlert,
} from "lucide-react"

interface RiskItem {
  id: string
  icon: React.ElementType // Icon for the individual item card
  title: string
  description: string
  category: "headwind" | "mitigation" | "opportunity"
}

const challengesAndRisksData: RiskItem[] = [
  {
    id: "macro-headwind",
    icon: CloudRain,
    title: "Uncertain Macro Environment",
    description: "Impacting cutting tools and infrastructure businesses due to generally low industrial activity.",
    category: "headwind",
  },
  {
    id: "automotive-decline",
    icon: Car,
    title: "Automotive Sector Downturn",
    description: 'Identified as the "most negative segment," experiencing a low-double-digit decline overall.',
    category: "headwind",
  },
  {
    id: "aerospace-inventory",
    icon: Plane,
    title: "Aerospace Order Slowdown (N. America)",
    description:
      "Flat to mid-single-digit decline in order intake as major customers work through existing inventories.",
    category: "headwind",
  },
  {
    id: "tariffs-trade-barriers",
    icon: Landmark,
    title: "Tariffs and Trade Barriers",
    description:
      'Limited direct margin impact currently, but primary concern is the "overall impact on the global economy" (indirect risk).',
    category: "headwind",
  },
  {
    id: "tariff-reroute-flows",
    icon: Shuffle,
    title: "Re-routing Trade Flows",
    description: "Mitigating flows between China and the US; re-routing goods to Canada/Mexico to bypass tariffs.",
    category: "mitigation",
  },
  {
    id: "tariff-clauses",
    icon: FileText,
    title: "Revisiting Tariff Clauses",
    description: "Updating commercial agreements to include or revise tariff clauses.",
    category: "mitigation",
  },
  {
    id: "tariff-customer-notify",
    icon: Megaphone,
    title: "Customer Notifications",
    description: "Actively notifying customers of potential upcoming tariff surcharges where applicable.",
    category: "mitigation",
  },
  {
    id: "tariff-rebalance-production",
    icon: Factory,
    title: "Re-balancing Production Capacity",
    description: "Shifting production between regions (e.g., Europe and the US) to optimize for tariffs.",
    category: "mitigation",
  },
  {
    id: "tariff-us-facilities",
    icon: Wrench,
    title: "Utilizing US Facilities",
    description:
      "Prepared to increase production in existing US facilities if tariff rates materially increase, avoiding greenfield investments.",
    category: "mitigation",
  },
  {
    id: "tariff-pricing-adjust",
    icon: DollarSign,
    title: "Pricing Adjustments",
    description: "Considering pricing adjustments where appropriate to offset tariff costs.",
    category: "mitigation",
  },
  {
    id: "operational-agility",
    icon: Zap,
    title: "Operational Agility",
    description:
      'Emphasizing "agile ways of acting" and leveraging "proven resilience on top and bottom line" to adapt to market shifts.',
    category: "mitigation",
  },
  {
    id: "global-footprint-advantage",
    icon: Globe,
    title: "Global Footprint Advantage",
    description:
      "Strong setup with manufacturing capabilities in all major regions, strong market positions, and customer relations enable effective management of geopolitical complexities.",
    category: "mitigation",
  },
  {
    id: "tungsten-opportunity",
    icon: Recycle,
    title: "Tungsten Raw Material Opportunity",
    description:
      "China's export restrictions on tungsten create demand for non-Chinese supply. Sandvik is a major provider and recycler, securing supply and offering a potential revenue upside.",
    category: "opportunity",
  },
]

const ChallengesAndRisksSection: React.FC = () => {
  const headwinds = challengesAndRisksData.filter((item) => item.category === "headwind")
  const mitigations = challengesAndRisksData.filter((item) => item.category === "mitigation")
  const opportunities = challengesAndRisksData.filter((item) => item.category === "opportunity")

  // Define categories for accordion items
  const accordionCategories = [
    {
      id: "headwinds",
      value: "item-1", // Value for accordion item
      title: "Macroeconomic & Geopolitical Headwinds",
      TriggerIcon: AlertTriangle, // Icon for the accordion trigger
      items: headwinds,
      itemIconAccentColor: "text-red-500 dark:text-red-400", // Accent for icons within item cards
    },
    {
      id: "mitigations",
      value: "item-2",
      title: "Mitigation Strategies & Resilience",
      TriggerIcon: ShieldCheck,
      items: mitigations,
      itemIconAccentColor: "text-green-500 dark:text-green-400",
    },
    {
      id: "opportunities",
      value: "item-3",
      title: "Emerging Opportunities",
      TriggerIcon: Lightbulb,
      items: opportunities,
      itemIconAccentColor: "text-yellow-500 dark:text-yellow-400",
    },
  ]

  return (
    <div className="p-4 md:p-6 bg-slate-100 dark:bg-neutral-900 min-h-full">
      {/* Header Card - Styled to match screenshot's dark header */}
      <Card className="mb-8 bg-slate-800 dark:bg-neutral-800 shadow-xl rounded-lg overflow-hidden">
        <CardHeader className="flex flex-row items-center space-x-4 p-6">
          <ShieldAlert className="h-12 w-12 text-white flex-shrink-0" />
          <div>
            <CardTitle className="text-2xl md:text-3xl font-bold text-white">
              Challenges, Risks & Opportunities
            </CardTitle>
            <CardDescription className="text-slate-300 dark:text-slate-400 text-sm md:text-base mt-1">
              Sandvik Group's proactive approach to navigating the evolving global landscape.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      {/* Accordion - First item open by default */}
      <Accordion
        type="multiple"
        defaultValue={[accordionCategories[0].value]} // Open first section by default
        className="w-full space-y-4"
      >
        {accordionCategories.map((category) =>
          category.items.length > 0 ? (
            <AccordionItem
              value={category.value}
              key={category.id}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm overflow-hidden"
            >
              <AccordionTrigger className="p-4 md:p-6 hover:no-underline text-lg md:text-xl font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center w-full">
                  <category.TriggerIcon className="w-6 h-6 mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span className="text-left flex-grow">{category.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 md:p-6 pt-2 md:pt-4 bg-slate-50 dark:bg-slate-800/30">
                <div className="space-y-4">
                  {category.items.map((item) => (
                    <Card
                      key={item.id}
                      className="shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600"
                    >
                      <CardHeader className="pb-2 md:pb-3">
                        <div className="flex items-center space-x-3">
                          <item.icon className={`w-5 h-5 ${category.itemIconAccentColor} flex-shrink-0`} />
                          <CardTitle className="text-base md:text-lg font-medium text-slate-700 dark:text-slate-200">
                            {item.title}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {item.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ) : null,
        )}
      </Accordion>
    </div>
  )
}

export default ChallengesAndRisksSection
