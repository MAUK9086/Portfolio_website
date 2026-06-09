'use client'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ProjectCard } from '@/components/shared/ProjectCard'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [activeTag, setActiveTag] = useState('All')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .order('order_index', { ascending: true })
      .then(({ data }) => {
        if (data) {
          setProjects(data)
          const tags = Array.from(new Set(data.flatMap((p: any) => p.tags ?? [])))
          setAllTags(tags as string[])
        }
        setLoading(false)
      })
  }, [])

  const filtered = activeTag === 'All'
    ? projects
    : projects.filter((p) => p.tags?.includes(activeTag))

  return (
    <main className="container py-24 pt-32">
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <p className="text-xs text-muted-foreground tracking-widest uppercase mb-3">Work</p>
        <h1 className="text-5xl font-bold text-white mb-4">Projects</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          A collection of things I have built, researched, and shipped.
        </p>
      </motion.header>

      {/* Tag filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {['All', ...allTags].map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTag === tag
                  ? 'bg-white text-black'
                  : 'bg-white/[0.06] text-white/60 border border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-72 rounded-3xl bg-white/[0.04] animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          No projects yet. Add some from the admin panel.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      )}
    </main>
  )
}
