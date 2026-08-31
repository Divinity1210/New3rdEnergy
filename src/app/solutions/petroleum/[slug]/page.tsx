'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { petroleumProducts } from '@/lib/data/petroleum-products';
import { getWhatsAppUrl } from '@/lib/utils';
import InlineQuoteForm from '@/components/petroleum/InlineQuoteForm';

/* ─── Scroll Reveal ─── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, isVisible };
}

export default function PetroleumProductPage({ params }: { params: { slug: string } }) {
  const product = petroleumProducts.find(p => p.slug === params.slug);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setHeroLoaded(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!product) {
    notFound();
  }

  const relatedProducts = petroleumProducts
    .filter(p => p.id !== product.id)
    .sort((a, b) => (a.category === product.category ? -1 : 1))
    .slice(0, 4);

  return (
    <>
      {/* ══════════ PRODUCT HERO ══════════ */}
      <section className="relative h-[60vh] min-h-[500px] overflow-hidden bg-[#0a0a0a]" data-industry="petroleum">
        {/* Parallax Background */}
        <div
          className="absolute inset-0 scale-110"
          style={{ transform: `translateY(${scrollY * 0.2}px) scale(1.1)` }}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            className={`object-cover transition-opacity duration-1000 ${heroLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-end pb-16">
          <div className="container-wide">
            {/* Breadcrumbs */}
            <nav
              className={`flex items-center gap-2 text-xs text-white/30 mb-6 transition-all duration-700 delay-200 ${
                heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <Link href="/" className="hover:text-white/60 transition-colors">Home</Link>
              <span>/</span>
              <Link href="/solutions" className="hover:text-white/60 transition-colors">Solutions</Link>
              <span>/</span>
              <Link href="/solutions/petroleum" className="hover:text-white/60 transition-colors">Petroleum</Link>
              <span>/</span>
              <span className="text-white/60">{product.name}</span>
            </nav>

            <div className="max-w-2xl">
              {/* Category Badge */}
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-md bg-red-500/10 border border-red-500/20 mb-5 transition-all duration-700 delay-300 ${
                  heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <Icon name={product.icon} size={12} className="text-red-400" />
                <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">{product.category.replace('-', ' ')}</span>
              </div>

              <h1
                className={`text-4xl lg:text-6xl font-bold text-white leading-[1.1] mb-4 transition-all duration-700 delay-[400ms] ${
                  heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                {product.name}
              </h1>

              <p
                className={`text-base text-white/40 leading-relaxed max-w-lg transition-all duration-700 delay-500 ${
                  heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                {product.shortDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ PRODUCT DETAILS ══════════ */}
      <section className="bg-[#0a0a0a] py-20 lg:py-28">
        <div className="container-wide">
          <div className="grid lg:grid-cols-[1fr_380px] gap-16">
            {/* Main Content */}
            <div className="space-y-16">
              {/* Description */}
              <DescriptionSection product={product} />

              {/* Features */}
              <FeaturesSection product={product} />

              {/* Specifications */}
              <SpecificationsSection product={product} />

              {/* Delivery Info */}
              <DeliverySection product={product} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Sticky Quote Card */}
              <div className="lg:sticky lg:top-28">
                {/* Quick Info Card */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 mb-6">
                  <h3 className="text-sm font-bold text-white mb-4">Quick Overview</h3>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon name="package" size={14} className="text-red-400" />
                      </div>
                      <div>
                        <p className="text-xs text-white/40 mb-0.5">Minimum Order</p>
                        <p className="text-sm font-semibold text-white">{product.minimumOrder || 'Contact Sales'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon name="clock" size={14} className="text-red-400" />
                      </div>
                      <div>
                        <p className="text-xs text-white/40 mb-0.5">Delivery Timeline</p>
                        <p className="text-sm font-semibold text-white">{product.deliveryTimeline}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon name="tag" size={14} className="text-red-400" />
                      </div>
                      <div>
                        <p className="text-xs text-white/40 mb-0.5">Pricing</p>
                        <p className="text-sm font-semibold text-white">{product.pricingNote.split('.')[0]}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-white/[0.06] space-y-3">
                    <button
                      onClick={() => setShowQuoteForm(true)}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-red-600 hover:bg-red-500 rounded-xl transition-all duration-300 shadow-lg shadow-red-600/20"
                    >
                      <Icon name="zap" size={14} />
                      Request a Quote
                    </button>
                    <a
                      href={getWhatsAppUrl(`Hello 3rd Energy, I need a quote for ${product.name}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white/50 bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:text-white rounded-xl transition-all duration-300"
                    >
                      <Icon name="whatsapp" size={14} />
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>

                {/* Certifications */}
                {product.certifications && product.certifications.length > 0 && (
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-white mb-4">Certifications</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.certifications.map(cert => (
                        <span key={cert} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/5 border border-red-500/10 text-[11px] font-semibold text-red-400">
                          <Icon name="shield-check" size={11} />
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ INLINE QUOTE FORM (MODAL-LIKE OVERLAY) ══════════ */}
      {showQuoteForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <InlineQuoteForm
              productId={product.id}
              productName={product.name}
              onClose={() => setShowQuoteForm(false)}
            />
          </div>
        </div>
      )}

      {/* ══════════ RELATED PRODUCTS ══════════ */}
      <section className="bg-[#060606] py-20 lg:py-28 border-t border-white/[0.04]">
        <div className="container-wide">
          <RelatedProductsSection products={relatedProducts} />
        </div>
      </section>
    </>
  );
}

/* ─── DESCRIPTION ─── */
function DescriptionSection({ product }: { product: typeof petroleumProducts[0] }) {
  const reveal = useScrollReveal();
  return (
    <div ref={reveal.ref} className={`transition-all duration-700 ${reveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <p className="text-xs font-bold text-red-400 tracking-[0.2em] uppercase mb-4">About This Product</p>
      <p className="text-base text-white/50 leading-[1.8]">{product.description}</p>
    </div>
  );
}

/* ─── FEATURES ─── */
function FeaturesSection({ product }: { product: typeof petroleumProducts[0] }) {
  const reveal = useScrollReveal();
  return (
    <div ref={reveal.ref} className={`transition-all duration-700 ${reveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <p className="text-xs font-bold text-red-400 tracking-[0.2em] uppercase mb-4">Key Features</p>
      <div className="grid sm:grid-cols-2 gap-3">
        {product.features.map((feature, i) => (
          <div
            key={feature}
            className={`flex items-start gap-3 p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl transition-all duration-500`}
            style={{ transitionDelay: reveal.isVisible ? `${i * 80}ms` : '0ms' }}
          >
            <div className="w-6 h-6 rounded-md bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
              <Icon name="check" size={12} className="text-red-400" />
            </div>
            <span className="text-sm text-white/60">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── SPECIFICATIONS ─── */
function SpecificationsSection({ product }: { product: typeof petroleumProducts[0] }) {
  const reveal = useScrollReveal();
  return (
    <div ref={reveal.ref} className={`transition-all duration-700 ${reveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <p className="text-xs font-bold text-red-400 tracking-[0.2em] uppercase mb-4">Technical Specifications</p>
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
        {product.specifications.map((spec, i) => (
          <div
            key={spec.label}
            className={`flex items-center justify-between px-6 py-4 ${i < product.specifications.length - 1 ? 'border-b border-white/[0.04]' : ''}`}
          >
            <span className="text-sm text-white/40">{spec.label}</span>
            <span className="text-sm font-semibold text-white">{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── DELIVERY ─── */
function DeliverySection({ product }: { product: typeof petroleumProducts[0] }) {
  const reveal = useScrollReveal();
  return (
    <div ref={reveal.ref} className={`transition-all duration-700 ${reveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <p className="text-xs font-bold text-red-400 tracking-[0.2em] uppercase mb-4">Pricing & Delivery</p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
            <Icon name="tag" size={18} className="text-red-400" />
          </div>
          <h4 className="text-sm font-bold text-white mb-2">Pricing</h4>
          <p className="text-xs text-white/35 leading-relaxed">{product.pricingNote}</p>
        </div>
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
            <Icon name="truck" size={18} className="text-red-400" />
          </div>
          <h4 className="text-sm font-bold text-white mb-2">Delivery</h4>
          <p className="text-xs text-white/35 leading-relaxed">{product.deliveryTimeline}</p>
          {product.minimumOrder && <p className="text-xs text-white/35 mt-2">Min. order: {product.minimumOrder}</p>}
        </div>
      </div>
    </div>
  );
}

/* ─── RELATED PRODUCTS ─── */
function RelatedProductsSection({ products }: { products: typeof petroleumProducts }) {
  const reveal = useScrollReveal();
  return (
    <div ref={reveal.ref} className={`transition-all duration-700 ${reveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-xs font-bold text-red-400 tracking-[0.2em] uppercase mb-3">More Products</p>
          <h2 className="text-2xl lg:text-3xl font-bold text-white">Related Products & Services</h2>
        </div>
        <Link
          href="/solutions/petroleum"
          className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-red-400 hover:text-red-300 transition-colors"
        >
          View All Products <Icon name="arrow-right" size={14} />
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {products.map((product, i) => (
          <Link
            key={product.id}
            href={`/solutions/petroleum/${product.slug}`}
            className={`group relative bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-red-500/30 transition-all duration-500`}
            style={{ transitionDelay: reveal.isVisible ? `${i * 100}ms` : '0ms' }}
          >
            <div className="relative h-36 overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
            </div>
            <div className="p-4">
              <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors mb-1">{product.name}</h3>
              <p className="text-[11px] text-white/25 line-clamp-2">{product.shortDescription}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
