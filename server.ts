import express from 'express';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Groq AI client initialization (primary)
let groqClient: OpenAI | null = null;
function getGroqClient(): OpenAI | null {
  if (!groqClient && process.env.GROQ_API_KEY) {
    groqClient = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
    });
  }
  return groqClient;
}

// Lazy/safe Gemini AI client initialization (fallback)
let genAIClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    genAIClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

// The ledger is persisted locally for development. Use a durable database or mounted
// disk in production because Render's default filesystem is ephemeral.
type AuditBlock = Record<string, any> & {
  blockIndex: number;
  previousHash: string;
  blockHash: string;
  currentHash: string;
  digitalSignature: string;
};

const ledgerPath = process.env.AUDIT_LEDGER_PATH || path.join(process.cwd(), 'data', 'audit-ledger.json');
const genesisHash = crypto.createHash('sha256').update('MineSync-audit-genesis-v1').digest('hex');

function getSigningKeys() {
  if (process.env.AUDIT_PRIVATE_KEY && process.env.AUDIT_PUBLIC_KEY) {
    return {
      privateKey: crypto.createPrivateKey(process.env.AUDIT_PRIVATE_KEY.replace(/\\n/g, '\n')),
      publicKey: crypto.createPublicKey(process.env.AUDIT_PUBLIC_KEY.replace(/\\n/g, '\n')),
    };
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('AUDIT_PRIVATE_KEY and AUDIT_PUBLIC_KEY must be configured in production.');
  }

  console.warn('AUDIT_PRIVATE_KEY/AUDIT_PUBLIC_KEY are not configured; using an ephemeral RSA key for development only.');
  return crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
}

const signingKeys = getSigningKeys();

function loadAuditLedger(): AuditBlock[] {
  try {
    if (fs.existsSync(ledgerPath)) return JSON.parse(fs.readFileSync(ledgerPath, 'utf8')) as AuditBlock[];
  } catch (error) {
    console.error('Unable to read audit ledger:', error);
  }
  return [{
    blockIndex: 0,
    timestamp: new Date().toISOString(),
    action: 'GENESIS',
    entityType: 'SYSTEM',
    entityId: 'MINESYNC',
    initiatedBy: 'SYSTEM',
    role: 'SYSTEM',
    previousHash: '0'.repeat(64),
    blockHash: genesisHash,
    currentHash: genesisHash,
    digitalSignature: '',
    details: 'Ledger genesis block',
    payload: {},
  }];
}

let auditLedger = loadAuditLedger();

function saveAuditLedger() {
  fs.mkdirSync(path.dirname(ledgerPath), { recursive: true });
  const temporaryPath = `${ledgerPath}.tmp`;
  fs.writeFileSync(temporaryPath, JSON.stringify(auditLedger, null, 2), 'utf8');
  fs.renameSync(temporaryPath, ledgerPath);
}

function blockPayload(block: Omit<AuditBlock, 'blockHash' | 'currentHash' | 'digitalSignature'>) {
  return JSON.stringify({
    blockIndex: block.blockIndex,
    timestamp: block.timestamp,
    action: block.action,
    entityType: block.entityType,
    entityId: block.entityId,
    initiatedBy: block.initiatedBy,
    role: block.role,
    subsidiary: block.subsidiary,
    mineName: block.mineName,
    previousHash: block.previousHash,
    details: block.details,
    payload: block.payload,
  });
}

function signHash(hash: string) {
  return crypto.sign('RSA-SHA256', Buffer.from(hash), signingKeys.privateKey).toString('base64');
}

function verifyLedger() {
  const chronological = [...auditLedger].sort((a, b) => a.blockIndex - b.blockIndex);
  for (let index = 0; index < chronological.length; index += 1) {
    const block = chronological[index];
    if (index === 0) {
      if (block.blockIndex !== 0 || block.blockHash !== genesisHash || block.currentHash !== genesisHash) return false;
      continue;
    }
    if (index > 0 && block.previousHash !== chronological[index - 1].blockHash) return false;
    const { blockHash, currentHash, digitalSignature, ...unsignedBlock } = block;
    const expectedHash = crypto.createHash('sha256').update(blockPayload(unsignedBlock)).digest('hex');
    if (blockHash !== expectedHash || currentHash !== expectedHash) return false;
    if (!digitalSignature || !crypto.verify('RSA-SHA256', Buffer.from(expectedHash), signingKeys.publicKey, Buffer.from(digitalSignature, 'base64'))) return false;
  }
  return true;
}

// Health API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'MineSync Coal Mine Smart Governance Engine', timestamp: new Date().toISOString() });
});

// AI Risk Assessment Endpoint
app.post('/api/ai/risk-assessment', async (req, res) => {
  try {
    const { mineName, mineType, activeSensors, recentViolations, weatherCondition } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback deterministic risk analysis if key is not configured
      const ch4Alert = activeSensors?.find((s: any) => s.type === 'GAS_CH4' && s.currentValue > 0.7);
      const slopeAlert = activeSensors?.find((s: any) => s.type === 'SLOPE_RADAR' && s.currentValue > 5.0);

      const score = (ch4Alert ? 45 : 0) + (slopeAlert ? 40 : 0) + (recentViolations?.length || 0) * 8;
      const compositeScore = Math.min(98, Math.max(15, score));

      return res.json({
        overallRiskLevel: compositeScore > 80 ? 'CRITICAL_EMERGENCY' : compositeScore > 60 ? 'HIGH' : compositeScore > 35 ? 'ELEVATED' : 'LOW',
        compositeRiskScore: compositeScore,
        highRiskZones: [
          ...(ch4Alert ? [{
            zoneName: ch4Alert.location || 'Underground Return Airway',
            riskFactor: 'Inflammable Gas (CH4) Exceedance beyond CMR 2017 limit (0.75%)',
            probability: 0.94,
            statutoryViolationRisk: 'CMR 2017 Regulation 153 & Section 22 of Mines Act 1952',
            preventativeDirective: 'Cut power to coal cutters immediately, enhance auxiliary ventilation to > 50 m³/min.'
          }] : []),
          ...(slopeAlert ? [{
            zoneName: slopeAlert.location || 'Overburden Dump Flank',
            riskFactor: 'Slope displacement rate accelerated to > 5 mm/24h',
            probability: 0.88,
            statutoryViolationRisk: 'CMR 2017 Regulation 106 (Bench Stability)',
            preventativeDirective: 'Evacuate shovel excavators from toe of dump; establish 50m safety cordon.'
          }] : [])
        ],
        recurringViolationsPattern: ['Berm height deficits during monsoon haulage', 'Delayed VTC recertifications for contractor tipper operators'],
        anomaliesDetected: [
          {
            type: 'Micro-Displacement Surge',
            description: 'Slope radar registered 2.1mm shift in 4 hours post-blasting.',
            severity: 'HIGH',
            suggestedAction: 'Deploy geotechnical laser prism and inspect for tension cracks.'
          }
        ],
        regulatoryEscalationWarning: compositeScore > 75 ? 'Mandatory auto-escalation to DGMS Regional Inspector within 2 hours.' : undefined
      });
    }

    const prompt = `You are the Directorate General of Mines Safety (DGMS) AI Chief Risk Assessor for Indian Coal Mines.
Analyze the following operational data for "${mineName}" (Type: ${mineType || 'OPENCAST'}):
- Live Sensor Telemetry: ${JSON.stringify(activeSensors || [])}
- Recent Statutory Non-Conformances: ${JSON.stringify(recentViolations || [])}
- Environmental & Shift Conditions: ${weatherCondition || 'Normal monsoon shift, overcast'}

Evaluate statutory compliance under Coal Mines Regulations (CMR) 2017, Mines Act 1952, CPCB Environment Standards, and DGMS Technical Circulars.

Respond STRICTLY in valid JSON matching this schema:
{
  "overallRiskLevel": "LOW" | "ELEVATED" | "HIGH" | "CRITICAL_EMERGENCY",
  "compositeRiskScore": number (0 to 100),
  "highRiskZones": [
    {
      "zoneName": string,
      "riskFactor": string,
      "probability": number (0.0 to 1.0),
      "statutoryViolationRisk": string,
      "preventativeDirective": string
    }
  ],
  "recurringViolationsPattern": [string],
  "anomaliesDetected": [
    {
      "type": string,
      "description": string,
      "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL_FATAL_RISK",
      "suggestedAction": string
    }
  ],
  "regulatoryEscalationWarning": string
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/ai/risk-assessment:', error);
    
    // Handle Gemini API rate limiting/overload gracefully
    if (error.status === 503 || error.message?.includes('high demand')) {
      return res.status(503).json({ 
        error: 'Gemini API temporarily overloaded. Please try again in a few moments.',
        fallbackMode: true 
      });
    }
    
    res.status(500).json({ error: error.message || 'Failed to generate AI risk assessment' });
  }
});

// AI OCR & Statutory Document Digitizer Endpoint
app.post('/api/ai/ocr-digitize', async (req, res) => {
  try {
    const { rawText, documentType, base64Image } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(503).json({
        error: 'OCR requires GEMINI_API_KEY. Configure the server environment and try again.',
        code: 'OCR_PROVIDER_NOT_CONFIGURED'
      });
    }

    if (!rawText && !base64Image) {
      return res.status(400).json({ error: 'Provide rawText or base64Image to digitize.' });
    }

    const contents: any[] = [];
    if (base64Image) {
      const imageMatch = base64Image.match(/^data:(image\/[a-z0-9.+-]+);base64,/i);
      contents.push({
        inlineData: {
          mimeType: imageMatch?.[1] || 'image/jpeg',
          data: base64Image.replace(/^data:image\/[a-z0-9.+-]+;base64,/i, '')
        }
      });
    }

    const textPrompt = `You are an expert OCR & Statutory Document Digitizer for Indian Coal Mines (DGMS, Coal India Limited, MoEFCC, CPCB).
Document Type: ${documentType || 'Statutory Inspection Record'}
Input Text/Scanned Content: ${rawText || 'Scanned handwritten shift sirdar book report'}

Extract all key metadata, statutory violations under CMR 2017 and Mines Act 1952, severity levels, and automated Corrective and Preventive Actions (CAPA).

Output STRICT JSON:
{
  "documentTitle": string,
  "extractedMetadata": {
    "inspectionDate": string,
    "mineName": string,
    "inspectorName": string,
    "authority": string
  },
  "detectedViolations": [
    {
      "statutoryClause": string,
      "observedDefect": string,
      "riskSeverity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL_FATAL_RISK",
      "remedialActionMandate": string,
      "complianceDeadlineDays": number
    }
  ],
  "complianceScoreAssigned": number (0-100),
  "actionItemsForCAPA": [string],
  "summary": string
}`;

    contents.push({ text: textPrompt });

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: contents,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    parsed.cryptographicProofHash = crypto.createHash('sha256').update(base64Image || rawText || '').digest('hex');
    parsed.provider = 'Google Gemini';
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/ai/ocr-digitize:', error);
    
    // Handle Gemini API rate limiting/overload gracefully
    if (error.status === 503 || error.message?.includes('high demand')) {
      return res.status(503).json({ 
        error: 'Gemini API temporarily overloaded. Please try again in a few moments.',
        fallbackMode: true 
      });
    }
    
    res.status(500).json({ error: error.message || 'Failed to digitize document' });
  }
});

// AI Multilingual Statutory Mining Copilot (Groq + Gemini fallback)
app.post('/api/ai/copilot', async (req, res) => {
  try {
    const { query, language = 'en', contextData } = req.body;
    const groq = getGroqClient();
    const gemini = getGeminiClient();

    if (!groq && !gemini) {
      const answers: Record<string, string> = {
        hi: `**माइनसिंक सांविधिक अनुपालन गाइड (MineSync Compliance Engine)**:\n\nकोयला खान विनियम (CMR 2017) के विनियम 106 और 108 के अनुसार, ओपनकास्ट खानों में ओवरबर्डन बेंच की ऊंचाई एक्सकेवेटर की अधिकतम कटिंग क्षमता से अधिक नहीं होनी चाहिए। हॉल रोड पर डंपर के पहिये की ऊंचाई के बराबर मजबूत सुरक्षात्मक बर्म (Berm) अनिवार्य है।\n\n- **अधिनियम संदर्भ**: Mines Act 1952, Section 22\n- **अनिवार्य कार्रवाई**: शिफ्ट लॉगबुक में डिजिटल साइन-ऑफ और जीपीएस टैग की गई तस्वीरें अपलोड करें।`,
        bn: `**মাইনসিঙ্ক বিধিবদ্ধ কমপ্লায়েন্স গাইড (MineSync Statutory Guide)**:\n\nকোল মাইনস রেগুলেশনস ২০১৭ (CMR 2017) অনুসারে মাটির নিচের খনিতে (Underground Mines) মিথেন গ্যাসের (CH4) মাত্রা ০.৫% এর কম রাখা বাধ্যতামূলক। ০.৮% অতিক্রম করলে তাৎক্ষণিক ইলেকট্রিক্যাল পাওয়ার বিচ্ছিন্ন করে ডিজিএমএস নোটিশ পাঠাতে হবে।`,
        en: `**MineSync Statutory Copilot (CMR 2017 & Mines Act 1952 Expert)**:\n\nRegarding your inquiry: Under **Coal Mines Regulations (CMR) 2017 - Regulation 106 (Strata & Bench Stability)** and **DGMS Circular No. 04 of 2020**, all opencast mine benches must maintain a width greater than the dumper turning radius plus 3 meters. Active slope displacement exceeding 3.0 mm/24h mandates immediate geotechnical cessation of bottom benches.\n\n- **Immediate Step**: Log an inspection via the mobile field app with GPS coordinates.\n- **Escalation**: Notify the Colliery Manager & DGMS Sitarampur/Bilaspur Zonal Office if unresolved within 48 hours.`
      };

      return res.json({
        reply: answers[language] || answers.en,
        legalReferences: ['Coal Mines Regulations 2017', 'Mines Act 1952 (Sec 22)', 'DGMS Circular 04/2020', 'CPCB AAQMS Standard 2009'],
        suggestedActions: [
          'Initiate Digital Notice to Overman',
          'Export DGMS Form IV Report',
          'Deploy Mobile Water Sprinkler'
        ]
      });
    }

    const languageNames: Record<string, string> = {
      en: 'English',
      hi: 'Hindi (हिंदी)',
      bn: 'Bengali (বাংলা)'
    };

    const systemPrompt = `You are "MineSync AI Copilot", an authoritative AI assistant for Indian Coal Mining governance, statutory compliance, safety inspections, and environmental reporting.
You are fully versed in:
1. Coal Mines Regulations (CMR) 2017
2. Mines Act 1952 (Section 22/22A)
3. Mines Rules 1955
4. Environment (Protection) Act 1986
5. CPCB Standards & DGMS Guidelines

Respond in: ${languageNames[language] || 'English'}.
Provide comprehensive, authoritative responses with explicit regulatory references and actionable steps.`;

    // Try Groq first (fastest free tier)
    if (groq) {
      try {
        const groqResponse = await groq.chat.completions.create({
          model: 'mixtral-8x7b-32768',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Query: "${query}"\nContext: ${JSON.stringify(contextData || {})}` }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        });

        const reply = groqResponse.choices[0]?.message?.content || 'Unable to generate response';
        return res.json({
          reply,
          legalReferences: ['Coal Mines Regulations 2017', 'Mines Act 1952', 'DGMS Circulars'],
          suggestedActions: ['Log Inspection', 'Notify Colliery Manager', 'Update Compliance']
        });
      } catch (groqError: any) {
        console.warn('Groq failed, falling back to Gemini:', groqError.message);
      }
    }

    // Fallback to Gemini
    if (gemini) {
      const prompt = `${systemPrompt}\n\nUser Query: "${query}"\nContext: ${JSON.stringify(contextData || {})}`;

      const response = await gemini.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
      });

      return res.json({
        reply: response.text || 'No response generated',
        legalReferences: ['Coal Mines Regulations 2017', 'Mines Act 1952', 'DGMS Circulars'],
        suggestedActions: ['Log Inspection', 'Issue Notice', 'Verify Compliance']
      });
    }
  } catch (error: any) {
    console.error('Error in /api/ai/copilot:', error);
    
    // Handle Gemini API rate limiting/overload gracefully
    if (error.status === 503 || error.message?.includes('high demand')) {
      return res.status(503).json({ 
        error: 'Gemini API temporarily overloaded. Service should recover in a few minutes.',
        fallbackMode: true 
      });
    }
    
    res.status(500).json({ error: error.message || 'Failed to process AI copilot query' });
  }
});

// Append to Blockchain-Style Audit Ledger Endpoint
app.post(['/api/audit-trail', '/api/audit-trail/append'], (req, res) => {
  try {
    const { action, entityType, entityId, initiatedBy, role, subsidiary, mineName, details, payload } = req.body;
    if (!action || !entityType || !entityId || !initiatedBy) {
      return res.status(400).json({ error: 'action, entityType, entityId, and initiatedBy are required' });
    }

    const lastBlock = auditLedger.reduce((latest, block) => block.blockIndex > latest.blockIndex ? block : latest, auditLedger[0]);
    const newIndex = lastBlock.blockIndex + 1;
    const timestamp = new Date().toISOString();

    const unsignedBlock = {
      blockIndex: newIndex,
      timestamp,
      action,
      entityType,
      entityId,
      initiatedBy,
      role,
      subsidiary: subsidiary || 'CIL_HQ',
      mineName: mineName || 'Central Database',
      previousHash: lastBlock.blockHash,
      details: details || 'Statutory record verified and added to immutable digital ledger.',
      payload: payload || {},
    };
    const blockHash = crypto.createHash('sha256').update(blockPayload(unsignedBlock)).digest('hex');
    const newBlock: AuditBlock = {
      ...unsignedBlock,
      blockHash,
      currentHash: blockHash,
      digitalSignature: signHash(blockHash),
    };

    auditLedger.unshift(newBlock);
    saveAuditLedger();
    res.json({ success: true, block: newBlock });
  } catch (error: any) {
    console.error('Error in /api/audit-trail/append:', error);
    res.status(500).json({ error: 'Failed to append to audit ledger' });
  }
});

// Get Audit Trail
app.get('/api/audit-trail', (req, res) => {
  res.json({ blocks: auditLedger, isValid: verifyLedger() });
});

app.get('/api/audit-trail/verify', (req, res) => {
  res.json({ isValid: verifyLedger(), blockCount: auditLedger.length });
});

// Vite Middleware & Static Serving Setup
export async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MineSync Server running on http://localhost:${PORT}`);
  });
}

if (process.env.VERCEL !== '1') {
  startServer();
}

export { app };
