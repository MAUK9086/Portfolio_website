'use client'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowUpRight, BookOpen } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'

export default function ResearchPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase
      .from('research')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setItems(data)
        setLoading(false)
      })
  }, [])

  return (
    <main className="container py-24 pt-32">
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <p className="text-xs text-muted-foreground tracking-widest uppercase mb-3">Academic Work</p>
        <h1 className="text-5xl font-bold text-white mb-4">Research</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Investigations, experiments, and written-up findings.
        </p>
      </motion.header>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 rounded-2xl bg-white/[0.04] animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">No research projects yet.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <Link href={`/research/${item.slug}`}>
                <div className="group h-full rounded-2xl bg-white/[0.04] border border-white/10 p-6 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                      <BookOpen className="w-4 h-4 text-primary" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-white/70 transition-colors mt-1" />
                  </div>
                  <h3 className="font-semibold text-white group-hover:text-primary transition-colors mb-2">
                    {item.title}
                  </h3>
                  {item.abstract && (
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{item.abstract}</p>
                  )}
                  {item.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="px-2 py-0.5 rounded-full bg-white/[0.06] text-xs text-white/50">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  )
}
