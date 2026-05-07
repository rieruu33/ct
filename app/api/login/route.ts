import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const { username, password } = await request.json()

  const validUser = process.env.ADMIN_USERNAME
  const validPass = process.env.ADMIN_PASSWORD

  if (username === validUser && password === validPass) {
    const cookieStore = await cookies()
    
    // PERBAIKAN: Tambahkan path: '/' agar cookie bisa diakses di semua halaman
    cookieStore.set('admin_session', 'true', { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/', 
      maxAge: 60 * 60 * 24 
    })
    
    return NextResponse.json({ message: 'Success' })
  }

  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
}