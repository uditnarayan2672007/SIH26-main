import React, { useState, useEffect, useRef } from 'react';
import { 
  QrCode, 
  Camera, 
  RotateCw, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Upload, 
  Layers, 
  Shield, 
  Wrench, 
  MapPin, 
  Calendar, 
  Check, 
  ArrowRight,
  Info,
  Maximize2,
  RefreshCw
} from 'lucide-react';
import jsQR from 'jsqr';
import confetti from 'canvas-confetti';
import { 
  ScannedMiningAsset, 
  MINING_ASSET_REGISTRY, 
  lookupMiningAssetByQR 
} from '../data/equipmentData';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssetIdentified: (asset: ScannedMiningAsset, suggestedObservationIdx?: number) => void;
  currentMineName?: string;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onAssetIdentified,
  currentMineName = 'Jharia Opencast Project Block-II'
}) => {
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [identifiedAsset, setIdentifiedAsset] = useState<ScannedMiningAsset | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'LIVE_CAMERA' | 'SIMULATE_PRESETS' | 'UPLOAD_IMAGE'>('LIVE_CAMERA');
  const [scanLaserPos, setScanLaserPos] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Play Web Audio Confirmation Beep on successful QR decode
  const playBeepSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // First High Ping
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1400, now);
      osc1.frequency.exponentialRampToValueAtTime(1800, now + 0.08);
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.09);

      // Second Harmonic Confirmation Chirp
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(2200, now + 0.08);
      gain2.gain.setValueAtTime(0.35, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.19);
    } catch (e) {
      console.warn('Audio feedback failed:', e);
    }
  };

  // Start Camera Stream
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true');
          await videoRef.current.play().catch(e => console.warn('Video play error:', e));
          setIsScanning(true);
        }
      } else {
        setCameraError('Camera API (getUserMedia) not supported in this browser. You can use the instant preset simulator or upload a QR image.');
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError('Camera permission not granted or device camera currently in use. You can use the instant mining asset simulator below.');
    }
  };

  // Stop Camera Stream
  const stopCamera = () => {
    setIsScanning(false);
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Switch between front and rear cameras
  const toggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
  };

  // Effect to manage camera lifecycle when modal opens/closes or facingMode changes
  useEffect(() => {
    if (isOpen && activeSubTab === 'LIVE_CAMERA') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode, activeSubTab]);

  // QR Scanning Loop on Video Frames using jsQR
  useEffect(() => {
    if (!isScanning || !isOpen || activeSubTab !== 'LIVE_CAMERA') return;

    let isRunning = true;

    const scanFrame = () => {
      if (!isRunning) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && video.readyState === video.HAVE_ENOUGH_DATA && canvas) {
        const width = video.videoWidth;
        const height = video.videoHeight;

        if (width > 0 && height > 0) {
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });

          if (ctx) {
            ctx.drawImage(video, 0, 0, width, height);
            const imageData = ctx.getImageData(0, 0, width, height);

            // Execute jsQR decoder
            const qrCode = jsQR(imageData.data, width, height, {
              inversionAttempts: 'dontInvert'
            });

            if (qrCode && qrCode.data) {
              const detectedText = qrCode.data.trim();
              if (detectedText) {
                handleSuccessfulScan(detectedText);
                return; // Stop loop after detection
              }
            }
          }
        }
      }

      animFrameIdRef.current = requestAnimationFrame(scanFrame);
    };

    animFrameIdRef.current = requestAnimationFrame(scanFrame);

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isScanning, isOpen, activeSubTab]);

  // Handle successful QR detection (from camera, preset, or file)
  const handleSuccessfulScan = (rawText: string) => {
    playBeepSound();
    if (navigator.vibrate) {
      navigator.vibrate([40, 60, 40]);
    }
    setScannedResult(rawText);

    // Lookup in Mining Registry
    const asset = lookupMiningAssetByQR(rawText);
    if (asset) {
      setIdentifiedAsset(asset);
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
    } else {
      // Create a fallback asset representation if generic QR code
      const fallbackAsset: ScannedMiningAsset = {
        qrCode: rawText,
        assetId: `QR-${rawText.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8).toUpperCase() || 'SCAN'}`,
        name: `Scanned Colliery Tag (${rawText.slice(0, 30)})`,
        type: 'ZONE',
        sector: rawText,
        subLocation: 'Colliery Pit Area',
        collieryCode: 'BCCL-JHR-02',
        coordinates: { lat: 23.7435, lng: 86.4182, altMsl: 184 },
        applicableRegulations: ['CMR 2017 - Regulation 106/108'],
        defaultCategory: 'SAFETY',
        lastStatutoryInspection: new Date().toISOString().split('T')[0],
        nextInspectionDue: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        statutoryFitnessStatus: 'FIT_FOR_OPERATION',
        dgmsCertificateNo: 'DGMS/QR/CUSTOM-2026',
        assignedSupervisor: 'Mining Sirdar On-Duty',
        specifications: {
          model: 'Field Industrial QR Tag',
          serialNo: rawText,
          makeYear: 2026,
          capacity: 'Standard Mining Asset',
          safetyFeatures: ['Geo-referenced QR Marker']
        },
        commonInspectionChecks: [
          'Verify physical condition & safety clearances',
          'Inspect hazard warning signboards and illumination'
        ],
        suggestedObservations: [
          {
            title: `Inspection Observation at ${rawText.slice(0, 35)}`,
            findings: `Scanned asset label: ${rawText}. Routine statutory observation recorded via MineSync QR scanner.`,
            severity: 'MEDIUM',
            clause: 'CMR 2017 - General Safety Standards'
          }
        ]
      };
      setIdentifiedAsset(fallbackAsset);
    }
  };

  // Decode QR code from uploaded image file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const code = jsQR(imageData.data, img.width, img.height);

        if (code && code.data) {
          handleSuccessfulScan(code.data);
        } else {
          alert('No legible QR code detected in the uploaded image. Please try a clearer picture or select a preset asset below.');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Apply identified asset to the parent observation form
  const handleApplyToForm = (suggestedIdx: number = 0) => {
    if (identifiedAsset) {
      onAssetIdentified(identifiedAsset, suggestedIdx);
      onClose();
    }
  };

  // Reset current scan result to scan another tag
  const handleResetScan = () => {
    setScannedResult(null);
    setIdentifiedAsset(null);
    if (activeSubTab === 'LIVE_CAMERA') {
      setIsScanning(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-100">
                  Colliery Asset & Zone QR Scanner
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  DGMS Fast-ID
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Point camera at equipment plates or zone markers to auto-fill statutory observations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={onClose} 
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1.5 px-4 pt-3 pb-2 bg-slate-950/60 border-b border-slate-800 text-xs">
          <button
            onClick={() => {
              setActiveSubTab('LIVE_CAMERA');
              handleResetScan();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeSubTab === 'LIVE_CAMERA'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>1. Live Camera Scanner</span>
          </button>

          <button
            onClick={() => {
              setActiveSubTab('SIMULATE_PRESETS');
              stopCamera();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeSubTab === 'SIMULATE_PRESETS'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>2. Mining Asset Registry Presets</span>
          </button>

          <button
            onClick={() => {
              setActiveSubTab('UPLOAD_IMAGE');
              stopCamera();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeSubTab === 'UPLOAD_IMAGE'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>3. Upload QR Photo</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-950/40">
          {/* TAB 1: LIVE CAMERA VIEW */}
          {activeSubTab === 'LIVE_CAMERA' && !identifiedAsset && (
            <div className="space-y-4">
              {/* Viewfinder Frame */}
              <div className="relative aspect-[4/3] sm:aspect-video w-full max-w-lg mx-auto rounded-2xl overflow-hidden border-2 border-amber-500/40 bg-black shadow-2xl flex items-center justify-center">
                {/* Live Video Element */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                />

                {/* Hidden Processing Canvas */}
                <canvas ref={canvasRef} className="hidden" />

                {/* Viewfinder Target Reticle Overlay */}
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-4">
                  {/* Top Status Badge */}
                  <div className="bg-black/80 border border-amber-500/60 px-3 py-1 rounded-full text-[11px] font-bold text-amber-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>SCANNING FOR DGMS QR TAGS</span>
                  </div>

                  {/* Center Scanning Target Box */}
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56 border-2 border-dashed border-amber-400/80 rounded-2xl flex items-center justify-center overflow-hidden bg-amber-500/5">
                    {/* Corner Accent Brackets */}
                    <div className="absolute top-0 left-0 w-5 h-5 border-t-4 border-l-4 border-amber-400" />
                    <div className="absolute top-0 right-0 w-5 h-5 border-t-4 border-r-4 border-amber-400" />
                    <div className="absolute bottom-0 left-0 w-5 h-5 border-b-4 border-l-4 border-amber-400" />
                    <div className="absolute bottom-0 right-0 w-5 h-5 border-b-4 border-r-4 border-amber-400" />

                    {/* Animated Scanning Laser Line */}
                    <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_12px_#f59e0b] animate-[bounce_2s_infinite]" />

                    <span className="text-[10px] font-mono text-amber-300/80 bg-black/60 px-2 py-0.5 rounded">
                      Align QR Code Here
                    </span>
                  </div>

                  {/* Bottom Tooltip */}
                  <div className="bg-slate-900/90 border border-white/10 px-3 py-1 rounded-lg text-[10px] text-slate-300 text-center backdrop-blur-sm">
                    Keep camera 15-30 cm from equipment plate
                  </div>
                </div>

                {/* Camera Permission / Error Fallback */}
                {cameraError && (
                  <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center space-y-3 z-30">
                    <AlertTriangle className="w-10 h-10 text-amber-400" />
                    <div>
                      <h4 className="font-bold text-slate-200 text-xs sm:text-sm">Camera Notice</h4>
                      <p className="text-[11px] text-slate-400 max-w-sm mt-1">{cameraError}</p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setActiveSubTab('SIMULATE_PRESETS')}
                        className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer shadow-md"
                      >
                        ⚡ Use Instant Asset Presets
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveSubTab('UPLOAD_IMAGE');
                          fileInputRef.current?.click();
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 cursor-pointer"
                      >
                        Upload QR Image
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Viewfinder Controls */}
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={toggleFacingMode}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Switch Lens ({facingMode === 'environment' ? 'Rear' : 'Front'})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSubTab('SIMULATE_PRESETS')}
                  className="px-3 py-1.5 rounded-lg bg-indigo-950/70 hover:bg-indigo-900 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 border border-indigo-700/60 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Test with Demo Equipment QR</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: MINING ASSET REGISTRY & TEST QR LABELS */}
          {activeSubTab === 'SIMULATE_PRESETS' && !identifiedAsset && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1">
                <div>
                  <h4 className="font-bold text-xs text-slate-200 uppercase tracking-wider text-amber-400">
                    Statutory Mining Asset & Zone Label Registry ({MINING_ASSET_REGISTRY.length})
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Click any equipment tag below to instantly identify and auto-populate inspection parameters:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MINING_ASSET_REGISTRY.map((asset) => (
                  <div
                    key={asset.assetId}
                    onClick={() => handleSuccessfulScan(asset.qrCode)}
                    className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer group shadow-sm flex flex-col justify-between space-y-2"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                          {asset.assetId}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {asset.type}
                        </span>
                      </div>
                      <h5 className="font-bold text-xs text-slate-100 mt-2 group-hover:text-amber-300 transition-colors">
                        {asset.name}
                      </h5>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                        <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                        <span className="truncate">{asset.sector}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                      <span className="text-emerald-400 font-mono flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {asset.statutoryFitnessStatus.replace(/_/g, ' ')}
                      </span>
                      <span className="text-slate-400 group-hover:text-amber-400 font-bold flex items-center gap-1">
                        <span>Scan Label</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: UPLOAD QR PHOTO */}
          {activeSubTab === 'UPLOAD_IMAGE' && !identifiedAsset && (
            <div className="space-y-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-amber-500/80 rounded-2xl p-8 text-center bg-slate-900/50 hover:bg-slate-900 transition-all cursor-pointer space-y-3"
              >
                <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-200">Upload Image with Equipment QR Code</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Select a photo taken on your device or browse image files (.jpg, .png, .webp)
                  </p>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer shadow-md"
                >
                  Choose Photo
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}

          {/* ========================================================================= */}
          {/* SCANNED ASSET SUMMARY & STATUTORY SPECIFICATIONS CARD                    */}
          {/* ========================================================================= */}
          {identifiedAsset && (
            <div className="bg-slate-900 border-2 border-amber-500/60 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
              {/* Identification Success Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                      ✓ DGMS Statutory Asset Identified
                    </span>
                    <h4 className="text-base font-extrabold text-slate-100">
                      {identifiedAsset.name}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetScan}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Scan Another</span>
                  </button>
                </div>
              </div>

              {/* Asset Technical & Statutory Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Asset Tag ID</span>
                  <span className="font-mono font-bold text-amber-400 text-xs">{identifiedAsset.assetId}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Sector Location</span>
                  <span className="font-bold text-slate-200 text-xs truncate block">{identifiedAsset.sector}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">DGMS Certificate</span>
                  <span className="font-mono text-slate-300 text-[11px] truncate block">{identifiedAsset.dgmsCertificateNo}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Statutory Status</span>
                  <span className="font-bold text-emerald-400 text-xs flex items-center gap-1">
                    ● {identifiedAsset.statutoryFitnessStatus.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Technical Specifications & Safety Features */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-amber-400" />
                    <span>Specifications: {identifiedAsset.specifications.model} ({identifiedAsset.specifications.capacity})</span>
                  </span>
                  <span className="text-slate-400 font-mono text-[10px]">
                    S/N: {identifiedAsset.specifications.serialNo}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {identifiedAsset.specifications.safetyFeatures.map((feat, i) => (
                    <span 
                      key={i} 
                      className="px-2 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-700 text-slate-300"
                    >
                      ✓ {feat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Standard Statutory Checklist Items */}
              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-slate-300 text-[11px] flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Mandatory DGMS Field Inspection Checklist Items:</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {identifiedAsset.commonInspectionChecks.map((check, i) => (
                    <div 
                      key={i} 
                      className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-1.5"
                    >
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{check}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Non-Conformance / Observation Presets */}
              {identifiedAsset.suggestedObservations && identifiedAsset.suggestedObservations.length > 0 && (
                <div className="space-y-2 text-xs">
                  <span className="font-bold text-slate-300 text-[11px] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Quick Hazard & Observation Templates for this Asset:</span>
                  </span>
                  <div className="space-y-2">
                    {identifiedAsset.suggestedObservations.map((obs, idx) => (
                      <div 
                        key={idx}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-200 text-xs">{obs.title}</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                              obs.severity === 'CRITICAL_FATAL_RISK'
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                                : obs.severity === 'HIGH'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                            }`}>
                              {obs.severity.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-2">
                            {obs.findings}
                          </p>
                          <span className="text-[10px] font-mono text-amber-400/90 block">
                            Statutory Clause: {obs.clause}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleApplyToForm(idx)}
                          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 flex-shrink-0 cursor-pointer shadow-md transition-all self-start sm:self-center"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Apply to Report</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Primary Action Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
                <div className="text-[11px] text-slate-400">
                  Assigned Supervisor: <span className="text-slate-200 font-semibold">{identifiedAsset.assignedSupervisor}</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handleApplyToForm(0)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Auto-Populate Form with {identifiedAsset.assetId}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
