import { NextRequest, NextResponse } from 'next/server';
import { createContactLead } from '@/lib/services/lead-service';
import { notificationAdapter } from '@/lib/adapters/notification-adapter';

/**
 * POST /api/contact
 * 
 * Handles contact form submissions, creating leads
 * from general enquiries.
 */

// Simple rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
    }

    const body = await request.json();

    // Validation
    if (!body.firstName || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, subject, and message are required.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: 'Invalid email format.' }, { status: 400 });
    }

    // Create lead from contact form
    const lead = createContactLead({
      firstName: String(body.firstName).trim(),
      lastName: String(body.lastName || '').trim(),
      email: String(body.email).trim().toLowerCase(),
      phone: String(body.phone || '').trim(),
      organisation: String(body.organisation || '').trim(),
      subject: String(body.subject).trim(),
      message: String(body.message).trim(),
      preferredContact: body.preferredContact || 'email',
    });

    // Notify
    notificationAdapter.sendLeadNotification(lead).catch(console.error);

    console.log(`[Contact API] Enquiry received: ${lead.referenceNumber} — ${lead.contact.email}`);

    return NextResponse.json({
      success: true,
      referenceNumber: lead.referenceNumber,
      message: 'Thank you for your enquiry. We will respond within one business day.',
    }, { status: 201 });

  } catch (error) {
    console.error('[Contact API] Error:', error);
    return NextResponse.json({ error: 'An internal error occurred.' }, { status: 500 });
  }
}
