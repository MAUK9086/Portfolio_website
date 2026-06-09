'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { DiaryBook } from '@/components/diary/DiaryBook'

export default function DiaryPage() {
  const [entries, setEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase
      .from('diary_entries')
      .select('*')
      .eq('published', true)
      .order('entry_date', { ascending: false })
      .then(({ data }) => {
        if (data) setEntries(data)
        setLoading(false)
      })
  }, [])

  return (
    <main className="min-h-screen diary-page-texture pt-24 pb-20">
      <div className="container">
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <p className="font-caveat text-lg text-amber-800/40 mb-1">a peek inside</p>
          <h1 className="font-caveat text-6xl text-amber-950 mb-3">My Diary</h1>
          <p className="text-amber-800/50 text-sm">
            Turn the pages. Some things are better said in ink.
          </p>
        </motion.header>

        {loading ? (
          <div className="flex justify-center">
            <div className="diary-book-shadow rounded-sm bg-amber-50 animate-pulse"
              style={{ width: 'min(720px, 90vw)', height: 'min(520px, 65vw)' }}
            />
          </div>
        ) : (
          <DiaryBook entries={entries} ownerName="Your Name" />
        )}
      </div>
    </main>
  )
}
