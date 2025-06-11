"use client"

import type React from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card } from "@/components/ui/card"
import { Target, AlertTriangle, Rocket } from "lucide-react"

interface AccordionSectionItem {
  title: string
  points: string[]
  icon?: React.ElementType // Optional icon for sub-sections if needed later
}

interface AccordionSection {
  id: string
  title: string
  icon: React.ElementType
  iconColor: string
  defaultOpen?: boolean
  content: AccordionSectionItem[]
}

const summaryData: AccordionSection[] = [
  {
    id: "goals",
    title: "Main Goals & Strategic Objectives",
    icon: Target,
    iconColor: "text-blue-500",
    defaultOpen: true,
    content: [
      {
        title: "Drive Organic Growth",
        points: [
          "Through product innovation (e.g., new electric drill rigs, CAM software expansion)",
          "Focused on automation and electrification, especially in Mining and Machining",
        ],
      },
      {
        title: "Margin Expansion",
        points: [
          "Targeted cost control and restructuring savings",
          "Improved adjusted EBITA margins across all segments (e.g., 20.9% in Manufacturing)",
        ],
      },
      {
        title: "Strengthen Digital & Software Leadership",
        points: ["Continued acquisitions in CAM and metrology", "Expansion of AutoMine® and “My Sandvik” platforms"],
      },
      {
        title: "Strategic M&A Execution",
        points: [
          "9 acquisitions announced in the quarter",
          "Focused on software, electrification, and recycling/demolition sectors",
        ],
      },
      {
        title: "Geopolitical & Supply Chain Resilience",
        points: [
          "Re-routing flows (e.g., US-Canada-Mexico), revisiting tariff clauses",
          "Preparing for local production if tariffs rise materially",
        ],
      },
    ],
  },
  {
    id: "challenges",
    title: "Key Challenges",
    icon: AlertTriangle,
    iconColor: "text-red-500",
    content: [
      {
        title: "Macroeconomic Uncertainty",
        points: [
          "Weakness in cutting tools, automotive, infrastructure",
          "Especially impacted in Europe; manufacturing activity generally soft",
        ],
      },
      {
        title: "Tariffs & Global Trade Barriers",
        points: [
          "Tariff risks remain elevated (e.g., US-China flows, raw material dependencies)",
          "Currency volatility impacting financials (e.g., SEK -600M forecasted for Q2 FX impact)",
        ],
      },
      {
        title: "Volume Headwinds",
        points: [
          "Industrial volumes remain low in cutting tools and powders",
          "Organic revenue growth only +1% in Q1 2025",
        ],
      },
      {
        title: "Regional Slowdowns",
        points: [
          "Infrastructure particularly weak in Europe",
          "Slower growth in South America and mixed performance in Asia",
        ],
      },
    ],
  },
  {
    id: "opportunities",
    title: "Opportunities",
    icon: Rocket,
    iconColor: "text-green-500",
    content: [
      {
        title: "Strong Mining Momentum",
        points: ["Double-digit equipment growth", "Parts & services aftermarket growth (+5% excluding major orders)"],
      },
      {
        title: "Digitalization & Electrification",
        points: [
          "New electric cone crusher & rotary drill rigs",
          "Strong traction in AutoMine® and CAM software growth",
        ],
      },
      {
        title: "Recycling & Sustainability",
        points: [
          "Tungsten exemptions from tariffs + China restrictions open supply/demand advantages",
          "Acquisitions in demolition equipment to capture circular economy trends",
        ],
      },
      {
        title: "High ROCE & Cash Flow",
        points: ["Free operating cash flow of SEK 3.8 Bn", "ROCE improved to 15.4% (from 14.0%)"],
      },
    ],
  },
]

export default function OverviewStrategicSummary() {
  const defaultOpenValues = summaryData.filter((section) => section.defaultOpen).map((section) => section.id)

  return (
    <div className="space-y-6">
      <Accordion type="multiple" defaultValue={defaultOpenValues} className="w-full space-y-4">
        {summaryData.map((section) => (
          <AccordionItem key={section.id} value={section.id} className="border-none">
            <Card className="shadow-lg bg-white dark:bg-slate-800/60">
              <AccordionTrigger className="bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 px-6 py-4 rounded-t-lg text-left">
                <div className="flex items-center space-x-3">
                  <section.icon className={`w-6 h-6 ${section.iconColor}`} />
                  <h3 className="text-lg font-semibold text-brand-dark dark:text-slate-100">{section.title}</h3>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-6 bg-white dark:bg-slate-800/30 rounded-b-lg">
                <div className="space-y-4">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      <h4 className="text-md font-semibold text-brand-dark-secondary dark:text-slate-200 mb-1.5 flex items-center">
                        {/* You can add specific icons for sub-sections if needed here */}
                        {/* item.icon && <item.icon className="w-4 h-4 mr-2 text-slate-500" /> */}
                        {item.title}
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-300 pl-2">
                        {item.points.map((point, pointIndex) => (
                          <li key={pointIndex}>{point}</li>
                        ))}
                      </ul>
                    </div>
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
