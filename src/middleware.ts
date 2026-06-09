import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token =
      request.cookies.get('sb-owkivyhivjhfekkqvmsk-auth-token')?.value ||
      request.cookies.get('sb-access-token')?.value

    // If no auth cookie present at all, redirect immediately without calling Supabase
    if (!token) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
