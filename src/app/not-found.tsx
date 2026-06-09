import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center flex-col gap-4 text-center px-4">
      <h1 className="text-8xl font-bold text-white/20">404</h1>
      <p className="text-xl text-muted-foreground">This page does not exist.</p>
      <Link href="/" className="text-primary hover:underline text-sm">
        Go home
      </Link>
    </div>
  )
}
