import React, { useState } from 'react';
import { ActiveView } from '../types';

interface MobileInspectorViewProps {
  setActiveView: (view: ActiveView) => void;
  officerName?: string;
}

interface EquipmentPillarItem {
  id: string;
  name: string;
  type: 'HEMM' | 'PILLAR' | 'DRILL' | 'SHOVEL' | 'BOUNDARY';
  rfid: string;
  brakeTest: string;
  operator: string;
  status: string;
  spontaneousHeating?: string;
  location: string;
  imageUrl: string;
}

interface ObservationRecord {
  id: string;
  title: string;
  location: string;
  safetyRating: 'Level 1' | 'Level 2' | 'Level 3' | 'Level 4';
  ratingStars: number;
  regulation: string;
  equipmentPillar: string;
  audioApproved: boolean;
  audioDuration: string;
  geoTag: {
    lat: string;
    lon: string;
    alt: string;
    precision: string;
    timestamp: string;
    hash: string;
    photoUrl: string;
  };
  transcript: string;
  status: 'PENDING_ACTION' | 'DSC_SEALED' | 'RECTIFIED';
  filedBy: string;
}

interface ShiftMiner {
  tokenId: string;
  name: string;
  designation: string;
  capLampNo: string;
  selfRescuerTag: string;
  inTime: string;
  biometricMatch: number;
  alcoholBac: string;
  vtcValid: boolean;
  pmeFitness: string;
  status: 'IN_PIT' | 'SURFACE' | 'REST';
}

const DEFAULT_EQUIPMENT_LIST: EquipmentPillarItem[] = [
  {
    id: 'EQ-DP-44',
    name: 'BEML BH100 Haul Dumper #DP-44',
    type: 'HEMM',
    rfid: 'RF-9942-BCCL',
    brakeTest: 'VALIDATED 08:30 IST (CMR Reg 94)',
    operator: 'Rameshwar Mahato (HEMM-99)',
    status: 'DGMS CERTIFIED PASS',
    spontaneousHeating: 'Exhaust Temp: 142°C (Safe)',
    location: 'Pit 4 • Bench 4B Haul Road',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1U4m80DPyEdiiaBo44RS04cKsX-b2jLrA6Y8VnHCWtoY-Utnx9LMwOu75QbXjqFv7ZPCs4NO_PRyPHoh0GrKNgAOUS2ZLcggp6wlLzoIzGoopZakEQZWXr2T4OrEsHN5BqGLx5nf26fufKOcsl3GS7wyV26HtXCMhQHMgWeYkxhw_MbMD9b8VQz76WVu5kz9nF6Rg32TaloyRxQldubFV2R7coLZmYM4fHJ1aIzXIgZNKV6mGCYibofFWz-'
  },
  {
    id: 'EQ-EX-08',
    name: 'Komatsu PC2000 Hydraulic Shovel #EX-08',
    type: 'SHOVEL',
    rfid: 'RF-4819-BCCL-HQ',
    brakeTest: 'PASSED (CMR Reg 94 Hydraulic Check)',
    operator: 'B. C. Soren (Lic #DGMS-994)',
    status: 'DGMS CERTIFIED',
    spontaneousHeating: 'Hydraulic Seal: 100% Intact',
    location: 'Pit 4 • Bench 3 Coal Loading Face',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1XVd-n9BPei_BrENDoum04-cHpuHjBnklPUTTYSja8VlBUEM_dVNwwK0wlAKY8aJs9yxAcBTD_P270pcI049U6yLW4bVjhtYobfTTyR8Oe0I9lT2MwseJO_t5LizlMRiWE4ZL8p4pjWPetZzT44JH_eQ1sUb4M0j0gpXgD8j4Daj_VX6ZM6qjVkI3wkzLypp4Fz5aQBnsTx3BsjNviwnecmRDd2b5tfo1XZhS08dFONjHQo8ENmve3GlsC9'
  },
  {
    id: 'PIL-P-14B',
    name: 'In-Pit Coal Pillar #P-14B (Seam XIV)',
    type: 'PILLAR',
    rfid: 'RF-PL-8812-JHR',
    brakeTest: 'Spontaneous Heating: 28.4°C (Normal)',
    operator: 'Sardar Inspection Sector 2B',
    status: 'STRATA STABLE',
    spontaneousHeating: 'Graham Ratio: 0.18 • CO: 4 PPM',
    location: 'Seam XIV • Sector 2B Extraction Line',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1XMorKaDx8xPhx2avnO5B1inqwuNzsYD74J_-nQzsGSo6A-dbu-8HWInPC_vCCaz7WF3lugFLraiadC6X1nxDThk_CISsZRV9RN5H-zpTLsPXlgzh51SQSGnWeHbjEC-pakmNV_cqNbV39VetpRUUtjWJX66mB5Dn1auoufWCMpczLGFRr-5agPItmrCpnISI_wM0YfhD4TtizvspaX4HQbpeefajyFkM4t5mcFuO7cWRNpa0ZrXaKH3g8'
  },
  {
    id: 'EQ-DR-05',
    name: 'Sandvik Rotary Blast Drill #DR-05',
    type: 'DRILL',
    rfid: 'RF-7721-BLAST',
    brakeTest: 'Dust Extraction System: 99.4% Pass',
    operator: 'K. N. Tudu (Drill Master)',
    status: 'OPERATIONAL',
    spontaneousHeating: 'Vibration Isolators Intact',
    location: 'Bench 4 Overburden Drilling Pattern',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1U4m80DPyEdiiaBo44RS04cKsX-b2jLrA6Y8VnHCWtoY-Utnx9LMwOu75QbXjqFv7ZPCs4NO_PRyPHoh0GrKNgAOUS2ZLcggp6wlLzoIzGoopZakEQZWXr2T4OrEsHN5BqGLx5nf26fufKOcsl3GS7wyV26HtXCMhQHMgWeYkxhw_MbMD9b8VQz76WVu5kz9nF6Rg32TaloyRxQldubFV2R7coLZmYM4fHJ1aIzXIgZNKV6mGCYibofFWz-'
  },
  {
    id: 'PIL-BP-02',
    name: 'Boundary Danger Pillar #BP-02 (Goaf Line)',
    type: 'BOUNDARY',
    rfid: 'RF-BP-002-GOAF',
    brakeTest: 'Danger Wire Fencing Verified',
    operator: 'Mining Sardar Shift Handover',
    status: 'FENCED UNDER CMR 139',
    spontaneousHeating: 'Temp: 27.1°C (Inert atmosphere)',
    location: 'Old Workings North Barrier Zone',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1XMorKaDx8xPhx2avnO5B1inqwuNzsYD74J_-nQzsGSo6A-dbu-8HWInPC_vCCaz7WF3lugFLraiadC6X1nxDThk_CISsZRV9RN5H-zpTLsPXlgzh51SQSGnWeHbjEC-pakmNV_cqNbV39VetpRUUtjWJX66mB5Dn1auoufWCMpczLGFRr-5agPItmrCpnISI_wM0YfhD4TtizvspaX4HQbpeefajyFkM4t5mcFuO7cWRNpa0ZrXaKH3g8'
  }
];

const INITIAL_OBSERVATIONS: ObservationRecord[] = [
  {
    id: 'OBS-2026-881',
    title: 'Tension Crack Along Sector 2B Overburden Crest Bench #4',
    location: 'Jharia Pit 4 • Sector 2B Overburden Bench #4, RL +184m',
    safetyRating: 'Level 4',
    ratingStars: 4,
    regulation: 'CMR 2017 Reg. 106 - Strata & Slope Stability',
    equipmentPillar: 'BEML BH100 Haul Dumper #DP-44',
    audioApproved: true,
    audioDuration: '00:24',
    geoTag: {
      lat: '23°47\'22.14" N',
      lon: '86°25\'18.82" E',
      alt: '+184.2m RL',
      precision: '±0.8m NavIC Locked',
      timestamp: '2026-09-08 14:18:22 IST',
      hash: '0x88f4b912c401ae98d41098234190821340918bcde09',
      photoUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1UJ1zH_RMkscVLXZqdgz1SfHDjOqqs8ZC87XC5VPfgGkPU9_b_i2qUW7C6WWzJuUz4rQV3MSEz0K_Xjj6x8Rdv89ZOWwABMTyCtaQ5sFkDJKqCK5XftRH9FpXY4V8UuHBZkAB0lrcyhweqnXvfrXe2Xb8um7VE3kks8lKoKlZSf76Os3kOc9vrBSJ8Erp3VuqupzqGhfKuzLfU9nz1Dt5DGX3TMNXp_zQiUPNOH1VxCWtIUTmBVdU7SXnQF'
    },
    transcript: 'Overburden bench crest tension crack widening by 14 mm. Immediate 60m safety buffer demarcated and dumper movement redirected.',
    status: 'DSC_SEALED',
    filedBy: 'SWADHIN SAHA (Mine Manager)'
  },
  {
    id: 'OBS-2026-882',
    title: 'HEMM Reversing Audio-Visual Alarm Intermittent Failure',
    location: 'Jharia Pit 4 • Bench 3 Coal Stock Siding',
    safetyRating: 'Level 2',
    ratingStars: 2,
    regulation: 'CMR 2017 Reg. 93 - HEMM Machinery & Alarms',
    equipmentPillar: 'BEML BH100 Haul Dumper #DP-44',
    audioApproved: true,
    audioDuration: '00:18',
    geoTag: {
      lat: '23°47\'19.05" N',
      lon: '86°25\'22.40" E',
      alt: '+172.0m RL',
      precision: '±0.6m NavIC Locked',
      timestamp: '2026-09-08 13:45:10 IST',
      hash: '0x33c2a8f90214eb77109247180129841804b9812ef90',
      photoUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1U4m80DPyEdiiaBo44RS04cKsX-b2jLrA6Y8VnHCWtoY-Utnx9LMwOu75QbXjqFv7ZPCs4NO_PRyPHoh0GrKNgAOUS2ZLcggp6wlLzoIzGoopZakEQZWXr2T4OrEsHN5BqGLx5nf26fufKOcsl3GS7wyV26HtXCMhQHMgWeYkxhw_MbMD9b8VQz76WVu5kz9nF6Rg32TaloyRxQldubFV2R7coLZmYM4fHJ1aIzXIgZNKV6mGCYibofFWz-'
    },
    transcript: 'Audio-visual reversing beeper speaker terminal corroded. Workshop mechanic dispatched for replacement before deployment to bench.',
    status: 'PENDING_ACTION',
    filedBy: 'R. K. Mahato (Mining Sardar)'
  },
  {
    id: 'OBS-2026-883',
    title: 'Pillar #P-14B Methanometer Calibration & Spontaneous Heat Survey',
    location: 'Seam XIV • Sector 2B Extraction District',
    safetyRating: 'Level 3',
    ratingStars: 3,
    regulation: 'CMR 2017 Reg. 153 - Ventilation & Continuous Gas Level',
    equipmentPillar: 'In-Pit Coal Pillar #P-14B (Seam XIV)',
    audioApproved: true,
    audioDuration: '00:32',
    geoTag: {
      lat: '23°47\'25.80" N',
      lon: '86°25\'12.15" E',
      alt: '+160.5m RL',
      precision: '±0.9m NavIC Locked',
      timestamp: '2026-09-08 11:20:05 IST',
      hash: '0x99a0b1274ef998240019234812304918230498123bc',
      photoUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1XMorKaDx8xPhx2avnO5B1inqwuNzsYD74J_-nQzsGSo6A-dbu-8HWInPC_vCCaz7WF3lugFLraiadC6X1nxDThk_CISsZRV9RN5H-zpTLsPXlgzh51SQSGnWeHbjEC-pakmNV_cqNbV39VetpRUUtjWJX66mB5Dn1auoufWCMpczLGFRr-5agPItmrCpnISI_wM0YfhD4TtizvspaX4HQbpeefajyFkM4t5mcFuO7cWRNpa0ZrXaKH3g8'
    },
    transcript: 'CH4 returned 0.28%, Graham ratio 0.18. Multi-gas sensor zero calibration affirmed. No signs of spontaneous heating on rib coal.',
    status: 'DSC_SEALED',
    filedBy: 'SWADHIN SAHA (Mine Manager)'
  }
];

const INITIAL_MINERS: ShiftMiner[] = [
  {
    tokenId: 'MN-4401',
    name: 'Rameshwar Mahato',
    designation: 'Dumper Operator (HEMM Class-A)',
    capLampNo: 'CL-104',
    selfRescuerTag: 'SR-884',
    inTime: '05:48 IST',
    biometricMatch: 99.8,
    alcoholBac: '0.00% PASS',
    vtcValid: true,
    pmeFitness: 'Fit (Class A)',
    status: 'IN_PIT'
  },
  {
    tokenId: 'MN-4402',
    name: 'Babu Chand Soren',
    designation: 'Shovel Operator (Komatsu PC2000)',
    capLampNo: 'CL-109',
    selfRescuerTag: 'SR-902',
    inTime: '05:52 IST',
    biometricMatch: 99.4,
    alcoholBac: '0.00% PASS',
    vtcValid: true,
    pmeFitness: 'Fit (Class A)',
    status: 'IN_PIT'
  },
  {
    tokenId: 'MN-4403',
    name: 'Kaleshwar N. Tudu',
    designation: 'Blast Hole Drill Master',
    capLampNo: 'CL-114',
    selfRescuerTag: 'SR-811',
    inTime: '05:55 IST',
    biometricMatch: 100.0,
    alcoholBac: '0.00% PASS',
    vtcValid: true,
    pmeFitness: 'Fit (Class A)',
    status: 'IN_PIT'
  },
  {
    tokenId: 'MN-4404',
    name: 'R. K. Mahato',
    designation: 'Mining Sardar (CMR Reg 129 Cert)',
    capLampNo: 'CL-001',
    selfRescuerTag: 'SR-001',
    inTime: '05:30 IST',
    biometricMatch: 99.9,
    alcoholBac: '0.00% PASS',
    vtcValid: true,
    pmeFitness: 'Fit (Statutory Lead)',
    status: 'IN_PIT'
  },
  {
    tokenId: 'MN-4405',
    name: 'Manoj Kumar Sharma',
    designation: 'Certified Blasting Shotfirer',
    capLampNo: 'CL-042',
    selfRescuerTag: 'SR-319',
    inTime: '05:40 IST',
    biometricMatch: 99.7,
    alcoholBac: '0.00% PASS',
    vtcValid: true,
    pmeFitness: 'Fit (Class A)',
    status: 'IN_PIT'
  },
  {
    tokenId: 'MN-4406',
    name: 'Ashok Kumar Roy',
    designation: 'Ventilation & Methane Sirdar',
    capLampNo: 'CL-022',
    selfRescuerTag: 'SR-118',
    inTime: '05:35 IST',
    biometricMatch: 99.8,
    alcoholBac: '0.00% PASS',
    vtcValid: true,
    pmeFitness: 'Fit (Class A)',
    status: 'IN_PIT'
  }
];

export const MobileInspectorView: React.FC<MobileInspectorViewProps> = ({
  setActiveView,
  officerName = 'SWADHIN SAHA'
}) => {
  // Top navigation tabs
  const [activeTab, setActiveTab] = useState<'FIELD_OBSERVATION' | 'SARDAR_LOG' | 'BIOMETRIC_MUSTER'>('FIELD_OBSERVATION');

  // Scanner & Equipment states
  const [equipmentList] = useState<EquipmentPillarItem[]>(DEFAULT_EQUIPMENT_LIST);
  const [equipmentSearch, setEquipmentSearch] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentPillarItem>(DEFAULT_EQUIPMENT_LIST[0]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraMode, setCameraMode] = useState<'OPTICAL' | 'THERMAL' | 'NIGHT'>('OPTICAL');
  const [zoomLevel, setZoomLevel] = useState('1x');
  const [isScanningQR, setIsScanningQR] = useState(false);

  // Audio dictation states
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLang, setSelectedLang] = useState<'HIN' | 'BEN' | 'ENG'>('HIN');
  const [transcript, setTranscript] = useState(
    'पश्चिम बंच संख्या 4 पर ओवरबर्डन का झुकाव अनुमत कोण से अधिक प्रतीत होता है। पानी का जमाव तुरंत ड्रेनेज पम्प द्वारा हटाया जाए।'
  );

  // Core Observation Dossier Form states
  const [hazardSearchQuery, setHazardSearchQuery] = useState('');
  const [obsTitle, setObsTitle] = useState('Tension Crack along Sector 2B Overburden Crest Bench #4');
  const [obsLocation, setObsLocation] = useState('Jharia Pit 4 • Sector 2B Overburden Bench #4 (RL +184m)');
  const [safetyRating, setSafetyRating] = useState<'Level 1' | 'Level 2' | 'Level 3' | 'Level 4'>('Level 3');
  const [ratingStars, setRatingStars] = useState(3);
  const [regulation, setRegulation] = useState('CMR 2017 Reg. 106 - Strata & Slope Stability');
  const [audioApproved, setAudioApproved] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [geoTagPhoto, setGeoTagPhoto] = useState<string>(
    'https://lh3.googleusercontent.com/aida/AEtjO1UJ1zH_RMkscVLXZqdgz1SfHDjOqqs8ZC87XC5VPfgGkPU9_b_i2qUW7C6WWzJuUz4rQV3MSEz0K_Xjj6x8Rdv89ZOWwABMTyCtaQ5sFkDJKqCK5XftRH9FpXY4V8UuHBZkAB0lrcyhweqnXvfrXe2Xb8um7VE3kks8lKoKlZSf76Os3kOc9vrBSJ8Erp3VuqupzqGhfKuzLfU9nz1Dt5DGX3TMNXp_zQiUPNOH1VxCWtIUTmBVdU7SXnQF'
  );

  // Right side wireframe list of observations
  const [observations, setObservations] = useState<ObservationRecord[]>(INITIAL_OBSERVATIONS);
  const [selectedDossierModal, setSelectedDossierModal] = useState<ObservationRecord | null>(null);

  // Sardar Daily Statutory Log states
  const [sardarShift, setSardarShift] = useState<'SHIFT_1' | 'SHIFT_2' | 'SHIFT_3'>('SHIFT_1');
  const [sardarSeam, setSardarSeam] = useState('Seam XIV • Sector 2B Extraction Line');
  const [sardarDate] = useState('2026-09-08');
  const [gasCh4, setGasCh4] = useState('0.22%');
  const [gasCo, setGasCo] = useState('8 PPM');
  const [gasO2, setGasO2] = useState('20.8%');
  const [strataCheck, setStrataCheck] = useState(true);
  const [ventilationCheck, setVentilationCheck] = useState(true);
  const [dustCheck, setDustCheck] = useState(true);
  const [machineryCheck, setMachineryCheck] = useState(true);
  const [dangerZoneCheck, setDangerZoneCheck] = useState(true);
  const [sardarNotes, setSardarNotes] = useState(
    'All travel roadways inspected and free of fall. Benches dressed to 45 degree angle. Multi-gas detector check completed at 06:15 IST. 42 holes charged under controlled electronic pattern.'
  );
  const [sardarSigned, setSardarSigned] = useState(false);

  // Biometric Muster Master states
  const [minersList, setMinersList] = useState<ShiftMiner[]>(INITIAL_MINERS);
  const [minerSearch, setMinerSearch] = useState('');
  const [showBiometricScanModal, setShowBiometricScanModal] = useState(false);
  const [scanningMiner, setScanningMiner] = useState<ShiftMiner | null>(null);
  const [scanStep, setScanStep] = useState<'IDLE' | 'SCANNING' | 'VERIFIED'>('IDLE');

  // Filter equipment
  const filteredEquipment = equipmentList.filter(
    (e) =>
      e.name.toLowerCase().includes(equipmentSearch.toLowerCase()) ||
      e.rfid.toLowerCase().includes(equipmentSearch.toLowerCase()) ||
      e.location.toLowerCase().includes(equipmentSearch.toLowerCase())
  );

  // Toggle voice recording
  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      if (selectedLang === 'HIN') {
        setTranscript('रिकॉर्डिंग जारी... बंच 4B पर टेंशन क्रैक का विस्तार 3 मिलीमीटर रिकॉर्ड किया गया है। हवा में मिथेन 0.22% सामान्य।');
      } else if (selectedLang === 'BEN') {
        setTranscript('রেকর্ডিং চলছে... চার নম্বর বেঞ্চে জল জমার কারণে ড্রেনেজ পাম্প জরুরি প্রয়োজন। হাইওয়াল পর্যবেক্ষণ সম্পন্ন।');
      } else {
        setTranscript('Recording live... Highwall tension crack observed at 42m marker. Immediate berm regrading advised under CMR 106.');
      }
    } else {
      setIsRecording(false);
      setAudioApproved(true);
      alert('Voice dictation synthesized into statutory observation dossier with timestamp.');
    }
  };

  // Optical QR / Pillar scan simulation
  const handleTriggerOpticalScan = () => {
    setIsScanningQR(true);
    setTimeout(() => {
      setIsScanningQR(false);
      const nextEquip = equipmentList[Math.floor(Math.random() * equipmentList.length)];
      setSelectedEquipment(nextEquip);
      setObsLocation(nextEquip.location);
      alert(`Optical Scanner & RFID Lock Successful!\n\nTarget Identified: ${nextEquip.name}\nRFID Tag: ${nextEquip.rfid}\nLocation: ${nextEquip.location}`);
    }, 1200);
  };

  // Capture Camera Snapshot for Geo-tag
  const handleCaptureCameraPhoto = () => {
    setGeoTagPhoto(selectedEquipment.imageUrl);
    setIsCameraOpen(false);
    alert('Camera snapshot captured! Ingested into Core Observation Geo-tag Dossier with NavIC GPS lock.');
  };

  // Apply Standard Hazard Template
  const handleApplyTemplate = (title: string, reg: string, level: 'Level 1' | 'Level 2' | 'Level 3' | 'Level 4', stars: number) => {
    setObsTitle(title);
    setRegulation(reg);
    setSafetyRating(level);
    setRatingStars(stars);
  };

  // Submit Observation Form
  const handleSubmitObservation = (e: React.FormEvent) => {
    e.preventDefault();
    const newObs: ObservationRecord = {
      id: `OBS-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: obsTitle,
      location: obsLocation,
      safetyRating,
      ratingStars,
      regulation,
      equipmentPillar: selectedEquipment.name,
      audioApproved,
      audioDuration: '00:24',
      geoTag: {
        lat: '23°47\'22.14" N',
        lon: '86°25\'18.82" E',
        alt: '+184.2m RL',
        precision: '±0.8m NavIC Locked',
        timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }) + ' IST',
        hash: '0x' + Math.random().toString(16).slice(2, 10) + '9b2c401ae' + Date.now().toString(16),
        photoUrl: geoTagPhoto
      },
      transcript: transcript || 'Direct observational note affirmed on-site.',
      status: 'DSC_SEALED',
      filedBy: officerName
    };

    setObservations([newObs, ...observations]);
    alert(
      `Observation Filed & Cryptographically Sealed!\n\n` +
      `Dossier ID: ${newObs.id}\n` +
      `Regulation: ${newObs.regulation}\n` +
      `Safety Rating: ${newObs.safetyRating}\n` +
      `Audio Approved: ${newObs.audioApproved ? 'YES (Verified)' : 'NO'}\n` +
      `Geo-Tag: ${newObs.geoTag.lat}, ${newObs.geoTag.lon} (${newObs.geoTag.precision})\n` +
      `Cryptographic Hash: ${newObs.geoTag.hash}`
    );
  };

  // Submit Sardar Log
  const handleSignSardarLog = () => {
    setSardarSigned(true);
    alert(
      `Mining Sardar Daily Statutory Log (CMR 2017 Reg 129) Certified!\n\n` +
      `Officer: ${officerName}\n` +
      `Shift: ${sardarShift === 'SHIFT_1' ? 'Shift 1 (06:00-14:00)' : sardarShift === 'SHIFT_2' ? 'Shift 2 (14:00-22:00)' : 'Shift 3 (22:00-06:00)'}\n` +
      `Seam: ${sardarSeam}\n` +
      `Gas Checks: CH4 ${gasCh4}, CO ${gasCo}, O2 ${gasO2}\n` +
      `Statutory Endorsement: Authenticated under Central Mine Safety Registry.`
    );
  };

  // Handle Biometric Scan Trigger
  const handleOpenBiometricScan = (miner: ShiftMiner) => {
    setScanningMiner(miner);
    setScanStep('SCANNING');
    setShowBiometricScanModal(true);
    setTimeout(() => {
      setScanStep('VERIFIED');
    }, 1500);
  };

  const filteredMiners = minersList.filter(
    (m) =>
      m.name.toLowerCase().includes(minerSearch.toLowerCase()) ||
      m.tokenId.toLowerCase().includes(minerSearch.toLowerCase()) ||
      m.designation.toLowerCase().includes(minerSearch.toLowerCase())
  );

  return (
    <div id="mobile-inspector-view" className="w-full flex flex-col space-y-5 py-2">
      
      {/* 1. TOP HEADER & TELEMETRY RIBBON */}
      <div className="bg-gradient-to-r from-[#0a1628] via-[#07111e] to-[#050b14] border-2 border-amber-500/40 p-4 md:p-5 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-0.5 rounded-full text-xs font-mono font-bold">
                IN-PIT MOBILE SAFETY TERMINAL • DGMS IS-CLASS
              </span>
              <span className="text-slate-400 text-xs font-mono">Zone-0 ATEX Certified</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white font-serif tracking-tight flex items-center gap-2.5">
              <span>Mobile Field Safety Inspector</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Real-time in-pit hazard scanning, camera LiDAR telemetry, voice dictation, and statutory muster synchronization under CMR 2017.
            </p>
          </div>

          {/* GPS Telemetry Pill */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono bg-[#050c18] p-3 rounded-xl border border-cyan-500/40">
            <div className="flex items-center gap-1.5 text-cyan-300">
              <span className="material-symbols-outlined text-sm text-cyan-400 animate-pulse">satellite_alt</span>
              <span className="font-bold">23°47&apos;22&quot; N, 86°25&apos;18&quot; E</span>
            </div>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-bold">±0.8m NavIC LOCK</span>
            <span className="text-slate-600">|</span>
            <span className="text-amber-400 font-bold">+184m RL (Pit 4)</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">Officer: <strong className="text-white">{officerName}</strong></span>
          </div>
        </div>

        {/* 2. THREE PRIMARY MODE TABS (User requirement: mobile inspector field safety observation, Sardar Delhi statue log, and biometric master option which will click) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-5 pt-4 border-t border-slate-800/80">
          
          {/* TAB 1: Field Safety Observation */}
          <button
            onClick={() => setActiveTab('FIELD_OBSERVATION')}
            className={`p-3.5 rounded-xl border font-mono transition-all text-left flex items-center justify-between cursor-pointer ${
              activeTab === 'FIELD_OBSERVATION'
                ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/10 text-white'
                : 'bg-[#050c18] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${activeTab === 'FIELD_OBSERVATION' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                <span className="material-symbols-outlined text-lg">visibility</span>
              </div>
              <div>
                <span className="text-xs font-bold block">1. Field Safety Observation</span>
                <span className="text-[10px] text-slate-400">Scanner, Camera &amp; Dossier</span>
              </div>
            </div>
            {activeTab === 'FIELD_OBSERVATION' && (
              <span className="text-[10px] font-bold text-amber-300 bg-amber-500/30 px-2 py-0.5 rounded">ACTIVE</span>
            )}
          </button>

          {/* TAB 2: Sardar Daily Statutory Log */}
          <button
            onClick={() => setActiveTab('SARDAR_LOG')}
            className={`p-3.5 rounded-xl border font-mono transition-all text-left flex items-center justify-between cursor-pointer ${
              activeTab === 'SARDAR_LOG'
                ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/10 text-white'
                : 'bg-[#050c18] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${activeTab === 'SARDAR_LOG' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                <span className="material-symbols-outlined text-lg">history_edu</span>
              </div>
              <div>
                <span className="text-xs font-bold block">2. Sardar Daily Statutory Log</span>
                <span className="text-[10px] text-slate-400">CMR 2017 Reg 129 Diary</span>
              </div>
            </div>
            {activeTab === 'SARDAR_LOG' && (
              <span className="text-[10px] font-bold text-amber-300 bg-amber-500/30 px-2 py-0.5 rounded">ACTIVE</span>
            )}
          </button>

          {/* TAB 3: Biometric Muster Master */}
          <button
            onClick={() => setActiveTab('BIOMETRIC_MUSTER')}
            className={`p-3.5 rounded-xl border font-mono transition-all text-left flex items-center justify-between cursor-pointer ${
              activeTab === 'BIOMETRIC_MUSTER'
                ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/10 text-white'
                : 'bg-[#050c18] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${activeTab === 'BIOMETRIC_MUSTER' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                <span className="material-symbols-outlined text-lg">fingerprint</span>
              </div>
              <div>
                <span className="text-xs font-bold block">3. Biometric Master Option</span>
                <span className="text-[10px] text-slate-400">Form-B In-Pit Headcount</span>
              </div>
            </div>
            {activeTab === 'BIOMETRIC_MUSTER' && (
              <span className="text-[10px] font-bold text-amber-300 bg-amber-500/30 px-2 py-0.5 rounded">ACTIVE</span>
            )}
          </button>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: FIELD SAFETY OBSERVATION VIEW */}
      {/* (User requirement: equipment and pillar scanner, search equipment, open camera, and on right side core observation dosa with search option, observation title, location, safety rating, compilation and station regulation, audio approved, upload geo tag, and wireframe cards) */}
      {/* ========================================================================= */}
      {activeTab === 'FIELD_OBSERVATION' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* ------------------------------------------------------------- */}
          {/* LEFT PANEL: EQUIPMENT AND PILLAR SCANNER (4 cols) */}
          {/* ------------------------------------------------------------- */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Equipment & Pillar Scanner Card */}
            <div className="bg-[#091322] border border-cyan-500/40 rounded-2xl p-4 shadow-xl space-y-3 font-mono">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-cyan-400 text-lg">qr_code_scanner</span>
                  <h3 className="font-bold text-white text-sm">Equipment &amp; Pillar Scanner</h3>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/70 border border-emerald-500/40 px-2 py-0.5 rounded font-bold">
                  RFID ACTIVE
                </span>
              </div>

              {/* Search Equipment Input (User requirement: search equipment) */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  Search Equipment / In-Pit Pillar:
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-sm">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Search equipment ID (e.g. DP-44, EX-08, Pillar P-14B)..."
                    value={equipmentSearch}
                    onChange={(e) => setEquipmentSearch(e.target.value)}
                    className="w-full bg-[#050c18] border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Filtered Equipment List Selector */}
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {filteredEquipment.map((eq) => (
                  <button
                    key={eq.id}
                    onClick={() => {
                      setSelectedEquipment(eq);
                      setObsLocation(eq.location);
                    }}
                    className={`w-full p-2 rounded-lg text-left text-xs transition-all flex items-center justify-between cursor-pointer border ${
                      selectedEquipment.id === eq.id
                        ? 'bg-cyan-950/60 border-cyan-400 text-white'
                        : 'bg-[#050c18] border-slate-800/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="truncate">
                      <div className="font-bold text-xs truncate">{eq.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{eq.rfid} • {eq.location}</div>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-300 shrink-0 ml-1">
                      {eq.type}
                    </span>
                  </button>
                ))}
              </div>

              {/* OPEN CAMERA BUTTON (User requirement: open camera) */}
              <div className="pt-1">
                <button
                  onClick={() => setIsCameraOpen(!isCameraOpen)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                    isCameraOpen
                      ? 'bg-red-600 hover:bg-red-500 text-white border border-red-400'
                      : 'bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white border border-cyan-400'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">
                    {isCameraOpen ? 'no_photography' : 'photo_camera'}
                  </span>
                  <span>{isCameraOpen ? 'Close Camera Viewfinder' : '📷 Open Camera Scanner (HUD)'}</span>
                </button>
              </div>

              {/* CAMERA VIEWFINDER (When Opened) */}
              {isCameraOpen && (
                <div className="relative rounded-xl overflow-hidden border-2 border-cyan-400 shadow-2xl bg-black">
                  <div className="relative h-60 w-full bg-slate-950">
                    <img
                      src={selectedEquipment.imageUrl}
                      alt="Camera Viewfinder Stream"
                      className={`w-full h-full object-cover transition-all ${
                        cameraMode === 'THERMAL'
                          ? 'filter hue-rotate-180 invert'
                          : cameraMode === 'NIGHT'
                          ? 'filter brightness-125 sepia hue-rotate-90'
                          : ''
                      }`}
                    />

                    {/* Optical Reticle Targeting HUD */}
                    <div className="absolute inset-0 border-2 border-cyan-400/40 pointer-events-none flex items-center justify-center">
                      <div className="w-36 h-36 border border-cyan-400 rounded-xl relative flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></div>
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-cyan-300"></div>
                        <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-cyan-300"></div>
                        <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-cyan-300"></div>
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-cyan-300"></div>
                        <div className="absolute top-1/2 -left-3 w-2 h-0.5 bg-cyan-400"></div>
                        <div className="absolute top-1/2 -right-3 w-2 h-0.5 bg-cyan-400"></div>
                      </div>
                    </div>

                    {/* Top HUD Telemetry */}
                    <div className="absolute top-2 left-2 bg-slate-950/85 backdrop-blur-md px-2 py-0.5 rounded border border-cyan-500/50 text-[9px] text-cyan-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                      <span>LIDAR: 18.4m • TILT: -4.2° • ZOOM: {zoomLevel}</span>
                    </div>

                    {/* Camera Mode Toggles */}
                    <div className="absolute top-2 right-2 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setCameraMode('OPTICAL')}
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${cameraMode === 'OPTICAL' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-300'}`}
                      >
                        RGB
                      </button>
                      <button
                        type="button"
                        onClick={() => setCameraMode('THERMAL')}
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${cameraMode === 'THERMAL' ? 'bg-red-500 text-white' : 'bg-slate-900 text-slate-300'}`}
                      >
                        IR
                      </button>
                      <button
                        type="button"
                        onClick={() => setCameraMode('NIGHT')}
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${cameraMode === 'NIGHT' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-300'}`}
                      >
                        NVG
                      </button>
                    </div>

                    {/* Bottom Floating Snapshot / Scan Bar */}
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-1.5 bg-slate-950/90 backdrop-blur-md p-1.5 rounded-lg border border-slate-700">
                      <button
                        type="button"
                        onClick={handleTriggerOpticalScan}
                        disabled={isScanningQR}
                        className="flex-1 bg-cyan-900/80 hover:bg-cyan-800 text-cyan-200 border border-cyan-500/40 py-1 px-2 rounded text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-xs">qr_code_scanner</span>
                        <span>{isScanningQR ? 'Detecting RFID...' : 'Scan QR Code'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCaptureCameraPhoto}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-1 px-2 rounded text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow"
                      >
                        <span className="material-symbols-outlined text-xs">photo_camera</span>
                        <span>Capture for Geo-Tag</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Scanned Equipment Information Card */}
              <div className="bg-[#050c18] border border-slate-800 rounded-xl p-3 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-amber-300 font-bold truncate">{selectedEquipment.name}</span>
                  <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.5 rounded font-bold">
                    {selectedEquipment.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-300 pt-1">
                  <div>
                    <span className="text-slate-500 block">TAG:</span>
                    <span className="font-bold text-white">{selectedEquipment.rfid}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">OPERATOR:</span>
                    <span className="font-bold text-cyan-300 truncate">{selectedEquipment.operator}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 block">BRAKE / STABILITY CHECK:</span>
                    <span className="font-bold text-emerald-400">{selectedEquipment.brakeTest}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Multilingual Voice Audio Dictation Card */}
            <div className="bg-[#091322] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3 font-mono">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-amber-400 text-base">mic</span>
                  <h3 className="font-bold text-white text-xs">Statutory Audio Dictation</h3>
                </div>
                {/* Language Switcher Pills */}
                <div className="inline-flex rounded-lg bg-slate-900 border border-slate-800 p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedLang('HIN')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      selectedLang === 'HIN' ? 'bg-amber-500 text-slate-950 font-serif' : 'text-slate-400'
                    }`}
                  >
                    हिन्दी
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedLang('BEN')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      selectedLang === 'BEN' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                    }`}
                  >
                    বাংলা
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedLang('ENG')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      selectedLang === 'ENG' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                    }`}
                  >
                    ENG
                  </button>
                </div>
              </div>

              {/* Waveform Visualization & Start/Stop Button */}
              <div className="bg-[#050c18] p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 h-5">
                  {[4, 14, 8, 20, 16, 24, 18, 10, 22, 14, 8, 16, 12, 6, 18, 10].map((h, i) => (
                    <span
                      key={i}
                      className={`w-1 rounded-full transition-all duration-300 ${
                        isRecording ? 'bg-amber-400 animate-pulse' : 'bg-slate-700'
                      }`}
                      style={{ height: isRecording ? `${h}px` : '4px' }}
                    ></span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow ${
                    isRecording
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {isRecording ? 'stop_circle' : 'mic'}
                  </span>
                  <span>{isRecording ? 'Stop & Transcribe' : 'Start Dictation'}</span>
                </button>
              </div>

              {/* Real-time transcript box */}
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">
                  Audio Speech Transcript (Auto-Ingested):
                </label>
                <textarea
                  rows={2}
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  className="w-full bg-[#050c18] border border-slate-700 rounded-xl p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-serif leading-relaxed"
                ></textarea>
              </div>
            </div>

          </div>

          {/* ------------------------------------------------------------- */}
          {/* MIDDLE PANEL: CORE OBSERVATION DOSSIER (4 cols) */}
          {/* (User requirement: core observation dosa with search option, observation title, location, safety rating, compilation and station regulation, audio approved, upload geo tag) */}
          {/* ------------------------------------------------------------- */}
          <div className="lg:col-span-4 bg-[#091322] border-2 border-amber-500/40 rounded-2xl p-5 shadow-2xl relative font-mono space-y-4">
            <div className="w-full h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500 absolute top-0 left-0 rounded-t-2xl"></div>

            <div>
              <span className="text-[10px] text-amber-400 font-bold uppercase block">
                STATUTORY FIELD DOSSIER • CMR 2017 REG. 129
              </span>
              <h3 className="font-headline text-lg font-bold text-white mt-0.5 font-serif">
                Core Observation Dossier
              </h3>
            </div>

            <form onSubmit={handleSubmitObservation} className="space-y-3.5 text-xs">
              
              {/* 1. SEARCH OPTION (User requirement: search option) */}
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                  🔍 Search Standard Hazard Templates:
                </label>
                <input
                  type="text"
                  placeholder="Search templates (e.g. tension crack, methane, berm, misfire)..."
                  value={hazardSearchQuery}
                  onChange={(e) => setHazardSearchQuery(e.target.value)}
                  className="w-full bg-[#050c18] border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />

                {/* Quick Template Selector Pills */}
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  <button
                    type="button"
                    onClick={() => handleApplyTemplate('Tension Crack along Sector 2B Overburden Crest Bench #4', 'CMR 2017 Reg. 106 - Strata & Slope Stability', 'Level 4', 4)}
                    className="text-[9px] bg-red-950/70 text-red-300 border border-red-500/40 px-2 py-0.5 rounded hover:bg-red-900 cursor-pointer"
                  >
                    + Tension Crack (CMR 106)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyTemplate('Methanometer Drift & Gas Concentration Check', 'CMR 2017 Reg. 153 - Ventilation & Continuous Gas Level', 'Level 3', 3)}
                    className="text-[9px] bg-cyan-950/70 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded hover:bg-cyan-900 cursor-pointer"
                  >
                    + Gas Methane (CMR 153)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyTemplate('HEMM Audio-Visual Reversing Alarm Inoperative', 'CMR 2017 Reg. 93 - HEMM Machinery & Alarms', 'Level 2', 2)}
                    className="text-[9px] bg-amber-950/70 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded hover:bg-amber-900 cursor-pointer"
                  >
                    + Alarm Fail (CMR 93)
                  </button>
                </div>
              </div>

              {/* 2. OBSERVATION TITLE (User requirement: observation title) */}
              <div>
                <label className="text-[10px] text-slate-300 font-bold uppercase block mb-1">
                  Observation Title *:
                </label>
                <input
                  type="text"
                  required
                  value={obsTitle}
                  onChange={(e) => setObsTitle(e.target.value)}
                  className="w-full bg-[#050c18] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* 3. LOCATION (User requirement: location) */}
              <div>
                <label className="text-[10px] text-slate-300 font-bold uppercase block mb-1">
                  Pit Location / Bench Identifier *:
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-2.5 top-2 text-amber-400 text-sm">
                    pin_drop
                  </span>
                  <input
                    type="text"
                    required
                    value={obsLocation}
                    onChange={(e) => setObsLocation(e.target.value)}
                    className="w-full bg-[#050c18] border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              {/* 4. SAFETY RATING (User requirement: safety rating) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] text-slate-300 font-bold uppercase">
                    Safety Rating / Severity Assessment *:
                  </label>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span
                        key={s}
                        onClick={() => {
                          setRatingStars(s);
                          if (s >= 4) setSafetyRating('Level 4');
                          else if (s === 3) setSafetyRating('Level 3');
                          else if (s === 2) setSafetyRating('Level 2');
                          else setSafetyRating('Level 1');
                        }}
                        className={`material-symbols-outlined text-sm cursor-pointer ${s <= ratingStars ? 'text-amber-400' : 'text-slate-600'}`}
                      >
                        star
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-1.5">
                  {(['Level 1', 'Level 2', 'Level 3', 'Level 4'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => {
                        setSafetyRating(lvl);
                        if (lvl === 'Level 4') setRatingStars(5);
                        else if (lvl === 'Level 3') setRatingStars(3);
                        else if (lvl === 'Level 2') setRatingStars(2);
                        else setRatingStars(1);
                      }}
                      className={`py-1.5 px-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer text-center ${
                        safetyRating === lvl
                          ? lvl === 'Level 4'
                            ? 'bg-red-600 border-red-400 text-white shadow-md'
                            : lvl === 'Level 3'
                            ? 'bg-orange-500 border-orange-400 text-slate-950 font-black'
                            : 'bg-amber-500 border-amber-400 text-slate-950'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 block">
                  {safetyRating === 'Level 4'
                    ? 'CRITICAL: Triggers immediate work suspension & notice under Mines Act Sec 22.'
                    : safetyRating === 'Level 3'
                    ? 'HIGH: Rectification mandatory before next shift handover.'
                    : 'ROUTINE: Remediation sign-off by Mining Sardar within 24 hours.'}
                </span>
              </div>

              {/* 5. COMPILATION & STATUTORY REGULATION (User requirement: compilation and station regulation) */}
              <div>
                <label className="text-[10px] text-slate-300 font-bold uppercase block mb-1">
                  Statutory Regulation Reference *:
                </label>
                <select
                  value={regulation}
                  onChange={(e) => setRegulation(e.target.value)}
                  className="w-full bg-[#050c18] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="CMR 2017 Reg. 106 - Strata & Slope Stability">
                    CMR 2017 Reg. 106 - Strata &amp; Slope Stability
                  </option>
                  <option value="CMR 2017 Reg. 153 - Ventilation & Continuous Gas Level">
                    CMR 2017 Reg. 153 - Ventilation &amp; Continuous Gas Level
                  </option>
                  <option value="CMR 2017 Reg. 164 - Controlled Blasting Vibration Clearance">
                    CMR 2017 Reg. 164 - Controlled Blasting Vibration Clearance
                  </option>
                  <option value="CMR 2017 Reg. 93 - HEMM Machinery & Alarms">
                    CMR 2017 Reg. 93 - HEMM Machinery Brake &amp; Audio-Visual Alarm
                  </option>
                  <option value="CMR 2017 Reg. 129 - Overman / Mining Sardar Shift Handover">
                    CMR 2017 Reg. 129 - Overman / Mining Sardar Shift Handover
                  </option>
                  <option value="Mines Act 1952 Sec. 22 - Powers of Inspectors / Stop Work">
                    Mines Act 1952 Sec. 22 - Powers of Inspectors / Stop Work
                  </option>
                </select>
              </div>

              {/* 6. AUDIO APPROVED (User requirement: audio approved will be there) */}
              <div className="bg-[#050c18] border border-emerald-500/40 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-emerald-400 text-base">verified</span>
                    <span className="text-[11px] font-bold text-white">Audio Approved Memo</span>
                  </div>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={audioApproved}
                      onChange={(e) => setAudioApproved(e.target.checked)}
                      className="w-3.5 h-3.5 accent-emerald-500 rounded cursor-pointer"
                    />
                    <span className="text-[10px] text-emerald-300 font-bold">Approved &amp; Verified</span>
                  </label>
                </div>

                <div className="flex items-center justify-between bg-slate-900/80 p-2 rounded-lg border border-slate-800 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="flex items-center gap-1 text-cyan-300 font-bold hover:text-white cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {isPlayingAudio ? 'pause_circle' : 'play_circle'}
                    </span>
                    <span>{isPlayingAudio ? 'Playing...' : 'Play Voice Memo'}</span>
                  </button>
                  <span className="text-slate-400 font-mono">Duration: 00:24</span>
                  <span className="text-emerald-400 font-bold bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    SARDAR VERIFIED
                  </span>
                </div>
              </div>

              {/* 7. UPLOAD GEO TAG (User requirement: upload geo tag uh thing) */}
              <div className="bg-[#050c18] border border-cyan-500/40 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-cyan-300 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-cyan-400">add_location_alt</span>
                    <span>Upload Geo-Tag Photographic Evidence</span>
                  </span>
                  <span className="text-[9px] text-emerald-400 font-bold">±0.8m NavIC LOCK</span>
                </div>

                <div className="relative rounded-lg overflow-hidden border border-slate-700 group h-28 bg-black">
                  <img
                    src={geoTagPhoto}
                    alt="Geo-tagged photographic evidence"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-2 text-[9px]">
                    <div className="text-cyan-300 font-bold flex justify-between">
                      <span>LAT: 23°47&apos;22.14&quot; N • LON: 86°25&apos;18.82&quot; E</span>
                      <span className="text-amber-300">+184m RL</span>
                    </div>
                    <div className="text-slate-400 truncate">
                      SHA256: 0x88f4b912c401ae98d4109823419082... (Sec 65B Certified)
                    </div>
                  </div>
                </div>

                {/* Upload Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      const newSample = 'https://lh3.googleusercontent.com/aida/AEtjO1XMorKaDx8xPhx2avnO5B1inqwuNzsYD74J_-nQzsGSo6A-dbu-8HWInPC_vCCaz7WF3lugFLraiadC6X1nxDThk_CISsZRV9RN5H-zpTLsPXlgzh51SQSGnWeHbjEC-pakmNV_cqNbV39VetpRUUtjWJX66mB5Dn1auoufWCMpczLGFRr-5agPItmrCpnISI_wM0YfhD4TtizvspaX4HQbpeefajyFkM4t5mcFuO7cWRNpa0ZrXaKH3g8';
                      setGeoTagPhoto(newSample);
                      alert('New Geo-Tagged photographic record uploaded & verified with NavIC satellite coordinates.');
                    }}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs text-amber-400">upload_file</span>
                    <span>Upload Geo-Tag Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCaptureCameraPhoto}
                    className="flex-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-200 border border-cyan-500/40 py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs text-cyan-400">camera_alt</span>
                    <span>Use Camera Snap</span>
                  </button>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold py-3 px-4 rounded-xl text-xs shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-300"
              >
                <span className="material-symbols-outlined text-base">verified</span>
                <span>Submit &amp; Cryptographically Seal Observation (DSC)</span>
              </button>

            </form>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* RIGHT PANEL: WIREFRAME CARDS & ACTIVE IN-PIT DOSSIERS (4 cols) */}
          {/* (User requirement: right side something will be there as I uploaded on the wear frame, okay? Uh on the mobile inspector part) */}
          {/* ------------------------------------------------------------- */}
          <div className="lg:col-span-4 bg-[#091322] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3.5 font-mono">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <h3 className="font-bold text-white text-xs">Live Shift Observation Dossiers</h3>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Wireframe Inspector Stream (Pit 4)</p>
              </div>
              <span className="text-[10px] text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40 font-bold">
                {observations.length} Dockets Logged
              </span>
            </div>

            {/* Wireframe Dossier Cards Stream */}
            <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
              {observations.map((obs) => (
                <div
                  key={obs.id}
                  className="bg-[#050c18] border border-slate-800 rounded-xl p-3 hover:border-amber-500/50 transition-all space-y-2 shadow-md group"
                >
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                      {obs.id}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                        obs.safetyRating === 'Level 4'
                          ? 'bg-red-950 text-red-300 border-red-500 animate-pulse'
                          : obs.safetyRating === 'Level 3'
                          ? 'bg-orange-950 text-orange-300 border-orange-500'
                          : 'bg-slate-900 text-slate-300 border-slate-700'
                      }`}>
                        {obs.safetyRating}
                      </span>
                      {obs.audioApproved && (
                        <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.5 rounded flex items-center gap-0.5 font-bold">
                          <span className="material-symbols-outlined text-[10px]">mic</span>
                          <span>Audio OK</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail & Title */}
                  <div className="flex gap-2.5 items-start">
                    <img
                      src={obs.geoTag.photoUrl}
                      alt={obs.title}
                      className="w-14 h-14 rounded-lg object-cover border border-slate-700 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-white text-xs leading-snug line-clamp-2">
                        {obs.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {obs.regulation}
                      </p>
                    </div>
                  </div>

                  {/* Telemetry info */}
                  <div className="text-[9px] text-slate-400 bg-slate-900/90 p-1.5 rounded-lg border border-slate-800 space-y-0.5">
                    <div className="flex justify-between text-cyan-300">
                      <span>LOCATION: {obs.location.split('•')[0]}</span>
                      <span>{obs.geoTag.alt}</span>
                    </div>
                    <div className="text-slate-500 truncate">
                      NavIC: {obs.geoTag.lat}, {obs.geoTag.lon}
                    </div>
                  </div>

                  {/* Transcript quote */}
                  <p className="text-[10px] text-slate-300 italic line-clamp-2 pl-2 border-l-2 border-amber-500/60 font-serif">
                    &ldquo;{obs.transcript}&rdquo;
                  </p>

                  {/* Actions */}
                  <div className="pt-1 flex items-center justify-between gap-2 text-[10px]">
                    <span className="text-emerald-400 font-bold">
                      ✓ {obs.status}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedDossierModal(obs)}
                        className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-2 py-1 rounded text-[9px] font-bold cursor-pointer transition-all"
                      >
                        View Dossier
                      </button>
                      <button
                        onClick={() => alert(`Statutory Form-IV Notice Generated for Docket ${obs.id}!\n\nRegulation: ${obs.regulation}\nLocation: ${obs.location}\nVerified Officer: ${officerName}`)}
                        className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-2 py-1 rounded text-[9px] font-bold cursor-pointer transition-all"
                      >
                        Form-IV Notice
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: SARDAR DAILY STATUTORY LOG VIEW (CMR 2017 REGULATION 129) */}
      {/* (User requirement: Sardar Delhi statue log option will be there) */}
      {/* ========================================================================= */}
      {activeTab === 'SARDAR_LOG' && (
        <div className="bg-[#091322] border-2 border-amber-500/50 rounded-2xl p-6 shadow-2xl space-y-5 font-mono">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded text-xs font-bold">
                  CMR 2017 REGULATION 129
                </span>
                <span className="text-xs text-slate-400">Mining Sardar &amp; Overman Shift Diary</span>
              </div>
              <h3 className="font-headline text-lg md:text-xl font-bold text-white mt-1 font-serif">
                Sardar Daily Statutory Inspection Diary &amp; Handover Log
              </h3>
            </div>

            {/* Shift Picker */}
            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setSardarShift('SHIFT_1')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  sardarShift === 'SHIFT_1' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Shift 1 (06:00 - 14:00)
              </button>
              <button
                onClick={() => setSardarShift('SHIFT_2')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  sardarShift === 'SHIFT_2' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Shift 2 (14:00 - 22:00)
              </button>
              <button
                onClick={() => setSardarShift('SHIFT_3')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  sardarShift === 'SHIFT_3' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Shift 3 (22:00 - 06:00)
              </button>
            </div>
          </div>

          {/* Statutory Verification Grid: 6 Checkpoints */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
            
            {/* 1. Gas & Ventilation */}
            <div className="bg-[#050c18] p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-amber-400 font-bold">1. Gas &amp; Ventilation</span>
                <input
                  type="checkbox"
                  checked={ventilationCheck}
                  onChange={(e) => setVentilationCheck(e.target.checked)}
                  className="w-4 h-4 accent-amber-500"
                />
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-center text-[11px]">
                <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">CH4</span>
                  <input
                    type="text"
                    value={gasCh4}
                    onChange={(e) => setGasCh4(e.target.value)}
                    className="w-full bg-transparent text-center font-bold text-emerald-400 focus:outline-none"
                  />
                </div>
                <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">CO</span>
                  <input
                    type="text"
                    value={gasCo}
                    onChange={(e) => setGasCo(e.target.value)}
                    className="w-full bg-transparent text-center font-bold text-cyan-300 focus:outline-none"
                  />
                </div>
                <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">O2</span>
                  <input
                    type="text"
                    value={gasO2}
                    onChange={(e) => setGasO2(e.target.value)}
                    className="w-full bg-transparent text-center font-bold text-white focus:outline-none"
                  />
                </div>
              </div>
              <span className="text-[10px] text-slate-400 block">
                Flame Safety Lamp test certified before shift start.
              </span>
            </div>

            {/* 2. Strata & Slope Check */}
            <div className="bg-[#050c18] p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-amber-400 font-bold">2. Strata &amp; Slope</span>
                <input
                  type="checkbox"
                  checked={strataCheck}
                  onChange={(e) => setStrataCheck(e.target.checked)}
                  className="w-4 h-4 accent-amber-500"
                />
              </div>
              <p className="text-[11px] text-slate-300">
                Highwall benches dressed to 45°. Berm height ≥ 1.8m maintained on haul roads. No overhangs observed.
              </p>
              <span className="text-[10px] text-emerald-400 block">
                ✓ Visual &amp; SSR-XT Radar clearance affirmed.
              </span>
            </div>

            {/* 3. Dust Suppression */}
            <div className="bg-[#050c18] p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-amber-400 font-bold">3. Dust Suppression</span>
                <input
                  type="checkbox"
                  checked={dustCheck}
                  onChange={(e) => setDustCheck(e.target.checked)}
                  className="w-4 h-4 accent-amber-500"
                />
              </div>
              <p className="text-[11px] text-slate-300">
                Haul road water sprinklers active. Dust level: 1.4 mg/m³ (statutory limit &lt; 2.0 mg/m³).
              </p>
              <span className="text-[10px] text-emerald-400 block">
                ✓ 2 Water tankers deployed.
              </span>
            </div>

            {/* 4. Machinery & Trailing Cable */}
            <div className="bg-[#050c18] p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-amber-400 font-bold">4. HEMM Machinery Safety</span>
                <input
                  type="checkbox"
                  checked={machineryCheck}
                  onChange={(e) => setMachineryCheck(e.target.checked)}
                  className="w-4 h-4 accent-amber-500"
                />
              </div>
              <p className="text-[11px] text-slate-300">
                Reversing audio-visual alarms, blind spot mirrors, and fire suppression systems tested on all active dumpers.
              </p>
              <span className="text-[10px] text-cyan-300 block">
                ✓ 14 HEMM units passed.
              </span>
            </div>

            {/* 5. Danger Zones Fencing */}
            <div className="bg-[#050c18] p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-amber-400 font-bold">5. Danger Zones Fencing</span>
                <input
                  type="checkbox"
                  checked={dangerZoneCheck}
                  onChange={(e) => setDangerZoneCheck(e.target.checked)}
                  className="w-4 h-4 accent-amber-500"
                />
              </div>
              <p className="text-[11px] text-slate-300">
                CMR 2017 Reg 139 fencing along old goaf waterlogged workings verified intact with warning boards.
              </p>
              <span className="text-[10px] text-emerald-400 block">
                ✓ Barrier Pillar #BP-02 intact.
              </span>
            </div>

            {/* 6. Statutory Location */}
            <div className="bg-[#050c18] p-3.5 rounded-xl border border-slate-800 space-y-2">
              <span className="text-amber-400 font-bold block">6. Colliery District / Seam</span>
              <input
                type="text"
                value={sardarSeam}
                onChange={(e) => setSardarSeam(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-white"
              />
              <span className="text-[10px] text-slate-400 block">
                Date: {sardarDate} • Jharia Pit 4 Seam XIV
              </span>
            </div>

          </div>

          {/* Detailed Observations Text Box */}
          <div className="space-y-1.5 text-xs">
            <label className="text-slate-300 font-bold block">
              Mining Sardar Handover Remarks &amp; Shift Diary Entry:
            </label>
            <textarea
              rows={4}
              value={sardarNotes}
              onChange={(e) => setSardarNotes(e.target.value)}
              className="w-full bg-[#050c18] border border-slate-700 rounded-xl p-3 text-white text-xs leading-relaxed focus:outline-none focus:border-amber-400 font-serif"
            ></textarea>
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="text-slate-400">
              {sardarSigned
                ? '✓ Log signed with FIPS 140-2 Level 3 DSC. Transmitted to DGMS Dhanbad Central Vault.'
                : 'Pending digital endorsement by designated Statutory Officer.'}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSardarNotes(
                    'All traveling roads and working faces inspected. Highwall bench 4B stable. Ventilation velocity 42 m3/s. No inflammable gas observed. 48 miners accounted for at shift end.'
                  );
                }}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Auto-Fill Standard Handover
              </button>

              <button
                onClick={handleSignSardarLog}
                disabled={sardarSigned}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg ${
                  sardarSigned
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black'
                }`}
              >
                <span className="material-symbols-outlined text-sm">draw</span>
                <span>{sardarSigned ? 'Statutory Log Endorsed' : 'Digitally Endorse Log (DSC)'}</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: BIOMETRIC MASTER OPTION VIEW (FORM-B IN-PIT MUSTER) */}
      {/* (User requirement: biometric master option will be there which will click) */}
      {/* ========================================================================= */}
      {activeTab === 'BIOMETRIC_MUSTER' && (
        <div className="bg-[#091322] border-2 border-cyan-500/50 rounded-2xl p-6 shadow-2xl space-y-5 font-mono">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2.5 py-0.5 rounded text-xs font-bold">
                  MINES ACT 1952 FORM-B MUSTER ROLL
                </span>
                <span className="text-xs text-slate-400">Biometric Master &amp; In-Pit Headcount</span>
              </div>
              <h3 className="font-headline text-lg md:text-xl font-bold text-white mt-1 font-serif">
                Biometric Muster Master &amp; In-Pit Personnel Register
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const target = minersList[0];
                  handleOpenBiometricScan(target);
                }}
                className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow"
              >
                <span className="material-symbols-outlined text-sm">fingerprint</span>
                <span>Scan Miner Biometric (Face / Thumb)</span>
              </button>

              <button
                onClick={() => alert('Emergency Roll-Call Alert Broadcasted! All 48 miners verified safe at muster station.')}
                className="bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-500/50 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">crisis_alert</span>
                <span>Emergency Roll Call</span>
              </button>
            </div>
          </div>

          {/* 4 Telemetric Muster Counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="bg-[#050c18] p-3 rounded-xl border border-cyan-500/30">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">IN-PIT HEADCOUNT</span>
              <div className="text-2xl font-black text-cyan-300 mt-0.5">48 <span className="text-xs text-slate-400 font-normal">miners</span></div>
              <span className="text-[10px] text-emerald-400">100% In Pit Area</span>
            </div>

            <div className="bg-[#050c18] p-3 rounded-xl border border-emerald-500/30">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">BIOMETRIC AUTHENTICATED</span>
              <div className="text-2xl font-black text-emerald-400 mt-0.5">48 / 48</div>
              <span className="text-[10px] text-emerald-300">Face &amp; Fingerprint Validated</span>
            </div>

            <div className="bg-[#050c18] p-3 rounded-xl border border-amber-500/30">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">CAP LAMPS &amp; RESCUERS</span>
              <div className="text-2xl font-black text-amber-300 mt-0.5">48 Synchronized</div>
              <span className="text-[10px] text-slate-400">RFID Telemetry Tracked</span>
            </div>

            <div className="bg-[#050c18] p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">ZERO BAC (ALCOHOL)</span>
              <div className="text-2xl font-black text-white mt-0.5">100% PASS</div>
              <span className="text-[10px] text-emerald-400">0.00% Breathalyzer Tested</span>
            </div>
          </div>

          {/* Search Bar for Miners */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-sm">
              search
            </span>
            <input
              type="text"
              placeholder="Search miner token ID, name, or designation..."
              value={minerSearch}
              onChange={(e) => setMinerSearch(e.target.value)}
              className="w-full bg-[#050c18] border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Live Miners Muster Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/90 text-[10px] text-slate-400 uppercase border-b border-slate-800">
                  <th className="p-2.5">Token ID</th>
                  <th className="p-2.5">Miner Name &amp; Role</th>
                  <th className="p-2.5">Cap Lamp / Rescuer</th>
                  <th className="p-2.5">In-Time</th>
                  <th className="p-2.5">Biometric Match</th>
                  <th className="p-2.5">Breathalyzer (BAC)</th>
                  <th className="p-2.5">VTC &amp; PME</th>
                  <th className="p-2.5 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
                {filteredMiners.map((m) => (
                  <tr key={m.tokenId} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-2.5 font-bold text-cyan-300">{m.tokenId}</td>
                    <td className="p-2.5">
                      <div className="font-bold text-white">{m.name}</div>
                      <div className="text-[10px] text-slate-400">{m.designation}</div>
                    </td>
                    <td className="p-2.5">
                      <span className="text-amber-300 font-bold">{m.capLampNo}</span>
                      <span className="text-slate-500"> • {m.selfRescuerTag}</span>
                    </td>
                    <td className="p-2.5 text-slate-300">{m.inTime}</td>
                    <td className="p-2.5">
                      <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded text-[10px] font-bold">
                        {m.biometricMatch}% Match
                      </span>
                    </td>
                    <td className="p-2.5 text-emerald-400 font-bold">{m.alcoholBac}</td>
                    <td className="p-2.5">
                      <span className="text-slate-300">{m.pmeFitness}</span>
                    </td>
                    <td className="p-2.5 text-right">
                      <button
                        onClick={() => handleOpenBiometricScan(m)}
                        className="bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer"
                      >
                        Re-verify
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Synchronized with Central Ministry of Coal National Safety Database (Mines Act Form-B).</span>
            <button
              onClick={() => alert('Exporting Form-B Muster Roll PDF with Cryptographic Signatures...')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              <span>Export Form-B Register</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: VIEW FULL GEO-TAG DOSSIER DETAILS */}
      {/* ========================================================================= */}
      {selectedDossierModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#091322] border-2 border-cyan-500/60 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-cyan-400">verified</span>
                <h3 className="font-bold text-white text-base">
                  Statutory Geo-Tag Dossier • {selectedDossierModal.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDossierModal(null)}
                className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="relative rounded-xl overflow-hidden border border-slate-700 h-44 bg-black">
                <img
                  src={selectedDossierModal.geoTag.photoUrl}
                  alt={selectedDossierModal.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-3">
                  <span className="text-amber-300 font-bold text-sm">{selectedDossierModal.title}</span>
                  <span className="text-cyan-300 text-[10px]">{selectedDossierModal.location}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-[#050c18] p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[9px] block">REGULATION:</span>
                  <span className="text-white font-bold">{selectedDossierModal.regulation}</span>
                </div>
                <div className="bg-[#050c18] p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[9px] block">SAFETY RATING:</span>
                  <span className="text-amber-400 font-bold">{selectedDossierModal.safetyRating} ({selectedDossierModal.ratingStars} Stars)</span>
                </div>
                <div className="bg-[#050c18] p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[9px] block">COORDINATES &amp; ALTITUDE:</span>
                  <span className="text-cyan-300 font-bold">{selectedDossierModal.geoTag.lat}, {selectedDossierModal.geoTag.lon} ({selectedDossierModal.geoTag.alt})</span>
                </div>
                <div className="bg-[#050c18] p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[9px] block">AUDIO STATUS:</span>
                  <span className="text-emerald-400 font-bold">
                    {selectedDossierModal.audioApproved ? 'Approved Voice Memo (00:24)' : 'No Audio'}
                  </span>
                </div>
              </div>

              <div className="bg-[#050c18] p-3 rounded-lg border border-slate-800 text-[10px] space-y-1">
                <span className="text-slate-400 block font-bold">TAMPER-PROOF SHA-256 CRYPTOGRAPHIC HASH:</span>
                <span className="text-emerald-400 block break-all font-mono">
                  {selectedDossierModal.geoTag.hash}
                </span>
                <span className="text-slate-500 block">
                  Filed by: {selectedDossierModal.filedBy} • Time: {selectedDossierModal.geoTag.timestamp}
                </span>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-slate-300 font-serif italic text-xs leading-relaxed">
                &ldquo;{selectedDossierModal.transcript}&rdquo;
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedDossierModal(null)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: INTERACTIVE BIOMETRIC SCANNER MODAL */}
      {/* ========================================================================= */}
      {showBiometricScanModal && scanningMiner && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#091322] border-2 border-cyan-500/60 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 font-mono text-center">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-cyan-400">DGMS Biometric In-Pit Authenticator</span>
              <button
                onClick={() => setShowBiometricScanModal(false)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div className="w-24 h-24 mx-auto rounded-full bg-cyan-950/70 border-2 border-cyan-400 flex items-center justify-center relative overflow-hidden shadow-lg shadow-cyan-500/20">
                <span className={`material-symbols-outlined text-5xl ${scanStep === 'SCANNING' ? 'text-cyan-400 animate-pulse' : 'text-emerald-400'}`}>
                  {scanStep === 'SCANNING' ? 'fingerprint' : 'check_circle'}
                </span>
                {scanStep === 'SCANNING' && (
                  <div className="w-full h-1 bg-cyan-300 absolute top-0 animate-bounce"></div>
                )}
              </div>

              <div>
                <h4 className="text-base font-bold text-white">{scanningMiner.name}</h4>
                <p className="text-xs text-slate-400">{scanningMiner.tokenId} • {scanningMiner.designation}</p>
              </div>

              <div className="bg-[#050c18] p-3 rounded-xl border border-slate-800 text-xs text-left space-y-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Cap Lamp:</span>
                  <span className="text-amber-300 font-bold">{scanningMiner.capLampNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Alcohol BAC:</span>
                  <span className="text-emerald-400 font-bold">{scanningMiner.alcoholBac}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Biometric Score:</span>
                  <span className="text-cyan-300 font-bold">
                    {scanStep === 'SCANNING' ? 'Analyzing match...' : `${scanningMiner.biometricMatch}% Authenticated`}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowBiometricScanModal(false)}
              className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-600 text-slate-950 font-black rounded-xl text-xs cursor-pointer shadow"
            >
              {scanStep === 'SCANNING' ? 'Scanning...' : 'Done & Seal Muster Record'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
