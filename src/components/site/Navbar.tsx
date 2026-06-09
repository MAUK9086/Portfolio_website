'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/research', label: 'Research' },
  { href: '/side-quests', label: 'Side Quests' },
  { href: '/blog', label: 'Blog' },
  { href: '/diary', label: 'Diary' },
  { href: '/skills', label: 'Skills' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed top-4 z-50 px-4 flex justify-center w-full">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-full px-2 h-14 flex items-center justify-between w-full max-w-4xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
      >
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold px-4 text-white hover:text-white/80 transition-colors"
        >
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-white/20 bg-white/10 text-[10px] font-bold">
            AP
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-0.5">
          {navItems.map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3 py-2 rounded-full text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-white text-black shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <button
          className="md:hidden text-white hover:bg-white/10 rounded-full p-2 mr-1 transition-colors"
          aria-label="Open menu"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <Menu className="h-5 w-5" />
        </button>
      </motion.nav>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-20 left-4 right-4 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl"
        >
          <nav className="grid gap-1">
            {navItems.map((item) => {
              const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-white/15 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </motion.div>
      )}
    </header>
  )
}
