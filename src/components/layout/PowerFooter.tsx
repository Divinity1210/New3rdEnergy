'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { powerFooter } from '@/lib/data/navigation';
import { Icon } from '@/components/ui/Icon';
import { getWhatsAppUrl } from '@/lib/utils';

export function PowerFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800" role="contentinfo">
      {/* Engineering Support & Sizing Banner */}
      <div className="border-b border-slate-800 bg-slate-900/60">
        <div className="container-wide py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Icon name="sun" size={24} />
            </div>
            <div>
              <p className="text-base font-heading font-bold text-white">Solar Engineering & Turnkey Technical Desk</p>
              <p className="text-xs text-slate-400 mt-0.5">Tier-1 hybrid inverters, 6,000-cycle LiFePO4 battery storage, portable solar generators, and nationwide installation.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`tel:${powerFooter.contact.phone}`}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-md shadow-emerald-600/20"
            >
              <Icon name="phone" size={14} />
              Call Solar Desk: {powerFooter.contact.phone}
            </a>
            <Link
              href="/power/planner"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-xs transition-colors"
            >
              AI Sizing Planner
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="container-wide pt-16 pb-12 lg:pt-20 lg:pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/solutions/power-solar" className="flex items-center gap-3" aria-label="3RD Energy Services Ltd - Solar Division">
              <Image src="/logo.png" alt="3RD Energy Services Ltd Logo" width={38} height={38} className="w-9 h-9" />
              <div>
                <span className="font-heading font-extrabold text-base text-white tracking-tight block leading-tight">
                  3RD ENERGY SERVICES LTD
                </span>
                <span className="text-[9px] font-bold text-emerald-400 tracking-widest uppercase block">
                  Solar & Clean Power Division
                </span>
              </div>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Providing Tier-1 hybrid solar infrastructure, automotive-grade lithium battery storage, high-density portable power banks, and certified turnkey engineering for Nigerian enterprises and homes.
            </p>

            {/* Power Contact Desk */}
            <div className="space-y-1.5 text-xs text-slate-400">
              <p><strong className="text-slate-200">Solar Engineering:</strong> {powerFooter.contact.phone}</p>
              <p><strong className="text-slate-200">Technical Desk:</strong> info@3rdenergyservices.com</p>
              <p><strong className="text-slate-200">Depot Hubs:</strong> Lagos (Ikeja & Lekki) · Abuja (Garki) · Port Harcourt</p>
            </div>

            {/* Power Social Handles */}
            <div className="flex gap-2 pt-2">
              <a
                href={getWhatsAppUrl('Hello 3RD Energy Services Ltd, I need solar & clean power assistance.')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center hover:bg-emerald-900 transition-colors"
                title="WhatsApp Solar Desk"
              >
                <Icon name="whatsapp" size={16} />
              </a>
              <Link
                href="/power/checkout"
                className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center hover:bg-slate-700 hover:text-white transition-colors"
                title="Shopping Cart & Checkout"
              >
                <Icon name="shopping-cart" size={16} />
              </Link>
            </div>
          </div>

          {/* Column 2: Equipment & Portable Power */}
          <div>
            <h4 className="font-heading font-bold text-xs text-white uppercase tracking-wider mb-4 text-emerald-400">
              Equipment Store
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/power/products?category=power-stations" className="text-slate-400 hover:text-white transition-colors font-medium">
                  🔋 Portable Power & Banks
                </Link>
              </li>
              <li>
                <Link href="/power/products?category=inverters" className="text-slate-400 hover:text-white transition-colors">
                  Hybrid Inverters (3.5kVA–50kVA)
                </Link>
              </li>
              <li>
                <Link href="/power/products?category=batteries" className="text-slate-400 hover:text-white transition-colors">
                  LiFePO4 Lithium Storage
                </Link>
              </li>
              <li>
                <Link href="/power/products?category=solar-panels" className="text-slate-400 hover:text-white transition-colors">
                  Tier-1 Monocrystalline PV
                </Link>
              </li>
              <li>
                <Link href="/solutions/power-solar#packages" className="text-slate-400 hover:text-white transition-colors">
                  Turnkey Solar Packages
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Sizing & AI Tools */}
          <div>
            <h4 className="font-heading font-bold text-xs text-white uppercase tracking-wider mb-4 text-emerald-400">
              AI Sizing & Tools
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/power/planner" className="text-slate-400 hover:text-white transition-colors font-medium">
                  ⚡ AI Power Planner
                </Link>
              </li>
              <li>
                <Link href="/power/calculator" className="text-slate-400 hover:text-white transition-colors">
                  Appliance Load Calculator
                </Link>
              </li>
              <li>
                <Link href="/power/builder" className="text-slate-400 hover:text-white transition-colors">
                  Custom System Builder
                </Link>
              </li>
              <li>
                <Link href="/power/savings" className="text-slate-400 hover:text-white transition-colors">
                  Diesel vs Solar ROI Simulator
                </Link>
              </li>
              <li>
                <Link href="/power/concierge" className="text-slate-400 hover:text-white transition-colors">
                  AI Engineering Concierge
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Certified Engineering */}
          <div>
            <h4 className="font-heading font-bold text-xs text-white uppercase tracking-wider mb-4 text-emerald-400">
              Engineering & Support
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/power/installation" className="text-slate-400 hover:text-white transition-colors">
                  Certified Turnkey Installation
                </Link>
              </li>
              <li>
                <Link href="/power/compare" className="text-slate-400 hover:text-white transition-colors">
                  Inverter System Comparison
                </Link>
              </li>
              <li>
                <Link href="/power/learn" className="text-slate-400 hover:text-white transition-colors">
                  Solar Knowledge & Guides
                </Link>
              </li>
              <li>
                <Link href="/solutions/petroleum" className="text-slate-400 hover:text-red-400 transition-colors">
                  🛢️ 3RD Petroleum Division →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} 3RD Energy Services Ltd. All rights reserved. Registered in Nigeria.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <Link href="/" className="hover:text-slate-300 transition-colors">Corporate Holding</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
