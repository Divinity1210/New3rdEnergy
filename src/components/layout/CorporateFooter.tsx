import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { corporateFooter } from '@/lib/data/navigation';
import { Icon } from '@/components/ui/Icon';

export function CorporateFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0a] text-neutral-400 border-t border-white/[0.04]" role="contentinfo">
      {/* Operating Division Bridges Banner */}
      <div className="border-b border-white/[0.04] bg-white/[0.01]">
        <div className="container-wide py-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 rounded-lg border border-red-500/20 bg-red-950/10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Icon name="fuel" size={16} className="text-red-400" />
                  <span className="text-sm font-heading font-bold text-white">3RD Petroleum Division</span>
                </div>
                <p className="text-xs text-white/40 mt-1">Bulk fuel logistics, storage tanks, and commercial procurement.</p>
              </div>
              <Link
                href="/solutions/petroleum"
                className="px-3.5 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-colors shrink-0 flex items-center gap-1"
              >
                Access Division <Icon name="arrow-right" size={12} />
              </Link>
            </div>

            <div className="p-5 rounded-lg border border-solar-500/20 bg-solar-950/10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Icon name="sun" size={16} className="text-solar-400" />
                  <span className="text-sm font-heading font-bold text-white">3RD Power & Solar Division</span>
                </div>
                <p className="text-xs text-white/40 mt-1">Hybrid inverters, LiFePO4 batteries, and turnkey engineering.</p>
              </div>
              <Link
                href="/solutions/power-solar"
                className="px-3.5 py-1.5 rounded bg-solar-600 hover:bg-solar-500 text-white font-semibold text-xs transition-colors shrink-0 flex items-center gap-1"
              >
                Access Division <Icon name="arrow-right" size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="container-wide pt-16 pb-12 lg:pt-20 lg:pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2.5" aria-label="3RD Energy Group Home">
              <Image src="/logo.png" alt="3RD Energy Group" width={36} height={36} className="w-9 h-9" />
              <div>
                <span className="font-heading font-bold text-lg text-white tracking-tight block leading-tight">3RD ENERGY</span>
                <span className="text-[9px] font-semibold text-white/30 tracking-widest uppercase block">Group Holdings</span>
              </div>
            </Link>
            <p className="text-xs text-neutral-500 leading-relaxed max-w-xs">
              {corporateFooter.description}
            </p>

            {/* Corporate Group Contact */}
            <div className="space-y-1.5 text-xs text-white/40">
              <p><strong className="text-white/60">Executive Office:</strong> {corporateFooter.contact.phone}</p>
              <p><strong className="text-white/60">Inquiries:</strong> {corporateFooter.contact.email}</p>
            </div>

            {/* Group Social Handles */}
            <div className="flex gap-2 pt-2">
              {corporateFooter.socials.map((soc) => (
                <a
                  key={soc.name}
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-all"
                  aria-label={soc.name}
                >
                  <Icon name={soc.icon || 'globe'} size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {corporateFooter.columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-[11px] font-semibold text-white/40 uppercase tracking-[0.12em] mb-5">{col.title}</h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-xs text-neutral-500 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/[0.04]">
        <div className="container-wide py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-600">
            © {currentYear} 3RD Energy Group Holdings. All rights reserved.
          </p>
          <div className="flex gap-6">
            {corporateFooter.legal.map((link) => (
              <Link key={link.href} href={link.href} className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
