export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
}

export interface Lender {
  id: string;
  name: string;
  contactEmail: string;
  contactName: string;
  billingAddress: string;
  dealerCount: number;
  avgPortfolioScore: number | null;
  ragDistribution: { Green: number; Amber: number; Red: number };
  ragThresholds: { green: number; amber: number };
  cssThresholds: { reward: number; oversight: number };
  status: string;
  createdDate: string;
  lastLogin: string;
  teamMembers: TeamMember[];
}

export const lenders: Lender[] = [
  {
    id: "l001",
    name: "Apex Motor Finance Ltd",
    contactEmail: "compliance@apexmotorfinance.co.uk",
    contactName: "Sarah Jenkins",
    billingAddress: "14 City Road, London, EC1V 2NX",
    dealerCount: 11,
    avgPortfolioScore: 66.5,
    ragDistribution: { Green: 4, Amber: 5, Red: 2 },
    ragThresholds: { green: 75, amber: 50 },
    cssThresholds: { reward: 75, oversight: 75 },
    status: "Active",
    createdDate: "2025-06-01",
    lastLogin: "2026-02-23T09:14:00",
    teamMembers: [
      { id: "u001", name: "Sarah Jenkins", email: "s.jenkins@apexmotorfinance.co.uk", role: "Admin", status: "Active", lastLogin: "2026-02-23T09:14:00" },
      { id: "u002", name: "Mark Davies", email: "m.davies@apexmotorfinance.co.uk", role: "Risk Manager", status: "Active", lastLogin: "2026-02-20T14:30:00" },
      { id: "u003", name: "Claire Foster", email: "c.foster@apexmotorfinance.co.uk", role: "Viewer", status: "Active", lastLogin: "2026-02-18T11:00:00" },
    ],
  },
  {
    id: "l002",
    name: "Meridian Vehicle Finance Ltd",
    contactEmail: "risk@meridianvf.co.uk",
    contactName: "James Whitaker",
    billingAddress: "Meridian House, Bristol, BS1 4QT",
    dealerCount: 8,
    avgPortfolioScore: 71.2,
    ragDistribution: { Green: 5, Amber: 2, Red: 1 },
    ragThresholds: { green: 75, amber: 50 },
    cssThresholds: { reward: 75, oversight: 75 },
    status: "Active",
    createdDate: "2025-07-15",
    lastLogin: "2026-02-22T15:45:00",
    teamMembers: [
      { id: "u004", name: "James Whitaker", email: "j.whitaker@meridianvf.co.uk", role: "Admin", status: "Active", lastLogin: "2026-02-22T15:45:00" },
      { id: "u005", name: "Priya Nair", email: "p.nair@meridianvf.co.uk", role: "Risk Manager", status: "Active", lastLogin: "2026-02-21T10:20:00" },
    ],
  },
  {
    id: "l003",
    name: "Sovereign Auto Credit Ltd",
    contactEmail: "admin@sovereignautocredit.co.uk",
    contactName: "Rachel Thomas",
    billingAddress: "The Exchange, Manchester, M2 7FB",
    dealerCount: 5,
    avgPortfolioScore: 58.4,
    ragDistribution: { Green: 1, Amber: 3, Red: 1 },
    ragThresholds: { green: 70, amber: 45 },
    cssThresholds: { reward: 75, oversight: 75 },
    status: "Active",
    createdDate: "2025-09-01",
    lastLogin: "2026-02-19T08:30:00",
    teamMembers: [
      { id: "u006", name: "Rachel Thomas", email: "r.thomas@sovereignautocredit.co.uk", role: "Admin", status: "Active", lastLogin: "2026-02-19T08:30:00" },
    ],
  },
  {
    id: "l004",
    name: "Paramount Motor Loans Ltd",
    contactEmail: "compliance@paramountloans.co.uk",
    contactName: "David Osei",
    billingAddress: "Paramount House, Leeds, LS1 2AB",
    dealerCount: 3,
    avgPortfolioScore: 82.3,
    ragDistribution: { Green: 3, Amber: 0, Red: 0 },
    ragThresholds: { green: 75, amber: 50 },
    cssThresholds: { reward: 75, oversight: 75 },
    status: "Active",
    createdDate: "2025-11-10",
    lastLogin: "2026-02-21T13:15:00",
    teamMembers: [
      { id: "u007", name: "David Osei", email: "d.osei@paramountloans.co.uk", role: "Admin", status: "Active", lastLogin: "2026-02-21T13:15:00" },
    ],
  },
  {
    id: "l005",
    name: "Castlegate Finance Ltd",
    contactEmail: "info@castlegatefinance.co.uk",
    contactName: "Laura Simmons",
    billingAddress: "16 Gate Street, Edinburgh, EH1 1LL",
    dealerCount: 0,
    avgPortfolioScore: null,
    ragDistribution: { Green: 0, Amber: 0, Red: 0 },
    ragThresholds: { green: 75, amber: 50 },
    cssThresholds: { reward: 75, oversight: 75 },
    status: "Inactive",
    createdDate: "2025-08-20",
    lastLogin: "2025-12-01T09:00:00",
    teamMembers: [
      { id: "u008", name: "Laura Simmons", email: "l.simmons@castlegatefinance.co.uk", role: "Admin", status: "Active", lastLogin: "2025-12-01T09:00:00" },
    ],
  },
];
