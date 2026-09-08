import React, { useState } from 'react';
import { ActiveView } from '../types';

export interface ContractorWorker {
  id: string;
  name: string;
  tokenId: string;
  role: string;
  capLampNo: string;
  bloodGroup: string;
  vtcStatus: 'VALID' | 'EXPIRING' | 'EXPIRED';
  vtcExpiryText: string;
  pmeStatus: 'FIT_CLASS_A' | 'REVIEW_DUE' | 'UNFIT';
  pmeDetail: string;
  demerits: number;
  turnstileStatus: 'ACTIVE_IN_PIT' | 'TURNSTILE_LOCKED' | 'OFF_SHIFT';
}

export interface DetailedContractor {
  id: string;
  name: string;
  code: string;
  category: string;
  contractType: string;
  personnelCount: number;
  vtcCompliance: number;
  pmeFitness: number;
  formBStatus: string;
  epfEsicCompliance: number;
  demeritPoints: number;
  penaltyExposure: string;
  validity: string;
  validityDaysLeft: number;
  activePit: string;
  riskStatus: 'compliant' | 'warning' | 'exemplary';
  safetyOfficer: string;
  vtcCenter: string;
  rolesBreakdown: {
    dumperOperators: number;
    shovelOperators: number;
    drillMasters: number;
    mechanicsElectricians: number;
    generalPitLabour: number;
  };
  sampleWorkers: ContractorWorker[];
  statutoryNoticesIssued: {
    id: string;
    type: string;
    regulation: string;
    date: string;
    status: 'ACTIVE' | 'RESOLVED';
  }[];
}

interface LabourContractorsViewProps {
  setActiveView: (view: ActiveView) => void;
  onOpenCopilot: () => void;
  officerName?: string;
}

const INITIAL_DETAILED_CONTRACTORS: DetailedContractor[] = [
  {
    id: 'cont-1',
    name: 'M/S Eastern Earth Movers & Haulers Pvt Ltd',
    code: 'BCCL-CONT-EEMH-04 • Tier-1 Heavy HEMM',
    category: 'Heavy Earthmoving Machinery (HEMM)',
    contractType: 'Heavy Earthmoving & Overburden Removal',
    personnelCount: 340,
    vtcCompliance: 94.2,
    pmeFitness: 88.5,
    formBStatus: '100% Digitally Endorsed',
    epfEsicCompliance: 100,
    demeritPoints: 18,
    penaltyExposure: '₹25,000 (Mines Act Sec 72C)',
    validity: 'Valid up to 31 Mar 2026',
    validityDaysLeft: 569,
    activePit: 'Active In Pit-4',
    riskStatus: 'compliant',
    safetyOfficer: 'Suraj Prakash (Tech-DGMS)',
    vtcCenter: 'VTC Bhuli Central Institute',
    rolesBreakdown: {
      dumperOperators: 142,
      shovelOperators: 28,
      drillMasters: 36,
      mechanicsElectricians: 44,
      generalPitLabour: 90
    },
    sampleWorkers: [
      {
        id: 'w-101',
        name: 'Sujit Mondal',
        tokenId: 'BCCL-FB-9942',
        role: 'Heavy Dumper Operator (100T)',
        capLampNo: 'CL-104',
        bloodGroup: 'O+',
        vtcStatus: 'VALID',
        vtcExpiryText: 'Expires in 184 days',
        pmeStatus: 'FIT_CLASS_A',
        pmeDetail: 'Audiometry & Chest X-Ray Normal',
        demerits: 6,
        turnstileStatus: 'ACTIVE_IN_PIT'
      },
      {
        id: 'w-102',
        name: 'Rajesh Soren',
        tokenId: 'BCCL-FB-8812',
        role: 'Hydraulic Shovel Operator',
        capLampNo: 'CL-109',
        bloodGroup: 'B+',
        vtcStatus: 'VALID',
        vtcExpiryText: 'Expires in 210 days',
        pmeStatus: 'FIT_CLASS_A',
        pmeDetail: 'Visual Acuity 6/6 • Normal',
        demerits: 0,
        turnstileStatus: 'ACTIVE_IN_PIT'
      },
      {
        id: 'w-103',
        name: 'Dilip Mahato',
        tokenId: 'BCCL-FB-7740',
        role: 'HEMM Heavy Mechanic',
        capLampNo: 'CL-122',
        bloodGroup: 'A+',
        vtcStatus: 'EXPIRING',
        vtcExpiryText: 'Expires in 14 days',
        pmeStatus: 'FIT_CLASS_A',
        pmeDetail: 'Fitness Certified',
        demerits: 2,
        turnstileStatus: 'ACTIVE_IN_PIT'
      },
      {
        id: 'w-104',
        name: 'Birsa Munda',
        tokenId: 'BCCL-FB-6621',
        role: 'Pit Drainage Sump Mechanic',
        capLampNo: 'CL-138',
        bloodGroup: 'AB+',
        vtcStatus: 'VALID',
        vtcExpiryText: 'Expires in 92 days',
        pmeStatus: 'REVIEW_DUE',
        pmeDetail: 'PME due within 30 days',
        demerits: 0,
        turnstileStatus: 'OFF_SHIFT'
      }
    ],
    statutoryNoticesIssued: [
      {
        id: 'NOT-2026-04',
        type: 'Haul Road Speed Limit Warning',
        regulation: 'CMR Reg. 93',
        date: '2026-08-14',
        status: 'RESOLVED'
      }
    ]
  },
  {
    id: 'cont-2',
    name: 'Bharat Infrastructure & Blasting Logistics',
    code: 'BCCL-CONT-BIBL-09 • Drilling & Blasting',
    category: 'Drilling, Pre-split & Blasting',
    contractType: 'Controlled Electronic Blasting & Deep Drilling',
    personnelCount: 512,
    vtcCompliance: 98.4,
    pmeFitness: 96.2,
    formBStatus: '100% Form-B Signed',
    epfEsicCompliance: 100,
    demeritPoints: 4,
    penaltyExposure: '₹0 (Zero Infraction)',
    validity: 'Valid up to 15 Nov 2026',
    validityDaysLeft: 798,
    activePit: 'Deep Blasting Pit',
    riskStatus: 'exemplary',
    safetyOfficer: 'R. K. Mukherjee (Blasting Lead)',
    vtcCenter: 'DGMS Sijua Training Camp',
    rolesBreakdown: {
      dumperOperators: 40,
      shovelOperators: 12,
      drillMasters: 160,
      mechanicsElectricians: 60,
      generalPitLabour: 240
    },
    sampleWorkers: [
      {
        id: 'w-201',
        name: 'Kaleshwar N. Tudu',
        tokenId: 'BCCL-FB-5511',
        role: 'Rotary Blast Hole Drill Master',
        capLampNo: 'CL-201',
        bloodGroup: 'O+',
        vtcStatus: 'VALID',
        vtcExpiryText: 'Expires in 320 days',
        pmeStatus: 'FIT_CLASS_A',
        pmeDetail: 'Vibration & Audiometry Normal',
        demerits: 0,
        turnstileStatus: 'ACTIVE_IN_PIT'
      },
      {
        id: 'w-202',
        name: 'Manoj Kumar Sharma',
        tokenId: 'BCCL-FB-5512',
        role: 'Certified Shotfirer (CMR 164)',
        capLampNo: 'CL-202',
        bloodGroup: 'B+',
        vtcStatus: 'VALID',
        vtcExpiryText: 'Expires in 280 days',
        pmeStatus: 'FIT_CLASS_A',
        pmeDetail: 'Explosives Handling Certified',
        demerits: 0,
        turnstileStatus: 'ACTIVE_IN_PIT'
      }
    ],
    statutoryNoticesIssued: []
  },
  {
    id: 'cont-3',
    name: 'Jharkhand Mining & Heavy Transport Corp',
    code: 'BCCL-CONT-JMHT-12 • Overburden Haulage',
    category: 'Overburden Haulage & Sump Dredging',
    contractType: 'Dump Truck Haulage & Sump Dredging',
    personnelCount: 285,
    vtcCompliance: 78.0,
    pmeFitness: 71.4,
    formBStatus: '90% Form-B Signed',
    epfEsicCompliance: 84,
    demeritPoints: 32,
    penaltyExposure: '₹1,20,000 (Mines Act Sec 22 Notice)',
    validity: 'Valid up to 10 Jan 2025 (Renew Pending)',
    validityDaysLeft: 8,
    activePit: 'Notice Issued',
    riskStatus: 'warning',
    safetyOfficer: 'Amitabh Sen (Audit Flagged)',
    vtcCenter: 'VTC Dhanbad Extension',
    rolesBreakdown: {
      dumperOperators: 120,
      shovelOperators: 18,
      drillMasters: 10,
      mechanicsElectricians: 32,
      generalPitLabour: 105
    },
    sampleWorkers: [
      {
        id: 'w-301',
        name: 'Lakhinder Majhi',
        tokenId: 'BCCL-FB-3301',
        role: 'Tipper Dumper Driver',
        capLampNo: 'CL-301',
        bloodGroup: 'A+',
        vtcStatus: 'EXPIRING',
        vtcExpiryText: 'Expires in 8 days (URGENT)',
        pmeStatus: 'REVIEW_DUE',
        pmeDetail: 'PME Overdue by 12 Days',
        demerits: 14,
        turnstileStatus: 'TURNSTILE_LOCKED'
      },
      {
        id: 'w-302',
        name: 'Gopal Chandra Das',
        tokenId: 'BCCL-FB-3302',
        role: 'Excavator Helper',
        capLampNo: 'CL-302',
        bloodGroup: 'O+',
        vtcStatus: 'EXPIRED',
        vtcExpiryText: 'Expired 4 days ago',
        pmeStatus: 'UNFIT',
        pmeDetail: 'Medical Re-exam Mandatory',
        demerits: 18,
        turnstileStatus: 'TURNSTILE_LOCKED'
      }
    ],
    statutoryNoticesIssued: [
      {
        id: 'NOT-2026-88',
        type: 'DGMS Form-B Show-Cause Notice',
        regulation: 'CMR 2017 Reg. 130',
        date: '2026-09-02',
        status: 'ACTIVE'
      }
    ]
  },
  {
    id: 'cont-4',
    name: 'Mehandi Coal & Transport Services',
    code: 'BCCL-CONT-MCTS-22 • Crushing & Dispatch',
    category: 'Crushing, Screening & Dispatch',
    contractType: 'Crushing, Screening & Siding Transport',
    personnelCount: 198,
    vtcCompliance: 92.4,
    pmeFitness: 89.1,
    formBStatus: '98% Form-B Signed',
    epfEsicCompliance: 96,
    demeritPoints: 12,
    penaltyExposure: '₹15,000 (Dust Monitoring Notice)',
    validity: 'Valid up to 30 June 2025',
    validityDaysLeft: 295,
    activePit: 'Siding Rail Sump',
    riskStatus: 'compliant',
    safetyOfficer: 'K. D. Pathak',
    vtcCenter: 'VTC Bhuli Central Institute',
    rolesBreakdown: {
      dumperOperators: 48,
      shovelOperators: 14,
      drillMasters: 8,
      mechanicsElectricians: 28,
      generalPitLabour: 100
    },
    sampleWorkers: [
      {
        id: 'w-401',
        name: 'Naresh Prasad',
        tokenId: 'BCCL-FB-4411',
        role: 'Crusher Feeder Operator',
        capLampNo: 'CL-401',
        bloodGroup: 'B+',
        vtcStatus: 'VALID',
        vtcExpiryText: 'Expires in 140 days',
        pmeStatus: 'FIT_CLASS_A',
        pmeDetail: 'PME Valid',
        demerits: 4,
        turnstileStatus: 'ACTIVE_IN_PIT'
      }
    ],
    statutoryNoticesIssued: []
  },
  {
    id: 'cont-5',
    name: 'Singrauli Rock Breakers & Explosives Ltd',
    code: 'BCCL-CONT-SRBE-33 • Blasting Contractors',
    category: 'Deep Seam Pre-Split & Blasting',
    contractType: 'Controlled Secondary Blasting & Rock Breaking',
    personnelCount: 220,
    vtcCompliance: 81.2,
    pmeFitness: 78.4,
    formBStatus: '91% Form-B Signed',
    epfEsicCompliance: 90,
    demeritPoints: 28,
    penaltyExposure: '₹85,000 (Vibration Over-limit Demerit)',
    validity: 'Valid up to 15 Apr 2025',
    validityDaysLeft: 219,
    activePit: 'Pit 2 East Bench',
    riskStatus: 'warning',
    safetyOfficer: 'P. C. Rao (Notice Served)',
    vtcCenter: 'VTC Sijua Training Camp',
    rolesBreakdown: {
      dumperOperators: 22,
      shovelOperators: 16,
      drillMasters: 84,
      mechanicsElectricians: 28,
      generalPitLabour: 70
    },
    sampleWorkers: [
      {
        id: 'w-501',
        name: 'Tarkeshwar Ram',
        tokenId: 'BCCL-FB-5581',
        role: 'Stemming Machine Operator',
        capLampNo: 'CL-501',
        bloodGroup: 'O+',
        vtcStatus: 'EXPIRING',
        vtcExpiryText: 'Expires in 18 days',
        pmeStatus: 'FIT_CLASS_A',
        pmeDetail: 'Chest X-Ray Normal',
        demerits: 8,
        turnstileStatus: 'ACTIVE_IN_PIT'
      }
    ],
    statutoryNoticesIssued: [
      {
        id: 'NOT-2026-91',
        type: 'Vibration Over-limit Show-Cause',
        regulation: 'CMR Reg. 164',
        date: '2026-08-29',
        status: 'ACTIVE'
      }
    ]
  },
  {
    id: 'cont-6',
    name: 'Deccan Pit Haulage & Sump Engineering',
    code: 'BCCL-CONT-DPHE-45 • Tier-2 HEMM Haulage',
    category: 'Heavy Earthmoving & In-Pit Drainage',
    contractType: 'Overburden Haulage & Deep Pit Pumping',
    personnelCount: 160,
    vtcCompliance: 96.5,
    pmeFitness: 94.0,
    formBStatus: '100% Form-B Signed',
    epfEsicCompliance: 100,
    demeritPoints: 6,
    penaltyExposure: '₹0 (Zero Non-compliance)',
    validity: 'Valid up to 30 Dec 2026',
    validityDaysLeft: 843,
    activePit: 'Pit 4 South Sump',
    riskStatus: 'exemplary',
    safetyOfficer: 'S. N. Murthy',
    vtcCenter: 'VTC Bhuli Central Institute',
    rolesBreakdown: {
      dumperOperators: 72,
      shovelOperators: 14,
      drillMasters: 8,
      mechanicsElectricians: 26,
      generalPitLabour: 40
    },
    sampleWorkers: [
      {
        id: 'w-601',
        name: 'Hemant Kispotta',
        tokenId: 'BCCL-FB-6601',
        role: 'Centrifugal Sump Pump Operator',
        capLampNo: 'CL-601',
        bloodGroup: 'AB+',
        vtcStatus: 'VALID',
        vtcExpiryText: 'Expires in 310 days',
        pmeStatus: 'FIT_CLASS_A',
        pmeDetail: 'Valid Fitness',
        demerits: 0,
        turnstileStatus: 'ACTIVE_IN_PIT'
      }
    ],
    statutoryNoticesIssued: []
  }
];

export const LabourContractorsView: React.FC<LabourContractorsViewProps> = ({
  setActiveView,
  officerName = 'SWADHIN SAHA'
}) => {
  // Contractors state
  const [contractors, setContractors] = useState<DetailedContractor[]>(INITIAL_DETAILED_CONTRACTORS);
  const [selectedContractor, setSelectedContractor] = useState<DetailedContractor>(INITIAL_DETAILED_CONTRACTORS[0]);

  // Search & Filter options (User requirement: search options for providers, Approved Mining Contractors, All Contractor, High Risk, VTC Return Expiring, etc.)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'HIGH_RISK' | 'EXPIRING' | 'EXEMPLARY' | 'HEMM' | 'BLASTING'>('ALL');

  // Modals state
  const [showRegisterAgencyModal, setShowRegisterAgencyModal] = useState(false);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);

  // New Agency Form state (User requirement: Register Agency option)
  const [newAgencyName, setNewAgencyName] = useState('');
  const [newAgencyCode, setNewAgencyCode] = useState('');
  const [newAgencyCategory, setNewAgencyCategory] = useState('Heavy Earthmoving Machinery (HEMM)');
  const [newAgencyPit, setNewAgencyPit] = useState('Pit-4 North Bench');
  const [newAgencyWorkers, setNewAgencyWorkers] = useState(150);
  const [newAgencySafetyOfficer, setNewAgencySafetyOfficer] = useState('');
  const [newAgencyVtcCenter, setNewAgencyVtcCenter] = useState('VTC Bhuli Central Institute');

  // Issue Notice Form state (User requirement: Issue Statutory Notice, Audit Form B Register, Revoke Suspend DGMS)
  const [noticeType, setNoticeType] = useState('Show-Cause Notice under CMR 2017 Reg. 130');
  const [noticeRegulation, setNoticeRegulation] = useState('CMR 2017 Reg. 130 - Vocational Training Compliance');
  const [noticeRemarks, setNoticeRemarks] = useState('Irregularities observed in Form-B Muster Roll and uncertified workers operating in pit without valid VTC Gate Pass clearance.');

  // Filtering logic
  const filteredContractors = contractors.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.activePit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'HIGH_RISK') {
      return c.riskStatus === 'warning' || c.demeritPoints >= 20;
    }
    if (selectedFilter === 'EXPIRING') {
      return c.validityDaysLeft <= 30 || c.sampleWorkers.some((w) => w.vtcStatus === 'EXPIRING' || w.vtcStatus === 'EXPIRED');
    }
    if (selectedFilter === 'EXEMPLARY') {
      return c.riskStatus === 'exemplary';
    }
    if (selectedFilter === 'HEMM') {
      return c.category.includes('HEMM') || c.category.includes('Earthmoving');
    }
    if (selectedFilter === 'BLASTING') {
      return c.category.includes('Blasting') || c.category.includes('Drilling');
    }
    return true;
  });

  // Calculate top KPI numbers
  const totalActiveWorkers = contractors.reduce((acc, c) => acc + c.personnelCount, 0);
  const avgVtcCompliance = (contractors.reduce((acc, c) => acc + c.vtcCompliance, 0) / contractors.length).toFixed(1);
  const avgPmeFitness = (contractors.reduce((acc, c) => acc + c.pmeFitness, 0) / contractors.length).toFixed(1);
  const totalDemerits = contractors.reduce((acc, c) => acc + c.demeritPoints, 0);

  // Register New Agency Handler
  const handleRegisterNewAgency = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgencyName.trim()) return;

    const newCode = newAgencyCode.trim() || `BCCL-CONT-${newAgencyName.slice(0, 4).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;
    const newAgency: DetailedContractor = {
      id: `cont-${Date.now()}`,
      name: newAgencyName,
      code: `${newCode} • Registered`,
      category: newAgencyCategory,
      contractType: newAgencyCategory,
      personnelCount: Number(newAgencyWorkers) || 120,
      vtcCompliance: 96.0,
      pmeFitness: 94.0,
      formBStatus: '100% Digitally Endorsed',
      epfEsicCompliance: 100,
      demeritPoints: 0,
      penaltyExposure: '₹0 (Newly Registered)',
      validity: 'Valid up to 31 Mar 2027',
      validityDaysLeft: 570,
      activePit: newAgencyPit,
      riskStatus: 'compliant',
      safetyOfficer: newAgencySafetyOfficer || `${officerName} (Assigned)`,
      vtcCenter: newAgencyVtcCenter,
      rolesBreakdown: {
        dumperOperators: Math.round(Number(newAgencyWorkers) * 0.4),
        shovelOperators: Math.round(Number(newAgencyWorkers) * 0.1),
        drillMasters: Math.round(Number(newAgencyWorkers) * 0.1),
        mechanicsElectricians: Math.round(Number(newAgencyWorkers) * 0.15),
        generalPitLabour: Math.round(Number(newAgencyWorkers) * 0.25)
      },
      sampleWorkers: [
        {
          id: `w-${Date.now()}`,
          name: 'Anil Kumar Mahato',
          tokenId: `BCCL-FB-${Math.floor(1000 + Math.random() * 9000)}`,
          role: 'Lead Operator (Inducted)',
          capLampNo: 'CL-991',
          bloodGroup: 'B+',
          vtcStatus: 'VALID',
          vtcExpiryText: 'Valid 365 days',
          pmeStatus: 'FIT_CLASS_A',
          pmeDetail: 'Pre-placement Medical Fit',
          demerits: 0,
          turnstileStatus: 'ACTIVE_IN_PIT'
        }
      ],
      statutoryNoticesIssued: []
    };

    setContractors([newAgency, ...contractors]);
    setSelectedContractor(newAgency);
    setShowRegisterAgencyModal(false);
    setNewAgencyName('');
    alert(
      `Mining Contractor Agency Registered Successfully!\n\n` +
      `Agency: ${newAgency.name}\n` +
      `Vendor Code: ${newAgency.code}\n` +
      `Personnel Strength: ${newAgency.personnelCount} Workers\n` +
      `Accredited VTC: ${newAgency.vtcCenter}\n` +
      `Turnstile Gate Pass Sync: ACTIVATED.`
    );
  };

  // Submit Statutory Notice Handler
  const handleIssueNotice = (e: React.FormEvent) => {
    e.preventDefault();
    const noticeId = `NOT-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newNotice = {
      id: noticeId,
      type: noticeType,
      regulation: noticeRegulation,
      date: new Date().toISOString().slice(0, 10),
      status: 'ACTIVE' as const
    };

    const updated = contractors.map((c) => {
      if (c.id === selectedContractor.id) {
        return {
          ...c,
          riskStatus: 'warning' as const,
          demeritPoints: c.demeritPoints + 10,
          activePit: 'Notice Issued',
          statutoryNoticesIssued: [newNotice, ...c.statutoryNoticesIssued]
        };
      }
      return c;
    });

    setContractors(updated);
    setSelectedContractor({
      ...selectedContractor,
      riskStatus: 'warning',
      demeritPoints: selectedContractor.demeritPoints + 10,
      activePit: 'Notice Issued',
      statutoryNoticesIssued: [newNotice, ...selectedContractor.statutoryNoticesIssued]
    });

    setShowNoticeModal(false);
    alert(
      `STATUTORY NOTICE OFFICIALLY ISSUED!\n\n` +
      `Notice ID: ${noticeId}\n` +
      `Agency: ${selectedContractor.name}\n` +
      `Issued By: ${officerName} (Statutory Officer)\n` +
      `Notice Type: ${noticeType}\n` +
      `Regulation: ${noticeRegulation}\n\n` +
      `Status: Dispatched to DGMS Eastern Circle & Contractor Principal.`
    );
  };

  // Revoke/Suspend DGMS Authorization Handler
  const handleRevokeSuspend = () => {
    const confirmAction = window.confirm(
      `CRITICAL ENFORCEMENT ACTION:\n\n` +
      `Are you sure you want to REVOKE / SUSPEND DGMS In-Pit Turnstile Authorization for:\n` +
      `${selectedContractor.name}?\n\n` +
      `This will immediately deactivate all ${selectedContractor.personnelCount} biometric RFID cards and suspend haulage permits under CMR 2017 Regulation 130.`
    );

    if (confirmAction) {
      const updated = contractors.map((c) => {
        if (c.id === selectedContractor.id) {
          return {
            ...c,
            riskStatus: 'warning' as const,
            activePit: 'ACCESS REVOKED / SUSPENDED',
            sampleWorkers: c.sampleWorkers.map((w) => ({
              ...w,
              turnstileStatus: 'TURNSTILE_LOCKED' as const
            }))
          };
        }
        return c;
      });
      setContractors(updated);
      setSelectedContractor({
        ...selectedContractor,
        riskStatus: 'warning',
        activePit: 'ACCESS REVOKED / SUSPENDED',
        sampleWorkers: selectedContractor.sampleWorkers.map((w) => ({
          ...w,
          turnstileStatus: 'TURNSTILE_LOCKED'
        }))
      });
      alert(
        `DGMS Authorization Suspended!\n\n` +
        `Agency: ${selectedContractor.name}\n` +
        `Turnstiles: LOCKED across Jharia Pit Gates 1, 2, and 4.\n` +
        `Action authenticated by: ${officerName}.`
      );
    }
  };

  // Batch Renew Gate Pass
  const handleRenewGatePass = () => {
    alert(
      `VTC Gate Pass & PME Clearance Renewed for 180 Days!\n\n` +
      `Agency: ${selectedContractor.name}\n` +
      `Total Personnel Endorsed: ${selectedContractor.personnelCount} Workers\n` +
      `Digital signature sealed under Mines Act Form-B.`
    );
  };

  return (
    <div id="labour-contractors-view" className="w-full flex flex-col py-2 space-y-6">
      
      {/* 1. HEADER & REGISTER AGENCY OPTION (User requirement: Contractor Labor and DGMS VTS Gate Pass Governance, and there will be a Register Agency option) */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-[#0d1c33] via-[#091527] to-[#0d1c33] border-2 border-amber-500/60 p-5 rounded-2xl shadow-2xl relative overflow-hidden">
        {/* Top Tricolor Sovereign Stripe */}
        <div className="w-full h-1 bg-gradient-to-r from-[#FF671F] via-[#FFFFFF] to-[#138808] absolute top-0 left-0"></div>

        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-mono">
            <button
              onClick={() => setActiveView('national-command')}
              className="hover:text-amber-400 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-sm">home</span>
              <span>Home</span>
            </button>
            <span>/</span>
            <span className="text-amber-400 font-bold">Labor &amp; Form-B Governance</span>
          </div>
          <h2 className="font-headline text-xl md:text-2xl font-bold text-white font-serif tracking-tight flex items-center gap-2">
            <span>Contractor Labor and DGMS VTC Gate Pass Governance</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Mines Act Form-B Statutory Register &amp; Vocational Training Gate Pass Compliance Console (DGMS Cir. 02/2019)
          </p>
        </div>

        {/* Top Actions: Register Agency + Launch AI OCR */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Register Agency Option (User requirement: there will be a Register Agency option) */}
          <button
            onClick={() => setShowRegisterAgencyModal(true)}
            className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold px-4 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.35)] border border-amber-300"
          >
            <span className="material-symbols-outlined text-base">domain_add</span>
            <span>+ Register Agency</span>
          </button>

          <button
            onClick={() => setActiveView('labour-ai-ocr')}
            className="bg-[#10223a] hover:bg-[#183254] text-cyan-300 border border-cyan-500/40 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow"
          >
            <span className="material-symbols-outlined text-base">document_scanner</span>
            <span>AI OCR Gazette Parser</span>
          </button>
        </div>
      </div>

      {/* 2. TOP 4 KEY METRICS (User requirement: how many active contract employees are there, VTC Gate Pass Compliance will be there, PNF or Line Medical Fitness will be there, Statutory Penalty Points will be there) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        {/* Metric 1: Active Contract Employees - Saffron / Amber Theme */}
        <div className="bg-gradient-to-br from-[#0d1c33] via-[#091527] to-[#070e1a] border-2 border-amber-500/60 p-4 sm:p-5 rounded-2xl shadow-xl relative overflow-hidden group hover:border-amber-400 transition-all">
          <div className="w-full h-1 bg-gradient-to-r from-[#FF671F] via-[#FFFFFF] to-[#138808] absolute top-0 left-0"></div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase text-slate-300 font-bold tracking-wider">Active Contract Employees</span>
            <span className="material-symbols-outlined text-amber-400 text-xl group-hover:scale-110 transition-transform">groups</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-2 tracking-tight">
            {totalActiveWorkers.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1.5 mt-2 bg-[#040913]/90 px-2 py-1 rounded-lg border border-slate-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>100% Shift Muster Synced • 4 Pits</span>
          </div>
        </div>

        {/* Metric 2: VTC Gate Pass Compliance - India Green / Emerald Theme */}
        <div className="bg-gradient-to-br from-[#0d1c33] via-[#091527] to-[#070e1a] border-2 border-emerald-500/60 p-4 sm:p-5 rounded-2xl shadow-xl relative overflow-hidden group hover:border-emerald-400 transition-all">
          <div className="w-full h-1 bg-gradient-to-r from-[#FF671F] via-[#FFFFFF] to-[#138808] absolute top-0 left-0"></div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase text-slate-300 font-bold tracking-wider">VTC Gate Pass Compliance</span>
            <span className="material-symbols-outlined text-emerald-400 text-xl group-hover:scale-110 transition-transform">badge</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-2 tracking-tight">
            {avgVtcCompliance}%
          </div>
          <div className="text-[10px] text-slate-300 mt-2 bg-[#040913]/90 px-2 py-1 rounded-lg border border-slate-800 truncate">
            Vocational Training Certified (DGMS)
          </div>
        </div>

        {/* Metric 3: PME / Line Medical Fitness - Ashoka White / Cyan Theme */}
        <div className="bg-gradient-to-br from-[#0d1c33] via-[#091527] to-[#070e1a] border-2 border-cyan-500/60 p-4 sm:p-5 rounded-2xl shadow-xl relative overflow-hidden group hover:border-cyan-400 transition-all">
          <div className="w-full h-1 bg-gradient-to-r from-[#FF671F] via-[#FFFFFF] to-[#138808] absolute top-0 left-0"></div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase text-slate-300 font-bold tracking-wider">PME Line Medical Fitness</span>
            <span className="material-symbols-outlined text-cyan-400 text-xl group-hover:scale-110 transition-transform">health_and_safety</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-300 mt-2 tracking-tight">
            {avgPmeFitness}%
          </div>
          <div className="text-[10px] text-slate-300 mt-2 bg-[#040913]/90 px-2 py-1 rounded-lg border border-slate-800 truncate">
            Periodic Medical Exam &amp; Audio Valid
          </div>
        </div>

        {/* Metric 4: Statutory Penalty Points - Safety Alert Demerit Theme */}
        <div className="bg-gradient-to-br from-[#0d1c33] via-[#091527] to-[#070e1a] border-2 border-red-500/60 p-4 sm:p-5 rounded-2xl shadow-xl relative overflow-hidden group hover:border-red-400 transition-all">
          <div className="w-full h-1 bg-gradient-to-r from-[#FF671F] via-[#FFFFFF] to-[#138808] absolute top-0 left-0"></div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase text-slate-300 font-bold tracking-wider">Statutory Penalty Points</span>
            <span className="material-symbols-outlined text-red-400 text-xl group-hover:scale-110 transition-transform">gavel</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-red-400 mt-2 tracking-tight">
            {totalDemerits} <span className="text-xs text-slate-400 font-normal">pts</span>
          </div>
          <div className="text-[10px] text-amber-300 mt-2 bg-[#040913]/90 px-2 py-1 rounded-lg border border-slate-800 truncate">
            Accumulated Safety Demerit Exposure
          </div>
        </div>
      </div>

      {/* 3. SEARCH OPTIONS & FILTER CHIPS (User requirement: search options for the providers, Approved Mining Contractors we will search it, such as. And there will be options of All Contractor, High Risk, VTC Return Expiring and many all) */}
      <div className="bg-gradient-to-r from-[#0d1c33] via-[#091527] to-[#0d1c33] border-2 border-amber-500/50 p-4.5 rounded-2xl shadow-xl space-y-3 font-mono relative overflow-hidden">
        {/* Top Tricolor Micro Accent */}
        <div className="w-full h-1 bg-gradient-to-r from-[#FF671F] via-[#FFFFFF] to-[#138808] absolute top-0 left-0"></div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
          {/* Search bar */}
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-amber-400 text-base">
              search
            </span>
            <input
              type="text"
              placeholder="Search Approved Mining Contractors, vendor code, active pit, HEMM, blasting..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#050c18] border border-slate-700/90 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 shadow-inner"
            />
          </div>

          <span className="text-xs text-slate-300 font-bold hidden sm:inline bg-[#050c18] px-3 py-2 rounded-xl border border-slate-800 shrink-0">
            <span className="text-amber-400">{filteredContractors.length}</span> of {contractors.length} Agencies Listed
          </span>
        </div>

        {/* Filter Pills (User requirement: All Contractor, High Risk, VTC Return Expiring and many all) */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80 text-xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold mr-1">Quick Filters:</span>
          
          <button
            onClick={() => setSelectedFilter('ALL')}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              selectedFilter === 'ALL'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Contractors ({contractors.length})
          </button>

          <button
            onClick={() => setSelectedFilter('HIGH_RISK')}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
              selectedFilter === 'HIGH_RISK'
                ? 'bg-red-600 text-white shadow'
                : 'bg-red-950/40 text-red-300 hover:bg-red-900/60 border border-red-500/40'
            }`}
          >
            <span className="material-symbols-outlined text-xs">warning</span>
            <span>High Risk (Demerits &gt; 20)</span>
          </button>

          <button
            onClick={() => setSelectedFilter('EXPIRING')}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
              selectedFilter === 'EXPIRING'
                ? 'bg-orange-500 text-slate-950 shadow'
                : 'bg-orange-950/40 text-orange-300 hover:bg-orange-900/60 border border-orange-500/40'
            }`}
          >
            <span className="material-symbols-outlined text-xs">timelapse</span>
            <span>VTC Return Expiring (&lt;30 Days)</span>
          </button>

          <button
            onClick={() => setSelectedFilter('EXEMPLARY')}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
              selectedFilter === 'EXEMPLARY'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60 border border-emerald-500/40'
            }`}
          >
            <span className="material-symbols-outlined text-xs">verified</span>
            <span>Exemplary Compliant</span>
          </button>

          <button
            onClick={() => setSelectedFilter('HEMM')}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              selectedFilter === 'HEMM'
                ? 'bg-cyan-500 text-slate-950 shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Tier-1 Heavy HEMM
          </button>

          <button
            onClick={() => setSelectedFilter('BLASTING')}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              selectedFilter === 'BLASTING'
                ? 'bg-cyan-500 text-slate-950 shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Drilling &amp; Blasting
          </button>
        </div>
      </div>

      {/* 4. MASTER-DETAIL LAYOUT: LEFT SIDE COMPANIES & RIGHT SIDE COMPLETE DETAILS */}
      {/* (User requirement: approved mining companies will be shown on the left side, and whichever we will select, their complete details will be shown on the right side, okay. Such as active labor, what are their roles, etc. etc., statutory compliance DGMS and all that.) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ------------------------------------------------------------- */}
        {/* LEFT COLUMN: APPROVED MINING COMPANIES LIST (5 cols) */}
        {/* ------------------------------------------------------------- */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#0d1c33] via-[#091527] to-[#070e1a] border-2 border-amber-500/60 rounded-2xl p-4.5 shadow-2xl space-y-3 font-mono relative overflow-hidden">
          {/* Top Tricolor Sovereign Stripe */}
          <div className="w-full h-1 bg-gradient-to-r from-[#FF671F] via-[#FFFFFF] to-[#138808] absolute top-0 left-0"></div>

          <div className="flex items-center justify-between pb-3 border-b border-slate-800 pt-1">
            <div>
              <h3 className="font-headline text-sm sm:text-base font-bold text-white font-serif tracking-wide">
                Approved Mining Contractors
              </h3>
              <p className="text-[10px] text-slate-300">DGMS VTC Turnstile Authorized Entities</p>
            </div>
            <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/40 shadow-sm">
              {filteredContractors.length} APPROVED
            </span>
          </div>

          {/* Contractors Cards Stream */}
          <div className="space-y-3 max-h-[780px] overflow-y-auto pr-1">
            {filteredContractors.map((agency) => {
              const isSelected = selectedContractor.id === agency.id;
              return (
                <div
                  key={agency.id}
                  onClick={() => setSelectedContractor(agency)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col gap-2.5 relative overflow-hidden ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#122847] via-[#0d1c33] to-[#091424] border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/40'
                      : 'bg-[#070e1a]/95 border-slate-800 hover:border-amber-500/50 hover:bg-[#0c182b] shadow-md'
                  }`}
                >
                  {/* Top line with Name and Risk Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-white text-xs leading-snug line-clamp-2">
                        {agency.name}
                      </h4>
                      <p className="text-[10px] text-slate-300 font-mono truncate mt-0.5">
                        {agency.code}
                      </p>
                    </div>

                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase shrink-0 border ${
                        agency.riskStatus === 'exemplary'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                          : agency.riskStatus === 'warning'
                          ? 'bg-red-950 text-red-300 border-red-500/50 animate-pulse'
                          : 'bg-amber-950 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      {agency.activePit}
                    </span>
                  </div>

                  {/* Metrics Row: Personnel, VTC, Demerits */}
                  <div className="grid grid-cols-3 gap-2 text-[10px] font-mono pt-2 border-t border-slate-800/80 bg-[#040913]/90 p-2.5 rounded-lg border border-slate-800/60">
                    <div>
                      <span className="text-slate-400 block text-[9px]">WORKERS:</span>
                      <span className="text-white font-bold">{agency.personnelCount}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">VTC PASS:</span>
                      <span className={`font-bold ${agency.vtcCompliance >= 90 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {agency.vtcCompliance}%
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">DEMERITS:</span>
                      <span className={`font-bold ${agency.demeritPoints >= 20 ? 'text-red-400' : 'text-amber-400'}`}>
                        {agency.demeritPoints} pts
                      </span>
                    </div>
                  </div>

                  {/* Expiry / Statutory Flag */}
                  <div className="flex items-center justify-between text-[10px] text-slate-300">
                    <span>Safety Lead: {agency.safetyOfficer}</span>
                    {agency.validityDaysLeft <= 30 ? (
                      <span className="text-orange-400 font-bold flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[11px]">timer</span>
                        <span>VTC Expiring ({agency.validityDaysLeft}d)</span>
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-medium">Valid license</span>
                    )}
                  </div>

                  {/* Active Indicator Bar */}
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-amber-400 to-orange-500 rounded-r"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* RIGHT COLUMN: COMPLETE DETAILS & STATUTORY ACTIONS (7 cols) */}
        {/* (User requirement: complete details will be shown on the right side, such as active labor, what are their roles, etc. etc., statutory compliance DGMS and all that. And if they are having some issue so I can issue also on their name, okay. Issue Statutory Notice, Audit Form B Register, and Revoke Suspend DGMS and some options like that as I uploaded in the wireframe.) */}
        {/* ------------------------------------------------------------- */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Main Contractor Profile Card */}
          <div className="bg-gradient-to-b from-[#0d1c33] via-[#091527] to-[#070e1a] border-2 border-amber-500/60 rounded-2xl p-5 shadow-2xl relative font-mono space-y-5 overflow-hidden">
            {/* Top Tricolor Sovereign Stripe */}
            <div className="w-full h-1 bg-gradient-to-r from-[#FF671F] via-[#FFFFFF] to-[#138808] absolute top-0 left-0"></div>

            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-800 pt-1">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-amber-300 uppercase bg-amber-500/20 px-2.5 py-0.5 rounded-lg border border-amber-500/40">
                    {selectedContractor.code}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg border uppercase ${
                    selectedContractor.riskStatus === 'exemplary'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                      : selectedContractor.riskStatus === 'warning'
                      ? 'bg-red-950 text-red-300 border-red-500/50'
                      : 'bg-amber-950 text-amber-300 border-amber-500/40'
                  }`}>
                    {selectedContractor.riskStatus} STANDING
                  </span>
                </div>
                <h3 className="font-headline text-lg md:text-xl font-bold text-white mt-2 font-serif">
                  {selectedContractor.name}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Contract: {selectedContractor.contractType} • {selectedContractor.activePit}
                </p>
              </div>

              {/* Status Box */}
              <div className="text-right bg-[#070e1a]/95 p-3 rounded-xl border border-slate-800 shadow-inner">
                <span className="text-[10px] text-slate-400 block font-bold">LICENSE VALIDITY</span>
                <span className="text-xs font-bold text-white">{selectedContractor.validity}</span>
                <span className="text-[10px] text-cyan-300 block mt-0.5">
                  VTC: {selectedContractor.vtcCenter}
                </span>
              </div>
            </div>

            {/* 1. ACTIVE LABOR & WORKFORCE ROLES BREAKDOWN (User requirement: active labor, what are their roles, etc. etc.) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-amber-400 text-base">engineering</span>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Active Labor &amp; Workforce Roles Breakdown ({selectedContractor.personnelCount} Total)
                  </h4>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-0.5 rounded-lg border border-emerald-500/40">
                  100% Biometric Enrolled
                </span>
              </div>

              {/* Role Distribution Chips in Master Statutory Access Composition */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
                <div className="bg-[#070e1a]/95 p-3 rounded-xl border border-slate-800 hover:border-amber-500/50 text-center shadow-inner transition-all">
                  <span className="text-[9px] text-slate-400 block font-semibold">HEAVY DUMPER</span>
                  <span className="text-base font-black text-amber-400 mt-0.5 block">
                    {selectedContractor.rolesBreakdown.dumperOperators}
                  </span>
                </div>
                <div className="bg-[#070e1a]/95 p-3 rounded-xl border border-slate-800 hover:border-cyan-500/50 text-center shadow-inner transition-all">
                  <span className="text-[9px] text-slate-400 block font-semibold">HYD. SHOVEL</span>
                  <span className="text-base font-black text-cyan-300 mt-0.5 block">
                    {selectedContractor.rolesBreakdown.shovelOperators}
                  </span>
                </div>
                <div className="bg-[#070e1a]/95 p-3 rounded-xl border border-slate-800 hover:border-emerald-500/50 text-center shadow-inner transition-all">
                  <span className="text-[9px] text-slate-400 block font-semibold">DRILL &amp; BLAST</span>
                  <span className="text-base font-black text-emerald-400 mt-0.5 block">
                    {selectedContractor.rolesBreakdown.drillMasters}
                  </span>
                </div>
                <div className="bg-[#070e1a]/95 p-3 rounded-xl border border-slate-800 hover:border-amber-500/50 text-center shadow-inner transition-all">
                  <span className="text-[9px] text-slate-400 block font-semibold">MECHANICS</span>
                  <span className="text-base font-black text-white mt-0.5 block">
                    {selectedContractor.rolesBreakdown.mechanicsElectricians}
                  </span>
                </div>
                <div className="bg-[#070e1a]/95 p-3 rounded-xl border border-slate-800 hover:border-slate-700 text-center shadow-inner transition-all col-span-2 sm:col-span-1">
                  <span className="text-[9px] text-slate-400 block font-semibold">PIT LABOUR</span>
                  <span className="text-base font-black text-slate-300 mt-0.5 block">
                    {selectedContractor.rolesBreakdown.generalPitLabour}
                  </span>
                </div>
              </div>

              {/* Sample In-Pit Workers Roster under this contractor */}
              <div className="space-y-2 pt-1">
                <span className="text-[10px] text-slate-300 uppercase font-bold block">
                  Active Worker Token Dossiers (Form-B In-Pit Roster):
                </span>
                <div className="space-y-2">
                  {selectedContractor.sampleWorkers.map((worker) => (
                    <div
                      key={worker.id}
                      className="bg-[#070e1a]/95 p-3 rounded-xl border border-slate-800 hover:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shadow-inner"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{worker.name}</span>
                          <span className="text-[10px] text-slate-300 font-mono">({worker.tokenId})</span>
                          <span className="text-[9px] bg-slate-900 text-amber-300 px-1.5 py-0.5 rounded border border-slate-700">
                            Blood {worker.bloodGroup}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {worker.role} • Lamp #{worker.capLampNo}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                        <span className={`px-2.5 py-0.5 rounded font-bold border ${
                          worker.vtcStatus === 'VALID'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-500/30'
                            : 'bg-red-950 text-red-300 border-red-500/50'
                        }`}>
                          VTC: {worker.vtcExpiryText}
                        </span>

                        <span className={`px-2.5 py-0.5 rounded font-bold border ${
                          worker.turnstileStatus === 'ACTIVE_IN_PIT'
                            ? 'bg-cyan-950 text-cyan-300 border-cyan-500/30'
                            : 'bg-red-950 text-red-300 border-red-500/50'
                        }`}>
                          {worker.turnstileStatus === 'ACTIVE_IN_PIT' ? '✓ IN PIT' : 'LOCKED'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. STATUTORY DGMS COMPLIANCE BREAKDOWN (User requirement: statutory compliance DGMS and all that) */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-cyan-400 text-base">verified_user</span>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Statutory DGMS Compliance Breakdown
                  </h4>
                </div>
                <span className="text-[10px] text-amber-300 font-bold bg-[#070e1a] px-2.5 py-0.5 rounded-lg border border-slate-800">
                  Penalty Exposure: {selectedContractor.penaltyExposure}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* VTC Bar */}
                <div className="bg-[#070e1a]/95 p-3.5 rounded-xl border border-slate-800 space-y-1.5 shadow-inner">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300">VTC Gate Pass Compliance:</span>
                    <span className="text-emerald-400 font-bold">{selectedContractor.vtcCompliance}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${selectedContractor.vtcCompliance}%` }}
                    ></div>
                  </div>
                </div>

                {/* PME Bar */}
                <div className="bg-[#070e1a]/95 p-3.5 rounded-xl border border-slate-800 space-y-1.5 shadow-inner">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300">Periodic Medical Exam (PME):</span>
                    <span className="text-cyan-300 font-bold">{selectedContractor.pmeFitness}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 rounded-full"
                      style={{ width: `${selectedContractor.pmeFitness}%` }}
                    ></div>
                  </div>
                </div>

                {/* Form B & EPF */}
                <div className="bg-[#070e1a]/95 p-3 rounded-xl border border-slate-800 text-[10px] flex justify-between shadow-inner">
                  <span className="text-slate-300">Form-B Digital Muster:</span>
                  <span className="text-white font-bold">{selectedContractor.formBStatus}</span>
                </div>

                <div className="bg-[#070e1a]/95 p-3 rounded-xl border border-slate-800 text-[10px] flex justify-between shadow-inner">
                  <span className="text-slate-300">EPF / ESIC Remittance:</span>
                  <span className="text-emerald-400 font-bold">{selectedContractor.epfEsicCompliance}% Remitted</span>
                </div>
              </div>

              {/* Active Notices Section if any */}
              {selectedContractor.statutoryNoticesIssued.length > 0 && (
                <div className="bg-red-950/50 border-2 border-red-500/60 p-3 rounded-xl space-y-1.5 text-xs shadow-lg">
                  <div className="flex items-center gap-1.5 text-red-300 font-bold">
                    <span className="material-symbols-outlined text-sm">warning</span>
                    <span>Active Statutory Enforcement Notices on Record:</span>
                  </div>
                  {selectedContractor.statutoryNoticesIssued.map((not) => (
                    <div key={not.id} className="flex justify-between text-[10px] text-slate-300">
                      <span>{not.id} • {not.type} ({not.regulation})</span>
                      <span className="text-red-400 font-bold">{not.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. STATUTORY ENFORCEMENT CONTROLS */}
            {/* (User requirement: And if they are having some issue so I can issue also on their name, okay. Issue Statutory Notice, Audit Form B Register, and Revoke Suspend DGMS and some options like that as I uploaded in the wireframe.) */}
            <div className="pt-3 border-t border-slate-800 space-y-2.5">
              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block">
                Statutory Enforcement &amp; Regulatory Actions:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                
                {/* ACTION 1: Issue Statutory Notice (User requirement: Issue Statutory Notice) */}
                <button
                  type="button"
                  onClick={() => setShowNoticeModal(true)}
                  className="bg-gradient-to-r from-red-950/90 via-red-900/80 to-red-950/90 hover:from-red-900 hover:to-red-800 border-2 border-red-500/60 hover:border-red-400 text-red-100 font-bold py-3 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg hover:scale-101"
                >
                  <span className="material-symbols-outlined text-sm text-red-400">gavel</span>
                  <span>Issue Statutory Notice</span>
                </button>

                {/* ACTION 2: Audit Form B Register (User requirement: Audit Form B Register) */}
                <button
                  type="button"
                  onClick={() => setShowAuditModal(true)}
                  className="bg-gradient-to-r from-cyan-950/90 via-cyan-900/80 to-cyan-950/90 hover:from-cyan-900 hover:to-cyan-800 border-2 border-cyan-500/60 hover:border-cyan-400 text-cyan-100 font-bold py-3 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg hover:scale-101"
                >
                  <span className="material-symbols-outlined text-sm text-cyan-400">fact_check</span>
                  <span>Audit Form B Register</span>
                </button>

                {/* ACTION 3: Revoke Suspend DGMS (User requirement: Revoke Suspend DGMS) */}
                <button
                  type="button"
                  onClick={handleRevokeSuspend}
                  className="bg-gradient-to-r from-amber-950/90 via-orange-950/80 to-red-950/90 hover:from-red-900 hover:to-orange-900 border-2 border-amber-500/60 hover:border-amber-400 text-amber-200 font-bold py-3 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg hover:scale-101"
                >
                  <span className="material-symbols-outlined text-sm text-amber-400">block</span>
                  <span>Revoke / Suspend DGMS</span>
                </button>

              </div>

              {/* Secondary Actions: Renew & Export */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 text-xs">
                <button
                  type="button"
                  onClick={handleRenewGatePass}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow"
                >
                  <span className="material-symbols-outlined text-sm">verified</span>
                  <span>Renew VTC Gate Pass Clearance</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert(`Exporting Official Form-B Muster Roll PDF for ${selectedContractor.name} with digital signatures...`)}
                  className="w-full sm:w-auto bg-[#070e1a] hover:bg-slate-800 border border-slate-700 text-slate-300 py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm text-amber-400">download</span>
                  <span>Export Form-B Register PDF</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: REGISTER AGENCY MODAL (User requirement: Register Agency option) */}
      {/* ========================================================================= */}
      {showRegisterAgencyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#091322] border-2 border-amber-500/60 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400">domain_add</span>
                <h3 className="font-bold text-white text-base">
                  Register Mining Contractor Agency (DGMS Form-B)
                </h3>
              </div>
              <button
                onClick={() => setShowRegisterAgencyModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterNewAgency} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Contractor Agency / Entity Name *:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deccan Earthworks & Mining Infra Ltd"
                  value={newAgencyName}
                  onChange={(e) => setNewAgencyName(e.target.value)}
                  className="w-full bg-[#050c18] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">
                    Vendor Registration Code:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BCCL-CONT-DEMI-55"
                    value={newAgencyCode}
                    onChange={(e) => setNewAgencyCode(e.target.value)}
                    className="w-full bg-[#050c18] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">
                    Workforce Strength (Headcount):
                  </label>
                  <input
                    type="number"
                    required
                    min={10}
                    max={2000}
                    value={newAgencyWorkers}
                    onChange={(e) => setNewAgencyWorkers(Number(e.target.value))}
                    className="w-full bg-[#050c18] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Contract Classification &amp; Work Type:
                </label>
                <select
                  value={newAgencyCategory}
                  onChange={(e) => setNewAgencyCategory(e.target.value)}
                  className="w-full bg-[#050c18] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Heavy Earthmoving Machinery (HEMM)">Heavy Earthmoving Machinery (HEMM)</option>
                  <option value="Drilling, Pre-split & Blasting">Drilling, Pre-split &amp; Blasting</option>
                  <option value="Overburden Haulage & Sump Dredging">Overburden Haulage &amp; Sump Dredging</option>
                  <option value="Crushing, Screening & Dispatch">Crushing, Screening &amp; Dispatch</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">
                    Allocated In-Pit Location:
                  </label>
                  <input
                    type="text"
                    required
                    value={newAgencyPit}
                    onChange={(e) => setNewAgencyPit(e.target.value)}
                    className="w-full bg-[#050c18] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">
                    Authorized Safety Officer:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. S. K. Verma"
                    value={newAgencySafetyOfficer}
                    onChange={(e) => setNewAgencySafetyOfficer(e.target.value)}
                    className="w-full bg-[#050c18] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Designated Vocational Training Center (VTC):
                </label>
                <select
                  value={newAgencyVtcCenter}
                  onChange={(e) => setNewAgencyVtcCenter(e.target.value)}
                  className="w-full bg-[#050c18] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="VTC Bhuli Central Institute">VTC Bhuli Central Institute (DGMS Dhanbad)</option>
                  <option value="DGMS Sijua Training Camp">DGMS Sijua Training Camp</option>
                  <option value="VTC Dhanbad Extension">VTC Dhanbad Extension</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterAgencyModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black rounded-xl cursor-pointer shadow-md"
                >
                  Register &amp; Enforce DGMS Compliance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ISSUE STATUTORY NOTICE MODAL (User requirement: Issue Statutory Notice) */}
      {/* ========================================================================= */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#091322] border-2 border-red-500/60 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-400">gavel</span>
                <h3 className="font-bold text-white text-base">
                  Issue Statutory Notice to {selectedContractor.name}
                </h3>
              </div>
              <button
                onClick={() => setShowNoticeModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleIssueNotice} className="space-y-3.5 text-xs">
              <div className="bg-red-950/40 p-3 rounded-xl border border-red-500/40 text-[11px] text-red-200">
                Notice will be served under the Mines Act 1952 &amp; Coal Mines Regulations 2017 to the contractor principal with copy to DGMS Eastern Circle.
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Statutory Notice Type *:
                </label>
                <select
                  value={noticeType}
                  onChange={(e) => setNoticeType(e.target.value)}
                  className="w-full bg-[#050c18] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-400"
                >
                  <option value="Show-Cause Notice under CMR 2017 Reg. 130">
                    Show-Cause Notice under CMR 2017 Reg. 130 (VTC Expiry)
                  </option>
                  <option value="Immediate Stop-Work Notice under Mines Act 1952 Sec 22">
                    Immediate Stop-Work Notice under Mines Act 1952 Sec 22
                  </option>
                  <option value="Rectification Order for Haul Road Speeding Demerits">
                    Rectification Order for Haul Road Speeding Demerits
                  </option>
                  <option value="Non-Compliance with Periodic Medical Examination (PME)">
                    Non-Compliance with Periodic Medical Examination (PME)
                  </option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Statutory Regulation Reference:
                </label>
                <input
                  type="text"
                  value={noticeRegulation}
                  onChange={(e) => setNoticeRegulation(e.target.value)}
                  className="w-full bg-[#050c18] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-400"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Specific Infraction &amp; Hearing Directives *:
                </label>
                <textarea
                  rows={3}
                  required
                  value={noticeRemarks}
                  onChange={(e) => setNoticeRemarks(e.target.value)}
                  className="w-full bg-[#050c18] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-red-400 font-serif leading-relaxed"
                ></textarea>
              </div>

              <div className="bg-[#050c18] p-2.5 rounded-lg border border-slate-800 text-[10px] text-slate-400 flex justify-between">
                <span>Issuing Authority: <strong className="text-white">{officerName}</strong></span>
                <span>Hearing Required within 7 Days</span>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNoticeModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl cursor-pointer shadow-md"
                >
                  Confirm &amp; Issue Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: AUDIT FORM B REGISTER MODAL (User requirement: Audit Form B Register) */}
      {/* ========================================================================= */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#091322] border-2 border-cyan-500/60 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-cyan-400">fact_check</span>
                <h3 className="font-bold text-white text-base">
                  Audit Form B Register • {selectedContractor.name.split(' ')[0]}
                </h3>
              </div>
              <button
                onClick={() => setShowAuditModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-slate-400 text-[10px] block font-bold">DIGITAL AUDIT VERIFICATION:</span>
                <div className="text-cyan-300 font-bold text-sm">
                  {selectedContractor.personnelCount} of {selectedContractor.personnelCount} Form-B Records Audited
                </div>
                <p className="text-[10px] text-slate-400">
                  All active tokens cross-checked against DGMS Central Vocational Training database.
                </p>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between bg-[#050c18] p-2 rounded border border-slate-800">
                  <span className="text-slate-400">VTC Gate Pass Validity:</span>
                  <span className="text-emerald-400 font-bold">{selectedContractor.vtcCompliance}% Passed</span>
                </div>
                <div className="flex justify-between bg-[#050c18] p-2 rounded border border-slate-800">
                  <span className="text-slate-400">PME Medical Fitness:</span>
                  <span className="text-cyan-300 font-bold">{selectedContractor.pmeFitness}% Passed</span>
                </div>
                <div className="flex justify-between bg-[#050c18] p-2 rounded border border-slate-800">
                  <span className="text-slate-400">EPF / ESIC Remittance:</span>
                  <span className="text-emerald-400 font-bold">100% Validated</span>
                </div>
                <div className="flex justify-between bg-[#050c18] p-2 rounded border border-slate-800">
                  <span className="text-slate-400">Auditing Officer:</span>
                  <span className="text-white font-bold">{officerName}</span>
                </div>
              </div>

              <div className="p-2.5 bg-[#050c18] rounded-lg border border-slate-800 text-[10px] space-y-0.5">
                <span className="text-slate-400 block font-bold">AUDIT CERTIFICATE MERKLE ROOT:</span>
                <span className="text-emerald-400 font-mono text-[9px] block break-all">
                  0x9f4812bc88fa01e9234bb71201948ba981240182408bcdef
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowAuditModal(false);
                  alert(`Audit Certificate Sealed with Officer DSC Key: ${officerName}.\nExported to DGMS Form-B Central Repository.`);
                }}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-600 text-slate-950 font-black rounded-xl text-xs cursor-pointer shadow"
              >
                Seal &amp; Endorse Form-B Audit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
