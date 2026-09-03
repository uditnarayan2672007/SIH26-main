import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { ExecutiveOverview } from './components/ExecutiveOverview';
import { GISMapExplorer } from './components/GISMapExplorer';
import { StatutoryComplianceVault } from './components/StatutoryComplianceVault';
import { InspectionCAPAHub } from './components/InspectionCAPAHub';
import { MobileFieldInspector } from './components/MobileFieldInspector';
import { ContractorLabourHub } from './components/ContractorLabourHub';
import { AIIntelligenceCenter } from './components/AIIntelligenceCenter';
import { DigitalAuditLedger } from './components/DigitalAuditLedger';
import { MiningCopilotModal } from './components/MiningCopilotModal';
import { NewComplianceModal } from './components/CreateModals';
import { StatutoryReportModal } from './components/StatutoryReportModal';
import { WorkspaceDispatchModal } from './components/WorkspaceDispatchModal';
import { AuthGatewayModal } from './components/AuthGatewayModal';
import { AuthProvider, useAuth } from './context/AuthContext';

import { 
  mockMines, 
  mockComplianceItems, 
  mockInspections, 
  mockSensors, 
  mockContractors, 
  mockAuditTrail 
} from './data/mockData';

import { 
  AppTab, 
  UserRole, 
  SubsidiaryCode, 
  MineSite, 
  StatutoryComplianceItem, 
  FieldInspection, 
  IoTSensorNode, 
  ContractorCompliance, 
  AuditTrailBlock,
  CAPAStatus,
  PredictiveRiskAnalysis
} from './types';
import { ShieldCheck, HardHat, LogIn, Sparkles, AlertCircle } from 'lucide-react';

function MineSyncDashboard() {
  const { user, profile, loading: authLoading } = useAuth();

  // State
  const [activeTab, setActiveTab] = useState<AppTab>('OVERVIEW');
  const [currentRole, setCurrentRole] = useState<UserRole>('DGMS_INSPECTOR');
  const [selectedSubsidiary, setSelectedSubsidiary] = useState<SubsidiaryCode>('CIL_HQ');
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'hi' | 'bn'>('en');

  // Sync role and subsidiary with authenticated officer profile when loaded
  useEffect(() => {
    if (profile) {
      if (profile.role) setCurrentRole(profile.role);
      if (profile.subsidiary) setSelectedSubsidiary(profile.subsidiary);
    }
  }, [profile]);

  // Domain Data State
  const [mines, setMines] = useState<MineSite[]>(mockMines);
  const [complianceItems, setComplianceItems] = useState<StatutoryComplianceItem[]>(mockComplianceItems);
  const [inspections, setInspections] = useState<FieldInspection[]>(mockInspections);
  const [sensors, setSensors] = useState<IoTSensorNode[]>(mockSensors);
  const [contractors, setContractors] = useState<ContractorCompliance[]>(mockContractors);
  const [auditTrail, setAuditTrail] = useState<AuditTrailBlock[]>(mockAuditTrail);

  // Selected Mine Focus (defaults to first mine)
  const [selectedMineId, setSelectedMineId] = useState<string>(mockMines[0].id);
  const selectedMine = mines.find(m => m.id === selectedMineId) || mines[0];

  // Modals & Triggers
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [copilotInitialQuery, setCopilotInitialQuery] = useState('');
  const [isNewComplianceModalOpen, setIsNewComplianceModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [workspaceChannel, setWorkspaceChannel] = useState<'GMAIL' | 'GOOGLE_CHAT'>('GMAIL');
  const [workspaceSubject, setWorkspaceSubject] = useState('');
  const [workspaceBody, setWorkspaceBody] = useState('');
  const [blastLockoutActive, setBlastLockoutActive] = useState(false);
  
  // Auth Modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user && !profile) {
      setIsAuthModalOpen(true);
    }
  }, [authLoading, user, profile]);

  // Sync audit trail with server on mount or when changes occur
  useEffect(() => {
    fetch('/api/audit-trail')
      .then(res => res.json())
      .then(data => {
        if (data.blocks && Array.isArray(data.blocks)) {
          setAuditTrail(data.blocks);
        }
      })
      .catch(err => console.error('Ledger fetch fallback to mock', err));
  }, []);

  // Handlers
  const handleAskCopilot = (query: string) => {
    setCopilotInitialQuery(query);
    setIsCopilotOpen(true);
  };

  const handleUpdateCAPAStatus = (inspectionId: string, newStatus: CAPAStatus, notes?: string) => {
    setInspections(prev => prev.map(insp => {
      if (insp.id === inspectionId) {
        return { ...insp, capaStatus: newStatus };
      }
      return insp;
    }));

    // Post to audit ledger with authenticated officer attribution
    const actionDesc = `Updated CAPA Status to ${newStatus} for inspection ${inspectionId}`;
    fetch('/api/audit-trail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'STATUTORY_CAPA_UPDATE',
        entityType: 'FieldInspection',
        entityId: inspectionId,
        performedBy: profile?.displayName || (currentRole === 'DGMS_INSPECTOR' ? 'Director General of Mines Safety (DGMS)' : 'Mine Safety Officer'),
        performedRole: profile?.role || currentRole,
        payload: { 
          inspectionId, 
          newStatus, 
          notes, 
          officerUid: profile?.uid || user?.uid || 'STATUTORY_AUTH',
          timestamp: new Date().toISOString() 
        }
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.block) setAuditTrail(prev => [...prev, data.block]);
    })
    .catch(console.error);
  };

  const handleSaveFieldObservation = (newInsp: FieldInspection) => {
    setInspections(prev => [newInsp, ...prev]);

    // Record on audit trail with authenticated officer attribution
    fetch('/api/audit-trail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'GEO_TAGGED_FIELD_OBSERVATION',
        entityType: 'FieldInspection',
        entityId: newInsp.id,
        performedBy: newInsp.inspectorName || profile?.displayName || 'Field Officer',
        performedRole: newInsp.inspectorRole || profile?.role || currentRole,
        payload: {
          ...newInsp,
          authenticatedUid: profile?.uid || user?.uid || 'GUEST_INSPECTOR'
        }
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.block) setAuditTrail(prev => [...prev, data.block]);
    })
    .catch(console.error);
  };

  const handleTriggerSensorAlarm = (sensorId: string) => {
    setSensors(prev => prev.map(s => {
      if (s.id === sensorId) {
        const nextStatus = s.status === 'CRITICAL_ALARM' ? 'NORMAL' : 'CRITICAL_ALARM';
        const nextVal = nextStatus === 'CRITICAL_ALARM' ? (s.criticalThreshold * 1.15).toFixed(2) : s.normalRange[1];
        return {
          ...s,
          status: nextStatus,
          currentValue: Number(nextVal)
        };
      }
      return s;
    }));
  };

  const handleInitiateBlastLockout = () => {
    const nextState = !blastLockoutActive;
    setBlastLockoutActive(nextState);

    // Audit log
    fetch('/api/audit-trail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: nextState ? 'BLAST_LOCKOUT_INITIATED' : 'BLAST_LOCKOUT_CLEARED',
        entityType: 'GeoPerimeter500m',
        entityId: selectedMine.code,
        performedBy: profile?.displayName || 'Blasting Officer & Sirdar',
        performedRole: profile?.role || 'MINE_MANAGER',
        payload: { 
          mineId: selectedMine.id, 
          radiusMeters: 500, 
          active: nextState,
          authorizedUid: profile?.uid || user?.uid || 'STATUTORY_AGENT'
        }
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.block) setAuditTrail(prev => [...prev, data.block]);
    })
    .catch(console.error);
  };

  const handleIssuePenalty = (contractorId: string, points: number, reason: string) => {
    setContractors(prev => prev.map(c => {
      if (c.id === contractorId) {
        return { ...c, safetyPenaltyPoints: c.safetyPenaltyPoints + points };
      }
      return c;
    }));
  };

  const handleAddCompliance = (item: StatutoryComplianceItem) => {
    setComplianceItems(prev => [item, ...prev]);
  };

  const handleTriggerAIRiskAudit = async (): Promise<PredictiveRiskAnalysis | null> => {
    try {
      const response = await fetch('/api/ai/risk-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mineId: selectedMine.id,
          subsidiary: selectedMine.subsidiary,
          sensors,
          inspections: inspections.filter(i => i.mineId === selectedMine.id || selectedSubsidiary === 'CIL_HQ'),
          language: currentLanguage
        })
      });
      const data = await response.json();
      return data;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const handleVerifyChain = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/audit-trail/verify');
      const data = await response.json();
      return !!data.isValid;
    } catch (e) {
      return true;
    }
  };

  // Compute counts for navigation badges
  const openCapasCount = inspections.filter(i => i.capaStatus === 'OPEN').length;
  const criticalSensorsCount = sensors.filter(s => s.status === 'CRITICAL_ALARM').length;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0D0F12] text-slate-200 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white p-1.5 shadow-lg shadow-amber-500/20 animate-pulse">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
              alt="Emblem of India" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-amber-400">Securing access</div>
            <h2 className="mt-2 text-xl font-bold text-white">Verifying statutory credentials</h2>
          </div>
        </div>
      </div>
    );
  }

  if (!user && !profile) {
    return (
      <div className="min-h-screen bg-[#0D0F12] text-slate-200 flex items-center justify-center px-4">
        <div className="w-full max-w-xl rounded-3xl border border-amber-500/30 bg-[#111827] p-8 shadow-2xl shadow-amber-500/10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white p-1.5 shadow-lg shadow-amber-500/20">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
              alt="Emblem of India" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-white">Portal access denied</h1>
          <p className="mt-3 text-sm text-slate-300">
            This portal is restricted to authorised CIL, DGMS and mine governance personnel. Sign in with your verified credentials to continue.
          </p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-400"
          >
            <LogIn className="w-4 h-4" />
            Authenticate to continue
          </button>
          <AuthGatewayModal isOpen={isAuthModalOpen} isMandatoryGate onClose={() => setIsAuthModalOpen(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0F12] text-slate-200 flex flex-col selection:bg-amber-500 selection:text-slate-950 font-sans">
      {/* Top Universal Statutory Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onSelectRole={setCurrentRole}
        selectedSubsidiary={selectedSubsidiary}
        onSubsidiaryChange={setSelectedSubsidiary}
        onSelectSubsidiary={setSelectedSubsidiary}
        selectedMineId={selectedMineId}
        onSelectMineId={setSelectedMineId}
        mines={mines}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        onSelectLanguage={setCurrentLanguage}
        onOpenCopilot={() => {
          setCopilotInitialQuery('');
          setIsCopilotOpen(true);
        }}
        onOpenAICopilot={() => {
          setCopilotInitialQuery('');
          setIsCopilotOpen(true);
        }}
        onOpenEmergencyBlast={handleInitiateBlastLockout}
        emergencyLockdownActive={blastLockoutActive}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenWorkspaceDispatch={() => {
          setWorkspaceChannel('GMAIL');
          setWorkspaceSubject(`DGMS STATUTORY DISPATCH: ${selectedMine.name} Operations Notice`);
          setWorkspaceBody(`ATTN: DGMS Inspectorate & ${selectedMine.subsidiary} Safety Officers\n\nStatutory report submitted for ${selectedMine.name} (${selectedMine.code}).\nAll safety systems and gas monitors within statutory parameters.\nTimestamp: ${new Date().toLocaleString()}`);
          setIsWorkspaceModalOpen(true);
        }}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Statutory Security Banner (if guest / non-authenticated) */}
      {!profile && !user && (
        <div className="bg-gradient-to-r from-amber-500/10 via-indigo-950/20 to-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>
                <strong>Statutory Access Gate:</strong> Authenticate as a <strong>Field Inspector</strong> or <strong>Mine Manager</strong> with Firebase Auth to submit signed inspections and access sensitive DGMS compliance records.
              </span>
            </div>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Officer Sign In / Switch Role</span>
            </button>
          </div>
        </div>
      )}

      {/* Navigation Sub-Header Bar */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        openCapasCount={openCapasCount}
        criticalSensorsCount={criticalSensorsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-6">
        {activeTab === 'OVERVIEW' && (
          <ExecutiveOverview
            mines={mines}
            complianceItems={complianceItems}
            inspections={inspections}
            sensors={sensors}
            selectedSubsidiary={selectedSubsidiary}
            onSelectMine={(mineId) => {
              setSelectedMineId(mineId);
              setActiveTab('GIS_MAP');
            }}
            onNavigateToTab={setActiveTab}
            onTriggerAIRiskAudit={() => {
              setActiveTab('AI_INTELLIGENCE');
            }}
            onGenerateReport={() => setIsReportModalOpen(true)}
          />
        )}

        {activeTab === 'GIS_MAP' && (
          <GISMapExplorer
            mines={mines}
            sensors={sensors}
            selectedMine={selectedMine}
            inspections={inspections}
            onTriggerSensorAlarm={handleTriggerSensorAlarm}
            onInitiateBlastLockout={handleInitiateBlastLockout}
            blastLockoutActive={blastLockoutActive}
            onOpenNewInspection={() => setActiveTab('MOBILE_INSPECTOR')}
          />
        )}

        {activeTab === 'STATUTORY_VAULT' && (
          <StatutoryComplianceVault
            complianceItems={complianceItems}
            selectedSubsidiary={selectedSubsidiary}
            onOpenNewComplianceModal={() => setIsNewComplianceModalOpen(true)}
            onAskCopilot={handleAskCopilot}
          />
        )}

        {activeTab === 'INSPECTION_CAPA' && (
          <InspectionCAPAHub
            inspections={inspections}
            onUpdateCAPAStatus={handleUpdateCAPAStatus}
            onOpenNewInspection={() => setActiveTab('MOBILE_INSPECTOR')}
            onAskCopilot={handleAskCopilot}
            currentRole={currentRole}
          />
        )}

        {activeTab === 'MOBILE_INSPECTOR' && (
          <MobileFieldInspector
            currentMine={selectedMine}
            onSaveFieldObservation={handleSaveFieldObservation}
            onAskCopilot={handleAskCopilot}
            currentLanguage={currentLanguage}
          />
        )}

        {activeTab === 'CONTRACTOR_LABOUR' && (
          <ContractorLabourHub
            contractors={contractors}
            onIssuePenaltyNotice={handleIssuePenalty}
          />
        )}

        {activeTab === 'AI_INTELLIGENCE' && (
          <AIIntelligenceCenter
            currentMine={selectedMine}
            sensors={sensors}
            inspections={inspections}
            onTriggerAIRiskAudit={handleTriggerAIRiskAudit}
          />
        )}

        {activeTab === 'AUDIT_LEDGER' && (
          <DigitalAuditLedger
            auditTrail={auditTrail}
            onVerifyChain={handleVerifyChain}
          />
        )}
      </main>

      {/* Floating AI Statutory Assistant Bubble */}
      <button
        id="floating-ai-copilot-btn"
        onClick={() => {
          setCopilotInitialQuery('');
          setIsCopilotOpen(true);
        }}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-2xl shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2 font-bold text-xs"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-slate-950 animate-ping" />
        <span>Ask AI Statutory Copilot</span>
      </button>

      {/* Mining Statutory AI Copilot Modal */}
      <MiningCopilotModal
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        initialQuery={copilotInitialQuery}
        selectedSubsidiary={selectedSubsidiary}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
      />

      {/* New Statutory Obligation Modal */}
      <NewComplianceModal
        isOpen={isNewComplianceModalOpen}
        onClose={() => setIsNewComplianceModalOpen(false)}
        mines={mines}
        onAddCompliance={handleAddCompliance}
      />

      {/* Statutory Report / PDF Return Modal */}
      <StatutoryReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        selectedMine={selectedMine}
        complianceItems={complianceItems}
        inspections={inspections}
        selectedSubsidiary={selectedSubsidiary}
      />

      {/* Google Workspace (Gmail / Chat) & Firebase Dispatch Modal */}
      <WorkspaceDispatchModal
        isOpen={isWorkspaceModalOpen}
        onClose={() => setIsWorkspaceModalOpen(false)}
        defaultChannel={workspaceChannel}
        prefilledSubject={workspaceSubject}
        prefilledBody={workspaceBody}
      />

      {/* Firebase Authentication Gateway & Officer Login Modal */}
      <AuthGatewayModal
        isOpen={isAuthModalOpen}
        isMandatoryGate={!user && !profile}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MineSyncDashboard />
    </AuthProvider>
  );
}
