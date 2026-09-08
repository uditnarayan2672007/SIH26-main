import React, { useState } from 'react';
import { ActiveView, StatutoryDocket } from '../types';
import { STATUTORY_DOCKETS } from '../data/mockData';

interface StatutoryVaultViewProps {
  setActiveView: (view: ActiveView) => void;
  onOpenCopilot: () => void;
  onOpenDispatch: () => void;
  onOpenBlast: () => void;
  officerName?: string;
}

export const StatutoryVaultView: React.FC<StatutoryVaultViewProps> = ({
  setActiveView,
  onOpenCopilot,
  onOpenDispatch,
  onOpenBlast,
  officerName = 'SWADHIN SAHA'
}) => {
  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [authorityFilter, setAuthorityFilter] = useState('ALL');
  const [subsidiaryFilter, setSubsidiaryFilter] = useState('ALL');
  const [mineFilter, setMineFilter] = useState('ALL');

  // Quick Filter Pills
  const [quickFilter, setQuickFilter] = useState<'NONE' | 'URGENT' | 'CMR_REG' | 'HIGH_PENALTY' | 'CARBON_MANDATE'>('NONE');

  // State for adding mandate modal
  const [showAddMandateModal, setShowAddMandateModal] = useState(false);
  const [newMandateTitle, setNewMandateTitle] = useState('');
  const [newMandateReg, setNewMandateReg] = useState('CMR 2017 Reg 106');
  const [newMandateAuthority, setNewMandateAuthority] = useState('DGMS Dhanbad');
  const [newMandateDueDate, setNewMandateDueDate] = useState('24 Hours');

  // Modals for Exposure Notice
  const [showAiStrategyModal, setShowAiStrategyModal] = useState(false);
  const [showFilingModal, setShowFilingModal] = useState(false);
  const [showLiabilityBreakdownModal, setShowLiabilityBreakdownModal] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  // Dockets list
  const [docketsList, setDocketsList] = useState<StatutoryDocket[]>(STATUTORY_DOCKETS);

  // Filter logic
  const filteredDockets = docketsList.filter((docket) => {
    const matchesSearch =
      docket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      docket.regulation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      docket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      docket.authority.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    // Quick filters
    if (quickFilter === 'URGENT' && !docket.status.toLowerCase().includes('pending') && !docket.status.toLowerCase().includes('action')) {
      return false;
    }
    if (quickFilter === 'CMR_REG' && !docket.regulation.includes('CMR')) {
      return false;
    }
    if (quickFilter === 'HIGH_PENALTY' && !docket.id.includes('SEC22') && !docket.id.includes('GAS')) {
      return false;
    }
    if (quickFilter === 'CARBON_MANDATE' && !docket.tags.some(t => t.toLowerCase().includes('carbon') || t.toLowerCase().includes('emission') || t.toLowerCase().includes('environment') || t.toLowerCase().includes('gas'))) {
      return false;
    }

    // Category filter
    if (categoryFilter === 'GAS' && !docket.id.includes('GAS') && !docket.regulation.includes('153')) return false;
    if (categoryFilter === 'BLAST' && !docket.id.includes('BLAST') && !docket.regulation.includes('164')) return false;
    if (categoryFilter === 'SLOPE' && !docket.id.includes('SEC22') && !docket.regulation.includes('106')) return false;

    return true;
  });

  const handleCreateMandate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMandateTitle.trim()) return;
    const newDocket: StatutoryDocket = {
      id: `DOC-NEW-${Date.now().toString().slice(-4)}`,
      title: newMandateTitle,
      regulation: newMandateReg,
      status: 'Action Required',
      dueText: `Due in ${newMandateDueDate}`,
      frequency: 'Statutory Immediate',
      assignedOfficer: officerName,
      verifiedDossiers: 'Pending Digital Signature',
      authority: newMandateAuthority,
      imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1WBop4_-T6gF4WdHW05QwKuybRNyjj1n-9DGw970S7Yw0qTdu2cCghsySkTCO_4_dCzi7IKIygao7ctZYBo7XTS4LBDHzALEFviRmVGFdt0bqwYJ81JPeKsRBu6MmC42Ah6xCrFtSJt5J9j6glwG_ZnEgwn0YOBduvE6OVrPEe3hSaBMEn1ezRoU_LXlpRKQ2RlFPg4tDXPeoFWvtnCkgpw4zK-ZY269JFd51_Or0cZlj3SvLBbN__PmFjJ',
      summary: `Mandate added under ${newMandateReg} from ${newMandateAuthority}. Requires statutory compliance review and DSC sign-off.`,
      tags: ['Statutory Mandate', newMandateReg, 'DGMS Filing']
    };
    setDocketsList([newDocket, ...docketsList]);
    setShowAddMandateModal(false);
    setNewMandateTitle('');
    alert(`Statutory Mandate Added Successfully!\nDocket ID: ${newDocket.id}\nAssigned to: ${officerName}`);
  };

  const handleSignDocket = (id: string) => {
    alert(
      `Docket ${id} Authenticated and Signed!\n` +
      `Signed by: ${officerName}\n` +
      `Cryptographic Token: FIPS 140-2 Level 3 Class-3 DSC\n` +
      `Hash: SHA256:4a7f9b2c... registered with DGMS Central Vault.`
    );
  };

  const handleAcknowledgeNotice = () => {
    setAcknowledged(true);
    alert(
      `Statutory Acknowledgement & Rectification Undertaking Logged!\n\n` +
      `Officer: ${officerName}\n` +
      `Ref: DGMS/EZ/JHR-OC/SEC22-09\n` +
      `Liability Status: Fine escalation halted pending inspector re-survey.`
    );
  };

  return (
    <div id="statutory-vault-view" className="w-full flex flex-col space-y-6 py-2">
      
      {/* 1. TOP SECTION: STATUTORY LEGAL OBLIGATIONS AND REGULATORY FILINGS */}
      {/* (User requirement: top shown statutory legal obligations and regulatory filings with + icon, + add statutory mandate, and counters: 140 total filings, overdue, DGMS review, compliance index) */}
      <div className="bg-gradient-to-r from-[#0a1628] via-[#07111e] to-[#050b14] border-2 border-amber-500/40 p-5 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-full bg-radial from-amber-500/10 to-transparent pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-0.5 rounded-full text-xs font-mono font-bold">
                MINES ACT 1952 &amp; CMR 2017 STATUTORY BOARD
              </span>
              <span className="text-slate-400 text-xs font-mono">Official Regulatory Repository</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white font-serif tracking-tight">
              Statutory Legal Obligations &amp; Regulatory Filings
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Legally binding compliance dockets, continuous sensor interlock affirmations, and statutory returns under the Directorate General of Mines Safety (DGMS).
            </p>
          </div>

          {/* Right Action: + Add Statutory Mandate Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddMandateModal(true)}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 border border-amber-400"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              <span>+ Add Statutory Mandate</span>
            </button>

            <button
              onClick={onOpenCopilot}
              className="bg-[#10223b] hover:bg-[#163054] text-cyan-300 border border-cyan-500/40 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow"
            >
              <span className="material-symbols-outlined text-sm text-cyan-400">psychology</span>
              <span>AI Legal Counsel</span>
            </button>
          </div>
        </div>

        {/* Four Statutory Counters: Total Filings (140), Overdue, DGMS Review, Compliance Index */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800/80 font-mono">
          <div className="bg-[#050c18] p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">TOTAL FILINGS</span>
            <div className="text-2xl font-black text-white mt-0.5">140 <span className="text-xs text-slate-400 font-normal">dockets</span></div>
            <span className="text-[10px] text-emerald-400">138 Active • 2 In Review</span>
          </div>

          <div className="bg-[#050c18] p-3 rounded-xl border border-rose-500/40">
            <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider block">STATUTORY OVERDUE</span>
            <div className="text-2xl font-black text-rose-400 mt-0.5 flex items-center gap-1.5">
              <span>2</span>
              <span className="text-xs bg-rose-950 text-rose-300 border border-rose-600 px-2 py-0.5 rounded-full font-bold animate-pulse">
                IMMEDIATE
              </span>
            </div>
            <span className="text-[10px] text-rose-300">Section 22 &amp; Reg 106 Notice</span>
          </div>

          <div className="bg-[#050c18] p-3 rounded-xl border border-amber-500/30">
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">DGMS REVIEW</span>
            <div className="text-2xl font-black text-amber-300 mt-0.5">5 <span className="text-xs text-slate-400 font-normal">pending</span></div>
            <span className="text-[10px] text-slate-400">Dhanbad Zonal Directorate</span>
          </div>

          <div className="bg-[#050c18] p-3 rounded-xl border border-cyan-500/30">
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">COMPLIANCE INDEX</span>
            <div className="text-2xl font-black text-emerald-400 mt-0.5">99.2%</div>
            <span className="text-[10px] text-emerald-400">Benchmark: 98.0% Pass</span>
          </div>
        </div>
      </div>

      {/* 2. SEARCH BAR & MULTI-CATEGORY FILTERS */}
      {/* (User requirement: search option regulation act reference colliery statutory rule, filter options: categories, status, authority, subsidiary, my coal mines, and quick filters) */}
      <div className="bg-[#091322] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3 font-mono text-xs">
        
        {/* Main Search Input */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-slate-400 text-base">
            search
          </span>
          <input
            type="text"
            placeholder="Search regulation, act reference, colliery statutory rule, or docket identifier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#050c18] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* 5 Filter Dropdowns: Category, Status, Authority, Subsidiary, My Coal Mines */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {/* Categories */}
          <div>
            <label className="text-[9px] text-slate-400 font-bold uppercase block mb-1">CATEGORY:</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs py-1.5 px-2 rounded-lg focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="GAS">Gas &amp; Ventilation (CMR 153)</option>
              <option value="SLOPE">Strata &amp; Slope (CMR 106)</option>
              <option value="BLAST">Blasting &amp; Explosives (CMR 164)</option>
              <option value="MACHINERY">HEMM &amp; Electrical Interlocks</option>
              <option value="LABOR">Form-B &amp; Labor Safety</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="text-[9px] text-slate-400 font-bold uppercase block mb-1">STATUS:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs py-1.5 px-2 rounded-lg focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="OVERDUE">Statutory Overdue</option>
              <option value="ACTION">Action Required</option>
              <option value="REVIEW">Under DGMS Review</option>
              <option value="COMPLIANT">Fully Compliant</option>
            </select>
          </div>

          {/* Authority */}
          <div>
            <label className="text-[9px] text-slate-400 font-bold uppercase block mb-1">AUTHORITY:</label>
            <select
              value={authorityFilter}
              onChange={(e) => setAuthorityFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs py-1.5 px-2 rounded-lg focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="ALL">All Authorities</option>
              <option value="DGMS">DGMS Eastern Zone (Dhanbad)</option>
              <option value="MOEFCC">MoEFCC Environment Board</option>
              <option value="SPCB">State Pollution Control Board</option>
              <option value="CIL_SAFETY">CIL Central Safety Board</option>
            </select>
          </div>

          {/* Subsidiary */}
          <div>
            <label className="text-[9px] text-slate-400 font-bold uppercase block mb-1">SUBSIDIARY:</label>
            <select
              value={subsidiaryFilter}
              onChange={(e) => setSubsidiaryFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs py-1.5 px-2 rounded-lg focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="ALL">All Subsidiaries</option>
              <option value="BCCL">BCCL (Bharat Coking Coal)</option>
              <option value="ECL">ECL (Eastern Coalfields)</option>
              <option value="CCL">CCL (Central Coalfields)</option>
              <option value="WCL">WCL (Western Coalfields)</option>
              <option value="NCL">NCL (Northern Coalfields)</option>
              <option value="SECL">SECL (South Eastern)</option>
              <option value="MCL">MCL (Mahanadi Coalfields)</option>
            </select>
          </div>

          {/* My Coal Mines */}
          <div className="col-span-2 sm:col-span-1">
            <label className="text-[9px] text-slate-400 font-bold uppercase block mb-1">MY COAL MINES:</label>
            <select
              value={mineFilter}
              onChange={(e) => setMineFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs py-1.5 px-2 rounded-lg focus:outline-none focus:border-amber-400 cursor-pointer font-bold text-amber-300"
            >
              <option value="ALL">All My Coal Mines</option>
              <option value="JHARIA">Jharia Pit #04 (Seam XIV)</option>
              <option value="MOONIDIH">Moonidih Longwall Underground</option>
              <option value="GEVRA">Gevra Mega Opencast Bench</option>
              <option value="JAYANT">Jayant Singrauli Basin</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Pills (User requirement: urgent filings, CMR reg, high liability penalty, carbon limited required) */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-[10px] text-slate-400 uppercase font-bold">QUICK FILTERS:</span>
          
          <button
            onClick={() => setQuickFilter(quickFilter === 'URGENT' ? 'NONE' : 'URGENT')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
              quickFilter === 'URGENT'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            ⚡ Urgent Filings
          </button>

          <button
            onClick={() => setQuickFilter(quickFilter === 'CMR_REG' ? 'NONE' : 'CMR_REG')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
              quickFilter === 'CMR_REG'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            📜 CMR Reg 2017
          </button>

          <button
            onClick={() => setQuickFilter(quickFilter === 'HIGH_PENALTY' ? 'NONE' : 'HIGH_PENALTY')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
              quickFilter === 'HIGH_PENALTY'
                ? 'bg-red-500/20 text-red-300 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            ⚠️ High Liability Penalty
          </button>

          <button
            onClick={() => setQuickFilter(quickFilter === 'CARBON_MANDATE' ? 'NONE' : 'CARBON_MANDATE')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
              quickFilter === 'CARBON_MANDATE'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            🌱 Carbon / Emission Mandate Required
          </button>

          {quickFilter !== 'NONE' && (
            <button
              onClick={() => setQuickFilter('NONE')}
              className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer ml-auto"
            >
              Clear Quick Filters
            </button>
          )}
        </div>
      </div>

      {/* 3. STATUTORY LIABILITY EXPOSURE NOTICE (₹15,00,000/Day Fine Notice) */}
      {/* (User requirement: statutory liability exposure notice such as 15 lakhs day fine with audit frequency, statutory deadline, assigned officer, verified documents, AI legal strategy, view filing, file acknowledgement, liability) */}
      <div className="bg-gradient-to-br from-red-950/90 via-[#180808] to-[#0d0404] border-2 border-red-500/80 rounded-2xl p-6 shadow-2xl space-y-4">
        
        {/* Top Emergency Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-red-900/60">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-red-600/30 border border-red-500 flex items-center justify-center text-red-400 animate-pulse shrink-0">
              <span className="material-symbols-outlined text-2xl">warning</span>
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase bg-red-600 text-white font-black px-2 py-0.5 rounded shadow">
                  STATUTORY LIABILITY EXPOSURE NOTICE
                </span>
                <span className="text-[11px] font-mono text-red-300">REF: DGMS/EZ/JHR-OC/SEC22-09</span>
              </div>
              <h3 className="font-headline text-lg md:text-xl font-bold text-white mt-1 font-serif">
                Mines Act 1952 Section 22 Stop-Work &amp; Escalating Liability Order
              </h3>
            </div>
          </div>

          {/* Daily Escalating Fine Badge */}
          <div className="bg-red-950/90 border-2 border-red-500 rounded-xl p-3 text-right font-mono shadow-lg">
            <span className="text-[9px] text-red-400 uppercase font-bold block">STATUTORY DAILY EXPOSURE FINE</span>
            <div className="text-xl md:text-2xl font-black text-white text-red-200">
              ₹15,00,000 <span className="text-xs font-bold text-red-400">/ DAY</span>
            </div>
            <span className="text-[9px] text-amber-300 font-bold">Escalating daily penalty until certified regrading</span>
          </div>
        </div>

        {/* Notice Core Grid: Image, Radar, and Technical Details */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Geotechnical Radar Scan */}
          <div className="md:col-span-5 relative rounded-xl overflow-hidden border border-red-500/60 shadow-lg group">
            <img
              src="https://lh3.googleusercontent.com/aida/AEtjO1UJ1zH_RMkscVLXZqdgz1SfHDjOqqs8ZC87XC5VPfgGkPU9_b_i2qUW7C6WWzJuUz4rQV3MSEz0K_Xjj6x8Rdv89ZOWwABMTyCtaQ5sFkDJKqCK5XftRH9FpXY4V8UuHBZkAB0lrcyhweqnXvfrXe2Xb8um7VE3kks8lKoKlZSf76Os3kOc9vrBSJ8Erp3VuqupzqGhfKuzLfU9nz1Dt5DGX3TMNXp_zQiUPNOH1VxCWtIUTmBVdU7SXnQF"
              alt="Geotechnical slope stability radar scan - Sector 2B Pit-4 Overburden"
              className="w-full h-44 object-cover"
            />
            <div className="absolute inset-0 bg-red-950/25 group-hover:bg-transparent transition-colors"></div>
            <div className="absolute bottom-2 left-2 right-2 bg-slate-950/90 px-2.5 py-1 rounded backdrop-blur-sm text-[10px] font-mono text-red-300 flex justify-between border border-red-500/30">
              <span>RADAR PRISM #04 (Sector 2B)</span>
              <span className="font-bold text-red-400">14 mm/day CREEP (FOS 1.18)</span>
            </div>
          </div>

          {/* Detailed Statutory Mandate Fields: Audit Frequency, Deadline, Assigned Officer, Verified Documents */}
          <div className="md:col-span-7 space-y-3 font-mono text-xs">
            <p className="text-slate-200 leading-relaxed font-sans text-xs">
              <strong className="text-red-300">Geotechnical Bench Instability Detected:</strong> SSR-XT ground interferometric radar observed shear creep exceeding safe threshold (2.0 mm/hr) along Overburden Bench 4B. DGMS Notice mandates immediate haulage prohibition within 60m of crest.
            </p>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-red-950/60 p-2 rounded-lg border border-red-900">
                <span className="text-slate-400 text-[9px] uppercase block">AUDIT FREQUENCY:</span>
                <span className="text-white font-bold">Continuous Real-time / Daily Inspection</span>
              </div>

              <div className="bg-red-950/60 p-2 rounded-lg border border-red-900">
                <span className="text-slate-400 text-[9px] uppercase block">STATUTORY DEADLINE:</span>
                <span className="text-amber-400 font-bold">24 Hours (Immediate Action)</span>
              </div>

              <div className="bg-red-950/60 p-2 rounded-lg border border-red-900">
                <span className="text-slate-400 text-[9px] uppercase block">ASSIGNED OFFICER:</span>
                <span className="text-cyan-300 font-bold">{officerName} (Mine Manager)</span>
              </div>

              <div className="bg-red-950/60 p-2 rounded-lg border border-red-900">
                <span className="text-slate-400 text-[9px] uppercase block">VERIFIED DOCUMENTS:</span>
                <span className="text-emerald-400 font-bold">Form 24 • LiDAR Model v4.2 • SSR-XT Log</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Action Buttons: AI Legal Strategy, View Filing, File Acknowledgement, Liability Breakdown */}
        <div className="pt-3 border-t border-red-900/60 flex flex-wrap items-center justify-between gap-2.5">
          <div className="text-xs text-red-300 font-mono">
            {acknowledged
              ? '✓ Acknowledgement digitally affirmed under DSC. Inspector verification in progress.'
              : 'Action required within statutory 24-hr deadline to vacate daily fine.'}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* AI Legal Strategy */}
            <button
              onClick={() => setShowAiStrategyModal(true)}
              className="bg-cyan-950/80 hover:bg-cyan-900 text-cyan-200 border border-cyan-500/50 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow"
            >
              <span className="material-symbols-outlined text-sm text-cyan-400">psychology</span>
              <span>AI Legal Strategy</span>
            </button>

            {/* View Filing */}
            <button
              onClick={() => setShowFilingModal(true)}
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow"
            >
              <span className="material-symbols-outlined text-sm text-amber-400">description</span>
              <span>View Filing</span>
            </button>

            {/* Liability Breakdown */}
            <button
              onClick={() => setShowLiabilityBreakdownModal(true)}
              className="bg-amber-950/80 hover:bg-amber-900 text-amber-200 border border-amber-500/50 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow"
            >
              <span className="material-symbols-outlined text-sm text-amber-400">calculate</span>
              <span>Liability Breakdown</span>
            </button>

            {/* File Acknowledgement */}
            <button
              onClick={handleAcknowledgeNotice}
              disabled={acknowledged}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg ${
                acknowledged
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-red-950/50'
              }`}
            >
              <span className="material-symbols-outlined text-sm">
                {acknowledged ? 'verified' : 'draw'}
              </span>
              <span>{acknowledged ? 'Affirmation Filed' : 'File Acknowledgement (DSC)'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* 4. ACTIVE STATUTORY DOCKET REGISTRY */}
      {/* (User requirement: active statutory docket registry with options) */}
      <div className="bg-[#091322] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <h3 className="font-headline text-lg font-bold text-white font-serif">
                Active Statutory Docket Registry
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified legal records, mandatory returns &amp; shift logs under Coal Mines Regulations 2017
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-300 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
            Showing {filteredDockets.length} of {docketsList.length} Dockets
          </span>
        </div>

        {/* Docket Cards Grid */}
        <div className="space-y-3.5">
          {filteredDockets.map((docket) => (
            <div
              key={docket.id}
              className="p-4 rounded-xl border border-slate-800/90 bg-[#060e1c] hover:border-amber-500/40 transition-all flex flex-col md:flex-row items-start md:items-center gap-4 shadow-lg group"
            >
              {/* Thumbnail with Regulation Badge */}
              <div className="relative w-full md:w-36 h-24 rounded-lg overflow-hidden shrink-0 border border-slate-700 bg-slate-950">
                <img
                  src={docket.imageUrl}
                  alt={docket.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute top-1 left-1 text-[8px] font-mono font-bold bg-slate-950/90 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
                  {docket.regulation}
                </span>
                {docket.hudMetrics && (
                  <div className="absolute bottom-1 left-1 right-1 bg-slate-950/90 px-1 py-0.5 rounded text-[8px] font-mono flex justify-between">
                    {docket.hudMetrics.slice(0, 2).map((m, i) => (
                      <span key={i} className={m.color || 'text-slate-200'}>
                        {m.label}: {m.value}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Docket Content Body */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
                      {docket.id}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{docket.authority}</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    {docket.status}
                  </span>
                </div>

                <h4 className="font-bold text-white text-sm leading-snug">
                  {docket.title}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {docket.summary}
                </p>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {docket.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] font-mono bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800"
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="text-[9px] font-mono text-cyan-400 ml-auto">
                    Assigned: <strong>{officerName}</strong>
                  </span>
                </div>
              </div>

              {/* Action Column */}
              <div className="flex flex-col items-end justify-center shrink-0 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-800 font-mono">
                <span className="text-[10px] text-amber-300 mb-2 font-bold">{docket.dueText}</span>
                <button
                  onClick={() => handleSignDocket(docket.id)}
                  className="w-full md:w-auto bg-[#10223a] hover:bg-[#163054] border border-cyan-500/40 text-cyan-200 px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow"
                >
                  <span className="material-symbols-outlined text-sm text-cyan-400">lock</span>
                  <span>Sign with DSC</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. CONTINUOUS TELEMETRIC GAS MONITORING (User requirement: continuous limited gas monitoring with options) */}
      <div className="bg-[#091322] border-2 border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-emerald-400">air</span>
                <span>CMR 2017 REGULATION 153 &amp; 154</span>
              </span>
            </div>
            <h3 className="font-headline text-base font-bold text-white mt-0.5">
              Continuous Telemetric Gas Monitoring &amp; Environmental Telemetry
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>12 SCADA SENSORS SYNCHRONIZED</span>
            </span>
          </div>
        </div>

        {/* Gas Telemetry Dashboard Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-[#050c18] p-3 rounded-xl border border-emerald-500/40">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span>CH4 INTAKE/RETURN</span>
              <span className="text-emerald-400 font-bold">SAFE</span>
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono">0.28%</div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden my-1.5">
              <div className="bg-emerald-400 h-full" style={{ width: '37%' }}></div>
            </div>
            <div className="flex justify-between text-[9px] text-slate-400">
              <span>Threshold: 0.75%</span>
              <span>Trip: 1.25%</span>
            </div>
          </div>

          <div className="bg-[#050c18] p-3 rounded-xl border border-cyan-500/40">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span>CO TOXICITY</span>
              <span className="text-cyan-400 font-bold">NOMINAL</span>
            </div>
            <div className="text-2xl font-black text-cyan-300 font-mono">12 PPM</div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden my-1.5">
              <div className="bg-cyan-400 h-full" style={{ width: '24%' }}></div>
            </div>
            <div className="flex justify-between text-[9px] text-slate-400">
              <span>Max: 25 PPM</span>
              <span>Graham Ratio: 0.28</span>
            </div>
          </div>

          <div className="bg-[#050c18] p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span>O2 CONCENTRATION</span>
              <span className="text-white font-bold">OPTIMAL</span>
            </div>
            <div className="text-2xl font-black text-white font-mono">20.8%</div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden my-1.5">
              <div className="bg-blue-400 h-full" style={{ width: '95%' }}></div>
            </div>
            <div className="flex justify-between text-[9px] text-slate-400">
              <span>Min Statutory: 19.0%</span>
              <span>Airflow: 42 m³/s</span>
            </div>
          </div>

          <div className="bg-[#050c18] p-3 rounded-xl border border-amber-500/40">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span>DESORPTION RATE</span>
              <span className="text-amber-400 font-bold">NORMAL</span>
            </div>
            <div className="text-2xl font-black text-amber-300 font-mono">3.4 m³/t</div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden my-1.5">
              <div className="bg-amber-400 h-full" style={{ width: '45%' }}></div>
            </div>
            <div className="flex justify-between text-[9px] text-slate-400">
              <span>Degas: Active</span>
              <span>Vent Fan: 124 mm WG</span>
            </div>
          </div>
        </div>

        {/* Interactive Gas Safety Affirmation Button */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-slate-400">
            Flame Safety Lamp &amp; Multi-Gas Telemetry Sensor checks verified under CMR 2017 Reg 154.
          </span>
          <button
            onClick={() => alert(`Continuous Gas Monitoring Certificate Generated!\n\nColliery: Jharia Pit #04\nCH4: 0.28% | CO: 12 ppm | O2: 20.8%\nAffirmed by: ${officerName}\nDGMS SCADA Hub Status: SYNCED.`)}
            className="px-3 py-1.5 bg-[#0f2138] hover:bg-[#163255] text-cyan-300 border border-cyan-500/40 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow"
          >
            <span className="material-symbols-outlined text-sm">verified</span>
            <span>Download Statutory Gas Clearance Certificate</span>
          </button>
        </div>
      </div>

      {/* 6. CONTROLLED ELECTRONIC DETONATION, BLAST VIBRATION & AIR BLAST MONITORING REPORT */}
      {/* (User requirement: control electronic donation, vibration, air plus monitoring report options) */}
      <div className="bg-[#091322] border-2 border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-amber-400">eject</span>
                <span>CMR 2017 REGULATION 164 &amp; DGMS CIRCULAR NO. 07/2021</span>
              </span>
            </div>
            <h3 className="font-headline text-base font-bold text-white mt-0.5">
              Controlled Electronic Detonation, Blast Vibration &amp; Air Blast Monitoring Report
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenBlast}
              className="bg-red-950/70 hover:bg-red-900 text-red-200 border border-red-500/50 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow"
            >
              <span className="material-symbols-outlined text-sm text-red-400">warning</span>
              <span>Blast Siren &amp; Safety Protocol</span>
            </button>
          </div>
        </div>

        {/* Detonation Parameters & Seismograph Readings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          
          {/* PPV Vibration */}
          <div className="bg-[#050c18] p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span>PEAK PARTICLE VELOCITY (PPV)</span>
              <span className="text-emerald-400 font-bold">PERMISSIBLE</span>
            </div>
            <div className="text-2xl font-black text-emerald-400">
              2.84 <span className="text-xs text-slate-400 font-normal">mm/s</span>
            </div>
            <div className="text-[10px] text-slate-400">
              DGMS Permissible Threshold: <strong className="text-white">5.00 mm/s</strong> (Frequency 8-25 Hz)
            </div>
            <div className="text-[9px] text-slate-500 border-t border-slate-800/80 pt-1.5">
              Station #1: North Crest Village Boundary (480m distance)
            </div>
          </div>

          {/* Air Blast / Overpressure */}
          <div className="bg-[#050c18] p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span>AIR OVERPRESSURE (AIR BLAST)</span>
              <span className="text-emerald-400 font-bold">PERMISSIBLE</span>
            </div>
            <div className="text-2xl font-black text-cyan-300">
              118.2 <span className="text-xs text-slate-400 font-normal">dB(L)</span>
            </div>
            <div className="text-[10px] text-slate-400">
              DGMS Permissible Threshold: <strong className="text-white">128.0 dB(L)</strong>
            </div>
            <div className="text-[9px] text-slate-500 border-t border-slate-800/80 pt-1.5">
              Low-frequency atmospheric transducer linked to DGMS recorder.
            </div>
          </div>

          {/* Electronic Detonator Sequence */}
          <div className="bg-[#050c18] p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span>ELECTRONIC DETONATOR DELAYS</span>
              <span className="text-amber-400 font-bold">VERIFIED</span>
            </div>
            <div className="text-2xl font-black text-amber-300">
              17 ms <span className="text-xs text-slate-400 font-normal">inter-hole</span>
            </div>
            <div className="text-[10px] text-slate-400">
              Misfire Index: <strong className="text-emerald-400">0.00% (42/42 Detonators Logged)</strong>
            </div>
            <div className="text-[9px] text-slate-500 border-t border-slate-800/80 pt-1.5">
              500m danger buffer evacuated under CMR 2017 Reg 164.
            </div>
          </div>

        </div>

        {/* Blast Actions Footer */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-slate-400">
            Certified by Statutory Blasting Officer &amp; First Class Mine Manager under CMR 2017 Reg 164.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert(`Pre-Blast Statutory Clearance Signed by ${officerName}!\n\nAll 42 electronic holes checked.\nSeismograph Stations #1, #2, #3 active.\n500m danger radius evacuated.\nSignal: ALL CLEAR.`)}
              className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow"
            >
              <span className="material-symbols-outlined text-sm">check_circle</span>
              <span>Sign Pre-Blast Clearance (DSC)</span>
            </button>
            <button
              onClick={() => alert('Downloading Seismograph PPV & Air Blast Statutory Report (DGMS Form 24B)...')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              <span>Export Blast Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* ===================== MODALS ===================== */}

      {/* 1. Modal: Add Statutory Mandate */}
      {showAddMandateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#091322] border-2 border-amber-500/60 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400">add_circle</span>
                <h3 className="font-bold text-white text-base">Add Statutory Mandate</h3>
              </div>
              <button
                onClick={() => setShowAddMandateModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMandate} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Mandate Title / Requirement:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quarterly Piezometric Ground Water Stability Return"
                  value={newMandateTitle}
                  onChange={(e) => setNewMandateTitle(e.target.value)}
                  className="w-full bg-[#050c18] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Regulation Code:</label>
                  <select
                    value={newMandateReg}
                    onChange={(e) => setNewMandateReg(e.target.value)}
                    className="w-full bg-[#050c18] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="CMR 2017 Reg 106">CMR 2017 Reg 106 (Strata &amp; Slopes)</option>
                    <option value="CMR 2017 Reg 153">CMR 2017 Reg 153 (Ventilation &amp; Gas)</option>
                    <option value="CMR 2017 Reg 164">CMR 2017 Reg 164 (Controlled Blasting)</option>
                    <option value="CMR 2017 Reg 129">CMR 2017 Reg 129 (Shift Endorsement)</option>
                    <option value="Mines Act 1952 Sec 22">Mines Act 1952 Sec 22 (Powers of Inspectors)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Statutory Authority:</label>
                  <select
                    value={newMandateAuthority}
                    onChange={(e) => setNewMandateAuthority(e.target.value)}
                    className="w-full bg-[#050c18] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="DGMS Dhanbad">DGMS Zonal HQ (Dhanbad)</option>
                    <option value="MoEFCC">MoEFCC Environmental Cell</option>
                    <option value="State PCB">State Pollution Control Board</option>
                    <option value="CIL Safety Apex">CIL Safety Board (Apex)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Due Deadline:</label>
                  <select
                    value={newMandateDueDate}
                    onChange={(e) => setNewMandateDueDate(e.target.value)}
                    className="w-full bg-[#050c18] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="24 Hours">Immediate (24 Hours)</option>
                    <option value="48 Hours">Mandatory 48 Hours</option>
                    <option value="7 Days">Weekly Shift Return (7 Days)</option>
                    <option value="30 Days">Monthly Gazette (30 Days)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Assigned Statutory Officer:</label>
                  <input
                    type="text"
                    disabled
                    value={officerName}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-amber-300 font-bold"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                Notice will be stamped with SHA-256 cryptographic sequence and indexed into the colliery audit readiness Merkle tree.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddMandateModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl cursor-pointer shadow-md"
                >
                  Register Statutory Mandate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal: AI Legal Strategy */}
      {showAiStrategyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#091322] border-2 border-cyan-500/60 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-cyan-400">psychology</span>
                <h3 className="font-bold text-white text-base">AI Statutory Legal Defense &amp; Strategy</h3>
              </div>
              <button
                onClick={() => setShowAiStrategyModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl">
                <div className="font-bold text-cyan-300 text-sm mb-1">Defense Synthesis: Mines Act 1952 Sec 22(1A)</div>
                <p className="leading-relaxed">
                  The active SSR-XT slope displacement (14 mm/day) on Overburden Bench #4 can be statutorily mitigated without complete pit shutdown by implementing a dual-bench terracing layout reducing the overall slope angle from 68° to 45°.
                </p>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-white uppercase text-[11px]">Recommended Statutory Actions:</div>
                <ul className="list-disc pl-5 space-y-1 text-slate-400">
                  <li>Enact Immediate 60m Haulage Exclusion Perimeter along Bench 4B Crest.</li>
                  <li>Deploy Cat 349 Excavators for top-cut regrading (FOS projected to rebound from 1.18 to 1.62 in 36 hours).</li>
                  <li>Submit Interim Rectification Undertaking (Form 24B) to Deputy Director of Mines Safety.</li>
                  <li>Halt ₹15,00,000/day fine escalation via automated filing of Interim Safety Affirmation.</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowAiStrategyModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold cursor-pointer"
              >
                Close Strategy
              </button>
              <button
                onClick={() => {
                  setShowAiStrategyModal(false);
                  handleAcknowledgeNotice();
                }}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl cursor-pointer shadow"
              >
                Execute Action Plan &amp; File Form 24B
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal: View Filing */}
      {showFilingModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#091322] border-2 border-amber-500/60 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400">description</span>
                <h3 className="font-bold text-white text-base">Official DGMS Statutory Notice</h3>
              </div>
              <button
                onClick={() => setShowFilingModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="text-center font-bold text-amber-300 border-b border-slate-800 pb-2">
                GOVERNMENT OF INDIA<br/>
                MINISTRY OF LABOUR &amp; EMPLOYMENT<br/>
                DIRECTORATE GENERAL OF MINES SAFETY (DGMS)<br/>
                EASTERN ZONE • REGION I, DHANBAD
              </div>
              <div><strong>Notice No:</strong> DGMS/EZ/JHR-OC/SEC22-09</div>
              <div><strong>Colliery:</strong> Jharia Opencast Project (BCCL Area-IX)</div>
              <div><strong>Statutory In-Charge:</strong> {officerName} (Mine Manager)</div>
              <div><strong>Violation:</strong> CMR 2017 Regulation 106(3) &amp; Section 22(1A) of Mines Act 1952</div>
              <div><strong>Findings:</strong> Tension cracking and active bench displacement detected by Ground Radar SSR-XT on Overburden Bench 4B. Factor of Safety measured at 1.18 against statutory minimum 1.50.</div>
              <div><strong>Directive:</strong> Cease all vehicular haulage within 60m of crest. Remit statutory compliance certificate or incur penalty of ₹15,00,000 per calendar day.</div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowFilingModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold cursor-pointer"
              >
                Close Filing
              </button>
              <button
                onClick={() => alert('Notice PDF downloaded with government watermarked stamp.')}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl cursor-pointer"
              >
                Download Notice PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Modal: Liability Breakdown */}
      {showLiabilityBreakdownModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#091322] border-2 border-red-500/60 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-400">calculate</span>
                <h3 className="font-bold text-white text-base">Statutory Liability Breakdown</h3>
              </div>
              <button
                onClick={() => setShowLiabilityBreakdownModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between p-2 bg-[#050c18] rounded-lg border border-slate-800">
                <span className="text-slate-400">Base Fine (CMR Reg 106):</span>
                <span className="text-white font-bold">₹5,00,000</span>
              </div>
              <div className="flex justify-between p-2 bg-[#050c18] rounded-lg border border-slate-800">
                <span className="text-slate-400">Daily Continuing Fine (Sec 22):</span>
                <span className="text-red-400 font-bold">₹10,00,000 / Day</span>
              </div>
              <div className="flex justify-between p-2 bg-[#050c18] rounded-lg border border-slate-800">
                <span className="text-slate-400">Total Statutory Escalation:</span>
                <span className="text-amber-300 font-bold">₹15,00,000 / Day</span>
              </div>
              <div className="flex justify-between p-2 bg-[#050c18] rounded-lg border border-slate-800">
                <span className="text-slate-400">Operational Loss on Full Pit Stop:</span>
                <span className="text-rose-400 font-bold">₹82,00,000 / Day</span>
              </div>
            </div>

            <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-[11px] text-slate-300">
              Filing the Digital Rectification Undertaking (DSC signed by {officerName}) freezes fine accumulation for 72 hours during verified LiDAR regrading.
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowLiabilityBreakdownModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
