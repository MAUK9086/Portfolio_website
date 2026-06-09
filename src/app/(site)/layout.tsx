import Navbar from '@/components/site/Navbar'
import Footer from '@/components/site/Footer'

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
