'use client'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Attachment {
  type: string
  label: string
  url: string
}

interface Props {
  attachment: Attachment
  open: boolean
  onClose: () => void
}

function MarkdownViewer({ url }: { url: string }) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(url)
      .then((r) => r.text())
      .then((t) => { setContent(t); setLoading(false) })
      .catch(() => { setContent('Failed to load content.'); setLoading(false) })
  }, [url])

  if (loading) return <div className="p-8 text-muted-foreground text-sm animate-pulse">Loading...</div>

  return (
    <div className="prose prose-invert prose-sm max-w-none p-8">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  )
}

export function AttachmentModal({ attachment, open, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-4xl max-h-[85vh] bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <h3 className="text-sm font-medium text-white">{attachment.label}</h3>
              <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-auto max-h-[calc(85vh-56px)]">
              {attachment.type === 'video' && (
                <video src={attachment.url} controls autoPlay className="w-full" />
              )}
              {attachment.type === 'pdf' && (
                <iframe
                  src={`${attachment.url}#view=FitH`}
                  className="w-full h-[70vh]"
                  title={attachment.label}
                />
              )}
              {attachment.type === 'markdown' && (
                <MarkdownViewer url={attachment.url} />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
