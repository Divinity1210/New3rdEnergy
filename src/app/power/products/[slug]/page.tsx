import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Icon } from '@/components/ui/Icon';
import { powerProducts } from '@/lib/data/power-products';
import { AddToCartButton } from '@/components/power/AddToCartButton';
import { formatCurrency } from '@/lib/utils';

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
    title: `${product.name} | 3rd Energy Power Equipment`,
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
    <div className="bg-neutral-950 text-white min-h-screen pt-32 pb-24 lg:pt-40">
      <div className="container-wide max-w-6xl">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Icon name="chevron-right" size={12} />
          <Link href="/solutions/power-solar" className="hover:text-white transition-colors">Power & Solar</Link>
          <Icon name="chevron-right" size={12} />
          <Link href="/power/products" className="hover:text-white transition-colors">Equipment</Link>
          <Icon name="chevron-right" size={12} />
          <span className="text-white font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Top Product Hero Block */}
        <div className="grid lg:grid-cols-12 gap-12 items-start mb-16">
          {/* Left Column: Product Photo & Badges */}
          <div className="lg:col-span-6 space-y-4">
            <div className="h-[420px] rounded-lg bg-neutral-900 border border-white/10 overflow-hidden relative shadow-xl">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 rounded-full bg-neutral-950/80 backdrop-blur-md border border-white/15 text-xs font-bold text-solar-400 uppercase tracking-wider">
                  {product.category}
                </span>
                {product.inStock ? (
                  <span className="px-3 py-1 rounded-full bg-green-500/20 backdrop-blur-md border border-green-500/40 text-xs font-bold text-green-400 flex items-center gap-1">
                    <Icon name="check-circle" size={12} /> In Stock
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-yellow-500/20 backdrop-blur-md border border-yellow-500/40 text-xs font-bold text-yellow-400">
                    Lead Time: {product.leadTimeDays} Days
                  </span>
                )}
              </div>
            </div>

            {/* Guarantees Strip */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/5">
                <Icon name="shield" size={18} className="text-solar-400 mx-auto mb-1" />
                <span className="text-[11px] font-bold text-white block">Genuine Equipment</span>
                <span className="text-[10px] text-neutral-400">Direct from factory</span>
              </div>
              <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/5">
                <Icon name="hard-hat" size={18} className="text-solar-400 mx-auto mb-1" />
                <span className="text-[11px] font-bold text-white block">Turnkey Installation</span>
                <span className="text-[10px] text-neutral-400">Certified engineers</span>
              </div>
              <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/5">
                <Icon name="check-circle" size={18} className="text-solar-400 mx-auto mb-1" />
                <span className="text-[11px] font-bold text-white block">Full Warranty</span>
                <span className="text-[10px] text-neutral-400">{product.specs.warranty || '2 Years Warranty'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Price, Description & Add to Cart */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-solar-400">
                Product Specifications
              </span>
              <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-white mt-1 leading-tight">
                {product.name}
              </h1>
              <p className="text-sm text-neutral-300 mt-2 leading-relaxed">
                {product.tagline}
              </p>
            </div>

            {/* Price Box */}
            <div className="p-6 rounded-lg bg-neutral-900/90 border border-white/10 space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-neutral-400 block">Unit Price (excl. VAT)</span>
                  <span className="text-3xl font-extrabold text-solar-400">
                    {formatCurrency(product.price)}
                  </span>
                </div>
                <span className="text-xs text-neutral-400">SKU: {product.id.toUpperCase()}</span>
              </div>

              {/* Add to Cart Client Component */}
              <AddToCartButton product={product} />

              <div className="flex gap-3 pt-1">
                <Link
                  href="/power/installation"
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 text-center text-xs font-semibold transition-colors"
                >
                  Book Installation Site Audit
                </Link>
                <Link
                  href="/quote"
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 text-center text-xs font-semibold transition-colors"
                >
                  Request B2B Corporate Invoice
                </Link>
              </div>
            </div>

            {/* Quick Key Features Bullet List */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                Key Engineering Features
              </h3>
              <ul className="space-y-1.5 text-xs text-neutral-300">
                {product.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Icon name="check-circle" size={14} className="text-green-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ===== STRUCTURED 4-PILLAR PRODUCT STORY ===== */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* 1. WHY THIS PRODUCT */}
          <div className="p-6 rounded-lg bg-neutral-900/70 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-solar-500/10 border border-solar-500/20 text-solar-400 flex items-center justify-center">
              <Icon name="sparkles" size={20} />
            </div>
            <h3 className="font-heading font-bold text-base text-white">Why This Product</h3>
            <p className="text-xs text-neutral-300 leading-relaxed">{product.whyThisProduct}</p>
          </div>

          {/* 2. WHAT IT DOES */}
          <div className="p-6 rounded-lg bg-neutral-900/70 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-400 flex items-center justify-center">
              <Icon name="zap" size={20} />
            </div>
            <h3 className="font-heading font-bold text-base text-white">What It Does</h3>
            <p className="text-xs text-neutral-300 leading-relaxed">{product.whatItDoes}</p>
          </div>

          {/* 3. WHO IT IS FOR */}
          <div className="p-6 rounded-lg bg-neutral-900/70 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center">
              <Icon name="target" size={20} />
            </div>
            <h3 className="font-heading font-bold text-base text-white">Who It Is For</h3>
            <p className="text-xs text-neutral-300 leading-relaxed">{product.whoItIsFor}</p>
          </div>

          {/* 4. WHAT IT CAN SUPPORT */}
          <div className="p-6 rounded-lg bg-neutral-900/70 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Icon name="warehouse" size={20} />
            </div>
            <h3 className="font-heading font-bold text-base text-white">What It Can Support</h3>
            <ul className="space-y-1 text-xs text-neutral-300">
              {product.whatItCanSupport.map((item, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-solar-400">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ===== FULL TECHNICAL SPECIFICATIONS TABLE ===== */}
        <div className="rounded-lg bg-neutral-900 border border-white/10 overflow-hidden mb-16">
          <div className="p-6 border-b border-white/10">
            <h2 className="font-heading font-bold text-xl text-white">
              Full Technical Data Sheet
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Verified manufacturer engineering benchmarks.
            </p>
          </div>

          <div className="p-6">
            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              {Object.entries(product.specs).map(([key, val]) => (
                <div
                  key={key}
                  className="flex justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/5"
                >
                  <span className="text-neutral-400 capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <span className="font-semibold text-white text-right">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== COMPATIBLE COMPANION EQUIPMENT ===== */}
        {compatibleProducts.length > 0 && (
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h2 className="font-heading font-bold text-xl text-white">
                Compatible Companion Equipment
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Recommended batteries, inverters, and solar panels tested with this unit.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {compatibleProducts.map((companion) => (
                <div
                  key={companion.id}
                  className="p-5 rounded-lg bg-neutral-900/60 border border-white/10 flex flex-col justify-between hover:border-solar-500/30 transition-all"
                >
                  <div>
                    <div className="h-36 relative rounded-lg overflow-hidden bg-neutral-800 mb-3">
                      <Image
                        src={companion.image}
                        alt={companion.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-solar-400 uppercase">
                      {companion.category}
                    </span>
                    <h3 className="font-bold text-xs text-white line-clamp-2 mt-1">
                      {companion.name}
                    </h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      {formatCurrency(companion.price)}
                    </span>
                    <Link
                      href={`/power/products/${companion.slug}`}
                      className="text-xs font-semibold text-solar-400 hover:text-solar-300"
                    >
                      View Details &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
