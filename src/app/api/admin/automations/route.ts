/**
 * GET /api/admin/automations — List pending actions
 * POST /api/admin/automations — Approve/dismiss action
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, getClientIP, getUserAgent } from '@/lib/middleware/auth-middleware';
import { logAction } from '@/lib/services/audit-service';
import { getPendingActions, getActions, approveAction, dismissAction, getAutomationRules } from '@/lib/services/automation-service';
import { Session } from '@/lib/types';

async function getHandler(request: NextRequest, { session }: { session: Session }) {
  try {
    await logAction({
      session,
      action: 'VIEW',
      resource: 'automations',
      details: 'Viewed automation queue',
      ipAddress: getClientIP(request),
      userAgent: getUserAgent(request),
    });

    const pending = await getPendingActions();
    const all = await getActions();
    const rules = getAutomationRules();

    return NextResponse.json({
      pending,
      all,
      rules,
      stats: {
        total: all.length,
        pending: pending.length,
        approved: all.filter(a => a.status === 'APPROVED').length,
        dismissed: all.filter(a => a.status === 'DISMISSED').length,
      },
    });
  } catch (error) {
    console.error('[Automations API] Error:', error);
    return NextResponse.json({ error: 'Failed to load automations.' }, { status: 500 });
  }
}

async function postHandler(request: NextRequest, { session }: { session: Session }) {
  try {
    const body = await request.json();
    const { actionId, decision } = body;

    if (!actionId || !decision) {
      return NextResponse.json({ error: 'actionId and decision (approve/dismiss) required.' }, { status: 400 });
    }

    let result;
    if (decision === 'approve') {
      result = await approveAction(actionId, session.email);
    } else if (decision === 'dismiss') {
      result = await dismissAction(actionId, session.email);
    } else {
      return NextResponse.json({ error: 'Decision must be "approve" or "dismiss".' }, { status: 400 });
    }

    if (!result) {
      return NextResponse.json({ error: 'Action not found.' }, { status: 404 });
    }

    await logAction({
      session,
      action: decision === 'approve' ? 'APPROVE' : 'DISMISS',
      resource: 'automations',
      resourceId: actionId,
      details: `${decision === 'approve' ? 'Approved' : 'Dismissed'} automation action`,
      ipAddress: getClientIP(request),
      userAgent: getUserAgent(request),
    });

    return NextResponse.json({ success: true, action: result });
  } catch (error) {
    console.error('[Automations API] Error:', error);
    return NextResponse.json({ error: 'Failed to process automation action.' }, { status: 500 });
  }
}

export const GET = withAuth(getHandler, ['ADMIN', 'SALES', 'MARKETING']);
export const POST = withAuth(postHandler, ['ADMIN', 'SALES', 'MARKETING']);
