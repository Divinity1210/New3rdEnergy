import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { petroleumFooter } from '@/lib/data/navigation';
import { Icon } from '@/components/ui/Icon';
import { getWhatsAppUrl } from '@/lib/utils';

export function PetroleumFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0a] text-neutral-400 border-t border-red-500/20" role="contentinfo">
      {/* 24/7 Logistics Dispatch Banner */}
      <div className="border-b border-red-500/10 bg-red-950/20">
        <div className="container-wide py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-red-900/40 border border-red-500/30 flex items-center justify-center text-red-400">
              <Icon name="fuel" size={20} />
            </div>
            <div>
              <p className="text-sm font-heading font-bold text-white">Commercial Fuel Logistics & Depot Dispatch</p>
              <p className="text-xs text-white/40">Serving industrial plants, mining operations, commercial fleets, and construction sites nationwide.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`tel:${petroleumFooter.contact.phone}`}
              className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <Icon name="phone" size={13} />
              Call Dispatch: {petroleumFooter.contact.phone}
            </a>
            <Link
              href="/quote"
              className="px-4 py-2 rounded-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-white font-semibold text-xs transition-colors"
            >
              Request Quote
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="container-wide pt-16 pb-12 lg:pt-20 lg:pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/solutions/petroleum" className="flex items-center gap-2.5" aria-label="3RD Petroleum Home">
              <Image src="/logo.png" alt="3RD Petroleum" width={36} height={36} className="w-9 h-9" />
              <div>
                <span className="font-heading font-bold text-lg text-white tracking-tight block leading-tight">3RD PETROLEUM</span>
                <span className="text-[9px] font-semibold text-red-400 tracking-widest uppercase block">Fuel Logistics Division</span>
              </div>
            </Link>
            <p className="text-xs text-neutral-500 leading-relaxed max-w-xs">
              {petroleumFooter.description}
            </p>

            {/* Petroleum Contact Desk */}
            <div className="space-y-1.5 text-xs text-white/40">
              <p><strong className="text-white/60">Dispatch Desk:</strong> {petroleumFooter.contact.phone}</p>
              <p><strong className="text-white/60">Commercial Desk:</strong> {petroleumFooter.contact.email}</p>
            </div>

            {/* Petroleum Social Handles */}
            <div className="flex gap-2 pt-2">
              {petroleumFooter.socials.map((soc) => (
                <a
                  key={soc.name}
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-neutral-400 hover:text-red-400 hover:bg-red-950/20 hover:border-red-500/30 transition-all"
                  aria-label={soc.name}
                >
                  <Icon name={soc.icon || 'globe'} size={14} />
                </a>
              ))}
              <a
                href={getWhatsAppUrl(petroleumFooter.contact.whatsappText)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-neutral-400 hover:text-green-400 hover:bg-green-950/20 hover:border-green-500/30 transition-all"
                aria-label="Chat with Petroleum Desk on WhatsApp"
              >
                <Icon name="whatsapp" size={14} />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          {petroleumFooter.columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-[11px] font-semibold text-white/40 uppercase tracking-[0.12em] mb-5">{col.title}</h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-xs text-neutral-500 hover:text-red-400 transition-colors">
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
          <div className="flex items-center gap-3">
            <p className="text-xs text-neutral-600">
              © {currentYear} 3RD Petroleum. An operating division of 3RD Energy Group.
            </p>
            <Link href="/" className="text-xs text-white/30 hover:text-white transition-colors underline decoration-white/20">
              Group Overview
            </Link>
          </div>
          <div className="flex gap-6">
            {petroleumFooter.legal.map((link) => (
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
