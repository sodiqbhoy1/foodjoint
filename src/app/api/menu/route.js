import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import { verifyAdminToken } from '@/lib/auth';

export async function GET() {
  try {
    const db = await getDb();
    const items = await db.collection('menu').find({}).toArray();
    return NextResponse.json({ ok: true, items });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  // Verify admin authentication
  const auth = verifyAdminToken(req);
  if (!auth.valid) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.name || !body.price) {
      return NextResponse.json({ ok: false, error: 'Name and price are required' }, { status: 400 });
    }
    const db = await getDb();
    const item = {
      name: body.name,
      price: body.price,
      category: body.category || 'general',
      image: body.image || null,
      description: body.description || ''
    };
    const result = await db.collection('menu').insertOne(item);
    item._id = result.insertedId;
    return NextResponse.json({ ok: true, item });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  // Verify admin authentication
  const auth = verifyAdminToken(req);
  if (!auth.valid) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const id = body._id || body.id;
    if (!id) return NextResponse.json({ ok: false, error: 'Missing id' }, { status: 400 });
    const db = await getDb();
    const update = { ...body };
    delete update._id;
    delete update.id;
    await db.collection('menu').updateOne({ _id: new ObjectId(id) }, { $set: update });
    const item = await db.collection('menu').findOne({ _id: new ObjectId(id) });
    return NextResponse.json({ ok: true, item });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  // Verify admin authentication
  const auth = verifyAdminToken(req);
  if (!auth.valid) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ ok: false, error: 'Missing id' }, { status: 400 });
    const db = await getDb();
    await db.collection('menu').deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
