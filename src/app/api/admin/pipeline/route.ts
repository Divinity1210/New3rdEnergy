/**
 * GET /api/admin/pipeline — Pipeline overview
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, getClientIP, getUserAgent } from '@/lib/middleware/auth-middleware';
import { logAction } from '@/lib/services/audit-service';
import { getStageStats, getAverageTimeInStage, PIPELINE_STAGES, STAGE_LABELS, STAGE_COLORS } from '@/lib/services/pipeline-service';
import { Session } from '@/lib/types';

async function handler(request: NextRequest, { session }: { session: Session }) {
  try {
    await logAction({
      session,
      action: 'VIEW',
      resource: 'pipeline',
      details: 'Viewed pipeline overview',
      ipAddress: getClientIP(request),
      userAgent: getUserAgent(request),
    });

    const stageStats = await getStageStats();
    const avgTimes = await getAverageTimeInStage();

    const stages = PIPELINE_STAGES.map(stage => ({
      id: stage,
      label: STAGE_LABELS[stage],
      color: STAGE_COLORS[stage],
      count: stageStats[stage] || 0,
      avgHoursInStage: Math.round(avgTimes[stage] || 0),
    }));

    return NextResponse.json({ stages });
  } catch (error) {
    console.error('[Pipeline API] Error:', error);
    return NextResponse.json({ error: 'Failed to load pipeline.' }, { status: 500 });
  }
}

export const GET = withAuth(handler, ['ADMIN', 'SALES', 'MARKETING']);
