"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Globe, Truck, AlertTriangle, Play } from "lucide-react"
import AuthGuard from "@/app/components/auth-guard"
import SandvikOverview from "@/app/components/sandvik-overview"
import ManufacturingFootprint from "@/app/components/manufacturing-footprint"
import CriticalMaterials from "@/app/components/critical-materials"
import SupplyChainLogistics from "@/app/components/supply-chain-logistics"
import SupplyChainSimulations from "@/app/components/supply-chain-simulations"

export default function SandvikDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Sandvik Group Supply Chain Dashboard</h1>
            <p className="text-lg text-gray-600">
              Interactive analysis of global operations, manufacturing footprint, and supply chain logistics
            </p>
          </div>

          {/* Main Dashboard */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="manufacturing" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Manufacturing
              </TabsTrigger>
              <TabsTrigger value="materials" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Critical Materials
              </TabsTrigger>
              <TabsTrigger value="logistics" className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Logistics
              </TabsTrigger>
              <TabsTrigger
                value="simulations"
                className="flex items-center gap-2 text-green-700 data-[state=active]:bg-green-100"
              >
                <Play className="h-4 w-4" />
                Simulations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <SandvikOverview />
            </TabsContent>

            <TabsContent value="manufacturing">
              <ManufacturingFootprint />
            </TabsContent>

            <TabsContent value="materials">
              <CriticalMaterials />
            </TabsContent>

            <TabsContent value="logistics">
              <SupplyChainLogistics />
            </TabsContent>

            <TabsContent value="simulations">
              <SupplyChainSimulations />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthGuard>
  )
}
