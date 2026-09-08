import React from 'react';
import { ActiveView } from '../types';
import { NATIONAL_EMBLEM_URL } from '../data/mockData';

interface HeaderProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  isDark: boolean;
  setIsDark: (val: boolean) => void;
  language: 'ENG' | 'HIN';
  setLanguage: (lang: 'ENG' | 'HIN') => void;
  onOpenCopilot: () => void;
  onOpenDispatch: () => void;
  onOpenBlast: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  isDark,
  setIsDark,
  language,
  setLanguage,
  onOpenCopilot,
  onOpenDispatch,
  onOpenBlast
}) => {
  const [istTime, setIstTime] = React.useState<string>('');
  const [isScrolled, setIsScrolled] = React.useState<boolean>(false);
  const [isScrollingDown, setIsScrollingDown] = React.useState<boolean>(false);
  const lastScrollY = React.useRef<number>(0);

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setIstTime(now.toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata' }) + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // When scrolling down past 50px, hide header out of view
      // The header stays hidden until the user reaches back to the very top
      if (currentScrollY > 50) {
        setIsScrollingDown(true);
      } else {
        // Reaching the top reveals the header
        setIsScrollingDown(false);
      }
      setIsScrolled(currentScrollY > 20);
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const navLinks: { id: ActiveView; label: string; icon: string; badge?: string }[] = [
    { id: 'national-command', label: 'Home', icon: 'account_balance', badge: 'Apex' },
    { id: 'role-gateways', label: 'Role Gateways', icon: 'layers' },
    { id: 'officer-dashboard', label: 'Officer Dashboard', icon: 'dashboard', badge: 'Console' },
    { id: 'portal-directory', label: 'All Modules (8)', icon: 'apps', badge: 'Hub' },
    { id: 'officer-signin', label: 'Sign In', icon: 'vpn_key' },
    { id: 'cadre-onboarding', label: 'Cadre Registration', icon: 'app_registration' },
    { id: 'statutory-vault', label: 'Statutory Vault', icon: 'gavel', badge: 'CMR 2017' },
    { id: 'mobile-inspector', label: 'Mobile Inspector', icon: 'phonelink_setup', badge: 'v4.2' },
    { id: 'labour-contractors', label: 'Labour & Form-B', icon: 'engineering' },
    { id: 'labour-ai-ocr', label: 'AI OCR Intel', icon: 'document_scanner', badge: 'Gemini 3.7' },
    { id: 'audit-readiness', label: 'Audit Ledger', icon: 'verified_user', badge: '100%' },
  ];

  return (
    <header
      id="main-header"
      className={`w-full flex flex-col shadow-2xl sticky top-0 z-50 transition-transform duration-300 ${
        isScrollingDown ? '-translate-y-full shadow-none' : 'translate-y-0'
      }`}
    >
      {/* Top Sovereign Tricolor Ribbon */}
      <div className="w-full h-1 bg-gradient-to-r from-[#FF671F] via-[#FF9933] via-35% via-[#FFFFFF] via-50% via-[#138808] to-[#046A38] shadow-sm relative z-50"></div>

      {/* Sovereign Top Utility Bar - smoothly collapses when scrolled */}
      <div className={`w-full bg-[#04080f]/95 text-slate-300 text-[11px] font-mono border-b border-slate-800/80 transition-all duration-300 overflow-hidden ${
        isScrolled ? 'max-h-0 py-0 opacity-0 border-b-0' : 'max-h-12 py-1.5 px-4 sm:px-6 lg:px-8 2xl:px-12 opacity-100'
      }`}>
        <div className="w-full flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_6px_#f59e0b]"></span>
            <span className="text-slate-200 font-medium text-[10px] sm:text-[11px]">
              {language === 'HIN'
                ? 'खान सुरक्षा महानिदेशालय (DGMS) • आधिकारिक वैधानिक पोर्टल • MINES ACT 1952'
                : 'DGMS STATUTORY APEX DOMAIN • GOV.IN COAL GOVERNANCE • MINES ACT 1952'}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 md:gap-4 text-slate-300 text-[10px] sm:text-[11px]">
            <span>
              {language === 'HIN' ? 'हेल्पलाइन: ' : 'HELPLINE: '}
              <span className="text-amber-400 font-bold tracking-wider font-mono">1800-11-MINE (6463)</span>
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:flex text-emerald-400 font-semibold items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#10b981]"></span>
              NIC ACTIVE
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline font-mono text-amber-300">
              {istTime}
            </span>
          </div>
        </div>
      </div>

      {/* Main Identity Bar: MineSync on the Left, Bharat Sarkar & Official Government of India Logo on the Top Right,
          with Dispatch, AI Co-pilot, Blast BELOW Government of India,
          and English/Hindi & Dark Mode toggle in between / in that gap beside the Government of India portal! */}
      <div className={`w-full border-b transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#040913]/98 py-1.5 shadow-2xl border-amber-500/30 backdrop-blur-xl' 
          : 'bg-[#0b1322]/95 py-3 md:py-3.5 border-cyan-900/30 dark:border-slate-800/80'
      }`}>
        <div className="w-full px-4 sm:px-6 lg:px-8 2xl:px-12 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
          
          {/* Left: MineSync Brand & Badges */}
          <div 
            className="flex items-center gap-3 cursor-pointer group shrink-0"
            onClick={() => setActiveView('national-command')}
            title="Return to National Command Home Page"
          >
            <div className={`rounded-xl bg-gradient-to-br from-amber-500/20 via-[#0c2340] to-[#0a1526] text-amber-400 flex items-center justify-center shadow-lg border border-amber-500/40 ring-1 ring-orange-500/20 group-hover:scale-105 transition-all duration-300 shrink-0 ${
              isScrolled ? 'w-10 h-10 md:w-11 md:h-11' : 'w-12 h-12 md:w-14 md:h-14'
            }`}>
              <span className={`material-symbols-outlined drop-shadow text-amber-400 transition-all duration-300 ${
                isScrolled ? 'text-[22px] md:text-[26px]' : 'text-[28px] md:text-[32px]'
              }`}>shield_locked</span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`font-headline font-bold tracking-tight text-white drop-shadow-sm font-serif transition-all duration-300 ${
                  isScrolled ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'
                }`}>MineSync</span>
                <span className="bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold px-2 py-0.5 rounded text-[10px] tracking-wide uppercase font-mono shadow-xs">
                  OFFICIAL STATUTORY PORTAL
                </span>
                <span className="hidden xl:inline text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                  NODE 4.2-A
                </span>
              </div>
              <p className={`text-slate-300 font-medium flex items-center gap-2 transition-all duration-300 ${
                isScrolled ? 'text-[11px] mt-0' : 'text-xs mt-0.5'
              }`}>
                <span className="flex items-center text-emerald-400 font-bold gap-1 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Gov PKI 256-Bit
                </span>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <span className="font-semibold text-slate-300 text-[11px] hidden sm:inline">
                  Mines Act 1952 &amp; CMR 2017 Regulatory Compliance Node
                </span>
              </p>
            </div>
          </div>

          {/* Center-Right: In the gap beside the Government of India portal: Language (ENG/हिन्दी) and Dark Option,
              and Right: Bharat Sarkar / Government of India with Dispatch, AI Co-pilot, Blast BELOW it! */}
          <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4 lg:gap-6 flex-wrap md:flex-nowrap">
            
            {/* The Gap beside Government of India: English/Hindi and Dark Option */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Language Switcher */}
              <div className="inline-flex items-center p-0.5 rounded-lg bg-[#070c16] border border-slate-700/80 text-[11px] shadow-sm">
                <button
                  id="lang-eng-btn"
                  onClick={() => setLanguage('ENG')}
                  className={`px-2 py-1 rounded font-bold transition-all ${
                    language === 'ENG' ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40 shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ENG
                </button>
                <button
                  id="lang-hin-btn"
                  onClick={() => setLanguage('HIN')}
                  className={`px-2 py-1 rounded font-bold font-serif transition-all ${
                    language === 'HIN' ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40 shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  हिन्दी
                </button>
              </div>

              {/* Theme Toggle (Dark / Light) */}
              <button
                id="theme-toggle-btn"
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#111f36] hover:bg-[#182b4a] border border-slate-700 text-amber-300 text-[11px] font-bold transition-all cursor-pointer shadow-sm hover:border-amber-500/40"
                title="Toggle Interface Theme (Dark / Light)"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {isDark ? 'dark_mode' : 'light_mode'}
                </span>
                <span className="font-mono">{isDark ? 'Dark' : 'Light'}</span>
              </button>
            </div>

            {/* Right: Government of India Portal & Official State Emblem, with Dispatch, AI Co-pilot, Blast BELOW! */}
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              
              {/* Top Line: Bharat Sarkar & Government of India on the SAME LINE as the Official Logo */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right leading-tight select-none">
                  <div className={`font-extrabold text-white font-serif tracking-tight flex items-center justify-end gap-1.5 transition-all duration-300 ${
                    isScrolled ? 'text-xs sm:text-sm' : 'text-xs sm:text-sm md:text-base'
                  }`}>
                    <span>भारत सरकार</span>
                    <span className="text-amber-400/80 font-normal">|</span>
                    <span>Government of India</span>
                  </div>
                  <div className={`font-bold text-amber-400 tracking-wide transition-all duration-300 ${
                    isScrolled ? 'text-[10px]' : 'text-[11px] sm:text-xs mt-0.5'
                  }`}>
                    खान मंत्रालय • Ministry of Coal
                  </div>
                  <div className={`text-slate-300 font-medium transition-all duration-300 ${
                    isScrolled ? 'text-[9px] hidden sm:block' : 'text-[10px] sm:text-[11px]'
                  }`}>
                    खान सुरक्षा महानिदेशालय (DGMS)
                  </div>
                </div>

                {/* Official Logo of the Government of India (Lion Capital of Ashoka with Satyameva Jayate) */}
                <div 
                  className={`p-1 rounded-xl bg-gradient-to-b from-amber-500/20 via-[#0e1f38] to-[#070e1a] border-2 border-amber-400/70 shadow-[0_0_16px_rgba(245,158,11,0.3)] ring-1 ring-amber-400/30 shrink-0 flex items-center justify-center transition-all duration-300 hover:border-amber-300 ${
                    isScrolled ? 'scale-90' : 'scale-100'
                  }`}
                  title="Official State Emblem of the Government of India (Lion Capital of Ashoka with Satyameva Jayate)"
                >
                  <img
                    src={NATIONAL_EMBLEM_URL}
                    alt="Government of India Official State Emblem"
                    className={`object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-300 ${
                      isScrolled ? 'w-8 h-10 sm:w-9 sm:h-11' : 'w-10 h-12 sm:w-11 sm:h-14 md:w-12 md:h-15'
                    }`}
                  />
                </div>
              </div>

              {/* BELOW the Government of India: Dispatch, AI Co-pilot, Blast buttons - ONLY shown in dashboards/modules, NEVER on Home page */}
              {activeView !== 'national-command' && (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    id="header-dispatch-btn"
                    onClick={onOpenDispatch}
                    className="bg-[#112038] hover:bg-[#1a2f50] border border-cyan-500/50 hover:border-cyan-400 text-cyan-200 px-2.5 py-0.5 sm:py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 shadow-sm cursor-pointer hover:scale-102"
                    title="Launch Transit Weighbridge & Dispatch Manifest"
                  >
                    <span className="material-symbols-outlined text-[13px] text-cyan-400">local_shipping</span>
                    <span>Dispatch</span>
                  </button>

                  <button
                    id="header-copilot-btn"
                    onClick={onOpenCopilot}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-2.5 py-0.5 sm:py-1 rounded-md text-[11px] font-extrabold transition-all flex items-center gap-1 shadow-sm hover:scale-105 cursor-pointer border border-amber-300/60"
                    title="Open DGMS Statutory AI Copilot"
                  >
                    <span className="material-symbols-outlined text-[13px]">auto_awesome</span>
                    <span>AI Co-pilot</span>
                  </button>

                  <button
                    id="header-blast-btn"
                    onClick={onOpenBlast}
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-2.5 py-0.5 sm:py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 shadow-sm cursor-pointer border border-red-400/50 hover:scale-102"
                    title="Initiate Blasting Protocol"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    <span>Blast</span>
                  </button>
                </div>
              )}

            </div>

          </div>

        </div>
      </div>

      {/* Screen Navigation Bar - ONLY shown when inside a gateway/dashboard, NEVER on the Home page */}
      {activeView !== 'national-command' && (
        <nav id="screens-nav" className="w-full bg-[#08101d] border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 2xl:px-12 py-2 overflow-x-auto">
          <div className="w-full flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveView('national-command')}
                className="flex items-center gap-1.5 bg-[#0e1c31] hover:bg-[#162a4a] text-slate-200 border border-slate-700 px-3 py-1 rounded-lg transition-colors cursor-pointer font-bold"
              >
                <span className="material-symbols-outlined text-[15px] text-amber-400">home</span>
                <span>Home Page</span>
              </button>
              <span className="text-slate-500">/</span>
              <button
                onClick={() => setActiveView('role-gateways')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors cursor-pointer font-bold ${
                  activeView === 'role-gateways'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                    : 'bg-[#0e1c31] hover:bg-[#162a4a] text-slate-300 border border-slate-700'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">layers</span>
                <span>Role Gateways</span>
              </button>
              {activeView !== 'role-gateways' && (
                <>
                  <span className="text-slate-500">/</span>
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    {activeView === 'officer-dashboard' && 'Statutory Officer Operations Dashboard'}
                    {activeView === 'statutory-vault' && 'Statutory Vault & Directives'}
                    {activeView === 'mobile-inspector' && 'Mobile Field Inspector v4.2'}
                    {activeView === 'labour-contractors' && 'Labour Muster & Form-B'}
                    {activeView === 'labour-ai-ocr' && 'AI OCR Multimodal Intel'}
                    {activeView === 'audit-readiness' && 'Cryptographic Audit Ledger'}
                    {activeView === 'officer-signin' && 'Officer Sign In'}
                    {activeView === 'cadre-onboarding' && 'Cadre Registration'}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setActiveView('role-gateways')}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800"
              >
                <span className="material-symbols-outlined text-sm">swap_horiz</span>
                <span>Switch Role Gateway</span>
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Statutory Directive Ticker */}
      <div className="bg-gradient-to-r from-[#17253d] via-[#111f33] to-[#0c1828] border-y border-slate-800/80 px-4 sm:px-6 lg:px-8 2xl:px-12 py-1.5 flex items-center gap-3 text-xs">
        <div className="w-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <span className="flex items-center gap-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-2.5 py-0.5 rounded font-bold text-[10px] shrink-0 tracking-wider shadow-sm">
              <span className="material-symbols-outlined text-[12px] text-amber-200 animate-pulse">notifications_active</span>
              <span>DGMS CIRCULAR</span>
            </span>
            <span className="font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.2 rounded text-[11px] shrink-0">
              No. 04/2024:
            </span>
            <span className="truncate text-slate-300 text-xs font-medium">
              Mandatory real-time Continuous Gas Monitoring (CH4/CO) sensor integration for all Degree-III gassy seams prior to shift sign-offs under CMR Reg. 153.
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-3 text-[11px] text-slate-300 font-mono shrink-0 pl-4 border-l border-slate-700">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>GRID: 100% OPERATIONAL</span>
            </span>
            <span>•</span>
            <span className="text-cyan-400 font-semibold">PKI v3.2 ONLINE</span>
          </div>
        </div>
      </div>
    </header>
  );
};
