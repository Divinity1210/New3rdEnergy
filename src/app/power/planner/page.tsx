'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@/components/ui/Icon';
import { defaultAppliances } from '@/lib/data/power-appliances';
import { powerPackages } from '@/lib/data/power-products';
import { useCart } from '@/components/power/CartContext';
import { formatCurrency } from '@/lib/utils';
import {
  SelectedAppliance,
  PowerPriority,
  PropertyType,
  PowerSizingEstimate,
} from '@/lib/types';

export default function PowerPlannerPage() {
  const { addPackage, addItem } = useCart();

  // Multi-step form state
  const [step, setStep] = useState<number>(1);
  const [selectedAppliances, setSelectedAppliances] = useState<SelectedAppliance[]>([
    { applianceId: 'fridge', quantity: 1 },
    { applianceId: 'tv', quantity: 1 },
    { applianceId: 'lights', quantity: 8 },
    { applianceId: 'fans', quantity: 3 },
    { applianceId: 'wifi', quantity: 1 },
    { applianceId: 'laptop', quantity: 2 },
  ]);

  const [dailyHours, setDailyHours] = useState<number>(10);
  const [priority, setPriority] = useState<PowerPriority>('backup');
  const [propertyType, setPropertyType] = useState<PropertyType>('home');
  const [budgetRange, setBudgetRange] = useState<'economy' | 'standard' | 'premium' | 'enterprise'>('standard');

  // Calculation and status states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [estimate, setEstimate] = useState<PowerSizingEstimate | null>(null);

  // Appliance quantity handlers
  const updateQuantity = (applianceId: string, delta: number) => {
    setSelectedAppliances((prev) => {
      const existing = prev.find((item) => item.applianceId === applianceId);
      if (!existing && delta > 0) {
        return [...prev, { applianceId, quantity: delta }];
      }
      if (existing) {
        const nextQty = existing.quantity + delta;
        if (nextQty <= 0) {
          return prev.filter((item) => item.applianceId !== applianceId);
        }
        return prev.map((item) =>
          item.applianceId === applianceId ? { ...item, quantity: nextQty } : item
        );
      }
      return prev;
    });
  };

  const getQuantity = (applianceId: string): number => {
    const found = selectedAppliances.find((item) => item.applianceId === applianceId);
    return found ? found.quantity : 0;
  };

  // Submit and calculate
  const calculateSizing = async () => {
    if (selectedAppliances.length === 0) {
      setError('Please select at least one appliance to size your power system.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/power/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appliances: selectedAppliances,
          dailyHours,
          priority,
          propertyType,
          budgetRange,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to calculate power sizing.');
      }

      setEstimate(data.estimate);
      setStep(6); // Move to Results Screen
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during calculation.');
    } finally {
      setIsLoading(false);
    }
  };

  // Matched package lookup
  const matchedPkg = estimate?.matchedPackageSlug
    ? powerPackages.find((pkg) => pkg.slug === estimate.matchedPackageSlug)
    : powerPackages[1];

  return (
    <div className="bg-neutral-950 text-white min-h-screen pt-32 pb-24 lg:pt-40">
      <div className="container-wide max-w-5xl">
        {/* Header Title */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-solar-500/10 border border-solar-500/20 text-solar-400 text-xs font-semibold">
            <Icon name="zap" size={14} />
            AI Power Sizing Planner
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-white">
            Find Your <span className="text-solar-400">Ideal Power Solution.</span>
          </h1>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto">
            Tell us about your electrical appliances, runtime goals, and property type to calculate your preliminary inverter, battery, and solar capacity.
          </p>
        </div>

        {/* Progress Bar (Steps 1 to 5) */}
        {step <= 5 && (
          <div className="mb-10 max-w-2xl mx-auto">
            <div className="flex justify-between text-xs font-semibold text-neutral-400 mb-2">
              <span className={step >= 1 ? 'text-solar-400' : ''}>1. Appliances</span>
              <span className={step >= 2 ? 'text-solar-400' : ''}>2. Runtime</span>
              <span className={step >= 3 ? 'text-solar-400' : ''}>3. Priority</span>
              <span className={step >= 4 ? 'text-solar-400' : ''}>4. Property</span>
              <span className={step >= 5 ? 'text-solar-400' : ''}>5. Budget</span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-600 via-orange-500 to-amber-500 transition-all duration-300"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center justify-between mb-8 max-w-2xl mx-auto">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 p-1">
              <Icon name="x" size={14} />
            </button>
          </div>
        )}

        {/* ===== STEP 1: APPLIANCES SELECTION ===== */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                What are you trying to power?
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Select your everyday equipment and specify quantities.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {defaultAppliances.map((appliance) => {
                const qty = getQuantity(appliance.id);
                const isSelected = qty > 0;

                return (
                  <div
                    key={appliance.id}
                    className={`p-5 rounded-lg border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-solar-500/10 border-solar-500/40 shadow-lg shadow-amber-950/20'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            isSelected
                              ? 'bg-solar-500/20 text-solar-300'
                              : 'bg-white/5 text-neutral-400'
                          }`}
                        >
                          <Icon name={appliance.icon || 'zap'} size={20} />
                        </div>
                        <span className="text-[11px] font-semibold text-neutral-400">
                          ~{appliance.defaultWatts}W each
                        </span>
                      </div>

                      <h3 className="font-semibold text-sm text-white">{appliance.name}</h3>
                      <p className="text-[11px] text-neutral-400 mt-1 leading-snug">
                        {appliance.description}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-xs text-neutral-400">Quantity</span>
                      <div className="inline-flex items-center border border-white/15 rounded-lg bg-black/40">
                        <button
                          onClick={() => updateQuantity(appliance.id, -1)}
                          disabled={qty === 0}
                          className="px-2.5 py-1 text-xs text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label={`Decrease ${appliance.name}`}
                        >
                          -
                        </button>
                        <span className="px-3 text-xs font-bold text-white min-w-[20px] text-center">
                          {qty}
                        </span>
                        <button
                          onClick={() => updateQuantity(appliance.id, 1)}
                          className="px-2.5 py-1 text-xs text-solar-400 hover:text-solar-300 hover:bg-white/10"
                          aria-label={`Increase ${appliance.name}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Step 1 Actions */}
            <div className="flex justify-end pt-6">
              <button
                onClick={() => {
                  if (selectedAppliances.length === 0) {
                    setError('Please select at least one appliance to proceed.');
                    return;
                  }
                  setError(null);
                  setStep(2);
                }}
                className="px-8 py-3.5 rounded-md bg-solar-600 text-white font-bold text-xs sm:text-sm hover:opacity-95 transition-opacity shadow-lg shadow-primary-950/50 flex items-center gap-2"
              >
                Continue to Runtime Hours
                <Icon name="arrow-right" size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ===== STEP 2: RUNTIME HOURS ===== */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                How many hours of backup power do you need?
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Typical continuous operating window per blackout or night cycle.
              </p>
            </div>

            <div className="p-8 rounded-lg bg-white/[0.03] border border-white/10 text-center space-y-6">
              <div className="text-5xl font-extrabold text-solar-400">
                {dailyHours} <span className="text-2xl text-neutral-400">Hours / Day</span>
              </div>

              <input
                type="range"
                min={2}
                max={24}
                step={1}
                value={dailyHours}
                onChange={(e) => setDailyHours(Number(e.target.value))}
                className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />

              <div className="grid grid-cols-4 gap-2 pt-2">
                {[
                  { hours: 6, label: 'Standard Outage (6h)' },
                  { hours: 10, label: 'Overnight (10h)' },
                  { hours: 16, label: 'Extended (16h)' },
                  { hours: 24, label: '24/7 Continuous' },
                ].map((preset) => (
                  <button
                    key={preset.hours}
                    onClick={() => setDailyHours(preset.hours)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      dailyHours === preset.hours
                        ? 'bg-solar-500/20 border-solar-500/40 text-solar-300'
                        : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-primary-600 to-amber-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2"
              >
                Continue to Power Priority
                <Icon name="arrow-right" size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ===== STEP 3: POWER PRIORITY ===== */}
        {step === 3 && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                What is your primary energy priority?
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Helps us tailor battery vs solar PV balance.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  id: 'backup',
                  title: 'Emergency Backup',
                  desc: 'Instant zero-flicker power whenever the public grid or generator fails.',
                  icon: 'shield',
                },
                {
                  id: 'off-grid',
                  title: '100% Off-Grid Independence',
                  desc: 'Complete self-reliance from utility grid with heavy solar and generator auto-switch.',
                  icon: 'sun',
                },
                {
                  id: 'lower-costs',
                  title: 'Lower Energy Costs',
                  desc: 'Slash diesel/petrol generator fuel spend and expensive utility electricity bills.',
                  icon: 'trending-up',
                },
                {
                  id: 'business-continuity',
                  title: 'Business Continuity',
                  desc: 'Zero-downtime uninterrupted operations for servers, machinery, and cold rooms.',
                  icon: 'target',
                },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => setPriority(item.id as PowerPriority)}
                  className={`p-6 rounded-lg border cursor-pointer transition-all ${
                    priority === item.id
                      ? 'bg-solar-500/10 border-solar-500/50 shadow-lg shadow-amber-950/30'
                      : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-solar-500/20 text-solar-400 flex items-center justify-center mb-4">
                    <Icon name={item.icon} size={20} />
                  </div>
                  <h3 className="font-bold text-sm text-white">{item.title}</h3>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-primary-600 to-amber-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2"
              >
                Continue to Property Type
                <Icon name="arrow-right" size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ===== STEP 4: PROPERTY TYPE ===== */}
        {step === 4 && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                What type of property is this for?
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Influences roof mounting options and electrical phase recommendations.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { id: 'home', title: 'Residential Home', icon: 'warehouse' },
                { id: 'office', title: 'Corporate Office', icon: 'target' },
                { id: 'shop', title: 'Retail Shop / Store', icon: 'sparkles' },
                { id: 'facility', title: 'Industrial Facility', icon: 'hard-hat' },
                { id: 'other', title: 'Other Structure', icon: 'settings' },
              ].map((prop) => (
                <div
                  key={prop.id}
                  onClick={() => setPropertyType(prop.id as PropertyType)}
                  className={`p-5 rounded-lg border cursor-pointer text-center transition-all ${
                    propertyType === prop.id
                      ? 'bg-solar-500/10 border-solar-500/50 text-solar-300'
                      : 'bg-white/[0.03] border-white/10 text-neutral-300 hover:border-white/20'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3 text-solar-400">
                    <Icon name={prop.icon} size={20} />
                  </div>
                  <h3 className="font-semibold text-xs">{prop.title}</h3>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold"
              >
                Back
              </button>
              <button
                onClick={() => setStep(5)}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-primary-600 to-amber-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2"
              >
                Continue to Budget
                <Icon name="arrow-right" size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ===== STEP 5: BUDGET RANGE ===== */}
        {step === 5 && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                What is your estimated investment budget?
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                We will match configured equipment within your preferred range.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  id: 'economy',
                  title: 'Essential Backup',
                  range: '₦1.5M – ₦2.5M',
                  desc: 'Ideal for 3.5kVA Inverter + 5kWh Lithium or Gel battery.',
                },
                {
                  id: 'standard',
                  title: 'Standard Hybrid (Popular)',
                  range: '₦3.5M – ₦5.5M',
                  desc: '5kVA Smart Inverter + 10kWh LiFePO4 + 8x Solar Panels.',
                },
                {
                  id: 'premium',
                  title: 'Executive High-Performance',
                  range: '₦6.0M – ₦10.0M',
                  desc: '10kVA Hybrid + 20kWh LiFePO4 + High-Yield Solar Array.',
                },
                {
                  id: 'enterprise',
                  title: 'Commercial / Industrial',
                  range: '₦12M+',
                  desc: 'Custom multi-inverter 3-phase microgrid for facilities.',
                },
              ].map((tier) => (
                <div
                  key={tier.id}
                  onClick={() => setBudgetRange(tier.id as 'economy' | 'standard' | 'premium' | 'enterprise')}
                  className={`p-6 rounded-lg border cursor-pointer transition-all ${
                    budgetRange === tier.id
                      ? 'bg-solar-500/10 border-solar-500/50 shadow-lg shadow-amber-950/30'
                      : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                  }`}
                >
                  <span className="text-xs font-bold text-solar-400 block">{tier.range}</span>
                  <h3 className="font-bold text-sm text-white mt-1">{tier.title}</h3>
                  <p className="text-xs text-neutral-400 mt-2 leading-relaxed">{tier.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(4)}
                className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold"
              >
                Back
              </button>
              <button
                onClick={calculateSizing}
                disabled={isLoading}
                className="px-8 py-3.5 rounded-md bg-solar-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 hover:opacity-95 shadow-xl shadow-primary-950/60 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Calculating Load Engine...
                  </>
                ) : (
                  <>
                    <Icon name="sparkles" size={16} />
                    Generate Preliminary System Sizing
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ===== STEP 6: PRELIMINARY RECOMMENDATION RESULTS ===== */}
        {step === 6 && estimate && (
          <div className="space-y-10 animate-fade-in">
            {/* Top Requirement Metrics */}
            <div className="p-8 rounded-lg bg-neutral-900 border border-white/15 backdrop-blur-md shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-solar-500/10 rounded-full blur-3xl" />

              <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/10 gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-solar-400">
                    Sizing Results
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                    Your Estimated Power Requirement
                  </h2>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold border border-white/10 self-start md:self-auto"
                >
                  Adjust Assumptions
                </button>
              </div>

              {/* Sizing Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-b border-white/10">
                <div className="p-4 rounded-lg bg-white/[0.03] border border-white/5">
                  <span className="text-xs text-neutral-400 block">Total Running Load</span>
                  <span className="text-xl sm:text-2xl font-bold text-white mt-1 block">
                    {estimate.totalRunningWatts.toLocaleString()} W
                  </span>
                  <span className="text-[10px] text-neutral-500">Surge: ~{estimate.totalSurgeWatts.toLocaleString()}W</span>
                </div>

                <div className="p-4 rounded-lg bg-white/[0.03] border border-white/5">
                  <span className="text-xs text-neutral-400 block">Recommended Inverter</span>
                  <span className="text-xl sm:text-2xl font-bold text-solar-400 mt-1 block">
                    {estimate.recommendedInverterRange}
                  </span>
                  <span className="text-[10px] text-neutral-500">Pure Sine Wave</span>
                </div>

                <div className="p-4 rounded-lg bg-white/[0.03] border border-white/5">
                  <span className="text-xs text-neutral-400 block">Recommended Battery</span>
                  <span className="text-xl sm:text-2xl font-bold text-solar-400 mt-1 block">
                    {estimate.recommendedBatteryKwh} kWh
                  </span>
                  <span className="text-[10px] text-neutral-500">LiFePO4 (85% DOD)</span>
                </div>

                <div className="p-4 rounded-lg bg-white/[0.03] border border-white/5">
                  <span className="text-xs text-neutral-400 block">Recommended Solar PV</span>
                  <span className="text-xl sm:text-2xl font-bold text-white mt-1 block">
                    {estimate.recommendedSolarRange}
                  </span>
                  <span className="text-[10px] text-neutral-500">Daily kWh Offset</span>
                </div>
              </div>

              {/* Usage Assumptions List */}
              <div className="pt-6 space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Expected Usage Assumptions
                </h4>
                <ul className="space-y-1.5 text-xs text-neutral-300">
                  {estimate.assumptions.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Icon name="check-circle" size={14} className="text-green-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mandatory Legal Engineering Disclaimer */}
              <div className="mt-6 p-4 rounded-lg bg-solar-500/10 border border-solar-500/20 text-xs text-amber-200/90 leading-relaxed flex items-start gap-3">
                <Icon name="shield" size={18} className="text-solar-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-solar-300 block mb-0.5">Engineering Disclaimer:</strong>
                  {estimate.disclaimer}
                </div>
              </div>
            </div>

            {/* Recommended Turnkey Package Handoff */}
            {matchedPkg && (
              <div className="p-8 rounded-lg bg-neutral-900/60 border border-white/10 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-solar-400 uppercase tracking-widest">
                      Matched Package
                    </span>
                    <h3 className="font-heading font-bold text-2xl text-white mt-1">
                      {matchedPkg.name}
                    </h3>
                  </div>
                  <span className="text-2xl font-extrabold text-solar-400">
                    {formatCurrency(matchedPkg.price)}
                  </span>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  {matchedPkg.description}
                </p>

                {/* Direct Action Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                  <button
                    onClick={() => addPackage(matchedPkg)}
                    className="py-3.5 px-4 rounded-lg bg-gradient-to-r from-primary-600 to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-primary-950/50"
                  >
                    <Icon name="warehouse" size={16} />
                    Add Package to Cart
                  </button>

                  <Link
                    href={`/power/builder?package=${matchedPkg.slug}`}
                    className="py-3.5 px-4 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-xs text-center flex items-center justify-center gap-2"
                  >
                    <Icon name="settings" size={16} />
                    Customize in System Builder
                  </Link>

                  <Link
                    href="/power/installation"
                    className="py-3.5 px-4 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-xs text-center flex items-center justify-center gap-2"
                  >
                    <Icon name="hard-hat" size={16} />
                    Book Site Audit
                  </Link>

                  <Link
                    href="/quote"
                    className="py-3.5 px-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 font-semibold text-xs text-center flex items-center justify-center gap-2"
                  >
                    <Icon name="file-text" size={16} />
                    Request B2B Invoice
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
