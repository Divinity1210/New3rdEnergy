'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { solarGuides, solarFaqs } from '@/lib/data/solar-education';

export default function SolarEducationPage() {
  const [activeGuideId, setActiveGuideId] = useState<string>(solarGuides[0].id);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const activeGuide = solarGuides.find((g) => g.id === activeGuideId) || solarGuides[0];

  return (
    <div className="bg-neutral-950 text-white min-h-screen pt-32 pb-24 lg:pt-40">
      <div className="container-wide max-w-6xl">
        {/* Header */}
        <div className="text-center space-y-3 mb-12 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-solar-500/10 border border-solar-500/20 text-solar-400 text-xs font-semibold">
            <Icon name="book-open" size={14} />
            Engineering Knowledge Hub
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-white">
            Solar Education & <span className="text-solar-400">Technical Insights.</span>
          </h1>
          <p className="text-sm text-neutral-400">
            Unbiased engineering fundamentals. Understand inverter sizing physics, battery chemistry lifespans, generator cost economics, and installation quality standards.
          </p>
        </div>

        {/* Interactive Guide Reader (Two Columns) */}
        <div className="grid lg:grid-cols-12 gap-8 items-start mb-20">
          {/* Guide Index Navigation (4 cols) */}
          <div className="lg:col-span-4 space-y-2 sticky top-28">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block px-2 mb-3">
              Topics & Guides
            </span>
            {solarGuides.map((guide) => (
              <button
                key={guide.id}
                onClick={() => setActiveGuideId(guide.id)}
                className={`w-full p-4 rounded-lg text-left border transition-all flex items-start gap-3 ${
                  activeGuideId === guide.id
                    ? 'bg-solar-500/15 border-solar-500/50 text-white shadow-lg shadow-amber-950/20'
                    : 'bg-neutral-900/60 border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    activeGuideId === guide.id
                      ? 'bg-solar-500/20 text-solar-300'
                      : 'bg-white/5 text-neutral-400'
                  }`}
                >
                  <Icon name={guide.icon || 'book-open'} size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-xs leading-snug line-clamp-2">{guide.title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-neutral-500">
                    <span>{guide.category}</span>
                    <span>•</span>
                    <span>{guide.readTime}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Guide Article Content View (8 cols) */}
          <div className="lg:col-span-8 p-8 sm:p-10 rounded-lg bg-neutral-900/80 border border-white/10 backdrop-blur-md shadow-xl space-y-6">
            <div className="border-b border-white/10 pb-6 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-solar-400">
                <Icon name={activeGuide.icon || 'zap'} size={14} />
                <span>{activeGuide.category}</span>
                <span className="text-neutral-600">•</span>
                <span className="text-neutral-400">{activeGuide.readTime}</span>
              </div>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
                {activeGuide.title}
              </h2>
              <p className="text-xs text-neutral-300 italic">{activeGuide.summary}</p>
            </div>

            {/* Markdown Body Render */}
            <div className="space-y-4 text-xs sm:text-sm text-neutral-200 leading-relaxed prose-invert whitespace-pre-line">
              {activeGuide.content}
            </div>

            {/* Key Takeaways Box */}
            <div className="p-6 rounded-lg bg-solar-500/10 border border-solar-500/30 space-y-3">
              <h3 className="text-xs font-bold text-solar-300 uppercase tracking-wider flex items-center gap-2">
                <Icon name="check-circle" size={16} className="text-solar-400" />
                Key Engineering Takeaways
              </h3>
              <ul className="space-y-2 text-xs text-amber-100/90">
                {activeGuide.keyTakeaways.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-solar-400 font-bold">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interactive Sizing / Planner CTA banner */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-neutral-400">Ready to calculate your load?</span>
              <div className="flex gap-2">
                <Link
                  href="/power/planner"
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-primary-600 to-amber-500 text-white font-bold text-xs hover:opacity-95 transition-opacity flex items-center gap-1.5"
                >
                  <Icon name="zap" size={14} />
                  Start AI Planner
                </Link>
                <Link
                  href="/power/calculator"
                  className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-xs transition-colors"
                >
                  Open Calculator
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ===== FREQUENTLY ASKED QUESTIONS ===== */}
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white">
              Frequently Answered Questions
            </h2>
            <p className="text-xs text-neutral-400">
              Clear answers to the most common questions regarding solar batteries, generators, and sizing.
            </p>
          </div>

          <div className="space-y-3">
            {solarFaqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-lg bg-neutral-900/60 border border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-semibold text-white hover:text-solar-300 transition-colors"
                  aria-expanded={openFaqIndex === index}
                >
                  <span>{faq.q}</span>
                  <Icon
                    name="chevron-down"
                    size={16}
                    className={`transition-transform duration-200 shrink-0 text-neutral-400 ${
                      openFaqIndex === index ? 'rotate-180 text-solar-400' : ''
                    }`}
                  />
                </button>

                {openFaqIndex === index && (
                  <div className="p-5 pt-0 text-xs text-neutral-300 leading-relaxed border-t border-white/5 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
