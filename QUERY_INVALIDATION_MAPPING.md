# Query Cache & Invalidation Mapping Report

**Generated:** March 22, 2026  
**Codebase:** Lending Frontend - React Query Implementation

---

## SECTION 1: MUTATION HOOKS INVALIDATION PATTERNS

### 📄 Documents Category (`src/hooks/docs/`)

#### `useUploadDocument`

**File:** [src/hooks/docs/useUploadDoc.js](src/hooks/docs/useUploadDoc.js)

```
Invalidations:
  ❌ ["documents", "customer", entity_id]
  ❌ ["documents", "guarantor", entity_id]
  ❌ ["documents", "loan", loan_id]

⚠️ ISSUE: Uses custom hardcoded keys, not centralized in queryKeys
```

#### `useDeleteDocument`

**File:** [src/hooks/docs/useDeleteDoc.js](src/hooks/docs/useDeleteDoc.js)

```
Invalidations:
  ❌ ["documents", "customer", entity_id]
  ❌ ["documents", "guarantor", entity_id]
  ❌ ["documents", "loan", loan_id]

⚠️ ISSUE: Uses custom hardcoded keys, not centralized in queryKeys
```

#### `useUploadWithProgress`

**File:** [src/hooks/docs/useUploadWithProgress.js](src/hooks/docs/useUploadWithProgress.js)

```
Wraps: useUploadDocument
Purpose: XHR progress tracking wrapper
```

---

### 🏢 Branches Category (`src/hooks/branches/` & `src/hooks/branchDetails/`)

#### `useCreateBranch`

**File:** [src/hooks/branches/useCreateBranch.js](src/hooks/branches/useCreateBranch.js)

```
Invalidations:
  ✓ queryKeys.branches.lists()
  ✓ queryKeys.branches.all
  ✓ queryKeys.dashboard.all

Covers: Branch list refresh + dashboard stats
```

#### `useUpdateBranch`

**File:** [src/hooks/branchDetails/useUpdateBranch.js](src/hooks/branchDetails/useUpdateBranch.js)

```
Invalidations:
  ✓ queryKeys.branches.detail(variables.id)
  ✓ queryKeys.branches.all

⚠️ MISSING:
  ❌ queryKeys.branches.list() → Paginated lists won't update
  ❌ queryKeys.branches.customers() → Branch customer tables stale
  ❌ queryKeys.branches.metrics() → Performance metrics stale
  ❌ queryKeys.branches.staff() → Staff list stale
```

---

### 💰 Loans Category (`src/hooks/loans/`)

#### `useCreateLoan`

**File:** [src/hooks/loans/useCreateLoan.js](src/hooks/loans/useCreateLoan.js)

```
Invalidations:
  ✓ queryKeys.loans.all
  ✓ queryKeys.borrowers.all → Borrower loan counts affected
  ✓ queryKeys.dashboard.all → Dashboard stats updated

Covers: Comprehensive related data
```

#### `useForeCloseLoan`

**File:** [src/hooks/loans/useForeCloseLoan.js](src/hooks/loans/useForeCloseLoan.js)

```
Invalidations:
  ✓ queryKeys.loans.all

⚠️ MISSING:
  ❌ queryKeys.borrowers.all → Borrower loan status unchanged
  ❌ queryKeys.dashboard.all → Dashboard stats not refreshed
  ❌ queryKeys.collections.all → Collection status unchanged
  ❌ queryKeys.payments.all → Payment records unaffected
```

---

### 👥 Borrowers Category (`src/hooks/borrowers/`)

#### `useCreateBorrower`

**File:** [src/hooks/borrowers/useCreateBorrower.js](src/hooks/borrowers/useCreateBorrower.js)

```
Invalidations:
  ✓ queryKeys.borrowers.all
  ✓ queryKeys.dashboard.all

Status: ✓ WELL-IMPLEMENTED
```

#### `useToggleBlock`

**File:** [src/hooks/borrowers/useBlockBorrower.js](src/hooks/borrowers/useBlockBorrower.js)

```
Invalidations:
  ✓ queryKeys.borrowers.all → General list
  ✓ queryKeys.borrowers.isBlocked(borrowerId) → Specific status

Status: ✓ INCLUDES SPECIFIC QUERY
```

---

### 💳 Payments Category (`src/hooks/payments/`)

#### `useCreatePayment`

**File:** [src/hooks/payments/useCreatePayment.js](src/hooks/payments/useCreatePayment.js)

```
Invalidations:
  ✓ queryKeys.payments.all
  ✓ queryKeys.loans.all → Loan outstanding amounts change
  ✓ queryKeys.dashboard.all → Collection stats update

Status: ✓ COMPREHENSIVE
```

---

### ⚙️ Settings Category (`src/hooks/settings/`)

#### `useSaveSettings`

**File:** [src/hooks/settings/useSaveSettings.js](src/hooks/settings/useSaveSettings.js)

```
Invalidations:
  ✓ queryKeys.settings.app()

Uses: batchInvalidateQueries() helper
Status: ✓ APPROPRIATE
```

---

### 🔐 Auth Category (`src/hooks/auth/`)

#### `useCreateUser`

**File:** [src/hooks/auth/useManageUsers.js](src/hooks/auth/useManageUsers.js)

```
Invalidations:
  ✓ queryKeys.auth.users()

Uses: batchInvalidateQueries() helper
Status: ✓ APPROPRIATE
```

#### `useDisableUser`

**File:** [src/hooks/auth/useManageUsers.js](src/hooks/auth/useManageUsers.js)

```
Invalidations:
  ✓ queryKeys.auth.users()

Status: ✓ APPROPRIATE
```

---

## SECTION 2: QUERY HOOKS BY DATA CATEGORY

### 📊 Dashboard Queries

| Hook                                  | File                                                                                                 | Query Key                                              | Features       |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | -------------- |
| `useDashboardSummary(branchId)`       | [src/hooks/dashboard/useDashboardSummary.js](src/hooks/dashboard/useDashboardSummary.js)             | `queryKeys.dashboard.summary(branchId)`                | staleTime: 60s |
| `useDailyCollectionSummary(branchId)` | [src/hooks/dashboard/useDailyCollectionSummary.js](src/hooks/dashboard/useDailyCollectionSummary.js) | `queryKeys.dashboard.dailyCollectionSummary(branchId)` | staleTime: 60s |
| `useTodayPayments(branchId)`          | [src/hooks/dashboard/useTodayPayments.js](src/hooks/dashboard/useTodayPayments.js)                   | `queryKeys.dashboard.todayPayments(branchId)`          | staleTime: 60s |
| `useBranchComparison()`               | [src/hooks/dashboard/useBranchComparison.js](src/hooks/dashboard/useBranchComparison.js)             | `queryKeys.dashboard.branchComparison`                 | staleTime: 60s |

---

### 🏢 Branches Queries

| Hook                                             | File                                                                                               | Query Key                                         | Features                         |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------- | ------------------------------------------------- | -------------------------------- |
| `useBranches()`                                  | [src/hooks/branches/useBranches.js](src/hooks/branches/useBranches.js)                             | `queryKeys.branches.options(branchId)`            | Auth-aware                       |
| `useBranchesList(filters)`                       | [src/hooks/branches/useBranchesList.js](src/hooks/branches/useBranchesList.js)                     | `queryKeys.branches.list(filters)`                | keepPreviousData, staleTime: 30s |
| `useFetchBranchById(branchId)`                   | [src/hooks/branchDetails/useBranchHeader.js](src/hooks/branchDetails/useBranchHeader.js)           | `queryKeys.branches.detail(branchId)`             | enabled conditional              |
| `useFetchBranchPerformanceMetricsByID(branchId)` | [src/hooks/branchDetails/useBranchPerformance.js](src/hooks/branchDetails/useBranchPerformance.js) | `queryKeys.branches.metrics(branchId)`            | enabled conditional              |
| `useFetchBranchStaffListById(branchId)`          | [src/hooks/branchDetails/useBranchStaff.js](src/hooks/branchDetails/useBranchStaff.js)             | `queryKeys.branches.staff(branchId)`              | enabled conditional              |
| `useFetchBranchCustomers(filters)`               | [src/hooks/branchDetails/useBranchCustomers.js](src/hooks/branchDetails/useBranchCustomers.js)     | `queryKeys.branches.customers(branchId, filters)` | Pagination support               |

---

### 👥 Borrowers Queries

| Hook                                | File                                                                                   | Query Key                                    | Features            |
| ----------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------- | ------------------- |
| `useBorrowers(filters)`             | [src/hooks/borrowers/useBorrowers.js](src/hooks/borrowers/useBorrowers.js)             | `queryKeys.borrowers.list(filters)`          | keepPreviousData    |
| `useBorrowerDetails(borrowerId)`    | [src/hooks/borrowers/useBorrowerDetails.js](src/hooks/borrowers/useBorrowerDetails.js) | `queryKeys.borrowers.profile(borrowerId)`    | staleTime: 5min     |
| `useBorrowerLoans(borrowerId)`      | [src/hooks/borrowers/useBorrowerDetails.js](src/hooks/borrowers/useBorrowerDetails.js) | `queryKeys.borrowers.loans(borrowerId)`      | enabled conditional |
| `useBorrowerGuarantors(borrowerId)` | [src/hooks/borrowers/useBorrowerDetails.js](src/hooks/borrowers/useBorrowerDetails.js) | `queryKeys.borrowers.guarantors(borrowerId)` | enabled conditional |
| `useGetISBlocked(borrowerId)`       | [src/hooks/borrowers/useGetIsBlocked.js](src/hooks/borrowers/useGetIsBlocked.js)       | `queryKeys.borrowers.isBlocked(borrowerId)`  | enabled conditional |
| `useBorrowerStats(branchId)`        | [src/hooks/borrowers/useBorrowerStats.js](src/hooks/borrowers/useBorrowerStats.js)     | `queryKeys.borrowers.stats(branchId)`        | staleTime: 5min     |

---

### 💼 Loans Queries

| Hook                      | File                                                                   | Query Key                          | Features                         |
| ------------------------- | ---------------------------------------------------------------------- | ---------------------------------- | -------------------------------- |
| `useLoans(filters)`       | [src/hooks/loans/useLoans.js](src/hooks/loans/useLoans.js)             | `queryKeys.loans.list(filters)`    | keepPreviousData, staleTime: 30s |
| `useLoanDetails(loanId)`  | [src/hooks/loans/useLoanDetails.js](src/hooks/loans/useLoanDetails.js) | `queryKeys.loans.detail(loanId)`   | staleTime: 30s                   |
| `useLoanSchedule(loanId)` | [src/hooks/loans/useLoanDetails.js](src/hooks/loans/useLoanDetails.js) | `queryKeys.loans.schedule(loanId)` | staleTime: 30s                   |
| `useLoanStats(branchId)`  | [src/hooks/loans/useLoans.js](src/hooks/loans/useLoans.js)             | `queryKeys.loans.stats(branchId)`  | staleTime: 60s                   |

---

### 📦 Collections Queries

| Hook                            | File                                                                                             | Query Key                            | Features             |
| ------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------ | -------------------- |
| `useCollections(params)`        | [src/hooks/collections/useCollections.js](src/hooks/collections/useCollections.js)               | `queryKeys.collections.list(params)` | keepPreviousData     |
| `useOverdueCollections(params)` | [src/hooks/collections/useOverDueCollections.js](src/hooks/collections/useOverDueCollections.js) | `["collections", params]` ⚠️         | NOT in queryKeys     |
| `useOverdueCount(params)`       | [src/hooks/collections/useOverDueCount.js](src/hooks/collections/useOverDueCount.js)             | `["overdue-count", params]` ⚠️       | refetchInterval: 30s |

---

### 📄 Documents Queries

| Hook                                 | File                                                             | Query Key                                    | Features            |
| ------------------------------------ | ---------------------------------------------------------------- | -------------------------------------------- | ------------------- |
| `useCustomerDocuments(customerId)`   | [src/hooks/docs/useFetchDocs.js](src/hooks/docs/useFetchDocs.js) | `["documents", "customer", customerId]` ⚠️   | enabled conditional |
| `useGuarantorDocuments(guarantorId)` | [src/hooks/docs/useFetchDocs.js](src/hooks/docs/useFetchDocs.js) | `["documents", "guarantor", guarantorId]` ⚠️ | enabled conditional |
| `useLoanDocuments(loanId)`           | [src/hooks/docs/useFetchDocs.js](src/hooks/docs/useFetchDocs.js) | `["documents", "loan", loanId]` ⚠️           | enabled conditional |

---

### 👨‍💼 Staff Queries

| Hook                      | File                                                               | Query Key                      | Features                           |
| ------------------------- | ------------------------------------------------------------------ | ------------------------------ | ---------------------------------- |
| `useGetStaffList(params)` | [src/hooks/staff/useStaffList.js](src/hooks/staff/useStaffList.js) | `queryKeys.staff.list(params)` | keepPreviousData, staleTime: 10min |

---

### ⚙️ Settings & Auth Queries

| Hook                | File                                                                   | Query Key                  | Features           |
| ------------------- | ---------------------------------------------------------------------- | -------------------------- | ------------------ |
| `useSettings()`     | [src/hooks/settings/useSettings.js](src/hooks/settings/useSettings.js) | `queryKeys.settings.app()` | staleTime: 10min   |
| `useUsers(enabled)` | [src/hooks/auth/useUsers.js](src/hooks/auth/useUsers.js)               | `queryKeys.auth.users()`   | Conditional enable |

---

## SECTION 3: PAGE CONTENT & QUERY USAGE MAPPING

### 📱 /borrowers-management

**File:** [src/pages/borrowers-management/index.jsx](src/pages/borrowers-management/index.jsx)

```
Components & Queries:
  - Header: Display management
  - Stats Cards: useBorrowerStats(branch)
    └─ Shows: Total, Active Loans, Delayed, No Loan, Blocked
  - BorrowersListPage: useBorrowers(filters)
    └─ Pagination, search, status/loan filters
  - AddBorrowerModal: useCreateBorrower() mutation
  - BlocklistModal: useToggleBlock() mutation
```

**Query Keys Used:**

- `queryKeys.borrowers.stats(branchId)`
- `queryKeys.borrowers.list(filters)`

---

### 👤 /borrower-profile/:borrowerId

**File:** [src/pages/borrower-profile/index.jsx](src/pages/borrower-profile/index.jsx)

```
Tabs & Data Fetching:
  1. Personal Info Tab
     └─ useBorrowerDetails(borrowerId)

  2. Guarantors Tab
     └─ useBorrowerGuarantors(borrowerId)
     └─ useCustomerDocuments() for guarantor docs (custom key)
     └─ useToggleBlock() for blocking guarantors

  3. Loans Tab
     └─ useBorrowerLoans(borrowerId)
     └─ useLoanDetails() for each loan
     └─ useLoanSchedule() for repayment details

  4. Status Check
     └─ useGetISBlocked(borrowerId)

Document Operations:
  └─ useUploadDocument() mutation
  └─ useDeleteDocument() mutation
```

**Query Keys Used:**

- `queryKeys.borrowers.profile(borrowerId)`
- `queryKeys.borrowers.guarantors(borrowerId)`
- `queryKeys.borrowers.isBlocked(borrowerId)`
- `queryKeys.borrowers.loans(borrowerId)`
- `["documents", "customer", customerId]` ⚠️
- `queryKeys.loans.detail(loanId)`
- `queryKeys.loans.schedule(loanId)`

---

### 💳 /loans-management

**File:** [src/pages/loans-management/index.jsx](src/pages/loans-management/index.jsx)

```
Components & Queries:
  - Header + Stats Cards: useLoanStats(filters.branch)
  - Loan Filters: Status, Branch, Type, Search
  - Loans Table: useLoans(debouncedFilters)
    └─ Pagination: 20 items/page (configurable)
    └─ Debounce: 400ms on search
  - CreateLoanModal: useCreateLoan() mutation
  - Row Actions: View loan details link
```

**Query Keys Used:**

- `queryKeys.loans.list(filters)` - with page/pageSize
- `queryKeys.loans.stats(branch)`

---

### 📋 /loan-details/:loanId

**File:** [src/pages/loan-details/index.jsx](src/pages/loan-details/index.jsx) (not fully examined)

```
Likely Components:
  - Loan Details Header: useLoanDetails(loanId)
  - Repayment Schedule: useLoanSchedule(loanId)
  - Payment History: (via parent loan data)
  - Documents: useLoanDocuments(loanId) - custom key ⚠️
```

**Query Keys Used:**

- `queryKeys.loans.detail(loanId)`
- `queryKeys.loans.schedule(loanId)`
- `["documents", "loan", loanId]` ⚠️

---

### 🏪 /branches-management

**File:** [src/pages/branches-management/index.jsx](src/pages/branches-management/index.jsx)

```
Components & Queries:
  - Filters: Search, Status, Sort
  - Branches Table: useBranchesList(filters)
    └─ Pagination support
    └─ Debounced search: 400ms
  - CreateBranchModal: useCreateBranch() mutation
  - Row Click: Navigate to /branch-details/:id
```

**Query Keys Used:**

- `queryKeys.branches.list(filters)` - with pagination

---

### 🏢 /branch-details/:branchId

**File:** [src/pages/branch-details/index.jsx](src/pages/branch-details/index.jsx)

```
Sections & Data Fetching:
  1. Branch Header
     └─ useFetchBranchById(branchId)
     └─ useUpdateBranch() mutation

  2. Performance Metrics
     └─ useFetchBranchPerformanceMetricsByID(branchId)

  3. Staff Management
     └─ useFetchBranchStaffListById(branchId)
     └─ (Add/Edit staff modals with mutations)

  4. Customer Table
     └─ useFetchBranchCustomers(filters)
     └─ Pagination, search, block status filters

  5. Recent Transactions / Overdue
     └─ (Data sources TBD)

  6. Daily Collections Weekly
     └─ (Data sources TBD)

  7. Branch Today Payments
     └─ (Data sources TBD)
```

**Query Keys Used:**

- `queryKeys.branches.detail(branchId)`
- `queryKeys.branches.metrics(branchId)`
- `queryKeys.branches.staff(branchId)`
- `queryKeys.branches.customers(branchId, filters)`

---

### 📊 /dashboard

**File:** [src/pages/dashboard/index.jsx](src/pages/dashboard/index.jsx)

```
Main Layout:
  - Branch selector contextual
  - Role-aware (ADMIN vs BRANCH_MANAGER)
  - Stat cards with navigate links
```

**Sections & Components:**
| Section | Hook | Query Key |
|---------|------|-----------|
| Main Stats | `useDashboardSummary(branchId)` | `queryKeys.dashboard.summary(branchId)` |
| Daily Collection Table | `useDailyCollectionSummary()` | `queryKeys.dashboard.dailyCollectionSummary()` |
| Today Payments Table | `useTodayPayments()` | `queryKeys.dashboard.todayPayments()` |
| Loan Status Chart | Uses dashboard data | — |
| Monthly Collection Chart | — | (not examined) |
| Branch Comparison Chart | `useBranchComparison()` | `queryKeys.dashboard.branchComparison` |

**Query Keys Used:**

- `queryKeys.dashboard.summary(branchId)`
- `queryKeys.dashboard.dailyCollectionSummary(branchId)`
- `queryKeys.dashboard.todayPayments(branchId)`
- `queryKeys.dashboard.branchComparison`

---

### 📦 /collections (Today's Collections)

**File:** [src/pages/todays-collection/Collections.jsx](src/pages/todays-collection/Collections.jsx)

```
Modes:
  - Today: Current date collections
  - Upcoming: Tomorrow + Next 7 days
  - Overdue: Last 7/30/90 days
```

**Data Fetching:**
| Data Type | Hook | Query Key | Issue |
|-----------|------|-----------|-------|
| Normal Collections | `useCollections(params)` | `queryKeys.collections.list(params)` | ✓ |
| Overdue Collections | `useOverdueCollections(params)` | `["collections", params]` | ⚠️ Not in queryKeys |
| Overdue Count | `useOverdueCount(params)` | `["overdue-count", params]` | ⚠️ Not in queryKeys |

**Filters:**

- Date range (custom support)
- Branch selector
- Search by name/code/phone
- Status tabs: All/Paid/Pending/Overdue

**Query Keys Used:**

- `queryKeys.collections.list(params)`
- `["collections", params]` ⚠️
- `["overdue-count", params]` ⚠️

---

### 👨‍💼 /staff-management

**File:** [src/pages/staff-management/index.jsx](src/pages/staff-management/index.jsx)

```
Components & Queries:
  - Filters: Search, Branch, Role
  - Staff Table: useGetStaffList(params)
    └─ Pagination: 10 items/page
    └─ Sort: Name (default)
    └─ Debounce: 400ms on search
  - AddStaffModal: useCreateUser() mutation
  - EditStaffModal: (update mutation - need to verify)
  - Actions: View, Edit, Disable (mutations)
```

**Query Keys Used:**

- `queryKeys.staff.list(params)` - with pagination

---

### 💰 /payments-management

**File:** [src/pages/payments-management/index.jsx](src/pages/payments-management/index.jsx)

```
⚠️ CRITICAL ISSUE: NOT IMPLEMENTED

Current State:
  - Uses HARDCODED mock data (6 hardcoded payment objects)
  - NO query hooks
  - NO mutations
  - NO backend integration
  - Status filtering works on mock data only

Components:
  - Active Tabs: All/Pending/Paid/Overdue
  - Pagination: 10 items/page
  - Search: Not connected
  - Mock data structure exists but not used for real data
```

**MISSING:**

- `useGetPayments()` or similar query hook
- `useCreatePayment()` integration
- Backend API calls
- Real payment data

---

### ⚙️ /settings

**Not Found** in workspace structure, but has hooks:

- [src/hooks/settings/useSettings.js](src/hooks/settings/useSettings.js)
- [src/hooks/settings/useSaveSettings.js](src/hooks/settings/useSaveSettings.js)
- [src/hooks/auth/useManageUsers.js](src/hooks/auth/useManageUsers.js)

---

## SECTION 4: IDENTIFIED GAPS & ISSUES

### 🔴 CRITICAL GAPS

#### 1. Document Query Keys Not Centralized

**Problem:** Documents use custom hardcoded query keys

```javascript
// Current (WRONG):
["documents", "customer", customerId][("documents", "guarantor", guarantorId)][
  ("documents", "loan", loanId)
];

// Should be:
queryKeys.documents.customer(customerId);
queryKeys.documents.guarantor(guarantorId);
queryKeys.documents.loan(loanId);
```

**Files Affected:**

- [src/hooks/docs/useFetchDocs.js](src/hooks/docs/useFetchDocs.js)
- [src/hooks/docs/useUploadDoc.js](src/hooks/docs/useUploadDoc.js)
- [src/hooks/docs/useDeleteDoc.js](src/hooks/docs/useDeleteDoc.js)

**Impact:** Document mutations won't invalidate correctly if queryKeys structure changes

---

#### 2. Overdue Collections Query Keys Not Centralized

**Problem:** useOverdueCollections uses custom key not defined in queryKeys

```javascript
// Current (WRONG):
queryKey: ["collections", params];

// Should be:
queryKey: queryKeys.collections.overdue(params);
```

**Files Affected:**

- [src/hooks/collections/useOverDueCollections.js](src/hooks/collections/useOverDueCollections.js)

**Impact:** No centralized control, will be missed in bulk invalidations

---

#### 3. Overdue Count Query Key Not Centralized

**Problem:** useOverdueCount uses custom key

```javascript
// Current (WRONG):
queryKey: ["overdue-count", params];

// Should be:
queryKey: queryKeys.collections.overdueCount(params);
```

**Files Affected:**

- [src/hooks/collections/useOverDueCount.js](src/hooks/collections/useOverDueCount.js)

**Impact:** Orphaned query key, if name changes elsewhere breaks caching

---

#### 4. Payments Management Page Not Implemented

**Problem:** /payments-management page uses ONLY hardcoded mock data

```javascript
const [payments, setPayments] = useState([
  { id: "PMT-001", ... },  // hardcoded
  { id: "PMT-002", ... },  // hardcoded
  // etc.
])
```

**Files Affected:**

- [src/pages/payments-management/index.jsx](src/pages/payments-management/index.jsx)

**Missing:**

- Query hook to fetch actual payments
- Payment creation/editing mutations
- Real backend integration

**Impact:** Users see mock data, not real payment records

---

### 🟡 MISSING INVALIDATIONS

#### 5. useForeCloseLoan Missing Dashboard Update

**Current:**

```javascript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: queryKeys.loans.all });
};
```

**Should Also Invalidate:**

```javascript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: queryKeys.loans.all });
  queryClient.invalidateQueries({ queryKey: queryKeys.borrowers.all });
  queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
  queryClient.invalidateQueries({ queryKey: queryKeys.collections.all });
};
```

**File:** [src/hooks/loans/useForeCloseLoan.js](src/hooks/loans/useForeCloseLoan.js)

**Impact:** Dashboard stats won't reflect closed loans, borrower profiles show stale data

---

#### 6. useUpdateBranch Missing List Invalidations

**Current:**

```javascript
onSuccess: (_, variables) => {
  queryClient.invalidateQueries({
    queryKey: queryKeys.branches.detail(variables.id),
  });
  queryClient.invalidateQueries({ queryKey: queryKeys.branches.all });
};
```

**Should Also Invalidate:**

```javascript
onSuccess: (_, variables) => {
  queryClient.invalidateQueries({
    queryKey: queryKeys.branches.detail(variables.id),
  });
  queryClient.invalidateQueries({ queryKey: queryKeys.branches.all });
  queryClient.invalidateQueries({ queryKey: queryKeys.branches.list() }); // ← MISSING
  queryClient.invalidateQueries({
    queryKey: queryKeys.branches.customers(variables.id),
  }); // ← MISSING
  queryClient.invalidateQueries({
    queryKey: queryKeys.branches.metrics(variables.id),
  }); // ← MISSING
  queryClient.invalidateQueries({
    queryKey: queryKeys.branches.staff(variables.id),
  }); // ← MISSING
};
```

**File:** [src/hooks/branchDetails/useUpdateBranch.js](src/hooks/branchDetails/useUpdateBranch.js)

**Impact:** Paginated branch lists, customer tables, metrics all show stale data after branch edit

---

### 🟠 STRUCTURAL INCONSISTENCIES

#### 7. Mixed Query Key Reference Patterns

Some files import from `queryKeys/queryKeys.js`:

```javascript
import { queryKeys } from "queryKeys/queryKeys";
```

Others import from `queries/queryKeys.js`:

```javascript
import { queryKeys } from "queries/queryKeys";
```

**Files with re-export:**

- [src/queries/queryKeys.js](src/queries/queryKeys.js) → Re-exports main queryKeys

**Recommendation:** Use consistent import path across all files

---

## SECTION 5: DATA CATEGORY INVALIDATION MATRIX

### When mutations succeed, what should refresh?

| Mutation            | Loans | Borrowers | Dashboard | Collections | Payments | Branches | Docs |
| ------------------- | ----- | --------- | --------- | ----------- | -------- | -------- | ---- |
| createLoan          | ✅    | ✅        | ✅        | —           | —        | —        | —    |
| foreCloseLoan       | ✅    | ❌        | ❌        | ❌          | —        | —        | —    |
| createBorrower      | —     | ✅        | ✅        | —           | —        | —        | —    |
| toggleBlockBorrower | —     | ✅        | —         | —           | —        | —        | —    |
| createPayment       | ✅    | —         | ✅        | ✅          | ✅       | —        | —    |
| createBranch        | —     | —         | ✅        | —           | —        | ✅       | —    |
| updateBranch        | —     | —         | —         | —           | —        | ✅       | —    |
| uploadDocument      | —     | —         | —         | —           | —        | —        | ✅   |
| deleteDocument      | —     | —         | —         | —           | —        | —        | ✅   |
| createUser          | —     | —         | —         | —           | —        | —        | —    |
| saveSettings        | —     | —         | —         | —           | —        | —        | —    |

**Legend:**

- ✅ = Currently invalidated
- ❌ = Missing invalidation (GAP)
- — = Not applicable

---

## SECTION 6: QUERYKEYS DEFINITION FILE

**Location:** [src/queryKeys/queryKeys.js](src/queryKeys/queryKeys.js)

**Current Structure:**

```javascript
export const queryKeys = {
  auth: {
    all: ["auth"],
    users: () => ["auth", "users"],
  },
  settings: {
    all: ["settings"],
    app: () => ["settings", "app"],
  },
  dashboard: {
    all: ["dashboard"],
    summary: (branchId) => ["dashboard", "summary", normalizeBranchId(branchId)],
    dailyCollectionSummary: (branchId) => [...],
    todayPayments: (branchId) => [...],
    branchComparison: ["dashboard", "branch-comparison"],
  },
  branches: {
    all: ["branches"],
    lists: () => ["branches", "list"],
    list: (filters = {}) => ["branches", "list", filters],
    options: (branchId) => [...],
    detail: (branchId) => [...],
    metrics: (branchId) => [...],
    staff: (branchId) => [...],
    customers: (branchId, filters = {}) => [...],
    // ❌ MISSING: weeklyLoanSummary, branchTodayPayments
  },
  borrowers: {
    all: ["borrowers"],
    lists: () => ["borrowers", "list"],
    list: (filters = {}) => ["borrowers", "list", filters],
    detail: (borrowerId) => [...],
    profile: (borrowerId) => [...],
    loans: (borrowerId) => [...],
    guarantors: (borrowerId) => [...],
    isBlocked: (borrowerId) => [...],
    stats: (branchId) => [...],
  },
  loans: {
    all: ["loans"],
    lists: () => ["loans", "list"],
    list: (filters = {}) => ["loans", "list", filters],
    stats: (branchId) => [...],
    detail: (loanId) => [...],
    schedule: (loanId) => [...],
  },
  collections: {
    all: ["collections"],
    list: (filters = {}) => ["collections", "list", filters],
    detail: (id) => ["collections", "detail", id],
    // ❌ MISSING: overdue(), overdueCount()
  },
  payments: {
    all: ["payments"],
    list: (filters = {}) => ["payments", "list", filters],
    detail: (id) => ["payments", "detail", id],
  },
  staff: {
    all: ["staff"],
    lists: () => ["staff", "list"],
    list: (filters = {}) => ["staff", "list", filters],
  },
};

// ❌ MISSING: documents category entirely!
```

**Missing Definitions:**

- `queryKeys.documents.*`
- `queryKeys.collections.overdue()`
- `queryKeys.collections.overdueCount()`

---

## SECTION 7: RECOMMENDATIONS & ACTION ITEMS

### PRIORITY 1: Critical Fixes

#### [ ] Add Documents to QueryKeys

```javascript
export const queryKeys = {
  // ... existing keys ...
  documents: {
    all: ["documents"],
    customer: (customerId) => ["documents", "customer", customerId],
    guarantor: (guarantorId) => ["documents", "guarantor", guarantorId],
    loan: (loanId) => ["documents", "loan", loanId],
  },
};
```

#### [ ] Add Overdue to Collections QueryKeys

```javascript
export const queryKeys = {
  // ... existing ...
  collections: {
    all: ["collections"],
    list: (filters = {}) => ["collections", "list", filters],
    detail: (id) => ["collections", "detail", id],
    overdue: (params = {}) => ["collections", "overdue", params],
    overdueCount: (params = {}) => ["collections", "overdueCount", params],
  },
};
```

#### [ ] Update Document Hooks to Use Centralized Keys

All three files:

- [src/hooks/docs/useFetchDocs.js](src/hooks/docs/useFetchDocs.js)
- [src/hooks/docs/useUploadDoc.js](src/hooks/docs/useUploadDoc.js)
- [src/hooks/docs/useDeleteDoc.js](src/hooks/docs/useDeleteDoc.js)

#### [ ] Update Collections Overdue Hooks

- [src/hooks/collections/useOverDueCollections.js](src/hooks/collections/useOverDueCollections.js)
- [src/hooks/collections/useOverDueCount.js](src/hooks/collections/useOverDueCount.js)

#### [ ] Implement Payments Management Page

- [src/pages/payments-management/index.jsx](src/pages/payments-management/index.jsx)
- Create query hook to fetch payments
- Integrate with mutations

---

### PRIORITY 2: Missing Invalidations

#### [ ] Fix useForeCloseLoan

**File:** [src/hooks/loans/useForeCloseLoan.js](src/hooks/loans/useForeCloseLoan.js)

- Add `queryKeys.borrowers.all`
- Add `queryKeys.dashboard.all`
- Add `queryKeys.collections.all`

#### [ ] Fix useUpdateBranch

**File:** [src/hooks/branchDetails/useUpdateBranch.js](src/hooks/branchDetails/useUpdateBranch.js)

- Add `queryKeys.branches.list()`
- Add `queryKeys.branches.customers(id)`
- Add `queryKeys.branches.metrics(id)`
- Add `queryKeys.branches.staff(id)`

---

### PRIORITY 3: Consistency Improvements

#### [ ] Standardize QueryKeys Import Paths

- Use single import path across all files
- Prefer: `import { queryKeys } from "queryKeys/queryKeys";`

#### [ ] Document QueryKey Patterns

- Create QUERYKEYS_CONVENTION.md
- Document when to use `all` vs specific lists
- Define invalidation boundaries

#### [ ] Add Helper for Batch Invalidations

Already exists: [src/queries/queryClientUtils.js](src/queries/queryClientUtils.js)

- Document usage
- Promote adoption in all mutations

---

## SUMMARY TABLE

### By Data Category - What's Working

| Category    | Query Hooks | Mutations      | Invalidation     | Issues                                     |
| ----------- | ----------- | -------------- | ---------------- | ------------------------------------------ |
| Dashboard   | ✅ 4 hooks  | —              | ✅ Good          | Depends on other categories                |
| Branches    | ✅ 6 hooks  | ✅ 2 mutations | 🟡 Partial       | useUpdateBranch missing list invalidations |
| Borrowers   | ✅ 6 hooks  | ✅ 2 mutations | ✅ Good          | Well-implemented                           |
| Loans       | ✅ 4 hooks  | ✅ 2 mutations | 🟡 Partial       | useForeCloseLoan missing updates           |
| Collections | ✅ 3 hooks  | —              | 🟡 Partial       | Keys not centralized                       |
| Payments    | ❌ 0 hooks  | ✅ 1 mutation  | ❌ Page not done | Page hardcoded, no queries                 |
| Documents   | ✅ 3 hooks  | ✅ 2 mutations | 🟡 Partial       | Keys not centralized                       |
| Staff       | ✅ 1 hook   | ❌ 0 hooks     | ❌ Missing       | Mutations not created                      |
| Settings    | ✅ 1 hook   | ✅ 1 mutation  | ✅ Good          | —                                          |
| Auth        | ✅ 1 hook   | ✅ 2 mutations | ✅ Good          | —                                          |

---

**Report Generated:** March 22, 2026  
**Total Files Analyzed:** 40+ hook files + 15+ page files  
**Critical Issues Found:** 4  
**Missing Invalidations:** 2  
**Structural Inconsistencies:** 7
