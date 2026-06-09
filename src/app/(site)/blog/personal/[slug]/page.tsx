'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Share2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const tiltClasses = ['polaroid-tilt-left', 'polaroid-tilt-right', 'polaroid-tilt-slight-left', 'polaroid-tilt-slight-right']

export default function PersonalBlogPage() {
  const { slug } = useParams()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!slug) return
    supabase.from('blog_posts').select('*').eq('slug', slug).single().then(({ data }) => {
      setPost(data)
      setLoading(false)
    })
  }, [slug])

  const handleShare = () => {
    if (navigator.share) navigator.share({ title: post?.title, url: window.location.href })
    else navigator.clipboard.writeText(window.location.href)
  }

  if (loading) return <div className="container pt-32"><div className="h-64 rounded-2xl bg-amber-100/20 animate-pulse" /></div>
  if (!post) return <div className="container pt-32 text-center text-muted-foreground">Post not found.</div>

  return (
    /* Entire page shifts to warm scrapbook palette */
    <div className="min-h-screen scrapbook-bg pt-24 pb-20">
      <div className="container max-w-2xl">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-amber-800/60 hover:text-amber-900 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Title — handwriting style */}
          <h1 className="font-caveat text-5xl text-amber-950 mb-3 leading-tight">{post.title}</h1>

          {/* Date sticker */}
          <div className="inline-block mb-6 px-3 py-1.5 rounded-full bg-amber-200 border border-amber-300 text-amber-800 text-sm font-medium">
            {format(new Date(post.created_at), 'MMMM d, yyyy')}
          </div>

          {/* Body — scrapbook MDX rendering */}
          <div className="space-y-6 text-[17px] text-[#3d2b1f] leading-[1.85]">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                img({ src, alt, ...props }: any) {
                  const i = Math.abs((src?.charCodeAt(0) ?? 0) % tiltClasses.length)
                  return (
                    <span className={`block my-6 ${tiltClasses[i]} inline-block`}>
                      <span className="polaroid inline-block">
                        <img src={src} alt={alt} className="block w-full max-w-sm rounded-sm" {...props} />
                        {alt && <p className="text-center text-xs text-black/50 mt-1 font-caveat text-sm">{alt}</p>}
                      </span>
                    </span>
                  )
                },
                blockquote({ children }: any) {
                  return (
                    <div className="sticky-note rounded-lg p-4 my-6 font-caveat text-xl text-amber-950/80">
                      {children}
                    </div>
                  )
                },
                h2({ children }: any) {
                  return <h2 className="font-caveat text-3xl text-amber-900 mt-8 mb-2">{children}</h2>
                },
                h3({ children }: any) {
                  return <h3 className="font-caveat text-2xl text-amber-800 mt-6 mb-2">{children}</h3>
                },
                code({ children }: any) {
                  return <code className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
                },
                p({ children }: any) {
                  return <p className="mb-4">{children}</p>
                },
              }}
            >
              {post.content_mdx ?? ''}
            </ReactMarkdown>
          </div>

          {/* Tags as sticker labels */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-amber-200">
              {post.tags.map((tag: string, i: number) => {
                const colors = [
                  'bg-pink-100 text-pink-700 border-pink-200',
                  'bg-amber-100 text-amber-700 border-amber-200',
                  'bg-green-100 text-green-700 border-green-200',
                  'bg-purple-100 text-purple-700 border-purple-200',
                  'bg-blue-100 text-blue-700 border-blue-200',
                ]
                return (
                  <span key={tag} className={`px-3 py-1.5 rounded-full border text-xs font-medium ${colors[i % colors.length]}`}>
                    {tag}
                  </span>
                )
              })}
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs text-amber-700/60 hover:text-amber-900 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" /> Share this
            </button>
          </div>
        </motion.article>
      </div>
    </div>
  )
}
