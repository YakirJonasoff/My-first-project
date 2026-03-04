// ─── Unified Data Record (matches Make pipeline schema) ─────────────────────

export interface DataRecord {
  date: string          // ISO date string YYYY-MM-DD
  platform: Platform
  metric_name: MetricName
  value: number
  campaign_name?: string
  type: 'organic' | 'paid'
}

// ─── Platforms ────────────────────────────────────────────────────────────────

export type Platform =
  | 'instagram'
  | 'facebook'
  | 'tiktok'
  | 'google_ads'
  | 'meta_ads'
  | 'tiktok_ads'
  | 'google_analytics'

// ─── Metrics ─────────────────────────────────────────────────────────────────

export type MetricName =
  // Organic social
  | 'impressions'
  | 'reach'
  | 'profile_visits'
  | 'link_clicks'
  | 'website_taps'
  | 'followers'
  | 'followers_gained'
  | 'followers_lost'
  | 'engagement_rate'
  | 'shares'
  | 'saves'
  | 'likes'
  | 'comments'
  | 'views'
  | 'profile_views'
  // Paid
  | 'spend'
  | 'conversions'
  | 'cpc'
  | 'cpm'
  | 'cpa'
  | 'roas'
  | 'purchases'
  | 'leads'
  | 'form_submissions'
  | 'calls'
  | 'whatsapp_clicks'
  // GA4
  | 'sessions'
  | 'bounce_rate'
  | 'avg_session_duration'
  | 'revenue'
  | 'conversion_rate'
  | 'traffic_organic'
  | 'traffic_paid'
  | 'traffic_direct'
  | 'traffic_social'

// ─── Conversion Types ─────────────────────────────────────────────────────────

export type ConversionType = 'purchase' | 'lead' | 'form' | 'call' | 'whatsapp'

// ─── Filter State ─────────────────────────────────────────────────────────────

export interface DateRange {
  from: Date
  to: Date
}

export interface FilterState {
  dateRange: DateRange
  compareTo: 'previous_period' | 'last_year' | 'none'
  platforms: Platform[]
  campaignStatus: 'all' | 'active' | 'completed'
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

export interface KPIConfig {
  id: string
  label: string
  metric: MetricName
  platform?: Platform | Platform[]
  type?: 'organic' | 'paid'
  format: 'number' | 'currency' | 'percent' | 'duration'
  icon?: string
  color?: string
}

// ─── Post / Video performance ─────────────────────────────────────────────────

export interface PostRecord {
  id: string
  platform: 'instagram' | 'facebook' | 'tiktok'
  type: 'post' | 'reel' | 'story' | 'video'
  date: string
  thumbnail?: string
  caption: string
  impressions: number
  reach: number
  likes: number
  comments: number
  shares: number
  saves: number
  engagement_rate: number
  views?: number
}

// ─── Campaign record ─────────────────────────────────────────────────────────

export interface CampaignRecord {
  id: string
  platform: 'meta_ads' | 'google_ads' | 'tiktok_ads'
  name: string
  status: 'active' | 'completed' | 'paused'
  start_date: string
  end_date?: string
  spend: number
  impressions: number
  clicks: number
  conversions: number
  conversion_type: ConversionType
  cpc: number
  cpm: number
  cpa: number
  roas: number
  revenue: number
}
