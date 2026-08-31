/**
 * GET /api/admin/insights — AI-generated management insights
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, getClientIP, getUserAgent } from '@/lib/middleware/auth-middleware';
import { logAction } from '@/lib/services/audit-service';
import { aiService } from '@/lib/services/ai-service';
import { Store, StoreEntity } from '@/lib/services/store-service';
import { DashboardMetrics, Session } from '@/lib/types';

const leadsStore = new Store<StoreEntity & Record<string, unknown>>('leads');
const ordersStore = new Store<StoreEntity & Record<string, unknown>>('orders');

async function handler(request: NextRequest, { session }: { session: Session }) {
  try {
    await logAction({
      session,
      action: 'GENERATE_AI',
      resource: 'insights',
      details: 'Generated AI management insights',
      ipAddress: getClientIP(request),
      userAgent: getUserAgent(request),
    });

    const leads = await leadsStore.list();
    const orders = await ordersStore.list();

    const metrics: DashboardMetrics = {
      totalLeads: leads.length,
      qualifiedLeads: leads.filter(l => (l as Record<string, unknown>).status !== 'NEW').length,
      quotesSent: leads.filter(l => ['QUOTE_SENT', 'NEGOTIATION', 'WON'].includes((l as Record<string, unknown>).status as string)).length,
      totalOrders: orders.length,
      totalRevenue: orders.reduce((s, o) => s + ((o as Record<string, unknown>).total as number || 0), 0),
      averageOrderValue: orders.length > 0 ? orders.reduce((s, o) => s + ((o as Record<string, unknown>).total as number || 0), 0) / orders.length : 0,
      quoteConversionRate: 0,
      repeatCustomerRate: 0,
      aiUsageCount: 0,
      periodComparison: { leads: 0, orders: 0, revenue: 0 },
    };

    const insights = await aiService.generateInsights(metrics);

    return NextResponse.json({ insights, basedOn: metrics, generatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('[Insights API] Error:', error);
    return NextResponse.json({ error: 'Failed to generate insights.' }, { status: 500 });
  }
}

export const GET = withAuth(handler, ['ADMIN', 'MARKETING']);
