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
    { id: 'power-stations', label: 'Portable Power & Banks', icon: 'sparkles' },
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
    <div className="bg-neutral-50 text-neutral-900 min-h-screen pt-32 pb-24 lg:pt-40">
      <div className="container-wide">
        {/* Header Title */}
        <div className="text-center space-y-3 mb-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-solar-50 border border-solar-200 text-solar-700 text-xs font-semibold">
            <Icon name="warehouse" size={14} />
            Certified Power Equipment
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-neutral-900">
            Shop Power & <span className="text-solar-600">Solar Solutions.</span>
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
              className="w-full px-5 py-3.5 pl-12 rounded-2xl bg-white border border-neutral-200 text-neutral-900 text-xs sm:text-sm placeholder:text-neutral-400 focus:border-solar-400 focus:ring-2 focus:ring-solar-100 focus:outline-none shadow-sm"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
              <Icon name="search" size={18} />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-neutral-600"
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
                    ? 'bg-solar-600 text-white border-solar-600 shadow-sm shadow-solar-600/20'
                    : 'bg-white border-neutral-200 text-neutral-500 hover:text-neutral-800 hover:border-neutral-300'
                }`}
              >
                <Icon name={cat.icon || 'grid'} size={14} />
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* ===== TURNKEY PACKAGES SECTION ===== */}
        {showPackages && filteredPackages.length > 0 && (
          <div className="mb-14 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <div>
                <h2 className="font-heading font-bold text-xl text-neutral-900">
                  Turnkey Power Packages
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Complete systems including Inverter, Battery, Solar Array & Certified Installation.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-solar-50 border border-solar-200 text-solar-700 text-xs font-bold">
                {filteredPackages.length} Packages
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {filteredPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="rounded-2xl bg-white border border-neutral-200 overflow-hidden flex flex-col justify-between hover:border-solar-300 hover:shadow-xl hover:shadow-solar-100/40 transition-all group"
                >
                  <div>
                    <div className="h-48 relative overflow-hidden bg-neutral-100">
                      <Image
                        src={pkg.image}
                        alt={pkg.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent" />
                      <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-neutral-200 text-[10px] font-bold text-solar-700 uppercase">
                        {pkg.tier}
                      </span>
                    </div>

                    <div className="p-6 space-y-3">
                      <h3 className="font-heading font-bold text-base text-neutral-900 group-hover:text-solar-700 transition-colors line-clamp-2">
                        {pkg.name}
                      </h3>
                      <p className="text-xs text-neutral-400 line-clamp-2">{pkg.tagline}</p>

                      <div className="grid grid-cols-3 gap-1.5 py-2.5 border-y border-neutral-100 text-center text-xs">
                        <div className="p-1.5 rounded-lg bg-neutral-50">
                          <span className="font-bold text-neutral-900 block">{pkg.ratingKva}kVA</span>
                          <span className="text-[10px] text-neutral-400">Inverter</span>
                        </div>
                        <div className="p-1.5 rounded-lg bg-solar-50">
                          <span className="font-bold text-solar-700 block">{pkg.batteryKwh}kWh</span>
                          <span className="text-[10px] text-neutral-400">LiFePO4</span>
                        </div>
                        <div className="p-1.5 rounded-lg bg-neutral-50">
                          <span className="font-bold text-neutral-900 block">{pkg.solarKwp}kWp</span>
                          <span className="text-[10px] text-neutral-400">Solar PV</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 space-y-2">
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-xs text-neutral-400">Turnkey Total</span>
                      <span className="text-lg font-bold text-solar-700">
                        {formatCurrency(pkg.price)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => addPackage(pkg)}
                        className="py-2.5 rounded-xl bg-solar-600 hover:bg-solar-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-solar-600/20"
                      >
                        <Icon name="warehouse" size={14} />
                        Add to Cart
                      </button>
                      <Link
                        href={`/power/builder?package=${pkg.slug}`}
                        className="py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 font-semibold text-xs text-center flex items-center justify-center gap-1"
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
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <div>
                <h2 className="font-heading font-bold text-xl text-neutral-900">
                  Individual Equipment & Components
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Showing {filteredProducts.length} verified products.
                </p>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200">
                <Icon name="search" size={32} className="mx-auto mb-3 text-neutral-300" />
                <h3 className="font-bold text-neutral-900 text-base">No products match your search</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Try adjusting your keywords or clearing the category filter.
                </p>
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    setSearchQuery('');
                  }}
                  className="mt-4 px-5 py-2 rounded-full bg-neutral-100 text-neutral-700 text-xs font-semibold hover:bg-neutral-200"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="rounded-2xl bg-white border border-neutral-200 overflow-hidden flex flex-col justify-between hover:border-solar-300 hover:shadow-xl hover:shadow-solar-100/40 transition-all group"
                  >
                    <div>
                      {/* Product Thumbnail */}
                      <Link
                        href={`/power/products/${product.slug}`}
                        className="block h-52 relative overflow-hidden bg-neutral-100"
                      >
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-neutral-200 text-[10px] font-bold text-neutral-600 uppercase">
                            {product.category}
                          </span>
                        </div>
                      </Link>

                      {/* Content */}
                      <div className="p-6 space-y-3">
                        <Link href={`/power/products/${product.slug}`} className="block">
                          <h3 className="font-heading font-bold text-base text-neutral-900 group-hover:text-solar-700 transition-colors line-clamp-2 leading-snug">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                          {product.tagline}
                        </p>

                        {/* Specs Summary */}
                        <div className="space-y-1.5 pt-2">
                          {product.specs.continuousPower && (
                            <div className="flex justify-between text-xs text-neutral-400">
                              <span>Output:</span>
                              <span className="text-neutral-900 font-medium">{product.specs.continuousPower}</span>
                            </div>
                          )}
                          {product.specs.capacity && (
                            <div className="flex justify-between text-xs text-neutral-400">
                              <span>Storage:</span>
                              <span className="text-solar-700 font-medium">{product.specs.capacity}</span>
                            </div>
                          )}
                          {product.specs.warranty && (
                            <div className="flex justify-between text-xs text-neutral-400">
                              <span>Warranty:</span>
                              <span className="text-solar-600 font-medium">{product.specs.warranty}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Price and Cart Actions */}
                    <div className="p-6 pt-0 space-y-3">
                      <div className="flex items-baseline justify-between border-t border-neutral-100 pt-3">
                        <span className="text-xs text-neutral-400">Price</span>
                        <span className="text-xl font-bold text-neutral-900">
                          {formatCurrency(product.price)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => addItem(product)}
                          className="py-2.5 rounded-xl bg-solar-600 hover:bg-solar-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-solar-600/20"
                        >
                          <Icon name="warehouse" size={14} />
                          Add to Cart
                        </button>
                        <Link
                          href={`/power/products/${product.slug}`}
                          className="py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-600 font-semibold text-xs text-center flex items-center justify-center gap-1"
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
