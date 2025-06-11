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
  // Near the top of the StrategicCockpitPage component

  // 1. Define header height for consistent use
  const HEADER_HEIGHT_PX = 68
  const HEADER_BORDER_PX = 1
  const STICKY_TOP_OFFSET_PX = HEADER_HEIGHT_PX + HEADER_BORDER_PX

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
        <header className="bg-slate-800 text-white shadow-md sticky top-0 z-40 border-b">
          {/* This div centers the header content and provides consistent horizontal padding */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`flex items-center justify-between h-[${HEADER_HEIGHT_PX}px]`}>
              <Image
                src="/scc-logo-white.png"
                alt="Supply Chain Companions Logo"
                width={218}
                height={48}
                className="mr-4"
                priority
              />
              <div className="flex-1 text-center">
                <h2 className="text-2xl font-bold">Strategic Cockpit</h2>
              </div>
              <p className="text-sm text-slate-300 hidden md:block">Sandvik Group Supply Chain Cockpit</p>
            </div>
          </div>
        </header>

        <div className={`flex-1 max-w-7xl mx-auto w-full flex`}>
          {/* Branded Sidebar Navigation */}
          <aside
            className={`w-64 bg-slate-800 text-slate-200 flex flex-col justify-between sticky top-[${STICKY_TOP_OFFSET_PX}px] h-[calc(100vh-${STICKY_TOP_OFFSET_PX}px)]`}
          >
            <div className="flex-grow px-4 pt-4">
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
                            className={`w-full justify-start items-center space-x-3 py-2.5 rounded-lg transition-all duration-200 ease-in-out
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
            <div className="mt-auto p-4">
              {" "}
              {/* mt-auto pushes it to the bottom of the flex container */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start items-center space-x-3 py-2.5 rounded-lg hover:bg-slate-700"
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
