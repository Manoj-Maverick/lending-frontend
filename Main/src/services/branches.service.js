import api from "api/client";
import ENDPOINTS from "api/endpoints";

export async function getBranchesList({
  page,
  limit,
  search,
  status,
  sortBy,
}) {
  const { data } = await api.get(ENDPOINTS.BRANCH_MANAGEMENT.list, {
    params: {
      page,
      limit,
      search: search || undefined,
      status,
      sortBy,
    },
  });
  return data;
}

export async function getBranchesOptions(branchId) {
  const { data } = await api.get(ENDPOINTS.BRANCHES.options, {
    params: branchId == null ? undefined : { branch: branchId },
  });
  return data;
}

export async function createBranch(payload) {
  const { data } = await api.post(ENDPOINTS.BRANCHES.create, payload);
  return data;
}

export async function updateBranch(id, payload) {
  const { data } = await api.put(ENDPOINTS.BRANCHES.update(id), payload);
  return data;
}
