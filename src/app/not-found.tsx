import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="text-[120px] font-bold text-white/5 leading-none select-none">404</p>
      <div className="-mt-8">
        <h1 className="text-3xl font-bold text-white">Page not found</h1>
        <p className="text-white/40 mt-3 max-w-sm">
          This page doesn&apos;t exist — or was moved. Check the URL, or head back home.
        </p>
        <Link href="/" className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white text-sm transition-colors">
          Back to home
        </Link>
      </div>
    </div>
  )
}
