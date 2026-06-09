'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowDown, Github, Linkedin, Twitter, FileText, ArrowRight } from 'lucide-react'
import { Typewriter } from '@/components/home/Typewriter'
import { TradingCard3D } from '@/components/home/TradingCard3D'
import { StatCounter } from '@/components/home/StatCounter'
import { ProjectCard } from '@/components/shared/ProjectCard'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'

const roles = [
  'ML Researcher',
  'Builder',
  'Chess Enthusiast',
  'Storyteller',
  'Explorer',
  'Side Quest Collector',
]

const socials = [
  { label: 'GitHub', href: '#', Icon: Github },
  { label: 'LinkedIn', href: '#', Icon: Linkedin },
  { label: 'Twitter', href: '#', Icon: Twitter },
]

export default function HomePage() {
  const [featuredProjects, setFeaturedProjects] = useState<any[]>([])
  const [latestBlog, setLatestBlog] = useState<any[]>([])
  const [latestDiary, setLatestDiary] = useState<any>(null)
  const [sideQuestPreviews, setSideQuestPreviews] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    supabase.from('projects').select('*').eq('featured', true).limit(3).then(({ data }) => {
      if (data) setFeaturedProjects(data)
    })
    supabase.from('blog_posts').select('*').eq('published', true).order('created_at', { ascending: false }).limit(2).then(({ data }) => {
      if (data) setLatestBlog(data)
    })
    supabase.from('diary_entries').select('*').eq('published', true).order('entry_date', { ascending: false }).limit(1).then(({ data }) => {
      if (data?.[0]) setLatestDiary(data[0])
    })
    supabase.from('side_quests').select('id, title, category, media').order('created_at', { ascending: false }).limit(5).then(({ data }) => {
      if (data) setSideQuestPreviews(data)
    })
  }, [])

  return (
    <main>
      {/* HERO */}
      <section className="min-h-screen flex items-center pt-24 pb-16">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                  className="text-sm font-medium text-primary/80 tracking-widest uppercase"
                >
                  Hello, I am
                </motion.p>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                  Your Name
                </h1>
                <div className="text-2xl md:text-3xl font-light text-white/80 h-10">
                  <Typewriter words={roles} delay={600} />
                </div>
              </div>

              <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
                A multidisciplinary builder who spends time doing research, chasing side quests, and occasionally writing about things that matter.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-medium text-sm hover:bg-white/90 transition-colors"
                >
                  View Work
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white text-sm hover:bg-white/10 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Resume
                </a>
              </div>

              <div className="flex items-center gap-4 pt-2">
                {socials.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="text-white/40 hover:text-white transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Right — 3D Photo Card */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
            >
              <TradingCard3D />
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="flex justify-center mt-16"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              <ArrowDown className="w-5 h-5 text-white/30" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="container">
        <StatCounter />
      </section>

      {/* FEATURED PROJECTS */}
      {featuredProjects.length > 0 && (
        <section className="container py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs text-muted-foreground tracking-widest uppercase mb-2">Selected Work</p>
              <h2 className="text-3xl font-bold text-white">Featured Projects</h2>
            </div>
            <Link href="/projects" className="text-sm text-muted-foreground hover:text-white transition-colors flex items-center gap-1">
              All projects <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* SIDE QUESTS TEASER */}
      <section className="container py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs text-muted-foreground tracking-widest uppercase mb-2">Beyond the Screen</p>
            <h2 className="text-3xl font-bold text-white">Side Quests</h2>
          </div>
          <Link href="/side-quests" className="text-sm text-muted-foreground hover:text-white transition-colors flex items-center gap-1">
            See all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {sideQuestPreviews.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {sideQuestPreviews.map((item, i) => {
              const media = item.media?.[0]
              const rotations = ['-rotate-1', 'rotate-1', '-rotate-2', 'rotate-0', 'rotate-2']
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ rotate: 0, scale: 1.04, zIndex: 10 }}
                  className={`shrink-0 w-36 ${rotations[i % rotations.length]} transition-all duration-300`}
                >
                  <div className="polaroid">
                    <div className="w-full h-28 bg-white/10 rounded overflow-hidden">
                      {media?.url ? (
                        <img src={media.url} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20 text-2xl">
                          {item.category?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-center text-black/60 mt-1.5 truncate">{item.title}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="h-40 rounded-2xl border border-dashed border-white/10 flex items-center justify-center">
            <p className="text-muted-foreground text-sm">Side quests coming soon</p>
          </div>
        )}
      </section>

      {/* FROM THE BLOG */}
      {latestBlog.length > 0 && (
        <section className="container py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs text-muted-foreground tracking-widest uppercase mb-2">Thoughts</p>
              <h2 className="text-3xl font-bold text-white">From the Blog</h2>
            </div>
            <Link href="/blog" className="text-sm text-muted-foreground hover:text-white transition-colors flex items-center gap-1">
              All posts <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {latestBlog.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link href={post.type === 'personal' ? `/blog/personal/${post.slug}` : `/blog/${post.slug}`}>
                  <div className="group rounded-2xl bg-white/[0.04] border border-white/10 p-6 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${post.type === 'tech' ? 'bg-blue-500/15 text-blue-300 border border-blue-500/20' : 'bg-amber-500/15 text-amber-300 border border-amber-500/20'}`}>
                        {post.type === 'tech' ? 'Technical' : 'Personal'}
                      </span>
                      {post.read_time_minutes && (
                        <span className="text-xs text-muted-foreground">{post.read_time_minutes} min read</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-white group-hover:text-primary transition-colors mb-2 leading-snug">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* DIARY TEASER */}
      {latestDiary && (
        <section className="container py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs text-muted-foreground tracking-widest uppercase mb-2">Personal</p>
              <h2 className="text-3xl font-bold text-white">From the Diary</h2>
            </div>
            <Link href="/diary" className="text-sm text-muted-foreground hover:text-white transition-colors flex items-center gap-1">
              Open diary <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link href="/diary">
              <div className="group relative max-w-2xl rounded-2xl overflow-hidden cursor-pointer">
                <div className="diary-page-texture p-8 border border-amber-900/20 hover:border-amber-900/40 transition-all duration-300">
                  <p className="font-caveat text-amber-900/60 text-lg mb-4">
                    {format(new Date(latestDiary.entry_date), 'MMMM d, yyyy')}
                  </p>
                  <p className="text-amber-950/80 font-serif leading-relaxed line-clamp-3">
                    {latestDiary.body_text}
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-amber-900/50 text-sm group-hover:text-amber-900/80 transition-colors">
                    <span>Read in diary</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </section>
      )}

      <div className="h-24" />
    </main>
  )
}
