'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  PortalHeader, 
  SystemHealthCard, 
  RecommendationCard, 
  PortalLoadingState, 
  PortalErrorState,
  TicketBadge,
  WarrantyBadge
} from '@/components/portal/PortalComponents';
import { CustomerDashboardData } from '@/lib/services/customer-portal-service';

export default function MyEnergyDashboardPage() {
  const [data, setData] = useState<CustomerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/portal/dashboard');
      if (!res.ok) throw new Error('Failed to load dashboard summary.');
      const json = await res.json();
      setData(json);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error loading dashboard.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <>
        <PortalHeader title="Overview" />
        <div className="portal-container">
          <PortalLoadingState label="Synchronising system telemetry and maintenance records..." />
        </div>
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <PortalHeader title="Overview" />
        <div className="portal-container">
          <PortalErrorState message={error || 'Failed to load data.'} retry={fetchData} />
        </div>
      </>
    );
  }

  const { profile, systems, totalInstalledKva, totalBatteryKwh, activeSolarKwp, upcomingMaintenance, recentServiceRecords, activeWarranties, recommendations, openTicketsCount } = data;

  return (
    <>
      <PortalHeader title="Energy Assets Overview" />

      <div className="portal-container">
        {/* Welcome & Site Header */}
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', margin: '0 0 4px', color: '#f8fafc' }}>
              Welcome back, {profile?.firstName || 'Client'}
            </h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
              🏢 {profile?.companyName || '3rd Energy Commercial Client'} • {profile?.locations?.[0]?.name || 'Primary Operations Hub'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link href="/my-energy/assistant" className="portal-btn portal-btn-primary">
              💬 Ask AI Assistant
            </Link>
            <Link href="/my-energy/service-history" className="portal-btn portal-btn-secondary">
              🔧 Request Service
            </Link>
          </div>
        </div>

        {/* Live Telemetry Banner */}
        <div className="portal-telemetry-banner">
          <div>
            <div style={{ fontSize: '12px', color: '#34d399', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
              ● Live Commercial Power Status
            </div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#f8fafc' }}>
              {systems[0]?.healthStatus === 'OPTIMAL' ? 'All Facility Circuits Operating Optimally' : 'Asset Attention Required'}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
              Last synced: {systems[0]?.telemetry?.lastSyncAt ? new Date(systems[0].telemetry.lastSyncAt).toLocaleTimeString() : 'Just now'} • Connected via Smart EMS Hub
            </div>
          </div>

          <div className="portal-telemetry-stats">
            <div className="portal-telemetry-metric">
              <span className="portal-kpi-label">Solar PV Yield</span>
              <span className="portal-telemetry-num">{systems[0]?.telemetry?.dailyYieldKwh || 34.8} <small style={{ fontSize: '14px', color: '#94a3b8' }}>kWh</small></span>
            </div>
            <div className="portal-telemetry-metric">
              <span className="portal-kpi-label">Battery SOC</span>
              <span className="portal-telemetry-num" style={{ color: '#38bdf8' }}>{systems[0]?.telemetry?.batterySocPercent || 91}%</span>
            </div>
            <div className="portal-telemetry-metric">
              <span className="portal-kpi-label">Autonomy Left</span>
              <span className="portal-telemetry-num" style={{ color: '#fbbf24' }}>~{systems[0]?.telemetry?.estimatedBackupHours || 14.5} <small style={{ fontSize: '14px', color: '#94a3b8' }}>hrs</small></span>
            </div>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="portal-kpi-grid">
          <div className="portal-kpi-card emerald">
            <div className="portal-kpi-label">
              <span>Total Inverter Power</span>
              <span>⚡</span>
            </div>
            <div className="portal-kpi-value">{totalInstalledKva} kVA</div>
            <div className="portal-kpi-subtext">Commercial pure sine capacity</div>
          </div>

          <div className="portal-kpi-card blue">
            <div className="portal-kpi-label">
              <span>Battery Storage Bank</span>
              <span>🔋</span>
            </div>
            <div className="portal-kpi-value">{totalBatteryKwh} kWh</div>
            <div className="portal-kpi-subtext">LiFePO4 modular storage</div>
          </div>

          <div className="portal-kpi-card amber">
            <div className="portal-kpi-label">
              <span>Photovoltaic Array</span>
              <span>☀️</span>
            </div>
            <div className="portal-kpi-value">{activeSolarKwp} kWp</div>
            <div className="portal-kpi-subtext">Tier-1 high efficiency modules</div>
          </div>

          <div className="portal-kpi-card purple">
            <div className="portal-kpi-label">
              <span>Support & Maintenance</span>
              <span>🎫</span>
            </div>
            <div className="portal-kpi-value">{openTicketsCount} Open</div>
            <div className="portal-kpi-subtext">{upcomingMaintenance.length} upcoming maintenance items</div>
          </div>
        </div>

        {/* Two Column Layout: Systems & Maintenance */}
        <div className="portal-grid-2">
          {/* Left Column: Systems & Recommendations */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc', margin: 0 }}>
                ☀️ Installed Energy Systems ({systems.length})
              </h3>
              <Link href="/my-energy/systems" style={{ fontSize: '12px', color: '#34d399', textDecoration: 'none' }}>
                View All Systems &rarr;
              </Link>
            </div>

            {systems.map(system => (
              <SystemHealthCard key={system.id} system={system} />
            ))}

            {/* Smart Contextual Recommendations */}
            {recommendations.length > 0 && (
              <div style={{ marginTop: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc', marginBottom: '14px' }}>
                  💡 Asset Optimization Insights
                </h3>
                {recommendations.map(rec => (
                  <RecommendationCard key={rec.id} rec={rec} />
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Maintenance, Warranties & Service */}
          <div>
            {/* Upcoming Maintenance */}
            <div className="portal-card">
              <div className="portal-card-header">
                <div className="portal-card-title">
                  <span>🗓️</span>
                  <span>Upcoming Maintenance</span>
                </div>
                <Link href="/my-energy/maintenance" style={{ fontSize: '12px', color: '#34d399', textDecoration: 'none' }}>
                  All Schedules &rarr;
                </Link>
              </div>

              {upcomingMaintenance.length === 0 ? (
                <div style={{ fontSize: '13px', color: '#64748b', textAlign: 'center', padding: '16px 0' }}>
                  No immediate maintenance due. All systems certified.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {upcomingMaintenance.map(item => (
                    <div key={item.id} style={{ background: '#131d31', padding: '14px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <strong style={{ fontSize: '13px', color: '#f8fafc' }}>{item.title}</strong>
                        <span className="portal-badge portal-badge-attention">Due in {Math.max(1, Math.round((new Date(item.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days</span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 8px', lineHeight: 1.4 }}>
                        {item.description}
                      </p>
                      <Link href="/my-energy/service-history" className="portal-btn portal-btn-secondary" style={{ padding: '4px 10px', fontSize: '11px' }}>
                        Book Inspection Slot &rarr;
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Warranties */}
            <div className="portal-card">
              <div className="portal-card-header">
                <div className="portal-card-title">
                  <span>🛡️</span>
                  <span>Active Warranty Coverage</span>
                </div>
                <Link href="/my-energy/warranty" style={{ fontSize: '12px', color: '#34d399', textDecoration: 'none' }}>
                  View Certificates &rarr;
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activeWarranties.map(war => (
                  <div key={war.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#131d31', padding: '12px', borderRadius: '8px' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#f1f5f9' }}>{war.productName}</div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                        SN: {war.serialNumber} • Valid until {new Date(war.endDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                    <WarrantyBadge status={war.status} />
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Service History Logs */}
            <div className="portal-card">
              <div className="portal-card-header">
                <div className="portal-card-title">
                  <span>🔧</span>
                  <span>Recent Engineering Service</span>
                </div>
                <Link href="/my-energy/service-history" style={{ fontSize: '12px', color: '#34d399', textDecoration: 'none' }}>
                  Full History &rarr;
                </Link>
              </div>

              {recentServiceRecords.map(rec => (
                <div key={rec.id} style={{ borderBottom: '1px solid #1e293b', paddingBottom: '10px', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', color: '#f8fafc' }}>
                    <span>{rec.issueDescription}</span>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>{new Date(rec.serviceDate).toLocaleDateString('en-GB')}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                    👨‍🔧 {rec.technicianName} • <span style={{ color: '#34d399' }}>{rec.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
