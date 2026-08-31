'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/power/CartContext';
import { Icon } from '@/components/ui/Icon';
import { formatCurrency } from '@/lib/utils';

export function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    installationRequested,
    installationFeeEstimate,
    total,
    isCartOpen,
    closeCart,
    removeItem,
    updateQuantity,
    toggleInstallation,
    clearCart,
  } = useCart();

  // Prevent background scroll when cart drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const hasIncludedInstallation = items.some(
    (item) => item.packageDetails?.includesInstallation
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-neutral-900/95 border-l border-white/10 text-white shadow-2xl backdrop-blur-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-400 flex items-center justify-center">
                <Icon name="warehouse" size={20} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-white">Power System Cart</h3>
                <p className="text-xs text-neutral-400">{itemCount} {itemCount === 1 ? 'item' : 'items'} configured</p>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Close cart"
            >
              <Icon name="x" size={20} />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-neutral-500">
                  <Icon name="warehouse" size={28} />
                </div>
                <h4 className="text-base font-bold text-white mb-1">Your cart is empty</h4>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto mb-6">
                  Browse our inverters, lithium batteries, and complete solar packages to build your system.
                </p>
                <Link
                  href="/power/products"
                  onClick={closeCart}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary-600 to-amber-500 text-white font-semibold text-xs hover:opacity-90 transition-opacity shadow-lg shadow-primary-950/50"
                >
                  Explore Power Products
                  <Icon name="arrow-right" size={14} />
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex gap-3.5 items-start"
                >
                  {/* Thumbnail / Category Icon */}
                  <div className="w-16 h-16 rounded-xl bg-neutral-800 border border-white/10 overflow-hidden relative shrink-0 flex items-center justify-center">
                    {item.product.image ? (
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <Icon name="sun" size={24} className="text-primary-400" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-xs sm:text-sm text-white line-clamp-2 leading-snug">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-neutral-500 hover:text-red-400 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Icon name="x" size={14} />
                      </button>
                    </div>

                    <p className="text-[11px] text-primary-400 font-medium mt-0.5">
                      {formatCurrency(item.unitPrice)}
                    </p>

                    {item.isPackage && (
                      <span className="inline-block px-2 py-0.5 mt-1 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] font-semibold text-amber-300">
                        Turnkey Package
                      </span>
                    )}

                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="inline-flex items-center border border-white/15 rounded-lg bg-black/30">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-1 text-xs text-neutral-400 hover:text-white hover:bg-white/10 transition-colors rounded-l-lg"
                        >
                          -
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-xs text-neutral-400 hover:text-white hover:bg-white/10 transition-colors rounded-r-lg"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-bold text-white">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Installation Toggle Option */}
            {items.length > 0 && !hasIncludedInstallation && (
              <div className="p-4 rounded-2xl bg-primary-950/30 border border-primary-500/20">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={installationRequested}
                    onChange={toggleInstallation}
                    className="mt-0.5 rounded text-primary-600 focus:ring-primary-500 bg-neutral-800 border-white/20"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-white block">
                      Include Certified Turnkey Installation
                    </span>
                    <span className="text-neutral-400 block mt-0.5">
                      Professional wiring, surge protection, earthing & commissioning by certified 3rd Energy engineers (+{formatCurrency(installationFeeEstimate)}).
                    </span>
                  </div>
                </label>
              </div>
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-neutral-950/80 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Equipment Subtotal</span>
                  <span className="font-medium text-white">{formatCurrency(subtotal)}</span>
                </div>
                {installationFeeEstimate > 0 && (
                  <div className="flex justify-between text-neutral-400">
                    <span>Estimated Installation</span>
                    <span className="font-medium text-amber-400">+{formatCurrency(installationFeeEstimate)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                  <span>Estimated Total</span>
                  <span className="text-gradient-brand text-base">{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Link
                  href="/power/checkout"
                  onClick={closeCart}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-primary-600 via-orange-500 to-amber-500 text-white font-bold text-xs sm:text-sm hover:opacity-95 transition-opacity shadow-lg shadow-primary-950/50 flex items-center justify-center gap-2"
                >
                  <Icon name="check-circle" size={16} />
                  Proceed to Checkout
                </Link>

                <div className="flex gap-2">
                  <Link
                    href="/quote"
                    onClick={closeCart}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 text-center text-xs font-semibold transition-colors"
                  >
                    Request B2B Invoice Quote
                  </Link>
                  <button
                    onClick={clearCart}
                    className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 text-xs font-semibold transition-colors"
                    title="Clear cart"
                  >
                    <Icon name="x" size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
