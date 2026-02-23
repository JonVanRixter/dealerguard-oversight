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
- [ ] Critical Alerts = count of Pending alerts in alerts.json
- [ ] Lender Activity Table shows all 5 lenders (including inactive)
- [ ] Inactive lender (Castlegate Finance) shows grey "Inactive" pill
- [ ] Clicking a lender row → navigates to /tcg/lenders/:id
- [ ] Activity feed shows Lender column correctly
- [ ] Activity feed filter by lender works
- [ ] Manual Review Queue widget shows top 5 by SLA deadline
- [ ] Overdue SLA items show red colouring
- [ ] "View Full Queue" → navigates to /tcg/manual-review

### LENDER MANAGEMENT
- [ ] All 5 lenders display in /tcg/lenders
- [ ] "Onboard New Lender" → modal opens with correct fields
- [ ] Submit new lender → appended to list in state, toast shown
- [ ] Clicking lender → navigates to /tcg/lenders/:id
- [ ] Lender Detail shows correct profile, thresholds, team members
- [ ] Activity log on Lender Detail filters to correct lender
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
- [ ] TCG Internal Notes panel separate from dealer notes
- [ ] Internal notes labelled "not visible to lender"
- [ ] Manual Review banner shows for d010, d011, d009, d007 (have pending queue items)
- [ ] "Go to Review Queue" on banner → navigates to /tcg/manual-review
- [ ] Cross-lender comparison card shows for d001 (Blackmore Automotive)
- [ ] Comparison card shows correct scores for both lenders

### MANUAL REVIEW QUEUE
- [ ] All 6 queue items display (4 pending/in-progress, 2 resolved)
- [ ] Default sort: soonest SLA first
- [ ] Overdue SLA items (mrq001, mrq002) show red SLA badge
- [ ] Filter by Status "Pending" → shows 2 items
- [ ] Filter by Priority "High" → shows 2 items
- [ ] Clicking a row → opens Exception Detail modal
- [ ] Modal shows dealer summary, review reason, SLA, evidence files
- [ ] Assign To dropdown updates assignedTo in state
- [ ] "Approve (Pass)" → status → Resolved, toast shown
- [ ] "Flag (Fail)" → status → Resolved, toast shown
- [ ] "Request More Info" → toast shown
- [ ] Evidence Upload → filename added to evidenceFiles list in state
- [ ] Resolved items show green "Resolved" pill

### PLATFORM CONFIGURATION
- [ ] RAG threshold sliders show platform defaults
- [ ] Saving thresholds shows confirmation modal
- [ ] CSS thresholds editable for TCG, read-only for lenders
- [ ] Section weights sum to 100% — red warning if not
- [ ] Platform DND list shows 4 entries
- [ ] "Add to Platform DND" → modal with justification field
- [ ] Justification field required — form won't submit without it
- [ ] Submit → appended to list in state
- [ ] Remove button → confirmation modal with reason field

### AUDIT TRAIL
- [ ] All 20 audit trail entries display
- [ ] Filter by Entity Type "Session" → shows login events only
- [ ] Filter by Lender "Apex Motor Finance Ltd" → filters correctly
- [ ] Date range filter narrows results correctly
- [ ] Clicking a row → expands full Changes content
- [ ] Entity ID search for "d010" → shows all Summit Cars audit entries

### REPORTS (TCG)
- [ ] Platform KPIs compute correctly from data
- [ ] RAG distribution bar chart shows per-lender breakdown
- [ ] Lender dropdown populates from lenders.json
- [ ] Selecting a lender populates Lender Activity Report
- [ ] "Download Platform PDF" → toast shown
- [ ] "Download Lender Report" → toast shown

### QA HEALTH CHECK
- [ ] All 7 service cards display with correct status icons
- [ ] CreditSafe API shows red "Unavailable" status
- [ ] POC mode services show blue indicator
- [ ] System Logs table shows all 10 entries
- [ ] Filter by "Error" severity → shows log007 only
- [ ] Filter by "Warning" severity → shows correct subset
- [ ] Log message search works
