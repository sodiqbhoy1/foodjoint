import { getDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";


// GET: Fetch all *available* menu items for the public
export async function GET(req) {
  try {
    const db = await getDb();
    // Only fetch items that are marked as available
    const menuItems = await db.collection('menus').find({ available: true }).toArray();

    return NextResponse.json({ menuItems });
  } catch (error) {
    console.error('GET /api/public/menu error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}