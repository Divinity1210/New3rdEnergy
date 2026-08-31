/**
 * GET /api/portal/service-history — List service logs & maintenance history
 * POST /api/portal/service-history — Request routine or emergency service visit
 */

import { NextRequest, NextResponse } from 'next/server';
import { withCustomerAuth } from '@/lib/middleware/customer-auth-middleware';
import { getCustomerServiceHistory, createServiceRequest } from '@/lib/services/customer-portal-service';

export const GET = withCustomerAuth(async (req: NextRequest, { session }) => {
  try {
    const { searchParams } = new URL(req.url);
    const systemId = searchParams.get('systemId') || undefined;
    const records = await getCustomerServiceHistory(session.userId, systemId);
    return NextResponse.json({ records });
  } catch (error) {
    console.error('[Portal Service History API] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch service records.' }, { status: 500 });
  }
});

export const POST = withCustomerAuth(async (req: NextRequest, { session }) => {
  try {
    const body = await req.json();
    const { systemId, systemName, preferredDate, issueDescription, contactPhone } = body;

    if (!issueDescription) {
      return NextResponse.json({ error: 'Issue description is required.' }, { status: 400 });
    }

    const record = await createServiceRequest(session.userId, {
      systemId: systemId || 'unassigned',
      systemName: systemName || 'Commercial Power Setup',
      preferredDate,
      issueDescription,
      contactPhone: contactPhone || '',
    });

    return NextResponse.json({ success: true, record }, { status: 201 });
  } catch (error) {
    console.error('[Portal Service Request POST API] Error:', error);
    return NextResponse.json({ error: 'Failed to create service request.' }, { status: 500 });
  }
});
