'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AdminSection, AdminInput, AdminTextarea, AdminRow, SaveButton } from '../shared/AdminSection'
import { toast } from 'sonner'

const defaultForm = { year: '', title: '', company: '', description: '', type: 'work' }

export default function TimelineTab() {
  const [items, setItems] = useState<any[]>([])
  const [form, setForm] = useState(defaultForm)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const load = () => supabase.from('timeline').select('*').order('order_index', { ascending: true }).then(({ data }) => { if (data) setItems(data) })
  useEffect(() => { load() }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('timeline').insert([form])
    if (error) toast.error(error.message)
    else { toast.success('Entry added'); setForm(defaultForm); load() }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    await supabase.from('timeline').delete().eq('id', id)
    load()
    toast.success('Deleted')
  }

  const formContent = (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <AdminInput label="Year" required value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="2024" />
        <div>
          <label className="block text-xs text-white/50 mb-1">Type</label>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none">
            <option value="work">Work</option>
            <option value="education">Education</option>
          </select>
        </div>
      </div>
      <AdminInput label="Title / Role" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Software Engineer" />
      <AdminInput label="Company / Institution" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company Name" />
      <AdminTextarea label="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What you did and achieved..." />
      <SaveButton loading={saving} />
    </form>
  )

  return (
    <AdminSection title="Timeline" description="Work and education history" addButtonLabel="Add Entry" form={formContent}>
      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No timeline entries yet.</p>
        ) : (
          items.map((item) => (
            <AdminRow key={item.id} onDelete={() => handleDelete(item.id)}>
              <p className="font-medium text-white text-sm">{item.year} — {item.title}</p>
              {item.company && <p className="text-xs text-muted-foreground">{item.company}</p>}
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${item.type === 'work' ? 'bg-blue-500/10 text-blue-300' : 'bg-green-500/10 text-green-300'}`}>
                {item.type}
              </span>
            </AdminRow>
          ))
        )}
      </div>
    </AdminSection>
  )
}
