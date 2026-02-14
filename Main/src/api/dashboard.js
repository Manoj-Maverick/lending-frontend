export async function fetchDashboardSummary(branchId) {
  const branch = branchId;
  try {
    const res = await fetch(
      `http://localhost:3001/api/dashboard/summary?branch=${branch}`,
    );

    return res.json();
  } catch (error) {
    console.warn(
      "Failed to fetch dashboard data, using fallback:",
      error.message,
    );
  }
}
