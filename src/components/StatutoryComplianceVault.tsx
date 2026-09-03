import React, { useState } from 'react';
import { 
  Scale, 
  Search, 
  Filter, 
  FileText, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ArrowUpRight, 
  ShieldCheck,
  Plus
} from 'lucide-react';
import { StatutoryComplianceItem, ComplianceCategory, ComplianceStatus, SubsidiaryCode } from '../types';

interface StatutoryComplianceVaultProps {
  complianceItems: StatutoryComplianceItem[];
  selectedSubsidiary: SubsidiaryCode;
  onOpenNewComplianceModal: () => void;
  onAskCopilot: (query: string) => void;
}

export const StatutoryComplianceVault: React.FC<StatutoryComplianceVaultProps> = ({
  complianceItems,
  selectedSubsidiary,
  onOpenNewComplianceModal,
  onAskCopilot,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ComplianceCategory | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<ComplianceStatus | 'ALL'>('ALL');
  const [selectedAuthority, setSelectedAuthority] = useState<string>('ALL');

  const filteredItems = complianceItems.filter(item => {
    if (selectedSubsidiary !== 'CIL_HQ' && item.subsidiary !== selectedSubsidiary) return false;
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    if (selectedStatus !== 'ALL' && item.status !== selectedStatus) return false;
    if (selectedAuthority !== 'ALL' && item.regulatoryAuthority !== selectedAuthority) return false;
    if (searchTerm) {
      const match = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.actReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.mineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.assignedOfficer.toLowerCase().includes(searchTerm.toLowerCase());
      if (!match) return false;
    }
    return true;
  });

  const getStatusBadge = (status: ComplianceStatus) => {
    switch (status) {
      case 'COMPLIANT':
        return { label: 'Compliant', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
      case 'NEARING_DUE':
        return { label: 'Due in <15 Days', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
      case 'NON_COMPLIANT':
        return { label: 'Non-Compliant', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' };
      case 'UNDER_REVIEW':
        return { label: 'Under Review', color: 'bg-sky-500/10 text-sky-400 border-sky-500/30' };
      case 'CRITICAL_BREACH':
        return { label: 'DGMS Notice Active', color: 'bg-red-600/20 text-red-300 border-red-500/40 animate-pulse' };
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
              National Statutory Repository
            </span>
            <span className="text-xs text-slate-400">
              Mines Act 1952 • CMR 2017 • CPCB Guidelines
            </span>
          </div>
          <h2 className="text-base font-bold text-slate-100 mt-1">
            Statutory Legal Obligations & Regulatory Filings
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNewComplianceModal}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Statutory Mandate</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="flex-1 min-w-[220px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search regulation, act reference, colliery..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="SAFETY">Safety (DGMS/CMR)</option>
            <option value="ENVIRONMENT">Environment (CPCB/SPCB)</option>
            <option value="LABOUR">Labour & Welfare (Mines Rules)</option>
            <option value="STATUTORY_CLEARANCE">Clearances (EC/FC/PESO)</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="COMPLIANT">Compliant</option>
            <option value="NEARING_DUE">Due Soon (&lt;15d)</option>
            <option value="NON_COMPLIANT">Non-Compliant</option>
            <option value="CRITICAL_BREACH">Critical DGMS Breach</option>
          </select>
        </div>

        {/* Authority Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400">Authority:</span>
          <select
            value={selectedAuthority}
            onChange={(e) => setSelectedAuthority(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Authorities</option>
            <option value="DGMS">DGMS</option>
            <option value="CPCB">CPCB</option>
            <option value="SPCB">SPCB</option>
            <option value="PESO">PESO</option>
            <option value="MoEFCC">MoEFCC</option>
          </select>
        </div>
      </div>

      {/* Compliance Mandates Table / Grid */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const statusBadge = getStatusBadge(item.status);

          return (
            <div
              key={item.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-extrabold rounded bg-slate-800 text-amber-400 border border-slate-700">
                    {item.subsidiary}
                  </span>
                  <span className="text-xs font-semibold text-slate-300">
                    {item.mineName}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-800 text-slate-400">
                    {item.regulatoryAuthority}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded text-xs font-bold border ${statusBadge.color}`}>
                    {statusBadge.label}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono text-amber-400/90 font-medium block">
                  {item.actReference}
                </span>
                <h3 className="text-sm font-bold text-slate-100 mt-0.5">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Exposure & Escalation Details */}
              {item.penaltyExposureINR && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-950/30 border border-rose-900/40 text-xs text-rose-300">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>
                    <strong>Statutory Liability Exposure:</strong> {item.penaltyExposureINR}
                  </span>
                </div>
              )}

              {/* Bottom Meta & Action Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
                <div className="flex items-center gap-4">
                  <span>Frequency: <strong>{item.frequency}</strong></span>
                  <span>Due Date: <strong className="text-slate-200">{item.dueDate}</strong></span>
                  <span>Assigned: <strong>{item.assignedOfficer}</strong></span>
                  <span>Docs: <strong>{item.documents.length} verified</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onAskCopilot(`What are the legal compliance defense points and statutory requirements for ${item.actReference}?`)}
                    className="px-2.5 py-1 rounded bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-800/60 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>AI Legal Strategy</span>
                  </button>
                  <button
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3 h-3 text-slate-400" />
                    <span>View Filing Vault</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
