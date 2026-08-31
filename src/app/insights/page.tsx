'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/components';
import { Icon } from '@/components/ui/Icon';
import { insightArticles, insightCategories } from '@/lib/data/insights';
import { formatDate } from '@/lib/utils';


export default function InsightsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>('');

  const featured = insightArticles.find((a) => a.featured) || insightArticles[0];

  const filteredArticles = useMemo(() => {
    return insightArticles.filter((article) => {
      const matchesCategory =
        activeCategory === 'all' || article.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.seo.keywords.some((k) =>
          k.toLowerCase().includes(searchQuery.toLowerCase())
        );

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput('');
    }
  };

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative min-h-[55vh] flex items-end overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0">
          <Image
            src="/images/insights-hero.jpg"
            alt="Energy Intelligence"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/85 to-[#0a0a0a]/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/40" />
        </div>

        <div className="container-wide relative z-10 pb-14 lg:pb-16 pt-40">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Insights & Advisory' }]} />
          
          <div className="max-w-2xl mt-4">
            <p className="label-text-light mb-5">Energy Intelligence</p>
            <h1 className="display-xl text-white mb-5">
              Strategic Insights & Market Trends.
            </h1>
            <p className="text-base text-white/40 leading-relaxed max-w-lg">
              Actionable energy market intelligence, commercial fuel procurement strategies, regulatory guidelines, and transition frameworks.
            </p>
          </div>

          {/* Search & Topic Filter Bar */}
          <div
            className="mt-10 max-w-3xl"
            style={{ opacity: 0, animation: 'slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards' }}
          >
            <div className="relative flex items-center">
              <Icon name="search" size={20} className="absolute left-4 text-white/40 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by topic, keyword (e.g. diesel procurement, solar hybrid, compliance)..."
                className="w-full pl-12 pr-10 py-4 rounded-lg bg-white/10 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:border-primary-500 focus:bg-white/15 backdrop-blur-md transition-all duration-300 text-sm md:text-base shadow-xl"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 text-white/40 hover:text-white transition-colors"
                >
                  <Icon name="x" size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED ARTICLE HERO CARD ===== */}
      {featured && activeCategory === 'all' && searchQuery.trim() === '' && (
        <section className="bg-neutral-950 pt-10 pb-8 relative z-20">
          <div className="container-wide">
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />
                <span className="text-xs uppercase tracking-widest font-semibold text-primary-400">
                  Featured Intelligence Briefing
                </span>
              </div>

              <Link href={`/insights/${featured.slug}`} className="group block">
                <div className="relative rounded-lg overflow-hidden border border-white/10 bg-neutral-900/60 backdrop-blur-md hover:border-primary-500/40 transition-all duration-500 hover:shadow-xl hover:shadow-primary-950/50">
                  <div className="grid lg:grid-cols-12 gap-0">
                    {/* Image Column */}
                    <div className="lg:col-span-7 relative min-h-[320px] sm:min-h-[400px] lg:min-h-[480px] overflow-hidden">
                      <Image
                        src={featured.featuredImage}
                        alt={featured.title}
                        fill
                        priority
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        sizes="(max-width: 1024px) 100vw, 60vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-neutral-950/40 lg:to-neutral-950" />
                      
                      {/* Floating Badge */}
                      <div className="absolute top-6 left-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-950/70 backdrop-blur-md border border-white/15 text-xs font-semibold text-white">
                          <Icon name="droplet" size={14} className="text-primary-400" />
                          <span className="capitalize">{featured.category.replace('-', ' ')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content Column */}
                    <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-between bg-gradient-to-b from-white/[0.03] to-transparent">
                      <div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400 mb-4">
                          <span className="flex items-center gap-1.5">
                            <Icon name="calendar" size={14} className="text-white/40" />
                            {formatDate(featured.date)}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1.5">
                            <Icon name="clock" size={14} className="text-white/40" />
                            {featured.readingTime} min read
                          </span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-heading font-bold text-white group-hover:text-primary-400 transition-colors duration-300 mb-4 leading-snug">
                          {featured.title}
                        </h2>

                        <p className="text-neutral-300/80 leading-relaxed text-sm sm:text-base mb-8 line-clamp-4">
                          {featured.excerpt}
                        </p>
                      </div>

                      <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-600 to-amber-500 flex items-center justify-center font-bold text-white text-xs shadow-md">
                            {featured.author.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-white">{featured.author.name}</p>
                            <p className="text-[11px] text-neutral-400">{featured.author.role}</p>
                          </div>
                        </div>

                        <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary-400 group-hover:text-primary-300 group-hover:translate-x-1 transition-all duration-300">
                          Read Briefing
                          <Icon name="arrow-right" size={14} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== CATEGORY PILL SELECTOR & GRID ===== */}
      <section className="bg-neutral-950 py-12 lg:py-20">
        <div className="container-wide">
          {/* Filter Bar Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 pb-6 border-b border-white/10">
            <div>
              <h3 className="text-xl lg:text-2xl font-heading font-bold text-white">
                All Intelligence Briefings
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Showing <span className="text-white font-semibold">{filteredArticles.length}</span> verified {filteredArticles.length === 1 ? 'article' : 'articles'}
                {searchQuery && (
                  <span> matching &ldquo;<span className="text-primary-400">{searchQuery}</span>&rdquo;</span>
                )}
              </p>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {insightCategories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-primary-600 to-amber-500 text-white shadow-lg shadow-primary-950/50 font-semibold'
                        : 'bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white border border-white/5'
                    }`}
                  >
                    <Icon name={cat.icon || 'grid'} size={14} className={isActive ? 'text-white' : 'text-primary-400'} />
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Articles Grid */}
          {filteredArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article, index) => (
                <Link
                  href={`/insights/${article.slug}`}
                  key={article.slug}
                  className="group flex flex-col"
                >
                  <div
                    className="tilt-card flex flex-col h-full rounded-lg overflow-hidden border border-white/10 bg-neutral-900/50 backdrop-blur-md hover:border-primary-500/40 hover:bg-neutral-900/80 transition-all duration-400 shadow-lg hover:shadow-xl hover:shadow-primary-950/40 animate-fade-in"
                    style={{ animationDelay: `${(index % 3) * 0.08}s` }}
                  >
                    {/* Thumbnail Image */}
                    <div className="relative h-56 w-full overflow-hidden bg-neutral-900">
                      <Image
                        src={article.featuredImage}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/20" />

                      {/* Top Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full bg-neutral-950/70 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-white/90 capitalize">
                          {article.category.replace('-', ' ')}
                        </span>
                      </div>

                      {/* Reading Time Pill */}
                      <div className="absolute bottom-3 right-4 flex items-center gap-1 text-[11px] text-white/80 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
                        <Icon name="clock" size={12} className="text-amber-400" />
                        {article.readingTime} min read
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between">
                      <div>
                        <div className="text-xs text-neutral-400 mb-2.5 flex items-center gap-2">
                          <Icon name="calendar" size={13} className="text-white/40" />
                          <span>{formatDate(article.date)}</span>
                        </div>

                        <h3 className="text-lg sm:text-xl font-heading font-bold text-white group-hover:text-primary-400 transition-colors duration-300 mb-3 leading-snug line-clamp-2">
                          {article.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed line-clamp-3 mb-6">
                          {article.excerpt}
                        </p>
                      </div>

                      {/* Footer: Author & Read Link */}
                      <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-[10px] font-bold text-white/80">
                            {article.author.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                          </div>
                          <span className="text-xs text-neutral-300 font-medium truncate max-w-[130px]">
                            {article.author.name}
                          </span>
                        </div>

                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-400 group-hover:text-primary-300 group-hover:translate-x-1 transition-all duration-300">
                          Read Brief
                          <Icon name="arrow-right" size={13} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-lg p-8 ">
              <div className="w-16 h-16 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-primary-400">
                <Icon name="search" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Matching Intelligence Briefings</h3>
              <p className="text-neutral-400 text-sm max-w-md mx-auto mb-6">
                We couldn&apos;t find any articles matching your search &ldquo;{searchQuery}&rdquo;. Try another term or reset your filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-primary-600 to-amber-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ===== INTELLIGENCE DIGEST SUBSCRIPTION BOX ===== */}
      <section className="bg-neutral-950 py-16 lg:py-20 relative overflow-hidden">
        <div className="container-wide">
          <div className="relative rounded-lg overflow-hidden border border-white/10 p-8 sm:p-12 lg:p-16 bg-gradient-to-br from-neutral-900/90 via-neutral-950 to-neutral-900/90 backdrop-blur-md  shadow-xl">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs font-semibold text-primary-300 mb-4">
                  <Icon name="sparkles" size={14} className="text-primary-400" />
                  Quarterly Energy Intelligence
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-white mb-4">
                  Subscribe to the 3rd Energy <span className="text-gradient-brand">Executive Digest</span>.
                </h2>

                <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-xl">
                  Receive curated diesel index benchmarks, regional supply chain alerts, solar ROI models, and regulatory updates delivered directly to your executive inbox quarterly. No spam, ever.
                </p>
              </div>

              <div className="lg:col-span-5">
                {subscribed ? (
                  <div className="p-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-center animate-fade-in">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                      <Icon name="check-circle" size={24} />
                    </div>
                    <h4 className="text-white font-bold mb-1">Subscription Confirmed</h4>
                    <p className="text-xs text-neutral-300">
                      You&apos;ll receive our next quarterly executive energy briefing. Welcome aboard.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="space-y-3">
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="Enter your corporate email address..."
                        className="w-full px-5 py-4 rounded-lg bg-white/5 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:border-primary-500 focus:bg-white/10 transition-all text-sm backdrop-blur-md"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-4 rounded-lg bg-gradient-to-r from-primary-600 via-orange-500 to-amber-500 text-white font-bold text-sm hover:opacity-95 transition-opacity shadow-lg shadow-primary-950/50 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Icon name="mail" size={16} />
                      Subscribe to Intelligence Digest
                    </button>
                    <p className="text-[11px] text-neutral-500 text-center">
                      Join 500+ commercial operations directors and facilities managers.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BOTTOM CTA ===== */}
      <section className="bg-neutral-950 pb-24">
        <div className="container-wide">
          <div className="rounded-lg p-10 lg:p-14 text-center  border border-white/10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4">
              <Icon name="zap" size={14} className="text-primary-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-white/80">Tailored Advisory</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-white mb-3">
              Need a Custom Energy Assessment for Your Enterprise?
            </h2>
            
            <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
              Our energy engineers and procurement analysts can audit your site consumption, design bulk storage facilities, or model solar-hybrid ROI for your facility.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-[#0a0a0a] bg-accent-400 hover:bg-accent-300 rounded-md transition-colors"
              >
                <Icon name="message-circle" size={16} />
                Speak with an Advisory Specialist
              </Link>
              <Link
                href="/quote"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-white/50 border border-white/[0.06] hover:border-white/10 hover:text-white/70 rounded-md transition-colors"
              >
                Request Commercial Fuel Quote
                <Icon name="arrow-right" size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
