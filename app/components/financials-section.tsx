"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  DollarSign,
  TrendingUp,
  PieChartIcon,
  Landmark,
  Target,
  Percent,
  Scale,
  Banknote,
  Receipt,
  ShieldCheck,
  CalendarDays,
  FileText,
  Activity,
  ChevronsRight,
} from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  LabelList,
} from "recharts"
import { Badge } from "@/components/ui/badge"

// Helper to format numbers
const formatNumber = (num: number, precision = 1, unitPrefix = "") => {
  const absNum = Math.abs(num)
  if (absNum >= 1e9) {
    return unitPrefix + (num / 1e9).toFixed(precision) + "B"
  }
  if (absNum >= 1e6) {
    return unitPrefix + (num / 1e6).toFixed(precision) + "M"
  }
  if (absNum >= 1e3) {
    return unitPrefix + (num / 1e3).toFixed(precision) + "K"
  }
  return unitPrefix + num.toFixed(precision)
}

const formatSEK = (num: number, precision = 1) => formatNumber(num, precision, "SEK ")

// Data from PDF (Q1 2025) - same as before
const consolidatedOverviewData = {
  orderIntake: { current: 32763, previous: 31981, unit: "M SEK", changePct: "+2%" },
  revenues: { current: 29301, previous: 29002, unit: "M SEK", changePct: "+1%" },
  bookToBill: 112, // %
  adjEBITA: { current: 5768, previous: 5281, unit: "M SEK", changePct: "+9%" },
  adjEBITAMargin: { current: 19.7, previous: 18.2, unit: "%", changePts: "+1.5ppts" },
  adjProfit: { current: 3800, previous: 3300, unit: "M SEK" },
  adjEPS: { current: 3.01, previous: 2.61, unit: "SEK", changePct: "+15%" },
  focf: { current: 3809, previous: 3770, unit: "M SEK", changePct: "+1%" },
  cashConversionTTM: 93, // %
  profitForPeriod: { current: 3736, previous: 1247, unit: "M SEK", changePct: "+200%" },
}

const growthBridgeData = [
  { component: "Organic", orderIntakePct: 2, revenuesPct: 1 },
  { component: "Structure", orderIntakePct: 1, revenuesPct: 1 },
  { component: "Currency", orderIntakePct: -1, revenuesPct: -1 },
] // Total is derived

const ebitdaBridgeData = {
  q1_2024: 5281,
  organic: 203,
  currency: 237,
  structure: 48,
  q1_2025: 5768,
  margin: {
    q1_2024: 18.2,
    organicAccretion: 0.6,
    currencyAccretion: 1.0,
    structureAccretion: 0.0,
    q1_2025: 19.7,
  },
}

const balanceSheetData = {
  nwc: { current: 33.9, previous: 36.6, unit: "B SEK" },
  nwcToRevenuesTTM: { current: 29.8, previous: 29.7, unit: "%" },
  finNetDebt: { current: 31.2, previous: 33.9, unit: "B SEK" },
  finNetDebtToEBITDA: { current: 1.1, previous: 1.3, unit: "x", target: 1.5 }, // Target <1.5x
  totalNetDebt: { current: 39.7, previous: 42.2, unit: "B SEK" },
  avgInterestRate: 3.1, // %
  capex: { current: 1.0, previous: 1.2, unit: "B SEK", desc: "117% of depreciation" },
  interestNet: { current: -206, previous: -363, unit: "M SEK" },
  normTaxRate: { current: 23.8, previous: 24.0, unit: "%" },
  roce: { current: 15.4, previous: 14.0, unit: "%" },
  roceExAmort: { current: 16.7, previous: 15.5, unit: "%" },
}

const outlookData = {
  q2_2025_currency_ebita_impact: -600, // M SEK
  fy2025_capex_cash: 5.0, // B SEK
  fy2025_interest_net: -0.8, // B SEK
  fy2025_norm_tax_rate: "23-25%",
  longTermTargets: [
    { name: "Growth (Organic + M&A)", targetValue: 7, unit: "%", icon: TrendingUp, info: "Through business cycle" },
    { name: "Adjusted EBITA Margin", targetMin: 20, targetMax: 22, currentValue: 19.7, unit: "%", icon: Percent },
    { name: "Dividend Payout Ratio (Adj. EPS)", targetValue: 50, unit: "%", icon: PieChartIcon },
    {
      name: "Financial Net Debt/EBITDA",
      targetValue: 1.5,
      targetComparison: "lessThan",
      currentValue: 1.1,
      unit: "x",
      icon: ShieldCheck,
    },
  ],
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#A4DE6C", "#D0ED57", "#FFC658"]
const POSITIVE_COLOR = "#10B981" // Green
const NEGATIVE_COLOR = "#EF4444" // Red
const NEUTRAL_COLOR = "#6B7280" // Gray

// CustomTooltip remains the same for other charts, but we'll use default for the first one.
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
        <p className="label font-semibold text-gray-700">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.formatter ? entry.formatter(entry.value) : formatSEK(entry.value, entry.payload.unit === "SEK" ? 2 : 1)}`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const GrowthBridgeChart = ({ data, title }: { data: { component: string; value: number }[]; title: string }) => {
  const [isClient, setIsClientLocal] = useState(false)
  useEffect(() => {
    setIsClientLocal(true)
  }, [])

  if (!isClient) {
    return (
      <div
        style={{
          height: "70px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f9fafb",
        }}
      >
        <p className="text-xs text-slate-400">Loading chart...</p>
      </div>
    ) // Placeholder
  }

  return (
    <div>
      <h4 className="text-md font-semibold text-brand-dark mb-1 text-center">{title}</h4>
      <ResponsiveContainer width="100%" height={60}>
        <BarChart data={data} layout="vertical" barCategoryGap="10%">
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="component" hide />
          <Tooltip content={<CustomTooltip />} />
          {data.map((entry, index) => (
            <Bar
              key={entry.component}
              dataKey="value"
              stackId="a"
              fill={entry.value >= 0 ? COLORS[index % COLORS.length] : NEGATIVE_COLOR}
            >
              <LabelList
                dataKey="value"
                position="insideRight"
                formatter={(value: number) => `${value > 0 ? "+" : ""}${value}%`}
                style={{ fill: "white", fontSize: "10px" }}
              />
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
      <div className="flex justify-between text-xs text-slate-500 mt-1 px-2">
        <span>Start</span>
        <span>
          Total: {data.reduce((acc, curr) => acc + curr.value, 0) > 0 ? "+" : ""}
          {data.reduce((acc, curr) => acc + curr.value, 0)}%
        </span>
      </div>
    </div>
  )
}

export default function FinancialsSection() {
  const performanceChartData = [
    {
      name: "Order Intake",
      Q1_2025: consolidatedOverviewData.orderIntake.current,
      Q1_2024: consolidatedOverviewData.orderIntake.previous,
      unit: "M SEK",
    },
    {
      name: "Revenues",
      Q1_2025: consolidatedOverviewData.revenues.current,
      Q1_2024: consolidatedOverviewData.revenues.previous,
      unit: "M SEK",
    },
    {
      name: "Adj. EBITA",
      Q1_2025: consolidatedOverviewData.adjEBITA.current,
      Q1_2024: consolidatedOverviewData.adjEBITA.previous,
      unit: "M SEK",
    },
    {
      name: "FOCF",
      Q1_2025: consolidatedOverviewData.focf.current,
      Q1_2024: consolidatedOverviewData.focf.previous,
      unit: "M SEK",
    },
  ]

  const ebitdaBridgeChartData = [
    { name: "Q1'24 EBITA", value: ebitdaBridgeData.q1_2024, fill: NEUTRAL_COLOR },
    { name: "Organic", value: ebitdaBridgeData.organic, fill: POSITIVE_COLOR },
    { name: "Currency", value: ebitdaBridgeData.currency, fill: POSITIVE_COLOR },
    { name: "Structure", value: ebitdaBridgeData.structure, fill: POSITIVE_COLOR },
    { name: "Q1'25 EBITA", value: ebitdaBridgeData.q1_2025, fill: COLORS[0] },
  ]

  const balanceSheetChartData = [
    { name: "NWC", Q1_2025: balanceSheetData.nwc.current, Q1_2024: balanceSheetData.nwc.previous, unit: "B SEK" },
    {
      name: "Fin. Net Debt",
      Q1_2025: balanceSheetData.finNetDebt.current,
      Q1_2024: balanceSheetData.finNetDebt.previous,
      unit: "B SEK",
    },
    { name: "Capex", Q1_2025: balanceSheetData.capex.current, Q1_2024: balanceSheetData.capex.previous, unit: "B SEK" },
  ]

  const roceChartData = [
    { name: "ROCE", Q1_2025: balanceSheetData.roce.current, Q1_2024: balanceSheetData.roce.previous, unit: "%" },
    {
      name: "ROCE (ex. Amort.)",
      Q1_2025: balanceSheetData.roceExAmort.current,
      Q1_2024: balanceSheetData.roceExAmort.previous,
      unit: "%",
    },
  ]

  const orderIntakeGrowthData = growthBridgeData.map((item) => ({
    component: item.component,
    value: item.orderIntakePct,
  }))
  const revenueGrowthData = growthBridgeData.map((item) => ({ component: item.component, value: item.revenuesPct }))

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Placeholder for charts if not client-side yet
  const ChartPlaceholder = ({ height = 300 }: { height?: number }) => (
    <div
      style={{
        height: `${height}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f9fafb",
        border: "1px dashed #e5e7eb",
        borderRadius: "8px",
      }}
    >
      <p className="text-sm text-slate-400">Loading chart...</p>
    </div>
  )

  return (
    <div className="space-y-8 p-4 md:p-6 bg-slate-50 min-h-screen">
      <header className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-dark">Sandvik Group Financials - Q1 2025</h1>
        <p className="text-slate-600 mt-2 text-lg">Key Performance and Strategic Outlook from Q1 2025 Report</p>
      </header>

      {/* A. Consolidated Financial Overview */}
      <section id="consolidated-overview">
        <h2 className="text-2xl font-semibold text-brand-dark mb-3 pb-2 border-b-2 border-brand flex items-center">
          <Activity className="mr-2 text-brand" /> A. Consolidated Financial Overview (Q1 2025)
        </h2>
        <Card className="mb-6 transition-all duration-300 hover:shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-brand-dark">
              Q1 Performance Snapshot (vs Q1 2024)
            </CardTitle>
            <CardDescription>Key financial metrics in Millions of SEK (MSEK).</CardDescription>
          </CardHeader>
          <CardContent>
            {isClient ? (
              // Using fixed width and height for the BarChart directly
              <div style={{ width: "100%", height: "300px" }}>
                {" "}
                {/* Ensure parent has dimensions */}
                <BarChart
                  width={500} // Example fixed width, adjust as needed or use parent %
                  height={300}
                  data={performanceChartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#666" />
                  <YAxis tickFormatter={(value) => formatNumber(value, 0)} tick={{ fontSize: 12 }} stroke="#666" />
                  <Tooltip /> {/* Using default tooltip for simplicity */}
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Bar dataKey="Q1_2025" fill={COLORS[0]} name="Q1 2025" radius={[4, 4, 0, 0]} barSize={35} />
                  <Bar dataKey="Q1_2024" fill={COLORS[1]} name="Q1 2024" radius={[4, 4, 0, 0]} barSize={35} />
                </BarChart>
              </div>
            ) : (
              <ChartPlaceholder height={300} />
            )}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
              {[
                {
                  label: "Adj. EBITA Margin",
                  value: `${consolidatedOverviewData.adjEBITAMargin.current}%`,
                  change: `vs ${consolidatedOverviewData.adjEBITAMargin.previous}% (${consolidatedOverviewData.adjEBITAMargin.changePts})`,
                  icon: Percent,
                },
                {
                  label: "Adj. EPS",
                  value: `${consolidatedOverviewData.adjEPS.current} SEK`,
                  change: `vs ${consolidatedOverviewData.adjEPS.previous} SEK (${consolidatedOverviewData.adjEPS.changePct})`,
                  icon: TrendingUp,
                },
                { label: "Book-to-Bill", value: `${consolidatedOverviewData.bookToBill}%`, icon: FileText },
                {
                  label: "Cash Conversion (TTM)",
                  value: `${consolidatedOverviewData.cashConversionTTM}%`,
                  icon: Receipt,
                },
                {
                  label: "Profit for Period",
                  value: formatSEK(consolidatedOverviewData.profitForPeriod.current, 0),
                  change: `vs ${formatSEK(consolidatedOverviewData.profitForPeriod.previous, 0)} (${consolidatedOverviewData.profitForPeriod.changePct})`,
                  icon: TrendingUp,
                },
              ].map((item) => (
                <div key={item.label} className="p-3 bg-slate-100 rounded-lg">
                  <item.icon className="h-6 w-6 text-brand mx-auto mb-1" />
                  <p className="text-sm font-medium text-slate-700">{item.label}</p>
                  <p className="text-lg font-bold text-brand-dark">{item.value}</p>
                  {item.change && <p className="text-xs text-slate-500">{item.change}</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 transition-all duration-300 hover:shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-brand-dark">Growth & Profitability Drivers</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-brand-dark mb-3">Growth Bridge (Q1 2025 Y/Y %)</h3>
              <div className="space-y-4">
                <GrowthBridgeChart data={orderIntakeGrowthData} title="Order Intake Growth Components" />
                <GrowthBridgeChart data={revenueGrowthData} title="Revenue Growth Components" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-brand-dark mb-3">Adjusted EBITA Bridge (Q1'24 to Q1'25)</h3>
              {isClient ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={ebitdaBridgeChartData} layout="vertical" margin={{ right: 30, left: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(value) => formatNumber(value, 0)} />
                    <YAxis dataKey="name" type="category" width={100} interval={0} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(value: number) => `${formatSEK(value)}`} />
                    <Bar dataKey="value" name="MSEK">
                      {ebitdaBridgeChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                      <LabelList
                        dataKey="value"
                        position="right"
                        formatter={(value: number) => formatSEK(value, 0)}
                        style={{ fontSize: 10 }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ChartPlaceholder height={250} />
              )}
              <p className="text-xs text-slate-500 mt-2 text-center">
                Q1'24 Margin: {ebitdaBridgeData.margin.q1_2024}%. Accretion: Organic +
                {ebitdaBridgeData.margin.organicAccretion}ppts, Currency +{ebitdaBridgeData.margin.currencyAccretion}
                ppts, Structure +{ebitdaBridgeData.margin.structureAccretion}ppts. Q1'25 Margin:{" "}
                {ebitdaBridgeData.margin.q1_2025}%.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* B. Balance Sheet and Capital Efficiency */}
      <section id="balance-sheet">
        <h2 className="text-2xl font-semibold text-brand-dark mb-3 pb-2 border-b-2 border-brand flex items-center">
          <Landmark className="mr-2 text-brand" /> B. Balance Sheet & Capital Efficiency (Q1 2025)
        </h2>
        <Card className="mb-6 transition-all duration-300 hover:shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-brand-dark">
              Capital Structure & Returns (vs Q1 2024)
            </CardTitle>
            <CardDescription>Values in Billions of SEK (BSEK) unless otherwise noted.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-brand-dark mb-3">Key Balance Sheet Items</h3>
              {isClient ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={balanceSheetChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(value) => formatNumber(value, 1)} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Bar dataKey="Q1_2025" fill={COLORS[0]} name="Q1 2025" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Q1_2024" fill={COLORS[1]} name="Q1 2024" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ChartPlaceholder height={250} />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-brand-dark mb-3">Return on Capital Employed (ROCE)</h3>
              {isClient ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={roceChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis unit="%" tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value: number) => `${value}%`} />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Bar dataKey="Q1_2025" fill={COLORS[2]} name="Q1 2025 (%)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Q1_2024" fill={COLORS[3]} name="Q1 2024 (%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ChartPlaceholder height={250} />
              )}
            </div>
          </CardContent>
          <CardContent className="mt-0 pt-0">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm p-4 bg-slate-50 rounded-md">
              <div>
                <p className="font-medium text-slate-700">NWC / Revenues (TTM)</p>
                <p className="text-lg font-bold text-brand-dark">
                  {balanceSheetData.nwcToRevenuesTTM.current}%
                  <span className="text-xs text-slate-500"> (Prev: {balanceSheetData.nwcToRevenuesTTM.previous}%)</span>
                </p>
              </div>
              <div>
                <p className="font-medium text-slate-700">Fin. Net Debt / EBITDA</p>
                <p className="text-lg font-bold text-brand-dark">
                  {balanceSheetData.finNetDebtToEBITDA.current}x
                  <span className="text-xs text-slate-500">
                    {" "}
                    (Prev: {balanceSheetData.finNetDebtToEBITDA.previous}x)
                  </span>
                </p>
                <Progress
                  value={
                    (balanceSheetData.finNetDebtToEBITDA.current / balanceSheetData.finNetDebtToEBITDA.target) * 100
                  }
                  className="h-2 mt-1"
                  indicatorClassName={
                    balanceSheetData.finNetDebtToEBITDA.current < balanceSheetData.finNetDebtToEBITDA.target
                      ? "bg-green-500"
                      : "bg-red-500"
                  }
                />
                <p className="text-xs text-slate-500">Target: &lt;{balanceSheetData.finNetDebtToEBITDA.target}x</p>
              </div>
              <div>
                <p className="font-medium text-slate-700">Interest Net (Q1)</p>
                <p className="text-lg font-bold text-brand-dark">
                  {formatSEK(balanceSheetData.interestNet.current)}
                  <span className="text-xs text-slate-500">
                    {" "}
                    (Prev: {formatSEK(balanceSheetData.interestNet.previous)})
                  </span>
                </p>
              </div>
              <div>
                <p className="font-medium text-slate-700">Normalized Tax Rate (Q1)</p>
                <p className="text-lg font-bold text-brand-dark">
                  {balanceSheetData.normTaxRate.current}%
                  <span className="text-xs text-slate-500"> (Prev: {balanceSheetData.normTaxRate.previous}%)</span>
                </p>
              </div>
              <div>
                <p className="font-medium text-slate-700">Avg. Interest Rate</p>
                <p className="text-lg font-bold text-brand-dark">~{balanceSheetData.avgInterestRate}%</p>
              </div>
              <div>
                <p className="font-medium text-slate-700">Capex (Q1)</p>
                <p className="text-lg font-bold text-brand-dark">
                  {formatSEK(balanceSheetData.capex.current, 1)}B
                  <span className="text-xs text-slate-500"> ({balanceSheetData.capex.desc})</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* C. Financial Guidance and Outlook (FY 2025) */}
      <section id="outlook">
        <h2 className="text-2xl font-semibold text-brand-dark mb-3 pb-2 border-b-2 border-brand flex items-center">
          <Target className="mr-2 text-brand" /> C. Financial Guidance & Outlook (FY 2025)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="transition-all duration-300 hover:shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-brand-dark flex items-center">
                <CalendarDays className="mr-2 h-5 w-5 text-brand" /> FY 2025 Guidance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  label: "Q2 EBITA Currency Impact (Est.)",
                  value: formatSEK(outlookData.q2_2025_currency_ebita_impact),
                  icon: DollarSign,
                },
                { label: "Capex (Cash)", value: `~${formatSEK(outlookData.fy2025_capex_cash, 1)}B`, icon: Scale },
                { label: "Interest Net", value: `~${formatSEK(outlookData.fy2025_interest_net, 1)}B`, icon: Banknote },
                { label: "Normalized Tax Rate", value: outlookData.fy2025_norm_tax_rate, icon: Percent },
              ].map((item) => (
                <div key={item.label} className="flex items-center p-3 bg-slate-100 rounded-md">
                  <item.icon className="h-6 w-6 text-brand mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">{item.label}</p>
                    <p className="text-md font-semibold text-brand-dark">{item.value}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-brand-dark flex items-center">
                <ChevronsRight className="mr-2 h-5 w-5 text-brand" /> Long-Term Financial Targets
              </CardTitle>
              <CardDescription>Defined in 2022, through a business cycle.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {outlookData.longTermTargets.map((target) => (
                <div key={target.name} className="p-3 bg-slate-100 rounded-md">
                  <div className="flex items-center mb-1">
                    <target.icon className="h-5 w-5 text-brand mr-2 flex-shrink-0" />
                    <p className="text-sm font-medium text-slate-700">{target.name}</p>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <p className="text-lg font-bold text-brand-dark">
                      Target: {target.targetComparison === "lessThan" ? "<" : ""}
                      {target.targetValue || `${target.targetMin}-${target.targetMax}`}
                      {target.unit}
                    </p>
                    {target.currentValue !== undefined && (
                      <Badge
                        variant={
                          target.name === "Financial Net Debt/EBITDA" && target.currentValue < target.targetValue
                            ? "success"
                            : target.name === "Adjusted EBITA Margin" && target.currentValue >= (target.targetMin || 0)
                              ? "success"
                              : "outline"
                        }
                      >
                        Current: {target.currentValue}
                        {target.unit}
                      </Badge>
                    )}
                  </div>
                  {target.name === "Financial Net Debt/EBITDA" &&
                    target.currentValue !== undefined &&
                    target.targetValue && (
                      <Progress
                        value={(target.currentValue / target.targetValue) * 100}
                        className="h-2 mt-1"
                        indicatorClassName={target.currentValue < target.targetValue ? "bg-green-500" : "bg-red-500"}
                      />
                    )}
                  {target.name === "Adjusted EBITA Margin" &&
                    target.currentValue !== undefined &&
                    target.targetMin &&
                    target.targetMax && (
                      <Progress
                        value={(target.currentValue / target.targetMax) * 100}
                        className="h-2 mt-1"
                        indicatorClassName={target.currentValue >= target.targetMin ? "bg-green-500" : "bg-orange-400"}
                      />
                    )}
                  {target.info && <p className="text-xs text-slate-500 mt-1">{target.info}</p>}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="text-center mt-12 text-xs text-slate-500">
        All financial data sourced from Sandvik Q1 2025 Performance Report. MSEK = Millions of SEK, BSEK = Billions of
        SEK.
      </footer>
    </div>
  )
}
