'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  PortalHeader, 
  PortalLoadingState, 
  PortalErrorState 
} from '@/components/portal/PortalComponents';
import { MaintenanceReminder } from '@/lib/types';

export default function MaintenancePage() {
  const [reminders, setReminders] = useState<MaintenanceReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/portal/maintenance');
        if (!res.ok) throw new Error('Failed to load maintenance schedules.');
        const data = await res.json();
        setReminders(data.reminders || []);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Error loading maintenance.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <>
      <PortalHeader title="Maintenance & Asset Schedules" />

      <div className="portal-container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc', margin: '0 0 4px' }}>
              Preventive Maintenance & Warranty Milestones
            </h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
              Timely asset servicing preserves 6,000+ battery cycles, maintains 25-year panel yield, and sustains warranty validity.
            </p>
          </div>
          <Link href="/my-energy/service-history" className="portal-btn portal-btn-primary">
            + Schedule Field Inspection
          </Link>
        </div>

        {loading ? (
          <PortalLoadingState label="Loading maintenance schedules..." />
        ) : error ? (
          <PortalErrorState message={error} />
        ) : reminders.length === 0 ? (
          <div className="portal-card" style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🗓️</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc' }}>No Pending Maintenance Items</div>
            <p style={{ fontSize: '13px', color: '#64748b' }}>All registered facilities are in compliance with 3rd Energy standard asset intervals.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {reminders.map(item => {
              const daysLeft = Math.round((new Date(item.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              const isOverdue = daysLeft < 0;

              return (
                <div key={item.id} className="portal-card" style={{ margin: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#10b981', fontWeight: '700', textTransform: 'uppercase' }}>
                        {item.systemName}
                      </span>
                      <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc', margin: '2px 0 0' }}>
                        {item.title}
                      </h3>
                    </div>
                    <span className={`portal-badge ${isOverdue ? 'portal-badge-fault' : 'portal-badge-attention'}`}>
                      {isOverdue ? `Overdue by ${Math.abs(daysLeft)} days` : `Due in ${daysLeft} days`}
                    </span>
                  </div>

                  <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5, margin: '0 0 12px' }}>
                    {item.description}
                  </p>

                  <div style={{ background: '#131d31', padding: '12px', borderRadius: '8px', marginBottom: '14px', fontSize: '12px', color: '#94a3b8' }}>
                    💡 <strong>Recommended 3rd Energy Protocol:</strong> {item.recommendedAction}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                      Target Date: {new Date(item.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <Link href="/my-energy/service-history" className="portal-btn portal-btn-primary" style={{ padding: '6px 14px', fontSize: '12px' }}>
                      Book Service Slot &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
