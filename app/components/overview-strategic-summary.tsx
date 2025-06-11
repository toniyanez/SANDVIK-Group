"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card } from "@/components/ui/card"
import { Target, AlertTriangle, Rocket } from "lucide-react"

const summaryData = [
  {
    id: "goals",
    title: "Main Goals & Strategic Objectives",
    icon: Target,
    color: "text-blue-500",
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
    color: "text-yellow-500",
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
    color: "text-green-500",
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
  return (
    <div className="my-6">
      <Accordion type="multiple" defaultValue={["goals"]} className="w-full space-y-4">
        {summaryData.map((item) => (
          <AccordionItem value={item.id} key={item.id} className="border-none">
            <Card>
              <AccordionTrigger className="text-lg p-4 hover:no-underline bg-slate-100 dark:bg-slate-800/50 rounded-t-lg">
                <div className="flex items-center">
                  <item.icon className={`w-6 h-6 mr-3 ${item.color}`} />
                  <span>{item.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-6">
                <div className="space-y-4">
                  {item.content.map((section, index) => (
                    <div key={index}>
                      <h4 className="font-semibold text-md mb-2">{section.title}</h4>
                      <ul className="space-y-1 list-disc list-inside text-slate-600 dark:text-slate-400">
                        {section.points.map((point, pIndex) => (
                          <li key={pIndex}>{point}</li>
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
