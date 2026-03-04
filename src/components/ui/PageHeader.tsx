import React from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  icon?: React.ReactNode
  badge?: string
}

export default function PageHeader({ title, description, icon, badge }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-[#151b2e] border border-[#1e2740] flex items-center justify-center">
            {icon}
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">{title}</h1>
            {badge && (
              <span className="badge badge-blue">{badge}</span>
            )}
          </div>
          {description && (
            <p className="text-sm text-slate-500 mt-0.5">{description}</p>
          )}
        </div>
      </div>
    </div>
  )
}
