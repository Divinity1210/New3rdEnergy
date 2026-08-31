import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Badge, Breadcrumbs, Card } from '@/components/ui/components';
import { Button } from '@/components/ui/components';
import { Icon } from '@/components/ui/Icon';
import { industries } from '@/lib/data/industries';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const industry = industries.find(i => i.slug === slug);
  if (!industry) return {};
  return {
    title: `${industry.name} Energy Solutions`,
    description: industry.description,
  };
}

export default async function IndustryDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const industry = industries.find(i => i.slug === slug);
  if (!industry) return notFound();

  return (
    <>
      <section className="gradient-dark pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="container-wide">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Industries', href: '/industries' }, { label: industry.name }]} />
          <div className="max-w-3xl">
            <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mb-5">
              <Icon name={industry.icon} size={28} className="text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-heading font-extrabold text-white mb-6">
              {industry.name} Energy Solutions
            </h1>
            <p className="text-lg text-neutral-300 leading-relaxed">{industry.description}</p>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-wide max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Industry Challenges</h2>
              <div className="space-y-4">
                {industry.challenges.map((challenge, i) => (
                  <div key={i} className="flex gap-3 p-4 rounded-lg bg-red-50 border border-red-100">
                    <span className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-xs font-bold text-red-600 shrink-0">{i + 1}</span>
                    <p className="text-sm text-neutral-700">{challenge}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">How We Help</h2>
              <div className="space-y-4">
                {industry.solutions.map((solution, i) => (
                  <div key={i} className="flex gap-3 p-4 rounded-lg bg-green-50 border border-green-100">
                    <Icon name="check" size={20} className="text-green-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-neutral-700">{solution}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center bg-surface-muted rounded-lg p-8">
            <h3 className="text-xl font-bold text-neutral-900 mb-3">Ready to Discuss Your {industry.name} Requirements?</h3>
            <p className="text-neutral-600 mb-6">Let our team prepare a tailored energy solution for your operation.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button href={`/quote?industry=${industry.id}`} variant="primary" size="lg" icon={<Icon name="zap" size={18} />}>Request a Quote</Button>
              <Button href="/contact" variant="outline" size="lg">Contact Us</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
