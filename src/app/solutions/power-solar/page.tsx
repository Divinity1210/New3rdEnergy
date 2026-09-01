'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@/components/ui/Icon';
import { powerPackages, powerProducts } from '@/lib/data/power-products';
import { formatCurrency, getWhatsAppUrl } from '@/lib/utils';
import { useCart } from '@/components/power/CartContext';

export default function PowerSolarPage() {
  const { addItem, addPackage } = useCart();
  const [monthlyBill, setMonthlyBill] = useState<number>(150000);
  const [selectedKva, setSelectedKva] = useState<number>(5);

  // Filter portable products for the spotlight
  const portableProducts = powerProducts.filter(
    (p) => p.category === 'power-stations'
  );

  // Quick savings calculation for the Sun King style widget
  const estimatedAnnualBill = monthlyBill * 12;
  const projectedSolarAnnualSavings = estimatedAnnualBill * 0.82;
  const monthlySavings = projectedSolarAnnualSavings / 12;
  const recommendedTier =
    monthlyBill < 80000
      ? { kva: '3.5kVA / 5.12kWh', name: 'Essential Home Package', cost: 2850000, link: '/power/products/package-essential-3.5kva' }
      : monthlyBill < 250000
      ? { kva: '5kVA / 10.24kWh', name: 'Executive Home & Office Package', cost: 4950000, link: '/power/products/package-recommended-5kva' }
      : { kva: '10kVA / 20.48kWh', name: 'Commercial 3-Phase Package', cost: 9850000, link: '/power/products/package-commercial-10kva' };

  return (
    <div className="bg-[#ffffff] text-slate-900 min-h-screen font-sans" data-industry="solar">
      {/* ══════════════════════════════════════════════════════════════
          1. HERO SECTION (PRACTICAL PHOTOGRAPHY + SUN KING STYLE)
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative pt-32 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/40 border-b border-slate-200/80">
        <div className="container-wide relative z-10">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>3RD ENERGY SERVICES LTD · SOLAR & CLEAN POWER DIVISION</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-heading font-extrabold text-slate-950 leading-[1.1] tracking-tight">
                Affordable, Reliable Solar Power in{' '}
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
                  Nigeria.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Connect to reliable, stress-free clean energy with <strong>3RD Energy Services Ltd</strong>. From fast-charge laptop power banks to residential solar inverters and commercial three-phase microgrids.
              </p>

              {/* 3 Core Trust Badges (Sun King Pattern) */}
              <div className="grid sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
                    <Icon name="zap" size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block leading-tight">Nigeria's Trusted</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">Home & business solar provider</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
                    <Icon name="tool" size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block leading-tight">Turnkey Install</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">Warranty & after-sales care</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
                    <Icon name="check" size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block leading-tight">Flexible Payment</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">Direct & corporate invoicing</span>
                  </div>
                </div>
              </div>

              {/* Hero Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#savings-calculator"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-md shadow-emerald-600/25 hover:-translate-y-0.5 cursor-pointer"
                >
                  <Icon name="trending-up" size={15} />
                  See What You Can Save
                </a>
                <Link
                  href="/power/planner"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-all shadow-sm"
                >
                  <Icon name="zap" size={15} className="text-emerald-600" />
                  AI Sizing Planner
                </Link>
                <Link
                  href="/power/products"
                  className="inline-flex items-center gap-2 px-5 py-3.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50/80 rounded-xl transition-all"
                >
                  <span>Explore Equipment Range →</span>
                </Link>
              </div>
            </div>

            {/* Right Hero Visual: Real Rooftop Installation Photo */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 group">
                <Image
                  src="/images/solar-hero-installer.jpg"
                  alt="Certified 3RD Energy Services Ltd solar engineers installing rooftop solar panels in Lagos Nigeria"
                  width={900}
                  height={600}
                  priority
                  className="w-full h-[360px] sm:h-[420px] object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                
                {/* Floating Metric Overlays */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                        <Icon name="check" size={18} />
                      </div>
                      <div>
                        <span className="text-xs font-extrabold text-slate-950 block">Certified Turnkey Installation</span>
                        <span className="text-[10px] text-slate-500 block">Tier-1 Monocrystalline PV & LiFePO4</span>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-700 font-mono">99.8% Uptime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          2. QUICK BILL SAVINGS CALCULATOR (SUN KING STYLE)
      ══════════════════════════════════════════════════════════════ */}
      <section id="savings-calculator" className="py-16 bg-white border-b border-slate-200/80">
        <div className="container-wide max-w-5xl">
          <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                  <Icon name="trending-up" size={13} />
                  INTERACTIVE FUEL & BILL SAVINGS TOOL
                </div>
                <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
                  See What You Can Save
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  How much do you spend monthly on electricity bills and diesel/petrol generator fuel?
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 rounded-2xl p-2 px-4">
                    <span className="text-emerald-400 font-bold font-mono text-lg">₦</span>
                    <input
                      type="number"
                      value={monthlyBill}
                      onChange={(e) => setMonthlyBill(Number(e.target.value))}
                      className="bg-transparent text-white font-mono font-bold text-lg focus:outline-none w-full"
                      placeholder="e.g. 150000"
                    />
                  </div>

                  {/* Quick Preset Chips */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    {[50000, 150000, 350000, 750000].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setMonthlyBill(val)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                          monthlyBill === val
                            ? 'bg-emerald-500 text-slate-950 font-bold'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        ₦{val.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Calculated Result Card */}
              <div className="lg:col-span-6 p-6 rounded-2xl bg-white text-slate-900 space-y-4 shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase">Recommended Setup</span>
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono">
                    {recommendedTier.kva}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Monthly Fuel Saved</span>
                    <span className="text-base font-extrabold text-emerald-700 font-mono mt-0.5 block">
                      ~{formatCurrency(monthlySavings)}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Annual Savings</span>
                    <span className="text-base font-extrabold text-emerald-700 font-mono mt-0.5 block">
                      ~{formatCurrency(projectedSolarAnnualSavings)}
                    </span>
                  </div>
                </div>

                <div className="pt-1 flex flex-col sm:flex-row gap-2.5">
                  <Link
                    href={recommendedTier.link}
                    className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors text-center shadow-md shadow-emerald-600/20"
                  >
                    View Matched Package →
                  </Link>
                  <Link
                    href="/power/savings"
                    className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors text-center"
                  >
                    Deep 10-Yr ROI Model
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          3. CORE 3 PRODUCT LINES (WITH REAL PRACTICAL PHOTOS)
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#f8fafc] border-b border-slate-200/80">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
              Product Categories
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-950 tracking-tight">
              Our Solar & Power Solutions
            </h2>
            <p className="text-sm text-slate-600">
              Engineered energy solutions for every lifestyle, home, and commercial facility in Nigeria.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Category 1: Portable Solar & Laptop Power Banks */}
            <div className="rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between group">
              <div>
                <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                  <Image
                    src="/images/solar-powerbank-desk.jpg"
                    alt="Nigerian tech professional using fast-charge laptop power bank"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-sm">
                    🔋 Portable & Personal
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-heading font-extrabold text-slate-950">
                    Portable Power & Power Banks
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    65W & 100W PD laptop power banks, 3-bulb solar home lighting kits with FM radio, and 600W–2.4kWh solar generators for remote workers and on-the-go professionals.
                  </p>

                  <div className="pt-2 flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-mono font-bold">30,000mAh 65W</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-mono font-bold">50,000mAh 100W</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-mono font-bold">Solar Generators</span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href="/power/products?category=power-stations"
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Browse Portable Range</span>
                  <Icon name="arrow-right" size={13} />
                </Link>
              </div>
            </div>

            {/* Category 2: Solar Home Systems */}
            <div className="rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between group">
              <div>
                <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                  <Image
                    src="/images/solar-family-lifestyle.jpg"
                    alt="Nigerian family living room powered by 3RD Energy solar inverter system"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-sm">
                    🏡 Residential Systems
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-heading font-extrabold text-slate-950">
                    Solar Home Systems & Appliances
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Light your entire residence, run TVs, refrigerators, standing fans, and inverter ACs with 3.5kVA – 5kVA smart hybrid systems and LiFePO4 batteries.
                  </p>

                  <div className="pt-2 flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-mono font-bold">3.5kVA Essential</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-mono font-bold">5kVA Executive</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-mono font-bold">Zero Generator Run</span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href="/power/products?category=packages"
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Browse Home Packages</span>
                  <Icon name="arrow-right" size={13} />
                </Link>
              </div>
            </div>

            {/* Category 3: Commercial & Business Systems */}
            <div className="rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between group">
              <div>
                <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                  <Image
                    src="/images/solar-business-barber.jpg"
                    alt="Nigerian salon and commercial enterprise running on solar inverter system"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-sm">
                    🏢 Commercial Systems
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-heading font-extrabold text-slate-950">
                    Commercial Solar Inverter Systems
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Heavy-duty 10kVA – 50kVA three-phase systems for fuel retail depots, clinics, manufacturing workshops, salons, and corporate offices.
                  </p>

                  <div className="pt-2 flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-mono font-bold">10kVA 3-Phase</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-mono font-bold">Auto-Gen Sync</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-mono font-bold">20.48kWh Lithium</span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href="/power/products?category=inverters"
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Browse Commercial Range</span>
                  <Icon name="arrow-right" size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          4. SPOTLIGHT ON PORTABLE POWER & SOLAR GENERATORS
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white border-b border-slate-200/80">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                Instant Personal Energy
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-950 mt-2">
                Portable Power Stations & Fast-Charge Banks
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xl mt-1">
                Pocket-sized power for laptops, smartphones, and mobile work setups across Nigeria.
              </p>
            </div>

            <Link
              href="/power/products?category=power-stations"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              <span>View All Portable Hardware ({portableProducts.length})</span>
              <Icon name="arrow-right" size={14} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {portableProducts.slice(0, 4).map((product) => (
              <div
                key={product.id}
                className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 w-full rounded-2xl bg-slate-100 overflow-hidden mb-4">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-slate-900/80 text-white text-[10px] font-bold font-mono backdrop-blur-sm">
                      {product.specs.capacity || product.specs.continuousPower}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-sm text-slate-950 leading-snug line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-base font-heading font-extrabold text-slate-950 font-mono">
                    {formatCurrency(product.price)}
                  </div>
                  <button
                    onClick={() => addItem(product, 1)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
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
          5. "WHY 3RD ENERGY SOLAR" REAL INSTALLATION SHOWCASE
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#f8fafc] border-b border-slate-200/80">
        <div className="container-wide">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Real Inverter Utility Room Installation Image */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
                <Image
                  src="/images/solar-inverter-wall.jpg"
                  alt="Neat residential solar hybrid inverter and LiFePO4 lithium battery wall installation in Lagos"
                  width={800}
                  height={600}
                  className="w-full h-[400px] sm:h-[460px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 text-xs shadow-md">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <Icon name="check" size={16} className="text-emerald-600" />
                    <span>Clean Engineering Installation Standards</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Flame-retardant conduit, DC isolator breaker box, and surge arrestor protection on every job.
                  </p>
                </div>
              </div>
            </div>

            {/* Why Choose 3RD Energy List */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  Engineering Quality
                </span>
                <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-950 mt-2 tracking-tight">
                  Why Nigerian Homes & Businesses Trust 3RD Energy Services Ltd
                </h2>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold mt-0.5">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-950 text-sm">Automotive-Grade LiFePO4 Battery Chemistry</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      6,000+ deep discharge cycles. Enjoy 10+ years of reliable energy storage compared to 18 months for conventional lead-acid or gel batteries.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold mt-0.5">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-950 text-sm">10-Millisecond Seamless Power Transfer</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Zero power drop. When NEPA/grid cuts off, our pure sine wave inverters switch over in less than 10ms with zero restart on TVs, routers, or servers.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold mt-0.5">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-950 text-sm">Intelligent Generator Synchronization</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Eliminate manual changeover switches. The system auto-starts your generator only when batteries drop below 15% during heavy rainy spells.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold mt-0.5">
                    4
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-950 text-sm">Certified Installation & 5-Year OEM Warranty</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Every installation is conducted by certified engineers with full surge protection, circuit isolation, and nationwide field support.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/power/installation"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-md shadow-emerald-600/20"
                >
                  <Icon name="tool" size={14} />
                  Book a Site Audit & Installation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          6. TURNKEY SOLAR PACKAGES (TRANSPARENT PRICING & SPECS)
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white border-b border-slate-200/80">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
              Turnkey Bundles
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-950 tracking-tight">
              Pre-Engineered Solar Packages
            </h2>
            <p className="text-sm text-slate-600">
              Complete all-inclusive packages: Inverter + LiFePO4 Battery + Tier-1 Solar PV Panels + Certified Installation.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {powerPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`rounded-3xl p-8 border transition-all flex flex-col justify-between ${
                  pkg.tier === 'recommended'
                    ? 'bg-emerald-50/70 border-emerald-500 shadow-xl relative'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                {pkg.tier === 'recommended' && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-md">
                    Most Popular Choice
                  </div>
                )}

                <div className="space-y-6">
                  <div className="border-b border-slate-200/80 pb-4">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider font-mono">
                      {pkg.systemKva}kVA Inverter / {pkg.batteryKwh}kWh LiFePO4
                    </span>
                    <h3 className="font-heading font-extrabold text-2xl text-slate-950 mt-1">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {pkg.tagline}
                    </p>
                  </div>

                  {/* Price */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Turnkey Investment</span>
                    <div className="text-3xl font-heading font-extrabold text-slate-950 font-mono">
                      {formatCurrency(pkg.price)}
                    </div>
                  </div>

                  {/* Specs Breakdown */}
                  <div className="space-y-2.5 text-xs text-slate-700">
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Daily Energy Yield:</span>
                      <span className="font-bold text-slate-900 font-mono">{pkg.dailyKwh} kWh / Day</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Surge Capacity:</span>
                      <span className="font-bold text-slate-900 font-mono">{pkg.surgeWatts} W</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Solar PV Array:</span>
                      <span className="font-bold text-slate-900 font-mono">{pkg.solarPanelsCount}x 550W Panels</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Battery Chemistry:</span>
                      <span className="font-bold text-emerald-700 font-mono">LiFePO4 (6,000 Cycles)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-8 space-y-3">
                  <button
                    onClick={() => addPackage(pkg)}
                    className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer"
                  >
                    <Icon name="shopping-cart" size={14} />
                    Order Turnkey Package
                  </button>
                  <Link
                    href={`/power/products/${pkg.id}`}
                    className="block text-center py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                  >
                    View System Specs
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          7. NIGERIAN CUSTOMER TESTIMONIALS & TRUST
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#f8fafc] border-b border-slate-200/80">
        <div className="container-wide max-w-5xl">
          <div className="text-center space-y-2 mb-12">
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
              Real-World Impact
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-950">
              Trusted by Homes & Businesses Across Nigeria
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-1 text-amber-400 text-xs">
                {'★'.repeat(5)}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                &ldquo;We cut our monthly petrol spend from ₦380,000 to zero while running 6 clippers, fans, and ring lights all day in our Ikeja salon. Best investment ever.&rdquo;
              </p>
              <div className="pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-950 block">Kings & Queens Salon</span>
                <span className="text-[10px] text-slate-500 block">Ikeja, Lagos · 5kVA Solar Hybrid</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-1 text-amber-400 text-xs">
                {'★'.repeat(5)}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                &ldquo;Silent sleep every single night in Lekki. The inverter switches in 10ms with zero flicker on our OLED TV, fridge, and nursery monitor.&rdquo;
              </p>
              <div className="pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-950 block">Dr. Babatunde & Family</span>
                <span className="text-[10px] text-slate-500 block">Lekki Phase 1, Lagos · 5kVA Executive</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-1 text-amber-400 text-xs">
                {'★'.repeat(5)}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                &ldquo;The 65W 30,000mAh laptop bank powers my MacBook Pro for 16 continuous hours anywhere in Yaba. Essential tool for remote developers.&rdquo;
              </p>
              <div className="pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-950 block">Chidi O. (Software Engineer)</span>
                <span className="text-[10px] text-slate-500 block">Yaba Tech Hub, Lagos · 65W Laptop Bank</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          8. CALL TO ACTION & WHATSAPP DESK
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="container-wide max-w-4xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <Icon name="phone" size={14} className="text-emerald-600" />
            NATIONWIDE SOLAR ENGINEERING DESK
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-950 tracking-tight">
            Ready to Power Your Home or Business?
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Speak directly with a certified solar engineer, get a custom site sizing audit, or place an equipment order today.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href={getWhatsAppUrl('Hello 3RD Energy Services Ltd, I would like to enquire about a Solar Inverter / Portable Power setup.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-lg shadow-emerald-600/25"
            >
              <Icon name="whatsapp" size={16} />
              Chat on WhatsApp (+234 1 234 5680)
            </a>
            <Link
              href="/power/products"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
            >
              <Icon name="shopping-cart" size={16} />
              Browse Full Equipment Store
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
