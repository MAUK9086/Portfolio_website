'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

interface Attachment {
  type: string
  label: string
  url: string
}

interface Project {
  id: string
  title: string
  slug: string
  description: string
  cover_url?: string
  cover_type?: string
  tags?: string[]
  attachments?: Attachment[]
  featured?: boolean
}

export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
    >
      <Link href={`/projects/${project.slug}`}>
        <div className="group relative h-full rounded-3xl bg-white/[0.05] border border-white/10 overflow-hidden hover:border-white/20 hover:bg-white/[0.08] transition-all duration-400 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
          {/* Cover */}
          {project.cover_url && (
            <div className="w-full h-48 overflow-hidden bg-white/5">
              {project.cover_type === 'video' ? (
                <video
                  src={project.cover_url}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <img
                  src={project.cover_url}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
            </div>
          )}

          <div className="p-6">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-white group-hover:text-primary transition-colors leading-snug">
                {project.title}
              </h3>
              <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-white/70 transition-colors shrink-0 mt-0.5" />
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {project.description}
            </p>

            {project.tags?.length ? (
              <div className="flex flex-wrap gap-1.5">
                {project.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-full bg-white/[0.08] border border-white/10 text-xs text-white/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
