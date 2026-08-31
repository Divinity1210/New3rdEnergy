'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  PortalHeader, 
  PortalLoadingState, 
  PortalErrorState 
} from '@/components/portal/PortalComponents';
import { CustomerSystem } from '@/lib/types';

export default function MyProductsPage() {
  const [systems, setSystems] = useState<CustomerSystem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/portal/systems');
        if (!res.ok) throw new Error('Failed to load products.');
        const data = await res.json();
        setSystems(data.systems || []);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Error loading products.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const allComponents = systems.flatMap(s => s.components.map(c => ({ ...c, systemName: s.name, systemId: s.id })));

  return (
    <>
      <PortalHeader title="My Power Products" />

      <div className="portal-container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc', margin: '0 0 4px' }}>
              Purchased & Registered Hardware Inventory
            </h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
              Track warranty coverage, model specifications, and maintenance cycles for all equipment units.
            </p>
          </div>
          <Link href="/power/products" className="portal-btn portal-btn-primary">
            + Purchase Additional Products
          </Link>
        </div>

        {loading ? (
          <PortalLoadingState label="Loading product inventory..." />
        ) : error ? (
          <PortalErrorState message={error} />
        ) : allComponents.length === 0 ? (
          <div className="portal-card" style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📦</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc' }}>No Hardware Registered</div>
            <p style={{ fontSize: '13px', color: '#64748b' }}>Your registered products will appear here once an installation or order is confirmed.</p>
            <Link href="/power/products" className="portal-btn portal-btn-primary" style={{ marginTop: '12px' }}>
              Browse 3rd Energy Catalog
            </Link>
          </div>
        ) : (
          <div className="portal-grid-2">
            {allComponents.map(comp => (
              <div key={comp.id} className="portal-card" style={{ margin: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#10b981', fontWeight: '700', textTransform: 'uppercase' }}>
                      {comp.type.replace(/_/g, ' ')}
                    </span>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f8fafc', margin: '2px 0 0' }}>
                      {comp.name}
                    </h3>
                  </div>
                  <span className="portal-badge portal-badge-optimal">● {comp.status}</span>
                </div>

                <div style={{ background: '#131d31', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ color: '#94a3b8' }}>Serial Number:</span>
                    <strong style={{ color: '#38bdf8', fontFamily: 'monospace' }}>{comp.serialNumber}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ color: '#94a3b8' }}>Model Number:</span>
                    <span style={{ color: '#f8fafc' }}>{comp.modelNumber}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: '#94a3b8' }}>Capacity / Rating:</span>
                    <span style={{ color: '#fbbf24' }}>{comp.capacity}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748b' }}>
                  <span>Installed in: <strong>{comp.systemName}</strong></span>
                  <Link href={`/my-energy/systems/${comp.systemId}`} className="portal-btn portal-btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }}>
                    View System &rarr;
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
