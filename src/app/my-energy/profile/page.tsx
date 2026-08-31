'use client';

import React, { useEffect, useState } from 'react';
import { 
  PortalHeader, 
  PortalLoadingState, 
  PortalErrorState 
} from '@/components/portal/PortalComponents';
import { CustomerProfile, CustomerLocation } from '@/lib/types';

export default function CustomerProfilePage() {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('Commercial');
  const [jobTitle, setJobTitle] = useState('');
  const [locations, setLocations] = useState<CustomerLocation[]>([]);
  const [prefs, setPrefs] = useState({
    email: true,
    sms: true,
    whatsapp: true,
    maintenanceReminders: true,
    orderUpdates: true,
    ticketResponses: true,
  });

  const loadProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/portal/profile');
      if (!res.ok) throw new Error('Failed to load profile.');
      const data = await res.json();
      if (data.profile) {
        setProfile(data.profile);
        setFirstName(data.profile.firstName || '');
        setLastName(data.profile.lastName || '');
        setPhone(data.profile.phone || '');
        setCompanyName(data.profile.companyName || '');
        setIndustry(data.profile.industry || 'Commercial');
        setJobTitle(data.profile.jobTitle || '');
        setLocations(data.profile.locations || []);
        if (data.profile.notificationPreferences) {
          setPrefs(data.profile.notificationPreferences);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error loading profile.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');

    try {
      const res = await fetch('/api/portal/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
          companyName,
          industry,
          jobTitle,
          locations,
          notificationPreferences: prefs,
        }),
      });

      if (!res.ok) throw new Error('Failed to save profile.');
      setSuccessMsg('✅ Profile and multi-site configuration saved successfully!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile.';
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PortalHeader title="Account & Multi-Site Settings" />

      <div className="portal-container" style={{ maxWidth: '900px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc', margin: '0 0 4px' }}>
            Customer Profile & Commercial Sites
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
            Manage authorized personnel, facility delivery locations, and automated dispatch communication channels.
          </p>
        </div>

        {successMsg && (
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', padding: '14px', color: '#34d399', fontSize: '13px', marginBottom: '20px' }}>
            {successMsg}
          </div>
        )}

        {loading ? (
          <PortalLoadingState label="Loading profile and facility settings..." />
        ) : error ? (
          <PortalErrorState message={error} retry={loadProfile} />
        ) : (
          <form onSubmit={handleSave}>
            {/* Personal & Corporate Information */}
            <div className="portal-card">
              <div className="portal-card-header">
                <div className="portal-card-title">
                  <span>👤</span>
                  <span>Personal & Corporate Information</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="portal-input-group">
                  <label className="portal-label">First Name</label>
                  <input
                    required
                    className="portal-input"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                  />
                </div>
                <div className="portal-input-group">
                  <label className="portal-label">Last Name</label>
                  <input
                    required
                    className="portal-input"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="portal-input-group">
                  <label className="portal-label">Email Address (Login)</label>
                  <input
                    disabled
                    className="portal-input"
                    value={profile?.email || ''}
                    style={{ opacity: 0.6, cursor: 'not-allowed' }}
                  />
                </div>
                <div className="portal-input-group">
                  <label className="portal-label">Direct Phone / WhatsApp</label>
                  <input
                    required
                    className="portal-input"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="portal-input-group">
                  <label className="portal-label">Company / Facility Name</label>
                  <input
                    className="portal-input"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                  />
                </div>
                <div className="portal-input-group">
                  <label className="portal-label">Job Title / Role</label>
                  <input
                    className="portal-input"
                    value={jobTitle}
                    onChange={e => setJobTitle(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Multi-Site Facility Locations */}
            <div className="portal-card">
              <div className="portal-card-header">
                <div className="portal-card-title">
                  <span>📍</span>
                  <span>Registered Facility & Site Locations ({locations.length})</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {locations.map((loc, idx) => (
                  <div key={loc.id || idx} style={{ background: '#131d31', padding: '16px', borderRadius: '10px', border: '1px solid #1e293b' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <strong style={{ fontSize: '14px', color: '#f8fafc' }}>{loc.name}</strong>
                      {loc.isPrimary && <span className="portal-badge portal-badge-optimal">Primary Hub</span>}
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                      {loc.address}, {loc.city}, {loc.state}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                      Contact: {loc.contactPerson || 'Assigned Site Contact'} ({loc.contactPhone || 'Phone on file'})
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Communication & Notification Channels */}
            <div className="portal-card">
              <div className="portal-card-header">
                <div className="portal-card-title">
                  <span>🔔</span>
                  <span>Automated Notification Channels</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#f1f5f9', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={prefs.maintenanceReminders}
                    onChange={e => setPrefs({ ...prefs, maintenanceReminders: e.target.checked })}
                    style={{ accentColor: '#10b981', width: '16px', height: '16px' }}
                  />
                  <span>Preventive Maintenance Reminders</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#f1f5f9', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={prefs.orderUpdates}
                    onChange={e => setPrefs({ ...prefs, orderUpdates: e.target.checked })}
                    style={{ accentColor: '#10b981', width: '16px', height: '16px' }}
                  />
                  <span>Order & Logistics Dispatch Alerts</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#f1f5f9', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={prefs.ticketResponses}
                    onChange={e => setPrefs({ ...prefs, ticketResponses: e.target.checked })}
                    style={{ accentColor: '#10b981', width: '16px', height: '16px' }}
                  />
                  <span>Engineering Support Ticket Responses</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#f1f5f9', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={prefs.whatsapp}
                    onChange={e => setPrefs({ ...prefs, whatsapp: e.target.checked })}
                    style={{ accentColor: '#10b981', width: '16px', height: '16px' }}
                  />
                  <span>WhatsApp Priority Telemetry Summaries</span>
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                type="submit"
                disabled={saving}
                className="portal-btn portal-btn-primary"
                style={{ padding: '10px 28px', fontSize: '14px' }}
              >
                {saving ? 'Saving Changes...' : 'Save Profile & Settings'}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
