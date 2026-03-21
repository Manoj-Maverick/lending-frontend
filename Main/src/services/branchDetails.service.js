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
  blockStatus = "all",
  sortKey = "name",
  sortDir = "asc",
  page = 1,
  pageSize = 5,
}) {
  console.log("FINAL URL:", ENDPOINTS.BRANCH_DETAILS.borrowers(branchId));
  const { data } = await api.post(
    ENDPOINTS.BRANCH_DETAILS.borrowers(branchId),
    {
      branchId,
      search,
      status,
      blockStatus,
      sortKey,
      sortDir,
      page,
      pageSize,
    }
  );

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
