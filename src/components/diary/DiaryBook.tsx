'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'

interface DiaryEntry {
  id: string
  title?: string
  entry_date: string
  body_text: string
  images?: { url: string; caption?: string }[]
  mood?: string
}

const moodEmoji: Record<string, string> = {
  happy: '☀',
  reflective: '🌙',
  excited: '✨',
  tired: '🌧',
  curious: '🔭',
  grateful: '🌸',
}

function CoverPage({ name }: { name: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center diary-page-texture relative overflow-hidden">
      {/* Decorative ruled lines */}
      <div className="absolute inset-0 flex flex-col gap-7 pt-14 px-8 pointer-events-none">
        {[...Array(16)].map((_, i) => (
          <div key={i} className="h-px bg-blue-200/40" />
        ))}
      </div>
      {/* Red margin line */}
      <div className="absolute left-14 top-0 bottom-0 w-px bg-red-300/40" />

      <div className="relative z-10 text-center">
        <p className="font-caveat text-6xl text-amber-950/30 mb-2">diary</p>
        <p className="font-caveat text-3xl text-amber-950 mb-1">{name}</p>
        <p className="font-caveat text-amber-800/50 text-lg">{new Date().getFullYear()}</p>
        <div className="mt-8 w-12 h-0.5 bg-amber-800/30 mx-auto" />
      </div>
    </div>
  )
}

function EntryTextPage({ entry }: { entry: DiaryEntry }) {
  return (
    <div className="w-full h-full diary-page-texture relative overflow-hidden p-8">
      {/* Ruled lines */}
      <div className="absolute inset-0 flex flex-col gap-7 pt-14 px-8 pointer-events-none">
        {[...Array(16)].map((_, i) => (
          <div key={i} className="h-px bg-blue-200/40" />
        ))}
      </div>
      {/* Red margin */}
      <div className="absolute left-14 top-0 bottom-0 w-px bg-red-300/40" />

      <div className="relative z-10 pl-8">
        {/* Date */}
        <p className="font-caveat text-2xl text-amber-900 mb-1">
          {format(new Date(entry.entry_date), 'EEEE, MMMM d')}
        </p>
        <p className="font-caveat text-amber-700/50 text-base mb-4">
          {format(new Date(entry.entry_date), 'yyyy')}
          {entry.mood && ` — ${moodEmoji[entry.mood] ?? entry.mood}`}
        </p>

        {entry.title && (
          <p className="font-caveat text-xl text-amber-950 mb-3 underline decoration-amber-300">{entry.title}</p>
        )}

        <div className="font-caveat text-[17px] text-amber-950/80 leading-7 line-clamp-[9]">
          {entry.body_text}
        </div>
      </div>
    </div>
  )
}

function EntryImagePage({ entry }: { entry: DiaryEntry }) {
  const images = entry.images ?? []
  return (
    <div className="w-full h-full diary-page-texture relative overflow-hidden p-6 flex flex-col gap-4">
      {/* Ruled lines faint */}
      <div className="absolute inset-0 flex flex-col gap-7 pt-14 pointer-events-none opacity-30">
        {[...Array(16)].map((_, i) => (
          <div key={i} className="h-px bg-blue-200/40" />
        ))}
      </div>

      <div className="relative z-10 flex flex-col gap-4 h-full justify-center">
        {images.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-amber-100 border-2 border-amber-200 flex items-center justify-center">
              <span className="font-caveat text-5xl text-amber-300">{format(new Date(entry.entry_date), 'd')}</span>
            </div>
          </div>
        ) : images.length === 1 ? (
          <div className="polaroid polaroid-tilt-slight-right mx-auto max-w-[85%]">
            <img src={images[0].url} alt={images[0].caption ?? ''} className="w-full h-48 object-cover rounded-sm" />
            {images[0].caption && <p className="font-caveat text-xs text-black/50 text-center mt-1">{images[0].caption}</p>}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {images.slice(0, 3).map((img, i) => {
              const tilts = ['polaroid-tilt-left', 'polaroid-tilt-right', 'polaroid-tilt-slight-left']
              return (
                <div key={i} className={`polaroid ${tilts[i % tilts.length]} ${images.length === 3 && i === 2 ? 'col-span-2 max-w-[60%] mx-auto' : ''}`}>
                  <img src={img.url} alt={img.caption ?? ''} className="w-full h-28 object-cover rounded-sm" />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export function DiaryBook({ entries, ownerName }: { entries: DiaryEntry[]; ownerName: string }) {
  const [page, setPage] = useState(0)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  // Page 0 = cover, then pairs: [image, text] for each entry
  const totalPages = 1 + entries.length * 2
  const maxPage = Math.max(0, isMobile ? totalPages - 1 : totalPages - 2)

  const canGoBack = page > 0
  const canGoForward = page < maxPage

  const goBack = () => { if (canGoBack) setPage((p) => Math.max(0, p - (isMobile ? 1 : 2))) }
  const goForward = () => { if (canGoForward) setPage((p) => Math.min(maxPage, p + (isMobile ? 1 : 2))) }

  const getPageContent = (pageIndex: number) => {
    if (pageIndex === 0) return <CoverPage name={ownerName} />
    const entryIndex = Math.floor((pageIndex - 1) / 2)
    const isImagePage = (pageIndex - 1) % 2 === 0
    const entry = entries[entryIndex]
    if (!entry) return <div className="w-full h-full diary-page-texture" />
    return isImagePage ? <EntryImagePage entry={entry} /> : <EntryTextPage entry={entry} />
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="w-full max-w-4xl">
        {/* Book */}
        <div className="relative flex justify-center">
          <div className="diary-book-shadow rounded-sm overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ rotateY: 20, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -20, opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className={`flex ${isMobile ? '' : 'divide-x divide-amber-200'}`}
                style={{ width: isMobile ? '90vw' : 'min(720px, 90vw)', height: isMobile ? '70vw' : 'min(520px, 65vw)' }}
              >
                {isMobile ? (
                  <div className="w-full h-full">{getPageContent(page)}</div>
                ) : (
                  <>
                    <div className="w-1/2 h-full">{getPageContent(page)}</div>
                    <div className="w-1/2 h-full">{getPageContent(page + 1)}</div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-6 mt-8">
          <button
            onClick={goBack}
            disabled={!canGoBack}
            className="p-3 rounded-full border border-amber-200 bg-amber-50 text-amber-700 disabled:opacity-30 hover:bg-amber-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-caveat text-amber-800/50 text-sm">
            {page === 0 ? 'Cover' : `Entry ${Math.ceil(page / 2)} of ${entries.length}`}
          </span>
          <button
            onClick={goForward}
            disabled={!canGoForward}
            className="p-3 rounded-full border border-amber-200 bg-amber-50 text-amber-700 disabled:opacity-30 hover:bg-amber-100 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
