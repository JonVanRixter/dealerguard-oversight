export interface DoNotDealEntry {
  id: string;
  entityName: string;
  entityType: string;
  companiesHouseNumber: string | null;
  reason: string;
  addedBy: string;
  dateAdded: string;
  visibleToAllLenders: boolean;
}

export const doNotDealList: DoNotDealEntry[] = [
  {
    id: "pdnd001",
    entityName: "Falcon Motor Finance Ltd",
    entityType: "Dealer",
    companiesHouseNumber: "09123456",
    reason: "Fraudulent activity — multiple fraudulent HP applications with falsified income data. FCA investigation ongoing.",
    addedBy: "Tom Griffiths (TCG)",
    dateAdded: "2025-08-14",
    visibleToAllLenders: true,
  },
  {
    id: "pdnd002",
    entityName: "Gregory P. Walsh",
    entityType: "Director",
    companiesHouseNumber: null,
    reason: "Director disqualification — linked to fraudulent activity at Falcon Motor Finance Ltd.",
    addedBy: "Tom Griffiths (TCG)",
    dateAdded: "2025-08-14",
    visibleToAllLenders: true,
  },
  {
    id: "pdnd003",
    entityName: "Apex Premium Cars Ltd",
    entityType: "Dealer",
    companiesHouseNumber: "10987654",
    reason: "Repeat audit failures across 3 cycles. FCA authorisation expired. Multiple FOS upheld complaints.",
    addedBy: "Amara Osei (TCG)",
    dateAdded: "2025-11-05",
    visibleToAllLenders: true,
  },
  {
    id: "pdnd004",
    entityName: "Derek T. Horne",
    entityType: "Director",
    companiesHouseNumber: null,
    reason: "Personal involvement in fraudulent GAP insurance claims at Apex Premium Cars Ltd. Referred to Action Fraud.",
    addedBy: "Amara Osei (TCG)",
    dateAdded: "2025-11-05",
    visibleToAllLenders: true,
  },
];
