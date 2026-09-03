import React from 'react';
import { 
  LayoutDashboard, 
  Map, 
  Scale, 
  ClipboardCheck, 
  Smartphone, 
  Users, 
  BrainCircuit, 
  ShieldCheck
} from 'lucide-react';
import { AppTab } from '../types';

export type NavTab = AppTab;

interface NavigationProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  openCapasCount: number;
  criticalSensorsCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  openCapasCount,
  criticalSensorsCount,
}) => {
  const tabs = [
    {
      id: 'OVERVIEW' as AppTab,
      label: 'Overview Grid',
      icon: LayoutDashboard,
      badge: undefined
    },
    {
      id: 'GIS_MAP' as AppTab,
      label: 'GIS Spatial Radar',
      icon: Map,
      badge: criticalSensorsCount > 0 ? `${criticalSensorsCount} Alert` : undefined,
      badgeColor: 'bg-red-500/20 text-red-400 border border-red-500/30'
    },
    {
      id: 'STATUTORY_VAULT' as AppTab,
      label: 'Statutory Vault',
      icon: Scale,
      badge: undefined
    },
    {
      id: 'INSPECTION_CAPA' as AppTab,
      label: 'Inspections & CAPA',
      icon: ClipboardCheck,
      badge: openCapasCount > 0 ? `${openCapasCount} Open` : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
    },
    {
      id: 'MOBILE_INSPECTOR' as AppTab,
      label: 'Mobile Inspector',
      icon: Smartphone,
      badge: 'Live GPS'
    },
    {
      id: 'CONTRACTOR_LABOUR' as AppTab,
      label: 'Labour & Contractors',
      icon: Users,
      badge: undefined
    },
    {
      id: 'AI_INTELLIGENCE' as AppTab,
      label: 'AI Intelligence & OCR',
      icon: BrainCircuit,
      badge: 'Gemini 3.7'
    },
    {
      id: 'AUDIT_LEDGER' as AppTab,
      label: 'Audit Trail',
      icon: ShieldCheck,
      badge: 'SHA-256'
    }
  ];

  return (
    <nav className="bg-[#0D0F12] border-b border-white/10 px-4 lg:px-6 overflow-x-auto scrollbar-none">
      <div className="flex items-center gap-1.5 min-w-max py-2.5 max-w-7xl mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id.toLowerCase().replace(/_/g, '-')}`}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                isActive
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    tab.badgeColor || (isActive ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-white/5 text-slate-300 border border-white/10')
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
