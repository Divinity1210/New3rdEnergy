'use client';

import React, { useState, useEffect } from 'react';
import { DashboardCard, AIInsightCard, LoadingState, EmptyState, StageBadge } from '@/components/admin/AdminComponents';
import { formatCurrency } from '@/lib/utils';

interface DashboardData {
  metrics: {
    totalLeads: number;
    qualifiedLeads: number;
    quotesSent: number;
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    quoteConversionRate: number;
    repeatCustomerRate: number;
    aiUsageCount: number;
    periodComparison: { leads: number; orders: number; revenue: number };
  };
  funnel: { stage: string; count: number; percentage: number }[];
  channels: { channel: string; leads: number; conversions: number; revenue: number; conversionRate: number }[];
}

interface Insight {
  type: string;
  title: string;
  description: string;
  confidence: number;
  sources: string[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const [dashRes, insightsRes] = await Promise.all([
        fetch('/api/admin/dashboard'),
        fetch('/api/admin/insights'),
      ]);

      if (dashRes.ok) {
        setData(await dashRes.json());
      }
      if (insightsRes.ok) {
        const insData = await insightsRes.json();
        setInsights(insData.insights || []);
      }
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingState message="Loading executive dashboard..." />;

  if (!data) return <EmptyState icon="📊" title="No Data Available" description="Dashboard metrics will appear as leads and orders come in." />;

  const m = data.metrics;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Executive Dashboard</h1>
        <p className="admin-page-subtitle">Real-time business intelligence for 3rd Energy</p>
      </div>

      {/* KPI Cards */}
      <div className="admin-kpi-grid">
        <DashboardCard title="Total Leads" value={m.totalLeads} change={m.periodComparison.leads} icon="🎯" color="#3b82f6" />
        <DashboardCard title="Qualified Leads" value={m.qualifiedLeads} icon="✅" color="#8b5cf6" />
        <DashboardCard title="Quotes Sent" value={m.quotesSent} icon="📋" color="#f59e0b" />
        <DashboardCard title="Total Orders" value={m.totalOrders} change={m.periodComparison.orders} icon="🛒" color="#10b981" />
        <DashboardCard title="Revenue" value={formatCurrency(m.totalRevenue)} change={m.periodComparison.revenue} icon="💰" color="#059669" />
        <DashboardCard title="Avg Order Value" value={formatCurrency(m.averageOrderValue)} icon="📈" color="#f97316" />
        <DashboardCard title="Quote Conversion" value={`${m.quoteConversionRate.toFixed(1)}%`} icon="🔄" color="#ef4444" />
        <DashboardCard title="AI Usage" value={m.aiUsageCount} icon="🧠" color="#6366f1" />
      </div>

      {/* Conversion Funnel */}
      <div className="admin-section">
        <h2 className="admin-section-title">Conversion Funnel</h2>
        <div className="admin-funnel">
          {data.funnel.map((step, i) => (
            <div key={step.stage} className="admin-funnel-step">
              <div className="admin-funnel-bar" style={{ width: `${Math.max(step.percentage, 8)}%` }}>
                <span className="admin-funnel-label">{step.stage}</span>
                <span className="admin-funnel-count">{step.count}</span>
              </div>
              {i < data.funnel.length - 1 && (
                <span className="admin-funnel-arrow">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Two Column: Channels + Insights */}
      <div className="admin-two-col">
        {/* Channel Attribution */}
        <div className="admin-section">
          <h2 className="admin-section-title">Channel Attribution</h2>
          {data.channels.length > 0 ? (
            <div className="admin-channels-list">
              {data.channels.map(ch => (
                <div key={ch.channel} className="admin-channel-row">
                  <StageBadge stage={ch.channel.toUpperCase()} />
                  <span className="admin-channel-count">{ch.leads} leads</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon="📡" title="No Attribution Data" description="Channel data will appear as leads are captured with UTM parameters." />
          )}
        </div>

        {/* AI Insights */}
        <div className="admin-section">
          <h2 className="admin-section-title">🧠 AI Insights</h2>
          {insights.length > 0 ? (
            <div className="admin-insights-list">
              {insights.map((insight, i) => (
                <AIInsightCard key={i} insight={insight} />
              ))}
            </div>
          ) : (
            <EmptyState icon="🧠" title="Generating Insights" description="AI insights are generated based on real data patterns. They will appear as more leads and orders accumulate." />
          )}
        </div>
      </div>
    </div>
  );
}
