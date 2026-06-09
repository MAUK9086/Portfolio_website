'use client'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface Stat {
  label: string
  value: number
  suffix?: string
}

function Counter({ value, suffix = '' }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 1400
          const steps = 60
          const increment = value / steps
          let current = 0
          const timer = setInterval(() => {
            current = Math.min(current + increment, value)
            setCount(Math.round(current))
            if (current >= value) clearInterval(timer)
          }, duration / steps)
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [value])

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  )
}

const defaultStats: Stat[] = [
  { label: 'Projects', value: 10, suffix: '+' },
  { label: 'Research Papers', value: 3, suffix: '+' },
  { label: 'Hackathons', value: 5, suffix: '+' },
  { label: 'Side Quests', value: 20, suffix: '+' },
]

export function StatCounter({ stats = defaultStats }: { stats?: Stat[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-white/10">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 0.5 }}
          className="text-center"
        >
          <p className="text-3xl font-bold text-white tabular-nums">
            <Counter value={stat.value} suffix={stat.suffix ?? ''} />
          </p>
          <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  )
}
