'use client'
import { useMotionValue, useSpring, useTransform, motion } from 'framer-motion'
import Image from 'next/image'

export function TradingCard3D() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseX = useSpring(x, { stiffness: 150, damping: 20 })
  const mouseY = useSpring(y, { stiffness: 150, damping: 20 })

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ['15deg', '-15deg'])
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ['-15deg', '15deg'])
  const glareX = useTransform(mouseX, [-0.5, 0.5], ['0%', '100%'])
  const glareY = useTransform(mouseY, [-0.5, 0.5], ['0%', '100%'])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <div style={{ perspective: '1000px' }} className="w-full flex justify-center py-4">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative w-72 h-96 rounded-3xl cursor-pointer select-none"
      >
        {/* Card background */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.12] to-white/[0.04] backdrop-blur-xl border border-white/20 shadow-[0_24px_64px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* Glare overlay */}
          <motion.div
            style={{
              background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.15) 0%, transparent 70%)`,
            }}
            className="absolute inset-0 z-10 pointer-events-none rounded-3xl"
          />

          {/* Photo */}
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="w-full h-full rounded-2xl overflow-hidden bg-white/5">
              <Image
                src="/photo.jpg"
                alt="Profile photo"
                width={288}
                height={384}
                className="w-full h-full object-cover"
                priority
                onError={() => {}}
              />
            </div>
          </div>

          {/* Bottom name tag */}
          <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/60 to-transparent z-20">
            <p className="text-white font-semibold text-sm">Your Name</p>
            <p className="text-white/60 text-xs mt-0.5">Builder &bull; Researcher &bull; Explorer</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
