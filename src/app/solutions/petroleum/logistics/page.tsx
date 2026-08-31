'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@/components/ui/Icon';
import { getWhatsAppUrl } from '@/lib/utils';

const depotHubs = [
  {
    id: 'lagos',
    name: 'Lagos Coastal Mega Hub',
    location: 'Apapa / Ibafon Petroleum Zone, Lagos State',
    capacity: '120,000,000 Litres Throughput',
    corridors: 'Lagos Industrial, Ogun Industrial, Ibadan, South-West',
    status: 'ACTIVE DISPATCH',
    sla: '&lt; 4 Hours',
    tankers: '28 Articulated Units',
  },
  {
    id: 'ph',
    name: 'Port Harcourt Eastern Terminal',
    location: 'Trans-Amadi / Onne Energy Free Zone, Rivers State',
    capacity: '85,000,000 Litres Throughput',
    corridors: 'Rivers, Aba, Onitsha, Enugu, Niger Delta Marine',
    status: 'ACTIVE DISPATCH',
    sla: '&lt; 4 Hours',
    tankers: '18 Articulated Units',
  },
  {
    id: 'warri',
    name: 'Warri Western Distribution Depot',
    location: 'Ifiekporo Petroleum Hub, Delta State',
    capacity: '50,000,000 Litres Throughput',
    corridors: 'Delta, Edo, Ondo, Inland Marine Bunkering',
    status: 'ACTIVE DISPATCH',
    sla: '&lt; 6 Hours',
    tankers: '12 Units',
  },
  {
    id: 'abuja',
    name: 'Abuja FCT Fast-Response Hub',
    location: 'Suleja / Idu Industrial Terminal, FCT Abuja',
    capacity: '40,000,000 Litres Throughput',
    corridors: 'Abuja CBD, Nasarawa, Niger State, Minna',
    status: 'ACTIVE DISPATCH',
    sla: '&lt; 2 Hours (CBD & Industrial)',
    tankers: '14 Units + 6 Bobtails',
  },
  {
    id: 'kaduna',
    name: 'Kaduna Northern Inland Depot',
    location: 'Chikun Industrial Complex, Kaduna State',
    capacity: '45,000,000 Litres Throughput',
    corridors: 'Kaduna, Kano Industrial, Zaria, Jos',
    status: 'ACTIVE DISPATCH',
    sla: '&lt; 6 Hours',
    tankers: '10 Articulated Units',
  },
  {
    id: 'calabar',
    name: 'Calabar Coastal Marine Terminal',
    location: 'Esuk Utan Industrial Free Zone, Cross River',
    capacity: '35,000,000 Litres Throughput',
    corridors: 'Cross River, Akwa Ibom, Offshore Supply Vessels',
    status: 'ACTIVE DISPATCH',
    sla: '&lt; 4 Hours',
    tankers: '8 Tankers + Marine Barge Manifold',
  },
];

const fleetFeatures = [
  {
    title: 'Digital IoT GPS Geofencing',
    desc: 'Real-time satellite vehicle tracking with route deviation alarms and offloading zone authorization locks.',
    icon: 'activity',
  },
  {
    title: 'Electronic Meter Calibration',
    desc: 'Weights & Measures certified digital volumetric flow meters ensuring 100% accurate volumetric delivery at discharge point.',
    icon: 'gauge',
  },
  {
    title: 'Anti-Tamper Electronic Seals',
    desc: 'Smart RFID and serialized manifold security seals to eliminate transit contamination or pilferage.',
    icon: 'shield-check',
  },
  {
    title: 'Vapor Recovery & Static Grounding',
    desc: 'Heavy-duty vapor recovery systems and active grounding clamps preventing hazardous static ignition during high-speed offload.',
    icon: 'layers',
  },
];

export default function PetroleumLogisticsPage() {
  const [selectedHub, setSelectedHub] = useState(depotHubs[0]);

  return (
    <div className="bg-[#080808] min-h-screen text-white pt-28 pb-24 selection:bg-red-500 selection:text-white" data-division="petroleum">
      {/* Hero */}
      <div className="container-wide">
        <div className="flex items-center gap-2 text-xs text-white/40 mb-3">
          <Link href="/solutions/petroleum" className="hover:text-red-400 transition-colors">3RD Petroleum</Link>
          <span>/</span>
          <span className="text-white/80">Depot & Fleet Logistics Network</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 border-b border-white/[0.06] pb-8">
          <div>
            <span className="text-xs font-bold text-red-500 tracking-[0.2em] uppercase font-mono block mb-2">NATIONWIDE SUPPLY CORRIDORS</span>
            <h1 className="text-3xl lg:text-5xl font-heading font-bold text-white tracking-tight">
              Depot Infrastructure & Tanker Fleet
            </h1>
          </div>
          <p className="text-xs lg:text-sm text-white/40 max-w-md">
            Operating 50+ articulated haulage units across 6 coastal and inland supply depots with automated dispatch and guaranteed emergency SLAs.
          </p>
        </div>

        {/* Feature Visual Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16 items-center">
          <div className="relative h-[380px] lg:h-[460px] rounded-2xl overflow-hidden border border-white/[0.08]">
            <Image
              src="/images/petroleum/logistics.jpg"
              alt="3RD Petroleum GPS Tanker Fleet Convoy"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-[10px] font-mono uppercase bg-red-600 text-white px-2.5 py-1 rounded font-bold tracking-wider inline-block mb-2">
                ACTIVE CORRIDOR TELEMETRY
              </span>
              <h3 className="text-lg font-heading font-bold text-white mb-1">Satellite-Monitored Bulk Haulage Fleet</h3>
              <p className="text-xs text-white/60">Every tanker is calibrated and linked to our Central Logistics Command in real time.</p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 font-mono">
              <div className="bg-[#0f0f0f] border border-white/[0.07] p-5 rounded-xl">
                <span className="text-xs text-white/40 block mb-1">ACTIVE TANKER FLEET</span>
                <span className="text-3xl font-black text-white">50+ <span className="text-xs text-red-400 font-normal">Vehicles</span></span>
                <p className="text-[10px] text-white/30 mt-1">Tri-axle 33kL, 45kL & Bobtails</p>
              </div>
              <div className="bg-[#0f0f0f] border border-white/[0.07] p-5 rounded-xl">
                <span className="text-xs text-white/40 block mb-1">EMERGENCY DISPATCH SLA</span>
                <span className="text-3xl font-black text-emerald-400">&lt; 4 <span className="text-xs font-normal">Hours</span></span>
                <p className="text-[10px] text-white/30 mt-1">Rapid response for industrial plants</p>
              </div>
              <div className="bg-[#0f0f0f] border border-white/[0.07] p-5 rounded-xl">
                <span className="text-xs text-white/40 block mb-1">DEPOT DISTRIBUTION HUBS</span>
                <span className="text-3xl font-black text-white">6 <span className="text-xs text-red-400 font-normal">Terminals</span></span>
                <p className="text-[10px] text-white/30 mt-1">Coastal & inland terminal gates</p>
              </div>
              <div className="bg-[#0f0f0f] border border-white/[0.07] p-5 rounded-xl">
                <span className="text-xs text-white/40 block mb-1">MONTHLY THROUGHPUT</span>
                <span className="text-3xl font-black text-white">10M+ <span className="text-xs text-red-400 font-normal">Litres</span></span>
                <p className="text-[10px] text-white/30 mt-1">Guaranteed continuous allocation</p>
              </div>
            </div>

            <div className="bg-red-950/20 border border-red-500/20 p-5 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white mb-0.5">Need Emergency Dispatch?</h4>
                <p className="text-xs text-white/40">Direct hotline to 24/7 Logistics Command.</p>
              </div>
              <Link
                href="/solutions/petroleum/order"
                className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-all shadow-md shadow-red-600/30"
              >
                Order Fuel Now
              </Link>
            </div>
          </div>
        </div>

        {/* Depot Hubs Interactive Selector */}
        <div className="mb-16">
          <div className="mb-6">
            <span className="text-xs font-mono text-red-400 uppercase tracking-widest block mb-1">DEPOT INFRASTRUCTURE</span>
            <h2 className="text-2xl font-heading font-bold text-white">Terminal Locations & Corridors</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-4">
            {depotHubs.map((hub) => {
              const isSelected = selectedHub.id === hub.id;
              return (
                <div
                  key={hub.id}
                  onClick={() => setSelectedHub(hub)}
                  className={`p-5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-red-950/20 border-red-500/60 ring-1 ring-red-500/30'
                      : 'bg-[#0f0f0f] border-white/[0.06] hover:border-white/[0.15]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                      {hub.status}
                    </span>
                    <span className="text-xs font-mono text-white/30">SLA: {hub.sla}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">{hub.name}</h3>
                  <p className="text-xs text-white/40 mb-3">{hub.location}</p>

                  <div className="text-[11px] font-mono text-white/30 pt-3 border-t border-white/[0.04] space-y-1">
                    <div>Throughput: <strong className="text-white/70">{hub.capacity}</strong></div>
                    <div>Corridors: <strong className="text-white/70">{hub.corridors}</strong></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fleet Engineering & Telemetry Specs */}
        <div className="bg-[#0f0f0f] border border-white/[0.07] rounded-2xl p-8 lg:p-12 mb-16">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-mono text-red-400 uppercase tracking-widest block mb-1">FLEET TELEMETRY</span>
            <h2 className="text-2xl lg:text-3xl font-heading font-bold text-white mb-2">
              Advanced Tanker Telematics & Safety Engineering
            </h2>
            <p className="text-xs lg:text-sm text-white/40">
              Our fleet is outfitted with automated custody transfer telemetry and strict HSE compliance gear to eliminate pilferage, contamination, and transit downtime.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {fleetFeatures.map((feat) => (
              <div key={feat.title} className="bg-black/40 border border-white/[0.05] p-5 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center mb-4">
                  <Icon name={feat.icon} size={20} />
                </div>
                <h4 className="text-sm font-bold text-white mb-2">{feat.title}</h4>
                <p className="text-xs text-white/40 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Bar */}
        <div className="bg-gradient-to-r from-red-950/40 via-red-900/20 to-black border border-red-500/30 rounded-2xl p-8 text-center max-w-3xl mx-auto">
          <h3 className="text-xl lg:text-2xl font-heading font-bold text-white mb-2">Book a Dedicated Supply Route</h3>
          <p className="text-xs text-white/50 mb-6 max-w-md mx-auto">
            Schedule recurring deliveries with dedicated tanker slot allocations and price index protection.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
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
              Calculate Fuel Consumption
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
