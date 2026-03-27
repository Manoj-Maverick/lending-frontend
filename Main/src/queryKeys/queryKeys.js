const normalizeBranchId = (branchId) => branchId ?? "all";

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
    summary: (branchId) => [
      "dashboard",
      "summary",
      normalizeBranchId(branchId),
    ],
    dailyCollectionSummary: (branchId) => [
      "dashboard",
      "dailyCollectionSummary",
      normalizeBranchId(branchId),
    ],
    todayPayments: (branchId) => [
      "dashboard",
      "todayPayments",
      normalizeBranchId(branchId),
    ],
    branchComparison: ["dashboard", "branch-comparison"],
  },
  branches: {
    all: ["branches"],
    lists: () => ["branches", "list"],
    list: (filters = {}) => ["branches", "list", filters],
    options: (branchId) => ["branches", "options", normalizeBranchId(branchId)],
    detail: (branchId) => ["branches", "detail", branchId],
    metrics: (branchId) => ["branches", "metrics", branchId],
    staff: (branchId) => ["branches", "staff", branchId],
    customers: (branchId, filters = {}) => [
      "branches",
      "customers",
      branchId,
      filters,
    ],
    weeklyLoanSummary: (branchId) => [
      "branches",
      "weekly-loan-summary",
      branchId,
    ],
    branchTodayPayments: (branchId) => [
      "branches",
      "branch-today-payments",
      branchId,
    ],
  },
  borrowers: {
    all: ["borrowers"],
    lists: () => ["borrowers", "list"],
    list: (filters = {}) => ["borrowers", "list", filters],
    detail: (borrowerId) => ["borrowers", "detail", borrowerId],
    profile: (borrowerId) => ["borrowers", "profile", borrowerId],
    loans: (borrowerId) => ["borrowers", "loans", borrowerId],
    guarantors: (borrowerId) => ["borrowers", "guarantors", borrowerId],
    isBlocked: (borrowerId) => ["borrowers", "isblocked", borrowerId],
    stats: (branchId) => ["borrowers", "stats", branchId ?? "all"],
  },
  loans: {
    all: ["loans"],
    lists: () => ["loans", "list"],
    list: (filters = {}) => ["loans", "list", filters],
    stats: (branchId) => ["loans", "stats", normalizeBranchId(branchId)],
    pendingRequests: () => ["loans", "pending-requests"],
    detail: (loanId) => ["loans", "detail", loanId],
    schedule: (loanId) => ["loans", "schedule", loanId],
  },
  collections: {
    all: ["collections"],
    list: (filters = {}) => ["collections", "list", filters],
    detail: (id) => ["collections", "detail", id],
    overdue: (filters = {}) => ["collections", "overdue", filters],
    overdueCount: (filters = {}) => ["collections", "overdue-count", filters],
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
    detail: (staffId) => ["staff", "detail", staffId],
    attendance: (staffId, month) => ["staff", "attendance", staffId, month],
  },
  documents: {
    all: ["documents"],
    customer: (customerId) => ["documents", "customer", customerId],
    guarantor: (guarantorId) => ["documents", "guarantor", guarantorId],
    loan: (loanId) => ["documents", "loan", loanId],
    staff: (staffId) => ["documents", "staff", staffId],
  },
};
