import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../../lib/mongoose'
import User from '../../../../lib/models/User'
import jwt from 'jsonwebtoken'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get('cookie') || ''
    const match = cookie.match(/(?:^|; )token=([^;]+)/)
    const token = match ? match[1] : null
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not set')
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
    }

    let payload: any
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET as string)
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    await connectToDatabase()
    const user = await User.findById(payload.id)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    return NextResponse.json({ user: { id: String(user._id), username: user.username, email: user.email } }, { status: 200 })
  } catch (err) {
    console.error('me route error', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
