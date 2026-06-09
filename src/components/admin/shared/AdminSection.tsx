'use client'
import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface AdminSectionProps {
  title: string
  description?: string
  addButtonLabel?: string
  children: React.ReactNode
  form?: React.ReactNode
}

export function AdminSection({ title, description, addButtonLabel, children, form }: AdminSectionProps) {
  const [showForm, setShowForm] = useState(false)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
        </div>
        {form && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors"
          >
            {showForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            {showForm ? 'Cancel' : (addButtonLabel ?? 'Add')}
          </button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6">
              {form}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </div>
  )
}

export function AdminInput({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-xs text-white/50 mb-1">{label}</label>
      <input
        {...props}
        className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/25 transition-colors"
      />
    </div>
  )
}

export function AdminTextarea({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <label className="block text-xs text-white/50 mb-1">{label}</label>
      <textarea
        {...props}
        className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/25 transition-colors resize-none"
      />
    </div>
  )
}

export function AdminRow({ children, onDelete }: { children: React.ReactNode; onDelete: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.05] transition-colors group">
      <div className="flex-1 min-w-0">{children}</div>
      <button
        onClick={onDelete}
        className="shrink-0 text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export function SaveButton({ loading, onClick }: { loading?: boolean; onClick?: () => void }) {
  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={loading}
      className="px-5 py-2 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 disabled:opacity-50 transition-all"
    >
      {loading ? 'Saving...' : 'Save'}
    </button>
  )
}
