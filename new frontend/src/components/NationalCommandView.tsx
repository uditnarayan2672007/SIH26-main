import React, { useState } from 'react';
import { ActiveView } from '../types';
import { StatutoryTelemetryAnalysis } from './StatutoryTelemetryAnalysis';
import { CollieryGisAlertsSection } from './CollieryGisAlertsSection';
import { CoalIndiaSubsidiariesMatrix } from './CoalIndiaSubsidiariesMatrix';

interface NationalCommandViewProps {
  setActiveView: (view: ActiveView) => void;
  onOpenCopilot?: () => void;
  onOpenDispatch?: () => void;
  onOpenBlast?: () => void;
}

export const NationalCommandView: React.FC<NationalCommandViewProps> = ({
  setActiveView
}) => {
  const [selectedCircularFilter, setSelectedCircularFilter] = useState('ALL');

  const statutoryNotices = [
    {
      id: 'DGMS(Tech)(S&T) Cir. No. 04/2024',
      date: '14 Jan 2025',
      authority: 'DGMS Dhanbad',
      title: 'Mandatory Continuous Methanometer Telemetry for Degree-III Gassy Seams',
      regulation: 'CMR Reg. 153',
      category: 'VENTILATION & GAS',
      urgency: 'CRITICAL',
      status: 'MANDATORY ENFORCEMENT',
      description: 'Zero-tolerance mandate requiring continuous infrared laser methanometers with acoustic sirens and SCADA interlocks at all working faces before shift handovers.',
      targetView: 'statutory-vault' as ActiveView
    },
    {
      id: 'DGMS Directive Sec 22(1A)/2024/09',
      date: '02 Feb 2025',
      authority: 'Ministry of Coal / DGMS',
      title: 'Automated Slope Stability Radar (SSR) Interlock on Opencast Benches',
      regulation: 'Mines Act Sec. 22',
      category: 'BENCH STABILITY',
      urgency: 'HIGH',
      status: 'ACTIVE DIRECTIVE',
      description: 'Automatic siren triggering and immediate equipment evacuation whenever real-time radar Factor of Safety (FOS) falls below 1.30 on highwalls.',
      targetView: 'mobile-inspector' as ActiveView
    },
    {
      id: 'Gazette Notification SO-442(E)',
      date: '20 Nov 2024',
      authority: 'Central Gazette / DGMS',
      title: 'Tripartite Multi-Key Electronic Blasting Sign-Off Protocol',
      regulation: 'CMR Reg. 164',
      category: 'EXPLOSIVES & BLASTING',
      urgency: 'HIGH',
      status: 'GAZETTED',
      description: 'Mandatory cryptographic 3-key authorization (Mine Manager + Certified Blasting Officer + Mining Sardar) before initiating secondary or deep-hole blasting.',
      targetView: 'role-gateways' as ActiveView
    },
    {
      id: 'DGMS Circular 02/2019 (Rev. 2024)',
      date: '08 Dec 2024',
      authority: 'Director General of Mines Safety',
      title: 'Biometric Form-B Muster Roll & VTC Gate Pass Governance',
      regulation: 'Mines Rules 1955 / MVTR 1966',
      category: 'WORKFORCE SAFETY',
      urgency: 'COMPLIANCE',
      status: 'VERIFIED',
      description: 'Barring uncertified contractual labour from in-pit transit. Full biometric Aadhaar/VTC integration and mandatory 5-year Periodic Medical Examination (PME).',
      targetView: 'labour-contractors' as ActiveView
    },
    {
      id: 'MOC/DGMS/IT/AUDIT/2025-01',
      date: '28 Jan 2025',
      authority: 'Ministry of Coal Apex Audit Cell',
      title: 'Indian Evidence Act Sec 65B Cryptographic Audit Trail Certification',
      regulation: 'Evidence Act Sec. 65B',
      category: 'LEGAL & AUDIT',
      urgency: 'STANDARD',
      status: 'LEDGER SYNCED',
      description: 'Immutable SHA-256 Merkle root hashing of all automated weighbridge manifests, shift logs, and safety inspection diaries for court-admissible inquiry readiness.',
      targetView: 'audit-readiness' as ActiveView
    }
  ];

  const filteredNotices = selectedCircularFilter === 'ALL'
    ? statutoryNotices
    : statutoryNotices.filter(n => n.category.includes(selectedCircularFilter) || n.urgency === selectedCircularFilter);

  return (
    <div id="national-command-view" className="w-full flex flex-col py-2 space-y-8">
      
      {/* 1. TOP APEX HERO BANNER: Colliery Optical Panorama is directly the Background for the Writing */}
      <div className="w-full rounded-2xl border-2 border-amber-500/70 overflow-hidden relative shadow-2xl bg-slate-950 group">
        {/* Top Tricolor Sovereign Stripe */}
        <div className="w-full h-1.5 bg-gradient-to-r from-[#FF671F] via-[#FFFFFF] to-[#138808] relative z-20"></div>

        {/* The Image is the Direct Background - No outer background showing through */}
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6pq25Jr21nI-ArXqa2hUXxd372mGOC7sRtlNqqPTBwDRvtA5rPs7eXojY4IA3dQkslcdzlpBOLG-MxPZ2sNai9dbzcUXI0qKD9HbrLVKNGGOjbChW31wvgdukpoQiat0YwXvo1p3Xp1JNuzrF-NnnYwA3iONqFyk_dGpr_NQbV5BzEBI6M9WL5BQ1A3ElearJ3jz_9j4-14pxJ3f81U3CWLDhsgnRGS9N-0JVb_NYyyC90nuor2eSUg"
          alt="National Colliery Optical Telemetry Panorama"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center brightness-105 contrast-105"
        />

        {/* Subtle balanced scrim: preserves clear visibility of the colliery landscape and equipment while ensuring the writing is crisp and legible */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/45 to-slate-950/80 pointer-events-none z-10"></div>

        {/* Reticle Corner Brackets for visual precision */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-400 pointer-events-none z-20"></div>
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-amber-400 pointer-events-none z-20"></div>
        <div className="absolute bottom-16 left-4 w-6 h-6 border-b-2 border-l-2 border-amber-400 pointer-events-none z-20"></div>
        <div className="absolute bottom-16 right-4 w-6 h-6 border-b-2 border-r-2 border-amber-400 pointer-events-none z-20"></div>

        {/* HUD Badges on Top */}
        <div className="relative z-20 pt-5 px-6 md:px-8 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          <div className="flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-400/80 text-[11px] font-mono text-amber-300 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold">LIVE OPTICAL SEAM TELEMETRY • DGMS COMMAND SECTOR 04</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700 text-[11px] font-mono text-slate-200 shadow-xl">
            <span className="material-symbols-outlined text-sm text-cyan-400">videocam</span>
            <span>BCCL PIT-4 PANORAMIC PTZ SENSOR</span>
          </div>
        </div>

        {/* The Writing Sitting Directly on the Image */}
        <div className="relative z-20 p-6 md:p-10 flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/30 via-amber-500/30 to-emerald-500/30 border border-amber-400/70 px-4 py-1.5 rounded-full text-xs font-bold text-amber-300 mb-4 shadow-lg backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono tracking-wider">DIRECTORATE GENERAL OF MINES SAFETY (DGMS) APEX</span>
          </div>

          <h1 className="font-headline text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] font-serif leading-tight">
            National Digital Command for Colliery Safety, Statutory Compliance &amp; Mineral Dispatch
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-100 mt-3 max-w-3xl leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] font-medium">
            Real-time multi-tier command console synchronizing statutory logs, environmental gas telemetry, smart weighbridge RFID transit, and workforce safety compliance across all public &amp; private collieries.
          </p>

          {/* Main Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mt-7">
            <button
              id="home-master-statutory-access-btn"
              onClick={() => setActiveView('role-gateways')}
              className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 px-6 py-3 rounded-xl text-xs sm:text-sm font-extrabold shadow-[0_0_24px_rgba(245,158,11,0.65)] transition-all flex items-center gap-2.5 cursor-pointer hover:scale-105 border border-amber-300"
            >
              <span className="material-symbols-outlined text-lg">layers</span>
              <span>Master Statutory Access &amp; Role Gateways</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>

            <button
              onClick={() => setActiveView('statutory-vault')}
              className="bg-[#0f1f38]/90 hover:bg-[#162c4e] border border-cyan-400/80 text-cyan-200 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold shadow-lg transition-all flex items-center gap-2 cursor-pointer backdrop-blur-md hover:border-cyan-300"
            >
              <span className="material-symbols-outlined text-lg text-cyan-400">gavel</span>
              <span>Statutory Vault &amp; Legal Gazette</span>
            </button>

            <button
              onClick={() => setActiveView('portal-directory')}
              className="bg-slate-900/90 hover:bg-slate-800 border border-slate-600 text-slate-200 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold shadow-lg transition-all flex items-center gap-2 cursor-pointer backdrop-blur-md hover:border-slate-400"
            >
              <span className="material-symbols-outlined text-lg text-amber-400">apps</span>
              <span>All Colliery Modules (8)</span>
            </button>
          </div>
        </div>

        {/* Bottom HUD Telemetry Strip */}
        <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 bg-slate-950/90 border-t border-slate-800/90 px-4 sm:px-6 py-3 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-xs text-amber-400">radar</span>
            <span className="text-[11px] font-mono text-slate-300">
              National Digital Command Visual Horizon • Real-time Open Cast Seam Monitoring
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-500/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>CH4: 0.02% (SAFE)</span>
            </span>
            <span className="text-cyan-300 font-bold hidden md:inline bg-cyan-950/80 px-2.5 py-1 rounded border border-cyan-500/40">
              CO: 4 PPM
            </span>
            <span className="text-amber-300 font-bold bg-amber-950/80 px-2.5 py-1 rounded border border-amber-500/40">
              FOS: 1.48 (NORMAL)
            </span>
          </div>
        </div>
      </div>

      {/* 2. DOWNWARD SECTION: APEX STATUTORY & NATIONAL LEADERSHIP (Using the Dark Command Background) */}
      <div className="w-full rounded-2xl border-2 border-amber-500/60 overflow-hidden relative shadow-2xl bg-gradient-to-br from-[#0c182c] via-[#091222] to-[#060c16] p-6 md:p-8">
        {/* Top Tricolor Sovereign Stripe */}
        <div className="w-full h-1 bg-gradient-to-r from-[#FF671F] via-[#FFFFFF] to-[#138808] absolute top-0 left-0"></div>

        <div className="text-center mb-5 pt-1">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
            APEX STATUTORY &amp; NATIONAL LEADERSHIP
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Card 1: Shri Narendra Modi */}
          <div className="flex items-center gap-4 bg-[#0a1426]/90 hover:bg-[#0c182e] p-4.5 rounded-2xl border-2 border-amber-500/40 shadow-xl backdrop-blur-md transition-all group">
            <div className="relative w-24 h-28 rounded-xl overflow-hidden border-2 border-amber-400 shadow-lg shrink-0 bg-slate-950">
              <img
                src="/narendra-modi.jpg"
                alt="Hon'ble Prime Minister Shri Narendra Modi"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 mb-1">
                <span className="material-symbols-outlined text-xs">verified</span>
                <span>Leadership Vision</span>
              </div>
              <h3 className="font-headline text-lg font-bold text-white font-serif leading-tight">
                Shri Narendra Modi
              </h3>
              <p className="text-xs text-slate-300 font-semibold leading-tight mt-0.5">
                Hon&apos;ble Prime Minister of India
              </p>
              <p className="text-xs text-amber-300/95 italic mt-2 font-serif leading-relaxed border-l-2 border-amber-400/60 pl-2">
                &ldquo;Safe, technologically sovereign energy security powering Viksit Bharat 2047.&rdquo;
              </p>
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800 text-[10px] font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Viksit Bharat 2047 • Mission Zero Harm</span>
              </div>
            </div>
          </div>

          {/* Card 2: Shri G. Kishan Reddy */}
          <div className="flex items-center gap-4 bg-[#0a1426]/90 hover:bg-[#0c182e] p-4.5 rounded-2xl border-2 border-amber-500/40 shadow-xl backdrop-blur-md transition-all group">
            <div className="relative w-24 h-28 rounded-xl overflow-hidden border-2 border-amber-400 shadow-lg shrink-0 bg-slate-950">
              <img
                src="/kishan-reddy.jpg"
                alt="Hon'ble Union Minister Shri G. Kishan Reddy"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 mb-1">
                <span className="material-symbols-outlined text-xs">gavel</span>
                <span>Statutory Oversight</span>
              </div>
              <h3 className="font-headline text-lg font-bold text-white font-serif leading-tight">
                Shri G. Kishan Reddy
              </h3>
              <p className="text-xs text-slate-300 font-semibold leading-tight mt-0.5">
                Hon&apos;ble Union Minister of Coal &amp; Mines
              </p>
              <p className="text-xs text-amber-300/95 italic mt-2 font-serif leading-relaxed border-l-2 border-amber-400/60 pl-2">
                &ldquo;Zero-tolerance safety governance and zero harm across every mining lease.&rdquo;
              </p>
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800 text-[10px] font-mono text-cyan-400">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>Mines Act 1952 • DGMS Statutory Governance</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MASTER STATUTORY CONTROL & ACCESS (Values, metrics & single direct entry to Role Gateways) */}
      <div 
        id="master-statutory-access-section"
        className="bg-gradient-to-r from-[#0d1c33] via-[#091527] to-[#0d1c33] border-2 border-amber-500/60 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="w-full h-1 bg-gradient-to-r from-[#FF671F] via-[#FFFFFF] to-[#138808] absolute top-0 left-0"></div>
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase bg-amber-500 text-slate-950 font-black px-2.5 py-0.5 rounded shadow">
                CENTRAL OPERATIONS HUB
              </span>
              <span className="text-xs font-mono text-cyan-300 font-bold">
                6 STATUTORY CADRES • 348 COLLIERIES
              </span>
            </div>
            
            <h2 className="font-headline text-2xl md:text-3xl font-bold text-white font-serif">
              Master Statutory Access &amp; Compliance Hub
            </h2>
            
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Access designated statutory officer commands under DGMS regulations. Select the central role gateway to choose between Zonal Directors, First-Class Mine Managers, Safety Officers, Mining Sardars, Labour Contractors, and Statutory Auditors.
            </p>

            {/* Key Value Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-[#070e1a]/90 p-2.5 rounded-lg border border-slate-800">
                <div className="text-amber-400 font-mono font-bold text-lg">6 Cadres</div>
                <div className="text-[10px] text-slate-400 font-medium">Statutory Officers</div>
              </div>
              <div className="bg-[#070e1a]/90 p-2.5 rounded-lg border border-slate-800">
                <div className="text-emerald-400 font-mono font-bold text-lg">100%</div>
                <div className="text-[10px] text-slate-400 font-medium">Sec. 22 Compliance</div>
              </div>
              <div className="bg-[#070e1a]/90 p-2.5 rounded-lg border border-slate-800">
                <div className="text-cyan-400 font-mono font-bold text-lg">48,291</div>
                <div className="text-[10px] text-slate-400 font-medium">Merkle Blocks</div>
              </div>
              <div className="bg-[#070e1a]/90 p-2.5 rounded-lg border border-slate-800">
                <div className="text-orange-400 font-mono font-bold text-lg">CMR 2017</div>
                <div className="text-[10px] text-slate-400 font-medium">Legal Baseline</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-stretch sm:items-end gap-3.5 shrink-0 w-full lg:w-auto">
            <button
              id="enter-role-gateways-btn"
              onClick={() => setActiveView('role-gateways')}
              className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 px-8 py-4 rounded-xl text-sm font-extrabold shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all flex items-center justify-center gap-2.5 cursor-pointer hover:scale-105 border border-amber-300"
            >
              <span className="material-symbols-outlined text-xl">layers</span>
              <span>Enter Statutory Role Gateways</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
            
            <p className="text-[11px] text-slate-400 text-center sm:text-right font-mono">
              Direct access to all 6 statutory dashboards &amp; in-pit feature consoles
            </p>
          </div>
        </div>
      </div>

      {/* 3. COLLIERY OPERATION SPOTLIGHTS (With authentic photographic assets & live telemetric HUD overlays) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">Live Ground Telemetry</span>
            <h2 className="font-headline text-xl md:text-2xl font-bold text-white font-serif">Colliery Operational Spotlights</h2>
          </div>
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/40">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            348 MINES SYNCED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {/* Spotlight 1: Atmospheric Telemetry & Auto-Tripping */}
          <div className="bg-[#0c182b] border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col group hover:border-amber-500/50 transition-all">
            <div className="relative h-48 overflow-hidden bg-slate-950">
              <img
                src="/colliery/underground-seam.jpg"
                alt="Underground Seam Atmospheric Telemetry and Auto-Tripping"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c182b] via-slate-950/20 to-transparent"></div>
              
              {/* Badge & Degree III Seam */}
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                <span className="bg-red-600/95 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded shadow border border-red-400">
                  DEGREE-III GASSY SEAM
                </span>
                <span className="bg-slate-950/80 text-amber-300 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-amber-500/40">
                  CMR 153
                </span>
              </div>

              {/* Ventilation Officer Inset Badge */}
              <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 bg-slate-950/90 border border-amber-500/50 p-1 rounded-xl shadow-lg backdrop-blur-sm">
                <img
                  src="/officers/officer-aritra.jpg"
                  alt="Ventilation Officer Aritra Ganguly"
                  className="w-7 h-7 rounded-lg object-cover border border-amber-400"
                />
                <div className="pr-1 text-left hidden sm:block">
                  <div className="text-[9px] font-bold text-white leading-none">Er. A. Ganguly</div>
                  <div className="text-[8px] font-mono text-amber-400 leading-tight">Ventilation Officer</div>
                </div>
              </div>

              {/* Telemetry Sensor Bar */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono text-emerald-300 bg-slate-950/90 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-emerald-500/40 shadow-lg">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>CH4: 0.28%</span>
                </div>
                <span>CO: 12 ppm</span>
                <span className="text-amber-400 font-bold">&lt;150ms TRIP READY</span>
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="text-[10px] font-mono text-amber-400 font-bold uppercase">CMR REGULATION 153</div>
                <h4 className="font-bold text-slate-100 text-sm mt-0.5">Atmospheric Telemetry &amp; Auto-Tripping</h4>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Infrared optical methanometer telemetrics with zero toxic gas inversion drift. Automated electrical supply interlocks trip power within 150ms upon anomalous gas surges.
                </p>
              </div>
              <button
                onClick={() => setActiveView('role-gateways')}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 cursor-pointer pt-2 border-t border-slate-800"
              >
                <span>Access Safety Officer Gateway</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Spotlight 2: Transit & RFID Weighbridge */}
          <div className="bg-[#0c182b] border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col group hover:border-cyan-500/50 transition-all">
            <div className="relative h-48 overflow-hidden bg-slate-950">
              <img
                src="/colliery/coal-dispatch-siding.jpg"
                alt="Transit and RFID Weighbridge Mineral Siding"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c182b] via-slate-950/20 to-transparent"></div>
              
              {/* Badge & Siding Number */}
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                <span className="bg-cyan-600/95 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded shadow border border-cyan-400">
                  SIDING WEIGHBRIDGE #02
                </span>
                <span className="bg-slate-950/80 text-cyan-300 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-cyan-500/40">
                  FOIS
                </span>
              </div>

              {/* Siding Dispatcher Inset Badge */}
              <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 bg-slate-950/90 border border-cyan-500/50 p-1 rounded-xl shadow-lg backdrop-blur-sm">
                <img
                  src="/officers/officer-swadhin.jpg"
                  alt="Overman Swadhin Nandy"
                  className="w-7 h-7 rounded-lg object-cover border border-cyan-400"
                />
                <div className="pr-1 text-left hidden sm:block">
                  <div className="text-[9px] font-bold text-white leading-none">Swadhin Nandy</div>
                  <div className="text-[8px] font-mono text-cyan-400 leading-tight">Dispatch Overman</div>
                </div>
              </div>

              {/* RFID Gross / Tare Weights Status */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono text-cyan-300 bg-slate-950/90 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-cyan-500/40 shadow-lg">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span>RFID: VERIFIED</span>
                </div>
                <span>GROSS: 54.2 T</span>
                <span className="text-amber-300 font-bold">TARE: 18.1 T</span>
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase">FOIS LOGISTICS GRID</div>
                <h4 className="font-bold text-slate-100 text-sm mt-0.5">Transit &amp; RFID Weighbridge</h4>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Automated electronic transit passes (e-TP) synchronized with Ministry of Coal FOIS national freight corridor with automated gross-weight tare sensors and geo-fenced rail rakes.
                </p>
              </div>
              <button
                onClick={() => setActiveView('portal-directory')}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 cursor-pointer pt-2 border-t border-slate-800"
              >
                <span>Calibrate Siding Weighbridge</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Spotlight 3: Shift Inquest & Sardar Digital Sign-Off */}
          <div className="bg-[#0c182b] border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col group hover:border-emerald-500/50 transition-all">
            <div className="relative h-48 overflow-hidden bg-slate-950">
              <img
                src="/colliery/pit-inspection.jpg"
                alt="Colliery Shift Inquest and Sardar Digital Sign-Off"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c182b] via-slate-950/30 to-transparent"></div>
              
              {/* Badge & Certified Sardar picture-in-picture */}
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                <span className="bg-emerald-600/95 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded shadow border border-emerald-400">
                  STATUTORY FACE INQUEST
                </span>
                <span className="bg-slate-950/80 text-amber-300 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-amber-500/40">
                  CMR 129
                </span>
              </div>

              {/* Sardar Portrait Inset Badge */}
              <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 bg-slate-950/90 border border-emerald-500/50 p-1 rounded-xl shadow-lg backdrop-blur-sm">
                <img
                  src="/officers/officer-swagata.jpg"
                  alt="Mining Sardar Swagata Ghosh"
                  className="w-7 h-7 rounded-lg object-cover border border-emerald-400"
                />
                <div className="pr-1 text-left hidden sm:block">
                  <div className="text-[9px] font-bold text-white leading-none">Sardar S. Ghosh</div>
                  <div className="text-[8px] font-mono text-emerald-400 leading-tight">DGMS Competent</div>
                </div>
              </div>

              {/* Live shift checklist status pill */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-mono text-emerald-300 bg-slate-950/90 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-emerald-500/40 shadow-lg">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>FLAME LAMP: 0.00% CH4</span>
                </div>
                <span className="text-amber-300 font-bold">DSC CLASS-3 SIGNED</span>
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase">CMR REGULATION 129</div>
                <h4 className="font-bold text-slate-100 text-sm mt-0.5">Shift Inquest &amp; Sardar Digital Sign-Off</h4>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Frontline statutory face inspections, roof and side sounding, flame safety detector tests, and mandatory electronic daily shift diary signing with cryptographic token security.
                </p>
              </div>
              <button
                onClick={() => setActiveView('role-gateways')}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 cursor-pointer pt-2 border-t border-slate-800"
              >
                <span>Launch Mining Sardar HUD</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Spotlight 4: Strata Control & Slope Stability Radar */}
          <div className="bg-[#0c182b] border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col group hover:border-orange-500/50 transition-all">
            <div className="relative h-48 overflow-hidden bg-slate-950">
              <img
                src="https://lh3.googleusercontent.com/aida/AEtjO1U4m80DPyEdiiaBo44RS04cKsX-b2jLrA6Y8VnHCWtoY-Utnx9LMwOu75QbXjqFv7ZPCs4NO_PRyPHoh0GrKNgAOUS2ZLcggp6wlLzoIzGoopZakEQZWXr2T4OrEsHN5BqGLx5nf26fufKOcsl3GS7wyV26HtXCMhQHMgWeYkxhw_MbMD9b8VQz76WVu5kz9nF6Rg32TaloyRxQldubFV2R7coLZmYM4fHJ1aIzXIgZNKV6mGCYibofFWz-"
                alt="Strata Control and Slope Stability Radar SSR"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c182b] via-slate-950/20 to-transparent"></div>
              
              {/* Badge & Telemetry Mode */}
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                <span className="bg-orange-600/95 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded shadow border border-orange-400">
                  SSR RADAR TELEMETRY
                </span>
                <span className="bg-slate-950/80 text-amber-300 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-amber-500/40">
                  CMR 143
                </span>
              </div>

              {/* Geotechnical Engineer Inset Badge */}
              <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 bg-slate-950/90 border border-orange-500/50 p-1 rounded-xl shadow-lg backdrop-blur-sm">
                <img
                  src="/officers/officer-ankita.jpg"
                  alt="Geotechnical Engineer Ankita"
                  className="w-7 h-7 rounded-lg object-cover border border-orange-400"
                />
                <div className="pr-1 text-left hidden sm:block">
                  <div className="text-[9px] font-bold text-white leading-none">Er. Ankita</div>
                  <div className="text-[8px] font-mono text-orange-400 leading-tight">Geotech In-charge</div>
                </div>
              </div>

              {/* Live Slope Radar Readings */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono text-amber-300 bg-slate-950/90 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-amber-500/40 shadow-lg">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>FOS: 1.48 (STABLE)</span>
                </div>
                <span className="text-cyan-300 font-bold">DISPL: 0.02 mm/hr</span>
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="text-[10px] font-mono text-orange-400 font-bold uppercase">CMR REG. 143 &amp; MINES ACT</div>
                <h4 className="font-bold text-slate-100 text-sm mt-0.5">Strata Control &amp; Slope Stability Radar</h4>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Real-time interferometric radar scanning highwall benches, sub-millimeter pit wall displacement, Factor of Safety monitoring, and automated early warning geotechnical alerts.
                </p>
              </div>
              <button
                onClick={() => setActiveView('statutory-vault')}
                className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1.5 cursor-pointer pt-2 border-t border-slate-800"
              >
                <span>Launch Slope Radar Vault</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3B. STATUTORY TELEMETRY ANALYSIS */}
      <StatutoryTelemetryAnalysis />

      {/* 3C. LIVE GIS OPERATING COAL FIELD & COMPLIANCE ALERT FEED */}
      <CollieryGisAlertsSection />

      {/* 3D. COAL INDIA OPERATING SUBSIDIARIES & STATUTORY COMPLIANCE MATRIX */}
      <CoalIndiaSubsidiariesMatrix />

      {/* 4. STATUTORY REGULATION AND DGMS SAFETY FRAMEWORK (The core requested framework & circulars) */}
      <div className="bg-[#0b1526] border-2 border-slate-800 hover:border-amber-500/40 rounded-2xl p-6 md:p-8 shadow-2xl transition-all space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-0.5 rounded-full text-xs font-bold font-mono uppercase mb-2">
              <span className="material-symbols-outlined text-sm">balance</span>
              <span>Statutory Regulation &amp; DGMS Safety Framework</span>
            </div>
            <h2 className="font-headline text-2xl md:text-3xl font-bold text-white font-serif">
              Official Coal Mines Safety Framework &amp; Gazette Directives
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Authoritative statutory matrix enforcing the Mines Act 1952, Coal Mines Regulations (CMR) 2017, Mines Rules 1955, and DGMS Circulars across all Indian mining leases.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveView('statutory-vault')}
              className="bg-[#11233e] hover:bg-[#18345c] border border-cyan-500/40 text-cyan-200 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span className="material-symbols-outlined text-sm text-cyan-400">gavel</span>
              <span>Open Statutory Vault</span>
            </button>
          </div>
        </div>

        {/* 4 Statutory Legislative Pillars - Point-Wise Writing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pillar 1: CMR 2017 */}
          <div className="bg-[#070e1a] p-5 rounded-xl border border-cyan-500/30 hover:border-cyan-400 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <span className="material-symbols-outlined">verified_user</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
                  PRIMARY CODE
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">Statutory Operating Code</span>
              <h3 className="text-base font-bold text-white mt-1">Coal Mines Regulations, 2017</h3>
              
              <ul className="space-y-1.5 mt-3 text-xs text-slate-300 leading-snug">
                <li className="flex items-start gap-1.5">
                  <span className="text-cyan-400 font-bold text-sm leading-none">•</span>
                  <span><strong className="text-cyan-300">Reg. 27 &amp; 28:</strong> First-Class Manager command, statutory shift logs &amp; colliery diaries</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-cyan-400 font-bold text-sm leading-none">•</span>
                  <span><strong className="text-cyan-300">Reg. 29:</strong> Ventilation &amp; Safety Officer airflow velocity surveys &amp; dust mitigation</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-cyan-400 font-bold text-sm leading-none">•</span>
                  <span><strong className="text-cyan-300">Reg. 129:</strong> Frontline Mining Sardar working face inspection &amp; flame gas testing</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-cyan-400 font-bold text-sm leading-none">•</span>
                  <span><strong className="text-cyan-300">Reg. 143:</strong> Strata Control &amp; Monitoring Plan (SCAMP) with slope radar interlock</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-cyan-400 font-bold text-sm leading-none">•</span>
                  <span><strong className="text-cyan-300">Reg. 153:</strong> Continuous methanometer telemetrics with &lt;150ms auto-trip interlocks</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-cyan-400 font-bold text-sm leading-none">•</span>
                  <span><strong className="text-cyan-300">Reg. 168:</strong> Mandatory Colliery Safety Management Plan (SMP) with risk matrix</span>
                </li>
              </ul>
            </div>
            <div className="pt-3 mt-4 border-t border-slate-800/80 text-[11px] font-mono text-cyan-300 flex items-center justify-between">
              <span>Gazette Enforced</span>
              <span className="font-bold">CMR 2017 Reg. 1-260</span>
            </div>
          </div>

          {/* Pillar 2: Mines Act, 1952 */}
          <div className="bg-[#070e1a] p-5 rounded-xl border border-amber-500/30 hover:border-amber-400 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <span className="material-symbols-outlined">policy</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">
                  APEX ACT
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">Parliamentary Legislation</span>
              <h3 className="text-base font-bold text-white mt-1">Mines Act, 1952</h3>
              
              <ul className="space-y-1.5 mt-3 text-xs text-slate-300 leading-snug">
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold text-sm leading-none">•</span>
                  <span><strong className="text-amber-300">Section 22:</strong> DGMS statutory powers to prohibit employment in imminent danger</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold text-sm leading-none">•</span>
                  <span><strong className="text-amber-300">Section 22A:</strong> Immediate binding safety stop-work directives by Central Inspectors</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold text-sm leading-none">•</span>
                  <span><strong className="text-amber-300">Section 24:</strong> Formal Court of Inquiry tribunals into serious accidents &amp; disasters</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold text-sm leading-none">•</span>
                  <span><strong className="text-amber-300">Section 57:</strong> Central Government powers to enact life-safety regulations &amp; rules</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold text-sm leading-none">•</span>
                  <span><strong className="text-amber-300">Sec. 72–74:</strong> Criminal prosecution, penal fines &amp; imprisonment for owner/agent/manager</span>
                </li>
              </ul>
            </div>
            <div className="pt-3 mt-4 border-t border-slate-800/80 text-[11px] font-mono text-amber-300 flex items-center justify-between">
              <span>Sec 22 / 22A Mandate</span>
              <span className="font-bold">Act No. 35 of 1952</span>
            </div>
          </div>

          {/* Pillar 3: Mines Rescue Rules, 1985 */}
          <div className="bg-[#070e1a] p-5 rounded-xl border border-red-500/30 hover:border-red-400 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                  <span className="material-symbols-outlined">medical_services</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-500/40">
                  LIFE RESCUE CODE
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-wider">Disaster &amp; Emergency Code</span>
              <h3 className="text-base font-bold text-white mt-1">Mines Rescue Rules, 1985</h3>
              
              <ul className="space-y-1.5 mt-3 text-xs text-slate-300 leading-snug">
                <li className="flex items-start gap-1.5">
                  <span className="text-red-400 font-bold text-sm leading-none">•</span>
                  <span><strong className="text-red-300">Rules 3 &amp; 4:</strong> Mandatory Rescue Stations (40km zone) &amp; on-site Rescue Rooms</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-red-400 font-bold text-sm leading-none">•</span>
                  <span><strong className="text-red-300">Rule 21:</strong> Medical fitness &amp; physical endurance for rescue brigade captains</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-red-400 font-bold text-sm leading-none">•</span>
                  <span><strong className="text-red-300">Rule 26:</strong> Compulsory Self-Contained Breathing Apparatus (SCBA) &amp; revivers</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-red-400 font-bold text-sm leading-none">•</span>
                  <span><strong className="text-red-300">Rule 32:</strong> Mandatory monthly 2-hour mock rescue drills in toxic gas chambers</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-red-400 font-bold text-sm leading-none">•</span>
                  <span><strong className="text-red-300">Rule 35:</strong> 24/7 emergency rescue telecom hotlines &amp; rapid response vans</span>
                </li>
              </ul>
            </div>
            <div className="pt-3 mt-4 border-t border-slate-800/80 text-[11px] font-mono text-red-300 flex items-center justify-between">
              <span>Rescue Stations</span>
              <span className="font-bold">Rules 1-41 Enforced</span>
            </div>
          </div>

          {/* Pillar 4: MMDR Act, 1957 */}
          <div className="bg-[#070e1a] p-5 rounded-xl border border-emerald-500/30 hover:border-emerald-400 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <span className="material-symbols-outlined">account_balance</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                  MINERAL GOVERNANCE
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">Statutory Mineral Framework</span>
              <h3 className="text-base font-bold text-white mt-1">MMDR Act, 1957</h3>
              
              <ul className="space-y-1.5 mt-3 text-xs text-slate-300 leading-snug">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold text-sm leading-none">•</span>
                  <span><strong className="text-emerald-300">Section 4:</strong> Sovereign prohibition of mining or extraction without statutory lease</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold text-sm leading-none">•</span>
                  <span><strong className="text-emerald-300">Section 9:</strong> Mandatory mineral royalties, Dead Rent, and national NMET payments</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold text-sm leading-none">•</span>
                  <span><strong className="text-emerald-300">Section 9B:</strong> District Mineral Foundation (DMF) funding health &amp; education</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold text-sm leading-none">•</span>
                  <span><strong className="text-emerald-300">Section 21:</strong> Stringent vehicle seizure, confiscation of coal &amp; penal imprisonment</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold text-sm leading-none">•</span>
                  <span><strong className="text-emerald-300">Section 23C:</strong> State check-post powers and FOIS e-transit tracking against illicit coal</span>
                </li>
              </ul>
            </div>
            <div className="pt-3 mt-4 border-t border-slate-800/80 text-[11px] font-mono text-emerald-300 flex items-center justify-between">
              <span>Section 4, 9B &amp; 21</span>
              <span className="font-bold">Act No. 67 of 1957</span>
            </div>
          </div>
        </div>

        {/* Live Gazette Notices & Directives Feed Table */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white font-mono uppercase">Enforced Notices Feed:</span>
              <span className="text-[11px] font-mono text-slate-400">({filteredNotices.length} active directives)</span>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 text-xs">
              {['ALL', 'CRITICAL', 'VENTILATION', 'BENCH STABILITY', 'WORKFORCE'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedCircularFilter(filter)}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all cursor-pointer ${
                    selectedCircularFilter === filter
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-slate-800/80 rounded-xl border border-slate-800 bg-[#070e1a] overflow-hidden">
            {filteredNotices.map((notice) => (
              <div
                key={notice.id}
                className="p-4 hover:bg-[#0c182c] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="bg-amber-500/20 text-amber-300 font-mono font-bold px-2 py-0.5 rounded border border-amber-500/30">
                      {notice.id}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">| {notice.date}</span>
                    <span className="text-slate-400 font-mono text-[11px]">| Auth: {notice.authority}</span>
                    <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-mono font-semibold">
                      {notice.regulation}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-100 text-sm md:text-base">
                    {notice.title}
                  </h4>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {notice.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <span className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold border ${
                    notice.urgency === 'CRITICAL'
                      ? 'bg-red-950/80 text-red-300 border-red-500/40'
                      : notice.urgency === 'HIGH'
                      ? 'bg-orange-950/80 text-orange-300 border-orange-500/40'
                      : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {notice.status}
                  </span>

                  <button
                    onClick={() => setActiveView(notice.targetView)}
                    className="bg-[#0f1f38] hover:bg-amber-500 hover:text-slate-950 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>View Filing</span>
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. NATIONAL SAFETY PERFORMANCE DASHBOARD */}
      <div className="bg-[#0c1626] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="font-headline text-lg font-bold text-white font-serif">
              National Zero-Harm Colliery Metric Monitor
            </h3>
            <p className="text-xs text-slate-400">Under Mines Act 1952 &amp; CMR 2017 (Annual Governance Cycle 2024-25)</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold font-mono">
              ZERO FATAL INCIDENTS IN CURRENT SHIFT
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 text-center">
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <div className="text-2xl font-black text-amber-400 font-mono">99.8%</div>
            <div className="text-[11px] text-slate-400 font-semibold uppercase mt-0.5">Shift Statutory Compliance</div>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <div className="text-2xl font-black text-emerald-400 font-mono">48,291</div>
            <div className="text-[11px] text-slate-400 font-semibold uppercase mt-0.5">SHA-256 Ledger Blocks</div>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <div className="text-2xl font-black text-cyan-400 font-mono">1.84 MT</div>
            <div className="text-[11px] text-slate-400 font-semibold uppercase mt-0.5">Safe Coal Dispatched</div>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <div className="text-2xl font-black text-orange-400 font-mono">100%</div>
            <div className="text-[11px] text-slate-400 font-semibold uppercase mt-0.5">VTC &amp; PME Verified</div>
          </div>
        </div>
      </div>

      {/* 6. EMPOWERING INDIA'S COAL WORKFORCE & AUTOMATED SAFETY TELEMETRY */}
      <div className="bg-gradient-to-br from-[#0a1628] via-[#0d1f38] to-[#081220] border-2 border-amber-500/40 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden space-y-6">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/5 rounded-full pointer-events-none blur-3xl"></div>
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-emerald-500/5 rounded-full pointer-events-none blur-3xl"></div>

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-bold font-mono uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-sm text-amber-400">workspace_premium</span>
              <span>National Safety Mandate &amp; Sovereign Workforce Protection</span>
            </div>
            <h2 className="font-headline text-2xl md:text-3xl font-bold text-white font-serif">
              Empowering India&apos;s Coal Workforce &amp; Automated Safety Telemetry
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1.5 max-w-3xl leading-relaxed">
              Real-time occupational protection across 348 mechanized mines under the Directorate General of Mines Safety (DGMS), Dhanbad. Zero-fatality statutory protocol guaranteeing every miner returns home safe at the end of every shift.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="bg-[#060e1a] border border-red-500/40 px-4 py-2.5 rounded-xl flex items-center gap-3 shadow-md">
              <div className="w-10 h-10 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                <span className="material-symbols-outlined text-xl animate-pulse">phone_in_talk</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-red-400 font-bold uppercase block">DGMS 24x7 Emergency Hotline</span>
                <span className="text-sm font-black text-white font-mono tracking-wider">1800-11-MINE (6463) / 0326-2221200</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Core Directives: Zero Fatalities Mandate, Automated Safety Telemetry, Statutory Vigilance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Zero Fatalities Mandate */}
          <div className="bg-[#060e1a]/90 p-5 rounded-xl border border-red-500/30 hover:border-red-500/60 transition-all flex flex-col justify-between space-y-3 shadow-lg">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-9 h-9 rounded-lg bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center">
                  <span className="material-symbols-outlined text-base">warning</span>
                </span>
                <span className="text-[10px] font-mono font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-500/40">
                  MISSION ZERO HARM
                </span>
              </div>
              <h3 className="text-base font-bold text-white">Zero Fatalities Mandate</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Legally enforceable zero-incident standard requiring immediate Section 22 stop-work orders for unsupported roofs, inadequate air velocities (&lt;30 m³/min), or methane buildup exceeding 0.5% in any active coal face.
              </p>
            </div>
            <div className="pt-2.5 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Section 22 Mines Act</span>
              <span className="text-red-400 font-bold">Strict Enforcement</span>
            </div>
          </div>

          {/* Card 2: Automated Safety Telemetry */}
          <div className="bg-[#060e1a]/90 p-5 rounded-xl border border-cyan-500/30 hover:border-cyan-500/60 transition-all flex flex-col justify-between space-y-3 shadow-lg">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center">
                  <span className="material-symbols-outlined text-base">sensors</span>
                </span>
                <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
                  REAL-TIME TELEMETRY
                </span>
              </div>
              <h3 className="text-base font-bold text-white">Automated Safety Telemetry</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Optical flameproof infrared CH4 and electrochemical CO sensors connected via fiber-optic underground backbone to surface command centers, with automated electrical circuit breakers tripping power within 150 milliseconds.
              </p>
            </div>
            <div className="pt-2.5 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>CMR Reg. 153 Tripping</span>
              <span className="text-cyan-400 font-bold">&lt;150ms Latency</span>
            </div>
          </div>

          {/* Card 3: Statutory Vigilance */}
          <div className="bg-[#060e1a]/90 p-5 rounded-xl border border-emerald-500/30 hover:border-emerald-500/60 transition-all flex flex-col justify-between space-y-3 shadow-lg">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                  <span className="material-symbols-outlined text-base">gavel</span>
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                  DGMS APEX AUDIT
                </span>
              </div>
              <h3 className="text-base font-bold text-white">Statutory Vigilance &amp; Directives</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Centralized surveillance coordinating DGMS Zonal Directorates, quarterly statutory safety committees, worker safety representatives (Workmen Inspectors under Rule 29Q), and digital evidence preservation.
              </p>
            </div>
            <div className="pt-2.5 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Mines Rules 1955</span>
              <span className="text-emerald-400 font-bold">100% Verified</span>
            </div>
          </div>
        </div>

        {/* Apex Regulatory Headquarters & CMR 2017 Zero-Harm Commitment */}
        <div className="bg-[#07101e] border border-amber-500/30 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <span className="material-symbols-outlined text-2xl">location_on</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Directorate General of Mines Safety (DGMS)</span>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-amber-500/30">
                  Central Directorate
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Headquarters: Dhanbad, Jharkhand – 826001, India | Ministry of Labour &amp; Employment / Ministry of Coal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <span className="text-[11px] font-mono text-amber-400 font-bold uppercase block">CMR 2017 ZERO-HARM PLEDGE</span>
              <span className="text-xs text-slate-300">100% Shift Safety Pledge Enforced</span>
            </div>
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm font-bold">verified</span>
              <span>CMR 2017 ZERO-HARM PLEDGE</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
