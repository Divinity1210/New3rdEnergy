'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { powerProducts, powerPackages } from '@/lib/data/power-products';
import { useCart } from '@/components/power/CartContext';
import { formatCurrency } from '@/lib/utils';
import { PowerCategory } from '@/lib/types';

function PowerProductsContent() {
  const { addItem, addPackage } = useCart();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setActiveCategory(cat);
    }
  }, [searchParams]);

  const categories: { id: string; label: string; icon: string }[] = [
    { id: 'all', label: 'All Equipment', icon: 'grid' },
    { id: 'power-stations', label: '🔋 Portable Power & Banks', icon: 'sparkles' },
    { id: 'inverters', label: 'Hybrid Inverters', icon: 'zap' },
    { id: 'batteries', label: 'LiFePO4 Storage', icon: 'warehouse' },
    { id: 'solar-panels', label: 'Solar PV Panels', icon: 'sun' },
    { id: 'packages', label: 'Turnkey Packages', icon: 'shield' },
    { id: 'accessories', label: 'Protection & EMS', icon: 'settings' },
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
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen pt-32 pb-24 lg:pt-40">
      <div className="container-wide">
        {/* Header Title */}
        <div className="text-center space-y-3 mb-12 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-sm">
            <Icon name="sun" size={14} className="text-emerald-600" />
            3RD ENERGY SERVICES LTD · CERTIFIED CLEAN POWER STORE
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-950 tracking-tight">
            Shop Solar & <span className="text-emerald-700">Portable Power.</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Engineered hybrid inverters, fast-charge laptop power banks, heavy-duty mobile power hubs, automotive-grade LiFePO4 battery modules, and certified turnkey solar packages.
          </p>
        </div>

        {/* Search & Category Filter Pills Bar */}
        <div className="space-y-4 mb-12">
          {/* Search Input */}
          <div className="max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="Search equipment (e.g. 30000mAh, 5kVA, LiFePO4, 550W, Power Station)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3.5 pl-12 rounded-2xl bg-white border border-slate-200 text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none shadow-sm"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Icon name="search" size={18} />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <Icon name="x" size={16} />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                      : 'bg-white border border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-50'
                  }`}
                >
                  <Icon name={cat.icon || 'grid'} size={14} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ===== TURNKEY PACKAGES SECTION (IF ACTIVE) ===== */}
        {showPackages && filteredPackages.length > 0 && (
          <div className="mb-16 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h2 className="font-heading font-extrabold text-2xl text-slate-950">
                  Pre-Configured Turnkey Solar Packages
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Complete bundled systems including Inverter, LiFePO4 Storage, Solar Array & Certified Rooftop Installation.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold">
                Turnkey Verified
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {filteredPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-950/5 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-100">
                      <Image
                        src={pkg.image || '/images/products/package-recommended.jpg'}
                        alt={pkg.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-slate-900/80 text-white text-[10px] font-bold font-mono backdrop-blur-sm">
                        {pkg.ratingKva}kVA / {pkg.batteryKwh}kWh
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 uppercase tracking-wider">
                        {pkg.tier === 'recommended' ? 'Executive Tier' : pkg.tier === 'commercial' ? 'Commercial Tier' : 'Essential Tier'}
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        {pkg.batteryKwh}kWh LiFePO4
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-lg text-slate-900 leading-snug">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {pkg.tagline}
                    </p>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Turnkey Price</span>
                      <div className="text-2xl font-heading font-extrabold text-slate-950">
                        {formatCurrency(pkg.price)}
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 block">
                        ✓ {pkg.warrantyYears}-Year Manufacturer Warranty
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-slate-700">
                      <p className="font-medium truncate">• <strong>Inverter:</strong> {pkg.inverter.name}</p>
                      <p className="font-medium truncate">• <strong>Storage:</strong> {pkg.batteryKwh}kWh LiFePO4</p>
                      <p className="font-medium truncate">• <strong>Solar:</strong> {pkg.solarKwp}kWp PV Array</p>
                      <p className="font-medium truncate">• <strong>Backup:</strong> ~{pkg.estimatedBackupHours} hours runtime</p>
                    </div>
                  </div>

                  <div className="pt-6 mt-4 border-t border-slate-100 flex items-center gap-3">
                    <button
                      onClick={() => addPackage(pkg)}
                      className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer"
                    >
                      <Icon name="shopping-cart" size={14} />
                      Buy Package
                    </button>
                    <Link
                      href="/power/builder"
                      className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="Customize in 3D Builder"
                    >
                      <Icon name="settings" size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== INDIVIDUAL POWER PRODUCTS GRID ===== */}
        {activeCategory !== 'packages' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h2 className="font-heading font-extrabold text-2xl text-slate-950">
                  Individual Equipment & Portable Power ({filteredProducts.length})
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Tier-1 standalone hardware ready for direct dispatch or installer integration.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-950/5 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Badge row */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase tracking-wider">
                        {product.category}
                      </span>
                      <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        In Stock ({product.leadTimeDays}d dispatch)
                      </span>
                    </div>

                    <Link href={`/power/products/${product.slug}`} className="block group">
                      <h3 className="font-heading font-bold text-lg text-slate-950 group-hover:text-emerald-700 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {product.tagline || product.shortDescription}
                    </p>

                    {/* Spec preview list */}
                    {product.specs && (
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                        {product.specs.continuousPower && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">Power Rating:</span>
                            <span className="font-bold text-slate-900">{product.specs.continuousPower}</span>
                          </div>
                        )}
                        {product.specs.capacity && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">Capacity:</span>
                            <span className="font-bold text-emerald-700">{product.specs.capacity}</span>
                          </div>
                        )}
                        {product.specs.voltage && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">Voltage:</span>
                            <span className="font-bold text-slate-900">{product.specs.voltage}</span>
                          </div>
                        )}
                        {product.specs.warranty && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">Warranty:</span>
                            <span className="font-bold text-emerald-700">{product.specs.warranty}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Pricing and Action Buttons */}
                  <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block font-mono">Price</span>
                      <span className="text-xl font-heading font-extrabold text-slate-950">
                        {formatCurrency(product.price)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/power/products/${product.slug}`}
                        className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                      >
                        Specs
                      </Link>
                      <button
                        onClick={() => addItem(product, 1)}
                        className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
                      >
                        <Icon name="shopping-cart" size={14} />
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PowerProductsPage() {
  return (
    <Suspense fallback={
      <div className="bg-[#f8fafc] text-slate-900 min-h-screen pt-40 pb-24 text-center">
        <div className="container-wide">
          <p className="text-sm font-bold text-slate-500">Loading Power Products...</p>
        </div>
      </div>
    }>
      <PowerProductsContent />
    </Suspense>
  );
}

