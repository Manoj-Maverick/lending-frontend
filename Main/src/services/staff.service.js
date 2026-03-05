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
