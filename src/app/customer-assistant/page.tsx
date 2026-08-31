'use client';

import React, { useState, useRef, useEffect } from 'react';

interface ChatMessage {
  id: string;
  sender: 'customer' | 'assistant';
  content: string;
  confidence?: number;
  sources?: { title: string; type: string }[];
  suggestedActions?: { label: string; href?: string }[];
  timestamp: string;
}

export default function CustomerAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Welcome message
    setMessages([{
      id: 'welcome',
      sender: 'assistant',
      content: 'Hello! I\'m the 3rd Energy AI Assistant. I can help you with questions about our petroleum products, power & solar solutions, installation services, and more. What would you like to know?',
      suggestedActions: [
        { label: 'Browse Products', href: '/power/products' },
        { label: 'Request a Quote', href: '/quote' },
        { label: 'Contact Us', href: '/contact' },
      ],
      timestamp: new Date().toISOString(),
    }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'customer',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/customer/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMessage.content }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, data.message]);
      } else {
        setMessages(prev => [...prev, {
          id: `error_${Date.now()}`,
          sender: 'assistant',
          content: 'I apologise, but I\'m having trouble processing your request. Please try again or contact our team directly.',
          timestamp: new Date().toISOString(),
        }]);
      }
    } catch {
      setMessages(prev => [...prev, {
        id: `error_${Date.now()}`,
        sender: 'assistant',
        content: 'Connection error. Please check your internet and try again.',
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="customer-assistant-page">
      <div className="customer-assistant-container">
        {/* Header */}
        <div className="customer-assistant-header">
          <div className="customer-assistant-logo">
            <span className="customer-assistant-icon">⚡</span>
            <div>
              <h1 className="customer-assistant-title">3rd Energy AI Assistant</h1>
              <p className="customer-assistant-subtitle">Powered by our knowledge base • Ask about products, services, or installation</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="customer-assistant-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`customer-msg ${msg.sender === 'customer' ? 'customer-msg-user' : 'customer-msg-assistant'}`}>
              <div className="customer-msg-bubble">
                <p className="customer-msg-content">{msg.content}</p>

                {/* Sources */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="customer-msg-sources">
                    {msg.sources.map((source, i) => (
                      <span key={i} className={`customer-source-tag customer-source-${source.type}`}>
                        {source.type === 'verified' ? '✓' : source.type === 'educational' ? '📚' : '❓'} {source.title}
                      </span>
                    ))}
                  </div>
                )}

                {/* Suggested Actions */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="customer-msg-actions">
                    {msg.suggestedActions.map((action, i) => (
                      <a key={i} href={action.href || '#'} className="customer-action-btn">
                        {action.label}
                      </a>
                    ))}
                  </div>
                )}

                {/* Confidence */}
                {msg.confidence !== undefined && (
                  <span className="customer-msg-confidence">
                    {Math.round(msg.confidence * 100)}% confidence
                  </span>
                )}
              </div>
              <span className="customer-msg-time">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}

          {loading && (
            <div className="customer-msg customer-msg-assistant">
              <div className="customer-msg-bubble customer-msg-typing">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="customer-assistant-input">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about products, installation, delivery..."
            className="customer-input-field"
            disabled={loading}
            maxLength={500}
          />
          <button type="submit" disabled={loading || !input.trim()} className="customer-send-btn">
            {loading ? '...' : '→'}
          </button>
        </form>
      </div>
    </div>
  );
}
