"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ChartDataItem {
  name: string
  value: number
  previousValue?: number
  fill: string
  previousFill?: string
}

interface BusinessPerformanceChartProps {
  data: ChartDataItem[]
  title: string
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const current = payload.find((p: any) => p.dataKey === "value")
    const previous = payload.find((p: any) => p.dataKey === "previousValue")

    return (
      <div className="bg-white dark:bg-slate-900/80 backdrop-blur-sm p-3 border border-slate-300 dark:border-slate-700 rounded-lg shadow-lg">
        <p className="label font-semibold text-sm text-slate-800 dark:text-slate-200">{`${label}`}</p>
        {current && (
          <p className="intro text-xs" style={{ color: current.payload.fill }}>
            {`Current: ${current.value.toLocaleString()}`}
          </p>
        )}
        {previous && (
          <p className="intro text-xs" style={{ color: previous.payload.previousFill }}>
            {`Previous: ${previous.value.toLocaleString()}`}
          </p>
        )}
      </div>
    )
  }
  return null
}

export const BusinessPerformanceChart: React.FC<BusinessPerformanceChartProps> = ({ data, title }) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <Card className="shadow-inner bg-slate-50 dark:bg-slate-800/50 mt-4 border-slate-200 dark:border-slate-700/50 border">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div style={{ width: "100%", height: 150 }}>
          {isMounted && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#64748b" />
                <YAxis tick={{ fontSize: 11 }} stroke="#64748b" />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(206, 212, 218, 0.2)" }} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                {data[0]?.previousValue !== undefined && (
                  <Bar dataKey="previousValue" name="Previous Period" barSize={25} legendType="circle">
                    {data.map((entry, index) => (
                      <Cell key={`cell-previous-${index}`} fill={entry.previousFill || "#cccccc"} />
                    ))}
                  </Bar>
                )}
                <Bar dataKey="value" name="Current Period" barSize={25} legendType="circle">
                  {data.map((entry, index) => (
                    <Cell key={`cell-current-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
