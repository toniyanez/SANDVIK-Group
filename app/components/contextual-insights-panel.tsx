"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  Link,
  TrendingUp,
  ListChecks,
  Zap,
} from "lucide-react"
import { Truck, Play } from "lucide-react"

interface ContextualInsightsPanelProps {
  activeTab: string
}

interface InsightCardProps {
  icon: React.ElementType
  title: string
  description: string
  badgeText: string
  badgeVariant?: "default" | "secondary" | "destructive" | "outline"
  badgeColor?: string
}

const InsightCard: React.FC<InsightCardProps> = ({
  icon: Icon,
  title,
  description,
  badgeText,
  badgeVariant = "secondary",
  badgeColor,
}) => (
  <Card className="mb-4 transition-all duration-300 hover:shadow-md">
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <CardTitle className="text-base font-semibold text-brand-dark flex items-center">
          <Icon className="w-5 h-5 mr-2 text-brand-accent" />
          {title}
        </CardTitle>
        <Badge variant={badgeVariant} className={badgeColor}>
          {badgeText}
        </Badge>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-slate-600">{description}</p>
    </CardContent>
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
    className="w-full justify-start text-brand-accent hover:bg-blue-50 hover:text-brand-accent-hover mb-2"
    asChild
  >
    <a href={href}>
      <Icon className="w-4 h-4 mr-2" />
      {children}
    </a>
  </Button>
)

const insightsData: Record<string, React.ReactNode> = {
  overview: (
    <>
      <InsightCard
        icon={TrendingUp}
        title="Global Market Trends"
        description="Positive growth in SMRS segment driven by increased demand in APAC region. Monitor commodity prices for potential impact."
        badgeText="Market Update"
        badgeVariant="secondary"
      />
      <InsightCard
        icon={AlertTriangle}
        title="Geopolitical Alert: East Europe"
        description="Increased tensions may affect logistics routes. Contingency plans for alternative shipping being reviewed."
        badgeText="High Priority"
        badgeVariant="destructive"
      />
      <QuickLink href="#" icon={BarChart3}>
        View Full Q3 Report
      </QuickLink>
      <QuickLink href="#" icon={ListChecks}>
        Review Risk Register
      </QuickLink>
    </>
  ),
  manufacturing: (
    <>
      <InsightCard
        icon={Zap}
        title="Gimo Plant Optimization"
        description="Industry 4.0 initiatives at Gimo plant have increased output by 7% last quarter. Exploring similar upgrades for Mebane facility."
        badgeText="Efficiency Gain"
        badgeVariant="default"
        badgeColor="bg-green-500 text-white"
      />
      <InsightCard
        icon={Settings}
        title="Maintenance Schedule"
        description="Upcoming scheduled maintenance for Sandviken facility. Ensure production plans are adjusted."
        badgeText="Operational Note"
      />
      <QuickLink href="#" icon={FileText}>
        Detailed Plant Performance
      </QuickLink>
      <QuickLink href="#" icon={Link}>
        Access Maintenance Portal
      </QuickLink>
    </>
  ),
  materials: (
    <>
      <InsightCard
        icon={AlertTriangle}
        title="Cobalt Price Fluctuation"
        description="Recent market reports indicate a 5% increase in cobalt spot prices. Assess impact on Q4 cost projections."
        badgeText="Price Alert"
        badgeVariant="destructive"
      />
      <InsightCard
        icon={Lightbulb}
        title="Alternative Steel Supplier"
        description="Ongoing evaluation of a new specialty steel supplier in South America shows promising quality and cost benefits."
        badgeText="Sourcing Update"
      />
      <QuickLink href="#" icon={FileText}>
        Full Materials Report
      </QuickLink>
      <QuickLink href="#" icon={Link}>
        Supplier Due Diligence
      </QuickLink>
    </>
  ),
  logistics: (
    <>
      <InsightCard
        icon={Truck}
        title="Port Congestion: LA/Long Beach"
        description="Current wait times at LA/Long Beach ports are averaging 3 days. Consider rerouting shipments via Prince Rupert."
        badgeText="Logistics Alert"
        badgeVariant="default"
        badgeColor="bg-yellow-500 text-black"
      />
      <InsightCard
        icon={TrendingUp}
        title="Fuel Cost Analysis"
        description="Diesel prices have stabilized but remain 8% above last year's average. Hedging strategies are in place."
        badgeText="Cost Management"
      />
      <QuickLink href="#" icon={FileText}>
        Global Shipping Dashboard
      </QuickLink>
      <QuickLink href="#" icon={Link}>
        Tariff Impact Calculator
      </QuickLink>
    </>
  ),
  simulations: (
    <>
      <InsightCard
        icon={BarChart3}
        title="Recent Simulation: Trade War"
        description="Simulation of a 15% tariff increase on EU-US trade indicates a potential 3.5% margin impact. Mitigation strategies identified."
        badgeText="Simulation Result"
      />
      <InsightCard
        icon={Lightbulb}
        title="New Scenario Available"
        description="A new 'Green Transition Impact' scenario has been added by the analytics team. Ready for review and execution."
        badgeText="New Data"
      />
      <QuickLink href="#" icon={Play}>
        Run New Simulation
      </QuickLink>
      <QuickLink href="#" icon={ListChecks}>
        View Saved Scenarios
      </QuickLink>
    </>
  ),
}

export default function ContextualInsightsPanel({ activeTab }: ContextualInsightsPanelProps) {
  const content = insightsData[activeTab] || (
    <div className="text-center text-slate-500 py-10">
      <Info className="w-10 h-10 mx-auto mb-2 text-slate-400" />
      <p>No specific insights for this section yet.</p>
      <p className="text-xs">Select a different tab to see contextual information.</p>
    </div>
  )

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-brand-dark flex items-center">
          <Lightbulb className="w-5 h-5 mr-2 text-brand-accent" />
          Contextual Insights
        </h3>
        <p className="text-xs text-slate-500">Relevant information based on your current view.</p>
      </div>
      <ScrollArea className="flex-grow p-4">{content}</ScrollArea>
      <div className="p-4 border-t border-slate-200 mt-auto">
        <Button variant="outline" className="w-full">
          <Settings className="w-4 h-4 mr-2" />
          Customize Insights
        </Button>
      </div>
    </div>
  )
}
