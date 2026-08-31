import { NextRequest, NextResponse } from 'next/server';
import { InstallationRequest } from '@/lib/types';
import { createLead } from '@/lib/services/lead-service';
import { crmAdapter } from '@/lib/adapters/crm-adapter';
import { notificationAdapter } from '@/lib/adapters/notification-adapter';

// In-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW = 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();

    if (!body.contact?.firstName || !body.contact?.email || !body.contact?.phone) {
      return NextResponse.json(
        { error: 'Contact name, email, and phone number are required.' },
        { status: 400 }
      );
    }

    if (!body.address || !body.city || !body.state) {
      return NextResponse.json(
        { error: 'Installation site address, city, and state are required.' },
        { status: 400 }
      );
    }

    const referenceNumber = `3E-INST-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const installation: InstallationRequest = {
      id: `inst_${Date.now()}`,
      referenceNumber,
      contact: {
        firstName: body.contact.firstName,
        lastName: body.contact.lastName || '',
        email: body.contact.email,
        phone: body.contact.phone,
        preferredContact: body.contact.preferredContact || 'phone',
      },
      organisation: body.organisation,
      propertyType: body.propertyType || 'home',
      address: body.address,
      city: body.city,
      state: body.state,
      systemType: body.systemType || 'new_purchase',
      packageOrProducts: body.packageOrProducts || 'Unspecified Power System',
      electricalPhase: body.electricalPhase || 'single-phase',
      hasGeneratorTransferSwitch: Boolean(body.hasGeneratorTransferSwitch),
      roofType: body.roofType || 'aluminum-tin',
      preferredDate: body.preferredDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      siteNotes: body.siteNotes || '',
      photoCount: Number(body.photoCount || 0),
      status: 'PENDING_AUDIT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // CRM Lead Sync
    try {
      const lead = createLead({
        contact: installation.contact,
        organisation: installation.organisation || {
          name: `${installation.contact.firstName} ${installation.contact.lastName}`,
          industry: `${installation.propertyType.toUpperCase()} Installation Site`,
        },
        products: [
          {
            productId: 'turnkey-installation-service',
            productName: `Installation Audit (${installation.systemType}): ${installation.packageOrProducts}`,
            category: 'installation',
          },
        ],
        quantity: { value: 1, unit: 'site' },
        location: {
          address: installation.address,
          city: installation.city,
          state: installation.state,
          country: 'Nigeria',
          deliveryType: 'delivery',
          accessNotes: `Phase: ${installation.electricalPhase}, Roof: ${installation.roofType}, ATS: ${installation.hasGeneratorTransferSwitch}`,
        },
        deliveryRequirement: `Site Inspection Requested for ${installation.preferredDate}`,
        requestedDate: installation.preferredDate,
        urgency: 'high',
        notes: `Site Notes: ${installation.siteNotes}. Infrastructure: Phase: ${installation.electricalPhase}, Roof: ${installation.roofType}`,
        attachments: [],
        source: 'website_quote',
      });

      await crmAdapter.syncLead(lead);
      await notificationAdapter.sendConfirmation(lead);
    } catch (adapterErr) {
      console.warn('Installation CRM notification warning:', adapterErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Installation request booked successfully. Our engineering team will contact you for site audit verification.',
      installation,
    });
  } catch (error) {
    console.error('Error creating installation request:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while booking your installation request.' },
      { status: 500 }
    );
  }
}
