export const ENDPOINTS = {
  AUTH: {
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    me: "/api/auth/me",
  },
  CLIENTS: {
    list: "/api/clients-management/clients-list",
    create: "/api/clients/create",
    update: (clientId) => `/api/clients/${clientId}`,
    profile: (clientId) => `/api/clients/${clientId}/profile`,
    loans: (clientId) => `/api/clients/${clientId}/loans`,
    guarantors: (clientId) => `/api/clients/${clientId}/guarantors`,
  },
  LOANS: {
    list: "/api/loans-management/loans-list",
    stats: "/api/loans-management/stats",
    create: "/api/loans/create",
    detail: (loanId) => `/api/loans/${loanId}/details`,
    schedule: (loanId) => `/api/loans/${loanId}/schedule`,
  },
  PAYMENTS: {
    create: "/api/loans/record-payment",
  },
  COLLECTIONS: {
    list: "/api/today-collections",
  },
  DASHBOARD: {
    summary: "/api/dashboard/summary",
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
    customers: (branchId) => `/api/branch-details/customers/${branchId}`,
    weeklyLoanSummary: (branchId) =>
      `/api/branch-details/weekly-loan-summary/${branchId}`,
  },
  STAFF: {
    list: "/api/staffs-management/staffs-list",
  },
};

export default ENDPOINTS;
