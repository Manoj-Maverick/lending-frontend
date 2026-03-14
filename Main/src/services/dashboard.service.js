import api from "api/client";
import ENDPOINTS from "api/endpoints";

export async function getDashboardSummary(branchId) {
  const { data } = await api.get(ENDPOINTS.DASHBOARD.summary, {
    params: { branch: branchId },
  });
  return data;
}

export async function getDailyCollectionSummary(branchId) {
  const { data } = await api.get(ENDPOINTS.DASHBOARD.dailyCollectionSummary, {
    params: { branch: branchId },
  });
  return data;
}

export async function getTodayPayments(branchId) {
  const { data } = await api.get(ENDPOINTS.DASHBOARD.todayPayments, {
    params: { branch: branchId },
  });
  return data;
}

export async function getBranchComparison() {
  const { data } = await api.get(ENDPOINTS.DASHBOARD.BranchComparison);
  return data;
}
