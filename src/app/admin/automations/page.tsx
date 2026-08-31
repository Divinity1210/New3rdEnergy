'use client';

import React, { useState, useEffect } from 'react';
import { LoadingState, EmptyState } from '@/components/admin/AdminComponents';

export default function AdminAutomationsPage() {
  const [data, setData] = useState<{ pending: unknown[]; all: unknown[]; rules: unknown[]; stats: { total: number; pending: number; approved: number; dismissed: number } } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAutomations(); }, []);

  async function loadAutomations() {
    try {
      const res = await fetch('/api/admin/automations');
      if (res.ok) setData(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function handleDecision(actionId: string, decision: 'approve' | 'dismiss') {
    try {
      const res = await fetch('/api/admin/automations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionId, decision }),
      });
      if (res.ok) loadAutomations();
    } catch (err) { console.error(err); }
  }

  if (loading) return <LoadingState message="Loading automations..." />;
  if (!data) return <EmptyState icon="⚡" title="Automations" description="Automation rules will generate follow-up actions for leads and orders." />;

  const pending = data.pending as Record<string, unknown>[];

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Automations</h1>
        <p className="admin-page-subtitle">{data.stats.pending} pending review • {data.stats.approved} approved • {data.stats.dismissed} dismissed</p>
      </div>

      {/* Stats */}
      <div className="admin-kpi-grid admin-kpi-grid-4">
        <div className="admin-kpi-card"><div className="admin-kpi-value">{data.stats.total}</div><div className="admin-kpi-title">Total Actions</div></div>
        <div className="admin-kpi-card" style={{ borderTopColor: '#f59e0b' }}><div className="admin-kpi-value">{data.stats.pending}</div><div className="admin-kpi-title">Pending Review</div></div>
        <div className="admin-kpi-card" style={{ borderTopColor: '#10b981' }}><div className="admin-kpi-value">{data.stats.approved}</div><div className="admin-kpi-title">Approved</div></div>
        <div className="admin-kpi-card" style={{ borderTopColor: '#6b7280' }}><div className="admin-kpi-value">{data.stats.dismissed}</div><div className="admin-kpi-title">Dismissed</div></div>
      </div>

      {/* Pending Actions */}
      <div className="admin-section">
        <h2 className="admin-section-title">⚡ Pending Actions</h2>
        {pending.length === 0 ? (
          <EmptyState icon="✅" title="All Clear" description="No pending automation actions. New actions will appear as leads and orders progress." />
        ) : (
          <div className="admin-automation-list">
            {pending.map((action) => (
              <div key={action.id as string} className="admin-automation-card">
                <div className="admin-automation-header">
                  <span className="admin-automation-trigger">{action.trigger as string}</span>
                  <span className="admin-automation-scheduled">Scheduled: {new Date(action.scheduledFor as string).toLocaleString()}</span>
                </div>
                <div className="admin-automation-body">
                  <p><strong>To:</strong> {action.contactName as string} ({action.contactEmail as string})</p>
                  <p><strong>Subject:</strong> {action.subject as string}</p>
                  <pre className="admin-automation-draft">{action.draftContent as string}</pre>
                </div>
                <div className="admin-automation-actions">
                  <button onClick={() => handleDecision(action.id as string, 'approve')} className="admin-btn-approve">✅ Approve & Send</button>
                  <button onClick={() => handleDecision(action.id as string, 'dismiss')} className="admin-btn-dismiss">❌ Dismiss</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Rules */}
      <div className="admin-section">
        <h2 className="admin-section-title">📋 Automation Rules</h2>
        <div className="admin-rules-list">
          {(data.rules as Record<string, unknown>[]).map(rule => (
            <div key={rule.id as string} className="admin-rule-card">
              <div className="admin-rule-header">
                <span className="admin-rule-name">{rule.name as string}</span>
                <span className={`admin-rule-status ${(rule.enabled as boolean) ? 'admin-rule-active' : 'admin-rule-inactive'}`}>
                  {(rule.enabled as boolean) ? 'Active' : 'Disabled'}
                </span>
              </div>
              <p className="admin-rule-desc">{rule.description as string}</p>
              <p className="admin-rule-meta">Delay: {rule.delayHours as number}h • Channel: {rule.channel as string}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
