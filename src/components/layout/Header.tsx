'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { mainNavigation } from '@/lib/data/navigation';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/Icon';
import { useCart } from '@/components/power/CartContext';
import { motion, AnimatePresence } from 'motion/react';

export function Header() {
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

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  // Click outside to close dropdowns
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
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group" aria-label="3rd Energy Home">
            <Image
              src="/logo.png"
              alt="3rd Energy"
              width={44}
              height={44}
              className="w-9 h-9 lg:w-10 lg:h-10 transition-transform duration-300 group-hover:scale-105"
              priority
            />
            <span className="font-heading font-bold text-base lg:text-lg tracking-[-0.02em] text-white">
              3RD ENERGY
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav ref={navRef} className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">
            {mainNavigation.map((item) => {
              if (item.children) {
                const isOpen = openDropdown === item.label;
                const isItemActive = item.href ? pathname.startsWith(item.href) : false;

                return (
                  <div key={item.label} className="relative">
                    <button
                      onClick={() => setOpenDropdown(isOpen ? null : item.label)}
                      className={cn(
                        'flex items-center gap-1 px-3.5 py-2 text-[13px] font-medium tracking-wide transition-colors relative cursor-pointer',
                        isOpen ? 'text-white' : 'text-white/60 hover:text-white',
                        isItemActive && 'text-white'
                      )}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <Icon
                        name="chevron-down"
                        size={14}
                        className={cn(
                          'transition-transform duration-200 opacity-50',
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
                          className={cn(
                            'absolute top-full mt-2.5 bg-white rounded-lg shadow-2xl border border-neutral-200/80 overflow-hidden z-50',
                            item.label === 'Power Platform'
                              ? 'left-1/2 -translate-x-1/2 w-[520px]'
                              : 'left-0 w-[380px]'
                          )}
                        >
                          <div className={cn(
                            'p-2.5',
                            item.label === 'Power Platform' ? 'grid grid-cols-2 gap-1' : 'space-y-1'
                          )}>
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={() => setOpenDropdown(null)}
                                className="group flex items-start gap-2.5 p-2.5 rounded-md hover:bg-neutral-50 transition-colors"
                              >
                                <div className="w-8 h-8 rounded-md bg-neutral-100 flex items-center justify-center shrink-0 group-hover:bg-primary-50 transition-colors mt-0.5">
                                  <Icon
                                    name={child.icon || 'zap'}
                                    size={16}
                                    className="text-neutral-500 group-hover:text-primary-600 transition-colors"
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-xs font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors truncate">
                                      {child.label}
                                    </span>
                                    {child.badge && (
                                      <span className="px-1 py-0.2 text-[9px] font-semibold bg-solar-100 text-solar-700 rounded shrink-0">
                                        {child.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed line-clamp-2">
                                    {child.description}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>

                          <div className="px-4 py-2.5 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
                            <Link
                              href={item.href || '/solutions'}
                              onClick={() => setOpenDropdown(null)}
                              className="text-xs font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1 transition-colors"
                            >
                              Explore all {item.label.toLowerCase()} <Icon name="arrow-right" size={12} />
                            </Link>
                            <span className="text-[10px] text-neutral-400 font-mono">3RD ENERGY</span>
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

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <CartHeaderButton />
            <Link
              href="/quote"
              className="inline-flex items-center px-5 py-2 text-[13px] font-semibold text-white bg-primary-700 hover:bg-primary-600 rounded-md transition-colors tracking-wide"
            >
              Get a Quote
            </Link>
          </div>

          {/* Mobile Right Actions */}
          <div className="lg:hidden flex items-center gap-1.5">
            <CartHeaderButton />
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
            <nav className="container-wide py-8" aria-label="Mobile navigation">
              <div className="space-y-1">
                {mainNavigation.map((item, i) => {
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

              <div className="mt-10 pt-8 border-t border-white/[0.06] space-y-3">
                <Link
                  href="/quote"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-full px-6 py-3.5 text-sm font-semibold text-white bg-primary-700 hover:bg-primary-600 rounded-md transition-colors"
                >
                  Get a Quote
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-full px-6 py-3.5 text-sm font-semibold text-white/60 border border-white/10 hover:border-white/20 hover:text-white rounded-md transition-colors"
                >
                  Talk to 3rd Energy
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function CartHeaderButton() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return <CartHeaderButtonInner mounted={mounted} />;
}

function CartHeaderButtonInner({ mounted }: { mounted: boolean }) {
  let itemCount = 0;
  let openCart = () => {};

  try {
    const cart = useCart();
    itemCount = cart.itemCount;
    openCart = cart.openCart;
  } catch {
    // If not within CartProvider, fallback gracefully
  }

  return (
    <button
      onClick={openCart}
      className="relative p-2 text-white/50 hover:text-white transition-colors cursor-pointer"
      aria-label="Open shopping cart"
    >
      <Icon name="warehouse" size={18} />
      {mounted && itemCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary-600 text-white text-[9px] font-bold flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </button>
  );
}
