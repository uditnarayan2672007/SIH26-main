import React from 'react';

interface BlastProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BlastProtocolModal: React.FC<BlastProtocolModalProps> = ({ isOpen, onClose }) => {
  const [stage, setStage] = React.useState<'review' | 'arming' | 'fired'>('review');
  const [countdown, setCountdown] = React.useState<number>(5);

  if (!isOpen) return null;

  const handleArmAndFire = () => {
    setStage('arming');
    let counter = 5;
    const interval = setInterval(() => {
      counter -= 1;
      setCountdown(counter);
      if (counter <= 0) {
        clearInterval(interval);
        setStage('fired');
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#120808] border-2 border-red-500/70 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 bg-red-950/80 border-b border-red-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-red-600/30 border border-red-500 flex items-center justify-center text-red-400">
              <span className="material-symbols-outlined text-xl">warning</span>
            </span>
            <div>
              <h3 className="font-headline text-base font-bold text-white font-serif flex items-center gap-2">
                <span>Controlled Blast Clearance Interlock</span>
                <span className="text-[10px] font-mono bg-red-600 text-white px-2 py-0.2 rounded font-bold">
                  CMR REG. 164
                </span>
              </h3>
              <p className="text-[11px] text-red-300">Sector 2B Pit-4 North • Electronic Delay Detonation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {stage === 'review' && (
            <>
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-900/60 space-y-2 text-slate-200">
                <div className="flex justify-between font-mono">
                  <span className="text-slate-400">Blast Location:</span>
                  <span className="font-bold text-white">Bench #4A North (Overburden)</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-slate-400">Evacuation Radius (500m):</span>
                  <span className="text-emerald-400 font-bold">CLEARED &amp; SENTRIES POSTED</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-slate-400">Seismograph Station:</span>
                  <span className="text-cyan-400 font-bold">#TEL-09 ONLINE (PPV Limit 5.0mm/s)</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-slate-400">Acoustic Warning Siren:</span>
                  <span className="text-amber-400 font-bold">SOUNDED 3-STAGE KLAXON</span>
                </div>
              </div>

              <p className="text-slate-300 leading-relaxed">
                I hereby certify as Blasting Officer holding First Class Mine Manager competency that all persons and HEMM have withdrawn beyond the statutory danger zone under CMR 2017 Regulation 164.
              </p>

              <button
                onClick={handleArmAndFire}
                className="w-full bg-gradient-to-r from-red-600 via-red-500 to-orange-600 hover:from-red-500 text-white font-extrabold py-3 rounded-xl text-xs md:text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span className="material-symbols-outlined text-lg">bolt</span>
                <span>Arm Electronic Detonators &amp; Initiate Countdown</span>
              </button>
            </>
          )}

          {stage === 'arming' && (
            <div className="py-8 text-center space-y-4">
              <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest animate-pulse">
                ARMING HIGH-VOLTAGE DETONATORS...
              </span>
              <div className="text-6xl font-black font-mono text-red-500 animate-bounce">
                T-{countdown}
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Seismograph PPV monitoring channel live. Do not interrupt connection.
              </p>
            </div>
          )}

          {stage === 'fired' && (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto">
                <span className="material-symbols-outlined text-3xl">check_circle</span>
              </div>
              <h4 className="font-headline text-lg font-bold text-white font-serif">
                Controlled Blasting Sequence Completed
              </h4>
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-left font-mono space-y-1 text-xs">
                <div className="text-emerald-400 font-bold">PPV RECORDED: 2.84 mm/s (PERMISSIBLE &lt; 5.0 mm/s)</div>
                <div className="text-cyan-300">FREQUENCY: 18.2 Hz</div>
                <div className="text-slate-400 text-[10px]">DGMS Seismograph Telemetry SHA-256 Ledger Block #48288 Created</div>
              </div>
              <button
                onClick={onClose}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all shadow-md cursor-pointer"
              >
                Close &amp; Return to Console
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
