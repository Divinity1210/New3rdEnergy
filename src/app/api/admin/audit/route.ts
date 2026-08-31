/**
 * GET /api/admin/audit — Audit log viewer (ADMIN only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, getClientIP, getUserAgent } from '@/lib/middleware/auth-middleware';
import { logAction, queryAuditLog } from '@/lib/services/audit-service';
import { Session, AuditAction } from '@/lib/types';

async function handler(request: NextRequest, { session }: { session: Session }) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || undefined;
    const action = (searchParams.get('action') || undefined) as AuditAction | undefined;
    const resource = searchParams.get('resource') || undefined;
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Log the audit view itself
    await logAction({
      session,
      action: 'VIEW',
      resource: 'audit',
      details: 'Viewed audit log',
      ipAddress: getClientIP(request),
      userAgent: getUserAgent(request),
    });

    const result = await queryAuditLog({
      userId,
      action,
      resource,
      startDate,
      endDate,
      limit,
      offset,
    });

    return NextResponse.json({
      entries: result.entries,
      total: result.total,
      limit,
      offset,
      hasMore: offset + limit < result.total,
    });
  } catch (error) {
    console.error('[Audit API] Error:', error);
    return NextResponse.json({ error: 'Failed to load audit log.' }, { status: 500 });
  }
}

export const GET = withAuth(handler, ['ADMIN']);
