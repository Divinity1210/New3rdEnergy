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
    { id: '5', name: 'Wi-Fi Router & CCTV Hub', watts: 65, quantity: 1, hours: 24, surgeMultiplier: 1.2 },
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
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen pt-32 pb-24 lg:pt-40">
      <div className="container-wide max-w-6xl">
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-sm">
            <Icon name="calculator" size={14} className="text-emerald-600" />
            3RD ENERGY SERVICES LTD · ENERGY SIZING AUDIT
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-950 tracking-tight">
            Power & Appliance <span className="text-emerald-700">Load Calculator.</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Audit your appliances, edit exact wattages and runtime hours, and see your real-time kilowatt-hour demand and battery storage sizing.
          </p>
        </div>

        {/* Top Aggregation Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">Total Running Load</span>
            <span className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-950 mt-1 block">
              {totalRunningWatts.toLocaleString()} <span className="text-sm font-normal text-slate-500">Watts</span>
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">Continuous load demand</span>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">Peak Inrush Surge</span>
            <span className="text-2xl sm:text-3xl font-heading font-extrabold text-amber-600 mt-1 block">
              {totalSurgeWatts.toLocaleString()} <span className="text-sm font-normal text-slate-500">Watts</span>
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">Compressor & motor startup</span>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">Daily Energy Demand</span>
            <span className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-950 mt-1 block">
              {totalDailyKwh.toFixed(2)} <span className="text-sm font-normal text-slate-500">kWh / Day</span>
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">24-hour cycle consumption</span>
          </div>

          <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 shadow-sm">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">Recommended System</span>
            <span className="text-xl sm:text-2xl font-heading font-extrabold text-emerald-900 mt-1 block">
              {minInverterKva >= 3.5 ? `${Math.ceil(minInverterKva)}kVA` : '3.5kVA'} · {minBatteryKwh > 5.12 ? `${Math.ceil(minBatteryKwh)}kWh` : '5.12kWh'}
            </span>
            <span className="text-[11px] text-emerald-700 block mt-1 font-medium">LiFePO4 Lithium & Pure Sine</span>
          </div>
        </div>

        {/* Editable Table Card */}
        <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="font-heading font-bold text-lg text-slate-950">Appliance Load Audit Matrix</h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 mr-1 uppercase">Quick Add:</span>
              {defaultAppliances.slice(0, 4).map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => addPreset(preset.id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-xs font-bold text-slate-700 border border-slate-200 transition-colors cursor-pointer"
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
                <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                  <th className="py-4 px-6">Appliance</th>
                  <th className="py-4 px-4 text-center">Watts (Each)</th>
                  <th className="py-4 px-4 text-center">Qty</th>
                  <th className="py-4 px-4 text-center">Subtotal</th>
                  <th className="py-4 px-4 text-center">Daily Hours</th>
                  <th className="py-4 px-4 text-right">Daily kWh</th>
                  <th className="py-4 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No appliances added yet. Add an appliance below to start your calculation.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => {
                    const rowSubtotalWatts = row.watts * row.quantity;
                    const rowDailyKwh = (rowSubtotalWatts * row.hours) / 1000;

                    return (
                      <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-6 font-bold text-slate-900">
                          <input
                            type="text"
                            value={row.name}
                            onChange={(e) => {
                              const newName = e.target.value;
                              setRows((prev) =>
                                prev.map((r) => (r.id === row.id ? { ...r, name: newName } : r))
                              );
                            }}
                            className="bg-transparent border-b border-transparent hover:border-slate-300 focus:border-emerald-500 focus:outline-none text-slate-900 font-bold w-full"
                          />
                        </td>
                        <td className="py-4 px-4 text-center">
                          <input
                            type="number"
                            min={1}
                            value={row.watts}
                            onChange={(e) => updateRow(row.id, 'watts', Number(e.target.value))}
                            className="w-20 text-center px-2 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-900 font-mono text-xs focus:border-emerald-500 focus:outline-none"
                          />
                        </td>
                        <td className="py-4 px-4 text-center">
                          <input
                            type="number"
                            min={1}
                            value={row.quantity}
                            onChange={(e) => updateRow(row.id, 'quantity', Number(e.target.value))}
                            className="w-14 text-center px-2 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-900 font-mono text-xs focus:border-emerald-500 focus:outline-none"
                          />
                        </td>
                        <td className="py-4 px-4 text-center font-bold text-slate-900 font-mono">
                          {rowSubtotalWatts} W
                        </td>
                        <td className="py-4 px-4 text-center">
                          <input
                            type="number"
                            min={1}
                            max={24}
                            value={row.hours}
                            onChange={(e) => updateRow(row.id, 'hours', Number(e.target.value))}
                            className="w-14 text-center px-2 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-900 font-mono text-xs focus:border-emerald-500 focus:outline-none"
                          />
                        </td>
                        <td className="py-4 px-4 text-right font-bold text-emerald-700 font-mono">
                          {rowDailyKwh.toFixed(2)}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => removeRow(row.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors p-1"
                            title="Remove appliance"
                          >
                            <Icon name="x" size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Add Appliance Footer Bar */}
          <div className="p-6 bg-slate-50/80 border-t border-slate-100 grid sm:grid-cols-5 gap-3 items-center">
            <input
              type="text"
              placeholder="Custom appliance name..."
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="sm:col-span-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:border-emerald-500 focus:outline-none"
            />
            <input
              type="number"
              placeholder="Watts (e.g. 250)"
              value={customWatts}
              onChange={(e) => setCustomWatts(Number(e.target.value))}
              className="px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-mono focus:border-emerald-500 focus:outline-none"
            />
            <input
              type="number"
              placeholder="Daily Hours (1-24)"
              value={customHours}
              onChange={(e) => setCustomHours(Number(e.target.value))}
              className="px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-mono focus:border-emerald-500 focus:outline-none"
            />
            <button
              onClick={addCustomAppliance}
              className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Icon name="plus" size={14} />
              Add Item
            </button>
          </div>
        </div>

        {/* Bottom CTA Block */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-heading font-extrabold text-slate-950">
              Ready to build this configured system?
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-lg">
              Take these exact wattage and kWh calculations straight into our interactive 3D System Builder to configure your battery bank and solar panels.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/power/builder"
              className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/20"
            >
              Launch System Builder →
            </Link>
            <Link
              href="/power/products"
              className="px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
            >
              Shop Inverters
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
