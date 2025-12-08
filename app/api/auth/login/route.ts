import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../../lib/mongoose'
import User from '../../../../lib/models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const email = (body?.email || '').trim().toLowerCase()
    const password = body?.password || ''

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 })
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not set')
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
    }

    await connectToDatabase()

    const user = await User.findOne({ email })
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const token = jwt.sign({ id: String(user._id), email: user.email }, process.env.JWT_SECRET as string, { expiresIn: '7d' })

    const maxAge = 7 * 24 * 60 * 60 // 7 days in seconds
    const secureFlag = process.env.NODE_ENV === 'production' ? 'Secure; ' : ''
    const cookie = `token=${token}; HttpOnly; ${secureFlag}Path=/; Max-Age=${maxAge}; SameSite=Lax`

    const res = NextResponse.json({ success: true, user: { id: String(user._id), username: user.username, email: user.email } }, { status: 200 })
    res.headers.set('Set-Cookie', cookie)
    return res
  } catch (err) {
    console.error('login route error', err)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
