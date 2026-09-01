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
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen pt-32 pb-24 lg:pt-40">
      <div className="container-wide max-w-6xl">
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-sm">
            <Icon name="settings" size={14} className="text-emerald-600" />
            3RD ENERGY SERVICES LTD · SYSTEM CONFIGURATOR
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-950 tracking-tight">
            Design & Customize <span className="text-emerald-700">My Power System.</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Live interactive configurator. Scale your battery modules, adjust solar panel capacity, and compare package tiers in real time.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Inverter Core Selector */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  Step 1 · Power Core
                </span>
                <span className="text-xs text-slate-500 font-medium">Inverter Inrush Capacity</span>
              </div>
              <h2 className="font-heading font-bold text-lg text-slate-950">
                Choose Inverter Capacity
              </h2>

              <div className="grid sm:grid-cols-3 gap-3">
                {inverters.map((inv) => (
                  <div
                    key={inv.id}
                    onClick={() => setSelectedInverterId(inv.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedInverterId === inv.id
                        ? 'bg-emerald-50/80 border-emerald-500 shadow-sm'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-900 block">
                      {inv.specs.continuousPower?.split('/')[0]}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-bold block mt-0.5 font-mono">
                      {formatCurrency(inv.price)}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-1 line-clamp-2">
                      {inv.specs.phase || 'Single Phase'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Battery Storage Scaling */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  Step 2 · Energy Storage
                </span>
                <span className="text-xs text-emerald-700 font-bold">{backupHoursTarget}h Est. Runtime</span>
              </div>
              <h2 className="font-heading font-bold text-lg text-slate-950">
                Lithium LiFePO4 Storage ({totalBatteryKwh} kWh)
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { kwh: 5.12, label: '5.12 kWh', desc: '1x Wall Unit' },
                  { kwh: 10.24, label: '10.24 kWh', desc: '2x Wall / Rack' },
                  { kwh: 15.36, label: '15.36 kWh', desc: '3x Wall Units' },
                  { kwh: 20.48, label: '20.48 kWh', desc: '4x Commercial Rack' },
                ].map((b) => (
                  <div
                    key={b.kwh}
                    onClick={() => setBatteryKwhTarget(b.kwh)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all text-center ${
                      batteryKwhTarget === b.kwh
                        ? 'bg-emerald-50/80 border-emerald-500 shadow-sm'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                    }`}
                  >
                    <span className="text-sm font-bold text-slate-900 block">{b.label}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{b.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Solar PV Array Configuration */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  Step 3 · Solar Generation
                </span>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={includeSolar}
                    onChange={(e) => setIncludeSolar(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  Enable Solar PV Array
                </label>
              </div>

              {includeSolar && (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Panel Quantity:</span>
                    <span className="font-bold text-slate-900 font-mono">
                      {solarPanelCount}x 550W Panels ({totalSolarKwp} kWp)
                    </span>
                  </div>

                  <input
                    type="range"
                    min={4}
                    max={16}
                    step={2}
                    value={solarPanelCount}
                    onChange={(e) => setSolarPanelCount(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />

                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>4 Panels (2.2kWp)</span>
                    <span>8 Panels (4.4kWp)</span>
                    <span>16 Panels (8.8kWp)</span>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Turnkey Installation Toggle */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                  Step 4 · Professional Engineering
                </span>
                <h3 className="font-heading font-bold text-sm text-slate-950 mt-1">
                  Include Turnkey Certified Rooftop Installation
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Includes DC breakers, surge arrestors, mounting brackets, and technician deployment.
                </p>
              </div>
              <input
                type="checkbox"
                checked={includeInstallation}
                onChange={(e) => setIncludeInstallation(e.target.checked)}
                className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Right Column: Live Bill of Materials & Checkout Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6 sticky top-28">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-lg space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  Configured Bill of Materials
                </span>
                <h3 className="font-heading font-extrabold text-xl text-slate-950 mt-2">
                  System Specification
                </h3>
              </div>

              {/* Items breakdown */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">Inverter:</span>
                  <span className="font-bold text-slate-900">{currentInverter.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">LiFePO4 Storage:</span>
                  <span className="font-bold text-slate-900 font-mono">{batteryUnitsCount}x 5.12kWh ({totalBatteryKwh}kWh)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">Solar PV Array:</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {includeSolar ? `${solarPanelCount}x 550W (${totalSolarKwp}kWp)` : 'None (Battery Backup)'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">Surge Protection & EMS:</span>
                  <span className="font-bold text-emerald-700">Included (Certified)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">Turnkey Installation:</span>
                  <span className="font-bold text-slate-900">
                    {includeInstallation ? formatCurrency(installationFee) : 'Self Installation'}
                  </span>
                </div>
              </div>

              {/* Price Calculation Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Estimated Total Investment</span>
                <div className="text-3xl font-heading font-extrabold text-slate-950 mt-0.5">
                  {formatCurrency(totalPrice)}
                </div>
                <span className="text-[11px] font-bold text-emerald-700 block mt-1">
                  ✓ Includes 3–5 Year OEM Warranty & Technical Support
                </span>
              </div>

              {/* Add to Cart & Checkout */}
              <button
                onClick={() => addPackage(customPackage)}
                className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Icon name="shopping-cart" size={16} />
                Add Custom System to Cart
              </button>

              <Link
                href="/power/checkout"
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
