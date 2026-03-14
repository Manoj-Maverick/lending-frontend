import api from "api/client";
import ENDPOINTS from "api/endpoints";

export async function getLoans(filters = {}) {
  const params = {
    status: filters.status,
    branch: filters.branch,
    search: filters.searchQuery,
    loanType: filters.loanType,
    page: filters.page,
    collectionDay: filters.collectionDay,
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

export async function foreCloseLoan(payload) {
  const { data } = await api.post(
    ENDPOINTS.LOANS.foreCloseLoan(payload.loan_id),
    {
      loan_id: payload.loan_id,
      paid_amount: payload.paid_amount,
      payment_mode: payload.payment_mode,
      reference_no: payload.reference_no || null,
    },
  );

  return data;
}
