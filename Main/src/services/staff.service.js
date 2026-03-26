import api from "api/client";
import ENDPOINTS from "api/endpoints";

export async function getStaffList(params = {}) {
  const {
    search = "",
    branch = "all",
    role = "all",
    sortKey = "name",
    sortDir = "asc",
    page = 1,
    pageSize = 10,
  } = params;

  const { data } = await api.get(ENDPOINTS.STAFF.list, {
    params: {
      search,
      branch,
      role,
      sortKey,
      sortDir,
      page,
      pageSize,
    },
  });

  return data;
}

export async function createStaff(payload) {
  const { data } = await api.post(ENDPOINTS.STAFF.create, payload, {
    headers: { "Content-Type": "application/json" },
  });

  return data;
}

export async function getStaffDetail(id) {
  const { data } = await api.get(ENDPOINTS.STAFF.detail(id));
  return data;
}

export async function updateStaff(id, payload) {
  const { data } = await api.put(ENDPOINTS.STAFF.update(id), payload, {
    headers: { "Content-Type": "application/json" },
  });

  return data;
}

export async function deleteStaff(id) {
  const { data } = await api.delete(ENDPOINTS.STAFF.remove(id));
  return data;
}

export async function getStaffAttendance(id, month) {
  const { data } = await api.get(ENDPOINTS.STAFF.attendance(id), {
    params: month ? { month } : undefined,
  });
  return data;
}

export async function saveStaffAttendance(id, payload) {
  const { data } = await api.post(ENDPOINTS.STAFF.attendance(id), payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
}
