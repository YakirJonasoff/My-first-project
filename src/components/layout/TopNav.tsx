'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, Instagram, Music2, TrendingUp, Target, Users } from 'lucide-react'
import clsx from 'clsx'

const NAV_ITEMS = [
  { href: '/overview',   label: 'Business KPI',   icon: BarChart3 },
  { href: '/instagram',  label: 'Instagram & FB',  icon: Instagram },
  { href: '/tiktok',     label: 'TikTok Organic',  icon: Music2 },
  { href: '/paid',       label: 'Paid Campaigns',  icon: Target },
  { href: '/clients',    label: 'Clients',         icon: Users },
]

export default function TopNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#0f1117]/95 backdrop-blur border-b border-[#1e2740]">
      <div className="max-w-screen-2xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-white text-sm tracking-tight">
            Marketing Intelligence
          </span>
        </div>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/overview' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  active
                    ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            )
          })}
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          Sample Data Mode
        </div>
      </div>
    </nav>
  )
}
