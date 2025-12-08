import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../../lib/mongoose'
import User from '../../../../lib/models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const username = (body?.username || '').trim()
    const email = (body?.email || '').trim().toLowerCase()
    const password = body?.password || ''

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    await connectToDatabase()

    const existing = await User.findOne({ email })
    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 10)

    const user = new User({ username, email, password: hashed })
    await user.save()

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not set')
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
    }

    const token = jwt.sign({ id: String(user._id), email: user.email }, process.env.JWT_SECRET as string, { expiresIn: '7d' })
    const maxAge = 7 * 24 * 60 * 60
    const secureFlag = process.env.NODE_ENV === 'production' ? 'Secure; ' : ''
    const cookie = `token=${token}; HttpOnly; ${secureFlag}Path=/; Max-Age=${maxAge}; SameSite=Lax`

    const res = NextResponse.json({ success: true, user: { id: String(user._id), username: user.username, email: user.email } }, { status: 201 })
    res.headers.set('Set-Cookie', cookie)
    return res
  } catch (err) {
    console.error('register route error', err)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
