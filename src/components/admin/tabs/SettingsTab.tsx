'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AdminInput, AdminTextarea, SaveButton } from '../shared/AdminSection'
import { toast } from 'sonner'

const defaultSettings = {
  name: '',
  tagline: '',
  bio: '',
  open_to: '',
  github_url: '',
  linkedin_url: '',
  twitter_url: '',
  email: '',
  cv_url: '',
}

export default function SettingsTab() {
  const [settings, setSettings] = useState(defaultSettings)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('site_settings').select('key, value')
      if (data) {
        const map: Record<string, string> = {}
        data.forEach(({ key, value }) => { map[key] = value })
        setSettings((prev) => ({ ...prev, ...map }))
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const upserts = Object.entries(settings).map(([key, value]) => ({ key, value }))
    const { error } = await supabase.from('site_settings').upsert(upserts, { onConflict: 'key' })
    if (error) toast.error(error.message)
    else toast.success('Settings saved')
    setSaving(false)
  }

  if (loading) return <p className="text-sm text-white/40 py-8 text-center">Loading settings...</p>

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">Site Settings</h2>
        <p className="text-sm text-white/40 mt-1">Your personal info and social links</p>
      </div>
      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <AdminInput label="Your Name" value={settings.name} onChange={(e) => setSettings({ ...settings, name: e.target.value })} placeholder="Alex Park" />
          <AdminInput label="Currently open to" value={settings.open_to} onChange={(e) => setSettings({ ...settings, open_to: e.target.value })} placeholder="Research collaborations, internships" />
        </div>
        <AdminInput label="Tagline" value={settings.tagline} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} placeholder="Builder. Researcher. Storyteller." />
        <AdminTextarea label="Short bio" rows={3} value={settings.bio} onChange={(e) => setSettings({ ...settings, bio: e.target.value })} placeholder="2-3 sentence intro for the About section..." />
        <div className="border-t border-white/10 pt-4">
          <p className="text-xs text-white/40 mb-3 uppercase tracking-wider">Social Links</p>
          <div className="grid grid-cols-2 gap-4">
            <AdminInput label="GitHub URL" value={settings.github_url} onChange={(e) => setSettings({ ...settings, github_url: e.target.value })} placeholder="https://github.com/username" />
            <AdminInput label="LinkedIn URL" value={settings.linkedin_url} onChange={(e) => setSettings({ ...settings, linkedin_url: e.target.value })} placeholder="https://linkedin.com/in/username" />
            <AdminInput label="Twitter / X URL" value={settings.twitter_url} onChange={(e) => setSettings({ ...settings, twitter_url: e.target.value })} placeholder="https://twitter.com/username" />
            <AdminInput label="Email" type="email" value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} placeholder="you@example.com" />
          </div>
        </div>
        <AdminInput label="CV / Resume URL" value={settings.cv_url} onChange={(e) => setSettings({ ...settings, cv_url: e.target.value })} placeholder="https://... (PDF link)" />
        <div className="pt-2">
          <SaveButton loading={saving} />
        </div>
      </form>
    </div>
  )
}
