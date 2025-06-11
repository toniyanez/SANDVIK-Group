"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Pie } from "react-chartjs-2"
import { Chart, ArcElement, Tooltip, Legend, type ChartOptions, type ChartData } from "chart.js"
import ChartDataLabels from "chartjs-plugin-datalabels"
import { Loader2 } from "lucide-react"

// Register Chart.js components and the datalabels plugin
// This is done once at the module level.
// Ensure ChartDataLabels is registered.
try {
  if (Chart.registry.plugins.get(ChartDataLabels.id)) {
    // Plugin already registered
  } else {
    Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels)
  }
} catch (e) {
  // Fallback if Chart.registry.plugins.get is not available (older Chart.js versions)
  // or if there's an issue with re-registration.
  // This simple registration should be safe.
  Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels)
}

interface PieChartDataset {
  label: string
  data: number[]
  backgroundColor: string[]
  borderColor: string[]
  borderWidth: number
}

interface PieChartDataProps {
  labels: string[]
  datasets: PieChartDataset[]
}

interface RegionalRevenuePieChartProps {
  data: PieChartDataProps
  title?: string
}

export const RegionalRevenuePieChart: React.FC<RegionalRevenuePieChartProps> = ({
  data,
  title = "Regional Revenue Share",
}) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Component did mount, safe to render chart
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-64 w-full bg-slate-50 dark:bg-slate-800/30 rounded-lg">
        <Loader2 className="h-8 w-8 animate-spin text-brand-accent" />
        <p className="ml-3 text-slate-600 dark:text-slate-400">Loading Regional Revenue Chart...</p>
      </div>
    )
  }

  const pieChartData: ChartData<"pie"> = {
    labels: data.labels,
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      // Ensure data is an array of numbers for the pie chart
      data: dataset.data.map((d) => Number(d)),
    })),
  }

  const options: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Keep legend disabled as labels are on slices
      },
      tooltip: {
        enabled: true, // Keep tooltips enabled for hover details
        callbacks: {
          label: (context) => {
            const label = context.label || ""
            const value = context.raw as number
            let total = 0
            if (context.chart.data.datasets[0] && context.chart.data.datasets[0].data) {
              // Sum of all data points in the dataset
              total = (context.chart.data.datasets[0].data as number[]).reduce((acc, val) => acc + val, 0)
            }
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0
            return `${label}: ${percentage}%`
          },
        },
      },
      datalabels: {
        display: true,
        formatter: (value, context) => {
          const label = context.chart.data.labels?.[context.dataIndex] || ""
          const dataset = context.chart.data.datasets[context.datasetIndex]
          const total = (dataset.data as number[]).reduce((acc: number, val: number) => acc + val, 0)
          const percentage = total > 0 ? (((value as number) / total) * 100).toFixed(1) : "0.0"
          if (Number.parseFloat(percentage) < 5) {
            // Don't show label if slice is too small
            return null
          }
          return `${label}\n${percentage}%`
        },
        color: "#fff", // White text for contrast on colored slices
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black background for labels
        borderRadius: 4,
        padding: {
          top: 2,
          bottom: 2,
          left: 4,
          right: 4,
        },
        font: {
          weight: "bold",
          size: 11, // Slightly adjusted font size
        },
        textShadow: {
          // Adding text shadow for better readability
          color: "rgba(0, 0, 0, 0.75)",
          offsetX: 1,
          offsetY: 1,
          blur: 3,
        },
        anchor: "center", // Attempt to center labels on slices
        align: "center",
      },
    },
    layout: {
      padding: 20, // Add padding around the chart to ensure labels fit
    },
  }

  return (
    <div className="w-full h-80 md:h-96 relative p-4 bg-white dark:bg-slate-800/60 rounded-lg shadow-md">
      <Pie data={pieChartData} options={options} />
    </div>
  )
}
