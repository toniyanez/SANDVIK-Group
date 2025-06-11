"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Info,
  AlertTriangle,
  BarChart3,
  FileText,
  Lightbulb,
  Settings,
  LinkIcon,
  TrendingUp,
  ListChecks,
  Zap,
  Truck,
  Play,
  Database,
  ShieldCheck,
  Brain,
  Sparkles,
} from "lucide-react"

interface ContextualInsightsPanelProps {
  activeTab: string
}

interface InsightCardProps {
  icon: React.ElementType
  title: string
  description: string
  badgeText: string
  badgeVariant?: "default" | "secondary" | "destructive" | "outline"
  badgeClassName?: string // For custom badge styling if needed
  source: string
  confidence: number | string // Can be a percentage or "AI Generated"
  isAI?: boolean
  actionLink?: {
    href: string
    text: string
    icon: React.ElementType
  }
}

const InsightCard: React.FC<InsightCardProps> = ({
  icon: Icon,
  title,
  description,
  badgeText,
  badgeVariant = "secondary",
  badgeClassName,
  source,
  confidence,
  isAI = false,
  actionLink,
}) => (
  <Card className="mb-4 transition-all duration-300 hover:shadow-lg border border-slate-200 bg-white">
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <Icon className="w-6 h-6 mr-3 text-brand-accent flex-shrink-0" />
          <CardTitle className="text-base font-semibold text-brand-dark leading-tight">{title}</CardTitle>
        </div>
        <Badge variant={badgeVariant} className={`ml-2 flex-shrink-0 ${badgeClassName}`}>
          {badgeText}
        </Badge>
      </div>
    </CardHeader>
    <CardContent className="pb-4">
      <p className="text-sm text-slate-600 mb-3">{description}</p>
      <div className="text-xs text-slate-500 space-y-1.5 pt-3 border-t border-slate-100">
        <div className="flex items-center">
          {isAI ? (
            <Brain className="w-3.5 h-3.5 mr-1.5 text-sky-500" />
          ) : (
            <Database className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
          )}
          <span>Source: {source}</span>
          {isAI && <Sparkles className="w-3.5 h-3.5 ml-1 text-amber-500" />}
        </div>
        <div className="flex items-center">
          <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-green-500" />
          <span>Confidence: {typeof confidence === "number" ? `${confidence}%` : confidence}</span>
        </div>
      </div>
    </CardContent>
    {actionLink && (
      <CardFooter className="pt-0 pb-3">
        <Button variant="link" size="sm" className="text-brand-accent p-0 h-auto" asChild>
          <a href={actionLink.href}>
            <actionLink.icon className="w-3.5 h-3.5 mr-1.5" />
            {actionLink.text}
          </a>
        </Button>
      </CardFooter>
    )}
  </Card>
)

interface QuickLinkProps {
  href: string
  icon: React.ElementType
  children: React.ReactNode
}

const QuickLink: React.FC<QuickLinkProps> = ({ href, icon: Icon, children }) => (
  <Button
    variant="ghost"
    className="w-full justify-start text-slate-600 hover:bg-slate-100 hover:text-brand-accent mb-1.5 py-2 px-3"
    asChild
  >
    <a href={href}>
      <Icon className="w-4 h-4 mr-2.5" />
      <span className="text-sm">{children}</span>
    </a>
  </Button>
)

const insightsData: Record<string, React.ReactNode> = {
  overview: (
    <>
      <InsightCard
        icon={TrendingUp}
        title="Global Market Performance"
        description="SMRS segment shows robust 7% YoY growth in APAC, driven by infrastructure projects. SMMS faces slight headwinds in Europe due to energy costs."
        badgeText="Q3 Update"
        badgeVariant="secondary"
        source="Internal Sales Data, MarketWatch Q3 Report"
        confidence={90}
      />
      <InsightCard
        icon={AlertTriangle}
        title="Geopolitical Risk: Red Sea"
        description="Continued Red Sea disruptions impacting shipping times by an average of 12 days for EU-Asia routes. Contingency routing via Cape of Good Hope activated for critical shipments."
        badgeText="High Impact"
        badgeVariant="destructive"
        source="Global Logistics Monitoring, AI Risk Feed"
        confidence={95}
        isAI={true}
        actionLink={{ href: "#", text: "View Mitigation Plan", icon: FileText }}
      />
      <h4 className="text-sm font-semibold text-slate-500 mt-6 mb-2 px-1">Quick Actions</h4>
      <QuickLink href="#" icon={BarChart3}>
        Full Q3 Performance Report
      </QuickLink>
      <QuickLink href="#" icon={ListChecks}>
        Review Global Risk Register
      </QuickLink>
    </>
  ),
  manufacturing: (
    <>
      <InsightCard
        icon={Zap}
        title="Gimo Plant: Output Surge"
        description="Industry 4.0 automation at Gimo resulted in a 9% output increase for carbide inserts in Q3, exceeding targets by 2%."
        badgeText="Efficiency Gain"
        badgeVariant="default"
        badgeClassName="bg-green-500 text-white"
        source="Gimo Plant SCADA System"
        confidence={98}
      />
      <InsightCard
        icon={Settings}
        title="Mebane Facility Upgrade"
        description="Phase 1 of Mebane, NC facility upgrade (robotics integration) scheduled for Q4. Potential short-term output dip of 3% expected during transition."
        badgeText="Operational Note"
        source="Project Management Office"
        confidence="Confirmed"
      />
      <h4 className="text-sm font-semibold text-slate-500 mt-6 mb-2 px-1">Quick Actions</h4>
      <QuickLink href="#" icon={FileText}>
        Plant Performance Dashboards
      </QuickLink>
      <QuickLink href="#" icon={LinkIcon}>
        Access Maintenance Schedules
      </QuickLink>
    </>
  ),
  materials: (
    <>
      <InsightCard
        icon={AlertTriangle}
        title="Cobalt Price Volatility"
        description="Cobalt spot prices increased by 6.5% in the last 30 days due to DRC supply concerns. Current hedging strategy covers 70% of Q4 needs."
        badgeText="Price Alert"
        badgeVariant="destructive"
        source="LME, S&P Global Commodity Insights"
        confidence={88}
      />
      <InsightCard
        icon={Brain}
        title="AI: Tungsten Recycling Yield"
        description="AI analysis suggests new sorting algorithm could improve tungsten recycling yield by up to 4% at WBH Austria. Pilot program recommended."
        badgeText="AI Recommendation"
        badgeVariant="default"
        badgeClassName="bg-sky-500 text-white"
        source="Internal AI R&D (Project Phoenix)"
        confidence="AI Generated (85% potential)"
        isAI={true}
        actionLink={{ href: "#", text: "View AI Report", icon: FileText }}
      />
      <h4 className="text-sm font-semibold text-slate-500 mt-6 mb-2 px-1">Quick Actions</h4>
      <QuickLink href="#" icon={FileText}>
        Critical Materials Dashboard
      </QuickLink>
      <QuickLink href="#" icon={LinkIcon}>
        Supplier Risk Assessments
      </QuickLink>
    </>
  ),
  logistics: (
    <>
      <InsightCard
        icon={Truck}
        title="Port Congestion: Rotterdam"
        description="Average dwell time at Rotterdam port increased to 4.5 days. AI model suggests rerouting 15% of non-critical EU shipments via Antwerp or Hamburg."
        badgeText="Logistics AI Alert"
        badgeVariant="default"
        badgeClassName="bg-amber-500 text-black"
        source="AI Logistics Optimizer v1.2"
        confidence="AI Generated (90% accuracy)"
        isAI={true}
      />
      <InsightCard
        icon={TrendingUp}
        title="Air Freight Capacity"
        description="Air freight capacity on trans-Atlantic routes has increased by 8%, leading to a slight reduction in spot rates. Opportunity for urgent SMMS tool shipments."
        badgeText="Capacity Update"
        source="IATA, Freightos Index"
        confidence={80}
      />
      <h4 className="text-sm font-semibold text-slate-500 mt-6 mb-2 px-1">Quick Actions</h4>
      <QuickLink href="#" icon={FileText}>
        Global Shipping Monitor
      </QuickLink>
      <QuickLink href="#" icon={LinkIcon}>
        Tariff & Duty Calculator
      </QuickLink>
    </>
  ),
  simulations: (
    <>
      <InsightCard
        icon={BarChart3}
        title="Simulation: EU Carbon Tax"
        description="Simulation of a €50/ton EU carbon tax on imports shows a potential 2.1% increase in landed costs for Asian-sourced components. Regionalization strategy mitigates 60% of this."
        badgeText="Simulation Complete"
        source="Supply Chain Modeler Pro"
        confidence="Modelled (92% fit)"
      />
      <InsightCard
        icon={Lightbulb}
        title="New Scenario: Lithium Shortage"
        description="A 'Global Lithium Shortage' scenario impacting EV battery production (indirectly SMRS demand) is now available for simulation."
        badgeText="Scenario Added"
        source="Analytics Team"
        confidence="Ready"
        actionLink={{ href: "#", text: "Configure Scenario", icon: Play }}
      />
      <h4 className="text-sm font-semibold text-slate-500 mt-6 mb-2 px-1">Quick Actions</h4>
      <QuickLink href="#" icon={Play}>
        Run New Simulation
      </QuickLink>
      <QuickLink href="#" icon={ListChecks}>
        View Scenario Library
      </QuickLink>
    </>
  ),
}

export default function ContextualInsightsPanel({ activeTab }: ContextualInsightsPanelProps) {
  const content = insightsData[activeTab] || (
    <div className="text-center text-slate-500 py-16 flex flex-col items-center h-full justify-center">
      <Info className="w-12 h-12 mx-auto mb-4 text-slate-300" />
      <h4 className="font-semibold text-slate-600">No Specific Insights</h4>
      <p className="text-sm">Select a different tab or interact with the main content to see contextual information.</p>
    </div>
  )

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="p-4 border-b border-slate-200 bg-white">
        <h3 className="text-lg font-semibold text-brand-dark flex items-center">
          <Lightbulb className="w-5 h-5 mr-2.5 text-brand-accent" />
          Contextual Insights
        </h3>
        <p className="text-xs text-slate-500 ml-[30px]">Relevant information based on your current view.</p>
      </div>
      <ScrollArea className="flex-grow p-4">{content}</ScrollArea>
      <div className="p-4 border-t border-slate-200 mt-auto bg-white">
        <Button variant="outline" className="w-full text-slate-700 hover:bg-slate-100">
          <Settings className="w-4 h-4 mr-2" />
          Customize Insights Feed
        </Button>
      </div>
    </div>
  )
}
