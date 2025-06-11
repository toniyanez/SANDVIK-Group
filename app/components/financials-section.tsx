"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  Landmark,
  Scale,
  PiggyBank,
  Receipt,
  Target,
  Percent,
  CalendarDays,
  Info,
  BarChartHorizontalBig,
  FileText,
  Lightbulb,
  LineChart,
  Banknote,
  ArrowRightLeft,
  Building,
  ShieldCheck,
  ListChecks,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface KpiCardProps {
  title: string
  value: string
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: React.ElementType
  unit?: string
  description?: string
}

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  unit,
  description,
}) => {
  let changeColor = "text-slate-500"
  if (changeType === "positive") changeColor = "text-green-600 dark:text-green-500"
  if (changeType === "negative") changeColor = "text-red-600 dark:text-red-500"

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</CardTitle>
        <Icon className="h-5 w-5 text-brand-accent" />
      </CardHeader>
      <CardContent className="pt-1">
        <div className="text-3xl font-bold text-brand-dark dark:text-slate-50">
          {value}
          {unit && <span className="text-xl font-normal text-slate-500 dark:text-slate-400 ml-1.5">{unit}</span>}
        </div>
        {change && <p className={`text-xs ${changeColor} mt-1.5`}>{change} vs Q1 2024</p>}
        {description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{description}</p>}
      </CardContent>
    </Card>
  )
}

interface FinancialGuidanceItemProps {
  title: string
  value: string
  icon: React.ElementType
}

const FinancialGuidanceItem: React.FC<FinancialGuidanceItemProps> = ({ title, value, icon: Icon }) => (
  <li className="flex items-start space-x-3 py-2.5">
    <Icon className="h-5 w-5 text-brand-accent flex-shrink-0 mt-1" />
    <div>
      <span className="font-semibold text-slate-700 dark:text-slate-300">{title}:</span>
      <span className="text-slate-600 dark:text-slate-400 ml-1.5">{value}</span>
    </div>
  </li>
)

const FinancialsSection: React.FC = () => {
  // Data extracted from the provided PDF for Q1 2025
  const consolidatedOverview = {
    kpis: [
      { title: "Order Intake", value: "32,763", unit: "MSEK", change: "+2%", changeType: "positive", icon: Briefcase },
      { title: "Revenues", value: "29,301", unit: "MSEK", change: "+1%", changeType: "positive", icon: DollarSign },
      {
        title: "Adjusted EBITA",
        value: "5,768",
        unit: "MSEK",
        change: "+9%",
        changeType: "positive",
        icon: TrendingUp,
      },
      {
        title: "Adjusted EBITA Margin",
        value: "19.7",
        unit: "%",
        change: "+1.5 ppts",
        changeType: "positive",
        icon: Percent,
      },
      {
        title: "Adjusted EPS (diluted)",
        value: "3.01",
        unit: "SEK",
        change: "+15%",
        changeType: "positive",
        icon: Landmark,
      },
      {
        title: "Free Operating Cash Flow",
        value: "3,809",
        unit: "MSEK",
        change: "+1%",
        changeType: "positive",
        icon: PiggyBank,
      },
      {
        title: "Book-to-Bill Ratio",
        value: "112",
        unit: "%",
        description: "Strong future revenue pipeline",
        icon: BarChartHorizontalBig,
      },
    ],
    summaryTable: [
      { metric: "Order intake", q1_2024: "31,981", q1_2025: "32,763", change: "+2%" },
      { metric: "Revenues", q1_2024: "29,002", q1_2025: "29,301", change: "+1%" },
      { metric: "Adjusted EBITA", q1_2024: "5,281", q1_2025: "5,768", change: "+9%" },
      { metric: "Adjusted EBITA margin (%)", q1_2024: "18.2%", q1_2025: "19.7%", change: "+1.5 ppts" },
      { metric: "Profit for the period", q1_2024: "1,247", q1_2025: "3,736", change: "+200%" },
      { metric: "Adjusted EPS, diluted (SEK)", q1_2024: "2.61", q1_2025: "3.01", change: "+15%" },
      { metric: "Free operating cash flow", q1_2024: "3,770", q1_2025: "3,809", change: "+1%" },
      { metric: "ROCE (%)", q1_2024: "14.0%", q1_2025: "15.4%", change: "+1.4 ppts" },
      { metric: "Financial net debt/EBITDA", q1_2024: "1.3x", q1_2025: "1.1x", change: "-0.2x" },
    ],
    growthBridge: {
      orderIntake: [
        {
          component: "Organic",
          value: "+2%",
          color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        },
        {
          component: "Structure",
          value: "+1%",
          color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        },
        { component: "Currency", value: "-1%", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
        {
          component: "Total",
          value: "+2%",
          color: "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 font-semibold",
        },
      ],
      revenues: [
        {
          component: "Organic",
          value: "+1%",
          color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        },
        {
          component: "Structure",
          value: "+1%",
          color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        },
        { component: "Currency", value: "-1%", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
        {
          component: "Total",
          value: "+1%",
          color: "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 font-semibold",
        },
      ],
    },
    ebitaBridge: {
      q1_2024: "5,281 MSEK",
      organic: "+203 MSEK",
      currency: "+237 MSEK",
      structure: "+48 MSEK",
      q1_2025: "5,768 MSEK",
      margin_q1_2024: "18.2%",
      margin_organic: "+0.6%",
      margin_currency: "+1.0%",
      margin_structure: "+0.0%",
      margin_q1_2025: "19.7%",
    },
    narrative: [
      "Profitability driven by stringent cost control and restructuring savings.",
      "Currency accretion positively impacted margin by 100 bps.",
      "Trailing 12-month cash conversion at an impressive 93%.",
      "Fourth consecutive quarter with positive organic order intake.",
    ],
  }

  const balanceSheet = {
    kpis: [
      { title: "Net Working Capital", value: "33.9", unit: "BSEK", description: "vs 36.6 BSEK Q1 2024", icon: Scale },
      {
        title: "NWC / Revenues (12m)",
        value: "29.8",
        unit: "%",
        description: "Stable vs 29.7% Q1 2024",
        icon: Percent,
      },
      { title: "Financial Net Debt", value: "31.2", unit: "BSEK", description: "vs 33.9 BSEK Q1 2024", icon: Banknote },
      {
        title: "Financial Net Debt / EBITDA",
        value: "1.1x",
        description: "Target <1.5x; vs 1.3x Q1 2024",
        icon: ShieldCheck,
      },
      { title: "Capex", value: "1.0", unit: "BSEK", description: "117% of depreciation", icon: Building },
      { title: "ROCE", value: "15.4", unit: "%", description: "vs 14.0% Q1 2024", icon: TrendingUp },
    ],
    narrative: [
      "NWC reduction due to favorable FX effects and lower inventory volumes.",
      "Proactive debt management strategy supported by strong free operating cash flow.",
      "Hedging strategy effectively protects profitability from currency fluctuations on orders.",
      "Normalized tax rate at 23.8%, consistent with guidance.",
    ],
  }

  const guidanceOutlook = {
    fy2025Guidance: [
      { title: "Currency Effects (Q2 EBITA)", value: "SEK -600M (est.)", icon: ArrowRightLeft },
      { title: "Capex (Cash)", value: "~SEK 5.0B", icon: Building },
      { title: "Interest Net", value: "~SEK -0.8B", icon: Receipt },
      { title: "Normalized Tax Rate", value: "23-25%", icon: Percent },
    ],
    longTermTargets: [
      { title: "Growth (Organic + M&A)", value: "7% (fixed currency)", icon: TrendingUp },
      { title: "Adjusted EBITA Margin", value: "20-22%", icon: Target },
      { title: "Dividend Payout Ratio", value: "50% of Adj. EPS", icon: DollarSign },
      { title: "Financial Net Debt/EBITDA", value: "<1.5x (excl. transformational M&A)", icon: ShieldCheck },
    ],
    narrative: ["Long-term targets defined in 2022 to guide performance through a business cycle."],
  }

  return (
    <div className="space-y-8 p-4 md:p-6">
      <h1 className="text-3xl font-bold text-brand-dark dark:text-slate-100 mb-6 flex items-center">
        <FileText className="w-8 h-8 mr-3 text-brand-accent" />
        Sandvik Group Financials - Q1 2025 Report Summary
      </h1>

      <Accordion type="multiple" defaultValue={["item-1", "item-2", "item-3"]} className="w-full">
        {/* Section A: Consolidated Financial Overview */}
        <AccordionItem value="item-1" className="border-b border-slate-200 dark:border-slate-700">
          <AccordionTrigger className="text-xl font-semibold text-brand-dark dark:text-slate-200 hover:text-brand-accent dark:hover:text-brand-accent transition-colors py-4">
            <div className="flex items-center">
              <LineChart className="w-6 h-6 mr-3 text-brand-accent" />
              A. Consolidated Financial Overview
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-6 space-y-6 bg-slate-50 dark:bg-slate-800/30 p-6 rounded-b-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
              {consolidatedOverview.kpis.map((kpi) => (
                <KpiCard key={kpi.title} {...kpi} />
              ))}
            </div>

            <Card className="shadow-sm dark:bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-slate-800 dark:text-slate-200">
                  <ListChecks className="w-5 h-5 mr-2 text-brand-accent" />
                  Financial Summary (Q1 2025 vs. Q1 2024)
                </CardTitle>
                <CardDescription className="dark:text-slate-400">
                  All figures in MSEK unless otherwise stated.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-b-slate-300 dark:border-b-slate-700">
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Metric</TableHead>
                      <TableHead className="text-right font-semibold text-slate-700 dark:text-slate-300">
                        Q1 2024
                      </TableHead>
                      <TableHead className="text-right font-semibold text-slate-700 dark:text-slate-300">
                        Q1 2025
                      </TableHead>
                      <TableHead className="text-right font-semibold text-slate-700 dark:text-slate-300">
                        Change (%)
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {consolidatedOverview.summaryTable.map((row, index) => (
                      <TableRow
                        key={row.metric}
                        className={`border-slate-200 dark:border-slate-700 ${index % 2 === 0 ? "bg-white dark:bg-slate-800/30" : "bg-slate-100 dark:bg-slate-700/30"} hover:bg-slate-200/70 dark:hover:bg-slate-600/40 transition-colors`}
                      >
                        <TableCell className="font-medium text-slate-700 dark:text-slate-300 py-3">
                          {row.metric}
                        </TableCell>
                        <TableCell className="text-right text-slate-600 dark:text-slate-400 py-3">
                          {row.q1_2024}
                        </TableCell>
                        <TableCell className="text-right text-slate-600 dark:text-slate-400 py-3">
                          {row.q1_2025}
                        </TableCell>
                        <TableCell className="text-right text-slate-600 dark:text-slate-400 py-3">
                          {row.change}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-sm dark:bg-slate-800/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-slate-800 dark:text-slate-200">
                    <TrendingUp className="w-5 h-5 mr-2 text-brand-accent" />
                    Order Intake & Revenue Growth Bridge (Q1 2025)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Order Intake Growth:</h4>
                    <div className="flex flex-wrap gap-2">
                      {consolidatedOverview.growthBridge.orderIntake.map((item) => (
                        <Badge
                          key={item.component}
                          variant="outline"
                          className={`px-2.5 py-1 text-xs border ${item.color.replace("bg-", "border-").replace("text-", "text-")} ${item.color}`}
                        >
                          {item.component}: {item.value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Revenue Growth:</h4>
                    <div className="flex flex-wrap gap-2">
                      {consolidatedOverview.growthBridge.revenues.map((item) => (
                        <Badge
                          key={item.component}
                          variant="outline"
                          className={`px-2.5 py-1 text-xs border ${item.color.replace("bg-", "border-").replace("text-", "text-")} ${item.color}`}
                        >
                          {item.component}: {item.value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-sm dark:bg-slate-800/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-slate-800 dark:text-slate-200">
                    <BarChartHorizontalBig className="w-5 h-5 mr-2 text-brand-accent" />
                    Adjusted EBITA Bridge (Q1 2025)
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-600 dark:text-slate-400">
                  <div className="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-1.5">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Q1 2024 EBITA:</span>
                    <span>
                      {consolidatedOverview.ebitaBridge.q1_2024} (Margin:{" "}
                      {consolidatedOverview.ebitaBridge.margin_q1_2024})
                    </span>

                    <span className="font-semibold text-green-600 dark:text-green-500">Organic:</span>
                    <span>
                      {consolidatedOverview.ebitaBridge.organic} (Margin:{" "}
                      {consolidatedOverview.ebitaBridge.margin_organic})
                    </span>

                    <span className="font-semibold text-blue-600 dark:text-blue-500">Currency:</span>
                    <span>
                      {consolidatedOverview.ebitaBridge.currency} (Margin:{" "}
                      {consolidatedOverview.ebitaBridge.margin_currency})
                    </span>

                    <span className="font-semibold text-purple-600 dark:text-purple-500">Structure:</span>
                    <span>
                      {consolidatedOverview.ebitaBridge.structure} (Margin:{" "}
                      {consolidatedOverview.ebitaBridge.margin_structure})
                    </span>

                    <span className="font-semibold text-slate-700 dark:text-slate-300 pt-1 border-t border-slate-200 dark:border-slate-700 mt-1">
                      Q1 2025 EBITA:
                    </span>
                    <span className="pt-1 border-t border-slate-200 dark:border-slate-700 mt-1">
                      {consolidatedOverview.ebitaBridge.q1_2025} (Margin:{" "}
                      {consolidatedOverview.ebitaBridge.margin_q1_2025})
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-sky-50 dark:bg-sky-900/40 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-sky-700 dark:text-sky-300">
                  <Lightbulb className="w-5 h-5 mr-2 text-sky-500 dark:text-sky-400" />
                  Key Takeaways
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
                  {consolidatedOverview.narrative.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Section B: Balance Sheet and Capital Efficiency */}
        <AccordionItem value="item-2" className="border-b border-slate-200 dark:border-slate-700">
          <AccordionTrigger className="text-xl font-semibold text-brand-dark dark:text-slate-200 hover:text-brand-accent dark:hover:text-brand-accent transition-colors py-4">
            <div className="flex items-center">
              <Scale className="w-6 h-6 mr-3 text-brand-accent" /> B. Balance Sheet & Capital Efficiency
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-6 space-y-6 bg-slate-50 dark:bg-slate-800/30 p-6 rounded-b-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {balanceSheet.kpis.map((kpi) => (
                <KpiCard key={kpi.title} {...kpi} changeType="neutral" />
              ))}
            </div>
            <Card className="bg-teal-50 dark:bg-teal-900/40 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-teal-700 dark:text-teal-300">
                  <Info className="w-5 h-5 mr-2 text-teal-500 dark:text-teal-400" />
                  Highlights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
                  {balanceSheet.narrative.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Section C: Financial Guidance and Outlook (FY 2025) */}
        <AccordionItem value="item-3" className="border-b-0">
          {" "}
          {/* Removed border for last item */}
          <AccordionTrigger className="text-xl font-semibold text-brand-dark dark:text-slate-200 hover:text-brand-accent dark:hover:text-brand-accent transition-colors py-4">
            <div className="flex items-center">
              <CalendarDays className="w-6 h-6 mr-3 text-brand-accent" /> C. Financial Guidance & Outlook (FY 2025)
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-6 space-y-6 bg-slate-50 dark:bg-slate-800/30 p-6 rounded-b-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-sm dark:bg-slate-800/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-slate-800 dark:text-slate-200">
                    <Target className="w-5 h-5 mr-2 text-brand-accent" />
                    FY 2025 Specific Guidance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {guidanceOutlook.fy2025Guidance.map((item) => (
                      <FinancialGuidanceItem key={item.title} {...item} />
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="shadow-sm dark:bg-slate-800/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-slate-800 dark:text-slate-200">
                    <TrendingUp className="w-5 h-5 mr-2 text-brand-accent" />
                    Long-Term Financial Targets
                  </CardTitle>
                  <CardDescription className="dark:text-slate-400">
                    (Defined 2022, through a business cycle)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {guidanceOutlook.longTermTargets.map((item) => (
                      <FinancialGuidanceItem key={item.title} {...item} />
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
            <Card className="bg-indigo-50 dark:bg-indigo-900/40 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-indigo-700 dark:text-indigo-300">
                  <Info className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                  Context
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
                  {guidanceOutlook.narrative.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default FinancialsSection
