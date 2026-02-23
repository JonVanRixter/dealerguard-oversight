export interface PlatformLog {
  id: string;
  timestamp: string;
  severity: string;
  message: string;
  source: string;
}

export const platformLogs: PlatformLog[] = [
  { id: "log001", timestamp: "2026-02-23T12:01:00", severity: "Info", message: "Daily alert digest job completed successfully. 13 alerts dispatched.", source: "JobQueue" },
  { id: "log002", timestamp: "2026-02-23T09:00:00", severity: "Info", message: "Document expiry check completed. 21 documents flagged (11 expired, 10 expiring soon).", source: "ScheduledJob" },
  { id: "log003", timestamp: "2026-02-22T18:30:00", severity: "Warning", message: "PDF generation timeout for portfolio report (lender: l001). Retry succeeded on attempt 2.", source: "PDFService" },
  { id: "log004", timestamp: "2026-02-22T14:00:00", severity: "Info", message: "FCA Register API placeholder check completed — 0 live calls (POC mode).", source: "ExternalAPI" },
  { id: "log005", timestamp: "2026-02-21T11:15:00", severity: "Warning", message: "Failed login attempt: unknown@example.com (IP: 82.41.20.115). 2 attempts in 5 minutes.", source: "Auth" },
  { id: "log006", timestamp: "2026-02-20T09:00:00", severity: "Info", message: "Quarterly re-audit cron job triggered. 11 dealers queued for audit refresh.", source: "ScheduledJob" },
  { id: "log007", timestamp: "2026-02-19T16:45:00", severity: "Error", message: "CreditSafe API placeholder returned 503. Manual fallback applied for Financial Risk section.", source: "ExternalAPI" },
  { id: "log008", timestamp: "2026-02-18T10:00:00", severity: "Info", message: "Companies House API placeholder check completed — 0 live calls (POC mode).", source: "ExternalAPI" },
  { id: "log009", timestamp: "2026-02-17T08:30:00", severity: "Info", message: "Database backup completed successfully. Size: 412MB.", source: "Database" },
  { id: "log010", timestamp: "2026-02-15T14:20:00", severity: "Warning", message: "Manual Review Queue: 4 items approaching SLA deadline within 24 hours.", source: "SLAMonitor" },
];
