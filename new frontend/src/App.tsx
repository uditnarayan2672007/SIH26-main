import React from 'react';
import { ActiveView, DashboardTab } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { NavigationSubBar } from './components/NavigationSubBar';
import { RoleGatewaysView } from './components/RoleGatewaysView';
import { OfficerDashboardView } from './components/OfficerDashboardView';
import { NationalCommandView } from './components/NationalCommandView';
import { PortalDirectoryView } from './components/PortalDirectoryView';
import { OfficerSignInView } from './components/OfficerSignInView';
import { CadreOnboardingView } from './components/CadreOnboardingView';
import { StatutoryVaultView } from './components/StatutoryVaultView';
import { MobileInspectorView } from './components/MobileInspectorView';
import { LabourContractorsView } from './components/LabourContractorsView';
import { LabourAiOcrView } from './components/LabourAiOcrView';
import { AuditReadinessView } from './components/AuditReadinessView';
import { CopilotModal } from './components/CopilotModal';
import { BlastProtocolModal } from './components/BlastProtocolModal';
import { DispatchModal } from './components/DispatchModal';

export function App() {
  const [activeView, setActiveView] = React.useState<ActiveView>('national-command');
  const [isDark, setIsDark] = React.useState<boolean>(true);
  const [language, setLanguage] = React.useState<'ENG' | 'HIN'>('ENG');

  // Unified Officer Dashboard Context
  const [currentOfficerName, setCurrentOfficerName] = React.useState<string>('SWADHIN SAHA');
  const [currentDashboardTab, setCurrentDashboardTab] = React.useState<DashboardTab>('overview');

  // Modals
  const [copilotOpen, setCopilotOpen] = React.useState<boolean>(false);
  const [dispatchOpen, setDispatchOpen] = React.useState<boolean>(false);
  const [blastOpen, setBlastOpen] = React.useState<boolean>(false);

  // Synchronize dark theme class with html element
  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleSelectRole = (view: ActiveView, officerName?: string, tab?: DashboardTab) => {
    if (officerName) {
      setCurrentOfficerName(officerName);
    }
    if (tab) {
      setCurrentDashboardTab(tab);
    } else {
      setCurrentDashboardTab('overview');
    }
    setActiveView(view);
  };

  const handleSignInSuccess = (officerName: string) => {
    setCurrentOfficerName(officerName);
    setCurrentDashboardTab('overview');
    setActiveView('officer-dashboard');
    alert(`Welcome back, ${officerName}!\nStatutory session active under Coal Mines Regulations 2017.`);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      isDark ? 'bg-[#070c16] text-slate-100 jaali-lattice-bg' : 'bg-[#f1f5f9] text-slate-800 jaali-lattice-bg'
    }`}>
      {/* Top Main Navigation Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        isDark={isDark}
        setIsDark={setIsDark}
        language={language}
        setLanguage={setLanguage}
        onOpenCopilot={() => setCopilotOpen(true)}
        onOpenDispatch={() => setDispatchOpen(true)}
        onOpenBlast={() => setBlastOpen(true)}
      />

      {/* Sub-bar with colliery selector & operational shift status - hidden on Home page */}
      {activeView !== 'national-command' && (
        <NavigationSubBar
          activeView={activeView}
          setActiveView={setActiveView}
          onOpenCopilot={() => setCopilotOpen(true)}
          onOpenDispatch={() => setDispatchOpen(true)}
          onOpenBlast={() => setBlastOpen(true)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 2xl:px-12 py-6 relative z-10">
        {activeView === 'officer-dashboard' && (
          <OfficerDashboardView
            initialOfficerName={currentOfficerName}
            initialTab={currentDashboardTab}
            setActiveView={setActiveView}
            onOpenCopilot={() => setCopilotOpen(true)}
            onOpenDispatch={() => setDispatchOpen(true)}
            onOpenBlast={() => setBlastOpen(true)}
          />
        )}

        {activeView === 'role-gateways' && (
          <RoleGatewaysView
            onSelectRole={handleSelectRole}
            setActiveView={setActiveView}
          />
        )}

        {activeView === 'national-command' && (
          <NationalCommandView
            setActiveView={setActiveView}
            onOpenCopilot={() => setCopilotOpen(true)}
            onOpenDispatch={() => setDispatchOpen(true)}
            onOpenBlast={() => setBlastOpen(true)}
          />
        )}

        {activeView === 'portal-directory' && (
          <PortalDirectoryView
            setActiveView={setActiveView}
            onOpenCopilot={() => setCopilotOpen(true)}
            onOpenDispatch={() => setDispatchOpen(true)}
            onOpenBlast={() => setBlastOpen(true)}
          />
        )}

        {activeView === 'officer-signin' && (
          <OfficerSignInView
            onSignInSuccess={handleSignInSuccess}
            setActiveView={setActiveView}
          />
        )}

        {activeView === 'cadre-onboarding' && (
          <CadreOnboardingView setActiveView={setActiveView} />
        )}

        {activeView === 'statutory-vault' && (
          <StatutoryVaultView
            setActiveView={setActiveView}
            onOpenCopilot={() => setCopilotOpen(true)}
            onOpenDispatch={() => setDispatchOpen(true)}
            onOpenBlast={() => setBlastOpen(true)}
            officerName={currentOfficerName}
          />
        )}

        {activeView === 'mobile-inspector' && (
          <MobileInspectorView
            setActiveView={setActiveView}
            officerName={currentOfficerName}
          />
        )}

        {activeView === 'labour-contractors' && (
          <LabourContractorsView
            setActiveView={setActiveView}
            onOpenCopilot={() => setCopilotOpen(true)}
            officerName={currentOfficerName}
          />
        )}

        {activeView === 'labour-ai-ocr' && (
          <LabourAiOcrView
            setActiveView={setActiveView}
            onOpenCopilot={() => setCopilotOpen(true)}
          />
        )}

        {activeView === 'audit-readiness' && (
          <AuditReadinessView setActiveView={setActiveView} />
        )}
      </main>

      {/* Sovereign National Footer */}
      <Footer />

      {/* Floating Action Button for DGMS AI Statutory Copilot - hidden on Home page */}
      {activeView !== 'national-command' && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            id="floating-copilot-fab"
            onClick={() => setCopilotOpen(true)}
            className="bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 p-3.5 rounded-full shadow-[0_4px_24px_rgba(245,158,11,0.5)] border border-amber-300 flex items-center gap-2 font-bold text-xs hover:scale-105 transition-transform cursor-pointer"
            title="Open DGMS AI Statutory Copilot"
          >
            <span className="material-symbols-outlined text-2xl animate-spin" style={{ animationDuration: '6s' }}>auto_awesome</span>
            <span className="hidden sm:inline font-mono font-extrabold pr-1">DGMS AI COPILOT</span>
          </button>
        </div>
      )}

      {/* Operational Dialog Modals */}
      <CopilotModal
        isOpen={copilotOpen}
        onClose={() => setCopilotOpen(false)}
      />

      <BlastProtocolModal
        isOpen={blastOpen}
        onClose={() => setBlastOpen(false)}
      />

      <DispatchModal
        isOpen={dispatchOpen}
        onClose={() => setDispatchOpen(false)}
      />
    </div>
  );
}

export default App;
