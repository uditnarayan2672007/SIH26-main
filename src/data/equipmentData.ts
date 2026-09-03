import { ComplianceCategory, HazardSeverity } from '../types';

export interface ScannedMiningAsset {
  qrCode: string;
  assetId: string;
  name: string;
  type: 'HEMM' | 'ZONE' | 'VENTILATION' | 'ELECTRICAL' | 'SAFETY_INFRA';
  sector: string;
  subLocation: string;
  collieryCode: string;
  coordinates: {
    lat: number;
    lng: number;
    altMsl: number;
  };
  applicableRegulations: string[];
  defaultCategory: ComplianceCategory;
  lastStatutoryInspection: string;
  nextInspectionDue: string;
  statutoryFitnessStatus: 'FIT_FOR_OPERATION' | 'MAINTENANCE_DUE' | 'STATUTORY_HOLD' | 'PROHIBITION_ACTIVE';
  dgmsCertificateNo: string;
  assignedSupervisor: string;
  specifications: {
    model: string;
    serialNo: string;
    makeYear: number;
    capacity: string;
    safetyFeatures: string[];
  };
  commonInspectionChecks: string[];
  suggestedObservations: {
    title: string;
    findings: string;
    severity: HazardSeverity;
    clause: string;
  }[];
}

export const MINING_ASSET_REGISTRY: ScannedMiningAsset[] = [
  {
    qrCode: 'DGMS-HEMM-SH04',
    assetId: 'HEMM-SH-04',
    name: 'Hydraulic Mining Shovel #04 (Tata Hitachi EX-1200)',
    type: 'HEMM',
    sector: 'Bench 3 - Coal Face Seam-IV',
    subLocation: 'North Pit Cut 2A',
    collieryCode: 'BCCL-JHR-02',
    coordinates: { lat: 23.7438, lng: 86.4189, altMsl: 172 },
    applicableRegulations: [
      'CMR 2017 - Regulation 107 (HEMM Operations & Audio-Visual Alarm)',
      'DGMS Tech Circular 02/2020 (Fire Suppression Systems in Shovels)'
    ],
    defaultCategory: 'SAFETY',
    lastStatutoryInspection: '2026-08-18',
    nextInspectionDue: '2026-08-25',
    statutoryFitnessStatus: 'FIT_FOR_OPERATION',
    dgmsCertificateNo: 'DGMS/EZ/HEMM/2024/7821',
    assignedSupervisor: 'R.K. Mahto (Shift Sirdar)',
    specifications: {
      model: 'Tata Hitachi EX-1200-6D',
      serialNo: 'TH-EX1200-0982',
      makeYear: 2022,
      capacity: '6.5 m³ Bucket / 650 kW',
      safetyFeatures: ['Auto Fire Suppression (AFSS)', 'Audio-Visual Reversing Alarm', 'Operator Fatigue Camera', 'Roll-Over Protection Structure (ROPS)']
    },
    commonInspectionChecks: [
      'AFSS nitrogen pressure gauge in green band (>120 bar)',
      'Hydraulic hose lines free of abrasive rubbing & fluid leaks',
      'Operator cabin emergency glass breaker & 6kg DCP extinguisher present',
      'Track pad tension and master link pin integrity'
    ],
    suggestedObservations: [
      {
        title: 'Shovel #04 Hydraulic Boom Line Fluid Weepage',
        findings: 'Minor fluid weepage observed at secondary boom hydraulic swivel manifold on Shovel #04. Spill containment tray deployed; requires seal replacement during shift change.',
        severity: 'MEDIUM',
        clause: 'CMR 2017 - Regulation 107 (HEMM Maintenance)'
      },
      {
        title: 'Shovel #04 Automatic Fire Suppression System (AFSS) Warning',
        findings: 'AFSS pressure gauge at 95 bar (below statutory threshold 110 bar). Cylinder recharge required immediately before resuming coal loading.',
        severity: 'HIGH',
        clause: 'DGMS Tech Circular 02/2020 (AFSS Fire Suppression)'
      }
    ]
  },
  {
    qrCode: 'DGMS-HEMM-DT18',
    assetId: 'HEMM-DT-18',
    name: 'Heavy Rear Dumper #18 (Komatsu HD785-7, 100-Tonner)',
    type: 'HEMM',
    sector: 'North Haul Road Sector 2 (Ramp 4 to OB Dump)',
    subLocation: 'Haul Road Ramp 4 Crest',
    collieryCode: 'BCCL-JHR-02',
    coordinates: { lat: 23.7421, lng: 86.4175, altMsl: 184 },
    applicableRegulations: [
      'CMR 2017 - Regulation 108 (Haul Road Berms & Dumper Braking Tests)',
      'DGMS (Tech) Circular No. 05 of 2019 (Rear Vision & Proximity Radar)'
    ],
    defaultCategory: 'SAFETY',
    lastStatutoryInspection: '2026-08-22',
    nextInspectionDue: '2026-08-29',
    statutoryFitnessStatus: 'FIT_FOR_OPERATION',
    dgmsCertificateNo: 'DGMS/EZ/DMP/2023/4419',
    assignedSupervisor: 'B.N. Singh (Overman)',
    specifications: {
      model: 'Komatsu HD785-7',
      serialNo: 'KOM-HD785-48190',
      makeYear: 2021,
      capacity: '100 Metric Tonnes Payload / 895 kW',
      safetyFeatures: ['Hydraulic Retarder Brake', 'Proximity Warning Radar with 360° Cameras', 'Auto Fire Suppression', 'Tilt/Tip Body Interlock']
    },
    commonInspectionChecks: [
      'Retarder and service brake dynamic test (stopping distance < 12m at 20 km/h)',
      'Proximity radar alarm sensor lenses clean and functional',
      'Dual rear view mirrors and ultrasonic reverse sensor operation',
      'Tyre tread depth > 25mm and no sidewall bulge/cut'
    ],
    suggestedObservations: [
      {
        title: 'Dumper #18 Rear Proximity Radar Ultrasonic Sensor Fault',
        findings: 'Ultrasonic blind-spot sensor #3 on rear axle showing intermittent communication fault code E-42. Manual marshalling required until recalibrated.',
        severity: 'HIGH',
        clause: 'DGMS (Tech) Circular No. 05 of 2019 (Proximity Warning)'
      },
      {
        title: 'Dumper #18 Service Retarder Brake Pressure Fluctuation',
        findings: 'Hydraulic retarder system showing 8% lag during loaded descent on Ramp 4. Dumper grounded for mechanical brake workshop test.',
        severity: 'CRITICAL_FATAL_RISK',
        clause: 'CMR 2017 - Regulation 108 (Braking Systems)'
      }
    ]
  },
  {
    qrCode: 'DGMS-ZONE-OBDUMP02',
    assetId: 'ZONE-OB-DUMP-02',
    name: 'Overburden Dump #02 Stability Monitoring Station',
    type: 'ZONE',
    sector: 'Overburden Dump #2 Crest (Pillar Station P-14)',
    subLocation: 'North-East Pit Rim',
    collieryCode: 'BCCL-JHR-02',
    coordinates: { lat: 23.7462, lng: 86.4215, altMsl: 215 },
    applicableRegulations: [
      'CMR 2017 - Regulation 106 (Overburden Dump Stability & Slope Angle)',
      'DGMS Tech Circular 08/2021 (Real-Time Slope Radar Monitoring)'
    ],
    defaultCategory: 'SAFETY',
    lastStatutoryInspection: '2026-08-20',
    nextInspectionDue: '2026-08-23',
    statutoryFitnessStatus: 'FIT_FOR_OPERATION',
    dgmsCertificateNo: 'DGMS/EZ/SLOPE/2025/1102',
    assignedSupervisor: 'Er. Sandeep Mukherjee (Geotech Officer)',
    specifications: {
      model: 'Geotechnical Slope Prism Benchmark',
      serialNo: 'GEO-PRISM-014',
      makeYear: 2023,
      capacity: 'Max Bench Height 30m / Slope Angle ≤ 37.5°',
      safetyFeatures: ['Continuous InSAR / Prism Target', 'Piezometer Pore Pressure Sensor', 'Crack Gauge Telemetry Node']
    },
    commonInspectionChecks: [
      'Visual inspection of dump crest for longitudinal tension cracks (> 15mm)',
      'Verification of 3m high safety earthen bund at dump crest edge',
      'Toe drainage trench clear of silt and rainwater accumulation',
      'Prism target clean with unobstructed line-of-sight to total station'
    ],
    suggestedObservations: [
      {
        title: 'OB Dump #2 Crest Longitudinal Tension Crack (35mm)',
        findings: 'Visual crack measuring 35mm width and 18m continuous length observed 4m behind dumping crest line. Immediate suspension of dumper tipping ordered.',
        severity: 'CRITICAL_FATAL_RISK',
        clause: 'CMR 2017 - Regulation 106 (Dump Stability)'
      },
      {
        title: 'OB Dump #2 Toe Siltation & Toe Drain Blockage',
        findings: 'Rain runoff has deposited 0.6m overburden silt in the peripheral toe drain, preventing free gravity discharge to sedimentation pond.',
        severity: 'MEDIUM',
        clause: 'CPCB Environmental Guidelines (Mine Runoff Management)'
      }
    ]
  },
  {
    qrCode: 'DGMS-VENT-FAN02',
    assetId: 'VENT-FAN-02',
    name: 'Main Surface Mechanical Ventilation Fan #02',
    type: 'VENTILATION',
    sector: 'Surface Exhaust Shaft South Bank',
    subLocation: 'Shaft Collar Elevation +195m',
    collieryCode: 'ECL-RNJ-UG4',
    coordinates: { lat: 23.6225, lng: 87.128, altMsl: 195 },
    applicableRegulations: [
      'CMR 2017 - Regulation 153 (Mechanical Ventilators & Air Quantity)',
      'CMR 2017 - Regulation 156 (Reversal of Airflow Arrangements)'
    ],
    defaultCategory: 'SAFETY',
    lastStatutoryInspection: '2026-08-15',
    nextInspectionDue: '2026-08-22',
    statutoryFitnessStatus: 'FIT_FOR_OPERATION',
    dgmsCertificateNo: 'DGMS/EZ/VENT/2024/0931',
    assignedSupervisor: 'G.C. Roy (Ventilation Officer)',
    specifications: {
      model: 'Voltas Axial Flow Main Mine Ventilator',
      serialNo: 'VOLT-AFV-2400',
      makeYear: 2020,
      capacity: '140 m³/sec Air Delivery @ 110 mm WG Static Pressure',
      safetyFeatures: ['Automatic Air Reversal Drift Doors', 'Water Gauge Alarm', 'Bearing Temperature Vibration Sensors', 'Dual 400 kW Drive Motors']
    },
    commonInspectionChecks: [
      'U-Tube water gauge static pressure reading (normal range 95-115 mm WG)',
      'Bearing vibration amplitude < 2.8 mm/s RMS on drive and non-drive ends',
      'Auxiliary diesel generator auto-crank test on main supply interruption',
      'Explosion door seal and water-trough integrity'
    ],
    suggestedObservations: [
      {
        title: 'Ventilation Fan #02 Bearing Temperature Warning',
        findings: 'Non-drive end bearing temperature logged at 68°C (alarm threshold 65°C). Lubrication greasing performed; requires thermal infrared surveillance.',
        severity: 'HIGH',
        clause: 'CMR 2017 - Regulation 153 (Ventilator Maintenance)'
      },
      {
        title: 'Ventilation Air Quantity Deficit in Panel #3 Return',
        findings: 'Air velocity measurement at main return airway measured 38 m/min (statutory minimum 45 m/min). Regulator door adjustment initiated.',
        severity: 'CRITICAL_FATAL_RISK',
        clause: 'CMR 2017 - Regulation 153 (Air Quantity Standards)'
      }
    ]
  },
  {
    qrCode: 'DGMS-ZONE-DUST03',
    assetId: 'ZONE-DUST-03',
    name: 'Coal Transfer Chute #03 Mist Suppression Array',
    type: 'SAFETY_INFRA',
    sector: 'Coal Handling Plant (CHP) Transfer Point 3',
    subLocation: 'Secondary Crusher Infeed Bunker',
    collieryCode: 'BCCL-JHR-02',
    coordinates: { lat: 23.7415, lng: 86.4152, altMsl: 180 },
    applicableRegulations: [
      'DGMS Tech Circular 07/2021 (Dust Suppression & Respirable Dust Sampling)',
      'Air (Prevention and Control of Pollution) Act 1981'
    ],
    defaultCategory: 'ENVIRONMENT',
    lastStatutoryInspection: '2026-08-21',
    nextInspectionDue: '2026-08-28',
    statutoryFitnessStatus: 'FIT_FOR_OPERATION',
    dgmsCertificateNo: 'CPCB/SPCB/CHP-DUST/2024/318',
    assignedSupervisor: 'P.K. Verma (Environment Officer)',
    specifications: {
      model: 'High Pressure Fine Fog Mist Sprayer System',
      serialNo: 'FOG-CHP-03-A',
      makeYear: 2023,
      capacity: '24 Spray Nozzles @ 15 Bar Water Pressure (0.8 m³/hr)',
      safetyFeatures: ['Auto Interlock with Conveyor Belt Motion', 'Secondary Slurry Filter', 'PM10 Ambient Laser Sensor']
    },
    commonInspectionChecks: [
      'All 24 atomizing mist nozzles free of coal slurry lime deposition',
      'Water pressure gauge reading ≥ 12 bar during conveyor running state',
      'Conveyor chute rubber skirting curtains intact without side blow-out',
      'Ambient PM10 particulate sensor calibration within 90 days'
    ],
    suggestedObservations: [
      {
        title: 'Chute #03 Mist Sprinklers Blocked by Coal Slurry',
        findings: '6 out of 24 atomizing mist nozzles clogged with fine coal slurry. Visible airborne dust plume rising during 800 TPH conveyor discharge.',
        severity: 'MEDIUM',
        clause: 'DGMS Tech Circular 07/2021 (Dust Control at Transfer Points)'
      }
    ]
  },
  {
    qrCode: 'DGMS-ELEC-SUB03',
    assetId: 'ELEC-SUB-03',
    name: 'Pit Bottom 3.3kV Flameproof Substation Transformer',
    type: 'ELECTRICAL',
    sector: 'Pit Bottom Electrical Chamber #03',
    subLocation: 'Inbye Substation No. 3',
    collieryCode: 'ECL-RNJ-UG4',
    coordinates: { lat: 23.621, lng: 87.1268, altMsl: -140 },
    applicableRegulations: [
      'Central Electricity Authority (Measures relating to Safety and Electric Supply) Reg 2010',
      'CMR 2017 - Regulation 186 (Flameproof Apparatus)'
    ],
    defaultCategory: 'SAFETY',
    lastStatutoryInspection: '2026-08-16',
    nextInspectionDue: '2026-08-23',
    statutoryFitnessStatus: 'FIT_FOR_OPERATION',
    dgmsCertificateNo: 'DGMS/EZ/ELEC/2023/8810',
    assignedSupervisor: 'A.K. Sen (Colliery Electrical Engineer)',
    specifications: {
      model: 'Flameproof Mining Transformer FLP-630kVA',
      serialNo: 'FLP-TX-630-99',
      makeYear: 2021,
      capacity: '3.3kV to 550V / 630 kVA Flameproof Group-I',
      safetyFeatures: ['Earth Leakage Relay (< 750mA trip)', 'Intrinsic Safety Pilot Interlock', 'Flameproof Flange Gap < 0.5mm', 'Nitrogen Gas Blanket Sensor']
    },
    commonInspectionChecks: [
      'Earth leakage test trip verified with 750mA test resistor button',
      'FLP enclosure machined flange gap measurement with 0.5mm feeler gauge',
      'All FLP bolts tightly torqued with no missing or corroded fasteners',
      'Fire buckets with dry sand and CO2 fire extinguishers in station'
    ],
    suggestedObservations: [
      {
        title: 'Substation FLP Transformer Flange Gap Exceeds 0.5mm',
        findings: 'Feeler gauge measurement on cable incoming terminal box shows 0.65mm flange gap (statutory FLP limit 0.50mm). Power isolated immediately.',
        severity: 'CRITICAL_FATAL_RISK',
        clause: 'CMR 2017 - Regulation 186 (Flameproof Apparatus Standards)'
      }
    ]
  },
  {
    qrCode: 'DGMS-MAG-EXP01',
    assetId: 'MAG-EXP-01',
    name: 'Licensed Explosives Magazine & Detonator Depot',
    type: 'SAFETY_INFRA',
    sector: 'Surface Explosives Magazine Complex Block-A',
    subLocation: 'Isolated Safety Zone (500m Exclusion Perimeter)',
    collieryCode: 'BCCL-JHR-02',
    coordinates: { lat: 23.751, lng: 86.411, altMsl: 198 },
    applicableRegulations: [
      'Explosives Act 1884 & Explosives Rules 2008 (PESO License)',
      'CMR 2017 - Regulation 160 (Storage & Transport of Explosives)'
    ],
    defaultCategory: 'SAFETY',
    lastStatutoryInspection: '2026-08-19',
    nextInspectionDue: '2026-08-26',
    statutoryFitnessStatus: 'FIT_FOR_OPERATION',
    dgmsCertificateNo: 'PESO/ER/DHN/EXP-2024/0014',
    assignedSupervisor: 'S.P. Choudhury (Magazine In-Charge)',
    specifications: {
      model: 'PESO Approved Class-2 Magazine',
      serialNo: 'PESO-MAG-DHN-01',
      makeYear: 2019,
      capacity: '25 Tonnes Emulsion Cartridge + 10,000 Electric Detonators',
      safetyFeatures: ['Lightning Conductor Earthing Grid (< 5 Ohms)', 'Double Brass Padlocks', '24x7 Armed Guard & CCTV', 'Thermally Insulated Cavity Wall']
    },
    commonInspectionChecks: [
      'Magazine temperature ≤ 35°C recorded in statutory logbook',
      'Lightning conductor earth resistance measured < 5.0 Ohms',
      'Detonator storage completely partitioned from high explosive emulsion',
      'Statutory Form 31 daily consumption balance reconciled with shift shotfirers'
    ],
    suggestedObservations: [
      {
        title: 'Explosives Magazine Earthing Pit Resistance 6.8 Ohms',
        findings: 'Annual earth resistance test of lightning protection grid measured 6.8 Ohms (exceeds statutory 5.0 Ohms). Charcoal-salt watering and pit re-conditioning required.',
        severity: 'HIGH',
        clause: 'PESO Guidelines & CMR 2017 Reg 160 (Lightning Protection)'
      }
    ]
  }
];

export function lookupMiningAssetByQR(qrText: string): ScannedMiningAsset | undefined {
  const trimmed = qrText.trim().toUpperCase();
  
  // Exact QR code match
  const exact = MINING_ASSET_REGISTRY.find(
    a => a.qrCode.toUpperCase() === trimmed || a.assetId.toUpperCase() === trimmed
  );
  if (exact) return exact;

  // Partial match by assetId or QR code
  return MINING_ASSET_REGISTRY.find(
    a => trimmed.includes(a.assetId.toUpperCase()) || 
         trimmed.includes(a.qrCode.toUpperCase()) ||
         a.name.toUpperCase().includes(trimmed)
  );
}
