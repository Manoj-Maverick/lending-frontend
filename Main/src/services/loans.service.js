import api from "api/client";
import ENDPOINTS from "api/endpoints";

export async function getLoans(filters = {}) {
  const params = {
    status: filters.status,
    branch: filters.branch,
    search: filters.searchQuery,
    loanType: filters.loanType,
    page: filters.page,
    pageSize: filters.pageSize,
  };

  const { data } = await api.get(ENDPOINTS.LOANS.list, { params });
  return data;
}

export async function getLoanStats(branch) {
  const { data } = await api.get(ENDPOINTS.LOANS.stats, {
    params: { branch: branch ?? "all" },
  });
  return data?.data ?? data;
}

export async function createLoan(formData) {
  const { data } = await api.post(ENDPOINTS.LOANS.create, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function getLoanDetails(loanId) {
  const { data } = await api.get(ENDPOINTS.LOANS.detail(loanId));
  return data?.data ?? data;
}

export async function getLoanSchedule(loanId) {
  const { data } = await api.get(ENDPOINTS.LOANS.schedule(loanId));
  return data?.data ?? data;
}
