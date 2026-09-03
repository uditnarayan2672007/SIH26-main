import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  KeyRound, 
  UserCheck, 
  Building2, 
  MapPin, 
  BadgeCheck, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Radio, 
  HardHat, 
  X,
  RefreshCw,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEFAULT_DEMO_PERSONAS } from '../lib/firebase';
import { UserRole, SubsidiaryCode } from '../types';

interface AuthGatewayModalProps {
  isOpen: boolean;
  onClose?: () => void;
  isMandatoryGate?: boolean;
}

export const AuthGatewayModal: React.FC<AuthGatewayModalProps> = ({
  isOpen,
  onClose,
  isMandatoryGate = false
}) => {
  const { 
    user, 
    profile, 
    loginEmail, 
    registerEmail, 
    loginGoogle, 
    loginPersona, 
    resetPassword,
    error,
    setError,
    loading 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'PERSONAS' | 'LOGIN' | 'REGISTER' | 'FORGOT'>('PERSONAS');
  
  // Login fields
  const [loginEmailInput, setLoginEmailInput] = useState('');
  const [loginPasswordInput, setLoginPasswordInput] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regRole, setRegRole] = useState<UserRole>('MINING_SIRDAR');
  const [regDesignation, setRegDesignation] = useState('Mining Sirdar / Field Inspector');
  const [regMine, setRegMine] = useState('Jharia Opencast Project Block-II');
  const [regSubsidiary, setRegSubsidiary] = useState<SubsidiaryCode>('BCCL');
  const [regBadge, setRegBadge] = useState('DGMS-SIRDAR-2026');

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Status message
  const [localSuccessMsg, setLocalSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePersonaSelect = async (personaId: string) => {
    setError(null);
    setLocalSuccessMsg(null);
    try {
      await loginPersona(personaId);
      setLocalSuccessMsg('Authenticated successfully! Initializing statutory dashboard session...');
      setTimeout(() => {
        if (onClose) onClose();
      }, 500);
    } catch (err: any) {
      // Handled in context
    }
  };

  const handleEmailLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLocalSuccessMsg(null);
    try {
      await loginEmail(loginEmailInput, loginPasswordInput);
      setLocalSuccessMsg('Login authenticated! Welcome to MineSync.');
      setTimeout(() => {
        if (onClose) onClose();
      }, 500);
    } catch (err: any) {
      // Handled in context
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLocalSuccessMsg(null);
    try {
      await registerEmail(
        regEmail,
        regPassword,
        regName,
        regRole,
        regDesignation,
        regMine,
        regSubsidiary,
        regBadge
      );
      setLocalSuccessMsg('Account registered & authenticated successfully in DGMS Cloud database!');
      setTimeout(() => {
        if (onClose) onClose();
      }, 600);
    } catch (err: any) {
      // Handled in context
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLocalSuccessMsg(null);
    try {
      await loginGoogle();
      setLocalSuccessMsg('Google Workspace sign-in successful!');
      setTimeout(() => {
        if (onClose) onClose();
      }, 500);
    } catch (err: any) {
      // Handled in context
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setForgotSuccess(false);
    try {
      await resetPassword(forgotEmail);
      setForgotSuccess(true);
    } catch (err: any) {
      // Handled in context
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0F1318] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-amber-500/20 via-slate-900 to-indigo-950/40 p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center shrink-0 bg-white rounded-full p-1 shadow-lg shadow-amber-500/20">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
                alt="Emblem of India" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white tracking-wide uppercase">
                  MineSync <span className="text-amber-400">DGMS Security Gate</span>
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  CMR 2017 STATUTORY
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Coal Mine Governance & Real-Time Statutory Field Compliance Authentication
              </p>
            </div>
          </div>

          {!isMandatoryGate && onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/10 bg-[#090C0F] text-xs font-semibold px-4 pt-2 gap-2 overflow-x-auto">
          <button
            onClick={() => { setActiveTab('PERSONAS'); setError(null); }}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'PERSONAS' 
                ? 'border-amber-400 text-amber-300 font-bold' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HardHat className="w-3.5 h-3.5" />
            <span>Quick Statutory Roles</span>
          </button>

          <button
            onClick={() => { setActiveTab('LOGIN'); setError(null); }}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'LOGIN' 
                ? 'border-amber-400 text-amber-300 font-bold' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Email Sign In</span>
          </button>

          <button
            onClick={() => { setActiveTab('REGISTER'); setError(null); }}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'REGISTER' 
                ? 'border-amber-400 text-amber-300 font-bold' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Officer Registration</span>
          </button>

          <button
            onClick={() => { setActiveTab('FORGOT'); setError(null); }}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'FORGOT' 
                ? 'border-amber-400 text-amber-300 font-bold' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Reset Password</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Error Banner */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Banner */}
          {localSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>{localSuccessMsg}</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 1: QUICK STATUTORY ROLES                                              */}
          {/* ========================================================================= */}
          {activeTab === 'PERSONAS' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-300">
                Select your designated statutory authority persona for instant field or colliery governance login:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DEFAULT_DEMO_PERSONAS.map((persona) => {
                  const isSelected = profile?.role === persona.role;
                  return (
                    <button
                      key={persona.id}
                      type="button"
                      disabled={loading}
                      onClick={() => handlePersonaSelect(persona.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative group flex flex-col justify-between ${
                        isSelected 
                          ? 'bg-amber-500/15 border-amber-400 shadow-md shadow-amber-500/10' 
                          : 'bg-[#14181F] hover:bg-[#1A202A] border-white/10 hover:border-amber-500/40'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                            persona.role === 'MINING_SIRDAR' 
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : persona.role === 'MINE_MANAGER'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : persona.role === 'DGMS_INSPECTOR'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {persona.role.replace(/_/g, ' ')}
                          </span>

                          <span className="text-[10px] font-mono text-slate-400">
                            {persona.subsidiary}
                          </span>
                        </div>

                        <div className="font-bold text-xs text-slate-100 group-hover:text-amber-300 transition-colors">
                          {persona.displayName}
                        </div>

                        <div className="text-[11px] text-amber-400/90 font-medium line-clamp-1">
                          {persona.designation}
                        </div>

                        <p className="text-[10.5px] text-slate-400 line-clamp-2 leading-relaxed">
                          {persona.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-mono">{persona.badgeNumber}</span>
                        <span className="text-amber-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                          Authenticate <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Google Workspace Alternative */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleGoogleLogin}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
                    <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8 0-1.3.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"/>
                    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"/>
                  </svg>
                  <span>Sign in with Google Workspace (CIL Official SSO)</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: EMAIL & PASSWORD SIGN IN                                           */}
          {/* ========================================================================= */}
          {activeTab === 'LOGIN' && (
            <form onSubmit={handleEmailLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-semibold block">Official Coal Mine / DGMS Email:</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmailInput}
                    onChange={(e) => setLoginEmailInput(e.target.value)}
                    placeholder="e.g. officer@minesync.gov.in"
                    className="w-full bg-[#14181F] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-slate-300 font-semibold block">Password:</label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('FORGOT')}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-medium cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPasswordInput}
                    onChange={(e) => setLoginPasswordInput(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#14181F] border border-white/10 rounded-xl pl-9 pr-9 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Authenticating Credentials...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Sign In with Password</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={handleGoogleLogin}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Or sign in with Google Workspace</span>
                </button>
              </div>

              <div className="text-center pt-2 text-[11px] text-slate-400">
                New colliery safety officer or inspector?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('REGISTER')}
                  className="text-amber-400 hover:underline font-bold cursor-pointer"
                >
                  Register Profile
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: NEW OFFICER REGISTRATION                                           */}
          {/* ========================================================================= */}
          {activeTab === 'REGISTER' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-300 font-semibold block">Full Name:</label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Rajesh Kumar Sharma"
                    className="w-full bg-[#14181F] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-300 font-semibold block">Official Email:</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="rajesh.sharma@minesync.gov.in"
                    className="w-full bg-[#14181F] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-300 font-semibold block">Statutory Role:</label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full bg-[#14181F] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="MINING_SIRDAR">Mining Sirdar / Field Inspector</option>
                    <option value="MINE_MANAGER">Colliery Safety Manager / Agent</option>
                    <option value="SAFETY_OFFICER">Mine Safety Officer</option>
                    <option value="DGMS_INSPECTOR">DGMS Regulatory Inspector</option>
                    <option value="ENVIRONMENT_OFFICER">Environmental Officer</option>
                    <option value="CIL_EXECUTIVE">CIL Corporate Admin</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-300 font-semibold block">Official Designation:</label>
                  <input
                    type="text"
                    required
                    value={regDesignation}
                    onChange={(e) => setRegDesignation(e.target.value)}
                    placeholder="e.g. Senior Overman Grade-I"
                    className="w-full bg-[#14181F] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-300 font-semibold block">Subsidiary Division:</label>
                  <select
                    value={regSubsidiary}
                    onChange={(e) => setRegSubsidiary(e.target.value as SubsidiaryCode)}
                    className="w-full bg-[#14181F] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="BCCL">BCCL (Bharat Coking Coal)</option>
                    <option value="ECL">ECL (Eastern Coalfields)</option>
                    <option value="CCL">CCL (Central Coalfields)</option>
                    <option value="SECL">SECL (South Eastern Coalfields)</option>
                    <option value="WCL">WCL (Western Coalfields)</option>
                    <option value="MCL">MCL (Mahanadi Coalfields)</option>
                    <option value="NCL">NCL (Northern Coalfields)</option>
                    <option value="CIL_HQ">CIL HQ / Ministry of Coal</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-300 font-semibold block">Assigned Mine Colliery:</label>
                  <input
                    type="text"
                    required
                    value={regMine}
                    onChange={(e) => setRegMine(e.target.value)}
                    placeholder="e.g. Jharia Opencast Project Block-II"
                    className="w-full bg-[#14181F] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-300 font-semibold block">DGMS Cert / Badge Number:</label>
                  <input
                    type="text"
                    value={regBadge}
                    onChange={(e) => setRegBadge(e.target.value)}
                    placeholder="DGMS-INSP-2026"
                    className="w-full bg-[#14181F] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-300 font-semibold block">Account Password (min 6 chars):</label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#14181F] border border-white/10 rounded-xl pl-3 pr-9 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Creating Account & Syncing DGMS Role...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Register Statutory Officer Account</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: PASSWORD RESET                                                     */}
          {/* ========================================================================= */}
          {activeTab === 'FORGOT' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-300 space-y-1">
                <div className="font-bold text-slate-100 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span>Statutory Credential Recovery</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Enter your registered official email address. Firebase Authentication will dispatch a secure password reset link.
                </p>
              </div>

              {forgotSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Password Reset Link Dispatched!</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Please check your inbox at <span className="font-mono text-emerald-300">{forgotEmail}</span> and follow the instructions to set your new security password.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('LOGIN')}
                    className="mt-2 px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs cursor-pointer hover:bg-emerald-400"
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-300 font-semibold block">Registered Email Address:</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="officer@minesync.gov.in"
                        className="w-full bg-[#14181F] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Send Recovery Link</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('LOGIN')}
                      className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer Security Badge */}
        <div className="bg-[#090C0F] px-6 py-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10.5px] text-slate-500 font-mono">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Firebase Auth Encrypted • DGMS Zonal Rule Compliant</span>
          </div>
          <div>Project ID: gen-lang-client-0374067753</div>
        </div>
      </div>
    </div>
  );
};
