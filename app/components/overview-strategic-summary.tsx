"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Target,
  AlertTriangle,
  Rocket,
  Zap,
  Bot,
  Sprout,
  Globe,
  Recycle,
  HardHat,
  Cpu,
  Wrench,
  type LucideIcon,
  Lightbulb,
  ArrowRight,
  Factory,
  Repeat,
  TrendingUp,
} from "lucide-react"

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
    ],
  },
]

const opportunitiesData = {
  id: "opportunities",
  title: "Strategic Opportunities to Gain Market Share",
  icon: Rocket,
  color: "text-green-500",
  businessAreas: [
    {
      id: "smr",
      name: "Mining and Rock Solutions (SMR)",
      stats: "Share of Group Revenues: ~52% | Q1 2025 EBITA Margin: 20.8%",
      icon: HardHat,
      opportunities: [
        {
          title: "Electrification of Equipment",
          icon: Zap,
          details: {
            opportunity: "Mining companies are under pressure to decarbonize.",
            move: "Sandvik’s launch of electric rotary drill rigs with modular power packs fits global needs.",
            advantage: "Early mover advantage with a full product suite (battery-electric + AutoMine® integration).",
          },
        },
        {
          title: "Automation & Digital Mining",
          icon: Bot,
          details: {
            opportunity: "Automation adoption is accelerating for safety and efficiency.",
            move: "Expand AutoMine® ecosystem and remote diagnostics via 'My Sandvik' platform.",
            advantage: "Builds platform dependency and enhances aftermarket service stickiness.",
          },
        },
        {
          title: "Aftermarket Services Expansion",
          icon: Wrench,
          details: {
            opportunity: "Parts and Services represent high-margin, recurring revenue streams.",
            move: "Scale aftermarket presence in underserved mining regions like Africa and Latin America.",
            advantage: "Creates a competitive moat around service contracts and predictive maintenance.",
          },
        },
        {
          title: "Win Major Orders in Key Markets",
          icon: Globe,
          details: {
            opportunity: "In Q1 2025 alone, Sandvik landed SEK 977M in large orders.",
            move: "Capitalize on CapEx cycles in Australia, Canada, Chile.",
            advantage: "Brand credibility + end-to-end offering → wins mega-projects.",
          },
        },
        {
          title: "Recycling & Sustainability Messaging",
          icon: Recycle,
          details: {
            opportunity: "Mines are favoring vendors with sustainable credentials.",
            move: "Promote Sandvik’s role in tungsten recycling and low-emission solutions.",
            advantage: "ESG alignment = faster vendor onboarding + funding access.",
          },
        },
      ],
    },
    {
      id: "srp",
      name: "Rock Processing Solutions (SRP)",
      stats: "Share of Group Revenues: ~9% | Q1 2025 EBITA Margin: 15.1%",
      icon: Recycle, // Consider changing if too similar to SMR's recycle
      opportunities: [
        {
          title: "Electrified Crushing & Screening",
          icon: Zap,
          details: {
            opportunity: "Quarrying and infrastructure projects seek fuel savings and lower emissions.",
            move: "Introduce new electric cone crushers with mobile options to save energy.",
            advantage: "Taps into the global shift toward carbon neutrality mandates in construction.",
          },
        },
        {
          title: "Recycling & Demolition Expansion",
          icon: Recycle,
          details: {
            opportunity: "The circular economy and EU Green Deal boost demand for urban mining tools.",
            move: "Leverage the acquisition of OSA Demolition Equipment to enter this high-growth niche.",
            advantage: "First-mover advantage in demolition with high-margin aftermarket parts.",
          },
        },
        {
          title: "Growth in Emerging Markets",
          icon: Globe,
          details: {
            opportunity: "India, SE Asia, and Africa are making significant investments in infrastructure.",
            move: "Offer mobile, modular crushing units and flexible, localized service models.",
            advantage: "Captures markets where larger OEMs may lack agile, localized setups.",
          },
        },
        {
          title: "Integrated Solutions with SMR",
          icon: Wrench, // Or another icon representing integration
          details: {
            opportunity: "Many customers overlap with Mining segment.",
            move: "Offer bundled deals (e.g., drills + crushers + digital tools).",
            advantage: "One-stop shop increases customer retention and deal size.",
          },
        },
        {
          title: "Cost-Efficient Platforms",
          icon: TrendingUp, // Or an icon representing efficiency/cost
          details: {
            opportunity: "Competitors like Terex and WEIR are underperforming or fragmented.",
            move: "Double down on cost advantage + customer support.",
            advantage: "Margin tailwind gives pricing flexibility to grab volume.",
          },
        },
      ],
    },
    {
      id: "smm",
      name: "Machining Solutions (SMM)",
      stats: "Share of Group Revenues: ~39% | Q1 2025 EBITA Margin: 20.9%",
      icon: Cpu,
      opportunities: [
        {
          title: "CAM Software Ecosystem Expansion",
          icon: Bot,
          details: {
            opportunity: "CAM software is growing faster than traditional tooling.",
            move: "Continue acquiring CAM software resellers to create an integrated digital workflow.",
            advantage: "Combining hardware and software creates a sticky ecosystem, increasing customer retention.",
          },
        },
        {
          title: "Leverage Tungsten Supply Chain Edge",
          icon: Lightbulb,
          details: {
            opportunity: "Tungsten's tariff exemption and Chinese export restrictions create a market advantage.",
            move: "Utilize vertical integration and recycling capabilities for a reliable, cost-efficient supply.",
            advantage: "Ability to undercut competitors on price or preserve margins.",
          },
        },
        {
          title: "Focus on Aerospace & Medical Sectors",
          icon: Sprout,
          details: {
            opportunity: "These sectors have stable demand and require high-precision manufacturing.",
            move: "Offer high-tolerance tools and custom solutions tailored for these industries.",
            advantage: "Capture market share from generalist players with specialized, high-performance offerings.",
          },
        },
        {
          title: "Tooling-as-a-Service & Digital Twins",
          icon: Repeat,
          details: {
            opportunity:
              "Manufacturers are shifting from capex to opex. Offering TaaS with digital monitoring can build recurring revenue.",
            move: "Develop and promote TaaS models leveraging Sandvik's digital stack (AutoMine-style for machining).",
            advantage: "Builds recurring revenue streams and deeper customer integration.",
          },
        },
        {
          title: "Partner with Smart Factories",
          icon: Factory,
          details: {
            opportunity:
              "As Industry 4.0 adoption grows, Sandvik can embed its tools and software into automation platforms.",
            move: "Collaborate with automation integrators and OEMs to make Sandvik tools a standard.",
            advantage: "First-mover integration wins loyalty from system integrators and OEMs.",
          },
        },
        {
          title: "Capture Market from Slower Competitors",
          icon: TrendingUp,
          details: {
            opportunity: "Players like Kennametal and Mitsubishi are under margin and cost pressure.",
            move: "Leverage strong EBITA margin (20.9%) to price competitively or reinvest in growth initiatives.",
            advantage: "Financial strength allows for aggressive market share acquisition strategies.",
          },
        },
      ],
    },
  ],
}

const OpportunityDetail = ({
  label,
  text,
  icon: Icon,
}: {
  label: string
  text: string
  icon: LucideIcon
}) => (
  <div className="flex items-start space-x-3">
    <Icon className="w-5 h-5 mt-1 text-slate-500 dark:text-slate-400 flex-shrink-0" />
    <div>
      <p className="font-semibold text-slate-700 dark:text-slate-300">{label}</p>
      <p className="text-slate-600 dark:text-slate-400">{text}</p>
    </div>
  </div>
)

export default function OverviewStrategicSummary() {
  return (
    <div className="my-6">
      <Accordion type="multiple" defaultValue={["goals", "opportunities"]} className="w-full space-y-4">
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

        <AccordionItem value={opportunitiesData.id} key={opportunitiesData.id} className="border-none">
          <Card>
            <AccordionTrigger className="text-lg p-4 hover:no-underline bg-slate-100 dark:bg-slate-800/50 rounded-t-lg">
              <div className="flex items-center">
                <opportunitiesData.icon className={`w-6 h-6 mr-3 ${opportunitiesData.color}`} />
                <span>{opportunitiesData.title}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 md:p-6">
              <Tabs defaultValue="smr" className="w-full">
                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto sm:h-10">
                  {opportunitiesData.businessAreas.map((area) => (
                    <TabsTrigger
                      key={area.id}
                      value={area.id}
                      className="py-2 sm:py-0 data-[state=active]:bg-slate-700 data-[state=active]:text-white dark:data-[state=active]:bg-slate-200 dark:data-[state=active]:text-slate-900"
                    >
                      <area.icon className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{area.name}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
                {opportunitiesData.businessAreas.map((area) => (
                  <TabsContent key={area.id} value={area.id} className="mt-6">
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-1">{area.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{area.stats}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {area.opportunities.map((opp, index) => (
                        <Card key={index} className="bg-white dark:bg-slate-800/50 flex flex-col">
                          <CardHeader>
                            <CardTitle className="flex items-center text-md">
                              <opp.icon className="w-5 h-5 mr-2 text-brand-accent" />
                              {opp.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4 flex-grow">
                            <OpportunityDetail label="Opportunity" text={opp.details.opportunity} icon={Target} />
                            <OpportunityDetail label="Sandvik's Move" text={opp.details.move} icon={ArrowRight} />
                            <OpportunityDetail
                              label="Strategic Advantage"
                              text={opp.details.advantage}
                              icon={Lightbulb}
                            />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </AccordionContent>
          </Card>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
