'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { ConciergeMessage } from '@/lib/types';
import { getWhatsAppUrl } from '@/lib/utils';

export default function ConciergePage() {
  const [messages, setMessages] = useState<ConciergeMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      content:
        'Hello! I am the **3RD Energy Services Ltd Technical AI Concierge**. How can I assist you today? Ask me about inverter sizing, LiFePO4 battery capacity, portable power banks, or appliance load calculations.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        { label: 'What battery works with 5kVA inverter?', actionType: 'prompt' },
        { label: 'Laptop power bank specs & runtime?', actionType: 'prompt' },
        { label: 'How many panels to power 1.5HP AC?', actionType: 'prompt' },
        { label: 'Diesel vs Solar Savings Calculator', href: '/power/savings' },
      ],
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    const userMsg: ConciergeMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/power/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to get answer.');
      }

      const botMsg: ConciergeMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        content: data.response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: data.response.suggestedActions,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const fallbackMsg: ConciergeMessage = {
        id: `bot-fallback-${Date.now()}`,
        sender: 'assistant',
        content:
          'For complex commercial 3-phase setups or custom generator synchronization, please **chat directly with our certified solar engineers**.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          { label: 'WhatsApp Engineer (+234 1 234 5680)', href: getWhatsAppUrl('Hello 3RD Energy Services Ltd, I need technical engineering advice.') },
          { label: 'Browse Store Equipment', href: '/power/products' },
        ],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen pt-32 pb-24 lg:pt-40">
      <div className="container-wide max-w-4xl">
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-sm">
            <Icon name="sparkles" size={14} className="text-emerald-600" />
            3RD ENERGY SERVICES LTD · AI TECHNICAL CONCIERGE
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-950 tracking-tight">
            AI Engineering <span className="text-emerald-700">Concierge.</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Get instant verified answers on equipment compatibility, voltages, portable power banks, and battery sizing.
          </p>
        </div>

        {/* Chat Container */}
        <div className="rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden flex flex-col h-[640px]">
          {/* Top Chat Bar */}
          <div className="p-4 px-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Icon name="sparkles" size={18} />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-slate-950">3RD Energy AI Assistant</h3>
                <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online · Verified OEM Knowledge Base
                </span>
              </div>
            </div>

            <a
              href={getWhatsAppUrl('Hello 3RD Energy Services Ltd, I need technical solar advice.')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Icon name="whatsapp" size={14} />
              WhatsApp Desk
            </a>
          </div>

          {/* Messages Flow */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#fafafa]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-1 shadow-sm font-bold">
                    <Icon name="sparkles" size={14} />
                  </div>
                )}

                <div
                  className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed space-y-3 shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white font-medium rounded-tr-none'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-line leading-relaxed">
                    {msg.content}
                  </div>

                  {/* Suggested Action Chips */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                      {msg.suggestedActions.map((act, i) =>
                        act.href ? (
                          <Link
                            key={i}
                            href={act.href}
                            className="px-3 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[11px] font-bold text-emerald-800 border border-emerald-200 transition-colors flex items-center gap-1"
                          >
                            <span>{act.label}</span>
                            <Icon name="arrow-right" size={10} />
                          </Link>
                        ) : (
                          <button
                            key={i}
                            onClick={() => sendMessage(act.label)}
                            className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                          >
                            {act.label}
                          </button>
                        )
                      )}
                    </div>
                  )}

                  <span className={`text-[9px] block text-right font-mono ${msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Icon name="loader" size={14} className="animate-spin text-emerald-600" />
                Engineering intelligence is analyzing your query...
              </div>
            )}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="p-4 bg-white border-t border-slate-100 flex items-center gap-3"
          >
            <input
              type="text"
              placeholder="Ask an engineering question (e.g. Can 5kVA run my 1.5HP Inverter AC?)..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-600/20 disabled:opacity-50 cursor-pointer"
            >
              <span>Send</span>
              <Icon name="arrow-right" size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
