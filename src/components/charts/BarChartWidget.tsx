'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { formatValue } from '@/lib/dataUtils'

interface BarChartWidgetProps {
  title: string
  data: Record<string, string | number>[]
  bars: { key: string; label: string; color: string }[]
  xKey?: string
  format?: 'number' | 'currency' | 'percent' | 'duration'
  height?: number
  layout?: 'vertical' | 'horizontal'
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

  let displayLabel = label || ''
  try {
    if (label && label.match(/^\d{4}-\d{2}-\d{2}$/)) {
      displayLabel = format(parseISO(label), 'dd MMM yyyy')
    }
  } catch { /* keep original */ }

  return (
    <div className="bg-[#1a2035] border border-[#2d3a5c] rounded-lg p-3 shadow-xl text-xs">
      <p className="text-slate-400 mb-2 font-medium">{displayLabel}</p>
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

export default function BarChartWidget({
  title,
  data,
  bars,
  xKey = 'date',
  format: fmt = 'number',
  height = 260,
  layout = 'horizontal',
}: BarChartWidgetProps) {
  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout={layout}
          margin={{ top: 4, right: 8, bottom: 4, left: layout === 'vertical' ? 100 : 8 }}
          barSize={layout === 'horizontal' ? 8 : 16}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e2740" vertical={layout === 'horizontal' ? false : true} horizontal={layout === 'horizontal' ? true : false} />
          {layout === 'horizontal' ? (
            <>
              <XAxis
                dataKey={xKey}
                tickFormatter={v => {
                  try {
                    if (v.match(/^\d{4}-\d{2}-\d{2}$/)) return format(parseISO(v), 'dd MMM')
                    return v
                  } catch { return v }
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
            </>
          ) : (
            <>
              <XAxis
                type="number"
                tickFormatter={v => formatValue(v, fmt)}
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey={xKey}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                width={100}
              />
            </>
          )}
          <Tooltip content={<CustomTooltip fmt={fmt} />} />
          {bars.length > 1 && (
            <Legend
              formatter={v => <span style={{ color: '#94a3b8', fontSize: 12 }}>{v}</span>}
            />
          )}
          {bars.map((b, i) => (
            <Bar
              key={b.key}
              dataKey={b.key}
              name={b.label}
              fill={b.color}
              radius={layout === 'horizontal' ? [3, 3, 0, 0] : [0, 3, 3, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
