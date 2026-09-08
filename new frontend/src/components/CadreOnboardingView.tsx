import React from 'react';
import { ActiveView } from '../types';

interface CadreOnboardingViewProps {
  setActiveView: (view: ActiveView) => void;
}

export const CadreOnboardingView: React.FC<CadreOnboardingViewProps> = ({ setActiveView }) => {
  const [captchaText, setCaptchaText] = React.useState('K7R9B');
  const [enteredCaptcha, setEnteredCaptcha] = React.useState('');
  const [fullName, setFullName] = React.useState('Swagata Ghosh');
  const [dob, setDob] = React.useState('1987-04-12');
  const [cadre, setCadre] = React.useState('Mining Sardar (CMR Reg 129)');
  const [subsidiary, setSubsidiary] = React.useState('Bharat Coking Coal Limited (BCCL)');
  const [colliery, setColliery] = React.useState('Jharia Colliery Opencast Pit-4');
  const [certNum, setCertNum] = React.useState('DGMS-SARDAR-COMP-2018-9942');
  const [mobile, setMobile] = React.useState('+91 98310 44821');
  const [email, setEmail] = React.useState('sardar.swagata.ghosh@bccl.gov.in');
  const [declaration, setDeclaration] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const refreshCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let res = '';
    for (let i = 0; i < 5; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(res);
    setEnteredCaptcha('');
  };

  const playCaptchaAudio = () => {
    alert(`Audio Captcha Voice: "${captchaText.split('').join(' - ')}"`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredCaptcha.toUpperCase() !== captchaText) {
      alert('Security Captcha does not match. Please verify the characters.');
      return;
    }
    if (!declaration) {
      alert('Please check the statutory declaration to proceed.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert(
        `Statutory Officer Registration Submitted Successfully!\n\n` +
        `Application Dossier ID: CMR-14A-2024-${Math.floor(100000 + Math.random() * 900000)}\n` +
        `Candidate: ${fullName}\n` +
        `Designation: ${cadre}\n` +
        `DGMS Verification Token dispatched to Zonal Director.`
      );
      setActiveView('statutory-vault');
    }, 1200);
  };

  return (
    <div id="cadre-onboarding-view" className="w-full flex flex-col py-4 max-w-6xl mx-auto">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
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
          <span className="text-amber-400 font-bold">Cadre Registration</span>
        </div>
        <span className="text-[11px] font-mono text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30">
          FORM CMR-14-A (STATUTORY)
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Onboarding Protocol Stepper & Prerequisites (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Stepper Card */}
          <div className="bg-[#0b1526] border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-4 flex items-center gap-2 font-mono">
              <span className="material-symbols-outlined text-base">alt_route</span>
              <span>4-Phase Onboarding Protocol</span>
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3 relative">
                <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                  1
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Identity &amp; Cadre Assignment</div>
                  <div className="text-[11px] text-amber-400 font-medium">Currently In Progress</div>
                </div>
              </div>

              <div className="flex items-start gap-3 relative opacity-60">
                <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-700">
                  2
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-300">DGMS Competency Binding</div>
                  <div className="text-[11px] text-slate-400">Certificate &amp; Examination Record</div>
                </div>
              </div>

              <div className="flex items-start gap-3 relative opacity-60">
                <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-700">
                  3
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-300">DSC Hardware Token Pairing</div>
                  <div className="text-[11px] text-slate-400">Class-3 FIPS 140-2 Level 3 Key</div>
                </div>
              </div>

              <div className="flex items-start gap-3 relative opacity-60">
                <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-700">
                  4
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-300">Statutory Swearing &amp; Seal</div>
                  <div className="text-[11px] text-slate-400">DGMS Regional Approval</div>
                </div>
              </div>
            </div>
          </div>

          {/* Statutory Prerequisites */}
          <div className="bg-[#081220] border border-amber-500/20 rounded-2xl p-5 shadow-xl">
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-400 text-base">checklist</span>
              <span>Mandatory Prerequisites</span>
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-sm mt-0.5 shrink-0">check_circle</span>
                <span>Active Mobile Number linked with UIDAI Aadhaar for e-KYC.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-sm mt-0.5 shrink-0">check_circle</span>
                <span>Original DGMS Competency Certificate (Gazetted PDF &lt; 5MB).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-sm mt-0.5 shrink-0">check_circle</span>
                <span>Hardware USB Cryptographic Token (ePass 2003 / mToken).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-sm mt-0.5 shrink-0">check_circle</span>
                <span>Mine Manager statutory appointment letter under CMR Reg. 27.</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400">
            <span className="font-bold text-slate-200 block mb-1">Need help with DSC token drivers?</span>
            Contact NIC MineSync Helpdesk toll-free at <strong className="text-amber-400">1800-11-MINE</strong> or email dsc-support@nic.in.
          </div>
        </div>

        {/* Right Column: Registration Form (8 cols) */}
        <div className="lg:col-span-8 bg-[#0b1526]/95 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl relative">
          <div className="w-full h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500 absolute top-0 left-0"></div>

          <div className="mb-6">
            <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
              Government of India • Ministry of Coal • DGMS
            </span>
            <h2 className="font-headline text-2xl font-bold text-white mt-1 font-serif">
              Statutory Officer Profile Registration Dossier
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Ensure all information matches official DGMS certificates. Discrepancies may delay biometric activation.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Full Legal Name (As per DGMS Certificate) *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#070e1c] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-[#070e1c] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Statutory Cadre Designation *
                </label>
                <select
                  value={cadre}
                  onChange={(e) => setCadre(e.target.value)}
                  className="w-full bg-[#070e1c] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option>Mining Sardar (CMR Reg 129)</option>
                  <option>Mine Manager (1st Class Competency)</option>
                  <option>DGMS Inspector (Central Enforcement)</option>
                  <option>Safety &amp; Ventilation Officer (CMR Reg 29)</option>
                  <option>Labour Sardar (CMR Reg 130)</option>
                  <option>DGMS Regional Zonal Officer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  DGMS Certificate of Competency Number *
                </label>
                <input
                  type="text"
                  required
                  value={certNum}
                  onChange={(e) => setCertNum(e.target.value)}
                  className="w-full bg-[#070e1c] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Coal Subsidiary / Mining Operator *
                </label>
                <select
                  value={subsidiary}
                  onChange={(e) => setSubsidiary(e.target.value)}
                  className="w-full bg-[#070e1c] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option>Bharat Coking Coal Limited (BCCL)</option>
                  <option>Eastern Coalfields Limited (ECL)</option>
                  <option>Central Coalfields Limited (CCL)</option>
                  <option>South Eastern Coalfields Limited (SECL)</option>
                  <option>Western Coalfields Limited (WCL)</option>
                  <option>Northern Coalfields Limited (NCL)</option>
                  <option>Mahanadi Coalfields Limited (MCL)</option>
                  <option>Singareni Collieries Company Limited (SCCL)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Colliery / Lease Unit Name *
                </label>
                <input
                  type="text"
                  required
                  value={colliery}
                  onChange={(e) => setColliery(e.target.value)}
                  className="w-full bg-[#070e1c] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Official Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#070e1c] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Aadhaar Registered Mobile (+91) *
                </label>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full bg-[#070e1c] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Captcha Box */}
            <div className="p-4 rounded-xl bg-[#070e1a] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg font-mono text-lg font-extrabold tracking-widest text-amber-400 select-none line-through">
                  {captchaText}
                </div>
                <button
                  type="button"
                  onClick={refreshCaptcha}
                  title="Reload Security Captcha"
                  className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                >
                  <span className="material-symbols-outlined text-sm">refresh</span>
                </button>
                <button
                  type="button"
                  onClick={playCaptchaAudio}
                  title="Listen to Audio Captcha"
                  className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                >
                  <span className="material-symbols-outlined text-sm">volume_up</span>
                </button>
              </div>

              <div className="w-full sm:w-48">
                <input
                  type="text"
                  required
                  placeholder="Enter Captcha"
                  value={enteredCaptcha}
                  onChange={(e) => setEnteredCaptcha(e.target.value)}
                  className="w-full bg-[#0a1426] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono uppercase focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Consent Declaration */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                type="checkbox"
                id="consent-check"
                checked={declaration}
                onChange={(e) => setDeclaration(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0"
              />
              <label htmlFor="consent-check" className="text-xs text-slate-300 leading-relaxed cursor-pointer">
                I solemnly declare that all particulars furnished above are true and complete under the Coal Mines Regulations 2017. I acknowledge that misrepresentation incurs disqualification and liability under Section 72C of the Mines Act 1952.
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold py-3 px-6 rounded-xl text-xs md:text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                  <span>Transmitting Dossier to DGMS Zonal Registrar...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">app_registration</span>
                  <span>Submit Statutory Dossier for DGMS Zonal Endorsement</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
