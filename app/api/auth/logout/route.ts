import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST() {
  try {
    const secureFlag = process.env.NODE_ENV === 'production' ? 'Secure; ' : ''
    const cookie = `token=; HttpOnly; ${secureFlag}Path=/; Max-Age=0; SameSite=Lax`
    const res = NextResponse.json({ success: true }, { status: 200 })
    res.headers.set('Set-Cookie', cookie)
    return res
  } catch (err) {
    console.error('logout error', err)
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 })
  }
}
