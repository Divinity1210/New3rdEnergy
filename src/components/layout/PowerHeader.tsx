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
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 15);
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
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm'
          : 'bg-white/90 backdrop-blur-md border-b border-slate-100'
      )}
    >
      {/* Top Utility Bar for Power & Solar Division */}
      <div className="bg-slate-900 border-b border-slate-800 py-1.5 text-[11px] text-slate-300 hidden sm:block">
        <div className="container-wide flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <Icon name="sun" size={12} className="text-emerald-400" />
              <span>Solar Technical Desk: <strong>+234 1 234 5680</strong></span>
            </span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-300">Tier-1 Inverters · 6,000-Cycle LiFePO4 Storage · Portable Power Stations</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-[11px] text-slate-400 hover:text-white transition-colors flex items-center gap-1 font-medium"
            >
              ← 3RD Energy Services Ltd Group
            </Link>
          </div>
        </div>
      </div>

      <div className="container-wide">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">
          {/* Brand Logo & Division Identifier */}
          <Link href="/solutions/power-solar" className="flex items-center gap-3 shrink-0 group" aria-label="3RD Energy Services Ltd - Solar & Clean Power">
            <Image
              src="/logo.png"
              alt="3RD Energy Services Ltd Logo"
              width={42}
              height={42}
              className="w-9 h-9 lg:w-10 lg:h-10 transition-transform duration-300 group-hover:scale-105"
              priority
            />
            <div>
              <span className="font-heading font-extrabold text-base lg:text-lg tracking-tight text-slate-900 block leading-tight">
                3RD ENERGY SERVICES
              </span>
              <span className="text-[9px] font-bold text-emerald-600 tracking-widest uppercase block">
                Solar & Clean Power Division
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
                        'flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-semibold tracking-wide transition-colors relative cursor-pointer rounded-lg',
                        isOpen
                          ? 'text-emerald-700 bg-emerald-50'
                          : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/70'
                      )}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <Icon
                        name="chevron-down"
                        size={13}
                        className={cn(
                          'transition-transform duration-200 opacity-50',
                          isOpen && 'rotate-180 opacity-100 text-emerald-700'
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
                            'absolute top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden z-50',
                            item.label === 'AI Sizing Tools'
                              ? 'left-1/2 -translate-x-1/2 w-[520px]'
                              : 'left-0 w-[420px]'
                          )}
                        >
                          <div className={cn(
                            'p-3',
                            item.label === 'AI Sizing Tools' ? 'grid grid-cols-2 gap-2' : 'space-y-1.5'
                          )}>
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={() => setOpenDropdown(null)}
                                className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-emerald-50/70 transition-colors"
                              >
                                {child.icon && (
                                  <div className="w-8 h-8 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                    <Icon name={child.icon} size={15} />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[13px] font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                      {child.label}
                                    </span>
                                    {child.badge && (
                                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                                        {child.badge}
                                      </span>
                                    )}
                                  </div>
                                  {child.description && (
                                    <p className="text-[11px] text-slate-500 leading-snug line-clamp-2 mt-0.5">
                                      {child.description}
                                    </p>
                                  )}
                                </div>
                              </Link>
                            ))}
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
                    'px-3.5 py-2 text-[13px] font-semibold tracking-wide transition-colors rounded-lg',
                    isActive
                      ? 'text-emerald-700 bg-emerald-50 font-bold'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/70'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Direct CTA */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <Link
              href="/power/checkout"
              className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 transition-colors"
              aria-label="View shopping cart"
            >
              <Icon name="shopping-cart" size={18} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shadow-md">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Design My System CTA */}
            <Link
              href="/power/builder"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 hover:-translate-y-0.5"
            >
              <Icon name="zap" size={14} />
              Design My System
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100"
              aria-label="Toggle mobile menu"
            >
              <Icon name={mobileOpen ? 'x' : 'menu'} size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-slate-200 px-6 py-6 max-h-[calc(100vh-80px)] overflow-y-auto"
          >
            <div className="space-y-4">
              {powerNavigation.map((item) => (
                <div key={item.label} className="border-b border-slate-100 pb-3">
                  {item.children ? (
                    <div>
                      <button
                        onClick={() => toggleMobileGroup(item.label)}
                        className="flex items-center justify-between w-full text-left font-bold text-slate-900 py-1"
                      >
                        <span>{item.label}</span>
                        <Icon
                          name="chevron-down"
                          size={14}
                          className={cn('transition-transform', mobileExpanded[item.label] && 'rotate-180')}
                        />
                      </button>
                      {mobileExpanded[item.label] && (
                        <div className="mt-2 pl-3 space-y-2 border-l-2 border-emerald-500">
                          {item.children.map((c) => (
                            <Link
                              key={c.href}
                              href={c.href}
                              className="block text-xs font-semibold text-slate-600 hover:text-emerald-700 py-1"
                            >
                              {c.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="block font-bold text-slate-900 hover:text-emerald-700 py-1"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}

              <div className="pt-2">
                <Link
                  href="/power/builder"
                  className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
                >
                  <Icon name="zap" size={14} />
                  Design My Solar System
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
