import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Activity, 
  Search, 
  RefreshCw,
  ArrowRight,
  TrendingDown,
  Scale
} from 'lucide-react';
import { MineSite, IoTSensorNode, FieldInspection, PredictiveRiskAnalysis } from '../types';

interface AIIntelligenceCenterProps {
  currentMine: MineSite | undefined;
  sensors: IoTSensorNode[];
  inspections: FieldInspection[];
  onTriggerAIRiskAudit: () => Promise<PredictiveRiskAnalysis | null>;
}

export const AIIntelligenceCenter: React.FC<AIIntelligenceCenterProps> = ({
  currentMine,
  sensors,
  inspections,
  onTriggerAIRiskAudit,
}) => {
  const [activeTab, setActiveTab] = useState<'RISK_AUDIT' | 'OCR_DIGITIZER' | 'ANOMALY_RADAR'>('RISK_AUDIT');
  const [riskAnalysis, setRiskAnalysis] = useState<PredictiveRiskAnalysis | null>(null);
  const [loadingRisk, setLoadingRisk] = useState(false);

  // OCR state
  const [sampleDocType, setSampleDocType] = useState('DGMS_FORM_IV');
  const [rawDocumentText, setRawDocumentText] = useState(
    `GOVERNMENT OF INDIA\nDIRECTORATE GENERAL OF MINES SAFETY\nEASTERN ZONE, SITARAMPUR\n\nNotice of Non-Conformance under Section 22(1) of Mines Act 1952\nTo: The Agent & Manager, Jharia Block-II Opencast Colliery, BCCL\n\nDuring inspection on 27/08/2026, the undersigned observed:\n1. Outer safety berm at North Haul Road Bench 4 measured 0.9m height against required 2.4m for 100T dumper operations (CMR 2017 Reg 108).\n2. Continuous AAQMS sensor at CHP loading hopper showed PM10 at 184 ug/m3 without operational mist suppression cannon.\n\nYou are directed to rectify these defects within 72 hours.`
  );
  const [ocrResult, setOcrResult] = useState<any | null>(null);
  const [loadingOCR, setLoadingOCR] = useState(false);

  const handleRunRiskAudit = async () => {
    setLoadingRisk(true);
    try {
      const res = await onTriggerAIRiskAudit();
      if (res) setRiskAnalysis(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingRisk(false);
    }
  };

  const handleRunOCRDigitization = async () => {
    setLoadingOCR(true);
    try {
      const response = await fetch('/api/ai/ocr-digitize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText: rawDocumentText,
          documentType: sampleDocType,
        })
      });
      const data = await response.json();
      setOcrResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingOCR(false);
    }
  };

  const handleSelectSampleDocument = (type: string) => {
    setSampleDocType(type);
    if (type === 'DGMS_FORM_IV') {
      setRawDocumentText(
        `GOVERNMENT OF INDIA\nDIRECTORATE GENERAL OF MINES SAFETY\nEASTERN ZONE, SITARAMPUR\n\nNotice of Non-Conformance under Section 22(1) of Mines Act 1952\nTo: The Agent & Manager, Jharia Block-II Opencast Colliery, BCCL\n\nDuring inspection on 27/08/2026, the undersigned observed:\n1. Outer safety berm at North Haul Road Bench 4 measured 0.9m height against required 2.4m for 100T dumper operations (CMR 2017 Reg 108).\n2. Continuous AAQMS sensor at CHP loading hopper showed PM10 at 184 ug/m3 without operational mist suppression cannon.\n\nYou are directed to rectify these defects within 72 hours.`
      );
    } else if (type === 'NABL_WATER_TEST') {
      setRawDocumentText(
        `NABL ACCREDITED ENVIRONMENTAL TESTING LABORATORY\nCertificate of Water Analysis - Piprawar Sump Effluent\nSample ID: WTR-CCL-2026-88\n\nTest Results:\n1. pH: 7.3 (Statutory Limit: 6.5 - 8.5) -> Compliant\n2. Total Suspended Solids (TSS): 142 mg/L (Statutory Limit: 100 mg/L) -> NON-COMPLIANT\n3. Oil & Grease: 14.5 mg/L (Statutory Limit: 10 mg/L) -> NON-COMPLIANT\n4. Iron (Fe): 4.2 mg/L (Statutory Limit: 3.0 mg/L) -> NON-COMPLIANT\n\nRecommendation: Flocculant dosage at ETP sump must be increased; oil skimmer maintenance required.`
      );
    } else if (type === 'SIRDAR_HANDWRITTEN_LOG') {
      setRawDocumentText(
        `कोलियरी शिफ्ट सिरदार दैनिक वैधानिक लॉगबुक\nखान: रानीगंज शीतलदासपुर भूमिगत खदान\nतारीख: 28/08/2026, प्रथम पाली (Shift 1)\n\nनिरीक्षण टिप्पणियां:\n1. इंक्लाइन 2, सीम 14 रिटर्न एयरवे में मीथेनोमीटर से CH4 0.88% दर्ज किया गया।\n2. छत पर सपोर्ट चॉक संख्या 18 के पास दरार देखी गई।\n3. ऑक्जिलरी वेंटिलेशन पंखे के डक्ट में 3 मीटर का कटाव मिला।\nतत्काल विद्युत आपूर्ति बंद कर वेंटिलेशन सुधार कार्य शुरू किया गया।`
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
              AI Powered Governance Engine
            </span>
            <span className="text-xs text-slate-400">
              Gemini 3.7 Flash Model • DGMS Statutory Intelligence
            </span>
          </div>
          <h2 className="text-base font-bold text-slate-100 mt-1">
            Predictive Hazard Forecasting, Anomaly Detection & OCR Digitization
          </h2>
        </div>

        {/* Sub-Tabs */}
        <div className="flex items-center gap-1 bg-slate-800/80 border border-slate-700/80 rounded-lg p-1 text-xs">
          <button
            onClick={() => setActiveTab('RISK_AUDIT')}
            className={`px-3 py-1.5 rounded-md font-bold transition-colors cursor-pointer ${
              activeTab === 'RISK_AUDIT' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Predictive Risk Audit
          </button>
          <button
            onClick={() => setActiveTab('OCR_DIGITIZER')}
            className={`px-3 py-1.5 rounded-md font-bold transition-colors cursor-pointer ${
              activeTab === 'OCR_DIGITIZER' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            OCR Document Digitizer
          </button>
          <button
            onClick={() => setActiveTab('ANOMALY_RADAR')}
            className={`px-3 py-1.5 rounded-md font-bold transition-colors cursor-pointer ${
              activeTab === 'ANOMALY_RADAR' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cross-Mine Anomaly Radar
          </button>
        </div>
      </div>

      {/* TAB 1: PREDICTIVE RISK AUDIT */}
      {activeTab === 'RISK_AUDIT' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Real-Time Sensor & Violation AI Risk Evaluation</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Fuses live gas ppm, slope displacement rates, and DGMS notices for {currentMine?.name || 'Selected Colliery'}
                </p>
              </div>

              <button
                onClick={handleRunRiskAudit}
                disabled={loadingRisk}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all cursor-pointer flex items-center gap-2"
              >
                {loadingRisk ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
                <span>{loadingRisk ? 'Evaluating Telemetry with Gemini 3.7...' : 'Run Live AI Risk Audit'}</span>
              </button>
            </div>

            {/* Risk Assessment Output */}
            {riskAnalysis ? (
              <div className="space-y-4 pt-4 border-t border-slate-800">
                {/* Composite Score Card */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Composite Risk Level</span>
                    <span className={`text-2xl font-black mt-1 block ${
                      riskAnalysis.overallRiskLevel === 'CRITICAL_EMERGENCY' ? 'text-red-400' : riskAnalysis.overallRiskLevel === 'HIGH' ? 'text-rose-400' : 'text-amber-400'
                    }`}>
                      {riskAnalysis.overallRiskLevel}
                    </span>
                    <span className="text-xs text-slate-400">Score: <strong>{riskAnalysis.compositeRiskScore}/100</strong></span>
                  </div>

                  <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 sm:col-span-2 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Statutory Escalation Directive</span>
                    <p className="text-xs text-slate-200 leading-relaxed font-medium">
                      {riskAnalysis.regulatoryEscalationWarning || 'All parameters monitored within acceptable DGMS variance buffer.'}
                    </p>
                  </div>
                </div>

                {/* High Risk Zones */}
                {riskAnalysis.highRiskZones.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Identified High-Risk Coal Seam Sectors:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {riskAnalysis.highRiskZones.map((zone, idx) => (
                        <div key={idx} className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-100">{zone.zoneName}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                              Probability: {Math.round(zone.probability * 100)}%
                            </span>
                          </div>
                          <p className="text-slate-300"><strong>Hazard:</strong> {zone.riskFactor}</p>
                          <p className="text-amber-400/90 font-mono text-[11px]"><strong>Clause:</strong> {zone.statutoryViolationRisk}</p>
                          <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-200">
                            <strong>Action:</strong> {zone.preventativeDirective}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-950/60 p-8 rounded-xl border border-slate-800/80 text-center text-slate-400 space-y-2">
                <BrainCircuit className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-xs">Click "Run Live AI Risk Audit" to evaluate current telemetry nodes and generate DGMS predictive risk scores.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: OCR DOCUMENT DIGITIZER */}
      {activeTab === 'OCR_DIGITIZER' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Side: Input Document / Scanned Text */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Statutory Document & Inspection OCR</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Digitize handwritten sirdar logs, DGMS notices & NABL lab reports
                </p>
              </div>
            </div>

            {/* Sample Selector Chips */}
            <div className="flex flex-wrap gap-2 text-xs pt-1">
              <button
                onClick={() => handleSelectSampleDocument('DGMS_FORM_IV')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  sampleDocType === 'DGMS_FORM_IV' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                }`}
              >
                DGMS Sec 22 Notice
              </button>
              <button
                onClick={() => handleSelectSampleDocument('NABL_WATER_TEST')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  sampleDocType === 'NABL_WATER_TEST' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                }`}
              >
                NABL Water Lab Cert
              </button>
              <button
                onClick={() => handleSelectSampleDocument('SIRDAR_HANDWRITTEN_LOG')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  sampleDocType === 'SIRDAR_HANDWRITTEN_LOG' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                }`}
              >
                Handwritten Sirdar Log (Hindi)
              </button>
            </div>

            <textarea
              rows={8}
              value={rawDocumentText}
              onChange={(e) => setRawDocumentText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500"
            />

            <button
              onClick={handleRunOCRDigitization}
              disabled={loadingOCR}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {loadingOCR ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{loadingOCR ? 'Digitizing & Extracting Clauses...' : 'Digitize & Extract Statutory Violations'}</span>
            </button>
          </div>

          {/* Right Side: Structured Extracted Compliance Clauses */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Structured Statutory Metadata & CAPA Directives</span>
            </h3>

            {ocrResult ? (
              <div className="space-y-3 text-xs text-slate-300">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                  <span className="font-bold text-amber-400 block">{ocrResult.documentTitle}</span>
                  <div className="grid grid-cols-2 gap-2 text-slate-400 pt-1">
                    <span>Date: <strong className="text-slate-200">{ocrResult.extractedMetadata?.inspectionDate}</strong></span>
                    <span>Mine: <strong className="text-slate-200">{ocrResult.extractedMetadata?.mineName}</strong></span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-slate-200 uppercase text-[10px] tracking-wider block">Extracted Non-Conformances:</span>
                  {ocrResult.detectedViolations?.map((v: any, i: number) => (
                    <div key={i} className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-amber-400">{v.statutoryClause}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300">
                          {v.riskSeverity}
                        </span>
                      </div>
                      <p className="text-slate-300">{v.observedDefect}</p>
                      <p className="text-emerald-400 text-[11px]"><strong>Directive:</strong> {v.remedialActionMandate}</p>
                    </div>
                  ))}
                </div>

                {ocrResult.cryptographicProofHash && (
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-500 truncate">
                    SHA256 Stamp: {ocrResult.cryptographicProofHash}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-950/60 p-8 rounded-xl border border-slate-800/80 text-center text-slate-400">
                <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs">Click "Digitize & Extract" to see instant clause parsing, statutory risk severity, and auto-generated CAPA deadlines.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ANOMALY RADAR */}
      {activeTab === 'ANOMALY_RADAR' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Cross-Subsidiary Systemic Anomaly Detection</span>
          </h3>
          <p className="text-xs text-slate-400">
            Identifies correlated patterns between weather shifts, contractor shifts, and near-miss frequency.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-amber-400 block">Monsoon Slope Creep Anomaly</span>
              <p className="text-slate-300 leading-relaxed">
                OB Dump #2 radar recorded a 3.4x displacement surge following 45mm rainfall in Jharia. Correlates with soft base stratum in Seam III.
              </p>
              <span className="text-[10px] text-slate-400 block font-mono">Confidence: 94% • DGMS Reg 106</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-rose-400 block">Contractor Fatigue Spike Pattern</span>
              <p className="text-slate-300 leading-relaxed">
                Third-shift tipper driver near-misses clustered between 02:00 AM and 04:30 AM in M/s Eastern Haulers gangs.
              </p>
              <span className="text-[10px] text-slate-400 block font-mono">Confidence: 89% • Mines Rules Rule 92</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-sky-400 block">CHP Mist Cannon Telemetry Drop</span>
              <p className="text-slate-300 leading-relaxed">
                Water pump pressure drops coincided with PM10 spikes above 150 µg/m³ during rail wagon loading cycles.
              </p>
              <span className="text-[10px] text-slate-400 block font-mono">Confidence: 96% • CPCB AAQMS</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
