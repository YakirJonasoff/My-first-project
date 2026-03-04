'use client'

import { useMemo } from 'react'
import { Instagram, Users, Eye, MousePointerClick, Heart, Share2, Bookmark, TrendingUp } from 'lucide-react'
import { useFilters } from '@/context/FilterContext'
import { ALL_RECORDS, MOCK_POSTS } from '@/data/mockData'
import {
  filterByDateRange,
  sumMetric,
  avgMetric,
  latestMetric,
  groupByDate,
  multiSeriesByDate,
  getComparisonRange,
  pctChange,
  formatValue,
} from '@/lib/dataUtils'
import KPICard from '@/components/kpi/KPICard'
import LineChartWidget from '@/components/charts/LineChartWidget'
import BarChartWidget from '@/components/charts/BarChartWidget'
import DataTable, { Column } from '@/components/tables/DataTable'
import GlobalFilter from '@/components/filters/GlobalFilter'
import PageHeader from '@/components/ui/PageHeader'
import SectionDivider from '@/components/ui/SectionDivider'
import { PostRecord } from '@/types'
import clsx from 'clsx'

const PLATFORM_COLORS = {
  instagram: '#e1306c',
  facebook: '#1877f2',
}

export default function InstagramPage() {
  const { filters } = useFilters()
  const { dateRange, compareTo } = filters

  const current = useMemo(() => filterByDateRange(ALL_RECORDS, dateRange), [dateRange])
  const compRange = useMemo(() => getComparisonRange(dateRange, compareTo), [dateRange, compareTo])
  const prev = useMemo(() => compRange ? filterByDateRange(ALL_RECORDS, compRange) : [], [compRange])

  // ── KPI values ─────────────────────────────────────────────────────────────
  const kpis = useMemo(() => {
    const igFollowers = latestMetric(current, 'followers', 'instagram')
    const fbFollowers = latestMetric(current, 'followers', 'facebook')
    const prevIgFollowers = prev.length ? latestMetric(prev, 'followers', 'instagram') : undefined
    const prevFbFollowers = prev.length ? latestMetric(prev, 'followers', 'facebook') : undefined

    return {
      igImpressionsTotal:  sumMetric(current, 'impressions', 'instagram'),
      igReachTotal:        sumMetric(current, 'reach', 'instagram'),
      igProfileVisits:     sumMetric(current, 'profile_visits', 'instagram'),
      igLinkClicks:        sumMetric(current, 'link_clicks', 'instagram'),
      igWebsiteTaps:       sumMetric(current, 'website_taps', 'instagram'),
      igShares:            sumMetric(current, 'shares', 'instagram'),
      igSaves:             sumMetric(current, 'saves', 'instagram'),
      igEngagement:        avgMetric(current, 'engagement_rate', 'instagram'),
      igFollowers,
      fbFollowers,
      igFollowersGained:   sumMetric(current, 'followers_gained', 'instagram'),
      igFollowersLost:     sumMetric(current, 'followers_lost', 'instagram'),
      fbImpressionsTotal:  sumMetric(current, 'impressions', 'facebook'),
      fbReachTotal:        sumMetric(current, 'reach', 'facebook'),
      fbEngagement:        avgMetric(current, 'engagement_rate', 'facebook'),
      fbLinkClicks:        sumMetric(current, 'link_clicks', 'facebook'),
      fbShares:            sumMetric(current, 'shares', 'facebook'),

      prev: {
        igImpressions:    prev.length ? sumMetric(prev, 'impressions', 'instagram') : undefined,
        igReach:          prev.length ? sumMetric(prev, 'reach', 'instagram') : undefined,
        igProfileVisits:  prev.length ? sumMetric(prev, 'profile_visits', 'instagram') : undefined,
        igLinkClicks:     prev.length ? sumMetric(prev, 'link_clicks', 'instagram') : undefined,
        igEngagement:     prev.length ? avgMetric(prev, 'engagement_rate', 'instagram') : undefined,
        igFollowers:      prevIgFollowers,
        fbFollowers:      prevFbFollowers,
        fbImpressions:    prev.length ? sumMetric(prev, 'impressions', 'facebook') : undefined,
        fbEngagement:     prev.length ? avgMetric(prev, 'engagement_rate', 'facebook') : undefined,
      },
    }
  }, [current, prev])

  // ── Charts ─────────────────────────────────────────────────────────────────
  const impressionsOverTime = useMemo(() =>
    multiSeriesByDate(current, 'impressions', ['instagram', 'facebook']),
  [current])

  const reachOverTime = useMemo(() =>
    groupByDate(current, 'reach', ['instagram', 'facebook']),
  [current])

  const engagementOverTime = useMemo(() =>
    multiSeriesByDate(current, 'engagement_rate', ['instagram', 'facebook']),
  [current])

  const followersOverTime = useMemo(() =>
    multiSeriesByDate(current, 'followers', ['instagram', 'facebook']),
  [current])

  // ── Posts table ────────────────────────────────────────────────────────────
  const posts = useMemo(() =>
    MOCK_POSTS.filter(p => p.platform === 'instagram' || p.platform === 'facebook'),
  [])

  const postColumns: Column<PostRecord>[] = [
    {
      key: 'caption',
      label: 'Post',
      render: (_, row) => (
        <div className="max-w-xs">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={clsx('badge', row.platform === 'instagram' ? 'badge-red' : 'badge-blue')}>
              {row.platform === 'instagram' ? 'IG' : 'FB'}
            </span>
            <span className="badge badge-blue">{row.type}</span>
          </div>
          <p className="text-slate-300 truncate text-xs">{row.caption}</p>
        </div>
      ),
    },
    { key: 'date',           label: 'Date',        sortable: true },
    { key: 'impressions',    label: 'Impressions',  sortable: true, align: 'right', render: v => formatValue(v as number, 'number') },
    { key: 'reach',          label: 'Reach',        sortable: true, align: 'right', render: v => formatValue(v as number, 'number') },
    { key: 'likes',          label: 'Likes',        sortable: true, align: 'right', render: v => formatValue(v as number, 'number') },
    { key: 'comments',       label: 'Comments',     sortable: true, align: 'right', render: v => formatValue(v as number, 'number') },
    { key: 'shares',         label: 'Shares',       sortable: true, align: 'right', render: v => formatValue(v as number, 'number') },
    { key: 'saves',          label: 'Saves',        sortable: true, align: 'right', render: v => formatValue(v as number, 'number') },
    {
      key: 'engagement_rate', label: 'ER %', sortable: true, align: 'right',
      render: v => (
        <span className={clsx('font-medium', (v as number) >= 3 ? 'text-emerald-400' : (v as number) >= 1.5 ? 'text-amber-400' : 'text-red-400')}>
          {(v as number).toFixed(2)}%
        </span>
      ),
    },
  ]

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-6">
      <PageHeader
        title="Instagram & Facebook Organic"
        description="Organic reach, engagement, and audience growth across Meta platforms"
        icon={<Instagram className="w-5 h-5 text-pink-400" />}
        badge="Organic"
      />

      <GlobalFilter />

      {/* ── Instagram KPIs ─────────────────────────────────────────────────── */}
      <SectionDivider label="Instagram" />
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4 mb-6">
        <div className="col-span-2 md:col-span-2">
          <KPICard label="Impressions"    value={kpis.igImpressionsTotal} format="number" previousValue={kpis.prev.igImpressions} icon={<Eye className="w-4 h-4" />}             color="brand" />
        </div>
        <div className="col-span-2 md:col-span-2">
          <KPICard label="Reach"          value={kpis.igReachTotal}        format="number" previousValue={kpis.prev.igReach}       icon={<TrendingUp className="w-4 h-4" />}      color="violet" />
        </div>
        <div className="col-span-2 md:col-span-2">
          <KPICard label="Profile Visits" value={kpis.igProfileVisits}     format="number" previousValue={kpis.prev.igProfileVisits} icon={<Users className="w-4 h-4" />}         color="pink" />
        </div>
        <div className="col-span-2 md:col-span-2">
          <KPICard label="Link Clicks"    value={kpis.igLinkClicks}        format="number" previousValue={kpis.prev.igLinkClicks}  icon={<MousePointerClick className="w-4 h-4" />} color="sky" />
        </div>
        <div className="col-span-2 md:col-span-2">
          <KPICard label="Engagement Rate" value={kpis.igEngagement}       format="percent" previousValue={kpis.prev.igEngagement} icon={<Heart className="w-4 h-4" />}           color="rose" />
        </div>
        <div className="col-span-2 md:col-span-2">
          <KPICard label="Shares"          value={kpis.igShares}           format="number" icon={<Share2 className="w-4 h-4" />}   color="emerald" />
        </div>
        <div className="col-span-2 md:col-span-2">
          <KPICard label="Saves"           value={kpis.igSaves}            format="number" icon={<Bookmark className="w-4 h-4" />} color="amber" />
        </div>
        <div className="col-span-2 md:col-span-2">
          <KPICard
            label="Followers"
            value={kpis.igFollowers}
            format="number"
            previousValue={kpis.prev.igFollowers}
            subtitle={`+${formatValue(kpis.igFollowersGained, 'number')} gained  −${formatValue(kpis.igFollowersLost, 'number')} lost`}
            icon={<Users className="w-4 h-4" />}
            color="cyan"
          />
        </div>
      </div>

      {/* ── Instagram Charts ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
        <LineChartWidget
          title="Impressions Over Time"
          data={impressionsOverTime}
          series={[
            { key: 'instagram', label: 'Instagram', color: PLATFORM_COLORS.instagram },
            { key: 'facebook',  label: 'Facebook',  color: PLATFORM_COLORS.facebook },
          ]}
        />
        <LineChartWidget
          title="Engagement Rate (%)"
          data={engagementOverTime}
          series={[
            { key: 'instagram', label: 'Instagram', color: PLATFORM_COLORS.instagram },
            { key: 'facebook',  label: 'Facebook',  color: PLATFORM_COLORS.facebook },
          ]}
          format="percent"
        />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
        <LineChartWidget
          title="Follower Growth"
          data={followersOverTime}
          series={[
            { key: 'instagram', label: 'Instagram', color: PLATFORM_COLORS.instagram },
            { key: 'facebook',  label: 'Facebook',  color: PLATFORM_COLORS.facebook },
          ]}
        />
        <LineChartWidget
          title="Reach Over Time"
          data={reachOverTime.map(d => ({ date: d.date, reach: d.value }))}
          series={[{ key: 'reach', label: 'Total Reach', color: '#8b5cf6' }]}
        />
      </div>

      {/* ── Facebook KPIs ──────────────────────────────────────────────────── */}
      <SectionDivider label="Facebook" />
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-4 mb-6">
        <KPICard label="FB Impressions"   value={kpis.fbImpressionsTotal} format="number" previousValue={kpis.prev.fbImpressions} icon={<Eye className="w-4 h-4" />}       color="brand" />
        <KPICard label="FB Reach"         value={kpis.fbReachTotal}       format="number" icon={<TrendingUp className="w-4 h-4" />}                                          color="violet" />
        <KPICard label="FB Engagement"    value={kpis.fbEngagement}       format="percent" previousValue={kpis.prev.fbEngagement} icon={<Heart className="w-4 h-4" />}      color="rose" />
        <KPICard label="FB Followers"     value={kpis.fbFollowers}        format="number" previousValue={kpis.prev.fbFollowers}   icon={<Users className="w-4 h-4" />}      color="cyan" />
      </div>

      {/* ── Top Posts Table ────────────────────────────────────────────────── */}
      <SectionDivider label="Top Performing Posts" />
      <DataTable
        title="Post Performance"
        data={posts}
        columns={postColumns}
        defaultSortKey="impressions"
        searchKeys={['caption', 'platform', 'type']}
      />
    </div>
  )
}
