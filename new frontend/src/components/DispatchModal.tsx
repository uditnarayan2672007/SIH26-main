import React from 'react';

interface DispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DispatchModal: React.FC<DispatchModalProps> = ({ isOpen, onClose }) => {
  const [vehicleNo, setVehicleNo] = React.useState('JH-10-BX-9942');
  const [grossWeight, setGrossWeight] = React.useState('54.20');
  const [tareWeight, setTareWeight] = React.useState('18.10');
  const [isValidated, setIsValidated] = React.useState(true);

  if (!isOpen) return null;

  const netWeight = (parseFloat(grossWeight) - parseFloat(tareWeight)).toFixed(2);

  const handleGenerateChallan = () => {
    alert(
      `e-Transit Pass Generated & Dispatched to FOIS Grid!\n\n` +
      `Vehicle: ${vehicleNo}\n` +
      `Net Coal Payload: ${netWeight} Tonnes\n` +
      `Grade: Coking Coal W-IV (ROM)\n` +
      `RFID Weighbridge Bay: #02 Outbound\n` +
      `SHA-256 Transit Stamp: 0x77ab129f...`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0b1526] border border-cyan-500/50 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#0c182c] to-[#12223a] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <span className="material-symbols-outlined text-2xl">local_shipping</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline text-base font-bold text-white font-serif">
                  e-Transit Pass &amp; Smart Weighbridge
                </h3>
                <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.2 rounded font-bold">
                  DGMS CIR. 08/23
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Automated Vehicle Identification &amp; Anti-Overload Gate</p>
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Vehicle Registration No.</label>
              <input
                type="text"
                value={vehicleNo}
                onChange={(e) => setVehicleNo(e.target.value)}
                className="w-full bg-[#070e1c] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono uppercase focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">RFID Sensor Tag ID</label>
              <input
                type="text"
                disabled
                value="RFID-BCCL-PASS-449"
                className="w-full bg-[#070e1c] border border-slate-800 rounded-xl px-3 py-2 text-slate-400 font-mono"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#070e1a] border border-slate-800 space-y-3 font-mono">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Gross Weight:</span>
              <span className="text-white font-bold text-sm">{grossWeight} Tonnes</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Tare Weight:</span>
              <span className="text-slate-300">{tareWeight} Tonnes</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-800">
              <span className="text-cyan-400 font-bold">Net Mineral Payload:</span>
              <span className="text-emerald-400 font-bold text-base">{netWeight} TONNES</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-[11px] font-mono">
            <span className="text-emerald-300 flex items-center gap-1.5 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              PAYLOAD WITHIN LEGAL LIMIT (&lt; 55.0T)
            </span>
            <span className="text-slate-400">ANPR CAMERA MATCHED</span>
          </div>

          <button
            onClick={handleGenerateChallan}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 text-white font-extrabold py-3 rounded-xl text-xs md:text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span className="material-symbols-outlined text-lg">verified</span>
            <span>Issue Cryptographically Sealed e-Transit Pass</span>
          </button>
        </div>
      </div>
    </div>
  );
};
