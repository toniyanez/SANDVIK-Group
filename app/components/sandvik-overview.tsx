"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Building2, Factory, Globe } from "lucide-react"
import WorldMap from "./world-map"
import OverviewStrategicSummary from "./overview-strategic-summary"

const kpiData = [
  {
    title: "Total Revenue 2024",
    value: "SEK 122.9B",
    icon: DollarSign,
    bgColor: "bg-blue-100",
    textColor: "text-blue-600",
  },
  {
    title: "Business Areas",
    value: "3",
    description: "SMR, SMMS, SRPS divisions",
    icon: Building2,
    bgColor: "bg-green-100",
    textColor: "text-green-600",
  },
  {
    title: "Manufacturing Sites",
    value: "25+",
    description: "Global production facilities",
    icon: Factory,
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-600",
  },
  {
    title: "Top Market",
    value: "US",
    description: "SEK 17.7B revenue (14.4%)",
    icon: Globe,
    bgColor: "bg-indigo-100",
    textColor: "text-indigo-600",
  },
]

export default function SandvikOverview() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className={`h-5 w-5 ${kpi.textColor}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              {kpi.description && <p className="text-xs text-muted-foreground">{kpi.description}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      <OverviewStrategicSummary />

      <Card>
        <CardHeader>
          <CardTitle>Global Footprint</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Sandvik's global presence across manufacturing, R&D, distribution, and offices
          </p>
          <div className="h-[450px] w-full">
            <WorldMap />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
