import React, { useState } from 'react';
import { 
  Users, 
  ShieldAlert, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  FileText, 
  Search, 
  UserCheck,
  Ban,
  Plus
} from 'lucide-react';
import { ContractorCompliance } from '../types';

interface ContractorLabourHubProps {
  contractors: ContractorCompliance[];
  onIssuePenaltyNotice: (contractorId: string, points: number, reason: string) => void;
}

export const ContractorLabourHub: React.FC<ContractorLabourHubProps> = ({
  contractors,
  onIssuePenaltyNotice,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContractor, setSelectedContractor] = useState<ContractorCompliance | null>(contractors[0] || null);
  const [penaltyReason, setPenaltyReason] = useState('');
  const [penaltyPoints, setPenaltyPoints] = useState(10);

  const filtered = contractors.filter(c => 
    c.contractorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.agencyCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApplyPenalty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContractor || !penaltyReason) return;
    onIssuePenaltyNotice(selectedContractor.id, penaltyPoints, penaltyReason);
    setPenaltyReason('');
    alert(`Statutory safety penalty of ${penaltyPoints} points issued to ${selectedContractor.contractorName}. Deducted from monthly compliance billing.`);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
              Contract Labour & DGMS VTC Gate
            </span>
            <span className="text-xs text-slate-400">
              Mines Rules 1955 • Form B • Vocational Training Compliance
            </span>
          </div>
          <h2 className="text-base font-bold text-slate-100 mt-1">
            Contractor Safety Performance, Medicals & Labour Governance
          </h2>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search contractor agency name, code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Main Grid: Contractor List & Safety Scorecard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Contractor Cards */}
        <div className="lg:col-span-7 space-y-3">
          {filtered.map((contractor) => {
            const isSelected = selectedContractor?.id === contractor.id;
            const isHighRisk = contractor.safetyPenaltyPoints > 30 || contractor.vtcTrainedPercent < 80;

            return (
              <div
                key={contractor.id}
                onClick={() => setSelectedContractor(contractor)}
                className={`bg-slate-900/90 border rounded-xl p-4 transition-all cursor-pointer ${
                  isSelected ? 'border-amber-500 ring-1 ring-amber-500/40 shadow-lg' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-amber-400">{contractor.agencyCode}</span>
                      <span className="text-xs text-slate-400">• {contractor.activeWorkers} Workers Active</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-100 mt-1">{contractor.contractorName}</h3>
                  </div>

                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      contractor.safetyPenaltyPoints > 30 
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
                        : contractor.safetyPenaltyPoints > 10 
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}>
                      Penalty Points: {contractor.safetyPenaltyPoints}
                    </span>
                  </div>
                </div>

                {/* Statutory Progress Bars */}
                <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-slate-800 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>VTC Training</span>
                      <span className="font-bold text-slate-200">{contractor.vtcTrainedPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${contractor.vtcTrainedPercent}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>PME Medicals</span>
                      <span className="font-bold text-slate-200">{contractor.pmeMedicalsCurrentPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-sky-500 h-full rounded-full" style={{ width: `${contractor.pmeMedicalsCurrentPercent}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Form B Register</span>
                      <span className="font-bold text-slate-200">{contractor.formBRegisteredPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: `${contractor.formBRegisteredPercent}%` }} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800/60">
                  <span>Contract Valid Until: <strong>{contractor.contractExpiry}</strong></span>
                  <span className={contractor.pfEsiComplianceStatus === '100%_COMPLIANT' ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                    PF/ESI: {contractor.pfEsiComplianceStatus}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Contractor Actions & Issue Penalty Drawer */}
        <div className="lg:col-span-5 space-y-4">
          {selectedContractor ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4 sticky top-20">
              <div>
                <span className="text-xs font-mono text-amber-400 font-bold block">{selectedContractor.agencyCode}</span>
                <h3 className="text-base font-bold text-slate-100 mt-0.5">{selectedContractor.contractorName}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Active Deployment: {selectedContractor.activeWorkers} Certified Mine Personnel</p>
              </div>

              {/* Statutory Compliance Rating Box */}
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-xs space-y-2">
                <span className="font-bold text-slate-300 block uppercase text-[10px] tracking-wider">Statutory Verification Checklist</span>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">DGMS Vocational Training (VTC)</span>
                  <span className="font-bold text-emerald-400">{selectedContractor.vtcTrainedPercent}% Compliant</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Periodic Medical Exam (PME 5-Yr)</span>
                  <span className="font-bold text-sky-400">{selectedContractor.pmeMedicalsCurrentPercent}% Current</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Form B Register Synced</span>
                  <span className="font-bold text-amber-400">{selectedContractor.formBRegisteredPercent}% Verified</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">PF/ESI Monthly Returns</span>
                  <span className="font-bold text-slate-200">{selectedContractor.pfEsiComplianceStatus}</span>
                </div>
              </div>

              {/* Issue Safety Penalty / Stop-Work Notice Form */}
              <form onSubmit={handleApplyPenalty} className="space-y-3 pt-2 border-t border-slate-800">
                <span className="text-xs font-bold text-rose-300 block flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Issue Statutory Safety Infraction / Penalty Notice</span>
                </span>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 block font-semibold">Violation Reason (e.g. Uncertified Tipper Operator, Missing PPE):</label>
                  <input
                    type="text"
                    required
                    value={penaltyReason}
                    onChange={(e) => setPenaltyReason(e.target.value)}
                    placeholder="Enter statutory breach details..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 block font-semibold">Penalty Points to Assign (50+ Triggers Blacklisting):</label>
                  <select
                    value={penaltyPoints}
                    onChange={(e) => setPenaltyPoints(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value={5}>5 Points (Minor PPE Infraction)</option>
                    <option value={10}>10 Points (Unsprayed Haul Road Dust)</option>
                    <option value={25}>25 Points (Uncertified VTC Operator)</option>
                    <option value={50}>50 Points (Major Safety Violation / Near-Miss)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>Issue Statutory Notice & Apply Penalty</span>
                </button>
              </form>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
