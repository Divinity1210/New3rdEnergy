'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { ConciergeMessage } from '@/lib/types';

export default function ConciergePage() {
  const [messages, setMessages] = useState<ConciergeMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      content:
        'Hello! I am the **3rd Energy AI Product Concierge**. How can I help you today? Ask me about inverter ratings, lithium battery sizing, solar panel calculations, or equipment compatibility.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        { label: 'What battery works with 5kVA inverter?', actionType: 'prompt' },
        { label: 'Lithium vs Gel batteries difference?', actionType: 'prompt' },
        { label: 'How many panels to power 1.5HP AC?', actionType: 'prompt' },
        { label: 'How much can I save vs generator?', href: '/power/savings' },
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
          'I am uncertain about this specific configuration. For complex single/three-phase setups or custom generator synchronization, please **speak directly to a 3rd Energy technical specialist**.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          { label: 'Speak to an Engineer', href: '/contact' },
          { label: 'Browse Verified Catalogue', href: '/power/products' },
        ],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-neutral-950 text-white min-h-screen pt-32 pb-24 lg:pt-40">
      <div className="container-wide max-w-4xl">
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
            <Icon name="sparkles" size={14} />
            Verified Technical Intelligence
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-white">
            AI Product <span className="text-solar-400">Concierge.</span>
          </h1>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto">
            Get instant answers on equipment compatibility, voltages, and battery sizing bounded strictly by verified engineering data.
          </p>
        </div>

        {/* Chat Container */}
        <div className="rounded-lg bg-neutral-900/90 border border-white/10 backdrop-blur-md shadow-xl overflow-hidden flex flex-col h-[640px]">
          {/* Top Chat Bar */}
          <div className="p-4 px-6 border-b border-white/10 bg-neutral-950/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                <Icon name="sparkles" size={18} />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-white">3rd Energy Concierge</h3>
                <span className="text-[10px] text-green-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Online · Verified Knowledge Base
                </span>
              </div>
            </div>

            <Link
              href="/contact"
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold border border-white/10 transition-colors"
            >
              Contact Specialist
            </Link>
          </div>

          {/* Messages Flow */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0 mt-1">
                    <Icon name="sparkles" size={14} />
                  </div>
                )}

                <div
                  className={`max-w-xl rounded-lg p-4 text-xs leading-relaxed space-y-3 ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-primary-600 to-amber-500 text-white font-medium shadow-lg shadow-primary-950/40 rounded-tr-none'
                      : 'bg-white/[0.04] border border-white/10 text-neutral-200 rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-line prose-invert">
                    {msg.content}
                  </div>

                  {/* Suggested Action Chips */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
                      {msg.suggestedActions.map((act, i) =>
                        act.href ? (
                          <Link
                            key={i}
                            href={act.href}
                            className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[11px] font-semibold text-solar-300 border border-solar-500/20 transition-colors flex items-center gap-1"
                          >
                            <span>{act.label}</span>
                            <Icon name="arrow-up-right" size={10} />
                          </Link>
                        ) : (
                          <button
                            key={i}
                            onClick={() => sendMessage(act.label)}
                            className="px-3 py-1 rounded-full bg-purple-500/10 hover:bg-purple-500/20 text-[11px] font-semibold text-purple-300 border border-purple-500/30 transition-colors"
                          >
                            {act.label}
                          </button>
                        )
                      )}
                    </div>
                  )}

                  <span className="text-[9px] text-neutral-500 block text-right">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 items-center text-xs text-neutral-400">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
                  <Icon name="sparkles" size={14} />
                </div>
                <div className="p-3 rounded-lg bg-white/[0.04] border border-white/10 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
                  <span>Checking equipment specs...</span>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="p-4 border-t border-white/10 bg-neutral-950/80 flex items-center gap-3"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask a technical equipment question..."
              className="flex-1 px-4 py-3 rounded-xl bg-neutral-900 border border-white/15 text-white text-xs placeholder:text-neutral-500 focus:border-amber-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="p-3 rounded-xl bg-gradient-to-r from-primary-600 to-amber-500 text-white hover:opacity-95 disabled:opacity-30 transition-opacity"
              aria-label="Send query"
            >
              <Icon name="arrow-right" size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
