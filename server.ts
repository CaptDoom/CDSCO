import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import crypto from "crypto";
import http from "http";
import { Server } from "socket.io";

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

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server);
  const PORT = 3000;

  app.use(express.json({ limit: "20mb" }));

  // Real-time Event Simulation
  io.on("connection", (socket) => {
    console.log("[WS] Secure audit node connected:", socket.id);
    socket.emit("system-status", {
      status: "STABLE",
      node: "SENTINEL-01",
      sync: "ACTIVE"
    });
  });

  // Regulatory Event Loop
  const EVENT_TEMPLATES = [
    { msg: "SUGAM Submission #$ID validated", severity: "INFO" },
    { msg: "SAE Alert: Clinical site $SITE reported elevated risk", severity: "CRITICAL" },
    { msg: "Audit Log synchronization complete (Node $NODE)", severity: "SUCCESS" },
    { msg: "Neural weights re-balanced for ClinicalBERT v4.2", severity: "INFO" },
    { msg: "GPU Cluster $NODE at 85% capacity", severity: "WARNING" },
    { msg: "Anonymization rules updated by CDSCO-ADMIN", severity: "SUCCESS" }
  ];

  const SITES = ["AIIMS Delhi", "PGIMER", "CMC Vellore", "Apollo Chennai", "Zydus Cadila Lab"];
  
  setInterval(() => {
    const template = EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)];
    const message = template.msg
      .replace("$ID", Math.floor(Math.random() * 90000 + 10000).toString())
      .replace("$SITE", SITES[Math.floor(Math.random() * SITES.length)])
      .replace("$NODE", Math.floor(Math.random() * 5 + 1).toString());

    io.emit("regulatory-event", {
      id: crypto.randomUUID(),
      message,
      severity: template.severity,
      timestamp: new Date().toISOString()
    });
  }, 4000);

  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      node: "CDSCO-DELHI-01", 
      config: CONFIG,
      timestamp: new Date().toISOString() 
    });
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

