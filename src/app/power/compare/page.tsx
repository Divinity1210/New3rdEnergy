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
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen pt-32 pb-24 lg:pt-40">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center space-y-3 mb-12 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-sm">
            <Icon name="grid" size={14} className="text-emerald-600" />
            3RD ENERGY SERVICES LTD · SIDE-BY-SIDE MATRIX
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-950 tracking-tight">
            Compare <span className="text-emerald-700">Power Products.</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Compare continuous power output, surge handling, battery lifecycles, and warranty terms to select the ideal hardware.
          </p>
        </div>

        {/* Quick Add Product Bar */}
        <div className="mb-8 p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-slate-600 font-bold">Add Equipment to Compare:</span>
          <div className="flex flex-wrap gap-2">
            {powerProducts.map((prod) => (
              <button
                key={prod.id}
                onClick={() => addProductToCompare(prod.id)}
                disabled={selectedProductIds.includes(prod.id)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  selectedProductIds.includes(prod.id)
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 opacity-50 cursor-not-allowed'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                + {prod.name.split('/')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Comparison Matrix Table */}
        <div className="rounded-3xl bg-white border border-slate-200 shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="p-6 w-1/4 font-bold text-slate-500 uppercase tracking-wider text-[11px]">
                  Feature / Specification
                </th>
                {selectedProducts.map((p) => (
                  <th key={p.id} className="p-6 w-1/4 align-top">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 uppercase">
                          {p.category}
                        </span>
                        {selectedProducts.length > 1 && (
                          <button
                            onClick={() => removeProductFromCompare(p.id)}
                            className="text-slate-400 hover:text-red-500 p-1"
                            title="Remove"
                          >
                            <Icon name="x" size={14} />
                          </button>
                        )}
                      </div>
                      <h3 className="font-heading font-bold text-base text-slate-950 line-clamp-2">
                        {p.name}
                      </h3>
                      <div className="text-xl font-heading font-extrabold text-slate-950 font-mono">
                        {formatCurrency(p.price)}
                      </div>
                      <button
                        onClick={() => addItem(p, 1)}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Icon name="shopping-cart" size={13} />
                        Add to Cart
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr className="hover:bg-slate-50/70">
                <td className="p-4 px-6 font-bold text-slate-900 bg-slate-50/50">Power Rating</td>
                {selectedProducts.map((p) => (
                  <td key={p.id} className="p-4 font-mono font-bold text-slate-900">
                    {p.specs.continuousPower || '—'}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50/70">
                <td className="p-4 px-6 font-bold text-slate-900 bg-slate-50/50">Surge Capacity</td>
                {selectedProducts.map((p) => (
                  <td key={p.id} className="p-4 font-mono text-slate-700">
                    {p.specs.surgePower || '—'}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50/70">
                <td className="p-4 px-6 font-bold text-slate-900 bg-slate-50/50">Capacity / Storage</td>
                {selectedProducts.map((p) => (
                  <td key={p.id} className="p-4 font-mono font-bold text-emerald-700">
                    {p.specs.capacity || '—'}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50/70">
                <td className="p-4 px-6 font-bold text-slate-900 bg-slate-50/50">Voltage Profile</td>
                {selectedProducts.map((p) => (
                  <td key={p.id} className="p-4 font-mono text-slate-700">
                    {p.specs.voltage || '—'}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50/70">
                <td className="p-4 px-6 font-bold text-slate-900 bg-slate-50/50">Warranty</td>
                {selectedProducts.map((p) => (
                  <td key={p.id} className="p-4 font-bold text-emerald-700">
                    {p.specs.warranty || '2 Years'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
