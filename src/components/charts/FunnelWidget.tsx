'use client'

import { formatValue } from '@/lib/dataUtils'

interface FunnelStep {
  label: string
  value: number
  color: string
}

interface FunnelWidgetProps {
  title: string
  steps: FunnelStep[]
  format?: 'number' | 'currency' | 'percent' | 'duration'
}

export default function FunnelWidget({ title, steps, format: fmt = 'number' }: FunnelWidgetProps) {
  const maxVal = steps[0]?.value || 1

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-white mb-5">{title}</h3>
      <div className="flex flex-col gap-2">
        {steps.map((step, i) => {
          const width = (step.value / maxVal) * 100
          const convRate = i > 0 ? ((step.value / steps[i - 1].value) * 100).toFixed(1) : null

          return (
            <div key={step.label} className="relative">
              {convRate && (
                <div className="text-[10px] text-slate-500 mb-1 flex items-center gap-1">
                  <span className="text-slate-600">↓</span>
                  {convRate}% conversion
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-9 bg-[#1e2740] rounded-lg overflow-hidden relative">
                  <div
                    className="h-full rounded-lg transition-all duration-500 flex items-center px-3"
                    style={{ width: `${width}%`, background: step.color }}
                  >
                    <span className="text-xs font-semibold text-white/90 truncate">
                      {step.label}
                    </span>
                  </div>
                </div>
                <div className="w-20 text-right">
                  <span className="text-sm font-semibold text-white">
                    {formatValue(step.value, fmt)}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
