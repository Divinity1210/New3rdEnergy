'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  CustomerSystem, 
  ContextualRecommendation, 
  DocumentRecord, 
  TicketStatus, 
  WarrantyStatus, 
  CustomerSession 
} from '@/lib/types';

// ===== PORTAL SIDEBAR =====

export function PortalSidebar({ user, openTicketsCount = 0 }: { user?: CustomerSession | null; openTicketsCount?: number }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/portal/auth', { method: 'DELETE' });
      router.push('/my-energy/login');
      router.refresh();
    } catch {
      window.location.href = '/my-energy/login';
    }
  };

  const navItems = [
    { label: 'Overview', href: '/my-energy', icon: '⚡' },
    { label: 'My Systems', href: '/my-energy/systems', icon: '☀️' },
    { label: 'My Products', href: '/my-energy/products', icon: '📦' },
    { label: 'My Orders', href: '/my-energy/orders', icon: '🛒' },
    { label: 'Installations', href: '/my-energy/installations', icon: '🏗️' },
    { label: 'Service History', href: '/my-energy/service-history', icon: '🔧' },
    { label: 'Maintenance', href: '/my-energy/maintenance', icon: '🗓️' },
    { label: 'Warranty Hub', href: '/my-energy/warranty', icon: '🛡️' },
    { label: 'Document Vault', href: '/my-energy/documents', icon: '📁' },
    { 
      label: 'Support Tickets', 
      href: '/my-energy/support', 
      icon: '🎫',
      badge: openTicketsCount > 0 ? String(openTicketsCount) : undefined,
    },
    { label: 'AI Energy Assistant', href: '/my-energy/assistant', icon: '🤖', isHighlight: true },
    { label: 'Account & Sites', href: '/my-energy/profile', icon: '👤' },
  ];

  return (
    <aside className="portal-sidebar">
      <div className="portal-sidebar-header">
        <div className="portal-logo-icon">⚡</div>
        <div>
          <div className="portal-sidebar-title">My Energy</div>
          <div className="portal-sidebar-subtitle">3rd Energy Customer Portal</div>
        </div>
      </div>

      <nav className="portal-sidebar-nav" aria-label="Customer Portal Navigation">
        <div className="portal-nav-section-title">Energy Management</div>
        {navItems.slice(0, 5).map(item => {
          const isActive = pathname === item.href || (item.href !== '/my-energy' && pathname?.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} className={`portal-nav-link ${isActive ? 'active' : ''}`}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && <span className="portal-nav-badge">{item.badge}</span>}
            </Link>
          );
        })}

        <div className="portal-nav-section-title">Asset Care & Support</div>
        {navItems.slice(5).map(item => {
          const isActive = pathname === item.href || (item.href !== '/my-energy' && pathname?.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} className={`portal-nav-link ${isActive ? 'active' : ''}`}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && <span className="portal-nav-badge">{item.badge}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="portal-sidebar-footer">
        <div className="portal-user-chip">
          <div className="portal-user-avatar">
            {user?.firstName?.[0] || 'C'}
          </div>
          <div className="portal-user-info">
            <div className="portal-user-name">{user ? `${user.firstName} ${user.lastName}` : 'Client Account'}</div>
            <div className="portal-user-company">{user?.email || '3rd Energy Client'}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
          <Link href="/" className="portal-btn portal-btn-secondary" style={{ flex: 1, padding: '6px 8px', fontSize: '11px' }}>
            Main Site
          </Link>
          <button onClick={handleLogout} className="portal-btn portal-btn-danger" style={{ padding: '6px 10px', fontSize: '11px' }}>
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}

// ===== MOBILE BOTTOM NAVIGATION BAR =====

export function PortalMobileNav() {
  const pathname = usePathname();

  const mobileItems = [
    { label: 'Overview', href: '/my-energy', icon: '⚡' },
    { label: 'Systems', href: '/my-energy/systems', icon: '☀️' },
    { label: 'Assistant', href: '/my-energy/assistant', icon: '🤖' },
    { label: 'Support', href: '/my-energy/support', icon: '🎫' },
    { label: 'Account', href: '/my-energy/profile', icon: '👤' },
  ];

  return (
    <nav className="portal-mobile-bottom-nav" aria-label="Mobile Navigation">
      {mobileItems.map(item => {
        const isActive = item.href === '/my-energy' 
          ? pathname === '/my-energy' 
          : pathname?.startsWith(item.href);

        return (
          <Link key={item.href} href={item.href} className={`portal-mobile-nav-item ${isActive ? 'active' : ''}`}>
            <span className="portal-mobile-nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

// ===== TOPBAR HEADER =====

export function PortalHeader({ title, user }: { title: string; user?: CustomerSession | null }) {
  return (
    <header className="portal-topbar">
      <h1 className="portal-topbar-title">{title}</h1>
      <div className="portal-topbar-actions">
        <Link href="/my-energy/assistant" className="portal-btn portal-btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>
          <span>🤖</span>
          <span>Ask Energy AI</span>
        </Link>
        <Link href="/my-energy/support" className="portal-btn portal-btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
          <span>+</span>
          <span>New Ticket</span>
        </Link>
      </div>
    </header>
  );
}

// ===== SYSTEM HEALTH CARD =====

export function SystemHealthCard({ system }: { system: CustomerSystem }) {
  return (
    <div className="portal-card" style={{ marginBottom: '16px' }}>
      <div className="portal-card-header">
        <div>
          <div className="portal-card-title">
            <span>☀️</span>
            <span>{system.name}</span>
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            📍 {system.locationName} • Installed {new Date(system.installationDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
          </div>
        </div>
        <span className={`portal-badge ${
          system.healthStatus === 'OPTIMAL' ? 'portal-badge-optimal' :
          system.healthStatus === 'ATTENTION_REQUIRED' ? 'portal-badge-attention' : 'portal-badge-fault'
        }`}>
          ● {system.healthStatus}
        </span>
      </div>

      <div className="portal-grid-3" style={{ marginTop: '12px' }}>
        <div style={{ background: '#131d31', padding: '12px', borderRadius: '8px' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Total Inverter Power</div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#38bdf8' }}>{system.totalCapacityKva} kVA</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Three-Phase Pure Sine</div>
        </div>
        <div style={{ background: '#131d31', padding: '12px', borderRadius: '8px' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Battery Storage</div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#34d399' }}>{system.batteryCapacityKwh} kWh</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>LiFePO4 Modular Bank</div>
        </div>
        <div style={{ background: '#131d31', padding: '12px', borderRadius: '8px' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Solar PV Capacity</div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#fbbf24' }}>{system.solarCapacityKwp || 0} kWp</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Tier-1 Monocrystalline</div>
        </div>
      </div>

      {system.telemetry && (
        <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', fontSize: '12px' }}>
          <div style={{ color: '#94a3b8' }}>
            ⚡ Current Output: <strong style={{ color: '#f8fafc' }}>{system.telemetry.currentOutputKw || 0} kW</strong> • 
            ☀️ Today Yield: <strong style={{ color: '#f8fafc' }}>{system.telemetry.dailyYieldKwh || 0} kWh</strong> • 
            🔋 SOC: <strong style={{ color: '#34d399' }}>{system.telemetry.batterySocPercent || 100}%</strong>
          </div>
          <Link href={`/my-energy/systems/${system.id}`} className="portal-btn portal-btn-secondary" style={{ padding: '4px 10px', fontSize: '11px' }}>
            Full Technical Specs & Serials &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}

// ===== STATUS BADGES =====

export function TicketBadge({ status }: { status: TicketStatus }) {
  const map: Record<TicketStatus, { label: string; cls: string }> = {
    NEW_REQUEST: { label: 'New Request', cls: 'portal-ticket-open' },
    OPEN: { label: 'Open', cls: 'portal-ticket-open' },
    IN_PROGRESS: { label: 'In Progress', cls: 'portal-ticket-in-progress' },
    WAITING_FOR_CUSTOMER: { label: 'Waiting for You', cls: 'portal-ticket-in-progress' },
    RESOLVED: { label: 'Resolved', cls: 'portal-ticket-resolved' },
    CLOSED: { label: 'Closed', cls: 'portal-badge-active' },
  };

  const item = map[status] || { label: status, cls: 'portal-badge-active' };
  return <span className={`portal-badge ${item.cls}`}>{item.label}</span>;
}

export function WarrantyBadge({ status }: { status: WarrantyStatus }) {
  const map: Record<WarrantyStatus, { label: string; cls: string }> = {
    ACTIVE: { label: 'Active Coverage', cls: 'portal-badge-optimal' },
    EXPIRING_SOON: { label: 'Expiring Soon', cls: 'portal-badge-attention' },
    EXPIRED: { label: 'Expired', cls: 'portal-badge-fault' },
    CLAIM_IN_PROGRESS: { label: 'Claim in Progress', cls: 'portal-ticket-in-progress' },
  };

  const item = map[status] || { label: status, cls: 'portal-badge-active' };
  return <span className={`portal-badge ${item.cls}`}>🛡️ {item.label}</span>;
}

// ===== CONTEXTUAL RECOMMENDATION CARD =====

export function RecommendationCard({ rec }: { rec: ContextualRecommendation }) {
  return (
    <div className="portal-card" style={{ borderLeft: '4px solid #10b981' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ fontSize: '14px', fontWeight: '700', color: '#f8fafc' }}>
          💡 {rec.title}
        </div>
        <span className="portal-badge portal-badge-optimal">{rec.estimatedBenefit}</span>
      </div>
      <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 12px' }}>
        {rec.rationale}
      </p>
      <Link href={rec.callToAction.href} className="portal-btn portal-btn-primary" style={{ fontSize: '12px', padding: '6px 14px' }}>
        {rec.callToAction.label} &rarr;
      </Link>
    </div>
  );
}

// ===== DOCUMENT CARD =====

export function DocumentCard({ doc }: { doc: DocumentRecord }) {
  const iconMap: Record<string, string> = {
    INVOICE: '🧾',
    QUOTE: '📄',
    RECEIPT: '💳',
    USER_MANUAL: '📖',
    WARRANTY_CERTIFICATE: '🛡️',
    SERVICE_REPORT: '📋',
    SINGLE_LINE_DIAGRAM: '📐',
  };

  return (
    <div className="portal-component-card">
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <span style={{ fontSize: '24px' }}>{iconMap[doc.type] || '📁'}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {doc.title}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
            {doc.type.replace(/_/g, ' ')} • {doc.fileSizeKb} KB • Issued {new Date(doc.issuedDate).toLocaleDateString('en-GB')}
          </div>
        </div>
      </div>
      <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end' }}>
        <a 
          href={doc.fileUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="portal-btn portal-btn-secondary" 
          style={{ padding: '4px 10px', fontSize: '11px' }}
        >
          ⬇️ View & Download
        </a>
      </div>
    </div>
  );
}

// ===== LOADING, EMPTY & ERROR STATES =====

export function PortalLoadingState({ label = 'Loading My Energy platform...' }: { label?: string }) {
  return (
    <div style={{ padding: '60px 20px', textAlign: 'center' }}>
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚡</div>
      <div style={{ fontSize: '14px', color: '#94a3b8', fontWeight: '500' }}>{label}</div>
    </div>
  );
}

export function PortalEmptyState({ 
  icon = '📦', 
  title = 'No records found', 
  description = 'There are no active records in this section yet.',
  actionLabel,
  actionHref,
}: { 
  icon?: string; 
  title?: string; 
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="portal-empty-state">
      <div className="portal-empty-icon">{icon}</div>
      <div style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc' }}>{title}</div>
      <div style={{ fontSize: '13px', color: '#64748b', maxWidth: '400px' }}>{description}</div>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="portal-btn portal-btn-primary" style={{ marginTop: '8px' }}>
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

export function PortalErrorState({ message, retry }: { message: string; retry?: () => void }) {
  return (
    <div className="portal-card" style={{ borderColor: 'rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.05)' }}>
      <div style={{ color: '#f87171', fontWeight: '600', marginBottom: '8px' }}>⚠️ Error Loading Section</div>
      <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 12px' }}>{message}</p>
      {retry && (
        <button onClick={retry} className="portal-btn portal-btn-secondary" style={{ fontSize: '12px' }}>
          Retry
        </button>
      )}
    </div>
  );
}
