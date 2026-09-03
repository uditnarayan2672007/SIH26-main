import React, { useState, useMemo } from 'react';
import { 
  Radio, 
  AlertTriangle, 
  Layers, 
  MapPin, 
  ShieldAlert, 
  Wind, 
  Zap, 
  Crosshair, 
  Volume2, 
  Droplet, 
  Eye, 
  CheckCircle2, 
  RefreshCw,
  Sparkles,
  Info,
  Activity,
  AlertOctagon,
  Flame,
  Sliders,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { IoTSensorNode, MineSite, FieldInspection } from '../types';

interface GISMapExplorerProps {
  mines?: MineSite[];
  sensors: IoTSensorNode[];
  selectedMine: MineSite | undefined;
  inspections: FieldInspection[];
  onTriggerSensorAlarm: (sensorId: string) => void;
  onInitiateBlastLockout: () => void;
  blastLockoutActive: boolean;
  onOpenNewInspection: () => void;
}

interface RiskZone {
  id: string;
  name: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  baseScore: number;
  sensorRisk: number;
  inspectionRisk: number;
  compositeRisk: number;
  level: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  category: 'GAS_VENTILATION' | 'SLOPE_GEOTECH' | 'ENVIRONMENTAL' | 'HAULAGE_MECHANICAL';
  dominantFactors: string[];
  recentIncidentsCount: number;
}

export const GISMapExplorer: React.FC<GISMapExplorerProps> = ({
  mines = [],
  sensors = [],
  selectedMine,
  inspections = [],
  onTriggerSensorAlarm,
  onInitiateBlastLockout,
  blastLockoutActive,
  onOpenNewInspection,
}) => {
  const safeSensors = Array.isArray(sensors) ? sensors : [];
  const safeInspections = Array.isArray(inspections) ? inspections : [];

  const [selectedSensor, setSelectedSensor] = useState<IoTSensorNode | null>(safeSensors[0] || null);
  const [selectedRiskZone, setSelectedRiskZone] = useState<RiskZone | null>(null);
  
  const [activeLayers, setActiveLayers] = useState({
    heatmap: true,
    gas: true,
    slope: true,
    environmental: true,
    blastRadius: true,
    workers: true,
    inspections: true
  });

  const [heatmapMode, setHeatmapMode] = useState<'COMPOSITE' | 'GAS' | 'SLOPE' | 'INSPECTION'>('COMPOSITE');
  const [heatmapOpacity, setHeatmapOpacity] = useState<number>(0.85);
  const [nearestCentre, setNearestCentre] = useState<MineSite | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const getSensorColor = (status: IoTSensorNode['status']) => {
    switch (status) {
      case 'CRITICAL_ALARM': return 'bg-rose-600 text-white animate-pulse border-rose-300 ring-4 ring-rose-500/40';
      case 'WARNING': return 'bg-amber-500 text-slate-950 border-amber-300 ring-2 ring-amber-500/30';
      case 'NORMAL': return 'bg-emerald-500 text-slate-950 border-emerald-300';
    }
  };

  const mineSensors = selectedMine 
    ? safeSensors.filter(s => s.mineId === selectedMine.id)
    : safeSensors;

  const findNearestCentre = () => {
    if (!navigator.geolocation) {
      setGpsError('GPS is unavailable in this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const current = { lat: position.coords.latitude, lng: position.coords.longitude };
        setUserLocation(current);
        const allCentres = Array.isArray(mines) && mines.length > 0 ? mines : safeSensors.length ? [] : [];
        const item = allCentres
          .map((centre) => ({
            ...centre,
            distanceKm: Math.hypot(current.lat - centre.coordinates.lat, current.lng - centre.coordinates.lng) * 111.32
          }))
          .sort((a, b) => a.distanceKm - b.distanceKm)[0];

        if (item) {
          setNearestCentre(item);
          setGpsError(null);
        } else {
          setGpsError('No government coal-centre data available for distance calculation.');
        }
      },
      () => {
        setGpsError('GPS permission was denied. Please allow location access to locate nearby coal centres.');
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  // Calculate Spatial Heatmap Risk Zones combining IoT readings + Historical Inspection Failure Density
  const riskZones = useMemo<RiskZone[]>(() => {
    // Count high severity inspections
    const criticalInspections = safeInspections.filter(i => i.severity === 'CRITICAL_FATAL_RISK').length;
    const highInspections = safeInspections.filter(i => i.severity === 'HIGH').length;
    const openViolations = safeInspections.filter(i => i.status === 'OPEN' || i.status === 'CAPA_PENDING').length;

    // Evaluate sensor alarms
    const ch4Sensor = mineSensors.find(s => s.type === 'GAS_CH4');
    const coSensor = mineSensors.find(s => s.type === 'GAS_CO');
    const slopeSensor = mineSensors.find(s => s.type === 'SLOPE_RADAR');
    const pm10Sensor = mineSensors.find(s => s.type === 'DUST_PM10');
    const blastSensor = mineSensors.find(s => s.type === 'BLAST_VIBRATION');

    const ch4Alarm = ch4Sensor?.status === 'CRITICAL_ALARM' ? 45 : ch4Sensor?.status === 'WARNING' ? 25 : 10;
    const coAlarm = coSensor?.status === 'CRITICAL_ALARM' ? 40 : coSensor?.status === 'WARNING' ? 20 : 8;
    const slopeAlarm = slopeSensor?.status === 'CRITICAL_ALARM' ? 48 : slopeSensor?.status === 'WARNING' ? 26 : 12;
    const pm10Alarm = pm10Sensor?.status === 'CRITICAL_ALARM' ? 30 : pm10Sensor?.status === 'WARNING' ? 18 : 6;

    const zones: RiskZone[] = [
      {
        id: 'zone-deep-incline',
        name: 'Incline Shaft #2 & Deep Seam Return Airway',
        cx: 650,
        cy: 330,
        rx: 130,
        ry: 85,
        baseScore: 40,
        sensorRisk: ch4Alarm + coAlarm,
        inspectionRisk: Math.min(45, (criticalInspections * 18) + (openViolations * 8)),
        compositeRisk: 0,
        level: 'LOW',
        category: 'GAS_VENTILATION',
        dominantFactors: [
          'CH4 & CO Multi-gas strata accumulation',
          'High airflow resistance in auxiliary ventilation ducts',
          'CMR 2017 Reg 153 Methane compliance boundary'
        ],
        recentIncidentsCount: 3
      },
      {
        id: 'zone-ob-dump-north',
        name: 'Overburden (OB) Dump #2 North Toe Flank',
        cx: 390,
        cy: 90,
        rx: 160,
        ry: 65,
        baseScore: 35,
        sensorRisk: slopeAlarm * 1.8,
        inspectionRisk: Math.min(40, (highInspections * 15) + (openViolations * 6)),
        compositeRisk: 0,
        level: 'LOW',
        category: 'SLOPE_GEOTECH',
        dominantFactors: [
          'High bench slope tension crack propagation (>4.2mm/24h)',
          'Monsoon pore-pressure surcharge at dump toe',
          'CMR 2017 Reg 106 37.5° angle of repose safety limit'
        ],
        recentIncidentsCount: 2
      },
      {
        id: 'zone-chp-washery',
        name: 'Coal Handling Plant (CHP) & AAQMS Corridor',
        cx: 120,
        cy: 180,
        rx: 110,
        ry: 75,
        baseScore: 25,
        sensorRisk: pm10Alarm * 2.2,
        inspectionRisk: Math.min(35, (openViolations * 10)),
        compositeRisk: 0,
        level: 'LOW',
        category: 'ENVIRONMENTAL',
        dominantFactors: [
          'High airborne respirable coal dust (PM10 >165 µg/m³)',
          'Dry fog dust suppression system maintenance lag',
          'CPCB 2009 AAQMS statutory threshold exceedance'
        ],
        recentIncidentsCount: 1
      },
      {
        id: 'zone-haul-junction',
        name: 'Main Haul Road Switchback & Blast Perimeter',
        cx: 260,
        cy: 370,
        rx: 120,
        ry: 70,
        baseScore: 30,
        sensorRisk: (blastSensor?.status === 'CRITICAL_ALARM' ? 40 : 15),
        inspectionRisk: Math.min(35, (criticalInspections * 12) + (highInspections * 8)),
        compositeRisk: 0,
        level: 'LOW',
        category: 'HAULAGE_MECHANICAL',
        dominantFactors: [
          'Heavy 100T dumper traffic blind-spot intersection',
          'Blast PPV ground vibration reverberation',
          'DGMS Tech Circular 07 of 1997 haulage speed limit'
        ],
        recentIncidentsCount: 2
      },
      {
        id: 'zone-pit-bottom',
        name: 'Seam-III Active Extraction Pit Face',
        cx: 400,
        cy: 250,
        rx: 100,
        ry: 55,
        baseScore: 30,
        sensorRisk: (ch4Alarm + slopeAlarm) * 0.7,
        inspectionRisk: Math.min(40, (criticalInspections * 15)),
        compositeRisk: 0,
        level: 'LOW',
        category: 'GAS_VENTILATION',
        dominantFactors: [
          'High-density heavy machinery & personnel concentration',
          'Strata relaxation & immediate roof bed separation',
          'CMR 2017 Reg 123 support rule inspection point'
        ],
        recentIncidentsCount: 1
      }
    ];

    // Compute composite normalized risk and categorize
    return zones.map(z => {
      let filteredScore = 0;
      if (heatmapMode === 'GAS') {
        filteredScore = Math.min(100, Math.round(z.sensorRisk * 1.3 + (z.category === 'GAS_VENTILATION' ? 40 : 5)));
      } else if (heatmapMode === 'SLOPE') {
        filteredScore = Math.min(100, Math.round(z.sensorRisk * 1.3 + (z.category === 'SLOPE_GEOTECH' ? 45 : 5)));
      } else if (heatmapMode === 'INSPECTION') {
        filteredScore = Math.min(100, Math.round(z.inspectionRisk * 1.8 + z.baseScore * 0.4));
      } else {
        // COMPOSITE Mode
        filteredScore = Math.min(100, Math.round((z.baseScore * 0.25) + (z.sensorRisk * 0.4) + (z.inspectionRisk * 0.35)));
      }

      let level: RiskZone['level'] = 'LOW';
      if (filteredScore >= 75) level = 'CRITICAL';
      else if (filteredScore >= 55) level = 'HIGH';
      else if (filteredScore >= 35) level = 'MODERATE';

      return {
        ...z,
        compositeRisk: filteredScore,
        level
      };
    });
  }, [safeSensors, safeInspections, mineSensors, heatmapMode]);

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="bg-[#161B22] border border-white/10 rounded-xl p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
              DGMS Spatial GIS & Heatmap Analytics
            </span>
            <span className="text-xs font-semibold text-slate-300 font-mono">
              Live Coordinate: 23.7428° N, 86.4168° E
            </span>
          </div>
          <h2 className="text-base font-bold text-slate-100 mt-1">
            {selectedMine ? selectedMine.name : 'Pan-India Active Coal Seams & IoT Grid'}
          </h2>
        </div>

        {/* Layer Toggles & Heatmap Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={findNearestCentre}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-bold text-emerald-300 transition hover:bg-emerald-500/20"
          >
            <Crosshair className="w-3.5 h-3.5" />
            GPS nearby coal centres
          </button>
          {gpsError && <span className="text-[10px] text-rose-300">{gpsError}</span>}
          {nearestCentre && userLocation && (
            <span className="rounded-lg border border-sky-500/30 bg-sky-500/10 px-2 py-1 text-[10px] text-sky-200">
              Nearest: {nearestCentre.name} • {Math.round(Math.hypot(userLocation.lat - nearestCentre.coordinates.lat, userLocation.lng - nearestCentre.coordinates.lng) * 111.32)} km
            </span>
          )}
          {/* Layer Filter Pills */}
          <div className="flex items-center gap-1 bg-[#0E1116] border border-white/10 rounded-lg p-1 text-xs">
            <Layers className="w-3.5 h-3.5 text-slate-400 ml-1" />
            
            {/* Heatmap Layer Toggle */}
            <button
              id="toggle-heatmap-layer-btn"
              onClick={() => toggleLayer('heatmap')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                activeLayers.heatmap 
                  ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/30 ring-1 ring-rose-400' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Flame className="w-3 h-3" />
              <span>Risk Heatmap</span>
            </button>

            <button
              onClick={() => toggleLayer('gas')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                activeLayers.gas ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400'
              }`}
            >
              Gas CH4/CO
            </button>
            <button
              onClick={() => toggleLayer('slope')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                activeLayers.slope ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-400'
              }`}
            >
              Slope Radar
            </button>
            <button
              onClick={() => toggleLayer('environmental')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                activeLayers.environmental ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'text-slate-400'
              }`}
            >
              Dust / Water
            </button>
            <button
              onClick={() => toggleLayer('blastRadius')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                activeLayers.blastRadius ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'text-slate-400'
              }`}
            >
              500m Blast Cordon
            </button>
          </div>

          {/* Blast Lockout Simulation Button */}
          <button
            id="blast-lockout-trigger-btn"
            onClick={onInitiateBlastLockout}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow ${
              blastLockoutActive
                ? 'bg-red-600 text-white hover:bg-red-500 animate-pulse ring-2 ring-red-400'
                : 'bg-red-950/60 text-red-300 border border-red-800/80 hover:bg-red-900/80'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{blastLockoutActive ? 'DEACTIVATE BLAST LOCKOUT' : 'INITIATE BLAST LOCKOUT'}</span>
          </button>
        </div>
      </div>

      {/* Heatmap Layer Control Bar (Visible when Heatmap is Active) */}
      {activeLayers.heatmap && (
        <div className="bg-[#12151A] border border-rose-500/20 rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-inner">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
              <Flame className="w-4 h-4" />
            </span>
            <div>
              <span className="font-bold text-slate-200 block">
                Visual Risk Heatmap Active
              </span>
              <span className="text-[11px] text-slate-400">
                Fuses real-time sensor anomalies with historical inspection failure density & statutory violation logs
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Heatmap Factor Mode */}
            <div className="flex items-center gap-1 bg-[#0E1116] p-0.5 rounded-lg border border-white/10 text-[11px]">
              <button
                id="heatmap-mode-composite"
                onClick={() => setHeatmapMode('COMPOSITE')}
                className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                  heatmapMode === 'COMPOSITE' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Composite
              </button>
              <button
                id="heatmap-mode-gas"
                onClick={() => setHeatmapMode('GAS')}
                className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                  heatmapMode === 'GAS' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Gas Hazards
              </button>
              <button
                id="heatmap-mode-slope"
                onClick={() => setHeatmapMode('SLOPE')}
                className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                  heatmapMode === 'SLOPE' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Slope Geotech
              </button>
              <button
                id="heatmap-mode-inspection"
                onClick={() => setHeatmapMode('INSPECTION')}
                className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                  heatmapMode === 'INSPECTION' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Inspection Density
              </button>
            </div>

            {/* Opacity Controls */}
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-[#0E1116] px-2 py-1 rounded-lg border border-white/10">
              <Sliders className="w-3 h-3 text-slate-400" />
              <span>Opacity:</span>
              <input
                type="range"
                min="0.3"
                max="1.0"
                step="0.05"
                value={heatmapOpacity}
                onChange={(e) => setHeatmapOpacity(parseFloat(e.target.value))}
                className="w-16 h-1 accent-amber-500 bg-slate-700 rounded cursor-pointer"
              />
              <span className="font-mono text-slate-200 w-7">{Math.round(heatmapOpacity * 100)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Interactive Map & Telemetry Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* SVG/GIS Canvas View */}
        <div className="lg:col-span-2 bg-[#161B22] border border-white/10 rounded-xl p-4 relative overflow-hidden flex flex-col justify-between min-h-[540px]">
          {/* Spatial Grid Header & Status Legend */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-slate-200">
                Live Georeferenced Telemetry Grid (100% Sat-Synced)
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Normal
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Warning
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> DGMS Breach
              </span>
            </div>
          </div>

          {/* Interactive SVG Spatial Simulation Map */}
          <div className="relative w-full h-[450px] my-auto bg-[#0D0F12] rounded-lg border border-white/10 overflow-hidden select-none">
            {/* Background Grid Lines & Contour Simulation */}
            <svg className="w-full h-full" viewBox="0 0 800 500">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(51, 65, 85, 0.25)" strokeWidth="1" />
                </pattern>
                
                {/* Blast Radius Gradient */}
                <radialGradient id="blastGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(239, 68, 68, 0.4)" />
                  <stop offset="70%" stopColor="rgba(239, 68, 68, 0.15)" />
                  <stop offset="100%" stopColor="rgba(239, 68, 68, 0)" />
                </radialGradient>
                
                <linearGradient id="coalSeamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>

                {/* Heatmap Multi-Stop Gradients with Organic Blur Filter */}
                <filter id="heatmapGlowFilter" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="16" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Critical Level Red Heat Gradient */}
                <radialGradient id="heatCritical" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.85" />
                  <stop offset="35%" stopColor="#f97316" stopOpacity="0.65" />
                  <stop offset="65%" stopColor="#eab308" stopOpacity="0.4" />
                  <stop offset="85%" stopColor="#06b6d4" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </radialGradient>

                {/* High Level Orange Heat Gradient */}
                <radialGradient id="heatHigh" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.75" />
                  <stop offset="40%" stopColor="#eab308" stopOpacity="0.5" />
                  <stop offset="75%" stopColor="#10b981" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </radialGradient>

                {/* Moderate Level Amber/Yellow Heat Gradient */}
                <radialGradient id="heatModerate" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#eab308" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Grid Background */}
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Opencast Mine Pit Contour Strata */}
              <ellipse cx="400" cy="250" rx="350" ry="210" fill="none" stroke="rgba(100, 116, 139, 0.4)" strokeWidth="2" strokeDasharray="4 4" />
              <ellipse cx="400" cy="250" rx="280" ry="160" fill="none" stroke="rgba(217, 119, 6, 0.3)" strokeWidth="2" />
              <ellipse cx="400" cy="250" rx="200" ry="110" fill="url(#coalSeamGrad)" stroke="rgba(245, 158, 11, 0.5)" strokeWidth="2.5" />
              
              {/* Active Coal Extraction Bench (Deep Pit) */}
              <ellipse cx="400" cy="250" rx="110" ry="60" fill="#090d16" stroke="rgba(245, 158, 11, 0.8)" strokeWidth="2" />
              <text x="360" y="255" fill="#f59e0b" fontSize="11" fontWeight="bold" fontFamily="monospace">COAL SEAM-III</text>

              {/* Overburden (OB) Dump Benches North Flank */}
              <path d="M 120 70 Q 250 30 450 60 Q 600 80 680 120 L 650 160 Q 450 120 200 130 Z" fill="rgba(148, 163, 184, 0.15)" stroke="rgba(148, 163, 184, 0.4)" strokeWidth="1.5" />
              <text x="260" y="95" fill="#94a3b8" fontSize="10" fontWeight="bold">OVERBURDEN (OB) DUMP #2</text>

              {/* Main Arterial Haul Road */}
              <path d="M 80 430 C 200 400, 300 360, 360 280 S 520 220, 720 180" fill="none" stroke="rgba(245, 158, 11, 0.6)" strokeWidth="8" strokeLinecap="round" strokeDasharray="12 6" />
              <text x="180" y="420" fill="#fbbf24" fontSize="10" fontWeight="bold">MAIN HAUL ROAD (100T DUMPERS)</text>

              {/* Underground Incline Shaft (Raniganj Area) */}
              <rect x="620" y="320" width="130" height="70" rx="6" fill="rgba(30, 41, 59, 0.8)" stroke="rgba(56, 189, 248, 0.6)" strokeWidth="2" />
              <text x="635" y="345" fill="#38bdf8" fontSize="10" fontWeight="bold">INCLINE SHAFT NO. 2</text>
              <text x="635" y="365" fill="#94a3b8" fontSize="9">Deep Seam Panel 14</text>

              {/* Coal Handling Plant (CHP) & Rail Siding */}
              <rect x="60" y="160" width="110" height="60" rx="6" fill="rgba(30, 41, 59, 0.8)" stroke="rgba(168, 85, 247, 0.6)" strokeWidth="2" />
              <text x="75" y="185" fill="#c084fc" fontSize="10" fontWeight="bold">CHP & WASHERY</text>
              <text x="75" y="202" fill="#94a3b8" fontSize="9">AAQMS Dust Unit</text>

              {/* Tailings Pond / Sump Settle */}
              <ellipse cx="680" cy="90" rx="60" ry="35" fill="rgba(20, 184, 166, 0.15)" stroke="rgba(20, 184, 166, 0.5)" strokeWidth="1.5" />
              <text x="645" y="95" fill="#2dd4bf" fontSize="9" fontWeight="bold">SUMP ETP WEIR</text>

              {/* ========================================================================= */}
              {/* VISUAL HEATMAP LAYER: Renders high-risk density hot-spots based on data */}
              {/* ========================================================================= */}
              {activeLayers.heatmap && (
                <g 
                  id="spatial-heatmap-layer" 
                  filter="url(#heatmapGlowFilter)"
                  opacity={heatmapOpacity}
                  className="transition-opacity duration-300"
                >
                  {riskZones.map((zone) => {
                    const gradientId = zone.level === 'CRITICAL' 
                      ? 'url(#heatCritical)' 
                      : zone.level === 'HIGH' 
                        ? 'url(#heatHigh)' 
                        : 'url(#heatModerate)';
                    
                    const isSelected = selectedRiskZone?.id === zone.id;

                    return (
                      <g 
                        key={zone.id} 
                        className="cursor-pointer group"
                        onClick={() => setSelectedRiskZone(zone)}
                      >
                        {/* Outer Glow Ellipse */}
                        <ellipse
                          cx={zone.cx}
                          cy={zone.cy}
                          rx={zone.rx * (isSelected ? 1.15 : 1.0)}
                          ry={zone.ry * (isSelected ? 1.15 : 1.0)}
                          fill={gradientId}
                          className={zone.level === 'CRITICAL' ? 'animate-pulse' : ''}
                          style={{ animationDuration: '3s' }}
                        />

                        {/* Core High-Intensity Hotspot */}
                        <circle
                          cx={zone.cx}
                          cy={zone.cy}
                          r={Math.max(14, zone.compositeRisk * 0.35)}
                          fill={zone.level === 'CRITICAL' ? 'rgba(239, 68, 68, 0.9)' : zone.level === 'HIGH' ? 'rgba(249, 115, 22, 0.85)' : 'rgba(234, 179, 8, 0.7)'}
                          stroke="#ffffff"
                          strokeWidth={isSelected ? 2 : 0.8}
                          strokeOpacity={0.6}
                        />

                        {/* Heatmap Zone Pin Label */}
                        <text
                          x={zone.cx}
                          y={zone.cy - 12}
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                          style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}
                        >
                          {zone.compositeRisk}% RISK
                        </text>
                      </g>
                    );
                  })}
                </g>
              )}

              {/* Blast Danger Perimeter Cordon (500m Radius) */}
              {activeLayers.blastRadius && (
                <g>
                  <circle 
                    cx="400" 
                    cy="250" 
                    r="170" 
                    fill="url(#blastGlow)" 
                    stroke={blastLockoutActive ? '#ef4444' : 'rgba(239, 68, 68, 0.4)'} 
                    strokeWidth={blastLockoutActive ? 3 : 1.5} 
                    strokeDasharray={blastLockoutActive ? '6 3' : '8 8'}
                    className={blastLockoutActive ? 'animate-spin' : ''}
                    style={{ transformOrigin: '400px 250px', animationDuration: '20s' }}
                  />
                  <text x="320" y="90" fill="#f87171" fontSize="10" fontWeight="bold" letterSpacing="1">
                    {blastLockoutActive ? '⛔ 500M BLAST LOCKOUT IN EFFECT - ALL WORKERS EVACUATED' : '500m STATUTORY BLAST CORDON'}
                  </text>
                </g>
              )}

              {/* Worker Geo-Beacons */}
              {activeLayers.workers && !blastLockoutActive && (
                <g>
                  <circle cx="370" cy="270" r="4" fill="#3b82f6" />
                  <circle cx="430" cy="240" r="4" fill="#3b82f6" />
                  <circle cx="280" cy="360" r="4" fill="#3b82f6" />
                  <circle cx="660" cy="350" r="4" fill="#3b82f6" />
                  <circle cx="120" cy="190" r="4" fill="#3b82f6" />
                  <text x="380" y="274" fill="#93c5fd" fontSize="9">Shovel Operator S-02</text>
                  <text x="290" y="364" fill="#93c5fd" fontSize="9">Dumper D-84 (Eastern)</text>
                </g>
              )}
            </svg>

            {/* Heatmap Legend Overlay inside Map */}
            {activeLayers.heatmap && (
              <div className="absolute bottom-3 left-3 bg-[#12151A]/90 border border-white/10 rounded-lg p-2.5 backdrop-blur-md z-30 space-y-1.5 text-[10px]">
                <div className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span>Risk Density Gradient</span>
                </div>
                {/* Gradient Bar */}
                <div className="w-36 h-2 rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 shadow-inner" />
                <div className="flex justify-between text-slate-400 font-mono text-[9px]">
                  <span>0% Safe</span>
                  <span>50% Warning</span>
                  <span>100% Critical</span>
                </div>
              </div>
            )}

            {/* Render Live Interactive Sensor Nodes as positioned overlay pills */}
            {mineSensors.map((sensor, index) => {
              const positions: Record<string, { top: string; left: string }> = {
                'sensor-ch4-01': { top: '68%', left: '78%' },
                'sensor-co-02': { top: '74%', left: '84%' },
                'sensor-o2-03': { top: '62%', left: '72%' },
                'sensor-pm10-04': { top: '35%', left: '16%' },
                'sensor-slope-05': { top: '18%', left: '42%' },
                'sensor-blast-06': { top: '82%', left: '25%' },
                'sensor-water-07': { top: '16%', left: '82%' }
              };

              const pos = positions[sensor.id] || { top: `${30 + index * 12}%`, left: `${40 + (index % 3) * 15}%` };
              const isSelected = selectedSensor?.id === sensor.id;

              return (
                <div
                  key={sensor.id}
                  style={{ top: pos.top, left: pos.left }}
                  onClick={() => {
                    setSelectedSensor(sensor);
                    // Match corresponding risk zone if any
                    const matchedZone = riskZones.find(z => 
                      (sensor.type.includes('GAS') && z.category === 'GAS_VENTILATION') ||
                      (sensor.type.includes('SLOPE') && z.category === 'SLOPE_GEOTECH') ||
                      (sensor.type.includes('DUST') && z.category === 'ENVIRONMENTAL')
                    );
                    if (matchedZone) setSelectedRiskZone(matchedZone);
                  }}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all z-20 group`}
                >
                  <div className="relative flex items-center justify-center">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-lg border ${getSensorColor(sensor.status)} ${isSelected ? 'scale-125 ring-2 ring-white' : 'hover:scale-110'}`}>
                      {sensor.type.includes('GAS') ? <Wind className="w-3.5 h-3.5" /> : sensor.type.includes('SLOPE') ? <AlertTriangle className="w-3.5 h-3.5" /> : sensor.type.includes('WATER') ? <Droplet className="w-3.5 h-3.5" /> : <Activity className="w-3.5 h-3.5" />}
                    </span>

                    {/* Sensor Value Hover Tag */}
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-[#12151A]/95 border border-white/10 px-2 py-0.5 rounded text-[10px] font-mono text-slate-100 whitespace-nowrap shadow-md pointer-events-none group-hover:scale-105 transition-transform z-30">
                      {sensor.currentValue} {sensor.unit}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Bar Info */}
          <div className="flex items-center justify-between text-xs text-slate-400 mt-2 z-10 pt-2 border-t border-white/10">
            <span className="flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5 text-amber-400" />
              <span>Target Coordinates: <strong>BCCL Block-II Opencast Seam III</strong></span>
            </span>
            <span className="text-slate-300">
              Total Active Sensors: <strong>{mineSensors.length} Nodes</strong> (7 Online)
            </span>
          </div>
        </div>

        {/* Right Side: Selected Sensor Telemetry Card & DGMS Compliance Diagnostic */}
        <div className="space-y-4">
          {/* Active Risk Zone Diagnostic (if Selected or clicked) */}
          {selectedRiskZone && (
            <div className="bg-[#161B22] border border-rose-500/30 rounded-xl p-4 space-y-3 animate-fade-in shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold border ${
                    selectedRiskZone.level === 'CRITICAL'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                      : selectedRiskZone.level === 'HIGH'
                        ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}>
                    HEATMAP ZONE • {selectedRiskZone.level} RISK ({selectedRiskZone.compositeRisk}/100)
                  </span>
                  <h3 className="font-bold text-sm text-slate-100 mt-1">{selectedRiskZone.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedRiskZone(null)}
                  className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded bg-white/5"
                >
                  ✕
                </button>
              </div>

              {/* Factors & Failure Density breakdown */}
              <div className="bg-[#0D0F12] rounded-xl p-3 border border-white/5 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-300 border-b border-white/5 pb-1.5">
                  <span className="text-[11px] text-slate-400">Sensor Anomaly Weight:</span>
                  <span className="font-mono font-bold text-rose-400">{Math.round(selectedRiskZone.sensorRisk)} pts</span>
                </div>
                <div className="flex justify-between items-center text-slate-300 border-b border-white/5 pb-1.5">
                  <span className="text-[11px] text-slate-400">Inspection Failure Density:</span>
                  <span className="font-mono font-bold text-amber-400">{Math.round(selectedRiskZone.inspectionRisk)} pts</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-[11px] text-slate-400">Historical Incident Logs:</span>
                  <span className="font-mono font-bold text-sky-400">{selectedRiskZone.recentIncidentsCount} Events</span>
                </div>
              </div>

              {/* Dominant Risk Triggers */}
              <div className="space-y-1 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Dominant Hazard Factors:
                </span>
                {selectedRiskZone.dominantFactors.map((factor, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-slate-300 text-[11px]">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Sensor Telemetry */}
          {selectedSensor ? (
            <div className="bg-[#161B22] border border-white/10 rounded-xl p-4 space-y-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold border ${
                    selectedSensor.status === 'CRITICAL_ALARM'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                      : selectedSensor.status === 'WARNING'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {selectedSensor.status}
                  </span>
                  <h3 className="font-bold text-sm text-slate-100 mt-1">{selectedSensor.name}</h3>
                  <p className="text-xs text-slate-400">{selectedSensor.location}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-mono">Battery</span>
                  <span className="text-xs font-bold text-emerald-400">{selectedSensor.batteryPercent}%</span>
                </div>
              </div>

              {/* Current Value Display */}
              <div className="bg-[#0D0F12] rounded-xl p-3 border border-white/5 text-center">
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Live Calibrated Telemetry</span>
                <div className="text-3xl font-extrabold text-slate-100 font-mono mt-1">
                  {selectedSensor.currentValue} <span className="text-sm font-normal text-slate-400">{selectedSensor.unit}</span>
                </div>
                <div className="flex items-center justify-center gap-4 text-xs text-slate-400 mt-2">
                  <span>Safe Range: <strong>{selectedSensor.normalRange[0]} - {selectedSensor.normalRange[1]}</strong></span>
                  <span>DGMS Threshold: <strong className="text-rose-400">{selectedSensor.criticalThreshold}</strong></span>
                </div>
              </div>

              {/* Statutory CMR 2017 Guidance for this sensor type */}
              <div className="text-xs text-slate-300 space-y-1.5 bg-white/[0.02] p-3 rounded-lg border border-white/5">
                <span className="font-bold text-amber-400 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Statutory Compliance Directive</span>
                </span>
                {selectedSensor.type === 'GAS_CH4' && (
                  <p className="leading-relaxed">
                    Under <strong>CMR 2017 Regulation 153</strong>, inflammable gas in return airway must not exceed 0.5%. Exceeding 0.75% requires immediate electric tripping and withdrawal of workers under Section 22.
                  </p>
                )}
                {selectedSensor.type === 'SLOPE_RADAR' && (
                  <p className="leading-relaxed">
                    Under <strong>CMR 2017 Regulation 106</strong>, displacement exceeding 5.0 mm/24h requires immediate halt of shovel loading at toe of dump.
                  </p>
                )}
                {selectedSensor.type === 'DUST_PM10' && (
                  <p className="leading-relaxed">
                    Under <strong>CPCB 2009 AAQMS Standards</strong>, industrial PM10 24hr average must remain &lt; 100 µg/m³. Exceeding 150 mandates mist spray cannons.
                  </p>
                )}
                {selectedSensor.type === 'BLAST_VIBRATION' && (
                  <p className="leading-relaxed">
                    Under <strong>DGMS Circular 07 of 1997</strong>, Peak Particle Velocity (PPV) at domestic structures must remain below 10 mm/s for dominant frequency &lt; 8Hz.
                  </p>
                )}
                {selectedSensor.type === 'WATER_PH' && (
                  <p className="leading-relaxed">
                    Under <strong>Water Act 1974 Sec 25</strong>, colliery sump effluent pH must strictly range between 6.5 and 8.5 with TSS &lt; 100 mg/L before discharge.
                  </p>
                )}
                {selectedSensor.type === 'GAS_CO' && (
                  <p className="leading-relaxed">
                    Under <strong>CMR 2017 Regulation 140</strong>, Carbon Monoxide (CO) exceeding 10 ppm indicates spontaneous heating in sealed goaf areas.
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => onTriggerSensorAlarm(selectedSensor.id)}
                  className="flex-1 py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <AlertOctagon className="w-3.5 h-3.5" />
                  <span>Simulate Alarm State</span>
                </button>
                <button
                  onClick={onOpenNewInspection}
                  className="py-2 px-3 rounded-lg bg-[#1F2630] hover:bg-[#283240] text-slate-200 font-semibold text-xs border border-white/10 transition-colors cursor-pointer"
                >
                  Log Observation
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#161B22] border border-white/10 rounded-xl p-6 text-center text-slate-400 shadow-sm">
              <Info className="w-8 h-8 mx-auto text-slate-500 mb-2" />
              <p className="text-xs">Click any sensor marker or heatmap hotspot on the spatial map to view real-time calibrated telemetry and DGMS statutory directives.</p>
            </div>
          )}

          {/* Quick List of All Active Sensors in Grid */}
          <div className="bg-[#161B22] border border-white/10 rounded-xl p-4 space-y-2 shadow-sm">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Connected Colliery Nodes</h4>
            <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
              {mineSensors.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedSensor(s)}
                  className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                    selectedSensor?.id === s.id ? 'bg-[#1F2630] border border-amber-500/40 text-slate-100' : 'bg-[#0D0F12]/60 hover:bg-[#1F2630]/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate max-w-[170px]">
                    <span className={`w-2 h-2 rounded-full ${
                      s.status === 'CRITICAL_ALARM' ? 'bg-rose-500' : s.status === 'WARNING' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`} />
                    <span className="truncate">{s.name}</span>
                  </div>
                  <span className="font-mono font-bold">{s.currentValue} {s.unit.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

