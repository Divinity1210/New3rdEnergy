import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { footerNavigation, COMPANY_EMAIL, COMPANY_PHONE } from '@/lib/data/navigation';
import { Icon } from '@/components/ui/Icon';
import { getWhatsAppUrl } from '@/lib/utils';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0a] text-neutral-400" role="contentinfo">
      {/* Main Footer */}
      <div className="container-wide pt-16 pb-12 lg:pt-20 lg:pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-5" aria-label="3rd Energy Home">
              <Image src="/logo.png" alt="3rd Energy" width={36} height={36} className="w-9 h-9" />
              <span className="font-heading font-bold text-lg text-white tracking-tight">3RD ENERGY</span>
            </Link>
            <p className="text-sm text-neutral-500 leading-relaxed max-w-xs mb-8">
              Powering business through reliable energy solutions. Trusted petroleum supply, storage, and management for commercial and industrial operations.
            </p>
            <div className="flex gap-2">
              <a
                href={`mailto:${COMPANY_EMAIL}`}
                className="w-9 h-9 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-neutral-500 hover:text-white hover:bg-white/[0.08] transition-all"
                aria-label="Email us"
              >
                <Icon name="mail" size={15} />
              </a>
              <a
                href={`tel:${COMPANY_PHONE}`}
                className="w-9 h-9 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-neutral-500 hover:text-white hover:bg-white/[0.08] transition-all"
                aria-label="Call us"
              >
                <Icon name="phone" size={15} />
              </a>
              <a
                href={getWhatsAppUrl('Hello 3rd Energy, I would like to discuss energy solutions for my business.')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-neutral-500 hover:text-green-400 hover:bg-green-400/10 hover:border-green-400/20 transition-all"
                aria-label="Chat on WhatsApp"
              >
                <Icon name="whatsapp" size={15} />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-[11px] font-semibold text-white/40 uppercase tracking-[0.12em] mb-5">Company</h3>
            <ul className="space-y-3">
              {footerNavigation.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-neutral-500 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions Links */}
          <div>
            <h3 className="text-[11px] font-semibold text-white/40 uppercase tracking-[0.12em] mb-5">Solutions</h3>
            <ul className="space-y-3">
              {footerNavigation.solutions.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-neutral-500 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-[11px] font-semibold text-white/40 uppercase tracking-[0.12em] mb-5">Resources</h3>
            <ul className="space-y-3">
              {footerNavigation.resources.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-neutral-500 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/[0.04]">
        <div className="container-wide py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-600">
            © {currentYear} 3rd Energy. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerNavigation.legal.map((link) => (
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
