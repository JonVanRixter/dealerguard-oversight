export interface ManualReviewItem {
  id: string;
  dealerId: string;
  dealerName: string;
  lenderId: string;
  lenderName: string;
  auditId: string;
  checkName: string;
  reason: string;
  status: string;
  assignedTo: string | null;
  priority: string;
  slaDeadline: string;
  createdDate: string;
  evidenceFiles: string[];
  internalNotes: string;
  outcome: string | null;
}

export const manualReviewQueue: ManualReviewItem[] = [
  {
    id: "mrq001",
    dealerId: "d010",
    dealerName: "Summit Cars",
    lenderId: "l001",
    lenderName: "Apex Motor Finance Ltd",
    auditId: "ah010-3",
    checkName: "KYC & AML",
    reason: "Director name match on sanctions screening. Requires manual investigation before section can be passed or failed.",
    status: "In Progress",
    assignedTo: "Tom Griffiths",
    priority: "High",
    slaDeadline: "2026-02-24T09:00:00",
    createdDate: "2026-01-19",
    evidenceFiles: [],
    internalNotes: "Name match appears to be historical — same name, different DOB. Awaiting certified ID from dealer principal to confirm no connection.",
    outcome: null,
  },
  {
    id: "mrq002",
    dealerId: "d011",
    dealerName: "Horizon Motors",
    lenderId: "l001",
    lenderName: "Apex Motor Finance Ltd",
    auditId: "ah011-2",
    checkName: "FCA Authorization",
    reason: "FCA authorisation lapsed December 2025. Renewal application submitted but not yet confirmed by FCA register.",
    status: "Pending",
    assignedTo: null,
    priority: "High",
    slaDeadline: "2026-02-24T17:00:00",
    createdDate: "2026-02-12",
    evidenceFiles: ["FCA_Renewal_Application_Jan2026.pdf"],
    internalNotes: "",
    outcome: null,
  },
  {
    id: "mrq003",
    dealerId: "d009",
    dealerName: "Riverside Motors",
    lenderId: "l001",
    lenderName: "Apex Motor Finance Ltd",
    auditId: "ah009-2",
    checkName: "KYC & AML",
    reason: "Incomplete sanctions screening documentation submitted. Lender provided partial records only.",
    status: "Pending",
    assignedTo: null,
    priority: "Normal",
    slaDeadline: "2026-02-25T17:00:00",
    createdDate: "2026-01-30",
    evidenceFiles: ["Partial_Sanctions_Screen_Jan2026.pdf"],
    internalNotes: "",
    outcome: null,
  },
  {
    id: "mrq004",
    dealerId: "d007",
    dealerName: "Northgate Motors",
    lenderId: "l001",
    lenderName: "Apex Motor Finance Ltd",
    auditId: "ah007-2",
    checkName: "KYC & AML",
    reason: "Director has county court order linked to personal finances. Requires TCG assessment to determine materiality for FCA fitness and propriety.",
    status: "Pending",
    assignedTo: null,
    priority: "Normal",
    slaDeadline: "2026-02-26T17:00:00",
    createdDate: "2026-01-25",
    evidenceFiles: [],
    internalNotes: "",
    outcome: null,
  },
  {
    id: "mrq005",
    dealerId: "d005",
    dealerName: "Westfield Motors",
    lenderId: "l001",
    lenderName: "Apex Motor Finance Ltd",
    auditId: "ah005-3",
    checkName: "KYC & AML",
    reason: "One director has adverse media from 2021 relating to personal matter unconnected to business. TCG to assess relevance.",
    status: "Resolved",
    assignedTo: "Tom Griffiths",
    priority: "Normal",
    slaDeadline: "2026-02-10T17:00:00",
    createdDate: "2026-01-20",
    evidenceFiles: ["Director_Statement_Jan2026.pdf"],
    internalNotes: "Adverse media confirmed as historical personal matter, unrelated to regulated activities. No FCA fitness concern identified.",
    outcome: "Approve (Pass)",
  },
  {
    id: "mrq006",
    dealerId: "d003",
    dealerName: "Crown Motors",
    lenderId: "l001",
    lenderName: "Apex Motor Finance Ltd",
    auditId: "ah003-2",
    checkName: "Financial Risk",
    reason: "Historic CCJ discharged 2024. Lender requested TCG review to confirm impact on ongoing compliance position.",
    status: "Resolved",
    assignedTo: "Amara Osei",
    priority: "Normal",
    slaDeadline: "2026-01-20T17:00:00",
    createdDate: "2026-01-10",
    evidenceFiles: ["CCJ_Satisfaction_Certificate.pdf"],
    internalNotes: "CCJ confirmed as fully satisfied. Certificate of satisfaction provided. No ongoing financial risk concern.",
    outcome: "Approve (Pass)",
  },
];
