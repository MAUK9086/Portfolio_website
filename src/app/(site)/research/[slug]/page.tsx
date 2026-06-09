'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

export default function ResearchDetailPage() {
  const { slug } = useParams()
  const [item, setItem] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!slug) return
    supabase.from('research').select('*').eq('slug', slug).single().then(({ data }) => {
      setItem(data)
      setLoading(false)
    })
  }, [slug])

  if (loading) return <div className="container pt-32"><div className="h-48 rounded-2xl bg-white/[0.04] animate-pulse" /></div>
  if (!item) return <div className="container pt-32 text-center text-muted-foreground">Not found.</div>

  return (
    <main className="container max-w-3xl py-24 pt-32">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/research" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> All Research
        </Link>

        <h1 className="text-4xl font-bold text-white mb-4">{item.title}</h1>

        {item.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {item.tags.map((tag: string) => (
              <span key={tag} className="px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs text-white/60">{tag}</span>
            ))}
          </div>
        )}

        {(item.paper_url || item.notebook_url) && (
          <div className="flex flex-wrap gap-3 mb-8">
            {item.paper_url && (
              <a href={item.paper_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm hover:bg-purple-500/20 transition-colors">
                <ExternalLink className="w-4 h-4" /> Paper
              </a>
            )}
            {item.notebook_url && (
              <a href={item.notebook_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-300 text-sm hover:bg-orange-500/20 transition-colors">
                <ExternalLink className="w-4 h-4" /> Notebook
              </a>
            )}
          </div>
        )}

        {item.abstract && (
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 mb-8">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Abstract</p>
            <p className="text-muted-foreground leading-relaxed">{item.abstract}</p>
          </div>
        )}

        {item.content_mdx && (
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
              {item.content_mdx}
            </ReactMarkdown>
          </div>
        )}
      </motion.div>
    </main>
  )
}
