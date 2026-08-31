import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { Icon } from '@/components/ui/Icon';
import { powerPackages } from '@/lib/data/power-products';
import { formatCurrency } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Power & Solar Solutions | 3rd Energy Digital Power Platform',
  description:
    'Discover, size, configure, and deploy commercial and residential solar hybrid systems, lithium storage, and smart inverters with certified turnkey installation across Nigeria.',
  keywords: [
    'solar energy solutions',
    'commercial solar Nigeria',
    'hybrid inverters',
    'lithium LiFePO4 batteries',
    'solar power installer',
    'inverter vs generator',
  ],
};

export default function PowerSolarPage() {
  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen" data-industry="solar">
      {/* ===== HERO ===== */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/solar-hero.jpg"
            alt="3rd Energy Solar Infrastructure"
            fill
            priority
            className="object-cover opacity-25"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/85 to-[#0a0a0a]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/60" />
        </div>

        <div className="container-wide relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2">
                <p className="label-text text-solar-400">Power & Solar</p>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-solar-900/40 text-solar-400 rounded border border-solar-500/20">
                  Phase 2 Live
                </span>
              </div>

              <h1 className="display-xl text-white">
                From Energy Products to{' '}
                <span className="text-solar-400">Intelligent Power.</span>
              </h1>

              <p className="text-base text-white/40 max-w-lg leading-relaxed">
                Experience the complete clean energy lifecycle. Discover Tier-1 solar equipment, size your load with our AI planner, customize turnkey packages, and book certified installation.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/power/planner"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-[#0a0a0a] bg-solar-400 hover:bg-solar-300 rounded-xl transition-all shadow-lg shadow-solar-500/20"
                >
                  <Icon name="zap" size={16} />
                  Find My Solar Solution
                </Link>
                <Link
                  href="/power/products"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white/90 bg-white/[0.06] border border-white/[0.12] hover:bg-white/[0.12] hover:text-white rounded-xl transition-all backdrop-blur-sm"
                >
                  <Icon name="sparkles" size={16} className="text-solar-400" />
                  Portable Power & Inverters
                </Link>
                <Link
                  href="/power/calculator"
                  className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-solar-400 border border-solar-500/30 hover:bg-solar-950/40 rounded-xl transition-all"
                >
                  <Icon name="calculator" size={16} />
                  Sizing Calculator
                </Link>
              </div>

              {/* Trust stats */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/[0.06] max-w-lg">
                <div>
                  <p className="text-2xl font-heading font-extrabold text-white">99.8%</p>
                  <p className="text-[11px] text-white/25 uppercase tracking-wider">Availability</p>
                </div>
                <div>
                  <p className="text-2xl font-heading font-extrabold text-white">6,000+</p>
                  <p className="text-[11px] text-white/25 uppercase tracking-wider">LiFePO4 Cycles</p>
                </div>
                <div>
                  <p className="text-2xl font-heading font-extrabold text-white">Turnkey</p>
                  <p className="text-[11px] text-white/25 uppercase tracking-wider">Nationwide</p>
                </div>
              </div>
            </div>

            {/* Right Column: Quick Sizing Card */}
            <div className="lg:col-span-5">
              <div className="p-6 rounded-lg bg-white/[0.03] border border-white/[0.06] space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon name="sun" size={18} className="text-solar-400" />
                    <div>
                      <h3 className="font-heading font-bold text-sm text-white">Quick Sizing Preview</h3>
                      <p className="text-[11px] text-white/30">Sample Executive Residence</p>
                    </div>
                  </div>
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-solar-900/40 text-solar-400 rounded border border-solar-500/20">
                    Optimized
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {[
                    { label: 'Continuous Running Load', value: '~3,450 Watts', highlight: false },
                    { label: 'Recommended Inverter', value: '5kVA / 48V Pure Sine', highlight: true },
                    { label: 'Recommended Battery', value: '10.24kWh LiFePO4 (6000 Cycles)', highlight: true },
                    { label: 'Recommended Solar PV', value: '8x 550W Panels (4.4kWp)', highlight: false },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between p-3 rounded bg-white/[0.02] border border-white/[0.04]">
                      <span className="text-white/30">{row.label}</span>
                      <span className={`font-semibold ${row.highlight ? 'text-solar-400' : 'text-white'}`}>{row.value}</span>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded bg-solar-900/20 border border-solar-500/10">
                  <p className="text-[11px] text-solar-300/70 leading-relaxed">
                    <strong>Autonomous Runtime:</strong> ~14–16 continuous hours powering Inverter AC, refrigerator, TVs, pumps & workstations during grid outages.
                  </p>
                </div>

                <Link
                  href="/power/planner"
                  className="w-full py-2.5 rounded-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  Configure Your Own Appliances
                  <Icon name="arrow-right" size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CUSTOMER JOURNEYS ===== */}
      <section className="section border-t border-white/[0.04]">
        <div className="container-wide">
          <div className="mb-14">
            <p className="label-text text-solar-400 mb-4">The Power Journey</p>
            <h2 className="display-lg text-white mb-3">How Would You Like to Power Your Business?</h2>
            <p className="text-sm text-white/30 max-w-lg">
              Whether you need to size your appliances, buy individual components, or commission a turnkey industrial array.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04] border border-white/[0.04] rounded-lg overflow-hidden">
            {[
              { num: '01', title: 'Shop Power Products', desc: 'Browse our certified catalogue of Pure Sine inverters, LiFePO4 battery modules, Tier-1 solar panels, and power stations.', href: '/power/products', color: 'primary' },
              { num: '02', title: 'Find My Power Solution', desc: 'Answer 5 quick questions about your appliances, daily runtime, and priority to get a preliminary system sizing recommendation.', href: '/power/planner', color: 'solar', badge: 'Recommended' },
              { num: '03', title: 'Design My System', desc: 'Customize a complete solar package live. Scale battery capacity, adjust autonomy runtime, add/remove solar panels, and compare tiers.', href: '/power/builder', color: 'solar' },
              { num: '04', title: 'Request Installation', desc: 'Already have equipment or need certified electrical engineers to audit your property? Book a professional site inspection.', href: '/power/installation', color: 'solar' },
              { num: '05', title: 'Power Savings Simulator', desc: 'Calculate your generator diesel burn vs solar-hybrid ROI over 1, 5, and 10 years with transparent assumptions.', href: '/power/savings', color: 'power' },
              { num: '06', title: 'AI Product Concierge', desc: 'Have technical equipment compatibility questions? Ask our AI assistant for verified answers.', href: '/power/concierge', color: 'primary' },
            ].map((item) => (
              <Link
                key={item.num}
                href={item.href}
                className="group bg-[#0a0a0a] p-6 hover:bg-white/[0.02] transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-mono font-semibold text-white/15">{item.num}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-solar-900/40 text-solar-400 rounded border border-solar-500/20">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-solar-400 transition-colors mb-2">{item.title}</h3>
                  <p className="text-xs text-white/25 leading-relaxed">{item.desc}</p>
                </div>
                <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-solar-500 group-hover:text-solar-400 transition-colors">
                  <span>Explore</span>
                  <Icon name="arrow-right" size={12} className="transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TURNKEY PACKAGES ===== */}
      <section className="section border-t border-white/[0.04]">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
            <div>
              <p className="label-text text-solar-400 mb-4">Turnkey Solutions</p>
              <h2 className="display-lg text-white">Engineered Power Packages</h2>
              <p className="text-sm text-white/30 mt-2 max-w-lg">
                Complete, fully integrated systems with inverters, lithium storage, solar arrays, and certified installation included.
              </p>
            </div>
            <Link
              href="/power/products"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-solar-400 hover:text-solar-300 transition-colors"
            >
              View all products <Icon name="arrow-right" size={14} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {powerPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="rounded-lg bg-white/[0.02] border border-white/[0.06] overflow-hidden flex flex-col justify-between hover:border-solar-500/20 transition-colors group"
              >
                <div>
                  {/* Image */}
                  <div className="h-48 relative overflow-hidden bg-neutral-900">
                    <Image
                      src={pkg.image}
                      alt={pkg.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#0a0a0a]/80 text-white/60 border border-white/[0.06] uppercase tracking-wider">
                        {pkg.tier}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-heading font-bold text-base text-white group-hover:text-solar-400 transition-colors">{pkg.name}</h3>
                      <p className="text-xs text-white/25 mt-1 line-clamp-2">{pkg.tagline}</p>
                    </div>

                    {/* Specs */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/[0.04] text-center">
                      <div className="p-2">
                        <p className="text-xs font-bold text-white">{pkg.ratingKva} kVA</p>
                        <p className="text-[10px] text-white/20">Inverter</p>
                      </div>
                      <div className="p-2">
                        <p className="text-xs font-bold text-solar-400">{pkg.batteryKwh} kWh</p>
                        <p className="text-[10px] text-white/20">LiFePO4</p>
                      </div>
                      <div className="p-2">
                        <p className="text-xs font-bold text-white">{pkg.solarKwp} kWp</p>
                        <p className="text-[10px] text-white/20">Solar PV</p>
                      </div>
                    </div>

                    <p className="text-xs text-white/30">
                      <strong className="text-white/50">Ideal for:</strong> {pkg.idealFor}
                    </p>
                  </div>
                </div>

                {/* Price and Action */}
                <div className="p-6 pt-0 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-white/20 block uppercase tracking-wider">Package Price</span>
                      <span className="text-lg font-heading font-bold text-white">{formatCurrency(pkg.price)}</span>
                    </div>
                    <span className="text-[10px] text-solar-400 font-semibold flex items-center gap-1">
                      <Icon name="check-circle" size={11} /> Installation Included
                    </span>
                  </div>

                  <Link
                    href={`/power/builder?package=${pkg.slug}`}
                    className="w-full py-2.5 rounded-md bg-solar-600 hover:bg-solar-500 text-white font-semibold text-xs text-center transition-colors flex items-center justify-center gap-2"
                  >
                    Customize This Package
                    <Icon name="arrow-right" size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SOLAR EDUCATION ===== */}
      <section className="section border-t border-white/[0.04]">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <p className="label-text text-solar-400 mb-4">Solar Knowledge Hub</p>
                <h2 className="display-lg text-white mb-3">Make Informed Decisions.</h2>
                <p className="text-sm text-white/30 leading-relaxed">
                  Explore our engineering guides on battery chemistries, sizing physics, generator economics, and preventing common installation mistakes.
                </p>
              </div>

              <div className="space-y-2">
                {[
                  'Inverter vs. Diesel Generator Total Cost Analysis',
                  'Why Lithium LiFePO4 Outlasts Gel Batteries 5x',
                  'Top 5 Solar Installation Pitfalls to Avoid',
                ].map((guide) => (
                  <Link
                    key={guide}
                    href="/power/learn"
                    className="p-3.5 rounded bg-white/[0.02] border border-white/[0.04] hover:border-solar-500/20 flex items-center justify-between text-xs font-semibold text-white hover:text-solar-400 transition-colors"
                  >
                    <span>{guide}</span>
                    <Icon name="arrow-right" size={14} className="text-white/15" />
                  </Link>
                ))}
              </div>

              <Link
                href="/power/learn"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-white font-semibold text-xs transition-colors"
              >
                <Icon name="book-open" size={14} />
                Explore Solar Education Hub
              </Link>
            </div>

            <div className="p-7 rounded-lg bg-white/[0.02] border border-solar-500/10 space-y-5">
              <div className="flex items-center gap-3">
                <Icon name="hard-hat" size={20} className="text-solar-400" />
                <h3 className="font-heading font-bold text-base text-white">Certified Installation Guarantee</h3>
              </div>
              <p className="text-xs text-white/30 leading-relaxed">
                Every 3rd Energy system is deployed according to rigorous electrical engineering standards, including DC lightning surge arrestors, dedicated earthing rods (&lt;5 Ohms), distribution board phase balancing, and comprehensive commissioning tests.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs text-white/40">
                {[
                  'Certified Solar Engineers',
                  'Lightning & Surge Protection',
                  '5-Year Warranty Protection',
                  '24/7 Priority Support',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <Icon name="check-circle" size={13} className="text-solar-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/power/installation"
                className="inline-flex w-full py-3 rounded-md bg-solar-600 hover:bg-solar-500 text-white font-semibold text-xs items-center justify-center gap-2 transition-colors"
              >
                Book a Certified Site Inspection
                <Icon name="arrow-right" size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="bg-solar-800 py-20">
        <div className="container-wide text-center max-w-2xl mx-auto">
          <h2 className="display-lg text-white mb-5">
            Ready to Transition to Reliable Clean Power?
          </h2>
          <p className="text-sm text-white/50 max-w-md mx-auto mb-10">
            Start with our AI Power Planner to calculate your system load in under 2 minutes, or connect directly with our technical engineering desk.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/power/planner"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-solar-900 bg-white hover:bg-neutral-100 rounded-md transition-colors"
            >
              <Icon name="zap" size={16} />
              Start AI Sizing Planner
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white/60 border border-white/20 hover:border-white/40 hover:text-white rounded-md transition-colors"
            >
              Speak to a Specialist
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
