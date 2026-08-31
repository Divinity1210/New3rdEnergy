/**
 * GET /api/portal/warranty — List customer warranty certificates and statuses
 */

import { NextResponse } from 'next/server';
import { withCustomerAuth } from '@/lib/middleware/customer-auth-middleware';
import { getCustomerWarranties } from '@/lib/services/customer-portal-service';

export const GET = withCustomerAuth(async (_req, { session }) => {
  try {
    const warranties = await getCustomerWarranties(session.userId);
    return NextResponse.json({ warranties });
  } catch (error) {
    console.error('[Portal Warranty API] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch warranties.' }, { status: 500 });
  }
});
