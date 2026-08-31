'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@/components/ui/Icon';
import { getWhatsAppUrl } from '@/lib/utils';

const tankCapacities = [
  {
    capacity: '10,000 Litres',
    litres: 10000,
    type: 'Self-Bunded Cylindrical Skid',
    diameter: '1.8 m',
    length: '4.2 m',
    weight: '3,800 kg',
    bunding: '11,000 L (110% containment)',
    flowRate: '120 L/min dispensing',
    application: 'Commercial generator backup, small industrial plant, construction yard',
  },
  {
    capacity: '25,000 Litres',
    litres: 25000,
    type: 'Double-Walled Horizontal AST',
    diameter: '2.4 m',
    length: '6.0 m',
    weight: '6,200 kg',
    bunding: '27,500 L (110% containment)',
    flowRate: '250 L/min dual nozzle',
    application: 'Medium manufacturing plant, corporate fleet yard, estate central power',
  },
  {
    capacity: '50,000 Litres',
    litres: 50000,
    type: 'Heavy Industrial Double-Wall AST',
    diameter: '2.8 m',
    length: '8.8 m',
    weight: '11,500 kg',
    bunding: '55,000 L (110% containment)',
    flowRate: '450 L/min high-speed bulk',
    application: 'Mining camp, heavy cement/steel plant, regional transport hub',
  },
  {
    capacity: '100,000 Litres',
    litres: 100000,
    type: 'Custom Engineered Vertical/Horizontal AST',
    diameter: '3.4 m',
    length: '11.5 m',
    weight: '19,800 kg',
    bunding: '110,000 L reinforced concrete',
    flowRate: '800 L/min multi-manifold',
    application: 'Bulk terminal storage, port marine terminal, continuous independent power producer (IPP)',
  },
];

const storageFeatures = [
  {
    title: 'UL 142 & API 650 Structural Design',
    desc: 'Precision steel fabrication with submerged arc welding, ultrasonic seam testing, and heavy-duty epoxy anti-corrosion coating.',
    icon: 'warehouse',
  },
  {
    title: 'Automatic Tank Gauging (ATG)',
    desc: 'Magnetostrictive probe telemetry reporting real-time fuel volume, temperature, and water bottom levels directly to your phone/ERP.',
    icon: 'activity',
  },
  {
    title: '110% Civil Secondary Containment',
    desc: 'Engineered concrete bund walls with oil-water separator interceptors ensuring full NMDPRA and environmental compliance.',
    icon: 'layers',
  },
  {
    title: 'Integrated Overfill & Flame Arrestors',
    desc: 'Fail-safe mechanical overfill shutoff valves and certified pressure/vacuum vents preventing vapor accumulation.',
    icon: 'shield-check',
  },
];

export default function PetroleumStoragePage() {
  const [selectedTank, setSelectedTank] = useState(tankCapacities[1]);

  return (
    <div className="bg-[#080808] min-h-screen text-white pt-28 pb-24 selection:bg-red-500 selection:text-white" data-division="petroleum">
      <div className="container-wide">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-white/40 mb-3">
          <Link href="/solutions/petroleum" className="hover:text-red-400 transition-colors">3RD Petroleum</Link>
          <span>/</span>
          <span className="text-white/80">Fuel Storage & Infrastructure Engineering</span>
        </div>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 border-b border-white/[0.06] pb-8">
          <div>
            <span className="text-xs font-bold text-red-500 tracking-[0.2em] uppercase font-mono block mb-2">TURNKEY TANK ENGINEERING</span>
            <h1 className="text-3xl lg:text-5xl font-heading font-bold text-white tracking-tight">
              Fuel Storage Tanks & Depot Engineering
            </h1>
          </div>
          <p className="text-xs lg:text-sm text-white/40 max-w-md">
            Design, fabrication, civil bunding, and automated telemetry for above-ground and underground petroleum storage systems across Nigeria.
          </p>
        </div>

        {/* Hero Showcase Image */}
        <div className="relative h-[380px] lg:h-[460px] rounded-2xl overflow-hidden border border-white/[0.08] mb-16">
          <Image
            src="/images/petroleum/storage.jpg"
            alt="3RD Petroleum Aboveground Bunded Tank Facility"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 max-w-2xl">
            <span className="text-[10px] font-mono uppercase bg-red-600 text-white px-2.5 py-1 rounded font-bold tracking-wider inline-block mb-2">
              API 650 & UL 142 STANDARDS
            </span>
            <h3 className="text-xl lg:text-2xl font-heading font-bold text-white mb-2">
              Complete Turnkey Fuel Buffer Infrastructure
            </h3>
            <p className="text-xs lg:text-sm text-white/70">
              From site survey and regulatory permitting with NMDPRA to hydrostatic pressure testing, civil bund construction, and ATG telemetry deployment.
            </p>
          </div>
        </div>

        {/* Interactive Tank Specifier Matrix */}
        <div className="bg-[#0f0f0f] border border-white/[0.07] rounded-2xl p-6 lg:p-10 mb-16">
          <div className="mb-8">
            <span className="text-xs font-mono text-red-400 uppercase tracking-widest block mb-1">INTERACTIVE SPECIFIER</span>
            <h2 className="text-2xl font-heading font-bold text-white">Standard Tank Specifications & Civil Sizing</h2>
            <p className="text-xs text-white/40 mt-1">Select a storage capacity to preview physical engineering dimensions and containment requirements.</p>
          </div>

          {/* Capacity Selector Tabs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {tankCapacities.map((tank) => (
              <button
                key={tank.capacity}
                onClick={() => setSelectedTank(tank)}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  selectedTank.capacity === tank.capacity
                    ? 'bg-red-950/30 border-red-500/60 ring-1 ring-red-500/30'
                    : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
                }`}
              >
                <div className="text-base font-mono font-bold text-white">{tank.capacity}</div>
                <div className="text-[11px] text-white/40 mt-0.5">{tank.type.split(' ')[0]} Tank</div>
              </button>
            ))}
          </div>

          {/* Spec Table Preview */}
          <div className="grid lg:grid-cols-2 gap-8 items-center bg-black/40 border border-white/[0.06] rounded-xl p-6 lg:p-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white mb-4">{selectedTank.capacity} — {selectedTank.type}</h3>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-white/[0.02] p-3 rounded-lg border border-white/[0.04]">
                  <span className="text-white/30 block mb-0.5">DIAMETER</span>
                  <span className="text-white font-bold">{selectedTank.diameter}</span>
                </div>
                <div className="bg-white/[0.02] p-3 rounded-lg border border-white/[0.04]">
                  <span className="text-white/30 block mb-0.5">OVERALL LENGTH</span>
                  <span className="text-white font-bold">{selectedTank.length}</span>
                </div>
                <div className="bg-white/[0.02] p-3 rounded-lg border border-white/[0.04]">
                  <span className="text-white/30 block mb-0.5">TARE WEIGHT</span>
                  <span className="text-white font-bold">{selectedTank.weight}</span>
                </div>
                <div className="bg-white/[0.02] p-3 rounded-lg border border-white/[0.04]">
                  <span className="text-white/30 block mb-0.5">DISPENSE SPEED</span>
                  <span className="text-emerald-400 font-bold">{selectedTank.flowRate}</span>
                </div>
              </div>

              <div className="pt-2 text-xs">
                <span className="text-white/40 block mb-1 font-mono">CIVIL SECONDARY CONTAINMENT</span>
                <p className="text-white font-semibold">{selectedTank.bunding}</p>
              </div>

              <div className="pt-2 text-xs">
                <span className="text-white/40 block mb-1 font-mono">OPTIMAL APPLICATION</span>
                <p className="text-white/70">{selectedTank.application}</p>
              </div>
            </div>

            <div className="bg-[#141414] border border-white/[0.08] rounded-xl p-6 flex flex-col justify-between h-full space-y-6">
              <div>
                <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest block mb-2">TURNKEY SCOPE INCLUDED</span>
                <ul className="space-y-2 text-xs text-white/70">
                  <li className="flex items-center gap-2">
                    <Icon name="check" size={13} className="text-emerald-400" />
                    <span>Site geotechnical survey & civil foundation engineering</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="check" size={13} className="text-emerald-400" />
                    <span>Hydrostatic pressure test with certificate</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="check" size={13} className="text-emerald-400" />
                    <span>Digital IoT level transmitter & high-level alarm</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="check" size={13} className="text-emerald-400" />
                    <span>NMDPRA storage licensing documentation</span>
                  </li>
                </ul>
              </div>

              <a
                href={getWhatsAppUrl(`Hello 3RD Petroleum Engineering Desk. I am requesting a quote and site survey for a ${selectedTank.capacity} fuel storage installation.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors text-center flex items-center justify-center gap-2"
              >
                <Icon name="whatsapp" size={15} />
                Request Site Survey & Tank Quotation
              </a>
            </div>
          </div>
        </div>

        {/* Technical Features */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {storageFeatures.map((feat) => (
            <div key={feat.title} className="bg-[#0f0f0f] border border-white/[0.06] p-6 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center mb-4">
                <Icon name={feat.icon} size={20} />
              </div>
              <h4 className="text-sm font-bold text-white mb-2">{feat.title}</h4>
              <p className="text-xs text-white/40 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center max-w-xl mx-auto space-y-4">
          <h3 className="text-2xl font-heading font-bold text-white">Need a Complete Turnkey Fuel Installation?</h3>
          <p className="text-xs text-white/40">
            Our engineering team handles mechanical fabrication, civil bunding, and regular preventative tank descaling maintenance.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link
              href="/solutions/petroleum/order"
              className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors"
            >
              Order Bulk Fuel
            </Link>
            <Link
              href="/solutions/petroleum/calculator"
              className="px-6 py-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/80 font-bold text-xs transition-colors"
            >
              Calculate Fuel Buffer Size
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
