'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  PortalHeader, 
  PortalLoadingState, 
  PortalErrorState,
  WarrantyBadge 
} from '@/components/portal/PortalComponents';
import { WarrantyRecord } from '@/lib/types';

export default function WarrantyHubPage() {
  const [warranties, setWarranties] = useState<WarrantyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/portal/warranty');
        if (!res.ok) throw new Error('Failed to load warranties.');
        const data = await res.json();
        setWarranties(data.warranties || []);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Error loading warranties.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <>
      <PortalHeader title="Equipment Warranty Hub" />

      <div className="portal-container">
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc', margin: '0 0 4px' }}>
            Active Manufacturer & Workmanship Warranty Certificates
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
            Every 3rd Energy system component is backed by tier-1 manufacturer performance guarantees and verified serial tracking.
          </p>
        </div>

        {loading ? (
          <PortalLoadingState label="Loading warranty certificates..." />
        ) : error ? (
          <PortalErrorState message={error} />
        ) : warranties.length === 0 ? (
          <div className="portal-card" style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🛡️</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc' }}>No Warranty Certificates Found</div>
            <p style={{ fontSize: '13px', color: '#64748b' }}>Warranties are registered automatically upon turnkey project commissioning.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {warranties.map(war => (
              <div key={war.id} className="portal-card" style={{ margin: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc', margin: '0 0 4px' }}>
                      {war.productName}
                    </h3>
                    <div style={{ fontSize: '12px', color: '#38bdf8', fontFamily: 'monospace' }}>
                      SN: {war.serialNumber}
                    </div>
                  </div>
                  <WarrantyBadge status={war.status} />
                </div>

                <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5, margin: '0 0 14px' }}>
                  {war.termsSummary}
                </p>

                <div className="portal-grid-3" style={{ background: '#131d31', padding: '12px', borderRadius: '8px', marginBottom: '14px', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Coverage Period:</span>
                    <div style={{ fontWeight: '700', color: '#f8fafc', marginTop: '2px' }}>{war.warrantyPeriodMonths / 12} Years ({war.warrantyPeriodMonths} Mo)</div>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Start Date:</span>
                    <div style={{ fontWeight: '700', color: '#f8fafc', marginTop: '2px' }}>{new Date(war.startDate).toLocaleDateString('en-GB')}</div>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Valid Until:</span>
                    <div style={{ fontWeight: '700', color: '#34d399', marginTop: '2px' }}>{new Date(war.endDate).toLocaleDateString('en-GB')}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', borderTop: '1px solid #1e293b', paddingTop: '12px' }}>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    📋 <strong>Claim Protocol:</strong> {war.claimProcedure}
                  </div>
                  <Link href="/my-energy/support" className="portal-btn portal-btn-secondary" style={{ padding: '4px 10px', fontSize: '11px' }}>
                    Open Warranty Claim &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
