'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CustomerRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    industry: 'Commercial',
    address: '',
    city: 'Lagos',
    state: 'Lagos State',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/portal/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', ...formData }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed.');
        setLoading(false);
        return;
      }

      router.push('/my-energy');
      router.refresh();
    } catch {
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at top, #0f172a 0%, #090e17 100%)',
      padding: '32px 24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#f8fafc',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '540px',
        background: '#0f172a',
        border: '1px solid #1e293b',
        borderRadius: '16px',
        padding: '36px 32px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #10b981, #047857)',
            borderRadius: '12px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            marginBottom: '12px',
          }}>
            ⚡
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', margin: '0 0 6px' }}>
            Register Commercial Account
          </h1>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
            Connect your facility systems, track warranties, and access 24/7 AI diagnostics
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            color: '#f87171',
            fontSize: '13px',
            marginBottom: '20px',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="portal-input-group">
              <label className="portal-label" htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                required
                className="portal-input"
                value={formData.firstName}
                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Tunde"
              />
            </div>
            <div className="portal-input-group">
              <label className="portal-label" htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                required
                className="portal-input"
                value={formData.lastName}
                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Adeleke"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="portal-input-group">
              <label className="portal-label" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                required
                className="portal-input"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@company.ng"
              />
            </div>
            <div className="portal-input-group">
              <label className="portal-label" htmlFor="phone">Phone / WhatsApp</label>
              <input
                id="phone"
                required
                className="portal-input"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+234 803 000 0000"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="portal-input-group">
              <label className="portal-label" htmlFor="companyName">Company / Facility Name</label>
              <input
                id="companyName"
                className="portal-input"
                value={formData.companyName}
                onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Apex Logistics Ltd"
              />
            </div>
            <div className="portal-input-group">
              <label className="portal-label" htmlFor="industry">Industry Vertical</label>
              <select
                id="industry"
                className="portal-select"
                value={formData.industry}
                onChange={e => setFormData({ ...formData, industry: e.target.value })}
              >
                <option value="Commercial">Commercial Facility</option>
                <option value="Healthcare">Healthcare & Cold Storage</option>
                <option value="Industrial">Manufacturing & Industrial</option>
                <option value="Hospitality">Hospitality & Real Estate</option>
                <option value="Residential">Premium Residential</option>
              </select>
            </div>
          </div>

          <div className="portal-input-group">
            <label className="portal-label" htmlFor="address">Primary Facility Address</label>
            <input
              id="address"
              className="portal-input"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              placeholder="Plot 14B, Adeola Odeku Street, Victoria Island"
            />
          </div>

          <div className="portal-input-group">
            <label className="portal-label" htmlFor="password">Create Password (min 6 characters)</label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              className="portal-input"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="portal-btn portal-btn-primary"
            style={{ width: '100%', marginTop: '12px', padding: '12px', fontWeight: '700' }}
          >
            {loading ? 'Creating Account...' : 'Complete Registration & Enter Portal'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#94a3b8' }}>
          Already have an account?{' '}
          <Link href="/my-energy/login" style={{ color: '#34d399', textDecoration: 'none', fontWeight: '600' }}>
            Sign in &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
