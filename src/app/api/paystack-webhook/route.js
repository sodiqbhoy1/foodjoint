import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import crypto from 'crypto';
import { sendOrderConfirmationEmail } from '@/lib/emailService';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    // Get the raw body for signature verification
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);
    
    // Verify webhook signature for security (if webhook secret is available)
    const webhookSecret = process.env.PAYSTACK_WEBHOOK_SECRET;
    if (webhookSecret) {
      const hash = crypto.createHmac('sha512', webhookSecret).update(rawBody).digest('hex');
      const signature = req.headers.get('x-paystack-signature');
      
      if (!signature || hash !== signature) {
        console.error('Invalid webhook signature');
        return NextResponse.json({ ok: false, error: 'Invalid signature' }, { status: 401 });
      }
      console.log('Webhook signature verified ✅');
    } else {
      console.warn('⚠️  Webhook running without signature verification. Add PAYSTACK_WEBHOOK_SECRET for security.');
    }
    
    // Log webhook details for debugging
    console.log('Webhook event:', body.event);
    console.log('Transaction status:', body.data?.status);
    
    if (body.event === 'charge.success' && body.data.status === 'success') {
      const meta = body.data.metadata || {};
      const db = await getDb();
      
      // Check if order already exists (avoid duplicates)
      const existingOrder = await db.collection('orders').findOne({ 
        reference: body.data.reference 
      });
      
      if (existingOrder) {
        console.log('Order already exists:', body.data.reference);
        return NextResponse.json({ ok: true, message: 'Order already exists' });
      }
      
      const order = {
        reference: body.data.reference,
        amount: body.data.amount / 100,
        currency: body.data.currency,
        customer: meta.customer || {},
        items: meta.items || [],
        status: 'pending', // Default status for new orders
        paid: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        source: 'webhook', // Mark as created by webhook
        paystack_reference: body.data.reference,
        paystack_transaction_id: body.data.id
      };
      
      const result = await db.collection('orders').insertOne(order);
      order._id = result.insertedId;
      
      // Send order confirmation email (non-blocking) and mark flag
      if (order.customer?.email) {
        console.log('📧 Attempting to send webhook order confirmation email to:', order.customer.email);
        sendOrderConfirmationEmail(order)
          .then(async (result) => {
            console.log('📧 Webhook email result:', result);
            if (result?.success) {
              await db.collection('orders').updateOne(
                { _id: order._id },
                { $set: { confirmationEmailSent: true, confirmationEmailSentAt: new Date() } }
              );
              console.log('✅ Webhook email flag updated for order:', order.reference);
            } else {
              console.log('❌ Webhook email failed but order saved:', result);
              await db.collection('orders').updateOne(
                { _id: order._id },
                { $set: { confirmationEmailError: result?.error || 'Unknown error', confirmationEmailSentAt: new Date() } }
              );
            }
          })
          .catch(err => {
            console.error('❌ Failed to send order confirmation email via webhook:', err);
            // Update order with email error for debugging
            db.collection('orders').updateOne(
              { _id: order._id },
              { $set: { confirmationEmailError: err.message, confirmationEmailSentAt: new Date() } }
            ).catch(dbErr => console.error('Failed to update email error:', dbErr));
          });
      } else {
        console.log('⚠️ No customer email found in webhook order, skipping email');
      }
      
      console.log('✅ Order created via webhook:', order.reference);
      return NextResponse.json({ ok: true, order });
    }
    
    console.log('ℹ️  Webhook event ignored:', body.event);
    return NextResponse.json({ ok: false, message: 'Not a successful payment event.' });
  } catch (e) {
    console.error('❌ Webhook error:', e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
