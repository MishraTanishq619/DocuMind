import { connectToDatabase } from './mongoose'
import User from './models/User'
import jwt from 'jsonwebtoken'

export async function getUserFromRequest(req: Request) {
  const cookie = req.headers.get('cookie') || ''
  const match = cookie.match(/(?:^|; )token=([^;]+)/)
  const token = match ? match[1] : null
  if (!token) return null
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET not set')
    return null
  }

  let payload: any
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET as string)
  } catch (err) {
    return null
  }

  await connectToDatabase()
  const user = await User.findById(payload.id)
  if (!user) return null
  return user
}

export default getUserFromRequest
