'use client'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { LogOut, FolderOpen, BookOpen, Sparkles, BookMarked, BookHeart, BarChart2, Settings, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'
import dynamic from 'next/dynamic'

const ProjectsTab = dynamic(() => import('@/components/admin/tabs/ProjectsTab'), { ssr: false })
const ResearchTab = dynamic(() => import('@/components/admin/tabs/ResearchTab'), { ssr: false })
const SideQuestsTab = dynamic(() => import('@/components/admin/tabs/SideQuestsTab'), { ssr: false })
const BlogTab = dynamic(() => import('@/components/admin/tabs/BlogTab'), { ssr: false })
const DiaryTab = dynamic(() => import('@/components/admin/tabs/DiaryTab'), { ssr: false })
const SkillsTab = dynamic(() => import('@/components/admin/tabs/SkillsTab'), { ssr: false })
const TimelineTab = dynamic(() => import('@/components/admin/tabs/TimelineTab'), { ssr: false })
const SettingsTab = dynamic(() => import('@/components/admin/tabs/SettingsTab'), { ssr: false })

const tabs = [
  { id: 'projects', label: 'Projects', Icon: FolderOpen },
  { id: 'research', label: 'Research', Icon: BookOpen },
  { id: 'side-quests', label: 'Side Quests', Icon: Sparkles },
  { id: 'blog', label: 'Blog', Icon: BookMarked },
  { id: 'diary', label: 'Diary', Icon: BookHeart },
  { id: 'skills', label: 'Skills', Icon: BarChart2 },
  { id: 'timeline', label: 'Timeline', Icon: Layers },
  { id: 'settings', label: 'Settings', Icon: Settings },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('projects')
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen flex bg-[#0a0a0a] text-white">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-white/10 flex flex-col">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-[10px] font-bold">
              AP
            </div>
            <span className="text-sm font-medium">Admin</span>
          </div>
          {user && <p className="text-xs text-white/40 mt-1 truncate">{user.email}</p>}
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                activeTab === id
                  ? 'bg-white text-black'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.07]'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/[0.07] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-4xl">
          {activeTab === 'projects' && <ProjectsTab />}
          {activeTab === 'research' && <ResearchTab />}
          {activeTab === 'side-quests' && <SideQuestsTab />}
          {activeTab === 'blog' && <BlogTab />}
          {activeTab === 'diary' && <DiaryTab />}
          {activeTab === 'skills' && <SkillsTab />}
          {activeTab === 'timeline' && <TimelineTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </main>
    </div>
  )
}
