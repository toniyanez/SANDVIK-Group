"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Building2, Globe, Truck, AlertTriangle, Play } from "lucide-react"
import AuthGuard from "@/app/components/auth-guard"
import SandvikOverview from "@/app/components/sandvik-overview"
import ManufacturingFootprint from "@/app/components/manufacturing-footprint"
import CriticalMaterials from "@/app/components/critical-materials"
import SupplyChainLogistics from "@/app/components/supply-chain-logistics"
import SupplyChainSimulations from "@/app/components/supply-chain-simulations"

const navItems = [
  { id: "overview", label: "Overview", icon: Globe },
  { id: "manufacturing", label: "Manufacturing", icon: Building2 },
  { id: "materials", label: "Critical Materials", icon: AlertTriangle },
  { id: "logistics", label: "Logistics", icon: Truck },
  { id: "simulations", label: "Simulations", icon: Play },
]

export default function StrategicCockpitPage() {
  const [activeTab, setActiveTab] = useState("overview")

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <SandvikOverview />
      case "manufacturing":
        return <ManufacturingFootprint />
      case "materials":
        return <CriticalMaterials />
      case "logistics":
        return <SupplyChainLogistics />
      case "simulations":
        return <SupplyChainSimulations />
      default:
        return <SandvikOverview />
    }
  }

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
                  width={40}
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

        <div className="flex flex-1 max-w-7xl mx-auto w-full">
          {/* Sidebar Navigation */}
          <aside className="w-60 bg-white p-4 border-r border-gray-200 shadow-sm sticky top-[calc(5.5rem+1px)] h-[calc(100vh-5.5rem-1px)] overflow-y-auto">
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const isActive = activeTab === item.id
                let buttonClasses =
                  "w-full justify-start flex items-center space-x-2 rtl:space-x-reverse px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out"
                let iconClasses = `h-5 w-5 transition-colors duration-150 ease-in-out`

                if (isActive) {
                  if (item.id === "simulations") {
                    buttonClasses += " bg-green-100 text-green-700 hover:bg-green-200 font-semibold"
                    iconClasses += " text-green-600"
                  } else {
                    buttonClasses += " bg-blue-100 text-blue-700 hover:bg-blue-200 font-semibold"
                    iconClasses += " text-blue-600"
                  }
                } else {
                  buttonClasses += " text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                  iconClasses += " text-gray-400 group-hover:text-gray-500"
                }

                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => setActiveTab(item.id)}
                    className={`${buttonClasses} group`}
                  >
                    <item.icon className={iconClasses} />
                    <span>{item.label}</span>
                  </Button>
                )
              })}
            </nav>
          </aside>
          {/* Main Content Area */}
          <main className="flex-1 p-6 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-y-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
