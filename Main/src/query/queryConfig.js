import { queryKeys } from "query/queryKeys";
import {
  getBranchComparison,
  getDashboardSummary,
  getDailyCollectionSummary,
  getTodayPayments,
} from "services/dashboard.service";
import {
  getBranchesList,
  getBranchesOptions,
} from "services/branches.service";
import {
  getBranchById,
  getBranchPerformance,
  getBranchTodayPayments,
} from "services/branchDetails.service";
import {
  getBorrowerById,
  getBorrowerGuarantors,
  getBorrowerLoans,
  getBorrowers,
  getBorrowerStats,
  getIsBlocked,
} from "services/borrowers.service";
import {
  getLoanDetails,
  getLoans,
  getLoanSchedule,
  getLoanStats,
} from "services/loans.service";

export const queryConfig = {
  dashboard: {
    summary: (branchId) => ({
      key: queryKeys.dashboard.summary(branchId),
      fn: () => getDashboardSummary(branchId),
      staleTime: 60 * 1000,
      cacheTime: 5 * 60 * 1000,
      prefetch: true,
    }),
    dailyCollectionSummary: (branchId) => ({
      key: queryKeys.dashboard.dailyCollectionSummary(branchId),
      fn: () => getDailyCollectionSummary(branchId),
      staleTime: 60 * 1000,
      cacheTime: 5 * 60 * 1000,
      prefetch: true,
    }),
    todayPayments: (branchId) => ({
      key: queryKeys.dashboard.todayPayments(branchId),
      fn: () => getTodayPayments(branchId),
      staleTime: 30 * 1000,
      cacheTime: 5 * 60 * 1000,
      refetchInterval: 30 * 1000,
      prefetch: true,
    }),
    branchComparison: {
      key: queryKeys.dashboard.branchComparison,
      fn: getBranchComparison,
      staleTime: 5 * 60 * 1000,
      cacheTime: 15 * 60 * 1000,
      prefetch: false,
    },
  },
  branches: {
    options: ({ branchId, enabled = true } = {}) => ({
      key: queryKeys.branches.options(branchId),
      fn: () => getBranchesOptions(branchId),
      staleTime: 10 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
      enabled,
      prefetch: false,
    }),
    list: (filters = {}) => ({
      key: queryKeys.branches.list(filters),
      fn: () => getBranchesList(filters),
      staleTime: 10 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
      keepPreviousData: true,
      prefetch: false,
    }),
    detail: (branchId) => ({
      key: queryKeys.branches.detail(branchId),
      fn: () => getBranchById(branchId),
      staleTime: 5 * 60 * 1000,
      cacheTime: 15 * 60 * 1000,
      enabled: !!branchId,
      prefetch: true,
    }),
    metrics: (branchId) => ({
      key: queryKeys.branches.metrics(branchId),
      fn: () => getBranchPerformance(branchId),
      staleTime: 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      enabled: !!branchId,
      prefetch: true,
    }),
    branchTodayPayments: (branchId) => ({
      key: queryKeys.branches.branchTodayPayments(branchId),
      fn: () => getBranchTodayPayments(branchId),
      staleTime: 30 * 1000,
      cacheTime: 5 * 60 * 1000,
      enabled: !!branchId,
      prefetch: false,
    }),
  },
  borrowers: {
    list: (filters = {}) => ({
      key: queryKeys.borrowers.list(filters),
      fn: () => getBorrowers(filters),
      staleTime: 60 * 1000,
      cacheTime: 5 * 60 * 1000,
      keepPreviousData: true,
      prefetch: false,
    }),
    stats: (branchId) => ({
      key: queryKeys.borrowers.stats(branchId),
      fn: () => getBorrowerStats({ branchId }),
      staleTime: 5 * 60 * 1000,
      cacheTime: 15 * 60 * 1000,
      prefetch: true,
    }),
    profile: (borrowerId) => ({
      key: queryKeys.borrowers.profile(borrowerId),
      fn: () => getBorrowerById(borrowerId),
      staleTime: 5 * 60 * 1000,
      cacheTime: 15 * 60 * 1000,
      enabled: !!borrowerId,
      prefetch: true,
    }),
    loans: (borrowerId) => ({
      key: queryKeys.borrowers.loans(borrowerId),
      fn: () => getBorrowerLoans(borrowerId),
      enabled: !!borrowerId,
      staleTime: 60 * 1000,
      cacheTime: 5 * 60 * 1000,
      prefetch: false,
    }),
    guarantors: (borrowerId) => ({
      key: queryKeys.borrowers.guarantors(borrowerId),
      fn: () => getBorrowerGuarantors(borrowerId),
      enabled: !!borrowerId,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      prefetch: false,
    }),
    isBlocked: (borrowerId) => ({
      key: queryKeys.borrowers.isBlocked(borrowerId),
      fn: () => getIsBlocked(borrowerId),
      enabled: !!borrowerId,
      staleTime: 60 * 1000,
      cacheTime: 5 * 60 * 1000,
      prefetch: true,
    }),
  },
  loans: {
    list: (filters = {}) => ({
      key: queryKeys.loans.list(filters),
      fn: () => getLoans(filters),
      staleTime: 30 * 1000,
      cacheTime: 5 * 60 * 1000,
      keepPreviousData: true,
      prefetch: false,
    }),
    stats: (branch) => ({
      key: queryKeys.loans.stats(branch),
      fn: () => getLoanStats(branch),
      staleTime: 60 * 1000,
      cacheTime: 5 * 60 * 1000,
      prefetch: true,
    }),
    details: (loanId) => ({
      key: queryKeys.loans.detail(loanId),
      fn: () => getLoanDetails(loanId),
      staleTime: 30 * 1000,
      cacheTime: 5 * 60 * 1000,
      enabled: !!loanId,
      prefetch: true,
    }),
    schedule: (loanId) => ({
      key: queryKeys.loans.schedule(loanId),
      fn: () => getLoanSchedule(loanId),
      staleTime: 30 * 1000,
      cacheTime: 5 * 60 * 1000,
      enabled: !!loanId,
      prefetch: false,
    }),
  },
};

