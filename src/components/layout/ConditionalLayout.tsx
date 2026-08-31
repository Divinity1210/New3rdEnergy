'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { CorporateHeader } from '@/components/layout/CorporateHeader';
import { CorporateFooter } from '@/components/layout/CorporateFooter';
import { PetroleumHeader } from '@/components/layout/PetroleumHeader';
import { PetroleumFooter } from '@/components/layout/PetroleumFooter';
import { PowerHeader } from '@/components/layout/PowerHeader';
import { PowerFooter } from '@/components/layout/PowerFooter';

/**
 * ConditionalLayout — Dynamic multi-entity layout router:
 * 1. 3RD Petroleum: Dedicated petroleum header/footer for /solutions/petroleum and petroleum routes.
 * 2. 3RD Power & Solar: Dedicated power header/footer for /power/* and /solutions/power-solar.
 * 3. 3RD Energy Group: Corporate header/footer for holding-level and public pages.
 */
export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';

  // Routes with their own dedicated app shell (admin, portal, customer assistant)
  const isAdminRoute = pathname.startsWith('/admin');
  const isPortalRoute = pathname.startsWith('/my-energy');
  const isCustomerAssistant = pathname === '/customer-assistant';

  if (isAdminRoute || isPortalRoute || isCustomerAssistant) {
    return <>{children}</>;
  }

  // 1. Standalone Petroleum Division Context
  const isPetroleumDivision =
    pathname.startsWith('/solutions/petroleum') ||
    pathname.startsWith('/petroleum');

  // 2. Standalone Power & Solar Division Context
  const isPowerDivision =
    pathname.startsWith('/power') ||
    pathname === '/solutions/power-solar';

  // Render context-specific header & footer
  if (isPetroleumDivision) {
    return (
      <>
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <PetroleumHeader />
        <main id="main-content" data-division="petroleum">
          {children}
        </main>
        <PetroleumFooter />
      </>
    );
  }

  if (isPowerDivision) {
    return (
      <>
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <PowerHeader />
        <main id="main-content" data-division="power-solar">
          {children}
        </main>
        <PowerFooter />
      </>
    );
  }

  // 3. Default: Corporate Group Holding Context
  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <CorporateHeader />
      <main id="main-content" data-division="corporate">
        {children}
      </main>
      <CorporateFooter />
    </>
  );
}
