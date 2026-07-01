import java.io.*;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

/**
 * ============================================================================
 *           AEGIS FUTURISTIC VISITOR MANAGEMENT SYSTEM (JAVA EDITION)
 * ============================================================================
 * An advanced, highly-secure, and futuristic enterprise visitor control deck.
 * This Java program includes:
 *  - Dual state synchronization: reads and writes to 'visitor_db.json'
 *  - Threat & Risk Assessment Algorithm (Cognitive Vetting Engine)
 *  - Custom ASCI Art Badge Generator with clearance coloring
 *  - Secure Clearance Tiers (Unclassified, Restricted, Secret, Top-Secret)
 *  - Live Department Capacity and Alert Monitor
 *  - Comprehensive Command Line Control Console
 * ============================================================================
 */
public class VisitorManagementSystem {

    private static final String DATABASE_FILE = "visitor_db.json";
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm:ss");
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    // Visitor Entity Definition
    static class Visitor {
        String id;
        String name;
        String company;
        String contact;
        String purpose;
        String department;
        String hostName;
        String checkInTime;
        String checkOutTime;
        String status; // "registered", "checked-in", "checked-out"
        String badgeColor;
        int riskScore;
        String riskAssessment;
        String clearanceLevel; // "unclassified", "restricted", "secret", "top-secret"
        String avatarSeed;
        String securityProtocol;
        List<String> visitHistory = new ArrayList<>();

        public Visitor(String id, String name, String company, String contact, String purpose, String department, String hostName) {
            this.id = id;
            this.name = name;
            this.company = company;
            this.contact = contact;
            this.purpose = purpose;
            this.department = department;
            this.hostName = hostName;
            this.checkInTime = "null";
            this.checkOutTime = "null";
            this.status = "registered";
            this.badgeColor = "#3b82f6"; // Default Blue
            this.clearanceLevel = "unclassified";
            this.riskScore = calculateInitialRiskScore(name, company, purpose, department);
            this.riskAssessment = generateRiskAssessment(name, company, purpose, riskScore);
            this.securityProtocol = generateSecurityProtocol(clearanceLevel, riskScore);
            this.avatarSeed = name;
            this.visitHistory.add(getTimestamp() + " - Visitor Pre-Registered in Core Mainframe.");
        }

        public Visitor() {}

        private int calculateInitialRiskScore(String name, String company, String purpose, String department) {
            int score = 10; // Baseline
            String raw = (name + " " + company + " " + purpose + " " + department).toLowerCase();
            
            // Heuristics for a sci-fi cybernetic environment
            if (raw.contains("quantum") || raw.contains("core") || raw.contains("reactor")) score += 20;
            if (raw.contains("audit") || raw.contains("security") || raw.contains("drill")) score += 15;
            if (raw.contains("secret") || raw.contains("classified")) score += 30;
            if (raw.contains("weapons") || raw.contains("cyberwarfare")) score += 40;
            if (raw.contains("diplomat") || raw.contains("corporate")) score += 10;
            if (raw.contains("hack") || raw.contains("exploit") || raw.contains("test")) score += 25;
            
            // Ensure bounds
            return Math.min(100, Math.max(1, score));
        }

        private String generateRiskAssessment(String name, String company, String purpose, int score) {
            if (score < 15) {
                return "[BioScan Acknowledged] Cleared visitor. Normal physical signatures. Clean database match.";
            } else if (score < 35) {
                return "[Standard Checkpoint Clear] " + name + " representing " + company + " presents standard risk. No alerts detected.";
            } else if (score < 65) {
                return "[Attention Required] High-energy signature detected or critical infrastructure requested. Escort highly recommended.";
            } else {
                return "[CRITICAL WARNING] " + name + " requests clearance for tactical/highly confidential activities. Flagged for strict biometric observation.";
            }
        }

        private String generateSecurityProtocol(String clearance, int score) {
            if (score > 60 || clearance.equals("top-secret")) {
                return "ARMED GUARD ESCORT MANDATORY. Maintain active proximity trackers. Restrict access to designated grid node only.";
            } else if (score > 30 || clearance.equals("secret")) {
                return "Classified supervisor escort required. Log all terminal interactions. Proximity alarms enabled.";
            } else if (clearance.equals("restricted")) {
                return "Companion access. General facility access allowed under continuous CCTV telemetry.";
            } else {
                return "Standard self-guided access. Badge must be displayed on outer uniform at all times.";
            }
        }

        public String getTimestamp() {
            return LocalDateTime.now().format(TIME_FORMATTER);
        }

        @Override
        public String toString() {
            return String.format("[%s] ID: %s | %s (%s) -> Host: %s | Status: %s | Risk Index: %d%%",
                    clearanceLevel.toUpperCase(), id, name, company, hostName, status.toUpperCase(), riskScore);
        }
    }

    private final List<Visitor> visitors = new ArrayList<>();
    private final List<String> systemLogs = new ArrayList<>();
    private boolean alarmActive = false;

    public VisitorManagementSystem() {
        logSystem("Aegis Core Booting Sequence Initialized...");
        loadFromDatabase();
        if (visitors.isEmpty()) {
            seedDefaultData();
        }
    }

    private void logSystem(String message) {
        String entry = "[" + LocalDateTime.now().format(TIME_FORMATTER) + "] " + message;
        systemLogs.add(entry);
        System.out.println("   >>> " + entry);
    }

    private void seedDefaultData() {
        logSystem("Seeding baseline visitor registry...");
        
        Visitor v1 = new Visitor("V-101", "Aris Thorne", "Cyberdyne Systems", "+1 (555) 901-2045", "Quantum Core Calibration", "R&D Lab 4", "Dr. Helen Vance");
        v1.status = "checked-in";
        v1.clearanceLevel = "secret";
        v1.badgeColor = "#3b82f6";
        v1.checkInTime = "08:30:00";
        v1.visitHistory.add("08:15:00 - Perimeter bio-vitals synchronized.");
        v1.visitHistory.add("08:30:00 - Checked in by Dr. Vance. Cyber-shield badge activated.");
        visitors.add(v1);

        Visitor v2 = new Visitor("V-102", "Aria T'Loak", "Omega Cargo", "+1 (415) 309-8821", "Strategic Partnership Negotiation", "Executive Boardroom", "CEO Richard Kestrel");
        v2.status = "registered";
        v2.clearanceLevel = "restricted";
        v2.badgeColor = "#a855f7";
        visitors.add(v2);

        Visitor v3 = new Visitor("V-103", "Marcus Wright", "Project Angel", "+1 (212) 441-0092", "System Integration Audit", "Infrastructure Sector G", "Director Sarah Connor");
        v3.status = "checked-out";
        v3.clearanceLevel = "unclassified";
        v3.badgeColor = "#22c55e";
        v3.checkInTime = "09:15:00";
        v3.checkOutTime = "12:45:00";
        v3.visitHistory.add("09:15:00 - Access card registered and issued.");
        v3.visitHistory.add("12:45:00 - Logged tasks; physical badge recovered; checked out.");
        visitors.add(v3);

        Visitor v4 = new Visitor("V-104", "Seraph", "The Oracle Group", "+1 (650) 812-7493", "Threat Vector Analysis", "Cyberwarfare Chamber", "Security Chief Morpheus");
        v4.status = "checked-in";
        v4.clearanceLevel = "top-secret";
        v4.badgeColor = "#ef4444";
        v4.checkInTime = "07:45:00";
        v4.visitHistory.add("07:30:00 - Heavy cryptographic gear flagged at metal detector; manually overridden.");
        v4.visitHistory.add("07:45:00 - Checked in under Top-Secret protocols.");
        visitors.add(v4);

        saveToDatabase();
    }

    // Interactive Console UI
    public void runConsole() {
        Scanner scanner = new Scanner(System.in, StandardCharsets.UTF_8.name());
        boolean running = true;

        System.out.println("\n==========================================================================");
        System.out.println("          WELCOME TO AEGIS SECURE VISITOR CONTROLLER (JAVA BACKEND)      ");
        System.out.println("==========================================================================");
        System.out.println("Core Mainframe Online. Real-time file sync enabled with Node.js web deck.");

        while (running) {
            printMainMenu();
            System.out.print("Enter security clearance code/option: ");
            String option = scanner.nextLine().trim();

            switch (option) {
                case "1":
                    registerNewVisitorInteractive(scanner);
                    break;
                case "2":
                    checkInVisitorInteractive(scanner);
                    break;
                case "3":
                    checkOutVisitorInteractive(scanner);
                    break;
                case "4":
                    showAllVisitors();
                    break;
                case "5":
                    searchVisitorInteractive(scanner);
                    break;
                case "6":
                    generateBadgeInteractive(scanner);
                    break;
                case "7":
                    showDiagnostics();
                    break;
                case "8":
                    toggleAlarmState();
                    break;
                case "9":
                    System.out.println("\n[Aegis Core] Syncing system databases and shutting down Java console portal...");
                    saveToDatabase();
                    running = false;
                    break;
                default:
                    System.out.println("\n[!] INVALID COMMAND. System registers unrecognized console telemetry.");
            }
        }
    }

    private void printMainMenu() {
        System.out.println("\n--------------------------------------------------------------------------");
        System.out.println("   [AEGIS MAINFRAME OPERATIONAL DECK] | Alarm Status: " + (alarmActive ? "🚨 CRITICAL ALARM ACTIVE" : "🟢 SECURE"));
        System.out.println("--------------------------------------------------------------------------");
        System.out.println("   [1] Pre-Register New Visitor (AI Risk-Engine Assisted)");
        System.out.println("   [2] Process Gate Check-In (Activate Biometric ID)");
        System.out.println("   [3] Log Secure Check-Out (Reclaim Credentials)");
        System.out.println("   [4] Display Full Visitor Database Matrix");
        System.out.println("   [5] Query Visitor Record by Access ID / Name");
        System.out.println("   [6] Generate Holographic Access Badge (ASCII)");
        System.out.println("   [7] Inspect Mainframe Health & System Logs");
        System.out.println("   [8] Trigger / Reset Sector-Wide Security Alarm");
        System.out.println("   [9] Save & Exit Console");
        System.out.println("--------------------------------------------------------------------------");
    }

    private void registerNewVisitorInteractive(Scanner s) {
        System.out.println("\n>>> Pre-Registering New Visitor Profile <<<");
        System.out.print("Enter Unique Access ID (e.g. V-105): ");
        String id = s.nextLine().trim().toUpperCase();

        if (findVisitor(id) != null) {
            System.out.println("[!] DUPLICATION DETECTED: ID '" + id + "' already claims an active matrix link.");
            return;
        }

        System.out.print("Enter Full Name: ");
        String name = s.nextLine().trim();
        System.out.print("Enter Affiliated Enterprise/Company: ");
        String company = s.nextLine().trim();
        System.out.print("Enter Security Comms Link (Contact): ");
        String contact = s.nextLine().trim();
        System.out.print("Enter Access Purpose: ");
        String purpose = s.nextLine().trim();
        System.out.print("Enter Sector/Department Node: ");
        String dept = s.nextLine().trim();
        System.out.print("Enter Authorizing Host Name: ");
        String host = s.nextLine().trim();

        if (name.isEmpty() || company.isEmpty() || purpose.isEmpty() || dept.isEmpty() || host.isEmpty()) {
            System.out.println("[!] REGISTER ERROR: Mandatory telemetry parameters were left void.");
            return;
        }

        Visitor visitor = new Visitor(id, name, company, contact, purpose, dept, host);
        
        // Dynamically assign clearance tier based on risk assessment score
        if (visitor.riskScore < 20) {
            visitor.clearanceLevel = "unclassified";
            visitor.badgeColor = "#22c55e"; // green
        } else if (visitor.riskScore < 45) {
            visitor.clearanceLevel = "restricted";
            visitor.badgeColor = "#a855f7"; // purple
        } else if (visitor.riskScore < 70) {
            visitor.clearanceLevel = "secret";
            visitor.badgeColor = "#3b82f6"; // blue
        } else {
            visitor.clearanceLevel = "top-secret";
            visitor.badgeColor = "#ef4444"; // red
        }

        // Re-generate security protocol instructions
        visitor.securityProtocol = visitor.generateSecurityProtocol(visitor.clearanceLevel, visitor.riskScore);

        visitors.add(visitor);
        logSystem("New visitor registered successfully: " + name + " (ID: " + id + ")");
        System.out.println("\n[Aegis AI Engine Assessment]");
        System.out.println(" -> Assigned Clearance: " + visitor.clearanceLevel.toUpperCase());
        System.out.println(" -> Risk Index Rating: " + visitor.riskScore + "%");
        System.out.println(" -> Screening Details: " + visitor.riskAssessment);
        System.out.println(" -> Dynamic Protocol:  " + visitor.securityProtocol);

        saveToDatabase();
    }

    private void checkInVisitorInteractive(Scanner s) {
        System.out.println("\n>>> Process Secure Gate Check-In <<<");
        System.out.print("Enter Visitor Access ID: ");
        String id = s.nextLine().trim().toUpperCase();

        Visitor v = findVisitor(id);
        if (v == null) {
            System.out.println("[!] SECURITY SEARCH FAILURE: Access ID not discovered in registries.");
            return;
        }

        if (v.status.equals("checked-in")) {
            System.out.println("[!] TRANSMISSION CONFLICT: Visitor is already checked-in inside the perimeter.");
            return;
        }

        System.out.print("Enter Check-In Time (Press Enter to log current time): ");
        String timeStr = s.nextLine().trim();
        if (timeStr.isEmpty()) {
            timeStr = LocalDateTime.now().format(TIME_FORMATTER);
        }

        v.checkInTime = timeStr;
        v.status = "checked-in";
        v.checkOutTime = "null";
        v.visitHistory.add(timeStr + " - Physically checked in at Gate threshold. Biometrics locked.");
        
        logSystem("Visitor " + v.name + " (" + id + ") checked in safely at " + timeStr);
        saveToDatabase();
    }

    private void checkOutVisitorInteractive(Scanner s) {
        System.out.println("\n>>> Process Secure Sector Check-Out <<<");
        System.out.print("Enter Visitor Access ID: ");
        String id = s.nextLine().trim().toUpperCase();

        Visitor v = findVisitor(id);
        if (v == null) {
            System.out.println("[!] SECURITY SEARCH FAILURE: Access ID not discovered.");
            return;
        }

        if (!v.status.equals("checked-in")) {
            System.out.println("[!] TRANSACTION REJECTED: Visitor is not currently inside facility boundaries.");
            return;
        }

        System.out.print("Enter Check-Out Time (Press Enter for current time): ");
        String timeStr = s.nextLine().trim();
        if (timeStr.isEmpty()) {
            timeStr = LocalDateTime.now().format(TIME_FORMATTER);
        }

        v.checkOutTime = timeStr;
        v.status = "checked-out";
        v.visitHistory.add(timeStr + " - Safely checked out. Physical access credentials returned and neutralized.");

        logSystem("Visitor " + v.name + " (" + id + ") checked out safely at " + timeStr);
        saveToDatabase();
    }

    private void showAllVisitors() {
        System.out.println("\n==========================================================================");
        System.out.println("              CURRENT ACTIVE ARCHIVES AND SECURITY REGISTRY              ");
        System.out.println("==========================================================================");
        if (visitors.isEmpty()) {
            System.out.println("Database is currently sterile. No entries registered.");
            return;
        }

        int registered = 0, checkedIn = 0, checkedOut = 0;
        for (Visitor v : visitors) {
            System.out.println(v);
            if (v.status.equals("registered")) registered++;
            else if (v.status.equals("checked-in")) checkedIn++;
            else checkedOut++;
        }

        System.out.println("--------------------------------------------------------------------------");
        System.out.printf("Total Records: %d | Registered: %d | Inside Perimeter: %d | Checked-Out: %d\n",
                visitors.size(), registered, checkedIn, checkedOut);
        System.out.println("==========================================================================");
    }

    private void searchVisitorInteractive(Scanner s) {
        System.out.print("\nEnter keyword to lookup (ID, Name, or Corporate affiliation): ");
        String query = s.nextLine().trim().toLowerCase();

        if (query.isEmpty()) {
            System.out.println("[!] Lookup criteria empty.");
            return;
        }

        System.out.println("\nMatching Diagnostic Results:");
        int count = 0;
        for (Visitor v : visitors) {
            if (v.id.toLowerCase().contains(query) || v.name.toLowerCase().contains(query) || v.company.toLowerCase().contains(query)) {
                System.out.println(" >> " + v);
                System.out.println("    Department Link: " + v.department + " | Security Officer Auth: " + v.hostName);
                System.out.println("    Risk Assessment: " + v.riskAssessment);
                System.out.println("    Protocol Instructions: " + v.securityProtocol);
                System.out.println("    Visit Log:");
                for (String log : v.visitHistory) {
                    System.out.println("      * " + log);
                }
                System.out.println();
                count++;
            }
        }

        if (count == 0) {
            System.out.println(" No profiles matched your search parameters inside the current security cell.");
        }
    }

    private void generateBadgeInteractive(Scanner s) {
        System.out.print("\nEnter ID of visitor to generate hologram badge: ");
        String id = s.nextLine().trim().toUpperCase();

        Visitor v = findVisitor(id);
        if (v == null) {
            System.out.println("[!] Profile not located.");
            return;
        }

        printHolographicBadge(v);
    }

    private void printHolographicBadge(Visitor v) {
        System.out.println("\n+-------------------------------------------------------------+");
        System.out.println("|             AEGIS INDUSTRIAL SECURITY CONTROLLER            |");
        System.out.println("|  . . . . . . . Holographic Identity Matrix . . . . . . . .  |");
        System.out.println("+-------------------------------------------------------------+");
        System.out.printf("| ID CODES   : %-46s |\n", v.id);
        System.out.printf("| FULL NAME  : %-46s |\n", v.name.toUpperCase());
        System.out.printf("| ENTERPRISE : %-46s |\n", v.company);
        System.out.printf("| HOST AUTH  : %-46s |\n", v.hostName);
        System.out.printf("| TARGET ZONE: %-46s |\n", v.department);
        System.out.println("|-------------------------------------------------------------|");
        System.out.printf("| STATUS     : %-21s | CLEARANCE: %-12s |\n", v.status.toUpperCase(), v.clearanceLevel.toUpperCase());
        System.out.printf("| RISK COEFFICIENT: %-14d%% | BEACON TIMECODE: %-9s |\n", v.riskScore, (v.checkInTime.equals("null") ? "N/A" : v.checkInTime));
        System.out.println("+-------------------------------------------------------------+");
        System.out.println("| SECURITY ESCORT PROTOCOL INSTRUCTIONS:                      |");
        String pLine = v.securityProtocol;
        if (pLine.length() > 56) {
            System.out.printf("|  - %-56s |\n", pLine.substring(0, 56));
            System.out.printf("|    %-56s |\n", pLine.substring(56));
        } else {
            System.out.printf("|  - %-56s |\n", pLine);
        }
        System.out.println("+-------------------------------------------------------------+");
        System.out.println("  [System Notification] Hologram active. Security badge synced.");
    }

    private void showDiagnostics() {
        System.out.println("\n==========================================================================");
        System.out.println("            AEGIS CORE MONITOR & INTERNAL SYSTEM TELEMETRY                ");
        System.out.println("==========================================================================");
        System.out.println("   Mainframe Integrity   : 100% Operational");
        System.out.println("   Vetting Engine Version: Aegis AI v4.9 (Cognitive Integration)");
        System.out.println("   Active Visitors Onsite: " + getCheckedInCount());
        System.out.println("   Alarm Active Flag     : " + (alarmActive ? "TRUE (WARNING LEVEL 5)" : "FALSE (STANDARD OPERATION)"));
        System.out.println("   Database File Path    : " + DATABASE_FILE);
        System.out.println("\n--- Historical Mainframe Logs (Latest 15) ---");
        int startIndex = Math.max(0, systemLogs.size() - 15);
        for (int i = startIndex; i < systemLogs.size(); i++) {
            System.out.println("  " + systemLogs.get(i));
        }
        System.out.println("==========================================================================");
    }

    private int getCheckedInCount() {
        int count = 0;
        for (Visitor v : visitors) {
            if (v.status.equals("checked-in")) count++;
        }
        return count;
    }

    private void toggleAlarmState() {
        alarmActive = !alarmActive;
        if (alarmActive) {
            logSystem("!!! SECTOR LOCKDOWN INITIATED. INTRUDER OR THREAT FLAGGED SYSTEM-WIDE !!!");
            System.out.println("\n\n   🚨 🚨 🚨   [WARNING] SIRENS ENGAGED. ELEVATED RISK STATE TRIGGERED.   🚨 🚨 🚨\n");
        } else {
            logSystem("Sector Lockdown neutralized. All clearance nodes returned to secure baseline.");
            System.out.println("\n   🟢 Sector alarm cleared. Personnel allowed to resume standard activity.");
        }
        saveToDatabase();
    }

    private Visitor findVisitor(String id) {
        for (Visitor v : visitors) {
            if (v.id.equalsIgnoreCase(id)) {
                return v;
            }
        }
        return null;
    }

    // ============================================================================
    //       JSON FILE DATABASE READING & WRITING SYSTEM (PURE JAVA INTEGRATION)
    // ============================================================================
    
    private synchronized void saveToDatabase() {
        File file = new File(DATABASE_FILE);
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(file, StandardCharsets.UTF_8))) {
            StringBuilder json = new StringBuilder();
            json.append("[\n");
            for (int i = 0; i < visitors.size(); i++) {
                Visitor v = visitors.get(i);
                json.append("  {\n");
                json.append(String.format("    \"id\": \"%s\",\n", escapeJson(v.id)));
                json.append(String.format("    \"name\": \"%s\",\n", escapeJson(v.name)));
                json.append(String.format("    \"company\": \"%s\",\n", escapeJson(v.company)));
                json.append(String.format("    \"contact\": \"%s\",\n", escapeJson(v.contact)));
                json.append(String.format("    \"purpose\": \"%s\",\n", escapeJson(v.purpose)));
                json.append(String.format("    \"department\": \"%s\",\n", escapeJson(v.department)));
                json.append(String.format("    \"hostName\": \"%s\",\n", escapeJson(v.hostName)));
                json.append(String.format("    \"checkInTime\": %s,\n", v.checkInTime == null || v.checkInTime.equals("null") ? "null" : "\"" + escapeJson(v.checkInTime) + "\""));
                json.append(String.format("    \"checkOutTime\": %s,\n", v.checkOutTime == null || v.checkOutTime.equals("null") ? "null" : "\"" + escapeJson(v.checkOutTime) + "\""));
                json.append(String.format("    \"status\": \"%s\",\n", escapeJson(v.status)));
                json.append(String.format("    \"badgeColor\": \"%s\",\n", escapeJson(v.badgeColor)));
                json.append(String.format("    \"riskScore\": %d,\n", v.riskScore));
                json.append(String.format("    \"riskAssessment\": \"%s\",\n", escapeJson(v.riskAssessment)));
                json.append(String.format("    \"clearanceLevel\": \"%s\",\n", escapeJson(v.clearanceLevel)));
                json.append(String.format("    \"avatarSeed\": \"%s\",\n", escapeJson(v.avatarSeed)));
                json.append(String.format("    \"securityProtocol\": \"%s\",\n", escapeJson(v.securityProtocol)));
                
                // History Array Serialization
                json.append("    \"visitHistory\": [\n");
                for (int j = 0; j < v.visitHistory.size(); j++) {
                    json.append(String.format("      \"%s\"%s\n", escapeJson(v.visitHistory.get(j)), (j < v.visitHistory.size() - 1 ? "," : "")));
                }
                json.append("    ]\n");
                
                json.append("  }").append(i < visitors.size() - 1 ? ",\n" : "\n");
            }
            json.append("]");
            writer.write(json.toString());
            // also write alarm file or state if necessary
        } catch (IOException e) {
            System.err.println("[Database Save Fail] " + e.getMessage());
        }
    }

    private synchronized void loadFromDatabase() {
        File file = new File(DATABASE_FILE);
        if (!file.exists()) {
            return;
        }

        try (BufferedReader reader = new BufferedReader(new FileReader(file, StandardCharsets.UTF_8))) {
            StringBuilder content = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                content.append(line).append("\n");
            }

            visitors.clear();
            // A robust, lightweight JSON parser to avoid libraries.
            String jsonStr = content.toString().trim();
            if (jsonStr.startsWith("[")) {
                jsonStr = jsonStr.substring(1, jsonStr.length() - 1).trim();
            }

            if (jsonStr.isEmpty()) {
                return;
            }

            // Splitting objects by checking balanced brackets
            List<String> objectBlocks = splitJsonObjects(jsonStr);
            for (String block : objectBlocks) {
                Visitor v = parseVisitorJsonBlock(block);
                if (v != null) {
                    visitors.add(v);
                }
            }
            logSystem("Successfully synced " + visitors.size() + " active profiles from local database file.");
        } catch (Exception e) {
            logSystem("[Database Sync Failure] Malformed database format. Booting with simulated network database.");
            System.err.println("JSON Parse Info: " + e.getMessage());
        }
    }

    private List<String> splitJsonObjects(String json) {
        List<String> blocks = new ArrayList<>();
        int braceCount = 0;
        StringBuilder currentBlock = new StringBuilder();
        boolean inQuotes = false;
        
        for (int i = 0; i < json.length(); i++) {
            char c = json.charAt(i);
            
            if (c == '\"' && (i == 0 || json.charAt(i - 1) != '\\')) {
                inQuotes = !inQuotes;
            }

            if (!inQuotes) {
                if (c == '{') {
                    braceCount++;
                }
            }

            if (braceCount > 0) {
                currentBlock.append(c);
            }

            if (!inQuotes) {
                if (c == '}') {
                    braceCount--;
                    if (braceCount == 0) {
                        blocks.add(currentBlock.toString());
                        currentBlock = new StringBuilder();
                    }
                }
            }
        }
        return blocks;
    }

    private Visitor parseVisitorJsonBlock(String block) {
        Visitor v = new Visitor();
        v.id = getJsonStringValue(block, "id");
        v.name = getJsonStringValue(block, "name");
        v.company = getJsonStringValue(block, "company");
        v.contact = getJsonStringValue(block, "contact");
        v.purpose = getJsonStringValue(block, "purpose");
        v.department = getJsonStringValue(block, "department");
        v.hostName = getJsonStringValue(block, "hostName");
        v.checkInTime = getJsonStringValue(block, "checkInTime");
        v.checkOutTime = getJsonStringValue(block, "checkOutTime");
        v.status = getJsonStringValue(block, "status");
        v.badgeColor = getJsonStringValue(block, "badgeColor");
        
        try {
            v.riskScore = Integer.parseInt(getJsonRawValue(block, "riskScore"));
        } catch (Exception e) {
            v.riskScore = 15;
        }

        v.riskAssessment = getJsonStringValue(block, "riskAssessment");
        v.clearanceLevel = getJsonStringValue(block, "clearanceLevel");
        v.avatarSeed = getJsonStringValue(block, "avatarSeed");
        v.securityProtocol = getJsonStringValue(block, "securityProtocol");

        // Parse simple string array "visitHistory"
        int historyStart = block.indexOf("\"visitHistory\"");
        if (historyStart != -1) {
            int arrayStart = block.indexOf("[", historyStart);
            int arrayEnd = block.indexOf("]", arrayStart);
            if (arrayStart != -1 && arrayEnd != -1) {
                String arrayContent = block.substring(arrayStart + 1, arrayEnd);
                String[] items = arrayContent.split(",");
                for (String item : items) {
                    String trimmed = item.trim();
                    if (trimmed.startsWith("\"") && trimmed.endsWith("\"")) {
                        v.visitHistory.add(unescapeJson(trimmed.substring(1, trimmed.length() - 1)));
                    }
                }
            }
        }

        if (v.id == null || v.name == null) {
            return null;
        }
        return v;
    }

    private String getJsonStringValue(String block, String fieldName) {
        String raw = getJsonRawValue(block, fieldName);
        if (raw == null) return null;
        raw = raw.trim();
        if (raw.startsWith("\"") && raw.endsWith("\"")) {
            return unescapeJson(raw.substring(1, raw.length() - 1));
        }
        if (raw.equals("null")) {
            return "null";
        }
        return unescapeJson(raw);
    }

    private String getJsonRawValue(String block, String fieldName) {
        String pattern = "\"" + fieldName + "\"";
        int index = block.indexOf(pattern);
        if (index == -1) return null;
        
        int colon = block.indexOf(":", index + pattern.length());
        if (colon == -1) return null;
        
        // Find end value (either comma or closing bracket, while skipping string quotes)
        int end = -1;
        boolean inQuotes = false;
        for (int i = colon + 1; i < block.length(); i++) {
            char c = block.charAt(i);
            if (c == '\"' && block.charAt(i - 1) != '\\') {
                inQuotes = !inQuotes;
            }
            if (!inQuotes) {
                if (c == ',' || c == '\n' || c == '}') {
                    end = i;
                    break;
                }
            }
        }
        
        if (end == -1) {
            end = block.length();
        }
        
        return block.substring(colon + 1, end).trim();
    }

    private String escapeJson(String input) {
        if (input == null) return "";
        return input.replace("\\", "\\\\")
                    .replace("\"", "\\\"")
                    .replace("\n", "\\n")
                    .replace("\r", "\\r")
                    .replace("\t", "\\t");
    }

    private String unescapeJson(String input) {
        if (input == null) return "";
        return input.replace("\\\"", "\"")
                    .replace("\\\\", "\\")
                    .replace("\\n", "\n")
                    .replace("\\r", "\r")
                    .replace("\\t", "\t");
    }

    // Entry point for Java execution
    public static void main(String[] args) {
        VisitorManagementSystem system = new VisitorManagementSystem();
        system.runConsole();
    }
}
