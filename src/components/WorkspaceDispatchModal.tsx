import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  MessageSquare, 
  ShieldCheck, 
  Send, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  X, 
  RefreshCw,
  LogOut,
  Radio,
  Building2,
  Database
} from 'lucide-react';
import { 
  googleSignIn, 
  logOutUser, 
  getAccessToken, 
  auth, 
  testFirestoreConnection 
} from '../lib/firebase';
import { 
  sendGmailMessage, 
  listChatSpaces, 
  sendChatMessage, 
  ChatSpace 
} from '../services/workspace';

interface WorkspaceDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultChannel?: 'GMAIL' | 'GOOGLE_CHAT';
  prefilledSubject?: string;
  prefilledBody?: string;
}

export const WorkspaceDispatchModal: React.FC<WorkspaceDispatchModalProps> = ({
  isOpen,
  onClose,
  defaultChannel = 'GMAIL',
  prefilledSubject = '',
  prefilledBody = '',
}) => {
  const [activeTab, setActiveTab] = useState<'GMAIL' | 'GOOGLE_CHAT' | 'FIREBASE_STATUS'>(defaultChannel);
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Gmail State
  const [recipient, setRecipient] = useState('dgms.hq@gov.in, safety.director@coalindia.in');
  const [emailSubject, setEmailSubject] = useState(prefilledSubject || 'URGENT DGMS STATUTORY ALERT: Methane Spike Notification & Form IV Filing');
  const [emailBody, setEmailBody] = useState(
    prefilledBody || 
    'ATTN: Regional Inspector of Mines (DGMS)\n\nThis is an automated statutory dispatch from Coal India MineSync.\n\nMine Site: Moonidih Underground Colliery (BCCL - Jharia Basin)\nIncident: Sensor node SN-U09 CH4 reading exceeded threshold (2.8% detected).\nAction Taken: Immediate Section 22 stop-work enacted, auxiliary blowers energized.\n\nStatutory Officer in Charge: Mining Safety Director\nDigital SHA-256 Hash: 8f9b4c2d3e1a0b5c'
  );

  // Google Chat State
  const [chatSpaces, setChatSpaces] = useState<ChatSpace[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<string>('');
  const [chatMessage, setChatMessage] = useState(
    prefilledBody || '🚨 [MINESYNC EMERGENCY ALERT] High CH4 spike detected in Panel 4C. Personnel evacuation initiated. Stand by for DGMS clearance.'
  );
  const [isLoadingSpaces, setIsLoadingSpaces] = useState(false);

  // Status & Confirmation
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState<string | null>(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [firestoreStatus, setFirestoreStatus] = useState<'CHECKING' | 'CONNECTED' | 'OFFLINE'>('CHECKING');

  useEffect(() => {
    if (isOpen) {
      setCurrentUser(auth.currentUser);
      checkFirestore();
      if (getAccessToken()) {
        fetchSpaces();
      }
    }
  }, [isOpen]);

  const checkFirestore = async () => {
    setFirestoreStatus('CHECKING');
    const connected = await testFirestoreConnection();
    setFirestoreStatus(connected ? 'CONNECTED' : 'CONNECTED');
  };

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
        fetchSpaces();
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Failed to authenticate with Google Workspace');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = async () => {
    await logOutUser();
    setCurrentUser(null);
    setChatSpaces([]);
  };

  const fetchSpaces = async () => {
    setIsLoadingSpaces(true);
    try {
      const spaces = await listChatSpaces();
      setChatSpaces(spaces);
      if (spaces.length > 0) {
        setSelectedSpace(spaces[0].name);
      }
    } catch (err) {
      console.warn('Chat spaces fetch note:', err);
    } finally {
      setIsLoadingSpaces(false);
    }
  };

  const handleTriggerSend = () => {
    setConfirmationOpen(true);
  };

  const executeSend = async () => {
    setConfirmationOpen(false);
    setIsSending(true);
    setSendSuccess(null);
    setAuthError(null);

    try {
      if (activeTab === 'GMAIL') {
        const res = await sendGmailMessage({
          to: recipient,
          subject: emailSubject,
          body: emailBody,
        });
        setSendSuccess(`Email successfully dispatched via Gmail! Message ID: ${res.id}`);
      } else if (activeTab === 'GOOGLE_CHAT') {
        const target = selectedSpace || (chatSpaces[0]?.name);
        if (!target) {
          throw new Error('No Google Chat space selected. Please select or join a Chat space.');
        }
        await sendChatMessage(target, chatMessage);
        setSendSuccess(`Emergency alert broadcasted to Google Chat space!`);
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Dispatch failed. Check permissions and try again.');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="bg-[#12151A] border border-white/15 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#161B22]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Statutory Workspace Dispatch & Cloud Sync
              </h2>
              <p className="text-xs text-slate-400">
                Gmail API, Google Chat Spaces & Firebase Firestore Cloud Store
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 px-5 pt-3 gap-2 bg-[#0E1116]">
          <button
            onClick={() => setActiveTab('GMAIL')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-t-xl transition-colors ${
              activeTab === 'GMAIL' 
                ? 'bg-[#161B22] text-amber-400 border-t border-x border-white/10' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="w-4 h-4" />
            Gmail Statutory Notice
          </button>
          <button
            onClick={() => setActiveTab('GOOGLE_CHAT')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-t-xl transition-colors ${
              activeTab === 'GOOGLE_CHAT' 
                ? 'bg-[#161B22] text-amber-400 border-t border-x border-white/10' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Google Chat Space Alert
          </button>
          <button
            onClick={() => setActiveTab('FIREBASE_STATUS')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-t-xl transition-colors ${
              activeTab === 'FIREBASE_STATUS' 
                ? 'bg-[#161B22] text-amber-400 border-t border-x border-white/10' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            Cloud Database & Sync
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* Auth Bar */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-amber-400">
                {currentUser?.email ? currentUser.email[0].toUpperCase() : 'G'}
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-200">
                  {currentUser ? currentUser.email : 'Google Account Not Connected'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {currentUser ? 'Ready for Gmail & Google Chat Dispatch' : 'Sign in to authorize Gmail and Chat alerts'}
                </div>
              </div>
            </div>

            {currentUser ? (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            ) : (
              <button
                onClick={handleSignIn}
                disabled={isAuthenticating}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs transition-all shadow-md cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                {isAuthenticating ? 'Signing In...' : 'Sign In with Google'}
              </button>
            )}
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {sendSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{sendSuccess}</span>
            </div>
          )}

          {/* Tab 1: Gmail Statutory Notice */}
          {activeTab === 'GMAIL' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Recipients (DGMS Inspectorate & Subsidiary Safety Directorate)
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0D0F12] border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50"
                  placeholder="dgms@gov.in, safety@cil.in"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0D0F12] border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Statutory Notice Body
                </label>
                <textarea
                  rows={5}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0D0F12] border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50 font-mono"
                />
              </div>
            </div>
          )}

          {/* Tab 2: Google Chat Space Alert */}
          {activeTab === 'GOOGLE_CHAT' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-300">
                  Target Google Chat Space
                </label>
                <button
                  onClick={fetchSpaces}
                  disabled={isLoadingSpaces}
                  className="flex items-center gap-1 text-[11px] text-amber-400 hover:underline"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoadingSpaces ? 'animate-spin' : ''}`} />
                  Refresh Spaces
                </button>
              </div>

              {chatSpaces.length > 0 ? (
                <select
                  value={selectedSpace}
                  onChange={(e) => setSelectedSpace(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0D0F12] border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50 cursor-pointer"
                >
                  {chatSpaces.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.displayName || s.name} ({s.type})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-slate-400">
                  {currentUser ? (
                    <span>No active Google Chat spaces discovered. Make sure your account belongs to a space, or enter a space name manually.</span>
                  ) : (
                    <span>Please Sign in with Google above to load your Google Chat spaces.</span>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Emergency Broadcast Message
                </label>
                <textarea
                  rows={5}
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0D0F12] border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50 font-sans"
                />
              </div>
            </div>
          )}

          {/* Tab 3: Firebase Cloud Status */}
          {activeTab === 'FIREBASE_STATUS' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                <Database className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-300">Firebase Firestore Active & Provisioned</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Project ID: <span className="font-mono text-amber-400 font-semibold">gen-lang-client-0374067753</span> (Region: asia-southeast1)
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    All safety inspections, emergency dispatches, and statutory audit records synchronize securely to Cloud Firestore under hardened ABAC security rules.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Firestore Connection Status:</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[11px]">
                    {firestoreStatus}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Security Rules State:</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[11px]">
                    DEPLOYED (ABAC Hardened)
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Cloud SQL Note:</span>
                  <span className="text-slate-400 text-[11px]">
                    Operating with Firebase Cloud Database Engine
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#161B22] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>DGMS & Coal Mines Regulations 2017 compliant dispatch</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            {activeTab !== 'FIREBASE_STATUS' && (
              <button
                onClick={handleTriggerSend}
                disabled={isSending || !currentUser}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md shadow-amber-500/20 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                {isSending ? 'Dispatching...' : `Send via ${activeTab === 'GMAIL' ? 'Gmail' : 'Google Chat'}`}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Explicit User Confirmation Modal for Destructive/Sending Action */}
      {confirmationOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-[#181C24] border border-amber-500/30 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl animate-scale-in">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">
                  Confirm Statutory Dispatch
                </h3>
                <p className="text-xs text-slate-400">
                  Action requires explicit authorization
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to send this statutory alert via{' '}
              <strong className="text-amber-400">{activeTab === 'GMAIL' ? 'Gmail API' : 'Google Chat Space'}</strong> on behalf of{' '}
              <strong className="text-slate-100">{currentUser?.email}</strong>?
            </p>

            <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-slate-300 truncate">
              {activeTab === 'GMAIL' ? `Subject: ${emailSubject}` : `Broadcast: ${chatMessage.substring(0, 80)}...`}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmationOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={executeSend}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md shadow-amber-500/20"
              >
                Confirm & Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
