import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";
import { spawn, exec, ChildProcessWithoutNullStreams } from "child_process";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const getFilePath = (filename: string) => {
  if (process.env.VERCEL) {
    const tmpPath = path.join("/tmp", filename);
    if (!fs.existsSync(tmpPath)) {
      const srcPath = path.join(process.cwd(), filename);
      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, tmpPath);
      }
    }
    return tmpPath;
  }
  return path.join(process.cwd(), filename);
};

// In-Memory Fallback and Database File Definition
const DATABASE_FILE = getFilePath("visitor_db.json");

interface VisitHistoryItem {
  timestamp: string;
  action: string;
}

interface Visitor {
  id: string;
  name: string;
  contact: string;
  purpose: string;
  department: string;
  company: string;
  hostName: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: "registered" | "checked-in" | "checked-out";
  badgeColor: string;
  riskScore: number;
  riskAssessment: string;
  clearanceLevel: "unclassified" | "restricted" | "secret" | "top-secret";
  avatarSeed: string;
  visitHistory: string[]; // Standardized as flat string list to match Java model
  securityProtocol: string;
}

const initialVisitors: Visitor[] = [
  {
    id: "V-101",
    name: "Aris Thorne",
    company: "Cyberdyne Systems",
    contact: "+1 (555) 901-2045",
    purpose: "Quantum Core Calibration",
    department: "R&D Lab 4",
    hostName: "Dr. Helen Vance",
    status: "checked-in",
    checkInTime: "08:30:00",
    checkOutTime: null,
    badgeColor: "#3b82f6",
    riskScore: 12,
    riskAssessment: "[Standard Checkpoint Clear] Aris Thorne representing Cyberdyne Systems presents standard risk. No alerts detected.",
    clearanceLevel: "secret",
    avatarSeed: "Aris Thorne",
    securityProtocol: "Classified supervisor escort required. Log all terminal interactions. Proximity alarms enabled.",
    visitHistory: [
      "08:15:00 - Perimeter bio-vitals synchronized.",
      "08:30:00 - Checked in by Dr. Vance. Cyber-shield badge activated."
    ]
  },
  {
    id: "V-102",
    name: "Aria T'Loak",
    company: "Omega Cargo",
    contact: "+1 (415) 309-8821",
    purpose: "Strategic Partnership Negotiation",
    department: "Executive Boardroom",
    hostName: "CEO Richard Kestrel",
    status: "registered",
    checkInTime: null,
    checkOutTime: null,
    badgeColor: "#a855f7",
    riskScore: 45,
    riskAssessment: "[Attention Required] High-energy signature detected or critical infrastructure requested. Escort highly recommended.",
    clearanceLevel: "restricted",
    avatarSeed: "Aria T'Loak",
    securityProtocol: "Companion access. General facility access allowed under continuous CCTV telemetry.",
    visitHistory: [
      "Yesterday - Visitor Pre-Registered in Core Mainframe."
    ]
  },
  {
    id: "V-103",
    name: "Marcus Wright",
    company: "Project Angel",
    contact: "+1 (212) 441-0092",
    purpose: "System Integration Audit",
    department: "Infrastructure Sector G",
    hostName: "Director Sarah Connor",
    status: "checked-out",
    checkInTime: "09:15:00",
    checkOutTime: "12:45:00",
    badgeColor: "#22c55e",
    riskScore: 8,
    riskAssessment: "[BioScan Acknowledged] Cleared visitor. Normal physical signatures. Clean database match.",
    clearanceLevel: "unclassified",
    avatarSeed: "Marcus Wright",
    securityProtocol: "Standard self-guided access. Badge must be displayed on outer uniform at all times.",
    visitHistory: [
      "09:15:00 - Access card registered and issued.",
      "12:45:00 - Logged tasks; physical badge recovered; checked out."
    ]
  },
  {
    id: "V-104",
    name: "Seraph",
    company: "The Oracle Group",
    contact: "+1 (650) 812-7493",
    purpose: "Threat Vector Analysis",
    department: "Cyberwarfare Chamber",
    hostName: "Security Chief Morpheus",
    status: "checked-in",
    checkInTime: "07:45:00",
    checkOutTime: null,
    badgeColor: "#ef4444",
    riskScore: 88,
    riskAssessment: "[CRITICAL WARNING] Seraph requests clearance for tactical/highly confidential activities. Flagged for strict biometric observation.",
    clearanceLevel: "top-secret",
    avatarSeed: "Seraph",
    securityProtocol: "ARMED GUARD ESCORT MANDATORY. Maintain active proximity trackers. Restrict access to designated grid node only.",
    visitHistory: [
      "07:30:00 - Heavy cryptographic gear flagged at metal detector; manually overridden.",
      "07:45:00 - Checked in under Top-Secret protocols."
    ]
  }
];

// Helper database reader/writer
function readDB(): Visitor[] {
  try {
    if (fs.existsSync(DATABASE_FILE)) {
      const data = fs.readFileSync(DATABASE_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading database file, using default data:", err);
  }
  return initialVisitors;
}

function writeDB(data: Visitor[]) {
  try {
    fs.writeFileSync(DATABASE_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing database file:", err);
  }
}

// Ensure database file is initialized
if (!fs.existsSync(DATABASE_FILE)) {
  writeDB(initialVisitors);
}

// Enterprise Modules database files paths
const EMPLOYEES_FILE = getFilePath("employees_db.json");
const DEPARTMENTS_FILE = getFilePath("departments_db.json");
const APPOINTMENTS_FILE = getFilePath("appointments_db.json");
const AUDIT_LOGS_FILE = getFilePath("audit_logs_db.json");
const SETTINGS_FILE = getFilePath("settings_db.json");

// Helper database readers/writers for enterprise modules
function readEmployees(): any[] {
  try {
    if (fs.existsSync(EMPLOYEES_FILE)) {
      return JSON.parse(fs.readFileSync(EMPLOYEES_FILE, "utf-8"));
    }
  } catch (err) {
    console.error("Error reading employees:", err);
  }
  const defaultEmployees = [
    { id: "E-101", name: "Dr. Helen Vance", department: "R&D Lab 4", email: "h.vance@cyberdyne.com", contact: "+1 (555) 123-4567", availability: true },
    { id: "E-102", name: "CEO Richard Kestrel", department: "Executive Boardroom", email: "kestrel@cyberdyne.com", contact: "+1 (555) 987-6543", availability: true },
    { id: "E-103", name: "Director Sarah Connor", department: "Infrastructure Sector G", email: "s.connor@cyberdyne.com", contact: "+1 (555) 444-2222", availability: true },
    { id: "E-104", name: "Security Chief Morpheus", department: "Cyberwarfare Chamber", email: "morpheus@cyberdyne.com", contact: "+1 (555) 777-8888", availability: true }
  ];
  fs.writeFileSync(EMPLOYEES_FILE, JSON.stringify(defaultEmployees, null, 2), "utf-8");
  return defaultEmployees;
}

function writeEmployees(data: any[]) {
  try {
    fs.writeFileSync(EMPLOYEES_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing employees:", err);
  }
}

function readDepartments(): any[] {
  try {
    if (fs.existsSync(DEPARTMENTS_FILE)) {
      return JSON.parse(fs.readFileSync(DEPARTMENTS_FILE, "utf-8"));
    }
  } catch (err) {
    console.error("Error reading departments:", err);
  }
  const defaultDepartments = [
    { id: "D-101", name: "R&D Lab 4", code: "RD-4" },
    { id: "D-102", name: "Executive Boardroom", code: "EXEC" },
    { id: "D-103", name: "Infrastructure Sector G", code: "INFRA-G" },
    { id: "D-104", name: "Cyberwarfare Chamber", code: "CYBER" }
  ];
  fs.writeFileSync(DEPARTMENTS_FILE, JSON.stringify(defaultDepartments, null, 2), "utf-8");
  return defaultDepartments;
}

function writeDepartments(data: any[]) {
  try {
    fs.writeFileSync(DEPARTMENTS_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing departments:", err);
  }
}

function readAppointments(): any[] {
  try {
    if (fs.existsSync(APPOINTMENTS_FILE)) {
      return JSON.parse(fs.readFileSync(APPOINTMENTS_FILE, "utf-8"));
    }
  } catch (err) {
    console.error("Error reading appointments:", err);
  }
  const defaultAppointments = [
    { id: "A-201", visitorId: "V-101", visitorName: "Aris Thorne", company: "Cyberdyne Systems", department: "R&D Lab 4", employeeId: "E-101", employeeName: "Dr. Helen Vance", dateTime: "2026-06-30T08:30", purpose: "Quantum Core Calibration", status: "checked-in" },
    { id: "A-202", visitorId: "V-102", visitorName: "Aria T'Loak", company: "Omega Cargo", department: "Executive Boardroom", employeeId: "E-102", employeeName: "CEO Richard Kestrel", dateTime: "2026-06-30T14:00", purpose: "Strategic Partnership Negotiation", status: "pending" },
    { id: "A-203", visitorId: "V-103", visitorName: "Marcus Wright", company: "Project Angel", department: "Infrastructure Sector G", employeeId: "E-103", employeeName: "Director Sarah Connor", dateTime: "2026-06-30T09:15", purpose: "System Integration Audit", status: "checked-out" },
    { id: "A-204", visitorId: "V-104", visitorName: "Seraph", company: "The Oracle Group", department: "Cyberwarfare Chamber", employeeId: "E-104", employeeName: "Security Chief Morpheus", dateTime: "2026-06-30T07:45", purpose: "Threat Vector Analysis", status: "checked-in" }
  ];
  fs.writeFileSync(APPOINTMENTS_FILE, JSON.stringify(defaultAppointments, null, 2), "utf-8");
  return defaultAppointments;
}

function writeAppointments(data: any[]) {
  try {
    fs.writeFileSync(APPOINTMENTS_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing appointments:", err);
  }
}

function readAuditLogs(): any[] {
  try {
    if (fs.existsSync(AUDIT_LOGS_FILE)) {
      return JSON.parse(fs.readFileSync(AUDIT_LOGS_FILE, "utf-8"));
    }
  } catch (err) {
    console.error("Error reading audit logs:", err);
  }
  const defaultAuditLogs = [
    { id: "L-501", timestamp: "2026-06-30 07:00:00", user: "system", role: "system", action: "Mainframe Boot", category: "system", details: "Aegis Secure Visitor Controller initialized and online." },
    { id: "L-502", timestamp: "2026-06-30 07:45:00", user: "receptionist", role: "receptionist", action: "Visitor Check-In", category: "visitor", details: "Checked in Seraph (ID: V-104) under top-secret protocol." },
    { id: "L-503", timestamp: "2026-06-30 08:30:00", user: "receptionist", role: "receptionist", action: "Visitor Check-In", category: "visitor", details: "Checked in Aris Thorne (ID: V-101)." }
  ];
  fs.writeFileSync(AUDIT_LOGS_FILE, JSON.stringify(defaultAuditLogs, null, 2), "utf-8");
  return defaultAuditLogs;
}

function writeAuditLogs(data: any[]) {
  try {
    fs.writeFileSync(AUDIT_LOGS_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing audit logs:", err);
  }
}

function readSettings(): any {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      return JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf-8"));
    }
  } catch (err) {
    console.error("Error reading settings:", err);
  }
  const defaultSettings = {
    companyName: "Aegis Corporation",
    securityLevel: "high",
    autoCheckOutHours: 8,
    themePreference: "hologram",
    lastBackup: "2026-06-30",
    users: [
      { id: "U-001", username: "admin", password: "password", name: "Administrator", role: "admin" },
      { id: "U-002", username: "receptionist", password: "password", name: "Sarah Connor", role: "receptionist" },
      { id: "U-003", username: "employee", password: "password", name: "Dr. Helen Vance", role: "employee", department: "R&D Lab 4", email: "h.vance@cyberdyne.com" }
    ]
  };
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2), "utf-8");
  return defaultSettings;
}

function writeSettings(data: any) {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing settings:", err);
  }
}

function logAudit(user: string, role: string, action: string, category: string, details: string) {
  try {
    const logs = readAuditLogs();
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    logs.unshift({
      id: `L-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp,
      user,
      role,
      action,
      category,
      details
    });
    writeAuditLogs(logs);
  } catch (e) {
    console.error("Failed to log audit action:", e);
  }
}

// In-Memory Temporary System-Wide Notifications array
interface SystemNotification {
  id: string;
  timestamp: string;
  message: string;
  type: "info" | "warning" | "success" | "alert";
  read: boolean;
}
let notifications: SystemNotification[] = [
  { id: "N-1", timestamp: "07:45:00", message: "Visitor Seraph (ID: V-104) has Checked In.", type: "success", read: false },
  { id: "N-2", timestamp: "08:30:00", message: "Visitor Aris Thorne (ID: V-101) has Checked In.", type: "success", read: false },
  { id: "N-3", timestamp: "09:15:00", message: "Appointment A-202 is Pending Approval by CEO Richard Kestrel.", type: "warning", read: false }
];

function addNotification(message: string, type: "info" | "warning" | "success" | "alert" = "info") {
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  notifications.unshift({
    id: `N-${Date.now()}`,
    timestamp,
    message,
    type,
    read: false
  });
}

// Force load to initialize database files on startup
readEmployees();
readDepartments();
readAppointments();
readAuditLogs();
readSettings();

// Lazy Gemini API Initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// Live Java Subprocess Terminal Session Manager
interface TerminalSession {
  proc: ChildProcessWithoutNullStreams | null;
  outputBuffer: string;
  exitCode: number | null;
  isActive: boolean;
}

let activeTerminal: TerminalSession = {
  proc: null,
  outputBuffer: "",
  exitCode: null,
  isActive: false
};

// REST API Endpoints

// 1. Get Java Status (Check if JDK tools are available)
app.get("/api/java-status", (req, res) => {
  exec("javac -version", (err, stdout, stderr) => {
    const hasJavac = !err;
    const javacVersion = stdout.trim() || stderr.trim() || "Unknown";
    
    exec("java -version", (err2, stdout2, stderr2) => {
      const hasJava = !err2;
      const javaVersion = stderr2.split("\n")[0] || stdout2.split("\n")[0] || "Unknown";
      
      res.json({
        hasJava,
        hasJavac,
        javaVersion,
        javacVersion,
        environment: "Cloud Run Sandbox Environment"
      });
    });
  });
});

// 2. Read the Java Visitor Management file contents
app.get("/api/java-code", (req, res) => {
  const javaPath = path.join(process.cwd(), "VisitorManagementSystem.java");
  try {
    if (fs.existsSync(javaPath)) {
      const content = fs.readFileSync(javaPath, "utf-8");
      return res.json({ content });
    } else {
      return res.status(404).json({ error: "Java source file not found." });
    }
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// 3. Write new content to the Java Visitor Management file
app.post("/api/java-code", (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ error: "Java content is required." });
  }
  const javaPath = path.join(process.cwd(), "VisitorManagementSystem.java");
  try {
    fs.writeFileSync(javaPath, content, "utf-8");
    res.json({ success: true, message: "VisitorManagementSystem.java successfully synced." });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// 4. Compile the Java file
app.post("/api/java-compile", (req, res) => {
  exec("javac VisitorManagementSystem.java", (err, stdout, stderr) => {
    if (err) {
      return res.json({
        success: false,
        error: stderr || stdout || err.message,
        message: "Compilation Failed."
      });
    }
    res.json({
      success: true,
      output: stdout || "Compilation completed with zero warnings.",
      message: "VisitorManagementSystem.java compiled successfully! Bytecode ready."
    });
  });
});

// 5. Start interactive Terminal for the Java application
app.post("/api/terminal/start", (req, res) => {
  // If a session is already active, kill it first
  if (activeTerminal.proc && activeTerminal.isActive) {
    try {
      activeTerminal.proc.kill("SIGKILL");
    } catch (e) {}
  }

  activeTerminal = {
    proc: null,
    outputBuffer: "=== Launching Aegis Security Subsystem Subprocess (java VisitorManagementSystem) ===\n",
    exitCode: null,
    isActive: true
  };

  try {
    const proc = spawn("java", ["VisitorManagementSystem"]);
    activeTerminal.proc = proc;

    proc.stdout.on("data", (data) => {
      activeTerminal.outputBuffer += data.toString();
    });

    proc.stderr.on("data", (data) => {
      activeTerminal.outputBuffer += `\n[STDERR] ${data.toString()}`;
    });

    proc.on("close", (code) => {
      activeTerminal.exitCode = code;
      activeTerminal.isActive = false;
      activeTerminal.outputBuffer += `\n=== Process Terminated with Exit Code ${code} ===\n`;
    });

    res.json({ success: true, message: "Java terminal started." });
  } catch (e: any) {
    activeTerminal.isActive = false;
    activeTerminal.outputBuffer += `\n[LAUNCH ERROR] Could not spawn java runtime: ${e.message}\n`;
    res.status(500).json({ error: e.message });
  }
});

// 6. Write interactive input to standard input of the running Java process
app.post("/api/terminal/input", (req, res) => {
  const { input } = req.body;
  if (input === undefined) {
    return res.status(400).json({ error: "Input command string required." });
  }

  if (!activeTerminal.proc || !activeTerminal.isActive) {
    return res.status(400).json({ error: "Java process is not active. Start the process first." });
  }

  try {
    activeTerminal.proc.stdin.write(input + "\n");
    // Also echo the input command into output buffer for console feel
    activeTerminal.outputBuffer += `\noperator@aegis-terminal$ ${input}\n`;
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// 7. Read standard output buffer
app.get("/api/terminal/output", (req, res) => {
  res.json({
    output: activeTerminal.outputBuffer,
    isActive: activeTerminal.isActive,
    exitCode: activeTerminal.exitCode
  });
});

// 8. Stop the terminal session
app.post("/api/terminal/stop", (req, res) => {
  if (activeTerminal.proc) {
    try {
      activeTerminal.proc.kill("SIGKILL");
      activeTerminal.isActive = false;
      activeTerminal.outputBuffer += "\n=== Process force killed by security operator ===\n";
      return res.json({ success: true, message: "Java process terminated." });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }
  res.json({ success: false, message: "No active process to stop." });
});

// 9. Fetch all visitors (synchronized with database file)
app.get("/api/visitors", (req, res) => {
  const data = readDB();
  res.json(data);
});

// 10. Perform AI screening on visitor details
async function screenVisitorWithAI(name: string, company: string, purpose: string, department: string) {
  const client = getGeminiClient();
  if (!client) {
    // Standard heuristics-based vetting matching the Java logic if Gemini is unconfigured
    let score = 12;
    const raw = `${name} ${company} ${purpose} ${department}`.toLowerCase();
    if (raw.includes("quantum") || raw.includes("core") || raw.includes("reactor")) score += 20;
    if (raw.includes("audit") || raw.includes("security") || raw.includes("drill")) score += 15;
    if (raw.includes("secret") || raw.includes("classified")) score += 30;
    if (raw.includes("weapons") || raw.includes("cyberwarfare")) score += 40;

    let clearanceLevel: "unclassified" | "restricted" | "secret" | "top-secret" = "unclassified";
    let badgeColor = "#22c55e"; // green
    if (score < 20) {
      clearanceLevel = "unclassified";
      badgeColor = "#22c55e";
    } else if (score < 45) {
      clearanceLevel = "restricted";
      badgeColor = "#a855f7";
    } else if (score < 70) {
      clearanceLevel = "secret";
      badgeColor = "#3b82f6";
    } else {
      clearanceLevel = "top-secret";
      badgeColor = "#ef4444";
    }

    const assessments = [
      "[Standard Checkpoint Clear] Vetting records clean. Vitals within normal parameters.",
      "[Attention Required] High-energy signature detected or critical department requested. Escort highly recommended.",
      "[CRITICAL WARNING] Clearance level requested for core access requires strict supervision."
    ];
    const assessment = score < 30 ? assessments[0] : (score < 65 ? assessments[1] : assessments[2]);

    const protocol = score > 60 || clearanceLevel === "top-secret"
      ? "ARMED GUARD ESCORT MANDATORY. Maintain active proximity trackers. Restrict access to designated grid node only."
      : score > 30 || clearanceLevel === "secret"
      ? "Classified supervisor escort required. Log all terminal interactions. Proximity alarms enabled."
      : "Standard self-guided access. Badge must be displayed on outer uniform at all times.";

    return {
      riskScore: score,
      riskAssessment: assessment,
      clearanceLevel,
      badgeColor,
      securityProtocol: protocol
    };
  }

  try {
    const prompt = `You are the Aegis security AI module in a futuristic corporate headquarters.
Conduct a realistic but science-fiction-flavored security screening for a visitor:
Visitor Name: ${name}
Company/Affiliation: ${company}
Purpose of Visit: ${purpose}
Target Sector/Department: ${department}

Provide a structured assessment of the potential security risk and assign clearance levels.
Output MUST be in strict JSON format matching the schema exactly:
{
  "riskScore": number (1 to 100),
  "riskAssessment": "string (brief scifi threat analysis)",
  "clearanceLevel": "unclassified" or "restricted" or "secret" or "top-secret",
  "securityProtocol": "string (recommended security protocol instructions)"
}`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskScore: { type: Type.INTEGER, description: "A calculated risk score between 1 and 100." },
            riskAssessment: { type: Type.STRING, description: "Detailed scifi threat analysis results." },
            clearanceLevel: { type: Type.STRING, description: "Clearance tier assigned." },
            securityProtocol: { type: Type.STRING, description: " countermeasure instructions." }
          },
          required: ["riskScore", "riskAssessment", "clearanceLevel", "securityProtocol"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    const clearance = ["unclassified", "restricted", "secret", "top-secret"].includes(data.clearanceLevel)
      ? data.clearanceLevel
      : "unclassified";

    const colors = {
      "unclassified": "#22c55e", // green
      "restricted": "#a855f7", // purple
      "secret": "#3b82f6", // blue
      "top-secret": "#ef4444" // red
    };

    return {
      riskScore: typeof data.riskScore === 'number' ? data.riskScore : 15,
      riskAssessment: data.riskAssessment || `Standard scan cleared for ${name}.`,
      clearanceLevel: clearance as any,
      badgeColor: colors[clearance as keyof typeof colors] || "#3b82f6",
      securityProtocol: data.securityProtocol || "Normal escort protocol applies."
    };
  } catch (error) {
    console.error("AI Screening Error:", error);
    return {
      riskScore: 22,
      riskAssessment: `Screening completed with localized fallback database due to node communication failure.`,
      clearanceLevel: "unclassified" as any,
      badgeColor: "#22c55e",
      securityProtocol: "Maintain baseline biometric monitoring."
    };
  }
}

// 11. Register a visitor (calls AI screening)
app.post("/api/visitors", async (req, res) => {
  try {
    const { id, name, contact, purpose, department, company, hostName, badgeColor } = req.body;

    if (!id || !name || !contact || !purpose || !department || !company || !hostName) {
      return res.status(400).json({ error: "All visitor registration parameters are required." });
    }

    const visitorsList = readDB();

    // Check for ID duplication
    if (visitorsList.some(v => v.id.toLowerCase() === id.toLowerCase())) {
      return res.status(400).json({ error: `A visitor with ID '${id}' is already registered.` });
    }

    // Run screening
    const screening = await screenVisitorWithAI(name, company, purpose, department);

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newVisitor: Visitor = {
      id,
      name,
      contact,
      purpose,
      department,
      company,
      hostName,
      checkInTime: null,
      checkOutTime: null,
      status: "registered",
      badgeColor: badgeColor || screening.badgeColor,
      riskScore: screening.riskScore,
      riskAssessment: screening.riskAssessment,
      clearanceLevel: screening.clearanceLevel as any,
      avatarSeed: name,
      securityProtocol: screening.securityProtocol,
      visitHistory: [
        `${timestamp} - Visitor Pre-Registered in Core Mainframe.`
      ]
    };

    visitorsList.push(newVisitor);
    writeDB(visitorsList);
    res.json(newVisitor);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// 12. Visitor Check-In
app.post("/api/visitors/:id/checkin", (req, res) => {
  const { id } = req.params;
  const { checkInTime } = req.body;

  const visitorsList = readDB();
  const visitor = visitorsList.find(v => v.id.toLowerCase() === id.toLowerCase());
  if (!visitor) {
    return res.status(404).json({ error: "Visitor not found" });
  }

  const time = checkInTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  visitor.checkInTime = time;
  visitor.checkOutTime = null;
  visitor.status = "checked-in";
  visitor.visitHistory.push(`${time} - Physically checked in at Gate threshold. Biometrics locked.`);

  writeDB(visitorsList);
  res.json(visitor);
});

// 13. Visitor Check-Out
app.post("/api/visitors/:id/checkout", (req, res) => {
  const { id } = req.params;
  const { checkOutTime } = req.body;

  const visitorsList = readDB();
  const visitor = visitorsList.find(v => v.id.toLowerCase() === id.toLowerCase());
  if (!visitor) {
    return res.status(404).json({ error: "Visitor not found" });
  }

  const time = checkOutTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  visitor.checkOutTime = time;
  visitor.status = "checked-out";
  visitor.visitHistory.push(`${time} - Safely checked out. Physical access credentials returned and neutralized.`);

  writeDB(visitorsList);
  res.json(visitor);
});

// 13.5. Visitor NDA Signature
app.post("/api/visitors/:id/sign-nda", (req, res) => {
  const { id } = req.params;
  const { signature } = req.body;

  const visitorsList = readDB();
  const visitor = visitorsList.find(v => v.id.toLowerCase() === id.toLowerCase());
  if (!visitor) {
    return res.status(404).json({ error: "Visitor not found" });
  }

  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  (visitor as any).ndaSigned = true;
  (visitor as any).ndaSignature = signature || "SECURE_ELECTRONIC_ACK";
  visitor.visitHistory.push(`${time} - Security pledge & NDA signed digitally. Biometric hash registered.`);

  writeDB(visitorsList);
  res.json(visitor);
});

// 14. Delete visitor record
app.delete("/api/visitors/:id", (req, res) => {
  const { id } = req.params;
  const visitorsList = readDB();
  const index = visitorsList.findIndex(v => v.id.toLowerCase() === id.toLowerCase());
  if (index === -1) {
    return res.status(404).json({ error: "Visitor not found" });
  }
  visitorsList.splice(index, 1);
  writeDB(visitorsList);
  res.json({ success: true, message: "Visitor record purged from database file." });
});

// 15. Security Manual Terminal Chat Endpoint
app.post("/api/visitors/screen-manual", async (req, res) => {
  const { query, visitorId } = req.body;
  if (!query) {
    return res.status(400).json({ error: "Security query required" });
  }

  const client = getGeminiClient();
  const visitorsList = readDB();
  const visitor = visitorsList.find(v => v.id === visitorId);

  const context = visitor 
    ? `Visitor Context:\n- ID: ${visitor.id}\n- Name: ${visitor.name}\n- Purpose: ${visitor.purpose}\n- Department: ${visitor.department}\n- Affiliation: ${visitor.company}\n- Risk Score: ${visitor.riskScore}\n- Current Status: ${visitor.status}\n- Current Security Assessment: ${visitor.riskAssessment}`
    : `No specific visitor context selected. Current active visitor count: ${visitorsList.length}.`;

  const fallbackResponses = [
    "Localized scan indicates baseline metrics are within normal parameters.",
    "Perimeter security reports all clear. No unauthorized access recorded.",
    "Access query logged. Biometric sync confirms credential validity."
  ];

  if (!client) {
    return res.json({
      response: `[Aegis Offline Terminal Interface]\n${fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]}\n\nTo enable full cognitive screening capabilities, verify your security API parameters in Settings.`
    });
  }

  try {
    const prompt = `You are "Aegis Security Mainframe", a highly advanced cognitive AI security controller.
Respond in a sharp, authoritative, futuristic scifi security terminal style (using markdown). Keep it brief, under 4 paragraphs.

Context:
${context}

User Query (Security Officer): ${query}`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ response: response.text || "Security mainframe silent." });
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    res.json({ response: `[Mainframe System Warning] Neural pipeline disrupted: ${error.message}` });
  }
});

// ============================================================================
//                   ENTERPRISE VISITOR PORTAL REST ENDPOINTS
// ============================================================================

// 16. Login & Role-Based Authentication
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  const setts = readSettings();
  const user = setts.users.find((u: any) => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
  if (!user) {
    logAudit(username || "anonymous", "unknown", "Login Failed", "auth", `Failed login attempt for username: ${username}`);
    return res.status(401).json({ error: "Invalid username or password" });
  }
  logAudit(user.username, user.role, "User Login", "auth", `Successfully logged in as ${user.name} (${user.role.toUpperCase()})`);
  res.json({ id: user.id, username: user.username, name: user.name, role: user.role, department: user.department, email: user.email });
});

app.post("/api/auth/change-password", (req, res) => {
  const { username, currentPassword, newPassword } = req.body;
  const setts = readSettings();
  const user = setts.users.find((u: any) => u.username.toLowerCase() === username.toLowerCase());
  if (!user || user.password !== currentPassword) {
    return res.status(400).json({ error: "Incorrect current password" });
  }
  user.password = newPassword;
  writeSettings(setts);
  logAudit(user.username, user.role, "Password Change", "auth", `Successfully changed password for ${user.username}`);
  res.json({ success: true, message: "Password updated successfully" });
});

// 17. Employee Management
app.get("/api/employees", (req, res) => {
  res.json(readEmployees());
});

app.post("/api/employees", (req, res) => {
  const { name, department, email, contact, availability, operator } = req.body;
  if (!name || !department || !email || !contact) {
    return res.status(400).json({ error: "Missing required employee details." });
  }
  const list = readEmployees();
  const newEmp = {
    id: `E-${100 + list.length + 1}`,
    name,
    department,
    email,
    contact,
    availability: availability !== undefined ? availability : true
  };
  list.push(newEmp);
  writeEmployees(list);
  logAudit(operator || "admin", "admin", "Create Employee", "employee", `Added new employee ${name} (${newEmp.id}) in ${department}`);
  res.json(newEmp);
});

app.put("/api/employees/:id", (req, res) => {
  const { id } = req.params;
  const { name, department, email, contact, availability, operator } = req.body;
  const list = readEmployees();
  const emp = list.find((e: any) => e.id === id);
  if (!emp) return res.status(404).json({ error: "Employee not found." });

  if (name) emp.name = name;
  if (department) emp.department = department;
  if (email) emp.email = email;
  if (contact) emp.contact = contact;
  if (availability !== undefined) emp.availability = availability;

  writeEmployees(list);
  logAudit(operator || "admin", "admin", "Update Employee", "employee", `Updated details for employee ${emp.name} (${id})`);
  res.json(emp);
});

app.delete("/api/employees/:id", (req, res) => {
  const { id } = req.params;
  const { operator } = req.query;
  const list = readEmployees();
  const index = list.findIndex((e: any) => e.id === id);
  if (index === -1) return res.status(404).json({ error: "Employee not found." });
  const name = list[index].name;
  list.splice(index, 1);
  writeEmployees(list);
  logAudit((operator as string) || "admin", "admin", "Delete Employee", "employee", `Deleted employee ${name} (${id})`);
  res.json({ success: true });
});

// 18. Department Management
app.get("/api/departments", (req, res) => {
  res.json(readDepartments());
});

app.post("/api/departments", (req, res) => {
  const { name, code, operator } = req.body;
  if (!name || !code) return res.status(400).json({ error: "Name and code are required." });
  const list = readDepartments();
  const newDept = { id: `D-${100 + list.length + 1}`, name, code };
  list.push(newDept);
  writeDepartments(list);
  logAudit(operator || "admin", "admin", "Create Department", "department", `Added new department ${name} (${code})`);
  res.json(newDept);
});

app.put("/api/departments/:id", (req, res) => {
  const { id } = req.params;
  const { name, code, operator } = req.body;
  const list = readDepartments();
  const dept = list.find((d: any) => d.id === id);
  if (!dept) return res.status(404).json({ error: "Department not found." });
  if (name) dept.name = name;
  if (code) dept.code = code;
  writeDepartments(list);
  logAudit(operator || "admin", "admin", "Update Department", "department", `Updated department ${dept.name} (${id})`);
  res.json(dept);
});

app.delete("/api/departments/:id", (req, res) => {
  const { id } = req.params;
  const { operator } = req.query;
  const list = readDepartments();
  const index = list.findIndex((d: any) => d.id === id);
  if (index === -1) return res.status(404).json({ error: "Department not found." });
  const name = list[index].name;
  list.splice(index, 1);
  writeDepartments(list);
  logAudit((operator as string) || "admin", "admin", "Delete Department", "department", `Deleted department ${name} (${id})`);
  res.json({ success: true });
});

// 19. Appointment Management & Booking
app.get("/api/appointments", (req, res) => {
  res.json(readAppointments());
});

app.post("/api/appointments", async (req, res) => {
  const { visitorId, visitorName, company, department, employeeId, employeeName, dateTime, purpose, operator } = req.body;
  if (!visitorName || !department || !employeeId || !dateTime) {
    return res.status(400).json({ error: "Missing required appointment fields." });
  }
  const list = readAppointments();
  const resolvedVisitorId = visitorId || `V-${100 + list.length + 5}`;
  const newAppt = {
    id: `A-${200 + list.length + 1}`,
    visitorId: resolvedVisitorId,
    visitorName,
    company: company || "Freelancer",
    department,
    employeeId,
    employeeName: employeeName || "Officer Assigned",
    dateTime,
    purpose: purpose || "General Consultation",
    status: "pending"
  };
  list.push(newAppt);
  writeAppointments(list);

  logAudit(operator || "receptionist", "receptionist", "Book Appointment", "appointment", `Booked appointment ${newAppt.id} for visitor ${visitorName} with ${newAppt.employeeName}`);
  addNotification(`New appointment ${newAppt.id} scheduled for ${visitorName} with ${newAppt.employeeName}.`, "info");

  res.json(newAppt);
});

app.put("/api/appointments/:id/status", (req, res) => {
  const { id } = req.params;
  const { status, operator, role } = req.body;
  if (!status) return res.status(400).json({ error: "Status is required." });

  const list = readAppointments();
  const appt = list.find((a: any) => a.id === id);
  if (!appt) return res.status(404).json({ error: "Appointment not found." });

  const oldStatus = appt.status;
  appt.status = status;
  writeAppointments(list);

  logAudit(operator || "system", role || "system", "Update Appointment Status", "appointment", `Updated appointment ${id} status from ${oldStatus.toUpperCase()} to ${status.toUpperCase()}`);

  if (status === "approved") {
    addNotification(`Appointment ${id} for ${appt.visitorName} was APPROVED by ${appt.employeeName}.`, "success");
  } else if (status === "rejected") {
    addNotification(`Appointment ${id} for ${appt.visitorName} was REJECTED by ${appt.employeeName}.`, "warning");
  } else if (status === "cancelled") {
    addNotification(`Appointment ${id} for ${appt.visitorName} has been CANCELLED.`, "info");
  }

  // Automatic synchronized actions with visitor_db
  const visitorsList = readDB();
  const visitor = visitorsList.find((v: any) => v.id.toLowerCase() === appt.visitorId.toLowerCase());
  if (visitor) {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    if (status === "checked-in") {
      visitor.status = "checked-in";
      visitor.checkInTime = timestamp;
      visitor.visitHistory.push(`${timestamp} - Auto Check-In synchronized via Appointment Approval portal.`);
      addNotification(`Visitor ${appt.visitorName} (ID: ${appt.visitorId}) Checked In successfully.`, "success");
      writeDB(visitorsList);
    } else if (status === "checked-out") {
      visitor.status = "checked-out";
      visitor.checkOutTime = timestamp;
      visitor.visitHistory.push(`${timestamp} - Auto Check-Out synchronized via Appointment Completion.`);
      addNotification(`Visitor ${appt.visitorName} (ID: ${appt.visitorId}) Checked Out successfully.`, "info");
      writeDB(visitorsList);
    }
  }

  res.json(appt);
});

// 20. Audit Logs Query
app.get("/api/audit-logs", (req, res) => {
  res.json(readAuditLogs());
});

// 21. System Settings & Backup Operations
app.get("/api/settings", (req, res) => {
  const data = readSettings();
  const cleanSettings = {
    companyName: data.companyName,
    securityLevel: data.securityLevel,
    autoCheckOutHours: data.autoCheckOutHours,
    themePreference: data.themePreference,
    lastBackup: data.lastBackup,
    users: data.users.map((u: any) => ({ id: u.id, username: u.username, name: u.name, role: u.role, department: u.department, email: u.email }))
  };
  res.json(cleanSettings);
});

app.post("/api/settings", (req, res) => {
  const { companyName, securityLevel, autoCheckOutHours, themePreference, operator } = req.body;
  const setts = readSettings();
  if (companyName) setts.companyName = companyName;
  if (securityLevel) setts.securityLevel = securityLevel;
  if (autoCheckOutHours) setts.autoCheckOutHours = Number(autoCheckOutHours);
  if (themePreference) setts.themePreference = themePreference;
  writeSettings(setts);
  logAudit(operator || "admin", "admin", "Update Settings", "system", `System company settings and security level adjusted.`);
  res.json({ success: true });
});

app.post("/api/settings/backup", (req, res) => {
  const { operator } = req.body;
  try {
    const backupTimestamp = new Date().toISOString().replace('T', '_').substring(0, 19).replace(/:/g, '-');
    const backupDir = path.join(process.cwd(), "backups");
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }
    fs.copyFileSync(DATABASE_FILE, path.join(backupDir, `visitor_db_backup_${backupTimestamp}.json`));
    
    const setts = readSettings();
    setts.lastBackup = new Date().toISOString().substring(0, 10);
    writeSettings(setts);

    logAudit(operator || "admin", "admin", "Database Backup", "database", `Created manual database backup file: visitor_db_backup_${backupTimestamp}.json`);
    res.json({ success: true, timestamp: setts.lastBackup, message: `System-wide database backup compiled safely: visitor_db_backup_${backupTimestamp}.json` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/settings/restore", (req, res) => {
  const { operator } = req.body;
  try {
    const backupDir = path.join(process.cwd(), "backups");
    if (fs.existsSync(backupDir)) {
      const files = fs.readdirSync(backupDir).filter(f => f.startsWith("visitor_db_backup_") && f.endsWith(".json"));
      if (files.length > 0) {
        files.sort();
        const latest = files[files.length - 1];
        fs.copyFileSync(path.join(backupDir, latest), DATABASE_FILE);
        logAudit(operator || "admin", "admin", "Database Restore", "database", `Restored database file from backup archive: ${latest}`);
        return res.json({ success: true, message: `System database restored successfully from: ${latest}` });
      }
    }
    writeDB(initialVisitors);
    logAudit(operator || "admin", "admin", "Database Restore", "database", "Database rolled back to default baseline seed.");
    res.json({ success: true, message: "No custom backup files found. System database reverted to default baseline seed." });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 22. In-Memory Notifications Query
app.get("/api/notifications", (req, res) => {
  res.json(notifications);
});

app.post("/api/notifications/:id/read", (req, res) => {
  const { id } = req.params;
  const notif = notifications.find(n => n.id === id);
  if (notif) notif.read = true;
  res.json({ success: true });
});

app.post("/api/notifications/clear", (req, res) => {
  notifications = [];
  res.json({ success: true });
});

// Vite Middleware Setup
async function startServer() {
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Aegis Core] Visitor Management Server running on port ${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
