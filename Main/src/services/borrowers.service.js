import api from "api/client";
import ENDPOINTS from "api/endpoints";

export async function getBorrowers(filters = {}) {
  const { data } = await api.get(ENDPOINTS.BORROWERS.list, { params: filters });
  return data;
}

export async function createBorrower(formData) {
  const { data } = await api.post(ENDPOINTS.BORROWERS.create, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function getBorrowerById(borrowerId) {
  const { data } = await api.get(ENDPOINTS.BORROWERS.profile(borrowerId));
  return data;
}

export async function getBorrowerLoans(borrowerId) {
  const { data } = await api.get(ENDPOINTS.BORROWERS.loans(borrowerId));
  if (data?.success === false) {
    throw new Error(data?.message || "Failed to fetch borrower loans");
  }
  return data?.data ?? data;
}

export async function getBorrowerGuarantors(borrowerId) {
  const { data } = await api.get(ENDPOINTS.BORROWERS.guarantors(borrowerId));
  if (data?.success === false) {
    throw new Error(data?.message || "Failed to fetch borrower guarantors");
  }
  return data?.data ?? data;
}

export async function updateBorrower(borrowerId, payload) {
  const { data } = await api.put(
    ENDPOINTS.BORROWERS.update(borrowerId),
    payload,
  );
  return data;
}
