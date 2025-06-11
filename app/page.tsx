"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Building2, Globe, Truck, AlertTriangle, Play, LogOut, User } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
        <header className="p-4 border-b bg-slate-800 text-white shadow-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
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
            <p className="text-sm text-slate-300 hidden md:block">Sandvik Group Supply Chain Cockpit</p>
          </div>
        </header>

        <div className="flex flex-1 max-w-7xl mx-auto w-full">
          {/* Branded Sidebar Navigation */}
          <aside className="w-64 bg-slate-800 text-slate-200 p-4 flex flex-col justify-between sticky top-[73px] h-[calc(100vh-73px)]">
            <div className="flex-grow">
              <TooltipProvider delayDuration={0}>
                <nav className="space-y-2">
                  {navItems.map((item) => {
                    const isActive = activeTab === item.id
                    const isSimulation = item.id === "simulations"

                    return (
                      <Tooltip key={item.id}>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full justify-start items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ease-in-out
                              ${
                                isActive
                                  ? isSimulation
                                    ? "bg-green-500/20 text-green-300 font-semibold"
                                    : "bg-slate-700 text-white font-semibold"
                                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
                              }
                            `}
                          >
                            <item.icon className="h-5 w-5" />
                            <span className="text-sm">{item.label}</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-slate-900 text-white border-slate-700">
                          <p>{item.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    )
                  })}
                </nav>
              </TooltipProvider>
            </div>

            {/* User Profile Section */}
            <div className="mt-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-slate-700"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?width=32&height=32" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="text-sm font-medium text-white">Admin User</p>
                      <p className="text-xs text-slate-400">admin@sandvik.com</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="start" className="w-56 bg-slate-900 text-white border-slate-700">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem className="focus:bg-slate-700">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => sessionStorage.removeItem("scc-auth")}
                    className="text-red-400 focus:bg-red-500/20 focus:text-red-300"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
