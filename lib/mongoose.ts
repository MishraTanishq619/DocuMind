import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

type Cached = {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: Cached | undefined
}

let cached: Cached = (global as any)._mongoose || ((global as any)._mongoose = { conn: null, promise: null })

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      // Recommended options
      bufferCommands: false,
      dbName: process.env.MONGODB_DB,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      return m
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}

export default mongoose
