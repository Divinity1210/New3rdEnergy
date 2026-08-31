'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/components';
import { Icon } from '@/components/ui/Icon';
import { motion, useInView } from 'motion/react';

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

export default function AboutPage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative min-h-[55vh] flex items-end overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0">
          <Image
            src="/images/about-team.jpg"
            alt="3rd Energy leadership team"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-[#0a0a0a]/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/70 to-transparent" />
        </div>

        <div className="container-wide relative z-10 pb-14 lg:pb-16 pt-40">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About' }]} />
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="max-w-2xl mt-4"
          >
            <p className="label-text-light mb-5">About Us</p>
            <h1 className="display-xl text-white mb-5">
              Building the Future of Energy.
            </h1>
            <p className="text-base text-white/40 leading-relaxed max-w-lg">
              3rd Energy is an energy solutions company providing petroleum supply, emerging power solutions, and strategic energy management for businesses across all sectors.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== MISSION & VISION ===== */}
      <section className="section bg-white">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 gap-px bg-neutral-100 border border-neutral-100 rounded-lg overflow-hidden max-w-4xl mx-auto">
            <MotionSection>
              <div className="bg-white p-8 lg:p-10 h-full">
                <span className="text-xs font-mono font-semibold text-primary-600 mb-4 block">01</span>
                <h2 className="text-xl font-heading font-bold text-neutral-900 mb-4">Our Mission</h2>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  To provide reliable, efficient, and sustainable energy solutions that power the operations of businesses across all sectors. We are committed to operational excellence, transparent partnerships, and continuous innovation in how energy is sourced, managed, and delivered.
                </p>
              </div>
            </MotionSection>

            <MotionSection delay={0.1}>
              <div className="bg-white p-8 lg:p-10 h-full">
                <span className="text-xs font-mono font-semibold text-accent-600 mb-4 block">02</span>
                <h2 className="text-xl font-heading font-bold text-neutral-900 mb-4">Our Vision</h2>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  To be the most trusted energy partner for businesses — known for reliability, expertise, and a forward-thinking approach to energy solutions that balance operational needs with environmental responsibility.
                </p>
              </div>
            </MotionSection>
          </div>
        </div>
      </section>

      {/* ===== GROUP STRUCTURE ===== */}
      <section className="section bg-[#0a0a0a]">
        <div className="container-wide">
          <MotionSection>
            <div className="text-center mb-14">
              <p className="label-text-light mb-4">Group Structure</p>
              <h2 className="display-lg text-white mb-4">
                One Platform. Two Verticals.
              </h2>
              <p className="text-sm text-neutral-500 max-w-lg mx-auto">
                3rd Energy operates as a parent brand with two commercial verticals — each focused on a distinct energy domain.
              </p>
            </div>
          </MotionSection>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <MotionSection delay={0.1}>
              <div className="border border-white/[0.06] rounded-lg p-8 hover:border-white/10 transition-colors h-full">
                <div className="flex items-center gap-3 mb-5">
                  <Icon name="fuel" size={22} className="text-primary-500" />
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-primary-900/30 text-primary-400 rounded border border-primary-500/20">Active</span>
                </div>
                <h3 className="text-lg font-heading font-bold text-white mb-3">3RD Petroleum Solutions</h3>
                <p className="text-sm text-neutral-500 leading-relaxed mb-6">
                  The commercial fuel arm. Supplies diesel, petrol, LPG, lubricants, and provides storage, logistics, consulting, and fuel management services.
                </p>
                <Link href="/solutions/petroleum" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-400 hover:text-primary-300 transition-colors">
                  Explore Petroleum <Icon name="arrow-right" size={14} />
                </Link>
              </div>
            </MotionSection>

            <MotionSection delay={0.2}>
              <div className="border border-white/[0.06] rounded-lg p-8 hover:border-solar-500/20 transition-colors h-full" data-industry="solar">
                <div className="flex items-center gap-3 mb-5">
                  <Icon name="sun" size={22} className="text-solar-400" />
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-solar-900/30 text-solar-400 rounded border border-solar-500/20">Phase 2</span>
                </div>
                <h3 className="text-lg font-heading font-bold text-white mb-3">3RD Power & Solar</h3>
                <p className="text-sm text-neutral-500 leading-relaxed mb-6">
                  The clean energy arm. Solar installations, power systems, hybrid solutions, and energy storage for businesses transitioning to sustainable power.
                </p>
                <Link href="/solutions/power-solar" className="inline-flex items-center gap-1.5 text-sm font-semibold text-solar-400 hover:text-solar-300 transition-colors">
                  Learn More <Icon name="arrow-right" size={14} />
                </Link>
              </div>
            </MotionSection>
          </div>
        </div>
      </section>

      {/* ===== CORE VALUES ===== */}
      <section className="section bg-white">
        <div className="container-wide">
          <MotionSection>
            <p className="label-text mb-4">Our Values</p>
            <h2 className="display-lg text-neutral-900 mb-14">What Drives Us</h2>
          </MotionSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-100 border border-neutral-100 rounded-lg overflow-hidden">
            {[
              { icon: 'shield', title: 'Reliability', desc: 'Consistent delivery, every time. Our clients depend on us for uninterrupted operations.' },
              { icon: 'trending-up', title: 'Excellence', desc: 'Industry-leading quality standards, compliance, and operational precision.' },
              { icon: 'users', title: 'Partnership', desc: 'We succeed when our clients succeed. True partnership drives everything we do.' },
              { icon: 'globe', title: 'Innovation', desc: 'Forward-thinking approaches to energy challenges, from petroleum to clean power.' },
            ].map((value, i) => (
              <MotionSection key={value.title} delay={i * 0.06}>
                <div className="bg-white p-7 h-full">
                  <Icon name={value.icon} size={20} className="text-neutral-300 mb-4" />
                  <h3 className="text-sm font-semibold text-neutral-900 mb-2">{value.title}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">{value.desc}</p>
                </div>
              </MotionSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="bg-primary-800">
        <div className="container-wide py-20 lg:py-24">
          <MotionSection>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="display-lg text-white mb-5">Ready to Partner With Us?</h2>
              <p className="text-base text-white/60 mb-10 max-w-lg mx-auto">
                Whether you need reliable petroleum supply or want to explore sustainable energy options, we&apos;re here to help.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-primary-900 bg-white hover:bg-neutral-100 rounded-md transition-colors"
                >
                  <Icon name="mail" size={16} />
                  Get in Touch
                </Link>
                <Link
                  href="/quote"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-white/70 border border-white/20 hover:border-white/40 hover:text-white rounded-md transition-colors"
                >
                  <Icon name="zap" size={16} />
                  Request a Quote
                </Link>
              </div>
            </div>
          </MotionSection>
        </div>
      </section>
    </>
  );
}
