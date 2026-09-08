import React, { useState } from 'react';
import { LIVE_COMPLIANCE_ALERTS, STATUTORY_PRECEDENTS_DATA } from '../data/complianceData';
import { ComplianceAlertItem } from '../types';

export const CollieryGisAlertsSection: React.FC = () => {
  const [selectedPitSector, setSelectedPitSector] = useState<string>('jharia-04');
  const [alerts, setAlerts] = useState<ComplianceAlertItem[]>(LIVE_COMPLIANCE_ALERTS);
  const [showPrecedentsModal, setShowPrecedentsModal] = useState<boolean>(false);
  const [recommendationApplied, setRecommendationApplied] = useState<boolean>(false);
  const [showApplyConfirmation, setShowApplyConfirmation] = useState<boolean>(false);

  const pitSectors = [
    { id: 'jharia-04', name: 'Jharia Pit #04 (Seam XIV)', depth: '480m', status: 'Degree-III Active', ch4: '0.28%', co: '12 ppm', air: '42 m³/s', fos: '1.48', coord: '23.7431° N, 86.4167° E' },
    { id: 'moonidih-deep', name: 'Moonidih Longwall Shaft', depth: '520m', status: 'Continuous Miner', ch4: '0.34%', co: '14 ppm', air: '48 m³/s', fos: '1.52', coord: '23.7380° N, 86.3540° E' },
    { id: 'gevra-mega', name: 'Gevra Mega Opencast Bench', depth: '140m', status: 'HEMM Extraction', ch4: '0.02%', co: '2 ppm', air: 'Open Atm', fos: '1.64', coord: '22.3380° N, 82.5930° E' },
    { id: 'jayant-singrauli', name: 'Jayant Singrauli Basin', depth: '160m', status: 'Dragline Active', ch4: '0.01%', co: '1 ppm', air: 'Open Atm', fos: '1.58', coord: '24.1160° N, 82.6590° E' },
  ];

  const activeSector = pitSectors.find((p) => p.id === selectedPitSector) || pitSectors[0];

  const handleApplyRecommendation = () => {
    setShowApplyConfirmation(true);
    setRecommendationApplied(true);
    // Add a new live alert to the stream
    const newAlert: ComplianceAlertItem = {
      id: `alert-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false }) + ' IST',
      type: 'statutory',
      severity: 'success',
      title: 'EMI Statutory Dispatch Enacted: Auto-tripping threshold calibrated to DGMS Circ. 04/2023',
      mine: activeSector.name,
      source: 'Mine Manager Electronic Signature (DSC Validated)',
      regulation: 'CMR Reg 153',
      actionable: false
    };
    setAlerts([newAlert, ...alerts]);
  };

  return (
    <section className="my-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* ==================== LEFT COLUMN: LIVE GIS OPERATING COAL FIELD (7 cols) ==================== */}
        <div className="lg:col-span-7 bg-gradient-to-b from-[#0a1527] via-[#081220] to-[#050c18] border-2 border-cyan-500/30 rounded-2xl p-5 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          <div>
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 px-3 py-0.5 rounded-full text-xs font-mono font-bold text-cyan-400 mb-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  <span>LIVE GIS SPATIAL TELEMETRY</span>
                </div>
                <h3 className="text-xl font-bold text-white font-serif">
                  Live GIS Operating Coal Field
                </h3>
                <p className="text-xs text-slate-300">
                  Sub-surface geological strata, ventilation shafts, and highwall prism radar coordinates
                </p>
              </div>

              {/* Coordinates Pill */}
              <div className="bg-slate-900/90 border border-cyan-500/30 px-3 py-1.5 rounded-xl font-mono text-right shrink-0">
                <span className="text-[10px] text-slate-400 block">WGS84 COORDINATES</span>
                <span className="text-xs font-bold text-cyan-300">{activeSector.coord}</span>
              </div>
            </div>

            {/* Pit Selector Pills */}
            <div className="flex flex-wrap gap-2 my-3">
              {pitSectors.map((pit) => (
                <button
                  key={pit.id}
                  onClick={() => setSelectedPitSector(pit.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                    selectedPitSector === pit.id
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-md ring-1 ring-cyan-400/40'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${selectedPitSector === pit.id ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`}></span>
                  <span>{pit.name.split(' (')[0]}</span>
                </button>
              ))}
            </div>

            {/* Simulated Live Interactive GIS Visual Canvas */}
            <div className="relative h-64 md:h-72 w-full rounded-xl overflow-hidden border border-slate-700/80 bg-[#040810] shadow-inner flex flex-col justify-between p-4 group">
              {/* Radar Sweeping Line Animation */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 border border-cyan-500/20 rounded-full pointer-events-none"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-cyan-500/30 rounded-full pointer-events-none"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-cyan-500/40 rounded-full pointer-events-none"></div>
              
              {/* Animated Radar Sweep */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-gradient-to-tr from-transparent via-cyan-500/10 to-transparent animate-spin duration-10000 pointer-events-none"></div>

              {/* Active Hotspots / Sensor Markers on the GIS map */}
              <div className="relative z-10 flex items-start justify-between">
                <div className="bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-cyan-500/30 text-xs font-mono">
                  <span className="text-cyan-400 font-bold">SECTOR: {activeSector.name}</span>
                  <span className="text-slate-400 text-[10px] block">Seam Depth: {activeSector.depth} • Status: {activeSector.status}</span>
                </div>
                <div className="flex items-center gap-2 bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>14 SENSORS STREAMING</span>
                </div>
              </div>

              {/* Central Geological Pit Blueprint Diagram */}
              <div className="relative z-10 flex items-center justify-center my-auto">
                <div className="text-center p-3 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-700 max-w-sm">
                  <div className="text-xs font-mono font-bold text-amber-400 flex items-center justify-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">terrain</span>
                    <span>COLLIERY EXTRACTION BENCH ZONE</span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-1 leading-snug">
                    Real-time strata telemetry, continuous CH4/CO gas sensors &amp; SSR-XT highwall slope stability prisms synchronized.
                  </div>
                </div>
              </div>

              {/* Bottom GIS Live Readouts */}
              <div className="relative z-10 grid grid-cols-4 gap-2 pt-2 border-t border-slate-800/80">
                <div className="bg-slate-950/90 p-2 rounded-lg border border-slate-800 text-center">
                  <span className="text-[9px] font-mono text-slate-400 block uppercase">CH4 Gas</span>
                  <span className="text-xs font-mono font-bold text-emerald-300">{activeSector.ch4}</span>
                </div>
                <div className="bg-slate-950/90 p-2 rounded-lg border border-slate-800 text-center">
                  <span className="text-[9px] font-mono text-slate-400 block uppercase">CO Air</span>
                  <span className="text-xs font-mono font-bold text-cyan-300">{activeSector.co}</span>
                </div>
                <div className="bg-slate-950/90 p-2 rounded-lg border border-slate-800 text-center">
                  <span className="text-[9px] font-mono text-slate-400 block uppercase">Air Velocity</span>
                  <span className="text-xs font-mono font-bold text-amber-300">{activeSector.air}</span>
                </div>
                <div className="bg-slate-950/90 p-2 rounded-lg border border-slate-800 text-center">
                  <span className="text-[9px] font-mono text-slate-400 block uppercase">Slope FOS</span>
                  <span className="text-xs font-mono font-bold text-emerald-300">{activeSector.fos}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>● GIS Model Version: DGMS-MAP-2025-V4</span>
            <span className="text-cyan-400 font-bold">Sub-Surface Survey Synced</span>
          </div>
        </div>

        {/* ==================== RIGHT COLUMN: COMPLIANCE ALERT FEED & EMI INTELLIGENT DISPATCHMENT (5 cols) ==================== */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#0a1527] via-[#081220] to-[#050c18] border-2 border-amber-500/30 rounded-2xl p-5 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          <div>
            {/* Header with live tracking pulse */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>COMPLIANCE ALERT FEED</span>
                </div>
                <h3 className="text-lg font-bold text-white font-serif">
                  Stream Live: Directly Tracking
                </h3>
              </div>
              <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full animate-pulse">
                STREAM LIVE
              </span>
            </div>

            {/* Streaming Alert List */}
            <div className="my-3 space-y-2 max-h-56 overflow-y-auto pr-1">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="bg-[#050c17] hover:bg-[#071120] p-2.5 rounded-xl border border-slate-800 transition-colors text-xs space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] text-amber-400 font-bold">{alert.timestamp}</span>
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {alert.regulation}
                    </span>
                  </div>
                  <div className="font-semibold text-slate-200 leading-tight">
                    {alert.title}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between">
                    <span>{alert.mine}</span>
                    <span className="text-slate-500 truncate max-w-[130px]">{alert.source}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* EMI Statutorily Intelligent Dispatchment Box */}
            <div className="bg-gradient-to-r from-[#0d203a] via-[#0b1b32] to-[#091528] border border-amber-500/50 rounded-xl p-3.5 shadow-lg space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                  <span className="material-symbols-outlined text-base text-amber-400">psychology</span>
                  <span>EMI Statutorily Intelligent Dispatchment</span>
                </div>
                <span className="text-[9px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded">
                  DGMS AI ADVISORY
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                {recommendationApplied
                  ? 'Active Dispatch: Methane auto-trip threshold calibrated to 0.75% as per DGMS Tech Circular 04/2023. Electrical interlocks armed & recorded with DSC.'
                  : 'Telemetry in Seam XIV indicates stable CH4 desorption (0.28%). AI dispatch recommends aligning auto-trip sensitivity to DGMS Tech Circular 04/2023 and verifying booster fan damper position.'}
              </p>

              {/* Two Action Buttons Requested by User */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  id="apply-recommendation-btn"
                  onClick={handleApplyRecommendation}
                  className={`font-bold px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer border ${
                    recommendationApplied
                      ? 'bg-emerald-600 text-white border-emerald-400'
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 border-amber-400 hover:scale-[1.02]'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {recommendationApplied ? 'done_all' : 'bolt'}
                  </span>
                  <span>{recommendationApplied ? 'Applied & Logged' : 'Apply Recommendation'}</span>
                </button>

                <button
                  id="view-precedents-btn"
                  onClick={() => setShowPrecedentsModal(true)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer border border-slate-700 hover:border-slate-600 hover:scale-[1.02]"
                >
                  <span className="material-symbols-outlined text-sm text-cyan-400">gavel</span>
                  <span>View Statutory Precedents</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-2 text-[10px] font-mono text-slate-500 text-center">
            Statutory AI Agent Dispatch • Direct Real-Time Telemetry Pipeline
          </div>
        </div>
      </div>

      {/* Confirmation Toast if Recommendation was applied */}
      {showApplyConfirmation && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0a1c33] border-2 border-emerald-400 text-white p-4 rounded-2xl shadow-2xl max-w-md animate-bounce flex items-start gap-3">
          <span className="material-symbols-outlined text-emerald-400 text-2xl">verified</span>
          <div className="flex-1">
            <h4 className="font-bold text-sm text-emerald-300">Statutory Recommendation Applied</h4>
            <p className="text-xs text-slate-300 mt-0.5">
              EMI dispatch instructions logged to statutory colliery shift log under CMR Reg. 153 with digital cryptographic token.
            </p>
          </div>
          <button
            onClick={() => setShowApplyConfirmation(false)}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Modal: View Statutory Precedents */}
      {showPrecedentsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1626] border-2 border-amber-500/60 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400 text-2xl">gavel</span>
                <div>
                  <h3 className="text-lg font-bold text-white font-serif">
                    DGMS Statutory Precedents &amp; Legal Directives
                  </h3>
                  <p className="text-xs text-slate-300">
                    Official Court of Inquiry judgments, technical circulars, and regulatory benchmarks
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPrecedentsModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              {STATUTORY_PRECEDENTS_DATA.map((prec) => (
                <div key={prec.id} className="bg-[#050c18] p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400">{prec.circular}</span>
                    <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                      {prec.statute}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-100">{prec.subject}</h4>
                  <div className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed">
                    <span className="text-amber-300 font-semibold">Tribunal Finding: </span>
                    {prec.tribunalSummary}
                  </div>
                  <div className="text-xs text-emerald-300 flex items-start gap-1.5">
                    <span className="material-symbols-outlined text-sm mt-0.5">verified</span>
                    <span><strong>Mandated Action:</strong> {prec.recommendedAction}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Source: Ministry of Labour &amp; Employment, DGMS Dhanbad</span>
              <button
                onClick={() => setShowPrecedentsModal(false)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs cursor-pointer shadow-md"
              >
                Close Precedents Window
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
