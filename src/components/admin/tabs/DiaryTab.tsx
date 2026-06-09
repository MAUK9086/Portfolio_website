'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AdminSection, AdminInput, AdminTextarea, AdminRow, SaveButton } from '../shared/AdminSection'
import { toast } from 'sonner'
import { format } from 'date-fns'

const moods = ['happy', 'reflective', 'excited', 'tired', 'curious', 'grateful']
const defaultForm = { title: '', entry_date: new Date().toISOString().split('T')[0], body_text: '', images: '[]', mood: '', published: true }

export default function DiaryTab() {
  const [entries, setEntries] = useState<any[]>([])
  const [form, setForm] = useState(defaultForm)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const load = () => supabase.from('diary_entries').select('*').order('entry_date', { ascending: false }).then(({ data }) => { if (data) setEntries(data) })
  useEffect(() => { load() }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('diary_entries').insert([{
      ...form,
      images: JSON.parse(form.images || '[]'),
    }])
    if (error) toast.error(error.message)
    else { toast.success('Entry added'); setForm(defaultForm); load() }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    await supabase.from('diary_entries').delete().eq('id', id)
    load()
    toast.success('Deleted')
  }

  const formContent = (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <AdminInput label="Date" type="date" required value={form.entry_date} onChange={(e) => setForm({ ...form, entry_date: e.target.value })} />
        <div>
          <label className="block text-xs text-white/50 mb-1">Mood</label>
          <select value={form.mood} onChange={(e) => setForm({ ...form, mood: e.target.value })}
            className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none">
            <option value="">No mood tag</option>
            {moods.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>
      <AdminInput label="Title (optional)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Optional entry title" />
      <AdminTextarea label="Entry text" rows={6} required value={form.body_text} onChange={(e) => setForm({ ...form, body_text: e.target.value })} placeholder="Write your diary entry here..." />
      <AdminTextarea label="Images JSON (max 3)" rows={2} value={form.images}
        onChange={(e) => setForm({ ...form, images: e.target.value })}
        placeholder='[{"url":"https://...","caption":"Caption here"}]' />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input type="checkbox" id="pub-diary" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
          <label htmlFor="pub-diary" className="text-sm text-white/60">Publish publicly</label>
        </div>
        <SaveButton loading={saving} />
      </div>
    </form>
  )

  return (
    <AdminSection title="Diary" description="Personal diary entries" addButtonLabel="New Entry" form={formContent}>
      <div className="space-y-2">
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No entries yet.</p>
        ) : (
          entries.map((e) => (
            <AdminRow key={e.id} onDelete={() => handleDelete(e.id)}>
              <p className="font-medium text-white text-sm">{format(new Date(e.entry_date), 'MMMM d, yyyy')}{e.title ? ` — ${e.title}` : ''}</p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{e.body_text?.substring(0, 100)}...</p>
              {e.mood && <span className="text-xs text-white/40 mt-0.5 block">Mood: {e.mood}</span>}
            </AdminRow>
          ))
        )}
      </div>
    </AdminSection>
  )
}
