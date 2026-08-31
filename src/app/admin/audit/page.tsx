'use client';

import React, { useState, useEffect } from 'react';
import { LoadingState, EmptyState } from '@/components/admin/AdminComponents';

interface AuditEntry {
  id: string;
  userEmail: string;
  userRole: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: string;
  ipAddress: string;
  timestamp: string;
}

export default function AdminAuditPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');
  const [resourceFilter, setResourceFilter] = useState('');

  useEffect(() => { load(); }, [actionFilter, resourceFilter]);

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (actionFilter) params.set('action', actionFilter);
      if (resourceFilter) params.set('resource', resourceFilter);
      params.set('limit', '100');
      const res = await fetch(`/api/admin/audit?${params}`);
      if (res.ok) {
        const data = await res.json();
        setEntries(data.entries || []);
        setTotal(data.total || 0);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">🔒 Audit Log</h1>
        <p className="admin-page-subtitle">{total} entries — Full administrative action trail</p>
      </div>

      <div className="admin-filters">
        <select value={actionFilter} onChange={e => setActionFilter(e.target.value)} className="admin-filter-select">
          <option value="">All Actions</option>
          <option value="LOGIN">Login</option>
          <option value="VIEW">View</option>
          <option value="CREATE">Create</option>
          <option value="UPDATE">Update</option>
          <option value="DELETE">Delete</option>
          <option value="APPROVE">Approve</option>
          <option value="GENERATE_AI">AI Generate</option>
        </select>
        <select value={resourceFilter} onChange={e => setResourceFilter(e.target.value)} className="admin-filter-select">
          <option value="">All Resources</option>
          <option value="auth">Auth</option>
          <option value="leads">Leads</option>
          <option value="dashboard">Dashboard</option>
          <option value="pipeline">Pipeline</option>
          <option value="automations">Automations</option>
          <option value="knowledge">Knowledge</option>
          <option value="insights">Insights</option>
          <option value="audit">Audit</option>
        </select>
      </div>

      {loading ? <LoadingState message="Loading audit log..." /> : entries.length === 0 ? (
        <EmptyState icon="🔒" title="No Audit Entries" description="Audit entries will appear as admin actions are performed." />
      ) : (
        <div className="admin-table-container">
          <table className="admin-table admin-table-compact">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Role</th>
                <th>Action</th>
                <th>Resource</th>
                <th>Details</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(entry => (
                <tr key={entry.id}>
                  <td className="admin-audit-time">{new Date(entry.timestamp).toLocaleString()}</td>
                  <td>{entry.userEmail}</td>
                  <td><span className="admin-role-badge">{entry.userRole}</span></td>
                  <td><span className={`admin-action-badge admin-action-${entry.action.toLowerCase()}`}>{entry.action}</span></td>
                  <td>{entry.resource}{entry.resourceId ? ` #${entry.resourceId.substring(0, 12)}` : ''}</td>
                  <td className="admin-audit-details">{entry.details || '—'}</td>
                  <td className="admin-audit-ip">{entry.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
