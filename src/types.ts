export type SubsidiaryCode = 'CIL_HQ' | 'ECL' | 'BCCL' | 'CCL' | 'WCL' | 'SECL' | 'MCL' | 'NCL';

export type UserRole = 
  | 'CIL_EXECUTIVE'       // Corporate Management & Ministry of Coal
  | 'DGMS_INSPECTOR'      // Directorate General of Mines Safety (Regulatory)
  | 'MINE_MANAGER'        // Agent / Project Officer / Colliery Manager
  | 'SAFETY_OFFICER'      // Mine Safety & Rescue Team Head
  | 'ENVIRONMENT_OFFICER' // CPCB/SPCB Compliance & ESG Head
  | 'MINING_SIRDAR';      // Field Supervisor / Overman (Mobile App User)

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  designation?: string;
  mineAssigned?: string;
  subsidiary?: SubsidiaryCode;
  badgeNumber?: string;
  phoneNumber?: string;
  photoURL?: string;
  lastLoginAt?: string;
  createdAt?: string;
  isCustomAccount?: boolean;
}

export type MineType = 'OPENCAST' | 'UNDERGROUND' | 'MIXED';

export type ComplianceCategory = 'SAFETY' | 'ENVIRONMENT' | 'PRODUCTION' | 'LABOUR' | 'STATUTORY_CLEARANCE';

export type ComplianceStatus = 'COMPLIANT' | 'NEARING_DUE' | 'NON_COMPLIANT' | 'UNDER_REVIEW' | 'CRITICAL_BREACH';

export type HazardSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL_FATAL_RISK';

export type CAPAStatus = 'OPEN' | 'IN_PROGRESS' | 'FIELD_RECTIFIED' | 'STATUTORY_VERIFIED' | 'CLOSED';

export interface MineSite {
  id: string;
  name: string;
  code: string;
  subsidiary: SubsidiaryCode;
  state: string;
  district: string;
  type: MineType;
  coordinates: {
    lat: number;
    lng: number;
  };
  productionCapacityMTPA: number;
  currentProductionMT: number;
  activeWorkforce: number;
  complianceScore: number; // 0 - 100
  safetyRating: 'A+' | 'A' | 'B' | 'C' | 'CRITICAL_WATCH';
  dgmsZone: string;
  projectOfficer: string;
  lastDgmsInspectionDate: string;
  activeAlertsCount: number;
}

export interface StatutoryComplianceItem {
  id: string;
  mineId: string;
  mineName: string;
  subsidiary: SubsidiaryCode;
  category: ComplianceCategory;
  actReference: string; // e.g. "Coal Mines Regulations 2017 - Reg 104 (Strata Control)"
  title: string;
  description: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'BI_ANNUAL' | 'ANNUAL' | 'ONE_TIME';
  dueDate: string;
  lastAuditDate: string;
  status: ComplianceStatus;
  riskLevel: HazardSeverity;
  assignedOfficer: string;
  regulatoryAuthority: 'DGMS' | 'CPCB' | 'SPCB' | 'MoEFCC' | 'PESO' | 'MoC';
  documents: {
    name: string;
    url: string;
    uploadDate: string;
    verified: boolean;
  }[];
  escalationLevel: 1 | 2 | 3; // 1 = Mine Manager, 2 = Subsidiary GM, 3 = DGMS / CIL Board
  penaltyExposureINR?: string;
}

export interface FieldInspection {
  id: string;
  mineId: string;
  mineName: string;
  locationTag: string; // e.g., "Seam-III Haul Road Bench 4"
  geoPoint: {
    lat: number;
    lng: number;
  };
  inspectorName: string;
  inspectorRole: UserRole;
  timestamp: string;
  category: ComplianceCategory;
  severity: HazardSeverity;
  observationTitle: string;
  detailedFindings: string;
  violatedRegulation: string;
  evidencePhotoUrl?: string;
  audioVoiceNoteUrl?: string;
  audioTranscription?: string;
  capaStatus: CAPAStatus;
  assignedTo: string;
  deadlineDate: string;
  rectificationProofUrl?: string;
  rectificationNotes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  aiRiskScore: number; // 0 - 100
  aiPredictedImpact: string;
  offlineSynced: boolean;
  tamperProofHash: string;
}

export interface IoTSensorNode {
  id: string;
  mineId: string;
  name: string;
  type: 'GAS_CH4' | 'GAS_CO' | 'GAS_O2' | 'DUST_PM10' | 'SLOPE_RADAR' | 'BLAST_VIBRATION' | 'WATER_PH';
  location: string;
  geoPoint: {
    lat: number;
    lng: number;
  };
  currentValue: number;
  unit: string;
  normalRange: [number, number];
  criticalThreshold: number;
  status: 'NORMAL' | 'WARNING' | 'CRITICAL_ALARM';
  lastUpdated: string;
  batteryPercent: number;
}

export interface ContractorCompliance {
  id: string;
  contractorName: string;
  agencyCode: string;
  mineId: string;
  activeWorkers: number;
  vtcTrainedPercent: number; // Vocational training compliance
  pmeMedicalsCurrentPercent: number; // Periodic Medical Examination
  formBRegisteredPercent: number;
  pfEsiComplianceStatus: '100%_COMPLIANT' | 'DELAYED_RETURNS' | 'NON_COMPLIANT';
  safetyPenaltyPoints: number;
  blacklisted: boolean;
  contractExpiry: string;
  activeViolationsCount: number;
}

export type AppTab = 
  | 'OVERVIEW'
  | 'GIS_MAP'
  | 'STATUTORY_VAULT'
  | 'INSPECTION_CAPA'
  | 'MOBILE_INSPECTOR'
  | 'CONTRACTOR_LABOUR'
  | 'AI_INTELLIGENCE'
  | 'AUDIT_LEDGER';

export interface AuditTrailBlock {
  blockIndex: number;
  timestamp: string;
  action: string;
  entityType: string;
  entityId: string;
  initiatedBy?: string;
  role?: string;
  performedBy?: string;
  performedRole?: string;
  subsidiary?: SubsidiaryCode;
  mineName?: string;
  previousHash: string;
  blockHash?: string;
  currentHash: string;
  digitalSignature?: string;
  details?: string;
  payload?: any;
}


export interface PredictiveRiskAnalysis {
  overallRiskLevel: 'LOW' | 'ELEVATED' | 'HIGH' | 'CRITICAL_EMERGENCY';
  compositeRiskScore: number; // 0 - 100
  highRiskZones: {
    zoneName: string;
    riskFactor: string;
    probability: number;
    statutoryViolationRisk: string;
    preventativeDirective: string;
  }[];
  recurringViolationsPattern: string[];
  anomaliesDetected: {
    type: string;
    description: string;
    severity: HazardSeverity;
    suggestedAction: string;
  }[];
  regulatoryEscalationWarning?: string;
}
