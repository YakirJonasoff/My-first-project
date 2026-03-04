'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import clsx from 'clsx'
import { formatValue } from '@/lib/dataUtils'

interface KPICardProps {
  label: string
  value: number
  format: 'number' | 'currency' | 'percent' | 'duration'
  previousValue?: number
  icon?: React.ReactNode
  color?: string
  subtitle?: string
  invertTrend?: boolean // for metrics where lower is better (e.g. CPA, bounce rate)
}

export default function KPICard({
  label,
  value,
  format,
  previousValue,
  icon,
  color = 'brand',
  subtitle,
  invertTrend = false,
}: KPICardProps) {
  const hasPrev = previousValue !== undefined && previousValue !== null
  const change = hasPrev && previousValue !== 0
    ? ((value - previousValue) / previousValue) * 100
    : null

  const isPositive = change !== null ? (invertTrend ? change < 0 : change > 0) : null
  const isNeutral = change === 0

  const colorMap: Record<string, string> = {
    brand: 'text-brand-400 bg-brand-500/10',
    emerald: 'text-emerald-400 bg-emerald-500/10',
    violet: 'text-violet-400 bg-violet-500/10',
    rose: 'text-rose-400 bg-rose-500/10',
    amber: 'text-amber-400 bg-amber-500/10',
    sky: 'text-sky-400 bg-sky-500/10',
    pink: 'text-pink-400 bg-pink-500/10',
    cyan: 'text-cyan-400 bg-cyan-500/10',
  }

  return (
    <div className="card flex flex-col gap-3 hover:border-[#2d3a5c] transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {label}
        </span>
        {icon && (
          <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center', colorMap[color] || colorMap.brand)}>
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      <div>
        <div className="text-2xl font-bold text-white tracking-tight">
          {formatValue(value, format)}
        </div>
        {subtitle && (
          <div className="text-xs text-slate-500 mt-0.5">{subtitle}</div>
        )}
      </div>

      {/* Change indicator */}
      {change !== null && (
        <div className="flex items-center gap-1.5">
          {isNeutral ? (
            <Minus className="w-3.5 h-3.5 text-slate-400" />
          ) : isPositive ? (
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-red-400" />
          )}
          <span
            className={clsx(
              'text-xs font-medium',
              isNeutral ? 'text-slate-400' : isPositive ? 'text-emerald-400' : 'text-red-400'
            )}
          >
            {change > 0 ? '+' : ''}{change.toFixed(1)}% vs prev period
          </span>
        </div>
      )}
    </div>
  )
}
