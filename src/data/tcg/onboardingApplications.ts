export interface OnboardingSection {
  id: string;
  name: string;
  status: "Not Started" | "In Progress" | "Complete";
  result: "Pass" | "Fail" | "Pending" | null;
  score: number | null;
  notes: string;
}

export interface OnboardingApplication {
  id: string;
  applicationRef: string;
  companyName: string;
  companiesHouseNumber: string;
  tradingName: string;
  website: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  lenderId: string;
  initiatedBy: string;
  initiatedDate: string;
  status: "Draft" | "In Progress" | "Pending Approval" | "Approved" | "Rejected" | "Pending Info";
  submittedDate: string | null;
  approvedBy: string | null;
  approvedDate: string | null;
  rejectionReason: string | null;
  sections: OnboardingSection[];
}

export const onboardingApplications: OnboardingApplication[] = [
  {
    id: "app001",
    applicationRef: "APP-012-2026",
    companyName: "Hartley Motor Group Ltd",
    companiesHouseNumber: "11234567",
    tradingName: "Hartley Motors",
    website: "www.hartleymotors.co.uk",
    contactEmail: "finance@hartleymotors.co.uk",
    contactPhone: "01924 445 612",
    address: "Hartley Road, Wakefield, WF1 3LX",
    lenderId: "l001",
    initiatedBy: "Sarah Jenkins",
    initiatedDate: "2026-02-18",
    status: "In Progress",
    submittedDate: null,
    approvedBy: null,
    approvedDate: null,
    rejectionReason: null,
    sections: [
      { id: "s1", name: "Legal Status", status: "Complete", result: "Pass", score: 100, notes: "Company active. Directors verified." },
      { id: "s2", name: "FCA Authorization", status: "Complete", result: "Pass", score: 100, notes: "FCA ref 812345 confirmed." },
      { id: "s3", name: "Financial Risk", status: "Complete", result: "Pass", score: 78, notes: "Credit score 71/100. No CCJs." },
      { id: "s4", name: "KYC & AML", status: "In Progress", result: null, score: null, notes: "" },
      { id: "s5", name: "DBS Compliance", status: "Not Started", result: null, score: null, notes: "" },
      { id: "s6", name: "Training & Competence", status: "Not Started", result: null, score: null, notes: "" },
      { id: "s7", name: "Complaints Handling", status: "Not Started", result: null, score: null, notes: "" },
      { id: "s8", name: "Website & Marketing", status: "Not Started", result: null, score: null, notes: "" },
    ],
  },
  {
    id: "app002",
    applicationRef: "APP-013-2026",
    companyName: "Birchwood Cars Ltd",
    companiesHouseNumber: "12345890",
    tradingName: "Birchwood Automotive",
    website: "www.birchwoodcars.co.uk",
    contactEmail: "info@birchwoodcars.co.uk",
    contactPhone: "0161 889 4421",
    address: "Birchwood Lane, Stockport, SK4 2PL",
    lenderId: "l001",
    initiatedBy: "Mark Davies",
    initiatedDate: "2026-02-21",
    status: "Pending Approval",
    submittedDate: "2026-02-23",
    approvedBy: null,
    approvedDate: null,
    rejectionReason: null,
    sections: [
      { id: "s1", name: "Legal Status", status: "Complete", result: "Pass", score: 100, notes: "Fully active." },
      { id: "s2", name: "FCA Authorization", status: "Complete", result: "Pass", score: 100, notes: "FCA ref 798234." },
      { id: "s3", name: "Financial Risk", status: "Complete", result: "Pass", score: 72, notes: "No CCJs. Credit 67/100." },
      { id: "s4", name: "KYC & AML", status: "Complete", result: "Pass", score: 85, notes: "Sanctions clean, no PEPs." },
      { id: "s5", name: "DBS Compliance", status: "Complete", result: "Pass", score: 80, notes: "All certificates valid." },
      { id: "s6", name: "Training & Competence", status: "Complete", result: "Pass", score: 75, notes: "All F&I records present." },
      { id: "s7", name: "Complaints Handling", status: "Complete", result: "Pass", score: 80, notes: "No FOS complaints. Logs present." },
      { id: "s8", name: "Website & Marketing", status: "Complete", result: "Pass", score: 78, notes: "APR visible. Risk warnings in place." },
    ],
  },
];
