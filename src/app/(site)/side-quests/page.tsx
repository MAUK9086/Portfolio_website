'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { SideQuestCard } from '@/components/side-quests/SideQuestCard'
import { SideQuestLightbox } from '@/components/side-quests/SideQuestLightbox'
import Masonry from 'react-masonry-css'

const BREAKPOINTS = {
  default: 4,
  1280: 4,
  1024: 3,
  768: 2,
  480: 2,
}

export default function SideQuestsPage() {
  const [items, setItems] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [active, setActive] = useState('All')
  const [selected, setSelected] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase
      .from('side_quests')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) {
          setItems(data)
          const cats = Array.from(new Set(data.map((d: any) => d.category).filter(Boolean))) as string[]
          setCategories(cats)
        }
        setLoading(false)
      })
  }, [])

  const filtered = active === 'All' ? items : items.filter((i) => i.category === active)

  return (
    <main className="container py-24 pt-32">
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <p className="text-xs text-muted-foreground tracking-widest uppercase mb-3">Beyond the Screen</p>
        <h1 className="text-5xl font-bold text-white mb-4">Side Quests</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          A collection of things I do when I am not doing the main quest. Photography, chess, volunteering, café-hopping — the full human experience.
        </p>
      </motion.header>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {['All', ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                active === cat
                  ? 'bg-white text-black'
                  : 'bg-white/[0.06] text-white/60 border border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square rounded-sm bg-white/[0.04] animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          {active === 'All' ? 'No side quests yet. Add some from the admin panel.' : `No items in "${active}".`}
        </div>
      ) : (
        <Masonry
          breakpointCols={BREAKPOINTS}
          className="flex -ml-4 w-auto"
          columnClassName="pl-4 bg-clip-padding"
        >
          {filtered.map((item, i) => (
            <div key={item.id} className="mb-6">
              <SideQuestCard item={item} index={i} onClick={() => setSelected(item)} />
            </div>
          ))}
        </Masonry>
      )}

      <AnimatePresence>
        {selected && (
          <SideQuestLightbox item={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </main>
  )
}
