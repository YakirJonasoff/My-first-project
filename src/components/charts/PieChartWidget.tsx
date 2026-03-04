'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { formatValue } from '@/lib/dataUtils'

interface PieChartWidgetProps {
  title: string
  data: { name: string; value: number; color: string }[]
  format?: 'number' | 'currency' | 'percent' | 'duration'
  height?: number
  donut?: boolean
}

const CustomTooltip = ({
  active,
  payload,
  fmt,
}: {
  active?: boolean
  payload?: { name: string; value: number; payload: { color: string } }[]
  fmt: 'number' | 'currency' | 'percent' | 'duration'
}) => {
  if (!active || !payload?.length) return null
  const p = payload[0]
  return (
    <div className="bg-[#1a2035] border border-[#2d3a5c] rounded-lg p-3 shadow-xl text-xs">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full" style={{ background: p.payload.color }} />
        <span className="text-slate-300">{p.name}:</span>
        <span className="text-white font-semibold">{formatValue(p.value, fmt)}</span>
      </div>
    </div>
  )
}

const renderCustomLegend = (props: { payload?: { color: string; value: string; payload: { value: number } }[] }, total: number, fmt: 'number' | 'currency' | 'percent' | 'duration') => {
  return (
    <div className="flex flex-col gap-1.5 mt-3">
      {(props.payload || []).map(entry => {
        const pct = total > 0 ? ((entry.payload.value / total) * 100).toFixed(1) : 0
        return (
          <div key={entry.value} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: entry.color }} />
              <span className="text-slate-400">{entry.value}</span>
            </div>
            <span className="text-slate-300 font-medium">{pct}%</span>
          </div>
        )
      })}
    </div>
  )
}

export default function PieChartWidget({
  title,
  data,
  format: fmt = 'number',
  height = 260,
  donut = true,
}: PieChartWidgetProps) {
  const total = data.reduce((s, d) => s + d.value, 0)
  const innerRadius = donut ? '55%' : '0%'

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={innerRadius}
            outerRadius="70%"
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip fmt={fmt} />} />
          <Legend
            content={(props) => renderCustomLegend(props as Parameters<typeof renderCustomLegend>[0], total, fmt)}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
