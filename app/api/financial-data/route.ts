import { NextResponse } from "next/server"
import type { FinancialDataItem } from "@/app/components/financials-section" // Import the type

// This is the same mock data previously in app/page.tsx
const mockFinancialData: FinancialDataItem[] = [
  {
    month: "Jan",
    revenue: 10000,
    expenses: 7000,
    profit: 3000,
    sales: 6000,
    marketing: 2000,
    otherRevenue: 2000,
    salaries: 4000,
    rent: 1500,
    utilities: 500,
  },
  {
    month: "Feb",
    revenue: 12000,
    expenses: 7500,
    profit: 4500,
    sales: 7000,
    marketing: 2200,
    otherRevenue: 2800,
    salaries: 4200,
    rent: 1500,
    utilities: 600,
  },
  {
    month: "Mar",
    revenue: 15000,
    expenses: 8000,
    profit: 7000,
    sales: 8500,
    marketing: 2500,
    otherRevenue: 4000,
    salaries: 4500,
    rent: 1500,
    utilities: 700,
  },
  {
    month: "Apr",
    revenue: 13000,
    expenses: 7800,
    profit: 5200,
    sales: 7500,
    marketing: 2300,
    otherRevenue: 3200,
    salaries: 4300,
    rent: 1500,
    utilities: 650,
  },
  {
    month: "May",
    revenue: 16000,
    expenses: 8500,
    profit: 7500,
    sales: 9000,
    marketing: 2800,
    otherRevenue: 4200,
    salaries: 4800,
    rent: 1500,
    utilities: 750,
  },
  {
    month: "Jun",
    revenue: 18000,
    expenses: 9000,
    profit: 9000,
    sales: 10000,
    marketing: 3000,
    otherRevenue: 5000,
    salaries: 5000,
    rent: 1500,
    utilities: 800,
  },
]

export async function GET() {
  // In a real application, you would fetch this data from a database or external service.
  // Simulate a network delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return NextResponse.json(mockFinancialData)
}
