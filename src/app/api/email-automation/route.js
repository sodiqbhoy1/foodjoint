// Force Node.js runtime for Vercel
export const runtime = 'nodejs';

import { getDb } from '@/lib/mongodb';
import { sendOrderConfirmationEmail } from '@/lib/emailService';

export async function POST(request) {
  try {
    console.log('🔄 Starting automated email processing...');
    
    // Optional API key protection (can be called without key for internal use)
    const { apiKey } = await request.json().catch(() => ({}));
    
    const db = await getDb();
    
    // Find orders that:
    // 1. Are paid (successful)
    // 2. Don't have confirmation email sent
    // 3. Were created in the last 24 hours (to avoid spam)
    // 4. Have customer email
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const ordersNeedingEmail = await db.collection('orders').find({
      paid: true,
      'customer.email': { $exists: true, $ne: '' },
      confirmationEmailSent: { $ne: true },
      createdAt: { $gte: twentyFourHoursAgo },
      // Avoid orders that have had too many email attempts
      $or: [
        { emailAttempts: { $exists: false } },
        { emailAttempts: { $lt: 3 } }
      ]
    }).toArray();
    
    console.log(`📧 Found ${ordersNeedingEmail.length} orders needing confirmation emails`);
    
    if (ordersNeedingEmail.length === 0) {
      return Response.json({
        success: true,
        message: 'No orders need confirmation emails',
        processed: 0
      });
    }
    
    let successCount = 0;
    let failureCount = 0;
    const results = [];
    
    // Process each order
    for (const order of ordersNeedingEmail) {
      try {
        console.log(`📧 Processing email for order: ${order.reference}`);
        
        // Increment attempt counter
        const currentAttempts = (order.emailAttempts || 0) + 1;
        await db.collection('orders').updateOne(
          { _id: order._id },
          { 
            $set: { 
              emailAttempts: currentAttempts,
              lastEmailAttempt: new Date()
            }
          }
        );
        
        // Try to send email
        const emailResult = await sendOrderConfirmationEmail(order);
        
        if (emailResult.success) {
          // Mark as sent
          await db.collection('orders').updateOne(
            { _id: order._id },
            { 
              $set: { 
                confirmationEmailSent: true,
                confirmationEmailSentAt: new Date(),
                emailAttempts: currentAttempts
              },
              $unset: { confirmationEmailError: "" }
            }
          );
          
          successCount++;
          results.push({
            reference: order.reference,
            status: 'success',
            email: order.customer.email
          });
          
          console.log(`✅ Email sent successfully for order: ${order.reference}`);
        } else {
          // Mark the error but don't fail completely
          await db.collection('orders').updateOne(
            { _id: order._id },
            { 
              $set: { 
                confirmationEmailError: emailResult.error || 'Unknown error',
                lastEmailAttempt: new Date(),
                emailAttempts: currentAttempts
              }
            }
          );
          
          failureCount++;
          results.push({
            reference: order.reference,
            status: 'failed',
            error: emailResult.error,
            email: order.customer.email
          });
          
          console.log(`❌ Email failed for order: ${order.reference} - ${emailResult.error}`);
        }
        
        // Small delay to avoid overwhelming email service
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (orderError) {
        console.error(`❌ Error processing order ${order.reference}:`, orderError);
        failureCount++;
        results.push({
          reference: order.reference,
          status: 'error',
          error: orderError.message,
          email: order.customer?.email
        });
      }
    }
    
    console.log(`🎯 Email processing complete: ${successCount} success, ${failureCount} failures`);
    
    return Response.json({
      success: true,
      message: `Processed ${ordersNeedingEmail.length} orders`,
      summary: {
        total: ordersNeedingEmail.length,
        success: successCount,
        failures: failureCount
      },
      results: results,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('🚨 Automated email processing error:', error);
    return Response.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// GET endpoint for health check and manual trigger
export async function GET() {
  try {
    const db = await getDb();
    
    // Get count of orders needing emails
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const pendingCount = await db.collection('orders').countDocuments({
      paid: true,
      'customer.email': { $exists: true, $ne: '' },
      confirmationEmailSent: { $ne: true },
      createdAt: { $gte: twentyFourHoursAgo },
      $or: [
        { emailAttempts: { $exists: false } },
        { emailAttempts: { $lt: 3 } }
      ]
    });
    
    return Response.json({
      success: true,
      pendingEmails: pendingCount,
      message: pendingCount > 0 ? `${pendingCount} orders need confirmation emails` : 'No orders need emails',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}