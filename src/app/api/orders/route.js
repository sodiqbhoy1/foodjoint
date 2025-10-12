import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { sendOrderConfirmationEmail } from '@/lib/emailService';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get('reference');
    
    const db = await getDb();
    
    let query = {};
    if (reference) {
      query.reference = reference;
    }
    
    const orders = await db.collection('orders').find(query).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ ok: true, orders });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const order = await req.json();
    const db = await getDb();
    
    // Check for duplicate orders by reference
    if (order.reference) {
      const existingOrder = await db.collection('orders').findOne({ 
        reference: order.reference 
      });
      
      if (existingOrder) {
        return NextResponse.json({ ok: true, order: existingOrder, message: 'Order already exists' });
      }
    }
    
    // Add timestamp if not present
    if (!order.createdAt) {
      order.createdAt = new Date();
    }
    
    // Mark source as client if not specified
    if (!order.source) {
      order.source = 'client';
    }
    
    const result = await db.collection('orders').insertOne(order);
    order._id = result.insertedId;
    
    console.log('🎯 Order created successfully:', {
      id: order._id,
      reference: order.reference,
      customerEmail: order.customer?.email,
      amount: order.amount
    });
    
    // Send order confirmation email (non-blocking)
    if (order.customer?.email) {
      sendOrderConfirmationEmail(order).catch(err => {
        // Log silently on server
      });
    }
    
    return NextResponse.json({ ok: true, order });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { _id, ...updateData } = body;
    
    if (!_id) {
      return NextResponse.json({ ok: false, error: 'Order ID is required' }, { status: 400 });
    }
    
    const db = await getDb();
    updateData.updatedAt = new Date();
    
    await db.collection('orders').updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );
    
    const updatedOrder = await db.collection('orders').findOne({ _id: new ObjectId(_id) });
    
    return NextResponse.json({ ok: true, order: updatedOrder });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
