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
  clients: {
    all: ["clients"],
    lists: () => ["clients", "list"],
    list: (filters = {}) => ["clients", "list", filters],
    profile: (customerId) => ["clients", "profile", customerId],
    loans: (customerId) => ["clients", "loans", customerId],
    guarantors: (customerId) => ["clients", "guarantors", customerId],
  },
  loans: {
    all: ["loans"],
    lists: () => ["loans", "list"],
    list: (filters = {}) => ["loans", "list", filters],
    stats: (branchId) => ["loans", "stats", normalizeBranchId(branchId)],
    detail: (loanId) => ["loans", "detail", loanId],
    schedule: (loanId) => ["loans", "schedule", loanId],
  },
  staff: {
    all: ["staff"],
    lists: () => ["staff", "list"],
    list: (filters = {}) => ["staff", "list", filters],
  },
  TodaysCollection: {
    all: ["todaysCollection"],
    data: (startDate, endDate, branchId) => [
      "todaysCollection",
      startDate,
      endDate,
      normalizeBranchId(branchId),
    ],
  },
};
