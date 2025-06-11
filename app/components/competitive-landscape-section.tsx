"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Swords,
  HardHat,
  Layers3,
  Settings2,
  Star,
  Zap,
  AlertTriangle,
  TrendingUp,
  Globe,
  Flag,
  UsersIcon,
  PieChartIcon as LucidePieChartIcon,
  ShieldOff,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Chart.js imports
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { Pie } from "react-chartjs-2"
import ChartDataLabels from "chartjs-plugin-datalabels"

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels)

// --- Helper function to parse revenue strings to USD ---
const EXCHANGE_RATES_TO_USD = {
  USD: 1,
  EUR: 1.08,
  GBP: 1.27,
  SEK: 0.095, // 1 / 10.5
  JPY: 0.00637, // 1 / 157
  DKK: 0.144, // 1 / 6.9
}

function parseRevenueToUSD(revenueString?: string): number | null {
  if (!revenueString) return null

  let baseValue: number
  let currency: keyof typeof EXCHANGE_RATES_TO_USD
  let annualizationFactor = 1

  // Normalize string: remove commas, trim
  const normalizedStr = revenueString.replace(/,/g, "").trim()

  // Check for quarterly or half-year indicators for annualization
  if (/$$Q\d\s*\d{4}.*$$/i.test(normalizedStr)) {
    annualizationFactor = 4
  } else if (/$$First six months \d{4}.*$$/i.test(normalizedStr)) {
    annualizationFactor = 2
  }

  // Try to extract currency code first (USD, EUR, etc.)
  // Regex: Optional currency symbol, then optional currency code, then number, then optional unit
  const pattern = /^([$€])?(USD|EUR|GBP|SEK|JPY|DKK)?\s*([\d.]+)\s*(B|BILLION|M|MILLION)?/i
  const match = normalizedStr.match(pattern)

  if (match) {
    const symbol = match[1]
    const explicitCurrencyCode = match[2]?.toUpperCase()
    const valueStr = match[3]
    const unit = match[4]?.toUpperCase()

    baseValue = Number.parseFloat(valueStr)
    if (isNaN(baseValue)) return null

    if (unit === "B" || unit === "BILLION") baseValue *= 1_000_000_000
    else if (unit === "M" || unit === "MILLION") baseValue *= 1_000_000

    if (explicitCurrencyCode && EXCHANGE_RATES_TO_USD[explicitCurrencyCode as keyof typeof EXCHANGE_RATES_TO_USD]) {
      currency = explicitCurrencyCode as keyof typeof EXCHANGE_RATES_TO_USD
    } else if (symbol === "$") {
      currency = "USD"
    } else if (symbol === "€") {
      currency = "EUR"
    } else {
      // If no symbol and no explicit code, it might be like "SEK 21,117 million..."
      // This case is tricky if the first word isn't a currency code.
      // For this dataset, most are covered by symbol or explicit code.
      // Let's check if the first word of the original string is a currency code
      const firstWord = normalizedStr.split(" ")[0].toUpperCase()
      if (EXCHANGE_RATES_TO_USD[firstWord as keyof typeof EXCHANGE_RATES_TO_USD]) {
        currency = firstWord as keyof typeof EXCHANGE_RATES_TO_USD
        // Re-parse value part if currency code was the first word
        const restOfStringForValue = normalizedStr.substring(firstWord.length).trim()
        const valueAndUnitOnlyMatch = restOfStringForValue.match(/^([\d.]+)\s*(B|BILLION|M|MILLION)?/i)
        if (valueAndUnitOnlyMatch) {
          baseValue = Number.parseFloat(valueAndUnitOnlyMatch[1])
          const unitOnly = valueAndUnitOnlyMatch[2]?.toUpperCase()
          if (unitOnly === "B" || unitOnly === "BILLION") baseValue *= 1_000_000_000
          else if (unitOnly === "M" || unitOnly === "MILLION") baseValue *= 1_000_000
        } else {
          return null // Cannot parse value after finding currency code
        }
      } else {
        return null // Cannot determine currency
      }
    }
  } else {
    return null // Pattern did not match
  }

  if (isNaN(baseValue)) return null

  return baseValue * annualizationFactor * EXCHANGE_RATES_TO_USD[currency]
}
// --- End Helper Function ---

interface Competitor {
  name: string
  globalRevenue?: string
  revenueForMarketShareUSD?: number
  countryOfOrigin?: string
  companySize?: string
  strengths: string[]
  weaknesses: string[]
  differentiators: string[]
  risks: string[]
  opportunities: string[]
  notes?: string
}

interface MarketShareDataPoint {
  name: string
  value: number
  fill: string
}

interface BusinessAreaCompetitors {
  id: string
  name: string
  icon: React.ElementType
  description: string
  competitors: Competitor[]
  sandvikIllustrativeMarketShare: number
  marketVisionText: string
}

const competitorDataRaw: BusinessAreaCompetitors[] = [
  {
    id: "smr",
    name: "Sandvik Mining and Rock Solutions (SMR)",
    icon: HardHat,
    sandvikIllustrativeMarketShare: 21,
    marketVisionText:
      "Sandvik SMR continues to lead in mining innovation, capitalizing on strong commodity prices (gold, copper) and customer investment in productivity and sustainability. The segment's robust Q1 2025 performance (10% organic order growth, 20.8% EBITA margin) is driven by its focus on electrification (e.g., DR410iE/DR411iE electric rotary drills), automation (AutoMine®, Newtrax APDS), and full lifecycle solutions. Competition is intense, with global players also emphasizing digital and sustainable offerings, but Sandvik's integrated approach, strong aftermarket, and proactive risk mitigation for tariffs provide a competitive edge. 'Others' represent a diverse group of regional and niche technology providers.",
    description:
      "Key competitors in the global mining equipment, services, and solutions market, including automation, electrification, digital technologies, and aftermarket support. Sandvik SMR achieved a 20.8% Adjusted EBITA margin in Q1 2025.",
    competitors: [
      {
        name: "Metso",
        countryOfOrigin: "Finland",
        companySize: "16,832 employees (2024)",
        globalRevenue: "EUR 4,863 million (2024)",
        strengths: [
          "Flexible manufacturing, high-quality sustainable products.",
          "Frontrunner in sustainable technologies for aggregates, minerals processing, metals refining.",
          "Strong product/process expertise, improving customer energy/water efficiency.",
          "High employee engagement (eNPS 54), Planet Positive solutions growing faster than overall sales.",
          "Strong safety culture, end-to-end solutions.",
        ],
        weaknesses: [
          "Market activity in 2024 weaker due to macroeconomic uncertainties and slower customer investment decisions.",
          "Mobile equipment markets (North America, Europe) suffered from high financing costs and large inventory levels in 2024.",
        ],
        differentiators: [
          "Commitment to 1.5-degree climate target.",
          "Wide portfolio of Planet Positive solutions.",
          "Strong focus on customer success, sustainability, and performance culture.",
        ],
        risks: ["Strategic, commercial, operational, and financial risks requiring continuous systematic assessment."],
        opportunities: [
          "Sustainable practices and Planet Positive solutions.",
          "Responsible processing of battery minerals (lithium, nickel) and recycling of secondary sources (black mass).",
          "Digitalization and advanced analytics with machine learning/AI.",
        ],
      },
      {
        name: "Epiroc",
        countryOfOrigin: "Sweden",
        companySize: "N/A in provided doc (previously ~19,000)",
        globalRevenue: "USD 6.00 billion (2024)",
        strengths: [
          "Strong focus on sustainability (circular solutions: battery, electrical services, underground electrification).",
          "Comprehensive digital solutions (CONNECT, PROTECT, PLAN, AUTOMATE, OPERATE, SUSTAIN).",
          "Wide range of products for mining, construction, demolition, and recycling.",
          "Significant aftermarket business for resilience.",
        ],
        weaknesses: [
          "Credit metrics materially weakened in 2024 due to substantial acquisition spending (SEK 8.1B debt increase).",
          "S&P Global Ratings-adjusted EBITDA margin declined to 22.9% (from 25.4% in 2023).",
          "Profitability pressured by dilutive acquisitions, one-off costs, and T&A segment under-absorption.",
          "Smaller and less diversified than some peers, high mining exposure (75-80% of orders) increases potential downside risks.",
        ],
        differentiators: [
          "Strong emphasis on electrification and battery solutions.",
          "OEM-agnostic automation and information management solutions.",
        ],
        risks: [
          "Geopolitical changes and instability.",
          "Market and technology innovation affecting demand.",
          "Climate adaptation risks (resource prices, access to natural resources).",
          "Intense competition (pricing, product design, service quality).",
          "Failure to meet synergy effects from acquisitions, execution risk with M&A strategy.",
        ],
        opportunities: [
          "Further development of aftermarket business.",
          "Lean initiatives for agile setup.",
          "Offering climate-resilient solutions to customers.",
          "Increase operational efficiency and lower costs, strengthening competitive edge through innovation.",
        ],
      },
      {
        name: "Komatsu (Mining Equipment)",
        countryOfOrigin: "Japan",
        companySize: "65,738 employees (consolidated)",
        globalRevenue: "JPY 3,865.1 billion (FYE March 2025, consolidated)",
        notes: "Using consolidated revenue as mining specific not directly comparable for total market share.",
        strengths: [
          "Durability edge in equipment, high profit margin in mining equipment (27%).",
          "Resilient mining demand (U.S. coal and critical minerals policies).",
          "Leadership in electrification and autonomous systems (acquired U.S. battery startup).",
          "Strong financial position (100 billion yen share buyback, 1 trillion yen FCF target).",
          "Culture of zero harm, strong safety principles and training.",
        ],
        weaknesses: [
          "Considered a 'Disruptor' in the US Construction Machinery Manufacturing industry: displays lower to medium market share that is rising rapidly, but with weaker profits compared to some peers.",
        ],
        differentiators: [
          "Focus on zero-emission machinery.",
          "Strong emphasis on safety culture and training.",
          "Price discipline.",
        ],
        risks: [
          "Competitive dynamics recalibrated by trade truces.",
          "Risk of Chinese rivals closing the performance-cost gap (aggressive pricing, scale advantages).",
          "Demand elasticity test with price hikes.",
          "Geopolitical tensions, volatility in mineral commodity prices affecting investment plans.",
        ],
        opportunities: [
          "Geographic diversification of production (e.g., shifting from China to Thailand).",
          "Acquisitions in electrification and autonomous systems.",
          "Structural shifts towards electrification and autonomy shielding from commodity price swings.",
        ],
      },
      {
        name: "FLSmidth",
        countryOfOrigin: "Denmark",
        globalRevenue: "USD 2.91 billion (2024)",
        notes: "Mining-related business increased to 65% of operations after Mining Technologies integration.",
        strengths: [
          "Moderate 13% net income growth over the past five years.",
          "Healthy combination of moderate payout ratio (35%) and respectable earnings growth.",
          "Long history of dividend payments.",
          "Strong financial performance in Mining driving upgraded full-year guidance (Q1 2025).",
        ],
        weaknesses: [
          "Stock was down 22% over the three months prior to April 2025.",
          "Return on Equity (ROE) of 8.7% is similar to industry average, not particularly high.",
          "Order intake decreased by 12% in Q1 2025, with products order intake down 27%.",
        ],
        differentiators: ["Focus on mining and cement industries implied."],
        risks: [
          "Stock weakness.",
          "Uncertainties regarding economic, business, social, health, and geopolitical conditions.",
        ],
        opportunities: [
          "Expected future ROE to rise to 13% despite anticipated increase in payout ratio.",
          "Opportunities to increase operational efficiency and lower costs.",
        ],
      },
      {
        name: "WEIR",
        countryOfOrigin: "UK",
        companySize: "11,444 employees",
        globalRevenue: "GBP 2.51 billion (LTM)",
        strengths: ["Strong free cash flow generation, operating at close to 100% cash conversion."],
        weaknesses: [
          "S&P Global Ratings-adjusted debt to EBITDA expected to increase to ~2.4x in 2025 (Micromine acquisition).",
          "Funds from operations (FFO) to debt projected to decline to ~28%-30%.",
          "Sales declined in 2024 with slowdown in global mining activity and lower order book YoY.",
        ],
        differentiators: ["N/A in provided doc."],
        risks: [
          "Acquisition execution risk (Micromine), potentially hampering leverage and profit margins.",
          "Potential for adjusted EBITDA margins to decrease below 20% or FFO to debt below 30% in 2026.",
        ],
        opportunities: [
          "Expected sales increase by ~6%-8% in 2025 (Micromine integration).",
          "Adjusted EBITDA margins rising to ~21.0%-22.2% (2025 proj.).",
          "Continued pursuit of potentially attractive acquisition targets.",
        ],
      },
      {
        name: "Terex",
        countryOfOrigin: "Connecticut, US",
        companySize: "8,600 employees",
        globalRevenue: "$1.23 billion (Q1 2025)",
        notes: "Using annualized Q1 2025 total revenue for comparison. MP segment is part of this.",
        strengths: [
          "Offers range of crushing & screening equipment (mobile, temporary, static).",
          "Strong brands (Cedarapids, Simplicity, Canica).",
          "Focuses on high productivity and lower costs per ton.",
          "Committed to continuous product innovation (new static jaw crushers, portable cone crushers).",
        ],
        weaknesses: [
          "Q1 2025 revenue declined by 4.9% YoY.",
          "Net sales in Aerial Work Platforms (AWP) decreased 41.8% YoY (Q1 2025).",
          "Materials Processing & Mining (MP) sales decreased 26.5% YoY (Q1 2025).",
        ],
        differentiators: [
          "Specialization in crushing & screening equipment.",
          "Offering both static and mobile solutions.",
          "Focus on durability and performance.",
        ],
        risks: ["General SWOT risks (economic downturns, increased competition, changing regulations)."],
        opportunities: [
          "New product development and market expansion.",
          "Aims to meet diverse customer application needs.",
        ],
      },
      {
        name: "Atlas Copco",
        countryOfOrigin: "Sweden",
        companySize: "48,951 employees",
        globalRevenue: "SEK 176,771 million (2024)",
        strengths: [
          "Strong global presence (operations in >180 countries).",
          "Diversified product portfolio.",
          "High emphasis on innovation and R&D.",
          "Strong brand reputation and customer loyalty.",
          "Robust financial performance and profitability.",
        ],
        weaknesses: [
          "Exposure to cyclical industries (mining, construction).",
          "High dependency on raw material prices.",
          "Complex organizational structure.",
          "Potential vulnerability to geopolitical risks.",
          "High R&D costs.",
        ],
        differentiators: [
          "World-leading provider of sustainable productivity solutions.",
          "Serves industries with innovative compressors, vacuum solutions, air treatment systems, construction/mining equipment, power tools, assembly systems.",
        ],
        risks: [
          "Intense competition from global and regional players.",
          "Economic downturns affecting capital investments.",
          "Fluctuating raw material and energy prices.",
          "Regulatory changes and compliance costs.",
          "Technological disruptions and cybersecurity risks.",
        ],
        opportunities: [
          "Expansion in emerging markets.",
          "Growth in sustainable and energy-efficient solutions.",
          "Digital transformation and Industry 4.0.",
          "Strategic acquisitions and partnerships.",
          "Increased focus on aftermarket services.",
        ],
      },
      {
        name: "John Deere",
        countryOfOrigin: "USA",
        companySize: "75,800 employees",
        globalRevenue: "$21.272 billion (First six months 2025)",
        notes:
          "Using annualized revenue for comparison. 37.8% US Tractors & Ag. Machinery Mfg; 5.4% global construction machinery (2022).",
        strengths: [
          "Major player in agricultural and construction machinery.",
          "Well-known for tractors and loaders.",
          "Strong commitment to US manufacturing, jobs, community growth.",
        ],
        weaknesses: [
          "Worldwide net sales/revenues decreased 16% for Q2 2025 (22% for six months).",
          "Construction & Forestry sales decreased 23% for Q2 2025 (lower shipment volumes, unfavorable price realization).",
          "High initial investment/maintenance costs for advanced tech tractors (barrier for small/medium farms).",
        ],
        differentiators: [
          "Long history (founded in 1837).",
          "Strong brand recognition in agriculture and construction.",
        ],
        risks: [
          "Fluctuating fuel prices and trade policies (barriers for electric farm equipment adoption).",
          "High cost prevents extensive tractor use (low farm revenues, poor credit access areas).",
        ],
        opportunities: [
          "Governments enacting tough emission regulations (mandating eco-friendly solutions).",
          "Geographic diversification of production.",
        ],
      },
      {
        name: "Volvo Construction Equipment",
        countryOfOrigin: "Sweden",
        globalRevenue: "SEK 21,117 million (Q1 2025, net sales)",
        strengths: [
          "Continues to push innovation (new products/services).",
          "Resilience in uncertainty, solid performance.",
          "Rise in service sales, increased orders/deliveries.",
          "Pioneering 100% zero-emission lineup (A30 Electric hauler).",
        ],
        weaknesses: [
          "Global sales dropped 8% in Q1 2025 (vs high Q1 2024).",
          "Machine sales decreased 10% (currency adj.).",
          "Lower volumes in Europe/North America (geopolitical/market uncertainty).",
          "Earnings impacted by market decline in Q1 2025.",
        ],
        differentiators: ["Strong commitment to sustainable change (all-electric lineup, service solutions)."],
        risks: ["Turbulent times, increased geopolitical and market uncertainty."],
        opportunities: [
          "Growth in South America and Asia.",
          "Dealer inventory normalizing (Europe/NA).",
          "Orders for SDLG branded machines improved 30% (China market).",
          "Commitment to digitalization (partnership with Unicontrol for 3D machine control).",
        ],
      },
      {
        name: "Outotec (now part of Metso)",
        countryOfOrigin: "Finland (Metso Outotec)",
        companySize: "15,000+ (Metso Outotec)",
        globalRevenue: "EUR 4.86 billion (Metso Outotec 2024)", // Same as Metso's main entry
        notes: "Data reflects Metso. 36% aggregates business brand market share in North America (Metso Outotec).",
        strengths: [
          "Leading company with wide presence across value chain (end-to-end offering in minerals processing).",
          "Enlarged installed base, advanced service offering.",
          "Leadership in sustainable technology across all businesses.",
          "Breadth across verticals, geography, application enhances performance.",
          "Achieved significant merger synergies (€142M by end 2021).",
        ],
        weaknesses: [
          "European market tougher since Feb 2022 (war, inflation, energy prices).",
          "Experienced supply chain disruption (pandemic, other factors).",
        ],
        differentiators: [
          "End-to-end offering in minerals processing.",
          "Strong service side with great global presence.",
          "Focus on diesel-electric hybrid solutions.",
        ],
        risks: ["General market challenges and geopolitical impacts."],
        opportunities: [
          "Growing take-up of Life Cycle Services (LCS) contracts (aggregates, India).",
          "Significant investment in diesel-electric hybrid plants (~90% track-mounted mobile range compatible).",
        ],
      },
    ],
  },
  {
    id: "srp",
    name: "Sandvik Rock Processing Solutions (SRP)",
    icon: Layers3,
    sandvikIllustrativeMarketShare: 23,
    marketVisionText:
      "Sandvik SRP is navigating a mixed demand environment, with stable mining activity contrasting subdued infrastructure demand, particularly in Europe (Q1 2025). The launch of innovative electric solutions like the QH443E cone crusher (optimizing production, fuel savings) underscores SRP's commitment to sustainability and operational efficiency, positioning it for future growth as infrastructure spending recovers. The Adjusted EBITA margin improved to 15.1% in Q1 2025 due to savings and cost control. Competition is fragmented, especially in infrastructure, involving global players and regional specialists. 'Others' include a wide array of local manufacturers and niche solution providers.",
    description:
      "Competitors in rock processing solutions for mining and infrastructure, including crushing, screening, and mobile equipment. Sandvik SRP's revenues grew 8% organically in Q1 2025.",
    competitors: [
      {
        name: "Metso",
        countryOfOrigin: "Finland",
        globalRevenue: "EUR 4,863 million (2024)",
        strengths: [
          "Strong in aggregates and minerals processing.",
          "Planet Positive solutions applicable to rock processing.",
          "End-to-end solutions for quarrying.",
        ],
        weaknesses: ["Mobile equipment markets faced challenges in 2024 (high financing costs, inventory)."],
        differentiators: ["Planet Positive portfolio.", "Focus on customer success and sustainability in processing."],
        risks: ["Cyclicality of infrastructure and construction affecting aggregates demand."],
        opportunities: ["Growth in recycling applications for aggregates.", "Sustainable processing solutions."],
      },
      {
        name: "Terex (Materials Processing)",
        countryOfOrigin: "Connecticut, US",
        globalRevenue: "$2.2B (MP Segment FY2023 from prev data)",
        notes: "Using MP segment-specific revenue for relevance. Total Terex Q1 2025 was $1.23B (annualized $4.92B).",
        strengths: [
          "Range of crushing & screening equipment (Powerscreen, Finlay brands).",
          "Mobile, temporary, static solutions.",
          "Focus on productivity and lower cost per ton.",
        ],
        weaknesses: ["Materials Processing & Mining (MP) sales decreased 26.5% YoY in Q1 2025."],
        differentiators: ["Specialization in crushing & screening.", "Static and mobile solutions."],
        risks: ["Economic downturns affecting construction and infrastructure."],
        opportunities: ["New product development for diverse applications."],
      },
      {
        name: "Keestrack",
        countryOfOrigin: "Belgium (Implied European focus)",
        globalRevenue: "N/A (Privately owned)",
        strengths: [
          "Designs/produces mobile screening/crushing in-house (quality, innovation, flexibility).",
          "Pioneers in direct feed screens.",
          "User-friendly products (operate, maintain, access parts), focus on productivity, safety, ease of use.",
          "Lowest cost per ton (energy efficiency: hydraulic electric/hybrid, fuel-saving load sensing).",
          "Remote monitoring (Keestrack-er software).",
        ],
        weaknesses: ["N/A in provided doc."],
        differentiators: [
          "Strong emphasis on fuel efficiency and low operating costs.",
          "High mobility without compromising productivity.",
          "'Performance in every detail' philosophy, integrated customer care program.",
        ],
        risks: ["N/A in provided doc."],
        opportunities: [
          "Alternative electric models available.",
          "Continuously updates and explores new avenues for customer benefit.",
          "Expanding range of jaw, cone, and impact crushers, screens, and stackers.",
        ],
      },
      {
        name: "Furukawa (Rock Drill)",
        countryOfOrigin: "Japan",
        globalRevenue: "JPY 201.22 billion (FYE March 2025, Furukawa Co Ltd consolidated)",
        notes: "Consolidated revenue. Rock Drill is a segment.",
        strengths: ["Recognized key player in global Rock Drilling Jumbo market."],
        weaknesses: ["Overall company's forecasted revenue for FY26 expected to decrease by 4.1%."],
        differentiators: ["N/A in provided doc."],
        risks: ["N/A in provided doc."],
        opportunities: ["Benefits from growth in mining activities and construction projects (developing economies)."],
      },
      {
        name: "Epiroc",
        countryOfOrigin: "Sweden",
        globalRevenue: "USD 6.00 billion (2024)",
        notes: "Construction (incl. quarrying) is 20-25% of orders. Using total revenue for calculation.",
        strengths: ["Wide range of products for quarrying and construction.", "Digital solutions applicable."],
        weaknesses: ["High mining exposure overall, but has construction segment."],
        differentiators: ["OEM-agnostic automation.", "Battery solutions potentially for mobile processing."],
        risks: ["Competition in fragmented infrastructure market."],
        opportunities: ["Growth in infrastructure projects globally."],
      },
    ],
  },
  {
    id: "smm",
    name: "Sandvik Manufacturing and Machining Solutions (SMM)",
    icon: Settings2,
    sandvikIllustrativeMarketShare: 17,
    marketVisionText:
      "Sandvik SMM is navigating a challenging industrial environment (Q1 2025: order intake -6% organic), particularly in automotive and general engineering, but demonstrates resilience through strong cost control (Adjusted EBITA margin 20.9%) and growth in its software business (mid-single digits, US strong). Strategic acquisitions in CAM (FASTech, ShopWare, etc.) and metrology software (Verisurf, CIMCO parts) are strengthening its digital manufacturing offerings. The focus remains on providing advanced cutting tools, materials technology (incl. powder), and integrated software solutions to enhance customer productivity and efficiency. 'Others' in this diverse market include specialized toolmakers, regional software vendors, and traditional manufacturers.",
    description:
      "Competitors across premium/mid-market cutting tools, Computer-Aided Manufacturing (CAM) software, metrology solutions, and advanced materials. SMM's software business grew mid-single digits in Q1 2025.",
    competitors: [
      {
        name: "IMC Group (ISCAR)",
        countryOfOrigin: "Israel",
        globalRevenue: "$139.45M (2023, metalworking)",
        notes: "Using specific metalworking revenue figure.",
        strengths: [
          "World's second-largest conglomerate for metalworking tools and inserts.",
          "Utilizes high technology to assure customer benefits.",
          "Commitment to ESG principles (circular economy, collecting scrap carbide, recycling worn tools).",
          "Engages in R&D in emerging tech (additive manufacturing, AI).",
          "Produces durable/capable cutting tools (cost, resource, energy savings).",
          "High employee retention, online shopping platform for quick global delivery.",
        ],
        weaknesses: ["N/A in provided doc."],
        differentiators: [
          "Comprehensive product range of carbide inserts, endmills, and cutting tools.",
          "Strong emphasis on sustainability and waste management.",
          "Global reach with quick delivery.",
        ],
        risks: ["N/A in provided doc."],
        opportunities: [
          "Advance business activities through advanced digital technologies.",
          "Develop advanced tools to reduce energy consumption.",
          "Respond to changing needs of customers in a competitive market.",
        ],
      },
      {
        name: "Kennametal",
        countryOfOrigin: "USA (Implied)",
        globalRevenue: "$2.1B (FY2023 from prev data)",
        notes: "Using FY2023 revenue from previous data as new doc doesn't specify new total.",
        strengths: [
          "Strategic divestitures fuel growth/enhance margins (e.g., Stellite).",
          "Focuses on higher-margin segments (cutting tools, industrial materials, advanced mfg. solutions).",
          "Streamlined operations, reduced complexity.",
          "Strong commitment to innovation (significant R&D, >1,200 active patents).",
          "Diversified product portfolio (aerospace, energy, mfg.), strategic M&A for tech capabilities.",
        ],
        weaknesses: [
          "Uncertainty from EBITDA earn-out from divestitures.",
          "Geopolitical tensions and soft demand (EMEA) pressuring margins.",
          "Revenue vulnerability (4.6% decline in 2023).",
          "High exposure to commodity price fluctuations (tungsten carbide, steel).",
          "Relatively high debt levels, complex supply chain vulnerabilities (59 mfg facilities, 16 countries).",
          "Moderate profit margins vs top competitors, high R&D investment requirements.",
        ],
        differentiators: [
          "Focus on advanced materials and engineered components.",
          "Capital allocation strategy towards higher-margin core businesses.",
          "Proactive portfolio pruning.",
        ],
        risks: ["Commodity price exposure.", "Supply chain complexity."],
        opportunities: [
          "Expanding market for sustainable and high-performance cutting tools.",
          "Growth in digital manufacturing technologies (additive mfg., AI-integrated machining).",
          "Strategic expansion in renewable energy and electric vehicle component manufacturing.",
        ],
      },
      {
        name: "Mitsubishi (Materials - Metalworking)",
        countryOfOrigin: "Japan",
        globalRevenue: "JPY 148.8 billion (FYE March 2025, Metalworking Solutions segment)",
        strengths: ["Net sales of carbide products increased YoY (yen depreciation, price hikes)."],
        weaknesses: [
          "Operating profit declined (weak demand for automobiles, rising raw material costs).",
          "Ordinary profit also decreased (decline in operating profit, foreign exchange losses).",
        ],
        differentiators: ["N/A for Metalworking Solutions segment in doc."],
        risks: ["Fluctuations in copper prices and foreign exchange rates."],
        opportunities: ["Indications of recovery in demand for certain semiconductor-related products."],
      },
      {
        name: "Hexagon AB (CAM/Metrology)",
        countryOfOrigin: "Sweden (Global operations)",
        globalRevenue: "EUR 5.4B (FY2023 total from prev data)",
        notes: "Using total group revenue from previous data. MI division is part of this.",
        strengths: [
          "Global technology company providing 'digital reality' solutions (sensors, software, autonomous tech).",
          "Improves efficiency, productivity, quality, safety across diverse industries.",
          "Demonstrates strong financial performance despite challenging markets.",
          "World-class sensor technology, entrenched market positions (high-precision metrology - MI; Geosystems - Leica).",
          "Focuses on connecting/automating production and people-centered ecosystems.",
          "R&D in emerging tech (additive mfg., AI).",
        ],
        weaknesses: [
          "Operates in intensely competitive markets, facing formidable rivals.",
          "Experiences pressure on market share and profitability.",
          "Risk of being outmaneuvered or commoditized in specific areas.",
          "Faces execution risk associated with major corporate restructuring (e.g., spin-off of software assets).",
        ],
        differentiators: [
          "'Digital reality' solutions that turn physical data into actionable insights.",
          "Offers a comprehensive suite of metrology, reality capture, and positioning solutions.",
          "Strong brand recognition, notably with Leica Geosystems.",
        ],
        risks: ["Intense competition.", "Execution risk from restructuring."],
        opportunities: [
          "Unlocking shareholder value through strategic spin-offs.",
          "Gradual recovery in organic growth for sensor-focused 'Hexagon Core'.",
          "Driving the transition towards a scalable and sustainable future (robotic sensors/software, 3D digital environments).",
        ],
      },
      {
        name: "Autodesk (CAM Software)",
        countryOfOrigin: "US",
        globalRevenue: "$1.63 billion (Q1 2025)",
        strengths: [
          "Robust subscription model and diversified product offerings drive consistent revenue growth.",
          "Strategic acquisitions and investments in cloud-based platforms bolster competitive edge in AECO sector.",
          "Demonstrates commitment to innovation and customer-centric approach.",
        ],
        weaknesses: [
          "Net income declined in Q1 2025 ($152M from $252M YoY).",
          "Dependence on key distributors (TD Synnex 20% of net revenue) poses risk.",
          "High software pricing barriers for small businesses/individual users (AutoCAD $1,690-$2,590/yr).",
          "Complex product ecosystem, requires extensive training (3-6 months learning curve).",
          "Revenue heavily relies on construction/manufacturing sectors (susceptible to economic fluctuations).",
        ],
        differentiators: ["Market-leading position in design software.", "Strong, resilient subscription model."],
        risks: [
          "Global economic uncertainties and geopolitical tensions.",
          "Heightened cybersecurity risks (cloud-based offerings).",
          "Requires substantial R&D investments ($1.35B in 2024).",
          "Faces emerging alternatives (FreeCAD, Blender, SketchUp Free).",
        ],
        opportunities: [
          "Growing demand for digital transformation in architecture/design.",
          "Expected growth in global 3D printing market.",
          "Infrastructure investment in emerging markets.",
        ],
      },
      {
        name: "Dassault Systèmes (CAM Software)",
        countryOfOrigin: "France",
        globalRevenue: "EUR 1.57 billion (Q1 2025)",
        strengths: [
          "Identified as 'Rising Star' (lower market share, stronger profit/revenue growth than some peers).",
        ],
        weaknesses: [
          "Uncertainties (economic, business, social, health, geopolitical) may cause customers to reduce/postpone/cancel investments.",
          "Volatile political/economic/monetary situations in certain regions could negatively affect business (export compliance, customs barriers).",
        ],
        differentiators: ["3DEXPERIENCE platform creating new growth opportunities."],
        risks: ["Geopolitical and economic volatility.", "Price pressure.", "Challenges in collection of receivables."],
        opportunities: ["Aims to double EPS by 2029.", "3DEXPERIENCE platform creating new growth opportunities."],
      },
      {
        name: "Siemens (Digital Industries Software)",
        countryOfOrigin: "Germany (Siemens Group)",
        globalRevenue: "EUR 4.3 billion (Q2 2025, Digital Industries segment revenue)",
        strengths: [
          "Historically 'jewel in Siemens's crown' (highest margins for controllers/factory software).",
          "Orders at automation business grew considerably on higher demand in China (end Q2 2025).",
        ],
        weaknesses: [
          "Announced cuts of 5,600 jobs (>8% of DI workforce) due to weak demand (Germany, China).",
          "Muted demand and increased competitive pressures reduced orders/revenue in industrial automation (last two years).",
          "Profit at Digital Industries fell by a third in latest quarter.",
          "Revenue was down 5% YoY in Q2 2025.",
        ],
        differentiators: ["Strong position in industrial automation and factory software."],
        risks: [
          "Weak market conditions.",
          "Need to become faster/more agile.",
          "Requirement for more regionally balanced/broader customer base.",
        ],
        opportunities: [
          "Destocking at customers in China approached completion (end Q2 2025), suggesting potential demand increase.",
        ],
      },
      {
        name: "Zeiss (Industrial Metrology)",
        countryOfOrigin: "Germany",
        globalRevenue: "EUR 1,168 million (Q1 2025, Industrial Quality & Research segment)",
        strengths: [
          "Demonstrates robust overall Group result.",
          "Maintains high R&D expenditure (14% of revenue, above sector average).",
        ],
        weaknesses: [
          "Direct-to-market segments under greater pressure (slight single-digit growth or slight decline).",
          "Fewer business units could extricate themselves from the poor market climate.",
        ],
        differentiators: ["Possesses world-class sensor technology.", "Offers high-precision metrology solutions."],
        risks: ["Operates within challenging geopolitical/economic environment, increasing market uncertainty."],
        opportunities: [
          "Driven by increasing need for precision in smart manufacturing.",
          "Growing demand for non-contact measurement in industrial metrology.",
          "Software segment expected fastest CAGR (>8% 2025-2030), major driver in metrology.",
        ],
      },
      {
        name: "Innovmetric (Metrology Solutions)",
        countryOfOrigin: "Quebec City, Canada (Implied)",
        globalRevenue: "$40M (Estimated Annual)",
        strengths: [
          "Leading provider of universal 3D metrology software solutions.",
          "Reported record sales of 3400 new PolyWorks licenses in FY2017.",
          "Experienced global sales revenue growth of 6.5% (FY2017 vs prev. FY), robust 13% revenue growth in Europe.",
          "Gained market share in Europe (FY2017).",
        ],
        weaknesses: [
          "Faced prudent technology investments by large industrial mfg. orgs and SMEs due to economic uncertainties (global trade).",
        ],
        differentiators: ["Offers the universal 3D metrology software platform, PolyWorks."],
        risks: ["Economic uncertainties related to global trade."],
        opportunities: ["Actively expanding its technical and sales presence worldwide."],
      },
    ],
  },
]

const competitorData: BusinessAreaCompetitors[] = competitorDataRaw.map((area) => ({
  ...area,
  competitors: area.competitors.map((comp) => ({
    ...comp,
    revenueForMarketShareUSD: parseRevenueToUSD(comp.globalRevenue),
  })),
}))

const TabContentList: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 list-disc pl-5 pt-2">
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
)

const CompetitorCard: React.FC<Competitor> = ({
  name,
  globalRevenue,
  countryOfOrigin,
  companySize,
  strengths,
  weaknesses,
  differentiators,
  risks,
  opportunities,
  notes,
}) => {
  const tabInfo = [
    { value: "strengths", title: "Strengths", icon: Star, iconColor: "text-yellow-500", data: strengths },
    { value: "weaknesses", title: "Weaknesses", icon: ShieldOff, iconColor: "text-orange-500", data: weaknesses },
    {
      value: "differentiators",
      title: "Differentiators",
      icon: Zap,
      iconColor: "text-blue-500",
      data: differentiators,
    },
    { value: "risks", title: "Risks", icon: AlertTriangle, iconColor: "text-red-500", data: risks },
    {
      value: "opportunities",
      title: "Opportunities",
      icon: TrendingUp,
      iconColor: "text-green-500",
      data: opportunities,
    },
  ]
  return (
    <Card className="flex flex-col h-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden">
      <CardHeader className="pb-4 bg-slate-50 dark:bg-slate-700/60">
        <CardTitle className="text-2xl text-brand-dark dark:text-slate-100 mb-1">{name}</CardTitle>
        <div className="text-xs text-slate-600 dark:text-slate-400 space-y-0.5">
          {globalRevenue && (
            <div className="flex items-center">
              <Globe className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
              <span>Revenue: {globalRevenue}</span>
            </div>
          )}
          {countryOfOrigin && (
            <div className="flex items-center">
              <Flag className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
              <span>Origin: {countryOfOrigin}</span>
            </div>
          )}
          {companySize && (
            <div className="flex items-center">
              <UsersIcon className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
              <span>Size: {companySize}</span>
            </div>
          )}
          {notes && (
            <div className="flex items-center pt-1">
              <AlertTriangle className="h-3.5 w-3.5 mr-1.5 text-slate-500 flex-shrink-0" />
              <span className="italic text-slate-500">{notes}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 md:p-6">
        <div className="w-full">
          <Tabs defaultValue="strengths" className="w-full">
            <div className="mb-4">
              <TabsList className="h-auto p-1 flex flex-wrap justify-start gap-1 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                {tabInfo.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs md:text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-brand-dark dark:data-[state=active]:text-white data-[state=active]:shadow-md rounded-md transition-all"
                  >
                    <tab.icon className={cn("h-5 w-5", tab.iconColor)} />
                    <span className="text-xs md:text-sm">{tab.title}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            {tabInfo.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="mt-0">
                <TabContentList items={tab.data} />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}

const AreaMarketShareChart: React.FC<{ data: MarketShareDataPoint[]; areaName: string }> = ({ data, areaName }) => {
  const chartJsData = {
    labels: data.map((d) => d.name),
    datasets: [
      {
        data: data.map((d) => d.value),
        backgroundColor: data.map((d) => d.fill),
        borderColor: data.map((d) => {
          const hsl = d.fill.match(/hsl$$(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%$$/)
          if (hsl) {
            return `hsl(${hsl[1]}, ${hsl[2]}%, ${Math.max(0, Number.parseInt(hsl[3]) - 10)}%)`
          }
          return d.fill
        }),
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context: any) => {
            let label = context.chart.data.labels[context.dataIndex] || ""
            if (label) {
              label += ": "
            }
            if (context.parsed !== null) {
              label += context.parsed.toFixed(1) + "%"
            }
            return label
          },
        },
      },
      datalabels: {
        display: (context: any) => {
          return context.dataset.data[context.dataIndex] > 3
        },
        formatter: (value: number, context: any) => {
          const label = context.chart.data.labels[context.dataIndex]
          const maxLength = 10
          const truncatedLabel = label.length > maxLength ? label.substring(0, maxLength - 3) + "..." : label
          return `${truncatedLabel}\n${value.toFixed(1)}%`
        },
        color: "#fff",
        textAlign: "center" as const,
        font: {
          size: 14,
          weight: "bold" as const,
        },
        textStrokeColor: "rgba(0,0,0,0.4)",
        textStrokeWidth: 2,
        padding: 0,
      },
    },
    layout: {
      padding: 20,
    },
  }

  return (
    <Card className="flex flex-col mt-4 mb-6 shadow-lg bg-white dark:bg-slate-800">
      <CardHeader className="items-center pb-2 pt-4">
        <CardTitle className="text-base font-medium text-brand-dark dark:text-slate-100">
          Illustrative Market Share (Revenue-Based): {areaName}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="relative h-[350px] w-full mx-auto">
          <Pie data={chartJsData} options={options} />
        </div>
      </CardContent>
    </Card>
  )
}

export default function CompetitiveLandscapeSection() {
  const CHART_COLORS_HSL = [
    "hsl(210, 80%, 55%)", // Sandvik Blue
    "hsl(160, 70%, 45%)", // Green
    "hsl(45, 90%, 55%)", // Yellow
    "hsl(280, 60%, 60%)", // Purple
    "hsl(0, 70%, 60%)", // Red
    "hsl(30, 80%, 50%)", // Orange
    "hsl(190, 60%, 50%)", // Teal
    "hsl(240, 5%, 65%)", // Grey
    "hsl(330, 70%, 65%)", // Pink
    "hsl(120, 50%, 55%)", // Lime Green
    "hsl(60, 80%, 60%)", // Bright Yellow
    "hsl(260, 70%, 70%)", // Lavender
  ]
  const getChartColor = (index: number) => CHART_COLORS_HSL[index % CHART_COLORS_HSL.length]

  const generateAreaMarketShareData = (area: BusinessAreaCompetitors): MarketShareDataPoint[] => {
    const chartData: MarketShareDataPoint[] = []
    const sandvikSharePercentage = area.sandvikIllustrativeMarketShare
    chartData.push({
      name: `Sandvik (${area.id.toUpperCase()})`,
      value: sandvikSharePercentage,
      fill: getChartColor(0),
    })

    const competitorsWithRevenue = area.competitors.filter(
      (comp) => comp.revenueForMarketShareUSD && comp.revenueForMarketShareUSD > 0,
    )
    const totalCompetitorPoolUSD = competitorsWithRevenue.reduce(
      (sum, comp) => sum + (comp.revenueForMarketShareUSD || 0),
      0,
    )

    const competitorsTotalPercentageToDistribute = 100 - sandvikSharePercentage

    if (totalCompetitorPoolUSD > 0 && competitorsTotalPercentageToDistribute > 0) {
      competitorsWithRevenue.forEach((comp) => {
        const competitorRevenueShare = (comp.revenueForMarketShareUSD || 0) / totalCompetitorPoolUSD
        const competitorPieSlicePercentage = competitorRevenueShare * competitorsTotalPercentageToDistribute
        if (competitorPieSlicePercentage > 0.01) {
          chartData.push({
            name: comp.name,
            value: competitorPieSlicePercentage,
            fill: getChartColor(chartData.length),
          })
        }
      })
    }

    let currentTotalSum = chartData.reduce((sum, entry) => sum + entry.value, 0)
    if (currentTotalSum > 0 && Math.abs(currentTotalSum - 100) > 0.01) {
      const scaleFactor = 100 / currentTotalSum
      let sumOfScaledValues = 0
      chartData.forEach((d, index) => {
        const scaledValue = d.value * scaleFactor
        if (index < chartData.length - 1) {
          d.value = Number.parseFloat(scaledValue.toFixed(1))
          sumOfScaledValues += d.value
        } else {
          d.value = Number.parseFloat((100 - sumOfScaledValues).toFixed(1))
        }
      })
    }
    currentTotalSum = chartData.reduce((sum, entry) => sum + entry.value, 0)
    if (Math.abs(currentTotalSum - 100) > 0.01 && chartData.length > 0) {
      const diff = 100 - currentTotalSum
      let largestSlice = chartData[0]
      for (let i = 1; i < chartData.length; i++) {
        if (chartData[i].value > largestSlice.value) {
          largestSlice = chartData[i]
        }
      }
      largestSlice.value = Number.parseFloat((largestSlice.value + diff).toFixed(1))
    }

    // Ensure no negative values after adjustment, distribute deficit/surplus if any
    const finalSum = chartData.reduce((sum, entry) => sum + entry.value, 0)
    if (Math.abs(finalSum - 100) > 0.01 && chartData.length > 0) {
      const finalDiff = 100 - finalSum
      // Find the largest slice to absorb the final small difference
      const largestSlice = chartData.reduce((prev, current) => (prev.value > current.value ? prev : current))
      largestSlice.value = Number.parseFloat((largestSlice.value + finalDiff).toFixed(1))
    }

    return chartData.filter((d) => d.value > 0.1)
  }

  return (
    <div className="space-y-8 p-4 md:p-6 bg-slate-100 dark:bg-slate-900 rounded-lg">
      <Card className="bg-brand-dark text-white shadow-xl">
        <CardHeader className="flex flex-row items-center space-x-4 p-6">
          <Swords className="h-10 w-10 text-brand-accent" />
          <div>
            <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight">
              Competitive Landscape Analysis
            </CardTitle>
            <CardDescription className="text-slate-300 text-sm">
              Detailed overview of key competitors, their strategic positions, strengths, and weaknesses, based on Q1
              2025 insights and recent data.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      <Accordion type="multiple" defaultValue={competitorData.map((area) => area.id)} className="w-full space-y-6">
        {competitorData.map((area) => {
          const areaChartData = generateAreaMarketShareData(area)
          return (
            <AccordionItem value={area.id} key={area.id} className="border-none">
              <Card className="shadow-lg bg-white dark:bg-slate-800/80 rounded-lg overflow-hidden">
                <AccordionTrigger className="bg-slate-200 dark:bg-slate-700/70 hover:bg-slate-300 dark:hover:bg-slate-700/90 px-6 py-4 rounded-t-lg w-full transition-colors">
                  <div className="flex items-center text-lg font-semibold text-brand-dark dark:text-slate-100">
                    <area.icon className="h-6 w-6 mr-3 text-brand-accent" />
                    {area.name}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-6 bg-slate-100 dark:bg-slate-800/70 rounded-b-lg">
                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">{area.description}</p>
                  <div className="my-6 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800/40 shadow-md">
                    <h4 className="text-md font-semibold text-brand-dark dark:text-slate-100 mb-2 flex items-center">
                      <LucidePieChartIcon className="h-5 w-5 mr-2 text-brand-accent" />
                      Market Overview: {area.id.toUpperCase()}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">{area.marketVisionText}</p>
                    {areaChartData.length > 1 && (
                      <AreaMarketShareChart data={areaChartData} areaName={area.id.toUpperCase()} />
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    {area.competitors.map((competitor) => (
                      <CompetitorCard key={competitor.name} {...competitor} />
                    ))}
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>
          )
        })}
      </Accordion>
      <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-4">
        Note: Company details and market share data are illustrative. Pie charts distribute market share based on
        Sandvik's illustrative share and relative competitor revenues (converted to USD using approximate rates: 1 EUR =
        1.08 USD, 1 GBP = 1.27 USD, 1 SEK = 0.095 USD, 1 JPY = 0.00637 USD, 1 DKK = 0.144 USD). Data sourced from "Deep
        Competitive Landscape Analysis: Sandvik Group" (Q1 2025 focus). For live, up-to-the-minute data, a dynamic data
        source would be required.
      </p>
    </div>
  )
}
