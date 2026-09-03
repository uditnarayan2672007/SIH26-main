import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Camera, 
  Mic, 
  FileCheck, 
  ArrowRight, 
  ShieldAlert,
  User,
  MapPin,
  Check,
  Eye,
  Maximize2,
  X,
  Shield
} from 'lucide-react';
import { FieldInspection, CAPAStatus, HazardSeverity, UserRole } from '../types';
import confetti from 'canvas-confetti';

interface InspectionCAPAHubProps {
  inspections: FieldInspection[];
  onUpdateCAPAStatus: (inspectionId: string, newStatus: CAPAStatus, notes?: string) => void;
  onOpenNewInspection: () => void;
  onAskCopilot: (query: string) => void;
  currentRole: UserRole;
}

export const InspectionCAPAHub: React.FC<InspectionCAPAHubProps> = ({
  inspections,
  onUpdateCAPAStatus,
  onOpenNewInspection,
  onAskCopilot,
  currentRole,
}) => {
  const [selectedInspection, setSelectedInspection] = useState<FieldInspection | null>(inspections[0] || null);
  const [filterSeverity, setFilterSeverity] = useState<HazardSeverity | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<CAPAStatus | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [rectificationText, setRectificationText] = useState('');
  const [expandedPhoto, setExpandedPhoto] = useState<string | null>(null);

  const filtered = inspections.filter(insp => {
    if (filterSeverity !== 'ALL' && insp.severity !== filterSeverity) return false;
    if (filterStatus !== 'ALL' && insp.capaStatus !== filterStatus) return false;
    if (searchTerm) {
      const match = insp.observationTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    insp.mineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    insp.inspectorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    insp.violatedRegulation.toLowerCase().includes(searchTerm.toLowerCase());
      if (!match) return false;
    }
    return true;
  });

  const getSeverityBadge = (sev: HazardSeverity) => {
    switch (sev) {
      case 'CRITICAL_FATAL_RISK': return 'bg-red-600/20 text-red-300 border-red-500/50 animate-pulse';
      case 'HIGH': return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'MEDIUM': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'LOW': return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    }
  };

  const getCAPABadge = (status: CAPAStatus) => {
    switch (status) {
      case 'OPEN': return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'IN_PROGRESS': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'FIELD_RECTIFIED': return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      case 'STATUTORY_VERIFIED': return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      case 'CLOSED': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  const handleAdvanceCAPA = (insp: FieldInspection) => {
    let next: CAPAStatus = 'IN_PROGRESS';
    if (insp.capaStatus === 'OPEN') next = 'IN_PROGRESS';
    else if (insp.capaStatus === 'IN_PROGRESS') next = 'FIELD_RECTIFIED';
    else if (insp.capaStatus === 'FIELD_RECTIFIED') next = 'STATUTORY_VERIFIED';
    else if (insp.capaStatus === 'STATUTORY_VERIFIED') {
      next = 'CLOSED';
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }

    onUpdateCAPAStatus(insp.id, next, rectificationText || 'CAPA progress updated with digital verification');
    if (selectedInspection?.id === insp.id) {
      setSelectedInspection({ ...insp, capaStatus: next });
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
              DGMS & Sirdar Inspection Hub
            </span>
            <span className="text-xs text-slate-400">
              End-to-End CAPA Rectification Workflow
            </span>
          </div>
          <h2 className="text-base font-bold text-slate-100 mt-1">
            Safety Observations, Statutory Form IV & Hazard Rectification
          </h2>
        </div>

        <button
          id="btn-log-field-inspection"
          onClick={onOpenNewInspection}
          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Log Safety Inspection</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search observation, inspector, violation regulation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400">Severity:</span>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL_FATAL_RISK">Fatal / Stop-Work Risk</option>
            <option value="HIGH">High Severity</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400">Workflow State:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none"
          >
            <option value="ALL">All States</option>
            <option value="OPEN">Open (Action Needed)</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="FIELD_RECTIFIED">Field Rectified</option>
            <option value="STATUTORY_VERIFIED">DGMS Verified</option>
            <option value="CLOSED">Closed & Archived</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Inspection List + Selected Inspection Details Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Inspection Items List */}
        <div className="lg:col-span-7 space-y-3">
          {filtered.map((insp) => {
            const isSelected = selectedInspection?.id === insp.id;
            return (
              <div
                key={insp.id}
                onClick={() => setSelectedInspection(insp)}
                className={`bg-slate-900/90 border rounded-xl p-4 transition-all cursor-pointer ${
                  isSelected ? 'border-amber-500 ring-1 ring-amber-500/50 shadow-lg' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-amber-400">{insp.id}</span>
                      <span className="text-xs text-slate-300 font-semibold">{insp.mineName}</span>
                      <span className="text-[11px] text-slate-400">• {insp.locationTag}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-100 mt-1">{insp.observationTitle}</h3>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadge(insp.severity)}`}>
                      {insp.severity.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getCAPABadge(insp.capaStatus)}`}>
                      {insp.capaStatus}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                  {insp.detailedFindings}
                </p>

                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{insp.inspectorName} ({insp.inspectorRole})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400">{insp.timestamp}</span>
                    <span className="text-amber-400 font-semibold flex items-center gap-0.5">
                      Review <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Inspection Detailed Investigation & CAPA Resolution Card */}
        <div className="lg:col-span-5 space-y-4">
          {selectedInspection ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4 sticky top-20">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono text-amber-400 font-bold block">{selectedInspection.id}</span>
                  <h3 className="text-base font-bold text-slate-100 mt-0.5">{selectedInspection.observationTitle}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-sky-400" />
                    <span>{selectedInspection.locationTag} • {selectedInspection.mineName}</span>
                  </p>
                </div>
              </div>

              {/* Statutory Regulation Clause Violated */}
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-xs">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">Statutory Non-Conformance</span>
                <span className="font-mono text-slate-200 mt-1 block font-semibold">
                  {selectedInspection.violatedRegulation}
                </span>
              </div>

              {/* Full Observation Findings */}
              <div className="text-xs text-slate-300 space-y-1">
                <span className="text-slate-400 font-bold block">Detailed Field Findings:</span>
                <p className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed">
                  {selectedInspection.detailedFindings}
                </p>
              </div>

              {/* Geo-Tagged Statutory Photographic Evidence Card (if attached) */}
              {selectedInspection.evidencePhotoUrl && (
                <div className="bg-slate-950/80 p-3 rounded-lg border border-amber-500/30 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-400 font-bold flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Geo-Tagged Field Photo Evidence</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded">
                      ✓ DGMS Watermarked
                    </span>
                  </div>

                  <div 
                    className="relative aspect-video rounded-lg overflow-hidden border border-white/10 bg-black group cursor-pointer"
                    onClick={() => setExpandedPhoto(selectedInspection.evidencePhotoUrl || null)}
                  >
                    <img 
                      src={selectedInspection.evidencePhotoUrl} 
                      alt="Statutory Field Evidence" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="px-2.5 py-1 rounded-md bg-black/80 text-amber-300 text-[11px] font-bold flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> Full Inspection View
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-mono">
                    <span>SECTOR: {selectedInspection.locationTag}</span>
                    <span className="text-sky-400">
                      LAT {selectedInspection.geoPoint.lat.toFixed(4)}° / LNG {selectedInspection.geoPoint.lng.toFixed(4)}°
                    </span>
                  </div>
                </div>
              )}

              {/* AI Risk Assessment on this item */}
              <div className="bg-gradient-to-br from-indigo-950/50 to-slate-950 p-3 rounded-lg border border-indigo-800/40 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-indigo-300 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>AI Predicted Hazard Impact</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-900/60 text-indigo-200 border border-indigo-700/60">
                    Risk Score: {selectedInspection.aiRiskScore}/100
                  </span>
                </div>
                <p className="text-indigo-200/90 leading-relaxed">
                  {selectedInspection.aiPredictedImpact}
                </p>
              </div>

              {/* CAPA Progress Stepper */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-300 block">CAPA Resolution Stages:</span>
                <div className="grid grid-cols-4 gap-1 text-[10px] text-center font-bold">
                  <div className={`p-1.5 rounded ${
                    selectedInspection.capaStatus !== 'OPEN' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                  }`}>
                    1. Assigned
                  </div>
                  <div className={`p-1.5 rounded ${
                    selectedInspection.capaStatus === 'IN_PROGRESS' || selectedInspection.capaStatus === 'FIELD_RECTIFIED' || selectedInspection.capaStatus === 'STATUTORY_VERIFIED' || selectedInspection.capaStatus === 'CLOSED'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    2. In Action
                  </div>
                  <div className={`p-1.5 rounded ${
                    selectedInspection.capaStatus === 'FIELD_RECTIFIED' || selectedInspection.capaStatus === 'STATUTORY_VERIFIED' || selectedInspection.capaStatus === 'CLOSED'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    3. Rectified
                  </div>
                  <div className={`p-1.5 rounded ${
                    selectedInspection.capaStatus === 'CLOSED'
                      ? 'bg-emerald-500 text-slate-950 font-extrabold'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    4. Verified
                  </div>
                </div>
              </div>

              {/* Rectification Notes input */}
              {selectedInspection.capaStatus !== 'CLOSED' && (
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-semibold block">Field Rectification Remarks / Verification Proof:</label>
                  <textarea
                    rows={2}
                    value={rectificationText}
                    onChange={(e) => setRectificationText(e.target.value)}
                    placeholder="Enter compliance action taken, e.g. 'Safety berm regraded to 2.5m using Dozer D-355'..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                {selectedInspection.capaStatus !== 'CLOSED' ? (
                  <button
                    onClick={() => handleAdvanceCAPA(selectedInspection)}
                    className="w-full py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>
                      {selectedInspection.capaStatus === 'OPEN' && 'Acknowledge & Assign to Overman'}
                      {selectedInspection.capaStatus === 'IN_PROGRESS' && 'Mark Field Rectification Completed'}
                      {selectedInspection.capaStatus === 'FIELD_RECTIFIED' && 'DGMS Official Verification & Sign-Off'}
                      {selectedInspection.capaStatus === 'STATUTORY_VERIFIED' && 'Close & Add to Blockchain Ledger'}
                    </span>
                  </button>
                ) : (
                  <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-center text-xs text-emerald-300 font-semibold flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Statutory CAPA Fully Closed & Cryptographically Sealed</span>
                  </div>
                )}

                <button
                  onClick={() => onAskCopilot(`How to draft a formal compliance submission to DGMS regarding ${selectedInspection.violatedRegulation} for ${selectedInspection.observationTitle}?`)}
                  className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Draft DGMS Statutory Response</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
              <ClipboardCheck className="w-8 h-8 mx-auto text-slate-500 mb-2" />
              <p className="text-xs">Select any observation from the left panel to inspect details and process CAPA sign-off.</p>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Photo Evidence Inspection Modal */}
      {expandedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-sm text-slate-100">
                  DGMS Statutory Evidence Photo Viewfinder
                </span>
              </div>
              <button
                type="button"
                onClick={() => setExpandedPhoto(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-4">
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-black">
                <img
                  src={expandedPhoto}
                  alt="Full view inspection evidence"
                  className="w-full h-auto object-contain max-h-[60vh] mx-auto"
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Watermark verified with Colliery GPS Coordinates
              </span>
              <button
                type="button"
                onClick={() => setExpandedPhoto(null)}
                className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
