import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient()
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourname.dev'

  const staticRoutes = ['/', '/projects', '/research', '/side-quests', '/blog', '/diary', '/skills', '/contact'].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '/' ? 1 : 0.8,
  }))

  const [{ data: projects }, { data: blogs }, { data: research }] = await Promise.all([
    supabase.from('projects').select('slug, created_at'),
    supabase.from('blog_posts').select('slug, type, created_at').eq('published', true),
    supabase.from('research').select('slug, created_at'),
  ])

  const projectRoutes = (projects || []).map((p) => ({
    url: `${base}/projects/${p.slug}`,
    lastModified: new Date(p.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const blogRoutes = (blogs || []).map((b) => ({
    url: `${base}/${b.type === 'personal' ? 'blog/personal' : 'blog'}/${b.slug}`,
    lastModified: new Date(b.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const researchRoutes = (research || []).map((r) => ({
    url: `${base}/research/${r.slug}`,
    lastModified: new Date(r.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...projectRoutes, ...blogRoutes, ...researchRoutes]
}
