import { DataRecord, PostRecord, CampaignRecord } from '@/types'
import { subDays, format } from 'date-fns'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min

const randFloat = (min: number, max: number, decimals = 2) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals))

function dateStr(daysAgo: number) {
  return format(subDays(new Date(), daysAgo), 'yyyy-MM-dd')
}

// Generate 90 days of daily data
function generateDailyRecords(): DataRecord[] {
  const records: DataRecord[] = []

  for (let d = 89; d >= 0; d--) {
    const date = dateStr(d)

    // ── Instagram ──────────────────────────────────────────────────────────
    const igImpressions = rand(1200, 4800)
    const igReach = Math.floor(igImpressions * randFloat(0.55, 0.75))
    const igFollowers = 14200 + rand(-30, 60) * (90 - d)

    records.push(
      { date, platform: 'instagram', metric_name: 'impressions',    value: igImpressions, type: 'organic' },
      { date, platform: 'instagram', metric_name: 'reach',          value: igReach,       type: 'organic' },
      { date, platform: 'instagram', metric_name: 'profile_visits', value: rand(80, 320), type: 'organic' },
      { date, platform: 'instagram', metric_name: 'link_clicks',    value: rand(10, 90),  type: 'organic' },
      { date, platform: 'instagram', metric_name: 'website_taps',   value: rand(5, 60),   type: 'organic' },
      { date, platform: 'instagram', metric_name: 'followers',      value: igFollowers,   type: 'organic' },
      { date, platform: 'instagram', metric_name: 'followers_gained', value: rand(5, 60), type: 'organic' },
      { date, platform: 'instagram', metric_name: 'followers_lost',   value: rand(1, 20), type: 'organic' },
      { date, platform: 'instagram', metric_name: 'shares',         value: rand(5, 80),   type: 'organic' },
      { date, platform: 'instagram', metric_name: 'saves',          value: rand(10, 120), type: 'organic' },
      { date, platform: 'instagram', metric_name: 'likes',          value: rand(100, 600),type: 'organic' },
      { date, platform: 'instagram', metric_name: 'comments',       value: rand(5, 80),   type: 'organic' },
      { date, platform: 'instagram', metric_name: 'engagement_rate',value: randFloat(1.5, 6.5), type: 'organic' },
    )

    // ── Facebook ────────────────────────────────────────────────────────────
    const fbImpressions = rand(800, 3200)
    const fbReach = Math.floor(fbImpressions * randFloat(0.5, 0.7))

    records.push(
      { date, platform: 'facebook', metric_name: 'impressions',    value: fbImpressions, type: 'organic' },
      { date, platform: 'facebook', metric_name: 'reach',          value: fbReach,       type: 'organic' },
      { date, platform: 'facebook', metric_name: 'profile_visits', value: rand(30, 200), type: 'organic' },
      { date, platform: 'facebook', metric_name: 'link_clicks',    value: rand(8, 60),   type: 'organic' },
      { date, platform: 'facebook', metric_name: 'followers',      value: 8900 + rand(-10, 25) * (90 - d), type: 'organic' },
      { date, platform: 'facebook', metric_name: 'followers_gained', value: rand(2, 30), type: 'organic' },
      { date, platform: 'facebook', metric_name: 'followers_lost',   value: rand(1, 15), type: 'organic' },
      { date, platform: 'facebook', metric_name: 'shares',         value: rand(3, 50),   type: 'organic' },
      { date, platform: 'facebook', metric_name: 'saves',          value: rand(2, 40),   type: 'organic' },
      { date, platform: 'facebook', metric_name: 'likes',          value: rand(40, 300), type: 'organic' },
      { date, platform: 'facebook', metric_name: 'comments',       value: rand(2, 50),   type: 'organic' },
      { date, platform: 'facebook', metric_name: 'engagement_rate',value: randFloat(0.8, 4.2), type: 'organic' },
    )

    // ── TikTok ──────────────────────────────────────────────────────────────
    const ttViews = rand(2000, 18000)
    const ttFollowers = 22000 + rand(-50, 150) * (90 - d)

    records.push(
      { date, platform: 'tiktok', metric_name: 'views',          value: ttViews,        type: 'organic' },
      { date, platform: 'tiktok', metric_name: 'impressions',    value: Math.floor(ttViews * 1.1), type: 'organic' },
      { date, platform: 'tiktok', metric_name: 'reach',          value: Math.floor(ttViews * 0.85), type: 'organic' },
      { date, platform: 'tiktok', metric_name: 'likes',          value: rand(200, 1400), type: 'organic' },
      { date, platform: 'tiktok', metric_name: 'comments',       value: rand(10, 200),   type: 'organic' },
      { date, platform: 'tiktok', metric_name: 'shares',         value: rand(20, 400),   type: 'organic' },
      { date, platform: 'tiktok', metric_name: 'followers',      value: ttFollowers,     type: 'organic' },
      { date, platform: 'tiktok', metric_name: 'followers_gained', value: rand(30, 200), type: 'organic' },
      { date, platform: 'tiktok', metric_name: 'followers_lost',   value: rand(5, 50),   type: 'organic' },
      { date, platform: 'tiktok', metric_name: 'profile_views',  value: rand(100, 800),  type: 'organic' },
      { date, platform: 'tiktok', metric_name: 'link_clicks',    value: rand(15, 120),   type: 'organic' },
      { date, platform: 'tiktok', metric_name: 'engagement_rate',value: randFloat(3, 12), type: 'organic' },
    )

    // ── Meta Ads ────────────────────────────────────────────────────────────
    const metaSpend = randFloat(80, 350)
    const metaConversions = rand(3, 25)
    const metaRevenue = metaSpend * randFloat(2.5, 5.5)

    records.push(
      { date, platform: 'meta_ads', metric_name: 'spend',       value: metaSpend,                   type: 'paid', campaign_name: 'Brand Awareness' },
      { date, platform: 'meta_ads', metric_name: 'impressions', value: rand(8000, 35000),            type: 'paid', campaign_name: 'Brand Awareness' },
      { date, platform: 'meta_ads', metric_name: 'link_clicks', value: rand(80, 500),                type: 'paid', campaign_name: 'Brand Awareness' },
      { date, platform: 'meta_ads', metric_name: 'conversions', value: metaConversions,              type: 'paid', campaign_name: 'Conversions' },
      { date, platform: 'meta_ads', metric_name: 'cpc',         value: parseFloat((metaSpend / rand(80,500)).toFixed(2)), type: 'paid' },
      { date, platform: 'meta_ads', metric_name: 'cpm',         value: randFloat(8, 28),             type: 'paid' },
      { date, platform: 'meta_ads', metric_name: 'cpa',         value: parseFloat((metaSpend / Math.max(metaConversions,1)).toFixed(2)), type: 'paid' },
      { date, platform: 'meta_ads', metric_name: 'roas',        value: parseFloat((metaRevenue / metaSpend).toFixed(2)), type: 'paid' },
      { date, platform: 'meta_ads', metric_name: 'revenue',     value: metaRevenue,                  type: 'paid' },
      { date, platform: 'meta_ads', metric_name: 'purchases',   value: rand(1, 12),                  type: 'paid' },
      { date, platform: 'meta_ads', metric_name: 'leads',       value: rand(2, 15),                  type: 'paid' },
    )

    // ── Google Ads ──────────────────────────────────────────────────────────
    const gSpend = randFloat(120, 450)
    const gConversions = rand(5, 30)
    const gRevenue = gSpend * randFloat(3, 6)

    records.push(
      { date, platform: 'google_ads', metric_name: 'spend',       value: gSpend,                      type: 'paid', campaign_name: 'Search Campaign' },
      { date, platform: 'google_ads', metric_name: 'impressions', value: rand(5000, 20000),            type: 'paid', campaign_name: 'Search Campaign' },
      { date, platform: 'google_ads', metric_name: 'link_clicks', value: rand(100, 600),               type: 'paid', campaign_name: 'Search Campaign' },
      { date, platform: 'google_ads', metric_name: 'conversions', value: gConversions,                 type: 'paid', campaign_name: 'Conversions' },
      { date, platform: 'google_ads', metric_name: 'cpc',         value: parseFloat((gSpend / rand(100,600)).toFixed(2)), type: 'paid' },
      { date, platform: 'google_ads', metric_name: 'cpm',         value: randFloat(5, 20),             type: 'paid' },
      { date, platform: 'google_ads', metric_name: 'cpa',         value: parseFloat((gSpend / Math.max(gConversions,1)).toFixed(2)), type: 'paid' },
      { date, platform: 'google_ads', metric_name: 'roas',        value: parseFloat((gRevenue / gSpend).toFixed(2)), type: 'paid' },
      { date, platform: 'google_ads', metric_name: 'revenue',     value: gRevenue,                     type: 'paid' },
      { date, platform: 'google_ads', metric_name: 'purchases',   value: rand(2, 18),                  type: 'paid' },
      { date, platform: 'google_ads', metric_name: 'leads',       value: rand(3, 20),                  type: 'paid' },
    )

    // ── TikTok Ads ───────────────────────────────────────────────────────────
    const ttSpend = randFloat(50, 200)
    const ttConversions = rand(1, 12)
    const ttRevenue = ttSpend * randFloat(1.5, 4)

    records.push(
      { date, platform: 'tiktok_ads', metric_name: 'spend',       value: ttSpend,                     type: 'paid', campaign_name: 'TikTok Brand' },
      { date, platform: 'tiktok_ads', metric_name: 'impressions', value: rand(10000, 60000),           type: 'paid' },
      { date, platform: 'tiktok_ads', metric_name: 'views',       value: rand(8000, 45000),            type: 'paid' },
      { date, platform: 'tiktok_ads', metric_name: 'link_clicks', value: rand(50, 400),                type: 'paid' },
      { date, platform: 'tiktok_ads', metric_name: 'conversions', value: ttConversions,                type: 'paid' },
      { date, platform: 'tiktok_ads', metric_name: 'cpc',         value: parseFloat((ttSpend / rand(50,400)).toFixed(2)), type: 'paid' },
      { date, platform: 'tiktok_ads', metric_name: 'cpm',         value: randFloat(4, 18),             type: 'paid' },
      { date, platform: 'tiktok_ads', metric_name: 'cpa',         value: parseFloat((ttSpend / Math.max(ttConversions,1)).toFixed(2)), type: 'paid' },
      { date, platform: 'tiktok_ads', metric_name: 'roas',        value: parseFloat((ttRevenue / ttSpend).toFixed(2)), type: 'paid' },
      { date, platform: 'tiktok_ads', metric_name: 'revenue',     value: ttRevenue,                    type: 'paid' },
    )

    // ── Google Analytics 4 ───────────────────────────────────────────────────
    const sessions = rand(400, 2200)
    records.push(
      { date, platform: 'google_analytics', metric_name: 'sessions',             value: sessions,                    type: 'organic' },
      { date, platform: 'google_analytics', metric_name: 'traffic_organic',      value: Math.floor(sessions * randFloat(0.35, 0.5)), type: 'organic' },
      { date, platform: 'google_analytics', metric_name: 'traffic_paid',         value: Math.floor(sessions * randFloat(0.2, 0.35)),  type: 'paid' },
      { date, platform: 'google_analytics', metric_name: 'traffic_social',       value: Math.floor(sessions * randFloat(0.1, 0.25)),  type: 'organic' },
      { date, platform: 'google_analytics', metric_name: 'traffic_direct',       value: Math.floor(sessions * randFloat(0.1, 0.2)),   type: 'organic' },
      { date, platform: 'google_analytics', metric_name: 'bounce_rate',          value: randFloat(35, 65),           type: 'organic' },
      { date, platform: 'google_analytics', metric_name: 'avg_session_duration', value: randFloat(60, 240),          type: 'organic' },
      { date, platform: 'google_analytics', metric_name: 'revenue',              value: randFloat(800, 4500),        type: 'paid' },
      { date, platform: 'google_analytics', metric_name: 'purchases',            value: rand(5, 40),                 type: 'paid' },
      { date, platform: 'google_analytics', metric_name: 'conversion_rate',      value: randFloat(1.2, 5.5),         type: 'organic' },
      { date, platform: 'google_analytics', metric_name: 'leads',                value: rand(5, 50),                 type: 'organic' },
      { date, platform: 'google_analytics', metric_name: 'form_submissions',     value: rand(3, 30),                 type: 'organic' },
      { date, platform: 'google_analytics', metric_name: 'calls',                value: rand(2, 20),                 type: 'organic' },
      { date, platform: 'google_analytics', metric_name: 'whatsapp_clicks',      value: rand(5, 40),                 type: 'organic' },
    )
  }

  return records
}

// ─── Post-level mock data ─────────────────────────────────────────────────────

const postCaptions = [
  'New collection just dropped! Swipe to see all styles ✨',
  'Behind the scenes at our studio 📸',
  'Customer story: How we helped Sarah find her perfect fit',
  'Summer sale starts now — 30% off everything!',
  'The secret ingredient? Quality you can feel.',
  'Meet our team: the people behind the brand',
  'This week\'s bestseller is back in stock 🔥',
  'Tutorial: How to style our signature piece 3 ways',
  'Client transformation before & after ⬇️',
  'We\'re hiring! Link in bio for details',
]

export const MOCK_POSTS: PostRecord[] = Array.from({ length: 20 }, (_, i) => {
  const platform = i < 10 ? (i % 2 === 0 ? 'instagram' : 'facebook') : 'tiktok'
  const impressions = rand(800, 15000)
  const reach = Math.floor(impressions * randFloat(0.55, 0.85))
  const likes = rand(50, 2000)
  const comments = rand(5, 200)
  const shares = rand(3, 300)
  const saves = rand(10, 500)

  return {
    id: `post-${i + 1}`,
    platform,
    type: platform === 'tiktok' ? 'video' : i % 3 === 0 ? 'reel' : 'post',
    date: dateStr(rand(0, 60)),
    caption: postCaptions[i % postCaptions.length],
    impressions,
    reach,
    likes,
    comments,
    shares,
    saves,
    engagement_rate: parseFloat(((likes + comments + shares + saves) / Math.max(reach, 1) * 100).toFixed(2)),
    views: platform === 'tiktok' ? rand(2000, 50000) : undefined,
  }
})

// ─── Campaign mock data ───────────────────────────────────────────────────────

export const MOCK_CAMPAIGNS: CampaignRecord[] = [
  {
    id: 'camp-1',
    platform: 'meta_ads',
    name: 'Summer Brand Awareness',
    status: 'active',
    start_date: dateStr(30),
    spend: 4820,
    impressions: 285000,
    clicks: 8400,
    conversions: 312,
    conversion_type: 'purchase',
    cpc: 0.57,
    cpm: 16.9,
    cpa: 15.4,
    roas: 4.2,
    revenue: 20244,
  },
  {
    id: 'camp-2',
    platform: 'meta_ads',
    name: 'Lead Generation — Q3',
    status: 'active',
    start_date: dateStr(45),
    spend: 2100,
    impressions: 142000,
    clicks: 3200,
    conversions: 185,
    conversion_type: 'lead',
    cpc: 0.65,
    cpm: 14.7,
    cpa: 11.35,
    roas: 3.8,
    revenue: 7980,
  },
  {
    id: 'camp-3',
    platform: 'google_ads',
    name: 'Search — Brand Keywords',
    status: 'active',
    start_date: dateStr(60),
    spend: 6300,
    impressions: 98000,
    clicks: 12400,
    conversions: 520,
    conversion_type: 'purchase',
    cpc: 0.5,
    cpm: 64.2,
    cpa: 12.1,
    roas: 5.1,
    revenue: 32130,
  },
  {
    id: 'camp-4',
    platform: 'google_ads',
    name: 'Performance Max — eCommerce',
    status: 'active',
    start_date: dateStr(20),
    spend: 3900,
    impressions: 210000,
    clicks: 6800,
    conversions: 290,
    conversion_type: 'purchase',
    cpc: 0.57,
    cpm: 18.5,
    cpa: 13.4,
    roas: 4.7,
    revenue: 18330,
  },
  {
    id: 'camp-5',
    platform: 'tiktok_ads',
    name: 'TikTok — Gen Z Reach',
    status: 'active',
    start_date: dateStr(15),
    spend: 1850,
    impressions: 520000,
    clicks: 4100,
    conversions: 98,
    conversion_type: 'purchase',
    cpc: 0.45,
    cpm: 3.5,
    cpa: 18.8,
    roas: 3.1,
    revenue: 5735,
  },
  {
    id: 'camp-6',
    platform: 'meta_ads',
    name: 'Retargeting — Cart Abandoners',
    status: 'completed',
    start_date: dateStr(90),
    end_date: dateStr(30),
    spend: 1200,
    impressions: 65000,
    clicks: 2800,
    conversions: 145,
    conversion_type: 'purchase',
    cpc: 0.42,
    cpm: 18.4,
    cpa: 8.27,
    roas: 6.8,
    revenue: 8160,
  },
  {
    id: 'camp-7',
    platform: 'google_ads',
    name: 'YouTube — Video Awareness',
    status: 'completed',
    start_date: dateStr(75),
    end_date: dateStr(45),
    spend: 2400,
    impressions: 380000,
    clicks: 1900,
    conversions: 42,
    conversion_type: 'lead',
    cpc: 1.26,
    cpm: 6.3,
    cpa: 57.1,
    roas: 1.8,
    revenue: 4320,
  },
]

// ─── Export the full dataset (generated once, stable for session) ─────────────

export const ALL_RECORDS: DataRecord[] = generateDailyRecords()
