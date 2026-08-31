'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardCard, AIInsightCard, LoadingState, EmptyState, StageBadge } from '@/components/admin/AdminComponents';
import { formatCurrency, getWhatsAppUrl } from '@/lib/utils';
import { Icon } from '@/components/ui/Icon';

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

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [recentOpps, setRecentOpps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      const [dashRes, pipeRes] = await Promise.all([
        fetch('/api/admin/dashboard'),
        fetch('/api/admin/pipeline?division=all'),
      ]);

      if (dashRes.ok) {
        setData(await dashRes.json());
      }
      if (pipeRes.ok) {
        const pipeData = await pipeRes.json();
        setRecentOpps(pipeData.opportunities || []);
      }
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingState message="Initialising Executive Dashboard..." />;

  const totalDeals = recentOpps.length;
  const petroleumDeals = recentOpps.filter((o) => o.division === 'petroleum');
  const powerDeals = recentOpps.filter((o) => o.division === 'power');
  const totalPipelineValue = recentOpps.reduce((sum, o) => sum + (o.estimatedValue || 0), 0);
  const wonDeals = recentOpps.filter((o) => o.stage === 'WON');
  const wonRevenue = wonDeals.reduce((sum, o) => sum + (o.estimatedValue || 0), 0);

  return (
    <div className="admin-page">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Executive Operations Command</h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live Operations
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time telemetry, bulk fuel dispatch allocations, and solar installation pipeline for 3RD Energy.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/pipeline"
            className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-neutral-700"
          >
            <Icon name="layers" size={13} />
            View Pipeline Board
          </Link>
          <Link
            href="/solutions/petroleum/order"
            target="_blank"
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md shadow-red-600/20 flex items-center gap-1.5"
          >
            <Icon name="fuel" size={13} />
            + New Bulk Order
          </Link>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#0f0f0f] border border-neutral-800 border-t-2 border-t-red-500 p-5 rounded-xl">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-mono font-bold uppercase">🛢️ 3RD Petroleum Pipeline</span>
            <span className="text-xs font-mono">{petroleumDeals.length} Deals</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {formatCurrency(petroleumDeals.reduce((s, o) => s + (o.estimatedValue || 0), 0))}
          </div>
          <p className="text-[11px] text-red-400 mt-1 font-mono">Bulk AGO, PMS, LPG & Storage</p>
        </div>

        <div className="bg-[#0f0f0f] border border-neutral-800 border-t-2 border-t-emerald-500 p-5 rounded-xl">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-mono font-bold uppercase">☀️ 3RD Solar Pipeline</span>
            <span className="text-xs font-mono">{powerDeals.length} Deals</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {formatCurrency(powerDeals.reduce((s, o) => s + (o.estimatedValue || 0), 0))}
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 font-mono">Hybrid Inverters, PV & Storage</p>
        </div>

        <div className="bg-[#0f0f0f] border border-neutral-800 border-t-2 border-t-blue-500 p-5 rounded-xl">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-mono font-bold uppercase">Total Pipeline Volume</span>
            <span className="text-xs font-mono">{totalDeals} Opportunities</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {formatCurrency(totalPipelineValue)}
          </div>
          <p className="text-[11px] text-neutral-400 mt-1 font-mono">Active Group Opportunities</p>
        </div>

        <div className="bg-[#0f0f0f] border border-neutral-800 border-t-2 border-t-emerald-400 p-5 rounded-xl">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-mono font-bold uppercase">Won / Dispatched</span>
            <span className="text-xs font-mono">{wonDeals.length} Closed</span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {formatCurrency(wonRevenue)}
          </div>
          <p className="text-[11px] text-emerald-500 mt-1 font-mono">Payment Confirmed Deals</p>
        </div>
      </div>

      {/* Main Grid: Live Feed + Conversion Funnel */}
      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-start mb-8">
        {/* Recent Inbound Activity Feed */}
        <div className="bg-[#0f0f0f] border border-neutral-800 rounded-xl p-6">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-4">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Inbound Order & Quote Stream
            </h2>
            <Link href="/admin/pipeline" className="text-xs text-neutral-400 hover:text-white font-mono">
              View Kanban →
            </Link>
          </div>

          <div className="space-y-3">
            {recentOpps.slice(0, 5).map((opp) => {
              const isPet = opp.division === 'petroleum';

              return (
                <div
                  key={opp.id}
                  className="p-4 bg-[#141414] border border-neutral-800/80 rounded-xl flex items-center justify-between gap-4 hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${
                        isPet ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      <Icon name={isPet ? 'fuel' : 'sun'} size={16} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{opp.company}</span>
                        <span
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            isPet ? 'bg-red-950/60 text-red-400' : 'bg-emerald-950/60 text-emerald-400'
                          }`}
                        >
                          {isPet ? 'PETROLEUM' : 'SOLAR'}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {opp.productName} • <strong className="text-neutral-300">{opp.volumeDisplay}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 font-mono">
                    <span className="text-xs font-bold text-white block">
                      {formatCurrency(opp.estimatedValue)}
                    </span>
                    <span className="text-[10px] text-neutral-500">
                      {opp.stage.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Launch & System Status */}
        <div className="space-y-4">
          <div className="bg-[#0f0f0f] border border-neutral-800 rounded-xl p-6 space-y-4">
            <h3 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
              Quick Operations Launchpad
            </h3>

            <div className="grid grid-cols-1 gap-2.5">
              <Link
                href="/solutions/petroleum/order"
                target="_blank"
                className="p-3 bg-[#141414] hover:bg-neutral-800/80 border border-neutral-800 rounded-lg flex items-center justify-between text-xs font-semibold text-white transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Icon name="fuel" size={14} className="text-red-400" />
                  Commercial Fuel Order Wizard
                </span>
                <span className="text-neutral-500 font-mono">Portal ↗</span>
              </Link>

              <Link
                href="/solutions/petroleum/calculator"
                target="_blank"
                className="p-3 bg-[#141414] hover:bg-neutral-800/80 border border-neutral-800 rounded-lg flex items-center justify-between text-xs font-semibold text-white transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Icon name="calculator" size={14} className="text-amber-400" />
                  Fuel & Tanker Sizing Calculator
                </span>
                <span className="text-neutral-500 font-mono">Tool ↗</span>
              </Link>

              <Link
                href="/power/calculator"
                target="_blank"
                className="p-3 bg-[#141414] hover:bg-neutral-800/80 border border-neutral-800 rounded-lg flex items-center justify-between text-xs font-semibold text-white transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Icon name="sun" size={14} className="text-emerald-400" />
                  Solar Load Sizing Assessment
                </span>
                <span className="text-neutral-500 font-mono">Tool ↗</span>
              </Link>
            </div>
          </div>

          <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-5 text-xs text-neutral-400 space-y-2">
            <span className="text-red-400 font-mono font-bold block uppercase">24/7 Logistics Dispatch Status</span>
            <p>
              Depot loading gates in <strong>Apapa/Ibafon</strong> and <strong>Port Harcourt</strong> operating unrestricted. 50+ articulated tankers on active telemetry.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
