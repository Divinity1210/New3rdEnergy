/**
 * GET /api/admin/dashboard — Executive metrics
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, getClientIP, getUserAgent } from '@/lib/middleware/auth-middleware';
import { logAction } from '@/lib/services/audit-service';
import { Store, StoreEntity } from '@/lib/services/store-service';
import { DashboardMetrics, ConversionFunnel, ChannelAttribution, Session } from '@/lib/types';

const leadsStore = new Store<StoreEntity & Record<string, unknown>>('leads');
const ordersStore = new Store<StoreEntity & Record<string, unknown>>('orders');

async function handler(request: NextRequest, { session }: { session: Session }) {
  try {
    await logAction({
      session,
      action: 'VIEW',
      resource: 'dashboard',
      details: 'Viewed executive dashboard',
      ipAddress: getClientIP(request),
      userAgent: getUserAgent(request),
    });

    const leads = await leadsStore.list();
    const orders = await ordersStore.list();

    // Calculate metrics from real data
    const totalLeads = leads.length;
    const qualifiedLeads = leads.filter(l => {
      const status = (l as Record<string, unknown>).status as string;
      return status !== 'NEW' && status !== 'CLOSED';
    }).length;

    const quotesSent = leads.filter(l => {
      const status = (l as Record<string, unknown>).status as string;
      return status === 'QUOTE_SENT' || status === 'NEGOTIATION' || status === 'WON';
    }).length;

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => {
      const total = (o as Record<string, unknown>).total as number;
      return sum + (total || 0);
    }, 0);

    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const wonLeads = leads.filter(l => (l as Record<string, unknown>).status === 'WON').length;
    const quoteConversionRate = quotesSent > 0 ? (wonLeads / quotesSent) * 100 : 0;

    // Channel attribution from stored UTM data
    const channelCounts: Record<string, number> = {};
    for (const lead of leads) {
      const source = ((lead as Record<string, unknown>).source as string) || 'direct';
      channelCounts[source] = (channelCounts[source] || 0) + 1;
    }

    const channels: ChannelAttribution[] = Object.entries(channelCounts).map(([channel, count]) => ({
      channel: channel as ChannelAttribution['channel'],
      leads: count,
      conversions: 0,
      revenue: 0,
      conversionRate: 0,
    }));

    // Conversion funnel
    const funnel: ConversionFunnel[] = [
      { stage: 'Leads', count: totalLeads, percentage: 100 },
      { stage: 'Qualified', count: qualifiedLeads, percentage: totalLeads > 0 ? (qualifiedLeads / totalLeads) * 100 : 0 },
      { stage: 'Quotes Sent', count: quotesSent, percentage: totalLeads > 0 ? (quotesSent / totalLeads) * 100 : 0 },
      { stage: 'Orders', count: totalOrders, percentage: totalLeads > 0 ? (totalOrders / totalLeads) * 100 : 0 },
    ];

    const metrics: DashboardMetrics = {
      totalLeads,
      qualifiedLeads,
      quotesSent,
      totalOrders,
      totalRevenue,
      averageOrderValue,
      quoteConversionRate,
      repeatCustomerRate: 0,
      aiUsageCount: 0,
      periodComparison: { leads: 0, orders: 0, revenue: 0 },
    };

    return NextResponse.json({
      metrics,
      funnel,
      channels,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Dashboard API] Error:', error);
    return NextResponse.json({ error: 'Failed to load dashboard metrics.' }, { status: 500 });
  }
}

export const GET = withAuth(handler, ['ADMIN', 'MARKETING', 'SALES', 'FINANCE']);
