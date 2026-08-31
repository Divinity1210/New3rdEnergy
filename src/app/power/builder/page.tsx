'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@/components/ui/Icon';
import { powerProducts, powerPackages } from '@/lib/data/power-products';
import { useCart } from '@/components/power/CartContext';
import { formatCurrency } from '@/lib/utils';
import { PowerPackage } from '@/lib/types';

export default function SystemBuilderPage() {
  const { addPackage } = useCart();

  // Customizer selections
  const [selectedInverterId, setSelectedInverterId] = useState<string>('inv-5kva-48v');
  const [batteryKwhTarget, setBatteryKwhTarget] = useState<number>(10.24); // 5.12, 10.24, 15.36, 20.48
  const [includeSolar, setIncludeSolar] = useState<boolean>(true);
  const [solarPanelCount, setSolarPanelCount] = useState<number>(8); // 0, 4, 8, 12, 16
  const [includeInstallation, setIncludeInstallation] = useState<boolean>(true);
  const [backupHoursTarget, setBackupHoursTarget] = useState<number>(14);

  // Available inverters
  const inverters = powerProducts.filter((p) => p.category === 'inverters');
  const currentInverter = inverters.find((i) => i.id === selectedInverterId) || inverters[1];

  // Battery selection based on capacity
  const batteryUnit = powerProducts.find((p) => p.id === 'bat-5.12kwh-wall')!;
  const batteryUnitsCount = Math.max(1, Math.round(batteryKwhTarget / 5.12));
  const totalBatteryKwh = Number((batteryUnitsCount * 5.12).toFixed(2));
  const batteryTotalCost = batteryUnitsCount * batteryUnit.price;

  // Solar panel selection
  const solarPanel = powerProducts.find((p) => p.id === 'sp-550w-mono')!;
  const totalSolarKwp = includeSolar ? Number(((solarPanelCount * 550) / 1000).toFixed(2)) : 0;
  const solarTotalCost = includeSolar ? solarPanelCount * solarPanel.price : 0;

  // Protection kit & installation
  const protectionBox = powerProducts.find((p) => p.id === 'acc-dc-protection-box')!;
  const emsHub = powerProducts.find((p) => p.id === 'acc-ems-logger')!;
  const accessoriesCost = protectionBox.price + (batteryUnitsCount >= 2 ? emsHub.price : 0);

  const equipmentSubtotal = currentInverter.price + batteryTotalCost + solarTotalCost + accessoriesCost;
  const installationFee = includeInstallation ? Math.max(120000, Math.round(equipmentSubtotal * 0.08)) : 0;
  const totalPrice = equipmentSubtotal + installationFee;

  // Sync backup hours based on capacity and inverter
  useEffect(() => {
    // Approx 700W average load
    const hours = Math.min(24, Math.round((totalBatteryKwh * 0.85 * 1000) / 650));
    setBackupHoursTarget(hours);
  }, [totalBatteryKwh]);

  // Construct custom package model for Cart
  const customPackage: PowerPackage = {
    id: `custom-pkg-${Date.now()}`,
    slug: `custom-${currentInverter.specs.continuousPower?.split(' ')[0]}-${totalBatteryKwh}kwh`,
    name: `Custom ${currentInverter.specs.continuousPower?.split('/')[0]} Hybrid Package (${totalBatteryKwh}kWh / ${totalSolarKwp}kWp)`,
    tier: totalBatteryKwh >= 20 ? 'commercial' : totalBatteryKwh >= 10 ? 'recommended' : 'essential',
    tagline: `Configured system with ${totalBatteryKwh}kWh LiFePO4 storage and ${includeSolar ? `${totalSolarKwp}kWp solar array` : 'battery-only backup'}.`,
    description: `Bespoke power system custom configured with ${currentInverter.name}, ${batteryUnitsCount}x ${batteryUnit.name}, and ${includeSolar ? `${solarPanelCount}x ${solarPanel.name}` : 'zero solar panels (backup inverter mode)'}.`,
    image: '/images/solar-hero.jpg',
    ratingKva: currentInverter.id === 'inv-10kva-48v-3p' ? 10.0 : currentInverter.id === 'inv-5kva-48v' ? 5.0 : 3.5,
    batteryKwh: totalBatteryKwh,
    solarKwp: totalSolarKwp,
    estimatedBackupHours: backupHoursTarget,
    idealFor: 'Customized Residential or Commercial Facility',
    inverter: currentInverter,
    battery: batteryUnit,
    batteryQuantity: batteryUnitsCount,
    solarPanel: includeSolar ? solarPanel : undefined,
    solarQuantity: includeSolar ? solarPanelCount : 0,
    accessories: [protectionBox],
    price: totalPrice,
    currency: 'NGN',
    includesInstallation: includeInstallation,
    warrantyYears: currentInverter.id === 'inv-10kva-48v-3p' ? 5 : 3,
  };

  return (
    <div className="bg-neutral-50 text-neutral-900 min-h-screen pt-32 pb-24 lg:pt-40">
      <div className="container-wide max-w-6xl">
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-solar-500/10 border border-solar-500/20 text-solar-400 text-xs font-semibold">
            <Icon name="settings" size={14} />
            AI System Builder
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-neutral-900">
            Design & Customize <span className="text-solar-400">My Power System.</span>
          </h1>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto">
            Live interactive configurator. Scale your battery modules, adjust solar panel capacity, and compare package tiers in real time.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Inverter Core Selector */}
            <div className="p-6 rounded-lg bg-white border border-neutral-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-solar-400 uppercase tracking-wider">
                  Step 1 · Power Core
                </span>
                <span className="text-xs text-neutral-400">Inverter Inrush Capacity</span>
              </div>
              <h2 className="font-heading font-bold text-lg text-neutral-900">
                Choose Inverter Capacity
              </h2>

              <div className="grid sm:grid-cols-3 gap-3">
                {inverters.map((inv) => (
                  <div
                    key={inv.id}
                    onClick={() => setSelectedInverterId(inv.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedInverterId === inv.id
                        ? 'bg-solar-500/15 border-solar-500/60 shadow-lg shadow-amber-950/20'
                        : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <span className="text-xs font-bold text-white block">
                      {inv.specs.continuousPower?.split('/')[0]}
                    </span>
                    <span className="text-[11px] text-solar-400 font-semibold block mt-0.5">
                      {formatCurrency(inv.price)}
                    </span>
                    <span className="text-[10px] text-neutral-400 block mt-1 line-clamp-2">
                      {inv.specs.phase || 'Single Phase'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Battery Storage Scaling */}
            <div className="p-6 rounded-lg bg-white border border-neutral-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-solar-400 uppercase tracking-wider">
                  Step 2 · Energy Storage
                </span>
                <span className="text-xs text-neutral-400">{backupHoursTarget}h Est. Runtime</span>
              </div>
              <h2 className="font-heading font-bold text-lg text-neutral-900">
                Lithium LiFePO4 Storage ({totalBatteryKwh} kWh)
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { kwh: 5.12, label: '5.12 kWh (1 Pack)', runtime: '~6–8h' },
                  { kwh: 10.24, label: '10.24 kWh (2 Packs)', runtime: '~12–16h' },
                  { kwh: 15.36, label: '15.36 kWh (3 Packs)', runtime: '~18–20h' },
                  { kwh: 20.48, label: '20.48 kWh (4 Packs)', runtime: '24h+' },
                ].map((tier) => (
                  <div
                    key={tier.kwh}
                    onClick={() => setBatteryKwhTarget(tier.kwh)}
                    className={`p-3.5 rounded-lg border cursor-pointer text-center transition-all ${
                      batteryKwhTarget === tier.kwh
                        ? 'bg-solar-500/15 border-solar-500/60 text-white shadow-lg'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-400 hover:text-neutral-900'
                    }`}
                  >
                    <span className="text-xs font-bold block">{tier.kwh} kWh</span>
                    <span className="text-[10px] text-solar-400 font-medium block mt-0.5">
                      {tier.runtime}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Solar PV Array Configuration */}
            <div className="p-6 rounded-lg bg-white border border-neutral-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-solar-400 uppercase tracking-wider">
                  Step 3 · Solar Generation
                </span>
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={includeSolar}
                    onChange={(e) => setIncludeSolar(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-400 bg-neutral-100 border-neutral-300"
                  />
                  <span className="text-white font-medium">Include Solar Panels</span>
                </label>
              </div>

              {includeSolar ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-neutral-300">
                    <span>Array Size: <strong>{solarPanelCount}x 550W Panels</strong> ({totalSolarKwp} kWp)</span>
                    <span className="text-solar-400 font-semibold">{formatCurrency(solarTotalCost)}</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[4, 8, 12, 16].map((count) => (
                      <button
                        key={count}
                        onClick={() => setSolarPanelCount(count)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                          solarPanelCount === count
                            ? 'bg-solar-500/20 border-solar-500/50 text-solar-300'
                            : 'bg-neutral-50 border-neutral-200 text-neutral-400 hover:text-neutral-900'
                        }`}
                      >
                        {count} Panels ({(count * 0.55).toFixed(1)}kWp)
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-neutral-400 bg-neutral-50 p-3 rounded-xl">
                  Solar array removed. System will operate as a clean battery backup inverter charged via utility grid or generator.
                </p>
              )}
            </div>

            {/* 4. Turnkey Installation Toggle */}
            <div className="p-6 rounded-lg bg-white border border-neutral-200 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeInstallation}
                  onChange={(e) => setIncludeInstallation(e.target.checked)}
                  className="mt-1 rounded text-amber-500 focus:ring-amber-400 bg-neutral-100 border-neutral-300"
                />
                <div className="text-xs">
                  <span className="font-bold text-white block text-sm">
                    Certified Turnkey Installation & Commissioning
                  </span>
                  <span className="text-neutral-400 block mt-0.5 leading-relaxed">
                    Includes DC surge protection box, aluminum roof rails, earthing rod, distribution board wiring, and post-installation warranty certification (+{formatCurrency(installationFee)}).
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Right Column: Live Package Bill-of-Materials & Cart Handoff (5 cols) */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="p-7 rounded-lg bg-white/95 border border-neutral-300 backdrop-blur-md shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-solar-400">
                    Live BOM Summary
                  </span>
                  <h3 className="font-heading font-bold text-xl text-white mt-0.5">
                    My Power System
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-solar-500/10 border border-solar-500/30 text-[11px] font-bold text-solar-400 uppercase">
                  {customPackage.tier}
                </span>
              </div>

              {/* Line Items Breakdown */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-neutral-300">{currentInverter.name}</span>
                  <span className="font-semibold text-neutral-900">{formatCurrency(currentInverter.price)}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-neutral-300">
                    {batteryUnitsCount}x {batteryUnit.name} ({totalBatteryKwh}kWh)
                  </span>
                  <span className="font-semibold text-neutral-900">{formatCurrency(batteryTotalCost)}</span>
                </div>

                {includeSolar && (
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-neutral-300">
                      {solarPanelCount}x {solarPanel.name} ({totalSolarKwp}kWp)
                    </span>
                    <span className="font-semibold text-neutral-900">{formatCurrency(solarTotalCost)}</span>
                  </div>
                )}

                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-neutral-300">DC Surge Protection & Accessories</span>
                  <span className="font-semibold text-neutral-900">{formatCurrency(accessoriesCost)}</span>
                </div>

                {includeInstallation && (
                  <div className="flex justify-between py-1.5 border-b border-white/5 text-solar-400">
                    <span>Certified Turnkey Installation</span>
                    <span className="font-semibold">{formatCurrency(installationFee)}</span>
                  </div>
                )}
              </div>

              {/* Total Price Box */}
              <div className="pt-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-neutral-400">Total System Investment</span>
                  <span className="text-3xl font-extrabold text-solar-400">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
                <span className="text-[11px] text-green-400 font-semibold block mt-1">
                  ✓ Includes {customPackage.warrantyYears}-Year Manufacturer Warranty
                </span>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => addPackage(customPackage)}
                  className="w-full py-4 rounded-lg bg-gradient-to-r from-primary-600 via-orange-500 to-amber-500 text-white font-bold text-xs sm:text-sm hover:opacity-95 transition-opacity shadow-lg shadow-primary-950/50 flex items-center justify-center gap-2"
                >
                  <Icon name="warehouse" size={16} />
                  Add Complete Package to Cart
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/power/installation"
                    className="py-2.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-300 text-center text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Icon name="hard-hat" size={14} />
                    Book Site Audit
                  </Link>

                  <Link
                    href="/quote"
                    className="py-2.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-300 text-center text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Icon name="file-text" size={14} />
                    Get B2B Quote
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
