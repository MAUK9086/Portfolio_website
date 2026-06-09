'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'

export function SideQuestLightbox({ item, onClose }: { item: any; onClose: () => void }) {
  const [mediaIndex, setMediaIndex] = useState(0)
  const media: any[] = item.media ?? []

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setMediaIndex((i) => Math.min(i + 1, media.length - 1))
      if (e.key === 'ArrowLeft') setMediaIndex((i) => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [media.length, onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      <motion.div
        initial={{ scale: 0.95, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        className="relative z-10 w-full max-w-3xl bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-20 text-white/50 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        {/* Media viewer */}
        {media.length > 0 && (
          <div className="relative bg-black/50 aspect-video flex items-center justify-center">
            {media[mediaIndex]?.type === 'video' ? (
              <video src={media[mediaIndex].url} controls className="max-h-[55vh] w-full object-contain" />
            ) : (
              <img src={media[mediaIndex]?.url} alt="" className="max-h-[55vh] w-full object-contain" />
            )}
            {media.length > 1 && (
              <>
                <button
                  onClick={() => setMediaIndex((i) => Math.max(i - 1, 0))}
                  disabled={mediaIndex === 0}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white disabled:opacity-30 hover:bg-black/70 transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setMediaIndex((i) => Math.min(i + 1, media.length - 1))}
                  disabled={mediaIndex === media.length - 1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white disabled:opacity-30 hover:bg-black/70 transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {media.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setMediaIndex(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${i === mediaIndex ? 'bg-white' : 'bg-white/30'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Details */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h2 className="text-lg font-semibold text-white">{item.title}</h2>
            {item.date && (
              <span className="text-xs text-muted-foreground shrink-0">
                {format(new Date(item.date), 'MMM yyyy')}
              </span>
            )}
          </div>
          {item.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
          )}
          {item.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {item.tags.map((tag: string) => (
                <span key={tag} className="px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-xs text-white/50">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
