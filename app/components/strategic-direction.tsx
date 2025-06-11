// app/components/strategic-direction.tsx
"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import {
  Target,
  Lightbulb,
  Briefcase,
  Wrench,
  Globe,
  TrendingUp,
  TrendingDown,
  Factory,
  MapPin,
  Settings2,
  Layers3,
  Rocket,
  Gem,
  Leaf,
  HardHat,
  Bolt,
  Handshake,
  BarChartHorizontalBig,
  ListChecks,
  PieChartIcon,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RegionalRevenuePieChart } from "./regional-revenue-pie-chart" // Restored import

interface StrategicPillarProps {
  icon: React.ElementType
  title: string
  description: string
  details?: string[]
  color?: string
}

const StrategicPillarCard: React.FC<StrategicPillarProps> = ({
  icon: Icon,
  title,
  description,
  details,
  color = "text-brand-accent",
}) => (
  <Card className="hover:shadow-lg transition-shadow duration-300 h-full bg-white dark:bg-slate-800/60">
    <CardHeader className="pb-3">
      <div className="flex items-center space-x-3">
        <Icon className={`w-8 h-8 ${color}`} />
        <CardTitle className="text-xl text-brand-dark dark:text-slate-100">{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{description}</p>
      {details && details.length > 0 && (
        <ul className="space-y-1 text-xs text-slate-500 dark:text-slate-400 list-disc list-inside">
          {details.map((detail, index) => (
            <li key={index}>{detail}</li>
          ))}
        </ul>
      )}
    </CardContent>
  </Card>
)

interface RegionalPerformanceProps {
  region: string
  orderIntakeChange: string
  orderIntakeShare: string
  revenueChange: string
  revenueShare: string
  icon: React.ElementType
  trend: "up" | "down" | "neutral"
}

const RegionalPerformanceCard: React.FC<RegionalPerformanceProps> = ({
  region,
  orderIntakeChange,
  orderIntakeShare,
  revenueChange,
  revenueShare,
  icon: Icon,
  trend,
}) => {
  const trendColor = trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-slate-500"
  const trendIcon =
    trend === "up" ? (
      <TrendingUp className="w-4 h-4 ml-1" />
    ) : trend === "down" ? (
      <TrendingDown className="w-4 h-4 ml-1" />
    ) : null

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-slate-800/60">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon className={`w-6 h-6 ${trendColor}`} />
            <CardTitle className="text-lg text-brand-dark dark:text-slate-100">{region}</CardTitle>
          </div>
          {trendIcon}
        </div>
      </CardHeader>
      <CardContent className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
        <div className="flex justify-between">
          <span>Order Intake Change:</span>
          <span className={`font-semibold ${trendColor}`}>{orderIntakeChange}</span>
        </div>
        <div className="flex justify-between">
          <span>Order Intake Share:</span>
          <span className="font-semibold">{orderIntakeShare}</span>
        </div>
        <div className="flex justify-between">
          <span>Revenue Change:</span>
          <span className={`font-semibold ${trendColor}`}>{revenueChange}</span>
        </div>
        <div className="flex justify-between">
          <span>Revenue Share:</span>
          <span className="font-semibold">{revenueShare}</span>
        </div>
      </CardContent>
    </Card>
  )
}

interface BusinessAreaPerformanceData {
  area: string
  icon: React.ElementType
  orderIntakeInfo: string
  marginInfo: string
  highlights: string[]
  badgeText?: string
  badgeVariant?: "default" | "destructive" | "outline" | "secondary" | "success" | "warning" | "info"
}

const BusinessAreaCard: React.FC<BusinessAreaPerformanceData> = ({
  area,
  icon: Icon,
  orderIntakeInfo,
  marginInfo,
  highlights,
  badgeText,
  badgeVariant = "info",
}) => {
  return (
    <Card className="flex flex-col border-t-0 rounded-t-none border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Icon className="w-7 h-7 text-brand-accent" />
            <CardTitle className="text-xl text-brand-dark dark:text-slate-100">{area}</CardTitle>
          </div>
          {badgeText && (
            <Badge variant={badgeVariant} className="text-xs font-medium">
              {badgeText}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2 mb-4">
          <p className="text-base text-slate-700 dark:text-slate-300">
            <strong className="font-bold text-brand-dark-secondary dark:text-slate-200">Order Intake:</strong>{" "}
            {orderIntakeInfo}
          </p>
          <p className="text-base text-slate-700 dark:text-slate-300">
            <strong className="font-bold text-brand-dark-secondary dark:text-slate-200">Adjusted EBITA Margin:</strong>{" "}
            {marginInfo}
          </p>
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-bold text-brand-dark dark:text-slate-200 tracking-wider uppercase mb-3 flex items-center">
            <ListChecks className="w-4 h-4 mr-2 text-brand-accent" />
            Key Highlights
          </h4>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300 list-none pl-0">
            {highlights.map((highlight, index) => (
              <li key={index} className="flex items-start">
                <span className="text-brand-accent mr-2.5 mt-1 text-lg">&#8227;</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

// Restored regionalRevenueData for Pie Chart
const regionalRevenueData = {
  labels: ["Europe", "North America", "Asia", "Africa & M.E.", "Australia", "South America"],
  datasets: [
    {
      label: "Revenue Share",
      data: [26, 25, 17, 12, 12, 7], // Sums to 99, ideally should be 100 or normalized
      backgroundColor: [
        "rgba(54, 162, 235, 0.7)", // Blue
        "rgba(75, 192, 192, 0.7)", // Green
        "rgba(255, 206, 86, 0.7)", // Yellow
        "rgba(255, 159, 64, 0.7)", // Orange
        "rgba(153, 102, 255, 0.7)", // Purple
        "rgba(255, 99, 132, 0.7)", // Red
      ],
      borderColor: [
        "rgba(54, 162, 235, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(255, 159, 64, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 99, 132, 1)",
      ],
      borderWidth: 1,
    },
  ],
}

export default function StrategicDirectionSection() {
  return (
    <div className="space-y-8 p-4 md:p-6 bg-slate-50 dark:bg-slate-900 rounded-lg">
      <Card className="bg-gradient-to-r from-brand-dark to-brand-dark-secondary text-white shadow-xl">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Rocket className="w-10 h-10 text-brand-accent" />
            <div>
              <CardTitle className="text-3xl">Strategic Direction & Operational Execution</CardTitle>
              <CardDescription className="text-slate-300">
                Sandvik Group&apos;s roadmap for sustainable growth, innovation, and market leadership in Q1 2025.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Accordion type="multiple" defaultValue={["market"]} className="w-full space-y-6">
        {/* A. Current Goals and Strategic Progress */}
        <AccordionItem value="goals" className="border-none">
          <Card className="shadow-lg bg-white dark:bg-slate-800/60">
            <AccordionTrigger className="bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 px-6 py-4 rounded-t-lg">
              <div className="flex items-center space-x-3">
                <Target className="w-6 h-6 text-brand-accent" />
                <h3 className="text-xl font-semibold text-brand-dark dark:text-slate-100">
                  A. Current Goals and Strategic Progress
                </h3>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-6 bg-white dark:bg-slate-800/30 rounded-b-lg">
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
                Sandvik&apos;s strategy focuses on sustainable growth (7% target through business cycle via organic &
                M&A) and profitability (Adjusted EBITA margin target 20-22%).
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <StrategicPillarCard
                  icon={Bolt}
                  title="Electrification & Innovation"
                  description="Launched electric options for rotary drilling rigs (DR410iE/DR411iE) and a new electric-driven cone crusher (QH443E)."
                  details={[
                    "Addresses gap in surface mining portfolio.",
                    "Optimizes production lines, saves fuel, reduces oil usage.",
                    "Meets customer demand for sustainability and efficiency.",
                  ]}
                  color="text-yellow-500"
                />
                <StrategicPillarCard
                  icon={Briefcase}
                  title="Strategic Acquisitions"
                  description="Nine acquisitions announced in Q1 2025, focusing on CAM resellers and specialized niches like demolition."
                  details={[
                    "Seven CAM reseller acquisitions (FASTech, ShopWare, etc.) to strengthen CAM market position.",
                    "Acquisition of OSA Demolition Equipment to enhance offerings.",
                    "Acquisition of Verisurf (3D metrology) and parts of CIMCO.",
                    "Diversifies revenue, builds resilience.",
                  ]}
                  color="text-blue-500"
                />
                <StrategicPillarCard
                  icon={Leaf}
                  title="Sustainability Initiatives"
                  description="Deeply integrated into objectives, with improvements in TRIFR and waste circularity."
                  details={[
                    "TRIFR improved to 3.0 (from 3.1).",
                    "Waste circularity increased to 75.6% (from 73.5%).",
                    "Launched new sustainable solutions (electric drills, eco-packaging).",
                    "Collaboration with customers (e.g., Safran for carbon footprint reduction).",
                  ]}
                  color="text-green-500"
                />
              </div>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* B. Key Plans and Projects */}
        <AccordionItem value="plans" className="border-none">
          <Card className="shadow-lg bg-white dark:bg-slate-800/60">
            <AccordionTrigger className="bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 px-6 py-4 rounded-t-lg">
              <div className="flex items-center space-x-3">
                <Wrench className="w-6 h-6 text-brand-accent" />
                <h3 className="text-xl font-semibold text-brand-dark dark:text-slate-100">B. Key Plans and Projects</h3>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-6 bg-white dark:bg-slate-800/30 rounded-b-lg">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-slate-50 dark:bg-slate-700/30">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <Lightbulb className="w-5 h-5 text-purple-500" />
                      <CardTitle className="text-lg text-brand-dark dark:text-slate-200">
                        Product Development & Innovation
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                    <p>DR410iE/DR411iE electric drill rigs (AutoMine® & My Sandvik compatible).</p>
                    <p>QH443E electric cone crusher.</p>
                    <p>Strong traction for digital solutions: AutoMine®, Newtrax APDS.</p>
                    <p>Digitalization and automation are fundamental strategic pillars.</p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-50 dark:bg-slate-700/30">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <Handshake className="w-5 h-5 text-teal-500" />
                      <CardTitle className="text-lg text-brand-dark dark:text-slate-200">
                        Strategic Acquisitions & Integration
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                    <p>&quot;Roll-up&quot; strategy for CAM resellers to foster customer relations and synergies.</p>
                    <p>Integration of OSA Demolition Equipment to expand in a niche market.</p>
                  </CardContent>
                </Card>
                <Card className="md:col-span-2 bg-slate-50 dark:bg-slate-700/30">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <Factory className="w-5 h-5 text-orange-500" />
                      <CardTitle className="text-lg text-brand-dark dark:text-slate-200">
                        Manufacturing Footprint Optimization & Regionalization
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                    <p>
                      New Suzhou Ahno factory (China) ramping up volumes in 2025 for competitive positioning and
                      regionalization.
                    </p>
                    <p>
                      Prepared to increase production in existing US facilities if tariffs rise, avoiding greenfield
                      investments.
                    </p>
                    <p>
                      Global footprint allows re-balancing production and re-routing flows to mitigate tariff impacts.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* C. Market Dynamics and Segmental Performance */}
        <AccordionItem value="market" className="border-none">
          <Card className="shadow-lg bg-transparent">
            <AccordionTrigger className="bg-white dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800 px-6 py-4 rounded-t-lg">
              <div className="flex items-center space-x-3">
                <BarChartHorizontalBig className="w-6 h-6 text-brand-accent" />
                <h3 className="text-xl font-semibold text-brand-dark dark:text-slate-100">
                  C. Market Dynamics and Segmental Performance
                </h3>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-6 bg-slate-50 dark:bg-slate-900 rounded-b-lg">
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
                Varied regional and segmental demand in Q1 2025, reflecting a mixed global economic environment.
              </p>

              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <PieChartIcon className="w-5 h-5 text-brand-accent" /> {/* Restored Icon */}
                  <h4 className="text-lg font-semibold text-brand-dark-secondary dark:text-slate-200">
                    Regional Revenue Share Overview
                  </h4>
                </div>
                <RegionalRevenuePieChart data={regionalRevenueData} /> {/* Restored Pie Chart */}
              </div>

              <div className="mb-8 mt-12">
                <h4 className="text-lg font-semibold text-brand-dark-secondary dark:text-slate-200 mb-3">
                  Regional Demand Details (Order Intake Y/Y Q1 2025)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <RegionalPerformanceCard
                    region="Europe"
                    orderIntakeChange="-8%"
                    orderIntakeShare="26%"
                    revenueChange="-5%"
                    revenueShare="26%"
                    icon={MapPin}
                    trend="down"
                  />
                  <RegionalPerformanceCard
                    region="North America"
                    orderIntakeChange="+4%"
                    orderIntakeShare="24%"
                    revenueChange="+1%"
                    revenueShare="25%"
                    icon={MapPin}
                    trend="up"
                  />
                  <RegionalPerformanceCard
                    region="Asia"
                    orderIntakeChange="+9%"
                    orderIntakeShare="18%"
                    revenueChange="+3%"
                    revenueShare="17%"
                    icon={MapPin}
                    trend="up"
                  />
                  <RegionalPerformanceCard
                    region="Africa & Middle East"
                    orderIntakeChange="+2%"
                    orderIntakeShare="12%"
                    revenueChange="+4%"
                    revenueShare="12%"
                    icon={MapPin}
                    trend="up"
                  />
                  <RegionalPerformanceCard
                    region="Australia"
                    orderIntakeChange="+12%"
                    orderIntakeShare="12%"
                    revenueChange="+5%"
                    revenueShare="12%"
                    icon={MapPin}
                    trend="up"
                  />
                  <RegionalPerformanceCard
                    region="South America"
                    orderIntakeChange="+8%"
                    orderIntakeShare="8%"
                    revenueChange="+6%"
                    revenueShare="7%"
                    icon={MapPin}
                    trend="up"
                  />
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-lg font-semibold text-brand-dark-secondary dark:text-slate-200 mb-4">
                  Performance by Business Area
                </h4>
                <Tabs defaultValue="smr" className="w-full">
                  <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto md:h-12 p-0 bg-transparent border-b border-slate-200 dark:border-slate-700 rounded-none">
                    <TabsTrigger
                      value="smr"
                      className="text-xs md:text-sm whitespace-normal py-2.5 rounded-none border-b-2 border-transparent data-[state=active]:border-brand-accent data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-brand-dark dark:data-[state=active]:text-slate-50 text-slate-500 dark:text-slate-400"
                    >
                      Sandvik Mining & Rock Solutions (SMR)
                    </TabsTrigger>
                    <TabsTrigger
                      value="srp"
                      className="text-xs md:text-sm whitespace-normal py-2.5 rounded-none border-b-2 border-transparent data-[state=active]:border-brand-accent data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-brand-dark dark:data-[state=active]:text-slate-50 text-slate-500 dark:text-slate-400"
                    >
                      Sandvik Rock Processing Solutions (SRP)
                    </TabsTrigger>
                    <TabsTrigger
                      value="smm"
                      className="text-xs md:text-sm whitespace-normal py-2.5 rounded-none border-b-2 border-transparent data-[state=active]:border-brand-accent data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-brand-dark dark:data-[state=active]:text-slate-50 text-slate-500 dark:text-slate-400"
                    >
                      Sandvik Manufacturing & Machining Solutions (SMM)
                    </TabsTrigger>
                  </TabsList>
                  <div className="bg-white dark:bg-slate-900 rounded-b-lg shadow-md">
                    <TabsContent value="smr" className="mt-0 p-4">
                      <BusinessAreaCard
                        area="Sandvik Mining and Rock Solutions (SMR)"
                        icon={HardHat}
                        orderIntakeInfo="Strong organic growth (+10%), double-digit in equipment, +5% in aftermarket (excl. major prior year order)."
                        marginInfo="20.8% (up from 18.2%), benefiting from savings and currency."
                        highlights={["Robust order pipeline, three major orders (SEK 977M)."]}
                        badgeText="Strong Growth"
                        badgeVariant="success"
                      />
                    </TabsContent>
                    <TabsContent value="srp" className="mt-0 p-4">
                      <BusinessAreaCard
                        area="Sandvik Rock Processing Solutions (SRP)"
                        icon={Layers3}
                        orderIntakeInfo="Decreased by 3% (organic -2%), but +2% organic excl. major orders. Revenues +7% (organic +8%)."
                        marginInfo="Improved to 15.1% (up from 13.3%), driven by savings and cost control."
                        highlights={["Stable mining demand, low infrastructure activity in Europe."]}
                        badgeText="Mixed Demand"
                        badgeVariant="warning"
                      />
                    </TabsContent>
                    <TabsContent value="smm" className="mt-0 p-4">
                      <BusinessAreaCard
                        area="Sandvik Manufacturing and Machining Solutions (SMM)"
                        icon={Settings2}
                        orderIntakeInfo="Decreased by 3% (organic -6%). Subdued industrial activity."
                        marginInfo="Resilient at 20.9% (up from 20.3%) despite lower volumes, due to cost control."
                        highlights={[
                          "Cutting tools orders declined in general engineering & automotive.",
                          "Software business grew mid-single digits (strong US performance).",
                          "Powder order intake declined Y/Y (timing effect after high Q4).",
                        ]}
                        badgeText="Challenged"
                        badgeVariant="destructive"
                      />
                    </TabsContent>
                  </div>
                </Tabs>
              </div>

              <div className="mt-8">
                <h4 className="text-lg font-semibold text-brand-dark-secondary dark:text-slate-200 mb-3">
                  Specific Market Observations
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-300">
                  <Card className="bg-slate-50 dark:bg-slate-700/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md flex items-center text-brand-dark dark:text-slate-200">
                        <Gem className="w-4 h-4 mr-2 text-yellow-600" />
                        Commodity Prices
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Positive for gold (record highs) and copper (healthy levels), encouraging full capacity
                        operation.
                      </p>
                      <p>Nickel and iron ore experienced more hesitation.</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-50 dark:bg-slate-700/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md flex items-center text-brand-dark dark:text-slate-200">
                        <Globe className="w-4 h-4 mr-2 text-blue-600" />
                        China
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Cutting tools demand down low-single digits. Local premium and core segments showed similar
                        performance.
                      </p>
                      <p>
                        Export restrictions on tungsten raw material: potential upside for Sandvik as a major
                        non-Chinese supplier and recycler.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-50 dark:bg-slate-700/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md flex items-center text-brand-dark dark:text-slate-200">
                        <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
                        India
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Demonstrated strong growth, offsetting negative developments in China within Asia.</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-50 dark:bg-slate-700/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md flex items-center text-brand-dark dark:text-slate-200">
                        <MapPin className="w-4 h-4 mr-2 text-red-600" />
                        US Market
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Positive trend in infrastructure. Software growth driven by US demand.</p>
                      <p>Local manufacturing capacity for inserts can be leveraged for rebalancing production.</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </AccordionContent>
          </Card>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
