'use client';

import React, { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { useCart } from '@/components/power/CartContext';
import { PowerProduct } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

export function AddToCartButton({ product }: { product: PowerProduct }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState<number>(1);

  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-2">
      <div className="inline-flex items-center justify-between border border-white/15 rounded-2xl bg-black/40 px-4 py-2 sm:w-36">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="text-neutral-400 hover:text-white text-lg font-bold"
        >
          -
        </button>
        <span className="text-sm font-bold text-white">{quantity}</span>
        <button
          type="button"
          onClick={() => setQuantity((q) => q + 1)}
          className="text-amber-400 hover:text-amber-300 text-lg font-bold"
        >
          +
        </button>
      </div>

      <button
        type="button"
        onClick={() => addItem(product, quantity)}
        className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-primary-600 via-orange-500 to-amber-500 text-white font-bold text-xs sm:text-sm hover:opacity-95 transition-opacity shadow-lg shadow-primary-950/50 flex items-center justify-center gap-2"
      >
        <Icon name="warehouse" size={16} />
        Add {quantity} to Cart ({formatCurrency(product.price * quantity)})
      </button>
    </div>
  );
}
