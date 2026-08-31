'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { getWhatsAppUrl } from '@/lib/utils';

const contactDesks = [
  {
    title: '24/7 Logistics & Emergency Dispatch',
    desc: 'Immediate tanker dispatch for mission-critical generators, manufacturing plants, and hospitals.',
    phone: '+234 1 234 5679',
    email: 'dispatch@3rdenergy.com',
    sla: '&lt; 4 Hours Emergency SLA',
    icon: 'activity',
    highlight: true,
  },
  {
    title: 'Commercial Bulk Wholesale Desk',
    desc: 'Contract pricing, indexed procurement agreements, and high-volume tanker fleet allocations.',
    phone: '+234 1 234 5680',
    email: 'petroleum@3rdenergy.com',
    sla: 'Volume-Linked Discounts',
    icon: 'fuel',
    highlight: false,
  },
  {
    title: 'Storage Infrastructure & Engineering',
    desc: 'Site geotechnical surveys, AST/UST storage tank installation, and civil bunding construction.',
    phone: '+234 1 234 5681',
    email: 'engineering@3rdenergy.com',
    sla: 'Turnkey API 650 Execution',
    icon: 'warehouse',
    highlight: false,
  },
  {
    title: 'Quality Assurance & Lab Verification',
    desc: 'Certificate of Analysis (CoA) traceability, batch density checks, and ASTM compliance documentation.',
    phone: '+234 1 234 5682',
    email: 'quality@3rdenergy.com',
    sla: 'ASTM D975 Certified',
    icon: 'flask',
    highlight: false,
  },
];

export default function PetroleumContactPage() {
  const [inquiryType, setInquiryType] = useState('bulk-order');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0] || name;
      const lastName = nameParts.slice(1).join(' ') || '';

      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email: email.trim(),
          phone: phone.trim(),
          organisation: company.trim() || `${name}'s Company`,
          subject: `[3RD Petroleum Desk] ${inquiryType}`,
          message: `Inquiry Type: ${inquiryType}\n\n${message}`,
          preferredContact: 'phone',
        }),
      });
    } catch (err) {
      console.error('Contact submission error:', err);
    } finally {
      setIsSubmitting(false);
      setIsSuccess(true);
    }
  };

  return (
    <div className="bg-[#080808] min-h-screen text-white pt-28 pb-24 selection:bg-red-500 selection:text-white" data-division="petroleum">
      <div className="container-wide">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-white/40 mb-3">
          <Link href="/solutions/petroleum" className="hover:text-red-400 transition-colors">3RD Petroleum</Link>
          <span>/</span>
          <span className="text-white/80">Dispatch & Commercial Desk</span>
        </div>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 border-b border-white/[0.06] pb-8">
          <div>
            <span className="text-xs font-bold text-red-500 tracking-[0.2em] uppercase font-mono block mb-2">24/7 COMMERCIAL COMMUNICATIONS</span>
            <h1 className="text-3xl lg:text-5xl font-heading font-bold text-white tracking-tight">
              Logistics Dispatch & Commercial Desk
            </h1>
          </div>
          <p className="text-xs lg:text-sm text-white/40 max-w-md">
            Direct access to dedicated commercial traders, automated depot dispatchers, and storage infrastructure engineers.
          </p>
        </div>

        {/* Contact Desks Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {contactDesks.map((desk) => (
            <div
              key={desk.title}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                desk.highlight
                  ? 'bg-red-950/20 border-red-500/40 ring-1 ring-red-500/20'
                  : 'bg-[#0f0f0f] border-white/[0.07] hover:border-white/[0.15]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
                    <Icon name={desk.icon} size={20} />
                  </div>
                  <span className="text-[10px] font-mono text-white/40">{desk.sla}</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5">{desk.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed mb-6">{desk.desc}</p>
              </div>

              <div className="pt-4 border-t border-white/[0.06] space-y-2 text-xs font-mono">
                <a href={`tel:${desk.phone}`} className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors font-bold">
                  <Icon name="phone" size={13} />
                  {desk.phone}
                </a>
                <a href={`mailto:${desk.email}`} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors">
                  <Icon name="mail" size={13} />
                  {desk.email}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Form and Terminal Hours Grid */}
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start mb-16">
          {/* Inquiry Form */}
          <div className="bg-[#0f0f0f] border border-white/[0.07] rounded-2xl p-6 lg:p-8">
            <h2 className="text-xl font-heading font-bold text-white mb-1">Transmit Commercial Request</h2>
            <p className="text-xs text-white/40 mb-6">Our dispatch desk routes all communications directly to active operations officers.</p>

            {isSuccess ? (
              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Icon name="check" size={24} />
                </div>
                <h3 className="text-lg font-bold text-white">Inquiry Transmitted Successfully</h3>
                <p className="text-xs text-white/50 max-w-sm mx-auto">
                  A commercial officer has received your priority message and will follow up shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSuccess(false)}
                  className="text-xs text-red-400 hover:underline pt-2 cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5">Inquiry Type</label>
                  <select
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                    className="w-full px-4 py-3 bg-[#181818] border border-white/[0.08] rounded-lg text-sm text-white focus:outline-none focus:border-red-500/50"
                  >
                    <option value="bulk-order">Bulk Fuel Procurement (AGO / PMS / LPG)</option>
                    <option value="emergency-dispatch">Emergency 4-Hour Fuel Dispatch</option>
                    <option value="storage-tanks">Fuel Storage Tank Installation / Engineering</option>
                    <option value="quality-coa">Quality Certificate & Lab Test Request</option>
                    <option value="depot-collection">Wholesale Depot Rack Collection Slot</option>
                  </select>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white focus:outline-none focus:border-red-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5">Company / Facility Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Company Ltd"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white focus:outline-none focus:border-red-500/50"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5">Direct Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+234..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white focus:outline-none focus:border-red-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5">Corporate Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white focus:outline-none focus:border-red-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5">Inquiry Details *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Volume required, plant location, delivery schedule preferences..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white focus:outline-none focus:border-red-500/50 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Transmitting Request...' : 'Send Message to Petroleum Desk'}
                </button>
              </form>
            )}
          </div>

          {/* Terminal Loading Schedule & Operating Hours */}
          <div className="space-y-6">
            <div className="bg-[#0f0f0f] border border-white/[0.07] rounded-2xl p-6 lg:p-8 space-y-5">
              <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest block">FACILITY SCHEDULE</span>
              <h3 className="text-lg font-heading font-bold text-white">Depot Terminal Loading Hours</h3>

              <div className="space-y-3 text-xs font-mono">
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <div>
                    <span className="text-white font-bold block">Lagos (Apapa / Ibafon Mega Hub)</span>
                    <span className="text-white/40 text-[10px]">Depot Rack Loading</span>
                  </div>
                  <span className="text-emerald-400 font-bold">24/7 Continuous</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <div>
                    <span className="text-white font-bold block">Port Harcourt Eastern Hub</span>
                    <span className="text-white/40 text-[10px]">Onne Free Zone Gates</span>
                  </div>
                  <span className="text-emerald-400 font-bold">24/7 Continuous</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <div>
                    <span className="text-white font-bold block">Warri & Calabar Coastal Gates</span>
                    <span className="text-white/40 text-[10px]">Marine & Haulage Gantry</span>
                  </div>
                  <span className="text-white/80">06:00 – 22:00 Daily</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <div>
                    <span className="text-white font-bold block">Abuja FCT Fast-Dispatch Hub</span>
                    <span className="text-white/40 text-[10px]">CBD & Industrial Rapid Response</span>
                  </div>
                  <span className="text-emerald-400 font-bold">24/7 Continuous</span>
                </div>
              </div>
            </div>

            {/* Fast WhatsApp Connect Box */}
            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <Icon name="whatsapp" size={20} />
              </div>
              <h4 className="text-sm font-bold text-white">Direct WhatsApp Dispatch</h4>
              <p className="text-xs text-white/40 max-w-xs mx-auto">
                Chat directly with our active shift dispatch manager for instant quote confirmations and delivery ETA updates.
              </p>
              <a
                href={getWhatsAppUrl('Hello 3RD Petroleum Dispatch Desk, I am reaching out regarding a commercial fuel inquiry.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
              >
                <Icon name="whatsapp" size={15} />
                Open WhatsApp Dispatch Fast-Lane
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
