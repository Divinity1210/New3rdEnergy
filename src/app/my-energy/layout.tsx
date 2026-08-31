'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { PortalSidebar, PortalMobileNav, PortalLoadingState } from '@/components/portal/PortalComponents';
import { CustomerSession } from '@/lib/types';

export default function MyEnergyLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<CustomerSession | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthPage = pathname === '/my-energy/login' || pathname === '/my-energy/register';

  useEffect(() => {
    if (isAuthPage) {
      setLoading(false);
      return;
    }

    async function checkAuth() {
      try {
        const res = await fetch('/api/portal/auth');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          router.push('/my-energy/login');
        }
      } catch {
        router.push('/my-energy/login');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [pathname, isAuthPage, router]);

  // Auth pages render without shell
  if (isAuthPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="portal-shell" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <PortalLoadingState label="Authenticating customer portal session..." />
      </div>
    );
  }

  return (
    <div className="portal-shell">
      <PortalSidebar user={user} />
      <main className="portal-main">
        {children}
      </main>
      <PortalMobileNav />
    </div>
  );
}
