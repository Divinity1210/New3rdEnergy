'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { useCart } from '@/components/power/CartContext';
import { formatCurrency } from '@/lib/utils';
import { FulfillmentType } from '@/lib/types';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    subtotal,
    installationRequested,
    installationFeeEstimate,
    total,
    clearCart,
  } = useCart();

  const [customer, setCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organisation: '',
  });

  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState({
    address: '',
    city: '',
    state: 'Lagos',
    country: 'Nigeria',
    accessNotes: '',
  });

  const [depotLocation, setDepotLocation] = useState<string>('Lagos Central Logistics Hub, Ikeja');
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'card' | 'invoice'>('bank_transfer');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const shippingFee = fulfillmentType === 'delivery' ? 35000 : 0;
  const grandTotal = total + shippingFee;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setError('Your cart is empty. Please add products before checking out.');
      return;
    }

    if (!customer.firstName || !customer.email || !customer.phone) {
      setError('Please fill in your name, email, and phone number.');
      return;
    }

    if (fulfillmentType === 'delivery' && (!deliveryAddress.address || !deliveryAddress.city)) {
      setError('Please provide a complete site delivery address.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer,
          items,
          fulfillmentType,
          deliveryAddress: fulfillmentType === 'delivery' ? deliveryAddress : undefined,
          depotLocation: fulfillmentType === 'collection' ? depotLocation : undefined,
          installationRequested,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to process order.');
      }

      clearCart();
      router.push(`/power/orders/${data.order.orderNumber}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during order submission.');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen pt-32 pb-24 lg:pt-40">
      <div className="container-wide max-w-5xl">
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-sm">
            <Icon name="shield" size={14} className="text-emerald-600" />
            3RD ENERGY SERVICES LTD · SECURE CHECKOUT
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-950 tracking-tight">
            Complete Your <span className="text-emerald-700">Solar & Power Order.</span>
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-4 max-w-md mx-auto shadow-sm">
            <Icon name="shopping-cart" size={40} className="mx-auto text-slate-400" />
            <h3 className="font-bold text-slate-900 text-lg">Your cart is currently empty</h3>
            <p className="text-xs text-slate-500">
              Explore our portable power banks, solar generators, and hybrid inverters to add items.
            </p>
            <Link
              href="/power/products"
              className="inline-block px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-md shadow-emerald-600/20"
            >
              Browse Equipment Catalogue
            </Link>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Customer & Delivery Details (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {error && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
                  <span>{error}</span>
                  <button type="button" onClick={() => setError(null)} className="text-red-400 p-1">
                    <Icon name="x" size={14} />
                  </button>
                </div>
              )}

              {/* 1. Contact Information */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <h2 className="font-heading font-bold text-base text-slate-950 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Icon name="user" size={16} className="text-emerald-600" />
                  1. Customer Contact Details
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">First Name *</label>
                    <input
                      type="text"
                      required
                      value={customer.firstName}
                      onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">Last Name</label>
                    <input
                      type="text"
                      value={customer.lastName}
                      onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">Phone Number (WhatsApp) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+234..."
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">Company / Organization (Optional)</label>
                  <input
                    type="text"
                    value={customer.organisation}
                    onChange={(e) => setCustomer({ ...customer, organisation: e.target.value })}
                    placeholder="e.g. Acme Logistics Ltd"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* 2. Fulfillment Method */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <h2 className="font-heading font-bold text-base text-slate-950 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Icon name="truck" size={16} className="text-emerald-600" />
                  2. Delivery & Fulfillment
                </h2>

                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setFulfillmentType('delivery')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      fulfillmentType === 'delivery'
                        ? 'bg-emerald-50/80 border-emerald-500 shadow-sm'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                      <Icon name="truck" size={14} className="text-emerald-600" />
                      Site Delivery
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Direct to your premises</p>
                  </div>

                  <div
                    onClick={() => setFulfillmentType('collection')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      fulfillmentType === 'collection'
                        ? 'bg-emerald-50/80 border-emerald-500 shadow-sm'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                      <Icon name="warehouse" size={14} className="text-emerald-600" />
                      Depot Collection
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Free pick-up at hub</p>
                  </div>
                </div>

                {fulfillmentType === 'delivery' ? (
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1.5">Delivery Address *</label>
                      <input
                        type="text"
                        required
                        placeholder="Street address / Estate / Facility"
                        value={deliveryAddress.address}
                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, address: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1.5">City *</label>
                        <input
                          type="text"
                          required
                          value={deliveryAddress.city}
                          onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1.5">State *</label>
                        <select
                          value={deliveryAddress.state}
                          onChange={(e) => setDeliveryAddress({ ...deliveryAddress, state: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
                        >
                          {['Lagos', 'Abuja (FCT)', 'Rivers (Port Harcourt)', 'Ogun', 'Oyo (Ibadan)', 'Delta', 'Kano', 'Enugu', 'Edo', 'Other State'].map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2">
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">Select Collection Depot Hub</label>
                    <select
                      value={depotLocation}
                      onChange={(e) => setDepotLocation(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
                    >
                      <option value="Lagos Central Hub, Ikeja Industrial Estate">Lagos Central Hub — Ikeja Industrial Estate</option>
                      <option value="Lagos Island Hub, Lekki Phase 1">Lagos Island Hub — Lekki Phase 1</option>
                      <option value="Abuja Operations Centre, Garki Area 11">Abuja Operations Centre — Garki Area 11</option>
                      <option value="Port Harcourt Logistics Depot, Trans-Amadi">Port Harcourt Logistics Depot — Trans-Amadi</option>
                    </select>
                  </div>
                )}
              </div>

              {/* 3. Payment Method */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <h2 className="font-heading font-bold text-base text-slate-950 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Icon name="credit-card" size={16} className="text-emerald-600" />
                  3. Settlement Method
                </h2>

                <div className="space-y-2">
                  {[
                    { id: 'bank_transfer', label: 'Corporate Bank Wire / Instant Transfer', desc: 'Direct transfer to 3RD Energy Services Ltd corporate account with instant confirmation.' },
                    { id: 'invoice', label: 'Official Proforma Invoice for Corporate Procurement', desc: 'Generate a signed proforma invoice with PO reference for company finance approval.' },
                  ].map((pm) => (
                    <label
                      key={pm.id}
                      className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        paymentMethod === pm.id
                          ? 'bg-emerald-50/80 border-emerald-500 shadow-sm'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === pm.id}
                        onChange={() => setPaymentMethod(pm.id as any)}
                        className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{pm.label}</span>
                        <span className="text-[11px] text-slate-500 block mt-0.5">{pm.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Review (5 cols) */}
            <div className="lg:col-span-5 space-y-6 sticky top-28">
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-lg space-y-6">
                <h2 className="font-heading font-bold text-base text-slate-950 border-b border-slate-100 pb-3">
                  Order Summary ({items.length} {items.length === 1 ? 'Item' : 'Items'})
                </h2>

                <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs pb-3 border-b border-slate-100">
                      <div className="min-w-0 pr-2">
                        <p className="font-bold text-slate-900 truncate">{item.name}</p>
                        <p className="text-[11px] text-slate-500">Qty: {item.quantity} × {formatCurrency(item.unitPrice)}</p>
                      </div>
                      <span className="font-bold text-slate-950 shrink-0 font-mono">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Subtotal & Totals */}
                <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
                  <div className="flex justify-between text-slate-600">
                    <span>Equipment Subtotal:</span>
                    <span className="font-semibold text-slate-900 font-mono">{formatCurrency(subtotal)}</span>
                  </div>
                  {installationRequested && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Turnkey Installation:</span>
                      <span className="font-semibold font-mono">{formatCurrency(installationFeeEstimate)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Logistics / Dispatch:</span>
                    <span className="font-semibold text-slate-900 font-mono">
                      {fulfillmentType === 'delivery' ? formatCurrency(shippingFee) : 'FREE (Depot)'}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-heading font-extrabold text-slate-950 pt-3 border-t border-slate-200">
                    <span>Grand Total:</span>
                    <span className="text-emerald-700 font-mono">{formatCurrency(grandTotal)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <Icon name="loader" size={16} className="animate-spin" />
                      Processing Secure Order...
                    </>
                  ) : (
                    <>
                      <Icon name="check" size={16} />
                      Confirm & Place Order ({formatCurrency(grandTotal)})
                    </>
                  )}
                </button>

                <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                  🔒 Secured by 3RD Energy Services Ltd. Instant email receipt and dispatch tracking generated upon order submission.
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
