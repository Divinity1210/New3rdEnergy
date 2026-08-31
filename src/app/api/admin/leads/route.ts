/**
 * GET /api/admin/leads — List leads
 * POST /api/admin/leads — (reserved for future bulk operations)
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, getClientIP, getUserAgent } from '@/lib/middleware/auth-middleware';
import { logAction } from '@/lib/services/audit-service';
import { scoreLead } from '@/lib/services/lead-scoring-service';
import { Store, StoreEntity } from '@/lib/services/store-service';
import { Lead, Session } from '@/lib/types';

const leadsStore = new Store<StoreEntity & Record<string, unknown>>('leads');

async function handler(request: NextRequest, { session }: { session: Session }) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    await logAction({
      session,
      action: 'VIEW',
      resource: 'leads',
      details: `Listed leads (status=${status || 'all'}, search=${search || 'none'})`,
      ipAddress: getClientIP(request),
      userAgent: getUserAgent(request),
    });

    let leads: (StoreEntity & Record<string, unknown>)[];

    if (search) {
      leads = await leadsStore.search(
        ['notes' as keyof (StoreEntity & Record<string, unknown>)],
        search
      );
    } else {
      leads = await leadsStore.list();
    }

    // Apply status filter
    if (status) {
      leads = leads.filter(l => (l as Record<string, unknown>).status === status);
    }

    const total = leads.length;

    // Apply pagination
    const paginatedLeads = leads.slice(offset, offset + limit);

    // Enrich with lead scores
    const enrichedLeads = paginatedLeads.map(lead => {
      const typedLead = lead as unknown as Lead;
      const score = scoreLead(typedLead);
      return {
        ...lead,
        score: {
          total: score.totalScore,
          tier: score.tier,
          explanation: score.explanation,
        },
      };
    });

    return NextResponse.json({
      leads: enrichedLeads,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    });
  } catch (error) {
    console.error('[Admin Leads API] Error:', error);
    return NextResponse.json({ error: 'Failed to load leads.' }, { status: 500 });
  }
}

export const GET = withAuth(handler, ['ADMIN', 'SALES']);
