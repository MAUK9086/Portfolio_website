'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { Search } from 'lucide-react'

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [tab, setTab] = useState<'all' | 'tech' | 'personal'>('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setPosts(data)
        setLoading(false)
      })
  }, [])

  const filtered = posts
    .filter((p) => tab === 'all' || p.type === tab)
    .filter((p) =>
      !search || p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt?.toLowerCase().includes(search.toLowerCase())
    )

  return (
    <main className="container py-24 pt-32 max-w-3xl">
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <p className="text-xs text-muted-foreground tracking-widest uppercase mb-3">Writing</p>
        <h1 className="text-5xl font-bold text-white mb-4">Blog</h1>
        <p className="text-muted-foreground">
          Technical deep-dives and personal reflections.
        </p>
      </motion.header>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <div className="flex gap-1 p-1 rounded-xl bg-white/[0.05] border border-white/10">
          {(['all', 'tech', 'personal'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                tab === t ? 'bg-white text-black' : 'text-white/60 hover:text-white'
              }`}
            >
              {t === 'all' ? 'All' : t === 'tech' ? 'Technical' : 'Personal'}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/[0.05] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/20"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-white/[0.04] animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">No posts found.</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((post, i) => {
            const href = post.type === 'personal' ? `/blog/personal/${post.slug}` : `/blog/${post.slug}`
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={href}>
                  <div className="group flex gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.06] hover:border-white/15 transition-all duration-300">
                    {post.cover_url && (
                      <div className="shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-white/5">
                        <img src={post.cover_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${
                          post.type === 'tech'
                            ? 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                            : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                        }`}>
                          {post.type === 'tech' ? 'Technical' : 'Personal'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(post.created_at), 'MMM d, yyyy')}
                        </span>
                        {post.read_time_minutes && (
                          <span className="text-xs text-muted-foreground">&bull; {post.read_time_minutes} min</span>
                        )}
                      </div>
                      <h2 className="font-semibold text-white group-hover:text-primary transition-colors leading-snug mb-1 truncate">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-xs text-muted-foreground line-clamp-2">{post.excerpt}</p>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      )}
    </main>
  )
}
