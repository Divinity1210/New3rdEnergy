'use client';

import React, { useState } from 'react';
import { Card, Badge, Breadcrumbs } from '@/components/ui/components';
import { Button } from '@/components/ui/components';
import { Icon } from '@/components/ui/Icon';
import { aiService } from '@/lib/services/ai-service';
import { RequirementAnalysis } from '@/lib/types';
import { petroleumProducts } from '@/lib/data/petroleum-products';
import { cn } from '@/lib/utils';

export default function EnergyAssistantPage() {
  const [input, setInput] = useState('');
  const [analysis, setAnalysis] = useState<RequirementAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyse = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const result = await aiService.analyseRequirement(input);
      setAnalysis(result);
    } catch {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  };

  const matchedProducts = analysis
    ? petroleumProducts.filter(p => analysis.suggestedProducts.includes(p.id))
    : [];

  const confidenceLabel = analysis
    ? analysis.confidence >= 0.7 ? 'High' : analysis.confidence >= 0.4 ? 'Medium' : 'Low'
    : '';

  const exampleQueries = [
    'We need regular diesel supply for our manufacturing facility.',
    'I manage multiple commercial properties and need a fuel supply partner.',
    'We are looking for LPG supply for our restaurant chain.',
    'Our construction site needs on-site fuel delivery.',
    'We need help optimising our fuel costs across multiple locations.',
  ];

  return (
    <>
      <section className="gradient-dark pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="container-wide">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Energy Assistant' }]} />
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent-500 flex items-center justify-center">
                <Icon name="sparkles" size={20} className="text-white" />
              </div>
              <Badge variant="accent" size="md">Energy Requirement Assistant</Badge>
            </div>
            <h1 className="text-4xl lg:text-5xl font-heading font-extrabold text-white mb-6">
              Not Sure What You Need? We Can Help.
            </h1>
            <p className="text-lg text-neutral-300 leading-relaxed">
              Describe your energy requirement in your own words, and we&apos;ll suggest the most relevant solutions and guide you to the right team.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-wide max-w-3xl">
          {/* Input */}
          <div className="mb-10">
            <label htmlFor="energy-input" className="block text-lg font-bold text-neutral-900 mb-3">
              Tell us what you need
            </label>
            <textarea
              id="energy-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              rows={4}
              className="w-full px-5 py-4 rounded-xl border-2 border-border bg-white text-neutral-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition text-lg resize-y"
              placeholder="e.g. We run a large facility and need regular fuel supply..."
            />

            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-neutral-400">Describe your requirement in plain language</p>
              <Button
                variant="primary"
                size="lg"
                onClick={handleAnalyse}
                disabled={!input.trim() || loading}
                icon={<Icon name="sparkles" size={18} />}
              >
                {loading ? 'Analysing...' : 'Analyse Requirement'}
              </Button>
            </div>
          </div>

          {/* Example queries */}
          {!analysis && (
            <div className="mb-12">
              <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">Try an example</p>
              <div className="space-y-2">
                {exampleQueries.map((q) => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    className="block text-left w-full px-4 py-3 rounded-lg bg-surface-muted text-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800 transition-colors cursor-pointer"
                  >
                    &ldquo;{q}&rdquo;
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Analysis Results */}
          {analysis && (
            <div className="animate-slide-up">
              {/* Disclaimer */}
              <div className="bg-accent-50 border border-accent-200 rounded-xl p-4 mb-8 flex gap-3">
                <Icon name="sparkles" size={20} className="text-accent-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-accent-800">This is a suggestion — please review before proceeding.</p>
                  <p className="text-xs text-accent-600 mt-1">Our assistant has analysed your input and suggested a possible route. Your actual requirements will be confirmed by our team.</p>
                </div>
              </div>

              {/* Suggestion Card */}
              <Card padding="lg" className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-lg font-bold text-neutral-900">Suggested Route</h3>
                  <Badge variant={analysis.confidence >= 0.7 ? 'success' : analysis.confidence >= 0.4 ? 'warning' : 'default'}>
                    {confidenceLabel} Confidence
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Icon name="target" size={18} className="text-primary-500" />
                    <span className="text-sm text-neutral-600">
                      <strong>Vertical:</strong> {analysis.suggestedVertical === 'power-solar' ? 'Power & Solar Solutions' : 'Petroleum Solutions'}
                    </span>
                  </div>

                  {analysis.suggestedIndustry && (
                    <div className="flex items-center gap-3">
                      <Icon name="building" size={18} className="text-primary-500" />
                      <span className="text-sm text-neutral-600">
                        <strong>Industry:</strong> <span className="capitalize">{analysis.suggestedIndustry.replace('-', ' ')}</span>
                      </span>
                    </div>
                  )}

                  {analysis.extractedQuantity && (
                    <div className="flex items-center gap-3">
                      <Icon name="bar-chart" size={18} className="text-primary-500" />
                      <span className="text-sm text-neutral-600">
                        <strong>Quantity detected:</strong> {analysis.extractedQuantity}
                      </span>
                    </div>
                  )}

                  {analysis.extractedLocation && (
                    <div className="flex items-center gap-3">
                      <Icon name="map-pin" size={18} className="text-primary-500" />
                      <span className="text-sm text-neutral-600">
                        <strong>Location detected:</strong> {analysis.extractedLocation}
                      </span>
                    </div>
                  )}

                  <div className="mt-3 p-3 bg-surface-muted rounded-lg">
                    <p className="text-xs text-neutral-500">{analysis.reasoning}</p>
                  </div>
                </div>
              </Card>

              {/* Matched Products */}
              {matchedProducts.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-bold text-neutral-800 mb-4">Recommended Products & Services</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {matchedProducts.map((product) => (
                      <Card key={product.id} padding="md" hover className="group">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                            <Icon name={product.icon} size={20} className="text-primary-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-neutral-800">{product.name}</h4>
                            <p className="text-sm text-neutral-500 mt-1">{product.shortDescription}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  href={`/quote?product=${analysis.suggestedProducts[0] || ''}`}
                  variant="primary"
                  size="lg"
                  icon={<Icon name="zap" size={18} />}
                  className="flex-1"
                >
                  Proceed to Quote Request
                </Button>
                <Button
                  href="/contact"
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  Talk to Our Team
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => { setAnalysis(null); setInput(''); }}
                >
                  Start Over
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
