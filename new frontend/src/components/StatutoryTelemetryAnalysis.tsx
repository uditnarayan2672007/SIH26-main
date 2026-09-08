import React, { useState } from 'react';
import { TELEMETRY_MONTHLY_DATA } from '../data/complianceData';
import { TelemetryDataPoint } from '../types';

type MetricMode = 'combined' | 'incident' | 'alarms';
type Horizon = '6m' | '12m';
type KpiType = 'compliance' | 'incident' | 'nearmiss' | 'capa';

export const StatutoryTelemetryAnalysis: React.FC = () => {
  const [metricMode, setMetricMode] = useState<MetricMode>('combined');
  const [horizon, setHorizon] = useState<Horizon>('12m');
  const [selectedKpi, setSelectedKpi] = useState<KpiType>('compliance');
  const [hoveredPoint, setHoveredPoint] = useState<TelemetryDataPoint | null>(null);

  // Filter dataset by horizon
  const rawData = horizon === '6m' ? TELEMETRY_MONTHLY_DATA.slice(-6) : TELEMETRY_MONTHLY_DATA;

  // Latest stats
  const latest = rawData[rawData.length - 1];
  const previous = rawData[rawData.length - 2] || rawData[0];
  const momComplianceDiff = (latest.complianceRate - previous.complianceRate).toFixed(2);
  const totalIncidents = rawData.reduce((acc, d) => acc + d.incidentCount, 0);
  const totalNearMiss = rawData.reduce((acc, d) => acc + d.nearMissReports, 0);
  const avgCapaSla = (rawData.reduce((acc, d) => acc + d.capaSlaRate, 0) / rawData.length).toFixed(1);

  // Chart dimensions & scaling
  const chartHeight = 240;
  const chartWidth = 720;
  const paddingX = 45;
  const paddingY = 30;
  const usableWidth = chartWidth - paddingX * 2;
  const usableHeight = chartHeight - paddingY * 2;

  // Compute scale depending on metric
  const getY = (point: TelemetryDataPoint) => {
    if (metricMode === 'incident') {
      const maxInc = 4;
      return chartHeight - paddingY - (point.incidentCount / maxInc) * usableHeight;
    }
    if (metricMode === 'alarms') {
      const maxAlarm = 16;
      return chartHeight - paddingY - (point.alarmsCount / maxAlarm) * usableHeight;
    }
    // Combined / Compliance rate (scale from 97% to 100%)
    const minVal = 97.0;
    const maxVal = 100.0;
    const normalized = Math.max(0, Math.min(1, (point.complianceRate - minVal) / (maxVal - minVal)));
    return chartHeight - paddingY - normalized * usableHeight;
  };

  const points = rawData.map((d, i) => {
    const x = paddingX + (i / (rawData.length - 1)) * usableWidth;
    const y = getY(d);
    return { x, y, data: d };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`;

  // Secondary line for Alarms when in combined mode
  const alarmPoints = rawData.map((d, i) => {
    const x = paddingX + (i / (rawData.length - 1)) * usableWidth;
    const y = chartHeight - paddingY - (d.alarmsCount / 16) * usableHeight;
    return { x, y, count: d.alarmsCount };
  });

  const alarmPathD = alarmPoints.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  return (
    <section className="bg-gradient-to-b from-[#0a1527] via-[#081220] to-[#060d18] border-2 border-amber-500/30 rounded-2xl p-5 md:p-6 shadow-2xl relative overflow-hidden">
      {/* Background technical watermarks */}
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header & Controls Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-0.5 rounded-full text-xs font-mono font-bold text-amber-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>STATUTORY TELEMETRY ANALYSIS</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white font-serif tracking-tight">
            Colliery Telemetry &amp; Regulatory Incident Frequency
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Real-time sensory telemetry analysis under Coal Mines Regulations, 2017 (Reg 153, 106 &amp; 144)
          </p>
        </div>

        {/* Action Controls: 3 Metric Modes + 6M/12M Horizon */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* 3 Metric Mode Options */}
          <div className="bg-[#0e1c31] p-1 rounded-xl border border-slate-700 flex items-center gap-1 shadow-inner">
            <button
              onClick={() => setMetricMode('combined')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                metricMode === 'combined'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Combined Percentage
            </button>
            <button
              onClick={() => setMetricMode('incident')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                metricMode === 'incident'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Incident
            </button>
            <button
              onClick={() => setMetricMode('alarms')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                metricMode === 'alarms'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Alarms
            </button>
          </div>

          {/* Month Options: 6 Months or 12 Months */}
          <div className="bg-[#0e1c31] p-1 rounded-xl border border-slate-700 flex items-center gap-1 shadow-inner">
            <button
              onClick={() => setHorizon('6m')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                horizon === '6m'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              6 Months
            </button>
            <button
              onClick={() => setHorizon('12m')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                horizon === '12m'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              12 Months
            </button>
          </div>
        </div>
      </div>

      {/* 4 Interactive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 my-5">
        {/* KPI 1: MoM Compliance Rate */}
        <div
          onClick={() => setSelectedKpi('compliance')}
          className={`p-4 rounded-xl border transition-all cursor-pointer shadow-lg group relative overflow-hidden ${
            selectedKpi === 'compliance'
              ? 'bg-[#0f2139] border-emerald-400/80 ring-1 ring-emerald-400/30'
              : 'bg-[#091526] border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-mono font-semibold text-slate-400 mb-1">
            <span>MoM COMPLIANCE RATE</span>
            <span className="material-symbols-outlined text-emerald-400 text-base">verified</span>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-300 flex items-baseline gap-2">
            <span>{latest.complianceRate}%</span>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              +{momComplianceDiff}% MoM
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>Statutory Target: 98.0%</span>
            <span className="text-emerald-400 font-semibold font-mono">BENCHMARK PASS</span>
          </div>
        </div>

        {/* KPI 2: Incident Frequency */}
        <div
          onClick={() => setSelectedKpi('incident')}
          className={`p-4 rounded-xl border transition-all cursor-pointer shadow-lg group relative overflow-hidden ${
            selectedKpi === 'incident'
              ? 'bg-[#0f2139] border-cyan-400/80 ring-1 ring-cyan-400/30'
              : 'bg-[#091526] border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-mono font-semibold text-slate-400 mb-1">
            <span>INCIDENT FREQUENCY</span>
            <span className="material-symbols-outlined text-cyan-400 text-base">warning</span>
          </div>
          <div className="text-2xl font-black font-mono text-cyan-300 flex items-baseline gap-2">
            <span>{latest.incidentCount}</span>
            <span className="text-xs font-mono text-slate-400 font-normal">
              ({totalIncidents} in {horizon === '6m' ? '6 mos' : '12 mos'})
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>Rate: 0.04 / 100k shifts</span>
            <span className="text-cyan-400 font-semibold font-mono">-72% YoY Drop</span>
          </div>
        </div>

        {/* KPI 3: Near Miss Reports */}
        <div
          onClick={() => setSelectedKpi('nearmiss')}
          className={`p-4 rounded-xl border transition-all cursor-pointer shadow-lg group relative overflow-hidden ${
            selectedKpi === 'nearmiss'
              ? 'bg-[#0f2139] border-amber-400/80 ring-1 ring-amber-400/30'
              : 'bg-[#091526] border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-mono font-semibold text-slate-400 mb-1">
            <span>NEAR MISS REPORTS</span>
            <span className="material-symbols-outlined text-amber-400 text-base">report_problem</span>
          </div>
          <div className="text-2xl font-black font-mono text-amber-300 flex items-baseline gap-2">
            <span>{totalNearMiss} Logged</span>
            <span className="text-xs font-mono text-amber-400">100% Investigated</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>Resolved: {totalNearMiss - 1} cases</span>
            <span className="text-amber-400 font-semibold font-mono">1 Under Review</span>
          </div>
        </div>

        {/* KPI 4: CAPA Resolution & SLA */}
        <div
          onClick={() => setSelectedKpi('capa')}
          className={`p-4 rounded-xl border transition-all cursor-pointer shadow-lg group relative overflow-hidden ${
            selectedKpi === 'capa'
              ? 'bg-[#0f2139] border-orange-400/80 ring-1 ring-orange-400/30'
              : 'bg-[#091526] border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-mono font-semibold text-slate-400 mb-1">
            <span>CAPA RESOLUTION &amp; SLA</span>
            <span className="material-symbols-outlined text-orange-400 text-base">task_alt</span>
          </div>
          <div className="text-2xl font-black font-mono text-orange-300 flex items-baseline gap-2">
            <span>{avgCapaSla}%</span>
            <span className="text-xs font-mono text-emerald-400 font-bold">Within 48h SLA</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>DGMS Mandated Audit</span>
            <span className="text-emerald-400 font-semibold font-mono">ON SCHEDULE</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Telemetry Graph */}
      <div className="bg-[#050c17] rounded-xl border border-slate-800/90 p-4 md:p-5 relative shadow-inner">
        {/* Graph Legend & Status Sub-header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
              <span className="text-slate-300 font-medium">Compliance Rate (%)</span>
            </div>
            {metricMode === 'combined' && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-amber-400 shadow-[0_0_8px_#fbbf24]"></span>
                <span className="text-slate-300 font-medium">Alarms Count</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 border-b border-dashed border-red-400"></span>
              <span className="text-slate-400">DGMS Statutory Baseline (98.0%)</span>
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-400">
            {hoveredPoint ? (
              <span className="text-amber-300 font-bold">
                {hoveredPoint.month}: Compliance {hoveredPoint.complianceRate}% | Alarms: {hoveredPoint.alarmsCount} | Incidents: {hoveredPoint.incidentCount}
              </span>
            ) : (
              <span>Hover over monthly data points to inspect telemetry readouts</span>
            )}
          </div>
        </div>

        {/* SVG Responsive Container */}
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto min-w-[580px] max-h-[260px] overflow-visible"
          >
            <defs>
              <linearGradient id="telemetryGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="alarmGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid horizontal guidelines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
              const y = paddingY + ratio * usableHeight;
              const label =
                metricMode === 'incident'
                  ? `${Math.round(4 * (1 - ratio))}`
                  : metricMode === 'alarms'
                  ? `${Math.round(16 * (1 - ratio))}`
                  : `${(97 + 3 * (1 - ratio)).toFixed(1)}%`;
              return (
                <g key={idx}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="#1e293b"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                  <text
                    x={paddingX - 8}
                    y={y + 3}
                    textAnchor="end"
                    fill="#64748b"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    {label}
                  </text>
                </g>
              );
            })}

            {/* DGMS Statutory Threshold Line (at 98.0% in compliance view) */}
            {metricMode !== 'incident' && metricMode !== 'alarms' && (
              <g>
                <line
                  x1={paddingX}
                  y1={chartHeight - paddingY - ((98.0 - 97.0) / 3.0) * usableHeight}
                  x2={chartWidth - paddingX}
                  y2={chartHeight - paddingY - ((98.0 - 97.0) / 3.0) * usableHeight}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  strokeWidth="1.5"
                  opacity="0.75"
                />
                <text
                  x={chartWidth - paddingX + 5}
                  y={chartHeight - paddingY - ((98.0 - 97.0) / 3.0) * usableHeight + 3}
                  fill="#ef4444"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  98% THRESHOLD
                </text>
              </g>
            )}

            {/* Area Fill for primary metric */}
            <path d={areaD} fill="url(#telemetryGradient)" />

            {/* Secondary line (Alarms) if in combined mode */}
            {metricMode === 'combined' && (
              <path
                d={alarmPathD}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeDasharray="4 2"
                opacity="0.8"
              />
            )}

            {/* Primary line path */}
            <path
              d={pathD}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Points & Interactive Nodes */}
            {points.map((p, idx) => (
              <g
                key={idx}
                className="cursor-pointer transition-transform hover:scale-125"
                onMouseEnter={() => setHoveredPoint(p.data)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={hoveredPoint === p.data ? '6' : '4'}
                  fill="#10b981"
                  stroke="#050c17"
                  strokeWidth="2"
                  className="transition-all"
                />
                {/* Month labels on X axis */}
                <text
                  x={p.x}
                  y={chartHeight - 8}
                  textAnchor="middle"
                  fill={hoveredPoint === p.data ? '#38bdf8' : '#94a3b8'}
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight={hoveredPoint === p.data ? 'bold' : 'normal'}
                >
                  {p.data.month}
                </text>
              </g>
            ))}

            {/* Secondary alarm points in combined mode */}
            {metricMode === 'combined' &&
              alarmPoints.map((ap, idx) => (
                <circle
                  key={`alarm-${idx}`}
                  cx={ap.x}
                  cy={ap.y}
                  r="3.5"
                  fill="#f59e0b"
                  stroke="#050c17"
                  strokeWidth="1.5"
                />
              ))}
          </svg>
        </div>

        {/* Bottom Technical Reference Stamp */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">● CONTINUOUS SAMPLING INTERVAL: 500ms</span>
            <span>|</span>
            <span>NPL-Time Synchronized (UTC+05:30)</span>
          </div>
          <div className="text-slate-300">
            Source: DGMS Statutory SCADA Interface • ISO 45001 Verified
          </div>
        </div>
      </div>
    </section>
  );
};
