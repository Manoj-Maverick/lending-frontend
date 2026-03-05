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
  },
  borrowers: {
    all: ["borrowers"],
    lists: () => ["borrowers", "list"],
    list: (filters = {}) => ["borrowers", "list", filters],
    detail: (borrowerId) => ["borrowers", "detail", borrowerId],
    profile: (borrowerId) => ["borrowers", "profile", borrowerId],
    loans: (borrowerId) => ["borrowers", "loans", borrowerId],
    guarantors: (borrowerId) => ["borrowers", "guarantors", borrowerId],
  },
  loans: {
    all: ["loans"],
    lists: () => ["loans", "list"],
    list: (filters = {}) => ["loans", "list", filters],
    stats: (branchId) => ["loans", "stats", normalizeBranchId(branchId)],
    detail: (loanId) => ["loans", "detail", loanId],
    schedule: (loanId) => ["loans", "schedule", loanId],
  },
  collections: {
    all: ["collections"],
    list: (filters = {}) => ["collections", "list", filters],
    detail: (id) => ["collections", "detail", id],
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

queryKeys.TodaysCollection = {
  all: queryKeys.collections.all,
  data: (startDate, endDate, branchId) => [
    "collections",
    "list",
    {
      start_date: startDate,
      end_date: endDate,
      branch_id: normalizeBranchId(branchId),
    },
  ],
};
