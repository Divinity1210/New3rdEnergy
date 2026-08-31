'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LeadScoreBadge, StageBadge, LoadingState, EmptyState, ErrorState } from '@/components/admin/AdminComponents';

interface EnrichedLead {
  id: string;
  referenceNumber: string;
  contact: { firstName: string; lastName: string; email: string; phone?: string };
  organisation: { name: string; industry: string };
  status: string;
  urgency: string;
  createdAt: string;
  score: { total: number; tier: 'HOT' | 'WARM' | 'COLD'; explanation: string };
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<EnrichedLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadLeads();
  }, [statusFilter]);

  async function loadLeads() {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (search) params.set('search', search);
      params.set('limit', '50');

      const res = await fetch(`/api/admin/leads?${params}`);
      if (!res.ok) throw new Error('Failed to load leads');
      const data = await res.json();
      setLeads(data.leads || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError('Failed to load leads. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    loadLeads();
  }

  if (error) return <ErrorState message={error} onRetry={loadLeads} />;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Leads</h1>
          <p className="admin-page-subtitle">{total} total leads — AI-scored & enriched</p>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-filters">
        <form onSubmit={handleSearch} className="admin-search-form">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search leads..."
            className="admin-search-input"
          />
          <button type="submit" className="admin-search-btn">Search</button>
        </form>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="admin-filter-select"
        >
          <option value="">All Statuses</option>
          <option value="NEW">New</option>
          <option value="QUALIFIED">Qualified</option>
          <option value="QUOTE_SENT">Quote Sent</option>
          <option value="WON">Won</option>
          <option value="LOST">Lost</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      {loading ? (
        <LoadingState message="Loading leads..." />
      ) : leads.length === 0 ? (
        <EmptyState icon="🎯" title="No Leads Found" description="Leads will appear here as they come through the website forms." />
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Contact</th>
                <th>Organisation</th>
                <th>Score</th>
                <th>Status</th>
                <th>Urgency</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead.id} className="admin-table-row">
                  <td className="admin-table-ref">{lead.referenceNumber}</td>
                  <td>
                    <div className="admin-table-contact">
                      <span className="admin-contact-name">{lead.contact?.firstName} {lead.contact?.lastName}</span>
                      <span className="admin-contact-email">{lead.contact?.email}</span>
                    </div>
                  </td>
                  <td>
                    <div className="admin-table-org">
                      <span>{lead.organisation?.name || '—'}</span>
                      <span className="admin-org-industry">{lead.organisation?.industry || ''}</span>
                    </div>
                  </td>
                  <td>
                    {lead.score && <LeadScoreBadge tier={lead.score.tier} score={lead.score.total} />}
                  </td>
                  <td><StageBadge stage={lead.status} /></td>
                  <td>
                    <span className={`admin-urgency admin-urgency-${lead.urgency}`}>
                      {lead.urgency}
                    </span>
                  </td>
                  <td className="admin-table-date">
                    {new Date(lead.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td>
                    <Link href={`/admin/leads/${lead.id}`} className="admin-action-btn">
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
