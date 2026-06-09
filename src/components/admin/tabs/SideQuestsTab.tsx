'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AdminSection, AdminInput, AdminTextarea, AdminRow, SaveButton } from '../shared/AdminSection'
import { toast } from 'sonner'

const categories = ['Visual', 'Music', 'Sports', 'Community', 'Travel', 'Food', 'Gaming', 'Learning', 'Other']
const defaultForm = { title: '', category: 'Visual', description: '', media: '[]', tags: '', date: '' }

export default function SideQuestsTab() {
  const [items, setItems] = useState<any[]>([])
  const [form, setForm] = useState(defaultForm)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const load = () => supabase.from('side_quests').select('*').order('created_at', { ascending: false }).then(({ data }) => { if (data) setItems(data) })
  useEffect(() => { load() }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('side_quests').insert([{
      ...form,
      media: JSON.parse(form.media || '[]'),
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    }])
    if (error) toast.error(error.message)
    else { toast.success('Side quest added'); setForm(defaultForm); load() }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    await supabase.from('side_quests').delete().eq('id', id)
    load()
    toast.success('Deleted')
  }

  const formContent = (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <AdminInput label="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Chess Tournament 2024" />
        <div>
          <label className="block text-xs text-white/50 mb-1">Category</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none">
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <AdminTextarea label="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What was this about?" />
      <div className="grid grid-cols-2 gap-4">
        <AdminInput label="Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        <AdminInput label="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="chess, competition" />
      </div>
      <AdminTextarea label="Media JSON" rows={2} value={form.media}
        onChange={(e) => setForm({ ...form, media: e.target.value })}
        placeholder='[{"url":"https://...","type":"image","caption":"Caption"}]' />
      <SaveButton loading={saving} />
    </form>
  )

  return (
    <AdminSection title="Side Quests" description="Everything that makes you, you" addButtonLabel="Add Side Quest" form={formContent}>
      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No side quests yet.</p>
        ) : (
          items.map((item) => (
            <AdminRow key={item.id} onDelete={() => handleDelete(item.id)}>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/50">{item.category}</span>
                <p className="font-medium text-white text-sm">{item.title}</p>
              </div>
              {item.description && <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.description}</p>}
            </AdminRow>
          ))
        )}
      </div>
    </AdminSection>
  )
}
