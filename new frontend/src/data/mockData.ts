import { StatutoryOfficer, StatutoryDocket, ContractorRecord, LedgerBlock } from '../types';

export const NATIONAL_EMBLEM_URL = "/emblem-of-india-gold.svg";

export const STATUTORY_OFFICERS: StatutoryOfficer[] = [
  {
    id: "officer-1",
    name: "UDIT NARAYAN GANGULY",
    cadre: "DGMS Regional Officer",
    regulationCode: "Apex Zonal",
    regulationLabel: "Zonal Regulatory Directorate",
    badge: "DGMS Zone Apex",
    imageUrl: "/roles/regional-officer-audit.jpg",
    jobImageUrl: "/roles/regional-officer-audit.jpg",
    avatarUrl: "/officers/officer-udit.jpg",
    jobRoleAction: "Zonal Mine Planning, Blueprints & Inquiry Tribunal",
    description: "Apex regional statutory authority overseeing colliery safety governance, regional accident inquiry tribunals, and statutory mine opening and reopening clearances across coalfield zones.",
    responsibilities: [
      "Zonal statutory audit oversight & quarterly colliery safety performance reviews",
      "High-level inquiry commissions on dangerous occurrences & major mine accidents",
      "DGMS statutory sanction approvals, court depositions & statutory circular directives"
    ],
    verificationStatus: "Jurisdiction Verified",
    targetView: "audit-readiness"
  },
  {
    id: "officer-2",
    name: "ARITRA DE",
    cadre: "Mine Manager (1st Class)",
    regulationCode: "CMR Reg 27",
    regulationLabel: "Statutory Colliery Head",
    badge: "FCC Certified",
    imageUrl: "/roles/mine-manager-pit-command.jpg",
    jobImageUrl: "/roles/mine-manager-pit-command.jpg",
    avatarUrl: "/officers/officer-aritra.jpg",
    jobRoleAction: "Opencast Pit Command, HEMM Fleet & Daily Extraction Shift",
    description: "Direct colliery technical commander holding First Class Competency. Executes daily statutory operational logs, workforce deployment clearances, and colliery production quotas.",
    responsibilities: [
      "Operational mine command & daily shift sign-offs under CMR Reg 27",
      "Production quota endorsement & statutory heavy earth moving logs",
      "Emergency response command & colliery DGMS compliance journals"
    ],
    verificationStatus: "DGMS FCC Verified",
    targetView: "statutory-vault"
  },
  {
    id: "officer-3",
    name: "ANKITA ROY",
    cadre: "DGMS Inspector",
    regulationCode: "Statutory DGMS",
    regulationLabel: "Central Regulatory Authority",
    badge: "Mines Act Sec 22",
    imageUrl: "/roles/dgms-inspector-audit.jpg",
    jobImageUrl: "/roles/dgms-inspector-audit.jpg",
    avatarUrl: "/officers/officer-ankita.jpg",
    jobRoleAction: "Statutory On-Site Inspection & Safety Apparatus Audit (Sec 22)",
    description: "Statutory safety enforcement officers empowered by the Government of India. Issues legally binding stop-work notices, machinery safety orders, and accident inquiries.",
    responsibilities: [
      "Colliery safety audits & high-risk extraction zone inspections",
      "Structural barrier integrity & electrical flameproof apparatus testing",
      "Statutory stop-work notice issuance & accident inquiry depositions"
    ],
    verificationStatus: "Enforcement Authority",
    targetView: "statutory-vault"
  },
  {
    id: "officer-4",
    name: "SWADHIN SAHA",
    cadre: "Safety & Ventilation Officer",
    regulationCode: "CMR Reg 29",
    regulationLabel: "Hazard Mitigation & Life Safety",
    badge: "Degree-III Clearance",
    imageUrl: "/roles/ventilation-officer-survey.jpg",
    jobImageUrl: "/roles/ventilation-officer-survey.jpg",
    avatarUrl: "/officers/officer-swadhin.jpg",
    jobRoleAction: "Underground Seam Ventilation Ducting & Gas Telemetry",
    description: "Statutory custodian of mine atmospheric safety. Validates pre-shift air velocity, methanometer readings, combustible dust mitigation, and emergency evacuation networks.",
    responsibilities: [
      "Continuous telemetric gas monitoring (CH4, CO, O2, and Nox)",
      "Airflow ventilation velocity logs & main fan drift pressure recording",
      "Stone dust barrier compliance & mock evacuation readiness drills"
    ],
    verificationStatus: "Live Telemetry Synced",
    targetView: "labour-ai-ocr"
  },
  {
    id: "officer-5",
    name: "SWAGATA GHOSH",
    cadre: "Mining Sardar",
    regulationCode: "CMR Reg 129",
    regulationLabel: "Safety Supervisory Cadre",
    badge: "Sardar Competency",
    imageUrl: "/colliery/pit-inspection.jpg",
    jobImageUrl: "/colliery/pit-inspection.jpg",
    avatarUrl: "/officers/officer-swagata.jpg",
    jobRoleAction: "Frontline Face Inspection, Roof Sounding & Flame Safety Lamp",
    description: "Frontline statutory mine supervisory authority designated under Coal Mines Regulations. Responsible for face inspections, roof and side testing, gas testing with methanometers, and workforce shift safety.",
    responsibilities: [
      "Pre-shift and in-shift working face safety & roof support testing",
      "Firedamp & toxic gas detection with approved flame safety lamp/detector",
      "Statutory daily inspection log & shift safety diary endorsement"
    ],
    verificationStatus: "DSC Class-3 Enabled",
    targetView: "mobile-inspector"
  },
  {
    id: "officer-6",
    name: "TRIJIT ROY",
    cadre: "Labour Sardar",
    regulationCode: "CMR Reg 130",
    regulationLabel: "Workforce Safety Cadre",
    badge: "Statutory Crew Command",
    imageUrl: "/roles/labour-sardar-muster.jpg",
    jobImageUrl: "/roles/labour-sardar-muster.jpg",
    avatarUrl: "/officers/officer-trijit.jpg",
    jobRoleAction: "Workforce Shift Muster, PPE Verification & Pithead Deployment",
    description: "Statutory frontline supervisor directing workforce muster, shift deployment clearances, face-level personal protective equipment (PPE) compliance, and worker occupational safety.",
    responsibilities: [
      "Daily underground/opencast workforce muster verification & biometric shift logs",
      "Working face hazard inspection, gangway clearance & PPE compliance checks",
      "Frontline dispute resolution, fatigue monitoring & emergency muster point marshalling"
    ],
    verificationStatus: "Muster Sync Verified",
    targetView: "labour-contractors"
  }
];

export const STATUTORY_DOCKETS: StatutoryDocket[] = [
  {
    id: "DGMS-2024-GAS-041",
    title: "Continuous Telemetric Gas Monitoring (CH4/CO) Sensor Calibration Docket",
    regulation: "CMR REG. 153",
    status: "COMPLIANCE REVIEW",
    dueText: "Due in 5 Days (17 Oct, 23:59 IST)",
    frequency: "Monthly Telemetry",
    assignedOfficer: "Ankita Roy (DGMS Insp.)",
    verifiedDossiers: "8 of 8 Digitally Sealed",
    authority: "DGMS Central Directorate",
    imageUrl: "https://lh3.googleusercontent.com/aida/AEtjO1XMorKaDx8xPhx2avnO5B1inqwuNzsYD74J_-nQzsGSo6A-dbu-8HWInPC_vCCaz7WF3lugFLraiadC6X1nxDThk_CISsZRV9RN5H-zpTLsPXlgzh51SQSGnWeHbjEC-pakmNV_cqNbV39VetpRUUtjWJX66mB5Dn1auoufWCMpczLGFRr-5agPItmrCpnISI_wM0YfhD4TtizvspaX4HQbpeefajyFkM4t5mcFuO7cWRNpa0ZrXaKH3g8",
    hudMetrics: [
      { label: "CH4", value: "0.28%", color: "text-emerald-300" },
      { label: "CO", value: "12 ppm", color: "text-cyan-300" }
    ],
    tagNote: "FLOW: 42 m³/min",
    summary: "Statutory monthly multi-point calibration logs for 24 optical methane detection heads and carbon monoxide infrared analyzers across Jharia Seam XIV under CMR 2017 Regulation 153.",
    tags: ["Sensor Calibration Valid: 28 Days", "Zero Inversion Drift"]
  },
  {
    id: "DGMS-2024-BLAST-112",
    title: "Controlled Electronic Detonator Vibration & Air-Blast Monitoring Report",
    regulation: "CMR REG. 164",
    status: "COMPLIANT SEALED",
    dueText: "Due in 14 Days (26 Oct, 18:00 IST)",
    frequency: "Weekly Telemetry",
    assignedOfficer: "Aritra De (1st Class Mgr)",
    verifiedDossiers: "SHA-256 Digitally Sealed",
    authority: "DGMS Dhanbad Sub-Circle",
    imageUrl: "https://lh3.googleusercontent.com/aida/AEtjO1U4m80DPyEdiiaBo44RS04cKsX-b2jLrA6Y8VnHCWtoY-Utnx9LMwOu75QbXjqFv7ZPCs4NO_PRyPHoh0GrKNgAOUS2ZLcggp6wlLzoIzGoopZakEQZWXr2T4OrEsHN5BqGLx5nf26fufKOcsl3GS7wyV26HtXCMhQHMgWeYkxhw_MbMD9b8VQz76WVu5kz9nF6Rg32TaloyRxQldubFV2R7coLZmYM4fHJ1aIzXIgZNKV6mGCYibofFWz-",
    hudMetrics: [
      { label: "PPV", value: "2.84 mm/s", color: "text-emerald-300" },
      { label: "FREQ", value: "18.2 Hz", color: "text-cyan-300" }
    ],
    tagNote: "PPV < 5mm/sec SEALED",
    summary: "Weekly seismograph telemetry log tracking peak particle velocity (PPV < 5mm/sec) and structural vibration baseline for adjacent township protection under CMR 2017 Regulation 164.",
    tags: ["Blast Sector: Bench 4A North", "Seismograph #TEL-09 Verified"]
  },
  {
    id: "DGMS-2024-DISPATCH-88",
    title: "Automated Smart Weighbridge & Electronic Mineral Transit Pass Audit",
    regulation: "DGMS CIR. 08/23",
    status: "DISPATCH CERTIFIED",
    dueText: "Due in 21 Days (02 Nov, 12:00 IST)",
    frequency: "Continuous RFID Feed",
    assignedOfficer: "R. K. Mukherjee (Dep. Dir)",
    verifiedDossiers: "12 of 12 Batches Valid",
    authority: "DGMS Eastern HQ",
    imageUrl: "https://lh3.googleusercontent.com/aida/AEtjO1XVd-n9BPei_BrENDoum04-cHpuHjBnklPUTTYSja8VlBUEM_dVNwwK0wlAKY8aJs9yxAcBTD_P270pcI049U6yLW4bVjhtYobfTTyR8Oe0I9lT2MwseJO_t5LizlMRiWE4ZL8p4pjWPetZzT44JH_eQ1sUb4M0j0gpXgD8j4Daj_VX6ZM6qjVkI3wkzLypp4Fz5aQBnsTx3BsjNviwnecmRDd2b5tfo1XZhS08dFONjHQo8ENmve3GlsC9",
    hudMetrics: [
      { label: "RFID", value: "VERIFIED", color: "text-emerald-300" },
      { label: "GW", value: "54.2 TONNES", color: "text-cyan-300" }
    ],
    tagNote: "e-TRANSIT SEALED",
    summary: "Integrated telemetry dossier connecting automatic vehicle identification (RFID), optical ANPR camera feed, and live weighbridge gross payload calibration with the Ministry of Coal FOIS national transit corridor.",
    tags: ["Weighbridge Bay: #02 (Outbound)", "DGMS Anti-Overload Calibrated"]
  }
];

export const CONTRACTOR_RECORDS: ContractorRecord[] = [
  {
    id: "cont-1",
    name: "M/S Eastern Earth Movers & Haulers Pvt Ltd",
    code: "BCCL-CONT-EEMH-04 • Tier-1 Heavy HEMM",
    personnelCount: 340,
    vtcCompliance: 94,
    pmeFitness: 88,
    formBStatus: "100% Digitally Endorsed",
    demeritPoints: 18,
    validity: "Valid up to 31 Mar 2026",
    activePit: "Active In Pit-4",
    riskStatus: "compliant",
    contractType: "Heavy Earthmoving & Overburden",
    complianceRate: 94
  },
  {
    id: "cont-2",
    name: "Bharat Infrastructure & Blasting Logistics",
    code: "BCCL-CONT-BIBL-09 • Drilling & Blasting",
    personnelCount: 512,
    vtcCompliance: 98,
    pmeFitness: 96,
    formBStatus: "100% Form-B Signed",
    demeritPoints: 4,
    validity: "Valid up to 15 Nov 2026",
    activePit: "Deep Blasting Pit",
    riskStatus: "exemplary",
    contractType: "Drilling, Pre-split & Controlled Blasting",
    complianceRate: 98
  },
  {
    id: "cont-3",
    name: "Jharkhand Mining & Heavy Transport Corp",
    code: "BCCL-CONT-JMHT-12 • Overburden Haulage",
    personnelCount: 285,
    vtcCompliance: 78,
    pmeFitness: 71,
    formBStatus: "90% Form-B Signed",
    demeritPoints: 32,
    validity: "Valid up to 10 Jan 2025 (Renew Pending)",
    activePit: "Notice Issued",
    riskStatus: "warning",
    contractType: "Dump Truck Haulage & Sump Dredging",
    complianceRate: 79
  },
  {
    id: "cont-4",
    name: "Mehandi Coal & Transport Services",
    code: "BCCL-CONT-MCTS-22 • Crushing & Dispatch",
    personnelCount: 198,
    vtcCompliance: 92,
    pmeFitness: 89,
    formBStatus: "98% Form-B Signed",
    demeritPoints: 12,
    validity: "Valid up to 30 June 2025",
    activePit: "Siding Rail Sump",
    riskStatus: "compliant",
    contractType: "Crushing, Screening & Siding Transport",
    complianceRate: 93
  }
];

export const LEDGER_BLOCKS: LedgerBlock[] = [
  {
    blockNumber: 48291,
    hash: "0x7f8a91c49b01ae873cf2984102948bbca102948bbca102948bbce3b8219904",
    previousHash: "0x3a4b98c177fa298104ecbf892147db66a871024bd1024bd19f12d488bc",
    merkleRoot: "0x918cbef042189ac7201948ba98204918e918cba7198234190821340918bcde",
    timestamp: "12 Oct 2024, 14:18:22 IST (NPL Synced)",
    officer: "Kunjwar Singh",
    statutoryRole: "DGMS Senior Statutory Inspector (Mines Act 1952 Sec 22 Enforcement Authority)",
    action: "Stop-Work Order Review & Slope Injunction",
    target: "DGMS Sec 22(1A) Mandate",
    verified: true,
    status: "SEALED",
    type: "SEC 22 STOP-WORK",
    payload: {
      docket_ref: "DGMS/EZ/JHR-OC/2024/SEC22-09",
      statutory_mandate: "Mines Act 1952 Section 22(1A) & CMR 2017 Reg 106",
      colliery_target: "Jharia Opencast Project - Pit 4 / Overburden Bench #4",
      finding: "Geotechnical tension crack (14mm/day creep displacement). Factor of safety 1.18 < 1.50 threshold.",
      statutory_order: "Immediate cessation of heavy haulage transit until laser lidar berm regrading certification.",
      witness_officers: ["Aritra De (Mine Manager)", "Swagata Ghosh (Mining Sardar)"],
      tamper_proof_proof: "HMAC-SHA256-CCA-GOV-VALID"
    }
  },
  {
    blockNumber: 48290,
    hash: "0x3a4b98c177fa298104ecbf892147db66a871024bd1024bd19f12d488bc",
    previousHash: "0x88e412d0a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef012345678",
    merkleRoot: "0x4a5b6c7d8e9f0123456789abcdef0123456789abcdef0123456789abcdef0123",
    timestamp: "12 Oct 2024, 13:45:00 IST",
    officer: "Swagata Ghosh (Mining Sardar Tier-A)",
    statutoryRole: "Frontline Statutory Supervisor (CMR Reg 129)",
    action: "Continuous Optical CH4/CO Log Certification",
    target: "Seam XIV Continuous Optical CH4/CO",
    verified: true,
    status: "SEALED",
    type: "GAS TELEMETRY (CMR 153)",
    payload: {
      sensor_id: "CH4-OPT-14",
      reading: "0.28%",
      co_reading: "12 ppm",
      ventilation_flow: "42 m3/min",
      statutory_code: "CMR Reg 153"
    }
  },
  {
    blockNumber: 48289,
    hash: "0x88e412d0a991cba1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef012",
    previousHash: "0x19fc882a55e091a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef012",
    merkleRoot: "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
    timestamp: "12 Oct 2024, 12:30:15 IST",
    officer: "Trijit Roy (Labour Sardar CMR 130)",
    statutoryRole: "Workforce Shift Muster Authority",
    action: "Biometric Turnstile Wage Synchronization",
    target: "Eastern Earth Movers 340 Shift-B Turnstile",
    verified: true,
    status: "SEALED",
    type: "FORM-B MUSTER ROLL",
    payload: {
      contractor: "M/S Eastern Earth Movers",
      shift: "Shift-B",
      workers_logged: 340,
      smart_contract: "EXECUTED"
    }
  },
  {
    blockNumber: 48288,
    hash: "0x19fc882a55e091b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef01234",
    previousHash: "0x00a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcde",
    merkleRoot: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    timestamp: "12 Oct 2024, 11:15:40 IST",
    officer: "Aritra De (First Class Mine Manager)",
    statutoryRole: "Mine Manager (FCC CMR Reg 27)",
    action: "Controlled Detonation Vibration Endorsement",
    target: "Bench #4A North Seismograph PPV 2.84 mm/s",
    verified: true,
    status: "SEALED",
    type: "BLAST SEISMOGRAPH (CMR 164)",
    payload: {
      blast_id: "BLAST-4A-N",
      ppv: "2.84 mm/s",
      frequency: "18.2 Hz",
      compliance_status: "PASSED"
    }
  }
];
