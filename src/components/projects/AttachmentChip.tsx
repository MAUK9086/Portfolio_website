'use client'
import { useState } from 'react'
import {
  Play, FileText, Github, ExternalLink, FileCode, BookOpen
} from 'lucide-react'
import { AttachmentModal } from './AttachmentModal'

interface Attachment {
  type: 'video' | 'pdf' | 'github' | 'demo' | 'colab' | 'markdown' | 'paper' | string
  label: string
  url: string
}

const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
  video: { icon: Play, color: 'text-red-300', bg: 'bg-red-500/10 border-red-500/20 hover:bg-red-500/20' },
  pdf: { icon: FileText, color: 'text-amber-300', bg: 'bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20' },
  github: { icon: Github, color: 'text-white/70', bg: 'bg-white/[0.06] border-white/10 hover:bg-white/[0.12]' },
  demo: { icon: ExternalLink, color: 'text-green-300', bg: 'bg-green-500/10 border-green-500/20 hover:bg-green-500/20' },
  colab: { icon: FileCode, color: 'text-orange-300', bg: 'bg-orange-500/10 border-orange-500/20 hover:bg-orange-500/20' },
  markdown: { icon: FileCode, color: 'text-blue-300', bg: 'bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20' },
  paper: { icon: BookOpen, color: 'text-purple-300', bg: 'bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20' },
}

const externalTypes = ['github', 'demo', 'colab', 'paper']

export function AttachmentChip({ attachment }: { attachment: Attachment }) {
  const [open, setOpen] = useState(false)
  const config = typeConfig[attachment.type] ?? typeConfig.demo
  const Icon = config.icon
  const isExternal = externalTypes.includes(attachment.type)

  if (isExternal) {
    return (
      <a
        href={attachment.url}
        target="_blank"
        rel="noreferrer"
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${config.bg} ${config.color}`}
      >
        <Icon className="w-4 h-4" />
        {attachment.label}
        <ExternalLink className="w-3 h-3 opacity-50" />
      </a>
    )
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${config.bg} ${config.color}`}
      >
        <Icon className="w-4 h-4" />
        {attachment.label}
      </button>
      <AttachmentModal attachment={attachment} open={open} onClose={() => setOpen(false)} />
    </>
  )
}
