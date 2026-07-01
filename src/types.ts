export interface VisitHistoryItem {
  timestamp: string;
  action: string;
}

export type ClearanceLevel = "unclassified" | "restricted" | "secret" | "top-secret";
export type VisitorStatus = "registered" | "checked-in" | "checked-out";

export interface Visitor {
  id: string;
  name: string;
  contact: string;
  purpose: string;
  department: string;
  company: string;
  hostName: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: VisitorStatus;
  badgeColor: string;
  riskScore: number;
  riskAssessment: string;
  clearanceLevel: ClearanceLevel;
  avatarSeed: string;
  visitHistory: string[];
  securityProtocol: string;
  idProofNumber?: string;
  photoUrl?: string;
  ndaSigned?: boolean;
  ndaSignature?: string;
}

export interface SecurityStats {
  totalRegistered: number;
  currentlyCheckedIn: number;
  currentlyCheckedOut: number;
  averageRiskScore: number;
  topSector: string;
}

export interface JavaStatus {
  hasJava: boolean;
  hasJavac: boolean;
  javaVersion: string;
  javacVersion: string;
  environment: string;
}

export type UserRole = "admin" | "receptionist" | "employee";

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  department?: string;
  email?: string;
}

export interface Employee {
  id: string;
  name: string;
  department: string;
  email: string;
  contact: string;
  availability: boolean;
}

export interface Department {
  id: string;
  name: string;
  code: string;
}

export interface Appointment {
  id: string;
  visitorId: string;
  visitorName: string;
  company: string;
  department: string;
  employeeId: string;
  employeeName: string;
  dateTime: string;
  purpose: string;
  status: "pending" | "approved" | "rejected" | "checked-in" | "checked-out" | "cancelled";
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  category: "auth" | "visitor" | "appointment" | "employee" | "department" | "system" | "database";
  details: string;
}

export interface SystemNotification {
  id: string;
  timestamp: string;
  message: string;
  type: "info" | "warning" | "success" | "alert";
  read: boolean;
}

export interface SystemSettings {
  companyName: string;
  securityLevel: "high" | "standard" | "relaxed";
  autoCheckOutHours: number;
  themePreference: "light" | "dark" | "hologram";
  lastBackup?: string;
}

