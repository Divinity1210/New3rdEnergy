/**
 * GET /api/admin/leads/[id] — Single lead detail
 * PATCH /api/admin/leads/[id] — Update lead
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, getClientIP, getUserAgent } from '@/lib/middleware/auth-middleware';
import { logAction } from '@/lib/services/audit-service';
import { scoreLead } from '@/lib/services/lead-scoring-service';
import { aiService } from '@/lib/services/ai-service';
import { Store, StoreEntity } from '@/lib/services/store-service';
import { Lead, Session } from '@/lib/types';

const leadsStore = new Store<StoreEntity & Record<string, unknown>>('leads');

async function getHandler(request: NextRequest, { session, params }: { session: Session; params?: Record<string, string> }) {
  try {
    const id = params?.id;
    if (!id) return NextResponse.json({ error: 'Lead ID required.' }, { status: 400 });

    const lead = await leadsStore.get(id);
    if (!lead) return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });

    await logAction({
      session,
      action: 'VIEW',
      resource: 'leads',
      resourceId: id,
      details: 'Viewed lead detail',
      ipAddress: getClientIP(request),
      userAgent: getUserAgent(request),
    });

    const typedLead = lead as unknown as Lead;
    const score = scoreLead(typedLead);
    const aiSummary = await aiService.qualifyLead(typedLead);

    return NextResponse.json({
      lead,
      score,
      aiSummary,
    });
  } catch (error) {
    console.error('[Admin Lead Detail] Error:', error);
    return NextResponse.json({ error: 'Failed to load lead.' }, { status: 500 });
  }
}

async function patchHandler(request: NextRequest, { session, params }: { session: Session; params?: Record<string, string> }) {
  try {
    const id = params?.id;
    if (!id) return NextResponse.json({ error: 'Lead ID required.' }, { status: 400 });

    const body = await request.json();
    const allowedFields = ['status', 'urgency', 'assignedOwner', 'notes'];
    const updates: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update.' }, { status: 400 });
    }

    const updated = await leadsStore.update(id, updates);
    if (!updated) return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });

    await logAction({
      session,
      action: 'UPDATE',
      resource: 'leads',
      resourceId: id,
      details: `Updated fields: ${Object.keys(updates).join(', ')}`,
      ipAddress: getClientIP(request),
      userAgent: getUserAgent(request),
    });

    return NextResponse.json({ success: true, lead: updated });
  } catch (error) {
    console.error('[Admin Lead Update] Error:', error);
    return NextResponse.json({ error: 'Failed to update lead.' }, { status: 500 });
  }
}

export const GET = withAuth(getHandler, ['ADMIN', 'SALES']);
export const PATCH = withAuth(patchHandler, ['ADMIN', 'SALES']);
