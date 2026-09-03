import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Scale, 
  FileText, 
  Volume2, 
  RefreshCw, 
  ArrowRight,
  ShieldCheck,
  Languages
} from 'lucide-react';
import { SubsidiaryCode } from '../types';

interface MiningCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  selectedSubsidiary: SubsidiaryCode;
  currentLanguage: 'en' | 'hi' | 'bn';
  onLanguageChange: (lang: 'en' | 'hi' | 'bn') => void;
}

interface ChatMessage {
  id: string;
  sender: 'USER' | 'COPILOT';
  text: string;
  timestamp: string;
  citations?: string[];
  suggestedAction?: string;
}

export const MiningCopilotModal: React.FC<MiningCopilotModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
  selectedSubsidiary,
  currentLanguage,
  onLanguageChange,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'COPILOT',
      text: `Namaste. I am **MineSync AI Statutory Copilot**, trained on the Indian Mines Act 1952, Coal Mines Regulations (CMR) 2017, Mines Rules 1955, CPCB Environmental Guidelines, and DGMS Circulars.\n\nHow may I assist you with statutory compliance, hazard defense strategy, or regulatory filings today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      citations: ['Mines Act 1952', 'CMR 2017', 'Mines Rules 1955']
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialQuery && isOpen) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const quickPrompts = [
    { label: 'CMR 2017 Reg 106 (Bench Slope Ratios)', text: 'Explain CMR 2017 Regulation 106 regarding slope stability, bench height, and OB dump safety angle of repose.' },
    { label: 'Draft DGMS Section 22 Reply', text: 'Draft a formal statutory compliance reply to DGMS Eastern Zone for a Section 22 notice regarding haul road berm heights.' },
    { label: 'Methane (CH4) Threshold Rules', text: 'What are the permissible limits and emergency withdrawal protocols for inflammable gas (CH4) under CMR 2017?' },
    { label: 'Mines Rules 1955 Form B & PME', text: 'What are the statutory mandates for contract worker Form B registration and 5-year Periodic Medical Examinations (PME)?' }
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = textToSend || query;
    if (!prompt.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'USER',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: prompt,
          language: currentLanguage,
          subsidiary: selectedSubsidiary,
          conversationHistory: messages.slice(-6).map(m => ({ role: m.sender === 'USER' ? 'user' : 'model', content: m.text }))
        })
      });

      const data = await response.json();

      // Handle API errors
      if (!response.ok || data.error) {
        const errorMsg = data.error || `API Error: ${response.status}`;
        const isRateLimit = response.status === 503 || errorMsg.includes('high demand');
        
        const botMsg: ChatMessage = {
          id: `bot-err-${Date.now()}`,
          sender: 'COPILOT',
          text: isRateLimit 
            ? `⚠️ **Gemini API Temporarily Unavailable**\n\nThe AI service is experiencing high demand. This is usually temporary. Please try your query again in a few moments.\n\n*Fallback: You can still review CMR 2017, Mines Act 1952, and DGMS guidelines in the Statutory Compliance Vault.*`
            : `⚠️ **Service Error**\n\n${errorMsg}\n\nPlease try again or contact support.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          citations: ['Mines Act 1952', 'CMR 2017']
        };

        setMessages(prev => [...prev, botMsg]);
        setLoading(false);
        return;
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'COPILOT',
        text: data.reply || data.answer || 'Apologies, unable to parse statutory guidance.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: data.legalReferences || data.citations || ['Mines Act 1952', 'CMR 2017'],
        suggestedAction: data.suggestedActions?.[0] || data.suggestedAction
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'COPILOT',
          text: `⚠️ **Network Error**\n\nUnable to reach the AI service. Please check your connection and try again.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          citations: ['Mines Act 1952']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 md:p-6 animate-fade-in">
      <div className="w-full max-w-3xl h-[650px] max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 font-black">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-100">
                  MineSync Statutory & Mining Law Copilot
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Gemini 3.7 Flash
                </span>
              </div>
              <p className="text-xs text-slate-400">
                DGMS, CMR 2017, CPCB & Indian Coal Mining Regulations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-lg p-1 text-xs">
              <Languages className="w-3.5 h-3.5 text-slate-400 ml-1" />
              <select
                value={currentLanguage}
                onChange={(e) => onLanguageChange(e.target.value as any)}
                className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer pr-1"
              >
                <option value="en" className="bg-slate-900">English</option>
                <option value="hi" className="bg-slate-900">हिन्दी (Hindi)</option>
                <option value="bn" className="bg-slate-900">বাংলা (Bengali)</option>
              </select>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Statutory Queries Bar */}
        <div className="bg-slate-950/40 px-4 py-2 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          <span className="text-[11px] text-slate-400 whitespace-nowrap">Suggested:</span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p.text)}
              className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] whitespace-nowrap border border-slate-700 transition-colors cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'COPILOT' && (
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[82%] rounded-2xl p-4 text-xs leading-relaxed ${
                  msg.sender === 'USER'
                    ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none space-y-2'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Citations Footer for Copilot answers */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400">
                    <span className="font-semibold text-slate-400">Legal Citations:</span>
                    {msg.citations.map((c, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-400/90 font-mono">
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {msg.sender === 'USER' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl rounded-tl-none p-3.5 text-xs text-slate-400 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>Consulting CMR 2017 & DGMS Directives with Gemini 3.7 Flash...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about CMR 2017, Mines Act 1952, DGMS compliance defense, or penalty rules..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask Copilot</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
