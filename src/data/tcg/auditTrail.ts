export interface AuditTrailEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  lender: string;
  entityType: string;
  entityId: string;
  action: string;
  changes: string;
}

export const auditTrail: AuditTrailEntry[] = [
  { id: "at001", timestamp: "2026-02-23T12:14:00", user: "Sarah Jenkins", role: "Admin", lender: "Apex Motor Finance Ltd", entityType: "Alert", entityId: "al012", action: "Updated", changes: "status: Pending → Acknowledged" },
  { id: "at002", timestamp: "2026-02-23T09:10:00", user: "Tom Griffiths", role: "tcg_ops", lender: "Platform", entityType: "Review Queue", entityId: "mrq001", action: "Updated", changes: "status: Pending → In Progress; assignedTo: null → Tom Griffiths" },
  { id: "at003", timestamp: "2026-02-22T15:45:00", user: "James Whitaker", role: "Admin", lender: "Meridian Vehicle Finance Ltd", entityType: "Session", entityId: "u004", action: "Login", changes: "User logged in" },
  { id: "at004", timestamp: "2026-02-21T13:15:00", user: "David Osei", role: "Admin", lender: "Paramount Motor Loans Ltd", entityType: "Session", entityId: "u007", action: "Login", changes: "User logged in" },
  { id: "at005", timestamp: "2026-02-20T14:30:00", user: "Mark Davies", role: "Risk Manager", lender: "Apex Motor Finance Ltd", entityType: "Report", entityId: "portfolio-report-20260220", action: "Exported", changes: "PDF Portfolio Summary Report downloaded" },
  { id: "at006", timestamp: "2026-02-12T09:20:00", user: "Sarah Jenkins", role: "Admin", lender: "Apex Motor Finance Ltd", entityType: "Audit", entityId: "ah011-2", action: "Created", changes: "Re-audit triggered for Horizon Motors (d011). Reason: FCA lapse" },
  { id: "at007", timestamp: "2026-02-12T09:14:00", user: "Sarah Jenkins", role: "Admin", lender: "Apex Motor Finance Ltd", entityType: "Session", entityId: "u001", action: "Login", changes: "User logged in" },
  { id: "at008", timestamp: "2026-02-10T11:30:00", user: "Sarah Jenkins", role: "Admin", lender: "Apex Motor Finance Ltd", entityType: "Audit", entityId: "ah004-3", action: "Created", changes: "Audit completed for Lakeside Prestige (d004). Score: 91 (Green)" },
  { id: "at009", timestamp: "2026-02-10T11:45:00", user: "Amara Osei", role: "tcg_ops", lender: "Platform", entityType: "Review Queue", entityId: "mrq006", action: "Updated", changes: "status: In Progress → Resolved; outcome: Approve (Pass)" },
  { id: "at010", timestamp: "2026-02-08T14:05:00", user: "Sarah Jenkins", role: "Admin", lender: "Apex Motor Finance Ltd", entityType: "Audit", entityId: "ah008-2", action: "Created", changes: "Audit completed for Pennine Autos (d008). Score: 72 (Amber)" },
  { id: "at011", timestamp: "2026-02-05T10:00:00", user: "Mark Davies", role: "Risk Manager", lender: "Apex Motor Finance Ltd", entityType: "Audit", entityId: "ah003-2", action: "Created", changes: "Audit completed for Crown Motors (d003). Score: 79 (Green)" },
  { id: "at012", timestamp: "2026-02-01T16:30:00", user: "Sarah Jenkins", role: "Admin", lender: "Apex Motor Finance Ltd", entityType: "Document", entityId: "doc015", action: "Uploaded", changes: "DBS renewal initiated for Westfield Motors (d005)" },
  { id: "at013", timestamp: "2026-01-25T10:30:00", user: "Sarah Jenkins", role: "Admin", lender: "Apex Motor Finance Ltd", entityType: "Audit", entityId: "ah007-2", action: "Created", changes: "Audit completed for Northgate Motors (d007). Score: 55 (Amber)" },
  { id: "at014", timestamp: "2026-01-20T15:00:00", user: "Sarah Jenkins", role: "Admin", lender: "Apex Motor Finance Ltd", entityType: "Alert", entityId: "al003", action: "Created", changes: "Threshold breach alert generated — Westfield Motors Green → Amber" },
  { id: "at015", timestamp: "2026-01-18T09:15:00", user: "Sarah Jenkins", role: "Admin", lender: "Apex Motor Finance Ltd", entityType: "Alert", entityId: "al001", action: "Created", changes: "Threshold breach alert generated — Summit Cars Amber → Red" },
  { id: "at016", timestamp: "2026-01-15T08:55:00", user: "Tom Griffiths", role: "tcg_ops", lender: "Platform", entityType: "Session", entityId: "tcg-tom", action: "Login", changes: "TCG user logged in" },
  { id: "at017", timestamp: "2026-01-10T13:20:00", user: "Mark Davies", role: "Risk Manager", lender: "Apex Motor Finance Ltd", entityType: "Document", entityId: "doc013", action: "Uploaded", changes: "CPD Training Records 2025 uploaded for Lakeside Prestige (d004)" },
  { id: "at018", timestamp: "2025-12-10T09:00:00", user: "Tom Griffiths", role: "tcg_ops", lender: "Platform", entityType: "Lender", entityId: "l004", action: "Created", changes: "New lender onboarded: Paramount Motor Loans Ltd" },
  { id: "at019", timestamp: "2025-11-10T11:00:00", user: "Tom Griffiths", role: "tcg_ops", lender: "Platform", entityType: "Lender", entityId: "l003", action: "Updated", changes: "RAG thresholds updated for Sovereign Auto Credit Ltd. Green: 75→70, Amber: 50→45" },
  { id: "at020", timestamp: "2025-10-15T14:00:00", user: "Tom Griffiths", role: "tcg_ops", lender: "Platform", entityType: "DND", entityId: "dnd004", action: "Created", changes: "Apex Premium Cars Ltd added to Platform-Wide Do Not Deal list" },
];
