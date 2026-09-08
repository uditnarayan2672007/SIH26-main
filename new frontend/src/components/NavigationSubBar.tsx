import React from 'react';
import { ActiveView } from '../types';

interface NavigationSubBarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  onOpenCopilot: () => void;
  onOpenDispatch: () => void;
  onOpenBlast: () => void;
}

export const NavigationSubBar: React.FC<NavigationSubBarProps> = ({
  activeView,
  setActiveView,
  onOpenCopilot,
  onOpenDispatch,
  onOpenBlast
}) => {
  const [subsidiary, setSubsidiary] = React.useState('Bharat Coking Coal Limited (BCCL)');
  const [colliery, setColliery] = React.useState('Jharia Opencast Project - Pit 4');

  return (
    <div className="w-full bg-[#070e1a]/95 border-b border-slate-800/90 px-4 sm:px-6 lg:px-8 2xl:px-12 py-2 text-xs">
      <div className="w-full flex flex-wrap items-center justify-between gap-3">
        {/* Left: Subsidiary & Colliery Selection Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="material-symbols-outlined text-amber-400 text-base">domain</span>
            <span className="text-[11px] font-bold text-slate-400">OPERATOR:</span>
            <select
              value={subsidiary}
              onChange={(e) => setSubsidiary(e.target.value)}
              className="bg-[#0c1626] border border-slate-700/80 rounded-lg px-2.5 py-1 text-slate-200 text-xs font-semibold focus:outline-none focus:border-amber-500"
            >
              <option>Bharat Coking Coal Limited (BCCL)</option>
              <option>Eastern Coalfields Limited (ECL)</option>
              <option>Central Coalfields Limited (CCL)</option>
              <option>South Eastern Coalfields (SECL)</option>
              <option>Singareni Collieries (SCCL)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="material-symbols-outlined text-cyan-400 text-base">terrain</span>
            <span className="text-[11px] font-bold text-slate-400">COLLIERY:</span>
            <select
              value={colliery}
              onChange={(e) => setColliery(e.target.value)}
              className="bg-[#0c1626] border border-slate-700/80 rounded-lg px-2.5 py-1 text-slate-200 text-xs font-semibold focus:outline-none focus:border-cyan-500"
            >
              <option>Jharia Opencast Project - Pit 4</option>
              <option>Moonidih Underground - Seam XIV</option>
              <option>Gevra Mega Opencast Project</option>
              <option>Dipka OC - Sector 3A</option>
              <option>Raniganj CBM Complex</option>
            </select>
          </div>
        </div>

        {/* Right: Operational Status & Floating Quick Triggers */}
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <button
            onClick={() => setActiveView('portal-directory')}
            className="flex items-center gap-1 bg-[#102035] hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 border border-amber-500/40 px-2.5 py-1 rounded-lg transition-all cursor-pointer font-sans font-bold"
            title="Open Statutory Operations & Modules Directory"
          >
            <span className="material-symbols-outlined text-sm">apps</span>
            <span>All Modules (8)</span>
          </button>

          <div className="hidden sm:flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300">
            <span className="text-slate-400 font-sans font-bold">Shift:</span>
            <span className="text-amber-400 font-bold">1st (06:00 - 14:00)</span>
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30 text-emerald-300 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>ZERO HAZARD STATUS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
