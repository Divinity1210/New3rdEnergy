import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { getWhatsAppUrl } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface OrderPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderConfirmationPage({ params }: OrderPageProps) {
  const { orderId } = await params;

  return (
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen pt-32 pb-24 lg:pt-40">
      <div className="container-wide max-w-3xl">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-8 animate-fade-in">
          {/* Top Success Badge */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
              <Icon name="check" size={32} />
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-950">
              Order Confirmed & Logged
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Thank you for trusting <strong>3RD Energy Services Ltd</strong>. Your order has been registered in our logistics dispatch queue and transmitted to our engineering desk.
            </p>

            <div className="inline-block py-2.5 px-6 rounded-2xl bg-slate-900 text-emerald-400 font-mono font-bold text-base tracking-wider shadow-sm">
              {orderId}
            </div>
          </div>

          {/* Fulfillment Tracking Steps */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Fulfillment Timeline
            </h2>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="space-y-1.5">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mx-auto shadow-sm">
                  ✓
                </div>
                <span className="font-bold text-slate-900 block text-[11px]">Logged</span>
                <span className="text-[10px] text-emerald-700 font-semibold">Confirmed</span>
              </div>

              <div className="space-y-1.5">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center mx-auto border border-emerald-300 animate-pulse">
                  2
                </div>
                <span className="font-bold text-slate-900 block text-[11px]">Audit</span>
                <span className="text-[10px] text-emerald-700 font-semibold">In Review</span>
              </div>

              <div className="space-y-1.5">
                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-500 font-bold text-xs flex items-center justify-center mx-auto">
                  3
                </div>
                <span className="font-semibold text-slate-500 block text-[11px]">Dispatch</span>
                <span className="text-[10px] text-slate-400">Pending</span>
              </div>

              <div className="space-y-1.5">
                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-500 font-bold text-xs flex items-center justify-center mx-auto">
                  4
                </div>
                <span className="font-semibold text-slate-500 block text-[11px]">Delivery</span>
                <span className="text-[10px] text-slate-400">Scheduled</span>
              </div>
            </div>
          </div>

          {/* Next Steps Information */}
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 leading-relaxed space-y-2">
            <strong className="text-emerald-950 font-bold block">Next Steps & Coordination:</strong>
            <p>
              1. An official order receipt has been dispatched to your email address and to <strong>info@3rdenergyservices.com</strong>.
            </p>
            <p>
              2. Our logistics coordinator will call you to verify depot pick-up timing or arrange site technician delivery.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={getWhatsAppUrl(`Hello 3RD Energy Services Ltd, I just placed order ${orderId} and want to track fulfillment.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors text-center flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
            >
              <Icon name="whatsapp" size={16} />
              Track on WhatsApp: +234 1 234 5680
            </a>
            <Link
              href="/power/products"
              className="py-3.5 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors text-center"
            >
              Back to Store
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
