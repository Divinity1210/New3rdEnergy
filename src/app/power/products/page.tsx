'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@/components/ui/Icon';
import { powerProducts, powerPackages } from '@/lib/data/power-products';
import { useCart } from '@/components/power/CartContext';
import { formatCurrency } from '@/lib/utils';
import { PowerCategory } from '@/lib/types';

export default function PowerProductsPage() {
  const { addItem, addPackage } = useCart();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories: { id: string; label: string; icon: string }[] = [
    { id: 'all', label: 'All Equipment', icon: 'grid' },
    { id: 'inverters', label: 'Hybrid Inverters', icon: 'zap' },
    { id: 'batteries', label: 'LiFePO4 Storage', icon: 'warehouse' },
    { id: 'solar-panels', label: 'Solar PV Panels', icon: 'sun' },
    { id: 'power-stations', label: 'Power Stations', icon: 'sparkles' },
    { id: 'accessories', label: 'Protection & EMS', icon: 'settings' },
    { id: 'packages', label: 'Turnkey Packages', icon: 'shield' },
  ];

  // Filtering products
  const filteredProducts = powerProducts.filter((product) => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.tagline?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const showPackages = activeCategory === 'all' || activeCategory === 'packages';
  const filteredPackages = showPackages
    ? powerPackages.filter((pkg) =>
        !searchQuery ||
        pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pkg.tagline?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        pkg.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="bg-neutral-950 text-white min-h-screen pt-32 pb-24 lg:pt-40">
      <div className="container-wide">
        {/* Header Title */}
        <div className="text-center space-y-3 mb-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-solar-500/10 border border-solar-500/20 text-solar-400 text-xs font-semibold">
            <Icon name="warehouse" size={14} />
            Certified Power Equipment
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-white">
            Shop Power & <span className="text-solar-400">Solar Solutions.</span>
          </h1>
          <p className="text-sm text-neutral-400">
            Engineered hybrid inverters, automotive-grade LiFePO4 battery modules, Tier-1 solar panels, and pre-configured turnkey energy systems.
          </p>
        </div>

        {/* Search & Category Filter Pills Bar */}
        <div className="space-y-4 mb-10">
          {/* Search Input */}
          <div className="max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="Search by keyword, voltage, or capacity (e.g. 5kVA, LiFePO4, 550W)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3.5 pl-12 rounded-full bg-neutral-900/90 border border-white/15 text-white text-xs sm:text-sm placeholder:text-neutral-500 focus:border-amber-400 focus:outline-none backdrop-blur-md shadow-lg"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
              <Icon name="search" size={18} />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                <Icon name="x" size={16} />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all flex items-center gap-2 ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-primary-600 to-amber-500 text-white border-transparent shadow-lg shadow-primary-950/40'
                    : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
                }`}
              >
                <Icon name={cat.icon || 'grid'} size={14} />
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* ===== TURNKEY PACKAGES SECTION (IF ACTIVE) ===== */}
        {showPackages && filteredPackages.length > 0 && (
          <div className="mb-14 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="font-heading font-bold text-xl text-white">
                  Turnkey Power Packages
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Complete systems including Inverter, Battery, Solar Array & Certified Installation.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-solar-500/10 border border-solar-500/30 text-solar-300 text-xs font-bold">
                {filteredPackages.length} Packages
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {filteredPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="rounded-lg bg-neutral-900 border border-white/10 overflow-hidden flex flex-col justify-between hover:border-solar-500/40 transition-all group shadow-xl"
                >
                  <div>
                    <div className="h-48 relative overflow-hidden bg-neutral-800">
                      <Image
                        src={pkg.image}
                        alt={pkg.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
                      <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-neutral-950/80 backdrop-blur-md border border-white/20 text-[10px] font-bold text-solar-400 uppercase">
                        {pkg.tier}
                      </span>
                    </div>

                    <div className="p-6 space-y-3">
                      <h3 className="font-heading font-bold text-base text-white group-hover:text-solar-400 transition-colors line-clamp-2">
                        {pkg.name}
                      </h3>
                      <p className="text-xs text-neutral-400 line-clamp-2">{pkg.tagline}</p>

                      <div className="grid grid-cols-3 gap-1.5 py-2.5 border-y border-white/10 text-center text-xs">
                        <div className="p-1.5 rounded-lg bg-white/[0.02]">
                          <span className="font-bold text-white block">{pkg.ratingKva}kVA</span>
                          <span className="text-[10px] text-neutral-500">Inverter</span>
                        </div>
                        <div className="p-1.5 rounded-lg bg-white/[0.02]">
                          <span className="font-bold text-solar-400 block">{pkg.batteryKwh}kWh</span>
                          <span className="text-[10px] text-neutral-500">LiFePO4</span>
                        </div>
                        <div className="p-1.5 rounded-lg bg-white/[0.02]">
                          <span className="font-bold text-white block">{pkg.solarKwp}kWp</span>
                          <span className="text-[10px] text-neutral-500">Solar PV</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 space-y-2">
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-xs text-neutral-400">Turnkey Total</span>
                      <span className="text-lg font-bold text-solar-400">
                        {formatCurrency(pkg.price)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => addPackage(pkg)}
                        className="py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-amber-500 text-white font-bold text-xs hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5"
                      >
                        <Icon name="warehouse" size={14} />
                        Add to Cart
                      </button>
                      <Link
                        href={`/power/builder?package=${pkg.slug}`}
                        className="py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-xs text-center flex items-center justify-center gap-1"
                      >
                        <Icon name="settings" size={14} />
                        Customize
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== INDIVIDUAL PRODUCTS GRID ===== */}
        {activeCategory !== 'packages' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="font-heading font-bold text-xl text-white">
                  Individual Equipment & Components
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Showing {filteredProducts.length} verified products.
                </p>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white/[0.02] rounded-lg border border-white/10">
                <Icon name="search" size={32} className="mx-auto mb-3 text-neutral-500" />
                <h3 className="font-bold text-white text-base">No products match your search</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Try adjusting your keywords or clearing the category filter.
                </p>
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    setSearchQuery('');
                  }}
                  className="mt-4 px-5 py-2 rounded-full bg-white/10 text-white text-xs font-semibold hover:bg-white/15"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="rounded-lg bg-neutral-900/80 border border-white/10 overflow-hidden flex flex-col justify-between hover:border-solar-500/40 transition-all group shadow-xl"
                  >
                    <div>
                      {/* Product Thumbnail */}
                      <Link
                        href={`/power/products/${product.slug}`}
                        className="block h-52 relative overflow-hidden bg-neutral-800"
                      >
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span className="px-2.5 py-1 rounded-full bg-neutral-950/80 backdrop-blur-md border border-white/15 text-[10px] font-bold text-white uppercase">
                            {product.category}
                          </span>
                        </div>
                      </Link>

                      {/* Content */}
                      <div className="p-6 space-y-3">
                        <Link href={`/power/products/${product.slug}`} className="block">
                          <h3 className="font-heading font-bold text-base text-white group-hover:text-solar-400 transition-colors line-clamp-2 leading-snug">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                          {product.tagline}
                        </p>

                        {/* Specs Pill Summary */}
                        <div className="space-y-1.5 pt-2">
                          {product.specs.continuousPower && (
                            <div className="flex justify-between text-xs text-neutral-400">
                              <span>Output:</span>
                              <span className="text-white font-medium">{product.specs.continuousPower}</span>
                            </div>
                          )}
                          {product.specs.capacity && (
                            <div className="flex justify-between text-xs text-neutral-400">
                              <span>Storage:</span>
                              <span className="text-solar-400 font-medium">{product.specs.capacity}</span>
                            </div>
                          )}
                          {product.specs.warranty && (
                            <div className="flex justify-between text-xs text-neutral-400">
                              <span>Warranty:</span>
                              <span className="text-green-400 font-medium">{product.specs.warranty}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Price and Cart Actions */}
                    <div className="p-6 pt-0 space-y-3">
                      <div className="flex items-baseline justify-between border-t border-white/10 pt-3">
                        <span className="text-xs text-neutral-400">Price</span>
                        <span className="text-xl font-bold text-white">
                          {formatCurrency(product.price)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => addItem(product)}
                          className="py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-amber-500 text-white font-bold text-xs hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5"
                        >
                          <Icon name="warehouse" size={14} />
                          Add to Cart
                        </button>
                        <Link
                          href={`/power/products/${product.slug}`}
                          className="py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-neutral-200 font-semibold text-xs text-center flex items-center justify-center gap-1"
                        >
                          View Specs
                          <Icon name="arrow-right" size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
