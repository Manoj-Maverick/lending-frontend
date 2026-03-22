import { queryKeys } from "query/queryKeys";

export const invalidateMap = {
  paymentAdded: ({ loanId, borrowerId } = {}) => [
    queryKeys.payments.all,
    queryKeys.loans.all,
    queryKeys.dashboard.all,
    queryKeys.collections.all,
    ...(loanId ? [queryKeys.loans.detail(loanId), queryKeys.loans.schedule(loanId)] : []),
    ...(borrowerId ? [queryKeys.borrowers.loans(borrowerId)] : []),
  ],
  borrowerCreated: [
    queryKeys.borrowers.all,
    queryKeys.dashboard.all,
  ],
  borrowerUpdated: ({ borrowerId } = {}) => [
    queryKeys.borrowers.all,
    ...(borrowerId
      ? [
          queryKeys.borrowers.profile(borrowerId),
          queryKeys.borrowers.isBlocked(borrowerId),
        ]
      : []),
  ],
  loanCreated: [
    queryKeys.loans.all,
    queryKeys.borrowers.all,
    queryKeys.dashboard.all,
  ],
  loanUpdated: ({ loanId, borrowerId } = {}) => [
    queryKeys.loans.all,
    queryKeys.borrowers.all,
    queryKeys.dashboard.all,
    queryKeys.collections.all,
    ...(loanId ? [queryKeys.loans.detail(loanId), queryKeys.loans.schedule(loanId)] : []),
    ...(borrowerId ? [queryKeys.borrowers.loans(borrowerId)] : []),
  ],
  branchCreated: [
    queryKeys.branches.lists(),
    queryKeys.branches.all,
    queryKeys.dashboard.all,
  ],
  branchUpdated: ({ branchId } = {}) => [
    queryKeys.branches.all,
    queryKeys.branches.lists(),
    queryKeys.dashboard.all,
    ...(branchId
      ? [
          queryKeys.branches.detail(branchId),
          queryKeys.branches.metrics(branchId),
          queryKeys.branches.staff(branchId),
          queryKeys.branches.customers(branchId),
          queryKeys.branches.branchTodayPayments(branchId),
        ]
      : []),
  ],
  settingsSaved: [queryKeys.settings.app()],
  usersUpdated: [queryKeys.auth.users()],
};

export const runInvalidation = (queryClient, keys = []) => {
  keys.forEach((queryKey) => {
    queryClient.invalidateQueries({ queryKey });
  });
};

export const getInvalidationKeys = (eventName, payload) => {
  const eventConfig = invalidateMap[eventName];

  if (typeof eventConfig === "function") {
    return eventConfig(payload);
  }

  return eventConfig || [];
};

