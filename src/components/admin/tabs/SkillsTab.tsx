'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AdminSection, AdminInput, AdminRow, SaveButton } from '../shared/AdminSection'
import { toast } from 'sonner'

const defaultDomain = { domain: '', color: '#6366f1', sub_skills: '[]' }

export default function SkillsTab() {
  const [skills, setSkills] = useState<any[]>([])
  const [form, setForm] = useState(defaultDomain)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const load = () => supabase.from('skills').select('*').order('order_index', { ascending: true }).then(({ data }) => { if (data) setSkills(data) })
  useEffect(() => { load() }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('skills').insert([{
      ...form,
      sub_skills: JSON.parse(form.sub_skills || '[]'),
    }])
    if (error) toast.error(error.message)
    else { toast.success('Domain added'); setForm(defaultDomain); load() }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    await supabase.from('skills').delete().eq('id', id)
    load()
    toast.success('Deleted')
  }

  const formContent = (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <AdminInput label="Domain name" required value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} placeholder="Machine Learning" />
        <div>
          <label className="block text-xs text-white/50 mb-1">Color</label>
          <div className="flex gap-2">
            <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-10 h-10 rounded-lg border-none cursor-pointer" />
            <input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}
              className="flex-1 bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none" />
          </div>
        </div>
      </div>
      <div>
        <label className="block text-xs text-white/50 mb-1">Sub-skills (JSON array)</label>
        <textarea rows={4} value={form.sub_skills} onChange={(e) => setForm({ ...form, sub_skills: e.target.value })}
          placeholder='[{"name":"PyTorch","level":4},{"name":"scikit-learn","level":5}]'
          className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder:text-white/30 focus:outline-none resize-none" />
        <p className="text-xs text-white/30 mt-1">Level: 1 (beginner) to 5 (expert)</p>
      </div>
      <SaveButton loading={saving} />
    </form>
  )

  return (
    <AdminSection title="Skills" description="Manage your skill domains and sub-skills" addButtonLabel="Add Domain" form={formContent}>
      <div className="space-y-2">
        {skills.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No skills yet.</p>
        ) : (
          skills.map((s) => (
            <AdminRow key={s.id} onDelete={() => handleDelete(s.id)}>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                <p className="font-medium text-white text-sm">{s.domain}</p>
                <span className="text-xs text-white/40">({s.sub_skills?.length ?? 0} skills)</span>
              </div>
            </AdminRow>
          ))
        )}
      </div>
    </AdminSection>
  )
}
