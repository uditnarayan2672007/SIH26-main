import React, { useState } from 'react';
import { X, Plus, ShieldCheck, Scale, Camera, FileText } from 'lucide-react';
import { MineSite, ComplianceCategory, StatutoryComplianceItem, FieldInspection } from '../types';

interface NewComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  mines: MineSite[];
  onAddCompliance: (item: any) => void;
}

export const NewComplianceModal: React.FC<NewComplianceModalProps> = ({
  isOpen,
  onClose,
  mines,
  onAddCompliance,
}) => {
  const [mineId, setMineId] = useState(mines[0]?.id || 'mine-001');
  const [title, setTitle] = useState('');
  const [actReference, setActReference] = useState('CMR 2017 - Regulation 106');
  const [category, setCategory] = useState<ComplianceCategory>('SAFETY');
  const [authority, setAuthority] = useState('DGMS');
  const [description, setDescription] = useState('');
  const [penaltyExposure, setPenaltyExposure] = useState('₹5,00,000 & Stop-Work Order');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedMineObj = mines.find(m => m.id === mineId);

    const newItem = {
      id: `stat-${Date.now()}`,
      subsidiary: selectedMineObj?.subsidiary || 'BCCL',
      mineId,
      mineName: selectedMineObj?.name || 'Selected Mine',
      category,
      actReference,
      title,
      description,
      status: 'NEARING_DUE',
      regulatoryAuthority: authority,
      frequency: 'MONTHLY',
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      assignedOfficer: selectedMineObj?.safetyOfficer || 'Safety Officer',
      penaltyExposureINR: penaltyExposure,
      documents: []
    };

    onAddCompliance(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-400" />
            <span>Add Statutory Compliance Obligation</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3 text-xs">
          <div className="space-y-1">
            <label className="text-slate-400 font-semibold block">Target Colliery Project:</label>
            <select
              value={mineId}
              onChange={(e) => setMineId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
            >
              {mines.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.subsidiary})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-400 font-semibold block">Act / Statutory Reference:</label>
              <input
                type="text"
                required
                value={actReference}
                onChange={(e) => setActReference(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400 font-semibold block">Regulatory Body:</label>
              <select
                value={authority}
                onChange={(e) => setAuthority(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
              >
                <option value="DGMS">DGMS (Mines Safety)</option>
                <option value="CPCB">CPCB (Central Pollution)</option>
                <option value="SPCB">SPCB (State Pollution)</option>
                <option value="PESO">PESO (Explosives)</option>
                <option value="MoEFCC">MoEFCC (Forest Clearance)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-semibold block">Compliance Title:</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Quarterly Slope Stability & Radar Displacement Audit"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-semibold block">Detailed Description & Statutory Requirement:</label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Specify requirements, measurement thresholds, and filing schedules..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-semibold block">Statutory Non-Compliance Penalty Exposure:</label>
            <input
              type="text"
              value={penaltyExposure}
              onChange={(e) => setPenaltyExposure(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
            >
              Save Statutory Obligation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
