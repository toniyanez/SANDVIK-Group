"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface LogisticsCostsChartProps {
  data: {
    route: string
    heavy: number
    tools: number
  }[]
}

export default function LogisticsCostsChart({ data }: LogisticsCostsChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="route"
          angle={-45}
          textAnchor="end"
          height={80}
          tickLine={false}
          axisLine={false}
          fontSize={12}
        />
        <YAxis yAxisId="left" stroke="#8884d8" fontSize={12} />
        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" fontSize={12} />
        <Tooltip />
        <Legend />
        <Bar yAxisId="left" dataKey="heavy" fill="#8884d8" name="Heavy Equipment ($)" />
        <Bar yAxisId="right" dataKey="tools" fill="#82ca9d" name="Tools ($/kg)" />
      </BarChart>
    </ResponsiveContainer>
  )
}
