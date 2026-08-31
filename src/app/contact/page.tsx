'use client';

import React, { useState } from 'react';
import { Card, Breadcrumbs } from '@/components/ui/components';
import { Button } from '@/components/ui/components';
import { Icon } from '@/components/ui/Icon';
import { COMPANY_EMAIL, COMPANY_PHONE } from '@/lib/data/navigation';
import { getWhatsAppUrl } from '@/lib/utils';
import { ContactFormData } from '@/lib/types';

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '', lastName: '', email: '', phone: '',
    organisation: '', subject: '', message: '', preferredContact: 'email',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Submission failed');

      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again or contact us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="bg-[#0a0a0a] pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className="container-wide">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Contact' }]} />
          <div className="max-w-2xl mt-4">
            <p className="label-text-light mb-5">Contact</p>
            <h1 className="display-xl text-white mb-5">
              Let&apos;s Talk Energy.
            </h1>
            <p className="text-base text-white/40 leading-relaxed max-w-lg">
              Whether you have a specific requirement or want to explore how we can support your business — we&apos;re here to help.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-wide">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <Card padding="lg" className="text-center">
                  <div className="w-16 h-16 rounded-full bg-success-light flex items-center justify-center mx-auto mb-4">
                    <Icon name="check" size={32} className="text-success" />
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-3">Message Sent</h2>
                  <p className="text-neutral-500 mb-6">Thank you for getting in touch. Our team will respond within one business day.</p>
                  <Button href="/" variant="outline" size="md">Return Home</Button>
                </Card>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-firstName" className="block text-sm font-semibold text-neutral-700 mb-1.5">First Name *</label>
                      <input id="contact-firstName" name="firstName" type="text" required value={formData.firstName} onChange={handleChange} className="w-full px-4 py-3 rounded-md border border-border bg-white text-neutral-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition" placeholder="First name" />
                    </div>
                    <div>
                      <label htmlFor="contact-lastName" className="block text-sm font-semibold text-neutral-700 mb-1.5">Last Name *</label>
                      <input id="contact-lastName" name="lastName" type="text" required value={formData.lastName} onChange={handleChange} className="w-full px-4 py-3 rounded-md border border-border bg-white text-neutral-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition" placeholder="Last name" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-email" className="block text-sm font-semibold text-neutral-700 mb-1.5">Email *</label>
                      <input id="contact-email" name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-md border border-border bg-white text-neutral-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition" placeholder="you@company.com" />
                    </div>
                    <div>
                      <label htmlFor="contact-phone" className="block text-sm font-semibold text-neutral-700 mb-1.5">Phone</label>
                      <input id="contact-phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-md border border-border bg-white text-neutral-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition" placeholder="+44 000 000 0000" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contact-organisation" className="block text-sm font-semibold text-neutral-700 mb-1.5">Organisation</label>
                    <input id="contact-organisation" name="organisation" type="text" value={formData.organisation} onChange={handleChange} className="w-full px-4 py-3 rounded-md border border-border bg-white text-neutral-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition" placeholder="Company name" />
                  </div>
                  <div>
                    <label htmlFor="contact-subject" className="block text-sm font-semibold text-neutral-700 mb-1.5">Subject *</label>
                    <select id="contact-subject" name="subject" required value={formData.subject} onChange={handleChange} className="w-full px-4 py-3 rounded-md border border-border bg-white text-neutral-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition">
                      <option value="">Select a subject</option>
                      <option value="petroleum-enquiry">Petroleum Enquiry</option>
                      <option value="power-solar-enquiry">Power & Solar Enquiry</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="general">General Enquiry</option>
                      <option value="support">Support</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-semibold text-neutral-700 mb-1.5">Message *</label>
                    <textarea id="contact-message" name="message" required rows={5} value={formData.message} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-border bg-white text-neutral-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition resize-y" placeholder="Tell us how we can help..." />
                  </div>
                  <div>
                    <label htmlFor="contact-preferredContact" className="block text-sm font-semibold text-neutral-700 mb-1.5">Preferred Contact Method</label>
                    <select id="contact-preferredContact" name="preferredContact" value={formData.preferredContact} onChange={handleChange} className="w-full px-4 py-3 rounded-md border border-border bg-white text-neutral-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition">
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                  </div>

                  {error && (
                    <div className="p-4 bg-error-light text-red-700 rounded-lg text-sm">{error}</div>
                  )}

                  <Button type="submit" variant="primary" size="lg" fullWidth disabled={submitting}>
                    {submitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              )}
            </div>

            {/* Contact Sidebar */}
            <aside className="space-y-6">
              <Card padding="lg" className="bg-surface-muted">
                <h3 className="font-bold text-neutral-800 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <a href={`mailto:${COMPANY_EMAIL}`} className="flex items-start gap-3 text-sm text-neutral-600 hover:text-primary-600 transition-colors">
                    <Icon name="mail" size={18} className="text-primary-500 mt-0.5 shrink-0" />
                    <span>{COMPANY_EMAIL}</span>
                  </a>
                  <a href={`tel:${COMPANY_PHONE}`} className="flex items-start gap-3 text-sm text-neutral-600 hover:text-primary-600 transition-colors">
                    <Icon name="phone" size={18} className="text-primary-500 mt-0.5 shrink-0" />
                    <span>{COMPANY_PHONE}</span>
                  </a>
                  <a href={getWhatsAppUrl('Hello 3rd Energy, I would like to get in touch.')} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-sm text-neutral-600 hover:text-green-600 transition-colors">
                    <Icon name="whatsapp" size={18} className="text-green-500 mt-0.5 shrink-0" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </Card>

              <Card padding="lg" className="bg-primary-50 border-primary-100">
                <h3 className="font-bold text-neutral-800 mb-3">Need a Quote?</h3>
                <p className="text-sm text-neutral-600 mb-4">For structured quote requests with specific product, quantity, and delivery requirements, use our dedicated quote engine.</p>
                <Button href="/quote" variant="primary" size="sm" fullWidth iconRight={<Icon name="arrow-right" size={14} />}>
                  Request a Quote
                </Button>
              </Card>

              <Card padding="lg">
                <h3 className="font-bold text-neutral-800 mb-3">Business Hours</h3>
                <div className="space-y-2 text-sm text-neutral-600">
                  {/* PLACEHOLDER: Verify actual business hours */}
                  <div className="flex justify-between"><span>Monday – Friday</span><span className="font-medium">8:00 – 18:00</span></div>
                  <div className="flex justify-between"><span>Saturday</span><span className="font-medium">9:00 – 14:00</span></div>
                  <div className="flex justify-between"><span>Sunday</span><span className="text-neutral-400">Closed</span></div>
                </div>
              </Card>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
