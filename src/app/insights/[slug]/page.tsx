import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/ui/components';
import { Button } from '@/components/ui/components';
import { Icon } from '@/components/ui/Icon';
import { insightArticles } from '@/lib/data/insights';
import { formatDate } from '@/lib/utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return insightArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = insightArticles.find((a) => a.slug === slug);
  if (!article) return {};
  return {
    title: `${article.seo.title || article.title} | 3rd Energy`,
    description: article.seo.description || article.excerpt,
    keywords: article.seo.keywords,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.date,
      authors: [article.author.name],
      images: [
        {
          url: article.featuredImage,
          width: 1200,
          height: 675,
          alt: article.title,
        },
      ],
    },
  };
}

export default async function InsightDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = insightArticles.find((a) => a.slug === slug);
  if (!article) return notFound();

  const related = insightArticles.filter(
    (a) => article.relatedSlugs?.includes(a.slug) || (a.category === article.category && a.slug !== article.slug)
  ).slice(0, 3);

  // Article schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    image: article.featuredImage,
    author: { '@type': 'Person', name: article.author.name },
    publisher: {
      '@type': 'Organization',
      name: '3rd Energy Group',
      logo: { '@type': 'ImageObject', url: '/3rd-energy-logo.png' },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* ===== ARTICLE HERO ===== */}
      <section className="relative min-h-[55vh] flex items-end overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0">
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/90 to-[#0a0a0a]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
        </div>

        <div className="container-wide relative z-10 pb-14 lg:pb-16 pt-40">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Insights', href: '/insights' },
              { label: article.title },
            ]}
          />

          <div className="max-w-3xl mt-6">
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-primary-900/40 text-primary-400 border border-primary-500/20 capitalize">
                {article.category.replace('-', ' ')}
              </span>
              <span className="text-[11px] text-white/25">{article.readingTime} min read</span>
              <span className="text-[11px] text-white/25">·</span>
              <span className="text-[11px] text-white/25">{formatDate(article.date)}</span>
            </div>

            <h1 className="display-xl text-white mb-8">
              {article.title}
            </h1>

            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-primary-700 flex items-center justify-center text-white text-xs font-bold">
                {article.author.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{article.author.name}</p>
                <p className="text-[11px] text-white/25">{article.author.role} · 3rd Energy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ARTICLE BODY & SIDEBAR ===== */}
      <section className="bg-neutral-950 py-16 lg:py-24">
        <div className="container-wide">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Main Article Content */}
            <main className="lg:col-span-8">
              {/* Executive Summary Callout Box */}
              <div className="mb-12 p-6 sm:p-8 rounded-lg bg-gradient-to-br from-white/[0.05] to-white/[0.01] border-l-4 border-l-primary-500 border-t border-r border-b border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary-400 mb-3">
                  <Icon name="sparkles" size={16} />
                  Executive Summary
                </div>
                <p className="text-base sm:text-lg text-neutral-200 leading-relaxed font-medium">
                  {article.excerpt}
                </p>
              </div>

              {/* Formatted Article Body */}
              <div className="prose prose-invert max-w-none space-y-6 text-neutral-300 text-base sm:text-lg leading-relaxed">
                {article.body.split('\n').map((paragraph, i) => {
                  const trimmed = paragraph.trim();
                  if (!trimmed) return null;

                  if (trimmed.startsWith('## ')) {
                    return (
                      <h2
                        key={i}
                        className="text-2xl sm:text-3xl font-heading font-bold text-white pt-8 pb-2 border-b border-white/10 mt-8 mb-4"
                      >
                        {trimmed.replace('## ', '')}
                      </h2>
                    );
                  }

                  if (trimmed.startsWith('### ')) {
                    return (
                      <h3
                        key={i}
                        className="text-xl sm:text-2xl font-heading font-semibold text-white/95 pt-4 mb-2 flex items-center gap-2"
                      >
                        <span className="w-2 h-2 rounded-full bg-primary-400 inline-block" />
                        {trimmed.replace('### ', '')}
                      </h3>
                    );
                  }

                  if (trimmed.startsWith('> ')) {
                    return (
                      <blockquote
                        key={i}
                        className="my-8 p-6 rounded-lg bg-primary-950/40 border-l-4 border-primary-500 text-lg sm:text-xl italic font-serif text-white/90 shadow-lg"
                      >
                        {trimmed.replace('> ', '').replace(/^"|"$/g, '')}
                      </blockquote>
                    );
                  }

                  return (
                    <p key={i} className="text-neutral-300/90 leading-relaxed">
                      {trimmed}
                    </p>
                  );
                })}
              </div>

              {/* Author Bio Card */}
              <div className="mt-16 p-8 rounded-lg bg-white/[0.03] border border-white/10 backdrop-blur-md">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-tr from-primary-600 to-amber-500 flex items-center justify-center font-bold text-white text-xl shadow-lg shrink-0">
                    {article.author.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-primary-400 font-semibold">About the Author</span>
                    <h4 className="text-lg font-bold text-white mt-0.5">{article.author.name}</h4>
                    <p className="text-xs text-neutral-400 mb-2">{article.author.role} · 3rd Energy Advisory Group</p>
                    <p className="text-sm text-neutral-300/80 leading-relaxed">
                      Specializing in commercial energy risk management, industrial procurement logistics, and corporate energy transition frameworks across West Africa.
                    </p>
                  </div>
                </div>
              </div>

              {/* Next Step Advisory CTA */}
              {article.cta && (
                <div className="mt-10 p-8 sm:p-10 rounded-lg bg-gradient-to-r from-primary-900/60 via-neutral-900 to-amber-950/40 border border-primary-500/30 backdrop-blur-md shadow-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/20 text-xs font-semibold text-primary-300 mb-4">
                    <Icon name="zap" size={14} />
                    Actionable Energy Advisory
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-white mb-2">
                    Ready to Apply These Insights to Your Operations?
                  </h3>
                  <p className="text-sm sm:text-base text-neutral-300 mb-6 max-w-xl">
                    Our technical and procurement advisors work directly with commercial and industrial operations teams to implement verified cost-saving supply structures.
                  </p>
                  <Button
                    href={article.cta.href}
                    variant="accent"
                    size="lg"
                    iconRight={<Icon name="arrow-right" size={16} />}
                  >
                    {article.cta.text}
                  </Button>
                </div>
              )}
            </main>

            {/* Sticky Sidebar */}
            <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-28">
              {/* Quick Inquiry Card */}
              <div className="p-7 rounded-lg bg-neutral-900/70 border border-white/10 backdrop-blur-md shadow-xl">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-400 flex items-center justify-center mb-4">
                  <Icon name="message-circle" size={20} />
                </div>
                <h3 className="font-heading font-bold text-white text-lg mb-2">
                  Need a Customized Briefing?
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6">
                  Discuss bulk diesel supply contracts, storage compliance audits, or hybrid solar-diesel engineering with our technical team.
                </p>
                <div className="space-y-3">
                  <Button href="/quote" variant="accent" size="sm" fullWidth iconRight={<Icon name="arrow-right" size={14} />}>
                    Request Commercial Quote
                  </Button>
                  <Button href="/contact" variant="outline" size="sm" fullWidth className="border-white/10 text-white/80 hover:bg-white/5">
                    Contact Advisory Team
                  </Button>
                </div>
              </div>

              {/* Related Intelligence Articles */}
              {related.length > 0 && (
                <div className="p-7 rounded-lg bg-neutral-900/50 border border-white/10 backdrop-blur-md shadow-xl">
                  <h3 className="font-heading font-bold text-white text-base mb-5 flex items-center gap-2">
                    <Icon name="book-open" size={16} className="text-primary-400" />
                    Related Intelligence
                  </h3>
                  <div className="space-y-4">
                    {related.map((rel) => (
                      <Link
                        href={`/insights/${rel.slug}`}
                        key={rel.slug}
                        className="group flex gap-4 items-center p-2 rounded-lg hover:bg-white/5 transition-all"
                      >
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-neutral-800">
                          <Image
                            src={rel.featuredImage}
                            alt={rel.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                            sizes="64px"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] text-primary-400 font-semibold uppercase tracking-wider block mb-0.5">
                            {rel.category.replace('-', ' ')}
                          </span>
                          <h4 className="font-semibold text-xs sm:text-sm text-white group-hover:text-primary-300 transition-colors line-clamp-2 leading-snug">
                            {rel.title}
                          </h4>
                          <span className="text-[11px] text-neutral-500 mt-1 block">
                            {formatDate(rel.date)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Back to All Insights */}
              <div className="text-center pt-2">
                <Link
                  href="/insights"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
                >
                  <Icon name="arrow-right" size={14} className="rotate-180" />
                  Back to All Intelligence Briefings
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
