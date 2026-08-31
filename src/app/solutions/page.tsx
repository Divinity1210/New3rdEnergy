import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/components';
import { Icon } from '@/components/ui/Icon';

export const metadata: Metadata = {
  title: 'Operating Divisions | 3RD Energy Group',
  description: 'Explore 3RD Energy Group operating divisions: 3RD Petroleum (bulk fuel logistics and storage) and 3RD Power & Solar (clean energy hybrid platforms and turnkey engineering).',
};

export default function SolutionsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#0a0a0a] pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className="container-wide">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Operating Divisions' }]} />
          <div className="max-w-3xl mt-4">
            <p className="label-text-light mb-5">Group Structure &amp; Portals</p>
            <h1 className="display-xl text-white mb-5">
              Two Specialized Operating Divisions.
            </h1>
            <p className="text-base text-white/40 leading-relaxed max-w-xl">
              3RD Energy Group operates two dedicated business divisions — tailored specifically to commercial fuel logistics and next-generation clean energy engineering.
            </p>
          </div>
        </div>
      </section>

      {/* Division Portals Gateway */}
      <section className="section bg-[#0a0a0a] border-t border-white/[0.04]">
        <div className="container-wide">
          <div className="mb-14">
            <p className="label-text-light mb-4">Select Division Portal</p>
            <h2 className="display-lg text-white">Dedicated Division Platforms</h2>
            <p className="text-sm text-white/40 mt-2 max-w-lg">
              Each division operates its own standalone platform, engineering team, dedicated logistics channels, and customer desks.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl">
            {/* 1. 3RD Petroleum Division Card */}
            <div className="rounded-lg border border-red-500/20 bg-white/[0.02] p-8 flex flex-col justify-between hover:border-red-500/40 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-lg bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-400">
                    <Icon name="fuel" size={24} />
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-semibold bg-red-950/50 text-red-400 border border-red-500/30 rounded uppercase tracking-wider">
                    Petroleum Division
                  </span>
                </div>

                <h3 className="text-2xl font-heading font-bold text-white mb-3">3RD Petroleum</h3>
                <p className="text-sm text-white/40 mb-6 leading-relaxed">
                  Bulk commercial fuel distribution, depot logistics, smart storage tank installations, and commercial procurement quoting across Nigeria.
                </p>

                <div className="space-y-2 mb-8">
                  {[
                    'Automotive Gas Oil (Diesel) Bulk Supply',
                    'Premium Motor Spirit (Petrol) Fleet Supply',
                    'Commercial Liquefied Petroleum Gas (LPG)',
                    'Smart Storage Tank Installation & Bunding',
                    'Depot Fleet Logistics & 24/7 Dispatch',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs text-white/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center gap-3">
                <Link
                  href="/solutions/petroleum"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-md transition-colors"
                >
                  Enter Petroleum Portal <Icon name="arrow-right" size={14} />
                </Link>
                <Link
                  href="/quote"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-3 text-xs font-semibold text-white/50 hover:text-white border border-white/[0.06] hover:border-white/15 rounded-md transition-colors"
                >
                  Request Fuel Quote
                </Link>
              </div>
            </div>

            {/* 2. 3RD Power & Solar Division Card */}
            <div className="rounded-lg border border-solar-500/20 bg-white/[0.02] p-8 flex flex-col justify-between hover:border-solar-500/40 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-lg bg-solar-950/40 border border-solar-500/30 flex items-center justify-center text-solar-400">
                    <Icon name="sun" size={24} />
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-semibold bg-solar-950/50 text-solar-400 border border-solar-500/30 rounded uppercase tracking-wider">
                    Clean Power Division
                  </span>
                </div>

                <h3 className="text-2xl font-heading font-bold text-white mb-3">3RD Power &amp; Solar</h3>
                <p className="text-sm text-white/40 mb-6 leading-relaxed">
                  Turnkey clean energy systems, Tier-1 hybrid inverters, 6,000-cycle LiFePO4 battery storage, AI power sizing tools, and certified nationwide installation.
                </p>

                <div className="space-y-2 mb-8">
                  {[
                    'Hybrid Inverter & Lithium Battery Equipment Store',
                    'AI Power Load & Autonomy Sizing Planner',
                    'Live Battery & Solar Array System Builder',
                    'Diesel Generator vs. Solar Savings Simulator',
                    'Certified Nationwide Turnkey Installation',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs text-white/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-solar-500 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center gap-3">
                <Link
                  href="/solutions/power-solar"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-semibold text-[#0a0a0a] bg-solar-500 hover:bg-solar-400 rounded-md transition-colors"
                >
                  Enter Power &amp; Solar Portal <Icon name="arrow-right" size={14} />
                </Link>
                <Link
                  href="/power/planner"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-3 text-xs font-semibold text-solar-400 hover:text-solar-300 border border-solar-500/20 hover:border-solar-500/40 rounded-md transition-colors"
                >
                  AI Sizing Planner
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Group Advisory CTA */}
      <section className="bg-white/[0.01] border-t border-white/[0.04]">
        <div className="container-wide py-20 lg:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <p className="label-text-light mb-4">Enterprise &amp; Multi-Site Advisory</p>
            <h2 className="display-lg text-white mb-5">Need a Hybrid Energy Architecture?</h2>
            <p className="text-sm text-white/40 mb-10 max-w-md mx-auto">
              Our energy advisory team works with corporate estates, industrial parks, and mission-critical facilities to integrate bulk fuel supply with solar-hybrid infrastructure.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.08] rounded-md transition-colors"
              >
                <Icon name="message-circle" size={16} />
                Contact Advisory Desk
              </Link>
              <Link
                href="/energy-assistant"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-[#0a0a0a] bg-accent-400 hover:bg-accent-300 rounded-md transition-colors"
              >
                <Icon name="zap" size={16} />
                Try AI Energy Assistant
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
