'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LoadingState, EmptyState } from '@/components/admin/AdminComponents';
import { Icon } from '@/components/ui/Icon';
import { formatCurrency, getWhatsAppUrl } from '@/lib/utils';
import { PowerOrder } from '@/lib/types';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<PowerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<PowerOrder | null>(null);

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  async function loadOrders() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      if (search) params.set('search', search);

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        setTotalRevenue(data.totalRevenue || 0);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(orderId: string, newStatus: string) {
    setUpdatingId(orderId);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, orderStatus: newStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
        if (selectedOrder?.id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, orderStatus: newStatus } : null));
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingId(null);
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'DISPATCHED':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'PROCESSING':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900">
            Orders & Equipment Fulfillment
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time management of Solar & Petroleum equipment orders, logistics, and payments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-right">
            <span className="text-[10px] font-bold text-emerald-700 uppercase font-mono block">
              Total Order Volume
            </span>
            <span className="text-base font-bold text-emerald-950 font-mono">
              {formatCurrency(totalRevenue)}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Icon name="search" size={16} className="text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadOrders()}
            placeholder="Search by Order #, Customer, Phone, or Email..."
            className="w-full text-xs bg-transparent border-none focus:outline-none text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'PROCESSING', 'DISPATCHED', 'COMPLETED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table & Details Drawer */}
      {loading ? (
        <LoadingState message="Loading orders..." />
      ) : orders.length === 0 ? (
        <EmptyState
          icon="📦"
          title="No Orders Found"
          description="Customer orders from the store and checkout will appear here in real-time."
        />
      ) : (
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Orders List Table */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase font-mono">
                  <tr>
                    <th className="p-4">Order Ref</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Items</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((ord) => (
                    <tr
                      key={ord.id}
                      onClick={() => setSelectedOrder(ord)}
                      className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                        selectedOrder?.id === ord.id ? 'bg-emerald-50/50' : ''
                      }`}
                    >
                      <td className="p-4 font-mono font-bold text-slate-900">
                        {ord.orderNumber}
                        <span className="block text-[10px] font-normal text-slate-400">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900">
                          {ord.customer.firstName} {ord.customer.lastName}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">{ord.customer.phone}</div>
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-slate-800 line-clamp-1">
                          {ord.items[0]?.product?.name || 'Solar Hardware'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {ord.items.length} item(s) • {ord.fulfillmentType}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-950">
                        {formatCurrency(ord.total)}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono border ${getStatusBadge(
                            ord.orderStatus
                          )}`}
                        >
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(ord);
                          }}
                          className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Selected Order Detail Sidebar / Card */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            {selectedOrder ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase font-mono">
                      {selectedOrder.fulfillmentType}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 font-mono mt-1">
                      {selectedOrder.orderNumber}
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-slate-400 font-mono">
                    {new Date(selectedOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Customer Contact */}
                <div className="space-y-1 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Customer</span>
                  <div className="font-bold text-slate-900">
                    {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}
                  </div>
                  <div className="text-slate-600 font-mono">{selectedOrder.customer.email}</div>
                  <div className="text-slate-600 font-mono">{selectedOrder.customer.phone}</div>

                  <div className="pt-2 flex gap-2">
                    <a
                      href={getWhatsAppUrl(
                        `Hello ${selectedOrder.customer.firstName}, regarding your 3RD Energy Services Ltd Order #${selectedOrder.orderNumber}`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-[11px] flex items-center gap-1.5"
                    >
                      <Icon name="whatsapp" size={13} />
                      WhatsApp
                    </a>
                    <a
                      href={`mailto:${selectedOrder.customer.email}?subject=3RD Energy Order ${selectedOrder.orderNumber}`}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px]"
                    >
                      Email
                    </a>
                  </div>
                </div>

                {/* Delivery Location */}
                {selectedOrder.deliveryAddress && (
                  <div className="space-y-1 text-xs border-t border-slate-100 pt-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Delivery Destination</span>
                    <p className="text-slate-800 font-medium leading-relaxed">
                      {selectedOrder.deliveryAddress.address}, {selectedOrder.deliveryAddress.city},{' '}
                      {selectedOrder.deliveryAddress.state}
                    </p>
                    {selectedOrder.installationNotes && (
                      <p className="text-[11px] text-slate-500 italic mt-1">
                        &ldquo;{selectedOrder.installationNotes}&rdquo;
                      </p>
                    )}
                  </div>
                )}

                {/* Itemized Cart */}
                <div className="space-y-2 border-t border-slate-100 pt-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Itemized Equipment</span>
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-slate-50">
                      <div>
                        <span className="font-bold text-slate-900 block">{it.product.name}</span>
                        <span className="text-[10px] text-slate-400">Qty: {it.quantity} × {formatCurrency(it.unitPrice)}</span>
                      </div>
                      <span className="font-mono font-bold text-slate-900">
                        {formatCurrency(it.unitPrice * it.quantity)}
                      </span>
                    </div>
                  ))}

                  <div className="pt-2 flex justify-between items-center text-sm font-bold border-t border-slate-200">
                    <span>Total Amount</span>
                    <span className="text-emerald-700 font-mono font-extrabold">{formatCurrency(selectedOrder.total)}</span>
                  </div>
                </div>

                {/* Status Update Control */}
                <div className="space-y-2 border-t border-slate-100 pt-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Update Fulfillment Status</span>
                  <div className="grid grid-cols-3 gap-2">
                    {['PROCESSING', 'DISPATCHED', 'COMPLETED'].map((st) => (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(selectedOrder.id, st)}
                        disabled={updatingId === selectedOrder.id}
                        className={`py-2 rounded-xl text-[10px] font-bold font-mono transition-all cursor-pointer ${
                          selectedOrder.orderStatus === st
                            ? 'bg-emerald-600 text-white shadow-md'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-xs text-slate-400">
                Select an order from the list to view full customer, delivery, and item details.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
