'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { AttachmentChip } from '@/components/projects/AttachmentChip'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function ProjectDetailPage() {
  const { slug } = useParams()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!slug) return
    supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single()
      .then(({ data }) => {
        setProject(data)
        setLoading(false)
      })
  }, [slug])

  if (loading) {
    return (
      <div className="container pt-32 pb-16">
        <div className="h-64 rounded-3xl bg-white/[0.04] animate-pulse mb-8" />
        <div className="space-y-3">
          <div className="h-8 w-1/2 bg-white/[0.04] animate-pulse rounded" />
          <div className="h-4 w-full bg-white/[0.04] animate-pulse rounded" />
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container pt-32 text-center">
        <p className="text-muted-foreground">Project not found.</p>
        <Link href="/projects" className="text-primary text-sm mt-4 inline-block">Back to projects</Link>
      </div>
    )
  }

  const attachments: any[] = typeof project.attachments === 'string'
    ? JSON.parse(project.attachments)
    : (project.attachments ?? [])

  return (
    <main className="pt-24 pb-20">
      {/* Cover */}
      {project.cover_url && (
        <div className="w-full h-[40vh] md:h-[50vh] overflow-hidden bg-black">
          {project.cover_type === 'video' ? (
            <video src={project.cover_url} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-80" />
          ) : (
            <img src={project.cover_url} alt={project.title} className="w-full h-full object-cover opacity-80" />
          )}
        </div>
      )}

      <div className="container max-w-3xl py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            All Projects
          </Link>

          <h1 className="text-4xl font-bold text-white mb-4">{project.title}</h1>

          {/* Tags */}
          {project.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs text-white/60">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          {project.description && (
            <div className="prose prose-invert prose-base max-w-none mb-10">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={oneDark as any}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-xl text-sm"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm" {...props}>
                        {children}
                      </code>
                    )
                  },
                }}
              >
                {project.description}
              </ReactMarkdown>
            </div>
          )}

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="border-t border-white/10 pt-8">
              <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-4">
                Attachments
              </h2>
              <div className="flex flex-wrap gap-3">
                {attachments.map((att: any, i: number) => (
                  <AttachmentChip key={i} attachment={att} />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  )
}
