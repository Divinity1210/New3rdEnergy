'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@/components/ui/Icon';
import { petroleumProducts, quantityUnits } from '@/lib/data/petroleum-products';
import { getWhatsAppUrl } from '@/lib/utils';

const nigerianStates = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT Abuja', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
  'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
];

const tankerOptions = [
  { volume: 5000, label: '5,000 Litres', desc: 'Light Commercial / Bobtail Tanker' },
  { volume: 10000, label: '10,000 Litres', desc: 'Standard Generator / Small Plant' },
  { volume: 22000, label: '22,000 Litres', desc: 'Medium Industrial Tanker' },
  { volume: 33000, label: '33,000 Litres', desc: 'Full Articulated Tanker (Standard)' },
  { volume: 45000, label: '45,000 Litres', desc: 'Heavy Bulk Haulage (Tri-Axle)' },
];

const dischargeTypes = [
  { id: 'underground', title: 'Underground Tank (UST)', desc: 'Gravity or pump offloading with camlock vapor recovery fitting.', icon: 'layers' },
  { id: 'aboveground', title: 'Aboveground Tank (AST)', desc: 'Direct bunded tank connection with pump discharge hose.', icon: 'warehouse' },
  { id: 'wethosing', title: 'Direct Fleet / Generator Wet-Hosing', desc: 'On-site metered dispensing directly into equipment tanks.', icon: 'fuel' },
  { id: 'marine', title: 'Marine / Bunkering Discharge', desc: 'Quayside vessel manifold fueling with certified marine hoses.', icon: 'activity' },
];

export default function PetroleumOrderPage() {
  const [step, setStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState('diesel-supply');
  const [volume, setVolume] = useState<number | string>(33000);
  const [customVolume, setCustomVolume] = useState('');
  const [unit, setUnit] = useState('litres');
  const [dischargeType, setDischargeType] = useState('underground');
  const [deliveryFrequency, setDeliveryFrequency] = useState('single');
  const [urgency, setUrgency] = useState('standard');
  const [state, setState] = useState('Lagos');
  const [city, setCity] = useState('');
  const [siteAddress, setSiteAddress] = useState('');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderRef, setOrderRef] = useState('');

  const currentProduct = petroleumProducts.find(p => p.id === selectedProduct) || petroleumProducts[0];

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const ref = `3RD-PET-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderRef(ref);

    // Simulate dispatch transmission
    await new Promise((resolve) => setTimeout(resolve, 1400));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const computedLitres = typeof volume === 'number' ? volume : Number(customVolume) || 33000;
  const estimatedTankers = Math.max(1, Math.ceil(computedLitres / 33000));

  return (
    <div className="bg-[#080808] min-h-screen text-white pt-28 pb-24 selection:bg-red-500 selection:text-white" data-division="petroleum">
      {/* Header telemetry stripe */}
      <div className="border-b border-white/[0.06] bg-[#0c0c0c]/80 backdrop-blur-md sticky top-[72px] z-30 py-3 hidden md:block">
        <div className="container-wide flex items-center justify-between text-xs">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 font-mono text-white/50">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              TERMINAL DISPATCH ENGINE: ONLINE
            </span>
            <span className="text-white/20">|</span>
            <span className="text-white/60">AGO & PMS DEPOT ALLOCATION: <strong className="text-emerald-400">UNRESTRICTED</strong></span>
          </div>
          <div className="flex items-center gap-4 text-white/40 font-mono">
            <span>DISPATCH SLA: &lt; 4 HOURS</span>
            <span>HOTLINE: +234 1 234 5679</span>
          </div>
        </div>
      </div>

      <div className="container-wide mt-8">
        {/* Breadcrumb & Section Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs text-white/40 mb-3">
            <Link href="/solutions/petroleum" className="hover:text-red-400 transition-colors">3RD Petroleum</Link>
            <span>/</span>
            <span className="text-white/80">Commercial Bulk Fuel Ordering</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-red-500 tracking-[0.2em] uppercase font-mono block mb-2">B2B COMMERCIAL LOGISTICS</span>
              <h1 className="text-3xl lg:text-5xl font-heading font-bold text-white tracking-tight">
                Bulk Fuel Procurement & Dispatch
              </h1>
            </div>
            <p className="text-xs lg:text-sm text-white/40 max-w-md">
              Order bulk deliveries from 5,000 to 1,000,000+ litres for industrial facilities, estates, mining, and fleet operations nationwide.
            </p>
          </div>
        </div>

        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto bg-[#0f0f0f] border border-red-500/30 rounded-2xl p-8 lg:p-12 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6 text-red-400">
              <Icon name="check" size={32} />
            </div>
            <span className="font-mono text-xs text-red-400 uppercase tracking-widest block mb-2">DISPATCH REQUEST REGISTERED</span>
            <h2 className="text-2xl lg:text-3xl font-heading font-bold text-white mb-3">Order #{orderRef} Transmitted</h2>
            <p className="text-sm text-white/50 leading-relaxed mb-8 max-w-lg mx-auto">
              Our 24/7 Logistics Dispatch Team is allocating depot slot and tanker routing for your {currentProduct.name} order ({computedLitres.toLocaleString()} {unit} to {state}).
            </p>

            <div className="bg-black/40 border border-white/[0.06] rounded-xl p-5 mb-8 text-left grid grid-cols-2 gap-4 font-mono text-xs">
              <div>
                <span className="text-white/30 block mb-1">PRODUCT</span>
                <span className="text-white font-bold">{currentProduct.name}</span>
              </div>
              <div>
                <span className="text-white/30 block mb-1">VOLUME ALLOCATED</span>
                <span className="text-white font-bold">{computedLitres.toLocaleString()} {unit}</span>
              </div>
              <div>
                <span className="text-white/30 block mb-1">DESTINATION STATE</span>
                <span className="text-white font-bold">{state}</span>
              </div>
              <div>
                <span className="text-white/30 block mb-1">ESTIMATED RESPONSE</span>
                <span className="text-emerald-400 font-bold">&lt; 15 Minutes via Phone</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={getWhatsAppUrl(`Hello 3RD Petroleum Dispatch Desk. I just submitted Bulk Order #${orderRef} for ${computedLitres.toLocaleString()}L of ${currentProduct.name} to ${state}. Please confirm tanker slot.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Icon name="whatsapp" size={16} />
                Connect with Dispatch on WhatsApp
              </a>
              <Link
                href="/solutions/petroleum"
                className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/80 font-semibold text-xs transition-colors"
              >
                Return to Petroleum Portal
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
            {/* Step Wizard Container */}
            <div className="bg-[#0f0f0f] border border-white/[0.07] rounded-2xl overflow-hidden">
              {/* Stepper Progress Header */}
              <div className="border-b border-white/[0.06] bg-[#141414] px-6 py-4">
                <div className="flex items-center justify-between max-w-xl">
                  {[
                    { n: 1, title: 'Product' },
                    { n: 2, title: 'Volume & Spec' },
                    { n: 3, title: 'Discharge & Site' },
                    { n: 4, title: 'Contact & Delivery' },
                  ].map((s) => (
                    <div key={s.n} className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all ${
                          step === s.n
                            ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                            : step > s.n
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                            : 'bg-white/[0.04] text-white/30 border border-white/[0.06]'
                        }`}
                      >
                        {step > s.n ? <Icon name="check" size={13} /> : s.n}
                      </div>
                      <span
                        className={`text-xs font-semibold hidden sm:inline ${
                          step === s.n ? 'text-white' : 'text-white/30'
                        }`}
                      >
                        {s.title}
                      </span>
                      {s.n < 4 && <div className="w-6 lg:w-10 h-px bg-white/[0.08] mx-1 hidden sm:block" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Content Body */}
              <form onSubmit={handleSubmit} className="p-6 lg:p-8">
                {/* STEP 1: Product Selection */}
                {step === 1 && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                    <div>
                      <h3 className="text-lg font-heading font-bold text-white mb-1">Select Petroleum Product</h3>
                      <p className="text-xs text-white/40">Choose the fuel grade or lubricant required for your facility.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {petroleumProducts.map((p) => {
                        const isSelected = selectedProduct === p.id;
                        return (
                          <div
                            key={p.id}
                            onClick={() => setSelectedProduct(p.id)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between group ${
                              isSelected
                                ? 'bg-red-950/20 border-red-500/60 ring-1 ring-red-500/30'
                                : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? 'bg-red-500/20 text-red-400' : 'bg-white/[0.04] text-white/40 group-hover:text-white'}`}>
                                <Icon name={p.icon} size={18} />
                              </div>
                              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/[0.04] text-white/40 border border-white/[0.04]">
                                {p.category}
                              </span>
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-white mb-1">{p.name}</h4>
                              <p className="text-xs text-white/40 leading-relaxed line-clamp-2">{p.shortDescription}</p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-white/30 font-mono">
                              <span>MIN: {p.minimumOrder || 'N/A'}</span>
                              <span className={isSelected ? 'text-red-400 font-bold' : 'group-hover:text-white/60'}>
                                {isSelected ? 'Selected ✓' : 'Select'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Volume & Tanker Size */}
                {step === 2 && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                    <div>
                      <h3 className="text-lg font-heading font-bold text-white mb-1">Quantity & Tanker Capacity</h3>
                      <p className="text-xs text-white/40">Select standardized tanker load sizes or enter custom volume.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {tankerOptions.map((t) => (
                        <div
                          key={t.volume}
                          onClick={() => { setVolume(t.volume); setCustomVolume(''); }}
                          className={`p-4 rounded-xl border cursor-pointer transition-all ${
                            volume === t.volume
                              ? 'bg-red-950/20 border-red-500/60 ring-1 ring-red-500/30'
                              : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
                          }`}
                        >
                          <div className="text-base font-bold font-mono text-white mb-1">{t.label}</div>
                          <div className="text-[11px] text-white/40">{t.desc}</div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-black/30 p-5 rounded-xl border border-white/[0.06] space-y-3">
                      <label className="block text-xs font-semibold text-white/70">Custom Volume / Recurring Requirement</label>
                      <div className="flex gap-3">
                        <input
                          type="number"
                          placeholder="e.g. 66000 or 150000"
                          value={customVolume}
                          onChange={(e) => { setCustomVolume(e.target.value); setVolume('custom'); }}
                          className="flex-1 px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white focus:outline-none focus:border-red-500/50 font-mono"
                        />
                        <select
                          value={unit}
                          onChange={(e) => setUnit(e.target.value)}
                          className="px-4 py-3 bg-[#181818] border border-white/[0.08] rounded-lg text-sm text-white focus:outline-none focus:border-red-500/50 cursor-pointer"
                        >
                          {quantityUnits.map((u) => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-xs font-semibold text-white/70">Delivery Cadence</label>
                      <div className="grid sm:grid-cols-3 gap-3">
                        {[
                          { id: 'single', label: 'One-Time Bulk Drop', sub: 'Spot delivery' },
                          { id: 'weekly', label: 'Weekly Contract', sub: 'Scheduled route' },
                          { id: 'monthly', label: 'Monthly Contract', sub: 'Indexed pricing' },
                        ].map((f) => (
                          <div
                            key={f.id}
                            onClick={() => setDeliveryFrequency(f.id)}
                            className={`p-3.5 rounded-lg border cursor-pointer text-center ${
                              deliveryFrequency === f.id
                                ? 'bg-red-950/20 border-red-500/50 text-white'
                                : 'bg-white/[0.02] border-white/[0.06] text-white/50 hover:text-white'
                            }`}
                          >
                            <div className="text-xs font-bold">{f.label}</div>
                            <div className="text-[10px] text-white/30 mt-0.5">{f.sub}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Site Discharge & Access */}
                {step === 3 && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                    <div>
                      <h3 className="text-lg font-heading font-bold text-white mb-1">Discharge & On-Site Ingestion</h3>
                      <p className="text-xs text-white/40">Select how our tanker team will offload fuel at your facility.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {dischargeTypes.map((d) => {
                        const isSelected = dischargeType === d.id;
                        return (
                          <div
                            key={d.id}
                            onClick={() => setDischargeType(d.id)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                              isSelected
                                ? 'bg-red-950/20 border-red-500/60 ring-1 ring-red-500/30'
                                : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
                            }`}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isSelected ? 'bg-red-500/20 text-red-400' : 'bg-white/[0.04] text-white/40'}`}>
                                <Icon name={d.icon} size={18} />
                              </div>
                              <h4 className="text-sm font-bold text-white">{d.title}</h4>
                            </div>
                            <p className="text-xs text-white/40 leading-relaxed mt-2">{d.desc}</p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="bg-black/30 p-5 rounded-xl border border-white/[0.06] space-y-3">
                      <label className="block text-xs font-semibold text-white/70">Dispatch Urgency / Response Time</label>
                      <div className="grid sm:grid-cols-3 gap-3">
                        {[
                          { id: 'standard', label: 'Standard Delivery', time: '24 – 48 Hours', badge: 'Normal Route' },
                          { id: 'urgent', label: 'Next-Day Express', time: '12 – 24 Hours', badge: 'Priority Slot' },
                          { id: 'emergency', label: 'Critical Emergency', time: '&lt; 4 Hours', badge: 'Fast-Track SLA' },
                        ].map((u) => (
                          <div
                            key={u.id}
                            onClick={() => setUrgency(u.id)}
                            className={`p-3.5 rounded-lg border cursor-pointer ${
                              urgency === u.id
                                ? 'bg-red-950/20 border-red-500/60 text-white'
                                : 'bg-white/[0.02] border-white/[0.06] text-white/50 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold">{u.label}</span>
                              {u.id === 'emergency' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />}
                            </div>
                            <div className="text-[11px] font-mono text-red-400">{u.time}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: Contact & Destination */}
                {step === 4 && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-5">
                    <div>
                      <h3 className="text-lg font-heading font-bold text-white mb-1">Delivery Destination & Contact Desk</h3>
                      <p className="text-xs text-white/40">Provide destination coordinates and authorized receiving officer info.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-white/60 mb-1.5">Destination State *</label>
                        <select
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          required
                          className="w-full px-4 py-3 bg-[#181818] border border-white/[0.08] rounded-lg text-sm text-white focus:outline-none focus:border-red-500/50"
                        >
                          {nigerianStates.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-white/60 mb-1.5">City / LGA *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ikeja, Lekki, Port Harcourt, Ikeja Industrial"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white focus:outline-none focus:border-red-500/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1.5">Site / Plant Facility Address *</label>
                      <input
                        type="text"
                        required
                        placeholder="Plot number, industrial layout or landmark..."
                        value={siteAddress}
                        onChange={(e) => setSiteAddress(e.target.value)}
                        className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white focus:outline-none focus:border-red-500/50"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-medium text-white/60 mb-1.5">Authorised Contact Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="Full name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white focus:outline-none focus:border-red-500/50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-white/60 mb-1.5">Company / Entity Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="Business name"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white focus:outline-none focus:border-red-500/50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-white/60 mb-1.5">Corporate Email *</label>
                        <input
                          type="email"
                          required
                          placeholder="procurement@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white focus:outline-none focus:border-red-500/50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-white/60 mb-1.5">Direct Dispatch Phone / WhatsApp *</label>
                        <input
                          type="tel"
                          required
                          placeholder="+234..."
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white focus:outline-none focus:border-red-500/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1.5">Special Offloading Instructions (Optional)</label>
                      <textarea
                        rows={2}
                        placeholder="Security access gate details, tanker hose length requirements, specific delivery time window..."
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white focus:outline-none focus:border-red-500/50 resize-none"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Form Navigation Actions */}
                <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center justify-between">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-5 py-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-white/70 transition-colors"
                    >
                      ← Back
                    </button>
                  ) : (
                    <div />
                  )}

                  {step < 4 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-7 py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-red-600/25"
                    >
                      Continue <Icon name="arrow-right" size={14} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3.5 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-xl shadow-red-600/30"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Transmitting to Dispatch...
                        </>
                      ) : (
                        <>
                          <Icon name="zap" size={14} />
                          Confirm & Transmit Dispatch Request
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Sidebar Summary Widget */}
            <div className="space-y-4">
              <div className="bg-[#0f0f0f] border border-white/[0.07] rounded-2xl p-6">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-4 mb-4">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white/60">PROCUREMENT SUMMARY</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-white/40 block mb-1">Selected Product</span>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-red-500/20 flex items-center justify-center text-red-400">
                        <Icon name={currentProduct.icon} size={13} />
                      </div>
                      <span className="text-sm font-bold text-white">{currentProduct.name}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/[0.04]">
                    <span className="text-white/40 block mb-1">Requested Volume</span>
                    <span className="text-base font-bold font-mono text-white">
                      {computedLitres.toLocaleString()} <span className="text-xs font-normal text-white/40">{unit}</span>
                    </span>
                    <p className="text-[11px] text-white/30 mt-0.5 font-mono">
                      ≈ {estimatedTankers} {estimatedTankers === 1 ? 'Tanker Load' : 'Tanker Loads'} (33kL standard)
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/[0.04]">
                    <span className="text-white/40 block mb-1">Delivery SLA</span>
                    <span className="text-xs font-mono text-red-400 font-semibold uppercase">
                      {urgency === 'emergency' ? 'Emergency 4-Hour Response' : urgency === 'urgent' ? '24-Hour Express' : 'Standard 48-Hour'}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-white/[0.04]">
                    <span className="text-white/40 block mb-1">Destination</span>
                    <span className="text-xs text-white font-medium">{state}, Nigeria</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.06] space-y-2 text-[11px] text-white/30">
                  <p className="flex items-center gap-1.5">
                    <Icon name="check" size={12} className="text-emerald-400" />
                    <span>ASTM D975 Quality Certification</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Icon name="check" size={12} className="text-emerald-400" />
                    <span>Electronic Meter Calibration on Site</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Icon name="check" size={12} className="text-emerald-400" />
                    <span>NMDPRA & DPR Licensed Supply</span>
                  </p>
                </div>
              </div>

              {/* Direct Dispatch Phone Card */}
              <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-5 text-center">
                <p className="text-xs text-white/40 mb-1">Urgent or Custom Tanker Fleet Request?</p>
                <p className="text-xs font-mono text-red-400 mb-3">Direct Dispatch Desk 24/7</p>
                <a
                  href="tel:+23412345679"
                  className="inline-flex items-center gap-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg transition-colors"
                >
                  <Icon name="phone" size={13} />
                  +234 1 234 5679
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
