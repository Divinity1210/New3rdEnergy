'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { corporateNavigation } from '@/lib/data/navigation';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/Icon';
import { motion, AnimatePresence } from 'motion/react';

export function CorporateHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({});
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const toggleMobileGroup = (label: string) => {
    setMobileExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/[0.06]'
          : 'bg-transparent'
      )}
    >
      <div className="container-wide">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group" aria-label="3RD Energy Group">
            <Image
              src="/logo.png"
              alt="3RD Energy Group"
              width={44}
              height={44}
              className="w-9 h-9 lg:w-10 lg:h-10 transition-transform duration-300 group-hover:scale-105"
              priority
            />
            <div>
              <span className="font-heading font-bold text-base lg:text-lg tracking-[-0.02em] text-white block leading-tight">
                3RD ENERGY
              </span>
              <span className="text-[9px] font-semibold text-white/30 tracking-widest uppercase block">
                Group Holdings
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav ref={navRef} className="hidden lg:flex items-center gap-1" aria-label="Group navigation">
            {corporateNavigation.map((item) => {
              if (item.children) {
                const isOpen = openDropdown === item.label;
                const isItemActive = item.href ? pathname.startsWith(item.href) : false;

                return (
                  <div key={item.label} className="relative">
                    <button
                      onClick={() => setOpenDropdown(isOpen ? null : item.label)}
                      className={cn(
                        'flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium tracking-wide transition-colors relative cursor-pointer',
                        isOpen ? 'text-white' : 'text-white/60 hover:text-white',
                        isItemActive && 'text-white'
                      )}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <Icon
                        name="chevron-down"
                        size={13}
                        className={cn(
                          'transition-transform duration-200 opacity-40',
                          isOpen && 'rotate-180 opacity-100'
                        )}
                      />
                      {isItemActive && (
                        <span className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-primary-600" />
                      )}
                    </button>

                    {/* Dropdown */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.98 }}
                          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute top-full left-0 mt-2.5 w-[420px] bg-white rounded-lg shadow-2xl border border-neutral-200/80 overflow-hidden z-50"
                        >
                          <div className="p-2 space-y-1">
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={() => setOpenDropdown(null)}
                                className="group flex items-start gap-3 p-3 rounded-md hover:bg-neutral-50 transition-colors"
                              >
                                <div className="w-9 h-9 rounded-md bg-neutral-100 flex items-center justify-center shrink-0 group-hover:bg-primary-50 transition-colors mt-0.5">
                                  <Icon
                                    name={child.icon || 'zap'}
                                    size={18}
                                    className="text-neutral-600 group-hover:text-primary-600 transition-colors"
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs font-bold text-neutral-900 group-hover:text-primary-700 transition-colors">
                                      {child.label}
                                    </span>
                                    {child.badge && (
                                      <span className={cn(
                                        "px-1.5 py-0.2 text-[9px] font-semibold rounded",
                                        child.label.includes('Petroleum') ? 'bg-red-50 text-red-700' : 'bg-solar-100 text-solar-700'
                                      )}>
                                        {child.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
                                    {child.description}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>

                          <div className="px-4 py-2.5 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
                            <Link
                              href="/solutions"
                              onClick={() => setOpenDropdown(null)}
                              className="text-xs font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1 transition-colors"
                            >
                              Explore all operating divisions <Icon name="arrow-right" size={12} />
                            </Link>
                            <span className="text-[10px] text-neutral-400 font-mono">HOLDINGS</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-3.5 py-2 text-[13px] font-medium tracking-wide transition-colors relative',
                    'text-white/60 hover:text-white',
                    isActive && 'text-white'
                  )}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-primary-600" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Direct Division Portals */}
          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/solutions/petroleum"
              className="px-3 py-1.5 text-xs font-semibold text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 rounded-md transition-colors flex items-center gap-1.5"
            >
              <Icon name="fuel" size={13} />
              Petroleum
            </Link>
            <Link
              href="/solutions/power-solar"
              className="px-3 py-1.5 text-xs font-semibold text-solar-400 hover:text-solar-300 border border-solar-500/20 hover:border-solar-500/40 rounded-md transition-colors flex items-center gap-1.5"
            >
              <Icon name="sun" size={13} />
              Power & Solar
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.08] rounded-md transition-colors tracking-wide ml-1"
            >
              Executive Desk
            </Link>
          </div>

          {/* Mobile Right Menu Trigger */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              className="p-2 text-white/70 hover:text-white transition-colors cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              <Icon name={mobileOpen ? 'x' : 'menu'} size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 top-16 bg-[#0a0a0a] z-40 overflow-y-auto"
          >
            <nav className="container-wide py-8" aria-label="Mobile group navigation">
              <div className="space-y-1">
                {corporateNavigation.map((item, i) => {
                  const isExpanded = !!mobileExpanded[item.label];

                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.3 }}
                    >
                      {item.children ? (
                        <div>
                          <button
                            onClick={() => toggleMobileGroup(item.label)}
                            className="flex items-center justify-between w-full py-3 text-2xl font-heading font-bold tracking-tight text-white/60 hover:text-white transition-colors cursor-pointer text-left"
                          >
                            <span>{item.label}</span>
                            <Icon
                              name="chevron-down"
                              size={18}
                              className={cn(
                                'transition-transform duration-200 opacity-50',
                                isExpanded && 'rotate-180 opacity-100'
                              )}
                            />
                          </button>
                          {isExpanded && (
                            <div className="ml-3 mb-3 pl-3 border-l border-white/[0.08] space-y-2">
                              {item.children.map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={() => setMobileOpen(false)}
                                  className="flex items-start gap-2.5 py-2 text-sm text-white/50 hover:text-white transition-colors"
                                >
                                  <Icon name={child.icon || 'zap'} size={15} className="text-white/30 mt-0.5 shrink-0" />
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-medium text-white/80">{child.label}</span>
                                      {child.badge && (
                                        <span className="px-1 text-[9px] font-semibold bg-white/10 text-white/70 rounded">
                                          {child.badge}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-white/30 mt-0.5 leading-tight">{child.description}</p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            'block py-3 text-2xl font-heading font-bold tracking-tight transition-colors',
                            pathname === item.href
                              ? 'text-white'
                              : 'text-white/40 hover:text-white/80'
                          )}
                        >
                          {item.label}
                        </Link>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Direct Division Portals in Mobile Drawer */}
              <div className="mt-8 pt-6 border-t border-white/[0.06] space-y-3">
                <p className="text-[11px] font-semibold text-white/30 uppercase tracking-widest">Operating Divisions</p>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/solutions/petroleum"
                    onClick={() => setMobileOpen(false)}
                    className="p-3 rounded bg-red-950/20 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Icon name="fuel" size={14} />
                    3RD Petroleum
                  </Link>
                  <Link
                    href="/solutions/power-solar"
                    onClick={() => setMobileOpen(false)}
                    className="p-3 rounded bg-solar-950/20 border border-solar-500/20 text-solar-400 text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Icon name="sun" size={14} />
                    3RD Power & Solar
                  </Link>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/[0.06] space-y-3">
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-full px-6 py-3.5 text-sm font-semibold text-white bg-primary-700 hover:bg-primary-600 rounded-md transition-colors"
                >
                  Contact Corporate Desk
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
