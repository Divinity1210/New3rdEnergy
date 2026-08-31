import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

export const dynamic = 'force-dynamic';

interface OrderPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderConfirmationPage({ params }: OrderPageProps) {
  const { orderId } = await params;

  return (
    <div className="bg-neutral-50 text-neutral-900 min-h-screen pt-32 pb-24 lg:pt-40">
      <div className="container-wide max-w-3xl">
        <div className="p-8 sm:p-12 rounded-lg bg-white border border-neutral-200 shadow-xl space-y-8 animate-fade-in">
          {/* Top Success Badge */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 flex items-center justify-center mx-auto">
              <Icon name="check-circle" size={32} />
            </div>
            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-neutral-900">
              Order Confirmed & Logged
            </h1>
            <p className="text-xs text-neutral-400">
              Thank you for choosing 3rd Energy. Your proforma order has been registered in our logistics dispatch queue.
            </p>

            <div className="inline-block py-2 px-6 rounded-lg bg-black/60 border border-solar-500/30 text-solar-400 font-mono font-bold text-base tracking-wider">
              {orderId}
            </div>
          </div>

          {/* Fulfillment Tracking Steps */}
          <div className="p-6 rounded-lg bg-white/[0.02] border border-white/5 space-y-4">
            <h2 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
              Fulfillment Timeline
            </h2>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="space-y-1">
                <div className="w-6 h-6 rounded-full bg-green-500 text-neutral-950 font-bold text-xs flex items-center justify-center mx-auto">
                  ✓
                </div>
                <span className="font-semibold text-white block text-[11px]">Logged</span>
                <span className="text-[9px] text-green-400">Confirmed</span>
              </div>

              <div className="space-y-1">
                <div className="w-6 h-6 rounded-full bg-solar-500 text-neutral-950 font-bold text-xs flex items-center justify-center mx-auto animate-pulse">
                  2
                </div>
                <span className="font-semibold text-white block text-[11px]">Audit</span>
                <span className="text-[9px] text-solar-400">In Review</span>
              </div>

              <div className="space-y-1">
                <div className="w-6 h-6 rounded-full bg-neutral-800 text-neutral-500 font-bold text-xs flex items-center justify-center mx-auto">
                  3
                </div>
                <span className="font-semibold text-neutral-400 block text-[11px]">Dispatch</span>
                <span className="text-[9px] text-neutral-600">Pending</span>
              </div>

              <div className="space-y-1">
                <div className="w-6 h-6 rounded-full bg-neutral-800 text-neutral-500 font-bold text-xs flex items-center justify-center mx-auto">
                  4
                </div>
                <span className="font-semibold text-neutral-400 block text-[11px]">Install</span>
                <span className="text-[9px] text-neutral-600">Commission</span>
              </div>
            </div>
          </div>

          {/* Next Steps Information */}
          <div className="p-5 rounded-lg bg-solar-500/10 border border-solar-500/20 text-xs text-amber-200/90 leading-relaxed space-y-2">
            <strong className="text-solar-300 block">Next Steps & Coordination:</strong>
            <p>
              1. A proforma order confirmation has been dispatched to your email address.
            </p>
            <p>
              2. Our logistics and engineering team will contact you to verify delivery access and schedule site technician arrival.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/solutions/power-solar"
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-amber-500 text-white font-bold text-xs hover:opacity-95 transition-opacity text-center flex items-center justify-center gap-2"
            >
              <Icon name="warehouse" size={16} />
              Back to Power Platform
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
