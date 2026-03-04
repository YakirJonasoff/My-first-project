'use client'

import { useState } from 'react'
import { CalendarDays, ChevronDown, BarChart2, ArrowLeftRight } from 'lucide-react'
import { format } from 'date-fns'
import { useFilters } from '@/context/FilterContext'
import { PRESET_RANGES } from '@/lib/dataUtils'
import clsx from 'clsx'

const PRESETS: { key: keyof typeof PRESET_RANGES; label: string }[] = [
  { key: 'last7',     label: 'Last 7 days' },
  { key: 'last30',    label: 'Last 30 days' },
  { key: 'last90',    label: 'Last 90 days' },
  { key: 'lastMonth', label: 'Last month' },
  { key: 'thisYear',  label: 'This year' },
]

const COMPARE_OPTIONS: { value: 'previous_period' | 'last_year' | 'none'; label: string }[] = [
  { value: 'previous_period', label: 'vs Previous period' },
  { value: 'last_year',       label: 'vs Last year' },
  { value: 'none',            label: 'No comparison' },
]

interface GlobalFilterProps {
  showPlatformFilter?: boolean
  availablePlatforms?: { value: string; label: string; color: string }[]
}

export default function GlobalFilter({ showPlatformFilter = false, availablePlatforms = [] }: GlobalFilterProps) {
  const { filters, setPreset, setCompareTo, togglePlatform } = useFilters()
  const [open, setOpen] = useState(false)

  const { from, to } = filters.dateRange
  const dateLabel = `${format(from, 'dd MMM yyyy')} — ${format(to, 'dd MMM yyyy')}`

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {/* Date Range Picker (presets) */}
      <div className="relative">
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-2 bg-[#151b2e] border border-[#1e2740] hover:border-[#2d3a5c] rounded-lg px-4 py-2 text-sm text-white transition-colors"
        >
          <CalendarDays className="w-4 h-4 text-brand-400" />
          <span>{dateLabel}</span>
          <ChevronDown className={clsx('w-3.5 h-3.5 text-slate-400 transition-transform', open && 'rotate-180')} />
        </button>

        {open && (
          <div className="absolute top-full mt-2 left-0 z-50 bg-[#151b2e] border border-[#2d3a5c] rounded-xl shadow-2xl p-2 min-w-[180px]">
            {PRESETS.map(p => (
              <button
                key={p.key}
                onClick={() => { setPreset(p.key); setOpen(false) }}
                className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Comparison toggle */}
      <div className="flex items-center gap-1 bg-[#151b2e] border border-[#1e2740] rounded-lg p-1">
        {COMPARE_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setCompareTo(opt.value)}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
              filters.compareTo === opt.value
                ? 'bg-brand-500/20 text-brand-400'
                : 'text-slate-500 hover:text-slate-300'
            )}
          >
            {opt.value !== 'none' && <ArrowLeftRight className="w-3 h-3" />}
            {opt.label}
          </button>
        ))}
      </div>

      {/* Platform filter */}
      {showPlatformFilter && availablePlatforms.length > 0 && (
        <div className="flex items-center gap-1 bg-[#151b2e] border border-[#1e2740] rounded-lg p-1">
          <span className="flex items-center gap-1.5 px-3 text-xs text-slate-500">
            <BarChart2 className="w-3 h-3" />
            Platform:
          </span>
          {availablePlatforms.map(p => {
            const active = filters.platforms.length === 0 || filters.platforms.includes(p.value as never)
            return (
              <button
                key={p.value}
                onClick={() => togglePlatform(p.value as never)}
                className={clsx(
                  'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                  active ? 'text-white bg-white/10' : 'text-slate-500 hover:text-slate-300'
                )}
                style={active ? { color: p.color } : {}}
              >
                {p.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
