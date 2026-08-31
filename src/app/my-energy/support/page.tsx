'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  PortalHeader, 
  TicketBadge, 
  PortalLoadingState, 
  PortalErrorState 
} from '@/components/portal/PortalComponents';
import { SupportTicket, CustomerSystem, TicketCategory, TicketPriority } from '@/lib/types';

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [systems, setSystems] = useState<CustomerSystem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<TicketCategory>('GENERAL_INQUIRY');
  const [priority, setPriority] = useState<TicketPriority>('MEDIUM');
  const [selectedSystemId, setSelectedSystemId] = useState('');
  const [initialDescription, setInitialDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [resTck, resSys] = await Promise.all([
        fetch('/api/portal/support'),
        fetch('/api/portal/systems'),
      ]);
      if (!resTck.ok) throw new Error('Failed to load tickets.');
      const dataTck = await resTck.json();
      const dataSys = await resSys.json();
      setTickets(dataTck.tickets || []);
      setSystems(dataSys.systems || []);
      if (dataSys.systems?.length > 0) {
        setSelectedSystemId(dataSys.systems[0].id);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error loading support tickets.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const selectedSystem = systems.find(s => s.id === selectedSystemId);
      const res = await fetch('/api/portal/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          category,
          priority,
          systemId: selectedSystemId || undefined,
          systemName: selectedSystem?.name || undefined,
          initialDescription,
        }),
      });

      if (!res.ok) throw new Error('Failed to create ticket.');
      const data = await res.json();
      setTickets([data.ticket, ...tickets]);
      setShowModal(false);
      setSubject('');
      setInitialDescription('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create ticket.';
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PortalHeader title="Support & Engineering Tickets" />

      <div className="portal-container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc', margin: '0 0 4px' }}>
              Priority Engineering Service Desk
            </h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
              Direct line to 3rd Energy field engineers, maintenance supervisors, and billing coordinators.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link href="/my-energy/assistant" className="portal-btn portal-btn-secondary">
              🤖 Instant AI Diagnostic
            </Link>
            <button onClick={() => setShowModal(true)} className="portal-btn portal-btn-primary">
              + Open New Ticket
            </button>
          </div>
        </div>

        {loading ? (
          <PortalLoadingState label="Loading support tickets..." />
        ) : error ? (
          <PortalErrorState message={error} retry={loadData} />
        ) : tickets.length === 0 ? (
          <div className="portal-card" style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎫</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc' }}>No Support Tickets</div>
            <p style={{ fontSize: '13px', color: '#64748b' }}>Need technical advice or field assistance? Open a ticket below.</p>
            <button onClick={() => setShowModal(true)} className="portal-btn portal-btn-primary" style={{ marginTop: '12px' }}>
              Create Support Ticket
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {tickets.map(ticket => (
              <Link 
                key={ticket.id} 
                href={`/my-energy/support/${ticket.id}`} 
                style={{ textDecoration: 'none' }}
              >
                <div className="portal-card" style={{ margin: 0, transition: 'transform 0.15s ease, border-color 0.15s ease' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#38bdf8', fontWeight: '700', background: '#131d31', padding: '3px 8px', borderRadius: '4px' }}>
                        {ticket.ticketNumber}
                      </span>
                      <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '600' }}>
                        {ticket.category.replace(/_/g, ' ')}
                      </span>
                      {ticket.priority === 'URGENT' && (
                        <span className="portal-badge portal-ticket-urgent">⚡ URGENT</span>
                      )}
                    </div>
                    <TicketBadge status={ticket.status} />
                  </div>

                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f8fafc', margin: '0 0 6px' }}>
                    {ticket.subject}
                  </h3>

                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {ticket.initialDescription}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', borderTop: '1px solid #1e293b', paddingTop: '8px' }}>
                    <span>
                      💬 {ticket.messages?.length || 1} messages {ticket.assignedEngineer ? `• Lead: ${ticket.assignedEngineer}` : ''}
                    </span>
                    <span>
                      Updated {new Date(ticket.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Create Ticket Modal */}
        {showModal && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}>
            <div style={{
              background: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: '16px',
              padding: '28px',
              maxWidth: '540px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc', margin: 0 }}>
                  🎫 Open Engineering Support Ticket
                </h3>
                <button 
                  onClick={() => setShowModal(false)}
                  style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '20px', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateTicket}>
                <div className="portal-input-group">
                  <label className="portal-label">Subject / Issue Summary</label>
                  <input
                    required
                    className="portal-input"
                    placeholder="e.g. Inverter error code F08 after sudden power fluctuation"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="portal-input-group">
                    <label className="portal-label">Category</label>
                    <select
                      className="portal-select"
                      value={category}
                      onChange={e => setCategory(e.target.value as TicketCategory)}
                    >
                      <option value="INVERTER_FAULT">Inverter Fault / Alarm</option>
                      <option value="BATTERY_ISSUE">Battery & Storage Concern</option>
                      <option value="SOLAR_OUTPUT">Solar Yield / PV Output</option>
                      <option value="MAINTENANCE_REQUEST">Routine Maintenance</option>
                      <option value="BILLING">Billing & Invoices</option>
                      <option value="GENERAL_INQUIRY">General Inquiry</option>
                    </select>
                  </div>

                  <div className="portal-input-group">
                    <label className="portal-label">Priority</label>
                    <select
                      className="portal-select"
                      value={priority}
                      onChange={e => setPriority(e.target.value as TicketPriority)}
                    >
                      <option value="LOW">Low (Routine question)</option>
                      <option value="MEDIUM">Medium (Minor issue)</option>
                      <option value="HIGH">High (System degraded)</option>
                      <option value="URGENT">Urgent (Facility outage / Safety)</option>
                    </select>
                  </div>
                </div>

                {systems.length > 0 && (
                  <div className="portal-input-group">
                    <label className="portal-label">Related Installed System</label>
                    <select
                      className="portal-select"
                      value={selectedSystemId}
                      onChange={e => setSelectedSystemId(e.target.value)}
                    >
                      <option value="">-- Select Installed System (Optional) --</option>
                      {systems.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.locationName})</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="portal-input-group">
                  <label className="portal-label">Detailed Description of Observation</label>
                  <textarea
                    rows={4}
                    required
                    className="portal-textarea"
                    placeholder="Provide details: What happened? What time did it start? Are any error lights or display codes active?..."
                    value={initialDescription}
                    onChange={e => setInitialDescription(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="portal-btn portal-btn-secondary"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="portal-btn portal-btn-primary"
                    style={{ flex: 1 }}
                  >
                    {submitting ? 'Submitting...' : 'Submit Ticket'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
