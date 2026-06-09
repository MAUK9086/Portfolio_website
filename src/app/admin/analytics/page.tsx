'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { Eye, Clock, TrendingUp, MousePointerClick } from 'lucide-react'
import { format, subDays } from 'date-fns'

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe']

interface PageView {
  id: string
  path: string
  referrer: string
  time_spent_seconds: number
  max_scroll_depth: number
  created_at: string
}

function KPICard({ label, value, icon: Icon, sub }: { label: string; value: string | number; icon: any; sub?: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-white/40 uppercase tracking-wider">{label}</p>
        <Icon className="w-4 h-4 text-white/20" />
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-white/40 mt-1">{sub}</p>}
    </div>
  )
}

export default function AnalyticsPage() {
  const [views, setViews] = useState<PageView[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase
      .from('page_views')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setViews(data)
        setLoading(false)
      })
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-white/40 text-sm">Loading analytics...</p>
    </div>
  )

  // Derived metrics
  const totalViews = views.length
  const uniquePaths = new Set(views.map((v) => v.path)).size
  const avgTime = views.length
    ? Math.round(views.reduce((s, v) => s + (v.time_spent_seconds || 0), 0) / views.length)
    : 0
  const avgScroll = views.length
    ? Math.round(views.reduce((s, v) => s + (v.max_scroll_depth || 0), 0) / views.length)
    : 0

  // Daily traffic — last 14 days
  const last14 = Array.from({ length: 14 }, (_, i) => {
    const d = subDays(new Date(), 13 - i)
    const label = format(d, 'MMM d')
    const dateStr = format(d, 'yyyy-MM-dd')
    const count = views.filter((v) => v.created_at?.startsWith(dateStr)).length
    return { date: label, views: count }
  })

  // Top pages
  const pageCounts: Record<string, number> = {}
  views.forEach((v) => { pageCounts[v.path] = (pageCounts[v.path] || 0) + 1 })
  const topPages = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([path, count]) => ({ path, count }))

  // Referrers
  const refCounts: Record<string, number> = {}
  views.forEach((v) => {
    const ref = v.referrer || 'Direct'
    refCounts[ref] = (refCounts[ref] || 0) + 1
  })
  const topRefs = Object.entries(refCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }))

  // Scroll depth buckets
  const scrollBuckets = [
    { label: '0–25%', count: views.filter((v) => v.max_scroll_depth <= 25).length },
    { label: '26–50%', count: views.filter((v) => v.max_scroll_depth > 25 && v.max_scroll_depth <= 50).length },
    { label: '51–75%', count: views.filter((v) => v.max_scroll_depth > 50 && v.max_scroll_depth <= 75).length },
    { label: '76–100%', count: views.filter((v) => v.max_scroll_depth > 75).length },
  ]

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-sm text-white/40 mt-1">Page view data from your site</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Total Views" value={totalViews} icon={Eye} />
        <KPICard label="Unique Pages" value={uniquePaths} icon={MousePointerClick} />
        <KPICard label="Avg. Time on Page" value={`${avgTime}s`} icon={Clock} />
        <KPICard label="Avg. Scroll Depth" value={`${avgScroll}%`} icon={TrendingUp} />
      </div>

      {/* Traffic over time */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-white/60 mb-6 uppercase tracking-wider">Traffic — Last 14 Days</h2>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={last14}>
            <defs>
              <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
            <Area type="monotone" dataKey="views" stroke="#6366f1" fill="url(#trafficGrad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white/60 mb-6 uppercase tracking-wider">Top Pages</h2>
          {topPages.length === 0 ? (
            <p className="text-sm text-white/30 py-4 text-center">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topPages} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="path" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Referrers */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white/60 mb-6 uppercase tracking-wider">Traffic Sources</h2>
          {topRefs.length === 0 ? (
            <p className="text-sm text-white/30 py-4 text-center">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={topRefs} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {topRefs.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Scroll depth */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-white/60 mb-6 uppercase tracking-wider">Scroll Depth Distribution</h2>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={scrollBuckets}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
            <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {totalViews === 0 && (
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-white/40 text-sm">No page view data yet. Add the tracking snippet to your pages to start collecting data.</p>
        </div>
      )}
    </div>
  )
}
