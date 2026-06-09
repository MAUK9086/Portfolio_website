'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AdminSection, AdminInput, AdminTextarea, AdminRow, SaveButton } from '../shared/AdminSection'
import { toast } from 'sonner'

const defaultForm = { title: '', slug: '', abstract: '', content_mdx: '', cover_url: '', tags: '', paper_url: '', notebook_url: '' }

export default function ResearchTab() {
  const [items, setItems] = useState<any[]>([])
  const [form, setForm] = useState(defaultForm)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const load = () => supabase.from('research').select('*').order('created_at', { ascending: false }).then(({ data }) => { if (data) setItems(data) })
  useEffect(() => { load() }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('research').insert([{
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    }])
    if (error) toast.error(error.message)
    else { toast.success('Research added'); setForm(defaultForm); load() }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    await supabase.from('research').delete().eq('id', id)
    load()
    toast.success('Deleted')
  }

  const formContent = (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <AdminInput label="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Research Title" />
        <AdminInput label="Slug" required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="research-slug" />
      </div>
      <AdminTextarea label="Abstract" rows={3} value={form.abstract} onChange={(e) => setForm({ ...form, abstract: e.target.value })} placeholder="A concise summary of the research..." />
      <AdminInput label="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="NLP, Transformers, Computer Vision" />
      <div className="grid grid-cols-2 gap-4">
        <AdminInput label="Paper URL" value={form.paper_url} onChange={(e) => setForm({ ...form, paper_url: e.target.value })} placeholder="https://arxiv.org/..." />
        <AdminInput label="Notebook URL" value={form.notebook_url} onChange={(e) => setForm({ ...form, notebook_url: e.target.value })} placeholder="https://colab.research.google.com/..." />
      </div>
      <AdminTextarea label="Full content (Markdown/LaTeX)" rows={6} value={form.content_mdx} onChange={(e) => setForm({ ...form, content_mdx: e.target.value })} placeholder="## Methodology&#10;&#10;Write your research content here..." />
      <SaveButton loading={saving} />
    </form>
  )

  return (
    <AdminSection title="Research" description="Academic and research projects" addButtonLabel="Add Research" form={formContent}>
      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No research projects yet.</p>
        ) : (
          items.map((item) => (
            <AdminRow key={item.id} onDelete={() => handleDelete(item.id)}>
              <p className="font-medium text-white text-sm">{item.title}</p>
              {item.abstract && <p className="text-xs text-muted-foreground truncate mt-0.5">{item.abstract.substring(0, 100)}...</p>}
            </AdminRow>
          ))
        )}
      </div>
    </AdminSection>
  )
}
