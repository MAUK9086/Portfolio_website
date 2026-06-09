'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TypewriterProps {
  words: string[]
  speed?: number
  delay?: number
}

export function Typewriter({ words, speed = 120, delay = 0 }: TypewriterProps) {
  const [wordIndex, setWordIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [started, setStarted] = useState(delay === 0)

  useEffect(() => {
    if (!started) {
      const t = setTimeout(() => setStarted(true), delay)
      return () => clearTimeout(t)
    }
    if (!words.length) return

    const word = words[wordIndex]
    let timeout: ReturnType<typeof setTimeout>

    if (deleting) {
      timeout = setTimeout(() => {
        setText(word.substring(0, text.length - 1))
        if (text.length <= 1) {
          setDeleting(false)
          setWordIndex((i) => (i + 1) % words.length)
        }
      }, 40)
    } else if (text.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 2200)
    } else {
      timeout = setTimeout(() => {
        setText(word.substring(0, text.length + 1))
      }, speed)
    }

    return () => clearTimeout(timeout)
  }, [text, deleting, wordIndex, words, started, delay, speed])

  return (
    <span className="relative inline-block">
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
        {text}
      </span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.75, ease: 'linear' }}
        className="absolute -right-1 top-1/2 -translate-y-1/2 w-[3px] h-[70%] bg-white/70 rounded-full"
      />
    </span>
  )
}
