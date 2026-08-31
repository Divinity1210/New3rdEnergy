'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  PortalHeader, 
  PortalLoadingState, 
  PortalErrorState 
} from '@/components/portal/PortalComponents';
import { InstallationProject } from '@/lib/types';

export default function MyInstallationsPage() {
  const [installations, setInstallations] = useState<InstallationProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/portal/dashboard');
        if (!res.ok) throw new Error('Failed to load installations.');
        const data = await res.json();
        setInstallations(data.activeInstallations || []);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Error loading installations.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <>
      <PortalHeader title="Turnkey Installations" />

      <div className="portal-container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc', margin: '0 0 4px' }}>
              Field Engineering & Commissioning Projects
            </h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
              Track site readiness audits, assigned lead engineers, and phase commissioning milestones.
            </p>
          </div>
          <Link href="/power/installation" className="portal-btn portal-btn-primary">
            + Request Site Installation
          </Link>
        </div>

        {loading ? (
          <PortalLoadingState label="Loading installation projects..." />
        ) : error ? (
          <PortalErrorState message={error} />
        ) : installations.length === 0 ? (
          <div className="portal-card" style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🏗️</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc' }}>No Active Installation Projects</div>
            <p style={{ fontSize: '13px', color: '#64748b' }}>You can request certified turnkey engineering installation for any system setup.</p>
            <Link href="/power/installation" className="portal-btn portal-btn-primary" style={{ marginTop: '12px' }}>
              Book Site Audit & Installation
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {installations.map(inst => (
              <div key={inst.id} className="portal-card" style={{ margin: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f8fafc', margin: '0 0 4px' }}>
                      {inst.systemSizeKva}kVA Solar & Battery Installation
                    </h3>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                      📍 {inst.location?.address || 'Site location on file'}
                    </div>
                  </div>
                  <span className="portal-badge portal-badge-optimal">● {inst.status}</span>
                </div>

                <div style={{ background: '#131d31', padding: '12px', borderRadius: '8px', fontSize: '12px', color: '#94a3b8' }}>
                  <div>Preferred Date: <strong style={{ color: '#f8fafc' }}>{inst.preferredDate || 'Scheduled'}</strong></div>
                  <div style={{ marginTop: '4px' }}>Roof Type: {inst.roofType || 'Standard'} • Electrical Phase: {inst.electricalPhase || 'Three-Phase'}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
