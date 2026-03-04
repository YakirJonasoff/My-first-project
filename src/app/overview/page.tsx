'use client'

import { useMemo } from 'react'
import { BarChart3, Globe, ShoppingCart, TrendingUp, Users, DollarSign, Percent, Phone, MessageCircle, FileText } from 'lucide-react'
import { useFilters } from '@/context/FilterContext'
import { ALL_RECORDS } from '@/data/mockData'
import {
  filterByDateRange,
  sumMetric,
  avgMetric,
  groupByDate,
  multiSeriesByDate,
  getComparisonRange,
  formatValue,
} from '@/lib/dataUtils'
import KPICard from '@/components/kpi/KPICard'
import LineChartWidget from '@/components/charts/LineChartWidget'
import BarChartWidget from '@/components/charts/BarChartWidget'
import PieChartWidget from '@/components/charts/PieChartWidget'
import FunnelWidget from '@/components/charts/FunnelWidget'
import GlobalFilter from '@/components/filters/GlobalFilter'
import PageHeader from '@/components/ui/PageHeader'
import SectionDivider from '@/components/ui/SectionDivider'

const SOCIAL_PLATFORMS = ['instagram', 'facebook', 'tiktok'] as const
const PAID_PLATFORMS   = ['meta_ads', 'google_ads', 'tiktok_ads'] as const

export default function OverviewPage() {
  const { filters } = useFilters()
  const { dateRange, compareTo } = filters

  const current = useMemo(() => filterByDateRange(ALL_RECORDS, dateRange), [dateRange])
  const compRange = useMemo(() => getComparisonRange(dateRange, compareTo), [dateRange, compareTo])
  const prev = useMemo(() => compRange ? filterByDateRange(ALL_RECORDS, compRange) : [], [compRange])

  // ── Aggregate KPIs ────────────────────────────────────────────────────────
  const kpis = useMemo(() => {
    // Organic social reach
    const totalReach = SOCIAL_PLATFORMS.reduce((s, p) => s + sumMetric(current, 'reach', p), 0)
    const prevReach  = prev.length ? SOCIAL_PLATFORMS.reduce((s, p) => s + sumMetric(prev, 'reach', p), 0) : undefined

    // Organic social impressions
    const totalImpressions = SOCIAL_PLATFORMS.reduce((s, p) => s + sumMetric(current, 'impressions', p), 0)
    const prevImpressions  = prev.length ? SOCIAL_PLATFORMS.reduce((s, p) => s + sumMetric(prev, 'impressions', p), 0) : undefined

    // GA4 metrics
    const sessions         = sumMetric(current, 'sessions', 'google_analytics')
    const prevSessions     = prev.length ? sumMetric(prev, 'sessions', 'google_analytics') : undefined
    const bounceRate       = avgMetric(current, 'bounce_rate', 'google_analytics')
    const prevBounceRate   = prev.length ? avgMetric(prev, 'bounce_rate', 'google_analytics') : undefined
    const avgDuration      = avgMetric(current, 'avg_session_duration', 'google_analytics')
    const revenue          = sumMetric(current, 'revenue', 'google_analytics')
    const prevRevenue      = prev.length ? sumMetric(prev, 'revenue', 'google_analytics') : undefined
    const purchases        = sumMetric(current, 'purchases', 'google_analytics')
    const prevPurchases    = prev.length ? sumMetric(prev, 'purchases', 'google_analytics') : undefined
    const convRate         = avgMetric(current, 'conversion_rate', 'google_analytics')
    const prevConvRate     = prev.length ? avgMetric(prev, 'conversion_rate', 'google_analytics') : undefined

    // Paid totals
    const totalSpend       = PAID_PLATFORMS.reduce((s, p) => s + sumMetric(current, 'spend', p), 0)
    const prevSpend        = prev.length ? PAID_PLATFORMS.reduce((s, p) => s + sumMetric(prev, 'spend', p), 0) : undefined
    const paidConversions  = PAID_PLATFORMS.reduce((s, p) => s + sumMetric(current, 'conversions', p), 0)
    const paidRevenue      = PAID_PLATFORMS.reduce((s, p) => s + sumMetric(current, 'revenue', p), 0)
    const roas             = totalSpend > 0 ? paidRevenue / totalSpend : 0
    const cpa              = paidConversions > 0 ? totalSpend / paidConversions : 0

    // Leads by type
    const leads            = sumMetric(current, 'leads', 'google_analytics')
    const formSubmissions  = sumMetric(current, 'form_submissions', 'google_analytics')
    const calls            = sumMetric(current, 'calls', 'google_analytics')
    const whatsapp         = sumMetric(current, 'whatsapp_clicks', 'google_analytics')

    // Traffic sources
    const trafficOrganic   = sumMetric(current, 'traffic_organic', 'google_analytics')
    const trafficPaid      = sumMetric(current, 'traffic_paid', 'google_analytics')
    const trafficSocial    = sumMetric(current, 'traffic_social', 'google_analytics')
    const trafficDirect    = sumMetric(current, 'traffic_direct', 'google_analytics')

    return {
      totalReach, prevReach, totalImpressions, prevImpressions,
      sessions, prevSessions, bounceRate, prevBounceRate, avgDuration,
      revenue, prevRevenue, purchases, prevPurchases, convRate, prevConvRate,
      totalSpend, prevSpend, paidConversions, roas, cpa,
      leads, formSubmissions, calls, whatsapp,
      trafficOrganic, trafficPaid, trafficSocial, trafficDirect,
    }
  }, [current, prev])

  // ── Charts ────────────────────────────────────────────────────────────────
  const sessionsOverTime = useMemo(() =>
    groupByDate(current, 'sessions', 'google_analytics').map(d => ({ date: d.date, sessions: d.value })),
  [current])

  const revenueOverTime = useMemo(() =>
    groupByDate(current, 'revenue', 'google_analytics').map(d => ({ date: d.date, revenue: d.value })),
  [current])

  const trafficBySource = useMemo(() => [
    { source: 'Organic',   sessions: kpis.trafficOrganic, color: '#10b981' },
    { source: 'Paid',      sessions: kpis.trafficPaid,    color: '#6366f1' },
    { source: 'Social',    sessions: kpis.trafficSocial,  color: '#f59e0b' },
    { source: 'Direct',    sessions: kpis.trafficDirect,  color: '#06b6d4' },
  ], [kpis])

  const platformReach = useMemo(() => [
    { platform: 'Instagram', reach: sumMetric(current, 'reach', 'instagram'), color: '#e1306c' },
    { platform: 'Facebook',  reach: sumMetric(current, 'reach', 'facebook'),  color: '#1877f2' },
    { platform: 'TikTok',    reach: sumMetric(current, 'reach', 'tiktok'),    color: '#ff0050' },
  ], [current])

  const trafficPieData = useMemo(() => [
    { name: 'Organic', value: kpis.trafficOrganic, color: '#10b981' },
    { name: 'Paid',    value: kpis.trafficPaid,    color: '#6366f1' },
    { name: 'Social',  value: kpis.trafficSocial,  color: '#f59e0b' },
    { name: 'Direct',  value: kpis.trafficDirect,  color: '#06b6d4' },
  ], [kpis])

  const funnelSteps = useMemo(() => [
    { label: 'Total Reach',        value: kpis.totalReach,    color: '#6366f1' },
    { label: 'Website Sessions',   value: kpis.sessions,      color: '#3b82f6' },
    { label: 'Engaged Sessions',   value: Math.floor(kpis.sessions * (1 - kpis.bounceRate / 100)), color: '#06b6d4' },
    { label: 'Conversions',        value: kpis.paidConversions + Math.floor(kpis.sessions * kpis.convRate / 100), color: '#10b981' },
    { label: 'Purchases',          value: kpis.purchases,     color: '#f59e0b' },
  ], [kpis])

  const spendVsRevenueOverTime = useMemo(() => {
    const spendData = groupByDate(current, 'revenue', 'google_analytics')
    const paidRevData = PAID_PLATFORMS.reduce((map, p) => {
      for (const r of current.filter(r => r.platform === p && r.metric_name === 'spend')) {
        map.set(r.date, (map.get(r.date) ?? 0) + r.value)
      }
      return map
    }, new Map<string, number>())

    return spendData.map(d => ({
      date: d.date,
      revenue: d.value,
      spend: paidRevData.get(d.date) ?? 0,
    }))
  }, [current])

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-6">
      <PageHeader
        title="Business KPI Overview"
        description="Consolidated performance across all channels — organic, paid, and website"
        icon={<BarChart3 className="w-5 h-5 text-brand-400" />}
        badge="All Channels"
      />

      <GlobalFilter />

      {/* ── Revenue & Transactions ─────────────────────────────────────────── */}
      <SectionDivider label="Revenue & Conversions" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KPICard label="Total Revenue"     value={kpis.revenue}        format="currency" previousValue={kpis.prevRevenue}    icon={<DollarSign className="w-4 h-4" />}  color="emerald" />
        <KPICard label="Online Purchases"  value={kpis.purchases}      format="number"   previousValue={kpis.prevPurchases}  icon={<ShoppingCart className="w-4 h-4" />} color="brand" />
        <KPICard label="Conversion Rate"   value={kpis.convRate}       format="percent"  previousValue={kpis.prevConvRate}   icon={<Percent className="w-4 h-4" />}     color="violet" />
        <KPICard label="ROAS"              value={kpis.roas}           format="number"   icon={<TrendingUp className="w-4 h-4" />}                                        color="amber"  subtitle={`${kpis.roas.toFixed(2)}x return`} />
      </div>

      {/* ── Website Traffic ───────────────────────────────────────────────── */}
      <SectionDivider label="Website Traffic" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KPICard label="Sessions"          value={kpis.sessions}       format="number"   previousValue={kpis.prevSessions}   icon={<Globe className="w-4 h-4" />}       color="sky" />
        <KPICard label="Bounce Rate"       value={kpis.bounceRate}     format="percent"  previousValue={kpis.prevBounceRate} icon={<Percent className="w-4 h-4" />}     color="rose"   invertTrend />
        <KPICard label="Avg Session"       value={kpis.avgDuration}    format="duration" icon={<Globe className="w-4 h-4" />}                                             color="cyan" />
        <KPICard label="Total Ad Spend"    value={kpis.totalSpend}     format="currency" previousValue={kpis.prevSpend}      icon={<DollarSign className="w-4 h-4" />}  color="red"    invertTrend />
      </div>

      {/* ── Organic Reach ─────────────────────────────────────────────────── */}
      <SectionDivider label="Organic Reach" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KPICard label="Total Reach"       value={kpis.totalReach}       format="number" previousValue={kpis.prevReach}       icon={<Users className="w-4 h-4" />}       color="brand" />
        <KPICard label="Total Impressions" value={kpis.totalImpressions} format="number" previousValue={kpis.prevImpressions} icon={<TrendingUp className="w-4 h-4" />}  color="violet" />
        <KPICard label="CPA (Paid)"        value={kpis.cpa}              format="currency" icon={<DollarSign className="w-4 h-4" />}                                      color="amber"  invertTrend />
        <KPICard label="Paid Conversions"  value={kpis.paidConversions}  format="number"   icon={<TrendingUp className="w-4 h-4" />}                                      color="emerald" />
      </div>

      {/* ── Lead breakdown ────────────────────────────────────────────────── */}
      <SectionDivider label="Leads by Type" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KPICard label="Total Leads"    value={kpis.leads}           format="number" icon={<Users className="w-4 h-4" />}          color="brand" />
        <KPICard label="Form Fills"     value={kpis.formSubmissions} format="number" icon={<FileText className="w-4 h-4" />}        color="violet" />
        <KPICard label="Phone Calls"    value={kpis.calls}           format="number" icon={<Phone className="w-4 h-4" />}           color="emerald" />
        <KPICard label="WhatsApp Clicks" value={kpis.whatsapp}       format="number" icon={<MessageCircle className="w-4 h-4" />}   color="sky" />
      </div>

      {/* ── Main Charts ───────────────────────────────────────────────────── */}
      <SectionDivider label="Trends" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
        <LineChartWidget
          title="Revenue Over Time"
          data={revenueOverTime}
          series={[{ key: 'revenue', label: 'Revenue', color: '#10b981' }]}
          format="currency"
        />
        <LineChartWidget
          title="Sessions Over Time"
          data={sessionsOverTime}
          series={[{ key: 'sessions', label: 'Sessions', color: '#6366f1' }]}
        />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <BarChartWidget
          title="Reach by Platform"
          data={platformReach}
          xKey="platform"
          bars={[{ key: 'reach', label: 'Reach', color: '#6366f1' }]}
          layout="vertical"
          height={220}
        />
        <PieChartWidget
          title="Traffic by Source"
          data={trafficPieData}
        />
        <BarChartWidget
          title="Traffic by Source"
          data={trafficBySource}
          xKey="source"
          bars={[{ key: 'sessions', label: 'Sessions', color: '#06b6d4' }]}
          height={220}
        />
      </div>

      {/* ── Funnel ───────────────────────────────────────────────────────── */}
      <SectionDivider label="Conversion Funnel" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
        <FunnelWidget
          title="Traffic to Purchase Funnel"
          steps={funnelSteps}
        />
        <LineChartWidget
          title="Revenue vs Ad Spend"
          data={spendVsRevenueOverTime}
          series={[
            { key: 'revenue', label: 'Revenue', color: '#10b981' },
            { key: 'spend',   label: 'Ad Spend', color: '#ef4444' },
          ]}
          format="currency"
        />
      </div>
    </div>
  )
}
