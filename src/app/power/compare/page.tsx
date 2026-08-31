'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@/components/ui/Icon';
import { powerProducts } from '@/lib/data/power-products';
import { useCart } from '@/components/power/CartContext';
import { formatCurrency } from '@/lib/utils';
import { PowerProduct } from '@/lib/types';

export default function ComparePowerProductsPage() {
  const { addItem } = useCart();
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([
    'inv-3.5kva-24v',
    'inv-5kva-48v',
    'inv-10kva-48v-3p',
  ]);

  const selectedProducts: PowerProduct[] = selectedProductIds
    .map((id) => powerProducts.find((p) => p.id === id))
    .filter((p): p is PowerProduct => p !== undefined);

  const addProductToCompare = (id: string) => {
    if (selectedProductIds.includes(id)) return;
    if (selectedProductIds.length >= 4) {
      setSelectedProductIds([...selectedProductIds.slice(1), id]);
    } else {
      setSelectedProductIds([...selectedProductIds, id]);
    }
  };

  const removeProductFromCompare = (id: string) => {
    setSelectedProductIds(selectedProductIds.filter((pid) => pid !== id));
  };

  return (
    <div className="bg-neutral-950 text-white min-h-screen pt-32 pb-24 lg:pt-40">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center space-y-3 mb-12 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-solar-500/10 border border-solar-500/20 text-solar-400 text-xs font-semibold">
            <Icon name="grid" size={14} />
            Side-by-Side Evaluation
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-white">
            Compare <span className="text-solar-400">Power Products.</span>
          </h1>
          <p className="text-sm text-neutral-400">
            Compare continuous power output, surge handling, battery lifecycles, and warranty terms to select the ideal equipment for your facility.
          </p>
        </div>

        {/* Quick Add Product Bar */}
        <div className="mb-8 p-4 rounded-lg bg-neutral-900 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-neutral-400">Add Equipment to Compare:</span>
          <div className="flex flex-wrap gap-2">
            {powerProducts.map((prod) => (
              <button
                key={prod.id}
                onClick={() => addProductToCompare(prod.id)}
                disabled={selectedProductIds.includes(prod.id)}
                className={`px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                  selectedProductIds.includes(prod.id)
                    ? 'bg-white/5 border-white/5 text-neutral-600 cursor-not-allowed'
                    : 'bg-white/5 border-white/10 text-neutral-300 hover:text-white hover:border-solar-500/40'
                }`}
              >
                + {prod.name.split(' ')[2] || prod.name.split(' ')[0]} ({prod.category})
              </button>
            ))}
          </div>
        </div>

        {/* Comparison Matrix Table */}
        {selectedProducts.length === 0 ? (
          <div className="text-center py-16 bg-white/[0.02] rounded-lg border border-white/10">
            <h3 className="font-bold text-white text-base">No products selected for comparison</h3>
            <p className="text-xs text-neutral-400 mt-1">Select products from the quick bar above.</p>
          </div>
        ) : (
          <div className="rounded-lg bg-neutral-900/80 border border-white/10 overflow-hidden shadow-xl backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-6 px-6 w-56 text-neutral-400 font-bold uppercase text-[11px] tracking-wider bg-white/[0.01]">
                      Product Overview
                    </th>
                    {selectedProducts.map((p) => (
                      <th key={p.id} className="py-6 px-6 min-w-[240px] max-w-[280px] align-top">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <span className="text-[10px] font-bold text-solar-400 uppercase">
                              {p.category}
                            </span>
                            <button
                              onClick={() => removeProductFromCompare(p.id)}
                              className="text-neutral-500 hover:text-red-400 p-1"
                              aria-label={`Remove ${p.name}`}
                            >
                              <Icon name="x" size={14} />
                            </button>
                          </div>

                          <div className="h-28 relative rounded-xl overflow-hidden bg-neutral-800">
                            <Image src={p.image} alt={p.name} fill className="object-cover" sizes="240px" />
                          </div>

                          <h3 className="font-heading font-bold text-sm text-white line-clamp-2 leading-snug">
                            {p.name}
                          </h3>

                          <div className="text-lg font-extrabold text-solar-400">
                            {formatCurrency(p.price)}
                          </div>

                          <button
                            onClick={() => addItem(p)}
                            className="w-full py-2 rounded-xl bg-gradient-to-r from-primary-600 to-amber-500 text-white font-bold text-xs hover:opacity-95 transition-opacity flex items-center justify-center gap-1"
                          >
                            <Icon name="warehouse" size={12} />
                            Add to Cart
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5 text-xs">
                  {/* Rating / Continuous Power */}
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-4 px-6 font-bold text-neutral-400 bg-white/[0.01]">
                      Continuous Output / Capacity
                    </td>
                    {selectedProducts.map((p) => (
                      <td key={p.id} className="py-4 px-6 font-semibold text-white">
                        {p.specs.continuousPower || p.specs.capacity || 'N/A'}
                      </td>
                    ))}
                  </tr>

                  {/* Surge Capacity */}
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-4 px-6 font-bold text-neutral-400 bg-white/[0.01]">
                      Surge Capacity
                    </td>
                    {selectedProducts.map((p) => (
                      <td key={p.id} className="py-4 px-6 text-neutral-300">
                        {p.specs.surgePower || 'N/A'}
                      </td>
                    ))}
                  </tr>

                  {/* Voltage / Battery Chemistry */}
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-4 px-6 font-bold text-neutral-400 bg-white/[0.01]">
                      Voltage & Chemistry
                    </td>
                    {selectedProducts.map((p) => (
                      <td key={p.id} className="py-4 px-6 text-solar-400 font-medium">
                        {p.specs.voltage || p.specs.batteryChemistry || 'N/A'}
                      </td>
                    ))}
                  </tr>

                  {/* Efficiency / Solar Input */}
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-4 px-6 font-bold text-neutral-400 bg-white/[0.01]">
                      Efficiency / Solar PV Input
                    </td>
                    {selectedProducts.map((p) => (
                      <td key={p.id} className="py-4 px-6 text-neutral-300">
                        {p.specs.efficiency ? `Efficiency: ${p.specs.efficiency}` : ''}
                        {p.specs.maxSolarInput ? ` (PV: ${p.specs.maxSolarInput})` : ''}
                      </td>
                    ))}
                  </tr>

                  {/* Cycles & Lifespan */}
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-4 px-6 font-bold text-neutral-400 bg-white/[0.01]">
                      Cycle Lifespan
                    </td>
                    {selectedProducts.map((p) => (
                      <td key={p.id} className="py-4 px-6 text-neutral-300">
                        {p.specs.cycles || 'Solid-state electronics (10+ yrs design)'}
                      </td>
                    ))}
                  </tr>

                  {/* Warranty */}
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-4 px-6 font-bold text-neutral-400 bg-white/[0.01]">
                      Warranty Coverage
                    </td>
                    {selectedProducts.map((p) => (
                      <td key={p.id} className="py-4 px-6 text-green-400 font-medium">
                        {p.specs.warranty || '2 Years Warranty'}
                      </td>
                    ))}
                  </tr>

                  {/* Who It Is For */}
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-4 px-6 font-bold text-neutral-400 bg-white/[0.01]">
                      Target Application
                    </td>
                    {selectedProducts.map((p) => (
                      <td key={p.id} className="py-4 px-6 text-neutral-300 leading-relaxed">
                        {p.whoItIsFor}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
