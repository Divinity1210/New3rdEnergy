/**
 * GET /api/portal/dashboard — Customer Executive Dashboard Overview
 */

import { NextResponse } from 'next/server';
import { withCustomerAuth } from '@/lib/middleware/customer-auth-middleware';
import { getCustomerDashboardSummary } from '@/lib/services/customer-portal-service';

export const GET = withCustomerAuth(async (_req, { session }) => {
  try {
    const summary = await getCustomerDashboardSummary(session.userId);
    return NextResponse.json(summary);
  } catch (error) {
    console.error('[Customer Portal Dashboard API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve customer dashboard data.' },
      { status: 500 }
    );
  }
});
