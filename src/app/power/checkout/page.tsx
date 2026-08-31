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
    <div className="bg-neutral-50 text-neutral-900 min-h-screen pt-32 pb-24 lg:pt-40">
      <div className="container-wide max-w-5xl">
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-solar-500/10 border border-solar-500/20 text-solar-400 text-xs font-semibold">
            <Icon name="warehouse" size={14} />
            Secure Order Checkout
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-neutral-900">
            Complete Your <span className="text-solar-400">Power Order.</span>
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="p-12 rounded-lg bg-white border border-neutral-200 text-center space-y-4 max-w-md mx-auto">
            <Icon name="warehouse" size={40} className="mx-auto text-neutral-500" />
            <h3 className="font-bold text-white text-lg">Your cart is currently empty</h3>
            <p className="text-xs text-neutral-400">
              Explore our power equipment catalogue to select products or turnkey packages.
            </p>
            <Link
              href="/power/products"
              className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-primary-600 to-amber-500 text-white font-bold text-xs"
            >
              Browse Equipment Catalogue
            </Link>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Customer & Delivery Details (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {error && (
                <div className="p-4 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center justify-between">
                  <span>{error}</span>
                  <button type="button" onClick={() => setError(null)} className="text-red-400 p-1">
                    <Icon name="x" size={14} />
                  </button>
                </div>
              )}

              {/* 1. Contact Information */}
              <div className="p-6 rounded-lg bg-white border border-neutral-200 space-y-4">
                <h2 className="font-heading font-bold text-base text-white border-b border-neutral-200 pb-3 flex items-center gap-2">
                  <Icon name="target" size={16} className="text-solar-400" />
                  1. Customer Contact Details
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1.5">First Name *</label>
                    <input
                      type="text"
                      required
                      value={customer.firstName}
                      onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-white text-xs focus:border-solar-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1.5">Last Name</label>
                    <input
                      type="text"
                      value={customer.lastName}
                      onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-white text-xs focus:border-solar-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-white text-xs focus:border-solar-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1.5">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-white text-xs focus:border-solar-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Fulfillment Method */}
              <div className="p-6 rounded-lg bg-white border border-neutral-200 space-y-4">
                <h2 className="font-heading font-bold text-base text-white border-b border-neutral-200 pb-3 flex items-center gap-2">
                  <Icon name="warehouse" size={16} className="text-solar-400" />
                  2. Delivery & Fulfillment
                </h2>

                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setFulfillmentType('delivery')}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      fulfillmentType === 'delivery'
                        ? 'bg-solar-500/15 border-solar-500/60 text-white'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-400'
                    }`}
                  >
                    <span className="font-bold text-xs block">Site Delivery</span>
                    <span className="text-[11px] text-solar-400 block mt-0.5">+₦35,000 Flat rate</span>
                  </div>

                  <div
                    onClick={() => setFulfillmentType('collection')}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      fulfillmentType === 'collection'
                        ? 'bg-solar-500/15 border-solar-500/60 text-white'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-400'
                    }`}
                  >
                    <span className="font-bold text-xs block">Depot Collection</span>
                    <span className="text-[11px] text-green-400 block mt-0.5">Free Pickup</span>
                  </div>
                </div>

                {fulfillmentType === 'delivery' ? (
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="text-xs font-semibold text-neutral-300 block mb-1.5">Delivery Address *</label>
                      <input
                        type="text"
                        required
                        value={deliveryAddress.address}
                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, address: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-white text-xs focus:border-solar-400 focus:outline-none"
                        placeholder="Street address / landmark"
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-neutral-300 block mb-1.5">City *</label>
                        <input
                          type="text"
                          required
                          value={deliveryAddress.city}
                          onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-white text-xs focus:border-solar-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-neutral-300 block mb-1.5">State *</label>
                        <select
                          value={deliveryAddress.state}
                          onChange={(e) => setDeliveryAddress({ ...deliveryAddress, state: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-white text-xs focus:border-solar-400 focus:outline-none"
                        >
                          <option value="Lagos">Lagos</option>
                          <option value="Abuja (FCT)">Abuja (FCT)</option>
                          <option value="Rivers (Port Harcourt)">Rivers (Port Harcourt)</option>
                          <option value="Ogun">Ogun</option>
                          <option value="Oyo">Oyo</option>
                          <option value="Delta">Delta</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-semibold text-neutral-300 block">Select Collection Depot</label>
                    <select
                      value={depotLocation}
                      onChange={(e) => setDepotLocation(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-white text-xs focus:border-solar-400 focus:outline-none"
                    >
                      <option value="Lagos Central Hub (Ikeja, Lagos)">Lagos Central Logistics Hub (Ikeja)</option>
                      <option value="Port Harcourt Industrial Depot (Trans-Amadi, Rivers)">Port Harcourt Industrial Depot (Trans-Amadi)</option>
                      <option value="Abuja Commercial Depot (Idu Industrial Layout, FCT)">Abuja Commercial Depot (Idu Industrial Layout)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* 3. Payment Method (Sandbox Notice) */}
              <div className="p-6 rounded-lg bg-white border border-neutral-200 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                  <h2 className="font-heading font-bold text-base text-white flex items-center gap-2">
                    <Icon name="shield" size={16} className="text-solar-400" />
                    3. Payment Channel
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-solar-500/10 border border-solar-500/30 text-[10px] font-bold text-solar-400">
                    Phase 2 Sandbox
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'bank_transfer', label: 'Direct Bank Wire' },
                    { id: 'card', label: 'Debit / Credit Card' },
                    { id: 'invoice', label: 'B2B Proforma Invoice' },
                  ].map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id as 'bank_transfer' | 'card' | 'invoice')}
                      className={`p-3.5 rounded-xl border text-center cursor-pointer transition-all ${
                        paymentMethod === m.id
                          ? 'bg-solar-500/15 border-solar-500/60 text-white font-bold'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-400'
                      }`}
                    >
                      <span className="text-xs block">{m.label}</span>
                    </div>
                  ))}
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-50 border border-white/5 text-[11px] text-neutral-400 leading-relaxed">
                  🔒 <strong>Phase 2 Environment:</strong> Production payment gateway credentials will be activated upon launch. Placing an order will generate a confirmed structured order reservation and invoice reference.
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Place Order (5 cols) */}
            <div className="lg:col-span-5 sticky top-28 space-y-6">
              <div className="p-7 rounded-lg bg-white border border-neutral-300 backdrop-blur-md shadow-xl space-y-6">
                <h3 className="font-heading font-bold text-lg text-white border-b border-neutral-200 pb-3">
                  Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
                </h3>

                {/* Items Mini List */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start gap-2 text-xs py-1.5 border-b border-white/5">
                      <div>
                        <span className="font-medium text-white block">{item.product.name}</span>
                        <span className="text-neutral-400 text-[11px]">Qty: {item.quantity} × {formatCurrency(item.unitPrice)}</span>
                      </div>
                      <span className="font-semibold text-white whitespace-nowrap">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Costs Breakdown */}
                <div className="space-y-2 text-xs border-t border-neutral-200 pt-3">
                  <div className="flex justify-between text-neutral-400">
                    <span>Equipment Subtotal</span>
                    <span className="text-white font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  {installationFeeEstimate > 0 && (
                    <div className="flex justify-between text-solar-400">
                      <span>Turnkey Installation</span>
                      <span className="font-semibold">+{formatCurrency(installationFeeEstimate)}</span>
                    </div>
                  )}
                  {fulfillmentType === 'delivery' && (
                    <div className="flex justify-between text-neutral-400">
                      <span>Site Delivery Logistics</span>
                      <span className="text-white font-medium">+{formatCurrency(shippingFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-neutral-200">
                    <span>Total Amount</span>
                    <span className="text-solar-400 text-xl">{formatCurrency(grandTotal)}</span>
                  </div>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-lg bg-gradient-to-r from-primary-600 via-orange-500 to-amber-500 text-white font-bold text-xs sm:text-sm hover:opacity-95 transition-opacity shadow-lg shadow-primary-950/50 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Confirming Order...
                    </>
                  ) : (
                    <>
                      <Icon name="check-circle" size={16} />
                      Confirm & Place Order
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
