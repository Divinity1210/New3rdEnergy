'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { formatCurrency, getWhatsAppUrl } from '@/lib/utils';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  suggestedActions?: { label: string; href?: string; actionType?: string; payload?: any }[];
  richCard?: any;
  timestamp: string;
}

export function ConciergeAssistant() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showProactivePill, setShowProactivePill] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [division, setDivision] = useState<'all' | 'petroleum' | 'solar'>('all');

  // Input & Messaging states
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // In-Chat Booking / RFQ Modal State
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingProduct, setBookingProduct] = useState('Automotive Gas Oil (AGO Diesel)');
  const [bookingDivision, setBookingDivision] = useState<'petroleum' | 'power'>('petroleum');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingFormData, setBookingFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    company: '',
    location: 'Lagos, Nigeria',
    quantity: '33,000 Litres',
    notes: '',
  });

  // Auto-detect division from current URL pathname
  useEffect(() => {
    if (pathname.includes('/petroleum')) {
      setDivision('petroleum');
    } else if (pathname.includes('/power') || pathname.includes('/solutions/power-solar')) {
      setDivision('solar');
    } else {
      setDivision('all');
    }
  }, [pathname]);

  // Initial welcome message based on division
  useEffect(() => {
    const welcomeByDivision: Record<string, string> = {
      petroleum:
        '👋 Welcome to **3RD Energy Services Ltd Petroleum Desk**! I can provide instant bulk fuel pricing (AGO Diesel, PMS Petrol), bridging tanker quotes (33kL/45kL), quality specifications, or book a delivery order. How can I assist you?',
      solar:
        '☀️ Welcome to **3RD Energy Services Ltd Solar & Power Concierge**! I can size a solar hybrid system for your home or business, recommend fast-charge laptop power banks, or book a certified installation site audit. What are you looking to power today?',
      all:
        '👋 Hello! I am the **3RD Energy Services Ltd 24/7 AI Concierge**. I assist with both **Bulk Petroleum Supply** and **Solar Inverter & Portable Power Solutions**. How can I assist your home or business today?',
    };

    const initialActions: Record<string, any[]> = {
      petroleum: [
        { label: '⛽ Get AGO Diesel Quote (33,000L)', actionType: 'open_rfq', payload: { division: 'petroleum', product: 'Automotive Gas Oil (AGO Diesel)' } },
        { label: '🔬 Check Diesel Lab Quality Specs', href: '/solutions/petroleum/quality' },
        { label: '🚚 Bulk Fuel Logistics Calculator', href: '/solutions/petroleum/calculator' },
      ],
      solar: [
        { label: '⚡ Size Solar for My 3-Bedroom Home', href: '/power/planner' },
        { label: '🔋 Find Laptop Power Bank for MacBook', href: '/power/products?category=power-stations' },
        { label: '🏡 View 5kVA Executive Solar Package', href: '/power/products/5kva-executive-home-package' },
        { label: '🛠️ Book a Certified Solar Site Audit', actionType: 'open_rfq', payload: { division: 'power', product: 'Solar Site Audit & Sizing Inspection' } },
      ],
      all: [
        { label: '⛽ Get Bulk Diesel Quote', actionType: 'open_rfq', payload: { division: 'petroleum', product: 'Automotive Gas Oil (AGO Diesel)' } },
        { label: '☀️ Size Solar for My Home', href: '/power/planner' },
        { label: '🔋 Shop Portable Power Banks', href: '/power/products' },
      ],
    };

    setMessages([
      {
        id: 'msg-init',
        sender: 'assistant',
        content: welcomeByDivision[division] || welcomeByDivision.all,
        suggestedActions: initialActions[division] || initialActions.all,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [division]);

  // Proactive invitation bubble popup after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasInteracted && !isOpen) {
        setShowProactivePill(true);
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [hasInteracted, isOpen]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, showBookingForm]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    setHasInteracted(true);
    setShowProactivePill(false);
    setInputMessage('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          division,
          context: { currentPath: pathname },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to get response');

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        content: data.response || 'I am ready to assist with your quote or booking inquiry.',
        suggestedActions: data.suggestedActions || [],
        richCard: data.richCard,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'assistant',
          content:
            'I experienced a connection interruption. You can speak directly with our engineering trading desk right now on WhatsApp (+234 1 234 5680).',
          suggestedActions: [
            {
              label: '💬 Chat on WhatsApp Desk',
              href: getWhatsAppUrl('Hello 3RD Energy Services Ltd, I need assistance with an energy quote.'),
            },
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit in-chat RFQ / Booking Form
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingFormData.customerName || !bookingFormData.phone || !bookingFormData.email) {
      alert('Please fill in your name, phone number, and email.');
      return;
    }

    setIsSubmittingBooking(true);
    try {
      const res = await fetch('/api/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingPayload: {
            ...bookingFormData,
            division: bookingDivision,
            product: bookingProduct,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Booking failed.');

      setShowBookingForm(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `booking-success-${Date.now()}`,
          sender: 'assistant',
          content: data.message,
          suggestedActions: [
            { label: '💬 Open WhatsApp with Reference', href: data.whatsAppUrl },
            { label: 'Explore Hardware Store', href: '/power/products' },
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      alert(err.message || 'Error submitting booking.');
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const openBookingModal = (div: 'petroleum' | 'power', prod: string) => {
    setBookingDivision(div);
    setBookingProduct(prod);
    setShowBookingForm(true);
  };

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      {/* ─────────────────────────────────────────────────────────────
          1. PROACTIVE INVITATION BUBBLE
      ───────────────────────────────────────────────────────────── */}
      {showProactivePill && !isOpen && (
        <div className="mb-3 max-w-[290px] sm:max-w-[320px] p-3.5 rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-2xl animate-fade-in flex items-start gap-3 relative">
          <button
            onClick={() => setShowProactivePill(false)}
            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 p-0.5"
            aria-label="Close"
          >
            <Icon name="x" size={13} />
          </button>
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold mt-0.5 shadow-sm">
            <Icon name="zap" size={16} />
          </div>
          <div className="pr-3">
            <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block font-mono">
              3E AI Energy Concierge
            </span>
            <p className="text-xs text-slate-700 font-medium leading-snug mt-0.5">
              Need an instant <strong>fuel quote</strong> or <strong>solar system sizing</strong>? Tap here to calculate or book!
            </p>
            <button
              onClick={() => {
                setIsOpen(true);
                setShowProactivePill(false);
                setHasInteracted(true);
              }}
              className="mt-2 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Start Quick Consultation</span>
              <Icon name="arrow-right" size={12} />
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. FLOATING TRIGGER BUTTON
      ───────────────────────────────────────────────────────────── */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setShowProactivePill(false);
            setHasInteracted(true);
          }}
          className="group relative flex items-center gap-2.5 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-slate-950 text-white hover:bg-slate-900 transition-all shadow-2xl hover:scale-105 border border-emerald-500/50 cursor-pointer"
          aria-label="Open 3E AI Concierge Assistant"
        >
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950" />
          
          <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center font-bold">
            <Icon name="zap" size={15} />
          </div>
          <div className="text-left hidden sm:block">
            <span className="text-[10px] font-mono text-emerald-400 block leading-none font-bold">24/7 AI DESK</span>
            <span className="text-xs font-bold font-heading">Energy Concierge</span>
          </div>
        </button>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. FULL CONCIERGE DIALOG WINDOW
      ───────────────────────────────────────────────────────────── */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[420px] h-[580px] sm:h-[640px] max-h-[85vh] rounded-3xl bg-white border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-scale-up z-50">
          {/* Header */}
          <div className="p-4 bg-slate-950 text-white flex flex-col gap-2.5 border-b border-slate-800 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm">
                  <Icon name="zap" size={17} />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-sm text-white leading-tight">
                    3RD Energy AI Concierge
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-mono text-emerald-300 font-bold">
                      Online • Trading & Engineering Desk
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close Assistant"
              >
                <Icon name="x" size={16} />
              </button>
            </div>

            {/* Division Switcher Pills */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/90 text-[11px] font-bold">
              {[
                { id: 'all', label: '⚡ All Services' },
                { id: 'petroleum', label: '⛽ Bulk Petroleum' },
                { id: 'solar', label: '☀️ Solar & Power' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDivision(tab.id as any)}
                  className={`flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                    division === tab.id
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#f8fafc]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none font-medium'
                      : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.content}</div>

                  {/* Rich Card Component inside Chat (if present) */}
                  {msg.richCard && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      {msg.richCard.type === 'petroleum_quote' && (
                        <div>
                          <span className="text-[10px] font-bold text-emerald-800 uppercase font-mono block">
                            Indicative Rate Card
                          </span>
                          <span className="font-bold text-slate-950 block text-xs mt-0.5">
                            {msg.richCard.product}
                          </span>
                          <div className="grid grid-cols-2 gap-2 mt-2 text-[11px]">
                            {msg.richCard.standardVolumes.map((sv: any, i: number) => (
                              <div key={i} className="p-2 rounded-lg bg-white border border-slate-200 font-mono">
                                <span className="text-slate-500 block text-[9px]">{sv.volume}</span>
                                <span className="font-bold text-slate-950">{formatCurrency(sv.total)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {msg.richCard.type === 'package_recommendation' && (
                        <div className="flex items-center gap-3">
                          <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                            <Image src={msg.richCard.image} alt={msg.richCard.title} fill className="object-cover" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-950 block text-xs">{msg.richCard.title}</span>
                            <span className="text-[10px] text-slate-500 block">{msg.richCard.specs}</span>
                            <span className="text-xs font-extrabold text-emerald-700 font-mono block mt-0.5">
                              {formatCurrency(msg.richCard.price)}
                            </span>
                          </div>
                        </div>
                      )}

                      {msg.richCard.type === 'product_recommendation' && (
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                            <Image src={msg.richCard.image} alt={msg.richCard.title} fill className="object-cover" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-950 block text-xs">{msg.richCard.title}</span>
                            <span className="text-xs font-extrabold text-emerald-700 font-mono block mt-0.5">
                              {formatCurrency(msg.richCard.price)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <span
                    className={`block text-[9px] mt-1.5 font-mono ${
                      msg.sender === 'user' ? 'text-emerald-100 text-right' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {/* Suggested Action Chips */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                    {msg.suggestedActions.map((act, idx) => {
                      if (act.actionType === 'open_rfq' || act.actionType === 'open_rfq_modal') {
                        return (
                          <button
                            key={idx}
                            onClick={() => openBookingModal(act.payload?.division || 'petroleum', act.payload?.product || 'Bulk Energy Requirement')}
                            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Icon name="file-text" size={11} className="text-emerald-600" />
                            {act.label}
                          </button>
                        );
                      }
                      if (act.href?.startsWith('http') || act.href?.startsWith('mailto')) {
                        return (
                          <a
                            key={idx}
                            href={act.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-bold transition-colors flex items-center gap-1 shadow-sm"
                          >
                            {act.label}
                            <Icon name="external-link" size={11} className="text-slate-400" />
                          </a>
                        );
                      }
                      return (
                        <Link
                          key={idx}
                          href={act.href || '#'}
                          onClick={() => setIsOpen(false)}
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-bold transition-colors flex items-center gap-1 shadow-sm"
                        >
                          {act.label}
                          <Icon name="arrow-right" size={11} className="text-slate-400" />
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            {/* Animated Typing Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-slate-200 w-fit text-xs text-slate-500 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-100" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-200" />
                <span className="text-[11px] font-mono ml-1">Analyzing requirement...</span>
              </div>
            )}

            {/* In-Chat Booking / RFQ Drawer Form */}
            {showBookingForm && (
              <div className="p-4 rounded-2xl bg-white border-2 border-emerald-500 shadow-lg space-y-3 animate-scale-up">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase font-mono">
                      Fast In-Chat Booking
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-1">
                      {bookingProduct}
                    </h4>
                  </div>
                  <button onClick={() => setShowBookingForm(false)} className="text-slate-400 p-1">
                    <Icon name="x" size={14} />
                  </button>
                </div>

                <form onSubmit={handleSubmitBooking} className="space-y-2.5 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase font-mono block">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={bookingFormData.customerName}
                      onChange={(e) => setBookingFormData({ ...bookingFormData, customerName: e.target.value })}
                      placeholder="e.g. Babatunde Alabi"
                      className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 uppercase font-mono block">Phone (WhatsApp) *</label>
                      <input
                        type="tel"
                        required
                        value={bookingFormData.phone}
                        onChange={(e) => setBookingFormData({ ...bookingFormData, phone: e.target.value })}
                        placeholder="+234 803 000 0000"
                        className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 uppercase font-mono block">Email *</label>
                      <input
                        type="email"
                        required
                        value={bookingFormData.email}
                        onChange={(e) => setBookingFormData({ ...bookingFormData, email: e.target.value })}
                        placeholder="client@company.ng"
                        className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase font-mono block">Delivery / Site Location *</label>
                    <input
                      type="text"
                      required
                      value={bookingFormData.location}
                      onChange={(e) => setBookingFormData({ ...bookingFormData, location: e.target.value })}
                      placeholder="e.g. Ikeja Industrial Estate, Lagos"
                      className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowBookingForm(false)}
                      className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingBooking}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md disabled:opacity-60 cursor-pointer"
                    >
                      {isSubmittingBooking ? 'Submitting...' : 'Submit to Desk →'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Prompt Chips */}
          <div className="p-2 px-3 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0">
            {[
              'Price of 33,000L Diesel?',
              'Size Solar for 3-Bedroom',
              'Laptop Power Bank cost?',
              'Book Solar Site Audit',
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium whitespace-nowrap transition-colors cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Bottom Chat Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                division === 'petroleum'
                  ? 'Ask for diesel quote, bridging rates, specs...'
                  : division === 'solar'
                  ? 'Ask about inverters, power banks, sizing...'
                  : 'Ask about fuel supply or solar solutions...'
              }
              className="flex-1 p-2.5 px-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all shadow-md shadow-emerald-600/20 shrink-0 cursor-pointer"
              aria-label="Send message"
            >
              <Icon name="arrow-right" size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
