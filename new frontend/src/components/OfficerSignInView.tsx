import React from 'react';
import { ActiveView } from '../types';

interface OfficerSignInViewProps {
  onSignInSuccess: (roleName: string) => void;
  setActiveView: (view: ActiveView) => void;
}

export const OfficerSignInView: React.FC<OfficerSignInViewProps> = ({
  onSignInSuccess,
  setActiveView
}) => {
  const [govId, setGovId] = React.useState('dgms.sardar.swagata@cil.gov.in');
  const [password, setPassword] = React.useState('••••••••••••');
  const [showPass, setShowPass] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSignInSuccess('Swagata Ghosh');
    }, 1000);
  };

  const handleQuickFill = (role: 'sardar' | 'manager' | 'inspector') => {
    if (role === 'sardar') {
      setGovId('swagata.ghosh@bccrl.gov.in');
      setPassword('Sardar#DGMS2024');
    } else if (role === 'manager') {
      setGovId('aritra.de@cil.gov.in');
      setPassword('Manager#FCC1stClass');
    } else {
      setGovId('ankita.roy@dgms.gov.in');
      setPassword('Inspector#Sec22Mines');
    }
  };

  return (
    <div id="officer-signin-view" className="w-full flex flex-col py-4 max-w-6xl mx-auto">
      {/* Breadcrumb & Statutory Badge */}
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
          <span className="text-amber-400 font-bold">Sign In</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/40">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>SSL 256-BIT ENCRYPTED</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Form Box (7 cols) */}
        <div className="lg:col-span-7 bg-[#0b1526]/95 border border-amber-500/40 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md flex flex-col justify-between">
          <div className="w-full h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500 absolute top-0 left-0"></div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-2xl">lock_open</span>
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                  Official Statutory Access • CMR 2017
                </span>
                <h2 className="font-headline text-2xl font-bold text-white font-serif">
                  Officer Sign-In &amp; Authentication Gateway
                </h2>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              Restricted portal under Section 22 of Mines Act 1952. Authorized for certified Mining Sardars, First-Class Mine Managers, DGMS Regulatory Inspectors, and Ventilation Officers.
            </p>

            {/* Quick Fill Profile selector */}
            <div className="mb-6 p-3 rounded-xl bg-[#070e1a] border border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-xs text-amber-400">bolt</span>
                <span>Select Designated Cadre for Quick Verification:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('sardar')}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 cursor-pointer"
                >
                  Swagata Ghosh (Mining Sardar)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('manager')}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 cursor-pointer"
                >
                  Aritra De (1st Class Manager)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('inspector')}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 cursor-pointer"
                >
                  Ankita Roy (DGMS Inspector)
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  Official Gov.in Email or DGMS Competency Number
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-3 text-slate-400 text-lg">
                    badge
                  </span>
                  <input
                    type="text"
                    required
                    value={govId}
                    onChange={(e) => setGovId(e.target.value)}
                    placeholder="e.g. officer.name@cil.gov.in"
                    className="w-full bg-[#070e1c] border border-slate-700 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-200">
                    Secret Statutory Key / Password
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => { e.preventDefault(); alert('Self-service OTP password recovery sent to your NIC registered mobile under Aadhaar e-Sign.'); }}
                    className="text-[11px] font-bold text-amber-400 hover:text-amber-300 hover:underline"
                  >
                    Reset via Aadhaar OTP?
                  </a>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-3 text-slate-400 text-lg">
                    vpn_key
                  </span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter statutory key"
                    className="w-full bg-[#070e1c] border border-slate-700 rounded-xl pl-11 pr-11 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-white"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showPass ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0"
                  />
                  <span className="text-xs text-slate-300 font-medium">Keep statutory session active for shift</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold py-3 px-6 rounded-xl text-xs md:text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                    <span>Validating DGMS Credentials &amp; PKI Signature...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">login</span>
                    <span>Authenticate &amp; Enter Statutory Command</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Alternative SSO & Hardware Token row */}
          <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={() => {
                alert('MeriPehchan (ePramaan) National SSO Authenticated. Directing to officer vault.');
                onSignInSuccess('Swagata Ghosh');
              }}
              className="w-full sm:w-1/2 bg-[#101e33] hover:bg-[#182c4a] border border-cyan-500/40 text-cyan-200 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-cyan-400">fingerprint</span>
              <span>MeriPehchan SSO</span>
            </button>
            <button
              type="button"
              onClick={() => {
                alert('Class-3 Hardware USB Token (ePass 2003) detected. Public certificate verified.');
                onSignInSuccess('Aritra De');
              }}
              className="w-full sm:w-1/2 bg-[#101e33] hover:bg-[#182c4a] border border-amber-500/40 text-amber-200 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-amber-400">usb</span>
              <span>DSC Token Login</span>
            </button>
          </div>
        </div>

        {/* Right Info Showcase (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-slate-800 bg-[#081220] overflow-hidden shadow-2xl">
          <div className="relative h-64 overflow-hidden bg-slate-950">
            <img
              src="https://lh3.googleusercontent.com/aida/AEtjO1WZXa8F34S2jr42qrtH1_PGP7pxxSgT9P0074ph8zvyFL6x9_qSyvXzOiyEHMhcU0XwBGQdo4iWZk7Ye37WluEWhyPifQa60KElLiomWmmTQeXhe-4bmeA7iSoX-Bg62JRmcZO5Yj-O4w_N8rde7if_2ZC2ucnrc0OQL3PentPhOj23oSZ08VKAhUKx_f6UOWXnPw3QjzkeNXC5Xgmgtoe_sP30cQbKkxeoI6zONBOY3t7P91nGhQQoZp8A"
              alt="Colliery Manager & DGMS Inspector on-site inspection"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#081220] via-transparent to-transparent"></div>
            <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-amber-500/40 text-[10px] font-mono text-amber-300 font-bold">
              CMR 2017 MANDATE
            </div>
            <div className="absolute bottom-3 left-4 right-4 text-white">
              <span className="text-xs font-bold text-amber-400">DGMS In-Pit Enforcement</span>
              <h4 className="text-base font-bold font-serif">Colliery Manager &amp; DGMS Inspector Joint Verification</h4>
            </div>
          </div>

          <div className="p-6 flex-1 flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-slate-300 leading-relaxed">
                <span className="font-bold text-amber-300 block mb-1">Notice to All Cadres:</span>
                Under Mines Act 1952 Section 22 and CMR 2017 Regulation 129, any false entry or omitted atmospheric reading constitutes a cognizable legal offense punishable under Section 72C.
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <span className="material-symbols-outlined text-emerald-400 text-base">verified</span>
                  <span>FIPS 140-2 Level 3 Hardware Security Modules</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <span className="material-symbols-outlined text-emerald-400 text-base">verified</span>
                  <span>Admissible in Indian Court of Law under Sec 65B</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <span className="material-symbols-outlined text-emerald-400 text-base">verified</span>
                  <span>Multi-factor Aadhaar Biometric / OTP Binding</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Need to register a new officer?</span>
              <button
                onClick={() => setActiveView('cadre-onboarding')}
                className="font-bold text-amber-400 hover:text-amber-300 hover:underline cursor-pointer"
              >
                Enroll Officer Dossier →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
