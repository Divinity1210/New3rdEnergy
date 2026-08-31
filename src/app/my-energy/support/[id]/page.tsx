'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { 
  PortalHeader, 
  TicketBadge, 
  PortalLoadingState, 
  PortalErrorState 
} from '@/components/portal/PortalComponents';
import { SupportTicket } from '@/lib/types';

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const ticketId = resolvedParams.id;

  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const loadTicket = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/portal/support/${ticketId}`);
      if (!res.ok) throw new Error('Failed to load ticket.');
      const data = await res.json();
      setTicket(data.ticket);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error loading ticket.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTicket();
  }, [ticketId]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setSending(true);
    try {
      const res = await fetch(`/api/portal/support/${ticketId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: replyContent.trim() }),
      });

      if (!res.ok) throw new Error('Failed to post reply.');
      const data = await res.json();
      setTicket(data.ticket);
      setReplyContent('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error sending reply.';
      alert(msg);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <>
        <PortalHeader title="Support Ticket Conversation" />
        <div className="portal-container">
          <PortalLoadingState label="Loading conversation thread..." />
        </div>
      </>
    );
  }

  if (error || !ticket) {
    return (
      <>
        <PortalHeader title="Support Ticket Conversation" />
        <div className="portal-container">
          <PortalErrorState message={error || 'Ticket not found.'} retry={loadTicket} />
          <Link href="/my-energy/support" className="portal-btn portal-btn-secondary" style={{ marginTop: '12px' }}>
            &larr; Back to Tickets
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PortalHeader title={`Ticket ${ticket.ticketNumber}`} />

      <div className="portal-container" style={{ maxWidth: '900px' }}>
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '16px' }}>
          <Link href="/my-energy/support" style={{ fontSize: '12px', color: '#64748b', textDecoration: 'none' }}>
            &larr; Back to Support Tickets
          </Link>
        </div>

        {/* Ticket Header Card */}
        <div className="portal-card" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '13px', color: '#38bdf8', fontWeight: '700', background: '#131d31', padding: '3px 8px', borderRadius: '4px' }}>
                {ticket.ticketNumber}
              </span>
              <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '600' }}>
                {ticket.category.replace(/_/g, ' ')}
              </span>
            </div>
            <TicketBadge status={ticket.status} />
          </div>

          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#f8fafc', margin: '0 0 8px' }}>
            {ticket.subject}
          </h2>

          <div style={{ fontSize: '12px', color: '#64748b' }}>
            Opened on {new Date(ticket.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            {ticket.assignedEngineer && ` • Assigned Engineer: ${ticket.assignedEngineer}`}
          </div>
        </div>

        {/* Conversation Thread */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          {ticket.messages?.map(msg => {
            const isCustomer = msg.senderType === 'CUSTOMER';
            const isAgent = msg.senderType === 'AGENT';

            return (
              <div 
                key={msg.id} 
                style={{
                  alignSelf: isCustomer ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: isCustomer ? '#10b981' : '#1e293b',
                  color: isCustomer ? '#0f172a' : '#f8fafc',
                  padding: '16px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '6px', fontSize: '11px', fontWeight: '700', opacity: 0.85 }}>
                  <span>{isCustomer ? 'You (Customer)' : isAgent ? `👨‍🔧 ${msg.senderName}` : msg.senderName}</span>
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div style={{ fontSize: '13px', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                  {msg.content}
                </div>
              </div>
            );
          })}
        </div>

        {/* Reply Box */}
        <div className="portal-card">
          <form onSubmit={handleSendReply}>
            <div className="portal-input-group" style={{ marginBottom: '12px' }}>
              <label className="portal-label">Reply to Engineering Team</label>
              <textarea
                rows={3}
                required
                className="portal-textarea"
                placeholder="Type your reply, additional observations, or test results..."
                value={replyContent}
                onChange={e => setReplyContent(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="submit"
                disabled={sending || !replyContent.trim()}
                className="portal-btn portal-btn-primary"
                style={{ padding: '8px 20px' }}
              >
                {sending ? 'Sending...' : 'Post Reply'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
