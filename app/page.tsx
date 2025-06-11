"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Building2,
  Globe,
  Truck,
  AlertTriangle,
  Play,
  LogOut,
  User,
  Bell,
  HelpCircle,
  Settings,
  DollarSign,
  ChevronDown,
  ChevronRight,
} from "lucide-react" // Added DollarSign, ChevronDown, ChevronRight
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
import ContextualInsightsPanel from "@/app/components/contextual-insights-panel"
import FinancialsSection from "@/app/components/financials-section" // New import

// Update navItems structure
interface NavSubItem {
  id: string
  label: string
  icon: React.ElementType
  parentId: string
}

interface NavItem {
  id: string
  label: string
  icon: React.ElementType
  subItems?: NavSubItem[]
}

const navItems: NavItem[] = [
  {
    id: "overview",
    label: "Overview",
    icon: Globe,
    subItems: [{ id: "financials", label: "Financials", icon: DollarSign, parentId: "overview" }],
  },
  { id: "manufacturing", label: "Manufacturing", icon: Building2 },
  { id: "materials", label: "Critical Materials", icon: AlertTriangle },
  { id: "logistics", label: "Logistics", icon: Truck },
  { id: "simulations", label: "Simulations", icon: Play },
]

export default function StrategicCockpitPage() {
  const MAIN_HEADER_HEIGHT_PX = 68
  const SECONDARY_HEADER_HEIGHT_PX = 40
  const TOTAL_HEADER_HEIGHT_PX = MAIN_HEADER_HEIGHT_PX + SECONDARY_HEADER_HEIGHT_PX
  const RIGHT_PANEL_WIDTH_PX = 288 // 72 * 4 (w-72)

  // Replace `activeTab` state with `activeView` and `expandedMainTab`
  // const [activeTab, setActiveTab] = useState("overview")
  const [activeView, setActiveView] = useState("overview")
  const [expandedMainTab, setExpandedMainTab] = useState<string | null>("overview") // Keep overview expanded by default

  const [secondaryHeaderText, setSecondaryHeaderText] = useState("")

  // Update useEffect for secondaryHeaderText
  useEffect(() => {
    let headerText = "Sandvik Group Supply Chain Data"
    const currentMainItem = navItems.find(
      (item) =>
        item.id === (activeView === "financials" ? "overview" : activeView) ||
        item.subItems?.some((sub) => sub.id === activeView),
    )

    if (currentMainItem) {
      if (currentMainItem.subItems?.some((sub) => sub.id === activeView)) {
        const currentSubItem = currentMainItem.subItems.find((sub) => sub.id === activeView)
        if (currentSubItem) {
          headerText = `${currentMainItem.label} > ${currentSubItem.label} View - Sandvik Group Supply Chain Data`
        }
      } else {
        headerText = `${currentMainItem.label} View - Sandvik Group Supply Chain Data`
      }
    }
    setSecondaryHeaderText(headerText)
  }, [activeView])

  // Update renderContent function
  const renderContent = () => {
    switch (activeView) {
      case "overview":
        return <SandvikOverview />
      case "financials":
        return <FinancialsSection /> // New case
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
        <div className="flex flex-col min-h-screen max-w-full">
          {" "}
          {/* Changed max-w-7xl to max-w-full */}
          {/* Main Header */}
          <header
            className="bg-brand-dark text-white sticky top-0 z-50 border-b border-brand-dark-secondary"
            style={{ height: `${MAIN_HEADER_HEIGHT_PX}px` }}
          >
            <div className="px-4 sm:px-6 lg:px-8 h-full">
              <div className="flex items-center justify-between h-full">
                <div className="flex items-center">
                  <Image
                    src="/scc-logo-white.png"
                    alt="Supply Chain Companions Logo"
                    width={160}
                    height={40}
                    className="mr-4"
                    priority
                  />
                </div>
                <div className="flex-1 text-center">
                  <h2 className="text-2xl font-bold tracking-wider">Strategic Cockpit</h2>
                </div>
                <div className="flex items-center space-x-2">
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-slate-300 hover:text-white hover:bg-brand-dark-secondary"
                        >
                          <Bell className="h-5 w-5" />
                          <span className="sr-only">Notifications</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="bg-slate-900 text-white border-slate-700">
                        Notifications
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-slate-300 hover:text-white hover:bg-brand-dark-secondary"
                        >
                          <HelpCircle className="h-5 w-5" />
                          <span className="sr-only">Help</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="bg-slate-900 text-white border-slate-700">
                        Help & Support
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {/* User Profile Dropdown - kept from previous version */}
                  <div className="ml-2">
                    {" "}
                    {/* Add some margin to separate from icons */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="flex items-center space-x-2 py-2 px-3 rounded-lg hover:bg-brand-dark-secondary"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg?width=32&height=32" />
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                          <div className="text-left hidden md:block">
                            <p className="text-sm font-medium text-white">Admin User</p>
                          </div>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        side="bottom"
                        align="end"
                        className="w-56 bg-slate-900 text-white border-slate-700"
                      >
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-slate-700" />
                        <DropdownMenuItem className="focus:bg-slate-700">
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-slate-700">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-700" />
                        <DropdownMenuItem
                          onClick={() => {
                            sessionStorage.removeItem("scc-auth")
                            window.location.reload() // Force reload to trigger AuthGuard
                          }}
                          className="text-red-400 focus:bg-red-500/20 focus:text-red-300"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
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
          {/* Main Content Area with Sidebar and Right Panel */}
          <div className="flex-1 flex">
            {/* Left Sidebar */}
            <aside
              className="w-64 bg-brand-dark text-slate-200 flex flex-col justify-between sticky z-30"
              style={{
                top: `${TOTAL_HEADER_HEIGHT_PX}px`,
                height: `calc(100vh - ${TOTAL_HEADER_HEIGHT_PX}px)`,
              }}
            >
              <div className="flex-grow px-4 pt-4">
                <TooltipProvider delayDuration={0}>
                  {/* Update sidebar rendering logic within the return statement's <aside> section: */}
                  {/* Replace the existing <nav> block with this new one: */}
                  <nav className="space-y-1">
                    {" "}
                    {/* Adjusted spacing */}
                    {navItems.map((item) => {
                      const isMainActive =
                        item.id === activeView ||
                        (item.subItems?.some((sub) => sub.id === activeView) && item.id === expandedMainTab)
                      const isExpanded = expandedMainTab === item.id

                      return (
                        <div key={item.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                onClick={() => {
                                  setActiveView(item.id) // Clicking main item sets its view
                                  setExpandedMainTab(item.id === expandedMainTab && item.subItems ? null : item.id) // Toggle expansion
                                }}
                                className={`w-full justify-start items-center space-x-3 py-2.5 rounded-lg transition-all duration-200 ease-in-out
                ${isMainActive && !item.subItems?.some((sub) => sub.id === activeView) ? "bg-brand-accent text-white font-semibold" : "text-slate-300 hover:bg-brand-dark-secondary hover:text-white"}
              `}
                              >
                                <item.icon className="h-5 w-5 flex-shrink-0" />
                                <span className="text-sm flex-1 text-left">{item.label}</span>
                                {item.subItems &&
                                  (isExpanded ? (
                                    <ChevronDown className="h-4 w-4 text-slate-400" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4 text-slate-400" />
                                  ))}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="bg-slate-900 text-white border-slate-700">
                              <p>{item.label}</p>
                            </TooltipContent>
                          </Tooltip>
                          {isExpanded && item.subItems && (
                            <div className="pl-4 mt-1 space-y-1">
                              {item.subItems.map((subItem) => {
                                const isSubActive = subItem.id === activeView
                                return (
                                  <Tooltip key={subItem.id}>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        onClick={() => setActiveView(subItem.id)}
                                        className={`w-full justify-start items-center space-x-3 py-2 rounded-lg transition-all duration-200 ease-in-out
                        ${isSubActive ? "bg-brand-accent text-white font-semibold" : "text-slate-400 hover:bg-brand-dark-secondary hover:text-slate-200"}
                      `}
                                      >
                                        <subItem.icon className="h-4 w-4 flex-shrink-0 ml-1" />{" "}
                                        {/* Adjusted icon size and margin */}
                                        <span className="text-xs">{subItem.label}</span> {/* Adjusted text size */}
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="bg-slate-900 text-white border-slate-700">
                                      <p>{subItem.label}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </nav>
                </TooltipProvider>
              </div>

              {/* User Profile Section in Sidebar - moved to header */}
            </aside>

            {/* Main Content Display */}
            <main className="flex-1 p-6 bg-brand-background overflow-y-auto">{renderContent()}</main>

            {/* Right Contextual Panel */}
            <aside
              className="w-72 bg-white border-l border-slate-200 flex-shrink-0 sticky z-20 overflow-y-auto"
              style={{
                top: `${TOTAL_HEADER_HEIGHT_PX}px`,
                height: `calc(100vh - ${TOTAL_HEADER_HEIGHT_PX}px)`,
              }}
            >
              {/* In the ContextualInsightsPanel component usage: */}
              {/* Change `activeTab={activeTab}` to `activeTab={activeView}` */}
              <ContextualInsightsPanel activeTab={activeView} />
            </aside>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
