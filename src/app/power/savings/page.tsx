'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { formatCurrency } from '@/lib/utils';

export default function PowerSavingsSimulatorPage() {
  // Input parameters
  const [generatorKva, setGeneratorKva] = useState<number>(10);
  const [dailyHours, setDailyHours] = useState<number>(8);
  const [fuelPrice, setFuelPrice] = useState<number>(1250); // NGN per litre
  const [monthlyGridBill, setMonthlyGridBill] = useState<number>(75000);
  const [targetOffsetPercent, setTargetOffsetPercent] = useState<number>(80);

  // Approximate fuel consumption model: ~0.25 - 0.30 Litres per kVA per hour at 70% load
  const fuelBurnLitresPerHour = generatorKva * 0.28;
  const dailyFuelLitres = fuelBurnLitresPerHour * dailyHours;
  const dailyFuelSpend = dailyFuelLitres * fuelPrice;
  const monthlyFuelSpend = dailyFuelSpend * 30;

  // Generator maintenance factor: oil changes, filters, spark plugs (~12% of fuel costs)
  const monthlyMaintenanceSpend = monthlyFuelSpend * 0.12;
  const totalMonthlyGeneratorSpend = monthlyFuelSpend + monthlyMaintenanceSpend;
  const annualGeneratorSpend = totalMonthlyGeneratorSpend * 12;

  const annualGridSpend = monthlyGridBill * 12;
  const totalAnnualCurrentSpend = annualGeneratorSpend + annualGridSpend;

  // Projected solar savings based on target offset %
  const projectedAnnualSavings = totalAnnualCurrentSpend * (targetOffsetPercent / 100);
  const fiveYearSavings = projectedAnnualSavings * 5;
  const tenYearSavings = projectedAnnualSavings * 10;

  // Estimated carbon reduction: ~2.68 kg CO2 per litre of diesel burned
  const annualLitresBurned = dailyFuelLitres * 365;
  const co2ReductionTonnes = Number(((annualLitresBurned * 2.68 * (targetOffsetPercent / 100)) / 1000).toFixed(1));

  // Estimated capital outlay benchmark for solar package
  const estimatedSystemCost = generatorKva <= 5 ? 4350000 : generatorKva <= 10 ? 8950000 : 15000000;
  const paybackMonths = Number(((estimatedSystemCost / projectedAnnualSavings) * 12).toFixed(1));

  return (
    <div className="bg-neutral-50 text-neutral-900 min-h-screen pt-32 pb-24 lg:pt-40">
      <div className="container-wide max-w-6xl">
        {/* Header */}
        <div className="text-center space-y-3 mb-12 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Icon name="chart" size={14} />
            Financial & Fuel ROI Model
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-neutral-900">
            Power Savings <span className="text-solar-400">Simulator.</span>
          </h1>
          <p className="text-sm text-neutral-400">
            Compare diesel generator operational burn vs solar-hybrid systems over 1, 5, and 10 years with transparent, verifiable engineering assumptions.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Left Column: Interactive Inputs (5 cols) */}
          <div className="lg:col-span-5 p-7 rounded-lg bg-white border border-neutral-200 space-y-6">
            <div className="border-b border-neutral-200 pb-3">
              <h2 className="font-heading font-bold text-lg text-neutral-900">
                1. Your Current Energy Situation
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Adjust values to match your generator and billing profile.
              </p>
            </div>

            {/* Generator Size Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <label className="font-semibold text-neutral-300">Generator Rating (kVA)</label>
                <span className="font-bold text-solar-400">{generatorKva} kVA</span>
              </div>
              <input
                type="range"
                min={3.5}
                max={50}
                step={0.5}
                value={generatorKva}
                onChange={(e) => setGeneratorKva(Number(e.target.value))}
                className="w-full h-2 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-neutral-500">
                <span>3.5kVA (Home)</span>
                <span>10kVA (Office)</span>
                <span>50kVA (Industrial)</span>
              </div>
            </div>

            {/* Daily Hours Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <label className="font-semibold text-neutral-300">Daily Generator Runtime</label>
                <span className="font-bold text-solar-400">{dailyHours} Hours / Day</span>
              </div>
              <input
                type="range"
                min={2}
                max={24}
                step={1}
                value={dailyHours}
                onChange={(e) => setDailyHours(Number(e.target.value))}
                className="w-full h-2 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-neutral-500">
                <span>2h (Peak Only)</span>
                <span>8h (Workday)</span>
                <span>24h (Off-Grid)</span>
              </div>
            </div>

            {/* Fuel Price Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300 block">
                Fuel Tariff (₦ / Litre)
              </label>
              <input
                type="number"
                value={fuelPrice}
                onChange={(e) => setFuelPrice(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-white text-xs focus:border-solar-400 focus:outline-none"
              />
            </div>

            {/* Monthly Grid Bill */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300 block">
                Monthly Utility Grid Bill (₦ / Month)
              </label>
              <input
                type="number"
                value={monthlyGridBill}
                onChange={(e) => setMonthlyGridBill(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-white text-xs focus:border-solar-400 focus:outline-none"
              />
            </div>

            {/* Target Solar Offset */}
            <div className="space-y-2 pt-2 border-t border-neutral-200">
              <div className="flex justify-between text-xs">
                <label className="font-semibold text-neutral-300">Target Solar Offset</label>
                <span className="font-bold text-green-400">{targetOffsetPercent}% Offset</span>
              </div>
              <input
                type="range"
                min={50}
                max={100}
                step={5}
                value={targetOffsetPercent}
                onChange={(e) => setTargetOffsetPercent(Number(e.target.value))}
                className="w-full h-2 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-green-400"
              />
            </div>
          </div>

          {/* Right Column: Dynamic Financial Forecast (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Savings Highlights */}
            <div className="p-8 rounded-lg bg-white border border-neutral-300 backdrop-blur-md shadow-xl relative overflow-hidden space-y-6">
              <div className="absolute top-0 right-0 w-80 h-80 bg-green-500/10 rounded-full blur-3xl" />

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-neutral-200 pb-4 gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-green-400">
                    Projected Return on Investment
                  </span>
                  <h3 className="font-heading font-extrabold text-2xl text-white mt-1">
                    Annual Net Savings
                  </h3>
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-solar-400">
                  {formatCurrency(projectedAnnualSavings)}
                  <span className="text-xs text-neutral-400 font-normal block text-right">/ year</span>
                </div>
              </div>

              {/* Multi-Year Projections */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-4 rounded-lg bg-white/[0.03] border border-white/5">
                  <span className="text-[11px] text-neutral-400 block">1-Year Savings</span>
                  <span className="text-base sm:text-lg font-bold text-white mt-1 block">
                    {formatCurrency(projectedAnnualSavings)}
                  </span>
                </div>
                <div className="p-4 rounded-lg bg-white/[0.03] border border-white/5">
                  <span className="text-[11px] text-neutral-400 block">5-Year Savings</span>
                  <span className="text-base sm:text-lg font-bold text-solar-400 mt-1 block">
                    {formatCurrency(fiveYearSavings)}
                  </span>
                </div>
                <div className="p-4 rounded-lg bg-white/[0.03] border border-white/5">
                  <span className="text-[11px] text-neutral-400 block">10-Year Savings</span>
                  <span className="text-base sm:text-lg font-bold text-green-400 mt-1 block">
                    {formatCurrency(tenYearSavings)}
                  </span>
                </div>
              </div>

              {/* Key Payback Metrics Strip */}
              <div className="grid sm:grid-cols-2 gap-4 py-2 border-t border-neutral-200 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-solar-500/10 text-solar-400 flex items-center justify-center shrink-0">
                    <Icon name="trending-up" size={18} />
                  </div>
                  <div>
                    <span className="text-neutral-400 block">Estimated Payback Period</span>
                    <strong className="text-white text-sm">~{paybackMonths} Months</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center shrink-0">
                    <Icon name="sun" size={18} />
                  </div>
                  <div>
                    <span className="text-neutral-400 block">Annual Carbon Reduction</span>
                    <strong className="text-green-400 text-sm">~{co2ReductionTonnes} Tonnes CO₂e</strong>
                  </div>
                </div>
              </div>

              {/* Cost Breakdown Details */}
              <div className="p-4 rounded-lg bg-neutral-50 border border-white/5 space-y-2 text-xs text-neutral-300">
                <div className="flex justify-between">
                  <span>Current Monthly Generator Fuel Spend:</span>
                  <span className="font-semibold text-neutral-900">{formatCurrency(monthlyFuelSpend)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Monthly Generator Maintenance:</span>
                  <span className="font-semibold text-neutral-900">{formatCurrency(monthlyMaintenanceSpend)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Total Annual Energy Expenditure:</span>
                  <span className="font-bold text-red-400">{formatCurrency(totalAnnualCurrentSpend)}</span>
                </div>
              </div>

              {/* Legal Disclaimer */}
              <div className="p-4 rounded-lg bg-solar-500/10 border border-solar-500/20 text-xs text-amber-200/90 leading-relaxed flex items-start gap-2.5">
                <Icon name="shield" size={16} className="text-solar-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-solar-300 block mb-0.5">Assumptions & Disclaimer:</strong>
                  Educational cost comparison estimate only. Actual fuel burn, generator mechanical efficiency, and solar irradiance yield depend on local ambient weather and load cycling. Does not constitute an absolute financial guarantee.
                </div>
              </div>
            </div>

            {/* Direct Sizing Handoff */}
            <div className="p-6 rounded-lg bg-white/[0.03] border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm text-neutral-900">Size a System for Your Facility</h4>
                <p className="text-xs text-neutral-400">Match your {generatorKva}kVA load with our AI Power Planner.</p>
              </div>
              <Link
                href="/power/planner"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-primary-600 to-amber-500 text-white font-bold text-xs hover:opacity-95 transition-opacity whitespace-nowrap"
              >
                Launch AI Planner &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
