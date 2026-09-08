import React from 'react';
import { ActiveView } from '../types';

interface PortalDirectoryViewProps {
  setActiveView: (view: ActiveView) => void;
  onOpenCopilot: () => void;
  onOpenDispatch: () => void;
  onOpenBlast: () => void;
}

interface ModuleItem {
  id: ActiveView;
  title: string;
  subtitle: string;
  category: 'cadre' | 'field' | 'legal';
  regulation: string;
  icon: string;
  badge: string;
  badgeColor: string;
  accentColor: string;
  description: string;
  metrics: { label: string; value: string };
  actionText: string;
}

export const PortalDirectoryView: React.FC<PortalDirectoryViewProps> = ({
  setActiveView,
  onOpenCopilot,
  onOpenDispatch,
  onOpenBlast
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<'all' | 'cadre' | 'field' | 'legal'>('all');

  const modules: ModuleItem[] = [
    {
      id: 'role-gateways',
      title: 'Role Gateway',
      subtitle: 'Statutory Role Gateways & Operational Command',
      category: 'cadre',
      regulation: 'CMR 2017 REG. 27, 29, 129, 130',
      icon: 'layers',
      badge: '6 Cadres Active',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      accentColor: 'from-amber-500/10 to-orange-500/5 border-amber-500/30 hover:border-amber-500/60',
      description: 'Access role-tailored consoles for DGMS Director, Mine Manager 1st Class, Colliery Inspector, Safety Officer, Mining Sardar, and Labour Sardar.',
      metrics: { label: 'Auth Method', value: 'DSC Token + SSO' },
      actionText: 'Access Role Gateways'
    },
    {
      id: 'officer-signin',
      title: 'Sign In',
      subtitle: 'Official Coal Mine / DGMS Officer Authentication',
      category: 'cadre',
      regulation: 'MINES ACT 1952 FORM-IV',
      icon: 'vpn_key',
      badge: 'FIPS 140-2 Level 3',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      accentColor: 'from-cyan-500/10 to-blue-500/5 border-cyan-500/30 hover:border-cyan-500/60',
      description: 'Secure biometric, PKI digital signature token, and MeriPehchan National SSO authentication gateway for statutory colliery officers.',
      metrics: { label: 'Security Level', value: 'Gov PKI 256-Bit' },
      actionText: 'Proceed to Sign In'
    },
    {
      id: 'cadre-onboarding',
      title: 'Cadre Registration',
      subtitle: 'Statutory Officer Profile Registration Dossier',
      category: 'cadre',
      regulation: 'CMR FORM 14-A REGISTRATION',
      icon: 'app_registration',
      badge: '4-Stage Protocol',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      accentColor: 'from-emerald-500/10 to-teal-500/5 border-emerald-500/30 hover:border-emerald-500/60',
      description: 'Official enrolment and verification pipeline for newly designated statutory mining officers, competency cert checks, and DGMS cadre integration.',
      metrics: { label: 'Prerequisites', value: 'DGMS Cert + PME' },
      actionText: 'Register New Cadre'
    },
    {
      id: 'statutory-vault',
      title: 'Statutory Vault (World)',
      subtitle: 'Colliery Statutory Compliance Vault & Legal Filings',
      category: 'legal',
      regulation: 'MINES ACT SEC. 22 & CMR 2017',
      icon: 'gavel',
      badge: 'Urgent Alert: FOS 1.18',
      badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40',
      accentColor: 'from-red-500/10 to-amber-500/5 border-red-500/30 hover:border-red-500/60',
      description: 'Central legal repository for shift safety registers, slope radar telemetry, stop-work liability notices under Section 22, and gas calibration dockets.',
      metrics: { label: 'Pending Filings', value: '3 Active Dockets' },
      actionText: 'Open Statutory Vault'
    },
    {
      id: 'mobile-inspector',
      title: 'Mobile Inspector',
      subtitle: 'Mobile Field Inspector v4.2 PRO (In-Pit Optical & GPS HUD)',
      category: 'field',
      regulation: 'DGMS IS-CLASS CERTIFIED',
      icon: 'phonelink_setup',
      badge: 'NavIC Lock ±0.8m',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      accentColor: 'from-blue-500/10 to-cyan-500/5 border-blue-500/30 hover:border-blue-500/60',
      description: 'Intrinsic safe field inspection tablet interface with live reticle HUD, equipment QR/RFID scanning, and multilingual voice-to-text safety dictation.',
      metrics: { label: 'Pit Altitude', value: '+184m RL (Pit 4)' },
      actionText: 'Launch Mobile Inspector'
    },
    {
      id: 'labour-contractors',
      title: 'Labor and Form-B',
      subtitle: 'Contract Labour & DGMS VTC Gate Pass Governance',
      category: 'field',
      regulation: 'DGMS CIRCULAR 02/2019',
      icon: 'engineering',
      badge: '1,335 Workers Active',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      accentColor: 'from-amber-500/10 to-emerald-500/5 border-amber-500/30 hover:border-amber-500/60',
      description: 'Statutory Form-B muster rolls, Vocational Training Certificates (VTC), Periodic Medical Exams (PME), contractor demerit scoring, and turnstile controls.',
      metrics: { label: 'VTC Compliance', value: '94.2% Certified' },
      actionText: 'Manage Labour & Form-B'
    },
    {
      id: 'labour-ai-ocr',
      title: 'AI OCR Intel',
      subtitle: 'Labour Intel & Multimodal AI OCR (Gemini 3.7 Pro Gov)',
      category: 'legal',
      regulation: 'MULTIMODAL GAZETTE INGESTION',
      icon: 'document_scanner',
      badge: '99.4% OCR Confidence',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      accentColor: 'from-purple-500/10 to-indigo-500/5 border-purple-500/30 hover:border-purple-500/60',
      description: 'Automated AI multimodal document parsing for statutory certificates, gazette notifications, and real-time pit gas telemetrics risk scoring.',
      metrics: { label: 'Risk Score', value: 'LOW (14/100)' },
      actionText: 'Launch AI OCR Intel'
    },
    {
      id: 'audit-readiness',
      title: 'Audit Ledger',
      subtitle: 'Audit Readiness & Tamper-Proof Cryptographic Ledger',
      category: 'legal',
      regulation: 'INDIAN EVIDENCE ACT SEC. 65B',
      icon: 'verified_user',
      badge: '48,291 Merkle Blocks',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      accentColor: 'from-emerald-500/10 to-cyan-500/5 border-emerald-500/30 hover:border-emerald-500/60',
      description: 'Immutable SHA-256 blockchain audit trail of every statutory sign-off, blast clearance, and inspection log with official Section 65B court certificate export.',
      metrics: { label: 'Integrity', value: '100% Zero Collisions' },
      actionText: 'View Audit Ledger'
    }
  ];

  const filteredModules = modules.filter((mod) => {
    const matchesCategory = selectedCategory === 'all' || mod.category === selectedCategory;
    const matchesSearch =
      mod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.regulation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="portal-directory-view" className="w-full flex flex-col py-2">
      {/* Breadcrumb & Quick Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <button
              onClick={() => setActiveView('national-command')}
              className="hover:text-amber-400 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-sm">home</span>
              <span>Home (National Command)</span>
            </button>
            <span>/</span>
            <span className="text-amber-400 font-bold">Portal Directory &amp; Operations Hub</span>
          </div>
          <h2 className="font-headline text-2xl md:text-3xl font-bold text-white mt-1 font-serif">
            Colliery Statutory Operations &amp; Modules Directory
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Comprehensive index of all 8 statutory systems under the Mines Act 1952 &amp; Coal Mines Regulations 2017
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveView('national-command')}
            className="bg-[#0b1524] hover:bg-[#12233c] text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Back to Home</span>
          </button>
          <button
            onClick={onOpenCopilot}
            className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-base text-amber-400">psychology</span>
            <span>AI Copilot</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0b1524] border border-slate-800 p-4 rounded-2xl shadow-xl mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Modules ({modules.length})
          </button>
          <button
            onClick={() => setSelectedCategory('cadre')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              selectedCategory === 'cadre'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Core Cadres &amp; Access (3)
          </button>
          <button
            onClick={() => setSelectedCategory('field')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              selectedCategory === 'field'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Field Safety &amp; Workforce (2)
          </button>
          <button
            onClick={() => setSelectedCategory('legal')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              selectedCategory === 'legal'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Legal, AI &amp; Ledgers (3)
          </button>
        </div>

        {/* Search input */}
        <div className="relative md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-base">
            search
          </span>
          <input
            type="text"
            placeholder="Search module name, regulation, duty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#070e1a] border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Modules Cards Grid (All 8 requested items) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {filteredModules.map((item, index) => (
          <div
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className="bg-gradient-to-br from-[#0d1c33] via-[#091527] to-[#070e1a] border-2 border-amber-500/50 hover:border-amber-400 rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(245,158,11,0.25)] cursor-pointer group relative overflow-hidden"
          >
            {/* Top Sovereign Tricolor Stripe */}
            <div className="w-full h-1 bg-gradient-to-r from-[#FF671F] via-[#FFFFFF] to-[#138808] absolute top-0 left-0"></div>

            {/* Index watermarked background */}
            <span className="absolute top-2.5 right-3 font-mono text-3xl font-black text-amber-500/15 select-none pointer-events-none">
              0{index + 1}
            </span>

            <div className="pt-1">
              {/* Header: Icon and Regulation */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="w-12 h-12 rounded-xl bg-slate-900/90 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${item.badgeColor}`}>
                  {item.badge}
                </span>
              </div>

              {/* Regulation Code */}
              <span className="text-[10px] font-mono font-bold text-amber-400 block mb-1">
                {item.regulation}
              </span>

              {/* Title & Subtitle */}
              <h3 className="font-headline text-lg font-bold text-white group-hover:text-amber-300 transition-colors font-serif leading-snug">
                {item.title}
              </h3>
              <p className="text-xs text-slate-300 font-medium mt-0.5 line-clamp-1">
                {item.subtitle}
              </p>

              {/* Description */}
              <p className="text-xs text-slate-200 mt-3 leading-relaxed line-clamp-3">
                {item.description}
              </p>
            </div>

            {/* Bottom Metrics and Button */}
            <div className="pt-4 mt-4 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs font-mono mb-3">
                <span className="text-slate-300 font-medium">{item.metrics.label}:</span>
                <span className="text-amber-300 font-bold">{item.metrics.value}</span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveView(item.id);
                }}
                className="w-full bg-[#112038] group-hover:bg-gradient-to-r group-hover:from-amber-500 group-hover:to-orange-500 group-hover:text-slate-950 text-slate-200 border border-amber-500/30 group-hover:border-amber-400 font-bold py-2 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>{item.actionText}</span>
                <span className="material-symbols-outlined text-sm group-hover:translate-x-0.5 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Launchpad Strip */}
      <div className="bg-[#091322] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <span className="material-symbols-outlined text-2xl">verified_user</span>
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Need Help Navigating Statutory Compliances?</h4>
            <p className="text-xs text-slate-400">
              Use the DGMS AI Statutory Copilot to look up any Coal Mines Regulation 2017 or Mines Act 1952 guideline.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenDispatch}
            className="bg-[#112038] hover:bg-[#1a2f50] text-cyan-300 border border-cyan-500/40 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">local_shipping</span>
            <span>Dispatch Gate</span>
          </button>
          <button
            onClick={onOpenBlast}
            className="bg-red-950 hover:bg-red-900 text-red-200 border border-red-500/50 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">bolt</span>
            <span>Blast Interlock</span>
          </button>
          <button
            onClick={onOpenCopilot}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <span className="material-symbols-outlined text-sm">psychology</span>
            <span>Ask Copilot</span>
          </button>
        </div>
      </div>
    </div>
  );
};
