import { NextRequest, NextResponse } from 'next/server';
import { createLead } from '@/lib/services/lead-service';
import { crmAdapter } from '@/lib/adapters/crm-adapter';
import { notificationAdapter } from '@/lib/adapters/notification-adapter';
import { Store, StoreEntity } from '@/lib/services/store-service';
import { createAutomationAction } from '@/lib/services/automation-service';

const leadsStore = new Store<StoreEntity & Record<string, unknown>>('leads');

/**
 * POST /api/leads
 * 
 * Accepts structured lead/quote data, creates a lead,
 * syncs to CRM adapter, and sends notifications.
 */

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // max requests
const RATE_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Basic validation
    if (!body.contact?.firstName || !body.contact?.email || !body.organisation?.name) {
      return NextResponse.json(
        { error: 'Missing required fields: contact name, email, and organisation are required.' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.contact.email)) {
      return NextResponse.json(
        { error: 'Invalid email format.' },
        { status: 400 }
      );
    }

    // Create lead
    const lead = createLead({
      contact: {
        firstName: String(body.contact.firstName).trim(),
        lastName: String(body.contact.lastName || '').trim(),
        email: String(body.contact.email).trim().toLowerCase(),
        phone: String(body.contact.phone || '').trim(),
        preferredContact: body.contact.preferredContact,
      },
      organisation: {
        name: String(body.organisation.name).trim(),
        industry: String(body.organisation.industry || '').trim(),
      },
      products: Array.isArray(body.products) ? body.products : [],
      quantity: {
        value: Number(body.quantity?.value) || 0,
        unit: String(body.quantity?.unit || 'litres'),
      },
      location: {
        address: String(body.location?.address || '').trim(),
        city: String(body.location?.city || '').trim(),
        state: String(body.location?.state || '').trim(),
        country: String(body.location?.country || '').trim(),
        deliveryType: body.location?.deliveryType || 'flexible',
      },
      deliveryRequirement: String(body.deliveryRequirement || '').trim(),
      requestedDate: String(body.requestedDate || '').trim(),
      urgency: body.urgency || 'medium',
      notes: String(body.notes || '').trim(),
      attachments: Array.isArray(body.attachments) ? body.attachments : [],
      source: body.source || 'website_quote',
      campaign: body.campaign,
    });

    // Sync to CRM adapter (async, non-blocking for response)
    crmAdapter.syncLead(lead).catch(err => {
      console.error('[Lead API] CRM sync failed:', err);
    });

    // Send notifications (async, non-blocking)
    notificationAdapter.sendLeadNotification(lead).catch(err => {
      console.error('[Lead API] Notification failed:', err);
    });

    // Phase 3: Persist to store
    leadsStore.create(lead as unknown as StoreEntity & Record<string, unknown>).catch(err => {
      console.error('[Lead API] Store persistence failed:', err);
    });

    // Phase 3: Schedule follow-up automation
    createAutomationAction({
      ruleId: 'rule-lead-follow-up',
      trigger: 'lead_follow_up',
      entityType: 'lead',
      entityId: lead.id,
      contactEmail: lead.contact.email,
      contactName: `${lead.contact.firstName} ${lead.contact.lastName}`,
      referenceNumber: lead.referenceNumber,
    }).catch(err => {
      console.error('[Lead API] Automation creation failed:', err);
    });

    console.log(`[Lead API] Lead created: ${lead.referenceNumber} — ${lead.contact.firstName} ${lead.contact.lastName} — ${lead.organisation.name}`);

    return NextResponse.json({
      success: true,
      referenceNumber: lead.referenceNumber,
      leadId: lead.id,
      message: 'Your quote request has been received. Our team will review and respond within one business day.',
    }, { status: 201 });

  } catch (error) {
    console.error('[Lead API] Error:', error);
    return NextResponse.json(
      { error: 'An internal error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
