import React, { useState } from 'react';

interface CapaItem {
  id: string;
  category: string;
  regulation: string;
  hazardDescription: string;
  location: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'ROUTINE';
  status: 'OPEN' | 'IN_PROGRESS' | 'RECTIFIED' | 'CLEARED';
  assignedTo: string;
  deadline: string;
  correctiveAction: string;
  preventiveAction: string;
  evidencePhoto: string;
}

const INITIAL_CAPA: CapaItem[] = [
  {
    id: 'CAPA-2026-089',
    category: 'Highwall & Bench Slope',
    regulation: 'CMR Reg 106(2)',
    hazardDescription: 'Overburden bench #4 angle measured at 48°, exceeding approved statutory 45° limit after monsoon rain.',
    location: 'North Pit Bench 4B (West Sector)',
    severity: 'CRITICAL',
    status: 'IN_PROGRESS',
    assignedTo: 'Mining Sardar Rameshwar & HEMM Excavator #04',
    deadline: '08-Sep-2026 14:00 IST',
    correctiveAction: 'Deploy BEML PC1250 excavator to trim bench crest back to 42° slope with safety berm height 2.5m.',
    preventiveAction: 'Install automated GNSS prism PR-03 to trigger siren if bench displacement exceeds 1.5mm/hr.',
    evidencePhoto: 'https://lh3.googleusercontent.com/aida/AEtjO1WBop4_-T6gF4WdHW05QwKuybRNyjj1n-9DGw970S7Yw0qTdu2cCghsySkTCO_4_dCzi7IKIygao7ctZYBo7XTS4LBDHzALEFviRmVGFdt0bqwYJ81JPeKsRBu6MmC42Ah6xCrFtSJt5J9j6glwG_ZnEgwn0YOBduvE6OVrPEe3hSaBMEn1ezRoU_LXlpRKQ2RlFPg4tDXPeoFWvtnCkgpw4zK-ZY269JFd51_Or0cZlj3SvLBbN__PmFjJ'
  },
  {
    id: 'CAPA-2026-088',
    category: 'Ventilation & Gas Safety',
    regulation: 'CMR Reg 153(1)',
    hazardDescription: 'Return airway ventilation velocity dropped to 0.42 m/s in Sub-panel C due to damaged brattice cloth.',
    location: 'Underground Seam 16 - Incline 2',
    severity: 'HIGH',
    status: 'RECTIFIED',
    assignedTo: 'Ventilation Officer Swadhin Saha',
    deadline: '07-Sep-2026 22:00 IST',
    correctiveAction: 'Replaced torn canvas brattice with flameproof PVC partition; restored airflow to 0.78 m/s.',
    preventiveAction: 'Re-calibrated ultrasonic anemometer AN-02 with automated SCADA warning at 0.50 m/s.',
    evidencePhoto: 'https://lh3.googleusercontent.com/aida/AEtjO1UMYFw1Zf14qT9w7L80oP1e90lqN957L8w14qT9w7L80oP1e90lqN957L8w14qT9w7L80oP1e90lqN957'
  },
  {
    id: 'CAPA-2026-087',
    category: 'HEMM Heavy Machinery',
    regulation: 'CMR Reg 182',
    hazardDescription: 'Haul truck #DP-44 brake test showed 1.8m stopping distance variation during loaded test.',
    location: 'Central Workshop & Haul Road Sump',
    severity: 'MODERATE',
    status: 'CLEARED',
    assignedTo: 'Colliery Mechanical Engineer',
    deadline: '06-Sep-2026 18:00 IST',
    correctiveAction: 'Replaced hydraulic brake booster seal and bled airline; passed retardation test on 1:10 ramp.',
    preventiveAction: 'Mandated daily electronic brake test logging via RFID mobile inspector before pit dispatch.',
    evidencePhoto: 'https://lh3.googleusercontent.com/aida/AEtjO1W86QkGq6v8r44Z6F7Qx19XnQ3Y7B41xZ0918'
  },
  {
    id: 'CAPA-2026-086',
    category: 'Contract Labour Safety',
    regulation: 'DGMS Cir. 02/2019',
    hazardDescription: '6 contract workers from Shivalik Infra engaged without valid VTC Refresher Gate Pass badge.',
    location: 'Coal Handling Plant Siding 2',
    severity: 'HIGH',
    status: 'RECTIFIED',
    assignedTo: 'Labour Welfare Officer & Gate In-charge',
    deadline: '06-Sep-2026 12:00 IST',
    correctiveAction: 'De-rostered 6 workers until completed 2-day special safety drill at Area VTC Centre.',
    preventiveAction: 'Biometric gate turnstiles automated to reject contractor badges missing Form-B verification.',
    evidencePhoto: ''
  }
];

export const InspectionCapaView: React.FC = () => {
  const [items, setItems] = useState<CapaItem[]>(INITIAL_CAPA);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CRITICAL' | 'IN_PROGRESS' | 'RECTIFIED'>('ALL');
  const [selectedItem, setSelectedItem] = useState<CapaItem>(INITIAL_CAPA[0]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDesc, setNewDesc] = useState('');
  const [newLoc, setNewLoc] = useState('');

  const filteredItems = items.filter((item) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'CRITICAL') return item.severity === 'CRITICAL';
    if (activeFilter === 'IN_PROGRESS') return item.status === 'IN_PROGRESS';
    if (activeFilter === 'RECTIFIED') return item.status === 'RECTIFIED' || item.status === 'CLEARED';
    return true;
  });

  const handleMarkRectified = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: 'RECTIFIED' as const } : i))
    );
    if (selectedItem.id === id) {
      setSelectedItem((prev) => ({ ...prev, status: 'RECTIFIED' }));
    }
    alert(`CAPA Record ${id} updated to RECTIFIED.\nLogged on DGMS Statutory Ledger under CMR 2017.`);
  };

  const handleCreateCapa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc.trim()) return;
    const newItem: CapaItem = {
      id: `CAPA-2026-${Math.floor(100 + Math.random() * 900)}`,
      category: 'General Colliery Safety',
      regulation: 'CMR Reg 106/129',
      hazardDescription: newDesc,
      location: newLoc || 'Pit 4 General Area',
      severity: 'HIGH',
      status: 'OPEN',
      assignedTo: 'On-Duty Mining Sardar',
      deadline: '24 Hours from Log',
      correctiveAction: 'Immediate barricading and supervisor inspection.',
      preventiveAction: 'Update shift inspection register and notify Mine Manager.',
      evidencePhoto: ''
    };
    setItems([newItem, ...items]);
    setSelectedItem(newItem);
    setNewDesc('');
    setNewLoc('');
    setShowAddModal(false);
    alert(`New Statutory Non-Conformance ${newItem.id} registered!`);
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#0c182c] via-[#091322] to-[#070e1a] p-5 rounded-2xl border border-amber-500/30 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3 py-0.5 rounded-full text-xs font-mono font-bold mb-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>DGMS STATUTORY CAPA AUDIT PROTOCOL</span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white font-serif">
            Inspection Logs &amp; Corrective / Preventive Actions (CAPA)
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Formal non-conformance tracking, hazard rectification deadlines, and regulatory compliance clearance under CMR 2017.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all flex items-center gap-2 shadow-lg cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">add_circle</span>
          <span>Log New Non-Conformance</span>
        </button>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: CAPA List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Filters */}
          <div className="flex items-center gap-1.5 bg-[#091322] p-1.5 rounded-xl border border-slate-800 text-xs font-mono">
            {(['ALL', 'CRITICAL', 'IN_PROGRESS', 'RECTIFIED'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`flex-1 py-1.5 rounded-lg text-center font-bold transition-all cursor-pointer ${
                  activeFilter === f
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* List items */}
          <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
            {filteredItems.map((item) => {
              const isSelected = selectedItem.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-[#12233e] border-amber-500 shadow-md'
                      : 'bg-[#091322] hover:bg-[#0e1c31] border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-mono font-bold text-amber-400">{item.id}</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      item.severity === 'CRITICAL'
                        ? 'bg-rose-950 text-rose-400 border border-rose-500/40'
                        : item.severity === 'HIGH'
                        ? 'bg-amber-950 text-amber-400 border border-amber-500/40'
                        : 'bg-cyan-950 text-cyan-400 border border-cyan-500/40'
                    }`}>
                      {item.severity}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-slate-100 line-clamp-1">{item.hazardDescription}</div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xs">location_on</span>
                    <span className="line-clamp-1">{item.location}</span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono mt-2 pt-2 border-t border-slate-800/80">
                    <span className="text-slate-400">{item.regulation}</span>
                    <span className={`font-bold ${
                      item.status === 'CLEARED'
                        ? 'text-emerald-400'
                        : item.status === 'RECTIFIED'
                        ? 'text-cyan-400'
                        : item.status === 'IN_PROGRESS'
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}>
                      ● {item.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected CAPA Item Details & Actions (7 cols) */}
        <div className="lg:col-span-7 bg-[#091322] border-2 border-slate-800 rounded-2xl p-5 shadow-2xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-mono font-bold text-amber-400">{selectedItem.id}</span>
                <span className="text-xs font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                  {selectedItem.regulation}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">{selectedItem.category}</h3>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                selectedItem.status === 'CLEARED'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                  : selectedItem.status === 'RECTIFIED'
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40'
                  : selectedItem.status === 'IN_PROGRESS'
                  ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                  : 'bg-rose-950 text-rose-300 border-rose-500/40'
              }`}>
                {selectedItem.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Hazard Summary */}
          <div className="bg-[#060d18] p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">Non-Conformance Finding:</span>
            <p className="text-sm text-slate-100 font-medium leading-relaxed">
              {selectedItem.hazardDescription}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
              <span>📍 Location: <strong className="text-slate-200">{selectedItem.location}</strong></span>
              <span>⏰ Deadline: <strong className="text-amber-300">{selectedItem.deadline}</strong></span>
            </div>
          </div>

          {/* Actions Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0a172a] p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                <span className="material-symbols-outlined text-sm">build</span>
                <span>Immediate Corrective Action</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedItem.correctiveAction}
              </p>
            </div>

            <div className="bg-[#0a172a] p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                <span className="material-symbols-outlined text-sm">shield</span>
                <span>Long-Term Preventive Action</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedItem.preventiveAction}
              </p>
            </div>
          </div>

          {/* Responsible Officer */}
          <div className="flex items-center justify-between bg-[#070f1e] p-3 rounded-xl border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-400 text-lg">assignment_ind</span>
              <div>
                <span className="text-[10px] font-mono text-slate-400 block">ASSIGNED EXECUTOR</span>
                <span className="font-bold text-white">{selectedItem.assignedTo}</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              DSC BINDING ACTIVE
            </span>
          </div>

          {/* Actions & Closure Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {selectedItem.status !== 'RECTIFIED' && selectedItem.status !== 'CLEARED' && (
              <button
                onClick={() => handleMarkRectified(selectedItem.id)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span className="material-symbols-outlined text-sm">task_alt</span>
                <span>Sign Off as Rectified &amp; Upload Evidence</span>
              </button>
            )}

            <button
              onClick={() => alert(`Official Form 24 NCR generated for ${selectedItem.id} under CMR 2017.\nSent to DGMS Zonal Regulatory Directorate.`)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">description</span>
              <span>Generate DGMS Form-24 NCR PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#091322] border-2 border-amber-500/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Log Statutory Non-Conformance</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateCapa} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Hazard / Deviation Description:</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe observation, CMR regulation breached, bench/seam details..."
                  className="w-full bg-[#050c18] border border-slate-700 rounded-lg p-2.5 text-white h-24 focus:border-amber-400 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Colliery Location / Bench:</label>
                <input
                  type="text"
                  value={newLoc}
                  onChange={(e) => setNewLoc(e.target.value)}
                  placeholder="e.g. Pit 4 West Highwall, Haul Ramp #03"
                  className="w-full bg-[#050c18] border border-slate-700 rounded-lg p-2 text-white focus:border-amber-400 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold cursor-pointer"
                >
                  Submit Non-Conformance Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
