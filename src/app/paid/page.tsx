'use client'

import { useMemo } from 'react'
import { Target, DollarSign, TrendingUp, MousePointerClick, ShoppingCart, Users } from 'lucide-react'
import { useFilters } from '@/context/FilterContext'
import { ALL_RECORDS, MOCK_CAMPAIGNS } from '@/data/mockData'
import {
  filterByDateRange,
  filterByPlatform,
  sumMetric,
  avgMetric,
  groupByDate,
  multiSeriesByDate,
  getComparisonRange,
  formatValue,
} from '@/lib/dataUtils'
import { Platform, CampaignRecord } from '@/types'
import KPICard from '@/components/kpi/KPICard'
import LineChartWidget from '@/components/charts/LineChartWidget'
import BarChartWidget from '@/components/charts/BarChartWidget'
import PieChartWidget from '@/components/charts/PieChartWidget'
import DataTable, { Column } from '@/components/tables/DataTable'
import GlobalFilter from '@/components/filters/GlobalFilter'
import PageHeader from '@/components/ui/PageHeader'
import SectionDivider from '@/components/ui/SectionDivider'
import clsx from 'clsx'

const PLATFORM_COLORS: Record<string, string> = {
  meta_ads:   '#1877f2',
  google_ads: '#ea4335',
  tiktok_ads: '#ff0050',
}

const PLATFORM_LABELS: Record<string, string> = {
  meta_ads:   'Meta Ads',
  google_ads: 'Google Ads',
  tiktok_ads: 'TikTok Ads',
}

const PAID_PLATFORMS: Platform[] = ['meta_ads', 'google_ads', 'tiktok_ads']

const AVAILABLE_PLATFORMS = PAID_PLATFORMS.map(p => ({
  value: p,
  label: PLATFORM_LABELS[p],
  color: PLATFORM_COLORS[p],
}))

export default function PaidPage() {
  const { filters } = useFilters()
  const { dateRange, compareTo, platforms, campaignStatus } = filters

  const current = useMemo(() => {
    let recs = filterByDateRange(ALL_RECORDS, dateRange)
    const activePlatforms = platforms.filter(p => PAID_PLATFORMS.includes(p as Platform)) as Platform[]
    if (activePlatforms.length) recs = filterByPlatform(recs, activePlatforms)
    else recs = filterByPlatform(recs, PAID_PLATFORMS)
    return recs
  }, [dateRange, platforms])

  const compRange = useMemo(() => getComparisonRange(dateRange, compareTo), [dateRange, compareTo])
  const prev = useMemo(() => {
    if (!compRange) return []
    let recs = filterByDateRange(ALL_RECORDS, compRange)
    recs = filterByPlatform(recs, PAID_PLATFORMS)
    return recs
  }, [compRange])

  // ── Totals across all paid platforms ─────────────────────────────────────
  const kpis = useMemo(() => {
    const activePlatforms = platforms.filter(p => PAID_PLATFORMS.includes(p as Platform)) as Platform[]
    const pList = activePlatforms.length ? activePlatforms : PAID_PLATFORMS

    const totalSpend       = pList.reduce((s, p) => s + sumMetric(current, 'spend', p), 0)
    const totalConversions = pList.reduce((s, p) => s + sumMetric(current, 'conversions', p), 0)
    const totalRevenue     = pList.reduce((s, p) => s + sumMetric(current, 'revenue', p), 0)
    const totalPurchases   = pList.reduce((s, p) => s + sumMetric(current, 'purchases', p), 0)
    const totalLeads       = pList.reduce((s, p) => s + sumMetric(current, 'leads', p), 0)
    const avgCPC           = pList.reduce((s, p) => s + avgMetric(current, 'cpc', p), 0) / pList.length
    const avgCPM           = pList.reduce((s, p) => s + avgMetric(current, 'cpm', p), 0) / pList.length
    const avgCPA           = totalConversions > 0 ? totalSpend / totalConversions : 0
    const roas             = totalSpend > 0 ? totalRevenue / totalSpend : 0

    const prevSpend       = prev.length ? pList.reduce((s, p) => s + sumMetric(prev, 'spend', p), 0) : undefined
    const prevConversions = prev.length ? pList.reduce((s, p) => s + sumMetric(prev, 'conversions', p), 0) : undefined
    const prevRevenue     = prev.length ? pList.reduce((s, p) => s + sumMetric(prev, 'revenue', p), 0) : undefined

    return { totalSpend, totalConversions, totalRevenue, totalPurchases, totalLeads, avgCPC, avgCPM, avgCPA, roas, prevSpend, prevConversions, prevRevenue }
  }, [current, prev, platforms])

  // ── Chart data ───────────────────────────────────────────────────────────
  const spendOverTime = useMemo(() =>
    multiSeriesByDate(current, 'spend', PAID_PLATFORMS),
  [current])

  const conversionsOverTime = useMemo(() =>
    multiSeriesByDate(current, 'conversions', PAID_PLATFORMS),
  [current])

  // ── Pie: spend by platform ────────────────────────────────────────────────
  const spendByPlatform = useMemo(() =>
    PAID_PLATFORMS.map(p => ({
      name: PLATFORM_LABELS[p],
      value: parseFloat(sumMetric(current, 'spend', p).toFixed(2)),
      color: PLATFORM_COLORS[p],
    })),
  [current])

  // ── Campaign table ────────────────────────────────────────────────────────
  const filteredCampaigns = useMemo(() => {
    const activePlatforms = platforms.filter(p => PAID_PLATFORMS.includes(p as Platform))
    let campaigns = MOCK_CAMPAIGNS
    if (activePlatforms.length) campaigns = campaigns.filter(c => activePlatforms.includes(c.platform as Platform))
    if (campaignStatus !== 'all') campaigns = campaigns.filter(c => c.status === campaignStatus)
    return campaigns
  }, [platforms, campaignStatus])

  const campaignColumns: Column<CampaignRecord>[] = [
    {
      key: 'name', label: 'Campaign',
      render: (_, row) => (
        <div>
          <span className="text-white text-xs font-medium">{row.name}</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="badge" style={{ background: PLATFORM_COLORS[row.platform] + '22', color: PLATFORM_COLORS[row.platform] }}>
              {PLATFORM_LABELS[row.platform]}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'status', label: 'Status', sortable: true,
      render: v => (
        <span className={clsx('badge', v === 'active' ? 'badge-green' : v === 'completed' ? 'badge-blue' : 'badge-yellow')}>
          {v as string}
        </span>
      ),
    },
    { key: 'spend',       label: 'Spend',       sortable: true, align: 'right', render: v => formatValue(v as number, 'currency') },
    { key: 'impressions', label: 'Impr.',        sortable: true, align: 'right', render: v => formatValue(v as number, 'number') },
    { key: 'clicks',      label: 'Clicks',       sortable: true, align: 'right', render: v => formatValue(v as number, 'number') },
    { key: 'conversions', label: 'Conv.',         sortable: true, align: 'right', render: v => <span className="text-emerald-400 font-medium">{formatValue(v as number, 'number')}</span> },
    { key: 'cpc',         label: 'CPC',          sortable: true, align: 'right', render: v => formatValue(v as number, 'currency') },
    { key: 'cpa',         label: 'CPA',          sortable: true, align: 'right', render: v => formatValue(v as number, 'currency') },
    { key: 'roas',        label: 'ROAS',         sortable: true, align: 'right', render: v => <span className={clsx('font-medium', (v as number) >= 3 ? 'text-emerald-400' : (v as number) >= 2 ? 'text-amber-400' : 'text-red-400')}>{(v as number).toFixed(2)}x</span> },
    { key: 'revenue',     label: 'Revenue',      sortable: true, align: 'right', render: v => <span className="text-emerald-400 font-semibold">{formatValue(v as number, 'currency')}</span> },
  ]

  // ── Campaign status filter buttons ────────────────────────────────────────
  const { setCampaignStatus } = useFilters()

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-6">
      <PageHeader
        title="Paid Campaigns"
        description="Unified reporting across Meta Ads, Google Ads, and TikTok Ads"
        icon={<Target className="w-5 h-5 text-brand-400" />}
        badge="Paid"
      />

      <GlobalFilter
        showPlatformFilter
        availablePlatforms={AVAILABLE_PLATFORMS}
      />

      {/* Campaign status filter */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xs text-slate-500">Status:</span>
        {(['all', 'active', 'completed'] as const).map(s => (
          <button
            key={s}
            onClick={() => setCampaignStatus(s)}
            className={clsx(
              'px-3 py-1 rounded-lg text-xs font-medium transition-all',
              campaignStatus === s
                ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                : 'text-slate-500 hover:text-slate-300 bg-[#151b2e] border border-[#1e2740]'
            )}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* ── KPIs ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-4 mb-6">
        <KPICard label="Total Spend"    value={kpis.totalSpend}       format="currency" previousValue={kpis.prevSpend}       icon={<DollarSign className="w-4 h-4" />}      color="rose" invertTrend />
        <KPICard label="Conversions"    value={kpis.totalConversions} format="number"   previousValue={kpis.prevConversions}  icon={<TrendingUp className="w-4 h-4" />}      color="emerald" />
        <KPICard label="Revenue"        value={kpis.totalRevenue}     format="currency" previousValue={kpis.prevRevenue}      icon={<ShoppingCart className="w-4 h-4" />}    color="brand" />
        <KPICard label="ROAS"           value={kpis.roas}             format="number"   icon={<TrendingUp className="w-4 h-4" />}                                             color="violet" subtitle={`${kpis.roas.toFixed(2)}x return on ad spend`} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-4 mb-6">
        <KPICard label="Avg CPC"       value={kpis.avgCPC}           format="currency" icon={<MousePointerClick className="w-4 h-4" />} color="sky"    invertTrend />
        <KPICard label="Avg CPM"       value={kpis.avgCPM}           format="currency" icon={<MousePointerClick className="w-4 h-4" />} color="amber"  invertTrend />
        <KPICard label="Avg CPA"       value={kpis.avgCPA}           format="currency" icon={<DollarSign className="w-4 h-4" />}        color="cyan"   invertTrend />
        <KPICard label="Total Leads"   value={kpis.totalLeads}       format="number"   icon={<Users className="w-4 h-4" />}             color="pink" />
      </div>

      {/* ── Charts ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <div className="xl:col-span-2">
          <LineChartWidget
            title="Spend Over Time by Platform"
            data={spendOverTime}
            series={PAID_PLATFORMS.map(p => ({ key: p, label: PLATFORM_LABELS[p], color: PLATFORM_COLORS[p] }))}
            format="currency"
          />
        </div>
        <PieChartWidget
          title="Spend by Platform"
          data={spendByPlatform}
          format="currency"
        />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
        <LineChartWidget
          title="Conversions Over Time"
          data={conversionsOverTime}
          series={PAID_PLATFORMS.map(p => ({ key: p, label: PLATFORM_LABELS[p], color: PLATFORM_COLORS[p] }))}
        />
        <BarChartWidget
          title="Conversions by Platform"
          data={PAID_PLATFORMS.map(p => ({
            platform: PLATFORM_LABELS[p],
            conversions: sumMetric(current, 'conversions', p),
            purchases: sumMetric(current, 'purchases', p),
            leads: sumMetric(current, 'leads', p),
          }))}
          xKey="platform"
          bars={[
            { key: 'purchases', label: 'Purchases', color: '#10b981' },
            { key: 'leads',     label: 'Leads',     color: '#6366f1' },
          ]}
        />
      </div>

      {/* ── Campaigns Table ───────────────────────────────────────────────── */}
      <SectionDivider label="Campaign Performance" />
      <DataTable
        title="All Campaigns"
        data={filteredCampaigns}
        columns={campaignColumns}
        defaultSortKey="spend"
        searchKeys={['name', 'platform', 'status']}
      />
    </div>
  )
}
