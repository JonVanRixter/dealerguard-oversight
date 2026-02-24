export interface DealerOnboarding {
  status: "Approved" | "Rejected" | "In Progress" | "Pending Approval";
  initiatedBy: string;
  initiatedDate: string;
  submittedDate: string | null;
  approvedBy: string | null;
  approvedDate: string | null;
  rejectionReason: string | null;
  applicationRef: string;
}

export interface Dealer {
  id: string;
  name: string;
  tradingAs: string;
  companiesHouseNumber: string;
  fcaNumber: string;
  address: string;
  principalName: string;
  principalEmail: string;
  lenderId: string;
  lenderName: string;
  status: string;
  ragStatus: "Green" | "Amber" | "Red";
  latestScore: number;
  lastAuditDate: string;
  nextAuditDue: string;
  onboardedDate: string;
  multiLender?: boolean;
  onboarding: DealerOnboarding;
}

const ob = (ref: string, by: string, initDate: string, subDate: string, appDate: string): DealerOnboarding => ({
  status: "Approved",
  initiatedBy: by,
  initiatedDate: initDate,
  submittedDate: subDate,
  approvedBy: by,
  approvedDate: appDate,
  rejectionReason: null,
  applicationRef: ref,
});

export const dealers: Dealer[] = [
  {
    id: "d001", name: "Blackmore Automotive Ltd", tradingAs: "Blackmore Cars",
    companiesHouseNumber: "12345678", fcaNumber: "123456",
    address: "1 High Street, London, E1 1AA",
    principalName: "John Blackmore", principalEmail: "j.blackmore@blackmorecars.co.uk",
    lenderId: "l001", lenderName: "Apex Motor Finance Ltd",
    status: "Active", ragStatus: "Green", latestScore: 88,
    lastAuditDate: "2026-01-15", nextAuditDue: "2026-04-15", onboardedDate: "2025-06-10",
    multiLender: true,
    onboarding: ob("APP-001-2025", "Sarah Jenkins", "2025-06-01", "2025-06-08", "2025-06-10"),
  },
  {
    id: "d002", name: "Elite Auto Group Ltd", tradingAs: "Elite Autos",
    companiesHouseNumber: "23456789", fcaNumber: "234567",
    address: "14 Park Lane, Birmingham, B1 2HQ",
    principalName: "Aisha Patel", principalEmail: "a.patel@eliteautos.co.uk",
    lenderId: "l001", lenderName: "Apex Motor Finance Ltd",
    status: "Active", ragStatus: "Green", latestScore: 81,
    lastAuditDate: "2026-01-20", nextAuditDue: "2026-04-20", onboardedDate: "2025-06-15",
    onboarding: ob("APP-002-2025", "Sarah Jenkins", "2025-06-05", "2025-06-12", "2025-06-15"),
  },
  {
    id: "d003", name: "Crown Motors Ltd", tradingAs: "Crown Motors",
    companiesHouseNumber: "34567890", fcaNumber: "345678",
    address: "7 King Street, Leeds, LS1 3AB",
    principalName: "Gary Thompson", principalEmail: "g.thompson@crownmotors.co.uk",
    lenderId: "l001", lenderName: "Apex Motor Finance Ltd",
    status: "Active", ragStatus: "Green", latestScore: 79,
    lastAuditDate: "2026-02-05", nextAuditDue: "2026-05-05", onboardedDate: "2025-07-01",
    onboarding: ob("APP-003-2025", "Mark Davies", "2025-06-20", "2025-06-28", "2025-07-01"),
  },
  {
    id: "d004", name: "Lakeside Prestige Cars Ltd", tradingAs: "Lakeside Prestige",
    companiesHouseNumber: "45678901", fcaNumber: "456789",
    address: "22 Lake Road, Windermere, LA23 1BJ",
    principalName: "Rebecca Shaw", principalEmail: "r.shaw@lakesideprestige.co.uk",
    lenderId: "l001", lenderName: "Apex Motor Finance Ltd",
    status: "Active", ragStatus: "Green", latestScore: 91,
    lastAuditDate: "2026-02-10", nextAuditDue: "2026-05-10", onboardedDate: "2025-07-20",
    onboarding: ob("APP-004-2025", "Sarah Jenkins", "2025-07-10", "2025-07-18", "2025-07-20"),
  },
  {
    id: "d005", name: "Westfield Motors Ltd", tradingAs: "Westfield Motors",
    companiesHouseNumber: "56789012", fcaNumber: "567890",
    address: "3 Westfield Way, Sheffield, S1 2GD",
    principalName: "Chris Barker", principalEmail: "c.barker@westfieldmotors.co.uk",
    lenderId: "l001", lenderName: "Apex Motor Finance Ltd",
    status: "Active", ragStatus: "Amber", latestScore: 63,
    lastAuditDate: "2026-01-10", nextAuditDue: "2026-04-10", onboardedDate: "2025-08-05",
    onboarding: ob("APP-005-2025", "Mark Davies", "2025-07-25", "2025-08-02", "2025-08-05"),
  },
  {
    id: "d006", name: "Valley Car Sales Ltd", tradingAs: "Valley Cars",
    companiesHouseNumber: "67890123", fcaNumber: "678901",
    address: "15 Valley Road, Cardiff, CF10 1AE",
    principalName: "Owen Griffiths", principalEmail: "o.griffiths@valleycars.co.uk",
    lenderId: "l001", lenderName: "Apex Motor Finance Ltd",
    status: "Active", ragStatus: "Amber", latestScore: 58,
    lastAuditDate: "2026-01-08", nextAuditDue: "2026-04-08", onboardedDate: "2025-08-10",
    onboarding: ob("APP-006-2025", "Sarah Jenkins", "2025-08-01", "2025-08-08", "2025-08-10"),
  },
  {
    id: "d007", name: "Northgate Autos Ltd", tradingAs: "Northgate Motors",
    companiesHouseNumber: "78901234", fcaNumber: "789012",
    address: "9 North Gate, Newcastle, NE1 4PA",
    principalName: "Steven Clarke", principalEmail: "s.clarke@northgatemotors.co.uk",
    lenderId: "l001", lenderName: "Apex Motor Finance Ltd",
    status: "Active", ragStatus: "Amber", latestScore: 55,
    lastAuditDate: "2026-01-25", nextAuditDue: "2026-04-25", onboardedDate: "2025-09-01",
    onboarding: ob("APP-007-2025", "Mark Davies", "2025-08-20", "2025-08-28", "2025-09-01"),
  },
  {
    id: "d008", name: "Pennine Autos Ltd", tradingAs: "Pennine Autos",
    companiesHouseNumber: "89012345", fcaNumber: "890123",
    address: "41 Pennine Drive, Huddersfield, HD1 2TP",
    principalName: "Diane Foster", principalEmail: "d.foster@pennineautos.co.uk",
    lenderId: "l001", lenderName: "Apex Motor Finance Ltd",
    status: "Active", ragStatus: "Amber", latestScore: 72,
    lastAuditDate: "2026-02-08", nextAuditDue: "2026-05-08", onboardedDate: "2025-09-15",
    onboarding: ob("APP-008-2025", "Sarah Jenkins", "2025-09-05", "2025-09-12", "2025-09-15"),
  },
  {
    id: "d009", name: "Riverside Motor Company Ltd", tradingAs: "Riverside Motors",
    companiesHouseNumber: "90123456", fcaNumber: "901234",
    address: "6 Riverside Close, Nottingham, NG1 5FT",
    principalName: "Hannah Lewis", principalEmail: "h.lewis@riversidemotors.co.uk",
    lenderId: "l001", lenderName: "Apex Motor Finance Ltd",
    status: "Active", ragStatus: "Amber", latestScore: 60,
    lastAuditDate: "2026-01-12", nextAuditDue: "2026-04-12", onboardedDate: "2025-10-01",
    onboarding: ob("APP-009-2025", "Mark Davies", "2025-09-20", "2025-09-28", "2025-10-01"),
  },
  {
    id: "d010", name: "Summit Cars Ltd", tradingAs: "Summit Cars",
    companiesHouseNumber: "01234567", fcaNumber: "012345",
    address: "18 Summit Road, Exeter, EX1 1QS",
    principalName: "Marcus Bell", principalEmail: "m.bell@summitcars.co.uk",
    lenderId: "l001", lenderName: "Apex Motor Finance Ltd",
    status: "Active", ragStatus: "Red", latestScore: 38,
    lastAuditDate: "2026-01-19", nextAuditDue: "2026-04-19", onboardedDate: "2025-10-20",
    onboarding: ob("APP-010-2025", "Sarah Jenkins", "2025-10-10", "2025-10-18", "2025-10-20"),
  },
  {
    id: "d011", name: "Horizon Motors Ltd", tradingAs: "Horizon Motors",
    companiesHouseNumber: "11234567", fcaNumber: "112345",
    address: "5 Horizon Park, Brighton, BN1 3FG",
    principalName: "Liam O'Brien", principalEmail: "l.obrien@horizonmotors.co.uk",
    lenderId: "l001", lenderName: "Apex Motor Finance Ltd",
    status: "Under Review", ragStatus: "Red", latestScore: 42,
    lastAuditDate: "2026-02-12", nextAuditDue: "2026-05-12", onboardedDate: "2025-11-01",
    onboarding: ob("APP-011-2025", "Mark Davies", "2025-10-22", "2025-10-30", "2025-11-01"),
  },
];

// POC: Hardcoded multi-lender data for d001
export const multiLenderData: Record<string, { lenderId: string; lenderName: string; score: number; ragStatus: string }[]> = {
  d001: [
    { lenderId: "l001", lenderName: "Apex Motor Finance Ltd", score: 88, ragStatus: "Green" },
    { lenderId: "l002", lenderName: "Meridian Vehicle Finance Ltd", score: 84, ragStatus: "Green" },
  ],
};
