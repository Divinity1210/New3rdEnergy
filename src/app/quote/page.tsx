'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, Stepper } from '@/components/ui/components';
import { Button } from '@/components/ui/components';
import { Icon } from '@/components/ui/Icon';
import { petroleumProducts, quantityUnits } from '@/lib/data/petroleum-products';
import { industries } from '@/lib/data/industries';
import { ProductSelection, ContactInfo, OrganisationInfo, DeliveryLocation, LeadUrgency } from '@/lib/types';
import { cn } from '@/lib/utils';

const STEPS = ['Products', 'Quantity', 'Delivery', 'Timeline', 'Organisation', 'Details', 'Upload', 'Review', 'Complete'];

const STORAGE_KEY = '3e_quote_state';

interface QuoteState {
  products: ProductSelection[];
  quantity: { value: number; unit: string };
  location: DeliveryLocation;
  requestedDate: string;
  urgency: LeadUrgency;
  contact: ContactInfo;
  organisation: OrganisationInfo;
  notes: string;
}

const initialState: QuoteState = {
  products: [],
  quantity: { value: 0, unit: 'litres' },
  location: { address: '', city: '', state: '', country: '', deliveryType: 'delivery' },
  requestedDate: '',
  urgency: 'medium',
  contact: { firstName: '', lastName: '', email: '', phone: '' },
  organisation: { name: '', industry: '' },
  notes: '',
};

function QuoteEngineInner() {
  const searchParams = useSearchParams();
  const preselectedProduct = searchParams.get('product');

  const [step, setStep] = useState(0);
  const [state, setState] = useState<QuoteState>(() => {
    if (typeof window === 'undefined') return initialState;
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialState;
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');

  // Preselect product from URL
  useEffect(() => {
    if (preselectedProduct) {
      const product = petroleumProducts.find(p => p.id === preselectedProduct);
      if (product && !state.products.find(p => p.productId === product.id)) {
        setState(prev => ({
          ...prev,
          products: [...prev.products, { productId: product.id, productName: product.name, category: product.category }],
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preselectedProduct]);

  // Persist state
  useEffect(() => {
    if (!submitted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, submitted]);

  const update = (partial: Partial<QuoteState>) => {
    setState(prev => ({ ...prev, ...partial }));
  };

  const toggleProduct = (product: typeof petroleumProducts[0]) => {
    const exists = state.products.find(p => p.productId === product.id);
    if (exists) {
      update({ products: state.products.filter(p => p.productId !== product.id) });
    } else {
      update({
        products: [...state.products, { productId: product.id, productName: product.name, category: product.category }],
      });
    }
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 0: return state.products.length > 0;
      case 1: return state.quantity.value > 0;
      case 2: return state.location.city.trim() !== '' && state.location.country.trim() !== '';
      case 3: return true; // Date is optional
      case 4: return state.contact.firstName.trim() !== '' && state.contact.email.trim() !== '' && state.organisation.name.trim() !== '';
      case 5: return true; // Notes optional
      case 6: return true; // Upload optional
      case 7: return true; // Review
      default: return true;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...state,
          source: 'website_quote',
          attachments: [],
        }),
      });

      if (!res.ok) throw new Error('Submission failed');

      const data = await res.json();
      setReference(data.referenceNumber);
      setSubmitted(true);
      setStep(8); // Complete step
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-[#0a0a0a] pt-32 pb-8 lg:pt-40 lg:pb-12">
        <div className="container-wide">
          <div className="max-w-2xl">
            <p className="label-text-light mb-4">Quote Request</p>
            <h1 className="display-lg text-white mb-3">
              Request a Quote
            </h1>
            <p className="text-sm text-white/40">
              Complete the form below to submit your requirements. Our team will review and respond with a detailed quote.
            </p>
          </div>
        </div>
      </section>

      {/* Stepper */}
      <section className="bg-white border-b border-border py-6 sticky top-16 lg:top-20 z-30">
        <div className="container-wide">
          <Stepper steps={STEPS} currentStep={step} />
        </div>
      </section>

      {/* Form Content */}
      <section className="section bg-surface-muted min-h-[60vh]">
        <div className="container-wide max-w-3xl">
          {/* STEP 0: Product Selection */}
          {step === 0 && (
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">What do you need?</h2>
              <p className="text-neutral-500 mb-8">Select the products or services you&apos;re interested in.</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {petroleumProducts.map((product) => {
                  const selected = state.products.some(p => p.productId === product.id);
                  return (
                    <button
                      key={product.id}
                      onClick={() => toggleProduct(product)}
                      className={cn(
                        'text-left p-5 rounded-lg border transition-all cursor-pointer',
                        selected
                          ? 'border-primary-500 bg-primary-50 shadow-md'
                          : 'border-border bg-white hover:border-neutral-300 hover:shadow-sm'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                          selected ? 'bg-primary-100' : 'bg-neutral-100'
                        )}>
                          <Icon name={product.icon} size={20} className={selected ? 'text-primary-600' : 'text-neutral-500'} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className={cn('font-semibold', selected ? 'text-primary-700' : 'text-neutral-800')}>
                              {product.name}
                            </h3>
                            {selected && <Icon name="check" size={18} className="text-primary-600" />}
                          </div>
                          <p className="text-sm text-neutral-500 mt-1">{product.shortDescription}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 1: Quantity */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Approximate Quantity</h2>
              <p className="text-neutral-500 mb-8">Provide an estimated quantity. Exact amounts can be discussed with our team.</p>
              <div className="grid sm:grid-cols-2 gap-4 max-w-md">
                <div>
                  <label htmlFor="quote-quantity" className="block text-sm font-semibold text-neutral-700 mb-1.5">Quantity *</label>
                  <input id="quote-quantity" type="number" min="0" value={state.quantity.value || ''} onChange={e => update({ quantity: { ...state.quantity, value: parseFloat(e.target.value) || 0 } })} className="w-full px-4 py-3 rounded-lg border border-border bg-white text-neutral-800 focus:ring-2 focus:ring-primary-500 outline-none transition" placeholder="e.g. 5000" />
                </div>
                <div>
                  <label htmlFor="quote-unit" className="block text-sm font-semibold text-neutral-700 mb-1.5">Unit *</label>
                  <select id="quote-unit" value={state.quantity.unit} onChange={e => update({ quantity: { ...state.quantity, unit: e.target.value } })} className="w-full px-4 py-3 rounded-lg border border-border bg-white text-neutral-800 focus:ring-2 focus:ring-primary-500 outline-none transition">
                    {quantityUnits.map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Delivery / Location */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Delivery / Location</h2>
              <p className="text-neutral-500 mb-8">Where do you need the supply delivered?</p>
              <div className="space-y-4 max-w-lg">
                <div>
                  <label htmlFor="quote-deliveryType" className="block text-sm font-semibold text-neutral-700 mb-1.5">Delivery Type *</label>
                  <select id="quote-deliveryType" value={state.location.deliveryType} onChange={e => update({ location: { ...state.location, deliveryType: e.target.value as 'delivery' | 'collection' | 'flexible' } })} className="w-full px-4 py-3 rounded-lg border border-border bg-white text-neutral-800 focus:ring-2 focus:ring-primary-500 outline-none transition">
                    <option value="delivery">Delivery Required</option>
                    <option value="collection">Collection</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="quote-address" className="block text-sm font-semibold text-neutral-700 mb-1.5">Address</label>
                  <input id="quote-address" value={state.location.address} onChange={e => update({ location: { ...state.location, address: e.target.value } })} className="w-full px-4 py-3 rounded-lg border border-border bg-white text-neutral-800 focus:ring-2 focus:ring-primary-500 outline-none transition" placeholder="Street address" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="quote-city" className="block text-sm font-semibold text-neutral-700 mb-1.5">City *</label>
                    <input id="quote-city" required value={state.location.city} onChange={e => update({ location: { ...state.location, city: e.target.value } })} className="w-full px-4 py-3 rounded-lg border border-border bg-white text-neutral-800 focus:ring-2 focus:ring-primary-500 outline-none transition" placeholder="City" />
                  </div>
                  <div>
                    <label htmlFor="quote-state" className="block text-sm font-semibold text-neutral-700 mb-1.5">State / Region</label>
                    <input id="quote-state" value={state.location.state} onChange={e => update({ location: { ...state.location, state: e.target.value } })} className="w-full px-4 py-3 rounded-lg border border-border bg-white text-neutral-800 focus:ring-2 focus:ring-primary-500 outline-none transition" placeholder="State" />
                  </div>
                </div>
                <div>
                  <label htmlFor="quote-country" className="block text-sm font-semibold text-neutral-700 mb-1.5">Country *</label>
                  <input id="quote-country" required value={state.location.country} onChange={e => update({ location: { ...state.location, country: e.target.value } })} className="w-full px-4 py-3 rounded-lg border border-border bg-white text-neutral-800 focus:ring-2 focus:ring-primary-500 outline-none transition" placeholder="Country" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Timeline */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Required Date & Urgency</h2>
              <p className="text-neutral-500 mb-8">When do you need the supply? Leave blank if flexible.</p>
              <div className="space-y-6 max-w-md">
                <div>
                  <label htmlFor="quote-date" className="block text-sm font-semibold text-neutral-700 mb-1.5">Requested Date</label>
                  <input id="quote-date" type="date" value={state.requestedDate} onChange={e => update({ requestedDate: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-border bg-white text-neutral-800 focus:ring-2 focus:ring-primary-500 outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-3">Urgency Level</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(['low', 'medium', 'high', 'critical'] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => update({ urgency: level })}
                        className={cn(
                          'px-4 py-3 rounded-lg border-2 text-sm font-medium capitalize transition-all cursor-pointer',
                          state.urgency === level
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-border bg-white text-neutral-600 hover:border-neutral-300'
                        )}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Organisation Details */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Your Details</h2>
              <p className="text-neutral-500 mb-8">Tell us about yourself and your organisation so we can prepare a relevant quote.</p>
              <div className="space-y-4 max-w-lg">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="quote-firstName" className="block text-sm font-semibold text-neutral-700 mb-1.5">First Name *</label>
                    <input id="quote-firstName" required value={state.contact.firstName} onChange={e => update({ contact: { ...state.contact, firstName: e.target.value } })} className="w-full px-4 py-3 rounded-lg border border-border bg-white text-neutral-800 focus:ring-2 focus:ring-primary-500 outline-none transition" placeholder="First name" />
                  </div>
                  <div>
                    <label htmlFor="quote-lastName" className="block text-sm font-semibold text-neutral-700 mb-1.5">Last Name</label>
                    <input id="quote-lastName" value={state.contact.lastName} onChange={e => update({ contact: { ...state.contact, lastName: e.target.value } })} className="w-full px-4 py-3 rounded-lg border border-border bg-white text-neutral-800 focus:ring-2 focus:ring-primary-500 outline-none transition" placeholder="Last name" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="quote-email" className="block text-sm font-semibold text-neutral-700 mb-1.5">Email *</label>
                    <input id="quote-email" type="email" required value={state.contact.email} onChange={e => update({ contact: { ...state.contact, email: e.target.value } })} className="w-full px-4 py-3 rounded-lg border border-border bg-white text-neutral-800 focus:ring-2 focus:ring-primary-500 outline-none transition" placeholder="you@company.com" />
                  </div>
                  <div>
                    <label htmlFor="quote-phone" className="block text-sm font-semibold text-neutral-700 mb-1.5">Phone</label>
                    <input id="quote-phone" type="tel" value={state.contact.phone} onChange={e => update({ contact: { ...state.contact, phone: e.target.value } })} className="w-full px-4 py-3 rounded-lg border border-border bg-white text-neutral-800 focus:ring-2 focus:ring-primary-500 outline-none transition" placeholder="+44 000 000 0000" />
                  </div>
                </div>
                <div>
                  <label htmlFor="quote-orgName" className="block text-sm font-semibold text-neutral-700 mb-1.5">Organisation Name *</label>
                  <input id="quote-orgName" required value={state.organisation.name} onChange={e => update({ organisation: { ...state.organisation, name: e.target.value } })} className="w-full px-4 py-3 rounded-lg border border-border bg-white text-neutral-800 focus:ring-2 focus:ring-primary-500 outline-none transition" placeholder="Company / organisation name" />
                </div>
                <div>
                  <label htmlFor="quote-industry" className="block text-sm font-semibold text-neutral-700 mb-1.5">Industry</label>
                  <select id="quote-industry" value={state.organisation.industry} onChange={e => update({ organisation: { ...state.organisation, industry: e.target.value } })} className="w-full px-4 py-3 rounded-lg border border-border bg-white text-neutral-800 focus:ring-2 focus:ring-primary-500 outline-none transition">
                    <option value="">Select industry</option>
                    {industries.map(i => (
                      <option key={i.id} value={i.id}>{i.name}</option>
                    ))}
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Additional Requirements */}
          {step === 5 && (
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Additional Requirements</h2>
              <p className="text-neutral-500 mb-8">Any specific requirements, preferences, or information that would help us prepare your quote.</p>
              <div className="max-w-lg">
                <textarea value={state.notes} onChange={e => update({ notes: e.target.value })} rows={6} className="w-full px-4 py-3 rounded-lg border border-border bg-white text-neutral-800 focus:ring-2 focus:ring-primary-500 outline-none transition resize-y" placeholder="e.g. Specific fuel grade requirements, delivery access restrictions, existing storage details, contract preferences, etc." />
              </div>
            </div>
          )}

          {/* STEP 6: Document Upload */}
          {step === 6 && (
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Supporting Documents</h2>
              <p className="text-neutral-500 mb-8">Upload any supporting documents if applicable (optional). E.g. site plans, specifications, procurement documents.</p>
              <div className="max-w-lg">
                <div className="border-2 border-dashed border-neutral-300 rounded-xl p-12 text-center hover:border-primary-400 transition-colors">
                  <Icon name="upload" size={40} className="text-neutral-400 mx-auto mb-4" />
                  <p className="text-neutral-600 font-medium mb-1">Drag and drop files here</p>
                  <p className="text-sm text-neutral-400 mb-4">or click to browse (Max 10MB per file)</p>
                  <Button variant="outline" size="sm">Browse Files</Button>
                </div>
                <p className="text-xs text-neutral-400 mt-3">Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG. File upload storage will be configured in production.</p>
              </div>
            </div>
          )}

          {/* STEP 7: Review */}
          {step === 7 && (
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Review Your Request</h2>
              <p className="text-neutral-500 mb-8">Please review your quote request before submitting.</p>
              <Card padding="lg" className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-2">Products & Services</h3>
                  <div className="flex flex-wrap gap-2">
                    {state.products.map(p => (
                      <Badge key={p.productId} variant="primary" size="md">{p.productName}</Badge>
                    ))}
                  </div>
                </div>
                <hr className="border-border" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-1">Quantity</h3>
                    <p className="text-neutral-800">{state.quantity.value} {state.quantity.unit}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-1">Urgency</h3>
                    <p className="text-neutral-800 capitalize">{state.urgency}</p>
                  </div>
                </div>
                <hr className="border-border" />
                <div>
                  <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-1">Delivery</h3>
                  <p className="text-neutral-800 capitalize">{state.location.deliveryType} — {[state.location.address, state.location.city, state.location.state, state.location.country].filter(Boolean).join(', ')}</p>
                  {state.requestedDate && <p className="text-sm text-neutral-500 mt-1">Requested by: {state.requestedDate}</p>}
                </div>
                <hr className="border-border" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-1">Contact</h3>
                    <p className="text-neutral-800">{state.contact.firstName} {state.contact.lastName}</p>
                    <p className="text-sm text-neutral-500">{state.contact.email}</p>
                    {state.contact.phone && <p className="text-sm text-neutral-500">{state.contact.phone}</p>}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-1">Organisation</h3>
                    <p className="text-neutral-800">{state.organisation.name}</p>
                    {state.organisation.industry && <p className="text-sm text-neutral-500 capitalize">{state.organisation.industry}</p>}
                  </div>
                </div>
                {state.notes && (
                  <>
                    <hr className="border-border" />
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-1">Additional Notes</h3>
                      <p className="text-neutral-700 text-sm whitespace-pre-wrap">{state.notes}</p>
                    </div>
                  </>
                )}
              </Card>

              {error && (
                <div className="mt-4 p-4 bg-error-light text-red-700 rounded-lg text-sm">{error}</div>
              )}
            </div>
          )}

          {/* STEP 8: Complete */}
          {step === 8 && submitted && (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-success-light flex items-center justify-center mx-auto mb-6">
                <Icon name="check" size={40} className="text-success" />
              </div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-3">Quote Request Submitted</h2>
              <p className="text-lg text-neutral-500 mb-2">Your reference number is:</p>
              <p className="text-2xl font-mono font-bold text-primary-700 mb-6">{reference}</p>
              <p className="text-neutral-500 mb-8 max-w-md mx-auto">
                Our sales team will review your requirements and respond with a detailed quote within one business day.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button href="/" variant="primary" size="lg">Return Home</Button>
                <Button href="/solutions/petroleum" variant="outline" size="lg">Explore More Solutions</Button>
              </div>
            </div>
          )}

          {/* Navigation */}
          {step < 8 && (
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
              <Button
                variant="ghost"
                size="md"
                onClick={() => setStep(s => Math.max(0, s - 1))}
                disabled={step === 0}
                icon={<Icon name="arrow-right" size={16} className="rotate-180" />}
              >
                Back
              </Button>

              {step === 7 ? (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={submitting}
                  icon={<Icon name="check" size={18} />}
                >
                  {submitting ? 'Submitting...' : 'Submit Quote Request'}
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setStep(s => Math.min(7, s + 1))}
                  disabled={!canProceed()}
                  iconRight={<Icon name="arrow-right" size={16} />}
                >
                  Continue
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default function QuotePage() {
  return (
    <Suspense fallback={<div className="min-h-screen gradient-dark" />}>
      <QuoteEngineInner />
    </Suspense>
  );
}
