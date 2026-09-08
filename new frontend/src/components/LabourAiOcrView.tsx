import React from 'react';
import { ActiveView } from '../types';

interface LabourAiOcrViewProps {
  setActiveView: (view: ActiveView) => void;
  onOpenCopilot: () => void;
}

export const LabourAiOcrView: React.FC<LabourAiOcrViewProps> = ({ setActiveView, onOpenCopilot }) => {
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analyzed, setAnalyzed] = React.useState(true);
  const [selectedDoc, setSelectedDoc] = React.useState<'form-b' | 'vtc' | 'pme'>('vtc');

  const handleRunOcr = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzed(true);
      alert('Gemini 3.7 Pro Multimodal Ingestion Complete!\nExtracted 14 statutory fields with 99.4% confidence score.');
    }, 1200);
  };

  return (
    <div id="labour-ai-ocr-view" className="w-full flex flex-col py-2 max-w-6xl mx-auto">
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
            <span className="text-amber-400 font-bold">AI OCR Intel</span>
          </div>
          <h2 className="font-headline text-2xl md:text-3xl font-bold text-white mt-1 font-serif flex items-center gap-2">
            <span>Labour Intel &amp; AI OCR Gemini 3.7 Pro Gov Engine</span>
            <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded">
              v3.7 PRO
            </span>
          </h2>
          <p className="text-xs text-slate-300">
            Multimodal OCR Document Verification &amp; Gazette Ingestion for DGMS Statutory Registers
          </p>
        </div>

        <button
          onClick={onOpenCopilot}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">psychology</span>
          <span>Open DGMS Copilot</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Document Scanner & Bounding Box Visualizer (7 cols) */}
        <div className="lg:col-span-7 bg-[#0b1526]/95 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-headline text-base font-bold text-white font-serif flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-400">document_scanner</span>
              <span>Statutory Document Multimodal Inspection</span>
            </h3>

            {/* Document Switcher */}
            <div className="inline-flex rounded-lg bg-slate-900 border border-slate-800 p-0.5 text-xs">
              <button
                onClick={() => setSelectedDoc('vtc')}
                className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                  selectedDoc === 'vtc' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400'
                }`}
              >
                VTC Cert
              </button>
              <button
                onClick={() => setSelectedDoc('form-b')}
                className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                  selectedDoc === 'form-b' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400'
                }`}
              >
                Form-B
              </button>
              <button
                onClick={() => setSelectedDoc('pme')}
                className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                  selectedDoc === 'pme' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400'
                }`}
              >
                PME Medical
              </button>
            </div>
          </div>

          {/* Document Preview with AI Bounding Boxes */}
          <div className="relative rounded-xl overflow-hidden border border-cyan-500/40 bg-slate-950 p-4 shadow-inner min-h-[320px] flex flex-col justify-between">
            {/* Simulated Document Sheet */}
            <div className="bg-slate-900/90 border border-slate-700 rounded-lg p-5 font-mono text-xs text-slate-300 relative">
              <div className="text-center border-b border-slate-700 pb-3 mb-3">
                <div className="text-[11px] text-amber-400 font-bold uppercase">
                  DIRECTORATE GENERAL OF MINES SAFETY (DGMS)
                </div>
                <div className="text-sm font-bold text-white font-serif">
                  VOCATIONAL TRAINING CERTIFICATE (RULE 24)
                </div>
                <div className="text-[10px] text-slate-400">Mine Training Centre • BCCL Dhanbad Area</div>
              </div>

              {/* Bounding Box 1: Name */}
              <div className="relative p-1.5 border border-emerald-400 bg-emerald-950/40 rounded mb-2">
                <span className="absolute -top-2.5 left-2 bg-emerald-500 text-slate-950 text-[9px] font-bold px-1 rounded">
                  99.8% NAME
                </span>
                <span className="text-slate-400">Candidate: </span>
                <span className="text-white font-bold">SUJIT MONDAL (S/O Late B. Mondal)</span>
              </div>

              {/* Bounding Box 2: Certificate */}
              <div className="relative p-1.5 border border-cyan-400 bg-cyan-950/40 rounded mb-2">
                <span className="absolute -top-2.5 left-2 bg-cyan-500 text-slate-950 text-[9px] font-bold px-1 rounded">
                  99.6% CODE
                </span>
                <span className="text-slate-400">Registration: </span>
                <span className="text-cyan-300 font-bold">DGMS/VTC/BCCL/2023/884</span>
              </div>

              {/* Bounding Box 3: Trade & Competency */}
              <div className="relative p-1.5 border border-amber-400 bg-amber-950/40 rounded mb-2">
                <span className="absolute -top-2.5 left-2 bg-amber-500 text-slate-950 text-[9px] font-bold px-1 rounded">
                  99.2% TRADE
                </span>
                <span className="text-slate-400">Trade: </span>
                <span className="text-amber-300 font-bold">HEMM Heavy Dumper Operator (100T)</span>
              </div>

              {/* Bounding Box 4: Digital Signature */}
              <div className="relative p-1.5 border border-purple-400 bg-purple-950/40 rounded">
                <span className="absolute -top-2.5 left-2 bg-purple-500 text-white text-[9px] font-bold px-1 rounded">
                  VALID DIGITAL SEAL
                </span>
                <span className="text-slate-400">Issuing Officer: </span>
                <span className="text-purple-300 font-bold">R. K. Mukherjee (VTC Director)</span>
              </div>
            </div>

            {/* Bottom Status bar */}
            <div className="flex items-center justify-between text-xs font-mono pt-3 text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                OCR CONFIDENCE: 99.4%
              </span>
              <span>14 FIELDS EXTRACTED</span>
            </div>
          </div>

          <button
            onClick={handleRunOcr}
            disabled={isAnalyzing}
            className="w-full bg-[#13233a] hover:bg-[#1b3252] border border-cyan-500/40 text-cyan-200 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <span className="material-symbols-outlined text-base text-cyan-400">
              {isAnalyzing ? 'progress_activity' : 'refresh'}
            </span>
            <span>{isAnalyzing ? 'Processing Multimodal Document...' : 'Re-Run Multimodal OCR Extraction'}</span>
          </button>
        </div>

        {/* Right Column: Environmental Gas Telemetrics & Risk Index (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0b1526]/95 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <h3 className="font-headline text-base font-bold text-white font-serif flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-400">air</span>
              <span>Pit Gas Telemetry &amp; Air Quality</span>
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-[#070e1a] border border-slate-800">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400 font-mono">METHANE (CH4):</span>
                  <span className="text-emerald-400 font-bold font-mono">0.28% (PERMISSIBLE)</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[28%]"></div>
                </div>
                <span className="text-[10px] text-slate-500 block mt-1">Threshold: 0.75% stop-work limit</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#070e1a] border border-slate-800">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400 font-mono">CARBON MONOXIDE (CO):</span>
                  <span className="text-cyan-400 font-bold font-mono">12 ppm</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full w-[24%]"></div>
                </div>
                <span className="text-[10px] text-slate-500 block mt-1">Threshold: 50 ppm alert limit</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#070e1a] border border-slate-800">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400 font-mono">OXYGEN (O2):</span>
                  <span className="text-emerald-400 font-bold font-mono">20.8%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[95%]"></div>
                </div>
                <span className="text-[10px] text-slate-500 block mt-1">Minimum legal level: 19.0%</span>
              </div>
            </div>

            {/* Composite Risk Index */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 text-center">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                COMPOSITE COLLIERY RISK SCORE
              </span>
              <div className="text-3xl font-black text-emerald-400 font-mono mt-1">LOW (14/100)</div>
              <p className="text-xs text-slate-300 mt-1">
                Normal atmospheric and workforce parameters. Full statutory extraction permitted.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#081220] border border-slate-800">
            <h4 className="font-bold text-slate-100 text-xs uppercase tracking-wide">
              Automated Gazette Synchronizer
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              All parsed fields are cross-referenced with the Government of India Gazette Repository and Coal Mines Regulations 2017.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
