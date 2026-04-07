import api from "api/client";

export async function getStaffSalary(params = {}) {
  const { data } = await api.get("/api/staff-salary", {
    params: {
      branch_id: params.branch_id || undefined,
      role: params.role && params.role !== "all" ? params.role : undefined,
      employee_id: params.employee_id || undefined,
      month: params.month || undefined,
    },
  });

  return data;
}

export async function saveStaffSalary(payload) {
  const { data } = await api.post("/api/staff-salary", payload, {
    headers: { "Content-Type": "application/json" },
  });

  return data;
}
