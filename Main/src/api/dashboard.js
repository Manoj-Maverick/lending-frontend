import api from "api/client";

export async function fetchDashboardSummary(branchId) {
  const branch = branchId;
  try {
    const res = await api.get("/api/dashboard/summary", {
      params: { branch },
    });

    return res.data;
  } catch (error) {
    console.warn(
      "Failed to fetch dashboard data, using fallback:",
      error.message,
    );
  }
}
