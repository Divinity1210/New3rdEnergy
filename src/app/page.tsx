'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@/components/ui/Icon';
import { petroleumProducts } from '@/lib/data/petroleum-products';
import { industries } from '@/lib/data/industries';
import { insightArticles } from '@/lib/data/insights';
import { formatDate, getWhatsAppUrl } from '@/lib/utils';
import { motion, useInView, useScroll, useTransform } from 'motion/react';

// ===== MOTION SECTION WRAPPER =====
function MotionSection({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ===== ANIMATED COUNTER =====
function AnimatedCounter({ end, suffix = '', prefix = '' }: { end: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, { once: true });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;
      const duration = 2000;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(eased * end));
        if (progress < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    }
  }, [end, isInView]);

  return (
    <span ref={ref} className="stat-number">
      {prefix}{count}{suffix}
    </span>
  );
}

// ===== 3D TILT CARD =====
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-300 ease-out ${className || ''}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
}

// ===== MAIN HOMEPAGE =====
export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroImageY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <>
      {/* ===== HERO — EDITORIAL FULL-BLEED ===== */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0a0a]">
        {/* Parallax background image */}
        <motion.div className="absolute inset-0" style={{ y: heroImageY }}>
          <Image
            src="/images/hero-bg.jpg"
            alt=""
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/20" />
        </motion.div>

        {/* Hero content */}
        <motion.div className="container-wide relative z-10 py-32 lg:py-0" style={{ opacity: heroOpacity }}>
          <div className="max-w-3xl">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="label-text-light mb-6"
            >
              Petroleum · Power · Solar
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="display-xl text-white mb-6"
            >
              Powering Business
              <br />
              Through Reliable
              <br />
              <span className="text-primary-500">Energy.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg text-white/50 mb-10 max-w-lg leading-relaxed"
            >
              Trusted energy infrastructure for commercial and industrial operations.
              From petroleum supply to emerging power solutions — delivered with precision.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link
                href="/solutions"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-primary-700 hover:bg-primary-600 rounded-md transition-all group"
              >
                Explore Solutions
                <Icon name="arrow-right" size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/quote"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white/70 border border-white/10 hover:border-white/25 hover:text-white rounded-md transition-all"
              >
                Request a Quote
              </Link>
            </motion.div>

            {/* Trust bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="flex items-center gap-8 mt-16 pt-8 border-t border-white/[0.06]"
            >
              {[
                { label: 'Certified Quality', icon: 'shield' },
                { label: 'Nationwide Delivery', icon: 'truck' },
                { label: '24/7 Support', icon: 'phone' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <Icon name={item.icon} size={13} className="text-white/20" />
                  <span className="text-[11px] text-white/25 font-medium uppercase tracking-widest">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ===== STATS STRIP ===== */}
      <section className="bg-[#0a0a0a] border-y border-white/[0.04]">
        <div className="container-wide py-10 lg:py-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
            {[
              { value: 247, suffix: '+', label: 'Active Clients' },
              { value: 12, suffix: 'M+', label: 'Litres Delivered Annually' },
              { value: 99, suffix: '%', label: 'On-Time Delivery Rate' },
              { value: 15, suffix: '+', label: 'Years Industry Experience' },
            ].map((stat, i) => (
              <MotionSection key={stat.label} delay={i * 0.08}>
                <div className={`text-center lg:text-left ${i > 0 ? 'lg:border-l lg:border-white/[0.06] lg:pl-8' : ''}`}>
                  <p className="text-3xl lg:text-4xl xl:text-5xl font-heading font-extrabold text-white tracking-tight mb-1">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-xs text-white/30 font-medium uppercase tracking-wider">{stat.label}</p>
                </div>
              </MotionSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SOLUTIONS ===== */}
      <section className="section bg-[#0a0a0a] overflow-hidden">
        <div className="container-wide">
          <MotionSection>
            <p className="label-text-light mb-4">Our Solutions</p>
            <h2 className="display-lg text-white mb-4">
              Two Verticals. One Platform.
            </h2>
            <p className="text-neutral-500 max-w-xl text-base mb-14">
              From established petroleum infrastructure to next-generation clean energy — we build the energy ecosystem your business needs.
            </p>
          </MotionSection>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Petroleum Card */}
            <MotionSection delay={0.1}>
              <TiltCard>
                <Link href="/solutions/petroleum" className="group block relative rounded-lg overflow-hidden">
                  <div className="relative h-[480px]">
                    <Image
                      src="/images/petroleum-bg.jpg"
                      alt="Petroleum infrastructure"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <p className="label-text text-primary-400 mb-3">Petroleum</p>
                    <h3 className="text-2xl lg:text-3xl font-heading font-bold text-white mb-3 tracking-tight">
                      Petroleum Solutions
                    </h3>
                    <p className="text-sm text-white/40 mb-5 max-w-sm leading-relaxed">
                      Reliable fuel supply, storage systems, logistics management, and consulting for commercial operations.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {['Diesel', 'Petrol', 'LPG', 'Storage'].map((tag) => (
                        <span key={tag} className="px-2.5 py-1 text-[11px] font-medium text-white/40 border border-white/[0.06] rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-400 group-hover:text-primary-300 transition-colors">
                      Explore <Icon name="arrow-right" size={14} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </TiltCard>
            </MotionSection>

            {/* Solar Card */}
            <MotionSection delay={0.2}>
              <TiltCard>
                <Link href="/solutions/power-solar" className="group block relative rounded-lg overflow-hidden" data-industry="solar">
                  <div className="relative h-[480px]">
                    <Image
                      src="/images/solar-bg.jpg"
                      alt="Solar energy installation"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex items-center gap-3 mb-3">
                      <p className="label-text text-solar-400">Power & Solar</p>
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-950/60 text-emerald-400 rounded border border-emerald-500/30">
                        Renewable Tech
                      </span>
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-heading font-bold text-white mb-3 tracking-tight">
                      Power & Solar
                    </h3>
                    <p className="text-sm text-white/40 mb-5 max-w-sm leading-relaxed">
                      Clean energy solutions for businesses transitioning to sustainable power. Solar installations, power systems, and energy storage.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {['Solar PV', 'Hybrid Systems', 'Storage', 'Consulting'].map((tag) => (
                        <span key={tag} className="px-2.5 py-1 text-[11px] font-medium text-white/40 border border-white/[0.06] rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-solar-400 group-hover:text-solar-300 transition-colors">
                      Learn More <Icon name="arrow-right" size={14} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </TiltCard>
            </MotionSection>
          </div>
        </div>
      </section>

      {/* ===== INDUSTRIES WE SERVE ===== */}
      <section className="section bg-white">
        <div className="container-wide">
          <MotionSection>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-14">
              <div>
                <p className="label-text mb-4">Industries</p>
                <h2 className="display-lg text-neutral-900">Who We Serve</h2>
              </div>
              <p className="text-neutral-400 max-w-md text-sm leading-relaxed">
                Tailored energy infrastructure across high-demand commercial, industrial, and institutional sectors.
              </p>
            </div>
          </MotionSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-neutral-100 border border-neutral-100 rounded-lg overflow-hidden">
            {industries.map((industry, i) => (
              <MotionSection key={industry.id} delay={i * 0.04}>
                <Link href={`/industries/${industry.slug}`} className="group block bg-white p-6 h-full hover:bg-neutral-50 transition-colors">
                  <Icon name={industry.icon} size={22} className="text-neutral-300 group-hover:text-primary-600 transition-colors mb-4" />
                  <h3 className="text-sm font-semibold text-neutral-800 group-hover:text-primary-700 transition-colors mb-1">{industry.name}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">{industry.shortDescription}</p>
                </Link>
              </MotionSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY 3RD ENERGY ===== */}
      <section className="section bg-neutral-50">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left: Content */}
            <MotionSection>
              <p className="label-text mb-4">Why 3rd Energy</p>
              <h2 className="display-lg text-neutral-900 mb-6">
                The Energy Partner You Can Trust
              </h2>
              <p className="text-neutral-500 text-base mb-10 leading-relaxed">
                We combine deep industry expertise with operational reliability to deliver energy solutions that keep your business running — day and night.
              </p>

              <div className="space-y-6">
                {[
                  { num: '01', title: 'Reliable Supply', desc: 'Consistent, quality-assured fuel delivery with contingency planning for every scenario.' },
                  { num: '02', title: 'Dedicated Support', desc: 'Single point of contact for all your energy needs — 24/7 availability.' },
                  { num: '03', title: 'Cost Optimisation', desc: 'Strategic procurement and inventory management to reduce your energy spend.' },
                  { num: '04', title: 'Scalable Solutions', desc: 'From single-site to multi-location nationwide management.' },
                ].map((item, i) => (
                  <MotionSection key={item.num} delay={i * 0.08}>
                    <div className="flex gap-4 group">
                      <span className="text-xs font-mono font-semibold text-primary-600 mt-1 shrink-0">{item.num}</span>
                      <div>
                        <h3 className="text-base font-semibold text-neutral-900 mb-1">{item.title}</h3>
                        <p className="text-sm text-neutral-400 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </MotionSection>
                ))}
              </div>
            </MotionSection>

            {/* Right: Image */}
            <MotionSection delay={0.2}>
              <div className="relative">
                <Image
                  src="/images/about-team.jpg"
                  alt="3rd Energy team"
                  width={600}
                  height={600}
                  className="w-full h-auto rounded-lg"
                />
                {/* Overlapping stat callout */}
                <TiltCard className="absolute -bottom-6 -left-6 lg:-left-8 z-10">
                  <div className="bg-white rounded-lg shadow-xl p-5 border border-neutral-100">
                    <p className="text-3xl font-heading font-extrabold text-neutral-900 tracking-tight">
                      <AnimatedCounter end={99} suffix="%" />
                    </p>
                    <p className="text-xs text-neutral-400 font-medium">Delivery Rate</p>
                  </div>
                </TiltCard>
              </div>
            </MotionSection>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="section bg-white">
        <div className="container-wide">
          <MotionSection>
            <p className="label-text mb-4">How It Works</p>
            <h2 className="display-lg text-neutral-900 mb-14">
              From Enquiry to Delivery
            </h2>
          </MotionSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {[
              { step: '01', title: 'Tell Us What You Need', desc: 'Use our quote engine or speak directly with our team about your requirements.', icon: 'edit' },
              { step: '02', title: 'We Assess & Propose', desc: 'Our specialists design a tailored energy solution for your operations.', icon: 'search' },
              { step: '03', title: 'Agreement & Setup', desc: 'Clear commercial terms, compliance checks, and infrastructure preparation.', icon: 'check' },
              { step: '04', title: 'Reliable Delivery', desc: 'Scheduled fuel delivery, real-time tracking, and ongoing account management.', icon: 'truck' },
            ].map((item, i) => (
              <MotionSection key={item.step} delay={i * 0.1}>
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl font-heading font-extrabold text-neutral-100">{item.step}</span>
                    <div className="h-px flex-1 bg-neutral-100" />
                  </div>
                  <h3 className="text-base font-semibold text-neutral-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">{item.desc}</p>
                </div>
              </MotionSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRODUCT PREVIEW ===== */}
      <section className="section bg-neutral-50">
        <div className="container-wide">
          <MotionSection>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-14">
              <div>
                <p className="label-text mb-4">Products</p>
                <h2 className="display-lg text-neutral-900">Our Petroleum Products</h2>
              </div>
              <Link href="/solutions/petroleum" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors group">
                View all products <Icon name="arrow-right" size={14} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </MotionSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-200 border border-neutral-200 rounded-lg overflow-hidden">
            {petroleumProducts.slice(0, 8).map((product, i) => (
              <MotionSection key={product.id} delay={i * 0.04}>
                <div className="group bg-white p-6 h-full hover:bg-neutral-50 transition-colors">
                  <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors mb-2">{product.name}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed mb-4 line-clamp-2">{product.shortDescription}</p>
                  <Link href="/solutions/petroleum" className="text-xs font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1 transition-colors">
                    Details <Icon name="arrow-right" size={12} />
                  </Link>
                </div>
              </MotionSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== AI ASSISTANT CTA ===== */}
      <section className="bg-[#0a0a0a]">
        <div className="container-wide py-20 lg:py-28">
          <MotionSection>
            <div className="max-w-2xl mx-auto text-center">
              <p className="label-text-light mb-4">AI-Powered</p>
              <h2 className="display-lg text-white mb-5">
                Not Sure What You Need?
              </h2>
              <p className="text-base text-white/40 mb-10 max-w-lg mx-auto leading-relaxed">
                Our Energy Assistant analyses your operational requirements and recommends the right energy solutions — in seconds.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Link
                  href="/energy-assistant"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-[#0a0a0a] bg-accent-400 hover:bg-accent-300 rounded-md transition-colors"
                >
                  <Icon name="zap" size={16} />
                  Try the Energy Assistant
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-white/50 hover:text-white border border-white/[0.06] hover:border-white/15 rounded-md transition-colors"
                >
                  Talk to Our Team
                </Link>
              </div>
            </div>
          </MotionSection>
        </div>
      </section>

      {/* ===== INSIGHTS PREVIEW ===== */}
      <section className="section bg-white">
        <div className="container-wide">
          <MotionSection>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-14">
              <div>
                <p className="label-text mb-4">Insights</p>
                <h2 className="display-lg text-neutral-900">Latest Industry Insights</h2>
              </div>
              <Link href="/insights" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors group">
                View all articles <Icon name="arrow-right" size={14} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </MotionSection>

          <div className="grid md:grid-cols-3 gap-6">
            {insightArticles.slice(0, 3).map((article, i) => (
              <MotionSection key={article.slug} delay={i * 0.1}>
                <Link href={`/insights/${article.slug}`} className="group block">
                  <div className="border border-neutral-100 rounded-lg overflow-hidden hover:border-neutral-200 transition-colors">
                    <div className="h-48 bg-neutral-100 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon name="file-text" size={32} className="text-neutral-200 group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[10px] font-semibold text-primary-600 uppercase tracking-wider">{article.category}</span>
                        <span className="text-[10px] text-neutral-300">·</span>
                        <span className="text-[10px] text-neutral-400">{formatDate(article.date)}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-neutral-900 mb-2 group-hover:text-primary-700 transition-colors line-clamp-2">{article.title}</h3>
                      <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">{article.excerpt}</p>
                    </div>
                  </div>
                </Link>
              </MotionSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="bg-primary-800">
        <div className="container-wide py-20 lg:py-24">
          <MotionSection>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="display-lg text-white mb-5">
                Ready to Power Your Business?
              </h2>
              <p className="text-base text-white/60 mb-10 max-w-lg mx-auto">
                Get a tailored quote for your energy requirements. Our team responds within 24 hours with a bespoke commercial proposal.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Link
                  href="/quote"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-primary-900 bg-white hover:bg-neutral-100 rounded-md transition-colors"
                >
                  <Icon name="zap" size={16} />
                  Request a Quote
                </Link>
                <Link
                  href={getWhatsAppUrl('Hello 3rd Energy, I would like to discuss energy solutions for my business.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-white/70 border border-white/20 hover:border-white/40 hover:text-white rounded-md transition-colors"
                >
                  <Icon name="whatsapp" size={16} />
                  Chat on WhatsApp
                </Link>
              </div>
            </div>
          </MotionSection>
        </div>
      </section>
    </>
  );
}
