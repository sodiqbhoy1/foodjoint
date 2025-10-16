import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { sendOrderConfirmationEmail } from '@/lib/emailService';

// Lazy-load Mongoose model if available. If not, fall back to native driver.
let OrderModel = null;
async function tryLoadMongooseModel() {
  if (OrderModel) return OrderModel;
  try {
    const { connectMongoose } = await import('@/lib/mongoose');
    await connectMongoose();
    const Order = (await import('@/models/Order')).default;
    OrderModel = Order;
    return OrderModel;
  } catch (e) {
    // Mongoose not available or failed to connect — caller should fall back
    return null;
  }
}

export const runtime = 'nodejs';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get('reference');
    const M = await tryLoadMongooseModel();
    const query = {};
    if (reference) query.reference = reference;

    let orders = [];
    if (M) {
      orders = await M.find(query).sort({ createdAt: -1 }).lean().exec();
    } else {
      const db = await getDb();
      orders = await db.collection('orders').find(query).sort({ createdAt: -1 }).toArray();
    }

    return NextResponse.json({ ok: true, orders });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err?.message || String(err) }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const order = await req.json();
    const M = await tryLoadMongooseModel();
    const db = await getDb();

    // If reference is provided, check for an existing order
    if (order.reference) {
      const existingOrder = M
        ? await M.findOne({ reference: order.reference }).lean().exec()
        : await db.collection('orders').findOne({ reference: order.reference });

      if (existingOrder) {
        // If confirmation email hasn't been sent, try to resend asynchronously
        if (!existingOrder.confirmationEmailSent && existingOrder.customer?.email) {
          sendOrderConfirmationEmail(existingOrder)
            .then(async (result) => {
              if (result?.success) {
                if (M) {
                  await M.updateOne({ _id: existingOrder._id }, { $set: { confirmationEmailSent: true, confirmationEmailSentAt: new Date() } });
                } else {
                  await db.collection('orders').updateOne(
                    { _id: existingOrder._id },
                    { $set: { confirmationEmailSent: true, confirmationEmailSentAt: new Date() } }
                  );
                }
              }
            })
            .catch((err) => { console.error('Email resend failed (existing order):', err?.message || err); });
        }

        return NextResponse.json({ ok: true, order: existingOrder, message: 'Order already exists' });
      }
    }

    // Ensure timestamps and source
    if (!order.createdAt) order.createdAt = new Date();
    if (!order.source) order.source = 'client';

    // Try saving with Mongoose first
    let usedMongoose = false;
    try {
      if (M) {
        const doc = new M(order);
        const saved = await doc.save();
        order._id = saved._id;
        usedMongoose = true;
      }
    } catch (e) {
      console.error('Mongoose save failed, falling back to native driver:', e?.message || e);
      usedMongoose = false;
    }

    if (!usedMongoose) {
      const result = await db.collection('orders').insertOne(order);
      order._id = result.insertedId;
    }

    // If customer email exists, attempt to send confirmation asynchronously and record attempts
    if (order.customer?.email) {
      try {
        if (M) {
          await M.updateOne({ _id: order._id }, { $set: { emailAttempts: 1, lastEmailAttempt: new Date() } });
        } else {
          await db.collection('orders').updateOne({ _id: order._id }, { $set: { emailAttempts: 1, lastEmailAttempt: new Date() } });
        }
      } catch (e) {
        console.error('Failed to write initial email attempt metadata:', e?.message || e);
      }

      sendOrderConfirmationEmail(order)
        .then(async (result) => {
          try {
            if (result?.success) {
              if (M) {
                await M.updateOne({ _id: order._id }, { $set: { confirmationEmailSent: true, confirmationEmailSentAt: new Date() }, $unset: { confirmationEmailError: '' } });
              } else {
                await db.collection('orders').updateOne(
                  { _id: order._id },
                  { $set: { confirmationEmailSent: true, confirmationEmailSentAt: new Date() }, $unset: { confirmationEmailError: '' } }
                );
              }
            } else {
              if (M) {
                await M.updateOne({ _id: order._id }, { $set: { confirmationEmailError: result?.error || 'Unknown error', lastEmailAttempt: new Date() } });
              } else {
                await db.collection('orders').updateOne({ _id: order._id }, { $set: { confirmationEmailError: result?.error || 'Unknown error', lastEmailAttempt: new Date() } });
              }
            }
          } catch (e) {
            console.error('Failed to update order email status after send:', e?.message || e);
          }
        })
        .catch(async (err) => {
          console.error('Email send failed (new order):', err?.message || err);
          try {
            if (M) {
              await M.updateOne({ _id: order._id }, { $set: { confirmationEmailError: err?.message || 'Unknown error', lastEmailAttempt: new Date() } });
            } else {
              await db.collection('orders').updateOne({ _id: order._id }, { $set: { confirmationEmailError: err?.message || 'Unknown error', lastEmailAttempt: new Date() } });
            }
          } catch (e) {
            console.error('Failed to write email error metadata:', e?.message || e);
          }
        });
    }

    return NextResponse.json({ ok: true, order });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err?.message || String(err) }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json({ ok: false, error: 'Order ID is required' }, { status: 400 });
    }

    updateData.updatedAt = new Date();
    const M = await tryLoadMongooseModel();

    if (M) {
      await M.updateOne({ _id }, { $set: updateData });
      const updatedOrder = await M.findOne({ _id }).lean().exec();
      return NextResponse.json({ ok: true, order: updatedOrder });
    }

    const db = await getDb();
    const oid = typeof _id === 'string' ? new ObjectId(_id) : _id;
    await db.collection('orders').updateOne({ _id: oid }, { $set: updateData });
    const updatedOrder = await db.collection('orders').findOne({ _id: oid });

    return NextResponse.json({ ok: true, order: updatedOrder });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err?.message || String(err) }, { status: 500 });
  }
}
      
