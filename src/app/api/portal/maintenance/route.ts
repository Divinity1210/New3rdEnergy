/**
 * GET /api/portal/maintenance — List maintenance schedules, intervals, and reminders
 */

import { NextResponse } from 'next/server';
import { withCustomerAuth } from '@/lib/middleware/customer-auth-middleware';
import { getCustomerMaintenance } from '@/lib/services/customer-portal-service';

export const GET = withCustomerAuth(async (_req, { session }) => {
  try {
    const reminders = await getCustomerMaintenance(session.userId);
    return NextResponse.json({ reminders });
  } catch (error) {
    console.error('[Portal Maintenance API] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch maintenance reminders.' }, { status: 500 });
  }
});
