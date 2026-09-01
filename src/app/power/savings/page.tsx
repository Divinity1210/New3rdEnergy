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
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen pt-32 pb-24 lg:pt-40">
      <div className="container-wide max-w-6xl">
        {/* Header */}
        <div className="text-center space-y-3 mb-12 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-sm">
            <Icon name="trending-up" size={14} className="text-emerald-600" />
            3RD ENERGY SERVICES LTD · ROI & SAVINGS SIMULATOR
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-950 tracking-tight">
            Diesel vs Solar <span className="text-emerald-700">Savings Model.</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Compare diesel generator operational burn vs solar-hybrid systems over 1, 5, and 10 years with transparent engineering assumptions.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Left Column: Interactive Inputs (5 cols) */}
          <div className="lg:col-span-5 p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="font-heading font-bold text-lg text-slate-950">
                1. Your Current Generator Profile
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Adjust values to match your generator size and fuel burn.
              </p>
            </div>

            {/* Generator Size Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 font-medium">Generator Rating:</span>
                <span className="font-bold text-slate-900 font-mono">{generatorKva} kVA</span>
              </div>
              <input
                type="range"
                min={3}
                max={50}
                value={generatorKva}
                onChange={(e) => setGeneratorKva(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            {/* Daily Running Hours */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 font-medium">Daily Generator Run Time:</span>
                <span className="font-bold text-slate-900 font-mono">{dailyHours} Hours / Day</span>
              </div>
              <input
                type="range"
                min={2}
                max={24}
                value={dailyHours}
                onChange={(e) => setDailyHours(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            {/* Fuel Price */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 font-medium">Diesel / Petrol Cost (₦/Litre):</span>
                <span className="font-bold text-slate-900 font-mono">₦{fuelPrice} / L</span>
              </div>
              <input
                type="number"
                value={fuelPrice}
                onChange={(e) => setFuelPrice(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Summary Spend Box */}
            <div className="p-4 rounded-2xl bg-red-50/80 border border-red-200 space-y-2 text-xs">
              <div className="flex justify-between text-red-950">
                <span>Monthly Fuel Burn:</span>
                <span className="font-bold font-mono">{formatCurrency(monthlyFuelSpend)}</span>
              </div>
              <div className="flex justify-between text-red-950">
                <span>Maintenance & Filters (12%):</span>
                <span className="font-bold font-mono">{formatCurrency(monthlyMaintenanceSpend)}</span>
              </div>
              <div className="flex justify-between text-red-950 font-bold pt-2 border-t border-red-200">
                <span>Total Monthly Burn:</span>
                <span className="font-mono">{formatCurrency(totalMonthlyGeneratorSpend)}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Savings Projections & Payback (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-lg space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  Solar Hybrid Economics
                </span>
                <h2 className="font-heading font-extrabold text-2xl text-slate-950 mt-2">
                  Projected Financial ROI & Savings
                </h2>
              </div>

              {/* Big Savings Metrics */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">1-Year Savings</span>
                  <span className="text-xl font-heading font-extrabold text-emerald-900 mt-1 block">
                    {formatCurrency(projectedAnnualSavings)}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">5-Year Cumulative</span>
                  <span className="text-xl font-heading font-extrabold text-emerald-900 mt-1 block">
                    {formatCurrency(fiveYearSavings)}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-100/70 border border-emerald-300">
                  <span className="text-[10px] font-bold text-emerald-900 uppercase block">10-Year Total ROI</span>
                  <span className="text-xl font-heading font-extrabold text-emerald-950 mt-1 block">
                    {formatCurrency(tenYearSavings)}
                  </span>
                </div>
              </div>

              {/* Payback period box */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Estimated Capital Payback Period:</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">Time required for fuel savings to fully pay off your solar hardware.</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-2xl font-heading font-extrabold text-emerald-700 font-mono">
                    ~{paybackMonths} Months
                  </span>
                  <span className="text-[10px] text-slate-400 block">({(paybackMonths / 12).toFixed(1)} Years)</span>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/power/builder"
                  className="flex-1 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors text-center shadow-md shadow-emerald-600/20"
                >
                  Configure Matched Solar Package →
                </Link>
                <Link
                  href="/power/products"
                  className="py-4 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors text-center"
                >
                  Shop Hardware
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
