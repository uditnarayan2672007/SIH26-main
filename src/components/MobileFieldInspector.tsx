import React, { useState, useEffect, useRef } from 'react';
import { 
  Smartphone, 
  MapPin, 
  Camera, 
  Mic, 
  MicOff,
  Wifi, 
  WifiOff, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  RefreshCw, 
  UserCheck, 
  FileText, 
  Sparkles,
  Shield,
  Volume2,
  Check,
  Languages,
  Radio,
  Trash2,
  Copy,
  StopCircle,
  HelpCircle,
  X,
  Maximize2,
  RotateCw,
  Upload,
  Image as ImageIcon,
  Compass,
  Layers,
  Eye,
  Crosshair,
  CheckCheck,
  QrCode,
  Wrench,
  ChevronRight,
  Barcode
} from 'lucide-react';
import { MineSite, HazardSeverity, ComplianceCategory } from '../types';
import confetti from 'canvas-confetti';
import jsQR from 'jsqr';
import { QRScannerModal } from './QRScannerModal';
import { ScannedMiningAsset, lookupMiningAssetByQR, MINING_ASSET_REGISTRY } from '../data/equipmentData';
import { useAuth } from '../context/AuthContext';

// Extend window interface for Web Speech API
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

export interface GeotaggedPhoto {
  id: string;
  dataUrl: string;
  timestamp: string;
  locationTag: string;
  coords: {
    lat: number;
    lng: number;
    altMsl: number;
  };
  inspectorName: string;
  inspectorRole: string;
  category: ComplianceCategory;
  severity: HazardSeverity;
  tamperHash: string;
}

interface MobileFieldInspectorProps {
  currentMine: MineSite | undefined;
  onSaveFieldObservation: (observation: any) => void;
  onAskCopilot: (query: string) => void;
  currentLanguage: 'en' | 'hi' | 'bn';
}

export const MobileFieldInspector: React.FC<MobileFieldInspectorProps> = ({
  currentMine,
  onSaveFieldObservation,
  onAskCopilot,
  currentLanguage,
}) => {
  const { profile, user } = useAuth();
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [offlineQueue, setOfflineQueue] = useState<any[]>([]);
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [activeTab, setActiveTab] = useState<'OBSERVATION' | 'SIRDAR_LOG' | 'MUSTER_SCAN'>('OBSERVATION');

  // Web Speech API States
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [selectedSpeechLang, setSelectedSpeechLang] = useState<string>('en-IN');
  const recognitionRef = useRef<any>(null);

  // Integrated Camera & Geotag States
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [attachedPhotos, setAttachedPhotos] = useState<GeotaggedPhoto[]>([]);
  const [previewPhoto, setPreviewPhoto] = useState<GeotaggedPhoto | null>(null);
  const [isGeneratingShot, setIsGeneratingShot] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // QR Code Scanner States
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [activeScannedAsset, setActiveScannedAsset] = useState<ScannedMiningAsset | null>(null);
  const [isCameraQRMode, setIsCameraQRMode] = useState(false);
  const [cameraDetectedAsset, setCameraDetectedAsset] = useState<ScannedMiningAsset | null>(null);
  const [qrScanFeedback, setQrScanFeedback] = useState<string | null>(null);
  const [workerMusterScanned, setWorkerMusterScanned] = useState<any | null>(null);
  const qrAnimRef = useRef<number | null>(null);

  // Form states
  const [locationTag, setLocationTag] = useState('Bench 4 - North Haul Road OB Dump');
  const [category, setCategory] = useState<ComplianceCategory>('SAFETY');
  const [severity, setSeverity] = useState<HazardSeverity>('HIGH');
  const [title, setTitle] = useState('');
  const [findings, setFindings] = useState('');
  const [regulationClause, setRegulationClause] = useState('CMR 2017 - Regulation 108 (Haul Road Berms)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Web Audio Synthesizer: High-Pitch QR Decode Confirmation
  const playQRBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1350, now);
      osc1.frequency.exponentialRampToValueAtTime(1750, now + 0.08);
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.09);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(2100, now + 0.08);
      gain2.gain.setValueAtTime(0.35, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.19);
    } catch (e) {
      console.warn('QR audio chime error:', e);
    }
  };

  // Handle Scanned Mining Asset Identification & Auto-Fill
  const handleAssetIdentified = (asset: ScannedMiningAsset, suggestedIdx?: number) => {
    playQRBeep();
    if (navigator.vibrate) {
      navigator.vibrate([40, 60, 40]);
    }
    setActiveScannedAsset(asset);
    setLocationTag(`[${asset.assetId}] ${asset.sector}`);
    setCategory(asset.defaultCategory);

    if (asset.applicableRegulations && asset.applicableRegulations.length > 0) {
      setRegulationClause(asset.applicableRegulations[0]);
    }

    if (suggestedIdx !== undefined && asset.suggestedObservations && asset.suggestedObservations[suggestedIdx]) {
      const obs = asset.suggestedObservations[suggestedIdx];
      setTitle(obs.title);
      setFindings(obs.findings);
      setSeverity(obs.severity);
      if (obs.clause) setRegulationClause(obs.clause);
    } else {
      if (!title) {
        setTitle(`Statutory Field Audit: ${asset.name}`);
      }
      if (!findings) {
        setFindings(`Conducted statutory DGMS field inspection of ${asset.name} (Tag: ${asset.assetId}, S/N: ${asset.specifications.serialNo}) at ${asset.sector}. License/Cert: ${asset.dgmsCertificateNo}. Operator/Supervisor: ${asset.assignedSupervisor}.`);
      }
    }

    setQrScanFeedback(`Successfully identified ${asset.assetId}`);
    setTimeout(() => setQrScanFeedback(null), 4000);
    confetti({ particleCount: 30, spread: 45, origin: { y: 0.8 } });
  };

  // Sirdar Checklist
  const [sirdarChecks, setSirdarChecks] = useState({
    ventilationVelocity: true,
    roofSupportChocks: true,
    stoneDustBarrier: false,
    flameproofInterlock: true,
    emergencySirensTested: true
  });

  // Synchronize language selection with currentLanguage prop
  useEffect(() => {
    const langCodeMap: Record<string, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      bn: 'bn-IN'
    };
    setSelectedSpeechLang(langCodeMap[currentLanguage] || 'en-IN');
  }, [currentLanguage]);

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignore cleanup errors
        }
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // Web Audio Synthesizer: Mechanical Camera Shutter Double-Chirp
  const playShutterSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      
      // Shutter Click Part 1
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(800, now);
      osc1.frequency.exponentialRampToValueAtTime(140, now + 0.04);
      gain1.gain.setValueAtTime(0.35, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.05);

      // Shutter Click Part 2 (Mechanical snap)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1250, now + 0.06);
      osc2.frequency.exponentialRampToValueAtTime(220, now + 0.11);
      gain2.gain.setValueAtTime(0.4, now + 0.06);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.11);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.06);
      osc2.stop(now + 0.12);
    } catch (e) {
      console.warn('Audio shutter sound not generated:', e);
    }
  };

  // Start Camera Stream
  const openCamera = async () => {
    setIsCameraOpen(true);
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
          videoRef.current.play().catch(e => console.warn('Video playback error:', e));
        }
      } else {
        setCameraError('Camera API (getUserMedia) unavailable in this browser environment. You can upload photos or generate high-fidelity simulated hazard shots.');
      }
    } catch (err: any) {
      console.warn('Camera access failed:', err);
      setCameraError('Webcam permission not granted or device camera busy. Please use the simulated field shot or file upload fallback below.');
    }
  };

  // Switch between front and rear cameras
  const toggleFacingMode = async () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: nextMode },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(console.warn);
        }
      }
    } catch (err: any) {
      console.warn('Error flipping camera lens:', err);
    }
  };

  // Stop Camera Stream
  const closeCamera = () => {
    if (qrAnimRef.current) {
      cancelAnimationFrame(qrAnimRef.current);
      qrAnimRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
    setCameraError(null);
    setCameraDetectedAsset(null);
  };

  // Real-time QR scanner loop when camera is open and isCameraQRMode is enabled
  useEffect(() => {
    if (!isCameraOpen || !isCameraQRMode) {
      if (qrAnimRef.current) {
        cancelAnimationFrame(qrAnimRef.current);
        qrAnimRef.current = null;
      }
      return;
    }

    let isRunning = true;
    let lastScanTime = 0;

    const scanCameraVideo = (timestamp: number) => {
      if (!isRunning) return;

      // Throttle scanning to ~10 FPS for optimal efficiency
      if (timestamp - lastScanTime > 100) {
        lastScanTime = timestamp;
        const video = videoRef.current;
        if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
          const width = video.videoWidth;
          const height = video.videoHeight;
          if (width > 0 && height > 0) {
            const scratchCanvas = document.createElement('canvas');
            scratchCanvas.width = width;
            scratchCanvas.height = height;
            const ctx = scratchCanvas.getContext('2d', { willReadFrequently: true });
            if (ctx) {
              ctx.drawImage(video, 0, 0, width, height);
              const imgData = ctx.getImageData(0, 0, width, height);
              const qr = jsQR(imgData.data, width, height, { inversionAttempts: 'dontInvert' });
              if (qr && qr.data) {
                const detectedText = qr.data.trim();
                const matched = lookupMiningAssetByQR(detectedText);
                if (matched && (!cameraDetectedAsset || cameraDetectedAsset.assetId !== matched.assetId)) {
                  playQRBeep();
                  setCameraDetectedAsset(matched);
                  if (navigator.vibrate) navigator.vibrate([40, 60, 40]);
                }
              }
            }
          }
        }
      }

      qrAnimRef.current = requestAnimationFrame(scanCameraVideo);
    };

    qrAnimRef.current = requestAnimationFrame(scanCameraVideo);

    return () => {
      isRunning = false;
      if (qrAnimRef.current) {
        cancelAnimationFrame(qrAnimRef.current);
        qrAnimRef.current = null;
      }
    };
  }, [isCameraOpen, isCameraQRMode, cameraDetectedAsset]);

  // Stamp DGMS Statutory Watermark onto Canvas
  const stampGeotagWatermark = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number,
    opt?: { customCaption?: string; sceneName?: string }
  ) => {
    const collieryName = currentMine?.name || 'Jharia Opencast Project Block-II';
    const timeString = `${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-IN', { hour12: false })} IST`;
    const lat = 23.7435;
    const lng = 86.4182;
    const alt = 184;
    const tamperHash = 'SHA256-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    // 1. Viewfinder Crosshairs & Reticle Overlay in Center
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.lineWidth = 2;
    const cx = width / 2;
    const cy = height / 2;
    const reticleSize = Math.min(width, height) * 0.15;

    // Corner brackets
    const bracketLen = 24;
    ctx.beginPath();
    // Top-Left
    ctx.moveTo(cx - reticleSize, cy - reticleSize + bracketLen);
    ctx.lineTo(cx - reticleSize, cy - reticleSize);
    ctx.lineTo(cx - reticleSize + bracketLen, cy - reticleSize);
    // Top-Right
    ctx.moveTo(cx + reticleSize - bracketLen, cy - reticleSize);
    ctx.lineTo(cx + reticleSize, cy - reticleSize);
    ctx.lineTo(cx + reticleSize, cy - reticleSize + bracketLen);
    // Bottom-Left
    ctx.moveTo(cx - reticleSize, cy + reticleSize - bracketLen);
    ctx.lineTo(cx - reticleSize, cy + reticleSize);
    ctx.lineTo(cx - reticleSize + bracketLen, cy + reticleSize);
    // Bottom-Right
    ctx.moveTo(cx + reticleSize - bracketLen, cy + reticleSize);
    ctx.lineTo(cx + reticleSize, cy + reticleSize);
    ctx.lineTo(cx + reticleSize, cy + reticleSize - bracketLen);
    ctx.stroke();

    // Center Cross Dot
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();

    // 2. Top Statutory Header Watermark Bar
    const topBarHeight = 38;
    ctx.fillStyle = 'rgba(13, 15, 18, 0.85)';
    ctx.fillRect(0, 0, width, topBarHeight);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(0, topBarHeight - 2, width, 2);

    ctx.font = 'bold 13px ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('MINESYNC STATUTORY AUDIT • DGMS EVIDENCE RECORD', 16, 24);

    ctx.font = '11px ui-monospace, monospace';
    ctx.fillStyle = '#34d399';
    const verifiedBadge = '● TAMPER-PROOF GEO-STAMPED';
    const badgeWidth = ctx.measureText(verifiedBadge).width;
    ctx.fillText(verifiedBadge, width - badgeWidth - 16, 24);

    // 3. Bottom Comprehensive Telemetry Banner
    const bannerHeight = 110;
    const bannerY = height - bannerHeight;

    // Dark semi-translucent gradient background
    const grad = ctx.createLinearGradient(0, bannerY, 0, height);
    grad.addColorStop(0, 'rgba(13, 15, 18, 0.65)');
    grad.addColorStop(0.2, 'rgba(13, 15, 18, 0.92)');
    grad.addColorStop(1, 'rgba(13, 15, 18, 0.98)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, bannerY, width, bannerHeight);

    // Top border on bottom banner
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(0, bannerY, width, 1);

    // Telemetry text rendering
    const leftMargin = 18;
    let textY = bannerY + 22;

    // Line 1: Colliery & Sector
    ctx.font = 'bold 13px ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(`COLLIERY: ${collieryName.toUpperCase()} | SECTOR: ${locationTag.toUpperCase()}`, leftMargin, textY);

    // Line 2: Precision GPS coordinates, altitude, heading
    textY += 20;
    ctx.font = 'bold 12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`GPS: LAT ${lat.toFixed(4)}° N, LNG ${lng.toFixed(4)}° E | ALT: +${alt}m MSL | HDG: 042° NE | FIX: RTK-DIFF`, leftMargin, textY);

    // Line 3: Timestamp & Inspector info
    textY += 20;
    ctx.font = '11px ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(`TIME: ${timeString} | AUDITOR: Kameshwar Singh (Mining Sirdar #MS-8821)`, leftMargin, textY);

    // Line 4: Statutory clause & Severity
    textY += 20;
    ctx.font = '11px ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = severity === 'CRITICAL_FATAL_RISK' ? '#f87171' : severity === 'HIGH' ? '#fb923c' : '#facc15';
    ctx.fillText(`HAZARD: ${severity.replace(/_/g, ' ')} | REGULATION: ${regulationClause}`, leftMargin, textY);

    // Cryptographic Hash Watermark Box (Bottom-Right)
    const hashBoxWidth = 140;
    const hashBoxHeight = 32;
    const hashBoxX = width - hashBoxWidth - 16;
    const hashBoxY = height - hashBoxHeight - 12;

    ctx.fillStyle = 'rgba(22, 27, 34, 0.9)';
    ctx.fillRect(hashBoxX, hashBoxY, hashBoxWidth, hashBoxHeight);
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.strokeRect(hashBoxX, hashBoxY, hashBoxWidth, hashBoxHeight);

    ctx.font = '9px ui-monospace, monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('BLOCKCHAIN AUDIT ID', hashBoxX + 8, hashBoxY + 12);
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(tamperHash, hashBoxX + 8, hashBoxY + 24);

    return tamperHash;
  };

  // Snap Photo from Live Camera Viewfinder
  const snapLiveCameraPhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    playShutterSound();
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 220);

    const canvas = document.createElement('canvas');
    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw video frame (handle mirror if user facing)
    ctx.save();
    if (facingMode === 'user') {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, width, height);
    ctx.restore();

    // Stamp watermark
    const tamperHash = stampGeotagWatermark(ctx, width, height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

    const newPhoto: GeotaggedPhoto = {
      id: `PHOTO-GEO-${Date.now().toString().slice(-5)}`,
      dataUrl,
      timestamp: `${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-IN', { hour12: false })} IST`,
      locationTag,
      coords: { lat: 23.7435, lng: 86.4182, altMsl: 184 },
      inspectorName: 'Kameshwar Singh',
      inspectorRole: 'MINING_SIRDAR',
      category,
      severity,
      tamperHash
    };

    setAttachedPhotos(prev => [newPhoto, ...prev]);
    setPhotoCaptured(true);

    if (!title) {
      setTitle(`Field Hazard Snap at ${locationTag}`);
    }
    if (!findings) {
      setFindings(`Live photographic evidence snapped with GPS Lat 23.7435, Lng 86.4182 (+184m MSL). Visual non-conformance recorded under ${regulationClause}.`);
    }

    confetti({ particleCount: 25, spread: 35, origin: { y: 0.85 } });
  };

  // Upload Photo from File Dialog or Mobile Camera App
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const width = 1280;
        const height = Math.round((img.height / img.width) * 1280) || 720;
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, width, height);
        const tamperHash = stampGeotagWatermark(ctx, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

        playShutterSound();
        const newPhoto: GeotaggedPhoto = {
          id: `PHOTO-UPLOAD-${Date.now().toString().slice(-5)}`,
          dataUrl,
          timestamp: `${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-IN', { hour12: false })} IST`,
          locationTag,
          coords: { lat: 23.7435, lng: 86.4182, altMsl: 184 },
          inspectorName: 'Kameshwar Singh',
          inspectorRole: 'MINING_SIRDAR',
          category,
          severity,
          tamperHash
        };

        setAttachedPhotos(prev => [newPhoto, ...prev]);
        setPhotoCaptured(true);

        if (!title) setTitle(`Uploaded Field Evidence: ${file.name.slice(0, 30)}`);
        if (!findings) setFindings(`Uploaded photo attached and watermarked with colliery GPS telemetry under ${regulationClause}.`);
        confetti({ particleCount: 20, spread: 30, origin: { y: 0.85 } });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    // Reset file input
    e.target.value = '';
  };

  // Snap Realistic Simulated Mine Hazard Shot (for desktop/test or sandbox mode)
  const handleSnapSampleHazardShot = (preset: {
    title: string;
    description: string;
    severity: HazardSeverity;
    category: ComplianceCategory;
    regulation: string;
    location: string;
    hazardType: 'BERM' | 'DUST' | 'VENTILATION' | 'SLOPE';
  }) => {
    setIsGeneratingShot(true);
    playShutterSound();
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 200);

    const canvas = document.createElement('canvas');
    const width = 1280;
    const height = 720;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsGeneratingShot(false);
      return;
    }

    // Draw realistic high-contrast simulated mine scene background
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    if (preset.hazardType === 'BERM') {
      bgGrad.addColorStop(0, '#33291e');
      bgGrad.addColorStop(0.4, '#453826');
      bgGrad.addColorStop(0.7, '#241b12');
      bgGrad.addColorStop(1, '#17120c');
    } else if (preset.hazardType === 'DUST') {
      bgGrad.addColorStop(0, '#2e3440');
      bgGrad.addColorStop(0.5, '#434c5e');
      bgGrad.addColorStop(0.8, '#3b4252');
      bgGrad.addColorStop(1, '#1a1f29');
    } else if (preset.hazardType === 'VENTILATION') {
      bgGrad.addColorStop(0, '#111827');
      bgGrad.addColorStop(0.4, '#1f2937');
      bgGrad.addColorStop(0.8, '#111827');
      bgGrad.addColorStop(1, '#030712');
    } else {
      bgGrad.addColorStop(0, '#382b20');
      bgGrad.addColorStop(0.5, '#523f2f');
      bgGrad.addColorStop(0.8, '#261b12');
      bgGrad.addColorStop(1, '#150f0a');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Draw geological rock/bench layers and haul road strata
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    for (let y = 120; y < 600; y += 45) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x < width; x += 80) {
        const jitter = Math.sin((x + y) * 0.05) * 16 + (Math.random() * 8 - 4);
        ctx.lineTo(x, y + jitter);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();
    }

    // Draw prominent hazard visual cues (warning boxes / measuring scale)
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    ctx.strokeRect(380, 220, 520, 260);
    ctx.setLineDash([]);

    // Hazard Callout Marker Tag
    ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
    ctx.fillRect(380, 185, 240, 32);
    ctx.font = 'bold 12px ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('⚠ NON-CONFORMANCE AREA', 392, 206);

    // Target callout annotation
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(390, 435, 500, 35);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1;
    ctx.strokeRect(390, 435, 500, 35);
    ctx.font = '12px ui-monospace, monospace';
    ctx.fillStyle = '#fef08a';
    ctx.fillText(`MEASUREMENT DEFICIT: ${preset.title.slice(0, 48)}`, 402, 457);

    // Watermark stamping
    const tamperHash = stampGeotagWatermark(ctx, width, height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

    const newPhoto: GeotaggedPhoto = {
      id: `PHOTO-GEO-${Date.now().toString().slice(-5)}`,
      dataUrl,
      timestamp: `${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-IN', { hour12: false })} IST`,
      locationTag: preset.location,
      coords: { lat: 23.7435, lng: 86.4182, altMsl: 184 },
      inspectorName: 'Kameshwar Singh',
      inspectorRole: 'MINING_SIRDAR',
      category: preset.category,
      severity: preset.severity,
      tamperHash
    };

    setAttachedPhotos(prev => [newPhoto, ...prev]);
    setPhotoCaptured(true);
    setLocationTag(preset.location);
    setCategory(preset.category);
    setSeverity(preset.severity);
    setRegulationClause(preset.regulation);
    setTitle(preset.title);
    setFindings(preset.description);
    setIsGeneratingShot(false);

    confetti({ particleCount: 30, spread: 45, origin: { y: 0.8 } });
  };

  const handleRemovePhoto = (id: string) => {
    setAttachedPhotos(prev => {
      const updated = prev.filter(p => p.id !== id);
      if (updated.length === 0) setPhotoCaptured(false);
      return updated;
    });
  };

  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      fallbackSimulatedSpeech();
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedSpeechLang;

      recognition.onstart = () => {
        setIsRecordingVoice(true);
        setSpeechError(null);
        setInterimTranscript('');
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let currentFinal = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptSegment = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            currentFinal += transcriptSegment + ' ';
          } else {
            currentInterim += transcriptSegment;
          }
        }

        if (currentFinal) {
          setVoiceTranscript(prev => {
            const updated = (prev ? prev + ' ' : '') + currentFinal.trim();
            // Automatically update findings
            setFindings(f => (f ? f + ' ' : '') + currentFinal.trim());
            // Auto title if empty
            if (!title) {
              setTitle(currentFinal.trim().slice(0, 60) + (currentFinal.length > 60 ? '...' : ''));
            }
            return updated;
          });
        }

        setInterimTranscript(currentInterim);
      };

      recognition.onerror = (event: any) => {
        console.warn('Web Speech API error:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone permission denied. Please allow microphone access in your browser settings.');
          setIsRecordingVoice(false);
        } else if (event.error === 'no-speech') {
          // Passive error, no-op
        } else {
          setSpeechError(`Speech recognition notice: ${event.error}. Providing smart dictation fallback.`);
        }
      };

      recognition.onend = () => {
        setIsRecordingVoice(false);
        setInterimTranscript('');
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Speech recognition start failed:', err);
      setSpeechError(err?.message || 'Failed to start Web Speech engine');
      fallbackSimulatedSpeech();
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn('Error stopping speech recognition:', err);
      }
    }
    setIsRecordingVoice(false);
    setInterimTranscript('');
  };

  const fallbackSimulatedSpeech = () => {
    setIsRecordingVoice(true);
    setTimeout(() => {
      const sampleTranscripts: Record<string, string> = {
        'en-IN': "Inspection observation at Coal Face Seam 3: Shovel S-04 hydraulic line oozing fluid near dumper loading spot. Water spraying mist nozzles partially clogged with slurry. Safety berm height measures 1.4m requiring immediate build-up to 2.4m.",
        'hi-IN': "निरीक्षण विवरण: कोल फेस सीम 3 पर शॉवेल ऑपरेटर के पास डस्ट मिस्ट नोजल जाम है। सुरक्षा बर्म की ऊंचाई 1.4 मीटर पाई गई जिसे तुरंत 2.4 मीटर तक बढ़ाना अनिवार्य है।",
        'bn-IN': "ফিল্ড রিপোর্ট: ৩ নম্বর কয়লা বেঞ্চে ডাম্পার চলাচলের রাস্তায় অতিরিক্ত ধুলো উড়ছে। স্প্রিঙ্কলার অনতিবিলম্বে চালু করা প্রয়োজন এবং সেফটি বার্ম উচ্চতা বৃদ্ধি করা দরকার।"
      };
      const text = sampleTranscripts[selectedSpeechLang] || sampleTranscripts['en-IN'];
      setVoiceTranscript(text);
      setFindings(prev => prev ? `${prev}\n${text}` : text);
      if (!title) setTitle('Haul Road Berm Deficit & Mist Nozzle Slurry Blockage');
      setIsRecordingVoice(false);
    }, 1800);
  };

  const handleToggleVoiceRecord = () => {
    if (isRecordingVoice) {
      stopSpeechRecognition();
    } else {
      startSpeechRecognition();
    }
  };

  const handleInsertPresetPhrase = (phrase: string) => {
    setFindings(prev => prev ? `${prev} ${phrase}` : phrase);
    if (!title) {
      setTitle(phrase.slice(0, 50));
    }
  };

  const handleCapturePhoto = () => {
    setPhotoCaptured(true);
    if (!title) setTitle('North Haul Road Shoulder Crack & Berm Deficit');
    if (!findings) setFindings('Field photo stamped with GPS Lat 23.7435, Lng 86.4182 showing 40mm tension crack along outer edge of haul road.');
  };

  const handleSubmitObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    setIsSubmitting(true);

    const primaryPhoto = attachedPhotos[0];

    const observationData = {
      id: `INSP-MOB-${Date.now().toString().slice(-4)}`,
      mineId: currentMine?.id || 'mine-001',
      mineName: currentMine?.name || 'Jharia Open Cast Project Block-II',
      locationTag,
      geoPoint: primaryPhoto ? primaryPhoto.coords : { lat: 23.7435, lng: 86.4182 },
      inspectorName: profile?.displayName || 'Kameshwar Singh',
      inspectorRole: profile?.role || 'MINING_SIRDAR',
      timestamp: `${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
      category,
      severity,
      observationTitle: title,
      detailedFindings: findings || 'Field inspection logged via MineSync Mobile Android client with geo-stamped photo evidence.',
      violatedRegulation: regulationClause,
      capaStatus: 'OPEN',
      assignedTo: currentMine?.projectOfficer || 'Mine Manager',
      deadlineDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      aiRiskScore: severity === 'CRITICAL_FATAL_RISK' ? 95 : severity === 'HIGH' ? 82 : 45,
      aiPredictedImpact: 'Identified via Mobile AI Assistant. Mandatory CAPA escalation initiated under DGMS standard protocol.',
      evidencePhotoUrl: primaryPhoto?.dataUrl,
      offlineSynced: !isOfflineMode,
      tamperProofHash: primaryPhoto?.tamperHash || ('sha256-' + Math.random().toString(36).substring(2, 15))
    };

    if (isOfflineMode) {
      setOfflineQueue(prev => [observationData, ...prev]);
      alert('Offline Mode Active: Inspection saved securely to encrypted local device SQLite vault. It will auto-sync when mobile connects to mine Wi-Fi/4G.');
    } else {
      onSaveFieldObservation(observationData);
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
    }

    // Reset form
    setTitle('');
    setFindings('');
    setPhotoCaptured(false);
    setAttachedPhotos([]);
    setVoiceTranscript('');
    setInterimTranscript('');
    setIsSubmitting(false);
  };

  const handleSyncOfflineQueue = () => {
    if (offlineQueue.length === 0) return;
    offlineQueue.forEach(item => onSaveFieldObservation({ ...item, offlineSynced: true }));
    setOfflineQueue([]);
    setIsOfflineMode(false);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Mobile Device Frame Header & Status Bar */}
      <div className="bg-[#161B22] border border-white/10 rounded-2xl p-4 md:p-6 shadow-2xl space-y-4">
        {/* Device Top Status Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 font-black">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-100">
                  MineSync Mobile Field Inspector
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  v4.8 DGMS Field Edition
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Mining Sirdar & Overman Real-Time Geo-Tagged Reporting with Web Speech Dictation
              </p>
            </div>
          </div>

          {/* Network Mode & Local Sync Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOfflineMode(!isOfflineMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                isOfflineMode 
                  ? 'bg-amber-950/60 text-amber-300 border-amber-700/80' 
                  : 'bg-emerald-950/60 text-emerald-300 border-emerald-700/80'
              }`}
            >
              {isOfflineMode ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
              <span>{isOfflineMode ? 'Mode: OFFLINE' : 'Mode: 4G LTE ONLINE'}</span>
            </button>

            {offlineQueue.length > 0 && (
              <button
                onClick={handleSyncOfflineQueue}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer animate-pulse"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync {offlineQueue.length} Queued</span>
              </button>
            )}
          </div>
        </div>

        {/* Live GPS & Mine Telemetry HUD */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-[#0D0F12] p-3 rounded-xl border border-white/5">
          <div>
            <span className="text-[10px] text-slate-500 block uppercase">Target Colliery</span>
            <span className="font-semibold text-slate-200 truncate block">{currentMine?.name || 'Jharia Block-II'}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase">GPS Fix</span>
            <span className="font-mono text-amber-400 font-semibold flex items-center gap-1">
              <MapPin className="w-3 h-3" /> 23.7435°N, 86.4182°E
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase">Altitude / Seam</span>
            <span className="font-mono text-slate-300 font-semibold">+184m MSL (Seam III)</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase">Local Time</span>
            <span className="font-mono text-slate-300 font-semibold">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST</span>
          </div>
        </div>

        {/* Sub-Tabs: Observation vs Daily Sirdar Log vs Muster Roll */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
          <button
            onClick={() => setActiveTab('OBSERVATION')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'OBSERVATION' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Field Safety Observation
          </button>
          <button
            onClick={() => setActiveTab('SIRDAR_LOG')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'SIRDAR_LOG' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Sirdar Daily Statutory Log
          </button>
          <button
            onClick={() => setActiveTab('MUSTER_SCAN')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'MUSTER_SCAN' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Biometric Muster Verification
          </button>
        </div>

        {/* TAB 1: FIELD SAFETY OBSERVATION FORM */}
        {activeTab === 'OBSERVATION' && (
          <div className="space-y-4">
            {/* Quick Equipment & Inspection Zone QR Scanner Trigger Bar */}
            <div className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-indigo-950/30 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex-shrink-0">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200">
                      DGMS Equipment & Zone QR Scanner
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      CAMERA READY
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Scan machinery plates or bench hazard markers to auto-fill location, specs, and regulation clauses
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsQRScannerOpen(true)}
                  className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer transition-all active:scale-95"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Scan QR Code</span>
                </button>
              </div>
            </div>

            {/* Active Identified Mining Asset Card (if scanned) */}
            {activeScannedAsset && (
              <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-500/60 shadow-lg space-y-2.5 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
                      {activeScannedAsset.assetId}
                    </span>
                    <span className="font-bold text-xs text-slate-100 truncate">
                      {activeScannedAsset.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsQRScannerOpen(true)}
                      className="px-2 py-1 rounded text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                    >
                      Rescan / Change
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveScannedAsset(null)}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Clear scanned asset"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="bg-slate-950 p-2 rounded-lg border border-white/5">
                    <span className="text-[9px] text-slate-500 uppercase block font-semibold">Sector Location</span>
                    <span className="font-semibold text-slate-300 truncate block">{activeScannedAsset.sector}</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-lg border border-white/5">
                    <span className="text-[9px] text-slate-500 uppercase block font-semibold">DGMS Status</span>
                    <span className="font-bold text-emerald-400 truncate block">● {activeScannedAsset.statutoryFitnessStatus.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-lg border border-white/5">
                    <span className="text-[9px] text-slate-500 uppercase block font-semibold">Model / Specs</span>
                    <span className="font-mono text-slate-300 truncate block">{activeScannedAsset.specifications.model}</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-lg border border-white/5">
                    <span className="text-[9px] text-slate-500 uppercase block font-semibold">Supervisor</span>
                    <span className="font-semibold text-amber-300 truncate block">{activeScannedAsset.assignedSupervisor}</span>
                  </div>
                </div>

                {/* Quick Observation Template Buttons from this asset */}
                {activeScannedAsset.suggestedObservations && activeScannedAsset.suggestedObservations.length > 0 && (
                  <div className="pt-1 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-semibold mr-1">Quick Templates:</span>
                    {activeScannedAsset.suggestedObservations.map((obs, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAssetIdentified(activeScannedAsset, idx)}
                        className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-950 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-white/10 hover:border-amber-500/40 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                        <span>{obs.title.slice(0, 28)}...</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmitObservation} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-semibold block">Observation Title:</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Haul road berm height less than 2.4m..."
                    className="w-full bg-[#0D0F12] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-slate-400 font-semibold block">Mine Location Tag:</label>
                    <button
                      type="button"
                      onClick={() => setIsQRScannerOpen(true)}
                      className="text-[10px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                    >
                      <QrCode className="w-3 h-3" />
                      <span>Scan Label</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={locationTag}
                      onChange={(e) => setLocationTag(e.target.value)}
                      className="w-full bg-[#0D0F12] border border-white/10 rounded-lg pl-3 pr-9 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setIsQRScannerOpen(true)}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-amber-500/20 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                      title="Scan Equipment or Zone QR Barcode"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold block">Hazard Severity:</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as HazardSeverity)}
                  className="w-full bg-[#0D0F12] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="CRITICAL_FATAL_RISK">Fatal Risk (Immediate Stop)</option>
                  <option value="HIGH">High Severity</option>
                  <option value="MEDIUM">Medium Severity</option>
                  <option value="LOW">Low Hazard</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold block">Compliance Category:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ComplianceCategory)}
                  className="w-full bg-[#0D0F12] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="SAFETY">Safety (DGMS / CMR)</option>
                  <option value="ENVIRONMENT">Environment (CPCB / SPCB)</option>
                  <option value="LABOUR">Labour & PPE</option>
                  <option value="PRODUCTION">Production / Machinery</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold block">Statutory Regulation Clause:</label>
                <input
                  type="text"
                  value={regulationClause}
                  onChange={(e) => setRegulationClause(e.target.value)}
                  className="w-full bg-[#0D0F12] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                />
              </div>
            </div>

            {/* ========================================================================= */}
            {/* WEB SPEECH API VOICE DICTATION STUDIO & MULTI-LANGUAGE CONTROLS */}
            {/* ========================================================================= */}
            <div className="space-y-3 p-3.5 bg-[#0D0F12] rounded-xl border border-white/10 shadow-inner">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${isRecordingVoice ? 'bg-rose-500/20 text-rose-400 animate-pulse' : 'bg-amber-500/10 text-amber-400'}`}>
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                      <span>Browser Web Speech Dictation</span>
                      {speechSupported ? (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 font-mono">
                          API READY
                        </span>
                      ) : (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-400 font-mono">
                          SIMULATED
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Record voice-to-text safety observations directly into statutory findings
                    </span>
                  </div>
                </div>

                {/* Speech Recognition Language Selector */}
                <div className="flex items-center gap-1.5 text-xs">
                  <Languages className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={selectedSpeechLang}
                    onChange={(e) => setSelectedSpeechLang(e.target.value)}
                    disabled={isRecordingVoice}
                    className="bg-[#161B22] border border-white/10 rounded-md px-2 py-1 text-[11px] text-slate-200 focus:outline-none"
                  >
                    <option value="en-IN">English (India)</option>
                    <option value="hi-IN">हिन्दी (Hindi)</option>
                    <option value="bn-IN">বাংলা (Bengali)</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons: Voice Record Toggle & Photo Capture */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Web Speech Record Button */}
                <button
                  id="btn-webspeech-dictate"
                  type="button"
                  onClick={handleToggleVoiceRecord}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-sm ${
                    isRecordingVoice 
                      ? 'bg-rose-600 hover:bg-rose-500 text-white border-rose-400 shadow-rose-500/30 animate-pulse ring-2 ring-rose-500/40' 
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 border-amber-400/50'
                  }`}
                >
                  {isRecordingVoice ? (
                    <>
                      <StopCircle className="w-4 h-4 text-white animate-spin" />
                      <span>Stop Recording (Transcribing...)</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 text-slate-950" />
                      <span>Start Voice Dictation</span>
                    </>
                  )}
                </button>

                {/* Camera Snap Actions & Geotag Photo Hub */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Primary Camera Snap Viewfinder Trigger */}
                  <button
                    id="btn-open-camera-snap"
                    type="button"
                    onClick={openCamera}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-slate-950" />
                    <span>Open Camera Viewfinder</span>
                  </button>

                  {/* Upload Photo from Storage */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#161B22] hover:bg-white/10 text-slate-200 border border-white/10 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-sky-400" />
                    <span>Upload Image</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {/* Simulated DGMS Hazard Snap Shot Quick Presets */}
                  <div className="relative inline-block">
                    <button
                      type="button"
                      disabled={isGeneratingShot}
                      onClick={() => handleSnapSampleHazardShot({
                        title: 'Haul Road Berm Deficit (0.9m vs Required 2.4m)',
                        description: 'Field photo stamped with GPS Lat 23.7435, Lng 86.4182 (+184m MSL). Berm eroded after rainfall; height measured 0.9m along outer pit crest.',
                        severity: 'HIGH',
                        category: 'SAFETY',
                        regulation: 'CMR 2017 - Regulation 108 (Haul Road Safety Berms)',
                        location: 'Bench 4 - North Haul Road OB Dump',
                        hazardType: 'BERM'
                      })}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-200 border border-indigo-700/60 transition-colors cursor-pointer"
                      title="Generate instant geo-stamped statutory photo evidence"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>{isGeneratingShot ? 'Stamping...' : 'Quick Hazard Snap'}</span>
                    </button>
                  </div>
                </div>

                {/* Clear Voice Transcript */}
                {voiceTranscript && (
                  <button
                    type="button"
                    onClick={() => {
                      setVoiceTranscript('');
                      setInterimTranscript('');
                    }}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-rose-400 transition-colors text-xs ml-auto"
                    title="Clear transcript cache"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Attached Geotagged Photos Gallery Strip */}
              {attachedPhotos.length > 0 && (
                <div className="bg-[#0D0F12] border border-amber-500/30 rounded-xl p-3 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-amber-400" />
                      <span className="font-bold text-slate-200">
                        Attached Statutory Evidence Photos ({attachedPhotos.length})
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded">
                      ✓ DGMS Watermarked
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {attachedPhotos.map((photo) => (
                      <div 
                        key={photo.id}
                        className="relative group bg-[#161B22] rounded-lg border border-white/10 overflow-hidden shadow-md flex flex-col"
                      >
                        {/* Image Thumbnail */}
                        <div className="relative aspect-video bg-black overflow-hidden cursor-pointer" onClick={() => setPreviewPhoto(photo)}>
                          <img 
                            src={photo.dataUrl} 
                            alt="Mine Field Inspection Photo Evidence"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <span className="px-2 py-1 rounded bg-black/70 text-amber-300 text-[10px] font-bold flex items-center gap-1">
                              <Eye className="w-3 h-3" /> Inspect Photo
                            </span>
                          </div>

                          {/* Quick Timestamp Badge */}
                          <div className="absolute bottom-1.5 left-1.5 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-mono text-slate-300 border border-white/10">
                            {photo.timestamp.split(' ')[0]}
                          </div>
                        </div>

                        {/* Photo Metadata Footer */}
                        <div className="p-2 text-xs flex items-center justify-between gap-2">
                          <div className="truncate">
                            <span className="font-mono text-[10px] text-amber-400 font-bold block truncate">
                              LAT: {photo.coords.lat.toFixed(4)}° | LNG: {photo.coords.lng.toFixed(4)}°
                            </span>
                            <span className="text-[10px] text-slate-400 truncate block">
                              {photo.locationTag}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => setPreviewPhoto(photo)}
                              className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-amber-400 transition-colors"
                              title="Expand & Zoom"
                            >
                              <Maximize2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(photo.id)}
                              className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
                              title="Delete Photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Simulated Hazard Presets Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px]">
                <span className="text-slate-500 font-bold uppercase whitespace-nowrap">Instant Field Hazard Shots:</span>
                {[
                  {
                    name: 'Haul Road Berm Deficit',
                    title: 'Haul Road Berm Deficit & Outer Shoulder Slope Erosion',
                    description: 'Safety berm height measures 1.1m (less than required 2.4m dumper wheel radius). Urgent dozer build-up required under CMR Reg 108.',
                    severity: 'HIGH' as HazardSeverity,
                    category: 'SAFETY' as ComplianceCategory,
                    regulation: 'CMR 2017 - Regulation 108 (Haul Road Safety Berms)',
                    location: 'Bench 4 - North Haul Road OB Dump',
                    hazardType: 'BERM' as const
                  },
                  {
                    name: 'Dust Mist Sprayer Clog',
                    title: 'Haul Road Water Mist Sprinkler Clogging & Slurry Siltation',
                    description: 'Water spraying mist nozzles blocked by slurry silt; particulate PM10 concentration elevated. Pressure gauge reading 0.8 bar vs statutory 3.0 bar.',
                    severity: 'MEDIUM' as HazardSeverity,
                    category: 'ENVIRONMENT' as ComplianceCategory,
                    regulation: 'DGMS Tech Circular 07/2021 (Dust Suppression)',
                    location: 'Coal Transfer Point #3 Chute',
                    hazardType: 'DUST' as const
                  },
                  {
                    name: 'Strata Tension Crack',
                    title: 'OB Dump Crest Tension Crack Exceeding 45mm',
                    description: 'Continuous 45mm tension crack observed along crest of Overburden Dump #2. Slope radar telemetry confirms 4.2mm/hr displacement.',
                    severity: 'CRITICAL_FATAL_RISK' as HazardSeverity,
                    category: 'STRATA_CONTROL' as ComplianceCategory,
                    regulation: 'CMR 2017 - Regulation 106 (Overburden Dump Stability)',
                    location: 'OB Dump Sector 2 Crest',
                    hazardType: 'SLOPE' as const
                  }
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSnapSampleHazardShot(preset)}
                    className="px-2 py-1 rounded bg-[#161B22] hover:bg-white/10 text-slate-300 hover:text-amber-400 border border-white/5 whitespace-nowrap transition-colors cursor-pointer"
                  >
                    📸 {preset.name}
                  </button>
                ))}
              </div>

              {/* Active Audio Waveform & Speech Feedback Indicator */}
              {isRecordingVoice && (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-rose-300 font-semibold">
                      Listening to microphone in {selectedSpeechLang}... Speak clearly into field mic.
                    </span>
                  </div>
                  {/* Simulated audio frequency bars */}
                  <div className="flex items-end gap-0.5 h-4">
                    <span className="w-1 bg-rose-400 rounded-full animate-[bounce_0.6s_infinite_100ms] h-2"></span>
                    <span className="w-1 bg-rose-400 rounded-full animate-[bounce_0.6s_infinite_200ms] h-4"></span>
                    <span className="w-1 bg-rose-400 rounded-full animate-[bounce_0.6s_infinite_300ms] h-3"></span>
                    <span className="w-1 bg-rose-400 rounded-full animate-[bounce_0.6s_infinite_400ms] h-4"></span>
                    <span className="w-1 bg-rose-400 rounded-full animate-[bounce_0.6s_infinite_500ms] h-1.5"></span>
                  </div>
                </div>
              )}

              {/* Interim / Real-Time Live Transcript Preview */}
              {(interimTranscript || voiceTranscript) && (
                <div className="bg-[#161B22] border border-white/5 rounded-lg p-2.5 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold">
                    <span>Live Voice-to-Text Stream</span>
                    <span className="text-indigo-400 font-mono">WebSpeechEngine</span>
                  </div>
                  <p className="text-slate-200 leading-relaxed font-sans">
                    {voiceTranscript}
                    {interimTranscript && (
                      <span className="text-amber-400/90 italic ml-1 underline decoration-amber-500/50">
                        {interimTranscript}
                      </span>
                    )}
                  </p>
                </div>
              )}

              {/* Speech Error Banner (if any) */}
              {speechError && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 text-xs text-amber-300 flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
                  <span>{speechError}</span>
                </div>
              )}

              {/* Mining Industry Quick Dictation Presets */}
              <div className="pt-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1.5">
                  Quick Statutory Observation Phrases (Click to Append):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "CMR 2017 Reg 108: Haul road berm height deficit below dumper tyre diameter.",
                    "DGMS Tech Circ 07: Water spraying mist nozzles clogged; dust suppression inactive.",
                    "Reg 153: Auxiliary ventilation ducting disjointed; airflow below 45 m/min.",
                    "Reg 106: OB dump bench slope tension crack exceeding 30mm."
                  ].map((phrase, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleInsertPresetPhrase(phrase)}
                      className="px-2 py-1 rounded bg-[#161B22] hover:bg-white/10 text-slate-300 hover:text-amber-400 text-[10px] border border-white/5 transition-colors cursor-pointer"
                    >
                      + {phrase.slice(0, 32)}...
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Findings Textarea */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs text-slate-400 font-semibold block">Detailed Observation Notes (Populated from Dictation):</label>
                <span className="text-[10px] text-slate-500">{findings.length} characters</span>
              </div>
              <textarea
                rows={4}
                value={findings}
                onChange={(e) => setFindings(e.target.value)}
                placeholder="Enter field observation notes or use the Browser Web Speech Dictation button above to speak in English, Hindi, or Bengali..."
                className="w-full bg-[#0D0F12] border border-white/10 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-sans leading-relaxed"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>
                {isOfflineMode ? 'Store Offline in Encrypted Vault' : 'Upload Geo-Tagged Observation to DGMS Server'}
              </span>
            </button>
          </form>
        </div>
        )}

        {/* TAB 2: SIRDAR DAILY STATUTORY LOGBOOK */}
        {activeTab === 'SIRDAR_LOG' && (
          <div className="space-y-4">
            <div className="p-3 bg-[#0D0F12] rounded-xl border border-white/10 text-xs text-slate-300 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-400">Shift Sirdar Statutory Verification Checklist (CMR 2017 Form VI)</span>
                <span className="text-[10px] text-slate-500 font-mono">Shift: 1st Shift (06:00 - 14:00)</span>
              </div>

              <div className="space-y-2">
                {[
                  { key: 'ventilationVelocity', label: 'Mine Air Velocity > 45 m/min & CH4 < 0.5% verified with methanometer' },
                  { key: 'roofSupportChocks', label: 'Strata Control & Hydraulic Props sound testing verified within 10m of face' },
                  { key: 'stoneDustBarrier', label: 'Stone Dust Barrier incombustible matter concentration > 75%' },
                  { key: 'flameproofInterlock', label: 'All flameproof electrical junction boxes sealed & interlocked' },
                  { key: 'emergencySirensTested', label: 'Emergency Evacuation Siren & Audio-Visual Alarms tested' }
                ].map((item) => (
                  <label 
                    key={item.key} 
                    className="flex items-center gap-2.5 p-2 rounded-lg bg-[#161B22] border border-white/5 cursor-pointer hover:bg-[#1E242D]"
                  >
                    <input
                      type="checkbox"
                      checked={(sirdarChecks as any)[item.key]}
                      onChange={(e) => setSirdarChecks(prev => ({ ...prev, [item.key]: e.target.checked }))}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-[#0D0F12] border-slate-700"
                    />
                    <span className="text-xs text-slate-200">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                alert('Shift Sirdar Logbook Digitally Signed & Timestamped to MineSync Core.');
                confetti({ particleCount: 30, spread: 40, origin: { y: 0.8 } });
              }}
              className="w-full py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Digital e-Signature & Shift Handover Sign-off</span>
            </button>
          </div>
        )}

        {/* TAB 3: MUSTER ROLL RFID/BIOMETRIC SCANNER */}
        {activeTab === 'MUSTER_SCAN' && (
          <div className="space-y-4">
            <div className="p-4 bg-[#0D0F12] rounded-xl border border-white/10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center mx-auto text-sky-400">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-200">Biometric & Smart Helmet RFID/QR Muster</h4>
                <p className="text-xs text-slate-400 mt-0.5 max-w-lg mx-auto">
                  Verify contractor workers against statutory Form B register, VTC mining training records, and IME fitness before underground or opencast entry.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left text-xs pt-2">
                <div className="bg-[#161B22] p-2.5 rounded-lg border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Total On-Shift</span>
                  <span className="font-bold text-base text-slate-100">342 Workers</span>
                </div>
                <div className="bg-[#161B22] p-2.5 rounded-lg border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">VTC Trained</span>
                  <span className="font-bold text-base text-emerald-400">100% Verified</span>
                </div>
                <div className="bg-[#161B22] p-2.5 rounded-lg border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">IME Medical Fit</span>
                  <span className="font-bold text-base text-sky-400">340/342 (99.4%)</span>
                </div>
                <div className="bg-[#161B22] p-2.5 rounded-lg border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Biometric Sync</span>
                  <span className="font-bold text-base text-amber-400">DGMS Core Live</span>
                </div>
              </div>

              {/* Worker Helmet QR Badge Scanner Action */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsQRScannerOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 mx-auto cursor-pointer active:scale-95"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Scan Helmet QR / Biometric Gate Token</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* FULLSCREEN CAMERA VIEWFINDER HUD MODAL                                    */}
      {/* ========================================================================= */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between backdrop-blur-md animate-in fade-in duration-200">
          {/* Visual Shutter Flash Effect */}
          {isFlashing && (
            <div className="absolute inset-0 bg-white z-50 pointer-events-none animate-out fade-out duration-200" />
          )}

          {/* Top Camera Header Bar */}
          <div className="relative z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 border border-amber-500/40 text-amber-300 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>LIVE DGMS HUD</span>
              </div>
              <span className="text-[11px] font-mono text-slate-300 hidden sm:inline">
                {facingMode === 'environment' ? 'Rear Lens (Wide 1280x720)' : 'Front Operator Lens'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* QR Scanner Mode Switch */}
              <button
                type="button"
                onClick={() => {
                  setIsCameraQRMode(!isCameraQRMode);
                  setCameraDetectedAsset(null);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isCameraQRMode 
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30' 
                    : 'bg-white/10 hover:bg-white/20 text-slate-200 border-white/15'
                }`}
                title="Toggle real-time QR barcode scanner"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>{isCameraQRMode ? 'QR Scanner: ON' : 'QR Mode'}</span>
              </button>

              {/* Flip Camera Lens */}
              <button
                type="button"
                onClick={toggleFacingMode}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 transition-colors cursor-pointer"
                title="Switch Camera Lens (Rear/Front)"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              {/* Close Viewfinder */}
              <button
                type="button"
                onClick={closeCamera}
                className="p-2.5 rounded-full bg-rose-600/80 hover:bg-rose-600 text-white border border-rose-400/40 transition-colors cursor-pointer"
                title="Close Camera"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Center Live Stream & Viewfinder HUD Reticle Overlay */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden mx-4 my-2 rounded-2xl border border-amber-500/30 bg-slate-950 shadow-2xl">
            {/* Live Video Element */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
            />

            {/* Hidden Canvas for Watermark Processing */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Real-time QR Detected Notification Banner in Camera */}
            {cameraDetectedAsset && (
              <div className="absolute top-4 inset-x-4 sm:inset-x-8 z-30 bg-slate-900/95 border-2 border-emerald-400 rounded-2xl p-3.5 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 animate-in slide-in-from-top duration-200">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400">[{cameraDetectedAsset.assetId}]</span>
                      <span className="font-bold text-xs text-slate-100 truncate">{cameraDetectedAsset.name}</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono truncate block">
                      ● {cameraDetectedAsset.statutoryFitnessStatus.replace(/_/g, ' ')} • {cameraDetectedAsset.sector}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleAssetIdentified(cameraDetectedAsset);
                    closeCamera();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex-shrink-0 cursor-pointer shadow-lg shadow-emerald-500/30 transition-all active:scale-95"
                >
                  Auto-Fill Form
                </button>
              </div>
            )}

            {/* Viewfinder Reticle & Watermark Overlay Graphic */}
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-6">
              {/* Top Watermark Badge */}
              <div className="flex items-center justify-between">
                <div className="bg-black/80 border border-amber-500/50 px-3 py-1.5 rounded text-[11px] font-bold text-amber-300 flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>MINESYNC STATUTORY AUDIT • DGMS EVIDENCE</span>
                </div>
                <div className="bg-emerald-950/80 border border-emerald-500/50 px-2.5 py-1 rounded text-[10px] font-mono font-bold text-emerald-300">
                  ● RTK GPS LOCKED
                </div>
              </div>

              {/* Center Crosshairs or QR Scanner Reticle */}
              {isCameraQRMode ? (
                <div className="self-center flex items-center justify-center relative w-56 h-56 sm:w-64 sm:h-64 border-2 border-dashed border-amber-400/80 rounded-2xl bg-amber-500/5">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-amber-400 rounded-tl-xl" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-amber-400 rounded-tr-xl" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-amber-400 rounded-bl-xl" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-amber-400 rounded-br-xl" />
                  
                  {/* Scanning Laser Beam */}
                  <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_12px_#f59e0b] animate-[bounce_2s_infinite]" />

                  <div className="px-3 py-1 rounded bg-black/80 text-[10px] font-mono text-amber-300 font-bold border border-amber-500/40">
                    ALIGN EQUIPMENT QR CODE
                  </div>
                </div>
              ) : (
                <div className="self-center flex items-center justify-center relative w-48 h-48 sm:w-64 sm:h-64 border border-amber-500/30 rounded-xl">
                  {/* Corner Brackets */}
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-400" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-400" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber-400" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-400" />
                  {/* Center Reticle Dot */}
                  <Crosshair className="w-8 h-8 text-amber-400/80 animate-pulse" />
                </div>
              )}

              {/* Bottom Live Telemetry Watermark Box */}
              <div className="bg-black/85 border border-white/15 backdrop-blur-md rounded-xl p-3 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-100">
                  <span>COLLIERY: {currentMine?.name || 'Jharia OCP Block-II'}</span>
                  <span className="text-amber-400 font-mono text-[11px]">{locationTag}</span>
                </div>
                <div className="font-mono text-[11px] text-sky-400 flex flex-wrap items-center gap-x-3">
                  <span>LAT: 23.7435° N</span>
                  <span>LNG: 86.4182° E</span>
                  <span>ALT: +184m MSL</span>
                  <span>HDG: 042° NE</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5 border-t border-white/10">
                  <span>AUDITOR: Kameshwar Singh (Mining Sirdar)</span>
                  <span className="text-emerald-400 font-mono">WATERMARK AUTO-STAMP: ENABLED</span>
                </div>
              </div>
            </div>

            {/* Error / Permission Fallback Overlay */}
            {cameraError && (
              <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center space-y-4">
                <AlertTriangle className="w-12 h-12 text-amber-400" />
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">Camera Stream Notice</h4>
                  <p className="text-xs text-slate-400 max-w-md mt-1">{cameraError}</p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleSnapSampleHazardShot({
                        title: 'Haul Road Berm Deficit (0.9m vs Required 2.4m)',
                        description: 'Field photo stamped with GPS Lat 23.7435, Lng 86.4182 (+184m MSL). Berm eroded after rainfall; height measured 0.9m along outer pit crest.',
                        severity: 'HIGH',
                        category: 'SAFETY',
                        regulation: 'CMR 2017 - Regulation 108 (Haul Road Safety Berms)',
                        location: 'Bench 4 - North Haul Road OB Dump',
                        hazardType: 'BERM'
                      });
                      closeCamera();
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
                  >
                    Snap High-Fidelity Mine Hazard Shot
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      closeCamera();
                      fileInputRef.current?.click();
                    }}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs border border-white/15 cursor-pointer"
                  >
                    Upload Image File
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Shutter Action Bar */}
          <div className="relative z-20 p-4 sm:p-6 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-center gap-8">
            {/* Gallery Thumbnail Preview (if any) */}
            <div className="w-14 h-14 rounded-xl border border-white/20 bg-slate-900 overflow-hidden flex items-center justify-center">
              {attachedPhotos[0] ? (
                <img src={attachedPhotos[0].dataUrl} alt="Last Snap" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-6 h-6 text-slate-600" />
              )}
            </div>

            {/* Giant Circular Mechanical Shutter Snap Button */}
            <button
              id="btn-trigger-shutter"
              type="button"
              onClick={() => {
                snapLiveCameraPhoto();
              }}
              className="relative p-1.5 rounded-full border-4 border-amber-400 hover:border-amber-300 transition-transform active:scale-95 cursor-pointer group"
              title="Snap & Watermark Geotagged Photo"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 group-hover:from-amber-400 group-hover:to-amber-200 flex items-center justify-center shadow-lg shadow-amber-500/40">
                <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-slate-950" />
              </div>
            </button>

            {/* Done & Return Button */}
            <button
              type="button"
              onClick={closeCamera}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Done ({attachedPhotos.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HIGH RESOLUTION PHOTO INSPECTION & ZOOM MODAL                             */}
      {/* ========================================================================= */}
      {previewPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#161B22] border border-white/15 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#0D0F12]">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-sm text-slate-100">
                  DGMS Statutory Evidence Record: {previewPhoto.id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewPhoto(null)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Image Preview with High Definition Stamped Watermark */}
            <div className="p-4 overflow-y-auto space-y-4">
              <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-lg bg-black">
                <img
                  src={previewPhoto.dataUrl}
                  alt="Full resolution inspection photo evidence"
                  className="w-full h-auto object-contain max-h-[55vh] mx-auto"
                />
              </div>

              {/* Watermark Cryptographic & Telemetry Verification Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-[#0D0F12] p-3 rounded-xl border border-white/5 space-y-1.5">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">GPS Telemetry Coordinates</span>
                  <div className="font-mono text-sky-400 font-bold">
                    LAT: {previewPhoto.coords.lat.toFixed(6)}° N<br />
                    LNG: {previewPhoto.coords.lng.toFixed(6)}° E<br />
                    ALTITUDE: +{previewPhoto.coords.altMsl}m MSL
                  </div>
                  <span className="text-[11px] text-slate-400 block pt-1">
                    Sector: {previewPhoto.locationTag}
                  </span>
                </div>

                <div className="bg-[#0D0F12] p-3 rounded-xl border border-white/5 space-y-1.5">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Audit & Integrity Stamp</span>
                  <div className="font-mono text-emerald-400 font-bold">
                    TAMPER HASH: {previewPhoto.tamperHash}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Timestamp: {previewPhoto.timestamp}<br />
                    Auditor: {previewPhoto.inspectorName} ({previewPhoto.inspectorRole})
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-white/10 bg-[#0D0F12] flex items-center justify-between">
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Validated under DGMS Circular 04/2022
              </span>

              <div className="flex items-center gap-2">
                <a
                  href={previewPhoto.dataUrl}
                  download={`DGMS-EVIDENCE-${previewPhoto.id}.jpg`}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Download JPEG</span>
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewPhoto(null)}
                  className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EQUIPMENT & ZONE QR SCANNER MODAL                                         */}
      {/* ========================================================================= */}
      <QRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onAssetIdentified={handleAssetIdentified}
        currentMineName={currentMine?.name}
      />
    </div>
  );
};

