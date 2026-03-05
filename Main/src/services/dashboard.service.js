import api from "api/client";
import ENDPOINTS from "api/endpoints";

export async function getDashboardSummary(branchId) {
  const { data } = await api.get(ENDPOINTS.DASHBOARD.summary, {
    params: { branch: branchId },
  });
  return data;
}
