import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const db = await getDb();
    
    // Build query: filter by category if provided
    let query = {};
    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }
    
    // Use the correct collection name 'menu' and return as 'items'
    const items = await db.collection('menu').find(query).toArray();
    return NextResponse.json({ ok: true, items });
  } catch (error) {
    console.error('GET /api/public/menu error:', error);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}