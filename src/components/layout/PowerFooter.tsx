import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { powerFooter } from '@/lib/data/navigation';
import { Icon } from '@/components/ui/Icon';
import { getWhatsAppUrl } from '@/lib/utils';

export function PowerFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0a] text-neutral-400 border-t border-solar-500/20" role="contentinfo">
      {/* Engineering Support & Sizing Banner */}
      <div className="border-b border-solar-500/10 bg-solar-950/20">
        <div className="container-wide py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-solar-900/40 border border-solar-500/30 flex items-center justify-center text-solar-400">
              <Icon name="sun" size={20} />
            </div>
            <div>
              <p className="text-sm font-heading font-bold text-white">Clean Energy Engineering & Technical Sizing Desk</p>
              <p className="text-xs text-white/40">Tier-1 hybrid inverters, 6,000-cycle LiFePO4 battery storage, and certified turnkey deployment nationwide.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`tel:${powerFooter.contact.phone}`}
              className="px-4 py-2 rounded-md bg-solar-600 hover:bg-solar-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <Icon name="phone" size={13} />
              Call Solar Desk: {powerFooter.contact.phone}
            </a>
            <Link
              href="/power/planner"
              className="px-4 py-2 rounded-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-white font-semibold text-xs transition-colors"
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
            <Link href="/solutions/power-solar" className="flex items-center gap-2.5" aria-label="3RD Power & Solar Home">
              <Image src="/logo.png" alt="3RD Power & Solar" width={36} height={36} className="w-9 h-9" />
              <div>
                <span className="font-heading font-bold text-lg text-white tracking-tight block leading-tight">3RD POWER & SOLAR</span>
                <span className="text-[9px] font-semibold text-solar-400 tracking-widest uppercase block">Clean Energy Division</span>
              </div>
            </Link>
            <p className="text-xs text-neutral-500 leading-relaxed max-w-xs">
              {powerFooter.description}
            </p>

            {/* Power Contact Desk */}
            <div className="space-y-1.5 text-xs text-white/40">
              <p><strong className="text-white/60">Solar Engineering:</strong> {powerFooter.contact.phone}</p>
              <p><strong className="text-white/60">Technical Desk:</strong> {powerFooter.contact.email}</p>
            </div>

            {/* Power Social Handles */}
            <div className="flex gap-2 pt-2">
              {powerFooter.socials.map((soc) => (
                <a
                  key={soc.name}
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-neutral-400 hover:text-solar-400 hover:bg-solar-950/20 hover:border-solar-500/30 transition-all"
                  aria-label={soc.name}
                >
                  <Icon name={soc.icon || 'globe'} size={14} />
                </a>
              ))}
              <a
                href={getWhatsAppUrl(powerFooter.contact.whatsappText)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-neutral-400 hover:text-green-400 hover:bg-green-950/20 hover:border-green-500/30 transition-all"
                aria-label="Chat with Solar Engineering Desk on WhatsApp"
              >
                <Icon name="whatsapp" size={14} />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          {powerFooter.columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-[11px] font-semibold text-white/40 uppercase tracking-[0.12em] mb-5">{col.title}</h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-xs text-neutral-500 hover:text-solar-400 transition-colors">
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
              © {currentYear} 3RD Power & Solar. An operating division of 3RD Energy Group.
            </p>
            <Link href="/" className="text-xs text-white/30 hover:text-white transition-colors underline decoration-white/20">
              Group Overview
            </Link>
          </div>
          <div className="flex gap-6">
            {powerFooter.legal.map((link) => (
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
