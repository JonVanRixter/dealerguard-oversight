## TCG OVERSIGHT PANEL

### AUTH & NAVIGATION
- [ ] TCG login (tcg@thecomplianceguys.co.uk / TCGAdmin2026) → redirects to /tcg/dashboard
- [ ] Lender login → redirects to /dashboard (unchanged)
- [ ] TCG user cannot access /dashboard (lender routes)
- [ ] Lender user cannot access /tcg/* routes
- [ ] TCG sidebar shows all 8 navigation items
- [ ] Active sidebar item highlighted in yellow (#fcba09)
- [ ] User profile shows "TCG Operations" tag in yellow
- [ ] Lender filter dropdown in header defaults to "All Lenders"

### IMPERSONATION MODE
- [ ] "View As Lender" on Lender Detail → activates impersonation mode
- [ ] Impersonation banner shows lender name and "Exit Impersonation" link
- [ ] While impersonating → dealer views filter to that lender only
- [ ] While impersonating → all features are read-only (no edit buttons)
- [ ] "Exit Impersonation" → clears state, returns to full TCG view
- [ ] Impersonation banner disappears after exit

### TCG DASHBOARD
- [ ] Total Lenders KPI = 4 (active lenders only)
- [ ] Total Dealers KPI = 27
- [ ] Average Portfolio Score ≈ 69.6
- [ ] Pending Reviews = count of Pending/In Progress items
- [ ] Lender Activity Table shows all 5 lenders (including inactive)
- [ ] Inactive lender (Castlegate Finance) shows grey "Inactive" pill
- [ ] Clicking a lender row → navigates to /tcg/lenders/:id
- [ ] Activity feed shows Lender column correctly
- [ ] Manual Review Queue widget shows top 5 by SLA deadline
- [ ] Overdue SLA items show red colouring
- [ ] "View Full Queue" → navigates to /tcg/manual-review
- [ ] Onboarding Activity card shows per-lender counts
- [ ] Onboarding Activity shows "Oversight only" badge
- [ ] Onboarding Activity note reads "Dealer onboarding is managed entirely by the lender"
- [ ] Audit Review Queue shows "Audit Review" type pill on each item

### LENDER MANAGEMENT
- [ ] All 5 lenders display in /tcg/lenders
- [ ] "Onboard New Lender" → modal opens with correct fields
- [ ] Submit new lender → appended to list in state, toast shown
- [ ] Clicking lender → navigates to /tcg/lenders/:id
- [ ] Lender Detail shows tabs: Profile & Thresholds, Onboarding, Team, Activity
- [ ] Profile tab shows RAG & CSS thresholds
- [ ] Onboarding tab shows read-only view with "Read-only view" banner
- [ ] Onboarding tab shows applications for that lender
- [ ] No action buttons on Onboarding tab
- [ ] Activity log filters to correct lender
- [ ] "View As Lender" button → impersonation mode activates
- [ ] "Deactivate Lender" → confirmation modal
- [ ] Deactivate confirm → status changes to Inactive in state

### DEALER DIRECTORY (TCG)
- [ ] All 11 dealers show with Lender Name column
- [ ] Filter by lender works correctly
- [ ] Multi-Lender badge shows on Blackmore Automotive (d001)
- [ ] Clicking Multi-Lender badge → shows lenders modal
- [ ] Dealer row click → navigates to /tcg/dealers/:id

### TCG DEALER DETAIL
- [ ] Lender Information card displays at top
- [ ] Link to lender profile navigates to /tcg/lenders/:id
- [ ] Onboarding Record section (collapsible, defaults collapsed)
- [ ] Onboarding Record shows correct approval details and "Oversight only" badge
- [ ] Compliance Audit section expanded by default
- [ ] Compliance Audit shows "TCG Quality Assurance Active" badge
- [ ] TCG Internal Notes panel separate from dealer notes
- [ ] Internal notes labelled "not visible to lender"
- [ ] Manual Review banner shows for dealers with pending queue items
- [ ] "Go to Review Queue" on banner → navigates to /tcg/manual-review
- [ ] Cross-lender comparison card shows for d001 (Blackmore Automotive)
- [ ] Comparison card shows correct scores for both lenders

### MANUAL REVIEW QUEUE
- [ ] Page title is "Audit Review Queue"
- [ ] Description distinguishes audit reviews from onboarding
- [ ] All 6 queue items display (4 pending/in-progress, 2 resolved)
- [ ] "Audit Review" type pill on each row
- [ ] Default sort: soonest SLA first
- [ ] Overdue SLA items show red SLA badge
- [ ] Filter by Status "Pending" → shows 2 items
- [ ] Filter by Priority "High" → shows 2 items
- [ ] Clicking a row → opens Exception Detail modal
- [ ] Exception Detail modal shows "AUDIT REVIEW — TCG Action Required" banner
- [ ] Modal shows dealer summary, review reason, SLA, evidence files
- [ ] Assign To dropdown updates assignedTo in state
- [ ] "Approve (Pass)" → status → Resolved, toast shown
- [ ] "Flag (Fail)" → status → Resolved, toast shown
- [ ] "Request More Info" → toast shown
- [ ] Evidence Upload → filename added to evidenceFiles list in state
- [ ] Resolved items show green "Resolved" pill

### PLATFORM CONFIGURATION
- [ ] DND approval workflow with Pending Review status
- [ ] Lender-specific threshold note displayed
- [ ] Platform DND list shows entries
- [ ] "Add to Platform DND" → modal with justification field
- [ ] Submit → appended to list in state

### AUDIT TRAIL
- [ ] All 20 audit trail entries display
- [ ] Filter by Entity Type "Session" → shows login events only
- [ ] Filter by Lender → filters correctly
- [ ] Date range filter narrows results correctly
- [ ] Clicking a row → expands full Changes content

### REPORTS (TCG)
- [ ] Platform KPIs compute correctly from data
- [ ] KPI tiles link to source pages
- [ ] Lender dropdown populates from lenders data
- [ ] "Download Platform PDF" → toast shown
- [ ] "Download Lender Report" → toast shown

### QA HEALTH CHECK
- [ ] All 7 service cards display with correct status icons
- [ ] CreditSafe API shows red "Unavailable" status
- [ ] System Logs table shows all 10 entries

---

## ONBOARDING vs AUDIT SEPARATION

### LENDER — ONBOARDING
- [ ] /onboarding page exists as separate sidebar item between Dealers and Documents
- [ ] /dealers page no longer has "Add New Dealer" button
- [ ] /dealers shows "Active Portfolio" sub-header with link to /onboarding
- [ ] /onboarding shows two tabs: Active Applications and Approved Dealers
- [ ] Active Applications tab shows app001 (In Progress) and app002 (Pending Approval)
- [ ] app001 "Continue" button → opens onboarding workflow at next incomplete section
- [ ] Progress bar shows "3 of 8 sections complete" for app001
- [ ] Completed sections collapsed but expandable
- [ ] "Submit for Approval" button inactive until all 8 sections marked Complete
- [ ] app002 "Review & Decide" button → opens approval modal
- [ ] Approval modal shows all 8 section results and projected RAG
- [ ] "Approve — Add to Portfolio" → confirmation → dealer added to portfolio state
- [ ] "Reject" → requires rejection reason → status updated to Rejected
- [ ] "Request More Info" → toast shown, status updated to Pending Info
- [ ] Onboarding workflow shows info banner distinguishing it from audit
- [ ] No TCG approval step exists anywhere in lender onboarding flow

### TCG — ONBOARDING OVERSIGHT
- [ ] TCG Dashboard shows "Onboarding Activity" card with per-lender counts
- [ ] Card shows correct counts for In Progress, Pending Approval, Approved, Rejected
- [ ] Note below table reads "Dealer onboarding is managed entirely by the lender"
- [ ] Lender Detail has "Onboarding" tab showing applications for that lender
- [ ] Onboarding tab is fully read-only — no action buttons
- [ ] "Read-only view" banner shows on Onboarding tab

### TCG — AUDIT OVERSIGHT
- [ ] Audit Review Queue description distinguishes it from onboarding
- [ ] Exception Detail modal shows "AUDIT REVIEW — TCG Action Required" banner
- [ ] All queue items show "Audit Review" blue pill type tag
- [ ] TCG Dealer Detail shows two separate sections: Onboarding Record and Compliance Audit
- [ ] Onboarding Record section defaults to collapsed for approved dealers
- [ ] Onboarding Record shows correct approval details and is read-only
- [ ] Compliance Audit section expanded by default
- [ ] Compliance Audit section shows "TCG Quality Assurance Active" badge

### VISUAL CONSISTENCY
- [ ] Onboarding uses blue accent (#3b82f6) throughout both portals
- [ ] Audit uses purple accent (#3d1468) throughout both portals
- [ ] Clipboard icon used for all onboarding elements
- [ ] Magnifying glass icon used for all audit elements
- [ ] "Oversight only" badge shows on TCG onboarding views
- [ ] "TCG Quality Assurance Active" badge shows on audit review items
