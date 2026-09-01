import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Icon } from '@/components/ui/Icon';
import { powerProducts } from '@/lib/data/power-products';
import { AddToCartButton } from '@/components/power/AddToCartButton';
import { formatCurrency, getWhatsAppUrl } from '@/lib/utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return powerProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = powerProducts.find((p) => p.slug === slug);
  if (!product) return {};
  return {
    title: `${product.name} | 3RD Energy Services Ltd`,
    description: product.tagline || product.shortDescription,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = powerProducts.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  // Find compatible companion products
  const compatibleProducts = powerProducts.filter((p) =>
    product.compatibleWith?.includes(p.id)
  );

  return (
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen pt-32 pb-24 lg:pt-40">
      <div className="container-wide max-w-6xl">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-900 transition-colors">3RD Energy Services Ltd</Link>
          <Icon name="chevron-right" size={12} />
          <Link href="/solutions/power-solar" className="hover:text-slate-900 transition-colors">Solar & Clean Power</Link>
          <Icon name="chevron-right" size={12} />
          <Link href="/power/products" className="hover:text-slate-900 transition-colors">Store</Link>
          <Icon name="chevron-right" size={12} />
          <span className="text-slate-900 font-bold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Top Product Hero Block */}
        <div className="grid lg:grid-cols-12 gap-10 items-start mb-16">
          {/* Left Column: Product Photo & Badges */}
          <div className="lg:col-span-6 space-y-4">
            <div className="h-[420px] rounded-3xl bg-white border border-slate-200 overflow-hidden relative shadow-lg">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-xs font-bold text-slate-800 uppercase tracking-wider shadow-sm">
                  {product.category}
                </span>
                {product.inStock ? (
                  <span className="px-3 py-1 rounded-full bg-emerald-50 backdrop-blur-md border border-emerald-300 text-xs font-bold text-emerald-800 flex items-center gap-1 shadow-sm">
                    <Icon name="check" size={12} /> In Stock
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-amber-50 backdrop-blur-md border border-amber-300 text-xs font-bold text-amber-800">
                    Lead Time: {product.leadTimeDays} Days
                  </span>
                )}
              </div>
            </div>

            {/* Guarantees Strip */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <Icon name="shield" size={18} className="text-emerald-600 mx-auto mb-1" />
                <span className="text-[11px] font-bold text-slate-900 block">Genuine Brand</span>
                <span className="text-[10px] text-slate-500">Tier-1 OEM Warranty</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <Icon name="truck" size={18} className="text-emerald-600 mx-auto mb-1" />
                <span className="text-[11px] font-bold text-slate-900 block">Fast Dispatch</span>
                <span className="text-[10px] text-slate-500">Nationwide Delivery</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <Icon name="award" size={18} className="text-emerald-600 mx-auto mb-1" />
                <span className="text-[11px] font-bold text-slate-900 block">Full Warranty</span>
                <span className="text-[10px] text-slate-500">{product.specs.warranty || '2 Years Warranty'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Pricing, Add-to-Cart & Action */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
                3RD Energy Services Ltd · Clean Power Division
              </div>
              <h1 className="text-2xl sm:text-4xl font-heading font-extrabold text-slate-950 leading-tight">
                {product.name}
              </h1>
              {product.tagline && (
                <p className="text-sm text-slate-600 mt-2 font-medium leading-relaxed">
                  {product.tagline}
                </p>
              )}
            </div>

            {/* Price Box */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Direct Price (NGN)</span>
                <span className="text-3xl font-heading font-extrabold text-slate-950">
                  {formatCurrency(product.price)}
                </span>
                <span className="text-xs text-emerald-700 font-semibold block mt-0.5">
                  ✓ Available for instant Lagos / Abuja depot pick-up or nationwide delivery
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>

            {/* Quick Action: Add to Cart */}
            <div className="space-y-3 pt-2">
              <AddToCartButton product={product} />

              <div className="flex items-center gap-3">
                <a
                  href={getWhatsAppUrl(`Hello 3RD Energy Services Ltd, I want to inquire about purchasing: ${product.name}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-2 border border-slate-200"
                >
                  <Icon name="whatsapp" size={15} className="text-emerald-600" />
                  Ask Technical Questions on WhatsApp
                </a>
                <Link
                  href="/power/builder"
                  className="py-3 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition-colors flex items-center gap-1.5 border border-emerald-200"
                >
                  <Icon name="settings" size={14} />
                  3D Builder
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specs Table */}
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-xl font-heading font-extrabold text-slate-950 border-b border-slate-100 pb-4">
                Technical Specifications
              </h2>

              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 capitalize block mb-0.5">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="font-bold text-slate-900">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Features */}
            {product.features && product.features.length > 0 && (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-lg font-heading font-extrabold text-slate-950">
                  Key Engineering Features
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-700">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Icon name="check" size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Compatible Equipment Column */}
          <div className="lg:col-span-4 space-y-6">
            {compatibleProducts.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-heading font-bold text-slate-950 uppercase tracking-wider text-emerald-800">
                  Compatible Accessories & Storage
                </h3>
                <div className="space-y-3">
                  {compatibleProducts.map((cp) => (
                    <Link
                      key={cp.id}
                      href={`/power/products/${cp.slug}`}
                      className="group block p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-100 transition-colors"
                    >
                      <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-800 transition-colors">
                        {cp.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1">{formatCurrency(cp.price)}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="p-6 rounded-3xl bg-emerald-900 text-white space-y-3">
              <h4 className="font-heading font-bold text-sm">Need Help Sizing?</h4>
              <p className="text-xs text-emerald-100 leading-relaxed">
                Our AI sizing tool calculates the exact number of solar panels and batteries required for your home or facility.
              </p>
              <Link
                href="/power/calculator"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white underline pt-1"
              >
                Launch Appliance Calculator →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
