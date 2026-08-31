'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';
import { quantityUnits } from '@/lib/data/petroleum-products';

interface InlineQuoteFormProps {
  productId?: string;
  productName?: string;
  onClose?: () => void;
}

const nigerianStates = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT Abuja', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
  'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
];

export default function InlineQuoteForm({ productId, productName, onClose }: InlineQuoteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    product: productId || '',
    quantity: '',
    unit: 'litres',
    state: '',
    urgency: 'standard',
    name: '',
    phone: '',
    email: '',
    company: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const nameParts = formData.name.trim().split(' ');
      const firstName = nameParts[0] || formData.name;
      const lastName = nameParts.slice(1).join(' ') || '';

      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact: {
            firstName,
            lastName,
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            preferredContact: 'phone',
          },
          organisation: {
            name: formData.company.trim() || `${formData.name}'s Facility`,
            industry: 'Petroleum Customer',
          },
          products: [
            {
              productId: productId || 'petroleum-generic',
              productName: productName || 'Petroleum Product',
              category: 'fuel-supply',
            },
          ],
          quantity: {
            value: Number(formData.quantity) || 1,
            unit: formData.unit,
          },
          location: {
            address: formData.state,
            city: formData.state,
            state: formData.state,
            country: 'Nigeria',
            deliveryType: 'standard',
          },
          deliveryRequirement: `Urgency: ${formData.urgency}. State: ${formData.state}.`,
          requestedDate: new Date().toISOString().split('T')[0],
          urgency: formData.urgency === 'emergency' ? 'high' : formData.urgency === 'urgent' ? 'high' : 'medium',
          notes: `[Petroleum Product Quote]\nProduct: ${productName || productId}\nQuantity: ${formData.quantity} ${formData.unit}\nUrgency: ${formData.urgency}\nState: ${formData.state}\nNotes: ${formData.notes || 'None'}`,
          source: 'petroleum_product_inline_quote',
        }),
      });
    } catch (err) {
      console.error('Quote submission error:', err);
    } finally {
      setIsSuccess(true);
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-[#0d1a0d] border border-emerald-800/40 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
          <Icon name="check" size={28} className="text-emerald-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Quote Request Submitted</h3>
        <p className="text-white/50 text-sm mb-6 max-w-sm mx-auto">
          Our sales team will review your requirements and contact you within 2 business hours with a detailed quotation.
        </p>
        <button
          onClick={() => { setIsSuccess(false); setFormData({ ...formData, quantity: '', notes: '' }); }}
          className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="bg-[#111111] border border-white/[0.06] rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/[0.06] flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">
            Request a Quote
            {productName && <span className="text-white/40 font-normal"> — {productName}</span>}
          </h3>
          <p className="text-xs text-white/30 mt-1">Complete the form below and our team will respond within 2 hours.</p>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors p-1">
            <Icon name="x" size={18} />
          </button>
        )}
      </div>

      <div className="p-6 space-y-5">
        {/* Quantity & Unit */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-white/50 mb-2">Quantity Required</label>
            <input
              type="text"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="e.g. 10,000"
              required
              className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/50 mb-2">Unit</label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all appearance-none cursor-pointer"
            >
              {quantityUnits.map(u => (
                <option key={u.id} value={u.id} className="bg-[#1a1a1a]">{u.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Delivery Location & Urgency */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-white/50 mb-2">Delivery State</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all appearance-none cursor-pointer"
            >
              <option value="" className="bg-[#1a1a1a]">Select state</option>
              {nigerianStates.map(s => (
                <option key={s} value={s} className="bg-[#1a1a1a]">{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-white/50 mb-2">Delivery Urgency</label>
            <select
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all appearance-none cursor-pointer"
            >
              <option value="standard" className="bg-[#1a1a1a]">Standard (48-72hrs)</option>
              <option value="urgent" className="bg-[#1a1a1a]">Urgent (24hrs)</option>
              <option value="emergency" className="bg-[#1a1a1a]">Emergency (Same day)</option>
            </select>
          </div>
        </div>

        {/* Contact Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-white/50 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Adeyemi"
              required
              className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/50 mb-2">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+234..."
              required
              className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-white/50 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@company.com"
              required
              className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/50 mb-2">Company Name</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Your company"
              className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-medium text-white/50 mb-2">Additional Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Delivery schedule preferences, special requirements..."
            className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all resize-none"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="px-6 py-4 border-t border-white/[0.06] flex items-center justify-between">
        <p className="text-[11px] text-white/20">Response within 2 business hours</p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200 shadow-lg shadow-red-600/20"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Submitting...
            </>
          ) : (
            <>
              <Icon name="zap" size={14} />
              Submit Quote Request
            </>
          )}
        </button>
      </div>
    </form>
  );
}
