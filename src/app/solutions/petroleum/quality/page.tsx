'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@/components/ui/Icon';
import { getWhatsAppUrl } from '@/lib/utils';

const coaBenchmarks = [
  {
    product: 'Automotive Gas Oil (AGO Diesel)',
    standard: 'ASTM D975 / NMDPRA Premium Grade',
    parameters: [
      { name: 'Density @ 15°C', testMethod: 'ASTM D1298', limit: '0.820 – 0.855 g/cm³', typical: '0.835 g/cm³', status: 'PASS' },
      { name: 'Flash Point (PMCC)', testMethod: 'ASTM D93', limit: '≥ 55.0 °C', typical: '64.0 °C', status: 'PASS' },
      { name: 'Total Sulphur Content', testMethod: 'ASTM D4294', limit: '≤ 50.0 PPM', typical: '28.5 PPM (Ultra-Low)', status: 'PASS' },
      { name: 'Water & Sediment', testMethod: 'ASTM D2709', limit: '≤ 0.05 % vol', typical: '0.00 % (Undetectable)', status: 'PASS' },
      { name: 'Cetane Index', testMethod: 'ASTM D4737', limit: '≥ 48.0', typical: '52.4', status: 'PASS' },
      { name: 'Kinematic Viscosity @ 40°C', testMethod: 'ASTM D445', limit: '1.9 – 4.1 cSt', typical: '2.8 cSt', status: 'PASS' },
      { name: 'Copper Strip Corrosion (3h/50°C)', testMethod: 'ASTM D130', limit: 'Class 1a max', typical: 'Class 1a', status: 'PASS' },
    ],
  },
  {
    product: 'Premium Motor Spirit (PMS Petrol)',
    standard: 'ASTM D4814 / NIS 116 Compliant',
    parameters: [
      { name: 'Research Octane Number (RON)', testMethod: 'ASTM D2699', limit: '≥ 91.0', typical: '93.5 RON', status: 'PASS' },
      { name: 'Reid Vapor Pressure @ 37.8°C', testMethod: 'ASTM D323', limit: '45 – 65 kPa', typical: '54.2 kPa', status: 'PASS' },
      { name: 'Density @ 15°C', testMethod: 'ASTM D1298', limit: '0.715 – 0.775 g/cm³', typical: '0.738 g/cm³', status: 'PASS' },
      { name: 'Lead Content', testMethod: 'ASTM D3237', limit: '≤ 0.013 g/L (Unleaded)', typical: '&lt; 0.001 g/L', status: 'PASS' },
      { name: 'Total Sulphur Content', testMethod: 'ASTM D4294', limit: '≤ 150 PPM', typical: '42.0 PPM', status: 'PASS' },
      { name: 'Distillation: Final Boiling Point', testMethod: 'ASTM D86', limit: '≤ 210 °C', typical: '196.0 °C', status: 'PASS' },
    ],
  },
  {
    product: 'Liquefied Petroleum Gas (LPG)',
    standard: 'NFPA 58 / ASTM D1835 Industrial',
    parameters: [
      { name: 'Propane / Butane Ratio', testMethod: 'ASTM D2163', limit: '30/70 to 50/50 % mol', typical: '40 / 60 Balanced', status: 'PASS' },
      { name: 'Vapor Pressure @ 37.8°C', testMethod: 'ASTM D1267', limit: '≤ 1430 kPa', typical: '980 kPa', status: 'PASS' },
      { name: 'Specific Gravity @ 15.6°C', testMethod: 'ASTM D1657', limit: '0.520 – 0.585', typical: '0.554', status: 'PASS' },
      { name: 'Total Volatile Sulphur', testMethod: 'ASTM D2784', limit: '≤ 140 mg/kg', typical: '18 mg/kg', status: 'PASS' },
      { name: 'Moisture / Free Water', testMethod: 'Visual / Freeze', limit: 'Zero / Pass', typical: 'Nil', status: 'PASS' },
    ],
  },
];

const qualityPillars = [
  {
    step: '01',
    title: 'Depot Spectrometry Lab Testing',
    desc: 'Every batch loaded into our tanker units undergoes laboratory hydrometer density, flashpoint, and sulfur spectrometry verification at the depot rack.',
    icon: 'flask',
  },
  {
    step: '02',
    title: 'Tamper-Evident Security Seals',
    desc: 'Tanker manholes, discharge manifolds, and bottom valves are secured with serialized digital RFID barcode tags and heavy-gauge wire seals.',
    icon: 'shield-check',
  },
  {
    step: '03',
    title: 'Pre-Discharge Site Verification',
    desc: 'Before connecting hoses, our discharge technician conducts on-site water-finding paste tests and hydrometer gravity tests in the presence of your receiving officer.',
    icon: 'gauge',
  },
];

export default function PetroleumQualityPage() {
  const [selectedCoaIndex, setSelectedCoaIndex] = useState(0);
  const activeCoa = coaBenchmarks[selectedCoaIndex];

  return (
    <div className="bg-[#080808] min-h-screen text-white pt-28 pb-24 selection:bg-red-500 selection:text-white" data-division="petroleum">
      <div className="container-wide">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-white/40 mb-3">
          <Link href="/solutions/petroleum" className="hover:text-red-400 transition-colors">3RD Petroleum</Link>
          <span>/</span>
          <span className="text-white/80">Fuel Quality & Lab Certification</span>
        </div>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 border-b border-white/[0.06] pb-8">
          <div>
            <span className="text-xs font-bold text-red-500 tracking-[0.2em] uppercase font-mono block mb-2">CERTIFIED QUALITY ASSURANCE</span>
            <h1 className="text-3xl lg:text-5xl font-heading font-bold text-white tracking-tight">
              Fuel Quality Guarantee & Lab Testing
            </h1>
          </div>
          <p className="text-xs lg:text-sm text-white/40 max-w-md">
            Zero-water contamination guarantee. Every bulk delivery is certified with a physical Certificate of Analysis (CoA) conforming to international ASTM standards.
          </p>
        </div>

        {/* 3-Point Custody Chain */}
        <div className="mb-16">
          <div className="mb-8 text-center max-w-xl mx-auto">
            <span className="text-xs font-mono text-red-400 uppercase tracking-widest block mb-1">CUSTODY INTEGRITY</span>
            <h2 className="text-2xl font-heading font-bold text-white">The 3-Point Quality Custody Chain</h2>
            <p className="text-xs text-white/40 mt-1">How we ensure 100% pure, unadulterated petroleum from terminal loading to your storage tank.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {qualityPillars.map((p) => (
              <div key={p.step} className="bg-[#0f0f0f] border border-white/[0.07] p-6 lg:p-8 rounded-2xl relative group hover:border-red-500/30 transition-all">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl font-mono font-black text-red-500/40 group-hover:text-red-400 transition-colors">{p.step}</span>
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
                    <Icon name={p.icon} size={20} />
                  </div>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{p.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Certificate of Analysis (CoA) Viewer */}
        <div className="bg-[#0f0f0f] border border-white/[0.07] rounded-2xl p-6 lg:p-10 mb-16">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-mono text-red-400 uppercase tracking-widest block mb-1">LIVE BENCHMARKS</span>
              <h2 className="text-2xl font-heading font-bold text-white">Certificate of Analysis (CoA) Benchmarks</h2>
              <p className="text-xs text-white/40 mt-1">Typical lab-certified test specifications for our prime-grade fuels.</p>
            </div>

            {/* Product Tabs */}
            <div className="flex flex-wrap gap-2">
              {coaBenchmarks.map((c, i) => (
                <button
                  key={c.product}
                  onClick={() => setSelectedCoaIndex(i)}
                  className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    selectedCoaIndex === i
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                      : 'bg-white/[0.04] text-white/50 hover:text-white border border-white/[0.06]'
                  }`}
                >
                  {c.product.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* CoA Table */}
          <div className="border border-white/[0.08] rounded-xl overflow-hidden bg-black/40">
            <div className="px-6 py-4 bg-[#141414] border-b border-white/[0.06] flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-white block">{activeCoa.product}</span>
                <span className="text-xs font-mono text-white/40">Standard: {activeCoa.standard}</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-500/30">
                100% SPEC COMPLIANT
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-white/[0.02] border-b border-white/[0.04] text-white/40 uppercase">
                  <tr>
                    <th className="py-3.5 px-6 font-semibold">Test Parameter</th>
                    <th className="py-3.5 px-6 font-semibold">Test Method</th>
                    <th className="py-3.5 px-6 font-semibold">Specification Limit</th>
                    <th className="py-3.5 px-6 font-semibold">Typical 3RD Petroleum Batch</th>
                    <th className="py-3.5 px-6 font-semibold text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {activeCoa.parameters.map((param) => (
                    <tr key={param.name} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-6 font-sans font-bold text-white/90">{param.name}</td>
                      <td className="py-3.5 px-6 text-white/40">{param.testMethod}</td>
                      <td className="py-3.5 px-6 text-white/60">{param.limit}</td>
                      <td className="py-3.5 px-6 font-bold text-white">{param.typical}</td>
                      <td className="py-3.5 px-6 text-right">
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                          <Icon name="check" size={10} />
                          {param.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Bottom Fast Action */}
        <div className="bg-gradient-to-r from-red-950/30 to-black border border-red-500/25 rounded-2xl p-8 text-center max-w-2xl mx-auto space-y-4">
          <h3 className="text-xl font-heading font-bold text-white">Need a Batch-Specific CoA for Your Audit?</h3>
          <p className="text-xs text-white/40">
            We provide full traceable documentation, bill of lading, and physical hydrometer samples with every bulk delivery.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/solutions/petroleum/order"
              className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors"
            >
              Order Lab-Certified Fuel
            </Link>
            <a
              href={getWhatsAppUrl('Hello 3RD Petroleum. I would like to request technical specification sheets and sample Certificate of Analysis.')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/80 font-bold text-xs transition-colors flex items-center gap-2"
            >
              <Icon name="whatsapp" size={14} />
              WhatsApp Quality Desk
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
