'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { defaultAppliances } from '@/lib/data/power-appliances';
import { formatCurrency } from '@/lib/utils';

interface CalculatorRow {
  id: string;
  name: string;
  watts: number;
  quantity: number;
  hours: number;
  surgeMultiplier: number;
}

export default function PowerCalculatorPage() {
  const [rows, setRows] = useState<CalculatorRow[]>([
    { id: '1', name: 'Refrigerator (Inverter)', watts: 150, quantity: 1, hours: 24, surgeMultiplier: 3.5 },
    { id: '2', name: 'Smart TV & Decoder', watts: 100, quantity: 1, hours: 6, surgeMultiplier: 1.2 },
    { id: '3', name: 'LED Lighting Points', watts: 12, quantity: 10, hours: 8, surgeMultiplier: 1.1 },
    { id: '4', name: 'Ceiling / Standing Fans', watts: 65, quantity: 4, hours: 10, surgeMultiplier: 1.5 },
    { id: '5', name: 'Wi-Fi Router & CCTV', watts: 65, quantity: 1, hours: 24, surgeMultiplier: 1.2 },
    { id: '6', name: 'Workstation Laptops', watts: 65, quantity: 2, hours: 8, surgeMultiplier: 1.2 },
  ]);

  const [customName, setCustomName] = useState('');
  const [customWatts, setCustomWatts] = useState(250);
  const [customHours, setCustomHours] = useState(4);
  const [customQty, setCustomQty] = useState(1);

  // Row update handlers
  const updateRow = (id: string, field: keyof CalculatorRow, value: number) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: Math.max(0, value) } : row))
    );
  };

  const removeRow = (id: string) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  const addCustomAppliance = () => {
    if (!customName.trim()) return;
    const newRow: CalculatorRow = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      watts: customWatts,
      quantity: customQty,
      hours: customHours,
      surgeMultiplier: 2.0,
    };
    setRows((prev) => [...prev, newRow]);
    setCustomName('');
  };

  const addPreset = (applianceId: string) => {
    const found = defaultAppliances.find((a) => a.id === applianceId);
    if (!found) return;
    const newRow: CalculatorRow = {
      id: `preset-${Date.now()}`,
      name: found.name,
      watts: found.defaultWatts,
      quantity: 1,
      hours: found.typicalHours,
      surgeMultiplier: found.surgeMultiplier,
    };
    setRows((prev) => [...prev, newRow]);
  };

  // Calculations
  const totalRunningWatts = rows.reduce((sum, row) => sum + row.watts * row.quantity, 0);

  const maxSurgeWatts = rows.reduce(
    (max, row) => Math.max(max, row.watts * row.surgeMultiplier * row.quantity - row.watts * row.quantity),
    0
  );
  const totalSurgeWatts = totalRunningWatts + maxSurgeWatts;

  const totalDailyKwh = rows.reduce(
    (sum, row) => sum + (row.watts * row.quantity * row.hours) / 1000,
    0
  );

  // Recommended battery at 85% DOD with 15% safety factor
  const minBatteryKwh = (totalDailyKwh * 1.15) / 0.85;

  // Inverter sizing with 25% safety margin
  const minInverterKva = Number(((totalRunningWatts * 1.25) / 800).toFixed(1)); // 0.8 power factor

  return (
    <div className="bg-neutral-950 text-white min-h-screen pt-32 pb-24 lg:pt-40">
      <div className="container-wide max-w-6xl">
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-solar-500/10 border border-solar-500/20 text-solar-400 text-xs font-semibold">
            <Icon name="chart" size={14} />
            Transparent Energy Audit
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-white">
            Power & Energy <span className="text-solar-400">Load Calculator.</span>
          </h1>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto">
            Audit your appliances, edit exact wattages and runtime hours, and see your real-time kilowatt-hour demand and battery storage sizing.
          </p>
        </div>

        {/* Top Aggregation Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-6 rounded-lg bg-neutral-900 border border-white/10 shadow-xl">
            <span className="text-xs text-neutral-400 block">Total Running Load</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-white mt-1 block">
              {totalRunningWatts.toLocaleString()} <span className="text-sm font-normal text-neutral-400">Watts</span>
            </span>
            <span className="text-[11px] text-neutral-500 block mt-1">Continuous load demand</span>
          </div>

          <div className="p-6 rounded-lg bg-neutral-900 border border-white/10 shadow-xl">
            <span className="text-xs text-neutral-400 block">Peak Inrush Surge</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-solar-400 mt-1 block">
              {totalSurgeWatts.toLocaleString()} <span className="text-sm font-normal text-neutral-400">Watts</span>
            </span>
            <span className="text-[11px] text-neutral-500 block mt-1">Motor compressor startup</span>
          </div>

          <div className="p-6 rounded-lg bg-neutral-900 border border-white/10 shadow-xl">
            <span className="text-xs text-neutral-400 block">Daily Energy Demand</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-white mt-1 block">
              {totalDailyKwh.toFixed(2)} <span className="text-sm font-normal text-neutral-400">kWh / Day</span>
            </span>
            <span className="text-[11px] text-neutral-500 block mt-1">24-hour cycle consumption</span>
          </div>

          <div className="p-6 rounded-lg bg-neutral-900 border border-solar-500/30 bg-gradient-to-br from-amber-950/20 to-neutral-900 shadow-xl">
            <span className="text-xs text-solar-400 font-semibold block">Recommended Inverter & Storage</span>
            <span className="text-xl sm:text-2xl font-extrabold text-solar-400 mt-1 block">
              {minInverterKva >= 3.5 ? `${Math.ceil(minInverterKva)}kVA` : '3.5kVA'} · {minBatteryKwh > 5.12 ? `${Math.ceil(minBatteryKwh)}kWh` : '5.12kWh'}
            </span>
            <span className="text-[11px] text-amber-200/80 block mt-1">LiFePO4 battery & pure sine</span>
          </div>
        </div>

        {/* Editable Table Card */}
        <div className="rounded-lg bg-neutral-900/80 border border-white/10 backdrop-blur-md shadow-xl overflow-hidden mb-8">
          <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="font-heading font-bold text-lg text-white">Appliance Load Audit Matrix</h2>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-neutral-400 self-center mr-1">Quick Add:</span>
              {defaultAppliances.slice(0, 4).map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => addPreset(preset.id)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-neutral-300 border border-white/10 transition-colors"
                >
                  + {preset.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-neutral-400 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-4 px-6">Appliance</th>
                  <th className="py-4 px-4 text-center">Watts (Each)</th>
                  <th className="py-4 px-4 text-center">Qty</th>
                  <th className="py-4 px-4 text-center">Subtotal Watts</th>
                  <th className="py-4 px-4 text-center">Daily Hours</th>
                  <th className="py-4 px-4 text-right">Daily Energy (kWh)</th>
                  <th className="py-4 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-neutral-500">
                      No appliances added yet. Add an appliance below to start your calculation.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => {
                    const rowSubtotalWatts = row.watts * row.quantity;
                    const rowDailyKwh = (rowSubtotalWatts * row.hours) / 1000;

                    return (
                      <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-6 font-medium text-white">
                          <input
                            type="text"
                            value={row.name}
                            onChange={(e) => {
                              const newName = e.target.value;
                              setRows((prev) =>
                                prev.map((r) => (r.id === row.id ? { ...r, name: newName } : r))
                              );
                            }}
                            className="bg-transparent border-b border-transparent hover:border-white/20 focus:border-amber-400 focus:outline-none text-white font-medium w-full"
                          />
                        </td>

                        <td className="py-4 px-4 text-center">
                          <input
                            type="number"
                            min={1}
                            value={row.watts}
                            onChange={(e) => updateRow(row.id, 'watts', Number(e.target.value))}
                            className="w-20 px-2 py-1 rounded bg-black/40 border border-white/10 text-center text-white focus:border-amber-400 focus:outline-none"
                          />
                        </td>

                        <td className="py-4 px-4 text-center">
                          <div className="inline-flex items-center border border-white/15 rounded-lg bg-black/40">
                            <button
                              onClick={() => updateRow(row.id, 'quantity', row.quantity - 1)}
                              disabled={row.quantity <= 1}
                              className="px-2 py-0.5 text-neutral-400 hover:text-white disabled:opacity-30"
                            >
                              -
                            </button>
                            <span className="px-2 font-semibold text-white">{row.quantity}</span>
                            <button
                              onClick={() => updateRow(row.id, 'quantity', row.quantity + 1)}
                              className="px-2 py-0.5 text-solar-400 hover:text-solar-300"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-center font-semibold text-solar-400">
                          {rowSubtotalWatts.toLocaleString()} W
                        </td>

                        <td className="py-4 px-4 text-center">
                          <input
                            type="number"
                            min={1}
                            max={24}
                            value={row.hours}
                            onChange={(e) => updateRow(row.id, 'hours', Number(e.target.value))}
                            className="w-16 px-2 py-1 rounded bg-black/40 border border-white/10 text-center text-white focus:border-amber-400 focus:outline-none"
                          />
                        </td>

                        <td className="py-4 px-4 text-right font-bold text-white">
                          {rowDailyKwh.toFixed(2)} kWh
                        </td>

                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => removeRow(row.id)}
                            className="p-1 text-neutral-500 hover:text-red-400 transition-colors"
                            aria-label="Remove row"
                          >
                            <Icon name="x" size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Add Custom Appliance Form Bar */}
          <div className="p-6 bg-white/[0.02] border-t border-white/10">
            <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-3">
              Add Custom Equipment
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <input
                type="text"
                placeholder="Appliance name (e.g. Electric Kettle)"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="sm:col-span-2 px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-white text-xs placeholder:text-neutral-500 focus:border-amber-400 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Watts"
                value={customWatts}
                onChange={(e) => setCustomWatts(Number(e.target.value))}
                className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Hours/day"
                value={customHours}
                onChange={(e) => setCustomHours(Number(e.target.value))}
                className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
              <button
                onClick={addCustomAppliance}
                className="py-2.5 px-4 rounded-xl bg-solar-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs transition-colors"
              >
                + Add Item
              </button>
            </div>
          </div>
        </div>

        {/* Action Handoffs */}
        <div className="p-8 rounded-lg bg-gradient-to-r from-neutral-900 via-primary-950/40 to-neutral-900 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="font-heading font-bold text-xl text-white">
              Ready to Turn This Audit into a Configured System?
            </h3>
            <p className="text-xs text-neutral-400">
              Transfer your {totalRunningWatts.toLocaleString()}W running load directly to the AI System Builder or request certified on-site engineering.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/power/builder"
              className="px-6 py-3 rounded-md bg-solar-600 text-white font-bold text-xs hover:opacity-95 transition-opacity shadow-lg shadow-primary-950/50 flex items-center gap-2"
            >
              <Icon name="settings" size={16} />
              Open in System Builder
            </Link>

            <Link
              href="/power/installation"
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-xs transition-colors flex items-center gap-2"
            >
              <Icon name="hard-hat" size={16} />
              Request Site Audit
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
