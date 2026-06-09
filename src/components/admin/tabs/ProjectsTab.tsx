'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AdminSection, AdminInput, AdminTextarea, AdminRow, SaveButton } from '../shared/AdminSection'
import { toast } from 'sonner'

const defaultForm = { title: '', slug: '', description: '', cover_url: '', cover_type: 'image', tags: '', attachments: '[]', featured: false }

export default function ProjectsTab() {
  const [projects, setProjects] = useState<any[]>([])
  const [form, setForm] = useState(defaultForm)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const load = () => supabase.from('projects').select('*').order('order_index', { ascending: true }).then(({ data }) => { if (data) setProjects(data) })

  useEffect(() => { load() }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('projects').insert([{
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      attachments: JSON.parse(form.attachments || '[]'),
    }])
    if (error) toast.error(error.message)
    else { toast.success('Project added'); setForm(defaultForm); load() }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    await supabase.from('projects').delete().eq('id', id)
    load()
    toast.success('Deleted')
  }

  const formContent = (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <AdminInput label="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="My Project" />
        <AdminInput label="Slug (URL)" required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="my-project" />
      </div>
      <AdminTextarea label="Description (Markdown supported)" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the project..." />
      <div className="grid grid-cols-2 gap-4">
        <AdminInput label="Cover URL" value={form.cover_url} onChange={(e) => setForm({ ...form, cover_url: e.target.value })} placeholder="https://..." />
        <div>
          <label className="block text-xs text-white/50 mb-1">Cover type</label>
          <select value={form.cover_type} onChange={(e) => setForm({ ...form, cover_type: e.target.value })}
            className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none">
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>
      </div>
      <AdminInput label="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="React, TypeScript, ML" />
      <AdminTextarea label="Attachments (JSON array)" rows={3} value={form.attachments}
        onChange={(e) => setForm({ ...form, attachments: e.target.value })}
        placeholder='[{"type":"github","label":"Source Code","url":"https://github.com/..."}]' />
      <div className="flex items-center gap-2">
        <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded" />
        <label htmlFor="featured" className="text-sm text-white/60">Featured on home page</label>
      </div>
      <SaveButton loading={saving} />
    </form>
  )

  return (
    <AdminSection title="Projects" description="Manage your portfolio projects" addButtonLabel="Add Project" form={formContent}>
      <div className="space-y-2">
        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No projects yet.</p>
        ) : (
          projects.map((p) => (
            <AdminRow key={p.id} onDelete={() => handleDelete(p.id)}>
              <p className="font-medium text-white text-sm truncate">{p.title}</p>
              <p className="text-xs text-muted-foreground truncate">{p.description?.substring(0, 80)}...</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {p.tags?.map((t: string) => <span key={t} className="px-2 py-0.5 rounded-full bg-white/[0.06] text-xs text-white/50">{t}</span>)}
              </div>
            </AdminRow>
          ))
        )}
      </div>
    </AdminSection>
  )
}
