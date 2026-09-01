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
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen pt-32 pb-24 lg:pt-40">
      <div className="container-wide max-w-6xl">
        {/* Header */}
        <div className="text-center space-y-3 mb-12 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-sm">
            <Icon name="book-open" size={14} className="text-emerald-600" />
            3RD ENERGY SERVICES LTD · TECHNICAL KNOWLEDGE HUB
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-950 tracking-tight">
            Solar Education & <span className="text-emerald-700">Engineering Guides.</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Unbiased engineering fundamentals. Understand inverter sizing physics, battery chemistry lifespans, generator economics, and installation quality standards.
          </p>
        </div>

        {/* Interactive Guide Reader (Two Columns) */}
        <div className="grid lg:grid-cols-12 gap-8 items-start mb-20">
          {/* Guide Index Navigation (4 cols) */}
          <div className="lg:col-span-4 space-y-2 sticky top-28">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-2 mb-3">
              Topics & Guides
            </span>
            {solarGuides.map((guide) => (
              <button
                key={guide.id}
                onClick={() => setActiveGuideId(guide.id)}
                className={`w-full p-4 rounded-2xl text-left border transition-all flex items-start gap-3 cursor-pointer ${
                  activeGuideId === guide.id
                    ? 'bg-emerald-50/80 border-emerald-500 text-slate-950 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    activeGuideId === guide.id
                      ? 'bg-emerald-200/80 text-emerald-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <Icon name={guide.icon || 'book-open'} size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-xs leading-snug line-clamp-2">{guide.title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                    <span>{guide.category}</span>
                    <span>•</span>
                    <span>{guide.readTimeMinutes} min read</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Active Guide Article Viewer (8 cols) */}
          <div className="lg:col-span-8 p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
            <div className="border-b border-slate-100 pb-4 space-y-2">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                {activeGuide.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-950">
                {activeGuide.title}
              </h2>
              <p className="text-xs text-slate-400">
                Published by 3RD Energy Services Ltd Engineering Desk · {activeGuide.readTimeMinutes} min read
              </p>
            </div>

            <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-line text-slate-700">
              {activeGuide.content}
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-500">Have specific questions about this topic?</span>
              <Link
                href="/power/concierge"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-md shadow-emerald-600/20"
              >
                Ask Technical Concierge →
              </Link>
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-2xl font-heading font-extrabold text-slate-950">
              Frequently Asked Solar Engineering Questions
            </h2>
          </div>

          <div className="space-y-3">
            {solarFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left font-bold text-sm text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <Icon
                      name="chevron-down"
                      size={16}
                      className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-emerald-600' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
