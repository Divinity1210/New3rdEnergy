'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  PortalHeader, 
  PortalLoadingState, 
  PortalErrorState 
} from '@/components/portal/PortalComponents';
import { Order } from '@/lib/types';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/portal/dashboard');
        if (!res.ok) throw new Error('Failed to load orders.');
        const data = await res.json();
        setOrders(data.recentOrders || []);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Error loading orders.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <>
      <PortalHeader title="Order History & Invoices" />

      <div className="portal-container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc', margin: '0 0 4px' }}>
              Equipment & Fuel Procurement Orders
            </h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
              Track delivery logistics, invoice statuses, and dispatch confirmations.
            </p>
          </div>
          <Link href="/power/products" className="portal-btn portal-btn-primary">
            + Place New Order
          </Link>
        </div>

        {loading ? (
          <PortalLoadingState label="Loading customer orders..." />
        ) : error ? (
          <PortalErrorState message={error} />
        ) : orders.length === 0 ? (
          <div className="portal-card" style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🛒</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc' }}>No Orders on Record</div>
            <p style={{ fontSize: '13px', color: '#64748b' }}>Your procurement orders and invoices will appear here once submitted.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '16px' }}>
              <Link href="/power/products" className="portal-btn portal-btn-primary">
                Shop Solar & Power Products
              </Link>
              <Link href="/quote" className="portal-btn portal-btn-secondary">
                Request Bulk Fuel Quote
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map(order => (
              <div key={order.id} className="portal-card" style={{ margin: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Order Reference:</span>
                    <strong style={{ fontSize: '14px', color: '#38bdf8', marginLeft: '6px', fontFamily: 'monospace' }}>{order.orderNumber}</strong>
                  </div>
                  <span className="portal-badge portal-badge-optimal">● {order.status}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#94a3b8', borderTop: '1px solid #1e293b', paddingTop: '12px' }}>
                  <span>Total Amount: <strong style={{ color: '#f8fafc' }}>₦{order.pricing?.total?.toLocaleString() || '0'}</strong></span>
                  <span>Placed on: {new Date(order.createdAt).toLocaleDateString('en-GB')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
