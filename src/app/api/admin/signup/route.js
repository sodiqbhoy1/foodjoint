import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import bcrypt from 'bcryptjs'

export async function POST(req) {

  
  try {
    const body = await req.json()
    const { name, email, password } = body || {}

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const db = await getDb(process.env.MONGODB_DB || 'platepay')
    const admins = db.collection('admins')

    const existing = await admins.findOne({ email: email.toLowerCase() })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const now = new Date()
    const res = await admins.insertOne({
      name,
      email: email.toLowerCase(),
      password: hash,
      createdAt: now,
      role: 'admin'
    })

    return NextResponse.json({ id: res.insertedId, message: 'Admin created' }, { status: 201 })
  } catch (err) {
    console.error('Register error', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
