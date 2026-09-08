import React from 'react';
import { ActiveView, DashboardTab } from '../types';
import { STATUTORY_OFFICERS } from '../data/mockData';

interface RoleGatewaysViewProps {
  onSelectRole: (view: ActiveView, officerName?: string, tab?: DashboardTab) => void;
  setActiveView: (view: ActiveView) => void;
}

export const RoleGatewaysView: React.FC<RoleGatewaysViewProps> = ({
  onSelectRole,
  setActiveView
}) => {
  const [ssoScanning, setSsoScanning] = React.useState(false);
  const [dscScanning, setDscScanning] = React.useState(false);

  const handleSso = () => {
    setSsoScanning(true);
    setTimeout(() => {
      setSsoScanning(false);
      alert('MeriPehchan National SSO (e-Pramaan Gateway) Handshake Complete.\nOfficer identity confirmed under IT Act 2000. Redirecting to Statutory Vault.');
      setActiveView('statutory-vault');
    }, 1200);
  };

  const handleDsc = () => {
    setDscScanning(true);
    setTimeout(() => {
      setDscScanning(false);
      alert('Hardware USB Cryptographic Token (ePass 2003 / FIPS 140-2 Level 3) Detected.\nClass-3 Digital Signature valid for Swagata Ghosh (Mining Sardar).');
      setActiveView('statutory-vault');
    }, 1200);
  };

  return (
    <div id="role-gateways-view" className="w-full flex flex-col py-2">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <button 
            onClick={() => setActiveView('national-command')}
            className="bg-[#0e1c31] hover:bg-[#162a4a] text-slate-200 border border-slate-700 px-3 py-1 rounded-lg transition-colors cursor-pointer font-bold flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm text-amber-400">home</span>
            <span>Home Page</span>
          </button>
          <span>/</span>
          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-lg font-bold">
            Statutory Role Gateways
          </span>
        </div>
        <button
          onClick={() => setActiveView('national-command')}
          className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-800"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span>Return to Home Page</span>
        </button>
      </div>

      {/* Hero Title & Tagline Master Box */}
      <div className="mb-8 rounded-2xl border-2 border-amber-500/60 overflow-hidden relative shadow-2xl bg-gradient-to-br from-[#0d1c33] via-[#091527] to-[#070e1a] p-6 md:p-8 text-center flex flex-col items-center justify-center max-w-5xl mx-auto">
        {/* Top Sovereign Tricolor Stripe */}
        <div className="w-full h-1 bg-gradient-to-r from-[#FF671F] via-[#FFFFFF] to-[#138808] absolute top-0 left-0"></div>

        <div className="flex items-center justify-center gap-2 mb-3 pt-1">
          <span className="bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-emerald-500/20 text-amber-300 border border-amber-500/40 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5">
            <span className="material-symbols-outlined text-xs text-amber-400">verified</span>
            Statutory Access Point
          </span>
          <span className="text-xs text-slate-200 font-semibold bg-slate-900/90 px-3.5 py-1 rounded-full border border-slate-700">
            Select Designated Cadre Gateway
          </span>
        </div>

        <h2 className="font-headline text-2xl md:text-4xl font-bold text-white tracking-tight leading-tight mb-2 drop-shadow-md font-serif">
          Statutory Role Gateways &amp; Operational Command
        </h2>

        <p className="text-sm md:text-base text-slate-200 max-w-3xl leading-relaxed mb-6 font-medium">
          <span className="font-bold text-amber-400">सुरक्षित खनन, समृद्ध राष्ट्र</span> — Integrated Coal Mine Safety, Dispatch &amp; Statutory Oversight Portal under DGMS and Ministry of Coal regulatory frameworks.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-1">
          <button
            id="meripehchan-sso-btn"
            onClick={handleSso}
            disabled={ssoScanning}
            className="bg-[#112038] hover:bg-[#192f52] border border-cyan-400/60 text-slate-100 px-5 py-2.5 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-emerald-400">fingerprint</span>
            <span>{ssoScanning ? 'Connecting MeriPehchan...' : 'MeriPehchan National SSO'}</span>
            <span className="material-symbols-outlined text-xs text-slate-400">open_in_new</span>
          </button>

          <button
            id="dsc-token-btn"
            onClick={handleDsc}
            disabled={dscScanning}
            className="bg-gradient-to-r from-[#0c2340] via-[#1a3866] to-[#0c2340] hover:from-[#112d52] hover:to-[#1a3866] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg border border-amber-400/60 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-amber-400">usb</span>
            <span>{dscScanning ? 'Scanning Token...' : 'DSC Token Auto-Detect (ePass 2003)'}</span>
          </button>
        </div>
      </div>

      {/* 6 Statutory Role Gateways Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {STATUTORY_OFFICERS.map((officer) => {
          return (
            <div
              key={officer.id}
              id={`role-card-${officer.id}`}
              className="rounded-2xl transition-all duration-300 overflow-hidden flex flex-col group relative shadow-2xl hover:scale-[1.01] border-2 border-amber-500/60 hover:border-amber-400 hover:shadow-[0_0_30px_rgba(245,158,11,0.28)] bg-gradient-to-br from-[#0d1c33] via-[#091527] to-[#070e1a]"
            >
              {/* Sovereign Tricolor Header Stripe */}
              <div className="w-full h-1 bg-gradient-to-r from-[#FF671F] via-[#FFFFFF] to-[#138808] absolute top-0 left-0 z-30"></div>

              {/* Photo Area showcasing Job Role & Inset Designated Officer */}
              <div className="relative h-64 overflow-hidden bg-slate-950">
                <img
                  src={officer.jobImageUrl || officer.imageUrl}
                  alt={`${officer.cadre} on duty - ${officer.jobRoleAction}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#091527] via-[#091527]/70 to-transparent"></div>

                {/* Top Header Row with Regulation, Cadre & Designated Officer Inset */}
                <div className="absolute top-3.5 left-3 right-3 flex items-start justify-between gap-2 z-20">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="bg-slate-950/90 text-amber-300 border border-amber-500/50 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide flex items-center gap-1 shadow-md">
                      <span className="material-symbols-outlined text-xs text-amber-400">verified</span>
                      {officer.regulationLabel}
                    </span>
                    <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-slate-950 px-3 py-1 rounded-full text-[11px] font-black tracking-wide shadow-md border border-amber-300">
                      {officer.badge}
                    </span>
                  </div>

                  {/* Designated Officer Inset Portrait Badge */}
                  {officer.avatarUrl && (
                    <div className="flex items-center gap-2 bg-slate-950/95 backdrop-blur-md border border-amber-500/60 rounded-xl p-1 pr-2.5 shadow-xl">
                      <img
                        src={officer.avatarUrl}
                        alt={officer.name}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-lg object-cover border border-amber-400"
                      />
                      <div className="text-left">
                        <div className="text-[9px] font-mono text-slate-400 leading-tight uppercase font-semibold">Designated</div>
                        <div className="text-[11px] font-extrabold text-amber-300 leading-tight">
                          {officer.name.split(' ')[0]} {officer.name.split(' ').slice(-1)[0]}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Job Action Title Pill & Card Title */}
                <div className="absolute bottom-3 left-4 right-4 text-white z-20">
                  <div className="inline-flex items-center gap-1.5 bg-slate-950/95 backdrop-blur-md border border-amber-400/70 shadow-lg px-3 py-1 rounded-full text-[11px] font-bold tracking-wide mb-1.5 ring-1 ring-amber-400/40 text-amber-300">
                    <span className="material-symbols-outlined text-xs text-amber-400 animate-pulse">engineering</span>
                    <span className="text-slate-300 font-medium">Job Function:</span>
                    <span className="text-amber-300 font-extrabold truncate max-w-[220px] sm:max-w-none">
                      {officer.jobRoleAction}
                    </span>
                  </div>
                  <h3 className="font-headline text-xl md:text-2xl font-bold text-white drop-shadow-md flex items-center justify-between font-serif">
                    <span>{officer.cadre}</span>
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                      {officer.regulationCode}
                    </span>
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 md:p-6 flex-1 flex flex-col justify-between gap-5">
                <div>
                  <p className="text-xs md:text-sm text-slate-200 font-normal mb-4 leading-relaxed">
                    {officer.description}
                  </p>

                  {/* Statutory Scope & Responsibilities Box (Options & Writings) */}
                  <div className="rounded-xl p-4 border border-amber-500/30 bg-[#050e1c]/90 space-y-2.5 shadow-inner">
                    <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-amber-400">verified</span>
                      <span>Statutory Scope &amp; Responsibilities:</span>
                    </div>
                    <ul className="text-xs text-slate-100 space-y-2 list-none font-medium">
                      {officer.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="material-symbols-outlined text-sm text-emerald-400 mt-0.5 shrink-0">
                            check_circle
                          </span>
                          <span className="leading-relaxed">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/40 font-bold shadow-sm">
                    <span className="material-symbols-outlined text-base">verified</span>
                    <span>{officer.verificationStatus}</span>
                  </div>
                  <button
                    id={`launch-btn-${officer.id}`}
                    onClick={() => onSelectRole('officer-dashboard', officer.name, 'overview')}
                    className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold px-4 py-2.5 rounded-lg text-xs transition-all duration-200 flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.35)] hover:scale-105 cursor-pointer border border-amber-300"
                    title={`Launch ${officer.cadre} Dashboard Console`}
                  >
                    <span>Launch Officer Dashboard &amp; Features</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Direct Statutory Feature Hub (Directly launch into any of the statutory consoles) */}
      <section className="mt-10 bg-gradient-to-br from-[#0d1c33] via-[#091527] to-[#070e1a] border-2 border-amber-500/60 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Top Sovereign Tricolor Stripe */}
        <div className="w-full h-1 bg-gradient-to-r from-[#FF671F] via-[#FFFFFF] to-[#138808] absolute top-0 left-0"></div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 pt-1">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-1">
              <span className="material-symbols-outlined text-sm">dashboard</span>
              <span>All Statutory Dashboard Modules</span>
            </div>
            <h3 className="font-headline text-xl md:text-2xl font-bold text-white font-serif">
              Select Specific Statutory Feature Dashboard
            </h3>
            <p className="text-xs text-slate-200 mt-0.5 font-medium">
              Direct access to all compliance, inspection, labour, and audit subsystems
            </p>
          </div>
          <span className="text-xs font-mono text-amber-300 bg-amber-500/20 px-3.5 py-1.5 rounded-full border border-amber-500/40 font-bold shadow-sm">
            7 ACTIVE STATUTORY CONSOLES
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-6">
          {/* 1. Officer Sign In */}
          <div
            onClick={() => setActiveView('officer-signin')}
            className="bg-gradient-to-br from-[#091629] to-[#060e1a] hover:from-[#0d1f3b] hover:to-[#091527] p-4.5 rounded-xl border-2 border-amber-500/40 hover:border-amber-400 cursor-pointer transition-all flex flex-col justify-between group shadow-xl hover:shadow-[0_0_20px_rgba(245,158,11,0.25)] relative overflow-hidden"
          >
            <div className="w-full h-0.5 bg-gradient-to-r from-[#FF671F] via-[#FFFFFF] to-[#138808] absolute top-0 left-0"></div>
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-400 mb-2.5 group-hover:scale-105 transition-transform shadow-sm">
                <span className="material-symbols-outlined text-xl">vpn_key</span>
              </div>
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">Form CMR-IV</span>
              <h4 className="font-bold text-white text-sm mt-0.5 font-serif">Officer Sign In</h4>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                Biometric token, PKI certificate, and MeriPehchan authentication.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-amber-400 gap-1 mt-3.5 pt-2 border-t border-slate-800">
              <span>Open Sign In</span>
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </div>
          </div>

          {/* 2. Cadre Registration */}
          <div
            onClick={() => setActiveView('cadre-onboarding')}
            className="bg-gradient-to-br from-[#091629] to-[#060e1a] hover:from-[#0d1f3b] hover:to-[#091527] p-4.5 rounded-xl border-2 border-amber-500/40 hover:border-amber-400 cursor-pointer transition-all flex flex-col justify-between group shadow-xl hover:shadow-[0_0_20px_rgba(245,158,11,0.25)] relative overflow-hidden"
          >
            <div className="w-full h-0.5 bg-gradient-to-r from-[#FF671F] via-[#FFFFFF] to-[#138808] absolute top-0 left-0"></div>
            <div>
              <div className="w-10 h-10 rounded-lg bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-400 mb-2.5 group-hover:scale-105 transition-transform shadow-sm">
                <span className="material-symbols-outlined text-xl">app_registration</span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">Form CMR-14-A</span>
              <h4 className="font-bold text-white text-sm mt-0.5 font-serif">Cadre Registration</h4>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                Statutory officer profile enrolment, DSC linking &amp; mining lease binding.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-cyan-400 gap-1 mt-3.5 pt-2 border-t border-slate-800">
              <span>Enroll Cadre</span>
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </div>
          </div>

          {/* 3. Statutory Vault */}
          <div
            onClick={() => onSelectRole('officer-dashboard', undefined, 'statutory-board')}
            className="bg-gradient-to-br from-[#091629] to-[#060e1a] hover:from-[#0d1f3b] hover:to-[#091527] p-4.5 rounded-xl border-2 border-amber-500/40 hover:border-amber-400 cursor-pointer transition-all flex flex-col justify-between group shadow-xl hover:shadow-[0_0_20px_rgba(245,158,11,0.25)] relative overflow-hidden"
          >
            <div className="w-full h-0.5 bg-gradient-to-r from-[#FF671F] via-[#FFFFFF] to-[#138808] absolute top-0 left-0"></div>
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-400 mb-2.5 group-hover:scale-105 transition-transform shadow-sm">
                <span className="material-symbols-outlined text-xl">gavel</span>
              </div>
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">Mines Act Sec 22</span>
              <h4 className="font-bold text-white text-sm mt-0.5 font-serif">Statutory Vault</h4>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                Legal directives, stop-work notices, and CMR 2017 regulatory compliance.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-amber-400 gap-1 mt-3.5 pt-2 border-t border-slate-800">
              <span>View Vault</span>
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </div>
          </div>

          {/* 4. Mobile Field Inspector */}
          <div
            onClick={() => onSelectRole('officer-dashboard', undefined, 'mobile-inspector')}
            className="bg-gradient-to-br from-[#091629] to-[#060e1a] hover:from-[#0d1f3b] hover:to-[#091527] p-4.5 rounded-xl border-2 border-amber-500/40 hover:border-amber-400 cursor-pointer transition-all flex flex-col justify-between group shadow-xl hover:shadow-[0_0_20px_rgba(245,158,11,0.25)] relative overflow-hidden"
          >
            <div className="w-full h-0.5 bg-gradient-to-r from-[#FF671F] via-[#FFFFFF] to-[#138808] absolute top-0 left-0"></div>
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-400/40 flex items-center justify-center text-emerald-400 mb-2.5 group-hover:scale-105 transition-transform shadow-sm">
                <span className="material-symbols-outlined text-xl">phonelink_setup</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">v4.2 Optical Reticle</span>
              <h4 className="font-bold text-white text-sm mt-0.5 font-serif">Mobile Field Inspector</h4>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                In-pit camera HUD, GPS lock, RFID/QR scanning &amp; instant violation tagging.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-emerald-400 gap-1 mt-3.5 pt-2 border-t border-slate-800">
              <span>Launch HUD</span>
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </div>
          </div>

          {/* 5. Labour & Form-B */}
          <div
            onClick={() => onSelectRole('officer-dashboard', undefined, 'labor-ocr')}
            className="bg-gradient-to-br from-[#091629] to-[#060e1a] hover:from-[#0d1f3b] hover:to-[#091527] p-4.5 rounded-xl border-2 border-amber-500/40 hover:border-amber-400 cursor-pointer transition-all flex flex-col justify-between group shadow-xl hover:shadow-[0_0_20px_rgba(245,158,11,0.25)] relative overflow-hidden"
          >
            <div className="w-full h-0.5 bg-gradient-to-r from-[#FF671F] via-[#FFFFFF] to-[#138808] absolute top-0 left-0"></div>
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-400 mb-2.5 group-hover:scale-105 transition-transform shadow-sm">
                <span className="material-symbols-outlined text-xl">engineering</span>
              </div>
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">DGMS Cir. 02/2019</span>
              <h4 className="font-bold text-white text-sm mt-0.5 font-serif">Labour &amp; Form-B</h4>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                Contract labour muster rolls, VTC certification gate passes &amp; PME records.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-amber-400 gap-1 mt-3.5 pt-2 border-t border-slate-800">
              <span>Open Muster</span>
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </div>
          </div>

          {/* 6. AI OCR Intel */}
          <div
            onClick={() => onSelectRole('officer-dashboard', undefined, 'labor-ocr')}
            className="bg-gradient-to-br from-[#091629] to-[#060e1a] hover:from-[#0d1f3b] hover:to-[#091527] p-4.5 rounded-xl border-2 border-amber-500/40 hover:border-amber-400 cursor-pointer transition-all flex flex-col justify-between group shadow-xl hover:shadow-[0_0_20px_rgba(245,158,11,0.25)] relative overflow-hidden"
          >
            <div className="w-full h-0.5 bg-gradient-to-r from-[#FF671F] via-[#FFFFFF] to-[#138808] absolute top-0 left-0"></div>
            <div>
              <div className="w-10 h-10 rounded-lg bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-400 mb-2.5 group-hover:scale-105 transition-transform shadow-sm">
                <span className="material-symbols-outlined text-xl">document_scanner</span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">Gemini 3.7 Pro Gov</span>
              <h4 className="font-bold text-white text-sm mt-0.5 font-serif">AI OCR Intelligence</h4>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                Multimodal OCR extraction of paper Form-B registers and Gazette orders.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-cyan-400 gap-1 mt-3.5 pt-2 border-t border-slate-800">
              <span>Scan Documents</span>
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </div>
          </div>

          {/* 7. Cryptographic Audit Ledger */}
          <div
            onClick={() => onSelectRole('officer-dashboard', undefined, 'audit-readiness')}
            className="bg-gradient-to-br from-[#091629] to-[#060e1a] hover:from-[#0d1f3b] hover:to-[#091527] p-4.5 rounded-xl border-2 border-amber-500/40 hover:border-amber-400 cursor-pointer transition-all flex flex-col justify-between group shadow-xl hover:shadow-[0_0_20px_rgba(245,158,11,0.25)] relative overflow-hidden"
          >
            <div className="w-full h-0.5 bg-gradient-to-r from-[#FF671F] via-[#FFFFFF] to-[#138808] absolute top-0 left-0"></div>
            <div>
              <div className="w-10 h-10 rounded-lg bg-orange-500/15 border border-orange-400/40 flex items-center justify-center text-orange-400 mb-2.5 group-hover:scale-105 transition-transform shadow-sm">
                <span className="material-symbols-outlined text-xl">verified_user</span>
              </div>
              <span className="text-[10px] font-mono text-orange-400 font-bold uppercase tracking-wider">Evidence Act Sec 65B</span>
              <h4 className="font-bold text-white text-sm mt-0.5 font-serif">Audit Ledger</h4>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                SHA-256 Merkle tree verification and court-certified inquiry dossier.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-orange-400 gap-1 mt-3.5 pt-2 border-t border-slate-800">
              <span>Inspect Ledger</span>
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Services & Statutory Utilities Row */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-gradient-to-br from-[#0d1c33] via-[#091527] to-[#070e1a] p-5 rounded-xl border-2 border-amber-500/50 hover:border-amber-400 flex items-start gap-4 shadow-xl transition-all relative overflow-hidden">
          <div className="w-full h-1 bg-gradient-to-r from-[#FF671F] via-[#FFFFFF] to-[#138808] absolute top-0 left-0"></div>
          <div className="w-11 h-11 rounded-lg bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 font-bold shadow-sm">
            <span className="material-symbols-outlined">description</span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wide font-serif">Officer Registration &amp; DSC Onboarding</h4>
            <p className="text-xs text-slate-200 font-normal mt-1 leading-relaxed">
              Enroll new DGMS competency certification, re-link expired DSC public key, or register mining lease.
            </p>
            <button
              onClick={() => setActiveView('cadre-onboarding')}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 hover:underline inline-flex items-center gap-1.5 mt-2.5 cursor-pointer"
            >
              <span>Register Statutory Dossier</span>
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#0d1c33] via-[#091527] to-[#070e1a] p-5 rounded-xl border-2 border-amber-500/50 hover:border-amber-400 flex items-start gap-4 shadow-xl transition-all relative overflow-hidden">
          <div className="w-full h-1 bg-gradient-to-r from-[#FF671F] via-[#FFFFFF] to-[#138808] absolute top-0 left-0"></div>
          <div className="w-11 h-11 rounded-lg bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 font-bold shadow-sm">
            <span className="material-symbols-outlined">track_changes</span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wide font-serif">e-Transit Pass Verification</h4>
            <p className="text-xs text-slate-200 font-normal mt-1 leading-relaxed">
              Instant public QR-code &amp; RFID validation of coal consignments in transit across state boundaries.
            </p>
            <button
              onClick={() => alert('Opening e-Transit Pass Public Verification Scanner...\nScanning RFID weighbridge manifest and FOIS central transit corridor.')}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 hover:underline inline-flex items-center gap-1.5 mt-2.5 cursor-pointer"
            >
              <span>Verify Dispatch Challan</span>
              <span className="material-symbols-outlined text-xs">qr_code_scanner</span>
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#0d1c33] via-[#091527] to-[#070e1a] p-5 rounded-xl border-2 border-amber-500/50 hover:border-amber-400 flex items-start gap-4 shadow-xl transition-all relative overflow-hidden">
          <div className="w-full h-1 bg-gradient-to-r from-[#FF671F] via-[#FFFFFF] to-[#138808] absolute top-0 left-0"></div>
          <div className="w-11 h-11 rounded-lg bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 font-bold shadow-sm">
            <span className="material-symbols-outlined">support_agent</span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wide font-serif">24x7 Statutory Helpdesk</h4>
            <p className="text-xs text-slate-200 font-normal mt-1 leading-relaxed">
              NIC portal assistance, token drivers download, toll-free: <span className="font-bold text-white">1800-11-MINE (6463)</span>
            </p>
            <span className="text-xs font-bold text-emerald-400 inline-flex items-center gap-1.5 mt-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              support-minesync@nic.in
            </span>
          </div>
        </div>
      </div>

      {/* Inspiring National Colliery Statutory Quote Plaque */}
      <section className="mt-12 w-full relative px-4 md:px-8 transition-all duration-300 overflow-visible py-8 rounded-2xl border-2 border-amber-500/60 shadow-2xl bg-gradient-to-br from-[#0d1c33] via-[#091527] to-[#070e1a]">
        {/* Top Sovereign Tricolor Stripe */}
        <div className="w-full h-1.5 bg-gradient-to-r from-[#FF671F] via-[#FFFFFF] to-[#138808] absolute top-0 left-0 rounded-t-2xl"></div>

        {/* Panoramic Colliery Backdrop */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden rounded-2xl">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6pq25Jr21nI-ArXqa2hUXxd372mGOC7sRtlNqqPTBwDRvtA5rPs7eXojY4IA3dQkslcdzlpBOLG-MxPZ2sNai9dbzcUXI0qKD9HbrLVKNGGOjbChW31wvgdukpoQiat0YwXvo1p3Xp1JNuzrF-NnnYwA3iONqFyk_dGpr_NQbV5BzEBI6M9WL5BQ1A3ElearJ3jz_9j4-14pxJ3f81U3CWLDhsgnRGS9N-0JVb_NYyyC90nuor2eSUg"
            alt="Vivid Panoramic Coal Mining Colliery Landscape at Twilight"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none scale-105 opacity-40"
            style={{ filter: 'brightness(1.05) contrast(1.1)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070c16]/85 via-[#070c16]/70 to-[#070c16]/85 pointer-events-none"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 justify-between text-center md:text-left max-w-5xl mx-auto backdrop-blur-sm pt-2">
          <div className="flex items-center justify-center shrink-0 w-12 h-12 md:w-14 md:h-14 text-amber-400 drop-shadow-md">
            <span className="material-symbols-outlined text-4xl md:text-5xl drop-shadow">format_quote</span>
          </div>

          <div className="flex-1 space-y-2.5">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#ff9933] drop-shadow-sm flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-amber-400">verified</span>
                Statutory Credo • सुरक्षा संकल्प
              </span>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline-block">|</span>
              <span className="text-xs text-slate-200 font-semibold drop-shadow-sm">Ministry of Coal &amp; DGMS Joint Charter</span>
            </div>
            <blockquote className="font-headline text-lg md:text-2xl font-bold text-white tracking-tight leading-snug drop-shadow-lg font-serif">
              “खनन सुरक्षा, राष्ट्र का स्वाभिमान — जहाँ हर श्रमिक की सुरक्षा, देश की ऊर्जा और सतत प्रगति की आधारशिला है।”
            </blockquote>
            <p className="text-xs md:text-sm text-slate-200 font-normal leading-relaxed italic drop-shadow-md font-serif">
              “Mining Safety, Sovereign Pride — Where every miner’s vigilance fuels our nation’s progress and energy security.”
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-center md:items-end justify-center pt-2 md:pt-0 md:pl-6 text-center md:text-right">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 drop-shadow">
              <span className="material-symbols-outlined text-base text-amber-400">military_tech</span>
              <span>MineSync Portal</span>
            </div>
            <span className="text-[11px] text-slate-300 font-medium mt-0.5 drop-shadow-sm">National Colliery Statutory Framework</span>
            <div className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1.5 drop-shadow">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Zero Harm Mission 2024
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
