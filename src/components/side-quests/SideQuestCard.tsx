'use client'
import { motion } from 'framer-motion'

interface SideQuestCardProps {
  item: any
  index: number
  onClick: () => void
}

const tiltClasses = ['-rotate-1', 'rotate-1', '-rotate-2', 'rotate-0', 'rotate-2', '-rotate-1', 'rotate-1']

const categoryColors: Record<string, string> = {
  Visual: 'bg-pink-500/15 text-pink-300 border-pink-500/20',
  Music: 'bg-purple-500/15 text-purple-300 border-purple-500/20',
  Sports: 'bg-green-500/15 text-green-300 border-green-500/20',
  Community: 'bg-blue-500/15 text-blue-300 border-blue-500/20',
  Travel: 'bg-amber-500/15 text-amber-300 border-amber-500/20',
  default: 'bg-white/10 text-white/60 border-white/10',
}

export function SideQuestCard({ item, index, onClick }: SideQuestCardProps) {
  const tilt = tiltClasses[index % tiltClasses.length]
  const firstMedia = item.media?.[0]
  const catColor = categoryColors[item.category] ?? categoryColors.default

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 6) * 0.07, duration: 0.5 }}
      whileHover={{ rotate: 0, scale: 1.03, zIndex: 20 }}
      className={`${tilt} transition-all duration-300 cursor-pointer`}
      onClick={onClick}
    >
      <div className="polaroid group">
        {/* Image */}
        <div className="w-full aspect-square overflow-hidden bg-neutral-100 rounded-sm">
          {firstMedia?.url ? (
            firstMedia.type === 'video' ? (
              <video src={firstMedia.url} muted loop className="w-full h-full object-cover" />
            ) : (
              <img src={firstMedia.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-neutral-200 text-neutral-400 text-4xl font-bold">
              {item.category?.charAt(0) ?? '?'}
            </div>
          )}
        </div>

        {/* Caption area */}
        <div className="pt-2 pb-1">
          <p className="text-[12px] text-black/70 truncate font-medium">{item.title}</p>
          <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full border ${catColor}`}>
            {item.category}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
