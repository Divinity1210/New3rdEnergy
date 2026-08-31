'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CustomerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed.');
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

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/portal/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDemo: true }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Demo login failed.');
        setLoading(false);
        return;
      }

      router.push('/my-energy');
      router.refresh();
    } catch {
      setError('Connection error.');
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
      padding: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#f8fafc',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
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
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
          }}>
            ⚡
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            My Energy Portal
          </h1>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
            3rd Energy Customer Relationship & Asset Platform
          </p>
        </div>

        {/* 1-Click Demo Login Banner */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: '10px',
          padding: '14px',
          marginBottom: '20px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '12px', color: '#34d399', fontWeight: '600', marginBottom: '8px' }}>
            ✨ Instant Exploration
          </div>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="portal-btn portal-btn-primary"
            style={{ width: '100%', padding: '10px', fontWeight: '700' }}
          >
            {loading ? 'Entering Portal...' : '🚀 Sign in as Demo Customer'}
          </button>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
            Pre-loaded with 10kVA Commercial Solar, telemetry & service records
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', gap: '12px' }}>
          <div style={{ flex: 1, height: '1px', background: '#1e293b' }} />
          <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>or sign in with password</span>
          <div style={{ flex: 1, height: '1px', background: '#1e293b' }} />
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            color: '#f87171',
            fontSize: '13px',
            marginBottom: '16px',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="portal-input-group">
            <label className="portal-label" htmlFor="email">Customer Email Address</label>
            <input
              id="email"
              type="email"
              required
              className="portal-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g. tunde@apexhealth.ng"
            />
          </div>

          <div className="portal-input-group">
            <label className="portal-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              className="portal-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="portal-btn portal-btn-secondary"
            style={{ width: '100%', marginTop: '8px', padding: '12px' }}
          >
            {loading ? 'Verifying...' : 'Sign In to Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#94a3b8' }}>
          New commercial client?{' '}
          <Link href="/my-energy/register" style={{ color: '#34d399', textDecoration: 'none', fontWeight: '600' }}>
            Register your company &rarr;
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link href="/" style={{ fontSize: '12px', color: '#64748b', textDecoration: 'none' }}>
            &larr; Return to 3rd Energy Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
