import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import { verifyAdminToken } from '@/lib/auth';

async function tryLoadMenuModel() {
  try {
    const { connectMongoose } = await import('@/lib/mongoose');
    await connectMongoose();
    const Menu = (await import('@/models/Menu')).default;
    return Menu;
  } catch (e) {
    return null;
  }
}

export async function GET() {
  try {
    const Menu = await tryLoadMenuModel();
    if (Menu) {
      const items = await Menu.find({}).lean().exec();
      return NextResponse.json({ ok: true, items });
    }
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
    const itemData = {
      name: body.name,
      price: body.price,
      category: body.category || 'general',
      image: body.image || null,
      description: body.description || ''
    };

    const Menu = await tryLoadMenuModel();
    if (Menu) {
      const created = await Menu.create(itemData);
      return NextResponse.json({ ok: true, item: created });
    }

    const db = await getDb();
    const result = await db.collection('menu').insertOne(itemData);
    itemData._id = result.insertedId;
    return NextResponse.json({ ok: true, item: itemData });
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
    const update = { ...body };
    delete update._id;
    delete update.id;

    const Menu = await tryLoadMenuModel();
    if (Menu) {
      await Menu.updateOne({ _id: id }, { $set: update });
      const item = await Menu.findOne({ _id: id }).lean().exec();
      return NextResponse.json({ ok: true, item });
    }

    const db = await getDb();
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

    const Menu = await tryLoadMenuModel();
    if (Menu) {
      await Menu.deleteOne({ _id: id });
      return NextResponse.json({ ok: true });
    }

    const db = await getDb();
    await db.collection('menu').deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
