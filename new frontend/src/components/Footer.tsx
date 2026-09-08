import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer id="main-footer" className="w-full bg-[#050c17] text-slate-300 border-t border-slate-800 mt-12 relative z-20">
      {/* Tricolor Micro Trim */}
      <div className="w-full h-1 bg-gradient-to-r from-[#FF671F] via-[#FFFFFF] to-[#138808] opacity-90"></div>

      <div className="w-full px-4 sm:px-6 lg:px-8 2xl:px-12 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-6 border-b border-slate-800 text-xs">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-amber-400 text-lg">shield</span>
              <span className="font-bold text-white uppercase tracking-wider">Statutory Mandate</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Mines and Minerals (Development and Regulation) Act 1957, Coal Mines Regulations 2017, and Mines Act 1952.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-emerald-400 text-lg">security</span>
              <span className="font-bold text-white uppercase tracking-wider">Cyber Security Compliance</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              CERT-In audited national critical infrastructure node. Strictly adhering to IT Act 2000 (Section 43, 66 &amp; 70B).
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-cyan-400 text-lg">dns</span>
              <span className="font-bold text-white uppercase tracking-wider">Infrastructure &amp; Hosting</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              National Data Centre (NDC), National Informatics Centre (NIC), Ministry of Electronics &amp; IT, New Delhi.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-amber-400 text-lg">verified</span>
              <span className="font-bold text-white uppercase tracking-wider">PKI Standard</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Controller of Certifying Authorities (CCA) India Tier-3 Hardware Cryptoprocessor &amp; Digital Signatures.
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="text-[11px]">
            © 2024 Ministry of Coal, Government of India. Designed, Developed and Hosted by <strong className="text-slate-200">National Informatics Centre (NIC)</strong>.
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('MineSync Privacy Policy: In full compliance with IT Act 2000 & Digital Personal Data Protection Act (DPDP).'); }} className="hover:text-amber-400 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" onClick={(e) => { e.preventDefault(); alert('Terms of Statutory Usage: Access restricted to authorized statutory cadres holding valid DGMS competencies.'); }} className="hover:text-amber-400 transition-colors">Terms of Statutory Usage</a>
            <span>•</span>
            <a href="#hyperlink" onClick={(e) => { e.preventDefault(); alert('Hyperlinking Policy: Permitted exclusively with official Government of India colliery domains.'); }} className="hover:text-amber-400 transition-colors">Hyperlinking Policy</a>
            <span>•</span>
            <span className="text-amber-400 font-mono font-semibold bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">v4.8.2-PROD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
