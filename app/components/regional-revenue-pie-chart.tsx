"use client"

import type React from "react"
import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, type ChartData, type ChartOptions } from "chart.js"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ChartDataLabels from "chartjs-plugin-datalabels"

ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels)

interface RegionalRevenuePieChartProps {
  data: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      backgroundColor: string[]
      borderColor: string[]
      borderWidth: number
    }[]
  }
  title?: string
}

export const RegionalRevenuePieChart: React.FC<RegionalRevenuePieChartProps> = ({
  data,
  title = "Regional Revenue Share",
}) => {
  const options: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Disable the legend at the bottom
      },
      title: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor:
          typeof window !== "undefined" &&
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "rgba(30, 41, 59, 0.85)"
            : "rgba(255, 255, 255, 0.85)", // slate-800 dark, white light
        titleColor:
          typeof window !== "undefined" &&
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "#e2e8f0"
            : "#1e293b", // slate-200 dark, slate-800 light
        bodyColor:
          typeof window !== "undefined" &&
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "#e2e8f0"
            : "#1e293b",
        borderColor:
          typeof window !== "undefined" &&
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "#475569"
            : "#e2e8f0", // slate-600 dark, slate-200 light
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || ""
            if (label) {
              label += ": "
            }
            if (context.parsed !== null) {
              label += context.parsed + "%"
            }
            return label
          },
        },
      },
      datalabels: {
        display: true,
        formatter: (value, context) => {
          const label = context.chart.data.labels?.[context.dataIndex] ?? ""
          return `${label}\n${value}%`
        },
        color: "#fff",
        textAlign: "center",
        font: {
          weight: "bold",
          size: 12,
        },
        textShadowBlur: 6,
        textShadowColor: "rgba(0, 0, 0, 0.4)",
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 800,
    },
  }

  // Fallback for SSR or if data is not ready
  if (typeof window === "undefined" || !data || !data.labels || data.labels.length === 0) {
    return (
      <Card className="w-full h-[400px] flex items-center justify-center shadow-lg bg-white dark:bg-slate-800/60">
        <CardHeader>
          <CardTitle className="text-xl text-brand-dark dark:text-slate-100">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-slate-500 dark:text-slate-400">Loading chart data...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg bg-white dark:bg-slate-800/60">
      <CardHeader>
        <CardTitle className="text-xl text-brand-dark dark:text-slate-100">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px] w-full p-4">
        <Pie data={data as ChartData<"pie", number[], string>} options={options} />
      </CardContent>
    </Card>
  )
}
