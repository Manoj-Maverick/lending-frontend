import { getBranchComparison } from "services/dashboard.service";

export const ENDPOINTS = {
  AUTH: {
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    me: "/api/auth/me",
  },
  BORROWERS: {
    list: "/api/borrowers-management/borrowers-list",
    create: "/api/borrowers/create",
    update: (borrowerId) => `/api/borrowers/${borrowerId}`,
    profile: (borrowerId) => `/api/borrower-profile/${borrowerId}/profile`,
    loans: (borrowerId) => `/api/borrower-profile/${borrowerId}/loans`,
    guarantors: (borrowerId) =>
      `/api/borrower-profile/${borrowerId}/guarantors`,
    isBlocked: (borrowerId) => `/api/get-block-status/${borrowerId}/isBlocked`,
    stats: "/api/borrowers/stats",
  },
  LOANS: {
    list: "/api/loans-management/loans-list",
    stats: "/api/loans-management/stats",
    create: "/api/loans/create",
    detail: (loanId) => `/api/loans/${loanId}/details`,
    schedule: (loanId) => `/api/loans/${loanId}/schedule`,
    foreCloseLoan: (loanId) => `/api/loans/${loanId}/fore-close-loan`,
  },
  PAYMENTS: {
    create: "/api/loans/record-payment",
  },
  COLLECTIONS: {
    list: "/api/today-collections",
    overdueCount: "/api/collections/overdue-count",
    overdue: "/api/collections/overdue",
  },
  DASHBOARD: {
    summary: "/api/dashboard/summary",
    dailyCollectionSummary: "/api/dashboard/daily-collection-summary",
    todayPayments: "/api/dashboard/today-payments",
    BranchComparison: "/api/dashboard/branch-comparison",
  },
  SETTINGS: {
    app: "/api/settings",
  },
  USERS: {
    list: "/api/users",
    create: "/api/users/create",
    detail: (id) => `/api/users/${id}`,
  },
  BRANCH_MANAGEMENT: {
    list: "/api/branch-management/list",
  },
  BRANCHES: {
    options: "/api/branches",
    create: "/api/create-new-branch",
    update: (id) => `/api/update-branch/${id}`,
  },
  BRANCH_DETAILS: {
    detail: (branchId) => `/api/branch-details/${branchId}`,
    performance: (branchId) =>
      `/api/branch-details/performance-metrics/${branchId}`,
    staff: (branchId) => `/api/branch-details/staffList/${branchId}`,
    borrowers: (branchId) => `/api/branch-details/borrowers/${branchId}`,
    weeklyLoanSummary: (branchId) =>
      `/api/branch-details/weekly-loan-summary/${branchId}`,
    branchTodayPayments: "/api/branch-deatils/get-branch-today-payments",
  },
  STAFF: {
    list: "/api/staffs-management/staffs-list",
  },
};

export default ENDPOINTS;
