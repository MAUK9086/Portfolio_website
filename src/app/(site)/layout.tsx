import type { Metadata } from 'next'
import Navbar from '@/components/site/Navbar'
import Footer from '@/components/site/Footer'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://yourname.dev'),
  title: { default: 'Portfolio', template: '%s | Portfolio' },
  description: 'Personal portfolio — projects, research, writing, and side quests.',
  openGraph: { type: 'website', locale: 'en_US' },
  twitter: { card: 'summary_large_image' },
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col relative">
      <Navbar />
      <div className="flex-1 z-10">
        {children}
      </div>
      <Footer />
    </div>
  )
}
