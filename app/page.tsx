"use client"

import { useState, useEffect } from "react"
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
  const MAIN_HEADER_HEIGHT_PX = 68
  const SECONDARY_HEADER_HEIGHT_PX = 40
  const TOTAL_HEADER_HEIGHT_PX = MAIN_HEADER_HEIGHT_PX + SECONDARY_HEADER_HEIGHT_PX

  const [activeTab, setActiveTab] = useState("overview")
  const [secondaryHeaderText, setSecondaryHeaderText] = useState("")

  useEffect(() => {
    const currentNavItem = navItems.find((item) => item.id === activeTab)
    setSecondaryHeaderText(
      currentNavItem
        ? `${currentNavItem.label} View - Sandvik Group Supply Chain Data`
        : "Sandvik Group Supply Chain Data",
    )
  }, [activeTab])

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
      <div className="bg-brand-background">
        <div className="flex flex-col min-h-screen max-w-7xl mx-auto">
          {/* Main Header */}
          <header
            className="bg-brand-dark text-white sticky top-0 z-50 border-b border-brand-dark-secondary"
            style={{ height: `${MAIN_HEADER_HEIGHT_PX}px` }}
          >
            <div className="px-4 sm:px-6 lg:px-8 h-full">
              <div className="flex items-center justify-between h-full">
                <Image
                  src="/scc-logo-white.png"
                  alt="Supply Chain Companions Logo"
                  width={218}
                  height={48}
                  className="mr-4"
                  priority
                />
                <div className="flex-1 text-center">
                  <h2 className="text-2xl font-bold tracking-wider">Strategic Cockpit</h2>
                </div>
                <div className="w-[218px] mr-4" />
              </div>
            </div>
          </header>

          {/* Secondary Header */}
          <div
            className="bg-brand-dark-secondary text-slate-300 text-sm sticky z-40 border-b border-slate-700"
            style={{ top: `${MAIN_HEADER_HEIGHT_PX}px`, height: `${SECONDARY_HEADER_HEIGHT_PX}px` }}
          >
            <div className="px-4 sm:px-6 lg:px-8 flex items-center h-full">
              <p>{secondaryHeaderText}</p>
            </div>
          </div>

          {/* Main Content Area with Sidebar */}
          <div className="flex-1 flex">
            <aside
              className="w-64 bg-brand-dark text-slate-200 flex flex-col justify-between sticky z-30"
              style={{
                top: `${TOTAL_HEADER_HEIGHT_PX}px`,
                height: `calc(100vh - ${TOTAL_HEADER_HEIGHT_PX}px)`,
              }}
            >
              <div className="flex-grow px-4 pt-4">
                <TooltipProvider delayDuration={0}>
                  <nav className="space-y-2">
                    {navItems.map((item) => {
                      const isActive = activeTab === item.id
                      return (
                        <Tooltip key={item.id}>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              onClick={() => setActiveTab(item.id)}
                              className={`w-full justify-start items-center space-x-3 py-2.5 rounded-lg transition-all duration-200 ease-in-out
                                ${
                                  isActive
                                    ? "bg-brand-accent text-white font-semibold"
                                    : "text-slate-300 hover:bg-brand-dark-secondary hover:text-white"
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

              <div className="mt-auto p-4 border-t border-brand-dark-secondary">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start items-center space-x-3 py-2.5 rounded-lg hover:bg-brand-dark-secondary"
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
                  <DropdownMenuContent
                    side="top"
                    align="start"
                    className="w-56 bg-slate-900 text-white border-slate-700"
                  >
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

            <main className="flex-1 p-6 bg-brand-background overflow-y-auto">{renderContent()}</main>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
