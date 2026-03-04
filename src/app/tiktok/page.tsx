'use client'

import { useMemo } from 'react'
import { Music2, Eye, Users, Heart, Share2, MousePointerClick, TrendingUp } from 'lucide-react'
import { useFilters } from '@/context/FilterContext'
import { ALL_RECORDS, MOCK_POSTS } from '@/data/mockData'
import {
  filterByDateRange,
  sumMetric,
  avgMetric,
  latestMetric,
  groupByDate,
  getComparisonRange,
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

const TT_COLOR = '#ff0050'
const TT_SECONDARY = '#69c9d0'

export default function TikTokPage() {
  const { filters } = useFilters()
  const { dateRange, compareTo } = filters

  const current = useMemo(() => filterByDateRange(ALL_RECORDS, dateRange), [dateRange])
  const compRange = useMemo(() => getComparisonRange(dateRange, compareTo), [dateRange, compareTo])
  const prev = useMemo(() => compRange ? filterByDateRange(ALL_RECORDS, compRange) : [], [compRange])

  // ── KPIs ──────────────────────────────────────────────────────────────────
  const kpis = useMemo(() => ({
    views:           sumMetric(current, 'views', 'tiktok'),
    likes:           sumMetric(current, 'likes', 'tiktok'),
    comments:        sumMetric(current, 'comments', 'tiktok'),
    shares:          sumMetric(current, 'shares', 'tiktok'),
    followers:       latestMetric(current, 'followers', 'tiktok'),
    followersGained: sumMetric(current, 'followers_gained', 'tiktok'),
    followersLost:   sumMetric(current, 'followers_lost', 'tiktok'),
    profileViews:    sumMetric(current, 'profile_views', 'tiktok'),
    linkClicks:      sumMetric(current, 'link_clicks', 'tiktok'),
    engagementRate:  avgMetric(current, 'engagement_rate', 'tiktok'),
    reach:           sumMetric(current, 'reach', 'tiktok'),

    prev: {
      views:          prev.length ? sumMetric(prev, 'views', 'tiktok') : undefined,
      likes:          prev.length ? sumMetric(prev, 'likes', 'tiktok') : undefined,
      shares:         prev.length ? sumMetric(prev, 'shares', 'tiktok') : undefined,
      followers:      prev.length ? latestMetric(prev, 'followers', 'tiktok') : undefined,
      profileViews:   prev.length ? sumMetric(prev, 'profile_views', 'tiktok') : undefined,
      linkClicks:     prev.length ? sumMetric(prev, 'link_clicks', 'tiktok') : undefined,
      engagementRate: prev.length ? avgMetric(prev, 'engagement_rate', 'tiktok') : undefined,
    },
  }), [current, prev])

  // ── Charts ────────────────────────────────────────────────────────────────
  const viewsOverTime = useMemo(() =>
    groupByDate(current, 'views', 'tiktok').map(d => ({ date: d.date, views: d.value })),
  [current])

  const followersOverTime = useMemo(() =>
    groupByDate(current, 'followers', 'tiktok').map(d => ({ date: d.date, followers: d.value })),
  [current])

  const engagementOverTime = useMemo(() =>
    groupByDate(current, 'engagement_rate', 'tiktok').map(d => ({ date: d.date, engagement_rate: d.value })),
  [current])

  const weeklyBreakdown = useMemo(() => {
    const buckets: Record<string, { views: number; likes: number; shares: number }> = {}
    const recs = current.filter(r => r.platform === 'tiktok' && ['views', 'likes', 'shares'].includes(r.metric_name))
    for (const r of recs) {
      const week = r.date.slice(0, 7) // YYYY-MM group by month
      if (!buckets[week]) buckets[week] = { views: 0, likes: 0, shares: 0 }
      buckets[week][r.metric_name as 'views' | 'likes' | 'shares'] += r.value
    }
    return Object.entries(buckets)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, vals]) => ({ month, ...vals }))
  }, [current])

  // ── Videos table ──────────────────────────────────────────────────────────
  const videos = useMemo(() => MOCK_POSTS.filter(p => p.platform === 'tiktok'), [])

  const videoColumns: Column<PostRecord>[] = [
    {
      key: 'caption',
      label: 'Video',
      render: (_, row) => (
        <div className="max-w-xs">
          <p className="text-slate-300 truncate text-xs">{row.caption}</p>
          <p className="text-slate-600 text-[10px] mt-0.5">{row.date}</p>
        </div>
      ),
    },
    { key: 'views',    label: 'Views',    sortable: true, align: 'right', render: v => formatValue(v as number, 'number') },
    { key: 'likes',    label: 'Likes',    sortable: true, align: 'right', render: v => formatValue(v as number, 'number') },
    { key: 'comments', label: 'Comments', sortable: true, align: 'right', render: v => formatValue(v as number, 'number') },
    { key: 'shares',   label: 'Shares',   sortable: true, align: 'right', render: v => formatValue(v as number, 'number') },
    {
      key: 'engagement_rate', label: 'ER %', sortable: true, align: 'right',
      render: v => (
        <span className={clsx('font-medium', (v as number) >= 5 ? 'text-emerald-400' : (v as number) >= 2 ? 'text-amber-400' : 'text-red-400')}>
          {(v as number).toFixed(2)}%
        </span>
      ),
    },
  ]

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-6">
      <PageHeader
        title="TikTok Organic"
        description="Video performance, follower growth, and engagement on TikTok"
        icon={<Music2 className="w-5 h-5 text-[#ff0050]" />}
        badge="Organic"
      />

      <GlobalFilter />

      {/* ── KPIs ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
        <KPICard label="Total Views"     value={kpis.views}          format="number"  previousValue={kpis.prev.views}         icon={<Eye className="w-4 h-4" />}             color="rose" />
        <KPICard label="Likes"           value={kpis.likes}          format="number"  previousValue={kpis.prev.likes}         icon={<Heart className="w-4 h-4" />}           color="pink" />
        <KPICard label="Shares"          value={kpis.shares}         format="number"  previousValue={kpis.prev.shares}        icon={<Share2 className="w-4 h-4" />}          color="violet" />
        <KPICard label="Engagement Rate" value={kpis.engagementRate} format="percent" previousValue={kpis.prev.engagementRate} icon={<TrendingUp className="w-4 h-4" />}    color="brand" />
        <KPICard
          label="Followers"
          value={kpis.followers}
          format="number"
          previousValue={kpis.prev.followers}
          subtitle={`+${formatValue(kpis.followersGained, 'number')} gained`}
          icon={<Users className="w-4 h-4" />}
          color="cyan"
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <KPICard label="Profile Views"   value={kpis.profileViews}  format="number" previousValue={kpis.prev.profileViews}  icon={<Users className="w-4 h-4" />}            color="amber" />
        <KPICard label="Link Clicks"     value={kpis.linkClicks}    format="number" previousValue={kpis.prev.linkClicks}    icon={<MousePointerClick className="w-4 h-4" />} color="sky" />
        <KPICard label="Comments"        value={kpis.comments}      format="number" icon={<Heart className="w-4 h-4" />}                                                     color="emerald" />
      </div>

      {/* ── Charts ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
        <LineChartWidget
          title="Views Over Time"
          data={viewsOverTime}
          series={[{ key: 'views', label: 'Views', color: TT_COLOR }]}
        />
        <LineChartWidget
          title="Follower Growth"
          data={followersOverTime}
          series={[{ key: 'followers', label: 'Followers', color: TT_SECONDARY }]}
        />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
        <LineChartWidget
          title="Engagement Rate (%)"
          data={engagementOverTime}
          series={[{ key: 'engagement_rate', label: 'ER %', color: '#f59e0b' }]}
          format="percent"
        />
        <BarChartWidget
          title="Monthly Breakdown"
          data={weeklyBreakdown}
          xKey="month"
          bars={[
            { key: 'views',  label: 'Views',  color: TT_COLOR },
            { key: 'likes',  label: 'Likes',  color: TT_SECONDARY },
            { key: 'shares', label: 'Shares', color: '#a855f7' },
          ]}
        />
      </div>

      {/* ── Video table ───────────────────────────────────────────────────── */}
      <SectionDivider label="Video Performance" />
      <DataTable
        title="Top Videos"
        data={videos}
        columns={videoColumns}
        defaultSortKey="views"
        searchKeys={['caption']}
      />
    </div>
  )
}
