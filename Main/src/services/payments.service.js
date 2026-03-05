import api from "api/client";
import ENDPOINTS from "api/endpoints";

export async function createPayment(payload) {
  const { data } = await api.post(ENDPOINTS.PAYMENTS.create, payload);
  return data;
}
