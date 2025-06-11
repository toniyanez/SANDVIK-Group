"use client"

import { useState } from "react"
import Image from "next/image" // Added Image import
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Globe, Truck, AlertTriangle, Play } from "lucide-react"
import AuthGuard from "@/app/components/auth-guard"
import SandvikOverview from "@/app/components/sandvik-overview"
import ManufacturingFootprint from "@/app/components/manufacturing-footprint"
import CriticalMaterials from "@/app/components/critical-materials"
import SupplyChainLogistics from "@/app/components/supply-chain-logistics"
import SupplyChainSimulations from "@/app/components/supply-chain-simulations"

export default function StrategicCockpitPage() {
  // Renamed component
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen bg-gray-100">
        {/* Header Section */}
        <header className="p-4 border-b bg-slate-800 text-white shadow-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Image
                  src="/scc-logo-white.png"
                  alt="Supply Chain Companions Logo"
                  width={40} // Adjusted size for header
                  height={40}
                  className="mr-3"
                  priority
                />
                <div>
                  <h1 className="text-xl font-semibold">Supply Chain Companions</h1>
                  <h2 className="text-2xl font-bold">Strategic Cockpit</h2>
                </div>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-sm text-slate-300">
                Sandvik Group Supply Chain Cockpit: Global operations, manufacturing, materials, logistics, and
                AI-powered simulations.
              </p>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content Area */}
        <div className="flex-1 p-4 md:p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="max-w-7xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mb-6">
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
                  className="flex items-center gap-2 text-green-700 data-[state=active]:bg-green-100 data-[state=active]:text-green-700"
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
      </div>
    </AuthGuard>
  )
}
