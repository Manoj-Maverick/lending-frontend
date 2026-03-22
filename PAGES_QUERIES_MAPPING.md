# Pages & Queries Mapping

Complete analysis of all pages, their queries, data dependencies, and document categories.

---

## 1. BORROWER PAGES

### `/borrower-profile/:borrowerId`

**Tabs & Structure:**

- **Personal Info Tab**
- **Guarantors Tab**
- **Loans Tab**

**Queries Used:**

| Query Key              | Hook                     | Purpose                                              | Data                        |
| ---------------------- | ------------------------ | ---------------------------------------------------- | --------------------------- |
| `borrowers.isblocked`  | `useGetISBlocked`        | Check if borrower is blocked                         | `isBlocked: boolean`        |
| `borrowers.profile`    | `useBorrowerDetails`     | Get borrower details (name, contact, address, photo) | Borrower profile info       |
| `documents.customer`   | (within PersonalInfoTab) | Get customer documents                               | Document list for customer  |
| `borrowers.guarantors` | `useBorrowerGuarantors`  | Get guarantors list                                  | Array of guarantors         |
| `documents.guarantor`  | (within GuarantorsTab)   | Get guarantor documents                              | Document list per guarantor |
| `borrowers.loans`      | `useBorrowerLoans`       | Get borrower's loans                                 | Loans array with stats      |
| `documents.loan`       | (if shown)               | Get loan documents                                   | Document list per loan      |

**Documents Displayed:**

- **Customer Category**: In PersonalInfoTab (upload/download/delete customer documents)
- **Guarantor Category**: In GuarantorsTab (upload/download/delete per guarantor)
- **Loan Category**: Not displayed in current tabs

**Sub-components:**

- `PersonalInfoTab`: borrower details, photo, documents (category: `customer`)
- `GuarantorsTab`: guarantors list with documents (category: `guarantor`)
- `LoansTab`: loan accounts list

---

### `/borrowers-management`

**Main Component:** `BorrowersManagement`

**Queries Used:**

| Query Key         | Hook                                        | Purpose                                  | Data                                        |
| ----------------- | ------------------------------------------- | ---------------------------------------- | ------------------------------------------- |
| `borrowers.stats` | `useBorrowerStats`                          | Get borrower statistics by branch        | `{total, active, delayed, noLoan, blocked}` |
| `borrowers.list`  | `useBorrowers` (in BorrowersList component) | Get paginated borrower list with filters | Borrowers array with pagination             |

**Features:**

- **Stats Card Display**: Total Borrowers, Active Loans, Delayed, No Loan, Blocked
- **Borrower List Table**: Searchable, sortable, paginated
- **Data Shown**: Name, Code, Phone, Loan Status, Branch
- **No Documents Displayed**

**Sub-components:**

- `BorrowersListPage`: Uses `useBorrowers` hook with filters (status, branch, search, page, pageSize)
- `StatCard`: Display stats from `useBorrowerStats`

---

## 2. LOAN PAGES

### `/loans-management`

**Main Component:** `LoansManagement`

**Queries Used:**

| Query Key     | Hook           | Purpose                                 | Data                                                |
| ------------- | -------------- | --------------------------------------- | --------------------------------------------------- |
| `loans.list`  | `useLoans`     | Get paginated loan list with filters    | Loans array with pagination                         |
| `loans.stats` | `useLoanStats` | Get loan statistics for selected branch | `{totalLoans, activeLoans, disbursed, outstanding}` |

**Features:**

- **Stats Card Display**: Loan stats by branch
- **Loan List Table**: Filterable by status, branch, loan type, collection day
- **Pagination**: Page size selectable (20, 50, 100)
- **Search**: Debounced search query
- **No Documents Displayed**

**Sub-components:**

- `LoansTable`: Display loan list
- `LoanFilters`: Filter controls (status, branch, loan type, collection day, search)
- `CreateLoanModal`: Create new loan

---

### `/loan-details/:loanId`

**Main Component:** `LoanDetails`

**Tabs & Structure:**

- **Loan Info Tab**: Basic loan details
- **Payment Schedule Tab**: Installment schedule
- **Transaction History Tab**: Payment transactions
- **Documents Tab**: Loan documents

**Queries Used:**

| Query Key        | Hook              | Purpose               | Data                                         |
| ---------------- | ----------------- | --------------------- | -------------------------------------------- |
| `loans.detail`   | `useLoanDetails`  | Get loan full details | Loan info (amount, status, EMI, dates, etc.) |
| `loans.schedule` | `useLoanSchedule` | Get payment schedule  | Schedule array (due dates, amounts)          |
| `documents.loan` | (in DocumentsTab) | Get loan documents    | Documents for loan                           |

**Documents Displayed:**

- **Loan Category**: In DocumentsTab (upload/download/delete loan documents)

**Sub-components:**

- `LoanInfoTab`: Main loan details
- `PaymentScheduleTab`: Uses `useLoanSchedule` hook
- `TransactionHistoryTab`: Payment history
- `DocumentsTab`: Uses `documents.loan` query
- `QuickPaymentModal`: Uses `useLoanSchedule` + `useCreatePayment` mutation
- `ForeCloseModal`: Uses `useLoanSchedule` hook

---

## 3. BRANCH PAGES

### `/branches-management`

**Main Component:** `BranchesManagement`

**Queries Used:**

| Query Key       | Hook              | Purpose                                | Data                           |
| --------------- | ----------------- | -------------------------------------- | ------------------------------ |
| `branches.list` | `useBranchesList` | Get paginated branch list with filters | Branches array with pagination |

**Features:**

- **Branch Cards Display**: Search by name, filter by status, sort
- **Pagination**: 12 items per page
- **Search**: Debounced search (400ms)
- **Filters**: Status (all/active/inactive), Sort (A-Z/Z-A)
- **No Documents Displayed**

**Sub-components:**

- `BranchCard`: Individual branch card (clickable to branch-details)
- `FilterControls`: Search, status, sort
- `AddBranchModal`: Create new branch

---

### `/branch-details/:branchId`

**Main Component:** `BranchDetails`

**Sections & Queries:**

| Section               | Query Key                           | Hook                      | Purpose                                       | Data              |
| --------------------- | ----------------------------------- | ------------------------- | --------------------------------------------- | ----------------- |
| Branch Header         | `branches.detail`                   | `useFetchBranchById`      | Get branch info (name, manager, stats)        | Branch details    |
| Performance Metrics   | (mock data, no real query)          | -                         | Branch statistics                             | Stats display     |
| Weekly Collections    | `branches.weekly-loan-summary`      | `useGetWeeklyLoanSummary` | Weekly loan collection summary                | Weekly data       |
| Branch Customers      | `branches.customers`                | `useBranchClients`        | Get customer list for branch                  | Customer array    |
| Branch Today Payments | `branches.branch-today-payments`    | `useBranchTodayPayments`  | Get today's payments for branch               | Payment array     |
| Staff Management      | (via EditBranchModal)               | `useFetchBranchById`      | Staff list (embedded in branch data or modal) | Staff array       |
| Overdue Accounts      | (no specific query in current code) | -                         | Overdue accounts list                         | Overdue array     |
| Recent Transactions   | (mock data)                         | -                         | Recent transactions                           | Transaction array |

**Features:**

- **Branch Info**: Name, manager, location, status
- **Performance Stats**: Total clients, active loans, disbursed, outstanding, collection rate
- **Staff List**: Employees of branch
- **Customer Table**: All customers in branch
- **Daily Collections Chart**: Weekly collection data
- **Overdue Accounts**: List of overdue loans
- **Recent Transactions**: Payment/disbursement history
- **No Documents Displayed**

**Sub-components:**

- `BranchHeader`: Uses `useFetchBranchById` hook
- `PerformanceMetrics`: Display stats
- `StaffManagement`: Staff list
- `RecentTransactions`: Transaction table
- `OverdueAccounts`: Overdue table
- `DailyCollectionWeekly`: Uses `useGetWeeklyLoanSummary` hook (chart)
- `BranchTodayPaymentsTable`: Uses `useBranchTodayPayments` hook
- `BranchCustomerTable`: Uses `useBranchClients` hook
- `EditBranchModal`: Uses `useFetchBranchById` + `useUpdateBranch` mutation

---

## 4. COLLECTION/DASHBOARD PAGES

### `/dashboard`

**Main Component:** `Dashboard`

**Queries Used:**

| Query Key                          | Hook                                                  | Purpose                    | Data                                                                        |
| ---------------------------------- | ----------------------------------------------------- | -------------------------- | --------------------------------------------------------------------------- |
| `dashboard.summary`                | `useDashboardSummary`                                 | Get main dashboard summary | Total branches, borrowers, loans, amounts, due/collected, weekly collection |
| `dashboard.dailyCollectionSummary` | `useDailyCollectionSummary` (in DailyCollectionTable) | Daily collection summary   | Daily collection data                                                       |
| `dashboard.todayPayments`          | `useTodayPayments` (in TodayPaymentsTable)            | Today's payments           | Payment list for today                                                      |
| `dashboard.branch-comparison`      | `useBranchComparison` (in BranchComparisonChart)      | Branch comparison metrics  | Multi-branch comparison data                                                |

**Features:**

- **Summary Stats**: Total Branches, Total Borrowers, Active Loans, Outstanding Amount, Today Due vs Collected, Weekly Collection
- **Tables**: Daily Collections, Today's Payments
- **Charts**: Loan Status Distribution, Monthly Collection Trend, Branch Comparison
- **Branch Selection**: Admin can select branch to filter dashboard
- **No Documents Displayed**

**Sub-components:**

- `StatCard`: Display stats from `useDashboardSummary`
- `DailyCollectionTable`: Uses `useDailyCollectionSummary` hook
- `TodayPaymentsTable`: Uses `useTodayPayments` hook
- `LoanStatusChart`: Pie/Donut chart of loan statuses
- `MonthlyCollectionChart`: Line/Bar chart of monthly collections
- `BranchComparisonChart`: Uses `useBranchComparison` hook

---

### `/collections` or `/todays-collection` (Collections.jsx)

**Main Component:** `Collections`

**Queries Used:**

| Query Key                   | Hook                    | Purpose                               | Data                                      |
| --------------------------- | ----------------------- | ------------------------------------- | ----------------------------------------- |
| `collections.list`          | `useCollections`        | Get collection records for date range | Collections array (today/upcoming/custom) |
| `collections.overdue`       | `useOverdueCollections` | Get overdue collection records        | Overdue collections array                 |
| `collections.overdue-count` | `useOverdueCount`       | Get count of overdue records          | Count number                              |

**Features:**

- **Date Scope**: Today, Tomorrow, Next 7 Days, Last 7/30/90 Days, Custom Date
- **Mode**: Normal collections or Overdue
- **Tabs**: All, Paid, Pending, Overdue
- **Search**: By borrower name, code, phone
- **Branch Filter**: Select specific branch
- **No Documents Displayed**
- **Contact Info**: Popup with borrower contact details

**Sub-components:**

- `CollectionDateScope`: Date range selector
- `CollectionFilters`: Branch, search filters
- `CollectionStats`: Summary stats (not using specific query)
- `CollectionTabs`: Tab navigation (All/Paid/Pending/Overdue)
- `CollectionTable`: Collections list table
- `ContactPopover`: Borrower contact popup

---

## QUERY KEY SUMMARY

### Most Used Queries

| Query                              | Used On Pages                                                        | Frequency |
| ---------------------------------- | -------------------------------------------------------------------- | --------- |
| `borrowers.profile`                | Borrower Profile (PersonalInfoTab)                                   | 1         |
| `borrowers.loans`                  | Borrower Profile (LoansTab)                                          | 1         |
| `borrowers.guarantors`             | Borrower Profile (GuarantorsTab)                                     | 1         |
| `borrowers.list`                   | Borrowers Management                                                 | 1         |
| `borrowers.stats`                  | Borrowers Management                                                 | 1         |
| `borrowers.isblocked`              | Borrower Profile                                                     | 1         |
| `loans.detail`                     | Loan Details                                                         | 1         |
| `loans.schedule`                   | Loan Details (PaymentScheduleTab, QuickPaymentModal, ForeCloseModal) | 3         |
| `loans.list`                       | Loans Management                                                     | 1         |
| `loans.stats`                      | Loans Management                                                     | 1         |
| `branches.list`                    | Branches Management                                                  | 1         |
| `branches.detail`                  | Branch Details (Header, EditModal)                                   | 2         |
| `branches.weekly-loan-summary`     | Branch Details (DailyCollectionWeekly)                               | 1         |
| `branches.branch-today-payments`   | Branch Details (BranchTodayPaymentsTable)                            | 1         |
| `branches.customers`               | Branch Details (BranchCustomerTable)                                 | 1         |
| `dashboard.summary`                | Dashboard                                                            | 1         |
| `dashboard.dailyCollectionSummary` | Dashboard (DailyCollectionTable)                                     | 1         |
| `dashboard.todayPayments`          | Dashboard (TodayPaymentsTable)                                       | 1         |
| `dashboard.branch-comparison`      | Dashboard (BranchComparisonChart)                                    | 1         |
| `collections.list`                 | Collections (normal collections)                                     | 1         |
| `collections.overdue`              | Collections (overdue mode)                                           | 1         |
| `collections.overdue-count`        | Collections                                                          | 1         |
| `documents.customer`               | Borrower Profile (PersonalInfoTab)                                   | 1         |
| `documents.guarantor`              | Borrower Profile (GuarantorsTab)                                     | 1         |
| `documents.loan`                   | Loan Details (DocumentsTab)                                          | 1         |

---

## DOCUMENT CATEGORY MATRIX

Shows which document categories are displayed on each page:

| Page                             | Customer Docs | Guarantor Docs | Loan Docs |
| -------------------------------- | ------------- | -------------- | --------- |
| Borrower Profile - Personal Info | ✅            | ❌             | ❌        |
| Borrower Profile - Guarantors    | ❌            | ✅             | ❌        |
| Borrower Profile - Loans         | ❌            | ❌             | ❌        |
| Borrowers Management             | ❌            | ❌             | ❌        |
| Loans Management                 | ❌            | ❌             | ❌        |
| Loan Details - Documents         | ❌            | ❌             | ✅        |
| Branches Management              | ❌            | ❌             | ❌        |
| Branch Details                   | ❌            | ❌             | ❌        |
| Dashboard                        | ❌            | ❌             | ❌        |
| Collections                      | ❌            | ❌             | ❌        |

---

## DATA ENTITY ASSOCIATIONS

### Borrowers Listed On:

- `/borrowers-management` → via `useBorrowers`
- `/branch-details/:branchId` → Branch Customers section via `useBranchClients`
- `/collections` → Collections table (borrower info)

### Loans Listed On:

- `/loans-management` → via `useLoans`
- `/borrower-profile/:borrowerId` → Loans Tab via `useBorrowerLoans`
- `/loan-details/:loanId` → Single loan details
- `/branch-details/:branchId` → Weekly Loan Summary chart

### Branches Listed On:

- `/branches-management` → via `useBranchesList`
- `/dashboard` → Statistics and Branch Comparison
- UIContext (global) → Branch selector for filtering other pages

### Collections Listed On:

- `/collections` → Main collections page (today's and overdue)
- `/dashboard` → Daily Collections table, Today Payments table

---

## MUTATIONS (Write Operations)

| Mutation                | Used On Pages                      | Query Invalidated                             |
| ----------------------- | ---------------------------------- | --------------------------------------------- |
| `useCreateBorrower`     | Borrowers Management (Add Modal)   | `borrowers.all`, `dashboard.all`              |
| `useCreateLoan`         | Loans Management, Borrower Profile | `loans.all`, `borrowers.all`, `dashboard.all` |
| `useCreatePayment`      | Loan Details (Quick Payment Modal) | `payments.all`, `loans.all`, `dashboard.all`  |
| `useCreateBranch`       | Branches Management (Add Modal)    | `branches.all`, `dashboard.all`               |
| `useUpdateBranch`       | Branch Details (Edit Modal)        | `branches.detail`                             |
| `useDeleteDocument`     | Borrower Profile, Loan Details     | Document-specific                             |
| `useUploadWithProgress` | Borrower Profile, Loan Details     | Document-specific                             |
| `useToggleBlock`        | Borrower Profile (Personal Info)   | borrower-specific                             |
