import React, { useState } from 'react';
import { COAL_INDIA_SUBSIDIARIES, COAL_MINES_REGISTRY } from '../data/complianceData';
import { SubsidiaryCompliance, CoalMineRecord } from '../types';

export const CoalIndiaSubsidiariesMatrix: React.FC = () => {
  const [selectedSubsidiary, setSelectedSubsidiary] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<string>('ALL');
  const [viewDetailMine, setViewDetailMine] = useState<CoalMineRecord | null>(null);

  // Filtered mines matrix
  const filteredMines = COAL_MINES_REGISTRY.filter((mine) => {
    const matchesSub = selectedSubsidiary === 'ALL' || mine.subsidiary === selectedSubsidiary;
    const matchesGrade = selectedGrade === 'ALL' || mine.dgmsGrade === selectedGrade;
    const matchesSearch =
      searchQuery === '' ||
      mine.mineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mine.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mine.basin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mine.officerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mine.subsidiary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSub && matchesGrade && matchesSearch;
  });

  return (
    <section className="my-6 space-y-6">
      {/* =========================================================================
          SECTION 1: COAL INDIA OPERATING SUBSIDIARIES WITH COMPLIANCE STANDING
          (Provided by the National DGMS Rate Standing FY24-25)
          MCL, NCL, BCL, ACCL, ECL, CCL, WCL
      ========================================================================= */}
      <div className="bg-gradient-to-b from-[#0a1527] via-[#081220] to-[#060d18] border-2 border-amber-500/30 rounded-2xl p-5 md:p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-mono font-bold text-amber-300 mb-1">
              <span className="material-symbols-outlined text-xs text-amber-400">workspace_premium</span>
              <span>NATIONAL DGMS RATE STANDING FY24-25</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white font-serif tracking-tight">
              Coal India Operating Subsidiaries with Compliance Standing
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Official statutory safety ratings, fatality index, and audit standing provided by DGMS Directorate General
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-300 bg-cyan-950/70 border border-cyan-500/30 px-3 py-1.5 rounded-xl">
              7 SUBSIDIARY DIRECTORIES
            </span>
          </div>
        </div>

        {/* 7 Subsidiary Cards Grid: MCL, NCL, BCL, ACCL, ECL, CCL, WCL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-3 pt-5">
          {COAL_INDIA_SUBSIDIARIES.map((sub) => {
            const isSelected = selectedSubsidiary === sub.code;
            return (
              <div
                key={sub.id}
                onClick={() => setSelectedSubsidiary(selectedSubsidiary === sub.code ? 'ALL' : sub.code)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group shadow-lg ${
                  isSelected
                    ? 'bg-[#12243d] border-amber-400 ring-2 ring-amber-400/40 scale-102'
                    : 'bg-[#060e1b] hover:bg-[#0c1a2e] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Top Badge Row */}
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="font-mono text-xs font-black text-white px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700">
                      {sub.code}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      sub.dgmsGrade === 'A+' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    }`}>
                      Grade {sub.dgmsGrade}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-100 text-xs truncate leading-snug" title={sub.name}>
                    {sub.name}
                  </h4>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {sub.headquarters.split(',')[0]}
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/80">
                    <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                      <span>DGMS Index:</span>
                      <span className="text-emerald-400 font-bold font-mono">{sub.complianceScore}%</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between mt-0.5">
                      <span>Incident:</span>
                      <span className="text-cyan-300 font-mono">{sub.incidentRate}/100k</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[9px] font-mono text-slate-500 group-hover:text-amber-400 transition-colors">
                  <span>{sub.activeMinesCount} Active Mines</span>
                  <span className="material-symbols-outlined text-xs">
                    {isSelected ? 'check_circle' : 'filter_list'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {selectedSubsidiary !== 'ALL' && (
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-amber-300 font-mono">
              Filtered to: <strong>{selectedSubsidiary}</strong> colliery registry
            </span>
            <button
              onClick={() => setSelectedSubsidiary('ALL')}
              className="text-slate-400 hover:text-white underline cursor-pointer text-xs"
            >
              Reset to All Subsidiaries
            </button>
          </div>
        )}
      </div>

      {/* =========================================================================
          SECTION 2: STATUTORY REGISTRY OR COAL FIELD COMPLIANCE MATRIX TABLE
          Columns: Subsidiary Name, Coal Mine Names, Location, Basin, Workforce,
                   Daily Output, DGMS Grade, Officer Name and Contact
      ========================================================================= */}
      <div className="bg-[#081220] border-2 border-slate-800 rounded-2xl p-5 md:p-6 shadow-2xl space-y-4">
        {/* Table Title and Filters Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-1">
              <span className="material-symbols-outlined text-sm">table_view</span>
              <span>STATUTORY REGISTRY &amp; COMPLIANCE MATRIX</span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white font-serif">
              Coal Field Statutory Compliance Matrix
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Official statutory colliery registry mapped to verified DGMS cadremen and daily extraction quotas
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search input */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search mine, officer, location..."
                className="bg-[#050c18] border border-slate-700 text-slate-200 pl-8 pr-3 py-1.5 rounded-xl text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400 w-48 sm:w-64"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Subsidiary Filter */}
            <select
              value={selectedSubsidiary}
              onChange={(e) => setSelectedSubsidiary(e.target.value)}
              className="bg-[#050c18] border border-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-xs focus:outline-none focus:border-amber-400 cursor-pointer font-mono"
            >
              <option value="ALL">All Subsidiaries ({COAL_INDIA_SUBSIDIARIES.length})</option>
              <option value="MCL">MCL (Mahanadi)</option>
              <option value="NCL">NCL (Northern)</option>
              <option value="BCL">BCL (Bharat Coking)</option>
              <option value="ACCL">ACCL (South Eastern)</option>
              <option value="ECL">ECL (Eastern)</option>
              <option value="CCL">CCL (Central)</option>
              <option value="WCL">WCL (Western)</option>
            </select>

            {/* Grade Filter */}
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="bg-[#050c18] border border-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-xs focus:outline-none focus:border-amber-400 cursor-pointer font-mono"
            >
              <option value="ALL">All DGMS Grades</option>
              <option value="A+">Grade A+</option>
              <option value="A">Grade A</option>
            </select>
          </div>
        </div>

        {/* The Full Table as requested with all 8 columns */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 shadow-inner">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#050c18] text-slate-300 font-mono uppercase text-[11px] border-b border-slate-800 tracking-wider">
                <th className="py-3 px-4 font-bold text-amber-400">Subsidiary Name</th>
                <th className="py-3 px-4 font-bold text-slate-200">Coal Mine Names</th>
                <th className="py-3 px-4 font-bold text-slate-200">Location</th>
                <th className="py-3 px-4 font-bold text-slate-200">Basin</th>
                <th className="py-3 px-4 font-bold text-slate-200 text-right">Workforce</th>
                <th className="py-3 px-4 font-bold text-slate-200 text-right">Daily Output</th>
                <th className="py-3 px-4 font-bold text-center text-slate-200">DGMS Grade</th>
                <th className="py-3 px-4 font-bold text-slate-200">Officer Name and Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-medium">
              {filteredMines.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 font-mono">
                    No coalfield records match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredMines.map((mine) => (
                  <tr
                    key={mine.id}
                    onClick={() => setViewDetailMine(mine)}
                    className="hover:bg-[#0e1c31]/80 transition-colors cursor-pointer group"
                  >
                    {/* 1. Subsidiary Name */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-lg font-mono font-bold text-amber-300">
                        <span>{mine.subsidiary}</span>
                      </div>
                    </td>

                    {/* 2. Coal Mine Names */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white group-hover:text-amber-300 transition-colors">
                        {mine.mineName}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {mine.type} Mine • {mine.statutoryStatus}
                      </span>
                    </td>

                    {/* 3. Location */}
                    <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                      {mine.location}
                    </td>

                    {/* 4. Basin */}
                    <td className="py-3.5 px-4 text-slate-300">
                      <span className="text-xs font-mono text-cyan-300/90">{mine.basin}</span>
                    </td>

                    {/* 5. Workforce */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-200 whitespace-nowrap">
                      {mine.workforce.toLocaleString()} miners
                    </td>

                    {/* 6. Daily Output */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400 whitespace-nowrap">
                      {mine.dailyOutput}
                    </td>

                    {/* 7. DGMS Grade */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className={`inline-block font-mono font-extrabold px-2.5 py-1 rounded text-xs ${
                        mine.dgmsGrade === 'A+'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      }`}>
                        {mine.dgmsGrade}
                      </span>
                    </td>

                    {/* 8. Officer Name and Contact */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-200">{mine.officerName}</div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                        {mine.contact}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-slate-400">
          <div>
            Showing <strong>{filteredMines.length}</strong> of <strong>{COAL_MINES_REGISTRY.length}</strong> statutory colliery installations
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">● 100% REGULATORY DSC AUDITED</span>
            <span>|</span>
            <span>National DGMS Coal Portal</span>
          </div>
        </div>
      </div>

      {/* Detail Modal for Selected Mine */}
      {viewDetailMine && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a1628] border-2 border-cyan-500/60 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-cyan-400 text-2xl">verified</span>
                <div>
                  <h3 className="text-lg font-bold text-white font-serif">{viewDetailMine.mineName}</h3>
                  <p className="text-xs text-slate-300 font-mono">
                    Subsidiary: {viewDetailMine.subsidiary} • DGMS Grade: {viewDetailMine.dgmsGrade}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewDetailMine(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Location</span>
                <span className="font-bold text-white text-sm">{viewDetailMine.location}</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Basin Formation</span>
                <span className="font-bold text-cyan-300 text-sm">{viewDetailMine.basin}</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Active Workforce</span>
                <span className="font-bold text-amber-300 text-sm">{viewDetailMine.workforce.toLocaleString()} Shift Miners</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Daily Production</span>
                <span className="font-bold text-emerald-300 text-sm">{viewDetailMine.dailyOutput}</span>
              </div>
            </div>

            <div className="bg-[#050c18] p-4 rounded-xl border border-slate-800 space-y-1.5 text-xs">
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                Designated Statutory Officer Contact:
              </span>
              <div className="font-bold text-white text-sm">{viewDetailMine.officerName}</div>
              <div className="font-mono text-slate-300">{viewDetailMine.contact}</div>
              <div className="text-[11px] text-emerald-400 font-semibold pt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span>Active First Class Managerial Competency Certificate (DGMS Validated)</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewDetailMine(null)}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs cursor-pointer shadow-md"
              >
                Close Colliery Record
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
