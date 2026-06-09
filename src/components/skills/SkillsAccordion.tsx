'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SubSkill { name: string; level: number }
interface SkillDomain { id: string; domain: string; color: string; sub_skills: SubSkill[] }

export function SkillsAccordion({ skills }: { skills: SkillDomain[] }) {
  const [open, setOpen] = useState<string | null>(skills[0]?.id ?? null)

  return (
    <div className="space-y-2 max-w-lg mx-auto">
      {skills.map((domain) => (
        <div key={domain.id} className="rounded-2xl border border-white/10 overflow-hidden">
          <button
            onClick={() => setOpen(open === domain.id ? null : domain.id)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.04] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: domain.color ?? '#6366f1' }}
              />
              <span className="font-medium text-white">{domain.domain}</span>
              <span className="text-xs text-muted-foreground">({domain.sub_skills?.length ?? 0})</span>
            </div>
            <ChevronDown
              className={cn('w-4 h-4 text-muted-foreground transition-transform duration-200', open === domain.id && 'rotate-180')}
            />
          </button>

          <AnimatePresence>
            {open === domain.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 flex flex-wrap gap-2.5">
                  {(domain.sub_skills ?? []).map((skill) => (
                    <div
                      key={skill.name}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/10"
                    >
                      <span className="text-sm text-white/80">{skill.name}</span>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map((n) => (
                          <div
                            key={n}
                            className={`w-1.5 h-1.5 rounded-full ${n <= skill.level ? 'bg-primary' : 'bg-white/20'}`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
