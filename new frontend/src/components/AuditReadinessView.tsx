import React from 'react';
import { ActiveView, LedgerBlock } from '../types';
import { LEDGER_BLOCKS } from '../data/mockData';

interface AuditReadinessViewProps {
  setActiveView: (view: ActiveView) => void;
}

export const AuditReadinessView: React.FC<AuditReadinessViewProps> = ({ setActiveView }) => {
  const [selectedBlock, setSelectedBlock] = React.useState<LedgerBlock>(LEDGER_BLOCKS[0]);
  const [isVerifying, setIsVerifying] = React.useState(false);

  const handleVerifyMerkle = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      alert(
        'Merkle Tree Cryptographic Audit Complete!\n\n' +
        'Root: 0x918cbef042189ac7201948ba98204918e918cba7198234190821340918bcde\n' +
        'Total Blocks Checked: 48,291\n' +
        'Integrity: 100.00% Zero Collisions. Fully Admissible under Sec 65B Indian Evidence Act.'
      );
    }, 1000);
  };

  const handleDownloadCert = () => {
    alert(
      `Generated Certificate of Electronic Record Admissibility (Section 65B Indian Evidence Act 1872):\n\n` +
      `Block Number: #${selectedBlock.blockNumber}\n` +
      `Hash: ${selectedBlock.hash}\n` +
      `Certifying Officer: ${selectedBlock.officer}\n` +
      `Cryptographic Seal: VALID\n` +
      `Certificate dispatched to legal counsel and DGMS registrar.`
    );
  };

  return (
    <div id="audit-readiness-view" className="w-full flex flex-col py-2 max-w-6xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <button 
              onClick={() => setActiveView('national-command')}
              className="hover:text-amber-400 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-sm">home</span>
              <span>Home</span>
            </button>
            <span>/</span>
            <button 
              onClick={() => setActiveView('portal-directory')}
              className="hover:text-amber-400 cursor-pointer transition-colors"
            >
              Modules Directory
            </button>
            <span>/</span>
            <span className="text-amber-400 font-bold">Audit Ledger</span>
          </div>
          <h2 className="font-headline text-2xl md:text-3xl font-bold text-white mt-1 font-serif">
            Audit Readiness &amp; Tamper-Proof Cryptographic Ledger
          </h2>
          <p className="text-xs text-slate-300">
            Mines Act 1952 Legal Proof of Record &amp; Indian Evidence Act Sec 65B Electronic Admissibility Console
          </p>
        </div>

        <button
          onClick={handleVerifyMerkle}
          disabled={isVerifying}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">
            {isVerifying ? 'sync' : 'verified_user'}
          </span>
          <span>{isVerifying ? 'Verifying Merkle Tree...' : 'Verify Merkle Tree Integrity'}</span>
        </button>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#0b1526] border border-slate-800 p-4 rounded-xl shadow-lg">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Total Sealed Blocks</span>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">48,291</div>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Live Continuous Chain
          </span>
        </div>

        <div className="bg-[#0b1526] border border-slate-800 p-4 rounded-xl shadow-lg">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Merkle Tree Integrity</span>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">100.0%</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Zero Hash Collisions</span>
        </div>

        <div className="bg-[#0b1526] border border-slate-800 p-4 rounded-xl shadow-lg">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Tampered Entries</span>
          <div className="text-2xl font-black text-cyan-400 font-mono mt-1">0</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Full Immutability Retained</span>
        </div>

        <div className="bg-[#0b1526] border border-slate-800 p-4 rounded-xl shadow-lg">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Atomic Time Sync</span>
          <div className="text-2xl font-black text-orange-400 font-mono mt-1">NPL IST</div>
          <span className="text-[10px] text-amber-400 mt-1 block">National Physical Lab Locked</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Blocks Stream (5 cols) */}
        <div className="lg:col-span-5 bg-[#0b1526]/95 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-headline text-base font-bold text-white font-serif">
              Sealed Blocks Stream
            </h3>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
              SHA-256 VALID
            </span>
          </div>

          <div className="space-y-3">
            {LEDGER_BLOCKS.map((block) => {
              const isSelected = selectedBlock.blockNumber === block.blockNumber;
              return (
                <div
                  key={block.blockNumber}
                  onClick={() => setSelectedBlock(block)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                    isSelected
                      ? 'bg-[#12223a] border-amber-500/60 shadow-lg'
                      : 'bg-[#081220] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      BLOCK #{block.blockNumber}
                    </span>
                    <span className="text-[10px] font-mono bg-slate-900 text-slate-400 px-2 py-0.5 rounded">
                      {block.type}
                    </span>
                  </div>

                  <div className="text-xs text-white font-bold truncate">
                    {block.action}
                  </div>

                  <div className="text-[11px] text-slate-400 truncate font-mono">
                    Hash: {block.hash.slice(0, 24)}...
                  </div>

                  <div className="text-[10px] text-slate-500 flex justify-between pt-1 border-t border-slate-800">
                    <span>{block.officer.split(' ')[0]} {block.officer.split(' ')[1] || ''}</span>
                    <span>{block.timestamp.split('(')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Block Inspector & Legal Certificate (7 cols) */}
        <div className="lg:col-span-7 bg-[#0b1526]/95 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                Cryptographic Inspector
              </span>
              <h3 className="font-headline text-lg font-bold text-white font-serif">
                Block #{selectedBlock.blockNumber} Ledger Dossier
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-300 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-500/40">
              {selectedBlock.status} (LEGAL PROOF)
            </span>
          </div>

          {/* Cryptographic Hashes */}
          <div className="p-4 rounded-xl bg-[#070e1a] border border-slate-800 space-y-2 text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">BLOCK HASH (SHA-256):</span>
              <span className="text-cyan-300 break-all">{selectedBlock.hash}</span>
            </div>
            <div className="pt-2 border-t border-slate-800">
              <span className="text-slate-400 block text-[10px]">PREVIOUS BLOCK HASH:</span>
              <span className="text-slate-300 break-all">{selectedBlock.previousHash}</span>
            </div>
            <div className="pt-2 border-t border-slate-800">
              <span className="text-slate-400 block text-[10px]">MERKLE ROOT:</span>
              <span className="text-amber-300 break-all">{selectedBlock.merkleRoot}</span>
            </div>
          </div>

          {/* Block Payload Details */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Timestamp:</span>
              <span className="text-white font-mono">{selectedBlock.timestamp}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Certifying Officer:</span>
              <span className="text-white font-bold">{selectedBlock.officer}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Statutory Role:</span>
              <span className="text-slate-300">{selectedBlock.statutoryRole}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Target Directive:</span>
              <span className="text-amber-400 font-bold">{selectedBlock.target}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] mb-1 font-mono uppercase">
                Raw JSON-LD Payload:
              </span>
              <pre className="bg-[#050a12] p-3 rounded-lg text-[11px] font-mono text-emerald-400 overflow-x-auto border border-slate-800">
                {JSON.stringify(selectedBlock.payload, null, 2)}
              </pre>
            </div>
          </div>

          {/* Legal Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={handleDownloadCert}
              className="w-full sm:w-1/2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">verified</span>
              <span>Download Sec 65B Certificate</span>
            </button>
            <button
              onClick={() => alert(`Exported Block #${selectedBlock.blockNumber} JSON-LD cryptographic ledger snapshot.`)}
              className="w-full sm:w-1/2 bg-[#13233a] hover:bg-[#1b3252] border border-cyan-500/40 text-cyan-200 font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-cyan-400">code</span>
              <span>Export JSON-LD Dossier</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
