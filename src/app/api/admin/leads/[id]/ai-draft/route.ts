/**
 * POST /api/admin/leads/[id]/ai-draft — Generate AI draft response
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, getClientIP, getUserAgent } from '@/lib/middleware/auth-middleware';
import { logAction } from '@/lib/services/audit-service';
import { aiService } from '@/lib/services/ai-service';
import { Store, StoreEntity } from '@/lib/services/store-service';
import { Lead, Session } from '@/lib/types';

const leadsStore = new Store<StoreEntity & Record<string, unknown>>('leads');

async function handler(request: NextRequest, { session, params }: { session: Session; params?: Record<string, string> }) {
  try {
    const id = params?.id;
    if (!id) return NextResponse.json({ error: 'Lead ID required.' }, { status: 400 });

    const lead = await leadsStore.get(id);
    if (!lead) return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });

    await logAction({
      session,
      action: 'GENERATE_AI',
      resource: 'leads',
      resourceId: id,
      details: 'Generated AI sales context and draft response',
      ipAddress: getClientIP(request),
      userAgent: getUserAgent(request),
    });

    const salesContext = await aiService.prepareSalesContext(lead as unknown as Lead);
    const quoteBrief = await aiService.prepareQuoteBrief(lead as unknown as Lead);

    return NextResponse.json({
      salesContext,
      quoteBrief,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[AI Draft API] Error:', error);
    return NextResponse.json({ error: 'Failed to generate AI draft.' }, { status: 500 });
  }
}

export const POST = withAuth(handler, ['ADMIN', 'SALES']);
