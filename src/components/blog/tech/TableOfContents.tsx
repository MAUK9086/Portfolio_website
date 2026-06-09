'use client'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface Heading { id: string; text: string; level: number }

function extractHeadings(content: string): Heading[] {
  const regex = /^(#{1,3})\s+(.+)$/gm
  const headings: Heading[] = []
  let match
  while ((match = regex.exec(content)) !== null) {
    const text = match[2].trim()
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    headings.push({ id, text, level: match[1].length })
  }
  return headings
}

export function TableOfContents({ content }: { content: string }) {
  const headings = extractHeadings(content)
  const [active, setActive] = useState('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: '-80px 0px -60% 0px' }
    )
    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [headings.length])

  if (!headings.length) return null

  return (
    <nav className="space-y-1 text-sm">
      <p className="font-semibold text-black/50 uppercase tracking-widest text-[11px] mb-3">Contents</p>
      {headings.map(({ id, text, level }) => (
        <a
          key={id}
          href={`#${id}`}
          className={cn(
            'block leading-snug transition-colors duration-150 hover:text-blue-700',
            level === 1 ? 'pl-0' : level === 2 ? 'pl-3' : 'pl-6',
            active === id ? 'text-blue-700 font-medium' : 'text-black/50'
          )}
          onClick={(e) => {
            e.preventDefault()
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }}
        >
          {text}
        </a>
      ))}
    </nav>
  )
}
