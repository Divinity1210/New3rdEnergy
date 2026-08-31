'use client';

import React, { useEffect, useState } from 'react';
import { 
  PortalHeader, 
  PortalLoadingState, 
  PortalErrorState 
} from '@/components/portal/PortalComponents';
import { ServiceRecord, CustomerSystem } from '@/lib/types';

export default function ServiceHistoryPage() {
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [systems, setSystems] = useState<CustomerSystem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Service Request Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedSystemId, setSelectedSystemId] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [resRecs, resSys] = await Promise.all([
        fetch('/api/portal/service-history'),
        fetch('/api/portal/systems'),
      ]);
      if (!resRecs.ok) throw new Error('Failed to load service logs.');
      const dataRecs = await resRecs.json();
      const dataSys = await resSys.json();
      setRecords(dataRecs.records || []);
      setSystems(dataSys.systems || []);
      if (dataSys.systems?.length > 0) {
        setSelectedSystemId(dataSys.systems[0].id);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error loading service records.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRequestService = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg('');

    try {
      const selectedSystem = systems.find(s => s.id === selectedSystemId);
      const res = await fetch('/api/portal/service-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemId: selectedSystemId,
          systemName: selectedSystem?.name || 'Commercial Solar System',
          preferredDate,
          issueDescription,
          contactPhone,
        }),
      });

      if (!res.ok) throw new Error('Failed to submit service request.');
      const data = await res.json();
      setRecords([data.record, ...records]);
      setSuccessMsg('✅ Service inspection request submitted successfully! A field coordinator will call to confirm dispatch.');
      setIssueDescription('');
      setShowModal(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error submitting request.';
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PortalHeader title="Service History & Maintenance Logs" />

      <div className="portal-container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc', margin: '0 0 4px' }}>
              Chronological Engineering & Maintenance Logs
            </h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
              Verified logs of commissioning tests, preventive calibrations, component swaps, and field audits.
            </p>
          </div>
          <button onClick={() => setShowModal(true)} className="portal-btn portal-btn-primary">
            + Request Service Visit
          </button>
        </div>

        {successMsg && (
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', padding: '14px', color: '#34d399', fontSize: '13px', marginBottom: '20px' }}>
            {successMsg}
          </div>
        )}

        {loading ? (
          <PortalLoadingState label="Loading engineering service logs..." />
        ) : error ? (
          <PortalErrorState message={error} retry={loadData} />
        ) : records.length === 0 ? (
          <div className="portal-card" style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔧</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc' }}>No Service Logs on Record</div>
            <p style={{ fontSize: '13px', color: '#64748b' }}>Routine maintenance and repair logs will be displayed here.</p>
            <button onClick={() => setShowModal(true)} className="portal-btn portal-btn-primary" style={{ marginTop: '12px' }}>
              Schedule First Service Inspection
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {records.map(rec => (
              <div key={rec.id} className="portal-card" style={{ margin: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#10b981', fontWeight: '700', textTransform: 'uppercase' }}>
                      {rec.systemName}
                    </span>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc', margin: '2px 0 0' }}>
                      {rec.issueDescription}
                    </h3>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="portal-badge portal-badge-optimal">● {rec.status}</span>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                      📅 {new Date(rec.serviceDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                </div>

                <div style={{ background: '#131d31', padding: '14px', borderRadius: '8px', marginBottom: '12px', fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5 }}>
                  <div style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Work Performed & Diagnostic Observations
                  </div>
                  {rec.workPerformed}
                </div>

                {rec.partsReplaced && rec.partsReplaced.length > 0 && (
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>
                    🔩 <strong>Parts & Consumables:</strong> {rec.partsReplaced.join(', ')}
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', fontSize: '12px', color: '#64748b', borderTop: '1px solid #1e293b', paddingTop: '10px' }}>
                  <div>
                    👨‍🔧 <strong>Assigned Lead:</strong> {rec.technicianName} ({rec.department})
                  </div>
                  {rec.nextRecommendedServiceDate && (
                    <div style={{ color: '#fbbf24' }}>
                      🗓️ <strong>Recommended Next Service:</strong> {new Date(rec.nextRecommendedServiceDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Request Service Modal */}
        {showModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
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
              maxWidth: '500px',
              width: '100%',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc', margin: 0 }}>
                  🔧 Request Service or Maintenance
                </h3>
                <button 
                  onClick={() => setShowModal(false)}
                  style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '20px', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleRequestService}>
                <div className="portal-input-group">
                  <label className="portal-label">Target Energy System</label>
                  <select
                    className="portal-select"
                    value={selectedSystemId}
                    onChange={e => setSelectedSystemId(e.target.value)}
                  >
                    {systems.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.locationName})</option>
                    ))}
                  </select>
                </div>

                <div className="portal-input-group">
                  <label className="portal-label">Preferred Date for Engineering Visit</label>
                  <input
                    type="date"
                    required
                    className="portal-input"
                    value={preferredDate}
                    onChange={e => setPreferredDate(e.target.value)}
                  />
                </div>

                <div className="portal-input-group">
                  <label className="portal-label">Description of Issue / Service Required</label>
                  <textarea
                    rows={4}
                    required
                    className="portal-textarea"
                    placeholder="Describe the issue or routine maintenance required (e.g. quarterly inspection, inverter fan cleaning, battery check)..."
                    value={issueDescription}
                    onChange={e => setIssueDescription(e.target.value)}
                  />
                </div>

                <div className="portal-input-group">
                  <label className="portal-label">On-Site Contact Phone</label>
                  <input
                    type="tel"
                    className="portal-input"
                    placeholder="+234 803 000 0000"
                    value={contactPhone}
                    onChange={e => setContactPhone(e.target.value)}
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
                    {submitting ? 'Submitting...' : 'Submit Request'}
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
