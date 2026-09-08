export type ActiveView = 
  | 'national-command'
  | 'portal-directory'
  | 'role-gateways'
  | 'officer-dashboard'
  | 'officer-signin'
  | 'cadre-onboarding'
  | 'statutory-vault'
  | 'mobile-inspector'
  | 'labour-contractors'
  | 'labour-ai-ocr'
  | 'audit-readiness';

export type DashboardTab = 
  | 'overview'
  | 'gis-radar'
  | 'statutory-board'
  | 'inspection-capa'
  | 'mobile-inspector'
  | 'labor-ocr'
  | 'audit-readiness';

export interface StatutoryOfficer {
  id: string;
  name: string;
  cadre: string;
  regulationCode: string;
  regulationLabel: string;
  badge: string;
  imageUrl: string;
  avatarUrl?: string;
  jobImageUrl?: string;
  jobRoleAction?: string;
  description: string;
  responsibilities: string[];
  verificationStatus: string;
  targetView: ActiveView;
}

export interface StatutoryDocket {
  id: string;
  title: string;
  regulation: string;
  status: string;
  dueText: string;
  frequency: string;
  assignedOfficer: string;
  verifiedDossiers: string;
  authority: string;
  imageUrl: string;
  hudMetrics?: { label: string; value: string; color?: string }[];
  tagNote?: string;
  summary: string;
  tags: string[];
}

export interface ContractorRecord {
  id: string;
  name: string;
  code: string;
  personnelCount: number;
  vtcCompliance: number;
  pmeFitness: number;
  formBStatus: string;
  demeritPoints: number;
  validity: string;
  activePit: string;
  riskStatus: 'compliant' | 'review' | 'warning' | 'exemplary';
  contractType: string;
  complianceRate: number;
}

export interface LedgerBlock {
  blockNumber: number;
  hash: string;
  previousHash: string;
  merkleRoot: string;
  timestamp: string;
  officer: string;
  statutoryRole: string;
  action: string;
  target: string;
  verified: boolean;
  status: string;
  type: string;
  payload: Record<string, unknown>;
}

export interface SubsidiaryCompliance {
  id: string;
  code: 'MCL' | 'NCL' | 'BCL' | 'ACCL' | 'ECL' | 'CCL' | 'WCL';
  name: string;
  headquarters: string;
  basin: string;
  dgmsGrade: 'A+' | 'A' | 'A-' | 'B+';
  complianceScore: number;
  incidentRate: number;
  activeMinesCount: number;
  annualProductionMT: number;
  status: 'EXEMPLARY' | 'COMPLIANT' | 'SURVEILLANCE';
  auditDate: string;
}

export interface CoalMineRecord {
  id: string;
  subsidiary: 'MCL' | 'NCL' | 'BCL' | 'ACCL' | 'ECL' | 'CCL' | 'WCL';
  mineName: string;
  location: string;
  basin: string;
  workforce: number;
  dailyOutput: string;
  dgmsGrade: 'A+' | 'A' | 'A-' | 'B+';
  officerName: string;
  contact: string;
  type: 'Opencast' | 'Underground' | 'Mixed';
  statutoryStatus: 'Fully Verified' | 'Conditional Pass' | 'Audit Scheduled';
}

export interface TelemetryDataPoint {
  month: string;
  complianceRate: number;
  incidentCount: number;
  alarmsCount: number;
  nearMissReports: number;
  capaSlaRate: number;
}

export interface ComplianceAlertItem {
  id: string;
  timestamp: string;
  type: 'telemetry' | 'muster' | 'docket' | 'radar' | 'statutory';
  severity: 'info' | 'warning' | 'critical' | 'success';
  title: string;
  mine: string;
  source: string;
  regulation: string;
  actionable: boolean;
}

