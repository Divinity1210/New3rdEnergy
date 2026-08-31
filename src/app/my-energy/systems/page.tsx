'use client';

import React, { useEffect, useState } from 'react';
import { 
  PortalHeader, 
  SystemHealthCard, 
  PortalLoadingState, 
  PortalErrorState, 
  PortalEmptyState 
} from '@/components/portal/PortalComponents';
import { CustomerSystem } from '@/lib/types';

export default function MySystemsPage() {
  const [systems, setSystems] = useState<CustomerSystem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSystems = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/portal/systems');
      if (!res.ok) throw new Error('Failed to load systems.');
      const data = await res.json();
      setSystems(data.systems || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error loading systems.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystems();
  }, []);

  return (
    <>
      <PortalHeader title="Installed Energy Systems" />

      <div className="portal-container">
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc', margin: '0 0 4px' }}>
            Multi-Site Energy System Assets
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
            Inspect technical profiles, component serial numbers, battery health, and real-time generation metrics.
          </p>
        </div>

        {loading ? (
          <PortalLoadingState label="Loading installed energy systems..." />
        ) : error ? (
          <PortalErrorState message={error} retry={fetchSystems} />
        ) : systems.length === 0 ? (
          <PortalEmptyState 
            icon="☀️"
            title="No Installed Systems Registered"
            description="You don't have any registered energy systems yet. If you recently completed an installation, contact support."
            actionLabel="Request System Installation"
            actionHref="/power/installation"
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {systems.map(system => (
              <SystemHealthCard key={system.id} system={system} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
