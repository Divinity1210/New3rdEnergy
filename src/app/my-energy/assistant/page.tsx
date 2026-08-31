'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PortalHeader, PortalLoadingState } from '@/components/portal/PortalComponents';
import { CustomerChatMessage, CustomerSystem } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function EnergyAssistantPage() {
  const router = useRouter();
  const [systems, setSystems] = useState<CustomerSystem[]>([]);
  const [messages, setMessages] = useState<CustomerChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch('/api/portal/systems');
        if (res.ok) {
          const data = await res.json();
          const sysList = data.systems || [];
          setSystems(sysList);

          const primary = sysList[0];
          const welcomeMsg: CustomerChatMessage = {
            id: 'welcome_msg',
            sender: 'assistant',
            content: `Hello! I am your **3rd Energy Asset Assistant**.\n\n` +
              `I have real-time technical context for your registered **${primary?.name || 'Commercial Energy System'}** (Capacity: ${primary?.totalCapacityKva || 10}kVA Inverter / ${primary?.batteryCapacityKwh || 20}kWh LiFePO4 Storage).\n\n` +
              `How can I assist your operations team today? You can ask troubleshooting questions, inquire about maintenance cycles, or diagnose error codes safely.`,
            confidence: 1.0,
            sources: [{ title: '3rd Energy System Telemetry & Asset Profile', type: 'verified' }],
            suggestedActions: [
              { label: 'Check Next Maintenance', href: '/my-energy/maintenance' },
              { label: 'View Hardware Serials', href: `/my-energy/systems/${primary?.id || ''}` },
            ],
            timestamp: new Date().toISOString(),
          };
          setMessages([welcomeMsg]);
        }
      } catch (err) {
        console.error('Failed to load system context:', err);
      } finally {
        setInitialLoading(false);
      }
    }
    init();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (queryToSend?: string) => {
    const query = (queryToSend || inputQuery).trim();
    if (!query || loading) return;

    const userMsg: CustomerChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'customer',
      content: query,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/portal/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) throw new Error('Assistant response failed.');
      const data = await res.json();
      setMessages(prev => [...prev, data.message]);
    } catch {
      const errorMsg: CustomerChatMessage = {
        id: `err_${Date.now()}`,
        sender: 'assistant',
        content: 'I encountered an error retrieving diagnostic advice. Please contact our 24/7 engineering helpdesk directly.',
        confidence: 0.2,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    'My inverter is making a buzzing sound.',
    'Our battery backup does not last as long.',
    'When is our next scheduled maintenance?',
    'What does Inverter Error Code F08 mean?',
  ];

  return (
    <>
      <PortalHeader title="AI Energy Asset Assistant" />

      <div className="portal-container" style={{ maxWidth: '960px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
        {/* Assistant Header Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(15, 23, 42, 0.9))',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
        }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#f8fafc' }}>
              🤖 Context-Aware Equipment Diagnostics
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
              Connected to: <strong style={{ color: '#34d399' }}>{systems[0]?.name || 'Commercial System'}</strong> • Safe Technical Guidance & Escalations
            </div>
          </div>
          <span className="portal-badge portal-badge-optimal">● Knowledge Guard Active</span>
        </div>

        {/* Chat Message Scroll Area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          background: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: '14px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          marginBottom: '16px',
        }}>
          {initialLoading ? (
            <PortalLoadingState label="Connecting to system diagnostics telemetry..." />
          ) : (
            messages.map(msg => {
              const isCustomer = msg.sender === 'customer';

              return (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: isCustomer ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <div style={{
                    background: isCustomer ? '#10b981' : '#131d31',
                    color: isCustomer ? '#0f172a' : '#f8fafc',
                    padding: '16px',
                    borderRadius: '14px',
                    border: isCustomer ? 'none' : '1px solid #1e293b',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  }}>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      marginBottom: '6px',
                      color: isCustomer ? '#064e3b' : '#34d399',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                      <span>{isCustomer ? 'Operations Team' : '🤖 3rd Energy AI Assistant'}</span>
                      {msg.confidence !== undefined && (
                        <span style={{ fontSize: '10px', opacity: 0.8 }}>
                          Confidence: {Math.round(msg.confidence * 100)}%
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: '13px', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                      {msg.content}
                    </div>

                    {/* Specialist Escalation Alert */}
                    {msg.requiresSpecialistReview && (
                      <div className="portal-specialist-banner">
                        <div className="portal-specialist-title">
                          ⚠️ A Specialist Should Review This
                        </div>
                        <p style={{ fontSize: '12px', color: '#f8fafc', margin: 0 }}>
                          For safety and warranty integrity, internal electrical troubleshooting requires a certified field specialist.
                        </p>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                          <button
                            onClick={() => router.push('/my-energy/support')}
                            className="portal-btn portal-btn-primary"
                            style={{ fontSize: '12px', padding: '6px 14px' }}
                          >
                            🎫 Open Priority Support Ticket
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Verified Sources */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: isCustomer ? '1px solid rgba(0,0,0,0.1)' : '1px solid #1e293b', fontSize: '11px', color: isCustomer ? '#064e3b' : '#64748b' }}>
                        📚 <strong>Verified Sources:</strong> {msg.sources.map(s => s.title).join(' • ')}
                      </div>
                    )}
                  </div>

                  {/* Suggested Quick Actions */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {msg.suggestedActions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => action.href && router.push(action.href)}
                          className="portal-btn portal-btn-secondary"
                          style={{ padding: '4px 10px', fontSize: '11px' }}
                        >
                          {action.label} &rarr;
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
          {loading && (
            <div style={{ alignSelf: 'flex-start', background: '#131d31', padding: '12px 18px', borderRadius: '12px', color: '#94a3b8', fontSize: '12px' }}>
              ⚡ Analyzing system telemetry and safety protocols...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Sample Prompts */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '8px' }}>
          {samplePrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              disabled={loading}
              className="portal-btn portal-btn-secondary"
              style={{ padding: '6px 10px', fontSize: '11px', whiteSpace: 'nowrap', borderRadius: '20px' }}
            >
              💬 {prompt}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          style={{ display: 'flex', gap: '10px' }}
        >
          <input
            type="text"
            className="portal-input"
            style={{ flex: 1, padding: '12px 16px' }}
            placeholder="Ask about inverter sounds, runtime, error codes, or maintenance..."
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !inputQuery.trim()}
            className="portal-btn portal-btn-primary"
            style={{ padding: '0 24px', fontWeight: '700' }}
          >
            Send
          </button>
        </form>
      </div>
    </>
  );
}
