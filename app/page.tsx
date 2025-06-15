"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Building2,
  Globe,
  Truck,
  Play,
  LogOut,
  User,
  Bell,
  HelpCircle,
  Settings,
  DollarSign,
  Loader2,
  Rocket,
  ShieldAlert,
  Swords,
  KeyIcon as CriticalMaterialsIcon,
  Newspaper,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
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
import SupplyChainNewsFeed from "@/app/components/supply-chain-news-feed"
import dynamic from "next/dynamic"
import { cn } from "@/lib/utils"

const FinancialsSection = dynamic(() => import("@/app/components/financials-section"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-brand-accent" />
      <p className="ml-2 text-lg text-slate-500">Loading Financials Component...</p>
    </div>
  ),
})

const StrategicDirectionSection = dynamic(() => import("@/app/components/strategic-direction"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-brand-accent" />
      <p className="ml-2 text-lg text-slate-500">Loading Strategic Direction Component...</p>
    </div>
  ),
})

const ChallengesAndRisksSection = dynamic(() => import("@/app/components/challenges-risks-section"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-brand-accent" />
      <p className="ml-2 text-lg text-slate-500">Loading Challenges & Risks Component...</p>
    </div>
  ),
})

const CompetitiveLandscapeSection = dynamic(() => import("@/app/components/competitive-landscape-section"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-brand-accent" />
      <p className="ml-2 text-lg text-slate-500">Loading Competitive Landscape...</p>
    </div>
  ),
})

// Dynamically import BusinessAnalystNews if it exists
const BusinessAnalystNews = dynamic(() => import("@/app/components/business-analyst-news").catch(() => () => null), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-brand-accent" />
      <p className="ml-2 text-lg text-slate-500">Loading Business Analyst News...</p>
    </div>
  ),
})

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
    subItems: [
      { id: "financials", label: "Financials", icon: DollarSign, parentId: "overview" },
      { id: "strategic-direction", label: "Strategic Direction", icon: Rocket, parentId: "overview" },
      { id: "challenges-risks", label: "Challenges & Risks", icon: ShieldAlert, parentId: "overview" },
      { id: "competitive-landscape", label: "Competitive Landscape", icon: Swords, parentId: "overview" },
      { id: "business-analyst-news", label: "Business Analyst News", icon: Newspaper, parentId: "overview" },
    ],
  },
  {
    id: "manufacturing",
    label: "Manufacturing",
    icon: Building2,
    subItems: [
      { id: "materials", label: "Critical Materials", icon: CriticalMaterialsIcon, parentId: "manufacturing" },
    ],
  },
  { id: "logistics", label: "Logistics", icon: Truck },
  { id: "simulations", label: "Simulations", icon: Play },
  { id: "news", label: "News", icon: Newspaper },
]

const VALID_API_INSIGHT_TABS = [
  "overview",
  "financials",
  "strategic-direction",
  "challenges-risks",
  "competitive-landscape",
  "manufacturing",
  "materials",
  "logistics",
  // "simulations", // Removed simulations from insights tabs
]

export default function StrategicCockpitPage() {
  const MAIN_HEADER_HEIGHT_PX = 68
  const SECONDARY_HEADER_HEIGHT_PX = 40
  const TOTAL_HEADER_HEIGHT_PX = MAIN_HEADER_HEIGHT_PX + SECONDARY_HEADER_HEIGHT_PX
  const RIGHT_PANEL_WIDTH_CLASS = "w-96"

  const [activeView, setActiveView] = useState("overview")
  const [expandedMainTab, setExpandedMainTab] = useState<string | null>("overview")
  const [secondaryHeaderText, setSecondaryHeaderText] = useState("")
  const [contextualInsightsPanelTitle, setContextualInsightsPanelTitle] = useState("Insights for Overview")

  useEffect(() => {
    let headerText = "Sandvik Group Supply Chain Data"
    let panelTitleText = "Insights for Overview"

    const parentItem = navItems.find((item) => item.subItems?.some((sub) => sub.id === activeView))
    const currentItem =
      parentItem?.subItems?.find((sub) => sub.id === activeView) || navItems.find((item) => item.id === activeView)

    if (currentItem) {
      panelTitleText = `Insights for ${currentItem.label}`
      if (parentItem && currentItem.parentId === parentItem.id) {
        headerText = `${parentItem.label} > ${currentItem.label} View - Sandvik Group Supply Chain Data`
      } else {
        headerText = `${currentItem.label} View - Sandvik Group Supply Chain Data`
      }
    }
    setSecondaryHeaderText(headerText)
    setContextualInsightsPanelTitle(panelTitleText)
  }, [activeView])

  const renderContent = () => {
    switch (activeView) {
      case "overview":
        return <SandvikOverview />
      case "financials":
        return (
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-brand-accent" />
                <p className="ml-2 text-lg text-slate-500">Loading Financials...</p>
              </div>
            }
          >
            <FinancialsSection />
          </Suspense>
        )
      case "strategic-direction":
        return (
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-brand-accent" />
                <p className="ml-2 text-lg text-slate-500">Loading Strategic Direction...</p>
              </div>
            }
          >
            <StrategicDirectionSection />
          </Suspense>
        )
      case "challenges-risks":
        return (
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-brand-accent" />
                <p className="ml-2 text-lg text-slate-500">Loading Challenges & Risks...</p>
              </div>
            }
          >
            <ChallengesAndRisksSection />
          </Suspense>
        )
      case "competitive-landscape":
        return (
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-brand-accent" />
                <p className="ml-2 text-lg text-slate-500">Loading Competitive Landscape...</p>
              </div>
            }
          >
            <CompetitiveLandscapeSection />
          </Suspense>
        )
      case "business-analyst-news":
        return BusinessAnalystNews ? ( // Check if component exists
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-brand-accent" />
                <p className="ml-2 text-lg text-slate-500">Loading Business Analyst News...</p>
              </div>
            }
          >
            <BusinessAnalystNews />
          </Suspense>
        ) : (
          <div className="p-4 text-center text-slate-500">Business Analyst News component not available.</div>
        )
      case "manufacturing":
        return <ManufacturingFootprint />
      case "materials":
        return <CriticalMaterials />
      case "logistics":
        return <SupplyChainLogistics />
      case "simulations":
        return <SupplyChainSimulations />
      case "news":
        return <SupplyChainNewsFeed />
      default:
        return <SandvikOverview />
    }
  }

  let determinedInsightsTabForPanel: string
  if (VALID_API_INSIGHT_TABS.includes(activeView)) {
    determinedInsightsTabForPanel = activeView
  } else {
    const parentItem = navItems.find((item) => item.subItems?.some((sub) => sub.id === activeView))
    determinedInsightsTabForPanel =
      parentItem && VALID_API_INSIGHT_TABS.includes(parentItem.id) ? parentItem.id : "overview"
  }
  const insightsTabKey = determinedInsightsTabForPanel

  const showContextualInsightsPanel =
    activeView !== "business-analyst-news" && activeView !== "simulations" && activeView !== "news"

  return (
    <AuthGuard>
      <div className="bg-brand-background">
        <div className="flex flex-col min-h-screen max-w-full">
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
                  <div className="ml-2">
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
                            window.location.reload()
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
          <div
            className="bg-brand-dark-secondary text-slate-300 text-sm sticky z-40 border-b border-slate-700"
            style={{ top: `${MAIN_HEADER_HEIGHT_PX}px`, height: `${SECONDARY_HEADER_HEIGHT_PX}px` }}
          >
            <div className="px-4 sm:px-6 lg:px-8 flex items-center h-full">
              <p>{secondaryHeaderText}</p>
            </div>
          </div>
          <div className="flex-1 flex">
            <aside
              className="w-64 bg-brand-dark text-slate-200 flex flex-col justify-between sticky z-30"
              style={{ top: `${TOTAL_HEADER_HEIGHT_PX}px`, height: `calc(100vh - ${TOTAL_HEADER_HEIGHT_PX}px)` }}
            >
              <div className="flex-grow px-4 pt-4">
                <TooltipProvider delayDuration={0}>
                  <nav className="space-y-1">
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
                                  setActiveView(item.id)
                                  if (item.subItems && item.subItems.length > 0) {
                                    setExpandedMainTab(isExpanded ? null : item.id)
                                  } else {
                                    setExpandedMainTab(null)
                                  }
                                }}
                                className={`w-full justify-start items-center space-x-3 py-2.5 rounded-lg transition-all duration-200 ease-in-out ${
                                  (
                                    item.id === activeView &&
                                      (!item.subItems ||
                                        item.subItems.length === 0 ||
                                        !item.subItems.some((sub) => sub.id === activeView))
                                  ) ||
                                  (item.subItems?.some((sub) => sub.id === activeView) && item.id === expandedMainTab)
                                    ? "bg-brand-accent text-white font-semibold"
                                    : "text-slate-300 hover:bg-brand-dark-secondary hover:text-white"
                                }`}
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
                                        onClick={() => {
                                          setActiveView(subItem.id)
                                          if (subItem.parentId) {
                                            setExpandedMainTab(subItem.parentId)
                                          }
                                        }}
                                        className={`w-full justify-start items-center space-x-3 py-2 rounded-lg transition-all duration-200 ease-in-out ${
                                          isSubActive
                                            ? "bg-brand-accent text-white font-semibold"
                                            : "text-slate-400 hover:bg-brand-dark-secondary hover:text-slate-200"
                                        }`}
                                      >
                                        <subItem.icon className="h-4 w-4 flex-shrink-0 ml-1" />
                                        <span className="text-xs">{subItem.label}</span>
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
            </aside>
            <main className="flex-1 p-6 bg-brand-background overflow-y-auto">{renderContent()}</main>
            {showContextualInsightsPanel && (
              <aside
                className={cn(
                  "bg-white border-l border-slate-200 flex-shrink-0 sticky z-20 overflow-y-auto",
                  RIGHT_PANEL_WIDTH_CLASS,
                )}
                style={{ top: `${TOTAL_HEADER_HEIGHT_PX}px`, height: `calc(100vh - ${TOTAL_HEADER_HEIGHT_PX}px)` }}
              >
                <ContextualInsightsPanel
                  key={insightsTabKey}
                  activeTab={insightsTabKey}
                  panelTitle={contextualInsightsPanelTitle}
                />
              </aside>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
