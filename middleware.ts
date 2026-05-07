import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Gunakan request.cookies.get().value untuk ambil isinya secara eksplisit
  const adminSession = request.cookies.get('admin_session')?.value
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin')) {
    if (adminSession !== 'true') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}