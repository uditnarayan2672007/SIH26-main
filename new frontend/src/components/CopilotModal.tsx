import React from 'react';

interface CopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CopilotModal: React.FC<CopilotModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = React.useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: 'जय हिन्द। I am the DGMS Statutory Copilot, powered by the Gemini 3.7 Pro Gov Engine. I provide instant statutory guidance under the Mines Act 1952, Coal Mines Regulations 2017, and DGMS Circulars. How may I assist your shift safety operations today?',
      time: '14:15 IST'
    }
  ]);
  const [inputValue, setInputValue] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    'Mining Sardar duties under CMR 2017 Reg. 129',
    'Section 22 stop-work order legal ramifications',
    'Permissible blasting PPV under CMR Reg. 164',
    'Gas testing intervals in Degree-III seam'
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg = { sender: 'user' as const, text, time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' IST' };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsGenerating(true);

    setTimeout(() => {
      let reply = '';
      const lower = text.toLowerCase();
      if (lower.includes('129') || lower.includes('sardar')) {
        reply =
          'Under CMR 2017 Regulation 129, every Mining Sardar shall:\n\n' +
          '1. Prior to shift commencement, thoroughly examine every working face, roof, side, and travel road within the assigned district.\n' +
          '2. Test for flammable and noxious gases (CH4, CO, H2S) using an approved flame safety lamp or certified optical detector.\n' +
          '3. Ensure adequate stone-dusting and water spraying for coal dust explosion suppression.\n' +
          '4. Sign and endorse the statutory shift safety register before the end of the shift with Class-3 DSC token.';
      } else if (lower.includes('22') || lower.includes('stop')) {
        reply =
          'Under Section 22(1A) of the Mines Act 1952, if an Inspector is of opinion that there is urgent and immediate danger to the life or safety of any person employed in any mine, they may by order in writing prohibit extraction until the danger is removed.\n\n' +
          'Failure to comply constitutes a cognizable offense under Section 72C, punishable with imprisonment up to 2 years and statutory fine.';
      } else if (lower.includes('blast') || lower.includes('164') || lower.includes('ppv')) {
        reply =
          'Under CMR 2017 Regulation 164 and DGMS Circular 07/1997:\n\n' +
          '• Maximum Peak Particle Velocity (PPV) for industrial/residential brick/cement structures is 5.0 mm/s (frequency < 25 Hz) or 10.0 mm/s (frequency > 25 Hz).\n' +
          '• 500-meter danger zone must be evacuated, guarded by sentries with red flags, and announced via acoustic siren before firing.';
      } else {
        reply =
          'Under Coal Mines Regulations 2017 and DGMS Circulars, statutory compliance requires strict recording of all environmental gas indices, continuous slope radar telemetry, and biometric verification of all contract labour under Form-B. All records sealed in MineSync are admissible in Court of Law under Section 65B of Indian Evidence Act.';
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: reply,
          time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' IST'
        }
      ]);
      setIsGenerating(false);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0b1526] border border-amber-500/50 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-4 bg-gradient-to-r from-[#0c182c] to-[#12223a] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <span className="material-symbols-outlined text-2xl">auto_awesome</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline text-base font-bold text-white font-serif">
                  DGMS Statutory AI Copilot
                </h3>
                <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.2 rounded font-bold">
                  GEMINI 3.7 PRO GOV
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Mines Act 1952 &amp; CMR 2017 Regulatory Assistant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#070e1a]">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-semibold rounded-br-none shadow-md'
                    : 'bg-[#0e1a2c] text-slate-200 border border-slate-700/80 rounded-bl-none font-normal shadow-md whitespace-pre-line'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 font-mono">{msg.time}</span>
            </div>
          ))}

          {isGenerating && (
            <div className="flex items-center gap-2 text-xs text-amber-400 font-mono p-2">
              <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
              <span>Consulting DGMS Statutory Gazette &amp; CMR 2017...</span>
            </div>
          )}
        </div>

        {/* Prompt Suggestions */}
        <div className="p-2.5 bg-[#081220] border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-slate-400 font-mono text-[10px] shrink-0">Prompts:</span>
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="shrink-0 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-700 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#0c182c] border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask about CMR 2017 regulations, safety limits, legal liabilities..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-[#070e1c] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
          />
          <button
            onClick={() => handleSend()}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1 cursor-pointer"
          >
            <span>Ask</span>
            <span className="material-symbols-outlined text-sm">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
