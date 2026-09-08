import React, { useState } from 'react';
import { ActiveView, DashboardTab, StatutoryOfficer } from '../types';
import { STATUTORY_OFFICERS } from '../data/mockData';
import { StatutoryVaultView } from './StatutoryVaultView';
import { MobileInspectorView } from './MobileInspectorView';
import { LabourContractorsView } from './LabourContractorsView';
import { LabourAiOcrView } from './LabourAiOcrView';
import { AuditReadinessView } from './AuditReadinessView';
import { GisSpatialRadarView } from './GisSpatialRadarView';
import { InspectionCapaView } from './InspectionCapaView';
import { StatutoryTelemetryAnalysis } from './StatutoryTelemetryAnalysis';
import { CollieryGisAlertsSection } from './CollieryGisAlertsSection';
import { CoalIndiaSubsidiariesMatrix } from './CoalIndiaSubsidiariesMatrix';

interface OfficerDashboardViewProps {
  initialOfficerName?: string;
  initialTab?: DashboardTab;
  setActiveView: (view: ActiveView) => void;
  onOpenCopilot: () => void;
  onOpenDispatch: () => void;
  onOpenBlast: () => void;
}

export const OfficerDashboardView: React.FC<OfficerDashboardViewProps> = ({
  initialOfficerName,
  initialTab = 'overview',
  setActiveView,
  onOpenCopilot,
  onOpenDispatch,
  onOpenBlast
}) => {
  // Determine active officer
  const [selectedOfficer, setSelectedOfficer] = useState<StatutoryOfficer>(() => {
    if (initialOfficerName) {
      const found = STATUTORY_OFFICERS.find((o) =>
        o.name.toLowerCase().includes(initialOfficerName.toLowerCase()) ||
        o.cadre.toLowerCase().includes(initialOfficerName.toLowerCase())
      );
      if (found) return found;
    }
    return STATUTORY_OFFICERS[0]; // Default to DGMS Regional Officer or Mine Manager
  });

  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab);
  const [labourSubTab, setLabourSubTab] = useState<'muster' | 'ocr'>('muster');
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navItems: { id: DashboardTab; label: string; icon: string; badge?: string; desc: string }[] = [
    {
      id: 'overview',
      label: 'Overview Grid',
      icon: 'dashboard',
      desc: 'Operational summary & gauges'
    },
    {
      id: 'gis-radar',
      label: 'GIS Spatial Radar',
      icon: 'radar',
      badge: 'LIVE FOS 1.48',
      desc: 'Highwall slope stability radar'
    },
    {
      id: 'statutory-board',
      label: 'Statutory Board',
      icon: 'gavel',
      badge: 'CMR 2017',
      desc: 'Regulatory directives & vault'
    },
    {
      id: 'inspection-capa',
      label: 'Inspection & CAPA',
      icon: 'fact_check',
      badge: '3 ACTION',
      desc: 'Form 24 non-conformance logs'
    },
    {
      id: 'mobile-inspector',
      label: 'Mobile Inspector',
      icon: 'photo_camera',
      badge: 'v4.2 HUD',
      desc: 'In-pit camera reticle & GPS'
    },
    {
      id: 'labor-ocr',
      label: 'Labor & Contractors',
      icon: 'engineering',
      badge: 'DGMS VTC',
      desc: 'Contractor Labor & VTC Gate Pass'
    },
    {
      id: 'audit-readiness',
      label: 'Audit Readiness',
      icon: 'verified_user',
      badge: 'SHA-256',
      desc: 'Cryptographic Merkle ledger'
    }
  ];

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Top Universal Breadcrumb & Context Navigation */}
      <div className="bg-[#091322] border border-slate-800 px-4 py-2.5 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveView('national-command')}
            className="text-slate-400 hover:text-amber-400 flex items-center gap-1 font-bold cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-sm text-amber-400">home</span>
            <span>Home Page</span>
          </button>
          <span className="text-slate-600">/</span>
          <button
            onClick={() => setActiveView('role-gateways')}
            className="text-slate-400 hover:text-amber-400 cursor-pointer transition-colors font-semibold"
          >
            Role Gateways
          </button>
          <span className="text-slate-600">/</span>
          <span className="text-amber-400 font-mono font-bold">
            {selectedOfficer.cadre} Console
          </span>
          <span className="text-slate-600">/</span>
          <span className="text-white font-bold capitalize bg-slate-800/80 px-2 py-0.5 rounded">
            {navItems.find((n) => n.id === activeTab)?.label}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Switch Officer Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
              className="bg-[#10223b] hover:bg-[#163054] text-amber-300 border border-amber-500/40 px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow"
            >
              <span className="material-symbols-outlined text-xs">sync_alt</span>
              <span>Switch Cadre ({selectedOfficer.cadre.split(' ')[0]})</span>
              <span className="material-symbols-outlined text-xs">arrow_drop_down</span>
            </button>

            {showRoleSwitcher && (
              <div className="absolute right-0 top-full mt-1.5 w-72 bg-[#0a1526] border-2 border-amber-500/40 rounded-xl shadow-2xl p-2 z-50 space-y-1">
                <div className="px-2 py-1 text-[10px] font-mono text-slate-400 border-b border-slate-800 uppercase font-bold">
                  Select Statutory Perspective:
                </div>
                {STATUTORY_OFFICERS.map((officer) => (
                  <button
                    key={officer.id}
                    onClick={() => {
                      setSelectedOfficer(officer);
                      setShowRoleSwitcher(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg flex items-center gap-2.5 transition-all cursor-pointer text-xs ${
                      selectedOfficer.id === officer.id
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                        : 'text-slate-300 hover:bg-slate-800/80'
                    }`}
                  >
                    <img
                      src={officer.avatarUrl || officer.imageUrl}
                      alt={officer.name}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover border border-slate-700"
                    />
                    <div className="overflow-hidden">
                      <div className="font-bold truncate">{officer.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{officer.cadre}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveView('national-command')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-xs">logout</span>
            <span className="hidden sm:inline">Exit to Home</span>
          </button>
        </div>
      </div>

      {/* Unified Colliery Officer Layout: Left Sidebar + Right Content Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ===================== LEFT SIDEBAR (3 cols on desktop) ===================== */}
        <aside className="lg:col-span-3 space-y-3">
          
          {/* Active Officer Identity Dossier Card */}
          <div className="bg-gradient-to-b from-[#0e1c31] via-[#0b1626] to-[#070e1a] border-2 border-amber-500/40 rounded-2xl p-4 shadow-xl space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full pointer-events-none"></div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={selectedOfficer.avatarUrl || selectedOfficer.imageUrl}
                  alt={selectedOfficer.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-xl object-cover border-2 border-amber-400 shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950 flex items-center justify-center text-[9px] text-white">
                  ✓
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block truncate">
                  {selectedOfficer.regulationCode}
                </span>
                <h3 className="font-bold text-white text-sm truncate">{selectedOfficer.name}</h3>
                <p className="text-[11px] text-slate-300 font-medium truncate">{selectedOfficer.cadre}</p>
                <div className="mt-1 inline-flex items-center gap-1 text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{selectedOfficer.verificationStatus}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>Jharia Pit #04</span>
              <span>DSC Key: VALID</span>
              <span className="text-amber-400 font-bold">Shift 1</span>
            </div>
          </div>

          {/* Navigation Sidebar Options */}
          <nav className="bg-[#091322] border border-slate-800 rounded-2xl p-2.5 shadow-xl space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800/80 mb-1 flex items-center justify-between">
              <span>STATUTORY MODULES</span>
              <span className="text-amber-400">7 ACTIVE</span>
            </div>

            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`dashboard-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all duration-150 group cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                      : 'hover:bg-[#102035] text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`material-symbols-outlined text-lg transition-transform group-hover:scale-110 ${
                      isActive ? 'text-slate-950' : 'text-amber-400'
                    }`}>
                      {item.icon}
                    </span>
                    <div className="truncate">
                      <div className="text-xs font-bold leading-tight">{item.label}</div>
                      <div className={`text-[10px] leading-none mt-0.5 truncate ${
                        isActive ? 'text-slate-900 font-medium' : 'text-slate-400'
                      }`}>
                        {item.desc}
                      </div>
                    </div>
                  </div>

                  {item.badge && (
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ml-2 whitespace-nowrap ${
                      isActive
                        ? 'bg-slate-950/20 text-slate-950 border border-slate-950/30'
                        : 'bg-slate-800 text-amber-300 border border-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Statutory Emergency & Operations Panel */}
          <div className="bg-[#091322] border border-slate-800 rounded-2xl p-3.5 shadow-xl space-y-2 text-xs font-mono">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              COLLIERY COMMAND INTERLOCKS:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onOpenCopilot}
                className="bg-[#10243e] hover:bg-[#173458] p-2 rounded-xl border border-cyan-500/30 text-cyan-300 flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow"
              >
                <span className="material-symbols-outlined text-base mb-0.5 text-cyan-400">psychology</span>
                <span className="text-[10px] font-bold">AI Copilot</span>
              </button>

              <button
                onClick={onOpenBlast}
                className="bg-rose-950/50 hover:bg-rose-900/60 p-2 rounded-xl border border-rose-500/40 text-rose-300 flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow"
              >
                <span className="material-symbols-outlined text-base mb-0.5 text-rose-400">warning</span>
                <span className="text-[10px] font-bold">Blast Siren</span>
              </button>
            </div>

            <button
              onClick={onOpenDispatch}
              className="w-full bg-[#0d1c31] hover:bg-[#132845] p-2 rounded-xl border border-amber-500/30 text-amber-300 flex items-center justify-center gap-1.5 cursor-pointer transition-all font-bold text-[11px]"
            >
              <span className="material-symbols-outlined text-sm">local_shipping</span>
              <span>Weighbridge Siding #02</span>
            </button>
          </div>
        </aside>

        {/* ===================== RIGHT WORKSPACE (9 cols on desktop) ===================== */}
        <main className="lg:col-span-9 min-w-0">
          
          {/* TAB 1: OVERVIEW GRID */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Officer-Specific Welcome Banner */}
              <div className="bg-gradient-to-r from-[#0c182c] via-[#0a1527] to-[#070e1a] border-2 border-amber-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-mono font-bold mb-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                      <span>ACTIVE STATUTORY SESSION: {selectedOfficer.badge}</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white font-serif">
                      Welcome, {selectedOfficer.name}
                    </h2>
                    <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                      {selectedOfficer.description}
                    </p>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-700 p-3.5 rounded-xl text-center font-mono text-xs">
                    <span className="text-slate-400 text-[10px] block">COLLIERY JURISDICTION</span>
                    <span className="text-amber-400 font-bold block text-sm">BCCL / JHARIA AREA #04</span>
                    <span className="text-emerald-400 text-[10px] block mt-0.5">● Zero Lost-Time Injuries (142 Days)</span>
                  </div>
                </div>

                {/* Statutory Key Responsibilities Accordion / Pills */}
                <div className="mt-4 pt-4 border-t border-slate-800/80">
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block mb-2">
                    Primary Statutory Mandates for this Cadre:
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-slate-300">
                    {selectedOfficer.responsibilities.map((resp, idx) => (
                      <div key={idx} className="bg-[#050c18] p-2.5 rounded-lg border border-slate-800 flex items-start gap-2">
                        <span className="material-symbols-outlined text-amber-400 text-sm mt-0.5">verified</span>
                        <span className="text-[11px] leading-tight">{resp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Operational Gauges & Sensor Telemetry (4 Cards) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                
                {/* Gauge 1: Gas Safety */}
                <div
                  onClick={() => setActiveTab('statutory-board')}
                  className="bg-[#091322] hover:bg-[#0d1a2f] p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer shadow-lg group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">CMR 153 MINE AIR</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]"></span>
                  </div>
                  <div className="text-2xl font-black font-mono text-white group-hover:text-emerald-300 transition-colors">
                    CH4: 0.28%
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    CO: 12 ppm • Airflow: 42 m³/s
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Degree-III Gassy Seam</span>
                    <span className="text-emerald-400 font-bold">NORMAL</span>
                  </div>
                </div>

                {/* Gauge 2: Highwall Radar FOS */}
                <div
                  onClick={() => setActiveTab('gis-radar')}
                  className="bg-[#091322] hover:bg-[#0d1a2f] p-4 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer shadow-lg group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">SSR-XT RADAR</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]"></span>
                  </div>
                  <div className="text-2xl font-black font-mono text-white group-hover:text-cyan-300 transition-colors">
                    FOS: 1.48
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    Bench 4B • Disp: 0.4 mm/hr
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>18 Prisms Synchronized</span>
                    <span className="text-cyan-400 font-bold">SECURE</span>
                  </div>
                </div>

                {/* Gauge 3: Inspection CAPA */}
                <div
                  onClick={() => setActiveTab('inspection-capa')}
                  className="bg-[#091322] hover:bg-[#0d1a2f] p-4 rounded-2xl border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer shadow-lg group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">FORM-24 CAPA</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]"></span>
                  </div>
                  <div className="text-2xl font-black font-mono text-white group-hover:text-amber-300 transition-colors">
                    4 Open Items
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    1 Critical (Bench slope trimming)
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Deadline: 14:00 IST</span>
                    <span className="text-amber-400 font-bold">IN PROGRESS</span>
                  </div>
                </div>

                {/* Gauge 4: Dispatch & Form-B Muster */}
                <div
                  onClick={() => setActiveTab('labor-ocr')}
                  className="bg-[#091322] hover:bg-[#0d1a2f] p-4 rounded-2xl border border-slate-800 hover:border-orange-500/50 transition-all cursor-pointer shadow-lg group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-orange-400 font-bold uppercase">WORKFORCE MUSTER</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  </div>
                  <div className="text-2xl font-black font-mono text-white group-hover:text-orange-300 transition-colors">
                    1,842 Clocked
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    98.6% VTC • 14 Contractors
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Biometric Gates Active</span>
                    <span className="text-emerald-400 font-bold">100% PASS</span>
                  </div>
                </div>
              </div>

              {/* 1. Statutory Telemetry Analysis (Combined Percentage, Incident, Alarms; 6M/12M; 4 KPI options + Graph) */}
              <StatutoryTelemetryAnalysis />

              {/* 2. Live GIS Operating Coal Field (Left) + Compliance Alert Feed & EMI Intelligent Dispatchment (Right) */}
              <CollieryGisAlertsSection />

              {/* 3. Coal India Operating Subsidiaries (DGMS Rate Standing FY24-25) + Statutory Registry & Matrix Table */}
              <CoalIndiaSubsidiariesMatrix />

              {/* Direct Subsystem Access Cards on the Overview */}
              <div className="bg-[#091322] border-2 border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-white font-serif">
                      Direct Operational Subsystems for {selectedOfficer.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Click any console below or use the left navigation sidebar
                    </p>
                  </div>
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30">
                    ALL CONSOLES ACCESSIBLE
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  
                  <div
                    onClick={() => setActiveTab('gis-radar')}
                    className="p-3.5 rounded-xl bg-[#0e1a2c] hover:bg-[#132540] border border-slate-700 hover:border-cyan-500 cursor-pointer transition-all flex items-start gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-xl">radar</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs">GIS Geospatial Radar</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Highwall slope stability, FOS telemetry &amp; live radar sweeps.</p>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold mt-1.5 inline-block">Launch Radar &rarr;</span>
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveTab('statutory-board')}
                    className="p-3.5 rounded-xl bg-[#0e1a2c] hover:bg-[#132540] border border-slate-700 hover:border-amber-500 cursor-pointer transition-all flex items-start gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-xl">gavel</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs">Statutory Board &amp; Vault</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Mines Act directives, Section 22 orders &amp; CMR 2017 dockets.</p>
                      <span className="text-[10px] font-mono text-amber-400 font-bold mt-1.5 inline-block">Open Vault &rarr;</span>
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveTab('inspection-capa')}
                    className="p-3.5 rounded-xl bg-[#0e1a2c] hover:bg-[#132540] border border-slate-700 hover:border-amber-500 cursor-pointer transition-all flex items-start gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-xl">fact_check</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs">Inspection &amp; CAPA</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Form 24 non-conformance logs &amp; corrective actions tracking.</p>
                      <span className="text-[10px] font-mono text-amber-400 font-bold mt-1.5 inline-block">Inspect CAPA &rarr;</span>
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveTab('mobile-inspector')}
                    className="p-3.5 rounded-xl bg-[#0e1a2c] hover:bg-[#132540] border border-slate-700 hover:border-emerald-500 cursor-pointer transition-all flex items-start gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-xl">photo_camera</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs">Mobile Field Inspector</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">In-pit camera HUD, optical reticle &amp; RFID equipment tagger.</p>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold mt-1.5 inline-block">Launch HUD &rarr;</span>
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveTab('labor-ocr')}
                    className="p-3.5 rounded-xl bg-[#0e1a2c] hover:bg-[#132540] border border-slate-700 hover:border-cyan-500 cursor-pointer transition-all flex items-start gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-xl">engineering</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs">Labor &amp; Form-B Muster</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Contractor muster rolls, VTC gate passes &amp; Gemini OCR scan.</p>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold mt-1.5 inline-block">Review Muster &rarr;</span>
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveTab('audit-readiness')}
                    className="p-3.5 rounded-xl bg-[#0e1a2c] hover:bg-[#132540] border border-slate-700 hover:border-orange-500 cursor-pointer transition-all flex items-start gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-xl">verified_user</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs">Audit Ledger (Merkle)</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">SHA-256 immutable ledger &amp; Evidence Act Sec. 65B dossier.</p>
                      <span className="text-[10px] font-mono text-orange-400 font-bold mt-1.5 inline-block">Verify Chain &rarr;</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GIS SPATIAL RADAR */}
          {activeTab === 'gis-radar' && (
            <GisSpatialRadarView onOpenCopilot={onOpenCopilot} />
          )}

          {/* TAB 3: STATUTORY BOARD / VAULT */}
          {activeTab === 'statutory-board' && (
            <StatutoryVaultView
              setActiveView={setActiveView}
              onOpenCopilot={onOpenCopilot}
              onOpenDispatch={onOpenDispatch}
              onOpenBlast={onOpenBlast}
              officerName={selectedOfficer.name}
            />
          )}

          {/* TAB 4: INSPECTION & CAPA */}
          {activeTab === 'inspection-capa' && (
            <InspectionCapaView />
          )}

          {/* TAB 5: MOBILE INSPECTOR */}
          {activeTab === 'mobile-inspector' && (
            <MobileInspectorView
              setActiveView={setActiveView}
              officerName={selectedOfficer.name}
            />
          )}

          {/* TAB 6: LABOR INTELLIGENT & OCR */}
          {activeTab === 'labor-ocr' && (
            <div className="space-y-4">
              {/* Secondary Sub-tab switcher between Form-B Muster and Multimodal OCR */}
              <div className="flex items-center justify-between bg-[#091322] p-2 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLabourSubTab('muster')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      labourSubTab === 'muster'
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">groups</span>
                    <span>Contract Labour &amp; Form-B Muster</span>
                  </button>

                  <button
                    onClick={() => setLabourSubTab('ocr')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      labourSubTab === 'ocr'
                        ? 'bg-cyan-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">document_scanner</span>
                    <span>Multimodal AI OCR Scanner (Gemini 3.7 Pro)</span>
                  </button>
                </div>

                <span className="text-[10px] font-mono text-slate-400 hidden sm:inline pr-2">
                  DGMS CIR. 02/2019 COMPLIANCE
                </span>
              </div>

              {labourSubTab === 'muster' ? (
                <LabourContractorsView
                  setActiveView={setActiveView}
                  onOpenCopilot={onOpenCopilot}
                  officerName={selectedOfficer.name}
                />
              ) : (
                <LabourAiOcrView
                  setActiveView={setActiveView}
                  onOpenCopilot={onOpenCopilot}
                />
              )}
            </div>
          )}

          {/* TAB 7: AUDIT READINESS & LEDGER */}
          {activeTab === 'audit-readiness' && (
            <AuditReadinessView setActiveView={setActiveView} />
          )}

        </main>
      </div>
    </div>
  );
};
