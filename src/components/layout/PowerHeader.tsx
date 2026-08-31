'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { powerNavigation } from '@/lib/data/navigation';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/Icon';
import { useCart } from '@/components/power/CartContext';
import { motion, AnimatePresence } from 'motion/react';

export function PowerHeader() {
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
          ? 'bg-[#0a0a0a]/95 backdrop-blur-md border-b border-solar-500/20'
          : 'bg-transparent'
      )}
    >
      {/* Top Utility Bar for Power & Solar Division */}
      <div className="bg-solar-950/40 border-b border-solar-500/15 py-1 text-[11px] text-solar-200/80 hidden sm:block">
        <div className="container-wide flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Icon name="sun" size={11} className="text-solar-400" />
              <span>Solar Engineering Desk: <strong>+234 1 234 5680</strong></span>
            </span>
            <span className="text-solar-500/40">|</span>
            <span>Tier-1 Inverters · 6,000-Cycle LiFePO4 Storage · Nationwide Turnkey</span>
          </div>
          <Link
            href="/"
            className="text-[11px] text-white/50 hover:text-white transition-colors flex items-center gap-1"
          >
            ← Return to 3RD Energy Group
          </Link>
        </div>
      </div>

      <div className="container-wide">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">
          {/* Brand Logo & Division Identifier */}
          <Link href="/solutions/power-solar" className="flex items-center gap-2.5 shrink-0 group" aria-label="3RD Power & Solar">
            <Image
              src="/logo.png"
              alt="3RD Power & Solar"
              width={44}
              height={44}
              className="w-9 h-9 lg:w-10 lg:h-10 transition-transform duration-300 group-hover:scale-105"
              priority
            />
            <div>
              <span className="font-heading font-bold text-base lg:text-lg tracking-[-0.02em] text-white block leading-tight">
                3RD POWER & SOLAR
              </span>
              <span className="text-[9px] font-semibold text-solar-400 tracking-widest uppercase block">
                Clean Energy Division
              </span>
            </div>
          </Link>

          {/* Desktop Navigation (Power & Solar-Only) */}
          <nav ref={navRef} className="hidden lg:flex items-center gap-1" aria-label="Power & Solar navigation">
            {powerNavigation.map((item) => {
              if (item.children) {
                const isOpen = openDropdown === item.label;

                return (
                  <div key={item.label} className="relative">
                    <button
                      onClick={() => setOpenDropdown(isOpen ? null : item.label)}
                      className={cn(
                        'flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium tracking-wide transition-colors relative cursor-pointer',
                        isOpen ? 'text-white' : 'text-white/60 hover:text-white'
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
                    </button>

                    {/* Dropdown */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.98 }}
                          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                          className={cn(
                            'absolute top-full mt-2.5 bg-white rounded-lg shadow-2xl border border-neutral-200/80 overflow-hidden z-50',
                            item.label === 'AI Sizing Tools'
                              ? 'left-1/2 -translate-x-1/2 w-[520px]'
                              : 'left-0 w-[420px]'
                          )}
                        >
                          <div className={cn(
                            'p-2.5',
                            item.label === 'AI Sizing Tools' ? 'grid grid-cols-2 gap-1' : 'space-y-1'
                          )}>
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={() => setOpenDropdown(null)}
                                className="group flex items-start gap-2.5 p-2.5 rounded-md hover:bg-solar-50/60 transition-colors"
                              >
                                <div className="w-8 h-8 rounded-md bg-solar-100/60 flex items-center justify-center shrink-0 group-hover:bg-solar-100 transition-colors mt-0.5">
                                  <Icon
                                    name={child.icon || 'zap'}
                                    size={16}
                                    className="text-solar-700 group-hover:text-solar-800 transition-colors"
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-xs font-bold text-neutral-900 group-hover:text-solar-800 transition-colors truncate">
                                      {child.label}
                                    </span>
                                    {child.badge && (
                                      <span className="px-1 py-0.2 text-[9px] font-semibold bg-solar-100 text-solar-700 rounded shrink-0">
                                        {child.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed line-clamp-2">
                                    {child.description}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>

                          <div className="px-4 py-2.5 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
                            <Link
                              href={item.href || '/power/products'}
                              onClick={() => setOpenDropdown(null)}
                              className="text-xs font-semibold text-solar-700 hover:text-solar-800 inline-flex items-center gap-1 transition-colors"
                            >
                              Explore {item.label.toLowerCase()} <Icon name="arrow-right" size={12} />
                            </Link>
                            <span className="text-[10px] text-neutral-400 font-mono">POWER & SOLAR</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3.5 py-2 text-[13px] font-medium tracking-wide text-white/60 hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Actions (Cart & System Builder) */}
          <div className="hidden lg:flex items-center gap-3">
            <PowerCartHeaderButton />
            <Link
              href="/power/builder"
              className="inline-flex items-center gap-2 px-5 py-2 text-[13px] font-semibold text-[#0a0a0a] bg-solar-500 hover:bg-solar-400 rounded-md transition-colors tracking-wide"
            >
              <Icon name="settings" size={14} />
              Design My System
            </Link>
          </div>

          {/* Mobile Right Actions */}
          <div className="lg:hidden flex items-center gap-1.5">
            <PowerCartHeaderButton />
            <button
              className="p-2 text-white/70 hover:text-white transition-colors cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close power menu' : 'Open power menu'}
              aria-expanded={mobileOpen}
            >
              <Icon name={mobileOpen ? 'x' : 'menu'} size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu for Power & Solar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 top-16 bg-[#0a0a0a] z-40 overflow-y-auto"
          >
            <nav className="container-wide py-8" aria-label="Mobile power navigation">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
                <span className="text-xs font-semibold text-solar-400 uppercase tracking-wider">3RD Power & Solar Menu</span>
                <Link href="/" className="text-xs text-white/40 hover:text-white">
                  ← Group Overview
                </Link>
              </div>

              <div className="space-y-1">
                {powerNavigation.map((item, i) => {
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
                            <div className="ml-3 mb-3 pl-3 border-l border-solar-500/20 space-y-2">
                              {item.children.map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={() => setMobileOpen(false)}
                                  className="flex items-start gap-2.5 py-2 text-sm text-white/50 hover:text-white transition-colors"
                                >
                                  <Icon name={child.icon || 'zap'} size={15} className="text-solar-400/60 mt-0.5 shrink-0" />
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-medium text-white/80">{child.label}</span>
                                      {child.badge && (
                                        <span className="px-1 text-[9px] font-semibold bg-solar-900/50 text-solar-400 border border-solar-500/20 rounded">
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
                          className="block py-3 text-2xl font-heading font-bold tracking-tight text-white/60 hover:text-white transition-colors"
                        >
                          {item.label}
                        </Link>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-8 pt-6 border-t border-white/[0.06] space-y-3">
                <Link
                  href="/power/builder"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-full px-6 py-3.5 text-sm font-semibold text-[#0a0a0a] bg-solar-500 hover:bg-solar-400 rounded-md transition-colors"
                >
                  Design My Solar System
                </Link>
                <div className="text-center pt-2">
                  <p className="text-xs text-white/30">Solar Engineering Desk:</p>
                  <p className="text-sm font-bold text-solar-400 mt-0.5">+234 1 234 5680</p>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function PowerCartHeaderButton() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return <PowerCartHeaderButtonInner mounted={mounted} />;
}

function PowerCartHeaderButtonInner({ mounted }: { mounted: boolean }) {
  let itemCount = 0;
  let openCart = () => {};

  try {
    const cart = useCart();
    itemCount = cart.itemCount;
    openCart = cart.openCart;
  } catch {
    // Graceful fallback
  }

  return (
    <button
      onClick={openCart}
      className="relative p-2 text-white/50 hover:text-white transition-colors cursor-pointer"
      aria-label="Open solar equipment cart"
    >
      <Icon name="warehouse" size={18} />
      {mounted && itemCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-solar-600 text-white text-[9px] font-bold flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </button>
  );
}
