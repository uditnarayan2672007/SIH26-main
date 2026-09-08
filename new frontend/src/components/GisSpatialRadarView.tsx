import React, { useState, useEffect, useRef } from 'react';

interface GisSpatialRadarProps {
  onOpenCopilot?: () => void;
}

type LidarCompositeMode = 'COMPOSITE' | 'ACTIVE_GAS_HAZARDS' | 'SLOPE_GEOTECH' | 'INSPECTION_DENSITY';
type TerrainResolution = '0.5M_LIDAR' | '1.0M_DEM' | '2.5M_SAR';

interface SectorData {
  id: string;
  name: string;
  fos: number;
  status: string;
  displacement: string;
  maxSafe: string;
  risk: 'LOW' | 'MODERATE' | 'CRITICAL' | 'MINIMAL';
  sensorCount: number;
  moisture: string;
  benchHeight: string;
  benchAngle: string;
}

interface NearbyCoalCenter {
  id: string;
  name: string;
  type: string;
  distanceKm: number;
  bearing: string;
  eta: string;
  dgmsLink: string;
  status: 'OPTIMAL' | 'STANDBY' | 'MONITORING';
  contact: string;
}

export const GisSpatialRadarView: React.FC<GisSpatialRadarProps> = ({ onOpenCopilot }) => {
  // Working Coal Mine Context (User requirement: such as Jharia)
  const [workingMine, setWorkingMine] = useState<'JHARIA_PIT4' | 'MOONIDIH_UNDERGROUND' | 'GEVRA_OPENCAST' | 'JAYANT_BASIN'>('JHARIA_PIT4');

  // Layer toggles (User requirement: GPS nearby coal mines, gas risk heat map, slope radar, dust or water 500 plus)
  const [layerGpsNearbyMines, setLayerGpsNearbyMines] = useState(true);
  const [layerGasRiskHeatmap, setLayerGasRiskHeatmap] = useState(true);
  const [layerSlopeRadar, setLayerSlopeRadar] = useState(true);
  const [layerDustWaterBuffer, setLayerDustWaterBuffer] = useState(true);

  // Simulation controls & Heat map opacity (User requirement: simulation, heat map layer opacity)
  const [isSimulating, setIsSimulating] = useState(true);
  const [simulationSpeed, setSimulationSpeed] = useState<'1X' | '2X' | '5X'>('1X');
  const [simTimelineStep, setSimTimelineStep] = useState<number>(35); // 0 to 100
  const [heatmapOpacity, setHeatmapOpacity] = useState<number>(65); // 0 to 100%

  // Terrain resolution & LiDAR composite (User requirement: terrain resolution, lidar composite: 4 options)
  const [terrainResolution, setTerrainResolution] = useState<TerrainResolution>('0.5M_LIDAR');
  const [lidarComposite, setLidarComposite] = useState<LidarCompositeMode>('COMPOSITE');

  // Radar scanning state
  const [isLiveScanning, setIsLiveScanning] = useState(true);
  const [radarAngle, setRadarAngle] = useState(0);
  const [selectedSector, setSelectedSector] = useState<string>('NORTH_HIGHWALL');

  // Filter mode for radar
  const [filterMode, setFilterMode] = useState<'VELOCITY' | 'DISPLACEMENT' | 'COHERENCE'>('VELOCITY');

  // Modal for coal center or precedent
  const [selectedCenter, setSelectedCenter] = useState<NearbyCoalCenter | null>(null);

  // Radar sweep animation
  useEffect(() => {
    if (!isLiveScanning) return;
    const speedMultiplier = simulationSpeed === '5X' ? 8 : simulationSpeed === '2X' ? 4 : 2;
    const interval = setInterval(() => {
      setRadarAngle((prev) => (prev + speedMultiplier) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [isLiveScanning, simulationSpeed]);

  // Simulation timeline auto-advance
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setSimTimelineStep((prev) => (prev >= 100 ? 0 : prev + 1));
    }, simulationSpeed === '5X' ? 400 : simulationSpeed === '2X' ? 800 : 1500);
    return () => clearInterval(interval);
  }, [isSimulating, simulationSpeed]);

  // Working colliery details
  const collieryProfiles = {
    JHARIA_PIT4: {
      name: 'Jharia Coalfield - Pit #04 (Seam XIV)',
      subsidiary: 'BCCL (Bharat Coking Coal Limited)',
      coordinates: '23°47\'44" N, 86°25\'49" E',
      basin: 'Jharia Gondwana Basin, Dhanbad',
      depth: '420m (Seam XIV / 3.8m Coal Thickness)',
      strata: 'Barakar Formation Sandstone & Carbonaceous Shale',
      dgmsZone: 'DGMS Eastern Zone Region I'
    },
    MOONIDIH_UNDERGROUND: {
      name: 'Moonidih Longwall Shaft & Underground Colliery',
      subsidiary: 'BCCL',
      coordinates: '23°44\'12" N, 86°21\'30" E',
      basin: 'Jharia Basin (Central)',
      depth: '520m Deep Underground Shaft',
      strata: 'Coking Seam XVI Top',
      dgmsZone: 'DGMS Eastern Zone Region I'
    },
    GEVRA_OPENCAST: {
      name: 'Gevra Mega Opencast Bench Quarry',
      subsidiary: 'SECL',
      coordinates: '22°20\'18" N, 82°35\'08" E',
      basin: 'Hasdeo-Arand Basin, Korba',
      depth: '180m Opencast Working Pit',
      strata: 'Barakar Heavy Sandstone Benches',
      dgmsZone: 'DGMS South Eastern Zone Bilaspur'
    },
    JAYANT_BASIN: {
      name: 'Jayant Mega Opencast Sector B',
      subsidiary: 'NCL',
      coordinates: '24°08\'15" N, 82°37\'40" E',
      basin: 'Singrauli Coalfield Basin',
      depth: '145m Highwall Continuous Mining',
      strata: 'Purewa Top & Bottom Seam',
      dgmsZone: 'DGMS Northern Zone Varanasi'
    }
  };

  const currentColliery = collieryProfiles[workingMine];

  // Geotechnical Sectors
  const sectors: SectorData[] = [
    {
      id: 'NORTH_HIGHWALL',
      name: 'North Highwall - Bench 4B (Seam XIV Cut)',
      fos: 1.48,
      status: 'STABLE',
      displacement: '0.4 mm/hr',
      maxSafe: '2.0 mm/hr',
      risk: 'LOW',
      sensorCount: 18,
      moisture: '14.2%',
      benchHeight: '12.5 m',
      benchAngle: '42°'
    },
    {
      id: 'EAST_DUMP',
      name: 'East Overburden Dump Slope #2',
      fos: 1.34,
      status: 'WATCH',
      displacement: '1.2 mm/hr',
      maxSafe: '2.0 mm/hr',
      risk: 'MODERATE',
      sensorCount: 12,
      moisture: '28.6%',
      benchHeight: '30.0 m',
      benchAngle: '37°'
    },
    {
      id: 'SOUTH_SUMP',
      name: 'South Inflow Sump & 500m+ Water Danger Zone',
      fos: 1.62,
      status: 'OPTIMAL',
      displacement: '0.1 mm/hr',
      maxSafe: '2.0 mm/hr',
      risk: 'MINIMAL',
      sensorCount: 8,
      moisture: '65.1%',
      benchHeight: '8.0 m',
      benchAngle: '30°'
    },
    {
      id: 'HAUL_ROAD',
      name: 'Main Haul Ramp Cut & High-Frequency Corridor',
      fos: 1.51,
      status: 'STABLE',
      displacement: '0.3 mm/hr',
      maxSafe: '2.0 mm/hr',
      risk: 'LOW',
      sensorCount: 14,
      moisture: '11.8%',
      benchHeight: '14.0 m',
      benchAngle: '40°'
    }
  ];

  const currentSectorData = sectors.find((s) => s.id === selectedSector) || sectors[0];

  // Prisms plotted on the GIS radar
  const prisms = [
    { id: 'PR-01', x: 58, y: 32, velocity: '+0.2 mm/hr', alert: false, label: 'Toe Prism Bench 4', ch4: '0.18%', co: '8 ppm' },
    { id: 'PR-02', x: 68, y: 28, velocity: '+0.5 mm/hr', alert: false, label: 'Crest Prism Bench 4B', ch4: '0.24%', co: '10 ppm' },
    { id: 'PR-03', x: 42, y: 64, velocity: '+1.4 mm/hr', alert: true, label: 'Tension Crack Prism #3', ch4: '0.39%', co: '16 ppm' },
    { id: 'PR-04', x: 74, y: 55, velocity: '+0.1 mm/hr', alert: false, label: 'Haul Ramp Reticle 01', ch4: '0.12%', co: '6 ppm' },
    { id: 'PR-05', x: 30, y: 40, velocity: '+0.3 mm/hr', alert: false, label: 'Mid-Bench Piezometer', ch4: '0.28%', co: '12 ppm' },
    { id: 'PR-06', x: 50, y: 78, velocity: '+0.2 mm/hr', alert: false, label: 'Sump Wall Water Gauge', ch4: '0.15%', co: '5 ppm' }
  ];

  // Nearby Coal Centers (User requirement: nearby coal center from proximity)
  const nearbyCoalCenters: NearbyCoalCenter[] = [
    {
      id: 'NC-01',
      name: 'Moonidih Coal Washery & Deep Shaft',
      type: 'Heavy Coking Coal Washery & Shaft',
      distanceKm: 4.2,
      bearing: '215° SW',
      eta: '12 min (Heavy HEMM / Transit)',
      dgmsLink: 'TELEMETRY SYNCED • NODE BCCL-MDH',
      status: 'OPTIMAL',
      contact: '+91-326-2240182 (Er. A. Ghosh, Manager)'
    },
    {
      id: 'NC-02',
      name: 'DGMS Regional Directorate HQ Dhanbad',
      type: 'Statutory Regulatory Authority',
      distanceKm: 8.5,
      bearing: '042° NE',
      eta: '18 min (Command Dispatch)',
      dgmsLink: 'OFFICIAL DGMS APEX FIBER BRIDGE',
      status: 'OPTIMAL',
      contact: '0326-2221234 (Deputy Director Mines Safety)'
    },
    {
      id: 'NC-03',
      name: 'Katras Colliery Pit #02 & Siding',
      type: 'Active Underground & Rail Siding',
      distanceKm: 6.1,
      bearing: '310° NW',
      eta: '15 min (Mutual Aid Route A)',
      dgmsLink: 'STANDBY MUTUAL RESCUE LINK',
      status: 'STANDBY',
      contact: '+91-326-2371900 (Statutory Safety Incharge)'
    },
    {
      id: 'NC-04',
      name: 'Sijua Mines Rescue Station (MR Station)',
      type: 'Statutory Mines Rescue & Breathing App Hub',
      distanceKm: 3.8,
      bearing: '275° W',
      eta: '6 min (Emergency Siren Response)',
      dgmsLink: 'DEDICATED STATUTORY RESCUE HOTLINE',
      status: 'OPTIMAL',
      contact: '0326-2382111 (Superintendent Rescue Services)'
    },
    {
      id: 'NC-05',
      name: 'BCCL Central Hospital Jagjivan Nagar',
      type: 'Trauma Care & Hyperbaric Medical Unit',
      distanceKm: 7.4,
      bearing: '015° NNE',
      eta: '14 min (Life-Support Ambulance)',
      dgmsLink: 'DGMS CMR 2017 REG 210 COMPLIANT',
      status: 'OPTIMAL',
      contact: '+91-326-2203001 (Chief Medical Officer)'
    }
  ];

  return (
    <div className="w-full space-y-5">
      {/* 1. TOP STATUTORY HEADER: DGMS Special GIS & Heat Map Analysis */}
      <div className="bg-gradient-to-r from-[#0a1628] via-[#07111e] to-[#050b14] border-2 border-cyan-500/40 p-5 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-radial from-cyan-500/10 to-transparent pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 px-3 py-0.5 rounded-full text-xs font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>DGMS SPECIAL GIS &amp; HEAT MAP ANALYSIS</span>
              </span>
              <span className="bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold">
                CMR 2017 REG 106 &amp; REG 153/154
              </span>
              <span className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>100% SELF-SYNCING TELEGRID</span>
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-black text-white font-serif tracking-tight flex items-center gap-2">
              <span>Geospatial Radar, Gas Risk Heat Map &amp; Geotechnical Spatial Monitor</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Real-time multi-spectral LiDAR overlay, continuous interferometric ground radar (SSR-XT), explosive methane desorption vectors, and statutory 500m+ water/dust buffer envelopes.
            </p>
          </div>

          {/* Right Action Controls: Working Mine Selector & Copilot Button */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-[#0b172a] border border-cyan-500/30 rounded-xl p-1.5 flex items-center gap-2">
              <span className="text-[10px] font-mono text-cyan-400 font-bold px-2 uppercase">Working Mine:</span>
              <select
                value={workingMine}
                onChange={(e) => setWorkingMine(e.target.value as any)}
                className="bg-slate-900 text-white font-bold text-xs py-1 px-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="JHARIA_PIT4">Jharia Pit #04 (Seam XIV)</option>
                <option value="MOONIDIH_UNDERGROUND">Moonidih Longwall Shaft</option>
                <option value="GEVRA_OPENCAST">Gevra Mega Opencast Bench</option>
                <option value="JAYANT_BASIN">Jayant Mega Opencast B</option>
              </select>
            </div>

            {onOpenCopilot && (
              <button
                onClick={onOpenCopilot}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-lg hover:shadow-cyan-500/25 border border-cyan-400/40"
              >
                <span className="material-symbols-outlined text-sm">psychology</span>
                <span>AI Slope Advice</span>
              </button>
            )}
          </div>
        </div>

        {/* Working Colliery Details Strip */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-300">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">ACTIVE COLLIERY:</span>
            <span className="text-white font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {currentColliery.name}
            </span>
            <span className="text-slate-400">({currentColliery.subsidiary})</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[10px]">
            <span><strong className="text-cyan-400">GPS:</strong> {currentColliery.coordinates}</span>
            <span><strong className="text-amber-400">BASIN:</strong> {currentColliery.basin}</span>
            <span><strong className="text-emerald-400">SEAM DEPTH:</strong> {currentColliery.depth}</span>
          </div>
        </div>
      </div>

      {/* 2. PRIMARY LAYER TOGGLES & TELEMETRY PILLS (User requirement: GPS nearby coal mines, gas risk heat map, slope radar, dust or water 500 plus) */}
      <div className="bg-[#091322] border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* 4 Primary Layer Switches */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                GIS SPATIAL LAYERS &amp; HAZARD BUFFERS:
              </span>
              <span className="text-[10px] font-mono text-slate-400">CMR 2017 Mandated Reticle</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {/* GPS Nearby Coal Mines */}
              <button
                onClick={() => setLayerGpsNearbyMines(!layerGpsNearbyMines)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 cursor-pointer border ${
                  layerGpsNearbyMines
                    ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${layerGpsNearbyMines ? 'bg-cyan-400 animate-ping' : 'bg-slate-600'}`}></span>
                <span>GPS Nearby Coal Mines</span>
                <span className="text-[10px] opacity-75">{layerGpsNearbyMines ? 'ON' : 'OFF'}</span>
              </button>

              {/* Gas Risk Heat Map */}
              <button
                onClick={() => setLayerGasRiskHeatmap(!layerGasRiskHeatmap)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 cursor-pointer border ${
                  layerGasRiskHeatmap
                    ? 'bg-rose-500/20 text-rose-200 border-rose-400/60 shadow-[0_0_12px_rgba(244,63,94,0.25)]'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${layerGasRiskHeatmap ? 'bg-rose-400 animate-pulse' : 'bg-slate-600'}`}></span>
                <span>Gas Risk Heat Map</span>
                <span className="text-[10px] opacity-75">{layerGasRiskHeatmap ? 'ON' : 'OFF'}</span>
              </button>

              {/* Slope Radar */}
              <button
                onClick={() => setLayerSlopeRadar(!layerSlopeRadar)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 cursor-pointer border ${
                  layerSlopeRadar
                    ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/60 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${layerSlopeRadar ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
                <span>Slope Radar (SSR-XT)</span>
                <span className="text-[10px] opacity-75">{layerSlopeRadar ? 'ON' : 'OFF'}</span>
              </button>

              {/* Dust or Water 500+ Buffer */}
              <button
                onClick={() => setLayerDustWaterBuffer(!layerDustWaterBuffer)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 cursor-pointer border ${
                  layerDustWaterBuffer
                    ? 'bg-blue-500/20 text-blue-200 border-blue-400/60 shadow-[0_0_12px_rgba(59,130,246,0.25)]'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${layerDustWaterBuffer ? 'bg-blue-400' : 'bg-slate-600'}`}></span>
                <span>Dust or Water 500+ Buffer</span>
                <span className="text-[10px] opacity-75">{layerDustWaterBuffer ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>

          {/* Live Atmospheric Telemetry Gauges (User requirement: CH4, CO, etc. normal options) */}
          <div className="flex flex-wrap items-center gap-2 bg-[#050c18] p-2 rounded-xl border border-slate-800">
            <div className="px-2.5 py-1 bg-slate-900/90 rounded-lg border border-slate-800 text-center font-mono">
              <div className="text-[9px] text-slate-400">CH4 GAS</div>
              <div className="text-xs font-black text-emerald-400">0.28%</div>
              <div className="text-[8px] text-emerald-500 font-bold">&lt;0.50% SAFE</div>
            </div>

            <div className="px-2.5 py-1 bg-slate-900/90 rounded-lg border border-slate-800 text-center font-mono">
              <div className="text-[9px] text-slate-400">CO TOXICITY</div>
              <div className="text-xs font-black text-cyan-300">12 PPM</div>
              <div className="text-[8px] text-cyan-400 font-bold">&lt;25 PPM REG</div>
            </div>

            <div className="px-2.5 py-1 bg-slate-900/90 rounded-lg border border-slate-800 text-center font-mono">
              <div className="text-[9px] text-slate-400">AIR VELOCITY</div>
              <div className="text-xs font-black text-amber-300">42 m³/s</div>
              <div className="text-[8px] text-amber-400 font-bold">&gt;30 m³/s MIN</div>
            </div>

            <div className="px-2.5 py-1 bg-slate-900/90 rounded-lg border border-slate-800 text-center font-mono">
              <div className="text-[9px] text-slate-400">SLOPE FOS</div>
              <div className="text-xs font-black text-emerald-400">1.48</div>
              <div className="text-[8px] text-emerald-500 font-bold">0.4 mm/hr DISP</div>
            </div>

            <div className="px-2.5 py-1 bg-slate-900/90 rounded-lg border border-slate-800 text-center font-mono hidden sm:block">
              <div className="text-[9px] text-slate-400">TEMP / RH</div>
              <div className="text-xs font-black text-slate-200">28.4°C / 68%</div>
              <div className="text-[8px] text-slate-400">1008 hPa</div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. SIMULATION CONTROLS, HEAT MAP LAYER OPACITY & TERRAIN RESOLUTION */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-[#091322] border border-slate-800 rounded-2xl p-4 shadow-xl text-xs font-mono">
        
        {/* Heat Map Layer Opacity Slider & Simulation Toggle (5 cols) */}
        <div className="md:col-span-6 lg:col-span-5 space-y-2.5 bg-[#070e1c] p-3 rounded-xl border border-slate-800/90">
          <div className="flex items-center justify-between">
            <span className="text-amber-400 font-bold uppercase flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-amber-400">opacity</span>
              <span>Heat Map Layer Opacity:</span>
            </span>
            <span className="font-bold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {heatmapOpacity}%
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-500">0%</span>
            <input
              type="range"
              min="10"
              max="100"
              value={heatmapOpacity}
              onChange={(e) => setHeatmapOpacity(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <span className="text-[10px] text-slate-400 font-bold">100%</span>
          </div>

          <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
            <span>Dynamic Alpha Blending</span>
            <span className="text-cyan-400">Interactive Visual Simulation</span>
          </div>
        </div>

        {/* Simulation Execution & Step Timeline (4 cols) */}
        <div className="md:col-span-6 lg:col-span-4 space-y-2 bg-[#070e1c] p-3 rounded-xl border border-slate-800/90">
          <div className="flex items-center justify-between">
            <span className="text-cyan-400 font-bold uppercase flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-cyan-400">play_circle</span>
              <span>Simulation Engine:</span>
            </span>
            <div className="flex items-center gap-1">
              {(['1X', '2X', '5X'] as const).map((spd) => (
                <button
                  key={spd}
                  onClick={() => setSimulationSpeed(spd)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-all ${
                    simulationSpeed === spd
                      ? 'bg-cyan-500 text-slate-950 shadow'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {spd}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={`px-2.5 py-1 rounded-lg font-bold text-[10px] flex items-center gap-1 transition-all cursor-pointer ${
                isSimulating
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}
            >
              <span className="material-symbols-outlined text-xs">{isSimulating ? 'pause' : 'play_arrow'}</span>
              <span>{isSimulating ? 'SIMULATING' : 'PAUSED'}</span>
            </button>

            <div className="flex-1 bg-slate-900 rounded-lg p-1.5 border border-slate-800 flex items-center justify-between text-[10px]">
              <span className="text-slate-400">FORECAST STEP:</span>
              <span className="text-white font-bold">+{simTimelineStep} MIN DRIFT</span>
            </div>
          </div>

          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-amber-500 h-full transition-all duration-300"
              style={{ width: `${simTimelineStep}%` }}
            ></div>
          </div>
        </div>

        {/* Terrain Resolution (3 cols) */}
        <div className="md:col-span-12 lg:col-span-3 space-y-2 bg-[#070e1c] p-3 rounded-xl border border-slate-800/90">
          <div className="text-[10px] font-bold text-amber-400 uppercase flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">terrain</span>
            <span>Terrain Resolution:</span>
          </div>

          <div className="grid grid-cols-3 lg:grid-cols-1 gap-1">
            {[
              { id: '0.5M_LIDAR', label: '0.5m LiDAR Pulse' },
              { id: '1.0M_DEM', label: '1.0m DEM Ground' },
              { id: '2.5M_SAR', label: '2.5m Sentinel SAR' }
            ].map((res) => (
              <button
                key={res.id}
                onClick={() => setTerrainResolution(res.id as any)}
                className={`px-2 py-1 rounded text-[10px] font-bold text-left transition-all cursor-pointer truncate ${
                  terrainResolution === res.id
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {res.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* 4. LIDAR COMPOSITE BAR (User requirement: Composite, Active Gas Hazards, Slope Geotech, Inspection Density) */}
      <div className="bg-[#091322] border border-slate-800 rounded-2xl p-3.5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">layers</span>
              <span>LiDAR Composite Modes (4 Options):</span>
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Selected: <strong className="text-white">{lidarComposite.replace(/_/g, ' ')}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            {
              id: 'COMPOSITE',
              label: '1. Composite',
              desc: 'Multi-spectral integrated view (All layers)',
              icon: 'grid_view',
              activeColor: 'from-cyan-600 to-blue-600 text-white border-cyan-400'
            },
            {
              id: 'ACTIVE_GAS_HAZARDS',
              label: '2. Active Gas Hazards',
              desc: 'CH4 & CO migration plumes & explosion limits',
              icon: 'air',
              activeColor: 'from-rose-600 to-amber-600 text-white border-rose-400'
            },
            {
              id: 'SLOPE_GEOTECH',
              label: '3. Slope Geotech',
              desc: 'Factor of Safety FOS & shear failure vectors',
              icon: 'landscape',
              activeColor: 'from-emerald-600 to-teal-600 text-white border-emerald-400'
            },
            {
              id: 'INSPECTION_DENSITY',
              label: '4. Inspection Density',
              desc: 'Form 24 audit track density & sensor mesh',
              icon: 'fact_check',
              activeColor: 'from-amber-600 to-orange-600 text-white border-amber-400'
            }
          ].map((mode) => {
            const isSelected = lidarComposite === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setLidarComposite(mode.id as any)}
                className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? `bg-gradient-to-r ${mode.activeColor} shadow-lg shadow-black/40`
                    : 'bg-slate-900/80 hover:bg-slate-800/80 text-slate-300 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="material-symbols-outlined text-sm">{mode.icon}</span>
                  <span className="text-xs font-bold font-mono truncate">{mode.label}</span>
                </div>
                <p className={`text-[10px] line-clamp-1 ${isSelected ? 'text-slate-100' : 'text-slate-400'}`}>
                  {mode.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. LIVE GEO-REFERENCING & DGMS TELEGRID STATUS BAR (User requirement: Live geo friend, geo reference, telemetry grid 100% self-seeing and DGMS telegrid) */}
      <div className="bg-gradient-to-r from-[#071324] via-[#09182d] to-[#07111e] border-2 border-emerald-500/30 px-4 py-2.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg font-mono text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-bold">LIVE GEO-REFERENCED TELEMETRY GRID</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/90 text-cyan-300 border border-slate-800 px-2.5 py-1 rounded-xl text-[11px]">
            <span className="material-symbols-outlined text-xs text-cyan-400">sync</span>
            <span>100% SELF-SYNCING</span>
            <span className="text-slate-400 text-[10px]">(Heartbeat 250ms • Latency 8ms)</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1.5 bg-[#0c1d33] text-amber-300 border border-amber-500/40 px-3 py-1 rounded-xl">
            <span className="material-symbols-outlined text-xs text-amber-400">hub</span>
            <span className="font-bold">DGMS TELEGRID NODE:</span>
            <span className="text-white">JH-04-APEX (ENCRYPTED)</span>
          </div>
          <span className="text-slate-400 hidden lg:inline">EPSG: 4326 (WGS84 DTM)</span>
        </div>
      </div>

      {/* 6. MAIN RADAR SCREEN & SECTOR DOSSIER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: The Visual Radar Viewport with dynamic layers & heat map (7 cols) */}
        <div className="lg:col-span-7 bg-[#050c18] border-2 border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          
          {/* Top Reticle Status */}
          <div className="flex items-center justify-between z-10 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase">SURFACE RETICLE:</span>
              <span className="text-xs font-mono text-white font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                {currentColliery.name.split(' - ')[0]} • Sector 4B
              </span>
            </div>
            
            <div className="flex items-center gap-1.5 text-xs font-mono">
              {(['VELOCITY', 'DISPLACEMENT', 'COHERENCE'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setFilterMode(m)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-all ${
                    filterMode === m
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Simulated Interactive Radar Screen with Heat Map Overlay */}
          <div className="relative w-full aspect-square max-h-[440px] mx-auto flex items-center justify-center my-2 select-none">
            
            {/* Outer Circular Rings */}
            <div className="absolute inset-0 rounded-full border border-cyan-500/20 flex items-center justify-center">
              <div className="w-3/4 h-3/4 rounded-full border border-cyan-500/25 flex items-center justify-center">
                <div className="w-1/2 h-1/2 rounded-full border border-cyan-500/30 flex items-center justify-center">
                  <div className="w-1/4 h-1/4 rounded-full border border-cyan-500/40"></div>
                </div>
              </div>
            </div>

            {/* Radar Crosshairs */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-[1px] bg-cyan-500/20"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[1px] h-full bg-cyan-500/20"></div>
            </div>

            {/* Background Pit Contour Map */}
            <div className="absolute inset-4 rounded-full overflow-hidden opacity-30 pointer-events-none">
              <img
                src="https://lh3.googleusercontent.com/aida/AEtjO1WBop4_-T6gF4WdHW05QwKuybRNyjj1n-9DGw970S7Yw0qTdu2cCghsySkTCO_4_dCzi7IKIygao7ctZYBo7XTS4LBDHzALEFviRmVGFdt0bqwYJ81JPeKsRBu6MmC42Ah6xCrFtSJt5J9j6glwG_ZnEgwn0YOBduvE6OVrPEe3hSaBMEn1ezRoU_LXlpRKQ2RlFPg4tDXPeoFWvtnCkgpw4zK-ZY269JFd51_Or0cZlj3SvLBbN__PmFjJ"
                alt="Pit highwall contour"
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            {/* DYNAMIC HEAT MAP LAYER OVERLAY (responds to Heat Map Opacity Slider) */}
            {layerGasRiskHeatmap && (
              <div
                className="absolute inset-6 rounded-full overflow-hidden pointer-events-none transition-opacity duration-300"
                style={{ opacity: heatmapOpacity / 100 }}
              >
                {/* Simulated gas risk heat plumes */}
                <div className="absolute w-44 h-44 rounded-full bg-gradient-to-r from-rose-500/80 via-amber-500/60 to-transparent blur-2xl top-10 left-16 animate-pulse"></div>
                <div className="absolute w-36 h-36 rounded-full bg-gradient-to-r from-amber-500/70 via-emerald-500/40 to-transparent blur-xl bottom-14 right-16"></div>
                <div className="absolute w-28 h-28 rounded-full bg-gradient-to-r from-cyan-500/70 via-blue-500/30 to-transparent blur-lg bottom-8 left-20"></div>
                
                {/* Visual heat isolines */}
                <div className="absolute top-1/3 left-1/4 text-[9px] font-mono text-rose-300 font-bold bg-slate-950/70 px-1.5 rounded border border-rose-500/40">
                  CH4: 0.39% PLUME
                </div>
              </div>
            )}

            {/* DUST OR WATER 500M+ BUFFER RINGS (CMR Reg 123/124) */}
            {layerDustWaterBuffer && (
              <div className="absolute inset-8 rounded-full border-2 border-dashed border-blue-400/50 pointer-events-none flex items-center justify-center">
                <span className="absolute top-2 text-[9px] font-mono font-bold text-blue-300 bg-slate-950/80 px-2 py-0.5 rounded border border-blue-500/30">
                  500m WATER INUNDATION / DUST BUFFER (CMR REG 123)
                </span>
              </div>
            )}

            {/* GPS NEARBY COAL MINES DIRECTIONAL VECTORS */}
            {layerGpsNearbyMines && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-3 right-6 bg-slate-950/90 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded text-[9px] font-mono shadow-md">
                  ↗ Moonidih (4.2km SW)
                </div>
                <div className="absolute bottom-4 left-4 bg-slate-950/90 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded text-[9px] font-mono shadow-md">
                  ↙ Sijua Rescue (3.8km W)
                </div>
              </div>
            )}

            {/* Rotating Radar Sweep Line */}
            {isLiveScanning && (
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ transform: `rotate(${radarAngle}deg)` }}
              >
                <div className="w-1/2 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-emerald-400 shadow-[0_0_12px_#38bdf8] origin-left"></div>
              </div>
            )}

            {/* Geotechnical Prisms Plotted on the Radar */}
            {layerSlopeRadar && prisms.map((prism) => (
              <div
                key={prism.id}
                className="absolute z-20 group cursor-pointer"
                style={{ left: `${prism.x}%`, top: `${prism.y}%` }}
              >
                <div className={`w-3.5 h-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 flex items-center justify-center ${
                  prism.alert
                    ? 'bg-amber-500 border-amber-300 animate-ping shadow-[0_0_12px_#f59e0b]'
                    : 'bg-emerald-500 border-emerald-300 shadow-[0_0_8px_#10b981]'
                }`}></div>
                
                {/* Tooltip Hover */}
                <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-950/95 border border-cyan-500/50 rounded-lg p-2.5 text-[11px] font-mono text-white whitespace-nowrap shadow-2xl z-30">
                  <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xs">location_pin</span>
                    <span>{prism.id} • {prism.label}</span>
                  </div>
                  <div>Disp. Rate: <span className={prism.alert ? 'text-amber-400 font-bold' : 'text-emerald-400'}>{prism.velocity}</span></div>
                  <div className="text-slate-300 text-[10px]">CH4: <strong className="text-emerald-400">{prism.ch4}</strong> | CO: <strong className="text-cyan-300">{prism.co}</strong></div>
                  <div className="text-[9px] text-slate-400 mt-0.5">GPS: 23.7957° N, 86.4304° E</div>
                </div>
              </div>
            ))}

            {/* Center Base Station */}
            <div className="relative z-20 w-5 h-5 rounded-full bg-cyan-400 border-2 border-white shadow-[0_0_16px_#38bdf8] flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-950"></span>
            </div>

            {/* Live Reticle Coordinates */}
            <div className="absolute top-2 left-2 text-[10px] font-mono text-cyan-400/80 bg-slate-950/80 px-2 py-1 rounded border border-cyan-500/20">
              COORD: {currentColliery.coordinates}<br/>
              AZIMUTH: {radarAngle.toFixed(0)}° • FREQ: 17.2 GHz
            </div>

            <div className="absolute bottom-2 right-2 text-[10px] font-mono text-emerald-400/80 bg-slate-950/80 px-2 py-1 rounded border border-emerald-500/20">
              SSR-XT DISPLACEMENT RETICLE<br/>
              ACCURACY: ±0.1 mm
            </div>
          </div>

          {/* Bottom Reticle Footer */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800 text-center font-mono">
            <div className="bg-[#0b1526] p-2 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-400">SCAN INTERVAL</div>
              <div className="text-xs sm:text-sm font-bold text-cyan-300">2.5 MIN / CYCLE</div>
            </div>
            <div className="bg-[#0b1526] p-2 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-400">ACTIVE PRISMS</div>
              <div className="text-xs sm:text-sm font-bold text-emerald-400">18 / 18 SYNCED</div>
            </div>
            <div className="bg-[#0b1526] p-2 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-400">INTERLOCK ALARM</div>
              <div className="text-xs sm:text-sm font-bold text-amber-400">SIREN READY</div>
            </div>
          </div>

        </div>

        {/* Right: Sector Details & Geotechnical Analysis (5 cols) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          
          {/* Sector Selector Tabs */}
          <div className="bg-[#091322] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block">
                COLLIERY BENCH SECTORS:
              </span>
              <span className="text-[10px] font-mono text-slate-400">4 Active Monitors</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {sectors.map((sector) => {
                const isSelected = selectedSector === sector.id;
                return (
                  <button
                    key={sector.id}
                    onClick={() => setSelectedSector(sector.id)}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#10243e] border-cyan-500 shadow-md'
                        : 'bg-slate-900/80 hover:bg-slate-800/80 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                        sector.risk === 'LOW'
                          ? 'bg-emerald-950 text-emerald-400'
                          : sector.risk === 'MODERATE'
                          ? 'bg-amber-950 text-amber-400'
                          : 'bg-cyan-950 text-cyan-400'
                      }`}>
                        FOS {sector.fos}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">{sector.status}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-200 line-clamp-1">{sector.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Sector Geotechnical Dossier */}
          <div className="bg-[#091322] border-2 border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 flex-1">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">SELECTED SECTOR DOSSIER</span>
                <h3 className="text-base font-bold text-white mt-0.5">{currentSectorData.name}</h3>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black font-mono text-emerald-400">{currentSectorData.fos}</div>
                <div className="text-[9px] font-mono text-slate-400">FACTOR OF SAFETY</div>
              </div>
            </div>

            {/* Geotechnical Parameters */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-[#050c18] p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px]">CURRENT DISPLACEMENT</span>
                <div className="text-sm font-bold text-white mt-0.5">{currentSectorData.displacement}</div>
                <span className="text-[9px] text-slate-500">Threshold: {currentSectorData.maxSafe}</span>
              </div>

              <div className="bg-[#050c18] p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px]">BENCH MOISTURE</span>
                <div className="text-sm font-bold text-cyan-300 mt-0.5">{currentSectorData.moisture}</div>
                <span className="text-[9px] text-slate-500">Piezometer reading</span>
              </div>

              <div className="bg-[#050c18] p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px]">BENCH HEIGHT / ANGLE</span>
                <div className="text-sm font-bold text-amber-300 mt-0.5">{currentSectorData.benchHeight} / {currentSectorData.benchAngle}</div>
                <span className="text-[9px] text-slate-500">CMR 106 Compliance</span>
              </div>

              <div className="bg-[#050c18] p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px]">AUTOMATED INTERLOCK</span>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">SIREN READY</div>
                <span className="text-[9px] text-slate-500">Sec 22 Trigger active</span>
              </div>
            </div>

            {/* Statutory Certification Under CMR 106 */}
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-300">
                <span className="material-symbols-outlined text-sm">verified_user</span>
                <span>Statutory Stability Clearance</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Certified by Statutory Geotechnical Engineer under CMR 2017 Reg 106. No tension cracking observed in last 48 hours. HEMM haulage authorized under safe working speed limit.
              </p>
            </div>

            <button
              onClick={() => alert(`Statutory Stability Dossier Generated for ${currentSectorData.name}!\n\nColliery: ${currentColliery.name}\nFactor of Safety: ${currentSectorData.fos}\nDisplacement: ${currentSectorData.displacement}\nAtmosphere: CH4 0.28% | CO 12 ppm\nDSC Signature: SHA256:7e8a9b... verified under Coal Mines Regulations 2017.`)}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              <span>Download Geotechnical Stability Dossier</span>
            </button>
          </div>

        </div>

      </div>

      {/* 7. DGMS RISK DENSITY GRADIENT SCALE & NEARBY COAL CENTER PROXIMITY MATRIX */}
      {/* (User requirement: DGMS risk density gradient scale and nearby coal center from proximity) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: DGMS Risk Density Gradient Scale (6 cols) */}
        <div className="lg:col-span-6 bg-[#091322] border-2 border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">STATUTORY RISK BENCHMARK</span>
              <h3 className="text-sm font-bold text-white mt-0.5">DGMS Risk Density Gradient Scale</h3>
            </div>
            <span className="text-[10px] bg-slate-900 text-cyan-300 border border-slate-800 px-2.5 py-1 rounded-lg">
              CMR 2017 Reg 106 / 153
            </span>
          </div>

          {/* Visual Gradient Scale Bar */}
          <div className="space-y-2">
            <div className="h-6 w-full rounded-xl bg-gradient-to-r from-emerald-500 via-cyan-500 via-amber-500 to-rose-600 shadow-inner relative flex items-center justify-between px-3 text-[10px] font-black text-slate-950">
              <span>0.00 (SAFE)</span>
              <span>0.40 (MONITOR)</span>
              <span>0.70 (ADVISORY)</span>
              <span>1.00 (CRITICAL)</span>
            </div>

            {/* Pointer for current working mine */}
            <div className="relative pt-1">
              <div className="w-full flex items-center justify-between text-[10px] text-slate-400">
                <span>Zone 0: Minimal</span>
                <span>Zone 1: Elevated</span>
                <span>Zone 2: Advisory</span>
                <span>Zone 3: Stop-Work</span>
              </div>
              <div className="mt-1 flex items-center gap-2 bg-[#050c18] p-2.5 rounded-xl border border-slate-800">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs text-slate-200">Current Pit Score: <strong className="text-emerald-400">0.18 (Zone 0 - Normal Operations)</strong></span>
              </div>
            </div>
          </div>

          {/* 4 Scale Tiers */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-[#050c18] p-2 rounded-lg border border-emerald-500/30">
              <span className="text-emerald-400 font-bold">0.00 - 0.20: Minimal Risk</span>
              <p className="text-[10px] text-slate-400 mt-0.5">Continuous automated telemetry logging, all standard shifts normal.</p>
            </div>
            <div className="bg-[#050c18] p-2 rounded-lg border border-cyan-500/30">
              <span className="text-cyan-400 font-bold">0.21 - 0.45: Elevated Monitor</span>
              <p className="text-[10px] text-slate-400 mt-0.5">Enhanced ventilation velocity, laser prism scan interval down to 1 min.</p>
            </div>
            <div className="bg-[#050c18] p-2 rounded-lg border border-amber-500/30">
              <span className="text-amber-400 font-bold">0.46 - 0.70: DGMS Advisory</span>
              <p className="text-[10px] text-slate-400 mt-0.5">Statutory warning, restricted HEMM haulage, mandatory gas drainage.</p>
            </div>
            <div className="bg-[#050c18] p-2 rounded-lg border border-rose-500/30">
              <span className="text-rose-400 font-bold">0.71 - 1.00: Critical Hazard</span>
              <p className="text-[10px] text-slate-400 mt-0.5">Section 22 Mines Act stop-work order, siren trip, immediate evacuation.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Nearby Coal Centers Proximity Matrix (6 cols) */}
        <div className="lg:col-span-6 bg-[#091322] border-2 border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">INTER-COLLIERY PROXIMITY NETWORK</span>
              <h3 className="text-sm font-bold text-white mt-0.5">Nearby Coal Centers &amp; Statutory Hubs</h3>
            </div>
            <span className="text-[10px] bg-slate-900 text-amber-300 border border-slate-800 px-2.5 py-1 rounded-lg">
              5 Stations Synced
            </span>
          </div>

          <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
            {nearbyCoalCenters.map((center) => (
              <div
                key={center.id}
                onClick={() => setSelectedCenter(center)}
                className="bg-[#050c18] hover:bg-[#0c1a2e] border border-slate-800 hover:border-cyan-500/50 p-3 rounded-xl transition-all cursor-pointer space-y-1.5 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {center.name}
                    </span>
                  </div>
                  <span className="text-[11px] font-black text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                    {center.distanceKm} km
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400">
                  <span>Bearing: <strong className="text-slate-200">{center.bearing}</strong> • ETA: <strong className="text-cyan-400">{center.eta}</strong></span>
                  <span className="text-emerald-400 font-bold">{center.dgmsLink}</span>
                </div>

                <div className="text-[9px] text-slate-500 truncate pt-0.5 border-t border-slate-800/80">
                  Contact: {center.contact}
                </div>
              </div>
            ))}
          </div>

          <div className="p-2.5 bg-cyan-950/30 border border-cyan-500/30 rounded-xl text-[11px] text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-cyan-400">alt_route</span>
              <span>Mutual Rescue &amp; Aid Protocol active within 10km colliery radius.</span>
            </span>
            <button
              onClick={() => alert('Broadcast statutory ping to all 5 nearby coal centers:\n\n• Moonidih Washery: ACK\n• DGMS Dhanbad HQ: ACK\n• Katras Pit #02: ACK\n• Sijua Rescue Station: READY (6 min)\n• Central Hospital: STANDBY')}
              className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg text-[10px] cursor-pointer"
            >
              Ping Network
            </button>
          </div>
        </div>

      </div>

      {/* Center Detail Modal */}
      {selectedCenter && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#091322] border-2 border-cyan-500/60 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-cyan-400">hub</span>
                <h3 className="font-bold text-white text-sm">{selectedCenter.name}</h3>
              </div>
              <button
                onClick={() => setSelectedCenter(null)}
                className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div><strong className="text-slate-400">Facility Type:</strong> {selectedCenter.type}</div>
              <div><strong className="text-slate-400">Radial Proximity:</strong> <span className="text-amber-400 font-bold">{selectedCenter.distanceKm} km</span> ({selectedCenter.bearing})</div>
              <div><strong className="text-slate-400">Transit / HEMM ETA:</strong> <span className="text-cyan-300 font-bold">{selectedCenter.eta}</span></div>
              <div><strong className="text-slate-400">DGMS Network Link:</strong> <span className="text-emerald-400 font-bold">{selectedCenter.dgmsLink}</span></div>
              <div><strong className="text-slate-400">Direct Contact:</strong> {selectedCenter.contact}</div>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-400">
              Inter-colliery mutual aid protocol certified under CMR 2017 Regulation 210. Emergency vehicles and specialized breathing apparatus squads automatically routed via GPS Geofence corridor.
            </div>

            <button
              onClick={() => {
                alert(`Direct statutory secure dispatch line connected to ${selectedCenter.name}!\nTelemetry channel opened.`);
                setSelectedCenter(null);
              }}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-2 rounded-xl text-xs cursor-pointer shadow"
            >
              Establish Direct Dispatch Interlock
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
