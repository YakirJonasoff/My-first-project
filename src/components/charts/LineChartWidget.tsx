'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { formatValue } from '@/lib/dataUtils'

interface Series {
  key: string
  label: string
  color: string
}

interface LineChartWidgetProps {
  title: string
  data: Record<string, string | number>[]
  series: Series[]
  format?: 'number' | 'currency' | 'percent' | 'duration'
  height?: number
}

const CustomTooltip = ({
  active,
  payload,
  label,
  fmt,
}: {
  active?: boolean
  payload?: { color: string; name: string; value: number }[]
  label?: string
  fmt: 'number' | 'currency' | 'percent' | 'duration'
}) => {
  if (!active || !payload?.length) return null

  return (
    <div className="bg-[#1a2035] border border-[#2d3a5c] rounded-lg p-3 shadow-xl text-xs">
      <p className="text-slate-400 mb-2 font-medium">
        {label ? format(parseISO(label), 'dd MMM yyyy') : ''}
      </p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-300">{p.name}:</span>
          <span className="text-white font-semibold">{formatValue(p.value, fmt)}</span>
        </div>
      ))}
    </div>
  )
}

export default function LineChartWidget({
  title,
  data,
  series,
  format: fmt = 'number',
  height = 260,
}: LineChartWidgetProps) {
  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e2740" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={v => {
              try { return format(parseISO(v), 'dd MMM') } catch { return v }
            }}
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={v => formatValue(v, fmt)}
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
            width={55}
          />
          <Tooltip content={<CustomTooltip fmt={fmt} />} />
          {series.length > 1 && (
            <Legend
              formatter={v => <span style={{ color: '#94a3b8', fontSize: 12 }}>{v}</span>}
            />
          )}
          {series.map(s => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
