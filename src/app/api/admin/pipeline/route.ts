/**
 * GET & PATCH /api/admin/pipeline — Pipeline overview and real-time stage management
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, getClientIP, getUserAgent } from '@/lib/middleware/auth-middleware';
import { logAction } from '@/lib/services/audit-service';
import {
  getPipelineOpportunities,
  getStageStats,
  getAverageTimeInStage,
  updateOpportunityStage,
  PIPELINE_STAGES,
  STAGE_LABELS,
  STAGE_COLORS,
} from '@/lib/services/pipeline-service';
import { notificationAdapter } from '@/lib/adapters/notification-adapter';
import { PipelineStage, Session } from '@/lib/types';

async function getHandler(request: NextRequest, { session }: { session: Session }) {
  try {
    const { searchParams } = new URL(request.url);
    const division = searchParams.get('division') || 'all';

    await logAction({
      session,
      action: 'VIEW',
      resource: 'pipeline',
      details: `Viewed pipeline overview (division=${division})`,
      ipAddress: getClientIP(request),
      userAgent: getUserAgent(request),
    });

    const opportunities = await getPipelineOpportunities(division);
    const stageStats = await getStageStats(division);
    const avgTimes = await getAverageTimeInStage();

    const stages = PIPELINE_STAGES.map(stage => ({
      id: stage,
      label: STAGE_LABELS[stage],
      color: STAGE_COLORS[stage],
      count: stageStats[stage] || 0,
      avgHoursInStage: Math.round(avgTimes[stage] || 0),
    }));

    const totalDeals = opportunities.length;
    const totalPipelineValue = opportunities.reduce((sum, o) => sum + (o.estimatedValue || 0), 0);

    return NextResponse.json({
      stages,
      opportunities,
      totalDeals,
      totalPipelineValue,
      division,
    });
  } catch (error) {
    console.error('[Pipeline API] Error:', error);
    return NextResponse.json({ error: 'Failed to load pipeline.' }, { status: 500 });
  }
}

async function patchHandler(request: NextRequest, { session }: { session: Session }) {
  try {
    const body = await request.json();
    const { opportunityId, newStage } = body;

    if (!opportunityId || !newStage) {
      return NextResponse.json(
        { error: 'Missing opportunityId or newStage in request.' },
        { status: 400 }
      );
    }

    if (!PIPELINE_STAGES.includes(newStage as PipelineStage)) {
      return NextResponse.json(
        { error: `Invalid pipeline stage: ${newStage}` },
        { status: 400 }
      );
    }

    const success = await updateOpportunityStage(opportunityId, newStage as PipelineStage);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to transition stage. Opportunity not found or transition invalid.' },
        { status: 404 }
      );
    }

    await logAction({
      session,
      action: 'UPDATE',
      resource: 'pipeline',
      details: `Updated opportunity ${opportunityId} stage to ${newStage}`,
      ipAddress: getClientIP(request),
      userAgent: getUserAgent(request),
    });

    // Notify info@3rdenergyservices.com on pipeline update
    try {
      const opps = await getPipelineOpportunities('all');
      const updatedOpp = opps.find((o) => o.id === opportunityId);
      if (updatedOpp) {
        notificationAdapter.sendStageChangeNotification({
          referenceNumber: updatedOpp.referenceNumber,
          company: updatedOpp.company,
          contactName: updatedOpp.contactName,
          stage: STAGE_LABELS[newStage as PipelineStage] || newStage,
          estimatedValue: updatedOpp.estimatedValue,
        }).catch(err => console.error('[Pipeline Stage Email Error]', err));
      }
    } catch (notifErr) {
      console.warn('[Stage Notification Warn]', notifErr);
    }

    return NextResponse.json({
      success: true,
      message: `Opportunity moved to ${STAGE_LABELS[newStage as PipelineStage]}`,
      opportunityId,
      newStage,
    });
  } catch (error) {
    console.error('[Pipeline API PATCH] Error:', error);
    return NextResponse.json({ error: 'Failed to update pipeline stage.' }, { status: 500 });
  }
}

export const GET = withAuth(getHandler, ['ADMIN', 'SALES', 'MARKETING']);
export const PATCH = withAuth(patchHandler, ['ADMIN', 'SALES']);
export const PUT = withAuth(patchHandler, ['ADMIN', 'SALES']);
