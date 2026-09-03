import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Building2, 
  MapPin, 
  UserCheck, 
  Languages, 
  Sparkles, 
  AlertTriangle,
  Radio,
  FileCheck2,
  LogIn,
  LogOut,
  ShieldCheck,
  ChevronDown,
  User as UserIcon,
  CheckCircle2,
  HardHat
} from 'lucide-react';
import { SubsidiaryCode, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange?: (role: UserRole) => void;
  onSelectRole?: (role: UserRole) => void;
  selectedSubsidiary: SubsidiaryCode;
  onSubsidiaryChange?: (sub: SubsidiaryCode) => void;
  onSelectSubsidiary?: (sub: SubsidiaryCode) => void;
  selectedMineId?: string;
  onSelectMineId?: (id: string) => void;
  mines?: Array<{ id: string; name: string; subsidiary: SubsidiaryCode; code: string }>;
  currentLanguage: 'en' | 'hi' | 'bn';
  onLanguageChange?: (lang: 'en' | 'hi' | 'bn') => void;
  onSelectLanguage?: (lang: 'en' | 'hi' | 'bn') => void;
  onOpenCopilot?: () => void;
  onOpenAICopilot?: () => void;
  onOpenEmergencyBlast?: () => void;
  onOpenReportModal?: () => void;
  onOpenWorkspaceDispatch?: () => void;
  onOpenAuthModal?: () => void;
  emergencyLockdownActive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  selectedSubsidiary,
  onSubsidiaryChange,
  onSelectSubsidiary,
  selectedMineId = 'ALL',
  onSelectMineId,
  mines = [],
  currentRole,
  onRoleChange,
  onSelectRole,
  currentLanguage,
  onLanguageChange,
  onSelectLanguage,
  onOpenCopilot,
  onOpenAICopilot,
  onOpenEmergencyBlast,
  onOpenReportModal,
  onOpenWorkspaceDispatch,
  onOpenAuthModal,
  emergencyLockdownActive = false,
}) => {
  const { user, profile, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSubsidiaryChange = onSelectSubsidiary || onSubsidiaryChange || (() => {});
  const handleRoleChange = onSelectRole || onRoleChange || (() => {});
  const handleLanguageChange = onSelectLanguage || onLanguageChange || (() => {});
  const handleCopilotOpen = onOpenAICopilot || onOpenCopilot || (() => {});
  const safeMines = Array.isArray(mines) ? mines : [];

  const filteredMines = selectedSubsidiary === 'CIL_HQ' 
    ? safeMines 
    : safeMines.filter(m => m.subsidiary === selectedSubsidiary);

  return (
    <header className="sticky top-0 z-40 bg-[#12151A] border-b border-white/10 text-slate-200 px-4 lg:px-6 py-3">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 max-w-7xl mx-auto w-full">
        {/* Brand & Emblems */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center shrink-0 bg-white rounded-full p-1 shadow-md shadow-amber-500/20">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
              alt="Emblem of India" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white uppercase">
                MineSync <span className="text-amber-500">AI</span>
              </h1>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-green-500/10 rounded-full border border-green-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">
                  {user || profile ? 'DGMS AUTH ACTIVE' : 'All Sites Online'}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Coal India & DGMS Statutory Governance Portal
            </p>
          </div>
        </div>

        {/* Global Controls & Switchers */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Subsidiary Selector */}
          <div className="flex items-center gap-1.5 bg-[#161B22] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs">
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <select
              id="subsidiary-select"
              aria-label="Filter by Subsidiary"
              value={selectedSubsidiary}
              onChange={(e) => handleSubsidiaryChange(e.target.value as SubsidiaryCode)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer text-xs"
            >
              <option value="CIL_HQ" className="bg-[#12151A] text-slate-200">All Subsidiaries (CIL Pan-India)</option>
              <option value="BCCL" className="bg-[#12151A] text-slate-200">BCCL (Bharat Coking Coal)</option>
              <option value="ECL" className="bg-[#12151A] text-slate-200">ECL (Eastern Coalfields)</option>
              <option value="CCL" className="bg-[#12151A] text-slate-200">CCL (Central Coalfields)</option>
              <option value="WCL" className="bg-[#12151A] text-slate-200">WCL (Western Coalfields)</option>
              <option value="SECL" className="bg-[#12151A] text-slate-200">SECL (South Eastern Coalfields)</option>
              <option value="MCL" className="bg-[#12151A] text-slate-200">MCL (Mahanadi Coalfields)</option>
              <option value="NCL" className="bg-[#12151A] text-slate-200">NCL (Northern Coalfields)</option>
            </select>
          </div>

          {/* Mine Site Selector */}
          <div className="flex items-center gap-1.5 bg-[#161B22] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs">
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
            <select
              id="mine-site-select"
              aria-label="Filter by Mine Site"
              value={selectedMineId}
              onChange={(e) => onSelectMineId && onSelectMineId(e.target.value)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer max-w-[150px] truncate text-xs"
            >
              <option value="ALL" className="bg-[#12151A] text-slate-200">All Mines ({filteredMines.length})</option>
              {filteredMines.map((m) => (
                <option key={m.id} value={m.id} className="bg-[#12151A] text-slate-200">
                  {m.name} ({m.subsidiary})
                </option>
              ))}
            </select>
          </div>

          {/* Role Persona Switcher */}
          <div className="flex items-center gap-1.5 bg-[#161B22] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <select
              id="user-role-select"
              aria-label="Switch User Persona Role"
              value={currentRole}
              onChange={(e) => handleRoleChange(e.target.value as UserRole)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer text-xs"
            >
              <option value="DGMS_INSPECTOR" className="bg-[#12151A] text-rose-300">DGMS Regulatory Inspector</option>
              <option value="CIL_EXECUTIVE" className="bg-[#12151A] text-purple-300">CIL Corporate Admin</option>
              <option value="MINE_MANAGER" className="bg-[#12151A] text-amber-300">Colliery Agent / Project Officer</option>
              <option value="SAFETY_OFFICER" className="bg-[#12151A] text-emerald-300">Mine Safety Officer</option>
              <option value="ENVIRONMENT_OFFICER" className="bg-[#12151A] text-teal-300">Environmental Officer</option>
              <option value="MINING_SIRDAR" className="bg-[#12151A] text-blue-300">Mining Sirdar (Mobile Field)</option>
            </select>
          </div>

          {/* Multilingual Switcher */}
          <div className="flex items-center gap-1 bg-[#161B22] border border-white/10 rounded-xl p-1 text-xs">
            <Languages className="w-3.5 h-3.5 text-slate-400 ml-1" />
            <button
              id="lang-btn-en"
              onClick={() => handleLanguageChange('en')}
              className={`px-1.5 py-0.5 rounded-lg text-[10px] font-bold uppercase transition-colors ${
                currentLanguage === 'en' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              EN
            </button>
            <button
              id="lang-btn-hi"
              onClick={() => handleLanguageChange('hi')}
              className={`px-1.5 py-0.5 rounded-lg text-[10px] font-bold uppercase transition-colors ${
                currentLanguage === 'hi' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              हिन्दी
            </button>
            <button
              id="lang-btn-bn"
              onClick={() => handleLanguageChange('bn')}
              className={`px-1.5 py-0.5 rounded-lg text-[10px] font-bold uppercase transition-colors ${
                currentLanguage === 'bn' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              বাংলা
            </button>
          </div>

          {/* Workspace Dispatch Trigger (Gmail & Google Chat) */}
          <button
            id="btn-open-workspace-dispatch"
            onClick={onOpenWorkspaceDispatch}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#161B22] hover:bg-[#1f2630] border border-amber-500/30 text-amber-300 font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            <span>Workspace Dispatch</span>
          </button>

          {/* AI Copilot Trigger */}
          <button
            id="btn-open-ai-copilot"
            onClick={handleCopilotOpen}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Copilot</span>
          </button>

          {/* Blasting Emergency Lockout Trigger */}
          <button
            id="btn-emergency-blast-lockout"
            onClick={onOpenEmergencyBlast}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
              emergencyLockdownActive
                ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/50 animate-pulse'
                : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{emergencyLockdownActive ? 'BLAST LOCKOUT' : 'Blast Protocol'}</span>
          </button>

          {/* ========================================================================= */}
          {/* FIREBASE AUTHENTICATION OFFICER PROFILE & ACCESS GATE BUTTON             */}
          {/* ========================================================================= */}
          {profile || user ? (
            <div className="relative">
              <button
                id="btn-user-profile-menu"
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/15 via-slate-900 to-amber-500/15 hover:border-emerald-400 border border-emerald-500/30 text-slate-200 text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-[10px] font-black">
                  {profile?.displayName ? profile.displayName.charAt(0).toUpperCase() : 'O'}
                </div>
                <div className="text-left hidden sm:block max-w-[120px] truncate">
                  <div className="text-[11px] font-bold text-slate-100 truncate">
                    {profile?.displayName || 'Officer'}
                  </div>
                  <div className="text-[9px] text-emerald-400 font-mono truncate">
                    {profile?.badgeNumber || 'AUTH'}
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Popover Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[#0F1318] border border-amber-500/30 rounded-2xl shadow-2xl p-3 space-y-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 text-xs">
                  <div className="border-b border-white/10 pb-2.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                        {profile?.role?.replace(/_/g, ' ')}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Authenticated</span>
                      </span>
                    </div>

                    <div className="font-extrabold text-sm text-slate-100">
                      {profile?.displayName}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {profile?.email}
                    </div>
                    <div className="text-[10.5px] text-slate-300 font-medium">
                      {profile?.designation}
                    </div>
                  </div>

                  <div className="space-y-1 text-[11px]">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Assigned Colliery:</span>
                      <span className="font-semibold text-slate-200 text-right truncate max-w-[140px]">{profile?.mineAssigned}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Subsidiary:</span>
                      <span className="font-semibold text-slate-200">{profile?.subsidiary}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>DGMS Token/UID:</span>
                      <span className="font-mono text-emerald-400 text-[10px]">{profile?.uid ? profile.uid.slice(0, 12) + '...' : 'LOCAL'}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        if (onOpenAuthModal) onOpenAuthModal();
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      Switch Persona
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        setIsUserMenuOpen(false);
                        await logout();
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 text-[11px] font-bold border border-rose-500/20 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              id="btn-open-auth-modal"
              type="button"
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-extrabold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Officer Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
