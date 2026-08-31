'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { 
  PortalHeader, 
  PortalLoadingState, 
  PortalErrorState,
  WarrantyBadge,
  DocumentCard
} from '@/components/portal/PortalComponents';
import { 
  CustomerSystem, 
  ServiceRecord, 
  WarrantyRecord, 
  MaintenanceReminder, 
  DocumentRecord 
} from '@/lib/types';

export default function SystemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const systemId = resolvedParams.id;

  const [system, setSystem] = useState<CustomerSystem | null>(null);
  const [serviceHistory, setServiceHistory] = useState<ServiceRecord[]>([]);
  const [warranties, setWarranties] = useState<WarrantyRecord[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceReminder[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDetail = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/portal/systems/${systemId}`);
      if (!res.ok) throw new Error('Failed to load system details.');
      const data = await res.json();
      setSystem(data.system);
      setServiceHistory(data.serviceHistory || []);
      setWarranties(data.warranties || []);
      setMaintenance(data.maintenance || []);
      setDocuments(data.documents || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error loading system.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [systemId]);

  if (loading) {
    return (
      <>
        <PortalHeader title="System Technical Specifications" />
        <div className="portal-container">
          <PortalLoadingState label="Retrieving system serial numbers and telemetry specs..." />
        </div>
      </>
    );
  }

  if (error || !system) {
    return (
      <>
        <PortalHeader title="System Technical Specifications" />
        <div className="portal-container">
          <PortalErrorState message={error || 'System not found.'} retry={fetchDetail} />
          <Link href="/my-energy/systems" className="portal-btn portal-btn-secondary" style={{ marginTop: '12px' }}>
            &larr; Back to Systems
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PortalHeader title={system.name} />

      <div className="portal-container">
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '16px' }}>
          <Link href="/my-energy/systems" style={{ fontSize: '12px', color: '#64748b', textDecoration: 'none' }}>
            &larr; Back to Systems
          </Link>
        </div>

        {/* Hero Specs Header */}
        <div className="portal-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 4px', color: '#f8fafc' }}>
                {system.name}
              </h2>
              <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                📍 {system.locationName} • Commissioned on {new Date(system.installationDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link href={`/my-energy/assistant`} className="portal-btn portal-btn-primary" style={{ fontSize: '12px' }}>
                🤖 Troubleshoot with AI
              </Link>
              <Link href={`/my-energy/service-history`} className="portal-btn portal-btn-secondary" style={{ fontSize: '12px' }}>
                🔧 Book Inspection
              </Link>
            </div>
          </div>

          <div className="portal-grid-3">
            <div style={{ background: '#131d31', padding: '14px', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>Inverter Configuration</div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#38bdf8' }}>{system.totalCapacityKva} kVA</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>48V Pure Sine Commercial</div>
            </div>
            <div style={{ background: '#131d31', padding: '14px', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>Battery Bank Rating</div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#34d399' }}>{system.batteryCapacityKwh} kWh</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>LiFePO4 Modular Rack</div>
            </div>
            <div style={{ background: '#131d31', padding: '14px', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>Photovoltaic Field</div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#fbbf24' }}>{system.solarCapacityKwp || 0} kWp</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Tier-1 Monocrystalline</div>
            </div>
          </div>
        </div>

        {/* Components & Serial Numbers Breakdown */}
        <div className="portal-card">
          <div className="portal-card-header">
            <div className="portal-card-title">
              <span>🔩</span>
              <span>Registered System Hardware & Serial Numbers</span>
            </div>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              {system.components.length} OEM Certified Modules
            </span>
          </div>

          <div className="portal-grid-2">
            {system.components.map(comp => (
              <div key={comp.id} className="portal-component-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div className="portal-component-title">{comp.name}</div>
                  <span className="portal-badge portal-badge-optimal">● {comp.status}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                  <span className="portal-component-serial">SN: {comp.serialNumber}</span>
                  <span style={{ fontSize: '11px', color: '#94a3b8', background: '#1e293b', padding: '2px 6px', borderRadius: '4px' }}>
                    Model: {comp.modelNumber}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                  ⚙️ {comp.capacity} • Manufacturer: {comp.manufacturer} • Warranty to {new Date(comp.warrantyExpiry).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Two Column: Service History & Maintenance */}
        <div className="portal-grid-2">
          {/* Service Logs */}
          <div className="portal-card">
            <div className="portal-card-header">
              <div className="portal-card-title">
                <span>🔧</span>
                <span>Engineering Service Logs</span>
              </div>
            </div>

            {serviceHistory.length === 0 ? (
              <div style={{ fontSize: '13px', color: '#64748b', textAlign: 'center', padding: '16px 0' }}>
                No past service tickets for this system.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {serviceHistory.map(rec => (
                  <div key={rec.id} style={{ background: '#131d31', padding: '14px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700', color: '#f8fafc', marginBottom: '4px' }}>
                      <span>{rec.issueDescription}</span>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>{new Date(rec.serviceDate).toLocaleDateString('en-GB')}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 8px', lineHeight: 1.4 }}>
                      {rec.workPerformed}
                    </p>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                      👨‍🔧 Lead: {rec.technicianName} ({rec.department})
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Warranties & System Documents */}
          <div>
            <div className="portal-card">
              <div className="portal-card-header">
                <div className="portal-card-title">
                  <span>🛡️</span>
                  <span>Active Warranty Coverage</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {warranties.map(war => (
                  <div key={war.id} style={{ background: '#131d31', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#f1f5f9' }}>{war.productName}</div>
                      <WarrantyBadge status={war.status} />
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                      {war.termsSummary}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="portal-card">
              <div className="portal-card-header">
                <div className="portal-card-title">
                  <span>📁</span>
                  <span>System Schematics & Manuals</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {documents.map(doc => (
                  <DocumentCard key={doc.id} doc={doc} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
