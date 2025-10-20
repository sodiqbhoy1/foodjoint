import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

async function tryLoadMenuModel() {
  try {
    const { connectMongoose } = await import('@/lib/mongoose');
    await connectMongoose();
    const Menu = (await import('@/models/Menu')).default;
    return Menu;
  } catch (e) {
    console.log('⚠️ Mongoose Menu model not available:', e?.message || e);
    return null;
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    // Try to use Mongoose model first
    const Menu = await tryLoadMenuModel();
    if (Menu) {
      const filter = {};
      if (category) filter.category = new RegExp(`^${category}$`, 'i');
      const items = await Menu.find(filter).lean().exec();
      return NextResponse.json({ ok: true, items });
    }

    // Fallback to native driver
    const db = await getDb(process.env.MONGODB_DB || 'platepay');
    let query = {};
    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }
    const items = await db.collection('menu').find(query).toArray();
    return NextResponse.json({ ok: true, items });
  } catch (error) {
    console.error('GET /api/public/menu error:', error);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}