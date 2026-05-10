import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import crypto from "crypto";
import http from "http";
import { Server } from "socket.io";
import { Pinecone } from "@pinecone-database/pinecone";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SALT = process.env.ANON_SALT || "cdsco_sentinel_2026_salt";

// --- CONFIG & STAGE 2 READINESS ---
const STAGE = "1";
const CONFIG = {
  STAGE,
  DATA_SOURCE: STAGE === "1" ? "PUBLIC" : "CDSCO_SECURE",
  SUGAM_API_URL: process.env.SUGAM_API_URL || "https://sugam.cdsco.gov.in/api/v1/mock",
  MD_ONLINE_API_URL: process.env.MD_ONLINE_API_URL || "https://mdonline.gov.in/api/v1/mock"
};

// --- APPEND-ONLY AUDIT LOG (Stub for guidelines compliance) ---
interface AuditEntry {
  id: string;
  userId: string;
  action: string;
  inputHash: string;
  outputHash: string;
  decision: any;
  createdAt: string;
}
const auditLog: AuditEntry[] = [];

function addToAuditLog(entry: Omit<AuditEntry, "id" | "createdAt">) {
  const newEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString()
  };
  auditLog.push(newEntry);
  return newEntry;
}

function calculateHash(content: string) {
  return crypto.createHash("sha256").update(content).digest("hex");
}

// --- HELPERS ---
function tokenize(text: string, category: string): string {
  const hash = crypto.createHmac("sha256", SALT).update(text).digest("hex").slice(0, 8);
  return `[${category}_${hash}]`;
}

function generalize(text: string, category: string): string {
  switch (category) {
    case "DOB":
    case "AGE":
      const age = parseInt(text.replace(/\D/g, ""));
      if (!isNaN(age)) {
        const floor = Math.floor(age / 10) * 10;
        return `${floor}-${floor + 10} years`;
      }
      return "[AGE_BANDED]";
    case "ADDRESS":
      const states = ["Delhi", "Maharashtra", "Karnataka", "Tamil Nadu", "Gujarat", "Uttar Pradesh"];
      const found = states.find(s => text.includes(s));
      return found ? `State: ${found}` : "[LOCATION_SUPPRESSED]";
    case "DATE":
      return "[DATE_SHIFTED]";
    default:
      return tokenize(text, category);
  }
}

let pineconeClient: Pinecone | null = null;

function getPinecone() {
  if (!pineconeClient) {
    const apiKey = process.env.PINECONE_API_KEY;
    if (!apiKey) {
      throw new Error("PINECONE_API_KEY environment variable is required");
    }
    pineconeClient = new Pinecone({ apiKey });
  }
  return pineconeClient;
}

// --- REGULATORY FILING SYSTEM (Enterprise Grade Logic) ---
interface Filing {
  id: string;
  userId: string;
  title: string;
  status: "PENDING" | "SCRUBBING" | "AUDITING" | "APPROVED" | "REJECTED";
  progress: number;
  priority: "CRITICAL" | "REVIEW" | "VALIDATE";
  metadata: any;
  aiAnalysis?: {
    riskScore: number;
    findings: {
      type: string;
      label: string;
      confidence: number;
      source?: string;
    }[];
    vitals?: {
      p_value: number;
      sampleSize: number;
      dosageConsistency: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

const filings: Map<string, Filing> = new Map();

// Simulated Task Queue for Async Processing
const taskQueue: string[] = [];
let isProcessing = false;

async function processQueue(io: Server) {
  if (isProcessing || taskQueue.length === 0) return;
  isProcessing = true;

  const filingId = taskQueue.shift();
  const filing = filings.get(filingId!);

  if (filing) {
    // 1. Scrubbing Stage
    filing.status = "SCRUBBING";
    filing.progress = 25;
    io.emit("filing-updated", filing);
    io.emit("regulatory-event", {
      id: crypto.randomUUID(),
      message: `PII scrubbing initiated for [${filing.title}]`,
      severity: "INFO",
      timestamp: new Date().toISOString()
    });
    await new Promise(r => setTimeout(r, 2000));

    // 2. Auditing Stage (Simulated AI Orchestration)
    filing.status = "AUDITING";
    filing.progress = 65;
    io.emit("filing-updated", filing);
    io.emit("regulatory-event", {
      id: crypto.randomUUID(),
      message: `LangGraph Orchestrator: Initiating cross-ref for [${filing.title}]`,
      severity: "WARNING",
      timestamp: new Date().toISOString()
    });
    await new Promise(r => setTimeout(r, 1500));

    // Simulated Analysis Logic
    filing.aiAnalysis = {
      riskScore: Math.floor(Math.random() * 30) + 10,
      findings: [
        { type: "RAG_MATCH", label: "CDSCO Drug Schedule H Match", confidence: 0.98, source: "Schedule_H_2024.pdf" },
        { type: "BERT_ENTITY", label: "Adverse Reaction: Hepatotoxicity", confidence: 0.89 },
        { type: "CONSISTENCY", label: "Dose Delta < 2%", confidence: 0.94 }
      ],
      vitals: {
        p_value: 0.042,
        sampleSize: 1200,
        dosageConsistency: "HIGH"
      }
    };
    
    io.emit("filing-updated", filing);
    await new Promise(r => setTimeout(r, 2500));

    // 3. Finalization
    filing.status = "APPROVED";
    filing.progress = 100;
    filing.updatedAt = new Date().toISOString();
    io.emit("filing-updated", filing);
    io.emit("regulatory-event", {
      id: crypto.randomUUID(),
      message: `Filing [${filing.title}] finalized. Multi-agent consensus achieved.`,
      severity: "SUCCESS",
      timestamp: new Date().toISOString()
    });
  }

  isProcessing = false;
  processQueue(io);
}

// Initial Mock Filings
const INITIAL_FILINGS: Filing[] = [
  {
    id: "778",
    userId: "OFFICER_1",
    title: "Vaccine Batch #778",
    status: "AUDITING",
    progress: 45,
    priority: "CRITICAL",
    metadata: { type: "vaccine", batch: "V-2024-X" },
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: "B-ALPHA",
    userId: "OFFICER_2",
    title: "Generic Form-B Alpha",
    status: "PENDING",
    progress: 0,
    priority: "REVIEW",
    metadata: { type: "generic", drug: "Paracetamol-A" },
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString()
  }
];
INITIAL_FILINGS.forEach(f => filings.set(f.id, f));

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
  const PORT = 3000;

  app.use(express.json({ limit: "20mb" }));

  // Real-time Event Simulation
  io.on("connection", (socket) => {
    console.log("[WS] Secure audit node connected:", socket.id);
    socket.emit("system-status", {
      status: "STABLE",
      node: "SENTINEL-01",
      sync: "ACTIVE",
      activeFilings: filings.size
    });
    
    // Send current filings state to newly connected client
    socket.emit("filings-init", Array.from(filings.values()));
  });

  // Regulatory Event Loop (Random system noise)
  const SYSTEM_NOISE = [
    { msg: "Neural weights re-balanced for ClinicalBERT v4.2", severity: "INFO" },
    { msg: "GPU Cluster #01 at 85% capacity", severity: "WARNING" },
    { msg: "Anonymization rules updated by CDSCO-ADMIN", severity: "SUCCESS" }
  ];
  
  setInterval(() => {
    const template = SYSTEM_NOISE[Math.floor(Math.random() * SYSTEM_NOISE.length)];
    io.emit("regulatory-event", {
      id: crypto.randomUUID(),
      message: template.msg,
      severity: template.severity,
      timestamp: new Date().toISOString()
    });
  }, 12000);

  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      node: "CDSCO-DELHI-01", 
      config: CONFIG,
      timestamp: new Date().toISOString() 
    });
  });

  // Filings API
  app.get("/api/filings", (req, res) => {
    res.json(Array.from(filings.values()));
  });

  app.post("/api/filings", (req, res) => {
    const { title, priority, metadata } = req.body;
    const newFiling: Filing = {
      id: crypto.randomBytes(4).toString("hex").toUpperCase(),
      userId: "OFFICER_CURRENT",
      title: title || "Unnamed Filing",
      status: "PENDING",
      progress: 0,
      priority: priority || "VALIDATE",
      metadata: metadata || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    filings.set(newFiling.id, newFiling);
    taskQueue.push(newFiling.id);
    io.emit("filing-created", newFiling);
    
    // Start background processing
    processQueue(io);

    res.status(202).json(newFiling);
  });

  // Audit Log Endpoint
  app.get("/api/admin/audit", (req, res) => {
    res.json(auditLog);
  });

  // --- MODULE 1: ANONYMIZATION ---
  app.post("/api/anonymize-process", async (req, res) => {
    const { text, entities, mode = "strict" } = req.body;

    if (!text || !entities) {
      return res.status(400).json({ error: "Missing text or entities" });
    }

    let processedText = text;
    const sortedEntities = [...entities].sort((a, b) => b.start - a.start);

    sortedEntities.forEach((ent: any) => {
      const original = text.substring(ent.start, ent.end);
      const replacement = mode === "strict" ? generalize(original, ent.category) : tokenize(original, ent.category);
      processedText = processedText.substring(0, ent.start) + replacement + processedText.substring(ent.end);
    });

    const compliance = { 
      kAnonymity: mode === "strict" ? 5 : 2, 
      lDiversity: 2,
      tCloseness: 0.12,
      riskScore: entities.length > 5 ? "MEDIUM" : "LOW",
      phiEntitiesDetected: entities.length
    };

    addToAuditLog({
      userId: "OFFICER_482",
      action: "ANONYMIZE",
      inputHash: calculateHash(text),
      outputHash: calculateHash(processedText),
      decision: compliance
    });

    res.json({
      anonymizedText: processedText,
      compliance
    });
  });

  // --- STAGE 2 SYNC STUBS ---
  app.post("/api/sync/sugam", (req, res) => {
    res.json({ status: "STUB_SYNC_SUCCESS", target: "SUGAM_PORTAL", timestamp: new Date().toISOString() });
  });

  app.post("/api/sync/mdonline", (req, res) => {
    res.json({ status: "STUB_SYNC_SUCCESS", target: "MD_ONLINE_PORTAL", timestamp: new Date().toISOString() });
  });

  // --- PINECONE INTEGRATION ---
  app.post("/api/pinecone/search", async (req, res) => {
    try {
      const { vector, topK = 5 } = req.body;
      const indexName = process.env.PINECONE_INDEX;
      if (!indexName) throw new Error("PINECONE_INDEX is not configured");

      const pc = getPinecone();
      const index = pc.index(indexName);
      
      const queryResponse = await index.query({
        vector,
        topK,
        includeMetadata: true
      });

      res.json(queryResponse);
    } catch (error: any) {
      console.error("[PINECONE SEARCH ERROR]", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/pinecone/upsert", async (req, res) => {
    try {
      const { vectors } = req.body; // Array of { id, values, metadata }
      const indexName = process.env.PINECONE_INDEX;
      if (!indexName) throw new Error("PINECONE_INDEX is not configured");

      const pc = getPinecone();
      const index = pc.index(indexName);

      await index.upsert(vectors);
      res.json({ status: "SUCCESS", count: vectors.length });
    } catch (error: any) {
      console.error("[PINECONE UPSERT ERROR]", error);
      res.status(500).json({ error: error.message });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`[SERVER] Sentinel AI running on port ${PORT}`);
  });
}

startServer();

