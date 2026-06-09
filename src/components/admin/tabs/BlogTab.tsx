'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AdminSection, AdminInput, AdminTextarea, AdminRow, SaveButton } from '../shared/AdminSection'
import { toast } from 'sonner'

const defaultForm = { title: '', slug: '', type: 'tech', excerpt: '', content_mdx: '', cover_url: '', tags: '', read_time_minutes: '', published: false }

export default function BlogTab() {
  const [posts, setPosts] = useState<any[]>([])
  const [form, setForm] = useState(defaultForm)
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState(false)
  const supabase = createClient()

  const load = () => supabase.from('blog_posts').select('*').order('created_at', { ascending: false }).then(({ data }) => { if (data) setPosts(data) })
  useEffect(() => { load() }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('blog_posts').insert([{
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      read_time_minutes: form.read_time_minutes ? parseInt(form.read_time_minutes) : null,
    }])
    if (error) toast.error(error.message)
    else { toast.success('Post added'); setForm(defaultForm); load() }
    setSaving(false)
  }

  const togglePublished = async (id: string, current: boolean) => {
    await supabase.from('blog_posts').update({ published: !current }).eq('id', id)
    load()
  }

  const handleDelete = async (id: string) => {
    await supabase.from('blog_posts').delete().eq('id', id)
    load()
    toast.success('Deleted')
  }

  const formContent = (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <AdminInput label="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="My Blog Post" />
        <AdminInput label="Slug" required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="my-blog-post" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-white/50 mb-1">Type</label>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none">
            <option value="tech">Technical</option>
            <option value="personal">Personal</option>
          </select>
        </div>
        <AdminInput label="Read time (minutes)" type="number" value={form.read_time_minutes} onChange={(e) => setForm({ ...form, read_time_minutes: e.target.value })} placeholder="5" />
        <AdminInput label="Cover URL" value={form.cover_url} onChange={(e) => setForm({ ...form, cover_url: e.target.value })} placeholder="https://..." />
      </div>
      <AdminInput label="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="ML, Python, Tutorial" />
      <AdminTextarea label="Excerpt (shown in listings)" rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="A brief summary of this post..." />

      {/* Split-pane Markdown editor */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs text-white/50">Content (Markdown)</label>
          <button type="button" onClick={() => setPreview(!preview)} className="text-xs text-primary hover:underline">
            {preview ? 'Edit' : 'Preview'}
          </button>
        </div>
        {preview ? (
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 min-h-[200px] prose prose-invert prose-sm max-w-none text-sm">
            <pre className="whitespace-pre-wrap text-xs text-white/50">{form.content_mdx || 'Nothing to preview yet.'}</pre>
          </div>
        ) : (
          <textarea
            rows={12}
            value={form.content_mdx}
            onChange={(e) => setForm({ ...form, content_mdx: e.target.value })}
            placeholder="Write your post in Markdown..."
            className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder:text-white/30 focus:outline-none focus:border-white/25 resize-none"
          />
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input type="checkbox" id="published-blog" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
          <label htmlFor="published-blog" className="text-sm text-white/60">Published</label>
        </div>
        <SaveButton loading={saving} />
      </div>
    </form>
  )

  return (
    <AdminSection title="Blog" description="Write and manage blog posts" addButtonLabel="New Post" form={formContent}>
      <div className="space-y-2">
        {posts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No posts yet.</p>
        ) : (
          posts.map((p) => (
            <AdminRow key={p.id} onDelete={() => handleDelete(p.id)}>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${p.type === 'tech' ? 'bg-blue-500/10 text-blue-300 border-blue-500/20' : 'bg-amber-500/10 text-amber-300 border-amber-500/20'}`}>
                  {p.type === 'tech' ? 'Tech' : 'Personal'}
                </span>
                <p className="font-medium text-white text-sm truncate">{p.title}</p>
              </div>
              <button onClick={() => togglePublished(p.id, p.published)}
                className={`text-xs mt-1 ${p.published ? 'text-green-400' : 'text-white/30'}`}>
                {p.published ? 'Published' : 'Draft'} (click to toggle)
              </button>
            </AdminRow>
          ))
        )}
      </div>
    </AdminSection>
  )
}
