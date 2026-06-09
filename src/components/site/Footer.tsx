'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Github, Linkedin, Twitter } from 'lucide-react'

export default function Footer() {
  const pathname = usePathname()
  if (pathname === '/') return null

  return (
    <footer className="border-t border-white/10 mt-16">
      <div className="container py-10 grid gap-6 md:grid-cols-3 items-center">
        <div className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Portfolio
        </div>
        <div className="text-center text-sm text-muted-foreground">
          Building &bull; Exploring &bull; Sharing
        </div>
        <div className="flex items-center justify-end gap-4">
          <a href="#" target="_blank" rel="noreferrer" aria-label="GitHub" className="text-muted-foreground hover:text-white transition-colors">
            <Github className="w-5 h-5" />
          </a>
          <a href="#" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-white transition-colors">
            <Linkedin className="w-5 h-5" />
          </a>
          <a href="#" target="_blank" rel="noreferrer" aria-label="Twitter" className="text-muted-foreground hover:text-white transition-colors">
            <Twitter className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  )
}
