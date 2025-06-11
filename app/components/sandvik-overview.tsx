"use client"

import { useState } from "react"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { DollarSign, Building, Users, Factory, FlaskConical, Warehouse, Briefcase } from "lucide-react"
import WorldMap from "./world-map"
import OverviewStrategicSummary from "./overview-strategic-summary"

const kpiData = [
  { title: "Total Revenue 2024", value: "SEK 122.9B", icon: DollarSign, change: "+3.2%", changeType: "increase" },
  { title: "Business Areas", value: "3", icon: Building, description: "SMR, SMMS, SRPS divisions" },
  { title: "Manufacturing Sites", value: "25+", icon: Factory, description: "Global production facilities" },
  { title: "Top Market", value: "US", icon: Users, description: "SEK 17.7B revenue (14.4%)" },
]

const facilityTypes = [
  { id: "manufacturing", label: "Manufacturing", icon: Factory, color: "bg-blue-500" },
  { id: "r&d", label: "R&D Center", icon: FlaskConical, color: "bg-green-500" },
  { id: "distribution", label: "Distribution", icon: Warehouse, color: "bg-purple-500" },
  { id: "headquarters", label: "Headquarters", icon: Briefcase, color: "bg-orange-500" },
  { id: "office", label: "Office", icon: Building, color: "bg-yellow-500" },
]

export default function SandvikOverview() {
  const [activeFilters, setActiveFilters] = useState<string[]>(facilityTypes.map((f) => f.id))

  const toggleFilter = (id: string) => {
    setActiveFilters((prev) => (prev.includes(id) ? prev.filter((filterId) => filterId !== id) : [...prev, id]))
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi) => (
          <Card key={kpi.title} className="transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">{kpi.title}</CardTitle>
              <kpi.icon className="h-5 w-5 text-slate-400" />
            </div>
            <CardContent>
              <div className="text-3xl font-bold text-brand-dark">{kpi.value}</div>
              <p className="text-xs text-slate-500">{kpi.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>{" "}
      {/* End of KPI Cards grid */}
      <div className="my-6">
        <OverviewStrategicSummary />
      </div>
      {/* Global Footprint Map */}
      <Card className="transition-all duration-300 hover:shadow-xl">
        <CardContent className="h-[500px] p-0">
          <WorldMap activeFilters={activeFilters} />
        </CardContent>
      </Card>
    </div>
  )
}
