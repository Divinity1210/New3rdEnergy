'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { petroleumProducts, petroleumCategories } from '@/lib/data/petroleum-products';
import { getWhatsAppUrl } from '@/lib/utils';

/* ─── Animated Counter Hook ─── */
function useCounter(end: number, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!startOnView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = Date.now();
          const tick = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, startOnView]);

  return { count, ref };
}

/* ─── Scroll Reveal Hook ─── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

/* ─── Hero Stats Data ─── */
const heroStats = [
  { value: 50, suffix: '+', label: 'Tanker Fleet', icon: 'truck' },
  { value: 36, suffix: ' States', label: 'Nationwide Coverage', icon: 'map-pin' },
  { value: 4, suffix: 'hr', label: 'Emergency Response', icon: 'zap' },
  { value: 99, suffix: '%', label: 'Delivery Reliability', icon: 'check' },
];

/* ─── Capabilities Data ─── */
const capabilities = [
  {
    title: 'Fuel Supply',
    description: 'Diesel, petrol, and LPG delivered to your site on schedule. Volume-based pricing with flexible payment terms.',
    icon: 'fuel',
    color: 'from-red-500 to-orange-500',
    stat: '10M+ litres delivered monthly',
  },
  {
    title: 'Infrastructure',
    description: 'Storage tank design, installation, bunding, and monitoring systems. Turnkey solutions from survey to commissioning.',
    icon: 'warehouse',
    color: 'from-amber-500 to-red-500',
    stat: '200+ installations completed',
  },
  {
    title: 'Advisory & Management',
    description: 'Fuel consumption analytics, cost optimisation, compliance advisory, and procurement strategy.',
    icon: 'chart',
    color: 'from-orange-500 to-yellow-500',
    stat: '15-30% average cost savings',
  },
];

export default function PetroleumPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setHeroLoaded(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filtered = activeCategory === 'all'
    ? petroleumProducts
    : petroleumProducts.filter(p => p.category === activeCategory);

  return (
    <>
      {/* ══════════ CINEMATIC HERO ══════════ */}
      <section className="relative h-[90vh] min-h-[700px] overflow-hidden bg-[#0a0a0a]" data-industry="petroleum">
        {/* Parallax Background */}
        <div
          className="absolute inset-0 scale-110"
          style={{ transform: `translateY(${scrollY * 0.3}px) scale(1.1)` }}
        >
          <Image
            src="/images/petroleum/hero.jpg"
            alt="3RD Petroleum depot fleet"
            fill
            priority
            className={`object-cover transition-opacity duration-1000 ${heroLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
          {/* Multi-layer gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/40" />
          <div className="absolute inset-0 bg-[#0a0a0a]/20" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container-wide">
            <div className="max-w-2xl">
              {/* Badge */}
              <div
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 mb-6 transition-all duration-700 delay-200 ${
                  heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-semibold text-red-400 tracking-wider uppercase">3RD Petroleum</span>
              </div>

              {/* Headline */}
              <h1
                className={`text-5xl lg:text-7xl font-bold text-white leading-[1.05] mb-6 transition-all duration-700 delay-300 ${
                  heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                Powering
                <br />
                <span className="bg-gradient-to-r from-red-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                  Industries
                </span>
                <br />
                That Move Nigeria.
              </h1>

              {/* Subtitle */}
              <p
                className={`text-lg text-white/40 leading-relaxed max-w-lg mb-10 transition-all duration-700 delay-[400ms] ${
                  heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                From bulk diesel and petrol delivery to fuel storage infrastructure and management advisory — we supply the petroleum backbone your operations depend on.
              </p>

              {/* CTAs */}
              <div
                className={`flex flex-wrap gap-4 transition-all duration-700 delay-500 ${
                  heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                <Link
                  href="#products"
                  className="inline-flex items-center gap-2.5 px-8 py-4 text-sm font-bold text-white bg-red-600 hover:bg-red-500 rounded-xl transition-all duration-300 shadow-2xl shadow-red-600/25 hover:shadow-red-500/40 hover:-translate-y-0.5"
                >
                  <Icon name="fuel" size={16} />
                  Explore Products
                </Link>
                <a
                  href={getWhatsAppUrl('Hello 3rd Energy, I need petroleum supply services.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-8 py-4 text-sm font-semibold text-white/60 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:text-white hover:border-white/[0.15] rounded-xl transition-all duration-300 backdrop-blur-sm"
                >
                  <Icon name="whatsapp" size={16} />
                  Call Dispatch
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Stats Bar */}
        <div
          className={`absolute bottom-0 left-0 right-0 z-20 transition-all duration-700 delay-700 ${
            heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="container-wide">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06] rounded-t-2xl overflow-hidden backdrop-blur-xl">
              {heroStats.map((stat, i) => {
                const counter = useCounter(stat.value, 2000);
                return (
                  <div
                    key={stat.label}
                    ref={counter.ref}
                    className="bg-[#0a0a0a]/80 backdrop-blur-xl px-6 py-5 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                        <Icon name={stat.icon} size={16} className="text-red-400" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white tabular-nums">
                          {counter.count}{stat.suffix}
                        </div>
                        <div className="text-[11px] text-white/30 font-medium tracking-wide uppercase">{stat.label}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ CAPABILITIES ══════════ */}
      <section className="bg-[#0a0a0a] py-24 lg:py-32">
        <div className="container-wide">
          <CapabilitiesSection />
        </div>
      </section>

      {/* ══════════ PRODUCT DISCOVERY ══════════ */}
      <section id="products" className="bg-[#060606] py-24 lg:py-32 scroll-mt-20">
        <div className="container-wide">
          <ProductDiscoverySection
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            filtered={filtered}
          />
        </div>
      </section>

      {/* ══════════ TRUST & COMPLIANCE ══════════ */}
      <section className="bg-[#0a0a0a] py-20 lg:py-24 border-t border-white/[0.04]">
        <div className="container-wide">
          <TrustSection />
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/40 via-[#0a0a0a] to-orange-900/20" />
        <div className="relative container-wide py-24 lg:py-32 text-center">
          <CTASection />
        </div>
      </section>
    </>
  );
}

/* ─── CAPABILITIES SECTION ─── */
function CapabilitiesSection() {
  const reveal = useScrollReveal();
  return (
    <div ref={reveal.ref}>
      <div className="mb-14">
        <p className="text-xs font-bold text-red-400 tracking-[0.2em] uppercase mb-4">What We Deliver</p>
        <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">Full-Spectrum Petroleum Services</h2>
        <p className="text-base text-white/30 max-w-xl">From sourcing and logistics to infrastructure and advisory — end-to-end support for your fuel operations.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {capabilities.map((cap, i) => (
          <div
            key={cap.title}
            className={`group relative bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 hover:border-white/[0.12] transition-all duration-500 ${
              reveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: reveal.isVisible ? `${i * 150}ms` : '0ms' }}
          >
            {/* Gradient accent */}
            <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${cap.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cap.color} bg-opacity-10 flex items-center justify-center mb-6`} style={{ background: `linear-gradient(135deg, rgba(239,68,68,0.12), rgba(249,115,22,0.08))` }}>
              <Icon name={cap.icon} size={22} className="text-red-400" />
            </div>

            <h3 className="text-xl font-bold text-white mb-3">{cap.title}</h3>
            <p className="text-sm text-white/35 leading-relaxed mb-6">{cap.description}</p>

            <div className="flex items-center gap-2 text-xs font-medium text-red-400/80">
              <Icon name="trending-up" size={14} />
              {cap.stat}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── PRODUCT DISCOVERY SECTION ─── */
function ProductDiscoverySection({
  activeCategory,
  setActiveCategory,
  filtered,
}: {
  activeCategory: string;
  setActiveCategory: (c: string) => void;
  filtered: typeof petroleumProducts;
}) {
  const reveal = useScrollReveal();

  return (
    <div ref={reveal.ref}>
      <div className="mb-12">
        <p className="text-xs font-bold text-red-400 tracking-[0.2em] uppercase mb-4">Product Catalogue</p>
        <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">Products & Services</h2>
        <p className="text-base text-white/30 max-w-xl">Select a category or browse our full range of petroleum products and services.</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-12">
        {petroleumCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                : 'bg-white/[0.04] text-white/40 hover:bg-white/[0.08] hover:text-white/70 border border-white/[0.06]'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((product, i) => (
          <Link
            key={product.id}
            href={`/solutions/petroleum/${product.slug}`}
            className={`group relative bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-red-500/30 transition-all duration-500 ${
              reveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: reveal.isVisible ? `${i * 80}ms` : '0ms' }}
          >
            {/* Product Image */}
            <div className="relative h-48 overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/15 border border-red-500/20 text-[10px] font-semibold text-red-400 uppercase tracking-wider">
                  <Icon name={product.icon} size={11} />
                  {product.category.replace('-', ' ')}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-base font-bold text-white group-hover:text-red-400 transition-colors mb-2">{product.name}</h3>
              <p className="text-xs text-white/30 mb-4 leading-relaxed line-clamp-2">{product.shortDescription}</p>

              {/* Features */}
              <ul className="space-y-1.5 mb-5">
                {product.features.slice(0, 3).map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-[11px] text-white/25">
                    <span className="w-1 h-1 rounded-full bg-red-400 mt-1.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                <span className="text-[10px] text-white/20 font-medium uppercase tracking-wider">
                  MOQ: {product.minimumOrder || 'N/A'}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-400 group-hover:gap-2 transition-all">
                  View Details <Icon name="arrow-right" size={12} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ─── TRUST SECTION ─── */
function TrustSection() {
  const reveal = useScrollReveal();
  const certifications = [
    { name: 'DPR Licensed', description: 'Department of Petroleum Resources' },
    { name: 'NMDPRA Certified', description: 'Nigerian Midstream and Downstream Petroleum Regulatory Authority' },
    { name: 'ISO 9001:2015', description: 'Quality Management System' },
    { name: 'ISO 14001', description: 'Environmental Management System' },
    { name: 'HSE Compliant', description: 'Health, Safety & Environment Standards' },
    { name: 'API Standards', description: 'American Petroleum Institute' },
  ];

  return (
    <div
      ref={reveal.ref}
      className={`transition-all duration-700 ${reveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="text-center mb-12">
        <p className="text-xs font-bold text-red-400 tracking-[0.2em] uppercase mb-4">Compliance & Safety</p>
        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">Certified. Compliant. Trusted.</h2>
        <p className="text-sm text-white/30 max-w-lg mx-auto">Every operation meets the highest industry standards and regulatory requirements.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {certifications.map((cert, i) => (
          <div
            key={cert.name}
            className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 text-center hover:border-red-500/20 transition-all duration-300"
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mx-auto mb-3">
              <Icon name="shield-check" size={18} className="text-red-400" />
            </div>
            <p className="text-xs font-bold text-white mb-1">{cert.name}</p>
            <p className="text-[10px] text-white/20 leading-snug">{cert.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── CTA SECTION ─── */
function CTASection() {
  const reveal = useScrollReveal();
  return (
    <div
      ref={reveal.ref}
      className={`transition-all duration-700 ${reveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 mb-8">
        <Icon name="zap" size={12} className="text-red-400" />
        <span className="text-xs font-semibold text-red-400">Get Started Today</span>
      </div>

      <h2 className="text-3xl lg:text-5xl font-bold text-white mb-5">
        Ready to Discuss Your
        <br />
        <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">Fuel Requirements?</span>
      </h2>
      <p className="text-base text-white/30 mb-10 max-w-md mx-auto">
        Whether you need a one-time bulk delivery or an ongoing supply partnership, our team is ready to build a solution for your operation.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/quote"
          className="inline-flex items-center gap-2.5 px-8 py-4 text-sm font-bold text-white bg-red-600 hover:bg-red-500 rounded-xl transition-all duration-300 shadow-2xl shadow-red-600/25 hover:shadow-red-500/40 hover:-translate-y-0.5"
        >
          <Icon name="zap" size={16} />
          Start Your Quote
        </Link>
        <a
          href="tel:+2349000000000"
          className="inline-flex items-center gap-2.5 px-8 py-4 text-sm font-semibold text-white/60 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:text-white rounded-xl transition-all duration-300"
        >
          <Icon name="phone" size={16} />
          Call Sales Desk
        </a>
      </div>
    </div>
  );
}
