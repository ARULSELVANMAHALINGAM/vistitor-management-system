# Aegis Secure Visitor Control Deck

**Live Demo**: [visitor-management-system-plum-seven.vercel.app](https://visitor-management-system-plum-seven.vercel.app)

An enterprise-grade, high-security visitor management and threat assessment control deck. This project integrates a modern, highly polished React + Tailwind CSS web workstation with an underlying Express API backend and a compiled Java (JDK) security subsystem.

---

## 🎨 Design & Theme Enhancements

- **Dynamic Vector Identity**: Features `AegisLogo.tsx`, a bespoke procedural geometric shield icon designed using custom Tailwind CSS gradients and subtle pulse animations.
- **Deep Dark-Mode Integration**: Every system dashboard element, registration panel, terminal console, and data matrix is fully synchronized with systemic light/dark/hologram preferences.
- **Interactive Holographic Dossiers**: Dynamically showcases interactive, holographic badges, live ASCII badge generators, and biometric history records.

---

## 🏗️ System Architecture

The Aegis Security Mainframe is built as a synchronized, full-stack application:

1. **Frontend Workstation (React 19 + Tailwind CSS + Lucide Icons)**: 
   - A desktop-first, highly responsive administrative dashboard.
   - Provides live statistics, gate registries, and profile pre-registration.
   - Features a custom Aegis AI Chat terminal and a live subprocess virtual terminal window.
   - Integrates the procedurally animated `AegisLogo` component in login pages and diagnostic headers.
2. **Control Service API (Express + tsx)**:
   - Hosts REST endpoints to read and write records.
   - Interacts with local system environments to compile and spin up Java subprocesses.
   - Proxies cognitive screening queries to the server-side Gemini AI model.
3. **Security Subsystem Core (Java Core JVM)**:
   - Built inside `VisitorManagementSystem.java`.
   - Offers local database reading and writing capabilities, secure clearance level assessments, and custom holographic badge (ASCII) generators.
   - Can be run either interactively via standard input/output terminal within the React browser, or as a standalone backend console CLI.

---

## 📁 Directory Structure

```text
├── .env.example                 # Example environment configuration for API secrets
├── metadata.json                # Project configurations and permissions
├── package.json                 # Core NPM dependencies and full-stack scripts
├── server.ts                    # Express backend serving as API proxy and subprocess manager
├── VisitorManagementSystem.java # Enterprise Java visitor registration and ASCII badge core
├── visitor_db.json              # Synchronized JSON database file read by both Node and Java
├── src/
│   ├── App.tsx                  # Main layout entrypoint importing modular subcomponents
│   ├── main.tsx                 # React DOM mount point
│   ├── index.css                # Tailwind import and theme declarations
│   ├── types.ts                 # Shared global TypeScript types and interfaces
│   └── components/              # Modularized frontend component suite
│       ├── AegisLogo.tsx        # Bespoke procedural geometric vector logo with cyan-blue gradients
│       ├── AegisHeader.tsx      # System health diagnostics bar & notification banner with logo integration
│       ├── AegisStats.tsx       # Quick statistics bento grid metrics with theme optimization
│       ├── GateDirectoryMatrix.tsx # Database lists, search filters, check-in, check-out with dark-mode borders
│       ├── PreRegisterTerminal.tsx # New visitor profile initialization panel with enhanced input fields
│       ├── JavaDeckWorkstation.tsx # Java source viewer/editor and interactive JVM terminal
│       └── HolographicBadgeDetail.tsx # Selected dossiers, ASCII badge emission, and AI Chat
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18 or later
- **Java Development Kit (JDK)**: Standard `javac` and `java` commands must be available in your system path.

### Configuration

Copy `.env.example` to `.env` and configure your API keys (e.g., Gemini key for intelligent cognitive screening assessments):

```bash
cp .env.example .env
```

*Note: The application includes custom heuristic fallbacks to assess risk even if an API key is not supplied.*

### Installation

Install all required npm dependencies:

```bash
npm install
```

---

## 🛠️ Run & Build Scripts

Manage the entire project from a single directory using standard npm commands:

### Development Mode

To start the full-stack system in development (Express backend + hot-reloading Vite dev-server serving on port 3000):

```bash
npm run dev
```

### Production Build

To compile the entire React application into a static production build (`/dist`) and bundle the Express TypeScript server into an optimized, self-contained CommonJS file (`dist/server.cjs` via `esbuild`):

```bash
npm run build
```

### Start Production Server

To execute the compiled production build:

```bash
npm run start
```

---

## ☕ Standalone Java Console Mode

If you wish to run the underlying Aegis security subsystem directly through a native command-line shell without the web interface:

1. **Compile the class file**:
   ```bash
   javac VisitorManagementSystem.java
   ```
2. **Execute the compiled bytecode**:
   ```bash
   java VisitorManagementSystem
   ```

Any registrations, check-ins, or alarm triggers processed directly via the CLI will automatically synchronize with `visitor_db.json` and reflect in the web interface in real time!
