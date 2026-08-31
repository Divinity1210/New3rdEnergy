import { Metadata } from 'next';
import { SectionHeading, Card, Badge, Breadcrumbs } from '@/components/ui/components';
import { Button } from '@/components/ui/components';
import { Icon } from '@/components/ui/Icon';

export const metadata: Metadata = {
  title: 'Projects & Capabilities',
  description: 'Explore 3rd Energy capabilities: petroleum supply, fuel storage, logistics, and energy management for commercial and industrial operations.',
};

export default function ProjectsPage() {
  return (
    <>
      <section className="gradient-dark pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="container-wide">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Projects & Capabilities' }]} />
          <div className="max-w-3xl">
            <Badge variant="accent" size="md" className="mb-4">Projects & Capabilities</Badge>
            <h1 className="text-4xl lg:text-5xl font-heading font-extrabold text-white mb-6">
              Proven Capability Across Energy Operations.
            </h1>
            <p className="text-lg text-neutral-300 leading-relaxed">
              Our capabilities span the full spectrum of energy supply, storage, and management. Here&apos;s what we bring to the table.
            </p>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="section bg-white">
        <div className="container-wide">
          <SectionHeading
            title="Our Capabilities"
            subtitle="A comprehensive set of energy capabilities built to serve businesses at scale."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: 'truck', title: 'Supply & Logistics', description: 'End-to-end fuel supply chain management including procurement, transport, and multi-site delivery coordination.' },
              { icon: 'warehouse', title: 'Storage & Infrastructure', description: 'Design, installation, and maintenance of fuel storage systems including tanks, bunding, and monitoring equipment.' },
              { icon: 'chart', title: 'Management & Consulting', description: 'Consumption analytics, cost optimisation, procurement strategy, and compliance advisory services.' },
              { icon: 'wrench', title: 'Maintenance & Testing', description: 'Tank cleaning, inspection, fuel quality testing, and preventive maintenance programmes.' },
              { icon: 'shield', title: 'Compliance & Safety', description: 'Regulatory compliance support, safety documentation, and environmental management guidance.' },
              { icon: 'settings', title: 'Custom Solutions', description: 'Bespoke energy solutions designed around specific operational requirements and constraints.' },
            ].map((cap) => (
              <Card key={cap.title} padding="lg" hover>
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-4">
                  <Icon name={cap.icon} size={24} className="text-primary-600" />
                </div>
                <h3 className="font-bold text-neutral-800 mb-2">{cap.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{cap.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Placeholder */}
      <section className="section bg-surface-muted">
        <div className="container-wide">
          <SectionHeading
            badge="Selected Projects"
            title="Our Work"
            subtitle="Examples of how we've supported businesses with their energy requirements."
          />

          {/* CMS PLACEHOLDER: Replace with actual verified projects */}
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Commercial Fuel Supply Programme', scope: 'Multi-site diesel supply', industry: 'Commercial', status: 'Ongoing' },
              { title: 'Industrial Storage Installation', scope: 'Tank design & installation', industry: 'Industrial', status: 'Completed' },
              { title: 'Facility Energy Management', scope: 'Consumption audit & optimisation', industry: 'Facility Management', status: 'Ongoing' },
              { title: 'Institutional Fuel Partnership', scope: 'Long-term supply agreement', industry: 'Institutional', status: 'Ongoing' },
            ].map((project) => (
              <Card key={project.title} padding="lg" className="border-l-4 border-l-primary-500">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant={project.status === 'Ongoing' ? 'success' : 'default'}>{project.status}</Badge>
                  <Badge variant="info">{project.industry}</Badge>
                </div>
                <h3 className="text-lg font-bold text-neutral-800 mb-2">{project.title}</h3>
                <p className="text-sm text-neutral-500">{project.scope}</p>
                {/* PLACEHOLDER: Add verified project details, outcomes, and images */}
              </Card>
            ))}
          </div>

          <p className="text-center text-sm text-neutral-400 mt-8">
            Project details are representative. Speak with our team for verified case studies and references.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-brand py-14">
        <div className="container-wide text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">Want to Discuss Your Project?</h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">Let us understand your requirements and demonstrate how we can help.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button href="/contact" size="lg" variant="accent">Contact Us</Button>
            <Button href="/quote" size="lg" variant="ghost" className="text-white border-2 border-white/30 hover:bg-white/10">Request a Quote</Button>
          </div>
        </div>
      </section>
    </>
  );
}
