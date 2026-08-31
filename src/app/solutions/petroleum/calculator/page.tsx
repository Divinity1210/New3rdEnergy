'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Icon } from '@/components/ui/Icon';

export default function PetroleumCalculatorPage() {
  const [calculatorMode, setCalculatorMode] = useState<'generator' | 'fleet'>('generator');

  // Generator Mode State
  const [kva, setKva] = useState(500);
  const [dailyHours, setDailyHours] = useState(12);
  const [daysPerMonth, setDaysPerMonth] = useState(26);
  const [loadFactor, setLoadFactor] = useState(75); // 50%, 75%, 100%

  // Fleet Mode State
  const [heavyTrucks, setHeavyTrucks] = useState(15);
  const [rigidTrucks, setRigidTrucks] = useState(10);
  const [vans, setVans] = useState(8);
  const [avgDailyKm, setAvgDailyKm] = useState(280);
  const [fleetDays, setFleetDays] = useState(26);

  // Generator Calculation Logic
  // Typical diesel generator burn rate formula (Litres/Hour): ~0.24 to 0.28 L per kVA at full load
  // At 75% load: approx kVA * 0.20 L/hr
  const burnRatePerHour = Math.round((kva * 0.26 * (loadFactor / 100)) * 10) / 10;
  const monthlyLitresGen = Math.round(burnRatePerHour * dailyHours * daysPerMonth);
  const bufferTankSize = Math.round(monthlyLitresGen * 0.35); // 10-12 days buffer
  const tankerLoadsPerMonth = (monthlyLitresGen / 33000).toFixed(1);
  const bulkSavingsEstimateNgn = monthlyLitresGen * 85; // Estimated ~85 NGN savings/L vs retail forecourt pump rate

  // Fleet Calculation Logic
  // Heavy truck: ~40L / 100km (0.4L/km)
  // Rigid truck: ~25L / 100km (0.25L/km)
  // Van: ~12L / 100km (0.12L/km)
  const heavyLPerDay = heavyTrucks * (avgDailyKm * 0.40);
  const rigidLPerDay = rigidTrucks * (avgDailyKm * 0.25);
  const vanLPerDay = vans * (avgDailyKm * 0.12);
  const totalFleetDailyLitres = Math.round(heavyLPerDay + rigidLPerDay + vanLPerDay);
  const totalFleetMonthlyLitres = totalFleetDailyLitres * fleetDays;
  const fleetBulkSavingsNgn = totalFleetMonthlyLitres * 85;

  const activeLitres = calculatorMode === 'generator' ? monthlyLitresGen : totalFleetMonthlyLitres;
  const activeSavings = calculatorMode === 'generator' ? bulkSavingsEstimateNgn : fleetBulkSavingsNgn;

  return (
    <div className="bg-[#080808] min-h-screen text-white pt-28 pb-24 selection:bg-red-500 selection:text-white" data-division="petroleum">
      <div className="container-wide">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-white/40 mb-3">
          <Link href="/solutions/petroleum" className="hover:text-red-400 transition-colors">3RD Petroleum</Link>
          <span>/</span>
          <span className="text-white/80">Commercial Fuel Calculator</span>
        </div>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 border-b border-white/[0.06] pb-8">
          <div>
            <span className="text-xs font-bold text-red-500 tracking-[0.2em] uppercase font-mono block mb-2">TELEMETRY & SIZING ENGINE</span>
            <h1 className="text-3xl lg:text-5xl font-heading font-bold text-white tracking-tight">
              Commercial Fuel & Tanker Calculator
            </h1>
          </div>
          <p className="text-xs lg:text-sm text-white/40 max-w-md">
            Model your monthly fuel consumption, compute bulk procurement contract savings, and determine optimal tanker delivery cadences for your facility.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-[#121212] border border-white/[0.08] rounded-xl max-w-md mb-10">
          <button
            onClick={() => setCalculatorMode('generator')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              calculatorMode === 'generator'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <Icon name="factory" size={14} />
            Generator & Plant Load
          </button>
          <button
            onClick={() => setCalculatorMode('fleet')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              calculatorMode === 'fleet'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <Icon name="truck" size={14} />
            Fleet & Logistics Haulage
          </button>
        </div>

        {/* Calculator Grid */}
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
          {/* Controls Column */}
          <div className="bg-[#0f0f0f] border border-white/[0.07] rounded-2xl p-6 lg:p-8 space-y-8">
            {calculatorMode === 'generator' ? (
              <>
                {/* Generator Capacity Slider */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-bold text-white/80 uppercase tracking-wider font-mono">
                      Generator Rating (kVA)
                    </label>
                    <span className="text-lg font-mono font-bold text-red-400 bg-red-950/40 px-3 py-1 rounded border border-red-500/30">
                      {kva} kVA
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="2500"
                    step="50"
                    value={kva}
                    onChange={(e) => setKva(Number(e.target.value))}
                    className="w-full h-2 bg-white/[0.08] rounded-lg appearance-none cursor-pointer accent-red-500"
                  />
                  <div className="flex justify-between text-[10px] text-white/30 font-mono mt-1">
                    <span>50 kVA (Small Commercial)</span>
                    <span>1000 kVA (Industrial)</span>
                    <span>2500 kVA (Heavy Plant)</span>
                  </div>
                </div>

                {/* Daily Operating Hours Slider */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-bold text-white/80 uppercase tracking-wider font-mono">
                      Daily Operating Hours
                    </label>
                    <span className="text-lg font-mono font-bold text-red-400 bg-red-950/40 px-3 py-1 rounded border border-red-500/30">
                      {dailyHours} Hours / Day
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="24"
                    step="1"
                    value={dailyHours}
                    onChange={(e) => setDailyHours(Number(e.target.value))}
                    className="w-full h-2 bg-white/[0.08] rounded-lg appearance-none cursor-pointer accent-red-500"
                  />
                  <div className="flex justify-between text-[10px] text-white/30 font-mono mt-1">
                    <span>2 hrs (Peak backup)</span>
                    <span>12 hrs (Shift operation)</span>
                    <span>24 hrs (Continuous base)</span>
                  </div>
                </div>

                {/* Days Per Month & Load Factor */}
                <div className="grid sm:grid-cols-2 gap-6 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-white/80 uppercase tracking-wider font-mono mb-2">
                      Operating Days / Month
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[22, 26, 30].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setDaysPerMonth(d)}
                          className={`py-2 text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                            daysPerMonth === d
                              ? 'bg-red-600 text-white border-red-500'
                              : 'bg-white/[0.02] border-white/[0.08] text-white/50 hover:text-white'
                          }`}
                        >
                          {d} Days
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/80 uppercase tracking-wider font-mono mb-2">
                      Prime Load Factor
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { factor: 50, label: '50%' },
                        { factor: 75, label: '75%' },
                        { factor: 100, label: '100%' },
                      ].map((f) => (
                        <button
                          key={f.factor}
                          type="button"
                          onClick={() => setLoadFactor(f.factor)}
                          className={`py-2 text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                            loadFactor === f.factor
                              ? 'bg-red-600 text-white border-red-500'
                              : 'bg-white/[0.02] border-white/[0.08] text-white/50 hover:text-white'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Fleet Input Controls */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-white/80 uppercase tracking-wider font-mono mb-1.5">
                      Articulated Heavy Tankers / Flatbeds (40L/100km)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="0"
                        value={heavyTrucks}
                        onChange={(e) => setHeavyTrucks(Math.max(0, Number(e.target.value)))}
                        className="w-24 px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white font-mono text-center"
                      />
                      <span className="text-xs text-white/40">Vehicles in daily haulage</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/80 uppercase tracking-wider font-mono mb-1.5">
                      Rigid 15-Ton / Tipper Trucks (25L/100km)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="0"
                        value={rigidTrucks}
                        onChange={(e) => setRigidTrucks(Math.max(0, Number(e.target.value)))}
                        className="w-24 px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white font-mono text-center"
                      />
                      <span className="text-xs text-white/40">Medium distribution units</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/80 uppercase tracking-wider font-mono mb-1.5">
                      Light Vans & Shuttles (12L/100km)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="0"
                        value={vans}
                        onChange={(e) => setVans(Math.max(0, Number(e.target.value)))}
                        className="w-24 px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white font-mono text-center"
                      />
                      <span className="text-xs text-white/40">Last-mile dispatch vans</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-white/80 uppercase tracking-wider font-mono">
                        Average Daily Mileage per Vehicle
                      </label>
                      <span className="text-sm font-mono font-bold text-red-400">{avgDailyKm} km/day</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="600"
                      step="10"
                      value={avgDailyKm}
                      onChange={(e) => setAvgDailyKm(Number(e.target.value))}
                      className="w-full h-2 bg-white/[0.08] rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Results Telemetry Column */}
          <div className="bg-gradient-to-b from-[#141414] to-[#0d0d0d] border border-red-500/20 rounded-2xl p-6 lg:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-red-400 tracking-widest block mb-0.5">COMPUTED TELEMETRY</span>
                <h3 className="text-base font-heading font-bold text-white">Monthly Fuel Requirement</h3>
              </div>
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
                <Icon name="gauge" size={18} />
              </div>
            </div>

            {/* Big Volume Readout */}
            <div className="bg-black/50 border border-white/[0.06] rounded-xl p-5 text-center">
              <span className="text-xs font-mono text-white/40 uppercase block mb-1">TOTAL ESTIMATED VOLUME</span>
              <div className="text-4xl lg:text-5xl font-mono font-black text-white tracking-tight">
                {activeLitres.toLocaleString()}{' '}
                <span className="text-lg font-normal text-red-400">Litres/mo</span>
              </div>
              {calculatorMode === 'generator' && (
                <p className="text-xs font-mono text-white/40 mt-2">
                  Burn Rate: <strong className="text-white">{burnRatePerHour} L/hr</strong> @ {loadFactor}% generator load
                </p>
              )}
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-white/[0.02] border border-white/[0.06] p-3.5 rounded-xl">
                <span className="text-white/30 block mb-1">TANKER CADENCE</span>
                <span className="text-sm font-bold text-white">
                  ≈ {tankerLoadsPerMonth} Tankers / mo
                </span>
                <span className="text-[10px] text-white/30 block mt-0.5">33,000L Articulated</span>
              </div>

              <div className="bg-white/[0.02] border border-white/[0.06] p-3.5 rounded-xl">
                <span className="text-white/30 block mb-1">RECOMMENDED TANK</span>
                <span className="text-sm font-bold text-emerald-400">
                  {bufferTankSize.toLocaleString()} Litres
                </span>
                <span className="text-[10px] text-white/30 block mt-0.5">10-Day Safe Buffer</span>
              </div>

              <div className="col-span-2 bg-red-950/20 border border-red-500/25 p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-white/40 block mb-0.5">ESTIMATED BULK CONTRACT SAVINGS</span>
                    <span className="text-xl font-mono font-black text-red-400">
                      ₦{activeSavings.toLocaleString()} <span className="text-xs font-normal text-white/50">/ month</span>
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-500/30">
                    ~₦85/L vs Pump
                  </span>
                </div>
                <p className="text-[11px] text-white/30 mt-2">
                  Based on direct depot tanker offloading vs daily retail forecourt procurement.
                </p>
              </div>
            </div>

            {/* Direct Action Link to Pre-filled Order Form */}
            <div className="pt-2">
              <Link
                href={`/solutions/petroleum/order`}
                className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-xl shadow-red-600/30 text-center"
              >
                <Icon name="fuel" size={15} />
                Order This Supply Schedule ({activeLitres.toLocaleString()} Litres)
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
