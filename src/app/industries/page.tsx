'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/components';
import { Icon } from '@/components/ui/Icon';
import { industries } from '@/lib/data/industries';
import { motion, useInView } from 'motion/react';

function MotionSection({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function IndustriesPage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative min-h-[55vh] flex items-end overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0">
          <Image
            src="/images/industries-hero.jpg"
            alt="Energy infrastructure panorama"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/30" />
        </div>

        <div className="container-wide relative z-10 pb-14 lg:pb-16 pt-40">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Industries' }]} />
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="max-w-2xl mt-4"
          >
            <p className="label-text-light mb-5">Industries</p>
            <h1 className="display-xl text-white mb-5">
              Energy Solutions Tailored to Your Industry.
            </h1>
            <p className="text-base text-white/40 leading-relaxed max-w-lg">
              Every industry has unique energy demands. We provide tailored solutions that address the specific challenges and requirements of your sector.
            </p>
          </motion.div>

          {/* Quick nav */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-wrap gap-2 mt-8"
          >
            {industries.map((ind) => (
              <a
                key={ind.id}
                href={`#${ind.slug}`}
                className="px-3 py-1.5 rounded text-xs font-medium text-white/40 border border-white/[0.06] hover:border-white/10 hover:text-white/70 transition-colors"
              >
                {ind.name}
              </a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== INDUSTRIES SHOWCASE ===== */}
      <section className="bg-[#0a0a0a] py-20 lg:py-28">
        <div className="container-wide space-y-16">
          {industries.map((industry, index) => {
            const isEven = index % 2 === 0;
            return (
              <MotionSection key={industry.id} delay={0.05}>
                <div
                  id={industry.slug}
                  className="scroll-mt-24"
                >
                  <div className={`grid lg:grid-cols-2 gap-0 rounded-lg overflow-hidden border border-white/[0.06] bg-white/[0.02]`}>
                    {/* Image Side */}
                    <div className={`relative h-64 lg:h-auto lg:min-h-[450px] ${isEven ? 'order-1' : 'order-1 lg:order-2'}`}>
                      {industry.image ? (
                        <Image
                          src={industry.image}
                          alt={industry.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
                          <Icon name={industry.icon} size={64} className="text-white/[0.04]" />
                        </div>
                      )}
                      <div className={`absolute inset-0 ${isEven ? 'bg-gradient-to-r from-transparent to-[#0a0a0a]/20' : 'bg-gradient-to-l from-transparent to-[#0a0a0a]/20'}`} />

                      {/* Industry label */}
                      <div className="absolute top-4 left-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0a0a0a]/70 border border-white/[0.06]">
                          <Icon name={industry.icon} size={12} className="text-white/30" />
                          <span className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">{industry.name}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content Side */}
                    <div className={`p-8 lg:p-12 flex flex-col justify-center ${isEven ? 'order-2' : 'order-2 lg:order-1'}`}>
                      <span className="text-xs font-mono font-semibold text-white/15 mb-4">0{index + 1}</span>

                      <h2 className="text-2xl lg:text-3xl font-heading font-bold text-white mb-4">{industry.name}</h2>
                      <p className="text-sm text-white/30 leading-relaxed mb-8">{industry.description}</p>

                      <div className="grid sm:grid-cols-2 gap-8 mb-8">
                        {/* Challenges */}
                        <div>
                          <h4 className="text-[11px] font-semibold text-white/20 uppercase tracking-[0.12em] mb-4 flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-red-400" />
                            Challenges
                          </h4>
                          <ul className="space-y-2.5">
                            {industry.challenges.map((c) => (
                              <li key={c} className="flex items-start gap-2 text-xs text-white/30">
                                <span className="w-0.5 h-0.5 rounded-full bg-white/15 mt-1.5 shrink-0" />
                                {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {/* Solutions */}
                        <div>
                          <h4 className="text-[11px] font-semibold text-white/20 uppercase tracking-[0.12em] mb-4 flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-solar-400" />
                            Our Solutions
                          </h4>
                          <ul className="space-y-2.5">
                            {industry.solutions.map((s) => (
                              <li key={s} className="flex items-start gap-2 text-xs text-white/40">
                                <Icon name="check" size={12} className="text-solar-400 mt-0.5 shrink-0" />
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                          href={`/quote?industry=${industry.id}`}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#0a0a0a] bg-accent-400 hover:bg-accent-300 rounded-md transition-colors"
                        >
                          Request a Quote <Icon name="arrow-right" size={14} />
                        </Link>
                        <Link
                          href={`/industries/${industry.slug}`}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white/40 border border-white/[0.06] hover:border-white/10 hover:text-white/70 rounded-md transition-colors"
                        >
                          Learn More
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </MotionSection>
            );
          })}
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="bg-primary-800 py-16 lg:py-20">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="display-md text-white mb-3">Trusted Across Every Sector</h2>
            <p className="text-sm text-white/50 max-w-md mx-auto">
              Delivering reliable energy solutions to businesses across Nigeria&apos;s most demanding industries.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '5', label: 'Industries Served' },
              { value: '247+', label: 'Active Clients' },
              { value: '99%', label: 'Delivery Rate' },
              { value: '15+', label: 'Years Experience' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl lg:text-4xl font-heading font-extrabold text-white mb-1">{stat.value}</div>
                <div className="text-xs text-white/40 font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="bg-[#0a0a0a] py-20 lg:py-24">
        <div className="container-wide">
          <MotionSection>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="display-lg text-white mb-5">Don&apos;t See Your Industry?</h2>
              <p className="text-sm text-white/30 mb-10 max-w-md mx-auto">
                We serve businesses across all sectors. Contact us to discuss your specific energy requirements.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-[#0a0a0a] bg-accent-400 hover:bg-accent-300 rounded-md transition-colors"
                >
                  <Icon name="message-circle" size={16} />
                  Contact Our Team
                </Link>
                <Link
                  href="/quote"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-white/40 border border-white/[0.06] hover:border-white/10 hover:text-white/70 rounded-md transition-colors"
                >
                  Request a Quote <Icon name="arrow-right" size={14} />
                </Link>
              </div>
            </div>
          </MotionSection>
        </div>
      </section>
    </>
  );
}
