import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertOctagon, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  ArrowUpRight, 
  Activity, 
  Sparkles, 
  FileText,
  AlertTriangle,
  Radio,
  Calendar,
  Layers,
  BarChart3
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Area, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ReferenceLine 
} from 'recharts';
import { MineSite, StatutoryComplianceItem, FieldInspection, IoTSensorNode, SubsidiaryCode } from '../types';

interface ExecutiveOverviewProps {
  mines: MineSite[];
  complianceItems: StatutoryComplianceItem[];
  inspections: FieldInspection[];
  sensors: IoTSensorNode[];
  selectedSubsidiary: SubsidiaryCode;
  onSelectMine: (id: string) => void;
  onNavigateToTab: (tab: any) => void;
  onTriggerAIRiskAudit: () => void;
  onGenerateReport: () => void;
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({
  mines = [],
  complianceItems = [],
  inspections = [],
  sensors = [],
  selectedSubsidiary,
  onSelectMine,
  onNavigateToTab,
  onTriggerAIRiskAudit,
  onGenerateReport,
}) => {
  const safeMines = Array.isArray(mines) ? mines : [];
  const safeInspections = Array.isArray(inspections) ? inspections : [];
  const safeSensors = Array.isArray(sensors) ? sensors : [];

  // Calculations
  const filteredMines = selectedSubsidiary === 'CIL_HQ' 
    ? safeMines 
    : safeMines.filter(m => m.subsidiary === selectedSubsidiary);

  const avgComplianceScore = Math.round(
    filteredMines.reduce((acc, m) => acc + (m.complianceScore || 0), 0) / (filteredMines.length || 1)
  );

  const totalWorkforce = filteredMines.reduce((acc, m) => acc + (m.activeWorkforce || 0), 0);
  const totalProductionMT = filteredMines.reduce((acc, m) => acc + (m.currentProductionMT || 0), 0);
  const targetProductionMT = filteredMines.reduce((acc, m) => acc + (m.productionCapacityMTPA || 0), 0);

  const criticalViolations = safeInspections.filter(i => i.severity === 'CRITICAL_FATAL_RISK' || i.severity === 'HIGH');
  const activeSensorAlarms = safeSensors.filter(s => s.status === 'CRITICAL_ALARM' || s.status === 'WARNING');

  const [trendTimeframe, setTrendTimeframe] = useState<'6M' | '12M'>('12M');
  const [selectedMetricFocus, setSelectedMetricFocus] = useState<'ALL' | 'COMPLIANCE' | 'INCIDENTS'>('ALL');
  const [selectedStateFilter, setSelectedStateFilter] = useState<'ALL' | string>('ALL');

  const allStates = Array.from(new Set(filteredMines.map((mine) => mine.state))).sort();
  const stateSortedMines = (selectedStateFilter === 'ALL' ? filteredMines : filteredMines.filter((mine) => mine.state === selectedStateFilter))
    .slice()
    .sort((a, b) => a.state.localeCompare(b.state) || a.name.localeCompare(b.name));

  // Month-over-Month Historical & Real-Time Trend Dataset
  const momTrendData12M = [
    { month: 'Sep 25', complianceRate: 82.4, incidentCount: 8, nearMisses: 15, capaResolved: 24, dgmsTarget: 90 },
    { month: 'Oct 25', complianceRate: 84.1, incidentCount: 7, nearMisses: 12, capaResolved: 29, dgmsTarget: 90 },
    { month: 'Nov 25', complianceRate: 85.8, incidentCount: 6, nearMisses: 14, capaResolved: 33, dgmsTarget: 90 },
    { month: 'Dec 25', complianceRate: 87.2, incidentCount: 5, nearMisses: 11, capaResolved: 38, dgmsTarget: 90 },
    { month: 'Jan 26', complianceRate: 86.5, incidentCount: 6, nearMisses: 13, capaResolved: 35, dgmsTarget: 90 },
    { month: 'Feb 26', complianceRate: 89.0, incidentCount: 4, nearMisses: 9, capaResolved: 41, dgmsTarget: 90 },
    { month: 'Mar 26', complianceRate: 91.3, incidentCount: 3, nearMisses: 8, capaResolved: 44, dgmsTarget: 90 },
    { month: 'Apr 26', complianceRate: 90.8, incidentCount: 4, nearMisses: 7, capaResolved: 42, dgmsTarget: 90 },
    { month: 'May 26', complianceRate: 92.5, incidentCount: 3, nearMisses: 6, capaResolved: 48, dgmsTarget: 90 },
    { month: 'Jun 26', complianceRate: 93.1, incidentCount: 2, nearMisses: 5, capaResolved: 51, dgmsTarget: 90 },
    { month: 'Jul 26', complianceRate: 92.7, incidentCount: 3, nearMisses: 6, capaResolved: 49, dgmsTarget: 90 },
    { month: 'Aug 26', complianceRate: 94.6, incidentCount: 1, nearMisses: 4, capaResolved: 56, dgmsTarget: 90 },
  ];

  const activeTrendData = trendTimeframe === '6M' 
    ? momTrendData12M.slice(6) 
    : momTrendData12M;

  const currentMonthData = momTrendData12M[momTrendData12M.length - 1];
  const prevMonthData = momTrendData12M[momTrendData12M.length - 2];
  const momComplianceDiff = +(currentMonthData.complianceRate - prevMonthData.complianceRate).toFixed(1);
  const momIncidentDiff = currentMonthData.incidentCount - prevMonthData.incidentCount;

  // Custom Dark Bento Tooltip for Recharts
  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#12151A] border border-white/15 rounded-xl p-3.5 shadow-2xl backdrop-blur-md text-xs space-y-2 min-w-[200px]">
          <div className="font-bold text-slate-200 border-b border-white/10 pb-1.5 flex items-center justify-between">
            <span>Period: {label}</span>
            <span className="text-[10px] text-amber-400 font-mono">DGMS Audit Cycle</span>
          </div>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => {
              const nameMap: Record<string, { label: string; unit: string; color: string }> = {
                complianceRate: { label: 'Compliance Completion', unit: '%', color: '#10B981' },
                incidentCount: { label: 'Incident Frequency', unit: ' events', color: '#F43F5E' },
                nearMisses: { label: 'Near Misses', unit: ' logs', color: '#F59E0B' },
                capaResolved: { label: 'CAPA Closed', unit: ' items', color: '#38BDF8' },
                dgmsTarget: { label: 'DGMS Statutory Target', unit: '%', color: '#64748B' },
              };
              const info = nameMap[entry.dataKey] || { label: entry.name, unit: '', color: entry.color };
              return (
                <div key={`tooltip-${index}`} className="flex items-center justify-between gap-3 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: info.color }} />
                    <span className="text-slate-400">{info.label}:</span>
                  </div>
                  <span className="font-bold text-slate-100 font-mono">
                    {entry.value}{info.unit}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  const subsidiariesSummary: Record<SubsidiaryCode, { name: string; count: number; avgScore: number; violations: number }> = {
    CIL_HQ: { name: 'Coal India Ltd (Pan-India HQ)', count: safeMines.length, avgScore: 88, violations: safeInspections.length },
    BCCL: { name: 'Bharat Coking Coal Ltd (Dhanbad)', count: safeMines.filter(m => m.subsidiary === 'BCCL').length, avgScore: 84, violations: 3 },
    ECL: { name: 'Eastern Coalfields Ltd (Sanctoria)', count: safeMines.filter(m => m.subsidiary === 'ECL').length, avgScore: 78, violations: 4 },
    CCL: { name: 'Central Coalfields Ltd (Ranchi)', count: safeMines.filter(m => m.subsidiary === 'CCL').length, avgScore: 88, violations: 2 },
    WCL: { name: 'Western Coalfields Ltd (Nagpur)', count: safeMines.filter(m => m.subsidiary === 'WCL').length, avgScore: 82, violations: 2 },
    SECL: { name: 'South Eastern Coalfields (Bilaspur)', count: safeMines.filter(m => m.subsidiary === 'SECL').length, avgScore: 94, violations: 1 },
    MCL: { name: 'Mahanadi Coalfields (Sambalpur)', count: safeMines.filter(m => m.subsidiary === 'MCL').length, avgScore: 91, violations: 0 },
    NCL: { name: 'Northern Coalfields (Singrauli)', count: safeMines.filter(m => m.subsidiary === 'NCL').length, avgScore: 96, violations: 1 },
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Alert (If Active Critical Alarms exist) */}
      {activeSensorAlarms.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg shadow-red-950/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-500/20 text-red-400">
              <AlertOctagon className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-red-400">Critical Statutory Alert</div>
              <h3 className="text-sm font-bold text-white mt-0.5">
                {activeSensorAlarms.length} Active Sensor Threshold Breaches Under CMR 2017
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Methane (CH4) 0.88% at Raniganj Incline 2 & Slope Radar Shift 6.8mm at Jharia OB Dump #2.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => onNavigateToTab('GIS_MAP')}
              className="flex-1 md:flex-none px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-600/30 transition-all cursor-pointer"
            >
              View GIS Radar
            </button>
            <button
              onClick={onTriggerAIRiskAudit}
              className="flex-1 md:flex-none px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-white/10 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Anomaly Audit</span>
            </button>
          </div>
        </div>
      )}

      {/* Primary KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Statutory Health */}
        <div className="bg-[#161B22] border border-white/5 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Statutory Health</div>
            <div className="text-3xl font-bold mt-2 text-white">{avgComplianceScore}%</div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5">
            <div className="flex items-center gap-1.5 text-xs text-green-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+2.4% vs DGMS Benchmark</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 mt-2 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  avgComplianceScore >= 90 ? 'bg-green-500' : avgComplianceScore >= 80 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${avgComplianceScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Open Statutory Notices */}
        <div className="bg-[#161B22] border border-white/5 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Open CAPA Notices</div>
            <div className="text-3xl font-bold mt-2 text-white">{criticalViolations.length}</div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs text-red-400 font-semibold">
              {criticalViolations.filter(c => c.severity === 'CRITICAL_FATAL_RISK').length} High Hazard
            </span>
            <button 
              onClick={() => onNavigateToTab('INSPECTION_CAPA')}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-0.5 cursor-pointer"
            >
              Resolve <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Production Output */}
        <div className="bg-[#161B22] border border-white/5 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Production (FY26)</div>
            <div className="text-3xl font-bold mt-2 text-white">
              {totalProductionMT.toFixed(1)} <span className="text-sm text-slate-400 font-normal">MT</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5">
            <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
              <span>Cap: {targetProductionMT.toFixed(0)} MTPA</span>
              <span className="text-emerald-400 font-bold">Zero Fatalities</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-sky-500 rounded-full"
                style={{ width: `${Math.min(100, (totalProductionMT / (targetProductionMT || 1)) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Active Workforce */}
        <div className="bg-[#161B22] border border-white/5 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Workforce</div>
            <div className="text-3xl font-bold mt-2 text-white">{totalWorkforce.toLocaleString()}</div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-slate-400">VTC & PME Certified</span>
            <span className="text-green-400 font-bold">94.8% Valid</span>
          </div>
        </div>
      </div>

      {/* Recharts Month-over-Month Compliance & Incident Trend Visualization Bento Card */}
      <div className="bg-[#161B22] border border-white/5 rounded-2xl p-5 lg:p-6 shadow-sm space-y-5">
        {/* Header & Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-0.5">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <span>Predictive Performance & Statutory Trends</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[9px]">MoM ANALYTICS</span>
              </div>
              <h2 className="text-base font-bold text-white mt-0.5">
                Month-over-Month Compliance Rate & Incident Trajectory
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluates statutory completion compliance against Coal Mines Regulations 2017 with DGMS 90% threshold line
              </p>
            </div>
          </div>

          {/* Timeframe & Focus Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Metric Mode Toggle */}
            <div className="flex bg-[#0E1116] p-1 rounded-xl border border-white/10 text-xs">
              <button
                id="btn-trend-filter-all"
                onClick={() => setSelectedMetricFocus('ALL')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  selectedMetricFocus === 'ALL' 
                    ? 'bg-amber-500 text-black shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Combined
              </button>
              <button
                id="btn-trend-filter-comp"
                onClick={() => setSelectedMetricFocus('COMPLIANCE')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  selectedMetricFocus === 'COMPLIANCE' 
                    ? 'bg-emerald-500 text-black shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Compliance %
              </button>
              <button
                id="btn-trend-filter-incidents"
                onClick={() => setSelectedMetricFocus('INCIDENTS')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  selectedMetricFocus === 'INCIDENTS' 
                    ? 'bg-rose-500 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Incidents & Alarms
              </button>
            </div>

            {/* Time Horizon Selector */}
            <div className="flex bg-[#0E1116] p-1 rounded-xl border border-white/10 text-xs">
              <button
                id="btn-timeframe-6m"
                onClick={() => setTrendTimeframe('6M')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  trendTimeframe === '6M' 
                    ? 'bg-white/15 text-white' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                6M
              </button>
              <button
                id="btn-timeframe-12m"
                onClick={() => setTrendTimeframe('12M')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  trendTimeframe === '12M' 
                    ? 'bg-white/15 text-white' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                12M (FY25-26)
              </button>
            </div>
          </div>
        </div>

        {/* Quick Statutory Trajectory Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#12151A] border border-white/5 rounded-xl p-3.5">
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">MoM Compliance Rate</div>
            <div className="text-xl font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
              <span>{currentMonthData.complianceRate}%</span>
              <span className={`text-[11px] font-semibold px-1.5 py-0.2 rounded ${momComplianceDiff >= 0 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'}`}>
                {momComplianceDiff >= 0 ? `+${momComplianceDiff}%` : `${momComplianceDiff}%`}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">vs 90.0% Statutory Target</span>
          </div>

          <div className="bg-[#12151A] border border-white/5 rounded-xl p-3.5">
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Incident Frequency</div>
            <div className="text-xl font-bold text-rose-400 mt-1 flex items-center gap-1.5">
              <span>{currentMonthData.incidentCount} Event{currentMonthData.incidentCount === 1 ? '' : 's'}</span>
              <span className="text-[11px] font-semibold px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400">
                -87.5% YoY
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">Down from 8 in Sep 2025</span>
          </div>

          <div className="bg-[#12151A] border border-white/5 rounded-xl p-3.5">
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Near-Miss Reporting</div>
            <div className="text-xl font-bold text-amber-400 mt-1">
              <span>{currentMonthData.nearMisses} Logs</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">Proactive hazard mitigation</span>
          </div>

          <div className="bg-[#12151A] border border-white/5 rounded-xl p-3.5">
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">CAPA Resolutions</div>
            <div className="text-xl font-bold text-sky-400 mt-1 flex items-center gap-1.5">
              <span>{currentMonthData.capaResolved} Closed</span>
              <span className="text-[11px] font-semibold text-sky-300">/ 56 Total</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">100% DGMS adherence</span>
          </div>
        </div>

        {/* Recharts Interactive Visualizer */}
        <div className="w-full h-[320px] bg-[#12151A]/60 rounded-xl p-2.5 border border-white/5">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={activeTrendData}
              margin={{ top: 20, right: 20, bottom: 10, left: -10 }}
            >
              <defs>
                <linearGradient id="colorCompliance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid stroke="#1F2937" strokeDasharray="3 3" vertical={false} />
              
              <XAxis 
                dataKey="month" 
                stroke="#64748B" 
                fontSize={11} 
                tickLine={false}
                axisLine={{ stroke: '#374151' }}
              />
              
              {/* Left Axis: Compliance Completion Rate (%) */}
              <YAxis 
                yAxisId="left" 
                domain={[70, 100]} 
                unit="%" 
                stroke="#10B981" 
                fontSize={11} 
                tickLine={false}
                axisLine={{ stroke: '#10B981', strokeOpacity: 0.3 }}
              />
              
              {/* Right Axis: Incident & Log Counts */}
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                domain={[0, 20]} 
                stroke="#F43F5E" 
                fontSize={11} 
                tickLine={false}
                axisLine={{ stroke: '#F43F5E', strokeOpacity: 0.3 }}
              />

              <Tooltip content={<CustomChartTooltip />} />
              
              <Legend 
                verticalAlign="top" 
                align="right"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '11px' }}
              />

              {/* DGMS Statutory 90% Safety Target Reference Line */}
              <ReferenceLine 
                y={90} 
                yAxisId="left" 
                stroke="#F59E0B" 
                strokeDasharray="4 4" 
                label={{ 
                  value: 'DGMS 90% Statutory Target', 
                  fill: '#F59E0B', 
                  fontSize: 10, 
                  position: 'insideTopLeft' 
                }} 
              />

              {/* Compliance Rate Area (Shown in ALL or COMPLIANCE mode) */}
              {(selectedMetricFocus === 'ALL' || selectedMetricFocus === 'COMPLIANCE') && (
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="complianceRate"
                  name="Compliance Rate (%)"
                  stroke="#10B981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorCompliance)"
                  activeDot={{ r: 6, fill: '#10B981', stroke: '#0D0F12', strokeWidth: 2 }}
                />
              )}

              {/* Incidents Count Bar (Shown in ALL or INCIDENTS mode) */}
              {(selectedMetricFocus === 'ALL' || selectedMetricFocus === 'INCIDENTS') && (
                <Bar
                  yAxisId="right"
                  dataKey="incidentCount"
                  name="Incidents (Count)"
                  fill="#F43F5E"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={20}
                />
              )}

              {/* Near Misses Bar */}
              {(selectedMetricFocus === 'ALL' || selectedMetricFocus === 'INCIDENTS') && (
                <Bar
                  yAxisId="right"
                  dataKey="nearMisses"
                  name="Near Misses"
                  fill="#F59E0B"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={20}
                  fillOpacity={0.65}
                />
              )}

              {/* CAPA Resolved Line in Incidents focus */}
              {selectedMetricFocus === 'INCIDENTS' && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="capaResolved"
                  name="CAPA Actions Closed"
                  stroke="#38BDF8"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#38BDF8' }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Footer Insight Caption */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 text-xs text-slate-400 border-t border-white/5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Current Trajectory: <strong className="text-slate-200 font-semibold">+12.2% overall compliance improvement</strong> over the trailing 12 months</span>
          </div>
          <span className="font-mono text-[11px] text-amber-400/80">DGMS Section 22 Safety Benchmark Satisfied</span>
        </div>
      </div>

      {/* Secondary Bento Grid Row: Interactive GIS Radar Tile & Live Compliance Alert Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Live GIS Radar Bento Panel */}
        <div 
          onClick={() => onNavigateToTab('GIS_MAP')}
          className="lg:col-span-2 bg-[#161B22] border border-white/5 rounded-2xl p-1 overflow-hidden relative cursor-pointer group transition-all hover:border-amber-500/40 min-h-[260px] flex flex-col"
        >
          <div className="absolute top-4 left-4 z-10 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-xs font-bold text-white uppercase tracking-wider">LIVE GIS Radar • 8 Operating Coalfields</span>
          </div>

          <div className="absolute top-4 right-4 z-10 bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-[11px] font-semibold text-amber-400 group-hover:text-amber-300 flex items-center gap-1">
            <span>Open Interactive Map</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>

          <div className="w-full flex-1 bg-[#1A1F26] rounded-xl flex items-center justify-center relative overflow-hidden">
            {/* Grid dot pattern background */}
            <div 
              className="absolute inset-0 opacity-25" 
              style={{ backgroundImage: 'radial-gradient(#3B82F6 1px, transparent 1px)', backgroundSize: '24px 24px' }}
            />

            {/* Concentric Radar Rings */}
            <div className="w-[300px] h-[300px] border border-blue-500/20 rounded-full flex items-center justify-center absolute">
              <div className="w-[200px] h-[200px] border border-blue-500/30 rounded-full flex items-center justify-center">
                <div className="w-[100px] h-[100px] border border-blue-400/40 rounded-full flex items-center justify-center">
                  <div className="w-3.5 h-3.5 bg-amber-500 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.8)] animate-ping" />
                  <div className="w-3 h-3 bg-amber-400 rounded-full absolute" />
                </div>
              </div>
            </div>

            {/* Radar Sweep Line */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-1/2 h-[1px] bg-gradient-to-r from-transparent via-amber-400/60 to-amber-400 origin-left animate-spin" style={{ animationDuration: '8s' }} />
            </div>

            {/* Simulated Live Mine Sensor Markers */}
            <div className="absolute bottom-6 left-8 flex items-center gap-4 bg-black/60 backdrop-blur px-3 py-1.5 rounded-lg border border-white/10 text-[11px]">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-sm rotate-45" />
                <span className="text-slate-300 font-medium">Raniganj CH4 (0.88%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-amber-500 rounded-sm rotate-45" />
                <span className="text-slate-300 font-medium">Jharia Slope (6.8mm)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-sm rotate-45" />
                <span className="text-slate-300 font-medium">Gevra Normal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Compliance Alert Feed Bento Panel */}
        <div className="bg-[#161B22] border border-white/5 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Compliance Alert Feed</div>
            <span className="text-[10px] text-slate-400 font-mono">Live Telemetry</span>
          </div>

          <div className="space-y-2.5 flex-1">
            <div className="p-3 bg-red-500/10 border-l-4 border-red-500 rounded-r-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Critical Anomaly</span>
                <span className="text-[10px] text-slate-500">2 mins ago</span>
              </div>
              <p className="text-xs text-slate-200 mt-1 line-clamp-2">
                CH4 levels exceeded 0.75% threshold in Raniganj UG Mine-4 Incline.
              </p>
              <div className="text-[10px] text-slate-400 mt-1.5 font-mono">Sensor #sensor-ch4-01 • ECL</div>
            </div>

            <div className="p-3 bg-amber-500/10 border-l-4 border-amber-500 rounded-r-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Slope Shift Warning</span>
                <span className="text-[10px] text-slate-500">18 mins ago</span>
              </div>
              <p className="text-xs text-slate-200 mt-1 line-clamp-2">
                Overburden Dump #2 Radar recorded 6.8mm displacement.
              </p>
              <div className="text-[10px] text-slate-400 mt-1.5 font-mono">Sensor #sensor-slope-02 • BCCL</div>
            </div>

            <div className="p-3 bg-blue-500/10 border-l-4 border-blue-500 rounded-r-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Field Audit Filed</span>
                <span className="text-[10px] text-slate-500">1 hr ago</span>
              </div>
              <p className="text-xs text-slate-200 mt-1 line-clamp-2">
                DGMS statutory inspection completed for Gevra Mega Open Cast.
              </p>
              <div className="text-[10px] text-slate-400 mt-1.5 font-mono">Inspector B. N. Ghosh</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Predictive Suggestion Banner */}
      <div className="bg-gradient-to-r from-amber-600/20 via-amber-600/10 to-transparent border border-amber-500/20 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-amber-500 flex items-center justify-center text-black font-black text-xl shrink-0 shadow-lg shadow-amber-500/30">
            !
          </div>
          <div>
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">AI Statutory Intelligence Suggestion</div>
            <h4 className="text-sm font-bold text-white mt-0.5">Automated DGMS Section 22 Compliance Remediation</h4>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Monsoon saturation combined with slope displacement at Jharia Block-II triggers mandatory CMR 2017 Reg 108 berm inspection. Generate statutory CAPA response for DGMS inspection before shift handover.
            </p>
          </div>
        </div>
        <button
          onClick={onTriggerAIRiskAudit}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-xl uppercase tracking-wider shadow-md shadow-amber-500/20 transition-all cursor-pointer shrink-0"
        >
          Initiate AI Audit
        </button>
      </div>

      {/* Subsidiary Monitoring Bento Grid */}
      <div className="bg-[#161B22] border border-white/5 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Subsidiary Compliance Standings</div>
            <h3 className="text-sm font-bold text-white mt-0.5">Coal India Operating Subsidiaries (BCCL, ECL, CCL, WCL, SECL, MCL, NCL)</h3>
          </div>
          <div className="text-xs text-slate-400 font-medium">Pan-India HQ Sync: Active</div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {(['NCL', 'SECL', 'MCL', 'CCL', 'BCCL', 'WCL', 'ECL'] as SubsidiaryCode[]).map((subCode) => {
            const sub = subsidiariesSummary[subCode];
            return (
              <div key={subCode} className="bg-slate-800/40 rounded-xl p-3.5 border border-white/5 hover:border-amber-500/30 transition-all">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{subCode}</div>
                <div className="text-xl font-bold text-white mt-1">
                  {sub.avgScore}%
                  <span className={`text-[10px] ml-1 font-semibold ${sub.avgScore >= 90 ? 'text-green-400' : sub.avgScore >= 80 ? 'text-amber-400' : 'text-red-400'}`}>
                    {sub.avgScore >= 90 ? '+3%' : sub.avgScore >= 80 ? '0%' : '-2%'}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 truncate">{sub.count} Mines</div>
                <div className="w-full bg-slate-700/60 h-1 mt-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${sub.avgScore >= 90 ? 'bg-green-500' : sub.avgScore >= 80 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${sub.avgScore}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Colliery Project Cards Bento Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Colliery Directory</div>
            <h2 className="text-base font-bold text-white mt-0.5 flex items-center gap-2">
              <Radio className="w-4 h-4 text-amber-400" />
              <span>Colliery Projects & Statutory Standings</span>
            </h2>
          </div>
          <button
            onClick={onGenerateReport}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Statutory Return PDF</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMines.map((mine) => {
            const mineSensors = sensors.filter(s => s.mineId === mine.id);
            const hasCritical = mineSensors.some(s => s.status === 'CRITICAL_ALARM');

            return (
              <div 
                key={mine.id}
                onClick={() => onSelectMine(mine.id)}
                className={`bg-[#161B22] border rounded-2xl p-5 transition-all hover:border-amber-500/50 cursor-pointer ${
                  hasCritical ? 'border-red-500/40 shadow-lg shadow-red-950/20' : 'border-white/5 hover:shadow-lg'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">
                        {mine.subsidiary}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 font-semibold">{mine.code}</span>
                    </div>
                    <h3 className="font-bold text-sm text-white mt-2 line-clamp-1">{mine.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{mine.district}, {mine.state} • {mine.type}</p>
                  </div>

                  <div className="text-right">
                    <span className={`inline-block px-2.5 py-1 rounded-xl text-xs font-bold border ${
                      mine.complianceScore >= 90 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : mine.complianceScore >= 80 
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {mine.complianceScore}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/5 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Workforce</span>
                    <span className="font-bold text-slate-200">{mine.activeWorkforce}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Output</span>
                    <span className="font-bold text-slate-200">{mine.currentProductionMT} MT</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">DGMS Grade</span>
                    <span className={`font-bold ${mine.safetyRating === 'CRITICAL_WATCH' ? 'text-red-400' : 'text-green-400'}`}>
                      {mine.safetyRating}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 flex items-center justify-between text-xs text-slate-400 border-t border-white/5">
                  <span className="truncate max-w-[170px] text-[11px]">Officer: {mine.projectOfficer}</span>
                  <span className="text-amber-400 font-bold flex items-center gap-0.5 group-hover:text-amber-300">
                    Explore GIS <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
