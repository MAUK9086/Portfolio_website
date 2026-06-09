'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Share2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { TableOfContents } from '@/components/blog/tech/TableOfContents'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import 'katex/dist/katex.min.css'

export default function TechBlogPage() {
  const { slug } = useParams()
  const router = useRouter()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!slug) return
    supabase.from('blog_posts').select('*').eq('slug', slug).single().then(({ data }) => {
      if (!data) { setLoading(false); return }
      if (data.type === 'personal') {
        router.replace(`/blog/personal/${slug}`)
        return
      }
      setPost(data)
      setLoading(false)
    })
  }, [slug])

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: post?.title, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (loading) return <div className="container pt-32"><div className="h-64 rounded-2xl bg-white/[0.04] animate-pulse" /></div>
  if (!post) return <div className="container pt-32 text-center text-muted-foreground">Post not found.</div>

  return (
    <>
      {/* Wikipedia-style article on dark background */}
      <div className="min-h-screen pt-24">
        <div className="container max-w-6xl">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Blog
          </Link>

          <div className="grid lg:grid-cols-[220px_1fr_220px] gap-8">
            {/* Left sidebar: TOC */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 bg-[#f8f7f4] border border-neutral-200 rounded-xl p-5">
                <TableOfContents content={post.content_mdx ?? ''} />
              </div>
            </aside>

            {/* Article body — light panel */}
            <motion.article
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#f8f7f4] border border-neutral-200 rounded-2xl px-8 py-10 shadow-[0_4px_40px_rgba(0,0,0,0.15)]"
            >
              {/* Article header */}
              <header className="mb-8 pb-6 border-b border-neutral-200">
                <h1 className="font-inter text-3xl font-bold text-neutral-900 mb-4 leading-tight">
                  {post.title}
                </h1>

                {/* Wikipedia-style infobox */}
                <div className="float-right ml-6 mb-4 w-56 bg-neutral-100 border border-neutral-200 rounded-lg p-3 text-xs hidden sm:block">
                  <p className="font-semibold text-neutral-600 border-b border-neutral-200 pb-1.5 mb-2">Article info</p>
                  <table className="w-full">
                    <tbody className="text-neutral-600">
                      <tr>
                        <td className="pr-2 py-0.5 text-neutral-400">Published</td>
                        <td>{format(new Date(post.created_at), 'MMM d, yyyy')}</td>
                      </tr>
                      {post.read_time_minutes && (
                        <tr>
                          <td className="pr-2 py-0.5 text-neutral-400">Read time</td>
                          <td>{post.read_time_minutes} min</td>
                        </tr>
                      )}
                      {post.tags?.length > 0 && (
                        <tr>
                          <td className="pr-2 py-0.5 text-neutral-400 align-top">Tags</td>
                          <td className="flex flex-wrap gap-1">
                            {post.tags.map((t: string) => (
                              <span key={t} className="bg-blue-100 text-blue-700 rounded px-1 text-[10px]">{t}</span>
                            ))}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {post.excerpt && (
                  <p className="text-neutral-600 italic text-[15px] leading-relaxed">{post.excerpt}</p>
                )}
              </header>

              {/* Article content — serif typography */}
              <div className="prose max-w-none font-lora text-neutral-800
                prose-headings:font-inter prose-headings:font-bold prose-headings:text-neutral-900
                prose-h2:text-xl prose-h2:border-b prose-h2:border-neutral-200 prose-h2:pb-1
                prose-h3:text-lg
                prose-a:text-blue-700 prose-a:no-underline hover:prose-a:underline
                prose-code:bg-neutral-200 prose-code:text-neutral-800 prose-code:rounded prose-code:text-sm
                prose-blockquote:border-blue-400 prose-blockquote:bg-blue-50 prose-blockquote:rounded-r-lg
                prose-img:rounded-xl prose-img:shadow-md
              ">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex, rehypeSlug]}
                  components={{
                    code({ node, inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={oneLight as any}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-xl text-sm !bg-neutral-100 border border-neutral-200"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className="bg-neutral-200 px-1.5 py-0.5 rounded text-sm text-neutral-800" {...props}>
                          {children}
                        </code>
                      )
                    },
                  }}
                >
                  {post.content_mdx ?? ''}
                </ReactMarkdown>
              </div>

              {/* Footer */}
              <div className="mt-12 pt-6 border-t border-neutral-200 flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {post.tags?.map((t: string) => (
                    <span key={t} className="px-2.5 py-0.5 rounded bg-neutral-200 text-neutral-600 text-xs">{t}</span>
                  ))}
                </div>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" /> Share
                </button>
              </div>
            </motion.article>

            {/* Right sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-4">
                <div className="bg-[#f8f7f4] border border-neutral-200 rounded-xl p-5">
                  <p className="font-semibold text-neutral-500 uppercase tracking-widest text-[11px] mb-3">Filed under</p>
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags?.map((t: string) => (
                      <span key={t} className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-700 text-xs font-medium">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}
