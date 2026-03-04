import { DataRecord, Platform, MetricName, DateRange } from '@/types'
import { isWithinInterval, parseISO, subDays, subMonths, subYears } from 'date-fns'

// ─── Filter records by date range ─────────────────────────────────────────────

export function filterByDateRange(records: DataRecord[], range: DateRange): DataRecord[] {
  return records.filter(r => {
    const d = parseISO(r.date)
    return isWithinInterval(d, { start: range.from, end: range.to })
  })
}

// ─── Filter by platform(s) ────────────────────────────────────────────────────

export function filterByPlatform(records: DataRecord[], platforms: Platform[]): DataRecord[] {
  if (!platforms.length) return records
  return records.filter(r => platforms.includes(r.platform))
}

// ─── Sum a metric over a filtered record set ──────────────────────────────────

export function sumMetric(
  records: DataRecord[],
  metric: MetricName,
  platform?: Platform | Platform[]
): number {
  let filtered = records.filter(r => r.metric_name === metric)
  if (platform) {
    const platforms = Array.isArray(platform) ? platform : [platform]
    filtered = filtered.filter(r => platforms.includes(r.platform))
  }
  return filtered.reduce((sum, r) => sum + r.value, 0)
}

// ─── Average a metric ────────────────────────────────────────────────────────

export function avgMetric(
  records: DataRecord[],
  metric: MetricName,
  platform?: Platform | Platform[]
): number {
  let filtered = records.filter(r => r.metric_name === metric)
  if (platform) {
    const platforms = Array.isArray(platform) ? platform : [platform]
    filtered = filtered.filter(r => platforms.includes(r.platform))
  }
  if (!filtered.length) return 0
  return filtered.reduce((sum, r) => sum + r.value, 0) / filtered.length
}

// ─── Latest value of a metric ─────────────────────────────────────────────────

export function latestMetric(
  records: DataRecord[],
  metric: MetricName,
  platform?: Platform
): number {
  let filtered = records
    .filter(r => r.metric_name === metric)
    .filter(r => !platform || r.platform === platform)
    .sort((a, b) => b.date.localeCompare(a.date))
  return filtered[0]?.value ?? 0
}

// ─── Group by date for chart series ──────────────────────────────────────────

export function groupByDate(
  records: DataRecord[],
  metric: MetricName,
  platform?: Platform | Platform[]
): { date: string; value: number }[] {
  const filtered = records
    .filter(r => r.metric_name === metric)
    .filter(r => {
      if (!platform) return true
      const platforms = Array.isArray(platform) ? platform : [platform]
      return platforms.includes(r.platform)
    })

  const map = new Map<string, number>()
  for (const r of filtered) {
    map.set(r.date, (map.get(r.date) ?? 0) + r.value)
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({ date, value }))
}

// ─── Multi-series: one line per platform ─────────────────────────────────────

export function multiSeriesByDate(
  records: DataRecord[],
  metric: MetricName,
  platforms: Platform[]
): { date: string; [key: string]: number | string }[] {
  const allDates = [...new Set(records.map(r => r.date))].sort()

  return allDates.map(date => {
    const entry: { date: string; [key: string]: number | string } = { date }
    for (const platform of platforms) {
      const rec = records.find(r => r.date === date && r.platform === platform && r.metric_name === metric)
      entry[platform] = rec?.value ?? 0
    }
    return entry
  })
}

// ─── Compute comparison range ─────────────────────────────────────────────────

export function getComparisonRange(
  range: DateRange,
  mode: 'previous_period' | 'last_year' | 'none'
): DateRange | null {
  if (mode === 'none') return null

  const days = Math.round((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24))

  if (mode === 'previous_period') {
    return {
      from: subDays(range.from, days + 1),
      to:   subDays(range.from, 1),
    }
  }

  if (mode === 'last_year') {
    return {
      from: subYears(range.from, 1),
      to:   subYears(range.to, 1),
    }
  }

  return null
}

// ─── Percent change ───────────────────────────────────────────────────────────

export function pctChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return parseFloat(((current - previous) / previous * 100).toFixed(1))
}

// ─── Format values ────────────────────────────────────────────────────────────

export function formatValue(
  value: number,
  format: 'number' | 'currency' | 'percent' | 'duration'
): string {
  switch (format) {
    case 'currency':
      if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
      if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`
      return `$${value.toFixed(2)}`
    case 'percent':
      return `${value.toFixed(1)}%`
    case 'duration': {
      const mins = Math.floor(value / 60)
      const secs = Math.floor(value % 60)
      return `${mins}:${secs.toString().padStart(2, '0')}`
    }
    case 'number':
    default:
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
      if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
      return value.toLocaleString()
  }
}

// ─── Default date ranges ──────────────────────────────────────────────────────

export const PRESET_RANGES = {
  last7: (): DateRange => ({ from: subDays(new Date(), 7), to: new Date() }),
  last30: (): DateRange => ({ from: subDays(new Date(), 30), to: new Date() }),
  last90: (): DateRange => ({ from: subDays(new Date(), 90), to: new Date() }),
  lastMonth: (): DateRange => {
    const now = new Date()
    const start = subMonths(now, 1)
    start.setDate(1)
    const end = new Date(now.getFullYear(), now.getMonth(), 0)
    return { from: start, to: end }
  },
  thisYear: (): DateRange => ({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  }),
}
