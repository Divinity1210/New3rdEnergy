'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@/components/ui/Icon';
import { powerPackages, powerProducts } from '@/lib/data/power-products';
import { formatCurrency, getWhatsAppUrl } from '@/lib/utils';
import { useCart } from '@/components/power/CartContext';
import { motion } from 'motion/react';

export default function PowerSolarPage() {
  const { addItem, addPackage } = useCart();
  const [selectedKva, setSelectedKva] = useState<number>(5);

  // Filter portable products for the spotlight
  const portableProducts = powerProducts.filter(
    (p) => p.category === 'power-stations'
  );

  return (
    <div className="bg-[#ffffff] text-slate-900 min-h-screen" data-industry="solar">
      {/* ══════════════════════════════════════════════════════════════
          1. LUMINOUS HERO SECTION (CRISP WHITE TECH AESTHETIC)
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50 border-b border-slate-200/80">
        {/* Subtle geometric light pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 left-10 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="container-wide relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>3RD ENERGY SERVICES LTD · SOLAR & CLEAN POWER DIVISION</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-[62px] font-heading font-extrabold text-slate-950 leading-[1.08] tracking-tight">
                From Energy Products to{' '}
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
                  Intelligent Solar Power.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Empowering Nigerian businesses and residences with <strong>Tier-1 hybrid solar inverters</strong>, <strong>6,000-cycle LiFePO4 battery storage</strong>, <strong>fast-charge portable power banks</strong>, and certified turnkey engineering.
              </p>

              {/* Main Action CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href="/power/planner"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:-translate-y-0.5"
                >
                  <Icon name="zap" size={16} />
                  Find My Solar Solution
                </Link>
                <Link
                  href="/power/products"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm font-bold text-slate-800 bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 rounded-xl transition-all shadow-sm hover:-translate-y-0.5"
                >
                  <Icon name="sparkles" size={16} className="text-emerald-600" />
                  Portable Power & Equipment
                </Link>
                <Link
                  href="/power/calculator"
                  className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-xl transition-all"
                >
                  <Icon name="calculator" size={16} />
                  Sizing Calculator
                </Link>
              </div>

              {/* Trust badges */}
              <div className="pt-6 grid grid-cols-3 gap-6 border-t border-slate-200/90 max-w-lg">
                <div>
                  <p className="text-2xl lg:text-3xl font-heading font-extrabold text-slate-900">99.8%</p>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Uptime SLA</p>
                </div>
                <div>
                  <p className="text-2xl lg:text-3xl font-heading font-extrabold text-emerald-700">6,000+</p>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">LiFePO4 Cycles</p>
                </div>
                <div>
                  <p className="text-2xl lg:text-3xl font-heading font-extrabold text-slate-900">Turnkey</p>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Nationwide</p>
                </div>
              </div>
            </div>

            {/* Right Hero Column: Interactive Solar Sizing Card */}
            <div className="lg:col-span-5">
              <div className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-2xl shadow-slate-200/80 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center font-bold">
                      <Icon name="sun" size={20} />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-sm text-slate-900">Live Solar Sizing Engine</h3>
                      <p className="text-[11px] text-slate-500">Select system capacity to view specs</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200 uppercase tracking-wider">
                    Tier-1 Spec
                  </span>
                </div>

                {/* Capacity Selector Tabs */}
                <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl">
                  {[
                    { kva: 3.5, label: '3.5kVA Basic' },
                    { kva: 5, label: '5kVA Executive' },
                    { kva: 10, label: '10kVA 3-Phase' },
                  ].map((tab) => (
                    <button
                      key={tab.kva}
                      type="button"
                      onClick={() => setSelectedKva(tab.kva)}
                      className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        selectedKva === tab.kva
                          ? 'bg-white text-emerald-800 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Dynamic Spec Matrix */}
                <div className="space-y-2.5 text-xs font-medium">
                  <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500">Continuous Running Load:</span>
                    <span className="font-bold text-slate-900">
                      {selectedKva === 3.5 ? '~2,400 Watts' : selectedKva === 5 ? '~3,800 Watts' : '~8,500 Watts'}
                    </span>
                  </div>

                  <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500">Recommended Inverter:</span>
                    <span className="font-bold text-emerald-700">
                      {selectedKva === 3.5 ? '3.5kVA / 24V Pure Sine' : selectedKva === 5 ? '5kVA / 48V Smart Hybrid' : '10kVA / 48V 3-Phase Commercial'}
                    </span>
                  </div>

                  <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500">Recommended Storage:</span>
                    <span className="font-bold text-emerald-700">
                      {selectedKva === 3.5 ? '5.12kWh LiFePO4 Wall Mount' : selectedKva === 5 ? '10.24kWh LiFePO4 Commercial Rack' : '20.48kWh Dual Modular LiFePO4'}
                    </span>
                  </div>

                  <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500">Solar PV Array:</span>
                    <span className="font-bold text-slate-900">
                      {selectedKva === 3.5 ? '4x 550W Panels (2.2kWp)' : selectedKva === 5 ? '8x 550W Panels (4.4kWp)' : '12x 650W Bifacial (7.8kWp)'}
                    </span>
                  </div>
                </div>

                {/* Runtime Banner */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80">
                  <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                    ⚡ <strong>Autonomous Autonomy:</strong> Provides <strong>12–16 continuous hours</strong> of silent power for Inverter ACs, double-door refrigeration, TV, pumps & workstations during grid blackouts.
                  </p>
                </div>

                <Link
                  href="/power/builder"
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  Customize System in 3D Builder
                  <Icon name="arrow-right" size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          2. PORTABLE POWER & PERSONAL ENERGY SPOTLIGHT
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-[#fafafa] border-b border-slate-200/80">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-3">
                <Icon name="sparkles" size={12} className="text-amber-600" />
                PORTABLE & PERSONAL ENERGY
              </div>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-950 tracking-tight">
                Portable Power Banks & Solar Generators
              </h2>
              <p className="text-sm text-slate-600 max-w-xl mt-2">
                Fast-charge your laptops, phones, medical gear, and appliances anywhere. Zero installation, zero noise, 100% plug-and-play.
              </p>
            </div>
            <Link
              href="/power/products?category=power-stations"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              View All Portable Power Products ({portableProducts.length}) →
            </Link>
          </div>

          {/* Product Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {portableProducts.slice(0, 4).map((product) => (
              <div
                key={product.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-950/5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Category Chip & Stock */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 uppercase tracking-wider">
                      {product.specs?.capacity || 'Portable'}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      In Stock
                    </span>
                  </div>

                  <Link href={`/power/products/${product.slug}`} className="block group">
                    <h3 className="font-heading font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                    {product.shortDescription}
                  </p>

                  {/* Appliance support tags */}
                  {product.whatItCanSupport && product.whatItCanSupport.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Powers:</span>
                      <p className="text-[11px] font-semibold text-slate-700 truncate">
                        • {product.whatItCanSupport[0]}
                      </p>
                      {product.whatItCanSupport[1] && (
                        <p className="text-[11px] font-semibold text-slate-700 truncate">
                          • {product.whatItCanSupport[1]}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Price & Add to Cart */}
                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block font-mono">Price</span>
                    <span className="text-base font-heading font-extrabold text-slate-900">
                      {formatCurrency(product.price)}
                    </span>
                  </div>
                  <button
                    onClick={() => addItem(product, 1)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
                  >
                    <Icon name="shopping-cart" size={13} />
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          3. TURNKEY SOLAR HYBRID PACKAGES (ENGINEERED & INSTALLED)
      ══════════════════════════════════════════════════════════════ */}
      <section id="packages" className="py-20 lg:py-28 bg-white">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <Icon name="shield" size={13} className="text-emerald-600" />
              TURNKEY CERTIFIED PACKAGES
            </div>
            <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-slate-950 tracking-tight">
              Engineered for Energy Independence.
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Pre-configured hybrid solar packages including Tier-1 inverters, lithium batteries, solar arrays, and certified rooftop installation.
            </p>
          </div>

          {/* Package Cards */}
          <div className="grid lg:grid-cols-3 gap-8">
            {powerPackages.map((pkg) => {
              const isPopular = pkg.tier === 'recommended';

              return (
                <div
                  key={pkg.id}
                  className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                    isPopular
                      ? 'bg-gradient-to-b from-emerald-50/70 to-white border-2 border-emerald-500 shadow-2xl shadow-emerald-950/10'
                      : 'bg-white border border-slate-200 shadow-lg shadow-slate-100 hover:border-slate-300'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-md">
                      ★ Most Popular Choice
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                        {pkg.ratingKva}kVA Inverter System
                      </span>
                      <h3 className="text-2xl font-heading font-extrabold text-slate-950">{pkg.name}</h3>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">{pkg.tagline}</p>
                    </div>

                    {/* Price in NGN */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block font-mono">Turnkey Price (Inc. Installation)</span>
                      <div className="text-3xl font-heading font-extrabold text-slate-900 mt-0.5">
                        {formatCurrency(pkg.price)}
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 mt-1 block">
                        ✓ {pkg.warrantyYears}-Year Complete Warranty & Support
                      </span>
                    </div>

                    {/* Specifications List */}
                    <div className="space-y-3 pt-2 text-xs">
                      <div className="flex items-center gap-2 text-slate-700 font-semibold">
                        <Icon name="check" size={14} className="text-emerald-600 shrink-0" />
                        <span><strong>Inverter:</strong> {pkg.inverter.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700 font-semibold">
                        <Icon name="check" size={14} className="text-emerald-600 shrink-0" />
                        <span><strong>Storage:</strong> {pkg.batteryKwh}kWh LiFePO4 ({pkg.batteryQuantity}x Unit)</span>
                      </div>
                      {pkg.solarPanel && (
                        <div className="flex items-center gap-2 text-slate-700 font-semibold">
                          <Icon name="check" size={14} className="text-emerald-600 shrink-0" />
                          <span><strong>Solar PV:</strong> {pkg.solarKwp}kWp ({pkg.solarQuantity}x 550W/650W Panels)</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-slate-700 font-semibold">
                        <Icon name="check" size={14} className="text-emerald-600 shrink-0" />
                        <span><strong>Autonomous Runtime:</strong> ~{pkg.estimatedBackupHours} continuous hours</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-8 mt-6 border-t border-slate-100 space-y-2.5">
                    <button
                      onClick={() => addPackage(pkg)}
                      className={`w-full py-3.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                        isPopular
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      <Icon name="shopping-cart" size={14} />
                      Select Package & Checkout
                    </button>
                    <Link
                      href="/power/builder"
                      className="w-full py-2 text-center text-xs font-semibold text-slate-600 hover:text-emerald-700 block transition-colors"
                    >
                      Customize components in Builder →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          4. CERTIFIED 4-STEP TURNKEY INSTALLATION PROCESS
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-slate-50 border-t border-slate-200">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-950 tracking-tight">
              Certified Turnkey Deployment Process
            </h2>
            <p className="text-sm text-slate-600">
              From site load audit to rooftop mounting and cloud telemetry, our certified engineers handle everything.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Load Audit & Sizing',
                desc: 'We calculate your peak wattage, surge currents, and runtime requirements using smart telemetry.',
                icon: 'calculator',
              },
              {
                step: '02',
                title: 'Engineering Blueprint',
                desc: 'Custom electrical schematics, string voltage sizing, and protection box layout designed by engineers.',
                icon: 'settings',
              },
              {
                step: '03',
                title: 'Turnkey Installation',
                desc: 'Rooftop mounting with anodized aluminum rails, DC surge protection, and neat conduit cable management.',
                icon: 'tool',
              },
              {
                step: '04',
                title: 'Cloud Telemetry & Warranty',
                desc: 'Real-time mobile app energy tracking, auto-generator switching, and up to 5 years manufacturer warranty.',
                icon: 'activity',
              },
            ].map((st) => (
              <div key={st.step} className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Icon name={st.icon || 'check'} size={18} />
                  </div>
                  <span className="text-xl font-heading font-extrabold text-slate-300 font-mono">{st.step}</span>
                </div>
                <h3 className="font-heading font-bold text-base text-slate-900">{st.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          5. CTA & CONSULTATION BANNER
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-emerald-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none" />
        <div className="container-wide relative z-10 text-center max-w-3xl mx-auto space-y-6">
          <span className="px-3 py-1 rounded-full bg-emerald-800 text-emerald-200 text-xs font-bold border border-emerald-700">
            3RD ENERGY SERVICES LTD · CLEAN ENERGY CONSULTATION
          </span>
          <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight">
            Ready to Cut Energy Costs by Up to 75%?
          </h2>
          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
            Speak directly with our solar engineering desk to schedule an on-site energy audit or discuss commercial microgrids.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href={getWhatsAppUrl('Hello 3RD Energy Services Ltd, I want to discuss a solar power system installation.')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-4 rounded-xl bg-white text-emerald-900 font-bold text-sm hover:bg-emerald-50 transition-all shadow-xl flex items-center gap-2"
            >
              <Icon name="whatsapp" size={16} />
              Chat on WhatsApp: +234 1 234 5680
            </a>
            <Link
              href="/power/concierge"
              className="px-7 py-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-sm border border-emerald-600 transition-all"
            >
              AI Engineering Concierge →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
