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

  const getQuantity = (applianceId: string) => {
    const item = selectedAppliances.find((a) => a.applianceId === applianceId);
    return item ? item.quantity : 0;
  };

  // Submit calculation to API
  const handleCalculate = async () => {
    if (selectedAppliances.length === 0) {
      setError('Please select at least one appliance to size your power system.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/power/size', {
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
      setStep(3); // Go to results step
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during sizing.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen pt-32 pb-24 lg:pt-40">
      <div className="container-wide max-w-5xl">
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-sm">
            <Icon name="zap" size={14} className="text-emerald-600" />
            3RD ENERGY SERVICES LTD · AI SIZING PLANNER
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-950 tracking-tight">
            AI Power Sizing <span className="text-emerald-700">Planner.</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Answer a few quick questions to receive an engineered recommendation for your home or business.
          </p>
        </div>

        {/* Stepper Header */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 mb-12 text-xs font-bold">
          {[
            { num: 1, label: 'Appliances' },
            { num: 2, label: 'Hours & Priority' },
            { num: 3, label: 'Recommendation' },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s.num
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : step > s.num
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span className={step === s.num ? 'text-slate-900 font-extrabold' : 'text-slate-500'}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between mb-8 shadow-sm">
            <span>{error}</span>
            <button type="button" onClick={() => setError(null)} className="text-red-400 p-1">
              <Icon name="x" size={14} />
            </button>
          </div>
        )}

        {/* ===== STEP 1: APPLIANCES SELECTION ===== */}
        {step === 1 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-950">
                What are you trying to power?
              </h2>
              <p className="text-xs text-slate-500 mt-1">
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
                    className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-500 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold ${
                            isSelected
                              ? 'bg-emerald-200/80 text-emerald-800'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          <Icon name={appliance.icon || 'zap'} size={20} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-500 font-mono">
                          ~{appliance.defaultWatts}W
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-slate-950">{appliance.name}</h3>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        {appliance.description}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">Quantity</span>
                      <div className="inline-flex items-center border border-slate-200 rounded-xl bg-slate-50">
                        <button
                          onClick={() => updateQuantity(appliance.id, -1)}
                          disabled={qty === 0}
                          className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label={`Decrease ${appliance.name}`}
                        >
                          -
                        </button>
                        <span className="px-3 text-xs font-extrabold text-slate-950 min-w-[24px] text-center font-mono">
                          {qty}
                        </span>
                        <button
                          onClick={() => updateQuantity(appliance.id, 1)}
                          className="px-3 py-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100 rounded-r-xl"
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

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer"
              >
                Continue to Runtime & Priorities →
              </button>
            </div>
          </div>
        )}

        {/* ===== STEP 2: RUNTIME & GOALS ===== */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-950">
                Operating Profile & Energy Goals
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Tell us how many hours of battery autonomy you need during blackouts.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Daily Hours Slider */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-slate-950">Target Backup Runtime</h3>
                  <span className="text-base font-heading font-extrabold text-emerald-700 font-mono">
                    {dailyHours} Hours / Day
                  </span>
                </div>
                <input
                  type="range"
                  min={4}
                  max={24}
                  value={dailyHours}
                  onChange={(e) => setDailyHours(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <p className="text-xs text-slate-500 leading-relaxed">
                  Typical Nigerian residential needs average 10–14 hours of night & daytime backup.
                </p>
              </div>

              {/* Priority Selector */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-slate-950">Primary Goal</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'backup', label: 'Outage Backup', desc: 'Silent power when grid drops' },
                    { id: 'independence', label: 'Zero Fuel Run', desc: 'Cut generator fuel by 80%' },
                    { id: 'savings', label: 'Max Cost ROI', desc: 'Fastest financial payback' },
                    { id: 'critical', label: '24/7 Server/Clinic', desc: 'Zero millisecond transfer' },
                  ].map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setPriority(p.id as any)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                        priority === p.id
                          ? 'bg-emerald-50/80 border-emerald-500 shadow-sm'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-900 block">{p.label}</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">{p.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                ← Back to Appliances
              </button>
              <button
                type="button"
                onClick={handleCalculate}
                disabled={isLoading}
                className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Icon name="loader" size={16} className="animate-spin" />
                    Calculating Engineered Sizing...
                  </>
                ) : (
                  <>
                    <Icon name="zap" size={16} />
                    Generate My Solar Sizing Report
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ===== STEP 3: RECOMMENDATION & RESULTS ===== */}
        {step === 3 && estimate && (
          <div className="space-y-8 animate-fade-in">
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-lg space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                    Engineered System Recommendation
                  </span>
                  <h2 className="font-heading font-extrabold text-2xl text-slate-950 mt-1.5">
                    Recommended Sizing: {estimate.recommendedKva}kVA / {estimate.recommendedBatteryKwh}kWh
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Estimated Investment</span>
                  <span className="text-2xl font-heading font-extrabold text-slate-950">
                    {formatCurrency(estimate.estimatedCost)}
                  </span>
                </div>
              </div>

              {/* Breakdown metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Running Load</span>
                  <span className="text-lg font-bold text-slate-950 font-mono mt-0.5 block">{estimate.totalRunningWatts} W</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Daily Energy</span>
                  <span className="text-lg font-bold text-slate-950 font-mono mt-0.5 block">{estimate.totalDailyKwh} kWh</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Solar PV Size</span>
                  <span className="text-lg font-bold text-slate-950 font-mono mt-0.5 block">{estimate.recommendedSolarKwp} kWp</span>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">Autonomy</span>
                  <span className="text-lg font-bold text-emerald-900 font-mono mt-0.5 block">~{estimate.recommendedRuntimeHours} Hours</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/power/products"
                  className="flex-1 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors text-center shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
                >
                  <Icon name="shopping-cart" size={14} />
                  Browse Matched Products in Store
                </Link>
                <Link
                  href="/power/builder"
                  className="py-4 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors text-center"
                >
                  Fine-Tune in 3D Builder
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
