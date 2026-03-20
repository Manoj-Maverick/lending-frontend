import api from "api/client";
import ENDPOINTS from "api/endpoints";

export async function getBranchById(branchId) {
  const { data } = await api.get(ENDPOINTS.BRANCH_DETAILS.detail(branchId));
  return data;
}

export async function getBranchPerformance(branchId) {
  const { data } = await api.get(
    ENDPOINTS.BRANCH_DETAILS.performance(branchId),
  );
  return data;
}

export async function getBranchStaff(branchId) {
  const { data } = await api.get(ENDPOINTS.BRANCH_DETAILS.staff(branchId));
  return data;
}

export async function getBranchCustomers({
  branchId,
  search = "",
  status = "all",
  sortKey = "name",
  sortDir = "asc",
  page = 1,
  pageSize = 5,
  blockStatus = "all",
}) {
  const { data } = await api.get(ENDPOINTS.BRANCH_DETAILS.borrowers(branchId), {
    params: {
      search,
      status,
      sortKey,
      sortDir,
      page,
      pageSize,
      blockStatus,
    },
  });
  return data;
}

export async function getWeeklyLoanSummary(branchId) {
  const { data } = await api.get(
    ENDPOINTS.BRANCH_DETAILS.weeklyLoanSummary(branchId),
  );
  return data;
}

export async function getBranchTodayPayments(branchId) {
  const { data } = await api.get(ENDPOINTS.BRANCH_DETAILS.branchTodayPayments, {
    params: {
      branch: branchId,
    },
  });
  return data;
}
