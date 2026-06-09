'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useIsMobile } from '@/hooks/use-mobile'
import dynamic from 'next/dynamic'
import { SkillsAccordion } from '@/components/skills/SkillsAccordion'

const SkillsSunburst = dynamic(
  () => import('@/components/skills/SkillsSunburst').then((m) => m.SkillsSunburst),
  { ssr: false, loading: () => <div className="w-full max-w-[520px] aspect-square mx-auto bg-white/[0.03] rounded-full animate-pulse" /> }
)

export default function SkillsPage() {
  const [skills, setSkills] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const isMobile = useIsMobile()
  const supabase = createClient()

  useEffect(() => {
    supabase
      .from('skills')
      .select('*')
      .order('order_index', { ascending: true })
      .then(({ data }) => {
        if (data) {
          setSkills(data.map((s) => ({
            ...s,
            sub_skills: typeof s.sub_skills === 'string' ? JSON.parse(s.sub_skills) : s.sub_skills,
          })))
        }
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
        <p className="text-xs text-muted-foreground tracking-widest uppercase mb-3">Toolkit</p>
        <h1 className="text-5xl font-bold text-white mb-4">Skills</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          {isMobile ? 'Tap a domain to expand its skills.' : 'Hover over a segment to explore skills within each domain.'}
        </p>
      </motion.header>

      {loading ? (
        <div className="w-full max-w-[520px] aspect-square mx-auto bg-white/[0.03] rounded-full animate-pulse" />
      ) : skills.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">No skills added yet.</div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {isMobile ? (
            <SkillsAccordion skills={skills} />
          ) : (
            <>
              <SkillsSunburst skills={skills} />
              {/* Fallback text grid below */}
              <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map((domain) => (
                  <div key={domain.id} className="rounded-2xl bg-white/[0.04] border border-white/10 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: domain.color ?? '#6366f1' }} />
                      <p className="font-semibold text-white text-sm">{domain.domain}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(domain.sub_skills ?? []).map((s: any) => (
                        <span key={s.name} className="px-2.5 py-0.5 rounded-full bg-white/[0.06] text-xs text-white/60 border border-white/[0.08]">
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      )}
    </main>
  )
}
